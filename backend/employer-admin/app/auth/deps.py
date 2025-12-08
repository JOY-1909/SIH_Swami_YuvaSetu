# app/auth/deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from app.config import settings

# ✅ UPDATED: Initialize BOTH Firebase Admin apps with names
if not firebase_admin._apps:
    # Employer Firebase app
    employer_cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(employer_cred, name='employer')
    
    # Admin Firebase app
    admin_cred = credentials.Certificate(settings.FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(admin_cred, name='admin')

# Only accept "Bearer" tokens
security = HTTPBearer(auto_error=True)

class EmployerUser:
    """
    Represents the authenticated employer from Firebase.
    """
    def __init__(self, uid: str, email: str | None):
        self.uid = uid
        self.email = email

async def get_current_employer(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> EmployerUser:
    """
    Verify Firebase ID token from Authorization header and return EmployerUser.
    Expects header: Authorization: Bearer <token>
    """
    if credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid auth scheme",
        )

    token = credentials.credentials
    try:
        # ✅ UPDATED: Use the employer Firebase app
        employer_app = firebase_admin.get_app('employer')
        decoded = firebase_auth.verify_id_token(token, app=employer_app)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    uid = decoded.get("uid")
    email = decoded.get("email")
    if not uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    return EmployerUser(uid=uid, email=email)

# You can now use get_current_employer as a dependency in your FastAPI routes to protect endpoints and access the authenticated employer's info.
