# File: Yuva-setu/backend/app/api/v1/recommendations.py
"""
Cross-cluster recommendation API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, Dict, Any
import logging
import asyncio
from datetime import datetime
import numpy as np

from app.api.deps import get_current_user
from app.models.user import User
from app.services.recommendation_engine import get_recommendation_engine
from app.database.multi_cluster import get_student_database, get_employer_database
from app.schemas.recommendations import (
    RecommendationFilters,
    RecommendationsResponse,
    TrendingResponse,
    UserProfileSummary,
    PaginationMeta,
)

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])
logger = logging.getLogger(__name__)


@router.get("/for-student", response_model=RecommendationsResponse)
async def get_student_recommendations(
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1),
    limit: int = Query(5, ge=1, le=50),  # Default to 5 for top matches
    location: Optional[str] = None,
    work_type: Optional[str] = None,
    category: Optional[str] = None,
    min_stipend: Optional[float] = None,
    max_stipend: Optional[float] = None,
    duration: Optional[str] = None,
    search: Optional[str] = None,
    only_active: bool = True
):
    """
    Get personalized internship recommendations from employer cluster
    """
    logger.info(f"📥 Recommendation endpoint called for user {current_user.id}")
    try:
        logger.info("🔍 Getting recommendation engine instance...")
        try:
            engine = await asyncio.wait_for(get_recommendation_engine(), timeout=120.0)
            logger.info("✅ Engine instance obtained")
        except asyncio.TimeoutError:
            logger.error("❌ Failed to get engine instance (timeout)")
            raise HTTPException(
                status_code=503,
                detail="Recommendation engine is initializing. Please try again in a few moments."
            )
        except Exception as engine_exc:
            logger.error(f"❌ Error getting engine instance: {engine_exc}", exc_info=True)
            raise HTTPException(
                status_code=503,
                detail=f"Recommendation engine error: {str(engine_exc)}"
            ) from engine_exc
        
        if not engine.is_initialized():
            logger.warning("Engine not initialized, attempting to initialize...")
            try:
                success = await asyncio.wait_for(engine.initialize(), timeout=120.0)
                if not success:
                    logger.error("Failed to initialize recommendation engine")
                    raise HTTPException(status_code=503, detail="Recommendation engine initialization failed")
            except asyncio.TimeoutError:
                logger.error("Engine initialization timed out")
                raise HTTPException(status_code=503, detail="Recommendation engine initialization timed out")
            except Exception as init_exc:
                logger.error(f"Engine initialization error: {init_exc}", exc_info=True)
                raise HTTPException(status_code=503, detail=f"Recommendation engine initialization error: {str(init_exc)}") from init_exc
        
        logger.info(f"Engine initialized: {engine.is_initialized()}, Has internships: {engine.has_internships()}")
    except HTTPException:
        raise  # Re-raise HTTPExceptions as-is
    except RuntimeError as exc:
        logger.error("Recommendation engine unavailable: %s", exc, exc_info=True)
        raise HTTPException(status_code=503, detail="Recommendation engine is unavailable") from exc
    except Exception as exc:
        logger.error(f"❌ Unexpected error in recommendation endpoint: {exc}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(exc)}") from exc
    
    # Build filters for the engine
    filters: Dict[str, Any] = {}
    if location:
        filters["location"] = location
    if work_type:
        filters["work_type"] = work_type
    if min_stipend is not None:
        filters["min_stipend"] = min_stipend
    if max_stipend is not None:
        filters["max_stipend"] = max_stipend
    if duration:
        filters["duration"] = duration
    
    logger.info(f"🔍 Applied filters: {filters}")
    
    try:
        logger.info(f"🚀 Starting recommendation generation for user {current_user.id} (top_k={limit * 5})...")
        # Request more recommendations to account for filtering and threshold
        # Add timeout to prevent hanging (30 seconds max)
        try:
            recommendations = await asyncio.wait_for(
                engine.get_recommendations_for_student(
                    user=current_user,
                    top_k=limit * 5,  # Get significantly more for filtering and threshold
                    filters=filters
                ),
                timeout=60.0
            )
            logger.info(f"✅ Engine returned {len(recommendations)} recommendations for user {current_user.id} (requested top_k={limit * 5})")
        except asyncio.TimeoutError:
            logger.error(f"❌ Recommendation generation timed out after 30s for user {current_user.id}")
            raise HTTPException(
                status_code=504,
                detail="Recommendation generation timed out. Please try again."
            )
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("❌ Error getting recommendations: %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to generate recommendations") from exc
    
    logger.info(f"✅ Received {len(recommendations)} recommendations from engine before post-processing filters")
    
    # Apply additional filters (post-processing) - STRICT filtering
    filtered_recommendations = []
    for rec in recommendations:
        # Skip if only_active is True and internship is not active
        # Check both status field and is_active field
        if only_active:
            status = rec.get("status", "").lower() if rec.get("status") else ""
            is_active = rec.get("is_active", True)
            # Include if status is active OR is_active is true
            # Skip only if status is explicitly inactive AND is_active is false
            if status not in ["active", "open", "published"] and not is_active:
                continue
        
        # Location filter (post-processing)
        if location:
            location_lower = location.lower().strip()
            if location_lower and location_lower not in ["all locations", "all", ""]:
                rec_location = str(rec.get("location", "")).lower().strip()
                rec_city = str(rec.get("city", "")).lower().strip()
                rec_state = str(rec.get("state", "")).lower().strip()
                is_remote = rec.get("is_remote", False)
                
                location_matches = False
                
                if location_lower == "remote":
                    if is_remote:
                        location_matches = True
                else:
                    # Check exact matches first
                    if (location_lower == rec_location or 
                        location_lower == rec_city or 
                        location_lower == rec_state):
                        location_matches = True
                    
                    # Check substring matches
                    if not location_matches:
                        for loc_str in [rec_location, rec_city, rec_state]:
                            if loc_str:
                                # Check if filter is in location string or vice versa
                                if location_lower in loc_str or loc_str in location_lower:
                                    location_matches = True
                                    break
                                # Check comma-separated parts
                                parts = [p.strip().lower() for p in loc_str.split(",")]
                                if location_lower in parts or any(location_lower in p or p in location_lower for p in parts):
                                    location_matches = True
                                    break
                    
                    # Word boundary check for better matching
                    if not location_matches:
                        import re
                        pattern = r'\b' + re.escape(location_lower) + r'\b'
                        for loc_str in [rec_location, rec_city, rec_state]:
                            if loc_str and re.search(pattern, loc_str):
                                location_matches = True
                                break
                
                if not location_matches:
                    continue
        
        # Work type filter (post-processing)
        if work_type:
            work_type_lower = work_type.lower().strip()
            if work_type_lower:
                # Handle comma-separated values
                filter_types = [wt.strip().upper() for wt in work_type_lower.split(',') if wt.strip()]
                if filter_types:
                    rec_work_type = str(rec.get("work_type", "")).upper()
                    rec_is_remote = rec.get("is_remote", False)
                    
                    matched = False
                    for filter_type in filter_types:
                        ft_clean = filter_type.strip()
                        # Exact match
                        if ft_clean == rec_work_type or rec_work_type == ft_clean:
                            matched = True
                            break
                        # Contains match
                        if ft_clean in rec_work_type or rec_work_type in ft_clean:
                            matched = True
                            break
                        # Special cases
                        if ft_clean == "REMOTE" and rec_is_remote:
                            matched = True
                            break
                        if ft_clean in ["WFH", "WORK FROM HOME"] and ("WFH" in rec_work_type or "HOME" in rec_work_type):
                            matched = True
                            break
                        if ft_clean in ["WFO", "WORK FROM OFFICE", "ONSITE", "ON-SITE"] and ("WFO" in rec_work_type or "OFFICE" in rec_work_type or "ONSITE" in rec_work_type or "ON-SITE" in rec_work_type):
                            matched = True
                            break
                        if ft_clean == "HYBRID" and "HYBRID" in rec_work_type:
                            matched = True
                            break
                    
                    if not matched:
                        continue
        
        # Duration filter (post-processing)
        if duration:
            duration_lower = duration.lower().strip()
            if duration_lower:
                rec_duration = str(rec.get("duration", "")).lower().strip()
                rec_duration_months = rec.get("duration_months")
                
                duration_matched = False
                
                # Map common duration strings to months for comparison
                duration_map = {
                    "45 days": 1.5, "45 day": 1.5,
                    "1 month": 1, "1 months": 1,
                    "2 months": 2, "2 month": 2,
                    "3 months": 3, "3 month": 3,
                    "6 months": 6, "6 month": 6
                }
                filter_months = duration_map.get(duration_lower)
                
                # Try exact string match first
                if rec_duration:
                    if duration_lower == rec_duration:
                        duration_matched = True
                    # Try word boundary match (e.g., "3 months" in "3 months internship")
                    elif duration_lower in rec_duration:
                        import re
                        pattern = r'\b' + re.escape(duration_lower) + r'\b'
                        if re.search(pattern, rec_duration):
                            duration_matched = True
                
                # Try numeric comparison if string match failed
                if not duration_matched:
                    if rec_duration_months is not None and filter_months is not None:
                        # Allow flexibility of ±0.5 months
                        if abs(rec_duration_months - filter_months) <= 0.5:
                            duration_matched = True
                    # If no numeric match but filter_months exists, also check if it's close
                    elif filter_months and rec_duration_months:
                        if abs(rec_duration_months - filter_months) <= 1.0:  # More lenient
                            duration_matched = True
                
                if not duration_matched:
                    continue
        
        if category and rec.get("category"):
            if category.lower() not in rec["category"].lower():
                continue
        
        if search:
            search_lower = search.lower()
            matches = (
                search_lower in rec.get("title", "").lower() or
                search_lower in rec.get("company", "").lower() or
                search_lower in rec.get("description", "").lower() or
                search_lower in rec.get("category", "").lower() or
                any(search_lower in skill.lower() for skill in rec.get("skills", []))
            )
            if not matches:
                continue
        
        # Remove detailed_explanation for API response to reduce payload size
        # Keep only summary if needed
        if "detailed_explanation" in rec:
            # Keep only summary from detailed explanation
            rec["explanation_summary"] = rec["detailed_explanation"].get("summary", "")
            # Optionally remove detailed_explanation to reduce response size
            # del rec["detailed_explanation"]
        
        filtered_recommendations.append(rec)
    
    # Fallback to trending internships if no personalized results
    if not filtered_recommendations:
        logger.info(f"No personalized recommendations found (got {len(recommendations)} from engine), falling back to trending internships")
        try:
            trending = await engine.get_trending_internships(limit=limit * 3)  # Get more for safety
            logger.info(f"Trending internships returned: {len(trending)} items")
            if not trending:
                logger.warning("Trending internships also returned empty - this indicates a database or initialization issue")
                # Try to get any active internships as last resort
                try:
                    from app.database.multi_cluster import get_employer_database
                    employer_db = await get_employer_database()
                    collection = employer_db.internships
                    any_internships = await collection.find({"status": {"$in": ["active", "open", "published"]}}).limit(limit).to_list(length=limit)
                    if any_internships:
                        logger.info(f"Found {len(any_internships)} internships directly from database")
                        trending = [{"id": str(item["_id"]), **item} for item in any_internships]
                except Exception as db_exc:
                    logger.error(f"Failed to get internships from database: {db_exc}")
        except Exception as exc:
            logger.error("Error getting trending internships: %s", exc, exc_info=True)
            trending = []
        safe_trending: list[dict[str, Any]] = []
        for item in trending:
            try:
                internship_id = str(item.get("id") or item.get("_id", ""))
                
                # Calculate basic match percentage for trending internships
                # Even trending should have some match score based on basic criteria
                base_match = 30.0  # Base match for trending (they're popular for a reason)
                
                safe_trending.append(
                    {
                        "id": internship_id,
                        "title": item.get("title", "") or "",
                        "company": item.get("company", "") or "",
                        "location": item.get("location", "") or "",
                        "city": item.get("city", "") or "",
                        "state": item.get("state", "") or "",
                        "stipend": item.get("stipend", 0) or 0,
                        "stipend_currency": item.get("stipend_currency", "INR") or "INR",
                        "duration": item.get("duration", "") or "",
                        "duration_months": item.get("duration_months", 3) or 3,
                        "work_type": item.get("work_type", "") or "",
                        "description": item.get("description", "") or "",
                        "requirements": item.get("requirements", []) or [],
                        "skills": item.get("skills", []) or [],
                        "is_remote": bool(item.get("is_remote", False)) or str(item.get("work_type", "") or "").lower() == "remote",
                        "category": item.get("category", "General"),
                        "sector": item.get("sector", ""),
                        "apply_url": item.get("apply_url", "#") or "#",
                        "match_percentage": base_match,  # Give trending a reasonable base match
                        "score_breakdown": {
                            "skills": base_match * 0.5,
                            "location": base_match * 0.2,
                            "stipend": base_match * 0.15,
                            "timeline": base_match * 0.15,
                        },
                        "match_reasons": ["Trending opportunity", "High engagement"],
                        "explanation_summary": "Popular internship with high engagement",
                        "has_applied": False,
                        "status": item.get("status", "active"),
                        "is_featured": item.get("is_featured", False),
                        "is_verified": item.get("is_verified", False),
                        "views": item.get("views", 0),
                        "applications": item.get("applications", 0),
                        "created_at": item.get("created_at").isoformat() if item.get("created_at") and isinstance(item.get("created_at"), datetime) else (item.get("created_at") if item.get("created_at") else None),
                    }
                )
            except Exception as exc:
                logger.error("Failed to transform trending internship %s: %s", item, exc)
                continue

        filtered_recommendations = safe_trending
        logger.info(f"Returning {len(filtered_recommendations)} trending internships as fallback")
    
    logger.info(f"📋 Processing {len(filtered_recommendations)} filtered recommendations (from {len(recommendations)} engine results)")
    logger.info(f"📊 Filter breakdown - Engine returned: {len(recommendations)}, After post-processing filters: {len(filtered_recommendations)}")
    
    # Sort by match percentage (highest first) to ensure top matches are shown
    filtered_recommendations.sort(
        key=lambda x: x.get("match_percentage", 0), 
        reverse=True
    )
    
    total_results = len(filtered_recommendations)
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paginated_recommendations = filtered_recommendations[start_idx:end_idx]
    logger.info(f"📄 Paginated to {len(paginated_recommendations)} recommendations (page {page}, limit {limit})")
    
    # Get user's application history from student cluster
    applied_internship_ids: Dict[str, bool] = {}
    try:
        student_db = await get_student_database()
        applications_collection = student_db.applications
        user_applications = await applications_collection.find(
            {"user_id": str(current_user.id)}
        ).to_list(length=200)
        applied_internship_ids = {app["internship_id"]: True for app in user_applications}
    except Exception as exc:
        logger.error("Failed to fetch student applications: %s", exc)
    
    logger.info("🔍 Checking application status for recommendations...")
    for rec in paginated_recommendations:
        rec["has_applied"] = applied_internship_ids.get(rec["id"], False)
        # Ensure created_at is a string (ISO format) if it's a datetime object
        if "created_at" in rec and rec.get("created_at") is not None:
            if isinstance(rec["created_at"], datetime):
                rec["created_at"] = rec["created_at"].isoformat()
        elif "created_at" not in rec:
            rec["created_at"] = None
    logger.info("✅ Application status checked")
    
    logger.info("📦 Building response payload...")
    filters_payload = RecommendationFilters(
        location=location,
        work_type=work_type,
        category=category,
        min_stipend=min_stipend,
        max_stipend=max_stipend,
        duration=duration,
        search=search,
    )
    
    user_summary = UserProfileSummary(
        skills_count=len(current_user.skills) if current_user.skills else 0,
        experience_count=len(current_user.experience) if current_user.experience else 0,
        education_count=len(current_user.education) if current_user.education else 0,
        preferred_location=current_user.location_query or "",
    )
    
    pagination_meta = PaginationMeta(
        page=page,
        limit=limit,
        total=total_results,
        pages=(total_results + limit - 1) // limit,
    )
    
    logger.info(f"✅ Returning response with {len(paginated_recommendations)} recommendations")
    return {
        "success": True,
        "recommendations": paginated_recommendations,
        "pagination": pagination_meta,
        "filters": filters_payload,
        "user_profile_summary": user_summary,
    }


@router.get("/trending-internships", response_model=TrendingResponse)
async def get_trending_internships(
    current_user: Optional[User] = Depends(get_current_user),
    limit: int = Query(10, ge=1, le=50)
):
    """
    Get trending internships from employer cluster
    """
    try:
        # Connect to employer database
        employer_db = await get_employer_database()
        
        # Log database name for debugging
        db_name = employer_db.name
        logger.info(f"Fetching trending internships from employer database: {db_name}")
        
        # Try to access collections directly (don't rely on list_collection_names)
        collection_names = ["internships", "jobs", "postings", "opportunities"]
        internships_collection = None
        found_collection_name = None
        
        # Try each collection name by attempting to access it directly
        for name in collection_names:
            try:
                test_collection = employer_db[name]
                # Verify collection exists and is accessible
                try:
                    doc_count = await test_collection.estimated_document_count()
                except:
                    doc_count = await test_collection.count_documents({})
                
                logger.info(f"✅ Found collection: {name} (has {doc_count} documents)")
                internships_collection = test_collection
                found_collection_name = name
                break
            except Exception as e:
                error_msg = str(e)[:200] if e else "Unknown error"
                logger.info(f"Collection {name} not accessible: {type(e).__name__}: {error_msg}")
                continue
        
        # If direct access failed, try listing collections as fallback
        if internships_collection is None:
            logger.warning("Direct collection access failed, trying to list collections...")
            try:
                collections = await employer_db.list_collection_names()
                logger.info(f"Available collections in employer DB ({db_name}): {collections}")
                
                for name in collection_names:
                    if name in collections:
                        internships_collection = employer_db[name]
                        found_collection_name = name
                        logger.info(f"Using collection from list: {name}")
                        break
            except Exception as e:
                logger.warning(f"Could not list collections: {e}")
        
        if internships_collection is None:
            logger.error(f"No accessible internships collection found in database: {db_name}")
            logger.error(f"Tried collections: {collection_names}")
            raise HTTPException(status_code=404, detail=f"No internships collection found in employer database: {db_name}")
        
        # Get trending internships (most viewed/applied in last 7 days)
        trending_internships = await internships_collection.find({
            "$or": [
                {"status": {"$in": ["active", "open", "published", "Active", "Open", "Published"]}},
                {"is_active": True},
                {"status": {"$exists": False}}
            ]
        }).sort([
            ("is_featured", -1),
            ("views", -1),
            ("applications", -1),
            ("saves", -1),
            ("created_at", -1)
        ]).limit(limit).to_list(length=limit)
        
        formatted_internships = []
        for internship in trending_internships:
            # Calculate trend score
            views = internship.get('views', 0) or 0
            applications = internship.get('applications', 0) or 0
            saves = internship.get('saves', 0) or 0
            
            trend_score = (
                views * 0.4 +
                applications * 0.3 +
                saves * 0.3
            )
            
            formatted_internships.append({
                "id": str(internship['_id']),
                "title": internship.get('title', 'Untitled Internship'),
                "company": internship.get('company') or internship.get('organisation_name', 'Unknown Company'),
                "location": internship.get('location', ''),
                "stipend": internship.get('stipend', 0),
                "duration": internship.get('duration', ''),
                "work_type": internship.get('work_type', 'Remote'),
                "views": views,
                "applications": applications,
                "saves": saves,
                "is_featured": internship.get('is_featured', False),
                "is_verified": internship.get('is_verified', False),
                "trend_score": round(trend_score, 2),
                "created_at": internship.get('created_at').isoformat() if internship.get('created_at') else None
            })
        
        # Check which trending internships user has applied to
        if current_user:
            try:
                student_db = await get_student_database()
                applications_collection = student_db.applications
                
                user_applications = await applications_collection.find({
                    "user_id": str(current_user.id)
                }).to_list(length=50)
                
                applied_ids = [app['internship_id'] for app in user_applications]
                
                for internship in formatted_internships:
                    internship['has_applied'] = internship['id'] in applied_ids
            except Exception as exc:
                logger.error("Failed to fetch user applications for trending: %s", exc)
        
        return {
            "success": True,
            "trending_internships": formatted_internships,
            "count": len(formatted_internships)
        }
        
    except Exception as e:
        logger.error(f"Error getting trending internships: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get trending internships")


@router.post("/refresh")
async def refresh_recommendation_engine(
    current_user: User = Depends(get_current_user)
):
    """
    Manually refresh the recommendation engine to include new internships.
    This endpoint should be called when new internships are added to ensure
    they appear in recommendations immediately.
    """
    try:
        logger.info(f"🔄 Manual refresh requested by user {current_user.id}")
        engine = await get_recommendation_engine()
        
        if not engine.is_initialized():
            logger.warning("Engine not initialized, initializing first...")
            success = await engine.initialize()
            if not success:
                raise HTTPException(
                    status_code=503,
                    detail="Failed to initialize recommendation engine"
                )
        
        # Force refresh of data
        logger.info("Starting manual refresh of internship data...")
        success = await engine.refresh_data()
        
        if success:
            stats = engine.get_engine_stats()
            logger.info(f"✅ Refresh complete. Internships: {stats.get('internship_count', 0)}")
            return {
                "success": True,
                "message": "Recommendation engine refreshed successfully",
                "internship_count": stats.get("internship_count", 0),
                "refreshed_at": datetime.utcnow().isoformat()
            }
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to refresh recommendation engine"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error refreshing engine: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to refresh recommendation engine: {str(e)}"
        )


@router.get("/engine-status")
async def get_engine_status(
    current_user: User = Depends(get_current_user)
):
    """
    Get the current status of the recommendation engine.
    Useful for debugging and monitoring.
    """
    try:
        engine = await get_recommendation_engine()
        stats = engine.get_engine_stats()
        
        return {
            "success": True,
            "engine": {
                "initialized": stats.get("initialized", False),
                "model_name": stats.get("model_name", "unknown"),
                "internship_count": stats.get("internship_count", 0),
                "min_match_threshold": stats.get("min_match_threshold", 25.0),
                "last_refresh": stats.get("last_refresh"),
                "has_internships": engine.has_internships(),
                "cache_stats": stats.get("cache_stats", {})
            }
        }
    except Exception as e:
        logger.error(f"Error getting engine status: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get engine status: {str(e)}"
        )


@router.get("/debug-match/{internship_id}")
async def debug_internship_match(
    internship_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Debug endpoint to see why a specific internship isn't appearing in recommendations.
    Shows detailed match analysis including scores, thresholds, and filtering reasons.
    """
    try:
        engine = await get_recommendation_engine()
        
        if not engine.is_initialized():
            return {
                "success": False,
                "error": "Engine not initialized",
                "internship_id": internship_id
            }
        
        # Check if internship exists in index
        internship_id_str = str(internship_id)
        internship = engine._index_manager.internship_data.get(internship_id_str)
        
        # Also try fetching from database directly for comparison
        db_internship = None
        try:
            employer_db = await get_employer_database()
            collection_names = ["internships", "jobs", "postings", "opportunities"]
            for name in collection_names:
                try:
                    collection = employer_db[name]
                    from bson import ObjectId
                    try:
                        doc = await collection.find_one({"_id": ObjectId(internship_id)})
                    except:
                        doc = await collection.find_one({"id": internship_id})
                    if doc:
                        db_internship = doc
                        break
                except:
                    continue
        except Exception as e:
            logger.debug(f"Could not fetch from database: {e}")
        
        if not internship and db_internship:
            # Normalize the internship data from database
            internship = {
                "title": db_internship.get("title", "Unknown"),
                "company": db_internship.get("company") or db_internship.get("organisation_name", "Unknown"),
                "skills": db_internship.get("skills", []),
                "requirements": db_internship.get("requirements", []),
                "status": db_internship.get("status", "active"),
                "is_active": db_internship.get("is_active", True),
                "location": db_internship.get("location", ""),
                "is_remote": db_internship.get("is_remote", False),
                "work_type": db_internship.get("work_type", ""),
                "location_coordinates": db_internship.get("location_coordinates")
            }
        
        if not internship:
            return {
                "success": False,
                "error": "Internship not found in index or database",
                "internship_id": internship_id,
                "suggestion": "Call /refresh endpoint to reload internships, then check again"
            }
        
        # Extract user profile
        profile_data = engine._extract_user_profile(current_user)
        user_skills = [s.get("name") if isinstance(s, dict) else getattr(s, "name", str(s)) for s in (current_user.skills or [])]
        
        # Get user vectors
        try:
            student_vectors = await engine._get_student_vectors_cached(current_user, profile_data)
        except Exception as e:
            logger.error(f"Error getting student vectors: {e}")
            student_vectors = None
        
        # Get internship vectors (if in index)
        internship_vectors = engine._index_manager.internship_vectors.get(internship_id_str, {})
        
        # Get internship skills
        internship_skills = internship.get("skills", [])
        if isinstance(internship_skills, str):
            internship_skills = [s.strip() for s in internship_skills.split(",") if s.strip()]
        required_skills = internship.get("requirements", [])
        if isinstance(required_skills, str):
            required_skills = [s.strip() for s in required_skills.split(",") if s.strip()]
        all_internship_skills = list(set(internship_skills + required_skills))
        
        # Calculate skill match
        user_skills_lower = [s.lower().strip() if s else "" for s in user_skills]
        internship_skills_lower = [s.lower().strip() if s else "" for s in all_internship_skills]
        matching_skills = [s for s in user_skills_lower if s in internship_skills_lower]
        
        # Calculate scores
        skill_score = 0.1  # Default minimum
        if all_internship_skills:
            # Exact match ratio
            exact_match_ratio = len(matching_skills) / len(all_internship_skills)
            skill_score = max(0.1, exact_match_ratio * 0.9)  # Up to 90% for exact matches
            
            # If all skills match exactly, give high score
            if len(matching_skills) == len(all_internship_skills) and len(matching_skills) > 0:
                skill_score = 0.95  # 95% for perfect match
        
        # Try to get actual similarity from vectors if available
        if student_vectors and internship_vectors:
            try:
                skill_vec = internship_vectors.get("skill_vector")
                if skill_vec is not None:
                    user_skill_vec = student_vectors["skill_vector"].flatten()
                    intern_skill_vec = skill_vec.flatten()
                    # Cosine similarity
                    user_norm = np.linalg.norm(user_skill_vec)
                    intern_norm = np.linalg.norm(intern_skill_vec)
                    if user_norm > 0 and intern_norm > 0:
                        skill_sim = np.dot(user_skill_vec, intern_skill_vec) / (user_norm * intern_norm)
                        # Use the higher of exact match or semantic similarity
                        skill_score = max(skill_score, float(skill_sim))
            except Exception as e:
                logger.debug(f"Could not calculate vector similarity: {e}")
        
        location_score = 0.5  # Default
        if profile_data.get("location_coordinates") and internship.get("location_coordinates"):
            location_score = 0.8  # Good match if both have coordinates
        elif profile_data.get("location_query") and internship.get("location"):
            # Simple string matching
            user_loc = profile_data.get("location_query", "").lower()
            intern_loc = str(internship.get("location", "")).lower()
            if user_loc and intern_loc and user_loc in intern_loc:
                location_score = 0.7
        
        stipend_score = 0.7  # Default
        timeline_score = 0.6  # Default
        
        # Calculate weighted score
        weights = engine.config.DEFAULT_WEIGHTS
        weighted_score = (
            skill_score * weights["skills"] +
            location_score * weights["location"] +
            stipend_score * weights["stipend"] +
            timeline_score * weights["timeline"]
        )
        match_percentage = engine._score_to_percentage(weighted_score)
        
        # Check threshold
        meets_threshold = match_percentage >= engine.config.MIN_MATCH_THRESHOLD
        
        # Check filters
        filter_status = {
            "passed": True,
            "reasons": []
        }
        
        # Check status
        status = internship.get("status", "").lower()
        is_active = internship.get("is_active", True)
        if not (status in ["active", "open", "published"] or is_active):
            filter_status["passed"] = False
            filter_status["reasons"].append(f"Internship is not active (status: {status}, is_active: {is_active})")
        
        # Prepare response (use already calculated values)
        debug_info = {
            "success": True,
            "internship_id": internship_id,
            "internship": {
                "title": internship.get("title", "Unknown"),
                "company": internship.get("company", "Unknown"),
                "skills": all_internship_skills,
                "required_skills": required_skills,
                "status": internship.get("status", "unknown"),
                "is_active": internship.get("is_active", True),
                "location": internship.get("location", ""),
                "is_remote": internship.get("is_remote", False),
                "work_type": internship.get("work_type", "")
            },
            "user_profile": {
                "skills": user_skills,
                "location": profile_data.get("location_query", ""),
                "skills_count": len(user_skills)
            },
            "match_analysis": {
                "match_percentage": round(match_percentage, 2),
                "meets_threshold": meets_threshold,
                "threshold_required": engine.config.MIN_MATCH_THRESHOLD,
                "skill_score": round(engine._score_to_percentage(skill_score), 2),
                "location_score": round(engine._score_to_percentage(location_score), 2),
                "stipend_score": round(engine._score_to_percentage(stipend_score), 2),
                "timeline_score": round(engine._score_to_percentage(timeline_score), 2),
                "weighted_breakdown": {
                    "skills_contribution": round(skill_score * weights["skills"] * 100, 2),
                    "location_contribution": round(location_score * weights["location"] * 100, 2),
                    "stipend_contribution": round(stipend_score * weights["stipend"] * 100, 2),
                    "timeline_contribution": round(timeline_score * weights["timeline"] * 100, 2)
                }
            },
            "filter_status": filter_status,
            "in_index": internship_id_str in engine._index_manager.internship_ids,
            "recommendations": {
                "will_appear": meets_threshold and filter_status["passed"] and internship_id_str in engine._index_manager.internship_ids,
                "reasons_why_not": []
            }
        }
        
        # Add reasons why it might not appear
        if not meets_threshold:
            debug_info["recommendations"]["reasons_why_not"].append(
                f"Match score {match_percentage}% is below threshold {engine.config.MIN_MATCH_THRESHOLD}%"
            )
        if not filter_status["passed"]:
            debug_info["recommendations"]["reasons_why_not"].extend(filter_status["reasons"])
        if internship_id_str not in engine._index_manager.internship_ids:
            debug_info["recommendations"]["reasons_why_not"].append(
                "Internship not in recommendation engine index - call /refresh endpoint"
            )
        
        # Check skill overlap
        user_skills_lower = [s.lower().strip() if s else "" for s in user_skills]
        internship_skills_lower = [s.lower().strip() if s else "" for s in all_internship_skills]
        matching_skills = [s for s in user_skills_lower if s in internship_skills_lower]
        
        debug_info["skill_comparison"] = {
            "user_skills": user_skills,
            "internship_skills": all_internship_skills,
            "matching_skills": matching_skills,
            "matching_count": len(matching_skills),
            "total_required": len(all_internship_skills),
            "match_ratio": round(len(matching_skills) / len(all_internship_skills) * 100, 2) if all_internship_skills else 0
        }
        
        return debug_info
        
    except Exception as e:
        logger.error(f"Error in debug endpoint: {e}", exc_info=True)
        return {
            "success": False,
            "error": str(e),
            "internship_id": internship_id
        }