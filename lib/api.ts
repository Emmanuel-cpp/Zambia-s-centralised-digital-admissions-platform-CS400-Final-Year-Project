/**
 * API client — all fetch calls to the Laravel backend go through here.
 *
 * BASE_URL points to the Laravel dev server.
 * In production this becomes the real server URL via environment variable.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  token?: string;
}

/**
 * Core fetch wrapper.
 * Handles JSON headers, auth token, and error responses.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/api${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

      if (!response.ok) {
        let userMessage = 'Something went wrong. Please try again in a moment.';

        try {
              const error = await response.json();
              const raw   = error.message || '';

              // Suppress raw database/SQL/server stack traces from the user.
              // Only pass clean, intentional API messages through to the UI.
              const isTechnical =
                raw.startsWith('SQLSTATE') ||
                raw.includes('Connection refused') ||
                raw.includes('No connection could be made') ||
                raw.includes('Stack trace') ||
                raw.toLowerCase().includes('exception');

          if (raw && !isTechnical) {
            userMessage = raw;
          }
        } catch {
          // Response wasn't JSON — keep the default friendly message
        }

        // Log the real error to console so the developer can debug
        console.error(`API error: HTTP ${response.status}`);

        throw new Error(userMessage);
      }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, token?: string) =>
    apiRequest<T>(endpoint, { method: 'GET', token }),

  post: <T>(endpoint: string, body: unknown, token?: string) =>
    apiRequest<T>(endpoint, { method: 'POST', body, token }),

  put: <T>(endpoint: string, body: unknown, token?: string) =>
    apiRequest<T>(endpoint, { method: 'PUT', body, token }),

  delete: <T>(endpoint: string, token?: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE', token }),
};