# app/api/routes_internship_semantic.py
import logging
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field
from datetime import datetime

from app.services.internship_service import get_internship_service
from app.models.internship import Internship

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/internships", tags=["internships-semantic"])


# Pydantic models for request/response
class InternshipCreateRequest(BaseModel):
    """Request model for creating a new internship."""
    owner_uid: str
    organisation_name: str
    title: str
    description: str
    responsibilities: Optional[str] = None
    requirements: Optional[str] = None
    perks: Optional[str] = None
    skills: Optional[List[str]] = None
    location: str
    state: Optional[str] = None
    city: Optional[str] = None
    stipend: Optional[str] = None
    sector: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    duration_days: Optional[int] = None
    duration_weeks: Optional[float] = None
    duration_months: Optional[float] = None
    is_active: bool = True


class InternshipUpdateRequest(BaseModel):
    """Request model for updating an internship."""
    title: Optional[str] = None
    description: Optional[str] = None
    responsibilities: Optional[str] = None
    requirements: Optional[str] = None
    perks: Optional[str] = None
    skills: Optional[List[str]] = None
    location: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    stipend: Optional[str] = None
    sector: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    duration_days: Optional[int] = None
    duration_weeks: Optional[float] = None
    duration_months: Optional[float] = None
    is_active: Optional[bool] = None


class InternshipResponse(BaseModel):
    """Response model for internship data."""
    id: str
    owner_uid: str
    organisation_name: str
    title: str
    description: str
    responsibilities: Optional[str] = None
    requirements: Optional[str] = None
    perks: Optional[str] = None
    skills: Optional[List[str]] = None
    location: str
    state: Optional[str] = None
    city: Optional[str] = None
    stipend: Optional[str] = None
    sector: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    duration_days: Optional[int] = None
    duration_weeks: Optional[float] = None
    duration_months: Optional[float] = None
    is_active: bool
    closed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class SearchResultItem(BaseModel):
    """Single search result with similarity score."""
    internship: InternshipResponse
    similarity_score: float = Field(description="L2 distance (lower is better)")
    similarity_percentage: float = Field(description="Similarity as percentage (0-100)")


class SearchResponse(BaseModel):
    """Response model for search results."""
    query: str
    total_results: int
    results: List[SearchResultItem]


@router.post(
    "",
    response_model=dict,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new internship",
    description="Create a new internship with automatic duplicate detection using semantic embeddings"
)
async def create_internship(
    internship_data: InternshipCreateRequest,
    check_duplicate: bool = Query(True, description="Check for duplicate internships")
):
    """
    Create a new internship with automatic embedding generation.
    
    - Generates semantic embedding from internship metadata
    - Checks for duplicates if check_duplicate=True
    - Returns duplicate info if similar internship exists
    - Adds to FAISS index for fast similarity search
    """
    try:
        service = get_internship_service()
        result = await service.create_internship(
            internship_data.model_dump(),
            check_duplicate=check_duplicate
        )
        
        if result["status"] == "duplicate":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={
                    "message": result["message"],
                    "duplicate_id": result["duplicate_id"],
                    "similarity_distance": result["similarity_distance"],
                }
            )
        
        return {
            "message": result["message"],
            "internship_id": result["internship_id"],
            "internship": InternshipResponse(
                id=str(result["internship"].id),
                **result["internship"].model_dump(exclude={"id", "embedding"})
            ).model_dump()
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating internship: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create internship: {str(e)}"
        )


@router.get(
    "/search",
    response_model=SearchResponse,
    summary="Semantic search for internships",
    description="Search for similar internships using natural language query and vector embeddings"
)
async def search_internships(
    query: str = Query(..., description="Natural language search query", min_length=1),
    top_k: int = Query(10, ge=1, le=50, description="Number of results to return")
):
    """
    Semantic search for internships.
    
    - Uses sentence-transformers to encode query
    - Performs fast approximate nearest neighbor search with FAISS
    - Returns ranked results with similarity scores
    - Lower similarity_score (L2 distance) = better match
    """
    try:
        service = get_internship_service()
        results = await service.search_similar_internships(query, top_k=top_k)
        
        search_results = [
            SearchResultItem(
                internship=InternshipResponse(
                    id=str(item["internship"].id),
                    **item["internship"].model_dump(exclude={"id", "embedding"})
                ),
                similarity_score=item["similarity_score"],
                similarity_percentage=item["similarity_percentage"]
            )
            for item in results
        ]
        
        return SearchResponse(
            query=query,
            total_results=len(search_results),
            results=search_results
        )
    
    except Exception as e:
        logger.error(f"Error searching internships: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Search failed: {str(e)}"
        )


