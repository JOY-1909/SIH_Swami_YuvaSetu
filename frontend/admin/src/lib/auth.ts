// Mock authentication utilities
export interface AdminUser {
  email: string;
  name: string;
  role: 'admin';
}

const ADMIN_STORAGE_KEY = 'pm_yuva_setu_admin';

export const saveAdminAuth = (user: AdminUser): void => {
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
};

export const getAdminAuth = (): AdminUser | null => {
  const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const clearAdminAuth = (): void => {
  localStorage.removeItem(ADMIN_STORAGE_KEY);
};

export const isAdminAuthenticated = (): boolean => {
  const user = getAdminAuth();
  return user !== null && user.role === 'admin';
};
