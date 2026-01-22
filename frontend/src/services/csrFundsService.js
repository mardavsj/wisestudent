import api from "../utils/api";

const csrFundsService = {
  getBalance: () => api.get("/api/csr/funds").then((res) => res.data),
  getTransactions: (params = {}) =>
    api.get("/api/csr/funds/transactions", { params }).then((res) => res.data),
  requestDeposit: (payload) => api.post("/api/csr/funds/deposit", payload).then((res) => res.data),
  getReceipts: () => api.get("/api/csr/funds/receipts").then((res) => res.data),
};

export default csrFundsService;
