// What this file does: Lightweight fetch wrapper for communicating with the Naam Uzhavar Backend API.
// Viva Note: Handles base URL, JSON serialization, JWT Bearer authentication headers, and automatic 401 logout.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const TOKEN_STORAGE_KEY = 'naam_uzhavar_token';

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (e) {
    console.error('Failed to save token to localStorage:', e);
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to remove token from localStorage:', e);
  }
};

/**
 * Core HTTP Request Wrapper
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    // Handle 401 Unauthorized: clear expired credentials and redirect to login
    if (response.status === 401) {
      removeToken();
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/buyer-login')) {
        window.location.href = '/buyer-login';
      }
      throw new Error(data?.message || 'Session expired. Please log in again.');
    }

    if (!response.ok) {
      throw new Error(data?.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    // Re-throw with readable message for caller handling
    throw error;
  }
}

export const api = {
  get: (endpoint, headers) => request(endpoint, { method: 'GET', headers }),
  post: (endpoint, body, headers) =>
    request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      headers
    }),
  put: (endpoint, body, headers) =>
    request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers
    }),
  patch: (endpoint, body, headers) =>
    request(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      headers
    }),
  delete: (endpoint, headers) => request(endpoint, { method: 'DELETE', headers })
};

export default api;
