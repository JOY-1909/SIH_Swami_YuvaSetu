from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path

# BASE_DIR is the backend/employer-admin directory
BASE_DIR = Path(__file__).parent.parent.resolve()

class Settings(BaseSettings):
    MONGODB_URI: str
    MONGODB_DB: str
    STUDENT_MONGODB_URI: str | None = None
    FIREBASE_SERVICE_ACCOUNT_PATH: str
    FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH: str
    
    class Config:
        env_file = ".env"
        extra = "ignore"

@lru_cache()
def get_settings() -> "Settings":
    return Settings()

settings = get_settings()
