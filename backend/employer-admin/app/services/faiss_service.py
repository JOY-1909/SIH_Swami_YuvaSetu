# app/services/faiss_service.py
import logging
import os
from pathlib import Path
from typing import List, Tuple, Optional
import numpy as np
import faiss
import threading
from app.config import BASE_DIR

logger = logging.getLogger(__name__)


class FAISSService:
    """
    Service for managing FAISS index for fast similarity search and duplicate detection.
    Uses HNSWFlat index with L2 metric for efficient approximate nearest neighbor search.
    """
    
    def __init__(
        self,
        dimension: int = 384,
        index_path: str = None,
        duplicate_threshold: float = 0.2,
        m: int = 32,
        ef_search: int = 64,
        ef_construction: int = 80,
    ):
        self.dimension = dimension
        # Use BASE_DIR to construct absolute path if relative path provided
        if index_path is None:
            index_path = str(BASE_DIR / "data" / "faiss" / "internships.index")
        elif not os.path.isabs(index_path):
            index_path = str(BASE_DIR / index_path)
        self.index_path = index_path
        self.duplicate_threshold = duplicate_threshold
        self.m = m
        self.ef_search = ef_search
        self.ef_construction = ef_construction
        
        self.index: Optional[faiss.IndexHNSWFlat] = None
        self.id_map: List[str] = []  # Maps FAISS index position to MongoDB ObjectId
        self.lock = threading.Lock()  # Thread-safe operations
        
        logger.info(
            f"FAISSService initialized with dimension={dimension}, "
            f"duplicate_threshold={duplicate_threshold}"
        )
    
    def initialize_index(self):
        """Create a new FAISS HNSW index."""
        logger.info("Initializing new FAISS HNSWFlat index")
        self.index = faiss.IndexHNSWFlat(self.dimension, self.m)
        self.index.hnsw.efConstruction = self.ef_construction
        self.index.hnsw.efSearch = self.ef_search
        self.id_map = []
        logger.info(
            f"FAISS index initialized: M={self.m}, "
            f"efConstruction={self.ef_construction}, efSearch={self.ef_search}"
        )
    
    def load_index(self) -> bool:
        """
        Load FAISS index from disk if it exists.
        Returns True if successfully loaded, False otherwise.
        """
        if not os.path.exists(self.index_path):
            logger.warning(f"Index file not found at {self.index_path}")
            return False
        
        try:
            with self.lock:
                logger.info(f"Loading FAISS index from {self.index_path}")
                self.index = faiss.read_index(self.index_path)
                
                # Load ID mapping
                id_map_path = self.index_path + ".ids"
                if os.path.exists(id_map_path):
                    with open(id_map_path, "r") as f:
                        self.id_map = [line.strip() for line in f.readlines()]
                    logger.info(f"Loaded {len(self.id_map)} ID mappings")
                else:
                    logger.warning("ID mapping file not found, creating empty map")
                    self.id_map = []
                
                logger.info(
                    f"FAISS index loaded successfully with {self.index.ntotal} vectors"
                )
                return True
        except Exception as e:
            logger.error(f"Error loading FAISS index: {e}")
            return False
    
    def save_index(self):
        """Persist FAISS index and ID mapping to disk."""
        try:
            with self.lock:
                # Create directory if it doesn't exist
                os.makedirs(os.path.dirname(self.index_path), exist_ok=True)
                
                # Save FAISS index
                logger.info(f"Saving FAISS index to {self.index_path}")
                faiss.write_index(self.index, self.index_path)
                
                # Save ID mapping
                id_map_path = self.index_path + ".ids"
                with open(id_map_path, "w") as f:
                    f.write("\n".join(self.id_map))
                
                logger.info(
                    f"FAISS index saved successfully with {self.index.ntotal} vectors"
                )
        except Exception as e:
            logger.error(f"Error saving FAISS index: {e}")
            raise
    
    def add_vector(self, embedding: List[float], doc_id: str):
        """
        Add a single vector to the FAISS index.
        
        Args:
            embedding: The embedding vector (384-dim)
            doc_id: MongoDB document ID as string
        """
        if self.index is None:
            self.initialize_index()
        
        try:
            with self.lock:
                vector = np.array([embedding], dtype=np.float32)
                self.index.add(vector)
                self.id_map.append(doc_id)
                logger.debug(f"Added vector for document {doc_id}")
        except Exception as e:
            logger.error(f"Error adding vector: {e}")
            raise
    
    def add_vectors_batch(self, embeddings: List[List[float]], doc_ids: List[str]):
        """
        Add multiple vectors to the FAISS index in batch.
        
        Args:
            embeddings: List of embedding vectors
            doc_ids: List of corresponding MongoDB document IDs
        """
        if self.index is None:
            self.initialize_index()
        
        if len(embeddings) != len(doc_ids):
            raise ValueError("Number of embeddings must match number of doc_ids")
        
        try:
            with self.lock:
                vectors = np.array(embeddings, dtype=np.float32)
                self.index.add(vectors)
                self.id_map.extend(doc_ids)
                logger.info(f"Added {len(embeddings)} vectors in batch")
        except Exception as e:
            logger.error(f"Error adding vectors in batch: {e}")
            raise
    
    def search(
        self, query_embedding: List[float], k: int = 10
    ) -> List[Tuple[str, float]]:
        """
        Search for k nearest neighbors.
        
        Args:
            query_embedding: Query vector (384-dim)
            k: Number of nearest neighbors to return
            
        Returns:
            List of tuples (doc_id, distance) sorted by distance (ascending)
        """
        if self.index is None or self.index.ntotal == 0:
            logger.warning("FAISS index is empty or not initialized")
            return []
        
        try:
            with self.lock:
                query_vector = np.array([query_embedding], dtype=np.float32)
                k_actual = min(k, self.index.ntotal)
                distances, indices = self.index.search(query_vector, k_actual)
                
                results = []
                for i, idx in enumerate(indices[0]):
                    if idx != -1 and idx < len(self.id_map):
                        doc_id = self.id_map[idx]
                        distance = float(distances[0][i])
                        results.append((doc_id, distance))
                
                logger.debug(f"Search returned {len(results)} results")
                return results
        except Exception as e:
            logger.error(f"Error searching FAISS index: {e}")
            raise
    
    def check_duplicate(self, embedding: List[float]) -> Optional[Tuple[str, float]]:
        """
        Check if an embedding is a duplicate of an existing one.
        
        Args:
            embedding: The embedding vector to check
            
        Returns:
            Tuple of (doc_id, distance) if duplicate found, None otherwise
        """
        if self.index is None or self.index.ntotal == 0:
            return None
        
        try:
            results = self.search(embedding, k=1)
            if results and results[0][1] <= self.duplicate_threshold:
                logger.info(
                    f"Duplicate detected: doc_id={results[0][0]}, "
                    f"distance={results[0][1]:.4f}"
                )
                return results[0]
            return None
        except Exception as e:
            logger.error(f"Error checking for duplicate: {e}")
            raise
    
    def remove_vector(self, doc_id: str) -> bool:
        """
        Remove a vector from the index by doc_id.
        Note: FAISS doesn't support efficient deletion, so we rebuild the index.
        
        Args:
            doc_id: MongoDB document ID to remove
            
        Returns:
            True if removed, False if not found
        """
        if doc_id not in self.id_map:
            logger.warning(f"Document {doc_id} not found in index")
            return False
        
        try:
            with self.lock:
                # Find index position
                idx_to_remove = self.id_map.index(doc_id)
                
                # Rebuild index without this vector
                if self.index.ntotal > 1:
                    # Extract all vectors except the one to remove
                    all_vectors = []
                    for i in range(self.index.ntotal):
                        if i != idx_to_remove:
                            vec = self.index.reconstruct(i)
                            all_vectors.append(vec)
                    
                    # Create new index
                    self.initialize_index()
                    if all_vectors:
                        vectors_array = np.array(all_vectors, dtype=np.float32)
                        self.index.add(vectors_array)
                    
                    # Update ID map
                    self.id_map.pop(idx_to_remove)
                else:
                    # Last vector, just reinitialize
                    self.initialize_index()
                
                logger.info(f"Removed vector for document {doc_id}")
                return True
        except Exception as e:
            logger.error(f"Error removing vector: {e}")
            raise
    
    def get_index_size(self) -> int:
        """Return the number of vectors in the index."""
        if self.index is None:
            return 0
        return self.index.ntotal
    
    def rebuild_index(self, embeddings: List[List[float]], doc_ids: List[str]):
        """
        Completely rebuild the FAISS index from scratch.
        
        Args:
            embeddings: List of all embedding vectors
            doc_ids: List of all corresponding document IDs
        """
        logger.info(f"Rebuilding FAISS index with {len(embeddings)} vectors")
        self.initialize_index()
        if embeddings:
            self.add_vectors_batch(embeddings, doc_ids)
        self.save_index()
        logger.info("FAISS index rebuild complete")


# Global singleton instance
_faiss_service = None


def get_faiss_service() -> FAISSService:
    """Get or create the global FAISS service instance."""
    global _faiss_service
    if _faiss_service is None:
        _faiss_service = FAISSService()
        # Try to load existing index, otherwise initialize new one
        if not _faiss_service.load_index():
            _faiss_service.initialize_index()
    return _faiss_service
