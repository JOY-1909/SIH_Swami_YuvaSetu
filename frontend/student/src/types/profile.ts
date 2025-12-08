export interface EducationResponse {
  id?: number;
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  startYear?: string;
  endYear?: string;
  score?: string;
}

export interface ExperienceResponse {
  id?: number;
  type?: string;
  company?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface TrainingResponse {
  id?: number;
  title?: string;
  provider?: string;
  duration?: string;
  description?: string;
  credentialLink?: string;
}

export interface ProjectResponse {
  id?: number;
  title?: string;
  role?: string;
  technologies?: string;
  description?: string;
}

export interface SkillResponse {
  id?: number;
  name?: string;
  level?: string;
}

export interface PortfolioResponse {
  id?: number;
  title?: string;
  link?: string;
  description?: string;
}

export interface AccomplishmentResponse {
  id?: number;
  title?: string;
  description?: string;
  credentialUrl?: string;
}

export interface StudentProfileResponse {
  id: string;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  phone_verified?: boolean;
  email_verified?: boolean;
  profile_completed: boolean;
  auth_provider?: string;
  address?: string;
  date_of_birth?: string | null;
  gender?: string;
  location_query?: string | null;
  languages?: string;
  linkedin?: string;
  career_objective?: string;
  education: EducationResponse[];
  experience: ExperienceResponse[];
  trainings: TrainingResponse[];
  projects: ProjectResponse[];
  skills: SkillResponse[];
  portfolio: PortfolioResponse[];
  accomplishments: AccomplishmentResponse[];
  created_at?: string;
  updated_at?: string;
}

