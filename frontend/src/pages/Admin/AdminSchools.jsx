import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  Users,
  UserCircle,
  MapPin,
  Phone,
  Filter,
  Search,
  Layers,
  LayoutGrid,
  Rows,
} from "lucide-react";
import { fetchAdminSchools } from "../../services/adminSchoolsService";
import { useSocket } from "../../context/SocketContext";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const statusTokens = {
  approved: {
    label: "Approved",
    className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-rose-100 text-rose-700 border border-rose-200",
  },
};

const formatNumber = (value) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Number.isFinite(value) ? value : 0
  );

const formatRelativeTime = (value) => {
  if (!value) return "—";
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "—";
  const diffMs = Date.now() - timestamp;
  if (diffMs < 0) return "just now";
  const diffMinutes = diffMs / 60000;
  if (diffMinutes < 60) return `${Math.max(1, Math.round(diffMinutes))}m ago`;
  const diffHours = diffMinutes / 60;
  if (diffHours < 24) return `${Math.max(1, Math.round(diffHours))}h ago`;
  const diffDays = diffHours / 24;
  if (diffDays < 30) return `${Math.max(1, Math.round(diffDays))}d ago`;
  const diffMonths = diffDays / 30;
  if (diffMonths < 12) return `${Math.max(1, Math.round(diffMonths))}mo ago`;
  const diffYears = diffMonths / 12;
  return `${Math.max(1, Math.round(diffYears))}y ago`;
};

const MetricsChip = ({ icon: Icon, label, value, accent = "from-emerald-500 to-teal-500" }) => (
  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
    <div className={`p-2 rounded-lg bg-gradient-to-br ${accent} text-white`}>
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-lg font-black text-slate-900">{value}</p>
    </div>
  </div>
);

const OverviewCard = ({ title, value, subtitle, icon: Icon, gradient }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
    className="rounded-3xl shadow-xl border border-white/40 bg-white/90 backdrop-blur-lg px-6 py-5 relative overflow-hidden"
  >
    <div className={`absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-br ${gradient}`} />
    <div className="relative z-10 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-slate-500">{title}</p>
        <p className="text-3xl font-black text-slate-900 mt-2">{value}</p>
        {subtitle && <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p>}
      </div>
      <div className="p-3 rounded-2xl bg-white/85 shadow-lg">
        <Icon className="w-7 h-7 text-slate-700" />
      </div>
    </div>
  </motion.div>
);

