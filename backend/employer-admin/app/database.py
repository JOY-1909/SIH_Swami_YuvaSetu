# app/database.py
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import settings, BASE_DIR
from app.models.internship import Internship
from app.models.employer_profile import EmployerProfile
from app.models.application import Application
from app.models.student import Student
import firebase_admin
from firebase_admin import credentials
import os

client: AsyncIOMotorClient | None = None
student_client: AsyncIOMotorClient | None = None

async def init_db() -> None:
    global client
    
    # ✅ Initialize BOTH Firebase projects
    if not firebase_admin._apps:
        # Employer Firebase project
        employer_cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_PATH)
        firebase_admin.initialize_app(employer_cred, name='employer')
        
        # Admin Firebase project
        admin_service_account_path = BASE_DIR / "yuvasetu-admin-firebase-adminsdk.json"
        if admin_service_account_path.exists():
            admin_cred = credentials.Certificate(str(admin_service_account_path))
            firebase_admin.initialize_app(admin_cred, name='admin')
        else:
            print(f"WARNING: Admin Firebase service account not found at {admin_service_account_path}")
    
    # Initialize MongoDB
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB]
    
    # Initialize Student MongoDB (Cross-Cluster)
    global student_client
    if settings.STUDENT_MONGODB_URI:
        student_client = AsyncIOMotorClient(settings.STUDENT_MONGODB_URI)
        print(f"Connected to Student Cluster: {settings.STUDENT_MONGODB_URI[:20]}...")
    else:
        print("WARNING: STUDENT_MONGODB_URI not set. Student data fetch may fail if in different cluster.")
    
    await init_beanie(
        database=db,
        document_models=[
            Internship,
            EmployerProfile,
            Application,
            Student,  # Added Student model
        ],
    )

async def close_db() -> None:
    global client
    if client is not None:
        client.close()
        client = None
    if student_client is not None:
        student_client.close()
        student_client = None
