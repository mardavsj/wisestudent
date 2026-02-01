import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  Users,
  School,
  TrendingUp,
  BarChart3,
  Database,
  ChevronDown,
  ChevronUp,
  Award,
  CheckSquare,
  Square,
} from "lucide-react";
import toast from "react-hot-toast";
import programAdminService, {
  getProgramStudents,
  markCertificateInProgress,
  markCertificatesInProgressBulk,
  markCertificateDelivered,
  markCertificatesDeliveredBulk,
} from "../../services/admin/programAdminService";

const formatNumber = (num) => {
  if (num === undefined || num === null) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
};

/**
 * Kits: only "in progress". Mark delivered is automatic when Super Admin marks certificate delivered.
 */
const KitsDispatchedRow = ({ kitsInProgress = 0 }) => {
  return (
    <div className="p-3 rounded-xl bg-slate-50 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-slate-600">Kits in progress</span>
        <span className="font-bold text-amber-700">{formatNumber(kitsInProgress)}</span>
      </div>
      <p className="text-xs text-slate-500 mt-0.5">
        Auto-added when you mark certificate delivered (1 cert = 1 kit). Mark delivered is automatic when you mark all certificates delivered below.
      </p>
    </div>
  );
};

const AdminProgramMetrics = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [program, setProgram] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [showRawData, setShowRawData] = useState(false);
  const [programStudents, setProgramStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [markingUserId, setMarkingUserId] = useState(null);
  const [markingBulk, setMarkingBulk] = useState(false);
  const [markingInProgressUserId, setMarkingInProgressUserId] = useState(null);
  const [markingInProgressBulk, setMarkingInProgressBulk] = useState(false);
  const [certificateListView, setCertificateListView] = useState("all"); // 'all' | 'in_progress' | 'delivered'

  const fetchProgram = async () => {
    try {
      const res = await programAdminService.getProgram(programId);
      setProgram(res?.data);
    } catch (err) {
      console.error("Failed to fetch program:", err);
      toast.error("Failed to load program");
    }
  };

  const fetchMetrics = async () => {
    if (!refreshing) setLoading(true);
    try {
      const res = await programAdminService.getMetrics(programId);
      setMetrics(res?.data);
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
      toast.error("Failed to load metrics");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await programAdminService.refreshMetrics(programId);
      toast.success("Metrics refreshed");
      await fetchMetrics();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to refresh metrics");
    } finally {
      setRefreshing(false);
    }
  };

  const fetchProgramStudents = async () => {
    if (!programId) return;
    setLoadingStudents(true);
    try {
      const res = await getProgramStudents(programId);
      const list = Array.isArray(res?.data) ? res.data : [];
      setProgramStudents(list);
    } catch (err) {
      console.error("Failed to fetch program students:", err);
      toast.error("Failed to load program students");
      setProgramStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleMarkCertificateInProgress = async (userId) => {
    if (!programId || !userId) return;
    setMarkingInProgressUserId(userId);
    try {
      await markCertificateInProgress(programId, userId);
      toast.success("Certificate marked as in progress");
      await fetchProgramStudents();
      await fetchMetrics();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to mark in progress");
    } finally {
      setMarkingInProgressUserId(null);
    }
  };

  const handleMarkCertificatesInProgressBulk = async () => {
    if (selectedStudentIds.length > 0 && programId) {
      setMarkingInProgressBulk(true);
      try {
        await markCertificatesInProgressBulk(programId, selectedStudentIds);
        toast.success(`Certificates marked as in progress for ${selectedStudentIds.length} student(s)`);
        setSelectedStudentIds([]);
        await fetchProgramStudents();
        await fetchMetrics();
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to mark in progress");
      } finally {
        setMarkingInProgressBulk(false);
      }
    }
    setCertificateListView("in_progress");
  };

  const handleMarkCertificateDelivered = async (userId) => {
    if (!programId || !userId) return;
    setMarkingUserId(userId);
    try {
      await markCertificateDelivered(programId, userId);
      toast.success("Certificate marked as delivered");
      await fetchProgramStudents();
      await fetchMetrics();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to mark delivered");
    } finally {
      setMarkingUserId(null);
    }
  };

  const handleMarkCertificatesDeliveredBulk = async () => {
    if (selectedStudentIds.length > 0 && programId) {
      setMarkingBulk(true);
      try {
        await markCertificatesDeliveredBulk(programId, selectedStudentIds);
        toast.success(`Certificates marked as delivered for ${selectedStudentIds.length} student(s)`);
        setSelectedStudentIds([]);
        await fetchProgramStudents();
        await fetchMetrics();
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to mark delivered");
      } finally {
        setMarkingBulk(false);
      }
    }
    setCertificateListView("delivered");
  };

  const filteredProgramStudents =
    certificateListView === "in_progress"
      ? programStudents.filter((s) => (s.certificatesInProgress ?? 0) > 0)
      : certificateListView === "delivered"
        ? programStudents.filter((s) => (s.certificatesDelivered ?? 0) > 0)
        : programStudents;

  const toggleStudentSelection = (userId) => {
    setSelectedStudentIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };
  const toggleSelectAll = () => {
    const listToUse = filteredProgramStudents;
    const ids = listToUse.map((s) => s.userId).filter(Boolean);
    const allSelected = ids.length > 0 && ids.every((id) => selectedStudentIds.includes(id));
    setSelectedStudentIds(allSelected ? [] : ids);
  };

  useEffect(() => {
    if (programId) {
      fetchProgram();
      fetchMetrics();
      fetchProgramStudents();
    }
  }, [programId]);

  if (loading && !metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading metrics...</span>
        </div>
      </div>
    );
  }

  const data = metrics?.data || metrics;
  const studentReach = data?.studentReach || {};
  const engagement = data?.engagement || {};
  const recognition = data?.recognition || {};
  const schoolStats = data?.schoolStats || { totalSchools: 0, totalStudents: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Hero — match other program pages */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/admin/programs/${programId}`)}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
              aria-label="Back to program"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="w-7 h-7" />
                Metrics Dashboard
              </h1>
              <p className="text-sm text-white/90 mt-0.5">{program?.name || "Program"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRawData((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl bg-white/20 hover:bg-white/30 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
            >
              <Database className="w-4 h-4" />
              {showRawData ? "Hide raw data" : "View raw data"}
              {showRawData ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl bg-white text-indigo-600 px-4 py-2.5 text-sm font-bold hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh Metrics"}
            </button>
            <p className="text-sm text-white/80 hidden sm:block ml-2 pl-4 border-l border-white/30">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-4 space-y-6">
        {data?.lastComputedAt && (
          <p className="text-xs text-slate-500">
            Last computed: {new Date(data.lastComputedAt).toLocaleString("en-IN")}
            {data.computedBy === "manual" && " (manual refresh)"}
          </p>
        )}

        <section className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Student Reach
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400">Total Onboarded</p>
              <p className="text-xl font-bold text-slate-900">
                {formatNumber(studentReach.totalOnboarded ?? schoolStats.totalStudents)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400">Active Students</p>
              <p className="text-xl font-bold text-slate-900">
                {formatNumber(studentReach.activeStudents)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400">Active %</p>
              <p className="text-xl font-bold text-slate-900">
                {studentReach.activePercentage != null ? `${studentReach.activePercentage}%` : "-"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400">Completion Rate</p>
              <p className="text-xl font-bold text-slate-900">
                {studentReach.completionRate != null ? `${studentReach.completionRate}%` : "-"}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            Engagement
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400">Avg Sessions / Student</p>
              <p className="text-xl font-bold text-slate-900">
                {formatNumber(engagement.averageSessionsPerStudent) || "-"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400">Participation Rate</p>
              <p className="text-xl font-bold text-slate-900">
                {engagement.participationRate != null ? `${engagement.participationRate}%` : "-"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400">Trend</p>
              <p className="text-lg font-semibold text-slate-900 capitalize">
                {engagement.engagementTrend || "-"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
              <p className="text-xs text-slate-400">Auto Insight</p>
              <p className="text-sm text-slate-700 line-clamp-2">
                {engagement.autoInsight || "-"}
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 sm:grid-cols-2">
          <section className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <School className="w-6 h-6 text-teal-600" />
              Schools
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                <span className="text-slate-600">Schools in program</span>
                <span className="font-bold text-slate-900">
                  {formatNumber(schoolStats.totalSchools)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                <span className="text-slate-600">Students covered</span>
                <span className="font-bold text-slate-900">
                  {formatNumber(schoolStats.totalStudents)}
                </span>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-amber-600" />
              Recognition
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                <span className="text-slate-600">Certificates issued</span>
                <span className="font-bold text-slate-900">
                  {formatNumber(recognition.certificatesIssued)}
                </span>
              </div>
              <p className="text-xs text-slate-500 px-1">
                Only increases when you mark delivery below (per student or bulk). Linked to kits: 1 certificate = 1 kit in progress.
              </p>
              <KitsDispatchedRow
                kitsInProgress={recognition.recognitionKitsInProgress ?? 0}
              />
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                <span className="text-slate-600">Completion-based %</span>
                <span className="font-bold text-slate-900">
                  {recognition.completionBasedRecognition != null
                    ? `${recognition.completionBasedRecognition}%`
                    : "-"}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Certificate delivered – students list (Super Admin) */}
        <section className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-600" />
            Certificate delivered
          </h2>
        <p className="text-sm text-slate-500 mb-4">
          Mark as in progress (reflects on CSR and Admin Recognition). Mark as delivered when confirmed—reflects as delivered on both pages.
        </p>
          {loadingStudents ? (
            <div className="flex items-center gap-2 text-slate-500 py-4">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Loading students...</span>
            </div>
          ) : programStudents.length === 0 ? (
            <p className="text-slate-500 py-4">No students in program schools yet.</p>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-100 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  {filteredProgramStudents.length > 0 &&
                  filteredProgramStudents.every((s) => selectedStudentIds.includes(s.userId)) ? (
                    <CheckSquare className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                  {filteredProgramStudents.length > 0 &&
                  filteredProgramStudents.every((s) => selectedStudentIds.includes(s.userId))
                    ? "Deselect all"
                    : "Select all"}
                </button>
                <button
                  type="button"
                  onClick={() => setCertificateListView("all")}
                  className={`inline-flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-medium ${
                    certificateListView === "all"
                      ? "border-indigo-300 bg-indigo-100 text-indigo-800"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={handleMarkCertificatesInProgressBulk}
                  disabled={markingInProgressBulk}
                  className={`inline-flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-medium ${
                    certificateListView === "in_progress"
                      ? "border-amber-300 bg-amber-100 text-amber-800"
                      : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {markingInProgressBulk ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                  In Progress
                  {certificateListView === "in_progress" && (
                    <span className="ml-1 text-xs">({filteredProgramStudents.length})</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleMarkCertificatesDeliveredBulk}
                  disabled={markingBulk}
                  className={`inline-flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-medium ${
                    certificateListView === "delivered"
                      ? "border-emerald-300 bg-emerald-100 text-emerald-800"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {markingBulk ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
                  Delivered
                  {certificateListView === "delivered" && (
                    <span className="ml-1 text-xs">({filteredProgramStudents.length})</span>
                  )}
                </button>
              </div>
              <div className="overflow-x-auto rounded-xl border-2 border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left p-3 w-10" scope="col"></th>
                      <th className="text-left p-3 font-medium text-slate-700" scope="col">Name</th>
                      <th className="text-left p-3 font-medium text-slate-700" scope="col">School</th>
                      <th className="text-left p-3 font-medium text-amber-700" scope="col">Certificates in progress</th>
                      <th className="text-left p-3 font-medium text-emerald-700" scope="col">Certificates delivered</th>
                      <th className="text-left p-3 font-medium text-slate-700" scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProgramStudents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-500">
                          {certificateListView === "in_progress"
                            ? "No students with certificates in progress."
                            : certificateListView === "delivered"
                              ? "No students with certificates delivered yet."
                              : "No students in program schools yet."}
                        </td>
                      </tr>
                    ) : (
                    filteredProgramStudents.map((s) => (
                      <tr key={s.userId} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => toggleStudentSelection(s.userId)}
                            className="text-slate-400 hover:text-indigo-600"
                          >
                            {selectedStudentIds.includes(s.userId) ? (
                              <CheckSquare className="w-4 h-4 text-indigo-600" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                        <td className="p-3 text-slate-800">{s.name || s.email || s.userId}</td>
                        <td className="p-3 text-slate-600">{s.schoolName || "-"}</td>
                        <td className="p-3 font-medium text-amber-700">{formatNumber(s.certificatesInProgress)}</td>
                        <td className="p-3 font-medium text-slate-900">{formatNumber(s.certificatesDelivered)}</td>
                        <td className="p-3 flex flex-wrap gap-1.5">
                          {(certificateListView === "all" && (s.certificatesInProgress ?? 0) > 0) || certificateListView === "in_progress" ? (
                            <button
                              type="button"
                              onClick={() => handleMarkCertificateInProgress(s.userId)}
                              disabled={markingInProgressUserId === s.userId}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100 disabled:opacity-50"
                            >
                              {markingInProgressUserId === s.userId && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                              {markingInProgressUserId === s.userId ? "..." : "In progress"}
                            </button>
                          ) : null}
                          {(certificateListView === "all" || certificateListView === "delivered") ? (
                            <button
                              type="button"
                              onClick={() => handleMarkCertificateDelivered(s.userId)}
                              disabled={markingUserId === s.userId}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                            >
                              {markingUserId === s.userId && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                              {markingUserId === s.userId ? "..." : "Delivered"}
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        {showRawData && data && (
          <section className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Database className="w-6 h-6 text-slate-500" />
              Raw metrics data
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Underlying data used for aggregated metrics. For debugging and audit.
            </p>
            <pre className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 overflow-x-auto max-h-96 overflow-y-auto font-mono whitespace-pre-wrap break-words">
              {JSON.stringify(data, null, 2)}
            </pre>
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminProgramMetrics;
