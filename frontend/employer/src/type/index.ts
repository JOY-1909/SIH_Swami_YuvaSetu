// src/types/index.ts

// ============== Internship Types ==============
export interface Internship {
  id: string;
  organisation_name: string;
  title: string;
  description: string;
  responsibilities: string | null;
  requirements: string | null;
  perks: string | null;
  skills: string[] | null;
  location: string;
  state: string | null;
  city: string | null;
  stipend: string | null;
  sector: string | null;
  start_date: string | null;
  end_date: string | null;
  duration_days: number | null;
  duration_weeks: number | null;
  duration_months: number | null;
  is_active: boolean;
}

export interface InternshipCreatePayload {
  organisation_name: string;
  title: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  perks?: string;
  skills?: string[];
  location: string;
  state?: string;
  city?: string;
  stipend?: string;
  sector?: string;
  start_date?: string;
  end_date?: string;
  duration_days?: number;
  duration_weeks?: number;
  duration_months?: number;
}

// ============== Employer Profile Types ==============
export interface EmployerProfile {
  organisationName: string;
  organisationType: string | null;
  industry: string | null;
  website: string | null;
  about: string | null;
  contactPerson: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  authProvider?: string | null;
}

// ============== Application Types ==============
export type ApplicationStatus =
  | "applied"
  | "under_review"
  | "shortlisted"
  | "rejected"
  | "selected";

export interface Application {
  id: string;
  internship_id: string;
  student_uid: string;
  status: ApplicationStatus;
}

// ============== Auth Types ==============
export interface EmployerSession {
  organisationName: string;
  email: string;
  contactPerson: string;
}
