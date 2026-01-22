import api from "../utils/api";

const adminCsrRefundService = {
  listPending: (params = {}) =>
    api.get("/api/admin/csr/refunds", { params }).then((res) => res.data),
  processRefund: (id, payload = {}) =>
    api.post(`/api/admin/csr/refunds/${id}/process`, payload).then((res) => res.data),
};

export default adminCsrRefundService;
