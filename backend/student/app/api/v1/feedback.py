# File: app/api/v1/feedback.py (continued)
"""
User feedback collection for continuous learning
"""
from fastapi import APIRouter, Depends, HTTPException, Body
from typing import Dict, Any, Optional, List
from datetime import datetime
from enum import Enum
import logging

from app.api.deps import get_current_user
from app.models.user import User
from app.database.multi_cluster import get_student_database

router = APIRouter(prefix="/feedback", tags=["Feedback"])
logger = logging.getLogger(__name__)


class FeedbackType(str, Enum):
    RECOMMENDATION_QUALITY = "recommendation_quality"
    MATCH_ACCURACY = "match_accuracy"
    RELEVANCE = "relevance"
    APPLICATION_OUTCOME = "application_outcome"


class InteractionType(str, Enum):
    VIEW = "view"
    CLICK = "click"
    SAVE = "save"
    APPLY = "apply"
    DISMISS = "dismiss"
    HIDE = "hide"


@router.post("/recommendation-feedback")
async def submit_recommendation_feedback(
    internship_id: str = Body(...),
    feedback_type: FeedbackType = Body(...),
    rating: int = Body(..., ge=1, le=5),
    feedback_text: Optional[str] = Body(None),
    match_reasons_helpful: Optional[List[str]] = Body(None),
    current_user: User = Depends(get_current_user)
):
    """
    Submit feedback on a recommendation
    Rating: 1-5 (1=Very Poor, 5=Excellent)
    """
    try:
        db = await get_student_database()
        feedback_collection = db.recommendation_feedback
        
        feedback_doc = {
            "user_id": str(current_user.id),
            "internship_id": internship_id,
            "feedback_type": feedback_type.value,
            "rating": rating,
            "feedback_text": feedback_text,
            "match_reasons_helpful": match_reasons_helpful,
            "user_skills": [s.name for s in (current_user.skills or []) if hasattr(s, 'name')],
            "user_location": current_user.city if hasattr(current_user, 'city') else current_user.location_query,
            "created_at": datetime.utcnow(),
            "processed": False
        }
        
        result = await feedback_collection.insert_one(feedback_doc)
        
        logger.info(f"Feedback submitted: user={current_user.id}, internship={internship_id}, rating={rating}")
        
        return {
            "success": True,
            "message": "Thank you for your feedback!",
            "feedback_id": str(result.inserted_id)
        }
    
    except Exception as e:
        logger.error(f"Error submitting feedback: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit feedback")


@router.post("/interaction")
async def track_interaction(
    internship_id: str = Body(...),
    interaction_type: InteractionType = Body(...),
    duration_seconds: Optional[int] = Body(None),
    position_in_list: Optional[int] = Body(None),
    search_query: Optional[str] = Body(None),
    recommendation_score: Optional[float] = Body(None),
    current_user: User = Depends(get_current_user)
):
    """
    Track user interaction with recommendations (implicit feedback)
    """
    try:
        db = await get_student_database()
        interactions_collection = db.user_interactions
        
        interaction_doc = {
            "user_id": str(current_user.id),
            "internship_id": internship_id,
            "interaction_type": interaction_type.value,
            "duration_seconds": duration_seconds,
            "position_in_list": position_in_list,
            "search_query": search_query,
            "recommendation_score": recommendation_score,
            "timestamp": datetime.utcnow(),
            "processed": False
        }
        
        await interactions_collection.insert_one(interaction_doc)
        
        return {"success": True}
    
    except Exception as e:
        logger.error(f"Error tracking interaction: {e}")
        return {"success": False}


@router.post("/application-outcome")
async def submit_application_outcome(
    internship_id: str = Body(...),
    application_id: str = Body(...),
    outcome: str = Body(...),  # accepted, rejected, interview, offer
    satisfaction: Optional[int] = Body(None, ge=1, le=5),
    comments: Optional[str] = Body(None),
    current_user: User = Depends(get_current_user)
):
    """
    Track application outcome for learning
    """
    try:
        db = await get_student_database()
        outcomes_collection = db.application_outcomes
        
        outcome_doc = {
            "user_id": str(current_user.id),
            "internship_id": internship_id,
            "application_id": application_id,
            "outcome": outcome,
            "satisfaction": satisfaction,
            "comments": comments,
            "user_profile_at_application": {
                "skills": [s.name for s in (current_user.skills or []) if hasattr(s, 'name')],
                "education": [e.degree for e in (current_user.education or []) if hasattr(e, 'degree')],
            },
            "created_at": datetime.utcnow(),
            "processed": False
        }
        
        await outcomes_collection.insert_one(outcome_doc)
        
        logger.info(f"Application outcome tracked: user={current_user.id}, outcome={outcome}")
        
        return {
            "success": True,
            "message": "Outcome recorded successfully"
        }
    
    except Exception as e:
        logger.error(f"Error tracking outcome: {e}")
        raise HTTPException(status_code=500, detail="Failed to record outcome")


