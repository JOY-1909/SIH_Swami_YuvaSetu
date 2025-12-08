"""
Internship application API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging
from pydantic import BaseModel

from app.api.deps import get_current_user
from app.models.user import User
from app.database import get_database
from app.database.multi_cluster import get_employer_database

router = APIRouter(prefix="/applications", tags=["Applications"])
logger = logging.getLogger(__name__)


class ApplyRequest(BaseModel):
    """Request model for applying to an internship"""
    cover_letter: Optional[str] = None


async def sync_application_to_employer_backend(
    internship_id: str,
    student_user_id: str,
    status: str = "applied"
) -> bool:
    """
    Sync application to employer backend database.
    Returns True if successful, False otherwise.
    This is a non-blocking operation - failures are logged but don't break the main flow.
    """
    try:
        employer_db = await get_employer_database()
        
        # Get internship from employer database to find owner_uid
        internships_collection = employer_db.internships
        internship = await internships_collection.find_one({"_id": internship_id})
        
        if not internship:
            logger.warning(f"Internship {internship_id} not found in employer database, skipping sync")
            return False
        
        owner_uid = internship.get("owner_uid")
        if not owner_uid:
            logger.warning(f"Internship {internship_id} has no owner_uid, skipping sync")
            return False
        
        # Check if application already exists in employer backend
        applications_collection = employer_db.applications
        existing_app = await applications_collection.find_one({
            "internship_id": internship_id,
            "student_uid": student_user_id
        })
        
        if existing_app:
            logger.info(f"Application already exists in employer backend for internship {internship_id}")
            return True
        
        # Create application record in employer backend
        application_doc = {
            "internship_id": internship_id,
            "student_uid": student_user_id,  # Using MongoDB user_id as student_uid
            "employer_uid": owner_uid,
            "status": status,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        await applications_collection.insert_one(application_doc)
        logger.info(f"Successfully synced application to employer backend: internship={internship_id}, student={student_user_id}")
        return True
        
    except Exception as e:
        # Log error but don't fail the main application creation
        logger.error(f"Failed to sync application to employer backend: {str(e)}", exc_info=True)
        return False


@router.post("/apply/{internship_id}", response_model=Dict[str, Any])
async def apply_to_internship(
    internship_id: str,
    request: ApplyRequest = Body(...),
    current_user: User = Depends(get_current_user)
):
    """
    Apply to an internship
    """
    try:
        db = await get_database()
        employer_db = await get_employer_database()
        applications_collection = db.applications
        
        # Check if internship exists in employer database first (where internships are stored)
        employer_internships_collection = employer_db.internships
        
        # Handle both ObjectId and string IDs
        from bson import ObjectId
        internship = None
        try:
            # First try with ObjectId if it's a valid ObjectId string
            if ObjectId.is_valid(internship_id):
                internship = await employer_internships_collection.find_one({"_id": ObjectId(internship_id)})
            if not internship:
                # Try with string ID
                internship = await employer_internships_collection.find_one({"_id": internship_id})
        except Exception as e:
            logger.warning(f"Error querying with ObjectId for {internship_id}: {e}")
            # Try with string ID
            internship = await employer_internships_collection.find_one({"_id": internship_id})
        
        # If not found in employer DB, check student DB (for backwards compatibility)
        if not internship:
            student_internships_collection = db.internships
            try:
                if ObjectId.is_valid(internship_id):
                    internship = await student_internships_collection.find_one({
                        "_id": ObjectId(internship_id),
                        "is_active": True
                    })
                if not internship:
                    internship = await student_internships_collection.find_one({
                        "_id": internship_id,
                        "is_active": True
                    })
            except Exception as e:
                logger.warning(f"Error querying student DB with ObjectId for {internship_id}: {e}")
                internship = await student_internships_collection.find_one({
                    "_id": internship_id,
                    "is_active": True
                })
        
        if not internship:
            raise HTTPException(status_code=404, detail="Internship not found or not active")
        
        # Check if internship is active (handle both status field and is_active field)
        status = internship.get("status", "").lower() if internship.get("status") else ""
        is_active = internship.get("is_active", True)
        if status not in ["active", "open", "published"] and not is_active:
            raise HTTPException(status_code=400, detail="Internship is not active")
        
        # Check if user has already applied
        existing_application = await applications_collection.find_one({
            "user_id": str(current_user.id),
            "internship_id": internship_id
        })
        
        if existing_application:
            raise HTTPException(status_code=400, detail="You have already applied to this internship")
        
        # Check if application deadline has passed
        if internship.get('application_deadline') and internship['application_deadline'] < datetime.utcnow():
            raise HTTPException(status_code=400, detail="Application deadline has passed")
        
        # Check if positions are available
        # Only check if positions_available is explicitly set (not None)
        positions_available = internship.get('positions_available')
        applications_received = internship.get('applications_received', 0)
        
        # If positions_available is set and we've reached the limit, reject
        if positions_available is not None and positions_available > 0:
            if applications_received >= positions_available:
                raise HTTPException(status_code=400, detail="No positions available")
        
        # Create application
        application = {
            "user_id": str(current_user.id),
            "internship_id": internship_id,
            "status": "applied",
            "applied_at": datetime.utcnow(),
            "cover_letter": request.cover_letter or "",
            "user_profile_snapshot": {
                "email": current_user.email,
                "full_name": current_user.full_name,
                "phone": current_user.phone,
                "skills": [skill.dict() for skill in current_user.skills] if current_user.skills else [],
                "education": [edu.dict() for edu in current_user.education] if current_user.education else [],
                "experience": [exp.dict() for exp in current_user.experience] if current_user.experience else []
            }
        }
        
        # Insert application
        result = await applications_collection.insert_one(application)
        
        # Update internship application count in employer DB (where internships are stored)
        try:
            # Use the same ID format that was used to find the internship
            update_query = {"_id": ObjectId(internship_id)} if ObjectId.is_valid(internship_id) else {"_id": internship_id}
            await employer_internships_collection.update_one(
                update_query,
                {"$inc": {"applications_received": 1}}
            )
        except Exception as e:
            logger.warning(f"Failed to update application count in employer DB: {e}")
            # Try student DB as fallback
            try:
                student_internships_collection = db.internships
                update_query = {"_id": ObjectId(internship_id)} if ObjectId.is_valid(internship_id) else {"_id": internship_id}
                await student_internships_collection.update_one(
                    update_query,
                    {"$inc": {"applications_received": 1}}
                )
            except Exception as e2:
                logger.warning(f"Failed to update application count in student DB: {e2}")
        
        # Sync application to employer backend (non-blocking)
        sync_success = await sync_application_to_employer_backend(
            internship_id=internship_id,
            student_user_id=str(current_user.id),
            status="applied"
        )
        if not sync_success:
            logger.warning(f"Application created in student backend but sync to employer backend failed for internship {internship_id}")
        
        # Log the application
        logger.info(f"User {current_user.email} applied to internship {internship_id}")
        
        return {
            "success": True,
            "message": "Application submitted successfully",
            "application_id": str(result.inserted_id),
            "application_status": "applied",
            "applied_at": application['applied_at'].isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error applying to internship: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit application")


@router.get("/my-applications", response_model=Dict[str, Any])
async def get_my_applications(
    current_user: User = Depends(get_current_user),
    status: str = None
):
    """
    Get all applications by the current user
    """
    try:
        db = await get_database()
        applications_collection = db.applications
        internships_collection = db.internships
        
        # Build query
        query = {"user_id": str(current_user.id)}
        if status:
            query["status"] = status
        
        # Get applications
        applications = await applications_collection.find(query).sort("applied_at", -1).to_list(length=50)
        
        # Get internship details for each application
        applications_with_details = []
        for app in applications:
            internship = await internships_collection.find_one({"_id": app['internship_id']})
            
            if internship:
                application_detail = {
                    "application_id": str(app['_id']),
                    "internship_id": str(internship['_id']),
                    "title": internship.get('title', ''),
                    "company": internship.get('company', ''),
                    "location": internship.get('location', ''),
                    "stipend": internship.get('stipend', 0),
                    "duration": internship.get('duration', ''),
                    "work_type": internship.get('work_type', ''),
                    "application_status": app.get('status', 'applied'),
                    "applied_at": app.get('applied_at').isoformat() if app.get('applied_at') else None,
                    "cover_letter": app.get('cover_letter'),
                    "notes": app.get('notes')
                }
                applications_with_details.append(application_detail)
        
        # Get status counts
        status_counts = {}
        for app in applications:
            status_val = app.get('status', 'applied')
            status_counts[status_val] = status_counts.get(status_val, 0) + 1
        
        return {
            "success": True,
            "applications": applications_with_details,
            "total_applications": len(applications_with_details),
            "status_counts": status_counts,
            "stats": {
                "applied": status_counts.get('applied', 0),
                "reviewed": status_counts.get('reviewed', 0),
                "shortlisted": status_counts.get('shortlisted', 0),
                "rejected": status_counts.get('rejected', 0),
                "accepted": status_counts.get('accepted', 0)
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting applications: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get applications")


@router.post("/withdraw/{application_id}", response_model=Dict[str, Any])
async def withdraw_application(
    application_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Withdraw an internship application
    """
    try:
        db = await get_database()
        applications_collection = db.applications
        
        # Find the application
        application = await applications_collection.find_one({
            "_id": application_id,
            "user_id": str(current_user.id)
        })
        
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        
        # Check if application can be withdrawn
        if application.get('status') not in ['applied', 'reviewed']:
            raise HTTPException(
                status_code=400, 
                detail=f"Cannot withdraw application with status: {application.get('status')}"
            )
        
        # Update application status
        await applications_collection.update_one(
            {"_id": application_id},
            {"$set": {"status": "withdrawn", "updated_at": datetime.utcnow()}}
        )
        
        # Update internship application count
        internships_collection = db.internships
        await internships_collection.update_one(
            {"_id": application['internship_id']},
            {"$inc": {"applications_received": -1}}
        )
        
        return {
            "success": True,
            "message": "Application withdrawn successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error withdrawing application: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to withdraw application")