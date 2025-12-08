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


class EducationItem(BaseModel):
    """Education entry model - matches frontend"""
    id: Optional[int] = None
    institution: Optional[str] = None
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_year: Optional[str] = None
    end_year: Optional[str] = None
    score: Optional[str] = None


class ExperienceItem(BaseModel):
    """Work experience entry model - matches frontend"""
    id: Optional[int] = None
    type: Optional[str] = "Internship"
    company: Optional[str] = None
    role: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None


class TrainingItem(BaseModel):
    """Training/certification entry model - matches frontend"""
    id: Optional[int] = None
    title: Optional[str] = None
    provider: Optional[str] = None
    duration: Optional[str] = None
    description: Optional[str] = None
    credential_link: Optional[str] = None


class ProjectItem(BaseModel):
    """Project entry model - matches frontend"""
    id: Optional[int] = None
    title: Optional[str] = None
    role: Optional[str] = None
    technologies: Optional[str] = None
    description: Optional[str] = None


class SkillItem(BaseModel):
    """Skill entry model - matches frontend"""
    id: Optional[int] = None
    name: Optional[str] = None
    level: Optional[str] = None


class PortfolioItem(BaseModel):
    """Portfolio entry model - matches frontend"""
    id: Optional[int] = None
    title: Optional[str] = None
    link: Optional[str] = None
    description: Optional[str] = None


class AccomplishmentItem(BaseModel):
    """Accomplishment/award entry model - matches frontend"""
    id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    credential_url: Optional[str] = None


class Student(Document):
    """
    Student Model - Replicated from Student Service (User model)
    Maps to 'users' collection.
    """
    # Authentication fields
    email: Indexed(EmailStr, unique=True)
    phone: Optional[Indexed(str, unique=True)] = None
    username: Optional[Indexed(str, unique=True)] = None
    hashed_password: Optional[str] = None
    google_id: Optional[str] = None
    
    # Personal Information
    full_name: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    contact_number: Optional[str] = None
    address: Optional[str] = None
    differently_abled: bool = False
    
    # Extended Profile
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = None
    location_query: Optional[str] = None
    location_coordinates: Optional[Dict[str, Any]] = None
    languages: Optional[str] = None
    linkedin: Optional[str] = None
    career_objective: Optional[str] = None
    
    # Dynamic sections
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
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    profile_picture: Optional[str] = None
    
    class Settings:
        name = "users"  # IMPORTANT: Map to the same collection as Student Service
