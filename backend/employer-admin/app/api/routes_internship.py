# app/api/routes_internship.py

from datetime import datetime
from typing import List, Optional
import re
from fastapi import APIRouter, Depends, status, HTTPException
from pydantic import BaseModel
from beanie import PydanticObjectId

from app.models.internship import Internship
from app.models.employer_profile import EmployerProfile
from app.auth.deps import EmployerUser, get_current_employer

router = APIRouter(
    prefix="/employer/internships",
    tags=["employer-internships"],
)


# ✅ HELPER FUNCTION TO CHECK VERIFICATION
async def check_employer_verified(employer_uid: str) -> EmployerProfile:
    """Check if employer is verified by admin"""
    profile = await EmployerProfile.find_one(EmployerProfile.employer_uid == employer_uid)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please complete your profile first"
        )
    if not profile.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is pending admin verification. You cannot post internships until verified."
        )
    return profile


def _parse_stipend(raw: Optional[str]) -> Optional[int]:
    """Sanitize stipend input and return integer amount or None.

    Accepts strings like '₹10000', '10,000', '10000/month' or integers.
    Strips non-numeric characters and converts to int when possible.
    """
    if raw is None:
        return None
    if isinstance(raw, int):
        return raw
    s = str(raw)
    # remove currency symbols, words and commas; keep digits, dot and minus
    s = re.sub(r"[^0-9.\-]", "", s)
    if not s:
        return None
    try:
        val = float(s)
        return int(val)
    except ValueError:
        return None


class InternshipCreate(BaseModel):
    organisation_name: str
    title: str
    description: str
    responsibilities: Optional[str] = None
    requirements: Optional[str] = None
    perks: Optional[str] = None
    skills: Optional[List[str]] = None
    location: str
    state: Optional[str] = None
    city: Optional[str] = None
    stipend: Optional[str] = None
    sector: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    duration_days: Optional[int] = None
    duration_weeks: Optional[float] = None
    duration_months: Optional[float] = None


class InternshipUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    responsibilities: Optional[str] = None
    requirements: Optional[str] = None
    perks: Optional[str] = None
    skills: Optional[List[str]] = None
    location: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    stipend: Optional[str] = None
    sector: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    duration_days: Optional[int] = None
    duration_weeks: Optional[float] = None
    duration_months: Optional[float] = None


class InternshipOut(BaseModel):
    id: str
    organisation_name: str
    title: str
    description: str
    responsibilities: Optional[str]
    requirements: Optional[str]
    perks: Optional[str]
    skills: Optional[List[str]]
    location: str
    state: Optional[str]
    city: Optional[str]
    stipend: Optional[int]
    sector: Optional[str]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    duration_days: Optional[int]
    duration_weeks: Optional[float]
    duration_months: Optional[float]
    is_active: bool

    @classmethod
    def from_doc(cls, doc: Internship) -> "InternshipOut":
        return cls(
            id=str(doc.id),
            organisation_name=doc.organisation_name,
            title=doc.title,
            description=doc.description,
            responsibilities=doc.responsibilities,
            requirements=doc.requirements,
            perks=doc.perks,
            skills=doc.skills,
            location=doc.location,
            state=doc.state,
            city=doc.city,
            stipend=doc.stipend,
            sector=doc.sector,
            start_date=doc.start_date,
            end_date=doc.end_date,
            duration_days=doc.duration_days,
            duration_weeks=doc.duration_weeks,
            duration_months=doc.duration_months,
            is_active=doc.is_active,
        )


@router.post("", response_model=InternshipOut, status_code=status.HTTP_201_CREATED)
async def create_internship(
    payload: InternshipCreate,
    employer: EmployerUser = Depends(get_current_employer),
) -> InternshipOut:
    """Create a new internship (only for verified employers)"""
    
    # ✅ CHECK VERIFICATION BEFORE ALLOWING POST
    profile = await check_employer_verified(employer.uid)
    
    stipend_value = _parse_stipend(payload.stipend)

    internship = Internship(
        owner_uid=employer.uid,
        organisation_name=profile.organisation_name,  # Use from verified profile
        title=payload.title,
        description=payload.description,
        responsibilities=payload.responsibilities,
        requirements=payload.requirements,
        perks=payload.perks,
        skills=payload.skills,
        location=payload.location,
        state=payload.state,
        city=payload.city,
        stipend=stipend_value,
        sector=payload.sector,
        start_date=payload.start_date,
        end_date=payload.end_date,
        duration_days=payload.duration_days,
        duration_weeks=payload.duration_weeks,
        duration_months=payload.duration_months,
        is_active=True,
        closed_at=None,
    )
    
    await internship.insert()
    return InternshipOut.from_doc(internship)


