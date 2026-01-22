import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import csrSponsorshipService from "../../services/csrSponsorshipService";

const STATUS_OPTIONS = ["all", "draft", "active", "paused", "expired", "cancelled"];

const CSRSponsorships = () => {
  const navigate = useNavigate();
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchSponsorships = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await csrSponsorshipService.list({ status: statusFilter !== "all" ? statusFilter : undefined });
      setSponsorships(response?.data || []);
    } catch (err) {
      console.error("Failed to load sponsorships", err);
      setError(err.response?.data?.message || err.message || "Unable to load sponsorships.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsorships();
  }, [statusFilter]);

  const filteredSponsorships = useMemo(() => {
    if (!search) return sponsorships;
    return sponsorships.filter((s) => {
      const needle = search.toLowerCase();
      return (
        s.title?.toLowerCase().includes(needle) ||
        s.schoolId?.toString().toLowerCase().includes(needle)
      );
    });
  }, [search, sponsorships]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-5">
        <header className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Sponsorships</p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-3xl font-bold text-slate-900">Sponsorship Portfolio</h1>
            <button
              onClick={() => navigate("/csr/sponsorships/new")}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Create New
            </button>
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2 flex items-center space-x-2 bg-white rounded-full border border-slate-200 px-4 py-2 shadow-sm">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm text-slate-700 focus:outline-none"
              placeholder="Search by title or school ID"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm focus:outline-none shadow-sm"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "All statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </section>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-[2fr,1fr,1fr,1fr,auto] gap-4 px-5 py-3 text-xs uppercase tracking-wide text-slate-500 border-b border-slate-100">
            <span>Sponsorship</span>
            <span>School</span>
            <span>Status</span>
            <span>Duration</span>
            <span className="text-right">Actions</span>
          </div>
          {loading ? (
            <div className="p-6 text-sm text-slate-500 text-center">Loading sponsorships...</div>
          ) : filteredSponsorships.length === 0 ? (
            <div className="p-6 text-sm text-slate-500 text-center">No sponsorships matched your filters.</div>
          ) : (
            filteredSponsorships.map((sponsorship) => (
              <div
                key={sponsorship._id}
                className="grid grid-cols-[2fr,1fr,1fr,1fr,auto] gap-4 px-5 py-4 items-center border-b last:border-b-0 border-slate-100"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{sponsorship.title}</p>
                  <p className="text-xs text-slate-500">{sponsorship.description || "No description"}</p>
                </div>
                <div className="text-sm text-slate-600">{sponsorship.schoolId || "N/A"}</div>
                <div>
                  <span className={`text-xs font-semibold uppercase ${sponsorship.status === "active" ? "text-emerald-600" : "text-amber-600"}`}>
                    {sponsorship.status}
                  </span>
                </div>
                <div className="text-sm text-slate-600">
                  {new Date(sponsorship.startDate || sponsorship.createdAt).toLocaleDateString()} –{" "}
                  {new Date(sponsorship.endDate || Date.now()).toLocaleDateString()}
                </div>
                <div className="text-right">
                  <button
                    onClick={() => navigate(`/csr/sponsorships/${sponsorship._id}`)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600"
                  >
                    View
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
};

export default CSRSponsorships;
