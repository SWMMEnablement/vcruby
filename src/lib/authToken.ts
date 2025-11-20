/**
 * Authentication token configuration for edge function access
 * 
 * For production, set the AUTH_TOKEN in localStorage:
 * localStorage.setItem('AUTH_TOKEN', 'your-secret-token');
 */

const DEFAULT_TOKEN = 'demo-token-change-in-production';

export function getAuthToken(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('AUTH_TOKEN') || DEFAULT_TOKEN;
  }
  return DEFAULT_TOKEN;
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('AUTH_TOKEN', token);
  }
}
