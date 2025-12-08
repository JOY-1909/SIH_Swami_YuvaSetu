"""
Database Diagnostic Endpoint
Helps verify database connections and collection status
"""
from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.models.user import User
from app.models.otp import OTPVerification
from app.database import get_database
from app.database.multi_cluster import multi_db
from app.config import settings
import logging

router = APIRouter(prefix="/diagnostic", tags=["Diagnostics"])
logger = logging.getLogger(__name__)


@router.get("/db-status")
async def get_database_status():
    """
    Diagnostic endpoint to check database connections and collection status
    """
    try:
        # Check student database connection
        student_db = await get_database()
        student_db_name = student_db.name
        
        # Count documents in collections
        user_count = await User.count()
        otp_count = await OTPVerification.count()
        
        # List all collections
        collections = await student_db.list_collection_names()
        
        # Get detailed collection info
        collection_info = {}
        for coll_name in collections:
            coll = student_db[coll_name]
            count = await coll.count_documents({})
            collection_info[coll_name] = {
                "document_count": count,
                "exists": True
            }
        
        # Check employer database
        employer_status = {}
        try:
            employer_db = await multi_db.get_employer_database()
            employer_db_name = employer_db.name
            employer_collections = await employer_db.list_collection_names()
            
            employer_collection_info = {}
            for coll_name in employer_collections:
                coll = employer_db[coll_name]
                count = await coll.count_documents({})
                employer_collection_info[coll_name] = {
                    "document_count": count,
                    "exists": True
                }
            
            employer_status = {
                "connected": True,
                "database_name": employer_db_name,
                "collections": employer_collection_info
            }
        except Exception as e:
            employer_status = {
                "connected": False,
                "error": str(e)
            }
        
        return {
            "success": True,
            "student_database": {
                "connected": True,
                "database_name": student_db_name,
                "collections": collection_info,
                "model_counts": {
                    "users": user_count,
                    "otp_verifications": otp_count
                },
                "config": {
                    "MONGODB_URL": settings.MONGODB_URL[:50] + "..." if len(settings.MONGODB_URL) > 50 else settings.MONGODB_URL,
                    "DATABASE_NAME": settings.DATABASE_NAME,
                    "STUDENT_MONGODB_URL": "Not set" if not settings.STUDENT_MONGODB_URL else settings.STUDENT_MONGODB_URL[:50] + "...",
                    "STUDENT_DATABASE_NAME": settings.STUDENT_DATABASE_NAME
                }
            },
            "employer_database": employer_status
        }
    except Exception as e:
        logger.error(f"Database diagnostic error: {e}", exc_info=True)
        return {
            "success": False,
            "error": str(e)
        }


@router.get("/create-test-user")
async def create_test_user():
    """
    Create a test user for debugging (only in development)
    """
    if not settings.DEBUG:
        return {"success": False, "error": "This endpoint is only available in DEBUG mode"}
    
    try:
        from datetime import datetime
        from app.models.user import AuthProvider
        from app.utils.security import get_password_hash
        
        test_email = f"test_{datetime.now().timestamp()}@test.com"
        
        # Check if test user already exists
        existing = await User.find_one(User.email == test_email)
        if existing:
            return {
                "success": True,
                "message": "Test user already exists",
                "user_id": str(existing.id),
                "email": existing.email
            }
        
        # Create test user
        test_user = User(
            email=test_email,
            hashed_password=get_password_hash("testpassword123"),
            auth_provider=AuthProvider.EMAIL,
            email_verified=True,
            is_verified=True,
            agreed_to_terms=True,
            terms_agreed_at=datetime.utcnow()
        )
        
        await test_user.insert()
        
        return {
            "success": True,
            "message": "Test user created",
            "user_id": str(test_user.id),
            "email": test_user.email
        }
    except Exception as e:
        logger.error(f"Error creating test user: {e}", exc_info=True)
        return {
            "success": False,
            "error": str(e)
        }