const AdminSchools = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [loading, setLoading] = useState(true);
  const [schoolsByRegion, setSchoolsByRegion] = useState([]);
  const [schools, setSchools] = useState([]);
  const [groupedSchools, setGroupedSchools] = useState({
    approved: [],
    pending: [],
    rejected: [],
  });
  const [summary, setSummary] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [filters, setFilters] = useState({ status: "all", search: "", sort: "recent", region: "" });
  const [pagination, setPagination] = useState({ page: 1, limit: 18, total: 0, pages: 1 });
  const [searchDraft, setSearchDraft] = useState("");
  const [viewMode, setViewMode] = useState("rows");

  const filtersRef = useRef(filters);
  const paginationRef = useRef(pagination);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  const loadSchools = useCallback(
    async (overrides = {}) => {
      const currentFilters = filtersRef.current;
      const currentPagination = paginationRef.current;
      const params = {
        status: overrides.status ?? currentFilters.status,
        search: overrides.search ?? currentFilters.search,
        sort: overrides.sort ?? currentFilters.sort,
        region: overrides.region ?? currentFilters.region,
        page: overrides.page ?? currentPagination.page,
        limit: overrides.limit ?? currentPagination.limit,
      };

      setLoading(true);
      try {
        const response = await fetchAdminSchools(params);
        setSchools(response.data || []);
        setGroupedSchools(response.grouped || { approved: [], pending: [], rejected: [] });
        setSummary(response.summary || { total: 0, approved: 0, pending: 0, rejected: 0 });
        if (response.pagination) {
          const nextPagination = {
            page: response.pagination.page ?? params.page,
            limit: response.pagination.limit ?? params.limit,
            total: response.pagination.total ?? 0,
            pages: response.pagination.pages ?? 1,
          };
          paginationRef.current = nextPagination;
          setPagination(nextPagination);
        }
      } catch (error) {
        console.error("Error loading schools:", error);
        toast.error(error.response?.data?.message || "Unable to load schools overview");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadSchools({ page: 1 });
  }, [loadSchools]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await api.get("/api/admin/schools-by-region");
        const data = res?.data?.data ?? res?.data ?? [];
        setSchoolsByRegion(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load schools by region:", err);
      }
    };
    fetchRegions();
  }, []);

  useEffect(() => {
    setPagination((prev) => {
      const next = { ...prev, page: 1 };
      paginationRef.current = next;
      return next;
    });
    loadSchools({ page: 1 });
  }, [filters.status, filters.sort, filters.search, filters.region, loadSchools]);

  useEffect(() => {
    if (!socket?.socket) return;
    const handleRealtimeUpdate = () => loadSchools();
    socket.socket.on("admin:school-approval:update", handleRealtimeUpdate);
    socket.socket.on("admin:schools:update", handleRealtimeUpdate);
    return () => {
      socket.socket.off("admin:school-approval:update", handleRealtimeUpdate);
      socket.socket.off("admin:schools:update", handleRealtimeUpdate);
    };
  }, [socket, loadSchools]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((prev) => {
        const nextSearch = searchDraft.trim();
        if (prev.search === nextSearch) return prev;
        return { ...prev, search: nextSearch };
      });
    }, 350);
    return () => clearTimeout(timeout);
  }, [searchDraft]);

  const visibleSchools = useMemo(() => {
    if (filters.status === "all") return schools;
    return groupedSchools[filters.status] || [];
  }, [schools, groupedSchools, filters.status]);

  const statusSummaryCards = useMemo(
    () => [
      {
        title: "Total Schools",
        value: formatNumber(summary.total),
        subtitle: `${formatNumber(summary.pending)} awaiting review`,
        icon: Building2,
        iconBg: "bg-indigo-100 text-indigo-600",
      },
      {
        title: "Approved",
        value: formatNumber(summary.approved),
        subtitle: `${formatNumber(summary.rejected)} rejected overall`,
        icon: CheckCircle2,
        iconBg: "bg-emerald-100 text-emerald-600",
      },
      {
        title: "Pending",
        value: formatNumber(summary.pending),
        subtitle: "Active onboarding pipeline",
        icon: Clock,
        iconBg: "bg-amber-100 text-amber-600",
      },
    ],
    [summary]
  );

  const handleStatusFilter = (status) => {
    setFilters((prev) => (prev.status === status ? prev : { ...prev, status }));
  };

  const handleSortChange = (event) => {
    const value = event.target.value;
    setFilters((prev) => (prev.sort === value ? prev : { ...prev, sort: value }));
  };

  const handleRegionFilter = (region) => {
    setFilters((prev) => (prev.region === region ? prev : { ...prev, region: region || "" }));
  };

  const handleCardSelect = (school) => {
    if (!school?.id) return;
    navigate(`/admin/schools/${school.id}`);
  };

  const handlePageChange = (direction) => {
    const target =
      direction === "next"
        ? Math.min(pagination.page + 1, pagination.pages || pagination.page)
        : Math.max(pagination.page - 1, 1);
    paginationRef.current = { ...paginationRef.current, page: target };
    setPagination((prev) => ({ ...prev, page: target }));
    loadSchools({ page: target });
  };

  const handleFirstPage = () => {
    if (pagination.page <= 1) return;
    paginationRef.current = { ...paginationRef.current, page: 1 };
    setPagination((prev) => ({ ...prev, page: 1 }));
    loadSchools({ page: 1 });
  };

  const handleLastPage = () => {
    const last = Math.max(1, pagination.pages);
    if (pagination.page >= last) return;
    paginationRef.current = { ...paginationRef.current, page: last };
    setPagination((prev) => ({ ...prev, page: last }));
    loadSchools({ page: last });
  };

  const handleLimitChange = (e) => {
    const newLimit = Math.min(Math.max(parseInt(e.target.value, 10) || 18, 10), 50);
    setPagination((prev) => ({ ...prev, page: 1, limit: newLimit }));
    paginationRef.current = { ...paginationRef.current, page: 1, limit: newLimit };
    loadSchools({ page: 1, limit: newLimit });
  };

  const paginationStart = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const paginationEnd = Math.min(pagination.page * pagination.limit, pagination.total);

  const gridClass =
    viewMode === "grid"
      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
      : "grid grid-cols-1 gap-6";

  const regionCardColors = [
    "border-indigo-200 bg-indigo-50/70 hover:border-indigo-300 hover:bg-indigo-100/50",
    "border-blue-200 bg-blue-50/60 hover:border-blue-300 hover:bg-blue-100/40",
    "border-purple-200 bg-purple-50/60 hover:border-purple-300 hover:bg-purple-100/40",
    "border-teal-200 bg-teal-50/60 hover:border-teal-300 hover:bg-teal-100/40",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      <header className="w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-2xl border border-purple-500/30 px-4 py-12 md:py-14">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors shrink-0 mt-0.5"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">School directory</p>
              <h1 className="text-2xl md:text-3xl font-black text-white mt-2 flex items-center gap-3">
                <Building2 className="w-8 h-8 shrink-0" />
                Schools
              </h1>
              <p className="text-sm text-white/85 max-w-2xl mt-1.5 leading-relaxed">
                Schools grouped by state/region. Filter by status, search, and export.
              </p>
            </div>
          </div>
          <div className="text-right space-y-1 flex-shrink-0 md:pl-4">
            <p className="text-sm font-medium text-white/90">
              Total: <span className="font-bold text-white">{formatNumber(summary.total)}</span> schools
            </p>
            <p className="text-xs text-white/70">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 -mt-8 space-y-6">
        {/* Summary cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statusSummaryCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{card.title}</span>
                  <div className={`p-2 rounded-lg ${card.iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                {card.subtitle && <p className="text-xs text-slate-500 mt-1.5">{card.subtitle}</p>}
              </motion.div>
            );
          })}
        </section>

        {/* Schools by Region */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-1 h-6 rounded-full bg-indigo-500" />
              <MapPin className="w-5 h-5 text-indigo-600" />
              Schools by Region
            </h2>
            <p className="text-sm text-slate-500 mt-1 ml-7">Schools grouped by state/region</p>
          </div>
          <div className="p-6 bg-slate-50/30">
            {schoolsByRegion.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {schoolsByRegion.slice(0, 8).map((region, idx) => {
                  const regionName = region.region || "Unknown";
                  const isSelected = filters.region && regionName.toLowerCase() === filters.region.toLowerCase();
                  return (
                    <button
                      type="button"
                      key={region.region || idx}
                      onClick={() => handleRegionFilter(isSelected ? "" : regionName)}
                      className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        isSelected
                          ? "ring-2 ring-indigo-500 ring-offset-2 border-indigo-400 bg-indigo-100/80 shadow-md"
                          : regionCardColors[idx % regionCardColors.length]
                      }`}
                      title={isSelected ? `Clear region filter (${regionName})` : `Show schools in ${regionName}`}
                    >
                      <p className="text-2xl font-black text-slate-900 tabular-nums">
                        {region.activeSchools ?? region.totalSchools ?? 0}
                      </p>
                      <p className="text-sm font-semibold text-slate-700 mt-1">
                        {regionName}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {(region.totalSchools ?? 0)} total schools
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500">
                <Building2 className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-medium">No schools data available</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Filters + Schools list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-1 h-6 rounded-full bg-indigo-500" />
              <Building2 className="w-5 h-5 text-indigo-600" />
              Schools List
            </h2>
            <p className="text-sm text-slate-500 mt-1 ml-7">Filter and search schools</p>
          </div>

          {/* Filters bar */}
          <div className="px-6 py-5 border-b border-slate-200 bg-white">
            <div className="flex flex-col gap-5">
              {/* Status pills */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Status</p>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { key: "all", label: "All", count: summary.total },
                    { key: "approved", label: "Approved", count: summary.approved },
                    { key: "pending", label: "Pending", count: summary.pending },
                    { key: "rejected", label: "Rejected", count: summary.rejected },
                  ].map((item) => {
                    const isActive = filters.status === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => handleStatusFilter(item.key)}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all border-2 ${
                          isActive
                            ? "bg-indigo-100 border-indigo-300 text-indigo-700 shadow-sm"
                            : "bg-slate-50/80 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-indigo-200"
                        }`}
                      >
                        <span>{item.label}</span>
                        <span
                          className={`inline-flex min-w-[1.5rem] justify-center text-xs font-bold px-2 py-0.5 rounded-lg ${
                            isActive ? "bg-indigo-200/80 text-indigo-800" : "bg-white border border-slate-200 text-slate-600"
                          }`}
                        >
                          {formatNumber(item.count)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search + Sort + Region + View */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px] max-w-md">
                  <label htmlFor="schools-search" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="schools-search"
                      type="text"
                      value={searchDraft}
                      onChange={(e) => setSearchDraft(e.target.value)}
                      placeholder="Name, city, or contact"
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      aria-label="Search schools by name, city, or contact"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-end gap-4">
                  <div>
                    <label htmlFor="schools-sort" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                      Sort by
                    </label>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                      <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <select
                        id="schools-sort"
                        value={filters.sort}
                        onChange={handleSortChange}
                        className="flex-1 min-w-[160px] text-sm text-slate-800 bg-transparent focus:outline-none border-0 p-0"
                        aria-label="Sort schools"
                      >
                        <option value="recent">Recently updated</option>
                        <option value="name">Alphabetical</option>
                        <option value="oldest">Oldest first</option>
                        <option value="students">Most students</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="schools-region" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                      Region
                    </label>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                      <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <select
                        id="schools-region"
                        value={filters.region}
                        onChange={(e) => handleRegionFilter(e.target.value)}
                        className="flex-1 min-w-[140px] text-sm text-slate-800 bg-transparent focus:outline-none border-0 p-0"
                        aria-label="Filter schools by region"
                        title="Filter by state/region"
                      >
                        <option value="">All regions</option>
                        {schoolsByRegion.slice(0, 20).map((r) => (
                          <option key={r.region || r} value={r.region || ""}>
                            {r.region || "Unknown"} ({r.activeSchools ?? r.totalSchools ?? 0})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">View</span>
                    <div className="inline-flex items-center rounded-xl border-2 border-slate-200 bg-white p-1">
                      <button
                        type="button"
                        onClick={() => setViewMode("rows")}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === "rows"
                            ? "bg-indigo-100 text-indigo-700"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        }`}
                        aria-label="List view"
                        title="List view"
                      >
                        <Rows className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === "grid"
                            ? "bg-indigo-100 text-indigo-700"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        }`}
                        aria-label="Grid view"
                        title="Grid view"
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse rounded-2xl border border-slate-100 bg-slate-50 h-48" />
              ))}
            </div>
          ) : visibleSchools.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No schools match your filters</h3>
              <p className="text-slate-500 mt-2 text-sm max-w-sm">
                {filters.region
                  ? `No schools in "${filters.region}". Try another region or clear the region filter.`
                  : "Adjust status, region, or search to see more results."}
              </p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 lg:grid-cols-2 gap-8"
                  : gridClass
              }
            >
              {visibleSchools.map((school) => {
                const token = statusTokens[school.approvalStatus] || {
                  label: school.approvalStatus,
                  className: "bg-slate-100 text-slate-700 border border-slate-200",
                };
                const isRow = viewMode === "rows";
                return (
                  <motion.button
                    key={school.id}
                    type="button"
                    layout
                    onClick={() => handleCardSelect(school)}
                    whileHover={{ y: -4 }}
                    className={`rounded-2xl border-2 border-gray-100 bg-white shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all ${
                      isRow ? "flex flex-col md:flex-row md:items-center md:justify-between" : "text-left"
                    }`}
                  >
                    <div
                      className={`px-6 py-5 ${
                        isRow
                          ? "flex-1 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                          : "space-y-5"
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-[220px] max-w-[260px]">
                        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 flex-shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-semibold text-slate-900 truncate">
                            {school.name || "Unnamed school"}
                          </h3>
                          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1 truncate">
                            {school.institutionId || "Institution ID unavailable"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold ${token.className} ${
                          isRow ? "md:ml-auto md:flex-shrink-0" : ""
                        }`}
                      >
                        {token.label}
                      </span>

                      {isRow ? (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 md:justify-end md:flex-1 md:min-w-[220px]">
                          <span className="inline-flex items-center gap-2 max-w-[220px] truncate">
                            <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                            {[
                              school.contactInfo?.city,
                              school.contactInfo?.state,
                            ]
                              .filter(Boolean)
                              .join(", ") || "No location recorded"}
                          </span>
                          <span className="inline-flex items-center gap-2 text-[11px] text-slate-400 font-semibold">
                            Updated {formatRelativeTime(school.updatedAt)}
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                                <Users className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Students</p>
                                <p className="text-lg font-black text-slate-900 mt-1">
                                  {formatNumber(school.metrics?.studentCount)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                              <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500 to-slate-700 text-white">
                                <UserCircle className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Teachers</p>
                                <p className="text-lg font-black text-slate-900 mt-1">
                                  {formatNumber(school.metrics?.teacherCount)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                                <Layers className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Classes</p>
                                <p className="text-lg font-black text-slate-900 mt-1">
                                  {formatNumber(school.metrics?.classCount)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                              <div className="p-2 rounded-lg bg-gradient-to-br from-slate-400 to-slate-500 text-white">
                                <Phone className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Contact</p>
                                <p className="text-lg font-black text-slate-900 mt-1 truncate">
                                  {school.contactInfo?.phone || "—"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600 flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-2 min-w-[160px]">
                              <MapPin className="w-4 h-4 text-indigo-500" />
                              {[
                                school.contactInfo?.city,
                                school.contactInfo?.state,
                              ]
                                .filter(Boolean)
                                .join(", ") || "No location recorded"}
                            </span>
                            <span className="inline-flex items-center gap-2 text-xs text-slate-400 font-semibold">
                              Updated {formatRelativeTime(school.updatedAt)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    <div
                      className={`border-t border-slate-100 px-6 py-3 text-xs font-semibold text-indigo-600 ${
                        isRow
                          ? "md:border-t-0 md:border-l md:flex md:flex-col md:justify-center md:px-6 md:min-w-[150px]"
                          : "text-center"
                      }`}
                    >
                      View details
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Pagination — always visible for consistent layout */}
          {!loading && (
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-200 pt-6">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm text-slate-600">
                  Showing <span className="font-semibold text-slate-900">{formatNumber(paginationStart)}</span>
                  –<span className="font-semibold text-slate-900">{formatNumber(paginationEnd)}</span> of{" "}
                  <span className="font-semibold text-slate-900">{formatNumber(pagination.total)}</span> schools
                </span>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <span>Per page</span>
                  <select
                    value={pagination.limit}
                    onChange={handleLimitChange}
                    className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    aria-label="Schools per page"
                  >
                    {[10, 18, 30, 50].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 mr-1">
                  Page <span className="font-semibold text-slate-700">{pagination.page}</span> of{" "}
                  {Math.max(1, pagination.pages)}
                </span>
                <button
                  type="button"
                  onClick={handleFirstPage}
                  disabled={pagination.page <= 1}
                  className="inline-flex items-center justify-center min-w-[2.5rem] px-2.5 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-indigo-200 transition-colors"
                  aria-label="First page"
                >
                  First
                </button>
                <button
                  type="button"
                  onClick={() => handlePageChange("prev")}
                  disabled={pagination.page <= 1}
                  className="inline-flex items-center justify-center min-w-[2.5rem] px-2.5 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-indigo-200 transition-colors"
                  aria-label="Previous page"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => handlePageChange("next")}
                  disabled={pagination.page >= Math.max(1, pagination.pages)}
                  className="inline-flex items-center justify-center min-w-[2.5rem] px-2.5 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-indigo-200 transition-colors"
                  aria-label="Next page"
                >
                  Next
                </button>
                <button
                  type="button"
                  onClick={handleLastPage}
                  disabled={pagination.page >= Math.max(1, pagination.pages)}
                  className="inline-flex items-center justify-center min-w-[2.5rem] px-2.5 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-indigo-200 transition-colors"
                  aria-label="Last page"
                >
                  Last
                </button>
              </div>
            </div>
          )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSchools;

