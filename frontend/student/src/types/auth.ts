// File: frontend/src/types/auth.ts
export interface User {
  id: string;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  profile_completed: boolean;
  phone?: string;
  phone_verified?: boolean;
  email_verified?: boolean;
  auth_provider?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface TokenResponse {
  access_token: string;
  user: User;
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
  };
}

