// File: frontend/src/types/application.ts
export interface ApplicationData {
  internshipId: string;
  coverLetter?: string;
  resumeUrl: string;
  answers?: Record<string, string>;
  termsAccepted: boolean;
  dataSharingConsent: boolean;
}

export interface ApplicationResponse {
  id: string;
  internshipId: string;
  userId: string;
  status: string;
  appliedAt: string;
  coverLetter?: string;
  resumeUrl: string;
  message: string;
}

export interface InternshipDetails {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  stipend?: number;
  duration: string;
  requirements: string[];
  skills: string[];
  applyUrl?: string;
  isRemote?: boolean;
}

export interface ResumeFile {
  id: string;
  name: string;
  url: string;
  isDefault: boolean;
  createdAt: string;
}