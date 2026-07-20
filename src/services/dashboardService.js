/**
 * Dashboard Service
 * Analytics and stats data.
 */
import api from './api';

export const dashboardService = {
  /**
   * Get dashboard overview stats.
   */
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  /**
   * Get analytics data for charts.
   */
  getAnalytics: async () => {
    const response = await api.get('/dashboard/analytics');
    return response.data;
  },
};
