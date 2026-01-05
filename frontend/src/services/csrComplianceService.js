import api from '../utils/api';

export const csrComplianceService = {
  // Create a new compliance event
  createEvent: async (eventData) => {
    try {
      const response = await api.post('/api/csr-compliance', eventData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all compliance events
  getEvents: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/csr-compliance?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get upcoming events
  getUpcomingEvents: async () => {
    try {
      const response = await api.get('/api/csr-compliance/upcoming');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get overdue events
  getOverdueEvents: async () => {
    try {
      const response = await api.get('/api/csr-compliance/overdue');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get calendar view
  getCalendarView: async (year, month) => {
    try {
      const params = new URLSearchParams({ year, month });
      const response = await api.get(`/api/csr-compliance/calendar?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get event by ID
  getEventById: async (eventId) => {
    try {
      const response = await api.get(`/api/csr-compliance/${eventId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update event
  updateEvent: async (eventId, updates) => {
    try {
      const response = await api.put(`/api/csr-compliance/${eventId}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete event
  deleteEvent: async (eventId) => {
    try {
      const response = await api.delete(`/api/csr-compliance/${eventId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Add note to event
  addEventNote: async (eventId, note) => {
    try {
      const response = await api.post(`/api/csr-compliance/${eventId}/notes`, { note });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default csrComplianceService;

