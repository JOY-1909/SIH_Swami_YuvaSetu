"""
Internship posting and management API
"""
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import logging

from app.api.deps import get_current_user
from app.models.user import User
from app.database import get_database

router = APIRouter(prefix="/internships", tags=["Internships"])
logger = logging.getLogger(__name__)


def _ensure_list(value: Any) -> List[str]:
    """Ensure value is a list, converting from string or other formats if needed"""
    if value is None:
        return []
    if isinstance(value, list):
        return [str(item) for item in value]
    if isinstance(value, str):
        # Split by newline, comma, or semicolon
        return [item.strip() for item in value.replace('\n', ',').replace(';', ',').split(',') if item.strip()]
    # Try to convert to list
    try:
        return [str(value)]
    except:
        return []


@router.get("/", response_model=Dict[str, Any])
async def get_internships(
    current_user: Optional[User] = Depends(get_current_user),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    location: Optional[str] = None,
    work_type: Optional[str] = None,
    category: Optional[str] = None,
    min_stipend: Optional[float] = None,
    max_stipend: Optional[float] = None,
    search: Optional[str] = None,
    sort_by: str = Query("created_at", regex="^(created_at|stipend|views|applications)$"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    only_active: bool = True
):
    """
    Get internships with filtering and pagination
    """
    try:
        db = await get_database()
        internships_collection = db.internships
        
        # Build query
        query = {}
        
        if only_active:
            query["is_active"] = True
            query["status"] = "active"
        
        if location:
            query["location"] = {"$regex": location, "$options": "i"}
        
        if work_type:
            query["work_type"] = work_type
        
        if category:
            query["category"] = {"$regex": category, "$options": "i"}
        
        if min_stipend is not None or max_stipend is not None:
            stipend_query = {}
            if min_stipend is not None:
                stipend_query["$gte"] = min_stipend
            if max_stipend is not None:
                stipend_query["$lte"] = max_stipend
            query["stipend"] = stipend_query
        
        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}},
                {"company": {"$regex": search, "$options": "i"}},
                {"requirements": {"$regex": search, "$options": "i"}},
                {"tags": {"$regex": search, "$options": "i"}}
            ]
        
        # Calculate skip
        skip = (page - 1) * limit
        
        # Get total count
        total = await internships_collection.count_documents(query)
        
        # Determine sort order
        sort_order_val = -1 if sort_order == "desc" else 1
        
        # Get internships
        internships = await internships_collection.find(query).sort(
            sort_by, sort_order_val
        ).skip(skip).limit(limit).to_list(length=limit)
        
        # Format response
        formatted_internships = []
        for internship in internships:
            formatted_internships.append({
                "id": str(internship['_id']),
                "title": internship.get('title', ''),
                "company": internship.get('company', ''),
                "description": internship.get('description', ''),
                "location": internship.get('location', ''),
                "work_type": internship.get('work_type', ''),
                "duration": internship.get('duration', ''),
                "stipend": internship.get('stipend', 0),
                "stipend_currency": internship.get('stipend_currency', 'INR'),
                "requirements": internship.get('requirements', []),
                "skills": internship.get('skills', []),
                "responsibilities": internship.get('responsibilities', []),
                "is_remote": internship.get('is_remote', False),
                "application_deadline": internship.get('application_deadline').isoformat() if internship.get('application_deadline') else None,
                "start_date": internship.get('start_date').isoformat() if internship.get('start_date') else None,
                "category": internship.get('category'),
                "tags": internship.get('tags', []),
                "views": internship.get('views', 0),
                "saves": internship.get('saves', 0),
                "applications": internship.get('applications', 0),
                "created_at": internship.get('created_at').isoformat() if internship.get('created_at') else None,
                "is_featured": internship.get('is_featured', False),
                "is_verified": internship.get('is_verified', False),
                "apply_url": internship.get('apply_url')
            })
        
        # Check which internships user has applied to
        if current_user:
            applications_collection = db.applications
            user_applications = await applications_collection.find({
                "user_id": str(current_user.id)
            }).to_list(length=100)
            
            applied_ids = [app['internship_id'] for app in user_applications]
            
            for internship in formatted_internships:
                internship['has_applied'] = internship['id'] in applied_ids
        
        return {
            "success": True,
            "internships": formatted_internships,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            },
            "filters": {
                "location": location,
                "work_type": work_type,
                "category": category,
                "min_stipend": min_stipend,
                "max_stipend": max_stipend,
                "search": search
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting internships: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get internships")


@router.get("/{internship_id}", response_model=Dict[str, Any])
async def get_internship_details(
    internship_id: str,
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Get detailed information about a specific internship
    """
    try:
        db = await get_database()
        from app.database.multi_cluster import get_employer_database
        from bson import ObjectId
        
        # Try employer database first (where internships are stored)
        employer_db = await get_employer_database()
        employer_internships_collection = employer_db.internships
        
        # Try to find internship - handle both string ID and ObjectId
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
                    internship = await student_internships_collection.find_one({"_id": ObjectId(internship_id)})
                if not internship:
                    internship = await student_internships_collection.find_one({"_id": internship_id})
            except Exception as e:
                logger.warning(f"Error querying student DB with ObjectId for {internship_id}: {e}")
                internship = await student_internships_collection.find_one({"_id": internship_id})
        
        if not internship:
            raise HTTPException(status_code=404, detail="Internship not found")
        
        # Increment view count in the database where internship was found
        try:
            if internship and employer_db:
                # Use the same ID format that was used to find the internship
                update_query = {"_id": ObjectId(internship_id)} if ObjectId.is_valid(internship_id) else {"_id": internship_id}
                await employer_internships_collection.update_one(
                    update_query,
                    {"$inc": {"views": 1}}
                )
            elif internship:
                student_internships_collection = db.internships
                update_query = {"_id": ObjectId(internship_id)} if ObjectId.is_valid(internship_id) else {"_id": internship_id}
                await student_internships_collection.update_one(
                    update_query,
                    {"$inc": {"views": 1}}
                )
        except Exception as e:
            logger.warning(f"Failed to increment view count: {e}")
        
        # Format response
        response = {
            "id": str(internship['_id']),
            "title": internship.get('title', ''),
            "company": internship.get('company', ''),
            "company_description": internship.get('company_description'),
            "company_logo": internship.get('company_logo'),
            "description": internship.get('description', ''),
            "location": internship.get('location', ''),
            "work_type": internship.get('work_type', ''),
            "duration": internship.get('duration', ''),
            "duration_months": internship.get('duration_months'),
            "stipend": internship.get('stipend', 0),
            "stipend_currency": internship.get('stipend_currency', 'INR'),
            "stipend_period": internship.get('stipend_period', 'monthly'),
            "requirements": _ensure_list(internship.get('requirements', [])),
            "skills": _ensure_list(internship.get('skills', [])),
            "responsibilities": _ensure_list(internship.get('responsibilities', [])),
            "is_remote": internship.get('is_remote', False),
            "application_deadline": internship.get('application_deadline').isoformat() if internship.get('application_deadline') else None,
            "start_date": internship.get('start_date').isoformat() if internship.get('start_date') else None,
            "positions_available": internship.get('positions_available', 1),
            "applications_received": internship.get('applications_received', 0),
            "category": internship.get('category'),
            "tags": internship.get('tags', []),
            "contact_email": internship.get('contact_email'),
            "contact_phone": internship.get('contact_phone'),
            "apply_url": internship.get('apply_url'),
            "views": internship.get('views', 0) + 1,  # Include the current view
            "saves": internship.get('saves', 0),
            "applications": internship.get('applications', 0),
            "created_at": internship.get('created_at').isoformat() if internship.get('created_at') else None,
            "updated_at": internship.get('updated_at').isoformat() if internship.get('updated_at') else None,
            "is_featured": internship.get('is_featured', False),
            "is_verified": internship.get('is_verified', False),
            "status": internship.get('status', 'active')
        }
        
        # Check if user has applied
        if current_user:
            applications_collection = db.applications
            user_application = await applications_collection.find_one({
                "user_id": str(current_user.id),
                "internship_id": internship_id
            })
            
            response['has_applied'] = user_application is not None
            if user_application:
                response['application_status'] = user_application.get('status')
                response['applied_at'] = user_application.get('applied_at').isoformat() if user_application.get('applied_at') else None
        
        return {
            "success": True,
            "internship": response
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting internship details: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get internship details")


@router.post("/save/{internship_id}", response_model=Dict[str, Any])
async def save_internship(
    internship_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Save an internship for later viewing
    """
    try:
        db = await get_database()
        internships_collection = db.internships
        saved_internships_collection = db.saved_internships
        
        # Check if internship exists
        internship = await internships_collection.find_one({"_id": internship_id})
        if not internship:
            raise HTTPException(status_code=404, detail="Internship not found")
        
        # Check if already saved
        existing_save = await saved_internships_collection.find_one({
            "user_id": str(current_user.id),
            "internship_id": internship_id
        })
        
        if existing_save:
            # Remove from saved
            await saved_internships_collection.delete_one({"_id": existing_save['_id']})
            await internships_collection.update_one(
                {"_id": internship_id},
                {"$inc": {"saves": -1}}
            )
            
            return {
                "success": True,
                "message": "Internship removed from saved",
                "is_saved": False
            }
        else:
            # Save internship
            saved_internship = {
                "user_id": str(current_user.id),
                "internship_id": internship_id,
                "saved_at": datetime.utcnow(),
                "internship_snapshot": {
                    "title": internship.get('title', ''),
                    "company": internship.get('company', ''),
                    "location": internship.get('location', ''),
                    "stipend": internship.get('stipend', 0),
                    "duration": internship.get('duration', '')
                }
            }
            
            await saved_internships_collection.insert_one(saved_internship)
            await internships_collection.update_one(
                {"_id": internship_id},
                {"$inc": {"saves": 1}}
            )
            
            return {
                "success": True,
                "message": "Internship saved successfully",
                "is_saved": True,
                "saved_at": saved_internship['saved_at'].isoformat()
            }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error saving internship: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to save internship")


@router.get("/saved/", response_model=Dict[str, Any])
async def get_saved_internships(
    current_user: User = Depends(get_current_user)
):
    """
    Get internships saved by the current user
    """
    try:
        db = await get_database()
        saved_internships_collection = db.saved_internships
        internships_collection = db.internships
        
        # Get saved internships
        saved_items = await saved_internships_collection.find({
            "user_id": str(current_user.id)
        }).sort("saved_at", -1).to_list(length=50)
        
        # Get internship details
        saved_internships = []
        for item in saved_items:
            internship = await internships_collection.find_one({"_id": item['internship_id']})
            
            if internship and internship.get('is_active', True):
                saved_internships.append({
                    "id": str(internship['_id']),
                    "title": internship.get('title', ''),
                    "company": internship.get('company', ''),
                    "location": internship.get('location', ''),
                    "stipend": internship.get('stipend', 0),
                    "duration": internship.get('duration', ''),
                    "work_type": internship.get('work_type', ''),
                    "saved_at": item.get('saved_at').isoformat() if item.get('saved_at') else None,
                    "has_applied": False  # Will be checked below
                })
        
        # Check which saved internships user has applied to
        applications_collection = db.applications
        user_applications = await applications_collection.find({
            "user_id": str(current_user.id)
        }).to_list(length=100)
        
        applied_ids = [app['internship_id'] for app in user_applications]
        
        for internship in saved_internships:
            internship['has_applied'] = internship['id'] in applied_ids
        
        return {
            "success": True,
            "saved_internships": saved_internships,
            "count": len(saved_internships)
        }
        
    except Exception as e:
        logger.error(f"Error getting saved internships: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get saved internships")