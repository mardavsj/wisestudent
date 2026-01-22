import React, { useEffect, useState } from "react";
import { Download, Filter, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import csrFundsService from "../../services/csrFundsService";

const typeLabels = {
  deposit: "Deposit",
  allocation: "Allocation",
  refund: "Refund",
  reversal: "Reversal",
};

const CSRFunds = () => {
  const [balanceData, setBalanceData] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({ type: "", status: "" });
  const [loading, setLoading] = useState(false);

  const fetchFunds = async () => {
    setLoading(true);
    try {
      const res = await csrFundsService.getBalance();
      setBalanceData(res?.data || {});
      const txRes = await csrFundsService.getTransactions(filters);
      setTransactions(txRes?.data || []);
    } catch (err) {
      console.error("Fund load failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, [filters]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Funds</p>
            <h1 className="text-3xl font-bold text-slate-900">Fund Management</h1>
          </div>
          <Link
            to="/csr/funds/add"
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Funds
          </Link>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Current Balance</p>
            <p className="text-3xl font-semibold text-slate-900">₹{(balanceData.balance || 0).toLocaleString()}</p>
            <p className="text-sm text-slate-500">Total budget: ₹{(balanceData.totalBudget || 0).toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Committed Funds</p>
            <p className="text-3xl font-semibold text-slate-900">
              ₹{(balanceData.committedAmount || 0).toLocaleString()}
            </p>
            <p className="text-sm text-slate-500">Reserved for sponsorships</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Receipts</p>
            <p className="text-3xl font-semibold text-slate-900">{(balanceData.taxReceipts || 0)}</p>
            <p className="text-sm text-slate-500">80G certificates issued</p>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Filters</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={filters.type}
                onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-1 text-sm"
              >
                <option value="">All types</option>
                {Object.entries(typeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-1 text-sm"
              >
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Reference</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-slate-500">
                      Loading transactions...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-slate-500">
                      No transactions yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map((txn) => (
                    <tr key={txn.transactionId || txn._id} className="border-b border-slate-100">
                      <td className="px-3 py-3 font-semibold text-slate-900">
                        {new Date(txn.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-3">{typeLabels[txn.type] || txn.type}</td>
                      <td className="px-3 py-3 text-slate-900">₹{(txn.amount || 0).toLocaleString()}</td>
                      <td className="px-3 py-3 uppercase text-xs text-slate-500">{txn.status}</td>
                      <td className="px-3 py-3">{txn.referenceId || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CSRFunds;