@router.get(
    "/{internship_id}",
    response_model=InternshipResponse,
    summary="Get internship by ID",
    description="Retrieve a specific internship by its MongoDB ObjectId"
)
async def get_internship(internship_id: str):
    """
    Get a single internship by ID.
    """
    try:
        service = get_internship_service()
        internship = await service.get_internship_by_id(internship_id)
        
        if not internship:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Internship with ID {internship_id} not found"
            )
        
        return InternshipResponse(
            id=str(internship.id),
            **internship.model_dump(exclude={"id", "embedding"})
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching internship: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch internship: {str(e)}"
        )


@router.get(
    "",
    response_model=List[InternshipResponse],
    summary="List internships",
    description="List internships with pagination and filtering"
)
async def list_internships(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Maximum number of records to return"),
    is_active: Optional[bool] = Query(None, description="Filter by active status")
):
    """
    List internships with pagination.
    """
    try:
        service = get_internship_service()
        internships = await service.list_internships(
            skip=skip,
            limit=limit,
            is_active=is_active
        )
        
        return [
            InternshipResponse(
                id=str(internship.id),
                **internship.model_dump(exclude={"id", "embedding"})
            )
            for internship in internships
        ]
    
    except Exception as e:
        logger.error(f"Error listing internships: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list internships: {str(e)}"
        )


@router.put(
    "/{internship_id}",
    response_model=dict,
    summary="Update internship",
    description="Update an internship and regenerate its embedding"
)
async def update_internship(
    internship_id: str,
    update_data: InternshipUpdateRequest
):
    """
    Update an existing internship.
    
    - Automatically regenerates embedding if relevant fields change
    - Updates FAISS index with new embedding
    """
    try:
        service = get_internship_service()
        
        # Filter out None values
        update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
        
        if not update_dict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No valid fields to update"
            )
        
        result = await service.update_internship(internship_id, update_dict)
        
        if result["status"] == "error":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=result["message"]
            )
        
        return {
            "message": result["message"],
            "internship_id": result["internship_id"],
            "internship": InternshipResponse(
                id=str(result["internship"].id),
                **result["internship"].model_dump(exclude={"id", "embedding"})
            ).model_dump()
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating internship: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update internship: {str(e)}"
        )


@router.delete(
    "/{internship_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete internship",
    description="Delete an internship and remove it from FAISS index"
)
async def delete_internship(internship_id: str):
    """
    Delete an internship.
    
    - Removes from MongoDB
    - Removes from FAISS index
    """
    try:
        service = get_internship_service()
        result = await service.delete_internship(internship_id)
        
        if result["status"] == "error":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=result["message"]
            )
        
        return None
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting internship: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete internship: {str(e)}"
        )


@router.get(
    "/health/faiss",
    summary="FAISS index health check",
    description="Get FAISS index statistics and health status"
)
async def faiss_health():
    """
    Check FAISS index health and get statistics.
    """
    try:
        from app.services.faiss_service import get_faiss_service
        from app.services.embedding_service import get_embedding_service
        
        faiss_service = get_faiss_service()
        embedding_service = get_embedding_service()
        
        return {
            "status": "healthy",
            "faiss_index_size": faiss_service.get_index_size(),
            "embedding_dimension": embedding_service.dimension,
            "embedding_model": embedding_service.model_name,
            "duplicate_threshold": faiss_service.duplicate_threshold,
            "device": embedding_service.device,
        }
    
    except Exception as e:
        logger.error(f"Error checking FAISS health: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Health check failed: {str(e)}"
        )
