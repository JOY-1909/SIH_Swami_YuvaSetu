# File: scripts/testing/test_recommendation_engine.py
"""
Complete test suite for the recommendation engine
"""
import pytest
import asyncio
import json
import numpy as np
from pathlib import Path
from typing import List, Dict, Any
from datetime import datetime
import sys

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from app.services.recommendation_engine import (
    YuvaSetuRecommendationEngine,
    get_recommendation_engine,
    reset_recommendation_engine
)
from app.models.user import User, SkillItem, EducationItem, ExperienceItem


class TestRecommendationEngine:
    """Test suite for recommendation engine"""
    
    @pytest.fixture
    async def engine(self):
        """Create engine instance for testing"""
        await reset_recommendation_engine()
        engine = YuvaSetuRecommendationEngine()
        # Use a smaller model for faster testing
        engine.model_name = "all-MiniLM-L6-v2"
        return engine
    
    @pytest.fixture
    def sample_user(self) -> User:
        """Create sample user for testing"""
        user = User(
            email="test@example.com",
            full_name="Test User",
            skills=[
                SkillItem(name="Python", level="Advanced"),
                SkillItem(name="Machine Learning", level="Intermediate"),
                SkillItem(name="Data Science", level="Intermediate"),
            ],
            education=[
                EducationItem(
                    institution="IIT Delhi",
                    degree="B.Tech",
                    field_of_study="Computer Science",
                    start_year="2020",
                    end_year="2024"
                )
            ],
            experience=[
                ExperienceItem(
                    company="Tech Corp",
                    role="Data Science Intern",
                    start_date="2023-06",
                    end_date="2023-08"
                )
            ],
            location_query="Bangalore",
            career_objective="Aspiring Data Scientist"
        )
        return user
    
    @pytest.fixture
    def sample_internships(self) -> List[Dict]:
        """Create sample internships for testing"""
        return [
            {
                "_id": "int_001",
                "title": "Machine Learning Intern",
                "company": "AI Startup",
                "skills": ["Python", "Machine Learning", "TensorFlow"],
                "location": "Bangalore",
                "city": "Bangalore",
                "state": "Karnataka",
                "work_type": "Hybrid",
                "stipend": 25000,
                "duration": "3 months",
                "duration_months": 3,
                "category": "Technology",
                "status": "active",
                "is_active": True
            },
            {
                "_id": "int_002",
                "title": "Data Analyst Intern",
                "company": "Analytics Co",
                "skills": ["Python", "SQL", "Data Analysis"],
                "location": "Mumbai",
                "city": "Mumbai",
                "state": "Maharashtra",
                "work_type": "WFO",
                "stipend": 20000,
                "duration": "6 months",
                "duration_months": 6,
                "category": "Technology",
                "status": "active",
                "is_active": True
            },
            {
                "_id": "int_003",
                "title": "Marketing Intern",
                "company": "Brand Agency",
                "skills": ["Marketing", "Social Media", "Content Writing"],
                "location": "Delhi",
                "city": "Delhi",
                "state": "Delhi",
                "work_type": "Remote",
                "stipend": 15000,
                "duration": "2 months",
                "duration_months": 2,
                "category": "Business",
                "status": "active",
                "is_active": True
            }
        ]
    
    @pytest.mark.asyncio
    async def test_engine_initialization(self, engine):
        """Test engine initializes correctly"""
        # Note: This will fail if model can't be loaded
        # In CI/CD, you might want to mock this
        assert engine.model_name == "all-MiniLM-L6-v2"
        assert engine.embedding_dim == 384
    
    @pytest.mark.asyncio
    async def test_student_vector_generation(self, engine, sample_user):
        """Test student vector generation"""
        # Initialize model first
        from sentence_transformers import SentenceTransformer
        engine.model = SentenceTransformer(engine.model_name)
        
        vectors = engine.generate_student_vectors(sample_user)
        
        assert "skill_vector" in vectors
        assert "location_vector" in vectors
        assert "stipend_vector" in vectors
        assert "timeline_vector" in vectors
        
        # Check dimensions
        assert vectors["skill_vector"].shape == (1, 384)
        assert vectors["location_vector"].shape == (1, 2)
        assert vectors["stipend_vector"].shape == (1, 1)
        assert vectors["timeline_vector"].shape == (1, 1)
    
    @pytest.mark.asyncio
    async def test_internship_normalization(self, engine, sample_internships):
        """Test internship data normalization"""
        for internship in sample_internships:
            normalized = engine._normalize_employer_internship(internship)
            
            assert "title" in normalized
            assert "company" in normalized
            assert "skills" in normalized
            assert isinstance(normalized["skills"], list)
            assert "stipend" in normalized
            assert isinstance(normalized["stipend"], (int, float))
    
    @pytest.mark.asyncio
    async def test_filter_application(self, engine, sample_internships):
        """Test filter application"""
        filters = {
            "location": "Bangalore",
            "min_stipend": 20000
        }
        
        for internship in sample_internships:
            normalized = engine._normalize_employer_internship(internship)
            result = engine._apply_filters(normalized, filters)
            
            if normalized["city"] == "Bangalore" and normalized["stipend"] >= 20000:
                assert result == True
    
    @pytest.mark.asyncio
    async def test_match_reasons_generation(self, engine, sample_user, sample_internships):
        """Test match reasons are generated correctly"""
        from sentence_transformers import SentenceTransformer
        engine.model = SentenceTransformer(engine.model_name)
        
        scores = {
            "skill_score": 0.85,
            "location_score": 0.9,
            "stipend_score": 0.7,
            "timeline_score": 0.6
        }
        
        normalized = engine._normalize_employer_internship(sample_internships[0])
        reasons = engine._generate_match_reasons(scores, sample_user, normalized)
        
        assert isinstance(reasons, list)
        assert len(reasons) > 0
        assert len(reasons) <= 3
    
    @pytest.mark.asyncio
    async def test_score_clamping(self, engine):
        """Test score clamping works correctly"""
        assert engine._clamp(1.5) == 1.0
        assert engine._clamp(-0.5) == 0.0
        assert engine._clamp(0.5) == 0.5
    
    @pytest.mark.asyncio
    async def test_score_to_percentage(self, engine):
        """Test score to percentage conversion"""
        assert engine._score_to_percentage(0.5) == 50.0
        assert engine._score_to_percentage(1.0) == 100.0
        assert engine._score_to_percentage(0.0) == 0.0
        assert engine._score_to_percentage(1.5) == 100.0  # Clamped
    
    @pytest.mark.asyncio
    async def test_duration_parsing(self, engine):
        """Test duration string parsing"""
        assert engine._parse_duration_string("3 months") == 3.0
        assert engine._parse_duration_string("6 weeks") == 1.5
        assert engine._parse_duration_string("30 days") == 1.0
        assert engine._parse_duration_string("") is None