@router.get("", response_model=List[InternshipOut])
async def list_my_internships(
    employer: EmployerUser = Depends(get_current_employer),
) -> List[InternshipOut]:
    """List all internships posted by this employer"""
    docs = (
        await Internship
        .find(Internship.owner_uid == employer.uid)
        .sort("-created_at")
        .to_list()
    )
    return [InternshipOut.from_doc(doc) for doc in docs]


@router.get("/{internship_id}", response_model=InternshipOut)
async def get_internship(
    internship_id: str,
    employer: EmployerUser = Depends(get_current_employer),
) -> InternshipOut:
    """Get a single internship by ID"""
    internship = await Internship.get(PydanticObjectId(internship_id))
    if not internship or internship.owner_uid != employer.uid:
        raise HTTPException(status_code=404, detail="Internship not found")
    return InternshipOut.from_doc(internship)


@router.put("/{internship_id}", response_model=InternshipOut)
async def update_internship(
    internship_id: str,
    payload: InternshipUpdate,
    employer: EmployerUser = Depends(get_current_employer),
) -> InternshipOut:
    """Update an existing internship"""
    internship = await Internship.get(PydanticObjectId(internship_id))
    if not internship or internship.owner_uid != employer.uid:
        raise HTTPException(status_code=404, detail="Internship not found")

    # Basic fields
    if payload.title is not None:
        internship.title = payload.title
    if payload.description is not None:
        internship.description = payload.description
    if payload.responsibilities is not None:
        internship.responsibilities = payload.responsibilities
    if payload.requirements is not None:
        internship.requirements = payload.requirements
    if payload.perks is not None:
        internship.perks = payload.perks
    if payload.skills is not None:
        internship.skills = payload.skills

    # Location
    if payload.location is not None:
        internship.location = payload.location
    if payload.state is not None:
        internship.state = payload.state
    if payload.city is not None:
        internship.city = payload.city

    # Meta
    if payload.stipend is not None:
        internship.stipend = _parse_stipend(payload.stipend)
    if payload.sector is not None:
        internship.sector = payload.sector

    # Duration
    if payload.start_date is not None:
        internship.start_date = payload.start_date
    if payload.end_date is not None:
        internship.end_date = payload.end_date
    if payload.duration_days is not None:
        internship.duration_days = payload.duration_days
    if payload.duration_weeks is not None:
        internship.duration_weeks = payload.duration_weeks
    if payload.duration_months is not None:
        internship.duration_months = payload.duration_months

    internship.updated_at = datetime.utcnow()
    await internship.save()
    return InternshipOut.from_doc(internship)


@router.post("/{internship_id}/close", response_model=InternshipOut)
async def close_internship(
    internship_id: str,
    employer: EmployerUser = Depends(get_current_employer),
) -> InternshipOut:
    """Close/deactivate an internship"""
    internship = await Internship.get(PydanticObjectId(internship_id))
    if not internship or internship.owner_uid != employer.uid:
        raise HTTPException(status_code=404, detail="Internship not found")

    if not internship.is_active:
        return InternshipOut.from_doc(internship)

    internship.is_active = False
    internship.closed_at = datetime.utcnow()
    internship.updated_at = datetime.utcnow()
    await internship.save()
    return InternshipOut.from_doc(internship)


@router.delete("/{internship_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_closed_internship(
    internship_id: str,
    employer: EmployerUser = Depends(get_current_employer),
) -> None:
    """Delete a closed internship"""
    internship = await Internship.get(PydanticObjectId(internship_id))
    if not internship or internship.owner_uid != employer.uid:
        raise HTTPException(status_code=404, detail="Internship not found")

    if internship.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete an active internship. Close it first.",
        )

    await internship.delete()
