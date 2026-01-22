import api from "../utils/api";

const csrRefundService = {
  requestRefund: (payload) => api.post("/api/csr/funds/refund", payload).then((res) => res.data),
  getRefundAmount: () => api.get("/api/csr/funds/refund/amount").then((res) => res.data),
};

export default csrRefundService;
