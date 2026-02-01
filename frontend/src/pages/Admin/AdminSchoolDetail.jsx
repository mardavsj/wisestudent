import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Mail,
  Globe,
  GraduationCap,
  Layers,
  ShieldCheck,
  Edit3,
  Save,
  X,
  Sparkles,
  BarChart2,
} from "lucide-react";
import {
  fetchAdminSchoolDetail,
  updateAdminSchool,
} from "../../services/adminSchoolsService";
import { useSocket } from "../../context/SocketContext";

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

const formatAbsoluteDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const formatAbsoluteDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(date);
};

const buildFormState = (detail) => ({
  name: detail?.name || "",
  email: detail?.email || "",
  approvalStatus: detail?.approvalStatus || "pending",
  approvalNotes: detail?.approvalNotes || "",
  rejectionReason: detail?.rejectionReason || "",
  note: "",
  contactInfo: {
    phone: detail?.contactInfo?.phone || "",
    address: detail?.contactInfo?.address || "",
    city: detail?.contactInfo?.city || "",
    state: detail?.contactInfo?.state || "",
    pincode: detail?.contactInfo?.pincode || "",
    website: detail?.contactInfo?.website || "",
  },
  academicInfo: {
    board: detail?.academicInfo?.board || "",
    establishedYear: detail?.academicInfo?.establishedYear || "",
    totalStudents:
      detail?.metrics?.studentCount ?? detail?.academicInfo?.totalStudents ?? "",
    totalTeachers:
      detail?.metrics?.teacherCount ?? detail?.academicInfo?.totalTeachers ?? "",
  },
});

const chipAccents = {
  indigo: "bg-indigo-100 text-indigo-600",
  emerald: "bg-emerald-100 text-emerald-600",
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
};

const MetricsChip = ({ icon, label, value, accent = "indigo" }) => {
  const IconComponent = icon;
  const accentClass = chipAccents[accent] || chipAccents.indigo;
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className={`p-2 rounded-lg ${accentClass}`}>
        <IconComponent className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="text-base font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
};

