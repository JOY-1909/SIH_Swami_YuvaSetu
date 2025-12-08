# File: app/config.py
from typing import Optional, List
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Yuva Setu API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    FRONTEND_URL: str = "http://localhost:5173"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database URLs
    MONGODB_URL: str
    STUDENT_MONGODB_URL: Optional[str] = None
    EMPLOYER_MONGODB_URL: Optional[str] = None
    
    # Database Names
    DATABASE_NAME: str = "yuva_setu"
    STUDENT_DATABASE_NAME: str = "yuva_setu"
    EMPLOYER_DATABASE_NAME: str = "yuvasetu-main"  # Employer database name (path: yuvasetu-main.internships)
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    OTP_EXPIRE_MINUTES: int = 5
    OTP_MAX_ATTEMPTS: int = 3
    
    # Email Configuration
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str
    SMTP_PASSWORD: str
    SMTP_FROM: str
    SMTP_FROM_NAME: str = "Yuva Setu"
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/v1/auth/google/callback"
    
    # OpenAI / Gemini
    OPENAI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    
    # Firebase Admin SDK (optional)
# Add to Settings class in config.py
    FIREBASE_PROJECT_ID: Optional[str] = None
    FIREBASE_PRIVATE_KEY: Optional[str] = None
    FIREBASE_CLIENT_EMAIL: Optional[str] = None
    FIREBASE_DATABASE_URL: Optional[str] = None

    # SMS / Twilio
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_PHONE_NUMBER: Optional[str] = None
    
    # Redis (optional)
    REDIS_URL: str = "redis://localhost:6379"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    # Recommendation Settings
    RECOMMENDATION_MODEL: str = "all-MiniLM-L6-v2"
    EMBEDDING_DIMENSION: int = 384
    FAISS_INDEX_PATH: str = "/tmp/faiss_index.bin"
    RECOMMENDATION_CACHE_TTL: int = 3600
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()