/**
 * Contact Service
 * CRUD operations for contact messages.
 */
import api from './api';

export const contactService = {
  /**
   * Get paginated list of contact messages.
   */
  getAll: async (page = 1, perPage = 20) => {
    const params = { page, per_page: perPage };
    const response = await api.get('/contact/', { params });
    return response.data;
  },

  /**
   * Delete a contact message.
   */
  delete: async (id) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  },
};
