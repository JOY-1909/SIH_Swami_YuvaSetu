from datetime import datetime
from typing import Optional, Literal, Union
from beanie import Document, Indexed, PydanticObjectId
from pydantic import Field

AuthProvider = Literal["password", "google"]

class EmployerProfile(Document):
    """
    Profile for an employer (one document per Firebase UID).
    """
    id: Optional[Union[str, PydanticObjectId]] = None  # Handle mixed ID types
    employer_uid: Indexed(str, unique=True)
    auth_provider: AuthProvider = "password"
    
    organisation_name: str
    organisation_type: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    about: Optional[str] = None
    
    contact_person: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None
    
    # ✅ ADMIN VERIFICATION FIELD
    is_verified: bool = False
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "employer_profiles"
        indexes = [
            [("employer_uid", 1)],
        ]
