import api from "../utils/api";

const handleError = (error) => {
  throw error.response?.data || error;
};

const testimonialService = {
  list: (params = {}) =>
    api
      .get(`/api/csr/testimonials`, { params })
      .then((res) => res.data)
      .catch(handleError),
  pendingForCSR: () =>
    api
      .get("/api/csr/testimonials/pending")
      .then((res) => res.data)
      .catch(handleError),
  submit: (payload) =>
    api
      .post("/api/school/testimonials", payload)
      .then((res) => res.data)
      .catch(handleError),
  admin: {
    pending: () =>
      api
        .get("/api/admin/csr/testimonials/pending")
        .then((res) => res.data)
        .catch(handleError),
    approve: (id, payload = {}) =>
      api
        .post(`/api/admin/csr/testimonials/${id}/approve`, payload)
        .then((res) => res.data)
        .catch(handleError),
    reject: (id, payload = {}) =>
      api
        .post(`/api/admin/csr/testimonials/${id}/reject`, payload)
        .then((res) => res.data)
        .catch(handleError),
  },
};

export default testimonialService;
