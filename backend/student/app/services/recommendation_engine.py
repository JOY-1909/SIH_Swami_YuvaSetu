# File: app/services/recommendation_engine.py
"""
Optimized Recommendation Engine for Yuva Setu
============================================

Features:
- Fast initialization with background loading
- Smart skill change detection (similar vs different)
- Comprehensive match explanations
- Efficient caching with proper invalidation
- Top matches above configurable threshold
- Filter-aware scoring

Author: Yuva Setu Team
"""

import numpy as np
from typing import List, Dict, Any, Optional, Set, Tuple, Union
from sentence_transformers import SentenceTransformer
import faiss
import logging
from datetime import datetime, timedelta
import asyncio
import json
import hashlib
from pathlib import Path
from collections import OrderedDict
from concurrent.futures import ThreadPoolExecutor
import threading
from dataclasses import dataclass, field
from enum import Enum
import tempfile
import os

from app.models.user import User
from app.database.multi_cluster import get_employer_database

logger = logging.getLogger(__name__)

# Helper function to import DEFAULT_CONFIG from config directory
# (avoids conflict with app.config.py file)
def _load_recommendation_config():
    """Load DEFAULT_CONFIG from config/recommendation_config.py"""
    import importlib.util
    from pathlib import Path
    config_file = Path(__file__).parent.parent / "config" / "recommendation_config.py"
    spec = importlib.util.spec_from_file_location("recommendation_config", config_file)
    recommendation_config_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(recommendation_config_module)
    return recommendation_config_module.DEFAULT_CONFIG

# Thread pool for CPU-bound operations (encoding, etc.)
_thread_pool = ThreadPoolExecutor(max_workers=4)


# ============================================================================
# CONFIGURATION
# ============================================================================

class EngineConfig:
    """Configuration for the recommendation engine (DEPRECATED - use RecommendationConfig)"""
    
    # ========== MATCHING THRESHOLDS ==========
    MIN_MATCH_THRESHOLD: float = 25.0  # Updated to 25% to match RecommendationConfig
    TOP_MATCHES_DEFAULT: int = 5
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
    SKILL_SIMILARITY_THRESHOLD: float = 0.75
    SKILL_ENHANCEMENT_RATIO: float = 0.3
    SEMANTIC_MATCH_WEIGHT: float = 0.8
    
    # ========== SCORING WEIGHTS ==========
    DEFAULT_WEIGHTS: Dict[str, float] = {
        "skills": 0.50,
        "location": 0.20,
        "stipend": 0.15,
        "timeline": 0.15
    }
    
    # ========== FILTER BOOST ==========
    FILTER_MATCH_BOOST: float = 1.2
    FILTER_PARTIAL_BOOST: float = 1.1
    
    # ========== PERFORMANCE ==========
    BATCH_ENCODING_SIZE: int = 32
    MAX_SEARCH_K_MULTIPLIER: int = 5


# ============================================================================
# ENUMS AND DATA CLASSES
# ============================================================================

class MatchQuality(Enum):
    """Match quality levels"""
    EXCELLENT = "excellent"
    GOOD = "good"
    MODERATE = "moderate"
    LOW = "low"
    POOR = "poor"


class SkillMatchType(Enum):
    """Types of skill matches"""
    EXACT = "exact"  # Exact skill match
    SEMANTIC = "semantic"  # Semantically similar
    RELATED = "related"  # Related field/technology
    TRANSFERABLE = "transferable"  # Transferable skill
    NO_MATCH = "no_match"


@dataclass
class SkillAnalysis:
    """Detailed skill analysis for a match"""
    matching_skills: List[Dict[str, Any]] = field(default_factory=list)
    missing_skills: List[str] = field(default_factory=list)
    extra_skills: List[str] = field(default_factory=list)
    match_percentage: float = 0.0
    total_required: int = 0
    total_matched: int = 0
    semantic_matches: List[Dict[str, Any]] = field(default_factory=list)
    explanation: str = ""
    strength: str = ""


@dataclass
class LocationAnalysis:
    """Location match analysis"""
    user_location: str = ""
    internship_location: str = ""
    work_type: str = ""
    is_remote_friendly: bool = False
    distance_km: Optional[float] = None
    match_score: float = 0.0
    explanation: str = ""
    commute_feasibility: str = ""


@dataclass
class StipendAnalysis:
    """Stipend analysis"""
    offered_stipend: float = 0.0
    currency: str = "INR"
    user_expectation: float = 0.0
    match_score: float = 0.0
    market_comparison: str = ""
    explanation: str = ""


@dataclass
class TimelineAnalysis:
    """Timeline/duration analysis"""
    duration: str = ""
    duration_months: float = 0.0
    user_availability: str = ""
    match_score: float = 0.0
    explanation: str = ""
    fit_assessment: str = ""


@dataclass
class MatchExplanation:
    """Complete match explanation"""
    summary: str = ""
    overall_score: float = 0.0
    quality: MatchQuality = MatchQuality.POOR
    skill_analysis: SkillAnalysis = field(default_factory=SkillAnalysis)
    location_analysis: LocationAnalysis = field(default_factory=LocationAnalysis)
    stipend_analysis: StipendAnalysis = field(default_factory=StipendAnalysis)
    timeline_analysis: TimelineAnalysis = field(default_factory=TimelineAnalysis)
    key_strengths: List[str] = field(default_factory=list)
    areas_to_improve: List[str] = field(default_factory=list)
    recommendation_reasons: List[str] = field(default_factory=list)
    action_items: List[str] = field(default_factory=list)
    compatibility_insights: List[str] = field(default_factory=list)


# ============================================================================
# LRU CACHE
# ============================================================================

class LRUCache:
    """Thread-safe LRU cache with TTL support"""
    
    def __init__(self, max_size: int = 500):
        self.max_size = max_size
        self.cache: OrderedDict = OrderedDict()
        self.timestamps: Dict[str, datetime] = {}
        self.ttls: Dict[str, timedelta] = {}
        self._lock = threading.Lock()
    
    def get(self, key: str) -> Optional[Any]:
        """Get item from cache if valid"""
        with self._lock:
            if key not in self.cache:
                return None
            
            # Check TTL
            if key in self.timestamps and key in self.ttls:
                if datetime.utcnow() > self.timestamps[key] + self.ttls[key]:
                    # Expired
                    del self.cache[key]
                    del self.timestamps[key]
                    del self.ttls[key]
                    return None
            
            # Move to end (most recently used)
            self.cache.move_to_end(key)
            return self.cache[key]
    
    def set(self, key: str, value: Any, ttl_hours: int = 24):
        """Set item in cache with TTL"""
        with self._lock:
            if key in self.cache:
                self.cache.move_to_end(key)
            else:
                if len(self.cache) >= self.max_size:
                    # Remove oldest
                    oldest_key = next(iter(self.cache))
                    del self.cache[oldest_key]
                    self.timestamps.pop(oldest_key, None)
                    self.ttls.pop(oldest_key, None)
            
            self.cache[key] = value
            self.timestamps[key] = datetime.utcnow()
            self.ttls[key] = timedelta(hours=ttl_hours)
    
    def is_valid(self, key: str) -> bool:
        """Check if key exists and is valid"""
        with self._lock:
            if key not in self.cache:
                return False
            
            if key in self.timestamps and key in self.ttls:
                return datetime.utcnow() < self.timestamps[key] + self.ttls[key]
            
            return True
    
    def invalidate(self, key: str):
        """Remove item from cache"""
        with self._lock:
            self.cache.pop(key, None)
            self.timestamps.pop(key, None)
            self.ttls.pop(key, None)
    
    def clear(self):
        """Clear entire cache"""
        with self._lock:
            self.cache.clear()
            self.timestamps.clear()
            self.ttls.clear()
    
    def size(self) -> int:
        """Get current cache size"""
        with self._lock:
            return len(self.cache)


# ============================================================================
# SKILL SIGNATURE MANAGER
# ============================================================================

class SkillSignatureManager:
    """
    Manages skill signatures to detect meaningful changes vs enhancements.
    Uses semantic similarity to determine if new skills are similar to existing ones.
    """
    
    def __init__(self, model: SentenceTransformer, config = None):
        self.model = model
        self.config = config or _load_recommendation_config()
        self._skill_embeddings_cache: Dict[str, np.ndarray] = {}
        self._lock = threading.Lock()
    
    def compute_skill_signature(self, skills: List[str]) -> str:
        """Compute a hash signature for a set of skills"""
        if not skills:
            return "empty"
        
        normalized = sorted([s.lower().strip() for s in skills if s])
        signature_str = "|".join(normalized)
        return hashlib.md5(signature_str.encode()).hexdigest()
    
    def _get_skill_embedding(self, skill: str) -> np.ndarray:
        """Get or compute embedding for a single skill"""
        skill_lower = skill.lower().strip()
        
        with self._lock:
            if skill_lower in self._skill_embeddings_cache:
                return self._skill_embeddings_cache[skill_lower]
        
        # Compute embedding
        embedding = self.model.encode(skill_lower, convert_to_numpy=True)
        
        with self._lock:
            # Limit cache size
            if len(self._skill_embeddings_cache) > self.config.SKILL_EMBEDDING_CACHE_SIZE:
                # Remove oldest entries
                keys_to_remove = list(self._skill_embeddings_cache.keys())[:1000]
                for k in keys_to_remove:
                    del self._skill_embeddings_cache[k]
            
            self._skill_embeddings_cache[skill_lower] = embedding
        
        return embedding
    
    def compute_skill_similarity(self, skill1: str, skill2: str) -> float:
        """Compute semantic similarity between two skills"""
        try:
            emb1 = self._get_skill_embedding(skill1)
            emb2 = self._get_skill_embedding(skill2)
            
            # Cosine similarity
            similarity = np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2))
            return float(similarity)
        except Exception:
            return 0.0
    
    def find_skill_matches(
        self,
        user_skills: List[str],
        required_skills: List[str]
    ) -> Dict[str, Any]:
        """
        Find matches between user skills and required skills.
        Returns detailed matching information including semantic matches.
        """
        if not user_skills or not required_skills:
            return {
                "exact_matches": [],
                "semantic_matches": [],
                "missing_skills": list(required_skills) if required_skills else [],
                "extra_skills": list(user_skills) if user_skills else [],
                "match_score": 0.0
            }
        
        user_set = set(s.lower().strip() for s in user_skills if s)
        required_set = set(s.lower().strip() for s in required_skills if s)
        
        # Exact matches
        exact_matches = user_set.intersection(required_set)
        
        # Find semantic matches for non-exact matches
        remaining_required = required_set - exact_matches
        remaining_user = user_set - exact_matches
        
        semantic_matches = []
        matched_required = set()
        matched_user = set()
        
        for req_skill in remaining_required:
            best_match = None
            best_score = 0.0
            
            for user_skill in remaining_user:
                if user_skill in matched_user:
                    continue
                
                similarity = self.compute_skill_similarity(req_skill, user_skill)
                
                if similarity > self.config.SKILL_SIMILARITY_THRESHOLD and similarity > best_score:
                    best_match = user_skill
                    best_score = similarity
            
            if best_match:
                semantic_matches.append({
                    "required_skill": req_skill,
                    "user_skill": best_match,
                    "similarity": round(best_score, 3),
                    "match_type": self._categorize_match(best_score)
                })
                matched_required.add(req_skill)
                matched_user.add(best_match)
        
        # Calculate final missing and extra
        missing_skills = remaining_required - matched_required
        extra_skills = remaining_user - matched_user
        
        # Calculate overall match score
        total_required = len(required_set)
        total_matched = len(exact_matches) + len(semantic_matches)
        
        # Weight exact matches higher than semantic matches
        weighted_matches = len(exact_matches) + (len(semantic_matches) * self.config.SEMANTIC_MATCH_WEIGHT)
        match_score = (weighted_matches / total_required * 100) if total_required > 0 else 0.0
        
        return {
            "exact_matches": list(exact_matches),
            "semantic_matches": semantic_matches,
            "missing_skills": list(missing_skills),
            "extra_skills": list(extra_skills),
            "match_score": round(match_score, 2),
            "total_required": total_required,
            "total_matched": total_matched
        }
    
    def _categorize_match(self, similarity: float) -> str:
        """Categorize match type based on similarity score"""
        if similarity >= 0.95:
            return SkillMatchType.EXACT.value
        elif similarity >= 0.85:
            return SkillMatchType.SEMANTIC.value
        elif similarity >= 0.75:
            return SkillMatchType.RELATED.value
        else:
            return SkillMatchType.TRANSFERABLE.value
    
    def are_skills_enhancement(
        self,
        old_skills: List[str],
        new_skills: List[str]
    ) -> Tuple[bool, float, List[str]]:
        """
        Determine if new skills are enhancements of old skills or significantly different.
        
        Returns:
            - is_enhancement: True if new skills are mostly enhancements
            - similarity_score: Overall similarity score
            - different_skills: List of significantly different new skills
        """
        if not old_skills:
            return False, 0.0, list(new_skills) if new_skills else []
        
        if not new_skills:
            return True, 1.0, []
        
        old_set = set(s.lower().strip() for s in old_skills if s)
        new_set = set(s.lower().strip() for s in new_skills if s)
        
        # Exact matches don't need similarity check
        exact_overlap = old_set.intersection(new_set)
        only_in_new = new_set - old_set
        
        if not only_in_new:
            return True, 1.0, []
        
        # Get embeddings for old skills
        old_embeddings = []
        for skill in old_set:
            try:
                old_embeddings.append(self._get_skill_embedding(skill))
            except Exception:
                continue
        
        if not old_embeddings:
            return False, 0.0, list(only_in_new)
        
        old_matrix = np.vstack(old_embeddings)
        
        # Check each new skill
        different_skills = []
        total_similarity = 0.0
        
        for new_skill in only_in_new:
            try:
                new_emb = self._get_skill_embedding(new_skill)
                
                # Compute similarities with all old skills
                similarities = np.dot(old_matrix, new_emb) / (
                    np.linalg.norm(old_matrix, axis=1) * np.linalg.norm(new_emb)
                )
                max_sim = float(np.max(similarities))
                total_similarity += max_sim
                
                if max_sim < self.config.SKILL_SIMILARITY_THRESHOLD:
                    different_skills.append(new_skill)
            except Exception:
                different_skills.append(new_skill)
        
        avg_similarity = total_similarity / len(only_in_new) if only_in_new else 1.0
        
        # It's an enhancement if few skills are truly different
        different_ratio = len(different_skills) / len(only_in_new) if only_in_new else 0
        is_enhancement = different_ratio <= self.config.SKILL_ENHANCEMENT_RATIO
        
        return is_enhancement, avg_similarity, different_skills


