import api from '../utils/api';

const handleError = (error) => {
  throw error.response?.data || error;
};

const buildQuery = (params = {}) => {
  const query = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== "") {
      query.append(key, params[key]);
    }
  });
  return query.toString();
};

const csrService = {
  getImpactMetrics: (filters = {}) =>
    api
      .get(`/api/csr-overview/data${buildQuery(filters)}`)
      .then((res) => res.data)
      .catch(handleError),
  sponsor: {
    register: (payload) => api.post('/api/csr/register', payload).catch(handleError),
    profile: () => api.get('/api/csr/profile').then((res) => res.data).catch(handleError),
    update: (payload) => api.put('/api/csr/profile', payload).then((res) => res.data).catch(handleError),
    dashboard: () => api.get('/api/csr/dashboard').then((res) => res.data).catch(handleError),
  },
  sponsorships: {
    list: (params = {}) => api.get(`/api/csr/sponsorships?${buildQuery(params)}`).then((res) => res.data).catch(handleError),
    get: (id) => api.get(`/api/csr/sponsorships/${id}`).then((res) => res.data).catch(handleError),
    create: (payload) => api.post('/api/csr/sponsorships', payload).then((res) => res.data).catch(handleError),
    update: (id, payload) => api.put(`/api/csr/sponsorships/${id}`, payload).then((res) => res.data).catch(handleError),
    cancel: (id) => api.delete(`/api/csr/sponsorships/${id}`).then((res) => res.data).catch(handleError),
    schools: (params = {}) => api.get(`/api/csr/schools/available?${buildQuery(params)}`).then((res) => res.data).catch(handleError),
  },
  funds: {
    balance: () => api.get('/api/csr/funds').then((res) => res.data).catch(handleError),
    transactions: (params = {}) => api.get(`/api/csr/funds/transactions?${buildQuery(params)}`).then((res) => res.data).catch(handleError),
    requestDeposit: (payload) => api.post('/api/csr/funds/deposit', payload).then((res) => res.data).catch(handleError),
    receipts: () => api.get('/api/csr/funds/receipts').then((res) => res.data).catch(handleError),
  },
  reports: {
    list: (params = {}) => api.get(`/api/csr/reports?${buildQuery(params)}`).then((res) => res.data).catch(handleError),
    generate: (payload) => api.post('/api/csr/reports/generate', payload).then((res) => res.data).catch(handleError),
    download: (reportId, format = 'pdf') =>
      `${api.defaults.baseURL}/api/csr/reports/${reportId}/download?format=${format}`,
  },
  impact: {
    metrics: (filters = {}) => api.get(`/api/csr/impact?${buildQuery(filters)}`).then((res) => res.data).catch(handleError),
    regional: (period = 'month') => api.get(`/api/csr/impact/regional?period=${period}`).then((res) => res.data).catch(handleError),
    trends: (params = {}) => api.get(`/api/csr/trends?${buildQuery(params)}`).then((res) => res.data).catch(handleError),
  },
  gallery: {
    list: (params = {}) => api.get(`/api/csr/gallery?${buildQuery(params)}`).then((res) => res.data).catch(handleError),
    upload: (payload) => {
      const formData = new FormData();
      Object.keys(payload).forEach((key) => {
        if (payload[key] !== undefined && payload[key] !== null) {
          if (Array.isArray(payload[key])) {
            payload[key].forEach((value) => formData.append(`${key}[]`, value));
          } else {
            formData.append(key, payload[key]);
          }
        }
      });
      return api
        .post('/api/csr/gallery', formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => res.data)
        .catch(handleError);
    },
    delete: (id) => api.delete(`/api/csr/gallery/${id}`).then((res) => res.data).catch(handleError),
  },
};

export default csrService;
