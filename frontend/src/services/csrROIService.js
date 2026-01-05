import api from '../utils/api';

export const csrROIService = {
  // Create a new ROI calculation
  createCalculation: async (calculationData) => {
    try {
      const response = await api.post('/api/csr-roi', calculationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all ROI calculations
  getCalculations: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/csr-roi?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get ROI summary
  getSummary: async () => {
    try {
      const response = await api.get('/api/csr-roi/summary');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get calculation by ID
  getCalculationById: async (calculationId) => {
    try {
      const response = await api.get(`/api/csr-roi/${calculationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update calculation
  updateCalculation: async (calculationId, updates) => {
    try {
      const response = await api.put(`/api/csr-roi/${calculationId}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete calculation
  deleteCalculation: async (calculationId) => {
    try {
      const response = await api.delete(`/api/csr-roi/${calculationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Add note to calculation
  addCalculationNote: async (calculationId, note) => {
    try {
      const response = await api.post(`/api/csr-roi/${calculationId}/notes`, { note });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default csrROIService;

