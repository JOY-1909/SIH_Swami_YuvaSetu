# File: Yuva-setu/backend/app/schemas/auth.py
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field, validator
from app.models.otp import OTPPurpose
from typing import Literal

class SignupEmailRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    confirm_password: str = Field(..., min_length=8)
    
    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v

class ResendOTPRequest(BaseModel):
    identifier: str
    purpose: Literal["signup", "password_reset"]

class SendEmailOTPRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    confirm_password: str = Field(..., min_length=8)

# FIXED: Remove password from OTP verification since it's stored in metadata
class VerifyEmailOTPRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)
    agreed_to_terms: bool

class PersonalDetailsRequest(BaseModel):
    full_name: str
    contact_number: str = Field(..., pattern="^[0-9]{10}$")
    address: str
    differently_abled: bool = False

class SendPhoneOTPRequest(BaseModel):
    phone: str = Field(..., pattern="^[0-9]{10}$")

class VerifyPhoneOTPRequest(BaseModel):
    phone: str = Field(..., pattern="^[0-9]{10}$")
    otp: str = Field(..., min_length=6, max_length=6)

# UPDATED: Enhanced CompleteProfileRequest with location fields
class CompleteProfileRequest(BaseModel):
    # Personal details
    first_name: str
    last_name: Optional[str] = None
    phone: str
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    address: str
    location_query: Optional[str] = None
    location_latitude: Optional[float] = None
    location_longitude: Optional[float] = None
    languages: Optional[str] = None
    linkedin: Optional[str] = None
    career_objective: Optional[str] = None
    
    # Dynamic sections
    education: List[Dict[str, Any]] = []
    experience: List[Dict[str, Any]] = []
    trainings: List[Dict[str, Any]] = []
    projects: List[Dict[str, Any]] = []
    skills: List[Dict[str, Any]] = []
    portfolio: List[Dict[str, Any]] = []
    accomplishments: List[Dict[str, Any]] = []

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class MessageResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

class GoogleAuthRequest(BaseModel):
    id_token: str