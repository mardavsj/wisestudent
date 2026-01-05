import api from '../utils/api';

export const csrGoalService = {
  // Create a new goal
  createGoal: async (goalData) => {
    try {
      const response = await api.post('/api/csr-goals', goalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all goals
  getGoals: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/csr-goals?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get goal by ID
  getGoalById: async (goalId) => {
    try {
      const response = await api.get(`/api/csr-goals/${goalId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update goal
  updateGoal: async (goalId, updates) => {
    try {
      const response = await api.put(`/api/csr-goals/${goalId}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete goal
  deleteGoal: async (goalId) => {
    try {
      const response = await api.delete(`/api/csr-goals/${goalId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get goal progress summary
  getGoalProgress: async () => {
    try {
      const response = await api.get('/api/csr-goals/progress');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Add note to goal
  addGoalNote: async (goalId, note) => {
    try {
      const response = await api.post(`/api/csr-goals/${goalId}/notes`, { note });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default csrGoalService;

