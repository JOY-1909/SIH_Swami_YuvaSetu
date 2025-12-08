# app/models/application.py
from datetime import datetime
from typing import Literal
from beanie import Document, Indexed
from pydantic import Field

# Allowed statuses for a student's application
ApplicationStatus = Literal[
    "applied",
    "under_review",
    "shortlisted",
    "rejected",
    "selected",
]

class Application(Document):
    """
    Represents a student's application to an internship.
    """
    internship_id: Indexed(str)  # Internship document id as string
    student_uid: Indexed(str)  # Firebase UID of the student
    employer_uid: Indexed(str)  # Firebase UID of the internship owner
    status: ApplicationStatus = "applied"
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "applications"
        indexes = [
            [("internship_id", 1)],
            [("student_uid", 1)],
            [("employer_uid", 1)],
        ]
