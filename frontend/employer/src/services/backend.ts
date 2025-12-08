// src/services/backend.ts
import { auth } from "@/lib/firebase";

const BACKEND_URL = "/api";

export async function backendRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Not authenticated. Please login again.");
  }

  let token: string;
  try {
    token = await user.getIdToken();
  } catch (err) {
    throw new Error("Session expired. Please login again.");
  }

  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
  } catch (err) {
    throw new Error("Network error. Check your internet connection.");
  }

  if (!res.ok) {
    const text = await res.text();
    
    // Better error messages based on status
    if (res.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (res.status === 403) {
      throw new Error("You don't have permission to perform this action.");
    } else if (res.status === 404) {
      throw new Error("Resource not found.");
    } else if (res.status === 400) {
      throw new Error(text || "Invalid request. Please check your input.");
    } else if (res.status >= 500) {
      throw new Error("Server error. Please try again later.");
    }
    
    throw new Error(text || "Something went wrong. Please try again.");
  }

  // Handle 204 No Content and empty bodies
  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  if (!text) {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Invalid response from server.");
  }
}
// ✅ NEW FUNCTION - GET VERIFICATION STATUS
export async function getVerificationStatus() {
  return backendRequest<{
    has_profile: boolean;
    is_verified: boolean;
    organisation_name?: string;
    message: string;
  }>("/employer/profile/verification-status");
}