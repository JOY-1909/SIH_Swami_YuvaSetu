# app/api/routes_employer_profile.py

from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status

from pydantic import BaseModel

from app.models.employer_profile import EmployerProfile

from app.auth.deps import EmployerUser, get_current_employer

router = APIRouter(
    prefix="/employer/profile",
    tags=["employer-profile"],
)


class EmployerProfileDTO(BaseModel):
    organisationName: str
    organisationType: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    about: Optional[str] = None
    contactPerson: Optional[str] = None
    contactEmail: Optional[str] = None
    contactPhone: Optional[str] = None
    address: Optional[str] = None
    authProvider: Optional[str] = None

    @classmethod
    def from_doc(cls, doc: EmployerProfile) -> "EmployerProfileDTO":
        return cls(
            organisationName=doc.organisation_name,
            organisationType=doc.organisation_type,
            industry=doc.industry,
            website=doc.website,
            about=doc.about,
            contactPerson=doc.contact_person,
            contactEmail=doc.contact_email,
            contactPhone=doc.contact_phone,
            address=doc.address,
            authProvider=doc.auth_provider,
        )


@router.get("", response_model=EmployerProfileDTO)
async def get_my_profile(
    employer: EmployerUser = Depends(get_current_employer),
) -> EmployerProfileDTO:
    """Get employer profile. Returns 404 if not signed up."""
    profile = await EmployerProfile.find_one({"employer_uid": employer.uid})
    if profile is None:
        # DO NOT auto-create - user must sign up first
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found. Please complete signup first."
        )
    
    return EmployerProfileDTO.from_doc(profile)


@router.put("", response_model=EmployerProfileDTO)
async def upsert_my_profile(
    payload: EmployerProfileDTO,
    provider: Optional[str] = Query(None, alias="provider"),
    employer: EmployerUser = Depends(get_current_employer),
) -> EmployerProfileDTO:
    """Create or update employer profile. Used during signup and profile edit."""
    profile = await EmployerProfile.find_one({"employer_uid": employer.uid})

    if profile is None:
        # Creating new profile (signup flow)
        auth_provider = provider if provider in ("password", "google") else "password"
        profile = EmployerProfile(
            employer_uid=employer.uid,
            auth_provider=auth_provider,
            organisation_name=payload.organisationName,
            organisation_type=payload.organisationType,
            industry=payload.industry,
            website=payload.website,
            about=payload.about,
            contact_person=payload.contactPerson,
            contact_email=payload.contactEmail or employer.email,
            contact_phone=payload.contactPhone,
            address=payload.address,
        )
        
        await profile.insert()
    else:
        # Updating existing profile (edit flow)
        profile.organisation_name = payload.organisationName
        profile.organisation_type = payload.organisationType
        profile.industry = payload.industry
        profile.website = payload.website
        profile.about = payload.about
        profile.contact_person = payload.contactPerson
        profile.contact_email = payload.contactEmail or employer.email
        profile.contact_phone = payload.contactPhone
        profile.address = payload.address
        await profile.save()

    return EmployerProfileDTO.from_doc(profile)


# ✅ ADD THIS NEW ENDPOINT
@router.get("/verification-status")
async def get_verification_status(
    employer: EmployerUser = Depends(get_current_employer),
):
    """Get employer verification status"""
    profile = await EmployerProfile.find_one({"employer_uid": employer.uid})
    if profile is None:
        return {
            "has_profile": False,
            "is_verified": False,
            "message": "Please complete your profile"
        }
    
    return {
        "has_profile": True,
        "is_verified": profile.is_verified,
        "organisation_name": profile.organisation_name,
        "message": "Verified" if profile.is_verified else "Pending verification"
    }
