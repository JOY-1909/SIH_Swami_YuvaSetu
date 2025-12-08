from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import sys
import asyncio
import firebase_admin
from firebase_admin import credentials
import os
from pathlib import Path

from app.config import settings
from app.database import init_database, close_mongo_connection
from app.api.v1 import auth, resume, profile, recommendations, internships, applications, map as map_routes
from app.api.v1 import test_recommendations
from app.api.v1.endpoints import chat, guidelines, support
from app.api.v1 import db_diagnostic
from app.services.otp import OTPService
from app.database.multi_cluster import multi_db
from app.api.v1.feedback import router as feedback_router

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)

logger = logging.getLogger(__name__)

# Improved Firebase initialization
def initialize_firebase():
    try:
        if firebase_admin._apps:
            logger.info("Firebase already initialized")
            return True
        
        # Method 1: Try service account JSON file
        possible_paths = [
            Path("firebase-adminsdk.json"),
            Path("./firebase-adminsdk.json"),
            Path("../firebase-adminsdk.json"),
            Path("app/firebase-adminsdk.json"),
            Path("backend/firebase-adminsdk.json"),
        ]
        
        cred_path = None
        for path in possible_paths:
            if path.exists():
                cred_path = path
                break
        
        if cred_path:
            cred = credentials.Certificate(str(cred_path))
            firebase_admin.initialize_app(cred)
            logger.info(f"✅ Firebase Admin SDK initialized with file: {cred_path}")
            return True
        
        # Method 2: Try environment variables
        firebase_config = {
            "type": "service_account",
            "project_id": "yuvasetu-26ba4",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDEWQ1Leg7Xngwx\nNd1lp4cLSU5vmpogkMMzaT/cE54aS3+exWgFG4J815yqBWDNuFzL4rQTVYkpPAuS\nbZOdBF1yptMySNlcAhgjZO7KDAucIUn7YPoACDFkp8SXKVCA/S+qzVf8/zzUwt/R\n5Y1kpcFHkifk2pAeh7lgVtcVfy3oThfwfR2pFUky0Pk6ypIIvDH0Caw7TsSIS3vt\n48ofa6GXNWeYmH/d2AAImMobU1FMXP+vN5ByqB6nzIxlPovwraqz+19nvz4Hz8sw\n0QqaSY+4VHvd1x5TZxphUoc8JXYEvxqKNO9bHgMBwD/yTsxk+AOUSOHI2YSZA7OS\nLu1VOd8RAgMBAAECggEAJGMRcuuZjQ1Z2pPOJgzUGrwY2FdpGUBioGgwoLcU/XAA\n5FpWkt28gqjNfHe3LyCrt9AZSZz4KIdbaKU8biSVMc5nRMIZ3/J2aTbHBvQRAbvs\nkzSvV+qsxqfNp6rNI75oA0n/NKBTdGVx55rYJ28NYNdd48w6WaIS8V7eiLoTNqHQ\n42DqUTkQhn5+fiEKthzC1ZRiOdmMSfPsLyN5E9x+efQlNRaQlPP46QfME9i6o1cY\nu/Mge2Blb4B6AK+6riI1WxhnyD1hd1BU4GcHCIlL3e+3Lp06pKQ3B2H+KEwbpa3h\nnUGhf7Olv6iBuPCGUye98ao9N1yeVJSIEmqfMHeTLQKBgQD05g+kOjWuchMkDdwG\nH/d0PmIS12/vRJu9w89FJk2cP+RQEhw79q0XViUD5hEOuWkhGzg1norHAKKT34ke\nBf8pG6lEXZG4cCIUo7J9wNMBi42QFc64cCoFC5pA92Q2o0RHnTBBPjPTfb8rARxd\nAc7LCzB8N5IRXKiOqb1xEWQbjQKBgQDNP5SYvJCeh6lO34gtp6Mw4ly6bjgmJY5X\nbucF2UWZPh1+jPdr7MNCgt/XA87k5VI+2hB4w8rIddvOtdNKGOMuTalYeXDgz0AP\nbt5ugYyt0aTJo2aYqD+9qczgqQdgPFLWcWkaEYeLw2GIa5O8rr2iuAsKezGdiJdE\nOzVB6yyulQKBgGdBWPb1VAzpLAjXjx1F/R+V7ePj0d4gH0ozdQDC1ZY7mhfoit79\ncp2URKcQKcD7i8fZoil5XynoqqOObFGsVZkPgJ7ClN4e6T+qhWdgFZdhL57AkxhQ\nsmbOLYuWwzoGPJO1QtM/VrqlGiUXos3UJUyWuyqkg4Guf6MnDijOHFdBAoGABdTW\nnfhNi5ODJfCH5/QpWMw1oj5bbgoHH0jRW4MuzQnMwLm0leZmLc+WGH/NMweo7Iw5\nh5TYgBWJJzhXRnWqjrg6JX9dy6VXxph5zV3050NbkTcJRTESjoryfTeQNBXCrMEQ\nIWN6HGhyrvOPgP7d+G+OMMALStSEp7We776EyHkCgYB8EABpw4x7Omr/Rh0AkcaN\nDzJbmwh4lxaGd1XLlr9QUo/jzsgKe59M7PvqOugPZT/25PtEIWU7xNiapwLTL15H\nAshfuNOq3l2n9TUlCzWYdcruS+mY1tyDS/xakbmzBTNMsACPmfAzFCO09S+fQS3u\nUREFTod145iqCS3VvO7vgw\n-----END PRIVATE KEY-----\n",
            "client_email": "firebase-adminsdk-fbsvc@yuvasetu-26ba4.iam.gserviceaccount.com",
            "token_uri": "https://oauth2.googleapis.com/token",
        }
        
        # Clean the private key
        private_key = firebase_config["private_key"].replace('\\\\n', '\n').replace('\\n', '\n')
        firebase_config["private_key"] = private_key
        
        cred = credentials.Certificate(firebase_config)
        firebase_admin.initialize_app(cred)
        logger.info("✅ Firebase Admin SDK initialized with environment config")
        return True
        
    except Exception as e:
        logger.error(f"❌ Firebase initialization failed: {e}")
        logger.info("📱 Firebase Admin features disabled. Using mock mode for SMS.")
        return False

