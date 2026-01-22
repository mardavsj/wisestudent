import React, { useEffect, useMemo, useState } from "react";
import { Activity, RefreshCw, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import csrSponsorshipService from "../../services/csrSponsorshipService";

const CSRSponsorshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const response = await csrSponsorshipService.get(id);
      setDetails(response?.data);
    } catch (err) {
      console.error("Load sponsorship detail failed", err);
      toast.error(err.response?.data?.message || "Unable to fetch sponsorship");
      navigate("/csr/sponsorships");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const costTotal = useMemo(() => {
    if (!details?.costBreakdown?.length) return 0;
    return details.costBreakdown.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [details]);

  const expirationDate = useMemo(() => {
    if (!details) return null;
    return new Date(details.endDate || details.createdAt || Date.now());
  }, [details]);

  const daysRemaining = useMemo(() => {
    if (!expirationDate) return 0;
    const now = new Date();
    const diff = Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24));
    return diff;
  }, [expirationDate]);

  const isExpiringSoon =
    details?.status === "active" && expirationDate && daysRemaining >= 0 && daysRemaining <= 30;

  if (loading || !details) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="inline-flex items-center gap-2 text-sm text-slate-500">
          <RefreshCw className="w-4 h-4 animate-spin" />
          Loading sponsorship details...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <header>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Sponsorship</p>
          <h1 className="text-3xl font-bold text-slate-900">{details.title || "Untitled Sponsorship"}</h1>
          <p className="text-sm text-slate-500">{details.description || "No description provided."}</p>
        </header>

        {isExpiringSoon && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 flex items-center justify-between">
            <div>
              <p className="font-semibold">Expiring in {daysRemaining} day{daysRemaining === 1 ? "" : "s"}</p>
              <p className="text-xs text-rose-600">
                Renew to keep this sponsorship active and avoid gaps in student support.
              </p>
            </div>
            <button
              onClick={() => navigate(`/csr/sponsorships/${details._id}/renew`)}
              className="rounded-2xl bg-rose-500 px-3 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white"
            >
              Renew Now
            </button>
          </div>
        )}
        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">School</p>
            <p className="text-sm font-semibold text-slate-900">{details.schoolId || "School not linked"}</p>
            <p className="text-xs text-slate-500">Status: {details.status}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Duration</p>
            <p className="text-sm text-slate-900">
              {new Date(details.startDate || details.createdAt).toLocaleDateString()} –{" "}
              {new Date(details.endDate || Date.now()).toLocaleDateString()}
            </p>
            <p className="text-xs text-slate-500">Committed for {details.durationMonths || "N/A"} months</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Budget</p>
            <p className="text-2xl font-semibold text-slate-900">
              ₹{(details.totalBudget || costTotal || 0).toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">Type: {details.type || "Not specified"}</p>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Student & Impact Snapshot</h2>
            <button
              onClick={fetchDetails}
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-indigo-600"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Students</p>
              <p className="text-2xl font-semibold text-slate-900">
                {details.studentCount || "N/A"}
              </p>
              <p className="text-xs text-slate-500">Activated via CSR</p>
            </div>
            <div className="rounded-2xl border bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Impact</p>
              <p className="text-2xl font-semibold text-slate-900">{details.impactValue || "—"}</p>
              <p className="text-xs text-slate-500">Metric placeholder</p>
            </div>
            <div className="rounded-2xl border bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Engagement</p>
              <p className="text-2xl font-semibold text-slate-900">{details.activityMetrics?.completions || "—"}</p>
              <p className="text-xs text-slate-500">Progress snapshot</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Cost Breakdown</h2>
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Total ₹{costTotal.toLocaleString()}</span>
          </div>
          <div className="space-y-3">
            {(details.costBreakdown || []).map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.category}</p>
                  <p className="text-xs text-slate-500">{item.description || "Description not available"}</p>
                </div>
                <p className="text-sm font-semibold text-slate-900">₹{(item.amount || 0).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Next Steps</h2>
            <button
              onClick={() => navigate(`/csr/sponsorships/${details._id}/renew`)}
              className="text-xs font-semibold uppercase tracking-wider text-indigo-600"
            >
              Renew ({details.renewal?.renewalCount || 0})
            </button>
          </div>
          <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-slate-700 flex items-center justify-between">
            <p className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              Track engagement, upload impact photos, and credit this sponsorship.
            </p>
            <button
              onClick={() => toast("View students and updates in the students tab")}
              className="text-xs font-semibold uppercase tracking-wider text-indigo-600"
            >
              View students
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CSRSponsorshipDetails;
