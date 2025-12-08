from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from beanie import Document, Indexed
from pydantic import Field
from enum import Enum
from app.config import settings

class OTPPurpose(str, Enum):
    SIGNUP = "signup"
    PASSWORD_RESET = "password_reset"
    EMAIL_VERIFICATION = "email_verification"
    PHONE_VERIFICATION = "phone_verification"

class OTPVerification(Document):
    identifier: Indexed(str)  # email or phone
    otp_code: str
    purpose: str
    attempts: int = 0
    is_verified: bool = False
    user_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime = Field(
        default_factory=lambda: datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
    )
    verified_at: Optional[datetime] = None
    metadata: Optional[Dict[str, Any]] = None   # <-- This fixes your ValueError

    class Settings:
        name = "otp_verifications"
        indexes = [
            [("identifier", 1), ("purpose", 1)],
            [("expires_at", 1)],
            [("created_at", -1)]
        ]

    @property
    def is_expired(self) -> bool:
        return datetime.utcnow() > self.expires_at

    @property
    def can_attempt(self) -> bool:
        return self.attempts < settings.OTP_MAX_ATTEMPTS

    def increment_attempts(self):
        self.attempts += 1
        return self.attempts
