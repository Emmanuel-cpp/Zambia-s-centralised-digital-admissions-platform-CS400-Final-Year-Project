/**
 * Auth utilities — token storage and user session management.
 *
 * We store the Sanctum token in localStorage for simplicity during
 * development. In production this should move to an httpOnly cookie
 * for better security.
 */

const TOKEN_KEY = 'zamadmit_token';
const USER_KEY  = 'zamadmit_user';

export interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  nrc: string | null;
  phone: string | null;
  province: string | null;
  role: 'student' | 'institution_admin' | 'platform_admin';
  profile_complete: boolean;
  must_change_password: boolean;
   interests: string[];
  institution_id: number | null;
  admin_role: 'owner' | 'admissions_officer' | 'viewer' | null;
}

export function saveAuth(token: string, user: AuthUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}