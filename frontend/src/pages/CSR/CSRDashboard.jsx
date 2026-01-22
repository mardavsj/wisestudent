import React, { useEffect, useMemo, useState } from "react";
import { DollarSign, FileText, RefreshCw, ShieldCheck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import csrService from "../../services/csrService";
import csrFundsService from "../../services/csrFundsService";
import csrSponsorshipService from "../../services/csrSponsorshipService";

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const CSRDashboard = () => {
  const navigate = useNavigate();
  const [impactData, setImpactData] = useState({});
  const [fundData, setFundData] = useState({});
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const quickActions = [
    { label: "Add Funds", onClick: () => navigate("/csr/financial"), icon: DollarSign },
    { label: "New Sponsorship", onClick: () => navigate("/csr/sponsorships/new"), icon: Users },
    { label: "Generate Report", onClick: () => navigate("/csr/reports"), icon: FileText },
  ];

  const fetchOverview = async () => {
    setLoading(true);
    setError("");
    try {
      const [impactRes, fundsRes, sponsorshipRes] = await Promise.all([
        csrService.getImpactMetrics(),
        csrFundsService.getBalance(),
        csrSponsorshipService.list({ limit: 10 }),
      ]);
      const impactPayload = impactRes?.data || {};
      setImpactData(impactPayload.impactData || impactPayload || {});
      setFundData(fundsRes?.data || {});
      setSponsorships(sponsorshipRes?.data || []);
    } catch (err) {
      console.error("Dashboard load failed:", err);
      setError(err.response?.data?.message || err.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const activeSponsorships = useMemo(
    () => sponsorships.filter((s) => s.status === "active"),
    [sponsorships]
  );

  const quickStats = useMemo(
    () => [
      { label: "Available Balance", value: formatCurrency(fundData.balance), icon: DollarSign },
      { label: "Students Impacted", value: impactData.studentsImpacted ?? 0, icon: Users },
      {
        label: "Active Sponsorships",
        value: activeSponsorships.length,
        icon: ShieldCheck,
      },
      { label: "Reports", value: impactData.reportHighlights?.length || 0, icon: FileText },
    ],
    [fundData, impactData, activeSponsorships]
  );

  const expiringSoonSponsorships = useMemo(() => {
    const now = new Date();
    return sponsorships.filter((s) => {
      if (!s.endDate || s.status !== "active") return false;
      const diffDays = Math.ceil((new Date(s.endDate) - now) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 30;
    });
  }, [sponsorships]);

  const recentTransactions = fundData.recentTransactions || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <header className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">CSR Command Center</p>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">
            Monitor sponsors, funds, and impact metrics in one place.
          </p>
        </header>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {expiringSoonSponsorships.length > 0 && (
          <section className="rounded-3xl border border-rose-100 bg-rose-50 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-rose-500">Renewal Reminder</p>
                <h2 className="text-lg font-semibold text-rose-900">Expiring sponsorships</h2>
              </div>
              <button
                onClick={() => navigate("/csr/sponsorships")}
                className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-700"
              >
                View all
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {expiringSoonSponsorships.slice(0, 2).map((sponsorship) => {
                const daysLeft = Math.ceil(
                  (new Date(sponsorship.endDate) - new Date()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div
                    key={sponsorship._id}
                    className="rounded-2xl border border-rose-100 bg-white p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-rose-900">{sponsorship.title}</p>
                      <p className="text-xs text-rose-500">
                        {sponsorship.schoolId || "School not linked"}
                      </p>
                      <p className="text-xs text-slate-500">
                        Ends in {Math.max(daysLeft, 0)} day{daysLeft === 1 ? "" : "s"}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/csr/sponsorships/${sponsorship._id}/renew`)}
                      className="rounded-2xl bg-rose-500 px-3 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white"
                    >
                      Renew
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat) => (
            <article
              key={stat.label}
              className="bg-white shadow-sm rounded-2xl p-5 border border-slate-100 flex items-center gap-4"
            >
              <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100">
                <stat.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">{stat.label}</p>
                <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Recent Transactions</h2>
              <button
                onClick={() => {
                  toast.success("Refreshing transactions...");
                  fetchOverview();
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {loading ? (
                <p className="text-sm text-slate-500">Loading transactions...</p>
              ) : recentTransactions.length === 0 ? (
                <p className="text-sm text-slate-500">No transactions yet. Submit a deposit to get started.</p>
              ) : (
                recentTransactions.slice(0, 5).map((txn) => (
                  <div
                    key={txn.transactionId || txn._id}
                    className="p-3 rounded-xl bg-slate-50 flex items-center justify-between text-sm"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{txn.type?.toUpperCase()}</p>
                      <p className="text-xs text-slate-500">{new Date(txn.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">{formatCurrency(txn.amount)}</p>
                      <p className="text-xs text-slate-500">{txn.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Active Sponsorships</h2>
              <p className="text-xs text-slate-500">Watch the schools you sponsor and their timelines.</p>
            </div>
            <div className="space-y-3">
              {activeSponsorships.length === 0 ? (
                <p className="text-sm text-slate-500">No active sponsorships yet.</p>
              ) : (
                activeSponsorships.slice(0, 3).map((sponsorship) => (
                  <div key={sponsorship._id} className="border border-slate-100 rounded-xl p-3">
                    <p className="text-sm font-semibold text-slate-900">{sponsorship.title}</p>
                    <p className="text-xs text-slate-500">
                      {sponsorship.type || "Type not set"} · {sponsorship.schoolId || "School not linked"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(sponsorship.startDate || sponsorship.createdAt).toLocaleDateString()} –{" "}
                      {new Date(sponsorship.endDate || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
              <p className="text-xs text-slate-500">Launch CSR tasks with one click.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3 border border-slate-200 hover:border-indigo-400 transition bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
              >
                <span className="text-xs font-semibold uppercase tracking-wide">{action.label}</span>
                <action.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CSRDashboard;
