// src/lib/auth.ts
export interface EmployerSession {
  organisationName: string;
  email: string;
  contactPerson: string;
}

const EMPLOYER_AUTH_KEY = "yuvasetu_employer_auth";

export function saveEmployerAuth(session: EmployerSession): void {
  try {
    localStorage.setItem(EMPLOYER_AUTH_KEY, JSON.stringify(session));
  } catch (err) {
    console.error("Failed to save auth session:", err);
  }
}

export function getEmployerAuth(): EmployerSession | null {
  try {
    const raw = localStorage.getItem(EMPLOYER_AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as EmployerSession;
  } catch (err) {
    console.error("Failed to retrieve auth session:", err);
    return null;
  }
}

export function clearEmployerAuth(): void {
  try {
    localStorage.removeItem(EMPLOYER_AUTH_KEY);
  } catch (err) {
    console.error("Failed to clear auth session:", err);
  }
}