# Initialize Firebase
firebase_initialized = initialize_firebase()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting Yuva Setu API...")
    
    # Initialize database
    try:
        await init_database()
        logger.info("✅ Database initialized successfully")
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {e}")
        # Don't raise to allow app to start for testing
    
    # Initialize multi-cluster database
    try:
        await multi_db.connect_all()
        logger.info("✅ Multi-cluster database connected")
    except Exception as e:
        logger.error(f"❌ Multi-cluster database connection failed: {e}")
    
    # OTP cleanup task
    async def cleanup_task():
        while True:
            await asyncio.sleep(3600)  # Run every hour
            try:
                await OTPService.cleanup_expired_otps()
            except Exception as e:
                logger.error(f"OTP cleanup failed: {e}")
    
    cleanup = asyncio.create_task(cleanup_task())
    
    yield
    
    logger.info("🛑 Shutting down...")
    cleanup.cancel()
    try:
        await close_mongo_connection()
    except Exception as e:
        logger.error(f"Error closing MongoDB connection: {e}")
    try:
        await multi_db.close_all()
    except Exception as e:
        logger.error(f"Error closing multi-cluster connections: {e}")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan
)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"📨 Incoming request: {request.method} {request.url.path}")
    if request.url.path.startswith("/api/v1/recommendations"):
        logger.info(f"   Query params: {request.url.query}")
        logger.info(f"   Headers: Authorization={'present' if 'authorization' in request.headers else 'missing'}")
    start_time = asyncio.get_event_loop().time()
    try:
        response = await call_next(request)
        process_time = asyncio.get_event_loop().time() - start_time
        logger.info(f"✅ Request completed: {request.method} {request.url.path} - {response.status_code} ({process_time:.2f}s)")
        return response
    except Exception as e:
        process_time = asyncio.get_event_loop().time() - start_time
        logger.error(f"❌ Request failed: {request.method} {request.url.path} - {type(e).__name__} ({process_time:.2f}s)")
        raise

# CORS Configuration - MUST be before exception handlers
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:8081",
        "http://127.0.0.1:8081",
        "http://localhost:8082",
        "http://127.0.0.1:8082",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"❌ Unhandled exception: {exc}", exc_info=True)
    import traceback
    logger.error(f"Traceback: {traceback.format_exc()}")
    response = JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error",
            "detail": str(exc) if settings.DEBUG else None
        }
    )
    # Ensure CORS headers are present even on errors
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

# Include all routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(test_recommendations.router, prefix="/api/v1", tags=["Testing"])
app.include_router(resume.router, prefix="/api/v1")
app.include_router(profile.router, prefix="/api/v1")
app.include_router(recommendations.router, prefix="/api/v1")
app.include_router(internships.router, prefix="/api/v1")
app.include_router(applications.router, prefix="/api/v1")
app.include_router(map_routes.router, prefix="/api/v1")
app.include_router(feedback_router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chatbot"])
app.include_router(guidelines.router, prefix="/api/v1/guidelines", tags=["Guidelines"])
app.include_router(support.router, prefix="/api/v1/support", tags=["Support"])
app.include_router(db_diagnostic.router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    firebase_status = "initialized" if firebase_initialized else "disabled"
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "firebase": firebase_status,
        "debug": settings.DEBUG
    }

@app.get("/")
async def root():
    return {
        "message": "Welcome to Yuva Setu API",
        "documentation": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)