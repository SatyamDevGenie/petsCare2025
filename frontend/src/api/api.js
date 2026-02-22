import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Get auth config with Bearer token for protected routes.
 * Use in Redux thunks: api.get('/users/profile', getAuthConfig(getState()))
 */
export function getAuthConfig(getState) {
  const state = getState?.();
  const token =
    state?.auth?.user?.token ??
    state?.auth?.doctor?.token ??
    state?.auth?.token;
  return {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };
}

export default api;
