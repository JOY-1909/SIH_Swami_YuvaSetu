# File: app/schemas/recommendations.py
"""
Recommendation Schemas with Enhanced Explanation Support
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum


class MatchQuality(str, Enum):
    EXCELLENT = "excellent"
    GOOD = "good"
    MODERATE = "moderate"
    LOW = "low"
    POOR = "poor"


class ScoreBreakdown(BaseModel):
    skills: float = 0.0
    location: float = 0.0
    stipend: float = 0.0
    timeline: float = 0.0


class SkillMatchDetail(BaseModel):
    skill: str
    level: Optional[str] = None
    match_type: str = "exact"  # exact, semantic, related, transferable
    matches_required: Optional[str] = None
    similarity: Optional[float] = None


class SemanticMatch(BaseModel):
    required_skill: str
    user_skill: str
    similarity: float
    match_type: str


class SkillAnalysisDetail(BaseModel):
    match_percentage: float = 0.0
    matching_skills: List[Dict[str, Any]] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    extra_skills: List[str] = Field(default_factory=list)
    semantic_matches: List[Dict[str, Any]] = Field(default_factory=list)
    total_required: int = 0
    total_matched: int = 0
    explanation: str = ""
    strength: str = ""


class LocationAnalysisDetail(BaseModel):
    user_location: str = ""
    internship_location: str = ""
    work_type: str = ""
    is_remote_friendly: bool = False
    match_score: float = 0.0
    explanation: str = ""
    commute_feasibility: str = ""


class StipendAnalysisDetail(BaseModel):
    offered_stipend: float = 0.0
    currency: str = "INR"
    match_score: float = 0.0
    market_comparison: str = ""
    explanation: str = ""


class TimelineAnalysisDetail(BaseModel):
    duration: str = ""
    duration_months: float = 0.0
    match_score: float = 0.0
    explanation: str = ""
    fit_assessment: str = ""


class DetailedExplanation(BaseModel):
    summary: str = ""
    overall_score: float = 0.0
    quality: str = "moderate"
    skill_analysis: SkillAnalysisDetail = Field(default_factory=SkillAnalysisDetail)
    location_analysis: LocationAnalysisDetail = Field(default_factory=LocationAnalysisDetail)
    stipend_analysis: StipendAnalysisDetail = Field(default_factory=StipendAnalysisDetail)
    timeline_analysis: TimelineAnalysisDetail = Field(default_factory=TimelineAnalysisDetail)
    key_strengths: List[str] = Field(default_factory=list)
    areas_to_improve: List[str] = Field(default_factory=list)
    recommendation_reasons: List[str] = Field(default_factory=list)
    action_items: List[str] = Field(default_factory=list)
    compatibility_insights: List[str] = Field(default_factory=list)


class RecommendationItem(BaseModel):
    id: str
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    stipend: Optional[float] = None
    stipend_currency: Optional[str] = "INR"
    duration: Optional[str] = None
    duration_months: Optional[float] = None
    work_type: Optional[str] = None
    description: Optional[str] = None
    requirements: List[str] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=list)
    is_remote: Optional[bool] = None
    category: Optional[str] = None
    sector: Optional[str] = None
    apply_url: Optional[str] = None
    match_percentage: float = 0.0
    score_breakdown: ScoreBreakdown = Field(default_factory=ScoreBreakdown)
    match_reasons: List[str] = Field(default_factory=list)
    detailed_explanation: Optional[Dict[str, Any]] = None
    explanation_summary: Optional[str] = None
    has_applied: bool = False
    status: Optional[str] = None
    is_featured: Optional[bool] = False
    is_verified: Optional[bool] = False
    views: Optional[int] = 0
    applications: Optional[int] = 0
    created_at: Optional[str] = None


class RecommendationFilters(BaseModel):
    location: Optional[str] = None
    work_type: Optional[str] = None
    category: Optional[str] = None
    min_stipend: Optional[float] = None
    max_stipend: Optional[float] = None
    duration: Optional[str] = None
    search: Optional[str] = None


class PaginationMeta(BaseModel):
    page: int
    limit: int
    total: int
    pages: int


class UserProfileSummary(BaseModel):
    skills_count: int = 0
    experience_count: int = 0
    education_count: int = 0
    preferred_location: Optional[str] = None


class RecommendationsResponse(BaseModel):
    success: bool = True
    recommendations: List[RecommendationItem]
    pagination: PaginationMeta
    filters: RecommendationFilters
    user_profile_summary: UserProfileSummary


class TrendingInternship(BaseModel):
    id: str
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    stipend: Optional[float] = None
    duration: Optional[str] = None
    work_type: Optional[str] = None
    views: Optional[int] = 0
    applications: Optional[int] = 0
    is_featured: Optional[bool] = False
    is_verified: Optional[bool] = False
    trend_score: Optional[float] = 0.0
    created_at: Optional[str] = None
    has_applied: bool = False


class TrendingResponse(BaseModel):
    success: bool = True
    trending_internships: List[TrendingInternship]
    count: int


class MatchExplanationResponse(BaseModel):
    success: bool = True
    internship_id: str
    internship_title: str
    match_percentage: float
    explanation: DetailedExplanation


class EngineStatusResponse(BaseModel):
    success: bool = True
    status: Dict[str, Any]


class CacheInvalidationResponse(BaseModel):
    success: bool = True
    message: str