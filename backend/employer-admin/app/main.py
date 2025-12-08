# app/main.py
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db, close_db
from app.api.routes_internship import router as internships_router
from app.api.routes_applications import router as applications_router
from app.api.routes_employer_profile import router as employer_profile_router
from app.api.routes_admin import router as admin_router
from app.api.routes_internship_semantic import router as internships_semantic_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting application...")
    await init_db()
    
    # Initialize FAISS service and embedding service
    try:
        from app.services.faiss_service import get_faiss_service
        from app.services.embedding_service import get_embedding_service
        
        logger.info("Initializing embedding service...")
        embedding_service = get_embedding_service()
        logger.info(f"Embedding service ready (device: {embedding_service.device})")
        
        logger.info("Initializing FAISS service...")
        faiss_service = get_faiss_service()
        logger.info(f"FAISS service ready (index size: {faiss_service.get_index_size()})")
        
        if faiss_service.get_index_size() == 0:
            logger.warning(
                "FAISS index is empty. Run 'python -m app.scripts.init_faiss' "
                "to initialize the index with existing data."
            )
    except Exception as e:
        logger.error(f"Error initializing vector search services: {e}")
        # Don't fail startup - services can still work without embeddings
    
    logger.info("Application started successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down application...")
    
    # Save FAISS index on shutdown
    try:
        from app.services.faiss_service import get_faiss_service
        faiss_service = get_faiss_service()
        faiss_service.save_index()
        logger.info("FAISS index saved")
    except Exception as e:
        logger.error(f"Error saving FAISS index: {e}")
    
    await close_db()
    logger.info("Application shutdown complete")

app = FastAPI(
    title="YuvaSetu Employer Backend",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8082",      # Employer Portal
        "http://127.0.0.1:8082",
        "http://localhost:8081",      # Admin Portal
        "http://127.0.0.1:8081",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(internships_router)
app.include_router(internships_semantic_router)  # Semantic search routes
app.include_router(applications_router)
app.include_router(employer_profile_router)
app.include_router(admin_router, prefix="/api")

@app.get("/health")
async def health():
    return {"status": "ok"}
