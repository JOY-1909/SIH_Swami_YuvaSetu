"""
Internship model for recommendation system
"""
from datetime import datetime
from typing import List, Optional, Dict, Any
from beanie import Document, Indexed
from pydantic import Field, BaseModel
from enum import Enum


class WorkType(str, Enum):
    WFH = "WFH"
    WFO = "WFO"
    HYBRID = "Hybrid"


class InternshipStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    CLOSED = "closed"
    ARCHIVED = "archived"


class Internship(Document):
    """Internship listing document"""
    
    # Basic information
    title: Indexed(str)
    company: str
    company_description: Optional[str] = None
    company_logo: Optional[str] = None
    
    # Internship details
    description: str
    responsibilities: List[str] = []
    requirements: List[str] = []
    skills: List[str] = []  # Required skills
    
    # Location and work type
    location: str
    work_type: WorkType = WorkType.WFO
    is_remote: bool = False
    
    # Duration and stipend
    duration: str  # e.g., "3 months", "6 months"
    duration_months: Optional[int] = None
    stipend: Optional[float] = None
    stipend_currency: str = "INR"
    stipend_period: str = "monthly"  # monthly, weekly, one-time
    
    # Application details
    application_deadline: Optional[datetime] = None
    start_date: Optional[datetime] = None
    positions_available: int = 1
    applications_received: int = 0
    
    # Category and tags
    category: Optional[str] = None  # e.g., "Software Development", "Marketing"
    tags: List[str] = []
    
    # Status and metadata
    status: InternshipStatus = InternshipStatus.ACTIVE
    is_active: bool = True
    is_featured: bool = False
    is_verified: bool = False
    
    # SEO and visibility
    slug: Optional[Indexed(str, unique=True)] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    
    # Contact information
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    apply_url: Optional[str] = None
    
    # Statistics
    views: int = 0
    saves: int = 0
    applications: int = 0
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    published_at: Optional[datetime] = None
    
    # Embedding vector for AI matching (optional)
    embedding: Optional[List[float]] = None
    
    class Settings:
        name = "internships"
        indexes = [
            [("title", "text"), ("description", "text"), ("company", "text")],
            [("category", 1)],
            [("location", 1)],
            [("work_type", 1)],
            [("stipend", 1)],
            [("created_at", -1)],
            [("is_active", 1), ("status", 1)],
        ]
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for API response"""
        return {
            "id": str(self.id),
            "title": self.title,
            "company": self.company,
            "description": self.description,
            "location": self.location,
            "work_type": self.work_type,
            "duration": self.duration,
            "stipend": self.stipend,
            "requirements": self.requirements,
            "skills": self.skills,
            "responsibilities": self.responsibilities,
            "is_remote": self.is_remote,
            "application_deadline": self.application_deadline.isoformat() if self.application_deadline else None,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "category": self.category,
            "tags": self.tags,
            "views": self.views,
            "saves": self.saves,
            "applications": self.applications,
            "created_at": self.created_at.isoformat(),
            "is_featured": self.is_featured,
            "is_verified": self.is_verified,
            "apply_url": self.apply_url,
        }


class InternshipApplication(BaseModel):
    """Internship application model"""
    user_id: str
    internship_id: str
    status: str = "applied"  # applied, reviewed, shortlisted, rejected, accepted
    applied_at: datetime = Field(default_factory=datetime.utcnow)
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    notes: Optional[str] = None