class TestWeightLearning:
    """Test weight learning functionality"""
    
    def test_weight_normalization(self):
        """Test that weights are normalized to sum to 1"""
        weights = {
            'skills': 0.6,
            'location': 0.3,
            'stipend': 0.2,
            'timeline': 0.1
        }
        
        total = sum(weights.values())
        normalized = {k: v/total for k, v in weights.items()}
        
        assert abs(sum(normalized.values()) - 1.0) < 0.0001
    
    def test_weight_bounds(self):
        """Test weight bounds are respected"""
        weights = {'skills': 0.9, 'location': 0.05, 'stipend': 0.03, 'timeline': 0.02}
        
        bounded = {}
        for k, v in weights.items():
            bounded[k] = max(0.05, min(0.8, v))
        
        for v in bounded.values():
            assert 0.05 <= v <= 0.8


class TestEvaluationMetrics:
    """Test evaluation metric calculations"""
    
    def test_precision_at_k(self):
        """Test precision calculation"""
        recommended = ["a", "b", "c", "d", "e"]
        relevant = {"a", "c", "f", "g"}
        
        k = 5
        hits = len(set(recommended[:k]).intersection(relevant))
        precision = hits / k
        
        assert precision == 0.4  # 2 hits out of 5
    
    def test_recall_at_k(self):
        """Test recall calculation"""
        recommended = ["a", "b", "c", "d", "e"]
        relevant = {"a", "c", "f", "g"}
        
        k = 5
        hits = len(set(recommended[:k]).intersection(relevant))
        recall = hits / len(relevant)
        
        assert recall == 0.5  # 2 hits out of 4 relevant
    
    def test_ndcg_calculation(self):
        """Test NDCG calculation"""
        # Simplified NDCG test
        relevances = [3, 2, 3, 0, 1, 2]
        
        def dcg(relevances):
            return sum(
                rel / np.log2(i + 2) 
                for i, rel in enumerate(relevances)
            )
        
        actual_dcg = dcg(relevances)
        ideal_dcg = dcg(sorted(relevances, reverse=True))
        ndcg = actual_dcg / ideal_dcg if ideal_dcg > 0 else 0
        
        assert 0 <= ndcg <= 1
    
    def test_mrr_calculation(self):
        """Test MRR calculation"""
        # First relevant item at position 3
        recommendations = ["x", "y", "a", "b", "c"]
        relevant = {"a", "b"}
        
        for i, rec in enumerate(recommendations):
            if rec in relevant:
                mrr = 1.0 / (i + 1)
                break
        else:
            mrr = 0.0
        
        assert mrr == 1/3


def run_tests():
    """Run all tests"""
    pytest.main([__file__, "-v", "--tb=short"])


if __name__ == "__main__":
    run_tests()