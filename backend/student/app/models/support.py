from beanie import Document
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class SupportTicket(Document):
    user_id: str
    user_email: str
    user_name: str
    subject: str
    message: str
    category: str = "General"
    status: str = "Open"  # Open, Sales, Tech, Resolved
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    resolution: Optional[str] = None
    
    class Settings:
        name = "support_tickets"

class TicketCreate(BaseModel):
    subject: str
    message: str
    category: str = "General"

class TicketResponse(BaseModel):
    id: str
    subject: str
    message: str
    status: str
    created_at: datetime
    resolution: Optional[str] = None
