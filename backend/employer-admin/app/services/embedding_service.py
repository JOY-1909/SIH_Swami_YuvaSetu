# app/services/embedding_service.py
import logging
from typing import List, Optional
from sentence_transformers import SentenceTransformer
import torch

logger = logging.getLogger(__name__)


class EmbeddingService:
    """
    Service for generating semantic embeddings using sentence-transformers.
    Uses all-MiniLM-L6-v2 model (384 dimensions).
    """
    
    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.model = None
        self.dimension = 384  # all-MiniLM-L6-v2 dimension
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"EmbeddingService initialized with device: {self.device}")
    
    def load_model(self):
        """Load the sentence transformer model."""
        if self.model is None:
            logger.info(f"Loading embedding model: {self.model_name}")
            self.model = SentenceTransformer(self.model_name, device=self.device)
            logger.info("Embedding model loaded successfully")
    
    def build_internship_text(
        self,
        skills: Optional[List[str]] = None,
        location: Optional[str] = None,
        state: Optional[str] = None,
        city: Optional[str] = None,
        sector: Optional[str] = None,
        stipend: Optional[str] = None,
        duration_days: Optional[int] = None,
        duration_weeks: Optional[float] = None,
        duration_months: Optional[float] = None,
    ) -> str:
        """
        Build combined text string from internship metadata.
        Format: "skills | location, state, city | sector | stipend | duration_in_months"
        """
        parts = []
        
        # Skills
        if skills and len(skills) > 0:
            parts.append(" ".join(skills))
        
        # Location
        location_parts = []
        if location:
            location_parts.append(location)
        if city:
            location_parts.append(city)
        if state:
            location_parts.append(state)
        if location_parts:
            parts.append(", ".join(location_parts))
        
        # Sector
        if sector:
            parts.append(sector)
        
        # Stipend
        if stipend:
            parts.append(stipend)
        
        # Duration (normalize to months)
        duration_in_months = self._normalize_duration(
            duration_days, duration_weeks, duration_months
        )
        if duration_in_months:
            parts.append(f"{duration_in_months:.1f} months")
        
        combined_text = " | ".join(parts) if parts else "no information"
        return combined_text
    
    def _normalize_duration(
        self,
        duration_days: Optional[int] = None,
        duration_weeks: Optional[float] = None,
        duration_months: Optional[float] = None,
    ) -> Optional[float]:
        """
        Normalize duration to months.
        Priority: duration_months > duration_weeks > duration_days
        """
        if duration_months is not None:
            return duration_months
        elif duration_weeks is not None:
            return duration_weeks / 4.0
        elif duration_days is not None:
            return duration_days / 30.0
        return None
    
    def generate_embedding(self, text: str) -> List[float]:
        """
        Generate embedding vector for given text.
        Returns a 384-dimensional vector as a list of floats.
        """
        if self.model is None:
            self.load_model()
        
        try:
            # Generate embedding
            embedding = self.model.encode(
                text,
                convert_to_numpy=True,
                normalize_embeddings=True  # L2 normalization
            )
            return embedding.tolist()
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            raise
    
    def generate_internship_embedding(
        self,
        skills: Optional[List[str]] = None,
        location: Optional[str] = None,
        state: Optional[str] = None,
        city: Optional[str] = None,
        sector: Optional[str] = None,
        stipend: Optional[str] = None,
        duration_days: Optional[int] = None,
        duration_weeks: Optional[float] = None,
        duration_months: Optional[float] = None,
    ) -> List[float]:
        """
        Generate embedding for an internship based on its metadata.
        """
        text = self.build_internship_text(
            skills=skills,
            location=location,
            state=state,
            city=city,
            sector=sector,
            stipend=stipend,
            duration_days=duration_days,
            duration_weeks=duration_weeks,
            duration_months=duration_months,
        )
        logger.debug(f"Generated text for embedding: {text}")
        return self.generate_embedding(text)


# Global singleton instance
_embedding_service = None


def get_embedding_service() -> EmbeddingService:
    """Get or create the global embedding service instance."""
    global _embedding_service
    if _embedding_service is None:
        _embedding_service = EmbeddingService()
        _embedding_service.load_model()
    return _embedding_service
