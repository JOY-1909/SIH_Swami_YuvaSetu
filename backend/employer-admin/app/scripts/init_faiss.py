# app/scripts/init_faiss.py
"""
Script to initialize FAISS index with embeddings for existing internship documents.
Run this script after installing dependencies to build the initial FAISS index.

Usage:
    python -m app.scripts.init_faiss
"""
import asyncio
import logging
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from app.database import init_db
from app.models.internship import Internship
from app.services.embedding_service import get_embedding_service
from app.services.faiss_service import get_faiss_service

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


async def initialize_faiss_index():
    """
    Initialize FAISS index with embeddings from existing internship documents.
    """
    try:
        # Initialize database connection
        logger.info("Connecting to database...")
        await init_db()
        logger.info("Database connected")
        
        # Get services
        embedding_service = get_embedding_service()
        faiss_service = get_faiss_service()
        
        # Fetch all internships from MongoDB
        logger.info("Fetching all internships from database...")
        internships = await Internship.find_all().to_list()
        total_count = len(internships)
        logger.info(f"Found {total_count} internships")
        
        if total_count == 0:
            logger.warning("No internships found in database. Nothing to index.")
            return
        
        # Generate embeddings for internships that don't have them
        embeddings_to_add = []
        doc_ids_to_add = []
        update_count = 0
        
        for i, internship in enumerate(internships, 1):
            logger.info(f"Processing internship {i}/{total_count}: {internship.title}")
            
            try:
                # Generate embedding if missing
                if not internship.embedding or len(internship.embedding) == 0:
                    logger.info(f"  Generating new embedding...")
                    embedding = embedding_service.generate_internship_embedding(
                        skills=internship.skills,
                        location=internship.location,
                        state=internship.state,
                        city=internship.city,
                        sector=internship.sector,
                        stipend=internship.stipend,
                        duration_days=internship.duration_days,
                        duration_weeks=internship.duration_weeks,
                        duration_months=internship.duration_months,
                    )
                    
                    # Update document with embedding
                    internship.embedding = embedding
                    await internship.save()
                    update_count += 1
                    logger.info(f"  Embedding generated and saved")
                else:
                    embedding = internship.embedding
                    logger.info(f"  Using existing embedding")
                
                # Add to batch
                embeddings_to_add.append(embedding)
                doc_ids_to_add.append(str(internship.id))
            
            except Exception as e:
                logger.error(f"  Error processing internship {internship.id}: {e}")
                continue
        
        # Build FAISS index
        if embeddings_to_add:
            logger.info(f"\nBuilding FAISS index with {len(embeddings_to_add)} vectors...")
            faiss_service.rebuild_index(embeddings_to_add, doc_ids_to_add)
            logger.info("FAISS index built successfully")
        else:
            logger.warning("No embeddings to add to FAISS index")
        
        # Summary
        logger.info("\n" + "="*60)
        logger.info("INITIALIZATION COMPLETE")
        logger.info("="*60)
        logger.info(f"Total internships processed: {total_count}")
        logger.info(f"New embeddings generated: {update_count}")
        logger.info(f"FAISS index size: {faiss_service.get_index_size()}")
        logger.info(f"Index saved to: {faiss_service.index_path}")
        logger.info("="*60)
    
    except Exception as e:
        logger.error(f"Error initializing FAISS index: {e}", exc_info=True)
        raise


async def verify_index():
    """
    Verify the FAISS index by performing a test search.
    """
    try:
        logger.info("\nVerifying FAISS index...")
        
        # Get services
        embedding_service = get_embedding_service()
        faiss_service = get_faiss_service()
        
        # Test query
        test_query = "python developer remote internship"
        logger.info(f"Test query: '{test_query}'")
        
        # Generate embedding
        query_embedding = embedding_service.generate_embedding(test_query)
        
        # Search
        results = faiss_service.search(query_embedding, k=5)
        
        logger.info(f"Found {len(results)} results:")
        for i, (doc_id, distance) in enumerate(results, 1):
            logger.info(f"  {i}. Document ID: {doc_id}, Distance: {distance:.4f}")
        
        logger.info("\nVerification complete!")
    
    except Exception as e:
        logger.error(f"Error verifying index: {e}", exc_info=True)


async def main():
    """Main entry point."""
    try:
        logger.info("Starting FAISS index initialization...")
        logger.info("="*60)
        
        await initialize_faiss_index()
        await verify_index()
        
        logger.info("\nScript completed successfully!")
    
    except Exception as e:
        logger.error(f"Script failed: {e}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
