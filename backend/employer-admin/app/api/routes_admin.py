from typing import List
from datetime import datetime
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
import firebase_admin
from firebase_admin import auth as firebase_auth

from app.models.employer_profile import EmployerProfile
from app.models.internship import Internship
from app.models.student import Student
from app.models.application import Application
from beanie import PydanticObjectId

# --- Validation Models ---
class InternshipStatusUpdate(BaseModel):
    status: str  # active, closed, rejected

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
)

# --- Response Models ---
class DashboardStats(BaseModel):
    total_employers: int
    verified_employers: int
    active_internships: int
    total_applications: int

class AdminAuthResponse(BaseModel):
    email: str
    name: str
    uid: str
    role: str

# --- Authentication Endpoint ---

@router.post("/auth/verify", response_model=AdminAuthResponse)
async def verify_admin_token(authorization: str = Header(None)):
    """Verify Firebase admin token"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="No token provided")
    
    token = authorization.split("Bearer ")[1]
    
    try:
        # ✅ Use the ADMIN Firebase app to verify tokens
        admin_app = firebase_admin.get_app('admin')
        decoded_token = firebase_auth.verify_id_token(token, app=admin_app)
        email = decoded_token.get('email', '')
        
        # Check if user is admin
        if not (email.endswith('@yuvasetu.gov.in') or email.endswith('@gmail.com')):
            raise HTTPException(status_code=403, detail="Not authorized as admin")
        
        return AdminAuthResponse(
            uid=decoded_token['uid'],
            email=email,
            name=decoded_token.get('name', email.split('@')[0]),
            role='admin'
        )
    except firebase_admin.exceptions.FirebaseError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")

# --- Dashboard Stats Endpoint ---

@router.get("/stats", response_model=DashboardStats)
async def get_admin_stats():
    """Get platform statistics for Admin Dashboard"""
    total_emp = await EmployerProfile.count()
    verified_emp = await EmployerProfile.find(EmployerProfile.is_verified == True).count()
    active_int = await Internship.find(Internship.is_active == True).count()
    total_app = await Application.count()
    
    return DashboardStats(
        total_employers=total_emp,
        verified_employers=verified_emp,
        active_internships=active_int,
        total_applications=total_app
    )

@router.get("/employers", response_model=List[EmployerProfile])
async def get_all_employers():
    """List all employers for Admin to verify"""
    employers = await EmployerProfile.find_all().sort("-created_at").to_list()
    return employers

@router.put("/employers/{employer_uid}/verify")
async def verify_employer(employer_uid: str):
    """Mark employer as verified"""
    employer = await EmployerProfile.find_one(EmployerProfile.employer_uid == employer_uid)
    if not employer:
        raise HTTPException(status_code=404, detail="Employer not found")
    
    employer.is_verified = True
    employer.updated_at = datetime.utcnow()
    await employer.save()
    return {"message": "Employer verified successfully"}

@router.put("/employers/{employer_uid}/reject")
async def reject_employer(employer_uid: str):
    """Unverify/block employer"""
    employer = await EmployerProfile.find_one(EmployerProfile.employer_uid == employer_uid)
    if not employer:
        raise HTTPException(status_code=404, detail="Employer not found")
    
    employer.is_verified = False
    employer.updated_at = datetime.utcnow()
    await employer.save()
    await employer.save()
    return {"message": "Employer verification revoked"}


# --- Internship Management ---

@router.get("/internships", response_model=List[Internship])
async def get_all_internships():
    """List all internships for Admin"""
    # Fetch all, latest first
    internships = await Internship.find_all().sort("-created_at").to_list()
    return internships

@router.put("/internships/{internship_id}/status")
async def update_internship_status(internship_id: str, payload: InternshipStatusUpdate):
    """Update internship status (Reject/Close/Reactivate)"""
    internship = await Internship.get(PydanticObjectId(internship_id))
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    internship.status = payload.status
    
    # Sync is_active
    if payload.status == 'active':
        internship.is_active = True
        internship.closed_at = None
    elif payload.status in ['closed', 'rejected']:
        internship.is_active = False
        if not internship.closed_at:
            internship.closed_at = datetime.utcnow()
            
    internship.updated_at = datetime.utcnow()
    await internship.save()
    
    return {"message": f"Internship status updated to {payload.status}"}

class StudentResponse(BaseModel):
    id: str
    email: str
    full_name: str | None = None
    username: str | None = None
    phone: str | None = None
    location_query: str | None = None
    last_login: datetime | None = None

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

@router.get("/students", response_model=List[StudentResponse])
async def get_all_students():
    """List all students for Admin (Search in yuva_setu via student_client and current DB)"""
    from app.database import client, student_client
    
    students_data = []
    seen_ids = set()

    import asyncio
    
    # helper for safe execution
    async def fetch_users(collection):
        try:
            return await collection.find().to_list(length=None)
        except Exception:
            return []

    tasks = []
    
    # 1. Try 'yuva_setu' via student_client
    if student_client:
        tasks.append(fetch_users(student_client["yuva_setu"]["users"]))
    else:
        tasks.append(asyncio.sleep(0, result=[])) # no-op

    # 2. Try 'yuva_setu' in MAIN client
    if client:
        tasks.append(fetch_users(client["yuva_setu"]["users"]))
    else:
        tasks.append(asyncio.sleep(0, result=[]))

    # 3. Try default database
    if client:
        try:
            db_def = client.get_default_database()
            if db_def.name != "yuva_setu":
                tasks.append(fetch_users(db_def["users"]))
            else:
                 tasks.append(asyncio.sleep(0, result=[]))
        except:
             tasks.append(asyncio.sleep(0, result=[]))
    else:
         tasks.append(asyncio.sleep(0, result=[]))

    results = await asyncio.gather(*tasks)
    
    # Merge results
    for users_list in results:
        for s in users_list:
            sid = str(s.get("_id", ""))
            if sid not in seen_ids:
                students_data.append(s)
                seen_ids.add(sid)

    # Map to Response
    response = []
    for s in students_data:
        try:
            response.append(StudentResponse(
                id=str(s.get("_id", "")),
                email=s.get("email", ""),
                full_name=s.get("full_name") or s.get("username", "N/A"),
                username=s.get("username"),
                phone=s.get("phone"),
                location_query=s.get("location_query"),
                last_login=s.get("last_login")
            ))
        except Exception:
            continue
    
    return response
