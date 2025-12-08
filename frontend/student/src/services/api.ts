// File: frontend/src/services/api.ts
import { 
  ApiResponse, 
  TokenResponse, 
  SendOTPResponse, 
  User 
} from '@/types/auth';
import { StudentProfileResponse } from '@/types/profile';
import {
  StudentRecommendations,
  RecommendationsApiResponse,
  RecommendationApiItem,
  Recommendation,
  TrendingResponse,
  TrendingInternship,
} from '@/types/recommendations';

export const API_BASE_URL =
  import.meta.env.VITE_STUDENT_API_URL ||
  'http://127.0.0.1:8001';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('access_token');

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    // Add timeout to prevent hanging (30 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(this.buildUrl(endpoint), {
        ...options,
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const text = await response.text();

      if (!response.ok) {
        let message = 'Request failed';
        if (text) {
          try {
            const error = JSON.parse(text) as { detail?: string; message?: string };
            message = error.detail || error.message || message;
          } catch {
            message = text;
          }
        }
        throw new Error(message);
      }

      if (!text) {
        return {} as T;
      }

      try {
        return JSON.parse(text) as T;
      } catch {
        throw new Error('Failed to parse server response');
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout: The server took too long to respond. Please try again.');
      }
      throw error;
    }
  }

  private persistAuthState(response: TokenResponse) {
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    // Also store as userFullProfile for Navbar compatibility
    const userProfile = {
      email: response.user.email,
      firstName: response.user.first_name,
      lastName: response.user.last_name,
      fullName: response.user.full_name,
      avatarUrl: undefined, // Can be added if available in response
    };
    localStorage.setItem('userFullProfile', JSON.stringify(userProfile));
    localStorage.setItem('userEmail', response.user.email);
  }

  private transformRecommendation(item: RecommendationApiItem): Recommendation {
    return {
      id: item.id,
      title: item.title,
      company: item.company,
      location: item.location,
      stipend: item.stipend,
      stipendCurrency: item.stipend_currency,
      duration: item.duration,
      workType: item.work_type,
      description: item.description,
      requirements: item.requirements,
      skills: item.skills,
      isRemote: item.is_remote,
      category: item.category,
      applyUrl: item.apply_url,
      matchPercentage: item.match_percentage,
      scoreBreakdown: item.score_breakdown,
      matchReasons: item.match_reasons,
      hasApplied: item.has_applied,
      status: item.status,
    };
  }

  // Email Signup Flow
  async sendEmailOTP(
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<SendOTPResponse> {
    return this.request<SendOTPResponse>('/api/v1/auth/signup/send-email-otp', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        confirm_password: confirmPassword,
      }),
    });
  }

  async verifyEmailOTP(
    email: string,
    otp: string,
    agreedToTerms: boolean
  ): Promise<TokenResponse> {
    const response = await this.request<TokenResponse>(
      '/api/v1/auth/signup/verify-email',
      {
        method: 'POST',
        body: JSON.stringify({
          email,
          otp,
          agreed_to_terms: agreedToTerms,
        }),
      }
    );

    this.persistAuthState(response);
    return response;
  }

  // Google OAuth
  async googleSignup(idToken: string): Promise<TokenResponse> {
    const response = await this.request<TokenResponse>(
      '/api/v1/auth/google/signup',
      {
        method: 'POST',
        body: JSON.stringify({
          id_token: idToken,
        }),
      }
    );

    this.persistAuthState(response);
    return response;
  }

  // Login Flow
  async login(email: string, password: string): Promise<TokenResponse> {
    const response = await this.request<TokenResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    });

    this.persistAuthState(response);
    return response;
  }

  async verifyLoginOTP(email: string, otp: string): Promise<TokenResponse> {
    const response = await this.request<TokenResponse>(
      '/api/v1/auth/login/verify-otp',
      {
        method: 'POST',
        body: JSON.stringify({
          email,
          otp,
        }),
      }
    );

    this.persistAuthState(response);
    return response;
  }

  async googleLogin(idToken: string): Promise<TokenResponse> {
    const response = await this.request<TokenResponse>(
      '/api/v1/auth/google/login',
      {
        method: 'POST',
        body: JSON.stringify({
          id_token: idToken,
        }),
      }
    );

    this.persistAuthState(response);
    return response;
  }

  async resendOtp(identifier: string, purpose: 'signup' | 'password_reset'): Promise<ApiResponse> {
    return this.request<ApiResponse>('/api/v1/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({
        identifier,
        purpose,
      }),
    });
  }

  // Profile helpers
  async getProfile(): Promise<StudentProfileResponse> {
    return this.request<StudentProfileResponse>('/api/v1/auth/me', {
      method: 'GET',
    });
  }

  async updatePersonalDetails(data: {
    full_name: string;
    contact_number: string;
    address: string;
    differently_abled: boolean;
  }): Promise<ApiResponse<{ user: User }>> {
    return this.request<ApiResponse<{ user: User }>>(
      '/api/v1/auth/personal-details',
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  async getStudentRecommendations(
    params: Record<string, string | number | undefined> = {}
  ): Promise<StudentRecommendations> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, String(value));
      }
    });

    const endpoint = query.size
      ? `/api/v1/recommendations/for-student?${query.toString()}`
      : '/api/v1/recommendations/for-student';

    const response = await this.request<RecommendationsApiResponse>(endpoint);

    return {
      recommendations: response.recommendations.map((item) =>
        this.transformRecommendation(item)
      ),
      pagination: response.pagination,
      filters: {
        location: response.filters.location || undefined,
        workType: response.filters.work_type || undefined,
        category: response.filters.category || undefined,
        minStipend: response.filters.min_stipend ?? undefined,
        maxStipend: response.filters.max_stipend ?? undefined,
        duration: response.filters.duration || undefined,
        search: response.filters.search || undefined,
      },
      userProfileSummary: {
        skillsCount: response.user_profile_summary.skills_count,
        experienceCount: response.user_profile_summary.experience_count,
        educationCount: response.user_profile_summary.education_count,
        preferredLocation: response.user_profile_summary.preferred_location || undefined,
      },
    };
  }

  async getTrendingInternships(limit = 10): Promise<TrendingInternship[]> {
    const response = await this.request<TrendingResponse>(
      `/api/v1/recommendations/trending-internships?limit=${limit}`
    );
    return response.trending_internships;
  }

  async getMyApplications(): Promise<{ applications: Array<{
    application_id: string;
    internship_id: string;
    title: string;
    company: string;
    location: string;
    stipend: number;
    duration: string;
    work_type: string;
    application_status: string;
    applied_at: string | null;
    cover_letter?: string;
    notes?: string;
  }> }> {
    return this.request<{ applications: Array<{
      application_id: string;
      internship_id: string;
      title: string;
      company: string;
      location: string;
      stipend: number;
      duration: string;
      work_type: string;
      application_status: string;
      applied_at: string | null;
      cover_letter?: string;
      notes?: string;
    }> }>('/api/v1/applications/my-applications', {
      method: 'GET',
    });
  }

  async applyToInternship(internshipId: string, coverLetter?: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/api/v1/applications/apply/${internshipId}`, {
      method: 'POST',
      body: JSON.stringify({
        cover_letter: coverLetter || '',
      }),
    });
  }

  async getInternshipDetails(internshipId: string): Promise<{
    success: boolean;
    internship: {
      id: string;
      title: string;
      company: string;
      company_description?: string;
      description: string;
      location?: string;
      work_type?: string;
      duration?: string;
      stipend?: number;
      stipend_currency?: string;
      requirements?: string[];
      skills?: string[];
      responsibilities?: string[];
      is_remote?: boolean;
      application_deadline?: string;
      start_date?: string;
      positions_available?: number;
      applications_received?: number;
      category?: string;
      tags?: string[];
      contact_email?: string;
      contact_phone?: string;
      apply_url?: string;
      has_applied?: boolean;
      application_status?: string;
      applied_at?: string;
    };
  }> {
    return this.request<{
      success: boolean;
      internship: any;
    }>(`/api/v1/internships/${internshipId}`, {
      method: 'GET',
    });
  }

  async downloadResume(): Promise<Blob> {
    const token = localStorage.getItem('access_token');
    const userProfile = JSON.parse(localStorage.getItem('userFullProfile') || '{}');
    
    const response = await fetch(`${this.baseUrl}/api/v1/resume/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        firstName: userProfile.firstName || userProfile.fullName?.split(' ')[0] || 'User',
        lastName: userProfile.lastName || userProfile.fullName?.split(' ').slice(1).join(' ') || '',
        phone: userProfile.phone || '',
        email: userProfile.email || '',
        dateOfBirth: userProfile.dateOfBirth || '',
        gender: userProfile.gender || '',
        address: userProfile.address || '',
        languages: userProfile.languages || '',
        linkedin: userProfile.linkedin || '',
        careerObjective: userProfile.careerObjective || '',
        education: userProfile.education || [],
        experience: userProfile.experience || [],
        trainings: userProfile.trainings || [],
        projects: userProfile.projects || [],
        skills: userProfile.skills || [],
        portfolio: userProfile.portfolio || [],
        accomplishments: userProfile.accomplishments || []
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to generate resume');
    }

    return response.blob();
  }

  // Logout
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }
}

export const apiService = new ApiService();
