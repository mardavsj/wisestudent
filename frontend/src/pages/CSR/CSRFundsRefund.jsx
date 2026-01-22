import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import csrRefundService from "../../services/csrRefundService";
import { ArrowLeft, Banknote } from "lucide-react";

const CSRFundsRefund = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [form, setForm] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    reason: "",
    proofUrl: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const loadAmount = async () => {
      try {
        const response = await csrRefundService.getRefundAmount();
        if (!mounted) return;
        setAvailableBalance(response?.data?.availableBalance || response?.availableBalance || 0);
      } catch (error) {
        toast.error("Unable to fetch balance.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadAmount();
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const amount = Number(form.amount);
    if (!amount || amount <= 0) {
      toast.error("Enter a valid refund amount.");
      return;
    }

    if (amount > availableBalance) {
      toast.error("Refund amount cannot exceed available balance.");
      return;
    }

    if (!form.bankName.trim() || !form.accountNumber.trim() || !form.ifsc.trim()) {
      toast.error("Add bank details.");
      return;
    }

    try {
      setSubmitting(true);
      await csrRefundService.requestRefund({
        amount,
        reason: form.reason,
        proofUrl: form.proofUrl,
      });
      toast.success("Refund request submitted. Admin will review shortly.");
      setForm({
        amount: "",
        bankName: "",
        accountNumber: "",
        ifsc: "",
        reason: "",
        proofUrl: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit refund.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-wide text-emerald-600">Refunds</p>
            <h1 className="text-3xl font-black text-slate-900">Request a refund</h1>
            <p className="text-sm text-slate-500">Refunds are reviewed by the CSR admin team within 48 hours.</p>
          </div>
          <button
            onClick={() => navigate("/csr/funds")}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to funds
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 space-y-6">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Banknote className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Available balance</p>
              <p className="text-2xl font-black text-slate-900">
                {loading ? "…" : `₹${availableBalance.toLocaleString("en-IN")}`}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="space-y-1 text-sm text-slate-600">
              Refund amount
              <input
                type="number"
                min="1"
                step="any"
                value={form.amount}
                onChange={handleChange("amount")}
                placeholder="Enter amount in INR"
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:border-emerald-500 focus:outline-none"
              />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="space-y-1 text-sm text-slate-600">
                Bank name
                <input
                  type="text"
                  value={form.bankName}
                  onChange={handleChange("bankName")}
                  placeholder="Bank"
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:border-emerald-500 focus:outline-none"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-600">
                Account number
                <input
                  type="text"
                  value={form.accountNumber}
                  onChange={handleChange("accountNumber")}
                  placeholder="XXXXXX"
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:border-emerald-500 focus:outline-none"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-600">
                IFSC
                <input
                  type="text"
                  value={form.ifsc}
                  onChange={handleChange("ifsc")}
                  placeholder="BANK000123"
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:border-emerald-500 focus:outline-none"
                />
              </label>
            </div>

            <label className="space-y-1 text-sm text-slate-600">
              Reason for refund
              <textarea
                rows={3}
                value={form.reason}
                onChange={handleChange("reason")}
                placeholder="Let us know why you're requesting a refund"
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:border-emerald-500 focus:outline-none"
              />
            </label>

            <label className="space-y-1 text-sm text-slate-600">
              Proof URL (optional)
              <input
                type="url"
                value={form.proofUrl}
                onChange={handleChange("proofUrl")}
                placeholder="https://drive.google.com/..."
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:border-emerald-500 focus:outline-none"
              />
            </label>

            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full px-5 py-3 bg-emerald-600 text-white font-semibold rounded-2xl shadow-lg hover:bg-emerald-500 transition"
            >
              {submitting ? "Submitting..." : "Submit refund request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CSRFundsRefund;
