# app/api/routes_applications.py
from typing import List
import logging
from datetime import datetime

from fastapi import APIRouter, Depends, Path, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import httpx
import io

from app.models.application import Application
from app.auth.deps import EmployerUser, get_current_employer
from app.database import client

logger = logging.getLogger(__name__)


router = APIRouter(
    prefix="/employer",
    tags=["employer-applications"],
)


class StudentDetails(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    full_name: str | None = None


class ApplicationOut(BaseModel):
    id: str
    internship_id: str
    student_uid: str
    status: str  # "applied" | "under_review" | "shortlisted" | "rejected" | "selected"
    student_details: StudentDetails | None = None

    @classmethod
    def from_doc(cls, doc: Application, student_details: StudentDetails | None = None) -> "ApplicationOut":
        return cls(
            id=str(doc.id),
            internship_id=doc.internship_id,
            student_uid=doc.student_uid,
            status=doc.status,
            student_details=student_details,
        )


class ApplicationStatusUpdate(BaseModel):
    status: str  # "applied" | "under_review" | "shortlisted" | "rejected" | "selected"


def map_employer_status_to_student_status(employer_status: str) -> str:
    """
    Map employer backend status to student backend status.
    Employer: applied, under_review, shortlisted, rejected, selected
    Student: applied, reviewed, shortlisted, rejected, accepted
    """
    status_mapping = {
        "applied": "applied",
        "under_review": "reviewed",
        "shortlisted": "shortlisted",
        "rejected": "rejected",
        "selected": "accepted"
    }
    return status_mapping.get(employer_status, employer_status)


async def sync_status_to_student_backend(
    internship_id: str,
    student_uid: str,
    status: str
) -> bool:
    """
    Sync application status update to student backend database.
    Returns True if successful, False otherwise.
    This is a non-blocking operation - failures are logged but don't break the main flow.
    """
    try:
        if client is None:
            logger.warning("MongoDB client not available for student backend sync")
            return False
        
        # Get student database (assuming same cluster, different database name)
        # If using different cluster, you'd need to configure STUDENT_MONGODB_URI
        from app.config import settings
        student_db_name = getattr(settings, 'STUDENT_DATABASE_NAME', 'yuva_setu')
        student_db = client[student_db_name]
        
        # Map status from employer format to student format
        student_status = map_employer_status_to_student_status(status)
        
        # Update application in student backend
        applications_collection = student_db.applications
        result = await applications_collection.update_one(
            {
                "internship_id": internship_id,
                "user_id": student_uid  # student_uid is the MongoDB user_id
            },
            {
                "$set": {
                    "status": student_status,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count > 0:
            logger.info(f"Successfully synced status to student backend: internship={internship_id}, student={student_uid}, status={student_status}")
            return True
        else:
            logger.warning(f"Application not found in student backend for sync: internship={internship_id}, student={student_uid}")
            return False
        
    except Exception as e:
        # Log error but don't fail the main status update
        logger.error(f"Failed to sync status to student backend: {str(e)}", exc_info=True)
        return False


async def get_student_details_from_db(student_uid: str) -> StudentDetails | None:
    """
    Fetch student details from student backend database.
    Returns None if not found or on error.
    """
    try:
        if client is None:
            return None
        
        from app.config import settings
        student_db_name = getattr(settings, 'STUDENT_DATABASE_NAME', 'yuva_setu')
        student_db = client[student_db_name]
        
        users_collection = student_db.users
        user = await users_collection.find_one({"_id": student_uid})
        
        if not user:
            # Try finding by email if student_uid might be email
            user = await users_collection.find_one({"email": student_uid})
        
        if user:
            return StudentDetails(
                name=user.get("full_name") or user.get("first_name"),
                email=user.get("email"),
                phone=user.get("phone") or user.get("contact_number"),
                full_name=user.get("full_name")
            )
        return None
    except Exception as e:
        logger.error(f"Error fetching student details: {str(e)}", exc_info=True)
        return None


@router.get(
    "/internships/{internship_id}/applications",
    response_model=List[ApplicationOut],
)
async def list_applications_for_internship(
    internship_id: str = Path(..., description="Internship ID"),
    employer: EmployerUser = Depends(get_current_employer),
) -> List[ApplicationOut]:
    apps = await Application.find(
        Application.internship_id == internship_id
    ).to_list()
    
    # Fetch student details for each application
    result = []
    for app in apps:
        student_details = await get_student_details_from_db(app.student_uid)
        result.append(ApplicationOut.from_doc(app, student_details))
    
    return result


@router.get(
    "/applications/{app_id}",
    response_model=ApplicationOut,
)
async def get_application(
    app_id: str,
    employer: EmployerUser = Depends(get_current_employer),
) -> ApplicationOut:
    app = await Application.get(app_id)
    if app is None:
        raise HTTPException(status_code=404, detail="Application not found")
    
    student_details = await get_student_details_from_db(app.student_uid)
    return ApplicationOut.from_doc(app, student_details)


@router.patch(
    "/applications/{app_id}",
    response_model=ApplicationOut,
)
async def update_application_status(
    app_id: str,
    payload: ApplicationStatusUpdate,
    employer: EmployerUser = Depends(get_current_employer),
) -> ApplicationOut:
    app = await Application.get(app_id)
    if app is None:
        raise HTTPException(status_code=404, detail="Application not found")

    # Update status in employer backend
    app.status = payload.status
    app.updated_at = datetime.utcnow()
    await app.save()
    
    # Sync status update to student backend (non-blocking)
    sync_success = await sync_status_to_student_backend(
        internship_id=app.internship_id,
        student_uid=app.student_uid,
        status=payload.status
    )
    if not sync_success:
        logger.warning(f"Status updated in employer backend but sync to student backend failed for application {app_id}")
    
    student_details = await get_student_details_from_db(app.student_uid)
    return ApplicationOut.from_doc(app, student_details)


@router.get(
    "/applications/{app_id}/resume",
    response_class=StreamingResponse,
)
async def download_student_resume(
    app_id: str,
    employer: EmployerUser = Depends(get_current_employer),
):
    """
    Download student resume PDF for an application.
    """
    import io
    
    app = await Application.get(app_id)
    if app is None:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Verify this application belongs to an internship owned by this employer
    from app.models.internship import Internship
    internship = await Internship.get(app.internship_id)
    if not internship or internship.owner_uid != employer.uid:
        raise HTTPException(status_code=403, detail="Not authorized to access this application")
    
    # Get full student profile from student database
    try:
        if client is None:
            raise HTTPException(status_code=500, detail="Database connection unavailable")
        
        from app.config import settings
        student_db_name = getattr(settings, 'STUDENT_DATABASE_NAME', 'yuva_setu')
        student_db = client[student_db_name]
        
        users_collection = student_db.users
        user = await users_collection.find_one({"_id": app.student_uid})
        
        if not user:
            # Try finding by email
            user = await users_collection.find_one({"email": app.student_uid})
        
        if not user:
            raise HTTPException(status_code=404, detail="Student profile not found")
        
        # Try to import resume generator - we'll need to copy the logic or make HTTP call
        # For simplicity, we'll make an HTTP call to student backend
        from app.config import settings as app_settings
        
        # Get student backend URL from settings or use default
        student_api_url = getattr(app_settings, 'STUDENT_API_URL', 'http://localhost:8001')
        
        # Build resume data from user profile
        resume_data = {
            'firstName': user.get('first_name') or (user.get('full_name', '').split()[0] if user.get('full_name') else 'User'),
            'lastName': user.get('last_name') or (' '.join(user.get('full_name', '').split()[1:]) if user.get('full_name') else ''),
            'phone': user.get('phone') or user.get('contact_number', ''),
            'email': user.get('email', ''),
            'dateOfBirth': str(user.get('date_of_birth', '')) if user.get('date_of_birth') else '',
            'gender': user.get('gender', ''),
            'address': user.get('address', ''),
            'languages': user.get('languages', ''),
            'linkedin': user.get('linkedin', ''),
            'careerObjective': user.get('career_objective', ''),
            'education': [edu if isinstance(edu, dict) else {} for edu in (user.get('education') or [])],
            'experience': [exp if isinstance(exp, dict) else {} for exp in (user.get('experience') or [])],
            'trainings': [tr if isinstance(tr, dict) else {} for tr in (user.get('trainings') or [])],
            'projects': [pr if isinstance(pr, dict) else {} for pr in (user.get('projects') or [])],
            'skills': [sk if isinstance(sk, dict) else {} for sk in (user.get('skills') or [])],
            'portfolio': [pt if isinstance(pt, dict) else {} for pt in (user.get('portfolio') or [])],
            'accomplishments': [ac if isinstance(ac, dict) else {} for ac in (user.get('accomplishments') or [])],
        }
        
        # Call student backend to generate PDF
        async with httpx.AsyncClient(timeout=30.0) as http_client:
            try:
                response = await http_client.post(
                    f"{student_api_url}/api/v1/resume/generate-pdf",
                    json=resume_data,
                    headers={"Content-Type": "application/json"},
                )
                response.raise_for_status()
                pdf_bytes = response.content
                
                # Create filename
                first_name = resume_data.get('firstName', 'user').replace(' ', '_')
                last_name = resume_data.get('lastName', '').replace(' ', '_')
                filename = f"resume_{first_name}_{last_name}.pdf".strip('_').replace('__', '_')
                
                return StreamingResponse(
                    io.BytesIO(pdf_bytes),
                    media_type="application/pdf",
                    headers={"Content-Disposition": f"attachment; filename={filename}"},
                )
            except httpx.HTTPError as e:
                logger.error(f"Error calling student backend for resume: {str(e)}")
                raise HTTPException(status_code=500, detail="Failed to generate resume. Please try again later.")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating resume: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to generate resume: {str(e)}")