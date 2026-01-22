import React, { useEffect, useState } from "react";
import adminCsrRefundService from "../../services/adminCsrRefundService";
import { toast } from "react-hot-toast";
import { ShieldCheck, RefreshCw } from "lucide-react";

const AdminCSRRefunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  const refreshList = async () => {
    try {
      setLoading(true);
      const response = await adminCsrRefundService.listPending();
      setRefunds(response?.data || response || []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load refunds.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshList();
  }, []);

  const handleProcess = async (refund) => {
    const note = window.prompt("Enter a processing note (optional)", "Refund processed");
    try {
      setProcessing(refund._id);
      await adminCsrRefundService.processRefund(refund._id, { note });
      toast.success("Refund marked as processed.");
      refreshList();
    } catch (error) {
      console.error(error);
      toast.error("Failed to process refund.");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Admin</p>
            <h1 className="text-3xl font-black text-slate-900">CSR Refunds</h1>
            <p className="text-sm text-slate-500">Review and approve sponsor refund requests.</p>
          </div>
          <button
            onClick={refreshList}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <p className="text-sm text-slate-600">Pending refunds ({refunds.length})</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Sponsor</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Requested at</th>
                  <th className="px-4 py-3 text-left">Reason</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400">
                      Loading refunds...
                    </td>
                  </tr>
                ) : refunds.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500">
                      No pending refund requests.
                    </td>
                  </tr>
                ) : (
                  refunds.map((refund) => (
                    <tr key={refund._id} className="border-b border-slate-100">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {refund.sponsorId?.companyName || "CSR Sponsor"}
                      </td>
                      <td className="px-4 py-3 text-slate-700">₹{refund.amount?.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(refund.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{refund.metadata?.reason || "-"}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleProcess(refund)}
                          disabled={processing === refund._id}
                          className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs uppercase tracking-wide"
                        >
                          {processing === refund._id ? "Processing..." : "Process"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCSRRefunds;
