import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Users,
  MapPin,
  Mail,
  Phone,
  Globe,
  Search,
  Filter,
  History as HistoryIcon,
  AlertTriangle,
  Loader2,
  ArrowLeft
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  fetchSchoolApprovalDashboard,
  fetchPendingSchoolApprovals,
  fetchSchoolApprovalHistory,
  approveSchool,
  rejectSchool,
  updatePendingSchool
} from "../../services/schoolApprovalService";
import { subscriptionRenewalService } from "../../services/subscriptionRenewalService";
import { useSocket } from "../../context/SocketContext";

const statusStyles = {
  pending: "bg-amber-100 text-amber-700 border border-amber-200",
  approved: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  rejected: "bg-rose-100 text-rose-700 border border-rose-200"
};

const priorityStyles = {
  critical: "bg-rose-100 text-rose-700 border border-rose-200",
  high: "bg-amber-100 text-amber-700 border border-amber-200",
  expedite: "bg-indigo-100 text-indigo-700 border border-indigo-200",
  standard: "bg-slate-100 text-slate-700 border border-slate-200"
};

const formatNumber = (value) => new Intl.NumberFormat("en-IN").format(value || 0);

const formatRelativeTime = (value) => {
  if (!value) return null;
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return null;
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

const historyPageSize = 20;

const toNumberOrNull = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const enhanceSchool = (school) => {
  if (!school) return school;
  const contactInfo = {
    ...(school.contactInfo || {}),
  };
  const academicInfo = {
    ...(school.academicInfo || {}),
  };
  const submittedAt = school.submittedAt || school.createdAt;
  const reviewHistory = (school.reviewHistory || []).map((entry) => ({
    ...entry,
    relativeTime: entry.relativeTime || formatRelativeTime(entry.createdAt || entry.updatedAt)
  }));

  return {
    ...school,
    contactInfo,
    academicInfo,
    submittedAgoHuman: school.submittedAgoHuman || formatRelativeTime(submittedAt),
    reviewHistory
  };
};

const AdminSchoolApprovals = () => {
  const navigate = useNavigate();
  const socket = useSocket();

  const [initialLoading, setInitialLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [pendingSchools, setPendingSchools] = useState([]);
  const [renewalRequests, setRenewalRequests] = useState([]);
  const [renewalLoading, setRenewalLoading] = useState(false);
  const [renewalActionModal, setRenewalActionModal] = useState(null);
  const [renewalActionNote, setRenewalActionNote] = useState("");
  const [history, setHistory] = useState({ data: [], meta: { total: 0, page: 1, pages: 1, limit: historyPageSize } });
  const [filters, setFilters] = useState({ search: "", state: "", sort: "oldest" });
  const [historyFilter, setHistoryFilter] = useState({ status: "all", page: 1 });
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
     name: "",
     institutionId: "",
     email: "",
     phone: "",
     address: "",
     city: "",
     state: "",
     pincode: "",
     website: "",
     board: "",
     establishedYear: "",
     totalStudents: "",
     totalTeachers: ""
   });
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionNote, setActionNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [detailSaving, setDetailSaving] = useState(false);
  const [editDirty, setEditDirty] = useState(false);

  const filtersRef = useRef(filters);
  const historyFilterRef = useRef(historyFilter);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    historyFilterRef.current = historyFilter;
  }, [historyFilter]);

  useEffect(() => {
    if (detailModalOpen) {
      const originalStyle = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [detailModalOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key !== "Escape") return;
      if (confirmAction) {
        setConfirmAction(null);
        return;
      }
      if (renewalActionModal) {
        setRenewalActionModal(null);
        setRenewalActionNote("");
        return;
      }
      if (detailModalOpen && selectedSchool) {
        setDetailModalOpen(false);
        setSelectedSchool(null);
        setEditing(false);
        setEditDirty(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [detailModalOpen, selectedSchool, confirmAction, renewalActionModal]);

  const updateEditField = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
    setEditDirty(true);
  };

  const loadDashboard = useCallback(async () => {
    try {
      const response = await fetchSchoolApprovalDashboard();
      setDashboard(response.data || null);
    } catch (error) {
      console.error("Error loading approval dashboard:", error);
      toast.error("Unable to load approval overview");
    }
  }, []);

  const handleDetailSave = async ({ silent = false } = {}) => {
    if (!selectedSchool) {
      setEditing(false);
      return null;
    }

    const sanitize = (value) => (typeof value === "string" ? value.trim() : value);

    const payload = {
      name: sanitize(editForm.name),
      institutionId: sanitize(editForm.institutionId),
      email: sanitize(editForm.email),
      contactInfo: {
        phone: sanitize(editForm.phone),
        address: sanitize(editForm.address),
        city: sanitize(editForm.city),
        state: sanitize(editForm.state),
        pincode: sanitize(editForm.pincode),
        website: sanitize(editForm.website)
      },
      academicInfo: {
        board: sanitize(editForm.board),
        establishedYear: sanitize(editForm.establishedYear),
        totalStudents: toNumberOrNull(editForm.totalStudents),
        totalTeachers: toNumberOrNull(editForm.totalTeachers)
      }
    };

    setDetailSaving(true);
    try {
      const response = await updatePendingSchool(selectedSchool.id, payload);
      const updated = enhanceSchool(response.data);

      setSelectedSchool(updated);
      setPendingSchools((prev) =>
        Array.isArray(prev)
          ? prev.map((item) => (item.id === updated.id ? updated : item))
          : prev
      );

      setEditing(false);
      setEditDirty(false);
      loadDashboard();
      loadHistory();
      if (!silent) {
        toast.success(response.message || "School details updated");
      }
      return updated;
    } catch (error) {
      console.error("Failed to update school details:", error);
      const message = error.response?.data?.message || "Unable to update school details";
      toast.error(message);
      return null;
    } finally {
      setDetailSaving(false);
    }
  };

  const handleInitiateAction = async (mode) => {
     if (!selectedSchool) return;
     if (detailSaving) return;
     let latest = selectedSchool;
     if (editing && editDirty) {
      const result = await handleDetailSave({ silent: true });
      if (!result) {
        return;
      }
      latest = result;
    }
    setDetailSaving(false);
    setConfirmAction({ mode, school: { ...latest } });
    setActionNote("");
  };

  const loadPending = useCallback(async () => {
    try {
      const response = await fetchPendingSchoolApprovals(filtersRef.current);
      const enriched = (response.data || []).map(enhanceSchool);
      setPendingSchools(enriched);
    } catch (error) {
      console.error("Error loading pending approvals:", error);
      toast.error("Unable to load pending schools");
    }
  }, []);

  const loadHistory = useCallback(async (overrides = {}) => {
    try {
      const params = {
        status: overrides.status ?? historyFilterRef.current.status,
        page: overrides.page ?? historyFilterRef.current.page,
        limit: overrides.limit ?? historyPageSize,
        search: overrides.search ?? filtersRef.current.search
      };

      const response = await fetchSchoolApprovalHistory(params);
      const enhanced = (response.data || []).map((item) => ({
        ...item,
        decisionRelativeTime: item.decisionRelativeTime || formatRelativeTime(item.decisionAt || item.updatedAt)
      }));
      setHistory({
        data: enhanced,
        meta: response.meta || { total: 0, page: params.page, pages: 1, limit: params.limit }
      });
      if (historyFilterRef.current.status !== params.status || historyFilterRef.current.page !== params.page) {
        setHistoryFilter({ status: params.status, page: params.page });
      }
      historyFilterRef.current = { status: params.status, page: params.page };
    } catch (error) {
      console.error("Error loading approval history:", error);
      toast.error("Unable to load approval history");
    }
  }, []);

  const loadRenewalRequests = useCallback(async () => {
    try {
      setRenewalLoading(true);
      const response = await subscriptionRenewalService.getRenewalRequests({ status: 'pending' });
      setRenewalRequests(response.data || []);
    } catch (error) {
      console.error("Error loading renewal requests:", error);
      toast.error("Unable to load renewal requests");
    } finally {
      setRenewalLoading(false);
    }
  }, []);

  const handleRenewalAction = async () => {
    if (!renewalActionModal?.request) return;
    setActionLoading(true);
    try {
      const data = { adminNotes: renewalActionNote };
      if (renewalActionModal.mode === 'approve') {
        await subscriptionRenewalService.approveRenewal(renewalActionModal.request._id, data);
        toast.success("Subscription renewal approved successfully");
      } else {
        if (!renewalActionNote.trim()) {
          toast.error("Rejection reason is required");
          setActionLoading(false);
          return;
        }
        await subscriptionRenewalService.rejectRenewal(renewalActionModal.request._id, { 
          rejectionReason: renewalActionNote,
          adminNotes: renewalActionNote 
        });
        toast.success("Subscription renewal rejected");
      }
      setRenewalActionModal(null);
      setRenewalActionNote("");
      await loadRenewalRequests();
    } catch (error) {
      console.error("Error processing renewal request:", error);
      toast.error(error.response?.data?.message || "Unable to process renewal request");
    } finally {
      setActionLoading(false);
    }
  };

  const initialize = useCallback(async () => {
    setInitialLoading(true);
    await Promise.all([loadDashboard(), loadPending(), loadHistory({ page: 1 }), loadRenewalRequests()]);
    setInitialLoading(false);
  }, [loadDashboard, loadPending, loadHistory, loadRenewalRequests]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Socket listeners for real-time updates
  useEffect(() => {
    if (!socket?.socket) return;

    const handleRenewalRequested = () => {
      loadRenewalRequests();
    };

    socket.socket.on('admin:subscription-renewal:requested', handleRenewalRequested);
    socket.socket.on('admin:subscription-renewal:approved', handleRenewalRequested);
    socket.socket.on('admin:subscription-renewal:rejected', handleRenewalRequested);

    return () => {
      socket.socket.off('admin:subscription-renewal:requested', handleRenewalRequested);
      socket.socket.off('admin:subscription-renewal:approved', handleRenewalRequested);
      socket.socket.off('admin:subscription-renewal:rejected', handleRenewalRequested);
    };
  }, [socket, loadRenewalRequests]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadPending();
      loadHistory({ page: 1 });
    }, 350);
    return () => clearTimeout(timeout);
  }, [filters, loadPending, loadHistory]);

  const handleHistoryStatusChange = (status) => {
    loadHistory({ status, page: 1 });
  };

  const handleHistoryPageChange = (page) => {
    loadHistory({ page });
  };

  useEffect(() => {
    if (!socket?.socket) return;

    const handleNew = (payload) => {
      if (!payload?.id) return;
      const enriched = enhanceSchool(payload);
      setPendingSchools((prev) => {
        const exists = prev.some((item) => item.id === enriched.id);
        if (exists) {
          return prev.map((item) => (item.id === enriched.id ? { ...item, ...enriched } : item));
        }
        return [enriched, ...prev];
      });
      loadDashboard();
    };

    const handleUpdate = (payload) => {
      if (!payload?.data?.id) return;
      const enriched = enhanceSchool(payload.data);

      setPendingSchools((prev) => {
        if (!Array.isArray(prev)) return prev;

        if (payload.status === "approved" || payload.status === "rejected") {
          return prev.filter((item) => item.id !== enriched.id);
        }

        const exists = prev.some((item) => item.id === enriched.id);
        if (!exists) {
          return [enriched, ...prev];
        }
        return prev.map((item) => (item.id === enriched.id ? enriched : item));
      });

      if (selectedSchool?.id === enriched.id) {
        setSelectedSchool(enriched);
      }

      loadDashboard();
      loadHistory();
    };

    socket.socket.on("admin:school-approval:new", handleNew);
    socket.socket.on("admin:school-approval:update", handleUpdate);

    return () => {
      socket.socket.off("admin:school-approval:new", handleNew);
      socket.socket.off("admin:school-approval:update", handleUpdate);
    };
  }, [socket, loadDashboard, loadHistory, selectedSchool]);

  const summaryCards = useMemo(() => {
    const summary = dashboard?.summary || {};
    const pendingCount = summary.pending || 0;
    const approvalRate = summary.approvalRate ?? null;
    const rejectionRatePct = approvalRate != null ? 100 - approvalRate : null;
    const avgDecision = summary.averageDecisionHours ?? 0;
    const rejectedCount = summary.rejectedLast30 || 0;

    return [
      {
        title: "Pending Schools",
        value: formatNumber(pendingCount),
        icon: Building2,
        iconBg: "bg-indigo-100 text-indigo-600",
        subtitle: `${formatNumber(summary.agingBacklog || 0)} waiting >72h`
      },
      {
        title: "Approval Rate (30d)",
        value: approvalRate != null ? `${approvalRate}%` : "—",
        icon: CheckCircle2,
        iconBg: "bg-emerald-100 text-emerald-600",
        subtitle: `${formatNumber(summary.approvedLast30 || 0)} approved`
      },
      {
        title: "Avg Decision Time",
        value: avgDecision ? `${avgDecision}h` : "—",
        icon: Clock,
        iconBg: "bg-cyan-100 text-cyan-600",
        subtitle: "Target < 48h"
      },
      {
        title: "Rejections (30d)",
        value: formatNumber(rejectedCount),
        icon: XCircle,
        iconBg: "bg-rose-100 text-rose-600",
        subtitle: rejectionRatePct != null ? `${rejectionRatePct}% rejection rate` : `${formatNumber(rejectedCount)} rejected`
      }
    ];
  }, [dashboard]);

  const handleApproveReject = async () => {
    if (!confirmAction?.school) return;
    setActionLoading(true);
    try {
      const payload = { note: actionNote };
      if (confirmAction.mode === "approve") {
        await approveSchool(confirmAction.school.id, payload);
        toast.success("School approved successfully");
      } else {
        await rejectSchool(confirmAction.school.id, payload);
        toast.success("School rejected successfully");
      }
      setConfirmAction(null);
      setActionNote("");
      setSelectedSchool(null);
      setDetailModalOpen(false);
      await Promise.all([loadDashboard(), loadPending(), loadHistory()]);
    } catch (error) {
      console.error("Error updating approval status:", error);
      toast.error("Unable to update approval status");
    } finally {
      setActionLoading(false);
    }
  };

  const renderPendingCard = (school) => (
    <Motion.div
      key={school.id}
      layout
      whileHover={{ y: -4, scale: 1.01 }}
      className={`rounded-2xl border transition-all duration-300 cursor-pointer ${
        selectedSchool?.id === school.id
          ? "border-indigo-300 shadow-xl shadow-indigo-200/60"
          : "border-slate-200 shadow-sm"
      } bg-white p-5`}
      onClick={() => {
        setSelectedSchool(school);
        setEditForm({
          name: school.name || "",
          institutionId: school.institutionId || "",
          email: school.email || "",
          phone: school.contactInfo?.phone || "",
          address: school.contactInfo?.address || "",
          city: school.contactInfo?.city || "",
          state: school.contactInfo?.state || "",
          pincode: school.contactInfo?.pincode || "",
          website: school.contactInfo?.website || "",
          board: school.academicInfo?.board || "",
          establishedYear: school.academicInfo?.establishedYear ? String(school.academicInfo.establishedYear) : "",
          totalStudents:
            school.academicInfo?.totalStudents || school.academicInfo?.totalStudents === 0
              ? String(school.academicInfo.totalStudents)
              : "",
          totalTeachers:
            school.academicInfo?.totalTeachers || school.academicInfo?.totalTeachers === 0
              ? String(school.academicInfo.totalTeachers)
              : ""
        });
        setEditing(false);
        setEditDirty(false);
        setDetailModalOpen(true);
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-500 shrink-0" />
            <span className="truncate">{school.name}</span>
          </h3>
          <p className="text-sm text-slate-500 mt-1">{school.institutionId || "—"}</p>
        </div>
        {school.priority && (
          <span className={`shrink-0 px-2.5 py-1 text-xs font-semibold rounded-full ${priorityStyles[school.priority] || "bg-slate-100 text-slate-700 border border-slate-200"}`}>
            {school.priority}
          </span>
        )}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-indigo-500" />
          <span className="truncate">{school.email}</span>
        </div>
        {school.contactInfo?.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-indigo-500" />
            <span>{school.contactInfo.phone}</span>
          </div>
        )}
        {school.contactInfo?.city && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-500" />
            <span>
              {school.contactInfo.city}
              {school.contactInfo.state ? `, ${school.contactInfo.state}` : ""}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-500" />
          <span>{school.submittedAgoHuman || "—"}</span>
        </div>
      </div>
      {(school.tags?.length > 0 || (school.metrics?.readinessScore != null && school.metrics.readinessScore !== undefined)) && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          {school.tags?.map((tag) => (
            <span key={tag} className="px-2.5 py-1 text-xs bg-slate-100 border border-slate-200 text-slate-600 rounded-full">
              {tag}
            </span>
          ))}
          {school.metrics?.readinessScore != null && (
            <span className="px-2.5 py-1 text-xs bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-full">
              Readiness {school.metrics.readinessScore}%
            </span>
          )}
        </div>
      )}
    </Motion.div>
  );

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, ease: "linear", repeat: Infinity }}
          className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full"
        />
      </div>
    );
  }

  const pendingCount = dashboard?.summary?.pending ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-16">
      <header className="w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-xl border border-purple-500/30 px-4 py-12 md:py-14">
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
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">School onboarding</p>
              <h1 className="text-2xl md:text-3xl font-black text-white mt-2 flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 shrink-0" />
                Approval Operations
              </h1>
              <p className="text-sm text-white/85 max-w-2xl mt-1.5 leading-relaxed">
                Review pending schools, approve or reject with notes, and manage subscription renewals.
              </p>
            </div>
          </div>
          <div className="text-right space-y-1 flex-shrink-0 md:pl-4">
            <p className="text-sm font-medium text-white/90">
              Pending: <span className="font-bold text-white">{pendingCount.toLocaleString()}</span> schools
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

      <div className="max-w-7xl mx-auto px-6 -mt-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <Motion.div
                key={card.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{card.title}</span>
                  <div className={`p-2 rounded-lg ${card.iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                {card.subtitle && <p className="text-xs text-slate-500 mt-1.5">{card.subtitle}</p>}
              </Motion.div>
            );
          })}
        </div>

        <div className="mt-12 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-end gap-4 bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm">
              <div className="flex-1 min-w-0">
                <label htmlFor="approvals-search" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Search
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="approvals-search"
                    type="text"
                    placeholder="School, email, city, or institution ID"
                    value={filters.search}
                    onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    aria-label="Search pending schools"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-end gap-4">
                <div>
                  <label htmlFor="approvals-state" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    State
                  </label>
                  <div className="relative flex items-center rounded-xl border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                    <Filter className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      id="approvals-state"
                      type="text"
                      placeholder="Filter by state"
                      value={filters.state}
                      onChange={(event) => setFilters((prev) => ({ ...prev, state: event.target.value }))}
                      className="w-full min-w-[140px] bg-transparent border-0 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                      aria-label="Filter by state"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="approvals-sort" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Sort
                  </label>
                  <select
                    id="approvals-sort"
                    value={filters.sort}
                    onChange={(event) => setFilters((prev) => ({ ...prev, sort: event.target.value }))}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[140px]"
                    aria-label="Sort pending schools"
                  >
                    <option value="oldest">Oldest first</option>
                    <option value="newest">Newest first</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-1 h-6 rounded-full bg-indigo-500" />
                <Users className="w-5 h-5 text-indigo-600" />
                Pending schools ({pendingSchools.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pendingSchools.map(renderPendingCard)}
                {!pendingSchools.length && (
                  <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">No pending schools</h3>
                    <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                      All caught up. New submissions will appear here for review.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Subscription Renewal Requests Section */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-1 h-6 rounded-full bg-emerald-500" />
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    Subscription Renewal Requests ({renewalRequests.length})
                  </h2>
                  <p className="text-sm text-slate-500 mt-1 ml-7">Pending subscription renewal requests from schools</p>
                </div>
                <button
                  onClick={loadRenewalRequests}
                  disabled={renewalLoading}
                  className="px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition disabled:opacity-50"
                >
                  {renewalLoading ? "Loading..." : "Refresh"}
                </button>
              </div>

              {renewalLoading && renewalRequests.length === 0 ? (
                <div className="text-center py-8 text-slate-500">Loading renewal requests...</div>
              ) : renewalRequests.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">No pending renewal requests</h3>
                  <p className="text-sm text-slate-500 mt-2">New renewal requests will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renewalRequests.map((request) => (
                    <Motion.div
                      key={request._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-slate-900">{request.companyId?.name || "Unknown School"}</h3>
                          <p className="text-xs text-slate-500 mt-1">Requested by: {request.requestedByName || request.requestedByEmail}</p>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                          Pending
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Current Plan:</span>
                          <span className="font-semibold text-slate-900">{request.currentPlan?.displayName || request.currentPlan?.name || "Free"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Requested Plan:</span>
                          <span className="font-semibold text-emerald-600">{request.requestedPlan?.displayName || request.requestedPlan?.name || "Premium"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Students:</span>
                          <span className="font-semibold text-slate-900">{request.currentStudents} → {request.requestedStudents}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Teachers:</span>
                          <span className="font-semibold text-slate-900">{request.currentTeachers} → {request.requestedTeachers}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Estimated Amount:</span>
                          <span className="font-semibold text-emerald-600">₹{new Intl.NumberFormat('en-IN').format(request.estimatedAmount || 0)}</span>
                        </div>
                        {request.currentEndDate && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Current Expiry:</span>
                            <span className="font-semibold text-slate-900">
                              {new Date(request.currentEndDate).toLocaleDateString('en-IN')}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-slate-200">
                        <button
                          onClick={() => {
                            setRenewalActionModal({ mode: 'approve', request });
                            setRenewalActionNote("");
                          }}
                          className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setRenewalActionModal({ mode: 'reject', request });
                            setRenewalActionNote("");
                          }}
                          className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition"
                        >
                          Reject
                        </button>
                      </div>
                    </Motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-1 h-6 rounded-full bg-indigo-500" />
                    <HistoryIcon className="w-5 h-5 text-indigo-600" />
                    Recent approval decisions
                  </h2>
                  <p className="text-sm text-slate-500 mt-1 ml-7">Audit trail of approvals and rejections with reviewer notes</p>
                </div>
                <div className="flex items-center gap-2">
                  {[
                    { key: "all", label: "All" },
                    { key: "approved", label: "Approved" },
                    { key: "rejected", label: "Rejected" }
                  ].map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => handleHistoryStatusChange(option.key)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition ${
                        historyFilter.status === option.key
                          ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">School</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Decision</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Reviewer</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Notes</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">When</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.data.length ? (
                      history.data.map((entry) => (
                        <tr key={entry.id} className="hover:bg-slate-50/60">
                          <td className="px-4 py-3 text-sm text-slate-700">
                            <div className="font-semibold text-slate-900">{entry.name}</div>
                            <div className="text-xs text-slate-500">{entry.institutionId || "—"}</div>
                            <div className="text-xs text-slate-500">{entry.email}</div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                statusStyles[entry.decisionOutcome] || "bg-slate-100 text-slate-600 border border-slate-200"
                              }`}
                            >
                              {entry.decisionOutcome?.replace(/_/g, " ") || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            <div className="font-medium text-slate-800">{entry.reviewer?.name || "—"}</div>
                            <div className="text-xs text-slate-500">{entry.reviewer?.email || entry.adminUser?.email || ""}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {entry.reviewNote?.length ? entry.reviewNote : "—"}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-slate-500">
                            {entry.decisionRelativeTime || formatRelativeTime(entry.decisionAt)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <CheckCircle2 className="w-10 h-10 text-slate-300" />
                            <p className="text-sm text-slate-500">No approval history for the selected filters.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {history.meta.pages > 1 && (
                <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                  <span>
                    Page {history.meta.page} of {history.meta.pages}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => history.meta.page > 1 && handleHistoryPageChange(history.meta.page - 1)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                      disabled={history.meta.page === 1}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => history.meta.page < history.meta.pages && handleHistoryPageChange(history.meta.page + 1)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                      disabled={history.meta.page === history.meta.pages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>

        </div>

      </div>

      <AnimatePresence>
        {detailModalOpen && selectedSchool && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] flex items-center justify-center px-4 transition-opacity ${
              confirmAction ? 'opacity-70 pointer-events-none' : ''
            }`}
          >
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="max-w-4xl w-full max-h-[80vh] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col"
            >
              <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-200/60">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    {selectedSchool.name}
                  </h3>
                  <p className="text-sm text-slate-500">{selectedSchool.institutionId || "Institution ID not provided"}</p>
                  {selectedSchool.approvalStatus && (
                    <span
                      className={`inline-flex items-center gap-1 mt-1 px-2 py-1 text-xs font-semibold rounded-full ${
                        statusStyles[selectedSchool.approvalStatus] || "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {selectedSchool.approvalStatus.replace(/_/g, " ")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {!editing && (
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-100"
                      onClick={() => {
                         setEditForm({
                           name: selectedSchool.name || "",
                           institutionId: selectedSchool.institutionId || "",
                           email: selectedSchool.email || "",
                           phone: selectedSchool.contactInfo?.phone || "",
                           address: selectedSchool.contactInfo?.address || "",
                           city: selectedSchool.contactInfo?.city || "",
                           state: selectedSchool.contactInfo?.state || "",
                           pincode: selectedSchool.contactInfo?.pincode || "",
                           website: selectedSchool.contactInfo?.website || "",
                           board: selectedSchool.academicInfo?.board || "",
                           establishedYear: selectedSchool.academicInfo?.establishedYear
                             ? String(selectedSchool.academicInfo.establishedYear)
                             : "",
                           totalStudents:
                             selectedSchool.academicInfo?.totalStudents || selectedSchool.academicInfo?.totalStudents === 0
                               ? String(selectedSchool.academicInfo.totalStudents)
                               : "",
                           totalTeachers:
                             selectedSchool.academicInfo?.totalTeachers || selectedSchool.academicInfo?.totalTeachers === 0
                               ? String(selectedSchool.academicInfo.totalTeachers)
                               : ""
                         });
                         setEditing(true);
                         setEditDirty(false);
                       }}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    type="button"
                    className="text-slate-400 hover:text-slate-600 p-1 rounded"
                    onClick={() => {
                      setDetailModalOpen(false);
                      setSelectedSchool(null);
                      setEditing(false);
                      setEditDirty(false);
                    }}
                    aria-label="Close school detail"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="px-6 pb-6 overflow-y-auto">
                {editing ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Basic details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                          <span className="text-xs uppercase tracking-wide text-slate-500">School Name</span>
                          <input
                            value={editForm.name}
                            onChange={(event) => updateEditField("name", event.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </label>
                        <label className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                          <span className="text-xs uppercase tracking-wide text-slate-500">Institution ID</span>
                          <input
                            value={editForm.institutionId}
                            onChange={(event) => updateEditField("institutionId", event.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </label>
                        <label className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                          <span className="text-xs uppercase tracking-wide text-slate-500">Email</span>
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(event) => updateEditField("email", event.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Contact information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                          <span className="text-xs uppercase tracking-wide text-slate-500">Phone</span>
                          <input
                            value={editForm.phone}
                            onChange={(event) => updateEditField("phone", event.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </label>
                        <label className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                          <span className="text-xs uppercase tracking-wide text-slate-500">Website</span>
                          <input
                            value={editForm.website}
                            onChange={(event) => updateEditField("website", event.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </label>
                        <label className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                          <span className="text-xs uppercase tracking-wide text-slate-500">City</span>
                          <input
                            value={editForm.city}
                            onChange={(event) => updateEditField("city", event.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </label>
                        <label className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                          <span className="text-xs uppercase tracking-wide text-slate-500">State</span>
                          <input
                            value={editForm.state}
                            onChange={(event) => updateEditField("state", event.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </label>
                        <label className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                          <span className="text-xs uppercase tracking-wide text-slate-500">Pincode</span>
                          <input
                            value={editForm.pincode}
                            onChange={(event) => updateEditField("pincode", event.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </label>
                      </div>
                      <label className="block bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                        <span className="text-xs uppercase tracking-wide text-slate-500">Address</span>
                        <textarea
                          rows={3}
                          value={editForm.address}
                          onChange={(event) => updateEditField("address", event.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                        />
                      </label>
                    </div>

                    <div>
                      <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Academic profile</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                          <span className="text-xs uppercase tracking-wide text-slate-500">Board</span>
                          <input
                            value={editForm.board}
                            onChange={(event) => updateEditField("board", event.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </label>
                        <label className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                          <span className="text-xs uppercase tracking-wide text-slate-500">Established year</span>
                          <input
                            value={editForm.establishedYear}
                            onChange={(event) => updateEditField("establishedYear", event.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </label>
                        <label className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                          <span className="text-xs uppercase tracking-wide text-slate-500">Total students</span>
                          <input
                            type="number"
                            min="0"
                            value={editForm.totalStudents}
                            onChange={(event) => updateEditField("totalStudents", event.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </label>
                        <label className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                          <span className="text-xs uppercase tracking-wide text-slate-500">Total teachers</span>
                          <input
                            type="number"
                            min="0"
                            value={editForm.totalTeachers}
                            onChange={(event) => updateEditField("totalTeachers", event.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl text-sm text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition"
                        onClick={() => {
                          if (selectedSchool) {
                            setEditForm({
                              name: selectedSchool.name || "",
                              institutionId: selectedSchool.institutionId || "",
                              email: selectedSchool.email || "",
                              phone: selectedSchool.contactInfo?.phone || "",
                              address: selectedSchool.contactInfo?.address || "",
                              city: selectedSchool.contactInfo?.city || "",
                              state: selectedSchool.contactInfo?.state || "",
                              pincode: selectedSchool.contactInfo?.pincode || "",
                              website: selectedSchool.contactInfo?.website || "",
                              board: selectedSchool.academicInfo?.board || "",
                              establishedYear: selectedSchool.academicInfo?.establishedYear
                                ? String(selectedSchool.academicInfo.establishedYear)
                                : "",
                              totalStudents:
                                selectedSchool.academicInfo?.totalStudents || selectedSchool.academicInfo?.totalStudents === 0
                                  ? String(selectedSchool.academicInfo.totalStudents)
                                  : "",
                              totalTeachers:
                                selectedSchool.academicInfo?.totalTeachers || selectedSchool.academicInfo?.totalTeachers === 0
                                  ? String(selectedSchool.academicInfo.totalTeachers)
                                  : ""
                            });
                          }
                          setEditDirty(false);
                          setEditing(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-500 text-white hover:bg-indigo-600 transition inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={() => handleDetailSave()}
                        disabled={detailSaving}
                      >
                        {detailSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                        Save changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-2">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Contact</p>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-indigo-500" />
                          <span>{selectedSchool.email}</span>
                        </div>
                        {selectedSchool.contactInfo?.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-indigo-500" />
                            <span>{selectedSchool.contactInfo.phone}</span>
                          </div>
                        )}
                        {selectedSchool.contactInfo?.address && (
                          <div className="flex items-start gap-2">
                            <Building2 className="w-4 h-4 text-indigo-500 mt-0.5" />
                            <span>{selectedSchool.contactInfo.address}</span>
                          </div>
                        )}
                        {(selectedSchool.contactInfo?.city || selectedSchool.contactInfo?.state) && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-indigo-500" />
                            <span>
                              {[selectedSchool.contactInfo.city, selectedSchool.contactInfo.state]
                                .filter(Boolean)
                                .join(", ") || "—"}
                            </span>
                          </div>
                        )}
                        {selectedSchool.contactInfo?.pincode && (
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="font-semibold text-slate-700">Pincode:</span>
                            <span>{selectedSchool.contactInfo.pincode}</span>
                          </div>
                        )}
                        {selectedSchool.contactInfo?.website && (
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-indigo-500" />
                            <a
                              href={selectedSchool.contactInfo.website.startsWith("http")
                                ? selectedSchool.contactInfo.website
                                : `https://${selectedSchool.contactInfo.website}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-600 underline-offset-2 hover:underline"
                            >
                              {selectedSchool.contactInfo.website}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-2">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Academic profile</p>
                        <div className="flex items-center justify-between text-xs">
                          <span>Total Students</span>
                          <span>{formatNumber(selectedSchool.academicInfo?.totalStudents || 0)}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Total Teachers</span>
                          <span>{formatNumber(selectedSchool.academicInfo?.totalTeachers || 0)}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Board</span>
                          <span>{selectedSchool.academicInfo?.board?.toUpperCase() || "—"}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Established</span>
                          <span>{selectedSchool.academicInfo?.establishedYear || "—"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-3">
                        <HistoryIcon className="w-4 h-4 text-indigo-500" />
                        Review timeline
                      </h4>
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                        {(selectedSchool.reviewHistory || []).length ? (
                          selectedSchool.reviewHistory
                            .slice()
                            .reverse()
                            .map((entry) => (
                              <div key={entry.id || entry.createdAt} className="text-xs text-slate-600 bg-white border border-slate-200 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-slate-900 capitalize">{entry.action}</span>
                                  <span className="text-slate-500">{entry.relativeTime}</span>
                                </div>
                                {entry.note && <p className="mt-1 text-slate-600">{entry.note}</p>}
                                {entry.reviewer && (
                                  <p className="mt-1 text-slate-500">
                                    {entry.reviewer.name || entry.reviewer.email || "System"}
                                  </p>
                                )}
                              </div>
                            ))
                        ) : (
                          <p className="text-xs text-slate-500">No review events recorded yet.</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-700">
                      <div className="flex items-center justify-between">
                        <span>Readiness score</span>
                        <span className="font-semibold text-indigo-600">{selectedSchool.metrics?.readinessScore || 0}%</span>
                      </div>
                      <div className="h-2 mt-2 bg-slate-100 rounded-full overflow-hidden">
                        <Motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedSchool.metrics?.readinessScore || 0}%` }}
                          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        High readiness schools have well-documented contact and academic profiles, enabling faster onboarding.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={() => handleInitiateAction("approve")}
                        disabled={detailSaving || actionLoading}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Approve school
                      </button>
                      <button
                        type="button"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={() => handleInitiateAction("reject")}
                        disabled={detailSaving || actionLoading}
                      >
                        <XCircle className="w-5 h-5" />
                        Reject school
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmAction && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2300] flex items-center justify-center px-4"
          >
            <Motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-start gap-3">
                {confirmAction.mode === "approve" ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-rose-500" />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {confirmAction.mode === "approve" ? "Approve school onboarding" : "Reject school onboarding"}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {confirmAction.mode === "approve"
                      ? "Confirm that you’ve reviewed all documents and readiness criteria for this school."
                      : "Provide a clear reason so the onboarding team can guide the school on next steps."}
                  </p>
                </div>
              </div>
              <div className="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <div className="font-semibold text-slate-900">{confirmAction.school.name}</div>
                <div className="text-xs text-slate-500">{confirmAction.school.email}</div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-slate-500 mb-2 block">Reviewer note</label>
                <textarea
                  value={actionNote}
                  onChange={(event) => setActionNote(event.target.value)}
                  rows={4}
                  placeholder={confirmAction.mode === "approve" ? "Optional note for audit trail" : "Provide rejection reason"}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-sm text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition"
                  onClick={() => setConfirmAction(null)}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApproveReject}
                  disabled={actionLoading || (!actionNote.trim() && confirmAction.mode === "reject")}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2 transition ${
                    confirmAction.mode === "approve"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                      : "bg-gradient-to-r from-rose-500 to-red-500 text-white"
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {confirmAction.mode === "approve" ? "Confirm approval" : "Reject school"}
                </button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Renewal Action Modal */}
      <AnimatePresence>
        {renewalActionModal && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2300] flex items-center justify-center px-4"
            onClick={() => setRenewalActionModal(null)}
          >
            <Motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3">
                {renewalActionModal.mode === "approve" ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-rose-500" />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {renewalActionModal.mode === "approve" ? "Approve Subscription Renewal" : "Reject Subscription Renewal"}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {renewalActionModal.mode === "approve"
                      ? "This will activate the subscription with the requested plan and headcount."
                      : "Provide a reason for rejection so the school can understand and resubmit if needed."}
                  </p>
                </div>
              </div>
              {renewalActionModal.request && (
                <div className="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                  <div className="font-semibold text-slate-900 mb-2">{renewalActionModal.request.companyId?.name || "Unknown School"}</div>
                  <div className="space-y-1 text-xs">
                    <div>Plan: {renewalActionModal.request.currentPlan?.displayName} → {renewalActionModal.request.requestedPlan?.displayName}</div>
                    <div>Students: {renewalActionModal.request.currentStudents} → {renewalActionModal.request.requestedStudents}</div>
                    <div>Teachers: {renewalActionModal.request.currentTeachers} → {renewalActionModal.request.requestedTeachers}</div>
                    <div>Amount: ₹{new Intl.NumberFormat('en-IN').format(renewalActionModal.request.estimatedAmount || 0)}</div>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {renewalActionModal.mode === "approve" ? "Admin Notes (optional)" : "Rejection Reason *"}
                </label>
                <textarea
                  value={renewalActionNote}
                  onChange={(e) => setRenewalActionNote(e.target.value)}
                  placeholder={renewalActionModal.mode === "approve" ? "Add any notes about this approval..." : "Explain why this renewal is being rejected..."}
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                  required={renewalActionModal.mode === "reject"}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRenewalActionModal(null);
                    setRenewalActionNote("");
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRenewalAction}
                  disabled={actionLoading || (renewalActionModal.mode === "reject" && !renewalActionNote.trim())}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition disabled:opacity-60 disabled:cursor-not-allowed ${
                    renewalActionModal.mode === "approve"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  {actionLoading ? "Processing..." : renewalActionModal.mode === "approve" ? "Approve Renewal" : "Reject Renewal"}
                </button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSchoolApprovals;

