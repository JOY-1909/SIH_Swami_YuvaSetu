# app/models/internship.py
from datetime import datetime
from typing import Optional, List, Union
from beanie import Document, PydanticObjectId
from pydantic import Field


class Internship(Document):
    id: Optional[Union[str, PydanticObjectId]] = None  # Handle mixed ID types
    owner_uid: str
    organisation_name: str
    title: str

    # Structured content
    description: str  # high-level overview
    responsibilities: Optional[str] = None
    requirements: Optional[str] = None
    perks: Optional[str] = None
    skills: Optional[List[str]] = None

    # Location
    location: str
    state: Optional[str] = None
    city: Optional[str] = None

    # Other meta
    stipend: Optional[int] = None
    sector: Optional[str] = None

    # Vector embedding for semantic search
    embedding: Optional[List[float]] = None

    # Duration
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    duration_days: Optional[int] = None
    duration_weeks: Optional[float] = None
    duration_months: Optional[float] = None

    # Status
    status: str = "active"  # active, closed, rejected
    is_active: bool = True
    closed_at: Optional[datetime] = None

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "internships"
        indexes = [
            [("owner_uid", 1)],
            [("created_at", -1)],
            [("is_active", 1)],
        ]
#sdd