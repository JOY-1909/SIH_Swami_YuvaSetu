"""
Enhanced vector utility functions
"""
import numpy as np
from typing import List, Dict, Any, Optional
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

def normalize_vector(vector: np.ndarray) -> np.ndarray:
    """Normalize a vector to unit length"""
    norm = np.linalg.norm(vector)
    if norm > 0:
        return vector / norm
    return vector

def calculate_cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    """Calculate cosine similarity between two vectors"""
    if len(vec1) != len(vec2):
        return 0.0
    
    vec1_norm = normalize_vector(vec1)
    vec2_norm = normalize_vector(vec2)
    
    return np.dot(vec1_norm, vec2_norm)

def create_skill_embedding(skills: List[str], model) -> np.ndarray:
    """Create embedding from skills list"""
    if not skills:
        return np.zeros(model.get_sentence_embedding_dimension())
    
    skill_text = " ".join(skills)
    return model.encode(skill_text, convert_to_numpy=True).astype('float32')

def create_location_embedding(lat: float, lon: float) -> np.ndarray:
    """Create normalized location embedding"""
    # Normalize for India coordinates (approx bounds)
    # Latitude: 8.0 to 37.0, Longitude: 68.0 to 97.0
    norm_lat = (lat - 8.0) / 29.0
    norm_lon = (lon - 68.0) / 29.0
    
    # Ensure values are within [0, 1]
    norm_lat = max(0, min(1, norm_lat))
    norm_lon = max(0, min(1, norm_lon))
    
    return np.array([norm_lat, norm_lon], dtype='float32')

def create_stipend_embedding(stipend: float, currency: str = "INR") -> np.ndarray:
    """Create normalized stipend embedding"""
    # Convert to INR if needed
    if currency != "INR":
        # Add conversion rates if needed
        pass
    
    # Normalize: 0-50000 INR range
    norm_stipend = stipend / 50000.0
    norm_stipend = max(0, min(1, norm_stipend))
    
    return np.array([norm_stipend], dtype='float32')

def create_timeline_embedding(start_date: Optional[str], duration_months: int) -> np.ndarray:
    """Create timeline embedding"""
    # Calculate urgency
    if start_date:
        try:
            start = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            days_until_start = (start - datetime.utcnow()).days
            # Normalize: 0 (immediate) to 1 (far future)
            urgency = max(0, min(1, days_until_start / 30.0))
        except:
            urgency = 0.5
    else:
        urgency = 0.5
    
    # Duration factor: shorter = more urgent
    duration_factor = max(0, min(1, duration_months / 12.0))
    
    # Combined timeline score
    timeline_score = (urgency + (1 - duration_factor)) / 2.0
    
    return np.array([timeline_score], dtype='float32')

def calculate_multi_dimensional_score(
    student_vectors: Dict[str, np.ndarray],
    internship_vectors: Dict[str, np.ndarray],
    weights: Dict[str, float]
) -> float:
    """Calculate weighted multi-dimensional score"""
    total_score = 0.0
    total_weight = 0.0
    
    for dimension, weight in weights.items():
        if dimension in student_vectors and dimension in internship_vectors:
            student_vec = student_vectors[dimension].flatten()
            internship_vec = internship_vectors[dimension].flatten()
            
            # For 1D vectors (stipend, timeline), use inverse distance
            if len(student_vec) == 1:
                similarity = 1.0 - abs(student_vec[0] - internship_vec[0])
            else:
                # For multi-dimensional vectors, use cosine similarity
                similarity = calculate_cosine_similarity(student_vec, internship_vec)
            
            total_score += similarity * weight
            total_weight += weight
    
    return total_score / total_weight if total_weight > 0 else 0.0