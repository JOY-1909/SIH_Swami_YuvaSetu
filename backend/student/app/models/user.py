# File: Yuva-setu/backend/app/models/user.py
from datetime import datetime
from typing import Optional, List, Dict, Any
from beanie import Document, Indexed
from pydantic import EmailStr, Field, BaseModel
from enum import Enum


class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"
    MODERATOR = "moderator"


class AuthProvider(str, Enum):
    EMAIL = "email"
    GOOGLE = "google"


# Proper Pydantic models for nested data - UPDATED TO MATCH FRONTEND
class EducationItem(BaseModel):
    """Education entry model - matches frontend"""
    id: Optional[int] = None
    institution: Optional[str] = None
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_year: Optional[str] = None  # Changed from start_date to start_year
    end_year: Optional[str] = None    # Changed from end_date to end_year
    score: Optional[str] = None       # Changed from grade to score


class ExperienceItem(BaseModel):
    """Work experience entry model - matches frontend"""
    id: Optional[int] = None
    type: Optional[str] = "Internship"  # Added type field
    company: Optional[str] = None       # Changed from position to company
    role: Optional[str] = None          # Added role field
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    # Removed is_current and location as they're not in frontend


class TrainingItem(BaseModel):
    """Training/certification entry model - matches frontend"""
    id: Optional[int] = None
    title: Optional[str] = None
    provider: Optional[str] = None      # Changed from organization to provider
    duration: Optional[str] = None      # Added duration
    description: Optional[str] = None
    credential_link: Optional[str] = None  # Changed from certificate_url to credential_link


class ProjectItem(BaseModel):
    """Project entry model - matches frontend"""
    id: Optional[int] = None
    title: Optional[str] = None
    role: Optional[str] = None          # Added role field
    technologies: Optional[str] = None  # Changed from List[str] to string
    description: Optional[str] = None
    # Removed start_date, end_date, url, github_url as they're not in frontend


class SkillItem(BaseModel):
    """Skill entry model - matches frontend"""
    id: Optional[int] = None
    name: Optional[str] = None
    level: Optional[str] = None         # Changed from proficiency to level, removed category


class PortfolioItem(BaseModel):
    """Portfolio entry model - matches frontend"""
    id: Optional[int] = None
    title: Optional[str] = None
    link: Optional[str] = None          # Changed from url to link
    description: Optional[str] = None
    # Removed image_url and category as they're not in frontend


class AccomplishmentItem(BaseModel):
    """Accomplishment/award entry model - matches frontend"""
    id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    credential_url: Optional[str] = None  # Changed from issuer/date to credential_url
    # Removed date and issuer as they're not in frontend


class User(Document):
    # Authentication fields
    email: Indexed(EmailStr, unique=True)
    phone: Optional[Indexed(str, unique=True)] = None
    username: Optional[Indexed(str, unique=True)] = None
    hashed_password: Optional[str] = None
    google_id: Optional[str] = None
    
    # Personal Information (from PersonalDetails component)
    full_name: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    contact_number: Optional[str] = None
    address: Optional[str] = None
    differently_abled: bool = False
    
    # Extended Profile (from MultiStepForm)
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = None
    location_query: Optional[str] = None
    location_coordinates: Optional[Dict[str, Any]] = None  # GeoJSON format
    languages: Optional[str] = None
    linkedin: Optional[str] = None
    career_objective: Optional[str] = None
    
    # Dynamic sections from MultiStepForm - UPDATED TO MATCH FRONTEND
    education: List[EducationItem] = []
    experience: List[ExperienceItem] = []
    trainings: List[TrainingItem] = []
    projects: List[ProjectItem] = []
    skills: List[SkillItem] = []
    portfolio: List[PortfolioItem] = []
    accomplishments: List[AccomplishmentItem] = []
    
    # Authentication & Status
    auth_provider: AuthProvider = AuthProvider.EMAIL
    is_active: bool = True
    is_verified: bool = False
    email_verified: bool = False
    phone_verified: bool = False
    is_superuser: bool = False
    role: UserRole = UserRole.USER
    profile_completed: bool = False
    
    # Consent and Legal
    agreed_to_terms: bool = False
    terms_agreed_at: Optional[datetime] = None
    
    # 2FA fields
    totp_secret: Optional[str] = None
    two_factor_enabled: bool = False
    two_factor_verified_at: Optional[datetime] = None
    backup_codes: Optional[List[str]] = []
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    profile_picture: Optional[str] = None
    
    class Settings:
        name = "users"
        indexes = [
            [("email", 1)],
            [("phone", 1)],
            [("username", 1)],
            [("google_id", 1)],
            [("created_at", -1)],
            [("location_coordinates", "2dsphere")]  # Geospatial index for location queries
        ]
