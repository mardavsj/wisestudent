import api from '../utils/api';

export const csrAlertService = {
  // Create a new alert rule
  createAlertRule: async (ruleData) => {
    try {
      const response = await api.post('/api/csr-alerts/rules', ruleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all alert rules
  getAlertRules: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/csr-alerts/rules?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update alert rule
  updateAlertRule: async (ruleId, updates) => {
    try {
      const response = await api.put(`/api/csr-alerts/rules/${ruleId}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete alert rule
  deleteAlertRule: async (ruleId) => {
    try {
      const response = await api.delete(`/api/csr-alerts/rules/${ruleId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all alerts
  getAlerts: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/csr-alerts?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get unread alerts count
  getUnreadAlertsCount: async () => {
    try {
      const response = await api.get('/api/csr-alerts/unread/count');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Acknowledge alert
  acknowledgeAlert: async (alertId) => {
    try {
      const response = await api.post(`/api/csr-alerts/${alertId}/acknowledge`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Resolve alert
  resolveAlert: async (alertId, resolutionNotes) => {
    try {
      const response = await api.post(`/api/csr-alerts/${alertId}/resolve`, { resolutionNotes });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Dismiss alert
  dismissAlert: async (alertId, dismissalReason) => {
    try {
      const response = await api.post(`/api/csr-alerts/${alertId}/dismiss`, { dismissalReason });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default csrAlertService;

