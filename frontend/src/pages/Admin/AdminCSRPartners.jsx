import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";
import {
  Building2,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  RefreshCw,
  Power,
  PowerOff,
  X,
  AlertCircle,
  Clock,
  ShieldCheck,
  ArrowLeft,
  Mail,
  Phone,
  Briefcase,
  Loader2,
  Edit3,
  Save,
  Bell,
} from "lucide-react";
import toast from "react-hot-toast";
import csrPartnerService from "../../services/admin/csrPartnerService";

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatNumber = (n) =>
  n === undefined || n === null ? "0" : new Intl.NumberFormat("en-IN").format(n);

const getStatusColor = (status) => {
  switch (String(status).toLowerCase()) {
    case "verified":
    case "approved":
      return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    case "pending":
      return "bg-amber-100 text-amber-700 border border-amber-200";
    case "rejected":
      return "bg-rose-100 text-rose-700 border border-rose-200";
    case "inactive":
      return "bg-slate-100 text-slate-600 border border-slate-200";
    default:
      return "bg-slate-100 text-slate-600 border border-slate-200";
  }
};

const tabs = [
  { id: "pending", label: "Pending Approval" },
  { id: "verified", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "all", label: "All" },
];

const AdminCSRPartners = () => {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [partners, setPartners] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, verified: 0, rejected: 0 });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
  });
  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  const [selectedPartner, setSelectedPartner] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  // Partner detail view (when partnerId in URL)
  const [partnerDetail, setPartnerDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [detailRejectionReason, setDetailRejectionReason] = useState("");
  const [editingPartner, setEditingPartner] = useState(false);
  const [editForm, setEditForm] = useState({ companyName: "", contactName: "", email: "", phone: "", website: "" });
  const [savingPartner, setSavingPartner] = useState(false);
  const [detailActionModal, setDetailActionModal] = useState(null); // "deactivate" | "reactivate" | null

  const fetchPartners = async (options = {}) => {
    const { showToast = false, resetPage = false } = options;
    if (!refreshing) setLoading(true);
    setRefreshing(true);
    setError(null);
    const nextPage = resetPage ? 1 : page;
    try {
      const params = { search: search || undefined, page: nextPage, limit: 20 };
      if (activeTab !== "all") {
        params.status = activeTab === "verified" ? "approved" : activeTab;
      }
      const res = await csrPartnerService.listPartners(params);
      const list = Array.isArray(res?.data) ? res.data : res?.data?.data ?? [];
      setPartners(list);
      if (res?.pagination) {
        setPagination({
          page: res.pagination.page ?? nextPage,
          pages: res.pagination.pages ?? 1,
          total: res.pagination.total ?? 0,
          limit: res.pagination.limit ?? 20,
        });
        if (resetPage) setPage(1);
      }

      const countRes = await csrPartnerService.listPartners({ limit: 1000 });
      const all = Array.isArray(countRes?.data) ? countRes.data : countRes?.data?.data ?? [];
      setCounts({
        pending: all.filter((p) => (p.approvalStatus ?? "pending") === "pending").length,
        verified: all.filter((p) => (p.approvalStatus ?? "pending") === "approved").length,
        rejected: all.filter((p) => (p.approvalStatus ?? "pending") === "rejected").length,
      });
      if (showToast) toast.success("Partners list updated");
    } catch (err) {
      console.error("Failed to fetch partners:", err);
      setError(err?.response?.data?.message || "Failed to load CSR partners");
      if (showToast) toast.error("Failed to load CSR partners");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const normalizePartnerDetail = (res) => {
    const result = res?.data ?? res;
    const partner = result?.partner ?? result;
    const programs = result?.programs ?? [];
    if (!partner || !partner._id) return null;
    return {
      ...partner,
      programs,
      programCount: programs.length,
      approvalStatus: partner.userId?.approvalStatus ?? partner.approvalStatus ?? "pending",
    };
  };

  useEffect(() => {
    if (!partnerId) return;
    const load = async () => {
      setDetailLoading(true);
      setDetailError(null);
      try {
        const res = await csrPartnerService.getPartnerDetails(partnerId);
        const normalized = normalizePartnerDetail(res);
        if (!normalized) {
          setDetailError("Partner not found");
          return;
        }
        setPartnerDetail(normalized);
      } catch (err) {
        console.error("Failed to load partner:", err);
        setDetailError(err?.response?.data?.message || "Failed to load partner");
        toast.error("Failed to load partner");
      } finally {
        setDetailLoading(false);
      }
    };
    load();
  }, [partnerId]);

  useEffect(() => {
    if (partnerId) return;
    fetchPartners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, search, page, partnerId]);

  // Phase 8: Real-time admin CSR notifications (Socket.IO)
  useEffect(() => {
    const s = socket;
    if (!s) return;
    const onNewRegistration = () => {
      fetchPartners();
      toast.success("New CSR registration pending approval", { icon: "🔔" });
    };
    const onCheckpointAcknowledged = (data) => {
      if (data?.csrPartnerName) {
        toast.success(`${data.csrPartnerName} acknowledged a checkpoint`, { icon: "✓" });
      }
    };
    s.on("admin:csr:new_registration", onNewRegistration);
    s.on("admin:csr:checkpoint_acknowledged", onCheckpointAcknowledged);
    return () => {
      s.off("admin:csr:new_registration", onNewRegistration);
      s.off("admin:csr:checkpoint_acknowledged", onCheckpointAcknowledged);
    };
  }, [socket]);

  const handleRefresh = () => fetchPartners({ showToast: true, resetPage: true });

  const handleDetailApprove = async () => {
    if (!partnerDetail) return;
    setProcessing(true);
    try {
      await csrPartnerService.approvePartner(partnerDetail._id);
      toast.success("Partner approved successfully");
      const res = await csrPartnerService.getPartnerDetails(partnerId);
      const normalized = normalizePartnerDetail(res);
      if (normalized) setPartnerDetail(normalized);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to approve partner");
    } finally {
      setProcessing(false);
    }
  };

  const handleDetailReject = async () => {
    if (!partnerDetail || !detailRejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    setProcessing(true);
    try {
      await csrPartnerService.rejectPartner(partnerDetail._id, detailRejectionReason);
      toast.success("Partner rejected");
      navigate("/admin/csr/partners");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reject partner");
    } finally {
      setProcessing(false);
    }
  };

  const handleDetailDeactivate = async () => {
    if (!partnerDetail) return;
    setProcessing(true);
    try {
      await csrPartnerService.deactivatePartner(partnerDetail._id);
      toast.success("Partner deactivated");
      setDetailActionModal(null);
      const res = await csrPartnerService.getPartnerDetails(partnerId);
      const normalized = normalizePartnerDetail(res);
      if (normalized) setPartnerDetail(normalized);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to deactivate");
    } finally {
      setProcessing(false);
    }
  };

  const handleDetailReactivate = async () => {
    if (!partnerDetail) return;
    setProcessing(true);
    try {
      await csrPartnerService.reactivatePartner(partnerDetail._id);
      toast.success("Partner reactivated");
      setDetailActionModal(null);
      const res = await csrPartnerService.getPartnerDetails(partnerId);
      const normalized = normalizePartnerDetail(res);
      if (normalized) setPartnerDetail(normalized);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reactivate");
    } finally {
      setProcessing(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedPartner) return;
    setProcessing(true);
    try {
      await csrPartnerService.approvePartner(selectedPartner._id);
      toast.success("Partner approved successfully");
      setSelectedPartner(null);
      setModalMode(null);
      fetchPartners({ resetPage: false });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to approve partner");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedPartner || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    setProcessing(true);
    try {
      await csrPartnerService.rejectPartner(selectedPartner._id, rejectionReason);
      toast.success("Partner rejected");
      setSelectedPartner(null);
      setModalMode(null);
      setRejectionReason("");
      fetchPartners({ resetPage: false });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reject partner");
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmDeactivate = async () => {
    if (!selectedPartner) return;
    setProcessing(true);
    try {
      await csrPartnerService.deactivatePartner(selectedPartner._id);
      toast.success("Partner deactivated");
      closeModal();
      fetchPartners({ resetPage: false });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to deactivate");
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmReactivate = async () => {
    if (!selectedPartner) return;
    setProcessing(true);
    try {
      await csrPartnerService.reactivatePartner(selectedPartner._id);
      toast.success("Partner reactivated");
      closeModal();
      fetchPartners({ resetPage: false });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reactivate");
    } finally {
      setProcessing(false);
    }
  };

  const openModal = (partner, mode) => {
    setSelectedPartner(partner);
    setModalMode(mode);
    setRejectionReason("");
  };

  const closeModal = () => {
    setSelectedPartner(null);
    setModalMode(null);
    setRejectionReason("");
  };

  const approvalStatus = (p) => p.approvalStatus ?? "pending";

  const startEditPartner = () => {
    setEditForm({
      companyName: partnerDetail?.companyName ?? "",
      contactName: partnerDetail?.contactName ?? "",
      email: partnerDetail?.email ?? "",
      phone: partnerDetail?.phone ?? "",
      website: partnerDetail?.website ?? "",
    });
    setEditingPartner(true);
  };

  const cancelEditPartner = () => {
    setEditingPartner(false);
  };

  const handleSavePartner = async () => {
    if (!partnerId) return;
    setSavingPartner(true);
    try {
      const res = await csrPartnerService.updatePartner(partnerId, editForm);
      const updated = res?.data ?? res;
      setPartnerDetail((prev) => (prev ? { ...prev, ...updated } : updated));
      toast.success("Partner updated");
      setEditingPartner(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update partner");
    } finally {
      setSavingPartner(false);
    }
  };

  // Partner detail view (when /admin/csr/partners/:partnerId)
  if (partnerId) {
    if (detailLoading && !partnerDetail) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
          <div className="flex items-center gap-3 text-slate-600">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="font-medium">Loading partner...</span>
          </div>
        </div>
      );
    }
    if (detailError || !partnerDetail) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8 max-w-md w-full text-center"
          >
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-slate-900 mb-2">Partner not found</h2>
            <p className="text-sm text-slate-600 mb-6">{detailError || "Partner not found"}</p>
            <button
              onClick={() => navigate("/admin/csr/partners")}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-indigo-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Partners
            </button>
          </motion.div>
        </div>
      );
    }
    const status = approvalStatus(partnerDetail);
    const isInactive = partnerDetail.status === "inactive" || partnerDetail.isInactive;
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
        {/* Hero — Pending (amber), Approved (green), Inactive (grey) */}
        <div
          className={`text-white py-8 px-6 ${
            status === "pending"
              ? "bg-gradient-to-r from-amber-500 to-amber-600"
              : isInactive
              ? "bg-gradient-to-r from-slate-500 to-slate-600"
              : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
          }`}
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/admin/csr/partners")}
                  className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
                  aria-label="Back to partners"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                    <Building2 className="w-8 h-8" />
                    {partnerDetail.companyName ?? "—"}
                  </h1>
                  <p className="text-white/90 mt-1">
                    {status === "pending"
                      ? "Awaiting approval — Approve or reject below"
                      : isInactive
                      ? "Account suspended — Reactivate to restore access"
                      : "CSR Partner — Active"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={startEditPartner}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/20 hover:bg-white/30 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
                <span
                  className={`inline-flex px-3 py-1.5 rounded-xl text-sm font-semibold ${
                    status === "pending"
                      ? "bg-amber-400/30 text-white border border-amber-300"
                      : isInactive
                      ? "bg-slate-400/30 text-white border border-slate-300"
                      : "bg-white/20 text-white border border-white/30"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  {isInactive && status === "approved" ? " (Inactive)" : ""}
                </span>
                <p className="text-sm text-white/80 hidden sm:block ml-2 pl-4 border-l border-white/30">
                  {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 -mt-4 space-y-6">

          {editingPartner && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-indigo-100 p-6 space-y-4"
            >
              <h2 className="text-lg font-semibold text-slate-900">Edit partner details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Company name</label>
                  <input
                    value={editForm.companyName}
                    onChange={(e) => setEditForm((f) => ({ ...f, companyName: e.target.value }))}
                    className="w-full rounded-xl border-2 border-gray-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">SPOC / Contact name</label>
                  <input
                    value={editForm.contactName}
                    onChange={(e) => setEditForm((f) => ({ ...f, contactName: e.target.value }))}
                    className="w-full rounded-xl border-2 border-gray-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-xl border-2 border-gray-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Phone</label>
                  <input
                    value={editForm.phone}
                    onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full rounded-xl border-2 border-gray-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Website (optional)</label>
                  <input
                    value={editForm.website}
                    onChange={(e) => setEditForm((f) => ({ ...f, website: e.target.value }))}
                    placeholder="https://..."
                    className="w-full rounded-xl border-2 border-gray-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSavePartner}
                  disabled={savingPartner}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
                >
                  {savingPartner ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {savingPartner ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={cancelEditPartner}
                  className="rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </motion.section>
          )}

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 space-y-4"
          >
            <h2 className="text-lg font-semibold text-slate-900">Contact</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 text-slate-600">
                <Mail className="w-5 h-5 text-slate-400" />
                <span>{partnerDetail.contactName ?? "—"}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Mail className="w-5 h-5 text-slate-400" />
                <a href={`mailto:${partnerDetail.email}`} className="text-indigo-600 hover:underline">
                  {partnerDetail.email ?? "—"}
                </a>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Phone className="w-5 h-5 text-slate-400" />
                <span>{partnerDetail.phone ?? "—"}</span>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                Programs
              </h2>
              <span className="text-2xl font-black text-slate-900">{formatNumber(partnerDetail.programCount ?? partnerDetail.programs?.length ?? 0)}</span>
            </div>
            <p className="text-sm text-slate-600">Programs assigned to this partner</p>
          </motion.section>

          {status === "pending" && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 space-y-4"
            >
              <h2 className="text-lg font-semibold text-slate-900">Review</h2>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-500 font-medium mb-2">Rejection reason (if rejecting)</label>
                <textarea
                  value={detailRejectionReason}
                  onChange={(e) => setDetailRejectionReason(e.target.value)}
                  placeholder="Optional reason for rejection"
                  rows={2}
                  className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDetailApprove}
                  disabled={processing}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
                >
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Approve
                </button>
                <button
                  onClick={handleDetailReject}
                  disabled={processing || !detailRejectionReason.trim()}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-rose-200 text-rose-600 px-4 py-2.5 text-sm font-semibold hover:bg-rose-50 disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </motion.section>
          )}

          {status === "approved" && !isInactive && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Account actions</h2>
              <button
                type="button"
                onClick={() => setDetailActionModal("deactivate")}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-amber-200 text-amber-700 px-4 py-2.5 text-sm font-semibold hover:bg-amber-50"
              >
                <PowerOff className="w-4 h-4" />
                Deactivate (suspend access)
              </button>
            </motion.section>
          )}

          {isInactive && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Account suspended</h2>
              <p className="text-sm text-slate-600 mb-3">Restore access for this CSR partner.</p>
              <button
                type="button"
                onClick={() => setDetailActionModal("reactivate")}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-emerald-700"
              >
                <Power className="w-4 h-4" />
                Reactivate
              </button>
            </motion.section>
          )}

          {/* Detail page Deactivate/Reactivate modals */}
          {detailActionModal && typeof document !== "undefined" &&
            createPortal(
              <div
                className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="detail-action-modal-title"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 max-w-md w-full overflow-hidden"
                >
                  <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <h3 id="detail-action-modal-title" className="text-lg font-bold text-slate-900">
                      {detailActionModal === "deactivate" ? "Deactivate Partner?" : "Reactivate Partner?"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => !processing && setDetailActionModal(null)}
                      disabled={processing}
                      className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 disabled:opacity-50"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-5 space-y-4">
                    {detailActionModal === "deactivate" ? (
                      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                        <p className="text-sm text-amber-900">
                          Deactivate <span className="font-semibold">&quot;{partnerDetail.companyName}&quot;</span>? They will not be able to access the portal until you reactivate them.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                        <p className="text-sm text-emerald-900">
                          Reactivate <span className="font-semibold">&quot;{partnerDetail.companyName}&quot;</span>? They will be able to use the portal again.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 p-5 border-t border-slate-100 bg-slate-50/50">
                    <button
                      type="button"
                      onClick={() => !processing && setDetailActionModal(null)}
                      disabled={processing}
                      className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-100 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    {detailActionModal === "deactivate" ? (
                      <button
                        type="button"
                        onClick={handleDetailDeactivate}
                        disabled={processing}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {processing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PowerOff className="w-4 h-4" />}
                        {processing ? "Deactivating..." : "Deactivate"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleDetailReactivate}
                        disabled={processing}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {processing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
                        {processing ? "Reactivating..." : "Reactivate"}
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>,
              document.body
            )}
        </div>
      </div>
    );
  }

  if (error && partners.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8 max-w-md w-full text-center"
        >
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">Unable to load partners</h2>
          <p className="text-sm text-slate-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => fetchPartners({ resetPage: true })}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-indigo-700"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const summaryCards = [
    {
      title: "Pending Approval",
      value: formatNumber(counts.pending),
      icon: Clock,
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "Approved",
      value: formatNumber(counts.verified),
      icon: ShieldCheck,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Rejected",
      value: formatNumber(counts.rejected),
      icon: XCircle,
      color: "from-rose-500 to-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Hero — match Super Admin / Programs */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between flex-wrap gap-4"
          >
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                  <Building2 className="w-10 h-10" />
                  CSR Partners
                </h1>
                <p className="text-lg text-white/90">
                  Review and approve CSR partner registrations
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl bg-white/20 hover:bg-white/30 px-4 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/csr/notifications")}
                className="inline-flex items-center gap-2 rounded-xl bg-white/20 hover:bg-white/30 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                <Bell className="w-4 h-4" />
                Notifications
              </button>
              <div className="text-right hidden sm:block ml-2 pl-4 border-l border-white/30">
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
        {/* Summary cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {summaryCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <div className="flex items-center justify-between">
                <div className={`p-4 rounded-xl bg-gradient-to-br ${card.color}`}>
                  <card.icon className="w-8 h-8 text-white" />
                </div>
                <span className="text-3xl font-black text-slate-900">{card.value}</span>
              </div>
              <p className="text-sm font-medium text-slate-600 mt-3">{card.title}</p>
            </motion.div>
          ))}
        </section>

        {/* Partners list card — search, tabs, table */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Building2 className="w-7 h-7 text-indigo-600" />
              Partners List
            </h2>
            <div className="relative flex-1 max-w-xs sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name or email..."
                className="pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-100 bg-slate-50/50 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 py-3 border-b border-slate-100 flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setPage(1);
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border-2 ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                    : "bg-slate-50/50 text-slate-600 border-gray-100 hover:border-indigo-200 hover:bg-slate-100"
                }`}
              >
                {tab.label}
                {tab.id !== "all" && counts[tab.id] > 0 && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-lg text-xs font-bold ${
                      activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {counts[tab.id]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="ml-3 text-slate-600 font-medium">Loading partners...</span>
            </div>
          ) : partners.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="w-14 h-14 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-600 font-medium">No partners found</p>
              <p className="text-sm text-slate-500 mt-1">
                {search ? "Try a different search or clear filters." : "CSR partners will appear here once they register."}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100">
                      <th className="px-5 py-4">Company</th>
                      <th className="px-5 py-4">SPOC</th>
                      <th className="px-5 py-4">Email</th>
                      <th className="px-5 py-4">Registered</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {partners.map((partner) => (
                      <tr
                        key={partner._id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                            <span className="font-semibold text-slate-900">
                              {partner.companyName ?? "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {partner.contactName || "—"}
                        </td>
                        <td className="px-5 py-4 text-slate-600">{partner.email ?? "—"}</td>
                        <td className="px-5 py-4 text-slate-500">
                          {formatDate(partner.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(
                              approvalStatus(partner)
                            )}`}
                          >
                            {approvalStatus(partner)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/admin/csr/partners/${partner._id}`)}
                              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {approvalStatus(partner) === "pending" && (
                              <>
                                <button
                                  onClick={() => openModal(partner, "approve")}
                                  className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => openModal(partner, "reject")}
                                  className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                                  title="Reject"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {approvalStatus(partner) === "approved" && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  openModal(partner, "deactivate");
                                }}
                                className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                                title="Deactivate"
                              >
                                <PowerOff className="w-4 h-4" />
                              </button>
                            )}
                            {partner.status === "inactive" && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  openModal(partner, "reactivate");
                                }}
                                className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                                title="Reactivate"
                              >
                                <Power className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {pagination.pages > 1 && (
                <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <p className="text-sm text-slate-600">
                    Showing page {pagination.page} of {pagination.pages} ({formatNumber(pagination.total)} total)
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="px-4 py-2 rounded-xl border-2 border-gray-100 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= pagination.pages}
                      className="px-4 py-2 rounded-xl border-2 border-gray-100 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.section>
      </div>

      {/* MODAL — deactivate/reactivate/approve/reject/view */}
      {selectedPartner && modalMode && typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="csr-partner-modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h3 id="csr-partner-modal-title" className="text-lg font-bold text-slate-900">
                  {modalMode === "view" && "Partner Details"}
                  {modalMode === "approve" && "Approve Partner"}
                  {modalMode === "reject" && "Reject Partner"}
                  {modalMode === "deactivate" && "Deactivate Partner"}
                  {modalMode === "reactivate" && "Reactivate Partner"}
                </h3>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={processing}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 disabled:opacity-50"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Partner details card — hide for deactivate/reactivate (use focused confirmation only) */}
              {modalMode !== "deactivate" && modalMode !== "reactivate" && (
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                {[
                  { label: "Company", value: selectedPartner.companyName },
                  { label: "SPOC Name", value: selectedPartner.contactName || "—" },
                  { label: "Email", value: selectedPartner.email },
                  { label: "Phone", value: selectedPartner.phone || "—" },
                  { label: "Industry", value: selectedPartner.industry || "—" },
                  { label: "Registered", value: formatDate(selectedPartner.createdAt) },
                  {
                    label: "Approval status",
                    value: (
                      <span
                        className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(
                          approvalStatus(selectedPartner)
                        )}`}
                      >
                        {approvalStatus(selectedPartner)}
                      </span>
                    ),
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-semibold text-slate-900">
                      {typeof value === "string" ? value : value}
                    </span>
                  </div>
                ))}
                {selectedPartner.status && approvalStatus(selectedPartner) === "approved" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Business status</span>
                    <span className="font-semibold text-slate-900">{selectedPartner.status}</span>
                  </div>
                )}
              </div>
              )}
              {modalMode === "reject" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Rejection Reason <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide a reason for rejection..."
                    rows={3}
                    className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}
              {modalMode === "approve" && (
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-emerald-800">
                      This will approve the CSR partner and allow them to access the portal. You can
                      then create a program for them.
                    </p>
                  </div>
                </div>
              )}
              {modalMode === "deactivate" && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 space-y-3">
                  <div className="flex items-start gap-2">
                    <PowerOff className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-900">
                        Deactivate &quot;{selectedPartner.companyName}&quot;?
                      </p>
                      <p className="text-sm text-amber-800 mt-1">
                        This will suspend the CSR partner. They will not be able to access the portal
                        until you reactivate them. You can reactivate at any time.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {modalMode === "reactivate" && (
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 space-y-3">
                  <div className="flex items-start gap-2">
                    <Power className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-900">
                        Reactivate &quot;{selectedPartner.companyName}&quot;?
                      </p>
                      <p className="text-sm text-emerald-800 mt-1">
                        This will restore access for the CSR partner. They will be able to use the
                        portal again.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 p-5 border-t border-slate-100 bg-slate-50/50">
              <button
                type="button"
                onClick={closeModal}
                disabled={processing}
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-100 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                {modalMode === "view" ? "Close" : "Cancel"}
              </button>
              {modalMode === "approve" && (
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={processing}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : null}
                  {processing ? "Approving..." : "Approve Partner"}
                </button>
              )}
              {modalMode === "reject" && (
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={processing || !rejectionReason.trim()}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : null}
                  {processing ? "Rejecting..." : "Reject Partner"}
                </button>
              )}
              {modalMode === "deactivate" && (
                <button
                  type="button"
                  onClick={handleConfirmDeactivate}
                  disabled={processing}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <PowerOff className="w-4 h-4" />
                  )}
                  {processing ? "Deactivating..." : "Deactivate"}
                </button>
              )}
              {modalMode === "reactivate" && (
                <button
                  type="button"
                  onClick={handleConfirmReactivate}
                  disabled={processing}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Power className="w-4 h-4" />
                  )}
                  {processing ? "Reactivating..." : "Reactivate"}
                </button>
              )}
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdminCSRPartners;
