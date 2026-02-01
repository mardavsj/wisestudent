import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  RefreshCw,
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  Users,
  School,
  CheckCircle,
  AlertCircle,
  BarChart3,
  FileText,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import programAdminService from "../../services/admin/programAdminService";

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatNumber = (num) => {
  if (num === undefined || num === null) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
};

const getStatusColor = (status) => {
  switch (status) {
    case "draft":
      return "bg-slate-100 text-slate-600";
    case "approved":
      return "bg-blue-100 text-blue-700";
    case "implementation_in_progress":
      return "bg-amber-100 text-amber-700";
    case "mid_program_review_completed":
      return "bg-purple-100 text-purple-700";
    case "completed":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-gray-100 text-gray-500";
  }
};

const getCheckpointStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "bg-emerald-500";
    case "acknowledged":
      return "bg-amber-500";
    case "ready":
      return "bg-blue-500";
    default:
      return "bg-slate-300";
  }
};

const formatStatus = (status) => {
  if (!status) return "Unknown";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const CHECKPOINT_NAMES = {
  1: "Program Approval",
  2: "Onboarding Confirmation",
  3: "Mid-Program Review",
  4: "Completion Review",
  5: "Extension/Renewal",
};

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "schools", label: "Schools" },
  { id: "checkpoints", label: "Checkpoints" },
];