# ============================================================================
# STUDENT PROFILE CACHE
# ============================================================================

class StudentProfileCache:
    """
    Manages student profile caching with smart invalidation based on skill changes.
    """
    
    def __init__(self, skill_manager: SkillSignatureManager, config = None):
        self.skill_manager = skill_manager
        self.config = config or _load_recommendation_config()
        self.embedding_cache = LRUCache(max_size=self.config.MAX_STUDENT_CACHE_SIZE)
        self.profile_signatures: Dict[str, Dict] = {}
        self._lock = threading.Lock()
    
    def _extract_profile_data(self, user: User) -> Dict:
        """Extract relevant profile data for caching and comparison"""
        skills = []
        skill_levels = {}
        
        if user.skills:
            for skill in user.skills:
                name = getattr(skill, "name", None)
                level = getattr(skill, "level", "Beginner")
                if name:
                    skills.append(name)
                    skill_levels[name.lower()] = level
        
        education = []
        if user.education:
            for edu in user.education:
                degree = getattr(edu, "degree", None)
                field = getattr(edu, "field_of_study", None)
                institution = getattr(edu, "institution", None)
                if degree:
                    education.append({
                        "degree": degree,
                        "field": field,
                        "institution": institution
                    })
        
        experience = []
        if user.experience:
            for exp in user.experience:
                role = getattr(exp, "role", None)
                company = getattr(exp, "company", None)
                if role:
                    experience.append({
                        "role": role,
                        "company": company
                    })
        
        projects = []
        if hasattr(user, 'projects') and user.projects:
            for proj in user.projects:
                title = getattr(proj, "title", None)
                technologies = getattr(proj, "technologies", None)
                if title:
                    projects.append({
                        "title": title,
                        "technologies": technologies
                    })
        
        return {
            "skills": skills,
            "skill_levels": skill_levels,
            "education": education,
            "experience": experience,
            "projects": projects,
            "career_objective": user.career_objective or "",
            "location_coordinates": user.location_coordinates,
            "location_query": getattr(user, 'location_query', ''),
            "preferred_stipend": getattr(user, 'preferred_stipend', None)
        }
    
    def _compute_profile_hash(self, profile_data: Dict) -> str:
        """Compute hash for non-skill profile data"""
        # Exclude skills from hash as we handle them separately
        data_copy = {k: v for k, v in profile_data.items() if k not in ['skills', 'skill_levels']}
        data_str = json.dumps(data_copy, sort_keys=True, default=str)
        return hashlib.md5(data_str.encode()).hexdigest()
    
    def get_cached_vectors(self, user: User) -> Optional[Dict[str, np.ndarray]]:
        """
        Get cached vectors if still valid.
        Returns None if cache is invalid or skills changed significantly.
        """
        user_id = str(user.id)
        
        # Check if cache exists and is valid
        if not self.embedding_cache.is_valid(user_id):
            return None
        
        # Get current profile
        current_profile = self._extract_profile_data(user)
        current_skills = current_profile["skills"]
        
        # Get stored signature
        with self._lock:
            stored_signature = self.profile_signatures.get(user_id)
        
        if not stored_signature:
            return None
        
        old_skills = stored_signature.get("skills", [])
        old_hash = stored_signature.get("profile_hash", "")
        
        # Check if non-skill profile data changed
        current_hash = self._compute_profile_hash(current_profile)
        if current_hash != old_hash:
            logger.debug(f"User {user_id}: Profile data changed, invalidating cache")
            self.invalidate(user_id)
            return None
        
        # Check if skills are enhancements or truly different
        is_enhancement, similarity_score, different_skills = self.skill_manager.are_skills_enhancement(
            old_skills, current_skills
        )
        
        if is_enhancement:
            logger.debug(
                f"User {user_id}: Skills are enhancements (similarity: {similarity_score:.2f}), using cache"
            )
            return self.embedding_cache.get(user_id)
        else:
            logger.info(
                f"User {user_id}: Significant skill changes detected: {different_skills[:5]}"
            )
            self.invalidate(user_id)
            return None
    
    def store_vectors(self, user: User, vectors: Dict[str, np.ndarray], profile_data: Dict):
        """Store vectors with profile signature"""
        user_id = str(user.id)
        
        with self._lock:
            self.profile_signatures[user_id] = {
                "skills": profile_data["skills"],
                "profile_hash": self._compute_profile_hash(profile_data),
                "timestamp": datetime.utcnow().isoformat()
            }
        
        self.embedding_cache.set(user_id, vectors, ttl_hours=self.config.STUDENT_CACHE_TTL_HOURS)
    
    def invalidate(self, user_id: str):
        """Invalidate cache for a user"""
        self.embedding_cache.invalidate(user_id)
        with self._lock:
            self.profile_signatures.pop(user_id, None)
    
    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        with self._lock:
            return {
                "cached_profiles": self.embedding_cache.size(),
                "signatures_stored": len(self.profile_signatures)
            }


# ============================================================================
# INTERNSHIP INDEX MANAGER
# ============================================================================

