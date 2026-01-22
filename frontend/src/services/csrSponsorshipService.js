import api from "../utils/api";

const csrSponsorshipService = {
  list: (params = {}) =>
    api.get("/api/csr/sponsorships", { params }).then((res) => res.data),
  get: (id) => api.get(`/api/csr/sponsorships/${id}`).then((res) => res.data),
  create: (payload) => api.post("/api/csr/sponsorships", payload).then((res) => res.data),
  update: (id, payload) => api.put(`/api/csr/sponsorships/${id}`, payload).then((res) => res.data),
  cancel: (id) => api.delete(`/api/csr/sponsorships/${id}`).then((res) => res.data),
  getSchools: (params = {}) =>
    api.get("/api/csr/schools/available", { params }).then((res) => res.data),
  renew: (id, payload) =>
    api.post(`/api/csr/sponsorships/${id}/renew`, payload).then((res) => res.data),
};

export default csrSponsorshipService;