const AdminProgramDetail = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState(null);
  const [checkpoints, setCheckpoints] = useState([]);
  const [schools, setSchools] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [deleting, setDeleting] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const IMPLEMENTATION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In progress" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
  ];

  const handleSchoolStatusChange = async (school, newStatus) => {
    const psId = school.programSchoolId || school._id;
    if (!psId || school.implementationStatus === newStatus) return;
    setUpdatingStatusId(psId);
    try {
      await programAdminService.updateSchoolStatus(programId, psId, newStatus);
      toast.success("Status updated");
      setSchools((prev) =>
        prev.map((s) =>
          (s.programSchoolId || s._id) === psId ? { ...s, implementationStatus: newStatus } : s
        )
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleDeletePermanent = async () => {
    setDeleting(true);
    try {
      await programAdminService.deleteProgramPermanent(programId);
      toast.success("Program deleted permanently");
      setShowDeleteModal(false);
      navigate("/admin/programs");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete program");
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const fetchProgram = async () => {
    setLoading(true);
    try {
      const res = await programAdminService.getProgram(programId);
      setProgram(res?.data);
    } catch (err) {
      console.error("Failed to fetch program:", err);
      toast.error("Failed to load program");
    } finally {
      setLoading(false);
    }
  };

  const fetchCheckpoints = async () => {
    try {
      const res = await programAdminService.getCheckpoints(programId);
      setCheckpoints(res?.data || []);
    } catch (err) {
      console.error("Failed to fetch checkpoints:", err);
    }
  };

  const fetchSchools = async () => {
    try {
      const res = await programAdminService.getAssignedSchools(programId);
      // API returns { data: schoolsArray, pagination }; support both shapes
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.schools || []);
      setSchools(list);
    } catch (err) {
      console.error("Failed to fetch schools:", err);
    }
  };

  useEffect(() => {
    if (programId) {
      fetchProgram();
      fetchCheckpoints();
      fetchSchools();
    }
  }, [programId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8 max-w-md w-full text-center"
        >
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium mb-6">Program not found</p>
          <button
            onClick={() => navigate("/admin/programs")}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-indigo-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Programs
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Hero Section — match Super Admin Dashboard */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between flex-wrap gap-4"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/programs")}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
                aria-label="Back to programs"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-4xl font-black mb-2 flex items-center gap-3 flex-wrap">
                  <Briefcase className="w-10 h-10" />
                  {program.name}
                  <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(program.status)}`}>
                    {formatStatus(program.status)}
                  </span>
                </h1>
                <p className="text-lg text-white/90">
                  Program details, schools, and checkpoints
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => navigate(`/admin/programs/${programId}/metrics`)}
                className="inline-flex items-center gap-2 rounded-xl bg-white/20 hover:bg-white/30 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                Metrics
              </button>
              <button
                onClick={() => navigate(`/admin/programs/${programId}/reports`)}
                className="inline-flex items-center gap-2 rounded-xl bg-white/20 hover:bg-white/30 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                <FileText className="w-4 h-4" />
                Reports
              </button>
              {["draft", "approved"].includes(program.status) && (
                <button
                  onClick={() => navigate(`/admin/programs/${programId}/edit`)}
                  className="inline-flex items-center gap-2 rounded-xl bg-white text-indigo-600 px-4 py-2.5 text-sm font-bold hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Program
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDeleteModal(true);
                }}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-red-300 bg-white/10 text-white px-4 py-2.5 text-sm font-semibold hover:bg-red-500/20 transition-colors disabled:opacity-50"
                title="Permanently delete program (removes from CSR)"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <div className="text-right hidden lg:block ml-4 pl-4 border-l border-white/30">
                <p className="text-sm text-white/80">Today&apos;s Date</p>
                <p className="text-xl font-bold">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 space-y-6">
        {/* TABS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-2 flex gap-1"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* TAB CONTENT */}
        {activeTab === "overview" && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Program Info */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 space-y-4"
            >
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Building2 className="w-7 h-7 text-indigo-600" />
                Program Information
              </h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-indigo-500" />
                  <div>
                    <p className="text-xs text-slate-400">CSR Partner</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {(program.csrPartnerId?.companyName ?? program.csrPartner?.companyName) || "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Description</p>
                  <p className="text-sm text-slate-700 mt-1">
                    {program.description || "No description"}
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Scope */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 space-y-4"
            >
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <MapPin className="w-7 h-7 text-indigo-600" />
                Scope
              </h2>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-indigo-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Geography</p>
                    <p className="text-sm text-slate-700">
                      {program.scope?.geography?.states?.join(", ") || "All India"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-400">School Categories</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {program.scope?.schoolCategories?.map((cat) => (
                      <span
                        key={cat}
                        className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600"
                      >
                        {cat}
                      </span>
                    )) || <span className="text-sm text-slate-500">All categories</span>}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Target Students</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {formatNumber(program.scope?.targetStudentCount) || "Not set"}
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Duration */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 space-y-4"
            >
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Calendar className="w-7 h-7 text-indigo-600" />
                Duration
              </h2>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-indigo-500" />
                <div>
                  <p className="text-sm text-slate-700">
                    {formatDate(program.duration?.startDate)} –{" "}
                    {formatDate(program.duration?.endDate)}
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Quick Metrics */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                <BarChart3 className="w-7 h-7 text-indigo-600" />
                Quick Metrics
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <School className="w-5 h-5 text-indigo-500" />
                  <div>
                    <p className="text-xs text-slate-400">Schools</p>
                    <p className="text-lg font-bold text-slate-900">
                      {formatNumber(program.schoolsAssigned ?? schools.length)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <Users className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-xs text-slate-400">Students</p>
                    <p className="text-lg font-bold text-slate-900">
                      {formatNumber(
                        (() => {
                          const fromSchools = schools.reduce(
                            (sum, s) => sum + (s.studentsCovered || 0),
                            0
                          );
                          const fromMetrics =
                            program.metrics?.studentReach?.totalOnboarded ??
                            program.metrics?.studentReach?.activeStudents;
                          return Math.max(fromSchools, fromMetrics ?? 0);
                        })()
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>
        )}

        {activeTab === "schools" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <School className="w-7 h-7 text-indigo-600" />
                Assigned Schools
              </h2>
              <button
                onClick={() => navigate(`/admin/programs/${programId}/schools`)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
              >
                Manage Schools
              </button>
            </div>

            {schools.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <School className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p>No schools assigned yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      <th className="px-4 py-3">School</th>
                      <th className="px-4 py-3">District</th>
                      <th className="px-4 py-3">Students</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {schools.slice(0, 10).map((school, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {school.schoolName || school.school?.name || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {school.district || school.school?.district || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {formatNumber(school.studentsCovered)}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={school.implementationStatus || "pending"}
                            onChange={(e) => handleSchoolStatusChange(school, e.target.value)}
                            disabled={updatingStatusId === (school.programSchoolId || school._id)}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
                          >
                            {IMPLEMENTATION_STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {schools.length > 10 && (
              <div className="p-4 border-t border-slate-100 text-center">
                <button
                  onClick={() => navigate(`/admin/programs/${programId}/schools`)}
                  className="text-indigo-600 text-sm font-semibold hover:underline"
                >
                  View all {schools.length} schools
                </button>
              </div>
            )}
          </motion.section>
        )}

        {activeTab === "checkpoints" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <CheckCircle className="w-7 h-7 text-indigo-600" />
                Program Checkpoints
              </h2>
              <button
                onClick={() => navigate(`/admin/programs/${programId}/checkpoints`)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
              >
                Manage Checkpoints
              </button>
            </div>

            {checkpoints.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <CheckCircle className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p>No checkpoints triggered yet</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {checkpoints.slice(0, 5).map((checkpoint) => (
                  <div
                    key={checkpoint.checkpointNumber}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${getCheckpointStatusColor(
                          checkpoint.status
                        )}`}
                      >
                        {checkpoint.status === "completed" ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : (
                          <span className="text-white text-xs font-bold">
                            {checkpoint.checkpointNumber}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {CHECKPOINT_NAMES[checkpoint.checkpointNumber]}
                        </p>
                        <p className="text-xs text-slate-500">
                          {checkpoint.triggeredAt && `Triggered: ${formatDate(checkpoint.triggeredAt)}`}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        checkpoint.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : checkpoint.status === "acknowledged"
                          ? "bg-amber-100 text-amber-700"
                          : checkpoint.status === "ready"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {checkpoint.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="p-4 border-t border-slate-100 text-center">
              <button
                onClick={() => navigate(`/admin/programs/${programId}/checkpoints`)}
                className="text-indigo-600 text-sm font-semibold hover:underline"
              >
                View all checkpoints
              </button>
            </div>
          </motion.section>
        )}

        {/* Delete program confirmation modal — rendered via portal so it always appears on top */}
        {showDeleteModal &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-modal-title"
            >
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 max-w-md w-full overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-red-50">
                      <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 id="delete-modal-title" className="text-lg font-bold text-slate-900">
                      Delete program?
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => !deleting && setShowDeleteModal(false)}
                    disabled={deleting}
                    className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-sm text-slate-600">
                    Permanently delete <span className="font-semibold text-slate-900">&quot;{program?.name}&quot;</span>?
                  </p>
                  <p className="text-sm text-slate-600">
                    This will remove the program, all assigned schools, metrics, and checkpoints.
                    The CSR partner will no longer see this program. This cannot be undone.
                  </p>
                </div>
                <div className="flex gap-3 p-6 pt-0 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    disabled={deleting}
                    className="px-4 py-2.5 rounded-xl border-2 border-gray-100 text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeletePermanent}
                    disabled={deleting}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Deleting…
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete permanently
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
    </div>
  );
};

export default AdminProgramDetail;
