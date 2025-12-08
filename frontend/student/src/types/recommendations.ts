export interface ScoreBreakdown {
  skills: number;
  location: number;
  stipend: number;
  timeline: number;
}

export interface RecommendationApiItem {
  id: string;
  title: string;
  company: string;
  location?: string;
  stipend?: number;
  stipend_currency?: string;
  duration?: string;
  work_type?: string;
  description?: string;
  requirements: string[];
  skills: string[];
  is_remote?: boolean;
  category?: string;
  apply_url?: string;
  match_percentage: number;
  score_breakdown: ScoreBreakdown;
  match_reasons: string[];
  has_applied: boolean;
  status?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  company: string;
  location?: string;
  stipend?: number;
  stipendCurrency?: string;
  duration?: string;
  workType?: string;
  description?: string;
  requirements: string[];
  skills: string[];
  isRemote?: boolean;
  category?: string;
  applyUrl?: string;
  matchPercentage: number;
  scoreBreakdown: ScoreBreakdown;
  matchReasons: string[];
  hasApplied: boolean;
  status?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface RecommendationFiltersApi {
  location?: string | null;
  work_type?: string | null;
  category?: string | null;
  min_stipend?: number | null;
  max_stipend?: number | null;
  duration?: string | null;
  search?: string | null;
}

export interface RecommendationFilters {
  location?: string;
  workType?: string;
  category?: string;
  minStipend?: number;
  maxStipend?: number;
  duration?: string;
  search?: string;
}

export interface UserProfileSummaryApi {
  skills_count: number;
  experience_count: number;
  education_count: number;
  preferred_location?: string | null;
}

export interface UserProfileSummary {
  skillsCount: number;
  experienceCount: number;
  educationCount: number;
  preferredLocation?: string;
}

export interface RecommendationsApiResponse {
  success: boolean;
  recommendations: RecommendationApiItem[];
  pagination: Pagination;
  filters: RecommendationFiltersApi;
  user_profile_summary: UserProfileSummaryApi;
}

export interface StudentRecommendations {
  recommendations: Recommendation[];
  pagination: Pagination;
  filters: RecommendationFilters;
  userProfileSummary: UserProfileSummary;
}

export interface TrendingInternship {
  id: string;
  title: string;
  company?: string;
  location?: string;
  stipend?: number;
  duration?: string;
  work_type?: string;
  views?: number;
  applications?: number;
  is_featured?: boolean;
  is_verified?: boolean;
  trend_score?: number;
  created_at?: string;
  has_applied?: boolean;
}

export interface TrendingResponse {
  success: boolean;
  trending_internships: TrendingInternship[];
  count: number;
}