class InternshipIndexManager:
    """
    Manages FAISS indices with efficient updates and persistent caching.
    """
    
    def __init__(self, embedding_dim: int, cache_dir: Path):
        self.embedding_dim = embedding_dim
        self.cache_dir = cache_dir
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        
        # FAISS indices
        self.skill_index: Optional[faiss.Index] = None
        self.location_index: Optional[faiss.Index] = None
        self.stipend_index: Optional[faiss.Index] = None
        self.timeline_index: Optional[faiss.Index] = None
        
        # Data storage
        self.internship_ids: List[str] = []
        self.internship_data: Dict[str, Dict] = {}
        self.internship_id_to_index: Dict[str, int] = {}
        self.internship_vectors: Dict[str, Dict[str, np.ndarray]] = {}
        
        # State
        self.last_build_time: Optional[datetime] = None
        self.internship_count: int = 0
        
        self._lock = threading.Lock()
    
    def init_indices(self):
        """Initialize empty FAISS indices"""
        with self._lock:
            self.skill_index = faiss.IndexFlatIP(self.embedding_dim)
            self.location_index = faiss.IndexFlatIP(2)
            self.stipend_index = faiss.IndexFlatIP(1)
            self.timeline_index = faiss.IndexFlatIP(1)
            
            self.internship_ids = []
            self.internship_data = {}
            self.internship_id_to_index = {}
            self.internship_vectors = {}
    
    def build_indices(
        self,
        skill_vectors: np.ndarray,
        location_vectors: np.ndarray,
        stipend_vectors: np.ndarray,
        timeline_vectors: np.ndarray,
        internship_ids: List[str],
        internship_data: Dict[str, Dict],
        internship_vectors: Dict[str, Dict[str, np.ndarray]]
    ) -> bool:
        """Build all indices from vectors"""
        try:
            with self._lock:
                self.internship_ids = internship_ids
                self.internship_data = internship_data
                self.internship_id_to_index = {id_: i for i, id_ in enumerate(internship_ids)}
                self.internship_vectors = internship_vectors
                
                # Normalize and add skill vectors
                skill_vectors_norm = skill_vectors.copy()
                faiss.normalize_L2(skill_vectors_norm)
                
                self.skill_index = faiss.IndexFlatIP(self.embedding_dim)
                self.skill_index.add(skill_vectors_norm)
                
                # Location index (normalize)
                self.location_index = faiss.IndexFlatIP(2)
                loc_norm = location_vectors.copy()
                norms = np.linalg.norm(loc_norm, axis=1, keepdims=True)
                norms[norms == 0] = 1
                loc_norm = loc_norm / norms
                self.location_index.add(loc_norm.astype('float32'))
                
                # Stipend index
                self.stipend_index = faiss.IndexFlatIP(1)
                self.stipend_index.add(stipend_vectors.astype('float32'))
                
                # Timeline index
                self.timeline_index = faiss.IndexFlatIP(1)
                self.timeline_index.add(timeline_vectors.astype('float32'))
                
                self.last_build_time = datetime.utcnow()
                self.internship_count = len(internship_ids)
            
            logger.info(f"✅ Indices built with {len(internship_ids)} internships")
            return True
            
        except Exception as e:
            logger.error(f"Failed to build indices: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return False
    
    def save_to_disk(self) -> bool:
        """Save indices and metadata to disk"""
        try:
            index_dir = self.cache_dir / "indices"
            index_dir.mkdir(parents=True, exist_ok=True)
            
            with self._lock:
                if self.skill_index and self.skill_index.ntotal > 0:
                    faiss.write_index(self.skill_index, str(index_dir / "skill.bin"))
                if self.location_index and self.location_index.ntotal > 0:
                    faiss.write_index(self.location_index, str(index_dir / "location.bin"))
                if self.stipend_index and self.stipend_index.ntotal > 0:
                    faiss.write_index(self.stipend_index, str(index_dir / "stipend.bin"))
                if self.timeline_index and self.timeline_index.ntotal > 0:
                    faiss.write_index(self.timeline_index, str(index_dir / "timeline.bin"))
                
                # Save metadata
                metadata = {
                    "internship_ids": self.internship_ids,
                    "internship_id_to_index": self.internship_id_to_index,
                    "last_build_time": self.last_build_time.isoformat() if self.last_build_time else None,
                    "internship_count": self.internship_count,
                    "embedding_dim": self.embedding_dim
                }
                
                with open(self.cache_dir / "metadata.json", 'w') as f:
                    json.dump(metadata, f)
            
            logger.info("✅ Saved indices to disk")
            return True
            
        except Exception as e:
            logger.warning(f"Failed to save indices: {e}")
            return False
    
    def load_from_disk(self) -> bool:
        """Load indices from disk cache"""
        try:
            index_dir = self.cache_dir / "indices"
            skill_path = index_dir / "skill.bin"
            
            if not skill_path.exists():
                return False
            
            with self._lock:
                self.skill_index = faiss.read_index(str(skill_path))
                
                location_path = index_dir / "location.bin"
                if location_path.exists():
                    self.location_index = faiss.read_index(str(location_path))
                else:
                    self.location_index = faiss.IndexFlatIP(2)
                
                stipend_path = index_dir / "stipend.bin"
                if stipend_path.exists():
                    self.stipend_index = faiss.read_index(str(stipend_path))
                else:
                    self.stipend_index = faiss.IndexFlatIP(1)
                
                timeline_path = index_dir / "timeline.bin"
                if timeline_path.exists():
                    self.timeline_index = faiss.read_index(str(timeline_path))
                else:
                    self.timeline_index = faiss.IndexFlatIP(1)
                
                # Load metadata
                metadata_path = self.cache_dir / "metadata.json"
                if metadata_path.exists():
                    with open(metadata_path, 'r') as f:
                        metadata = json.load(f)
                    
                    self.internship_ids = metadata.get("internship_ids", [])
                    self.internship_id_to_index = {
                        k: int(v) for k, v in metadata.get("internship_id_to_index", {}).items()
                    }
                    if metadata.get("last_build_time"):
                        self.last_build_time = datetime.fromisoformat(metadata["last_build_time"])
                    self.internship_count = metadata.get("internship_count", 0)
            
            logger.info(f"✅ Loaded indices from cache ({self.internship_count} internships)")
            return True
            
        except Exception as e:
            logger.warning(f"Failed to load indices: {e}")
            return False
    
    def search(
        self,
        query_vector: np.ndarray,
        index_type: str,
        k: int
    ) -> Tuple[np.ndarray, np.ndarray]:
        """Search an index"""
        index_map = {
            "skill": self.skill_index,
            "location": self.location_index,
            "stipend": self.stipend_index,
            "timeline": self.timeline_index
        }
        
        index = index_map.get(index_type)
        if index is None or index.ntotal == 0:
            return np.array([[]]), np.array([[]])
        
        k = min(k, index.ntotal)
        
        query = query_vector.copy()
        if index_type == "skill":
            faiss.normalize_L2(query)
        elif index_type == "location":
            norm = np.linalg.norm(query)
            if norm > 0:
                query = query / norm
        
        return index.search(query.astype('float32'), k)
    
    @property
    def is_ready(self) -> bool:
        return self.skill_index is not None and self.skill_index.ntotal > 0
    
    @property
    def total_internships(self) -> int:
        return self.skill_index.ntotal if self.skill_index else 0


# ============================================================================
# MATCH EXPLANATION GENERATOR
# ============================================================================

class MatchExplanationGenerator:
    """
    Generates comprehensive, human-readable explanations for why 
    a student was matched to an internship.
    """
    
    def __init__(self, skill_manager: SkillSignatureManager, config = None):
        self.skill_manager = skill_manager
        self.config = config or _load_recommendation_config()
    
    def generate_explanation(
        self,
        user: User,
        internship: Dict,
        scores: Dict[str, float],
        user_profile: Dict
    ) -> MatchExplanation:
        """Generate comprehensive match explanation"""
        
        # Calculate overall quality
        weighted_score = scores.get("weighted_score", 0)
        match_percentage = weighted_score * 100
        quality = self._determine_quality(match_percentage)
        
        # Generate component analyses
        skill_analysis = self._analyze_skills(user_profile, internship, scores)
        location_analysis = self._analyze_location(user_profile, internship, scores)
        stipend_analysis = self._analyze_stipend(user_profile, internship, scores)
        timeline_analysis = self._analyze_timeline(user_profile, internship, scores)
        
        # Generate insights
        key_strengths = self._generate_strengths(skill_analysis, location_analysis, stipend_analysis)
        areas_to_improve = self._generate_improvement_areas(skill_analysis, internship)
        recommendation_reasons = self._generate_recommendation_reasons(
            skill_analysis, location_analysis, stipend_analysis, timeline_analysis, internship
        )
        action_items = self._generate_action_items(skill_analysis, internship)
        compatibility_insights = self._generate_compatibility_insights(
            user_profile, internship, scores
        )
        
        # Generate summary
        summary = self._generate_summary(
            match_percentage, skill_analysis, location_analysis, 
            stipend_analysis, timeline_analysis, internship
        )
        
        return MatchExplanation(
            summary=summary,
            overall_score=round(match_percentage, 1),
            quality=quality,
            skill_analysis=skill_analysis,
            location_analysis=location_analysis,
            stipend_analysis=stipend_analysis,
            timeline_analysis=timeline_analysis,
            key_strengths=key_strengths,
            areas_to_improve=areas_to_improve,
            recommendation_reasons=recommendation_reasons,
            action_items=action_items,
            compatibility_insights=compatibility_insights
        )
    
    def _determine_quality(self, percentage: float) -> MatchQuality:
        """Determine match quality level"""
        if percentage >= self.config.EXCELLENT_MATCH_THRESHOLD:
            return MatchQuality.EXCELLENT
        elif percentage >= self.config.GOOD_MATCH_THRESHOLD:
            return MatchQuality.GOOD
        elif percentage >= self.config.MODERATE_MATCH_THRESHOLD:
            return MatchQuality.MODERATE
        elif percentage >= self.config.LOW_MATCH_THRESHOLD:
            return MatchQuality.LOW
        else:
            return MatchQuality.POOR
    
    def _analyze_skills(
        self,
        user_profile: Dict,
        internship: Dict,
        scores: Dict
    ) -> SkillAnalysis:
        """Analyze skill match in detail"""
        user_skills = user_profile.get("skills", [])
        skill_levels = user_profile.get("skill_levels", {})
        internship_skills = internship.get("skills", [])
        
        # Get detailed skill matching
        skill_match_result = self.skill_manager.find_skill_matches(
            user_skills, internship_skills
        )
        
        # Build matching skills with levels
        matching_skills = []
        for skill in skill_match_result["exact_matches"]:
            matching_skills.append({
                "skill": skill,
                "level": skill_levels.get(skill.lower(), "Unknown"),
                "match_type": "exact"
            })
        
        for sem_match in skill_match_result["semantic_matches"]:
            matching_skills.append({
                "skill": sem_match["user_skill"],
                "matches_required": sem_match["required_skill"],
                "level": skill_levels.get(sem_match["user_skill"].lower(), "Unknown"),
                "match_type": sem_match["match_type"],
                "similarity": sem_match["similarity"]
            })
        
        # Generate explanation text
        match_pct = skill_match_result["match_score"]
        total_matched = skill_match_result["total_matched"]
        total_required = skill_match_result["total_required"]
        
        if match_pct >= 80:
            explanation = (
                f"Excellent skill alignment! You have {total_matched} out of {total_required} "
                f"required skills ({match_pct:.0f}% match). "
            )
            if matching_skills:
                top_skills = [m["skill"] for m in matching_skills[:3]]
                explanation += f"Your expertise in {', '.join(top_skills)} makes you a strong candidate."
            strength = "strong"
        elif match_pct >= 60:
            explanation = (
                f"Good skill match with {total_matched} of {total_required} required skills. "
            )
            if skill_match_result["missing_skills"]:
                missing = skill_match_result["missing_skills"][:2]
                explanation += f"Consider developing {', '.join(missing)} to strengthen your profile."
            strength = "good"
        elif match_pct >= 45:
            explanation = (
                f"Partial skill overlap with {total_matched} of {total_required} skills matching. "
                f"This could be a growth opportunity. "
            )
            if skill_match_result["missing_skills"]:
                missing = skill_match_result["missing_skills"][:3]
                explanation += f"Key skills to develop: {', '.join(missing)}."
            strength = "moderate"
        elif match_pct >= 35:
            explanation = (
                f"Limited skill match ({match_pct:.0f}%), but potential for growth. "
            )
            if user_skills:
                explanation += f"Your background in {', '.join(user_skills[:2])} shows learning ability. "
            if skill_match_result["missing_skills"]:
                explanation += f"You would need to develop: {', '.join(skill_match_result['missing_skills'][:3])}."
            strength = "developing"
        else:
            explanation = (
                f"Limited direct skill match ({match_pct:.0f}%). "
                f"This could be a stretch opportunity if you're willing to learn quickly. "
            )
            if skill_match_result["missing_skills"]:
                explanation += f"Primary skills needed: {', '.join(skill_match_result['missing_skills'][:3])}."
            strength = "emerging"
        
        return SkillAnalysis(
            matching_skills=matching_skills,
            missing_skills=skill_match_result["missing_skills"][:10],
            extra_skills=skill_match_result["extra_skills"][:5],
            match_percentage=match_pct,
            total_required=total_required,
            total_matched=total_matched,
            semantic_matches=skill_match_result["semantic_matches"],
            explanation=explanation,
            strength=strength
        )
    
    def _analyze_location(
        self,
        user_profile: Dict,
        internship: Dict,
        scores: Dict
    ) -> LocationAnalysis:
        """Analyze location compatibility"""
        user_location = user_profile.get("location_query", "") or ""
        internship_location = internship.get("location", "")
        internship_city = internship.get("city", "")
        work_type = internship.get("work_type", "")
        is_remote = internship.get("is_remote", False) or work_type.lower() in ["remote", "wfh"]
        
        location_score = scores.get("location_score", 0.5)
        
        # Determine commute feasibility
        if is_remote or work_type.lower() == "remote":
            commute = "No commute required - fully remote"
            explanation = (
                f"This is a remote position, so location is completely flexible. "
                f"You can work from {user_location if user_location else 'anywhere'} without any relocation."
            )
        elif work_type.lower() == "hybrid":
            commute = "Occasional office visits may be required"
            explanation = (
                f"This hybrid position is based in {internship_location}. "
                f"You may need occasional office visits but can work remotely most days."
            )
        elif user_location and user_location.lower() in internship_location.lower():
            commute = "Convenient - in your area"
            explanation = (
                f"Great location match! This internship is in {internship_location}, "
                f"which is in your area ({user_location}). No relocation needed."
            )
        elif internship_city and user_location.lower() in internship_city.lower():
            commute = "Convenient - same city"
            explanation = (
                f"This internship is in {internship_location}, the same city you're in. "
                f"Daily commute should be manageable."
            )
        else:
            commute = "May require relocation or long commute"
            if user_location:
                explanation = (
                    f"This internship requires working from {internship_location}. "
                    f"You're currently in {user_location}, so relocation or significant "
                    f"commuting may be required. Consider discussing remote options."
                )
            else:
                explanation = (
                    f"This internship is based in {internship_location}. "
                    f"Please verify if the location works for you."
                )
        
        return LocationAnalysis(
            user_location=user_location,
            internship_location=internship_location,
            work_type=work_type,
            is_remote_friendly=is_remote,
            match_score=round(location_score * 100, 1),
            explanation=explanation,
            commute_feasibility=commute
        )
    
    def _analyze_stipend(
        self,
        user_profile: Dict,
        internship: Dict,
        scores: Dict
    ) -> StipendAnalysis:
        """Analyze stipend compatibility"""
        stipend = internship.get("stipend", 0) or 0
        currency = internship.get("stipend_currency", "INR")
        user_expectation = user_profile.get("preferred_stipend") or 10000
        
        stipend_score = scores.get("stipend_score", 0.5)
        
        # Market comparison
        if stipend >= 40000:
            market = "Exceptional - Top 5% of internship stipends"
        elif stipend >= 25000:
            market = "Excellent - Above market average"
        elif stipend >= 15000:
            market = "Competitive - At market rate"
        elif stipend >= 8000:
            market = "Moderate - Below average but common"
        elif stipend >= 5000:
            market = "Basic - Entry level compensation"
        else:
            market = "Minimal - Focus on learning opportunity"
        
        # Explanation
        if stipend >= 30000:
            explanation = (
                f"Excellent compensation of ₹{stipend:,}/month! This is well above average "
                f"for internships and indicates a well-funded position. "
                f"The company clearly values interns."
            )
        elif stipend >= 20000:
            explanation = (
                f"Strong stipend of ₹{stipend:,}/month. This is competitive for the market "
                f"and should comfortably cover your expenses during the internship."
            )
        elif stipend >= 10000:
            explanation = (
                f"Standard stipend of ₹{stipend:,}/month. This is typical for quality internships "
                f"and should help cover basic expenses."
            )
        elif stipend >= 5000:
            explanation = (
                f"Modest stipend of ₹{stipend:,}/month. While not high, consider the learning "
                f"opportunity and company reputation in your decision."
            )
        else:
            explanation = (
                f"This position offers ₹{stipend:,}/month. The compensation is low, "
                f"but evaluate based on the skills you'll gain, company brand value, "
                f"and potential for conversion to full-time."
            )
        
        return StipendAnalysis(
            offered_stipend=stipend,
            currency=currency,
            user_expectation=user_expectation,
            match_score=round(stipend_score * 100, 1),
            market_comparison=market,
            explanation=explanation
        )
    
    def _analyze_timeline(
        self,
        user_profile: Dict,
        internship: Dict,
        scores: Dict
    ) -> TimelineAnalysis:
        """Analyze timeline/duration compatibility"""
        duration = internship.get("duration", "")
        duration_months = internship.get("duration_months", 3) or 3
        timeline_score = scores.get("timeline_score", 0.5)
        
        # Determine fit assessment
        if duration_months <= 1.5:
            fit = "Short-term commitment"
            explanation = (
                f"This is a short internship ({duration or f'{duration_months} months'}). "
                f"Great for quick exposure and building your resume. "
                f"Ideal if you have limited time available or want to explore different domains."
            )
        elif duration_months <= 3:
            fit = "Standard duration"
            explanation = (
                f"Standard internship duration ({duration or f'{duration_months} months'}). "
                f"This gives you enough time to work on meaningful projects, "
                f"develop professional skills, and make a real impact."
            )
        elif duration_months <= 6:
            fit = "Extended engagement"
            explanation = (
                f"Extended internship ({duration or f'{duration_months} months'}). "
                f"Great for deep learning and potentially transitioning to a full-time role. "
                f"Ensure it fits your academic schedule and commitments."
            )
        else:
            fit = "Long-term commitment"
            explanation = (
                f"Long-term internship ({duration or f'{duration_months} months'}). "
                f"This is essentially a full work experience. Perfect for gap years "
                f"or if you're looking for pre-placement opportunities."
            )
        
        return TimelineAnalysis(
            duration=duration,
            duration_months=duration_months,
            match_score=round(timeline_score * 100, 1),
            explanation=explanation,
            fit_assessment=fit
        )
    
    def _generate_strengths(
        self,
        skill_analysis: SkillAnalysis,
        location_analysis: LocationAnalysis,
        stipend_analysis: StipendAnalysis
    ) -> List[str]:
        """Generate list of key strengths for this match"""
        strengths = []
        
        # Skill strengths
        if skill_analysis.match_percentage >= 70:
            strengths.append(
                f"Strong skill alignment ({skill_analysis.total_matched}/{skill_analysis.total_required} skills match)"
            )
        elif skill_analysis.matching_skills:
            top_skills = [m["skill"] for m in skill_analysis.matching_skills[:2]]
            strengths.append(f"Relevant expertise in {', '.join(top_skills)}")
        
        # Semantic matches as strength
        if skill_analysis.semantic_matches:
            strengths.append(
                f"Transferable skills identified ({len(skill_analysis.semantic_matches)} related skills)"
            )
        
        # Location strengths
        if location_analysis.is_remote_friendly:
            strengths.append("Remote-friendly - work from anywhere")
        elif location_analysis.match_score >= 80:
            strengths.append("Convenient location - minimal commute")
        
        # Stipend strengths
        if stipend_analysis.offered_stipend >= 20000:
            strengths.append(f"Competitive stipend (₹{stipend_analysis.offered_stipend:,}/month)")
        
        # Extra skills as strength
        if skill_analysis.extra_skills:
            strengths.append(
                f"Additional skills ({', '.join(skill_analysis.extra_skills[:2])}) could add value"
            )
        
        return strengths[:5]  # Limit to top 5
    
    def _generate_improvement_areas(
        self,
        skill_analysis: SkillAnalysis,
        internship: Dict
    ) -> List[str]:
        """Generate areas for improvement"""
        areas = []
        
        if skill_analysis.missing_skills:
            missing = skill_analysis.missing_skills[:3]
            areas.append(f"Consider learning: {', '.join(missing)}")
        
        if skill_analysis.match_percentage < 50:
            areas.append(
                "Build relevant projects to demonstrate practical skills"
            )
        
        if skill_analysis.strength == "developing":
            category = internship.get("category", "this field")
            areas.append(
                f"Take online courses related to {category}"
            )
        
        return areas[:4]
    
    def _generate_recommendation_reasons(
        self,
        skill_analysis: SkillAnalysis,
        location_analysis: LocationAnalysis,
        stipend_analysis: StipendAnalysis,
        timeline_analysis: TimelineAnalysis,
        internship: Dict
    ) -> List[str]:
        """Generate concise recommendation reasons"""
        reasons = []
        
        # Skill reasons
        if skill_analysis.total_matched > 0:
            reasons.append(
                f"{skill_analysis.total_matched}/{skill_analysis.total_required} skills match"
            )
        
        if skill_analysis.matching_skills:
            top_skill = skill_analysis.matching_skills[0]["skill"]
            reasons.append(f"Your {top_skill} expertise is relevant")
        
        # Location reasons
        if location_analysis.is_remote_friendly:
            reasons.append(f"{internship.get('work_type', 'Remote')} work available")
        elif location_analysis.match_score >= 70:
            reasons.append("Convenient location")
        
        # Stipend reasons
        if stipend_analysis.offered_stipend >= 15000:
            reasons.append(f"₹{stipend_analysis.offered_stipend:,}/month stipend")
        
        # Category/industry reason
        category = internship.get("category", "")
        if category:
            reasons.append(f"{category} opportunity")
        
        # Featured/verified
        if internship.get("is_featured"):
            reasons.append("Featured internship")
        if internship.get("is_verified"):
            reasons.append("Verified company")
        
        return reasons[:5] if reasons else ["Recommended based on your profile"]
    
    def _generate_action_items(
        self,
        skill_analysis: SkillAnalysis,
        internship: Dict
    ) -> List[str]:
        """Generate actionable next steps"""
        actions = []
        
        actions.append("Review the full internship description carefully")
        
        if skill_analysis.missing_skills:
            actions.append(
                f"Highlight transferable skills in your application that relate to {skill_analysis.missing_skills[0]}"
            )
        
        if skill_analysis.matching_skills:
            actions.append(
                "Emphasize your matching skills with specific project examples"
            )
        
        actions.append("Prepare questions about the role and team")
        
        if internship.get("apply_url") and internship.get("apply_url") != "#":
            actions.append("Apply through the official application link")
        
        return actions[:4]
    
    def _generate_compatibility_insights(
        self,
        user_profile: Dict,
        internship: Dict,
        scores: Dict
    ) -> List[str]:
        """Generate compatibility insights"""
        insights = []
        
        weighted_score = scores.get("weighted_score", 0) * 100
        
        # Overall compatibility
        if weighted_score >= 80:
            insights.append(
                "High compatibility - Your profile aligns exceptionally well with this role"
            )
        elif weighted_score >= 60:
            insights.append(
                "Good compatibility - Strong foundation with room for growth"
            )
        elif weighted_score >= 45:
            insights.append(
                "Moderate compatibility - Could be a valuable learning experience"
            )
        elif weighted_score >= 35:
            insights.append(
                "Basic compatibility - Would require skill development but has potential"
            )
        else:
            insights.append(
                "Growth opportunity - Would require significant skill development"
            )
        
        # Education insight
        education = user_profile.get("education", [])
        if education:
            edu = education[0]
            if edu.get("field"):
                internship_category = internship.get("category", "").lower()
                edu_field = edu.get("field", "").lower()
                if any(word in internship_category for word in edu_field.split()):
                    insights.append(
                        f"Your {edu.get('field')} background is relevant to this role"
                    )
        
        # Experience insight
        experience = user_profile.get("experience", [])
        if experience:
            insights.append(
                f"Your prior experience ({len(experience)} roles) demonstrates professional readiness"
            )
        elif not experience:
            insights.append(
                "Great opportunity for first professional experience"
            )
        
        # Projects insight
        projects = user_profile.get("projects", [])
        if projects:
            insights.append(
                f"Your {len(projects)} project(s) show practical application of skills"
            )
        
        return insights[:4]
    
    def _generate_summary(
        self,
        match_percentage: float,
        skill_analysis: SkillAnalysis,
        location_analysis: LocationAnalysis,
        stipend_analysis: StipendAnalysis,
        timeline_analysis: TimelineAnalysis,
        internship: Dict
    ) -> str:
        """Generate a concise summary"""
        parts = []
        
        # Match percentage
        parts.append(f"Match: {match_percentage:.0f}%")
        
        # Skills
        parts.append(
            f"Skills: {skill_analysis.total_matched}/{skill_analysis.total_required}"
        )
        
        # Location/Work type
        work_type = internship.get("work_type", "")
        if location_analysis.is_remote_friendly:
            parts.append(f"Work: {work_type or 'Remote'}")
        else:
            parts.append(f"Location: {internship.get('location', 'TBD')[:20]}")
        
        # Stipend
        stipend = stipend_analysis.offered_stipend
        if stipend:
            parts.append(f"Stipend: ₹{stipend:,}/mo")
        
        # Duration
        duration = timeline_analysis.duration or f"{timeline_analysis.duration_months}mo"
        parts.append(f"Duration: {duration}")
        
        return " | ".join(parts)
    
    def to_dict(self, explanation: MatchExplanation) -> Dict[str, Any]:
        """Convert MatchExplanation to dictionary for API response"""
        return {
            "summary": explanation.summary,
            "overall_score": explanation.overall_score,
            "quality": explanation.quality.value,
            "skill_analysis": {
                "matching_skills": explanation.skill_analysis.matching_skills,
                "missing_skills": explanation.skill_analysis.missing_skills,
                "extra_skills": explanation.skill_analysis.extra_skills,
                "match_percentage": explanation.skill_analysis.match_percentage,
                "total_required": explanation.skill_analysis.total_required,
                "total_matched": explanation.skill_analysis.total_matched,
                "semantic_matches": explanation.skill_analysis.semantic_matches,
                "explanation": explanation.skill_analysis.explanation,
                "strength": explanation.skill_analysis.strength
            },
            "location_analysis": {
                "user_location": explanation.location_analysis.user_location,
                "internship_location": explanation.location_analysis.internship_location,
                "work_type": explanation.location_analysis.work_type,
                "is_remote_friendly": explanation.location_analysis.is_remote_friendly,
                "match_score": explanation.location_analysis.match_score,
                "explanation": explanation.location_analysis.explanation,
                "commute_feasibility": explanation.location_analysis.commute_feasibility
            },
            "stipend_analysis": {
                "offered_stipend": explanation.stipend_analysis.offered_stipend,
                "currency": explanation.stipend_analysis.currency,
                "match_score": explanation.stipend_analysis.match_score,
                "market_comparison": explanation.stipend_analysis.market_comparison,
                "explanation": explanation.stipend_analysis.explanation
            },
            "timeline_analysis": {
                "duration": explanation.timeline_analysis.duration,
                "duration_months": explanation.timeline_analysis.duration_months,
                "match_score": explanation.timeline_analysis.match_score,
                "explanation": explanation.timeline_analysis.explanation,
                "fit_assessment": explanation.timeline_analysis.fit_assessment
            },
            "key_strengths": explanation.key_strengths,
            "areas_to_improve": explanation.areas_to_improve,
            "recommendation_reasons": explanation.recommendation_reasons,
            "action_items": explanation.action_items,
            "compatibility_insights": explanation.compatibility_insights
        }


# ============================================================================
# MAIN RECOMMENDATION ENGINE
# ============================================================================

class YuvaSetuRecommendationEngine:
    """
    Optimized Recommendation Engine for Yuva Setu
    
    Features:
    - Fast initialization with background loading
    - Smart skill change detection (similar vs different)
    - Comprehensive match explanations
    - Efficient caching with proper invalidation
    - Top matches above configurable threshold
    - Filter-aware scoring
    """
    
    def __init__(self, model_name: str = None):
        from app.config import settings
        
        self.model_name = model_name or settings.RECOMMENDATION_MODEL
        # Use the new RecommendationConfig instead of old EngineConfig
        self.config = _load_recommendation_config()
        self.embedding_dim = settings.EMBEDDING_DIMENSION
        
        # Model (lazy loaded)
        self._model: Optional[SentenceTransformer] = None
        
        # Managers (initialized after model)
        self._skill_manager: Optional[SkillSignatureManager] = None
        self._student_cache: Optional[StudentProfileCache] = None
        self._index_manager: Optional[InternshipIndexManager] = None
        self._explanation_generator: Optional[MatchExplanationGenerator] = None
        
        # Cache paths - use cross-platform temp directory
        temp_base = Path(tempfile.gettempdir())
        cache_dir = temp_base / "recommendation_cache"
        cache_dir.mkdir(parents=True, exist_ok=True)
        self.cache_dir = cache_dir
        
        # State
        self._initialized = False
        self._initializing = False
        self._init_lock = asyncio.Lock()
        self.last_refresh: Optional[datetime] = None
    
    @property
    def model(self) -> Optional[SentenceTransformer]:
        return self._model
    
    @staticmethod
    def _clamp(value: float) -> float:
        """Clamp value between 0 and 1"""
        return max(0.0, min(1.0, float(value)))
    
    @classmethod
    def _score_to_percentage(cls, value: float, precision: int = 2) -> float:
        """Convert score to percentage"""
        return round(cls._clamp(value) * 100, precision)
    
    def has_internships(self) -> bool:
        """Check if internship data is loaded"""
        return self._index_manager is not None and self._index_manager.is_ready
    
    def is_initialized(self) -> bool:
        """Check if engine is properly initialized"""
        return self._initialized and self._model is not None
    
    async def initialize(self) -> bool:
        """Initialize the recommendation engine"""
        async with self._init_lock:
            if self._initialized:
                return True
            
            if self._initializing:
                while self._initializing and not self._initialized:
                    await asyncio.sleep(0.1)
                return self._initialized
            
            self._initializing = True
        
        try:
            logger.info("🚀 Initializing Yuva Setu Recommendation Engine...")
            start_time = datetime.utcnow()
            
            # Load model
            logger.info(f"Loading model: {self.model_name}")
            await self._load_model()
            
            if self._model is None:
                logger.error("❌ Model failed to load")
                self._initializing = False
                return False
            
            # Initialize managers
            self._skill_manager = SkillSignatureManager(self._model, self.config)
            self._student_cache = StudentProfileCache(self._skill_manager, self.config)
            self._index_manager = InternshipIndexManager(self.embedding_dim, self.cache_dir)
            self._explanation_generator = MatchExplanationGenerator(self._skill_manager, self.config)
            
            # Try to load cached indices
            cache_loaded = self._index_manager.load_from_disk()
            
            if cache_loaded:
                await self._load_internship_metadata_only()
            else:
                self._index_manager.init_indices()
                await self.load_employer_data()
            
            elapsed = (datetime.utcnow() - start_time).total_seconds()
            self._initialized = True
            self._initializing = False
            self.last_refresh = datetime.utcnow()
            
            logger.info(f"✅ Engine initialized in {elapsed:.2f}s")
            logger.info(f"   - Model: {self.model_name}")
            logger.info(f"   - Internships: {self._index_manager.total_internships}")
            logger.info(f"   - Min match threshold: {self.config.MIN_MATCH_THRESHOLD}%")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Initialization failed: {e}")
            import traceback
            logger.error(traceback.format_exc())
            self._initializing = False
            return False
    
    async def _load_model(self):
        """Load model in thread pool"""
        import os
        os.environ['TOKENIZERS_PARALLELISM'] = 'false'
        
        loop = asyncio.get_event_loop()
        
        def load_sync():
            try:
                model = SentenceTransformer(self.model_name, device='cpu')
                # Warmup
                model.encode("warmup text", convert_to_numpy=True)
                return model
            except Exception as e:
                logger.error(f"Model loading error: {e}")
                return None
        
        self._model = await loop.run_in_executor(_thread_pool, load_sync)
        
        if self._model:
            self.embedding_dim = self._model.get_sentence_embedding_dimension()
            logger.info(f"✅ Model loaded: dim={self.embedding_dim}")
    
    async def load_employer_data(self) -> bool:
        """Load internships from employer database"""
        try:
            from app.database.multi_cluster import multi_db
            employer_client = multi_db._employer_client
            
            if employer_client is None:
                logger.error("Employer client not connected")
                return False
            
            from app.config import settings
            db_name = settings.EMPLOYER_DATABASE_NAME or settings.DATABASE_NAME
            employer_db = employer_client[db_name]
            
            collection = await self._find_internships_collection(employer_db)
            if collection is None:
                logger.error("No internships collection found")
                return False
            
            logger.info("Fetching internships from database...")
            # First check count to avoid loading too many at once
            total_count = await collection.count_documents({})
            logger.info(f"Found {total_count} total internships in database")
            
            cursor = collection.find({})
            # Add timeout and limit to prevent hanging on large datasets
            try:
                logger.info("Loading all internships from cursor...")
                internships = await asyncio.wait_for(cursor.to_list(length=None), timeout=15.0)
                logger.info(f"✅ Successfully loaded {len(internships)} internships")
            except asyncio.TimeoutError:
                logger.error("❌ Database query timed out after 15s")
                # Try to get at least some internships with a limit
                logger.info("Attempting to load limited set of internships...")
                try:
                    limited_cursor = collection.find({}).limit(100)
                    internships = await limited_cursor.to_list(length=100)
                    logger.warning(f"⚠️ Loaded only {len(internships)} internships due to timeout")
                except Exception as e2:
                    logger.error(f"❌ Failed to load even limited set: {e2}")
                    return False
            
            if not internships:
                logger.warning("No internships found")
                return False
            
            logger.info(f"Found {len(internships)} internships, processing...")
            
            return await self._process_internships_batch(internships)
            
        except Exception as e:
            logger.error(f"Failed to load employer data: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return False
    
    async def _find_internships_collection(self, db):
        """Find the internships collection"""
        collection_names = ["internships", "jobs", "postings", "opportunities"]
        
        for name in collection_names:
            try:
                collection = db[name]
                count = await collection.count_documents({})
                if count > 0:
                    logger.info(f"Using collection: {name} ({count} documents)")
                    return collection
            except Exception:
                continue
        
        # Try to find any collection with documents
        try:
            all_collections = await db.list_collection_names()
            for name in all_collections:
                try:
                    collection = db[name]
                    count = await collection.count_documents({})
                    if count > 0:
                        logger.info(f"Using collection: {name} ({count} documents)")
                        return collection
                except Exception:
                    continue
        except Exception:
            pass
        
        return None
    
    async def _process_internships_batch(self, internships: List[Dict]) -> bool:
        """Process internships with batch embedding generation"""
        try:
            with_embedding = []
            without_embedding = []
            
            for internship in internships:
                stored = internship.get("embedding")
                if stored and isinstance(stored, list) and len(stored) == self.embedding_dim:
                    with_embedding.append(internship)
                else:
                    without_embedding.append(internship)
            
            logger.info(f"Embeddings: {len(with_embedding)} pre-computed, {len(without_embedding)} to generate")
            
            internship_ids = []
            internship_data = {}
            internship_vectors = {}
            skill_vectors = []
            location_vectors = []
            stipend_vectors = []
            timeline_vectors = []
            
            # Process with pre-computed embeddings
            for internship in with_embedding:
                internship_id = str(internship["_id"])
                normalized = self._normalize_employer_internship(internship)
                
                internship_ids.append(internship_id)
                internship_data[internship_id] = normalized
                
                skill_vec = np.array(internship["embedding"], dtype='float32').reshape(1, -1)
                loc_vec = self._get_location_vector(normalized)
                stip_vec = self._get_stipend_vector(normalized)
                time_vec = self._get_timeline_vector(normalized)
                
                internship_vectors[internship_id] = {
                    "skill_vector": skill_vec,
                    "location_vector": loc_vec,
                    "stipend_vector": stip_vec,
                    "timeline_vector": time_vec
                }
                
                skill_vectors.append(skill_vec)
                location_vectors.append(loc_vec)
                stipend_vectors.append(stip_vec)
                timeline_vectors.append(time_vec)
            
            # Batch process without embeddings
            if without_embedding:
                texts_to_encode = []
                for internship in without_embedding:
                    normalized = self._normalize_employer_internship(internship)
                    
                    skills = normalized.get("skills", [])
                    title = normalized.get("title", "")
                    description = str(normalized.get("description", ""))[:300]
                    category = normalized.get("category", "")
                    
                    text = f"{title} {' '.join(skills) if isinstance(skills, list) else skills} {description} {category}"
                    texts_to_encode.append(text.strip() or "internship opportunity")
                
                # Batch encode
                loop = asyncio.get_event_loop()
                embeddings = await loop.run_in_executor(
                    _thread_pool,
                    lambda: self._model.encode(
                        texts_to_encode,
                        batch_size=self.config.BATCH_ENCODING_SIZE,
                        convert_to_numpy=True,
                        show_progress_bar=False
                    )
                )
                
                for i, internship in enumerate(without_embedding):
                    internship_id = str(internship["_id"])
                    normalized = self._normalize_employer_internship(internship)
                    
                    internship_ids.append(internship_id)
                    internship_data[internship_id] = normalized
                    
                    skill_vec = embeddings[i].reshape(1, -1).astype('float32')
                    loc_vec = self._get_location_vector(normalized)
                    stip_vec = self._get_stipend_vector(normalized)
                    time_vec = self._get_timeline_vector(normalized)
                    
                    internship_vectors[internship_id] = {
                        "skill_vector": skill_vec,
                        "location_vector": loc_vec,
                        "stipend_vector": stip_vec,
                        "timeline_vector": time_vec
                    }
                    
                    skill_vectors.append(skill_vec)
                    location_vectors.append(loc_vec)
                    stipend_vectors.append(stip_vec)
                    timeline_vectors.append(time_vec)
            
            # Build indices
            skill_matrix = np.vstack(skill_vectors).astype('float32')
            location_matrix = np.vstack(location_vectors).astype('float32')
            stipend_matrix = np.vstack(stipend_vectors).astype('float32')
            timeline_matrix = np.vstack(timeline_vectors).astype('float32')
            
            success = self._index_manager.build_indices(
                skill_matrix, location_matrix, stipend_matrix, timeline_matrix,
                internship_ids, internship_data, internship_vectors
            )
            
            if success:
                self._index_manager.save_to_disk()
                self.last_refresh = datetime.utcnow()
            
            return success
            
        except Exception as e:
            logger.error(f"Batch processing failed: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return False
    
    def _normalize_employer_internship(self, internship: Dict) -> Dict:
        """Normalize internship data"""
        # Duration
        duration_months = internship.get("duration_months")
        if duration_months is None:
            duration_str = internship.get("duration", "")
            duration_months = self._parse_duration_string(duration_str)
        
        # Location
        location_str = internship.get("location", "").strip()
        city = internship.get("city", "").strip()
        state = internship.get("state", "").strip()
        
        if location_str:
            location = location_str
        elif city or state:
            parts = [p for p in [city, state] if p]
            location = ", ".join(parts) if parts else "Remote"
        else:
            location = "Remote"
        
        # Stipend
        stipend = internship.get("stipend", 0)
        if isinstance(stipend, str):
            try:
                stipend = float(stipend.replace("₹", "").replace(",", "").strip())
            except (ValueError, AttributeError):
                stipend = 0
        
        # Work type
        work_type = internship.get("work_type", "")
        if not work_type:
            if internship.get("is_remote", False):
                work_type = "Remote"
            elif internship.get("is_wfh", False):
                work_type = "WFH"
            else:
                work_type = "WFO"
        
        # Skills
        skills = internship.get("skills", [])
        if isinstance(skills, str):
            skills = [s.strip() for s in skills.split(",") if s.strip()]
        
        # Requirements
        requirements = internship.get("requirements", [])
        if isinstance(requirements, str):
            requirements = [r.strip() for r in requirements.split(",") if r.strip()]
        
        return {
            "_id": internship.get("_id"),
            "title": internship.get("title", "Untitled Internship"),
            "company": internship.get("company") or internship.get("organisation_name", "Unknown Company"),
            "description": internship.get("description", ""),
            "location": location,
            "city": city,
            "state": state,
            "work_type": work_type,
            "is_remote": work_type.lower() in ["remote", "wfh"],
            "stipend": stipend,
            "stipend_currency": internship.get("stipend_currency", "INR"),
            "duration": internship.get("duration", f"{duration_months or 3} months"),
            "duration_months": duration_months or 3,
            "skills": skills,
            "requirements": requirements,
            "category": internship.get("category") or internship.get("sector") or "General",
            "sector": internship.get("sector"),
            "apply_url": internship.get("apply_url") or internship.get("application_link", "#"),
            "is_active": internship.get("is_active", True),
            "status": internship.get("status", "active"),
            "is_featured": internship.get("is_featured", False),
            "is_verified": internship.get("is_verified", False),
            "views": internship.get("views", 0),
            "applications": internship.get("applications", 0),
            "saves": internship.get("saves", 0),
            "created_at": internship.get("created_at").isoformat() if internship.get("created_at") and isinstance(internship.get("created_at"), datetime) else (internship.get("created_at") if internship.get("created_at") else None),
            "location_coordinates": internship.get("location_coordinates"),
            "employer_uid": internship.get("employer_uid"),
        }
    
    def _parse_duration_string(self, duration_str: str) -> Optional[float]:
        """Parse duration string to months"""
        if not duration_str:
            return None
        
        duration_str = duration_str.lower().strip()
        
        try:
            import re
            numbers = re.findall(r'\d+\.?\d*', duration_str)
            if not numbers:
                return None
            
            value = float(numbers[0])
            
            if "week" in duration_str:
                return value / 4.0
            elif "day" in duration_str:
                return value / 30.0
            elif "month" in duration_str:
                return value
            elif "year" in duration_str:
                return value * 12
            else:
                return value
        except Exception:
            return None
    
    def _get_location_vector(self, internship: Dict) -> np.ndarray:
        """Get location vector"""
        coords = internship.get("location_coordinates")
        if coords and isinstance(coords, dict) and "coordinates" in coords:
            lat = coords["coordinates"][1]
            lon = coords["coordinates"][0]
            norm_lat = (lat - 8.0) / 29.0
            norm_lon = (lon - 68.0) / 29.0
            return np.array([[norm_lat, norm_lon]], dtype='float32')
        return np.array([[0.5, 0.5]], dtype='float32')
    
    def _get_stipend_vector(self, internship: Dict) -> np.ndarray:
        """Get stipend vector"""
        stipend = internship.get("stipend", 0) or 0
        norm_stipend = min(max(stipend / 50000.0, 0), 1)
        return np.array([[norm_stipend]], dtype='float32')
    
    def _get_timeline_vector(self, internship: Dict) -> np.ndarray:
        """Get timeline vector"""
        duration = internship.get("duration_months", 3) or 3
        if duration <= 1:
            timeline = 0.2
        elif duration <= 3:
            timeline = 0.5
        else:
            timeline = 0.8
        return np.array([[timeline]], dtype='float32')
    
    def _extract_user_profile(self, user: User) -> Dict:
        """Extract user profile data"""
        skills = []
        skill_levels = {}
        
        if user.skills:
            for skill in user.skills:
                name = getattr(skill, "name", None)
                level = getattr(skill, "level", "Beginner")
                if name:
                    skills.append(name)
                    skill_levels[name.lower()] = level
        
        education = []
        if user.education:
            for edu in user.education:
                education.append({
                    "degree": getattr(edu, "degree", None),
                    "field": getattr(edu, "field_of_study", None),
                    "institution": getattr(edu, "institution", None)
                })
        
        experience = []
        if user.experience:
            for exp in user.experience:
                experience.append({
                    "role": getattr(exp, "role", None),
                    "company": getattr(exp, "company", None)
                })
        
        projects = []
        if hasattr(user, 'projects') and user.projects:
            for proj in user.projects:
                projects.append({
                    "title": getattr(proj, "title", None),
                    "technologies": getattr(proj, "technologies", None)
                })
        
        return {
            "skills": skills,
            "skill_levels": skill_levels,
            "education": education,
            "experience": experience,
            "projects": projects,
            "career_objective": user.career_objective or "",
            "location_coordinates": user.location_coordinates,
            "location_query": getattr(user, 'location_query', ''),
            "preferred_stipend": getattr(user, 'preferred_stipend', None)
        }
    
    def _generate_student_vectors(self, user: User, profile_data: Dict) -> Dict[str, np.ndarray]:
        """Generate vectors for a student"""
        vectors = {}
        
        # Build skill text
        skill_texts = []
        
        for skill in profile_data.get("skills", []):
            skill_texts.append(skill)
        
        for edu in profile_data.get("education", []):
            if edu.get("degree"):
                skill_texts.append(edu["degree"])
            if edu.get("field"):
                skill_texts.append(edu["field"])
        
        for exp in profile_data.get("experience", []):
            if exp.get("role"):
                skill_texts.append(exp["role"])
        
        for proj in profile_data.get("projects", []):
            if proj.get("title"):
                skill_texts.append(proj["title"])
            if proj.get("technologies"):
                skill_texts.append(proj["technologies"])
        
        if profile_data.get("career_objective"):
            skill_texts.append(profile_data["career_objective"])
        
        combined_text = " ".join(skill_texts) if skill_texts else "student seeking internship"
        
        skill_vector = self._model.encode(combined_text, convert_to_numpy=True).reshape(1, -1)
        faiss.normalize_L2(skill_vector)
        vectors["skill_vector"] = skill_vector.astype('float32')
        
        # Location vector
        loc_coords = profile_data.get("location_coordinates")
        if loc_coords and isinstance(loc_coords, dict) and "coordinates" in loc_coords:
            coords = loc_coords["coordinates"]
            lat, lon = coords[1], coords[0]
            norm_lat = (lat - 8.0) / 29.0
            norm_lon = (lon - 68.0) / 29.0
            vectors["location_vector"] = np.array([[norm_lat, norm_lon]], dtype='float32')
        else:
            vectors["location_vector"] = np.array([[0.5, 0.5]], dtype='float32')
        
        loc_vec = vectors["location_vector"]
        norm = np.linalg.norm(loc_vec)
        if norm > 0:
            faiss.normalize_L2(loc_vec)
        
        # Stipend preference
        preferred_stipend = profile_data.get("preferred_stipend") or 10000
        norm_stipend = min(max(preferred_stipend / 50000.0, 0), 1)
        vectors["stipend_vector"] = np.array([[norm_stipend]], dtype='float32')
        
        # Timeline preference
        vectors["timeline_vector"] = np.array([[0.3]], dtype='float32')
        
        return vectors
    
    async def get_recommendations_for_student(
        self,
        user: User,
        top_k: int = 10,
        filters: Optional[Dict] = None,
        weights: Optional[Dict[str, float]] = None
    ) -> List[Dict[str, Any]]:
        """Get personalized recommendations with detailed explanations"""
        logger.info(f"🎯 get_recommendations_for_student called for user {user.id}, top_k={top_k}")
        
        if not self.is_initialized():
            logger.warning("Engine not initialized, attempting initialization...")
            try:
                # Add timeout to initialization to prevent hanging
                success = await asyncio.wait_for(self.initialize(), timeout=20.0)
                if not success:
                    logger.error("❌ Engine initialization failed")
                    return []
            except asyncio.TimeoutError:
                logger.error("❌ Engine initialization timed out after 20s")
                return []
            except Exception as e:
                logger.error(f"❌ Engine initialization error: {e}")
                return []
        
        if not self.has_internships():
            logger.warning("No internship data, attempting reload...")
            try:
                # Add timeout to prevent hanging
                success = await asyncio.wait_for(self.load_employer_data(), timeout=10.0)
                if not success or not self.has_internships():
                    logger.error("Failed to load employer data or still no internships")
                    return []
            except asyncio.TimeoutError:
                logger.error("❌ load_employer_data timed out after 10s")
                return []
            except Exception as e:
                logger.error(f"❌ Error loading employer data: {e}")
                return []
        
        logger.info("🔄 Checking refresh needed...")
        # Check for refresh (with timeout to prevent hanging)
        try:
            await asyncio.wait_for(self._check_refresh_needed(), timeout=2.0)
            logger.info("✅ Refresh check complete")
        except asyncio.TimeoutError:
            logger.warning("⚠️ Refresh check timed out, continuing anyway...")
        except Exception as e:
            logger.warning(f"⚠️ Refresh check error: {e}, continuing anyway...")
        
        logger.info("⚖️ Loading weights...")
        # Load weights
        if not weights:
            weights = await self.load_feedback_adjusted_weights()
        logger.info("✅ Weights loaded")
        
        try:
            logger.info("👤 Extracting user profile...")
            # Extract user profile
            profile_data = self._extract_user_profile(user)
            logger.info("✅ Profile extracted")
            
            logger.info("🔢 Getting student vectors (cached)...")
            # Get vectors (with caching)
            student_vectors = await self._get_student_vectors_cached(user, profile_data)
            logger.info("✅ Student vectors obtained")
            
            if student_vectors is None:
                logger.warning("❌ Student vectors are None, returning empty list")
                return []
            
            logger.info(f"🔍 Starting FAISS search (search_k={min(top_k * self.config.MAX_SEARCH_K_MULTIPLIER, self._index_manager.total_internships)})...")
            # Search
            search_k = min(top_k * self.config.MAX_SEARCH_K_MULTIPLIER, self._index_manager.total_internships)
            
            skill_scores, skill_indices = self._index_manager.search(
                student_vectors["skill_vector"], "skill", search_k
            )
            logger.info("✅ Skill search complete")
            
            location_scores, location_indices = self._index_manager.search(
                student_vectors["location_vector"], "location", search_k
            )
            logger.info("✅ Location search complete")
            
            logger.info("📊 Aggregating scores from search results...")
            # Aggregate scores
            candidates = {}
            
            for i in range(skill_indices.shape[1]):
                idx = int(skill_indices[0][i])
                if idx < 0 or idx >= len(self._index_manager.internship_ids):
                    continue
                
                internship_id = self._index_manager.internship_ids[idx]
                
                skill_score = self._clamp(float(skill_scores[0][i]))
                # Ensure minimum skill score to avoid zero matches
                if skill_score < 0.1:
                    skill_score = 0.1  # Minimum 10% skill match
                
                loc_score = self._find_score_for_index(idx, location_indices[0], location_scores[0])
                if loc_score == 0:
                    loc_score = 0.5  # Default location score
                
                # Improved default scores to ensure reasonable matches
                stipend_score = 0.7  # Increased from 0.6
                timeline_score = 0.6  # Increased from 0.5
                
                # Apply filter adjustments
                internship = self._index_manager.internship_data.get(internship_id)
                if internship and filters:
                    filter_boost = self._calculate_filter_boost(internship, filters)
                    skill_score = min(1.0, skill_score * filter_boost)
                
                weighted_score = (
                    skill_score * weights["skills"] +
                    loc_score * weights["location"] +
                    stipend_score * weights["stipend"] +
                    timeline_score * weights["timeline"]
                )
                
                if internship_id not in candidates or weighted_score > candidates[internship_id]["weighted_score"]:
                    candidates[internship_id] = {
                        "weighted_score": weighted_score,
                        "skill_score": skill_score,
                        "location_score": loc_score,
                        "stipend_score": stipend_score,
                        "timeline_score": timeline_score
                    }
            
            # Sort
            sorted_candidates = sorted(
                candidates.items(),
                key=lambda x: x[1]["weighted_score"],
                reverse=True
            )
            
            logger.info(f"🏗️ Building recommendations from {len(sorted_candidates)} candidates...")
            # Build recommendations
            recommendations = []
            filtered_count = 0
            missing_data_count = 0
            threshold_filtered_count = 0
            
            for internship_id, scores in sorted_candidates:
                match_percentage = self._score_to_percentage(scores["weighted_score"])
                
                # Check threshold
                if match_percentage < self.config.MIN_MATCH_THRESHOLD:
                    threshold_filtered_count += 1
                    if threshold_filtered_count == 1:  # Log first one
                        logger.debug(f"First candidate below threshold: {internship_id} = {match_percentage}% (threshold: {self.config.MIN_MATCH_THRESHOLD}%)")
                    continue
                
                internship = self._index_manager.internship_data.get(internship_id)
                if not internship:
                    missing_data_count += 1
                    if missing_data_count == 1:  # Log first one
                        logger.warning(f"Internship data missing for ID: {internship_id} (match: {match_percentage}%)")
                    continue
                
                # Apply filters (only if filters are provided and not empty)
                if filters:
                    # Remove empty/None filters
                    active_filters = {k: v for k, v in filters.items() if v is not None and v != "" and v != 0}
                    if active_filters and not self._apply_filters(internship, active_filters):
                        filtered_count += 1
                        if filtered_count == 1:  # Log first one
                            logger.debug(f"Filtered out {internship_id}: {match_percentage}% (active filters: {active_filters})")
                        continue
                
                # Generate explanation (with timeout protection)
                try:
                    logger.debug(f"Generating explanation for {internship_id}...")
                    explanation = self._explanation_generator.generate_explanation(
                        user, internship, scores, profile_data
                    )
                    logger.debug(f"✅ Explanation generated for {internship_id}")
                except Exception as exc:
                    logger.warning(f"Failed to generate explanation for {internship_id}: {exc}")
                    # Create a basic explanation instead
                    explanation = MatchExplanation(
                        recommendation_reasons=[f"Match score: {match_percentage}%"],
                        summary=f"Good match based on your profile"
                    )
                
                recommendation = {
                    "id": internship_id,
                    "title": internship.get("title", "Untitled Internship"),
                    "company": internship.get("company", "Unknown Company"),
                    "location": internship.get("location", "Remote"),
                    "city": internship.get("city", ""),
                    "state": internship.get("state", ""),
                    "stipend": internship.get("stipend", 0),
                    "stipend_currency": internship.get("stipend_currency", "INR"),
                    "duration": internship.get("duration", "Flexible"),
                    "duration_months": internship.get("duration_months", 3),
                    "work_type": internship.get("work_type", "Remote"),
                    "description": internship.get("description", ""),
                    "requirements": internship.get("requirements", []),
                    "skills": internship.get("skills", []),
                    "is_remote": internship.get("is_remote", False),
                    "category": internship.get("category", "General"),
                    "sector": internship.get("sector", ""),
                    "apply_url": internship.get("apply_url", "#"),
                    "match_percentage": match_percentage,
                    "score_breakdown": {
                        "skills": self._score_to_percentage(scores["skill_score"], 1),
                        "location": self._score_to_percentage(scores["location_score"], 1),
                        "stipend": self._score_to_percentage(scores["stipend_score"], 1),
                        "timeline": self._score_to_percentage(scores["timeline_score"], 1)
                    },
                    "match_reasons": explanation.recommendation_reasons,
                    "detailed_explanation": self._explanation_generator.to_dict(explanation),
                    "has_applied": False,
                    "status": internship.get("status", "active"),
                    "is_featured": internship.get("is_featured", False),
                    "is_verified": internship.get("is_verified", False),
                    "views": internship.get("views", 0),
                    "applications": internship.get("applications", 0),
                    "created_at": internship.get("created_at").isoformat() if internship.get("created_at") and isinstance(internship.get("created_at"), datetime) else (internship.get("created_at") if internship.get("created_at") else None),
                }
                
                recommendations.append(recommendation)
                
                if len(recommendations) >= top_k:
                    break
            
            logger.info(f"✅ Generated {len(recommendations)} recommendations (threshold: {self.config.MIN_MATCH_THRESHOLD}%, from {len(sorted_candidates)} candidates)")
            logger.info(f"📊 Filtering stats: {threshold_filtered_count} below threshold, {missing_data_count} missing data, {filtered_count} filtered by active filters")
            
            # If no recommendations meet threshold, log warning and investigate
            if len(recommendations) == 0 and len(sorted_candidates) > 0:
                top_score = self._score_to_percentage(sorted_candidates[0][1]['weighted_score'])
                top_id = sorted_candidates[0][0]
                logger.warning(f"No recommendations passed threshold {self.config.MIN_MATCH_THRESHOLD}%. Top candidate score: {top_score}%")
                logger.warning(f"  - Below threshold: {threshold_filtered_count}, Missing data: {missing_data_count}, Filtered: {filtered_count}")
                
                # If top score is above threshold but still no results, there's a bug - try to return top matches anyway
                if top_score >= self.config.MIN_MATCH_THRESHOLD:
                    logger.error(f"BUG DETECTED: Top score {top_score}% >= threshold {self.config.MIN_MATCH_THRESHOLD}% but no recommendations returned!")
                    logger.error(f"  This suggests data missing or filter bug. Top candidate ID: {top_id}")
                    logger.error(f"  Attempting to return top candidates anyway as fallback...")
                    
                    # Emergency fallback: return top candidates even if they failed filters
                    for internship_id, scores in sorted_candidates[:top_k]:
                        match_percentage = self._score_to_percentage(scores["weighted_score"])
                        if match_percentage >= self.config.MIN_MATCH_THRESHOLD:
                            internship = self._index_manager.internship_data.get(internship_id)
                            if internship:
                                # Create basic recommendation without explanation
                                basic_rec = {
                                    "id": internship_id,
                                    "title": internship.get("title", "Untitled Internship"),
                                    "company": internship.get("company", "Unknown Company"),
                                    "location": internship.get("location", "Remote"),
                                    "city": internship.get("city", ""),
                                    "state": internship.get("state", ""),
                                    "stipend": internship.get("stipend", 0),
                                    "stipend_currency": internship.get("stipend_currency", "INR"),
                                    "duration": internship.get("duration", "Flexible"),
                                    "duration_months": internship.get("duration_months", 3),
                                    "work_type": internship.get("work_type", "Remote"),
                                    "description": internship.get("description", ""),
                                    "requirements": internship.get("requirements", []),
                                    "skills": internship.get("skills", []),
                                    "is_remote": internship.get("is_remote", False),
                                    "category": internship.get("category", "General"),
                                    "match_percentage": match_percentage,
                                    "score_breakdown": {
                                        "skills": self._score_to_percentage(scores["skill_score"], 1),
                                        "location": self._score_to_percentage(scores["location_score"], 1),
                                        "stipend": self._score_to_percentage(scores["stipend_score"], 1),
                                        "timeline": self._score_to_percentage(scores["timeline_score"], 1)
                                    },
                                    "match_reasons": [f"Match score: {match_percentage}%"],
                                    "explanation_summary": f"Good match based on your profile",
                                    "has_applied": False,
                                    "status": internship.get("status", "active"),
                                }
                                recommendations.append(basic_rec)
                                if len(recommendations) >= top_k:
                                    break
                    
                    if recommendations:
                        logger.warning(f"Emergency fallback: Returning {len(recommendations)} recommendations despite filter issues")
            
            logger.info(f"🎉 Returning {len(recommendations)} recommendations to API")
            return recommendations
            
        except Exception as e:
            logger.error(f"❌ Recommendation error: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return []
    
    async def _get_student_vectors_cached(
        self,
        user: User,
        profile_data: Dict
    ) -> Optional[Dict[str, np.ndarray]]:
        """Get student vectors with smart caching"""
        try:
            cached = self._student_cache.get_cached_vectors(user)
            
            if cached is not None:
                logger.debug(f"Using cached vectors for user {user.id}")
                return cached
            
            loop = asyncio.get_event_loop()
            vectors = await loop.run_in_executor(
                _thread_pool,
                lambda: self._generate_student_vectors(user, profile_data)
            )
            
            self._student_cache.store_vectors(user, vectors, profile_data)
            logger.debug(f"Generated and cached vectors for user {user.id}")
            
            return vectors
            
        except Exception as e:
            logger.error(f"Error getting student vectors: {e}")
            return None
    
    def _calculate_filter_boost(self, internship: Dict, filters: Dict) -> float:
        """Calculate score boost based on filter matches"""
        boost = 1.0
        matches = 0
        total = 0
        
        for key, value in filters.items():
            if value is None or value == "" or value == 0:
                continue
            
            total += 1
            matched = False
            
            if key == "location":
                loc_lower = str(value).lower().strip()
                intern_loc = str(internship.get("location", "")).lower().strip()
                intern_city = str(internship.get("city", "")).lower().strip()
                intern_state = str(internship.get("state", "")).lower().strip()
                
                if loc_lower == "remote":
                    if internship.get("is_remote", False):
                        matched = True
                else:
                    # Check if location matches
                    all_locs = [intern_loc, intern_city, intern_state]
                    for loc in all_locs:
                        if loc and (loc_lower in loc or loc in loc_lower):
                            matched = True
                            break
                    # Check comma-separated parts
                    if not matched:
                        for loc in all_locs:
                            if loc:
                                parts = [p.strip().lower() for p in loc.split(",")]
                                if loc_lower in parts or any(loc_lower in p or p in loc_lower for p in parts):
                                    matched = True
                                    break
            
            elif key == "work_type":
                filter_types = [wt.strip().lower() for wt in str(value).split(',') if wt.strip()]
                intern_wt = str(internship.get("work_type", "")).lower()
                intern_is_remote = internship.get("is_remote", False)
                
                for ft in filter_types:
                    if ft in intern_wt or intern_wt in ft:
                        matched = True
                        break
                    if ft == "remote" and intern_is_remote:
                        matched = True
                        break
            
            elif key == "min_stipend":
                stipend = internship.get("stipend") or 0
                if isinstance(stipend, (int, float)) and stipend >= value:
                    matched = True
            
            elif key == "max_stipend":
                stipend = internship.get("stipend") or 0
                if isinstance(stipend, (int, float)) and stipend <= value:
                    matched = True
            
            elif key == "duration":
                dur_lower = str(value).lower().strip()
                intern_dur = str(internship.get("duration", "")).lower().strip()
                
                if intern_dur and dur_lower in intern_dur:
                    matched = True
                elif internship.get("duration_months"):
                    duration_map = {
                        "45 days": 1.5, "1 month": 1, "2 months": 2,
                        "3 months": 3, "6 months": 6
                    }
                    filter_months = duration_map.get(dur_lower)
                    if filter_months:
                        intern_months = internship.get("duration_months")
                        if intern_months and abs(intern_months - filter_months) <= 0.5:
                            matched = True
            
            if matched:
                matches += 1
        
        if total > 0:
            ratio = matches / total
            if ratio >= 0.75:
                boost = self.config.FILTER_MATCH_BOOST
            elif ratio >= 0.5:
                boost = self.config.FILTER_PARTIAL_BOOST
        
        return boost
    
    def _find_score_for_index(
        self,
        target_idx: int,
        indices: np.ndarray,
        scores: np.ndarray
    ) -> float:
        """Find score for a specific index"""
        matches = np.where(indices == target_idx)[0]
        if matches.size > 0:
            return self._clamp(float(scores[matches[0]]))
        return 0.0
    
    def _apply_filters(self, internship: Dict, filters: Dict) -> bool:
        """Apply strict filters - returns True if internship passes all filters"""
        for key, value in filters.items():
            # Skip empty/None/zero values
            if value is None or value == "" or value == 0:
                continue
            
            if key == "location":
                loc_lower = str(value).lower().strip()
                if loc_lower and loc_lower not in ["all locations", "all", ""]:
                    intern_loc = str(internship.get("location", "")).lower().strip()
                    intern_city = str(internship.get("city", "")).lower().strip()
                    intern_state = str(internship.get("state", "")).lower().strip()
                    is_remote = internship.get("is_remote", False)
                    
                    # Handle remote filter
                    if loc_lower == "remote":
                        if not is_remote:
                            return False
                    else:
                        # Check if location matches any part of internship location
                        matched = False
                        
                        # Check exact match
                        if (loc_lower == intern_loc or 
                            loc_lower == intern_city or 
                            loc_lower == intern_state):
                            matched = True
                        
                        # Check if filter is contained in location strings
                        if not matched:
                            all_locations = [intern_loc, intern_city, intern_state]
                            for loc_str in all_locations:
                                if loc_str and (loc_lower in loc_str or loc_str in loc_lower):
                                    matched = True
                                    break
                        
                        # Check individual parts (comma-separated)
                        if not matched:
                            for loc_str in [intern_loc, intern_city, intern_state]:
                                if loc_str:
                                    parts = [p.strip().lower() for p in loc_str.split(",")]
                                    if loc_lower in parts or any(loc_lower in part or part in loc_lower for part in parts):
                                        matched = True
                                        break
                        
                        if not matched:
                            return False
            
            elif key == "work_type":
                filter_types = [wt.strip().upper() for wt in str(value).split(',') if wt.strip()]
                if not filter_types:
                    continue
                    
                intern_wt = str(internship.get("work_type", "")).upper()
                intern_is_remote = internship.get("is_remote", False)
                
                matched = False
                for ft in filter_types:
                    ft_clean = ft.strip()
                    # Exact match
                    if ft_clean == intern_wt or intern_wt == ft_clean:
                        matched = True
                        break
                    # Contains match
                    if ft_clean in intern_wt or intern_wt in ft_clean:
                        matched = True
                        break
                    # Special cases
                    if ft_clean == "REMOTE" and intern_is_remote:
                        matched = True
                        break
                    if ft_clean in ["WFH", "WORK FROM HOME"] and ("WFH" in intern_wt or "HOME" in intern_wt):
                        matched = True
                        break
                    if ft_clean in ["WFO", "WORK FROM OFFICE", "ONSITE"] and ("WFO" in intern_wt or "OFFICE" in intern_wt or "ONSITE" in intern_wt):
                        matched = True
                        break
                    if ft_clean == "HYBRID" and "HYBRID" in intern_wt:
                        matched = True
                        break
                
                if not matched:
                    return False
            
            elif key == "min_stipend":
                stipend = internship.get("stipend") or 0
                if isinstance(stipend, (int, float)):
                    if stipend < value:
                        return False
            
            elif key == "max_stipend":
                stipend = internship.get("stipend") or 0
                if isinstance(stipend, (int, float)):
                    if stipend > value:
                        return False
            
            elif key == "duration":
                dur_lower = str(value).lower().strip()
                if not dur_lower:
                    continue
                    
                intern_dur = str(internship.get("duration", "")).lower().strip()
                intern_months = internship.get("duration_months")
                
                # Try exact string match first
                matched = False
                if intern_dur:
                    # Exact match
                    if dur_lower == intern_dur:
                        matched = True
                    # Substring match with word boundaries
                    elif dur_lower in intern_dur:
                        import re
                        pattern = r'\b' + re.escape(dur_lower) + r'\b'
                        if re.search(pattern, intern_dur):
                            matched = True
                
                # Try numeric comparison if string match failed
                if not matched:
                    duration_map = {
                        "45 days": 1.5, "45 day": 1.5,
                        "1 month": 1, "1 months": 1,
                        "2 months": 2, "2 month": 2,
                        "3 months": 3, "3 month": 3,
                        "6 months": 6, "6 month": 6
                    }
                    filter_months = duration_map.get(dur_lower)
                    
                    if filter_months is not None and intern_months is not None:
                        # Allow flexibility of ±0.5 months
                        if abs(intern_months - filter_months) <= 0.5:
                            matched = True
                
                if not matched:
                    return False
        
        return True
    
    async def _check_refresh_needed(self):
        """Check if background refresh is needed"""
        if self.last_refresh is None:
            return
        
        # Always check for new internships, but only refresh if count changed
        # This allows immediate detection of new internships without waiting 1 hour
        try:
            from app.database.multi_cluster import get_employer_database
            employer_db = await get_employer_database()
            collection = await self._find_internships_collection(employer_db)
            
            if collection:
                current_count = await collection.count_documents({})
                cached_count = self._index_manager.internship_count
                
                if current_count != cached_count:
                    logger.info(f"🔄 New internships detected! Cached: {cached_count}, Current: {current_count}, scheduling refresh...")
                    # Trigger immediate refresh
                    asyncio.create_task(self._background_refresh())
                    # Update last_refresh to avoid immediate re-check
                    self.last_refresh = datetime.utcnow()
                else:
                    # Update last_refresh only if enough time has passed to avoid constant DB queries
                    elapsed = datetime.utcnow() - self.last_refresh
                    if elapsed > timedelta(minutes=5):  # Check every 5 minutes instead of every request
                        self.last_refresh = datetime.utcnow()
        except Exception as e:
            logger.debug(f"Refresh check error: {e}")
    
    async def _background_refresh(self):
        """Background refresh of data"""
        try:
            logger.info("Starting background refresh...")
            self._index_manager.init_indices()
            success = await self.load_employer_data()
            
            if success:
                logger.info("✅ Background refresh complete")
            else:
                logger.warning("⚠️ Background refresh failed")
        except Exception as e:
            logger.error(f"Background refresh error: {e}")
    
    async def _load_internship_metadata_only(self) -> bool:
        """Load only metadata when indices are cached"""
        try:
            from app.database.multi_cluster import get_employer_database
            employer_db = await get_employer_database()
            collection = await self._find_internships_collection(employer_db)
            
            if collection is None:
                return False
            
            # Exclude embedding field to speed up query
            cursor = collection.find({}, {"embedding": 0})
            # Add timeout to prevent hanging
            try:
                internships = await asyncio.wait_for(cursor.to_list(length=None), timeout=15.0)
            except asyncio.TimeoutError:
                logger.error("❌ Metadata query timed out after 15s")
                return False
            
            for internship in internships:
                internship_id = str(internship["_id"])
                normalized = self._normalize_employer_internship(internship)
                self._index_manager.internship_data[internship_id] = normalized
            
            logger.info(f"✅ Loaded metadata for {len(internships)} internships")
            return True
            
        except Exception as e:
            logger.error(f"Metadata loading error: {e}")
            return False
    
    async def load_feedback_adjusted_weights(self) -> Dict[str, float]:
        """Load weights from feedback or use defaults"""
        try:
            weights_path = Path("models/feedback_adjusted_weights.json")
            if weights_path.exists():
                with open(weights_path) as f:
                    data = json.load(f)
                weights = data.get('weights')
                if weights:
                    logger.debug(f"Loaded feedback weights: {weights}")
                    return weights
        except Exception:
            pass
        
        try:
            trained_path = Path("models/trained_weights.json")
            if trained_path.exists():
                with open(trained_path) as f:
                    data = json.load(f)
                weights = data.get('final_weights')
                if weights:
                    logger.debug(f"Loaded trained weights: {weights}")
                    return weights
        except Exception:
            pass
        
        return self.config.DEFAULT_WEIGHTS.copy()
    
    async def get_trending_internships(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get trending internships"""
        try:
            from app.database.multi_cluster import get_employer_database
            employer_db = await get_employer_database()
            
            # Try to find collection using the helper method
            collection = await self._find_internships_collection(employer_db)
            
            # If helper method fails, try direct access
            if collection is None:
                logger.warning("_find_internships_collection returned None, trying direct access")
                collection = employer_db.internships
            
            if collection is None:
                logger.error("No internships collection found")
                return []
            
            # Try to get trending internships with multiple status options
            query = {
                "$or": [
                    {"is_active": True},
                    {"status": {"$in": ["active", "open", "Active", "Open", "published", "Published"]}},
                    {"status": {"$exists": False}}  # Include internships without status field
                ]
            }
            
            trending = await collection.find(query).sort([
                ("is_featured", -1),
                ("views", -1),
                ("applications", -1),
                ("created_at", -1)
            ]).limit(limit).to_list(length=limit)
            
            logger.info(f"Found {len(trending)} trending internships from database")
            
            result = []
            for internship in trending:
                try:
                    normalized = self._normalize_employer_internship(internship)
                    normalized["id"] = str(internship.get("_id", ""))
                    if normalized.get("title"):  # Only add if has title
                        result.append(normalized)
                except Exception as norm_exc:
                    logger.warning(f"Failed to normalize internship {internship.get('_id')}: {norm_exc}")
                    continue
            
            logger.info(f"Returning {len(result)} normalized trending internships")
            return result
            
        except Exception as e:
            logger.error(f"Trending error: {e}", exc_info=True)
            return []
    
    async def refresh_data(self) -> bool:
        """Force refresh of data"""
        logger.info("Forcing data refresh...")
        self._index_manager.init_indices()
        success = await self.load_employer_data()
        if success:
            self.last_refresh = datetime.utcnow()
            self._index_manager.save_to_disk()
        return success
    
    def invalidate_user_cache(self, user_id: str):
        """Invalidate cache for a specific user"""
        if self._student_cache:
            self._student_cache.invalidate(user_id)
            logger.info(f"Invalidated cache for user {user_id}")
    
    def get_engine_stats(self) -> Dict[str, Any]:
        """Get engine statistics"""
        stats = {
            "initialized": self._initialized,
            "model_name": self.model_name,
            "embedding_dim": self.embedding_dim,
            "min_match_threshold": self.config.MIN_MATCH_THRESHOLD,
            "internship_count": self._index_manager.total_internships if self._index_manager else 0,
            "last_refresh": self.last_refresh.isoformat() if self.last_refresh else None,
        }
        
        if self._student_cache:
            stats["cache_stats"] = self._student_cache.get_cache_stats()
        
        return stats


# ============================================================================
# GLOBAL INSTANCE MANAGEMENT
# ============================================================================

_recommendation_engine: Optional[YuvaSetuRecommendationEngine] = None
_engine_lock = asyncio.Lock()
_initialization_started = False


async def get_recommendation_engine() -> YuvaSetuRecommendationEngine:
    """Get or create recommendation engine instance"""
    global _recommendation_engine, _initialization_started
    
    if _recommendation_engine is not None and _recommendation_engine.is_initialized():
        return _recommendation_engine
    
    async with _engine_lock:
        if _recommendation_engine is None:
            logger.info("🔧 Creating new recommendation engine instance...")
            _recommendation_engine = YuvaSetuRecommendationEngine()
        
        if not _recommendation_engine.is_initialized() and not _initialization_started:
            _initialization_started = True
            logger.info("🚀 Starting engine initialization (with 25s timeout)...")
            try:
                # Add timeout to prevent hanging
                initialized = await asyncio.wait_for(
                    _recommendation_engine.initialize(),
                    timeout=25.0
                )
                if not initialized:
                    logger.error("❌ Engine initialization failed")
                    _initialization_started = False
                else:
                    logger.info("✅ Engine initialization completed successfully")
            except asyncio.TimeoutError:
                logger.error("❌ Engine initialization timed out after 25s")
                _initialization_started = False
                raise RuntimeError("Recommendation engine initialization timed out. Please try again.")
            except Exception as e:
                logger.error(f"❌ Engine initialization error: {e}", exc_info=True)
                _initialization_started = False
                raise
    
    return _recommendation_engine


async def reset_recommendation_engine() -> None:
    """Reset the recommendation engine"""
    global _recommendation_engine, _initialization_started
    
    async with _engine_lock:
        if _recommendation_engine:
            # Clear caches
            if _recommendation_engine._student_cache:
                _recommendation_engine._student_cache.embedding_cache.clear()
        
        _recommendation_engine = None
        _initialization_started = False
        logger.info("Recommendation engine reset")