@router.get("/my-feedback-stats")
async def get_my_feedback_stats(
    current_user: User = Depends(get_current_user)
):
    """
    Get user's feedback contribution stats
    """
    try:
        db = await get_student_database()
        
        feedback_count = await db.recommendation_feedback.count_documents({
            "user_id": str(current_user.id)
        })
        
        interactions_count = await db.user_interactions.count_documents({
            "user_id": str(current_user.id)
        })
        
        outcomes_count = await db.application_outcomes.count_documents({
            "user_id": str(current_user.id)
        })
        
        # Calculate average rating given
        pipeline = [
            {"$match": {"user_id": str(current_user.id)}},
            {"$group": {"_id": None, "avg_rating": {"$avg": "$rating"}}}
        ]
        avg_result = await db.recommendation_feedback.aggregate(pipeline).to_list(1)
        avg_rating = avg_result[0]["avg_rating"] if avg_result else None
        
        return {
            "success": True,
            "stats": {
                "feedback_submitted": feedback_count,
                "interactions_tracked": interactions_count,
                "outcomes_reported": outcomes_count,
                "average_rating_given": round(avg_rating, 2) if avg_rating else None,
                "contribution_level": _get_contribution_level(feedback_count + outcomes_count)
            }
        }
    
    except Exception as e:
        logger.error(f"Error getting feedback stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to get stats")


def _get_contribution_level(total_contributions: int) -> str:
    """Determine contribution level based on total contributions"""
    if total_contributions >= 50:
        return "Gold Contributor"
    elif total_contributions >= 20:
        return "Silver Contributor"
    elif total_contributions >= 5:
        return "Bronze Contributor"
    else:
        return "New Contributor"


@router.get("/system-feedback-summary")
async def get_system_feedback_summary(
    current_user: User = Depends(get_current_user)
):
    """
    Get overall system feedback summary (for admin/display purposes)
    """
    try:
        db = await get_student_database()
        
        # Overall stats
        total_feedback = await db.recommendation_feedback.count_documents({})
        total_interactions = await db.user_interactions.count_documents({})
        total_outcomes = await db.application_outcomes.count_documents({})
        
        # Average satisfaction
        pipeline = [
            {"$group": {"_id": None, "avg_rating": {"$avg": "$rating"}, "count": {"$sum": 1}}}
        ]
        rating_result = await db.recommendation_feedback.aggregate(pipeline).to_list(1)
        
        # Rating distribution
        rating_dist_pipeline = [
            {"$group": {"_id": "$rating", "count": {"$sum": 1}}},
            {"$sort": {"_id": 1}}
        ]
        rating_dist = await db.recommendation_feedback.aggregate(rating_dist_pipeline).to_list(10)
        
        # Outcome distribution
        outcome_dist_pipeline = [
            {"$group": {"_id": "$outcome", "count": {"$sum": 1}}}
        ]
        outcome_dist = await db.application_outcomes.aggregate(outcome_dist_pipeline).to_list(10)
        
        # Interaction type distribution
        interaction_dist_pipeline = [
            {"$group": {"_id": "$interaction_type", "count": {"$sum": 1}}}
        ]
        interaction_dist = await db.user_interactions.aggregate(interaction_dist_pipeline).to_list(10)
        
        return {
            "success": True,
            "summary": {
                "total_feedback_submissions": total_feedback,
                "total_interactions": total_interactions,
                "total_outcomes_tracked": total_outcomes,
                "average_satisfaction_rating": round(rating_result[0]["avg_rating"], 2) if rating_result else None,
                "rating_distribution": {str(r["_id"]): r["count"] for r in rating_dist},
                "outcome_distribution": {r["_id"]: r["count"] for r in outcome_dist},
                "interaction_distribution": {r["_id"]: r["count"] for r in interaction_dist}
            }
        }
    
    except Exception as e:
        logger.error(f"Error getting system feedback summary: {e}")
        raise HTTPException(status_code=500, detail="Failed to get summary")