# app/services/internship_service.py
import logging
from typing import Optional, List, Dict, Any
from datetime import datetime
from bson import ObjectId

from app.models.internship import Internship
from app.services.embedding_service import get_embedding_service
from app.services.faiss_service import get_faiss_service

logger = logging.getLogger(__name__)


class InternshipService:
    """
    Orchestration service for internship operations with semantic search capabilities.
    Coordinates between embedding generation, FAISS indexing, and MongoDB storage.
    """
    
    def __init__(self):
        self.embedding_service = get_embedding_service()
        self.faiss_service = get_faiss_service()
    
    def generate_embedding_for_internship(self, internship: Internship) -> List[float]:
        """
        Generate embedding vector for an internship document.
        
        Args:
            internship: Internship document
            
        Returns:
            384-dimensional embedding vector
        """
        return self.embedding_service.generate_internship_embedding(
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
    
    async def create_internship(
        self, internship_data: Dict[str, Any], check_duplicate: bool = True
    ) -> Dict[str, Any]:
        """
        Create a new internship with automatic embedding generation and duplicate detection.
        
        Args:
            internship_data: Dictionary containing internship fields
            check_duplicate: Whether to check for duplicates before insertion
            
        Returns:
            Dictionary with result status and data
            
        Raises:
            Exception if duplicate found or insertion fails
        """
        try:
            # Create internship instance
            internship = Internship(**internship_data)
            
            # Generate embedding
            logger.info(f"Generating embedding for internship: {internship.title}")
            embedding = self.generate_embedding_for_internship(internship)
            internship.embedding = embedding
            
            # Check for duplicates if requested
            if check_duplicate:
                duplicate = self.faiss_service.check_duplicate(embedding)
                if duplicate:
                    doc_id, distance = duplicate
                    logger.warning(
                        f"Duplicate internship detected! "
                        f"Similar to document {doc_id} with distance {distance:.4f}"
                    )
                    return {
                        "status": "duplicate",
                        "message": "Similar internship already exists",
                        "duplicate_id": doc_id,
                        "similarity_distance": distance,
                    }
            
            # Save to MongoDB
            await internship.insert()
            logger.info(f"Internship created with ID: {internship.id}")
            
            # Add to FAISS index
            self.faiss_service.add_vector(embedding, str(internship.id))
            self.faiss_service.save_index()
            
            return {
                "status": "success",
                "message": "Internship created successfully",
                "internship_id": str(internship.id),
                "internship": internship,
            }
        
        except Exception as e:
            logger.error(f"Error creating internship: {e}")
            raise
    
    async def update_internship(
        self, internship_id: str, update_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Update an existing internship and regenerate its embedding.
        
        Args:
            internship_id: MongoDB ObjectId as string
            update_data: Dictionary containing fields to update
            
        Returns:
            Dictionary with result status and data
        """
        try:
            # Fetch existing internship
            internship = await Internship.get(ObjectId(internship_id))
            if not internship:
                return {
                    "status": "error",
                    "message": "Internship not found",
                }
            
            # Update fields
            for key, value in update_data.items():
                if hasattr(internship, key):
                    setattr(internship, key, value)
            
            internship.updated_at = datetime.utcnow()
            
            # Regenerate embedding
            logger.info(f"Regenerating embedding for internship: {internship_id}")
            new_embedding = self.generate_embedding_for_internship(internship)
            internship.embedding = new_embedding
            
            # Save to MongoDB
            await internship.save()
            logger.info(f"Internship updated: {internship_id}")
            
            # Update FAISS index (remove old, add new)
            self.faiss_service.remove_vector(internship_id)
            self.faiss_service.add_vector(new_embedding, internship_id)
            self.faiss_service.save_index()
            
            return {
                "status": "success",
                "message": "Internship updated successfully",
                "internship_id": internship_id,
                "internship": internship,
            }
        
        except Exception as e:
            logger.error(f"Error updating internship: {e}")
            raise
    
    async def delete_internship(self, internship_id: str) -> Dict[str, Any]:
        """
        Delete an internship and remove it from FAISS index.
        
        Args:
            internship_id: MongoDB ObjectId as string
            
        Returns:
            Dictionary with result status
        """
        try:
            # Fetch internship
            internship = await Internship.get(ObjectId(internship_id))
            if not internship:
                return {
                    "status": "error",
                    "message": "Internship not found",
                }
            
            # Delete from MongoDB
            await internship.delete()
            logger.info(f"Internship deleted: {internship_id}")
            
            # Remove from FAISS index
            self.faiss_service.remove_vector(internship_id)
            self.faiss_service.save_index()
            
            return {
                "status": "success",
                "message": "Internship deleted successfully",
            }
        
        except Exception as e:
            logger.error(f"Error deleting internship: {e}")
            raise
    
    async def search_similar_internships(
        self, query: str, top_k: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Semantic search for internships using natural language query.
        
        Args:
            query: Natural language search query
            top_k: Number of results to return
            
        Returns:
            List of internship documents with similarity scores
        """
        try:
            # Generate embedding for query
            logger.info(f"Searching for: {query}")
            query_embedding = self.embedding_service.generate_embedding(query)
            
            # Search FAISS index
            results = self.faiss_service.search(query_embedding, k=top_k)
            
            if not results:
                logger.info("No results found")
                return []
            
            # Fetch full documents from MongoDB
            internships = []
            for doc_id, distance in results:
                try:
                    internship = await Internship.get(ObjectId(doc_id))
                    if internship:
                        internships.append({
                            "internship": internship,
                            "similarity_score": float(distance),
                            "similarity_percentage": max(0, 100 * (1 - distance / 2)),
                        })
                except Exception as e:
                    logger.warning(f"Could not fetch internship {doc_id}: {e}")
                    continue
            
            logger.info(f"Found {len(internships)} similar internships")
            return internships
        
        except Exception as e:
            logger.error(f"Error searching internships: {e}")
            raise
    
    async def get_internship_by_id(self, internship_id: str) -> Optional[Internship]:
        """
        Fetch internship by ID.
        
        Args:
            internship_id: MongoDB ObjectId as string
            
        Returns:
            Internship document or None
        """
        try:
            return await Internship.get(ObjectId(internship_id))
        except Exception as e:
            logger.error(f"Error fetching internship: {e}")
            return None
    
    async def list_internships(
        self, skip: int = 0, limit: int = 20, is_active: Optional[bool] = None
    ) -> List[Internship]:
        """
        List internships with pagination and filtering.
        
        Args:
            skip: Number of documents to skip
            limit: Maximum number of documents to return
            is_active: Filter by active status (None = all)
            
        Returns:
            List of internship documents
        """
        try:
            query = {}
            if is_active is not None:
                query["is_active"] = is_active
            
            internships = await Internship.find(query).skip(skip).limit(limit).to_list()
            return internships
        except Exception as e:
            logger.error(f"Error listing internships: {e}")
            raise


# Global singleton instance
_internship_service = None


def get_internship_service() -> InternshipService:
    """Get or create the global internship service instance."""
    global _internship_service
    if _internship_service is None:
        _internship_service = InternshipService()
    return _internship_service
