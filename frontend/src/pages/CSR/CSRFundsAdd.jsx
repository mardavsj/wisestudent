import React, { useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import csrFundsService from "../../services/csrFundsService";

const paymentMethods = ["Bank Transfer", "Cheque", "Online Payment"];

const CSRFundsAdd = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(50000);
  const [method, setMethod] = useState(paymentMethods[0]);
  const [bankDetails, setBankDetails] = useState(
    "Axis Bank • IFSC: UTIB0000001 • Account: 1234567890"
  );
  const [proof, setProof] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await csrFundsService.requestDeposit({
        amount,
        paymentMethod: method,
        referenceId: `WEB-${Date.now()}`,
        bankDetails,
        proofName: proof?.name,
      });
      toast.success("Deposit request submitted");
      navigate("/csr/funds");
    } catch (err) {
      toast.error(err?.message || "Unable to submit deposit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to funds
        </button>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h1 className="text-2xl font-semibold text-slate-900">Request Deposit</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Amount (INR)
              </label>
              <input
                type="number"
                min={1000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Payment method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
              >
                {paymentMethods.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Bank details</label>
              <textarea
                value={bankDetails}
                onChange={(e) => setBankDetails(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
                rows={3}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Attach proof
              </label>
              <label className="mt-2 flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500">
                <span>{proof?.name || "Choose a file"}</span>
                <Upload className="w-5 h-5" />
                <input
                  type="file"
                  className="hidden"
                  onChange={(event) => setProof(event.target.files?.[0] || null)}
                />
              </label>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg"
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CSRFundsAdd;
