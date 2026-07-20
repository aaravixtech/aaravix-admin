/**
 * Applications Service
 * CRUD operations for job applications.
 */
import api from './api';

export const applicationService = {
  /**
   * Get paginated list of job applications.
   */
  getAll: async (page = 1, perPage = 20, statusFilter = null) => {
    const params = { page, per_page: perPage };
    if (statusFilter) params.status_filter = statusFilter;
    const response = await api.get('/applications/', { params });
    return response.data;
  },

  /**
   * Update application status (approve/reject).
   */
  updateStatus: async (id, status) => {
    const response = await api.patch(`/applications/${id}/status`, { status });
    return response.data;
  },

  /**
   * Delete an application.
   */
  delete: async (id) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },
};
