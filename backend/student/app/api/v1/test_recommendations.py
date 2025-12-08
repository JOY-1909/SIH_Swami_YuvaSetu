"""
Test endpoint for recommendation engine
Allows testing the matching algorithm with different student profiles
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import Optional, Dict, Any
import logging
from datetime import datetime

import numpy as np
from app.models.user import User
from app.api.deps import get_current_user
from app.services.recommendation_engine import get_recommendation_engine

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/test/match-analysis")
async def test_match_analysis(
    current_user: User = Depends(get_current_user),
    internship_id: Optional[str] = None
):
    """
    Test endpoint to analyze how a student profile matches with internships.
    Returns detailed breakdown of match scores.
    """
    try:
        engine = await get_recommendation_engine()
        
        if not engine.has_internships():
            raise HTTPException(
                status_code=503,
                detail="No internship data available for testing"
            )
        
        # Get recommendations with detailed analysis
        recommendations = await engine.get_recommendations_for_student(
            user=current_user,
            top_k=10
        )
        
        if not recommendations:
            return {
                "success": False,
                "message": "No recommendations found",
                "student_profile": {
                    "skills": [getattr(s, "name", "") for s in (current_user.skills or [])],
                    "location": current_user.location_query,
                    "career_objective": current_user.career_objective
                }
            }
        
        # If specific internship ID provided, find it
        if internship_id:
            target_rec = next(
                (r for r in recommendations if str(r.get("id")) == internship_id),
                None
            )
            if target_rec:
                return {
                    "success": True,
                    "student_profile": {
                        "user_id": str(current_user.id),
                        "skills": [getattr(s, "name", "") for s in (current_user.skills or [])],
                        "location": current_user.location_query,
                        "career_objective": current_user.career_objective[:100] if current_user.career_objective else None
                    },
                    "target_internship": {
                        "id": target_rec.get("id"),
                        "title": target_rec.get("title"),
                        "company": target_rec.get("company"),
                        "match_percentage": target_rec.get("match_percentage"),
                        "detailed_explanation": target_rec.get("detailed_explanation", {})
                    },
                    "all_recommendations": [
                        {
                            "id": r.get("id"),
                            "title": r.get("title"),
                            "company": r.get("company"),
                            "match_percentage": r.get("match_percentage")
                        }
                        for r in recommendations[:5]
                    ]
                }
        
        # Return top 5 with detailed breakdown
        return {
            "success": True,
            "student_profile": {
                "user_id": str(current_user.id),
                "skills": [getattr(s, "name", "") for s in (current_user.skills or [])],
                "location": current_user.location_query,
                "career_objective": current_user.career_objective[:100] if current_user.career_objective else None
            },
            "total_internships_available": len(engine.internship_ids),
            "recommendations": [
                {
                    "rank": idx + 1,
                    "id": r.get("id"),
                    "title": r.get("title"),
                    "company": r.get("company"),
                    "match_percentage": r.get("match_percentage"),
                    "reasons": r.get("reasons", []),
                    "score_breakdown": r.get("detailed_explanation", {}).get("score_breakdown", {}) if r.get("detailed_explanation") else {}
                }
                for idx, r in enumerate(recommendations[:5])
            ],
            "test_info": {
                "faiss_index_size": engine.skill_index.ntotal if engine.skill_index else 0,
                "cache_loaded": engine.last_refresh is not None,
                "last_refresh": engine.last_refresh.isoformat() if engine.last_refresh else None
            }
        }
    except Exception as e:
        logger.error(f"Test match analysis error: {e}")
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Test failed: {str(e)}")


@router.get("/test/compare-students")
async def test_compare_students(
    current_user: User = Depends(get_current_user)
):
    """
    Compare how different aspects of student profile affect recommendations.
    Shows what happens when skills/location change.
    """
    try:
        engine = await get_recommendation_engine()
        
        if not engine.has_internships():
            raise HTTPException(
                status_code=503,
                detail="No internship data available"
            )
        
        # Get current recommendations
        current_recs = await engine.get_recommendations_for_student(
            user=current_user,
            top_k=5
        )
        
        # Generate student vectors to show what's being matched
        student_vectors = engine.generate_student_vectors(current_user)
        
        return {
            "success": True,
            "student_profile": {
                "skills": [getattr(s, "name", "") for s in (current_user.skills or [])],
                "location": current_user.location_query,
                "career_objective": current_user.career_objective[:100] if current_user.career_objective else None
            },
            "student_vectors_generated": {
                "skill_vector_dim": student_vectors.get("skill_vector", np.array([])).shape[1] if "skill_vector" in student_vectors else 0,
                "location_vector": student_vectors.get("location_vector", []).tolist() if "location_vector" in student_vectors else [],
                "stipend_preference": float(student_vectors.get("stipend_vector", [[0]])[0][0]) if "stipend_vector" in student_vectors else 0
            },
            "top_recommendations": [
                {
                    "rank": idx + 1,
                    "title": r.get("title"),
                    "company": r.get("company"),
                    "match_percentage": r.get("match_percentage"),
                    "reasons": r.get("reasons", [])[:3]
                }
                for idx, r in enumerate(current_recs[:5])
            ],
            "matching_info": {
                "total_internships": len(engine.internship_ids),
                "faiss_index_size": engine.skill_index.ntotal if engine.skill_index else 0,
                "matching_method": "FAISS vector similarity search",
                "algorithm": "Direct 1-to-1 matching (not clustering)"
            }
        }
    except Exception as e:
        logger.error(f"Test compare students error: {e}")
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Test failed: {str(e)}")


@router.get("/test/internship-details/{internship_id}")
async def test_internship_details(
    internship_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Get detailed matching analysis for a specific internship.
    Shows exactly how the student profile matches with this internship.
    """
    try:
        engine = await get_recommendation_engine()
        
        if not engine.has_internships():
            raise HTTPException(
                status_code=503,
                detail="No internship data available"
            )
        
        # Get all recommendations
        recommendations = await engine.get_recommendations_for_student(
            user=current_user,
            top_k=100  # Get more to find the specific one
        )
        
        # Find the specific internship
        target = next(
            (r for r in recommendations if str(r.get("id")) == internship_id),
            None
        )
        
        if not target:
            # Try to get it from internship_data
            if internship_id in engine.internship_data:
                internship_data = engine.internship_data[internship_id]
                # Generate a recommendation for it
                student_vectors = engine.generate_student_vectors(current_user)
                
                return {
                    "success": True,
                    "internship": internship_data,
                    "student_profile": {
                        "skills": [getattr(s, "name", "") for s in (current_user.skills or [])],
                        "location": current_user.location_query
                    },
                    "note": "This internship was not in top recommendations. Showing raw data.",
                    "matching_analysis": "Use /test/match-analysis to see why it didn't match well"
                }
            
            raise HTTPException(
                status_code=404,
                detail=f"Internship {internship_id} not found in recommendations or database"
            )
        
        return {
            "success": True,
            "internship": {
                "id": target.get("id"),
                "title": target.get("title"),
                "company": target.get("company"),
                "description": target.get("description", "")[:200],
                "skills": target.get("skills", []),
                "location": target.get("location"),
                "stipend": target.get("stipend"),
                "match_percentage": target.get("match_percentage")
            },
            "detailed_matching": target.get("detailed_explanation", {}),
            "student_profile": {
                "skills": [getattr(s, "name", "") for s in (current_user.skills or [])],
                "location": current_user.location_query,
                "career_objective": current_user.career_objective[:100] if current_user.career_objective else None
            },
            "why_matched": target.get("reasons", [])
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Test internship details error: {e}")
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Test failed: {str(e)}")

