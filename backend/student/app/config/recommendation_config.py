# File: app/config/recommendation_config.py
"""
Recommendation Engine Configuration
"""
from dataclasses import dataclass, field
from typing import Dict


@dataclass
class RecommendationConfig:
    """Configuration for the recommendation engine"""
    
    # ========== MATCHING THRESHOLDS ==========
    MIN_MATCH_THRESHOLD: float = 25.0  # Minimum match % to show (25% for reasonable matches)
    TOP_MATCHES_DEFAULT: int = 5  # Default number of top matches
    EXCELLENT_MATCH_THRESHOLD: float = 80.0
    GOOD_MATCH_THRESHOLD: float = 60.0
    MODERATE_MATCH_THRESHOLD: float = 45.0
    LOW_MATCH_THRESHOLD: float = 35.0
    
    # ========== CACHING ==========
    CACHE_DURATION_HOURS: int = 1
    STUDENT_CACHE_TTL_HOURS: int = 24
    MAX_STUDENT_CACHE_SIZE: int = 1000
    SKILL_EMBEDDING_CACHE_SIZE: int = 5000
    
    # ========== SKILL SIMILARITY ==========
    SKILL_SIMILARITY_THRESHOLD: float = 0.75  # Skills above this are "similar"
    SKILL_ENHANCEMENT_RATIO: float = 0.3  # Max 30% new different skills = enhancement
    SEMANTIC_MATCH_WEIGHT: float = 0.8  # Weight for semantic matches vs exact
    
    # ========== SCORING WEIGHTS ==========
    DEFAULT_WEIGHTS: Dict[str, float] = field(default_factory=lambda: {
        "skills": 0.50,
        "location": 0.20,
        "stipend": 0.15,
        "timeline": 0.15
    })
    
    # ========== FILTER BOOST FACTORS ==========
    FILTER_MATCH_BOOST: float = 1.2  # 20% boost for filter matches
    FILTER_PARTIAL_BOOST: float = 1.1  # 10% boost for partial matches
    
    # ========== PERFORMANCE ==========
    BATCH_ENCODING_SIZE: int = 32
    MAX_SEARCH_K_MULTIPLIER: int = 5
    
    def __post_init__(self):
        # Validate weights sum to 1.0
        total = sum(self.DEFAULT_WEIGHTS.values())
        if abs(total - 1.0) > 0.01:
            raise ValueError(f"Weights must sum to 1.0, got {total}")


# Create default config instance
DEFAULT_CONFIG = RecommendationConfig()