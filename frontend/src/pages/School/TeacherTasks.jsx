import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  BarChart3,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Star,
  Target,
  BookOpen,
  FileText,
  TrendingUp,
  MoreVertical,
  X,
  BarChart,
  RefreshCw,
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import NewAssignmentModal from "../../components/NewAssignmentModal";
import DeleteAssignmentModal from "../../components/DeleteAssignmentModal";
import { useSocket } from "../../context/SocketContext";

const TeacherTasks = () => {
  const navigate = useNavigate();
  const socket = useSocket()?.socket;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showNewAssignment, setShowNewAssignment] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [assignmentToView, setAssignmentToView] = useState(null);
  const [assignmentToEdit, setAssignmentToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);

  const fetchData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      
      const [assignmentsRes, profileRes] = await Promise.all([
        api.get("/api/school/teacher/assignments"),
        api.get("/api/user/profile"),
      ]);

      setAssignments(assignmentsRes.data?.data || []);
      setTeacherProfile(profileRes.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load assignments");
      setAssignments([]);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await api.get("/api/user/profile");
      setTeacherProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchData(false);
      toast.success("Assignments refreshed!", { icon: '✅' });
    } catch (error) {
      console.error("Error refreshing assignments:", error);
      toast.error("Failed to refresh assignments");
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]);

  const formatTimeAgo = (date) => {
    if (!date) return "Never";
    const now = new Date();
    const then = new Date(date);
    const diff = now - then;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    return "Just now";
  };

  // Real-time socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleAssignmentCreated = (data) => {
      console.log("Real-time assignment created:", data);
      toast.success(`New assignment: ${data.assignment?.title || 'Assignment'}`, { icon: '📝' });
      fetchData(false);
    };

    const handleAssignmentUpdated = (data) => {
      console.log("Real-time assignment updated:", data);
      toast.info("Assignment updated", { icon: '🔄' });
      fetchData(false);
    };

    const handleAssignmentDeleted = (data) => {
      console.log("Real-time assignment deleted:", data);
      toast.info("Assignment deleted", { icon: '🗑️' });
      fetchData(false);
    };

    const handleAssignmentSubmitted = (data) => {
      console.log("Real-time assignment submitted:", data);
      toast.success(`New submission for: ${data.assignmentTitle || 'Assignment'}`, { icon: '📤' });
      fetchData(false);
    };

    const handleTaskUpdate = (data) => {
      console.log("Real-time task update:", data);
      fetchData(false);
    };

    socket.on('assignment:created', handleAssignmentCreated);
    socket.on('assignment:updated', handleAssignmentUpdated);
    socket.on('assignment:deleted', handleAssignmentDeleted);
    socket.on('assignment:submitted', handleAssignmentSubmitted);
    socket.on('teacher:task:update', handleTaskUpdate);

    return () => {
      socket.off('assignment:created', handleAssignmentCreated);
      socket.off('assignment:updated', handleAssignmentUpdated);
      socket.off('assignment:deleted', handleAssignmentDeleted);
      socket.off('assignment:submitted', handleAssignmentSubmitted);
      socket.off('teacher:task:update', handleTaskUpdate);
    };
  }, [socket, fetchData]);

  useEffect(() => {
    fetchData();
    fetchProfile();
  }, [fetchData, fetchProfile]);

  const handleDeleteAssignment = (assignment) => {
    setAssignmentToDelete(assignment);
    setShowDeleteModal(true);
  };

  const handleDeleteForMe = async () => {
    if (!assignmentToDelete) return;

    try {
      const response = await api.delete(`/api/school/teacher/assignments/${assignmentToDelete._id}/for-me`);
      toast.success(response.data.message);
      setShowDeleteModal(false);
      setAssignmentToDelete(null);
      fetchData(false);
    } catch (error) {
      console.error("Error deleting assignment for me:", error);
      toast.error("Failed to delete assignment");
    }
  };

  const handleDeleteForEveryone = async () => {
    if (!assignmentToDelete) return;

    try {
      const response = await api.delete(`/api/school/teacher/assignments/${assignmentToDelete._id}/for-everyone`);
      toast.success(response.data.message);
      setShowDeleteModal(false);
      setAssignmentToDelete(null);
      fetchData(false);
    } catch (error) {
      console.error("Error deleting assignment for everyone:", error);
      toast.error("Failed to delete assignment");
    }
  };

  const handleViewAssignment = (assignment) => {
    setAssignmentToView(assignment);
    setShowViewModal(true);
  };

  const handleEditAssignment = (assignment) => {
    setAssignmentToEdit(assignment);
    setShowEditModal(true);
  };

  const filteredAssignments = (Array.isArray(assignments) ? assignments : []).filter(assignment => {
    const matchesSearch = assignment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || assignment.status === filterStatus;
    const matchesPriority = filterPriority === "all" || assignment.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const assignmentsArray = Array.isArray(assignments) ? assignments : [];
  const stats = {
    total: assignmentsArray.length,
    pending: assignmentsArray.filter(a => a.status === "pending").length,
    inProgress: assignmentsArray.filter(a => a.status === "in_progress" || a.status === "published").length,
    completed: assignmentsArray.filter(a => a.status === "completed" || a.status === "approved").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6"
        >
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-6 rounded-t-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-1">
                  Assignments & Tasks
                </h1>
                <p className="text-sm text-white/80">
                  {teacherProfile?.name}'s assignment management dashboard
                  {lastUpdated && (
                    <span className="ml-2 text-white/70">
                      • Last updated: {formatTimeAgo(lastUpdated)}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  disabled={refreshing || loading}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2 border border-white/20 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/school-teacher/tracking')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2 border border-white/20 hover:border-white/30"
                >
                  <BarChart className="w-4 h-4" />
                  Track Progress
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowNewAssignment(true)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2 border border-white/20 hover:border-white/30"
                >
                  <Plus className="w-4 h-4" />
                  New Assignment
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-indigo-50 rounded-lg">
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Total Assignments</p>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-amber-50 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Pending</p>
            <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-purple-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">In Progress</p>
            <p className="text-2xl font-bold text-slate-900">{stats.inProgress}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Completed</p>
            <p className="text-2xl font-bold text-slate-900">{stats.completed}</p>
          </motion.div>
        </div>

        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6"
        >
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 relative min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none bg-white"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none bg-white font-medium"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="published">Published</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none bg-white font-medium"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </motion.div>

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAssignments.length === 0 ? (
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Assignments Found</h3>
              <p className="text-slate-500 text-sm mb-6">Create your first assignment to get started</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowNewAssignment(true)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create First Assignment
              </motion.button>
            </div>
          ) : (
            filteredAssignments.map((assignment, idx) => (
              <motion.div
                key={assignment._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-slate-900">{assignment.title}</h3>
                      {assignment.approvalRequired && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                          Pending Approval
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-2 line-clamp-2">{assignment.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                        {assignment.subject}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        assignment.priority === "high" ? "bg-red-100 text-red-700" :
                        assignment.priority === "medium" ? "bg-amber-100 text-amber-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {assignment.priority}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        assignment.status === "completed" || assignment.status === "approved" ? "bg-green-100 text-green-700" :
                        assignment.status === "in_progress" || assignment.status === "published" ? "bg-indigo-100 text-indigo-700" :
                        assignment.status === "pending_approval" ? "bg-amber-100 text-amber-700" :
                        "bg-slate-100 text-slate-700"
                      }`}>
                        {assignment.status?.replace(/_/g, " ") || "pending"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAssignment(assignment);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </motion.button>
                  </div>
                </div>

                {/* Assignment Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4" />
                    <span>{assignment.className || "Multiple Classes"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <BookOpen className="w-4 h-4" />
                    <span>{assignment.modules?.length || 0} modules</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Target className="w-4 h-4" />
                    <span>{assignment.healCoinsReward || 100} coins</span>
                  </div>
                </div>

                {/* Progress Bar */}
                {assignment.submissions && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-600">Submissions</span>
                      <span className="text-xs font-bold text-slate-900">
                        {assignment.submissions?.length || 0} / {assignment.totalStudents || 0}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
                        style={{
                          width: `${
                            assignment.totalStudents
                              ? (assignment.submissions.length / assignment.totalStudents) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewAssignment(assignment);
                    }}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAssignment(assignment);
                    }}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAssignment(assignment);
                    }}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* No assignments message included in grid above */}
      </div>

      {/* New Assignment Modal */}
      <NewAssignmentModal
        isOpen={showNewAssignment}
        onClose={() => setShowNewAssignment(false)}
        onSuccess={() => {
          fetchData(false);
          setShowNewAssignment(false);
        }}
      />

      {/* View Assignment Modal */}
      {showViewModal && assignmentToView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowViewModal(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Assignment Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1 uppercase tracking-wide">Title</h3>
                  <p className="text-slate-900 font-semibold">{assignmentToView.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1 uppercase tracking-wide">Description</h3>
                  <p className="text-slate-700 whitespace-pre-wrap">{assignmentToView.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-1 uppercase tracking-wide">Subject</h3>
                    <p className="text-slate-900">{assignmentToView.subject}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-1 uppercase tracking-wide">Type</h3>
                    <p className="text-slate-900 capitalize">{assignmentToView.type}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-1 uppercase tracking-wide">Due Date</h3>
                    <p className="text-slate-900">{new Date(assignmentToView.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-1 uppercase tracking-wide">Priority</h3>
                    <p className="text-slate-900 capitalize">{assignmentToView.priority}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-1 uppercase tracking-wide">Status</h3>
                    <p className="text-slate-900 capitalize">{assignmentToView.status?.replace(/_/g, " ")}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-1 uppercase tracking-wide">Total Points</h3>
                    <p className="text-slate-900">{assignmentToView.totalMarks}</p>
                  </div>
                </div>
                {assignmentToView.questions && assignmentToView.questions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wide">Questions ({assignmentToView.questions.length})</h3>
                    <div className="space-y-2">
                      {assignmentToView.questions.map((question, index) => (
                        <div key={index} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <p className="font-medium text-slate-900">
                            {index + 1}. {question.question || `${question.type.replace(/_/g, ' ')} Task`}
                          </p>
                          <p className="text-sm text-slate-600">Points: {question.points}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Assignment Modal */}
      {showEditModal && assignmentToEdit && (
        <NewAssignmentModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            fetchData(false);
          }}
          editMode={true}
          assignmentToEdit={assignmentToEdit}
        />
      )}

      {/* Delete Assignment Modal */}
      <DeleteAssignmentModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setAssignmentToDelete(null);
        }}
        onDeleteForMe={handleDeleteForMe}
        onDeleteForEveryone={handleDeleteForEveryone}
        assignment={assignmentToDelete}
      />
    </div>
  );
};

export default TeacherTasks;
