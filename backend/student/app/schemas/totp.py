from typing import List

from pydantic import BaseModel, EmailStr, Field


class Verify2FARequest(BaseModel):
    token: str = Field(..., min_length=6, max_length=6)


class Login2FARequest(BaseModel):
    email: EmailStr
    token: str = Field(..., min_length=6, max_length=6)


class Enable2FAResponse(BaseModel):
    success: bool
    message: str
    qr_code: str
    secret: str
    backup_codes: List[str]


class Verify2FAResponse(BaseModel):
    success: bool
    message: str
    two_factor_enabled: bool

