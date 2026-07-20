/**
 * Auth Service
 * Handles login, logout, and session verification via HTTP-only cookies.
 */
import api from './api';

export const authService = {
  /**
   * Login with username and password.
   * Backend sets HTTP-only cookie — NO token stored in frontend.
   */
  login: async (username, password) => {
    const response = await api.post('/login', { username, password });
    return response.data;
  },

  /**
   * Logout — backend clears the auth cookie.
   */
  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  /**
   * Get current authenticated admin.
   * Used to validate session on app load.
   */
  getMe: async () => {
    const response = await api.get('/me');
    return response.data;
  },
};
