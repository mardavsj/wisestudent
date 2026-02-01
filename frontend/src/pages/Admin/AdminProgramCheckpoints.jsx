import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
  RefreshCw,
  Eye,
  X,
  Users,
  School,
  TrendingUp,
  Calendar,
  User,
  Save,
  Edit3,
} from "lucide-react";
import toast from "react-hot-toast";
import programAdminService from "../../services/admin/programAdminService";

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatNumber = (num) => {
  if (num === undefined || num === null) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
};

const CHECKPOINT_NAMES = {
  1: "Program Approval",
  2: "Onboarding Confirmation",
  3: "Mid-Program Review",
  4: "Completion Review",
  5: "Extension/Renewal",
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

const getCheckpointStatusIcon = (status) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-5 h-5 text-white" />;
    case "acknowledged":
      return <Clock className="w-5 h-5 text-white" />;
    case "ready":
      return <AlertCircle className="w-5 h-5 text-white" />;
    default:
      return <span className="text-white text-sm font-bold">?</span>;
  }
};

const AdminProgramCheckpoints = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState(null);
  const [checkpoints, setCheckpoints] = useState([]);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
  const [triggeringCheckpoint, setTriggeringCheckpoint] = useState(null);
  const [triggerConfirmCheckpoint, setTriggerConfirmCheckpoint] = useState(null);
  const [pageMessage, setPageMessage] = useState(null);
  const [editingNotes, setEditingNotes] = useState(false);
  const [adminNotesDraft, setAdminNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [programRes, checkpointsRes] = await Promise.all([
        programAdminService.getProgram(programId),
        programAdminService.getCheckpoints(programId),
      ]);

      setProgram(programRes?.data);
      setCheckpoints(checkpointsRes?.data || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      toast.error("Failed to load checkpoints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (programId) {
      fetchData();
    }
  }, [programId]);

  const handleTriggerCheckpoint = async (checkpointNumber) => {
    setTriggerConfirmCheckpoint(null);
    setTriggeringCheckpoint(checkpointNumber);
    setPageMessage(null);
    try {
      await programAdminService.triggerCheckpoint(programId, checkpointNumber);
      setPageMessage({
        type: "success",
        text: `Checkpoint ${checkpointNumber}: ${CHECKPOINT_NAMES[checkpointNumber]} has been triggered. The CSR partner will be notified to review and acknowledge.`,
      });
      fetchData();
    } catch (err) {
      setPageMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to trigger checkpoint. Please try again.",
      });
    } finally {
      setTriggeringCheckpoint(null);
    }
  };

  const startEditNotes = () => {
    setAdminNotesDraft(selectedCheckpoint?.adminNotes || "");
    setEditingNotes(true);
  };

  const cancelEditNotes = () => {
    setEditingNotes(false);
    setAdminNotesDraft("");
  };

  const saveCheckpointNotes = async () => {
    if (!selectedCheckpoint) return;
    setSavingNotes(true);
    try {
      await programAdminService.updateCheckpointNotes(programId, selectedCheckpoint.checkpointNumber, {
        adminNotes: adminNotesDraft.trim() || undefined,
      });
      toast.success("Admin notes updated");
      setEditingNotes(false);
      setAdminNotesDraft("");
      const updated = await programAdminService.getCheckpoints(programId);
      setCheckpoints(updated?.data || []);
      setSelectedCheckpoint((prev) => {
        const cp = (updated?.data || []).find((c) => c.checkpointNumber === prev?.checkpointNumber);
        return cp ? { ...prev, ...cp } : prev;
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const canTriggerCheckpoint = (checkpointNumber) => {
    const checkpoint = checkpoints.find((c) => c.checkpointNumber === checkpointNumber);
    
    // If checkpoint doesn't exist or is pending, check if previous is completed
    if (!checkpoint || checkpoint.status === "pending") {
      if (checkpointNumber === 1) {
        return true; // First checkpoint can always be triggered
      }
      const prevCheckpoint = checkpoints.find((c) => c.checkpointNumber === checkpointNumber - 1);
      return prevCheckpoint?.status === "completed";
    }

    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading checkpoints...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Minimal hero — matches other program pages, no extra animation */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-8 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
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
                <CheckCircle className="w-7 h-7" />
                Checkpoint Management
              </h1>
              <p className="text-sm text-white/90 mt-0.5">{program?.name || "Program"}</p>
            </div>
          </div>
          <p className="text-sm text-white/80 hidden sm:block">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-4 space-y-6">

        {/* In-page success/error message (replaces toast for trigger) */}
        {pageMessage && (
          <div
            className={`rounded-xl border-2 p-4 flex items-start justify-between gap-4 ${
              pageMessage.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {pageMessage.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm font-medium">{pageMessage.text}</p>
            </div>
            <button
              onClick={() => setPageMessage(null)}
              className="p-1 rounded-xl hover:bg-black/5 flex-shrink-0"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* CHECKPOINT TIMELINE */}
        <section className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900">Checkpoint timeline</h2>
            <p className="text-xs text-slate-500 mt-0.5">Trigger checkpoints and view status. CSR is notified when you trigger.</p>
          </div>
          <div className="relative p-6">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />

            {/* Checkpoints */}
            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((num, index) => {
                const checkpoint = checkpoints.find((c) => c.checkpointNumber === num);
                const canTrigger = canTriggerCheckpoint(num);
                const isLast = index === 4;

                return (
                  <div key={num} className="relative flex items-start gap-4">
                    {/* Status Circle */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                        checkpoint ? getCheckpointStatusColor(checkpoint.status) : "bg-slate-300"
                      }`}
                    >
                      {checkpoint ? (
                        getCheckpointStatusIcon(checkpoint.status)
                      ) : (
                        <span className="text-white text-sm font-bold">{num}</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-slate-900">
                              {CHECKPOINT_NAMES[num]}
                            </h3>
                            {checkpoint && (
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
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
                            )}
                          </div>

                          {/* Dates */}
                          {checkpoint?.triggeredAt && (
                            <div className="space-y-1 mb-3">
                              <div className="flex items-center gap-2 text-xs text-slate-600">
                                <Calendar className="w-3 h-3" />
                                <span>
                                  Triggered: {formatDate(checkpoint.triggeredAt)}
                                  {checkpoint.triggeredBy && ` by Admin`}
                                </span>
                              </div>
                              {checkpoint?.acknowledgedAt && (
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>
                                    Acknowledged: {formatDate(checkpoint.acknowledgedAt)}
                                    {checkpoint.acknowledgedBy && ` by CSR`}
                                  </span>
                                </div>
                              )}
                              {checkpoint?.completedAt && (
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                                  <span>Completed: {formatDate(checkpoint.completedAt)}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Metrics Snapshot Preview */}
                          {checkpoint?.metricsSnapshot && (
                            <div className="grid grid-cols-3 gap-3 mb-3 p-3 bg-white rounded-lg border border-slate-200">
                              <div className="text-center">
                                <p className="text-xs text-slate-400">Students</p>
                                <p className="text-sm font-semibold text-slate-900">
                                  {formatNumber(
                                    checkpoint.metricsSnapshot.studentsOnboarded || 0
                                  )}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-slate-400">Schools</p>
                                <p className="text-sm font-semibold text-slate-900">
                                  {formatNumber(checkpoint.metricsSnapshot.schoolsImplemented || 0)}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-slate-400">Regions</p>
                                <p className="text-sm font-semibold text-slate-900">
                                  {formatNumber(checkpoint.metricsSnapshot.regionsCovered || 0)}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Notes */}
                          {checkpoint?.notes && (
                            <div className="mb-3">
                              <p className="text-xs text-slate-400 mb-1">Notes:</p>
                              <p className="text-sm text-slate-700 bg-white p-2 rounded border border-slate-200">
                                {checkpoint.notes}
                              </p>
                            </div>
                          )}

                          {/* Admin Notes */}
                          {checkpoint?.adminNotes && (
                            <div className="mb-3">
                              <p className="text-xs text-slate-400 mb-1">Admin Notes:</p>
                              <p className="text-sm text-slate-700 bg-indigo-50 p-2 rounded border border-indigo-200">
                                {checkpoint.adminNotes}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 ml-4">
                          {canTrigger && (
                            <button
                              onClick={() => setTriggerConfirmCheckpoint(num)}
                              disabled={triggeringCheckpoint === num}
                              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                            >
                              {triggeringCheckpoint === num ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : (
                                <Play className="w-3 h-3" />
                              )}
                              Trigger
                            </button>
                          )}

                          {checkpoint?.status === "ready" && (
                            <span className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-semibold flex items-center gap-2 whitespace-nowrap">
                              <Clock className="w-3 h-3" />
                              Waiting for CSR
                            </span>
                          )}

                          {checkpoint && (
                            <button
                              onClick={() => setSelectedCheckpoint(checkpoint)}
                              className="px-4 py-2 rounded-xl border-2 border-gray-100 text-slate-600 text-xs font-semibold hover:bg-slate-50 flex items-center gap-2 whitespace-nowrap"
                            >
                              <Eye className="w-3 h-3" />
                              View Details
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* TRIGGER CONFIRMATION MODAL */}
      {triggerConfirmCheckpoint != null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <Play className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Trigger checkpoint?</h3>
            </div>
            <p className="text-sm text-slate-600 mb-2">
              <span className="font-semibold text-slate-800">
                Checkpoint {triggerConfirmCheckpoint}: {CHECKPOINT_NAMES[triggerConfirmCheckpoint]}
              </span>
            </p>
            <p className="text-sm text-slate-600 mb-6">
              This will notify the CSR partner to review and acknowledge this checkpoint. The checkpoint status will move to &quot;ready&quot; and the CSR will see it in their dashboard.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setTriggerConfirmCheckpoint(null)}
                className="px-4 py-2 rounded-xl border-2 border-gray-100 text-slate-700 text-sm font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleTriggerCheckpoint(triggerConfirmCheckpoint)}
                disabled={triggeringCheckpoint === triggerConfirmCheckpoint}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
              >
                {triggeringCheckpoint === triggerConfirmCheckpoint ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Triggering…
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Confirm trigger
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHECKPOINT DETAILS MODAL */}
      {selectedCheckpoint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">
                {CHECKPOINT_NAMES[selectedCheckpoint.checkpointNumber]} - Details
              </h3>
              <button
                onClick={() => setSelectedCheckpoint(null)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedCheckpoint.status === "completed"
                      ? "bg-emerald-100 text-emerald-700"
                      : selectedCheckpoint.status === "acknowledged"
                      ? "bg-amber-100 text-amber-700"
                      : selectedCheckpoint.status === "ready"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {selectedCheckpoint.status}
                </span>
              </div>

              {/* Timeline */}
              <div className="space-y-3">
                {selectedCheckpoint.triggeredAt && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Triggered</p>
                      <p className="text-sm font-medium text-slate-900">
                        {formatDate(selectedCheckpoint.triggeredAt)}
                      </p>
                    </div>
                  </div>
                )}

                {selectedCheckpoint.acknowledgedAt && (
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-amber-600" />
                    <div>
                      <p className="text-xs text-amber-600">Acknowledged</p>
                      <p className="text-sm font-medium text-amber-900">
                        {formatDate(selectedCheckpoint.acknowledgedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {selectedCheckpoint.completedAt && (
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="text-xs text-emerald-600">Completed</p>
                      <p className="text-sm font-medium text-emerald-900">
                        {formatDate(selectedCheckpoint.completedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Metrics Snapshot */}
              {selectedCheckpoint.metricsSnapshot && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400 mb-3">
                    Metrics Snapshot
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 rounded-lg p-4 text-center">
                      <Users className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">Students Onboarded</p>
                      <p className="text-xl font-bold text-slate-900">
                        {formatNumber(selectedCheckpoint.metricsSnapshot.studentsOnboarded || 0)}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 text-center">
                      <School className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">Schools Implemented</p>
                      <p className="text-xl font-bold text-slate-900">
                        {formatNumber(selectedCheckpoint.metricsSnapshot.schoolsImplemented || 0)}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 text-center">
                      <TrendingUp className="w-6 h-6 text-teal-500 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">Regions Covered</p>
                      <p className="text-xl font-bold text-slate-900">
                        {formatNumber(selectedCheckpoint.metricsSnapshot.regionsCovered || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedCheckpoint.notes && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Notes</p>
                  <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {selectedCheckpoint.notes}
                  </p>
                </div>
              )}

              {/* Admin Notes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Admin Notes</p>
                  {!editingNotes ? (
                    <button
                      onClick={startEditNotes}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      <Edit3 className="w-3 h-3" />
                      {selectedCheckpoint.adminNotes ? "Edit" : "Add notes"}
                    </button>
                  ) : null}
                </div>
                {editingNotes ? (
                  <div className="space-y-2">
                    <textarea
                      value={adminNotesDraft}
                      onChange={(e) => setAdminNotesDraft(e.target.value)}
                      placeholder="Add admin-only notes for this checkpoint..."
                      rows={4}
                      className="w-full text-sm border-2 border-gray-100 rounded-xl p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveCheckpointNotes}
                        disabled={savingNotes}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {savingNotes ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save
                      </button>
                      <button
                        onClick={cancelEditNotes}
                        className="px-4 py-2 rounded-xl border-2 border-gray-100 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : selectedCheckpoint.adminNotes ? (
                  <p className="text-sm text-slate-700 bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                    {selectedCheckpoint.adminNotes}
                  </p>
                ) : (
                  <p className="text-sm text-slate-400 italic">No admin notes yet.</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-4 border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedCheckpoint(null);
                  setEditingNotes(false);
                  setAdminNotesDraft("");
                }}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProgramCheckpoints;