const AdminSchoolDetail = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [detail, setDetail] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [formState, setFormState] = useState(null);

  const loadDetail = useCallback(
    async (silent = false) => {
      if (!schoolId) return;
      if (!silent) setLoading(true);
      try {
        const response = await fetchAdminSchoolDetail(schoolId);
        const record = response.data || null;
        setDetail(record);
        setAnalytics(response.analytics || null);
        setFormState(buildFormState(record));
        setEditMode(false);
      } catch (error) {
        console.error("Error loading school detail:", error);
        toast.error(error.response?.data?.message || "Unable to load school information");
        if (!silent) navigate("/admin/schools");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [schoolId, navigate]
  );

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  useEffect(() => {
    if (!socket?.socket || !schoolId) return;
    const handleRealtimeUpdate = (payload) => {
      // Check if this update is for the current school
      const updateId = payload?.id || payload?.data?.id || payload?.data?._id;
      if (updateId && (updateId.toString() === schoolId.toString() || updateId === schoolId)) {
        // Reload detail to get fresh data
        loadDetail(true);
      }
    };
    socket.socket.on("admin:schools:update", handleRealtimeUpdate);
    socket.socket.on("admin:school-approval:update", handleRealtimeUpdate);
    return () => {
      socket.socket.off("admin:schools:update", handleRealtimeUpdate);
      socket.socket.off("admin:school-approval:update", handleRealtimeUpdate);
    };
  }, [socket, schoolId, loadDetail]);

  const handleFormFieldChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedFieldChange = (scope, field, value) => {
    setFormState((prev) => ({
      ...prev,
      [scope]: { ...(prev?.[scope] || {}), [field]: value },
    }));
  };

  const handleSave = async () => {
    if (!schoolId || !formState) return;
    setSaving(true);
    try {
      const payload = {
        name: formState.name?.trim?.() || "",
        email: formState.email?.trim?.() || "",
        contactInfo: { ...(formState.contactInfo || {}) },
        academicInfo: {
          ...(formState.academicInfo || {}),
          totalStudents:
            formState.academicInfo?.totalStudents === "" || formState.academicInfo?.totalStudents === null
              ? null
              : Number(formState.academicInfo?.totalStudents),
          totalTeachers:
            formState.academicInfo?.totalTeachers === "" || formState.academicInfo?.totalTeachers === null
              ? null
              : Number(formState.academicInfo?.totalTeachers),
        },
        approvalStatus: formState.approvalStatus,
        approvalNotes: formState.approvalNotes,
        rejectionReason:
          formState.approvalStatus === "rejected" ? formState.rejectionReason : undefined,
        note: formState.note,
      };
      const response = await updateAdminSchool(schoolId, payload);
      const updated = response.data || null;
      
      // Update state with fresh data from server
      if (updated) {
      setDetail(updated);
      setFormState(buildFormState(updated));
        if (response.analytics) {
          setAnalytics(response.analytics);
        }
      }
      
      setEditMode(false);
      toast.success("School record updated");
      
      // Reload detail to ensure we have the latest data including metrics
      await loadDetail(true);
    } catch (error) {
      console.error("Error updating school:", error);
      toast.error(error.response?.data?.message || "Unable to update school");
    } finally {
      setSaving(false);
    }
  };

  const statusSummary = useMemo(() => ({
    students: formatNumber(detail?.academicInfo?.totalStudents ?? detail?.metrics?.studentCount ?? 0),
    teachers: formatNumber(detail?.academicInfo?.totalTeachers ?? detail?.metrics?.teacherCount ?? 0),
    classes: formatNumber(detail?.metrics?.classCount ?? 0),
    campuses: formatNumber(detail?.metrics?.campusCount ?? 0),
  }), [detail]);

  const planDetails = useMemo(() => {
    const subscriptionPlan = detail?.subscription?.plan || {};
    
    // Compute actual status based on endDate first
    const expiresAt = detail?.subscription?.endDate || detail?.subscriptionExpiry || null;
    let status = detail?.subscription?.status ||
      (detail?.subscriptionPlan === "educational_institutions_premium" ? "active" : null);
    
    // If status is active/pending but endDate has passed, mark as expired
    if (expiresAt && (status === 'active' || status === 'pending')) {
      const endDate = new Date(expiresAt);
      const now = new Date();
      if (endDate <= now) {
        status = 'expired';
      }
    }
    
    // Determine plan name based on status
    let planName;
    
    // If plan is expired, show "Free Plan"
    if (status === 'expired') {
      planName = "Free Plan";
    } else if (status === 'active' || status === 'pending') {
      // If plan is active/renewed, show the premium plan name
      planName = subscriptionPlan.displayName || subscriptionPlan.name;
      
      // If subscription plan is "free" or missing but status is active and there's an endDate,
      // it means the subscription should be using the Company's subscriptionPlan
      if ((planName === 'free' || !planName) && expiresAt) {
        // Use Company's subscriptionPlan as fallback
        if (detail?.subscriptionPlan === "educational_institutions_premium") {
          planName = "Educational Institutions Premium Plan";
        } else if (detail?.subscriptionPlan) {
          // Map other plan types if needed
          const planMap = {
            'educational_institutions_premium': 'Educational Institutions Premium Plan',
            'student_premium': 'Student Premium Plan',
            'student_parent_premium_pro': 'Student + Parent Premium Pro Plan',
          };
          planName = planMap[detail.subscriptionPlan] || detail.subscriptionPlan;
        }
      }
      
      // Final fallback for active plans
      if (!planName || planName === 'free') {
        planName = detail?.subscriptionPlan === "educational_institutions_premium"
          ? "Educational Institutions Premium Plan"
          : detail?.subscriptionPlan || "Educational Institutions Premium Plan";
      }
    } else {
      // For other statuses (cancelled, etc.), show Free Plan
      planName = "Free Plan";
    }
    
    // Use current cycle start date (renewal date) instead of original activation date
    const activatedAt = detail?.subscription?.currentCycleStartDate || 
                        detail?.subscription?.lastRenewedAt ||
                        detail?.subscription?.startDate || 
                        detail?.subscriptionStart || null;

    return {
      planName,
      activatedAt,
      expiresAt,
      status,
    };
  }, [detail]);

  const planStatusDisplay = useMemo(() => {
    const status = planDetails.status;
    if (!status) {
      return {
        label: "Not Active",
        badgeClass: "bg-slate-100 text-slate-600 border border-slate-200",
      };
    }
    const label = status
      .split("_")
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" ");
    if (status === "active") {
      return {
        label,
        badgeClass: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      };
    }
    if (status === "pending") {
      return {
        label,
        badgeClass: "bg-amber-100 text-amber-700 border border-amber-200",
      };
    }
    return {
      label,
      badgeClass: "bg-rose-100 text-rose-700 border border-rose-200",
    };
  }, [planDetails.status]);

  const PlanStatusIcon = planDetails.status === "active" ? CheckCircle2 : planDetails.status === "pending" ? Clock : X;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/40 via-slate-50 to-purple-50/30 pb-12">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600/95 via-purple-600/95 to-pink-600/90 text-white border-b border-indigo-200/20 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate("/admin/schools")}
                className="p-2.5 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors"
                aria-label="Back to schools"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {detail?.name || "School detail"}
                </h1>
                <p className="text-sm text-white/85 mt-0.5">
                  {detail?.institutionId || "—"} · Updated {formatRelativeTime(detail?.updatedAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {detail?.approvalStatus && (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ${
                    statusTokens[detail.approvalStatus]?.className || "bg-white/20 text-white"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  {statusTokens[detail.approvalStatus]?.label || detail.approvalStatus}
                </span>
              )}
              <button
                type="button"
                onClick={() => setEditMode((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium bg-white/20 text-white hover:bg-white/30 border border-white/30"
              >
                {editMode ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                {editMode ? "Cancel" : "Edit"}
              </button>
              {editMode && (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-indigo-600 bg-white hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? <Clock className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving..." : "Save"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8">
            <div className="animate-pulse h-64 bg-slate-100 rounded-lg" />
          </div>
        ) : !detail ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <Sparkles className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-lg font-semibold text-slate-900 mt-4">School not found</h2>
            <p className="text-sm text-slate-500 mt-1">This record could not be loaded.</p>
            <button
              type="button"
              onClick={() => navigate("/admin/schools")}
              className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Back to schools
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <section className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-transparent">
                <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full bg-indigo-500" />
                  Profile & contact
                </h2>
              </div>
              <div className="px-6 py-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">School Name</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formState?.name || ""}
                            onChange={(event) => handleFormFieldChange("name", event.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        ) : (
                          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2">
                            <Building2 className="w-5 h-5 text-indigo-600" />
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              {detail?.name || "—"}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Primary Email</label>
                        {editMode ? (
                          <input
                            type="email"
                            value={formState?.email || ""}
                            onChange={(event) => handleFormFieldChange("email", event.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        ) : (
                          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2">
                            <Mail className="w-5 h-5 text-indigo-600" />
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              {detail?.email || "—"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone Number</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formState?.contactInfo?.phone || ""}
                            onChange={(event) => handleNestedFieldChange("contactInfo", "phone", event.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        ) : (
                          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2">
                            <Phone className="w-5 h-5 text-indigo-600" />
                            <p className="text-sm font-semibold text-slate-800">
                              {detail?.contactInfo?.phone || "—"}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Website</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formState?.contactInfo?.website || ""}
                            onChange={(event) => handleNestedFieldChange("contactInfo", "website", event.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        ) : (
                          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2">
                            <Globe className="w-5 h-5 text-indigo-600" />
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              {detail?.contactInfo?.website || "—"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Address</label>
                      {editMode ? (
                        <textarea
                          rows={3}
                          value={formState?.contactInfo?.address || ""}
                          onChange={(event) => handleNestedFieldChange("contactInfo", "address", event.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                          {detail?.contactInfo?.address || "No street address recorded"}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { field: "city", label: "City" },
                        { field: "state", label: "State" },
                        { field: "pincode", label: "Pincode" },
                      ].map(({ field, label }) => (
                        <div key={field} className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
                          {editMode ? (
                            <input
                              type="text"
                              value={formState?.contactInfo?.[field] || ""}
                              onChange={(event) => handleNestedFieldChange("contactInfo", field, event.target.value)}
                              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          ) : (
                            <p className="text-sm font-semibold text-slate-700">
                              {detail?.contactInfo?.[field] || "—"}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/80 to-transparent">
                    <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <span className="w-1 h-5 rounded-full bg-blue-500" />
                      Academic & capacity
                    </h2>
                  </div>
                  <div className="px-6 py-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Board</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formState?.academicInfo?.board || ""}
                            onChange={(event) => handleNestedFieldChange("academicInfo", "board", event.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        ) : (
                          <p className="text-sm font-semibold text-slate-700">
                            {detail?.academicInfo?.board || "—"}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Established Year</label>
                        {editMode ? (
                          <input
                            type="number"
                            value={formState?.academicInfo?.establishedYear || ""}
                            onChange={(event) => handleNestedFieldChange("academicInfo", "establishedYear", event.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        ) : (
                          <p className="text-sm font-semibold text-slate-700">
                            {detail?.academicInfo?.establishedYear || "—"}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Students</label>
                        {editMode ? (
                          <input
                            type="number"
                            value={formState?.academicInfo?.totalStudents ?? ""}
                            onChange={(event) => handleNestedFieldChange("academicInfo", "totalStudents", event.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        ) : (
                          <p className="text-sm font-semibold text-slate-700">
                            {formatNumber(detail?.academicInfo?.totalStudents ?? detail?.metrics?.studentCount ?? 0)}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Teachers</label>
                        {editMode ? (
                          <input
                            type="number"
                            value={formState?.academicInfo?.totalTeachers ?? ""}
                            onChange={(event) => handleNestedFieldChange("academicInfo", "totalTeachers", event.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        ) : (
                          <p className="text-sm font-semibold text-slate-700">
                            {formatNumber(detail?.academicInfo?.totalTeachers ?? detail?.metrics?.teacherCount ?? 0)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <MetricsChip icon={Users} label="Students" value={statusSummary.students} accent="emerald" />
                      <MetricsChip icon={UserCircle} label="Teachers" value={statusSummary.teachers} accent="blue" />
                      <MetricsChip icon={Layers} label="Classes" value={statusSummary.classes} accent="purple" />
                    </div>
                  </div>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-purple-100 bg-gradient-to-r from-purple-50/80 to-transparent">
                    <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <span className="w-1 h-5 rounded-full bg-purple-500" />
                      Review notes
                    </h2>
                  </div>
                  <div className="px-6 py-5 space-y-4">
                    {editMode && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Add Internal Note</label>
                        <textarea
                          rows={3}
                          value={formState?.note || ""}
                          onChange={(event) => handleFormFieldChange("note", event.target.value)}
                          placeholder="Capture a note for the decision timeline"
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    )}
                    <div className="space-y-3">
                      {(detail?.reviewHistory || []).length === 0 ? (
                        <p className="text-sm text-slate-500">No review activity captured yet.</p>
                      ) : (
                        detail.reviewHistory
                          .slice()
                          .reverse()
                          .map((entry) => (
                            <div key={entry.id} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                                <span className="inline-flex items-center gap-1">
                                  {entry.action === "approved" && (
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                  )}
                                  {entry.action === "rejected" && (
                                    <X className="w-3 h-3 text-rose-500" />
                                  )}
                                  {entry.action === "commented" && (
                                    <Sparkles className="w-3 h-3 text-amber-500" />
                                  )}
                                  {entry.action.toUpperCase()}
                                </span>
                                <span>{formatRelativeTime(entry.createdAt)}</span>
                              </div>
                              <p className="text-sm font-semibold text-slate-700 mt-1">
                                {entry.note || "No note recorded"}
                              </p>
                              {entry.reviewer?.name && (
                                <p className="text-xs text-slate-400 mt-1">
                                  {entry.reviewer.name} • {entry.reviewer.email}
                                </p>
                              )}
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </section>

              <section className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-teal-100 bg-gradient-to-r from-teal-50/80 to-transparent">
                  <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-1 h-5 rounded-full bg-teal-500" />
                    Status & workflow
                  </h2>
                </div>
                <div className="px-6 py-5 space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mr-4 ">Approval Status</label>
                      {editMode ? (
                        <select
                          value={formState?.approvalStatus || "pending"}
                          onChange={(event) => handleFormFieldChange("approvalStatus", event.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="approved">Approved</option>
                          <option value="pending">Pending</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                            statusTokens[detail.approvalStatus]?.className || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4" />
                          {statusTokens[detail.approvalStatus]?.label || detail.approvalStatus}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Approval Notes</label>
                      {editMode ? (
                        <textarea
                          rows={3}
                          value={formState?.approvalNotes || ""}
                          onChange={(event) => handleFormFieldChange("approvalNotes", event.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        <p className="text-sm text-slate-600">
                          {detail?.approvalNotes || "No approval notes set"}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Subscription</label>
                      <div className="rounded-lg border border-teal-200 bg-teal-50/50 px-4 py-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-medium text-slate-900">{planDetails.planName}</p>
                          <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${planStatusDisplay.badgeClass}`}>
                            <PlanStatusIcon className="w-3.5 h-3.5" />
                            {planStatusDisplay.label}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                          <span>Activated: {formatAbsoluteDate(planDetails.activatedAt)}</span>
                          <span>Expires: {formatAbsoluteDate(planDetails.expiresAt)}</span>
                        </div>
                      </div>
                    </div>
                    {formState?.approvalStatus === "rejected" && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Rejection Reason</label>
                        {editMode ? (
                          <textarea
                            rows={3}
                            value={formState?.rejectionReason || ""}
                            onChange={(event) => handleFormFieldChange("rejectionReason", event.target.value)}
                            className="w-full border border-rose-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400"
                          />
                        ) : (
                          <p className="text-sm text-rose-600">
                            {detail?.rejectionReason || "No rejection reason captured"}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </section>

              <section className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-100 to-transparent">
                  <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-1 h-5 rounded-full bg-slate-500" />
                    Analytics
                  </h2>
                </div>
                <div className="px-6 py-5 space-y-4">
                    <MetricsChip
                      icon={BarChart2}
                      label="Active Teachers (7d)"
                      value={formatNumber(analytics?.activeTeachers7d)}
                      accent="blue"
                    />
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Admissions (last 30 days)
                      </p>
                      {analytics?.admissionsLast30?.length ? (
                        <div className="space-y-2">
                          {analytics.admissionsLast30.map((entry) => (
                            <div
                              key={`${entry.grade}-${entry.count}`}
                              className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
                            >
                              <span className="font-semibold text-slate-700">Grade {entry.grade}</span>
                              <span className="text-slate-500 font-medium">{formatNumber(entry.count)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">No recent admission activity recorded.</p>
                      )}
                    </div>
                  </div>
                </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSchoolDetail;
