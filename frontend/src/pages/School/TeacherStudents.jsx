import React, { useState, useEffect, useCallback } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Filter,
  Grid,
  List,
  Flag,
  ChevronDown,
  Download,
  Eye,
  BookOpen,
  TrendingUp,
  Zap,
  Coins,
  Star,
  Activity,
  ZoomIn,
  ZoomOut,
  MessageSquare,
  FileText,
  Heart,
  Clock,
  Plus,
  UserPlus,
  MoreVertical,
  UserMinus,
  ChevronRight,
  RefreshCw,
  Loader2,
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import StudentSlideoverPanel from "../../components/StudentSlideoverPanel";
import NewAssignmentModal from "../../components/NewAssignmentModal";
import InviteStudentsModal from "../../components/InviteStudentsModal";
import StudentActionsMenu from "../../components/StudentActionsMenu";
import AssignToGroupModal from "../../components/AssignToGroupModal";
import { useSocket } from "../../context/SocketContext";

const TeacherStudents = () => {
  const navigate = useNavigate();
  const socket = useSocket()?.socket;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [_filterGrade, _setFilterGrade] = useState("all");
  const [_filterSection, _setFilterSection] = useState("all");
  const [filterFlagged, setFilterFlagged] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showSlideoverPanel, setShowSlideoverPanel] = useState(false);
  const [zoomLevel, setZoomLevel] = useState("class"); // "class" or "all"
  const [showNewAssignment, setShowNewAssignment] = useState(false);
  const [showInviteStudents, setShowInviteStudents] = useState(false);
  const [inviteTargetClass, setInviteTargetClass] = useState(null);
  const [showAssignToGroup, setShowAssignToGroup] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [studentsLoading, setStudentsLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchClassStudents(selectedClass._id || selectedClass.name);
    }
  }, [selectedClass]);

  // Real-time socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleStudentsUpdated = (data) => {
      console.log("Real-time students update:", data);
      toast.success(`Student roster updated for ${data.classId ? 'class' : 'all classes'}`, { icon: '🔄' });
      refreshStudents();
    };

    const handleStudentRemoved = (data) => {
      console.log("Real-time student removed:", data);
      toast.info("A student was removed from a class", { icon: '👋' });
      refreshStudents();
    };

    const handleStudentActivity = (data) => {
      console.log("Real-time student activity:", data);
      // Update student's last active time in the list
      setClassStudents(prev => prev.map(student => {
        if (student._id === data.studentId) {
          return {
            ...student,
            lastActive: 'Just now',
            level: data.level || student.level,
            xp: data.xp || student.xp,
            streak: data.streak || student.streak
          };
        }
        return student;
      }));
    };

    socket.on('school:students:updated', handleStudentsUpdated);
    socket.on('school:class-roster:updated', handleStudentsUpdated);
    socket.on('school:students:removed', handleStudentRemoved);
    socket.on('student:activity:new', handleStudentActivity);

    return () => {
      socket.off('school:students:updated', handleStudentsUpdated);
      socket.off('school:class-roster:updated', handleStudentsUpdated);
      socket.off('school:students:removed', handleStudentRemoved);
      socket.off('student:activity:new', handleStudentActivity);
    };
  }, [socket]);

  const fetchClasses = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await api.get("/api/school/teacher/classes");
      const classesData = response.data?.classes || [];
      setClasses(classesData);
      if (classesData.length > 0 && !selectedClass) {
        setSelectedClass(classesData[0]);
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to load classes");
      setClasses([]);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [selectedClass]);

  const fetchClassStudents = useCallback(async (classId, showLoading = true) => {
    try {
      if (showLoading) setStudentsLoading(true);
      const response = await api.get(`/api/school/teacher/class/${classId}/students`);
      setClassStudents(response.data.students || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching class students:", error);
      toast.error("Failed to load students");
      setClassStudents([]);
    } finally {
      if (showLoading) setStudentsLoading(false);
    }
  }, []);

  const fetchAllStudents = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setStudentsLoading(true);
      const response = await api.get('/api/school/teacher/all-students');
      setClassStudents(response.data.students || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching all students:", error);
      toast.error("Failed to load all students");
      setClassStudents([]);
    } finally {
      if (showLoading) setStudentsLoading(false);
    }
  }, []);

  const refreshStudents = useCallback(() => {
    if (zoomLevel === "class" && selectedClass) {
      fetchClassStudents(selectedClass._id || selectedClass.name, false);
    } else {
      fetchAllStudents(false);
    }
  }, [zoomLevel, selectedClass, fetchClassStudents, fetchAllStudents]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchClasses(false),
        refreshStudents()
      ]);
      toast.success("Data refreshed successfully", { icon: '✅' });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  }, [fetchClasses, refreshStudents]);

  const handleRemoveStudentFromClass = async (student) => {
    if (!selectedClass) {
      toast.error("No class selected");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove ${student.name} from ${selectedClass.name}? This will only remove them from this class, not delete their account.`
    );

    if (!confirmed) return;

    try {
      const schoolStudentId = student.schoolStudentId || student._id;
      await api.delete(
        `/api/school/teacher/class/${selectedClass._id || selectedClass.name}/student/${schoolStudentId}`
      );
      toast.success(`${student.name} has been removed from ${selectedClass.name}`);
      
      // Refresh the student list
      refreshStudents();
    } catch (error) {
      console.error("Error removing student from class:", error);
      toast.error("Failed to remove student from class");
    }
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setShowSlideoverPanel(true);
  };

  const handleZoomToggle = () => {
    if (zoomLevel === "class") {
      setZoomLevel("all");
      fetchAllStudents();
    } else {
      setZoomLevel("class");
      if (selectedClass) {
        fetchClassStudents(selectedClass._id || selectedClass.name);
      }
    }
  };

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

  const handleInviteStudentsClick = () => {
    const targetClass = selectedClass || classes[0];
    if (!targetClass) {
      toast.error("No classes available. Please create a class or ask your school admin to assign one to you.");
      return;
    }

    if (!selectedClass) {
      setSelectedClass(targetClass);
    }

    setInviteTargetClass(targetClass);
    setShowInviteStudents(true);
  };

  const filteredStudents = classStudents.filter((student) => {
    const matchesSearch =
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFlagged = !filterFlagged || student.flagged;
    return matchesSearch && matchesFlagged;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Motion.div
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
        <Motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6"
        >
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-6 rounded-t-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Student Management
                </h1>
                <p className="text-sm text-white/80">
                  View and manage all your students across classes
                  {lastUpdated && (
                    <span className="ml-2 text-white/70">
                      • Last updated: {formatTimeAgo(lastUpdated)}
                    </span>
                  )}
                </p>
              </div>
              <Motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={refreshing || loading}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Motion.button>
            </div>
          </div>
        </Motion.div>
        {/* Search and Filters Bar */}
        <Motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              {zoomLevel === "all" ? (
                <>
                  <Users className="w-5 h-5 text-indigo-600" />
                  All Students - Aggregated View
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  {selectedClass?.name || 'Class View'}
                </>
              )}
            </h2>
            
            {/* Zoom Controls & Actions */}
            <div className="flex gap-2">
              <Motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowInviteStudents(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Invite Students
              </Motion.button>
              
              <Motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleZoomToggle}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  zoomLevel === "all"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 border border-slate-200 hover:border-indigo-300"
                }`}
              >
                {zoomLevel === "all" ? (
                  <>
                    <ZoomIn className="w-4 h-4" />
                    Zoom to Class
                  </>
                ) : (
                  <>
                    <ZoomOut className="w-4 h-4" />
                    View All Classes
                  </>
                )}
              </Motion.button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-white"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">

              <Motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilterFlagged(!filterFlagged)}
                className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  filterFlagged
                    ? "bg-red-600 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-red-300"
                }`}
              >
                <Flag className="w-4 h-4" />
                At Risk Only
              </Motion.button>

              {/* View Mode Toggle */}
              <div className="flex gap-2 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === "list"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Class Selection Sidebar */}
          <div className="lg:col-span-1">
            <Motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-6"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                My Classes
              </h3>
              <div className="space-y-2">
                {classes.map((cls, idx) => (
                  <Motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -2 }}
                    onClick={() => setSelectedClass(cls)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedClass?.name === cls.name
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-50 text-slate-900 hover:bg-indigo-50 border border-slate-200"
                    }`}
                  >
                    <h4 className="font-bold text-base mb-2">{cls.name}</h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className={selectedClass?.name === cls.name ? "text-white/90" : "text-slate-600"}>
                        {cls.studentCount || cls.students || 0} Students
                      </span>
                      <span className={`font-bold ${selectedClass?.name === cls.name ? "text-white" : "text-indigo-600"}`}>
                        {cls.avg || 85}%
                      </span>
                    </div>
                  </Motion.div>
                ))}
              </div>
            </Motion.div>
          </div>

          {/* Students Display Area */}
          <div className="lg:col-span-3">
            {studentsLoading && (
              <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            )}
            {!studentsLoading && selectedClass ? (
              <>
                {/* Class Header */}
                <Motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6"
                >
                  <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg p-4 text-white">
                    <h2 className="text-xl font-bold mb-2">{selectedClass.name}</h2>
                    <div className="flex items-center gap-6 text-white/90 text-sm">
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {filteredStudents.length} Students
                      </span>
                      <span className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        {selectedClass.avg || 85}% Avg
                      </span>
                    </div>
                  </div>
                </Motion.div>

                {/* Student Grid/List */}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredStudents.map((student, idx) => (
                      <Motion.div
                        key={student._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        whileHover={{ y: -2 }}
                        onClick={() => navigate(`/school-teacher/student/${student._id}/progress`)}
                        className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="relative">
                            <img
                              src={student.avatar || `/avatars/avatar${(idx % 6) + 1}.png`}
                              alt={student.name}
                              className="w-14 h-14 rounded-full border-2 border-indigo-300 shadow-sm object-cover"
                              onError={(e) => {
                                e.target.src = `/avatars/avatar${(idx % 6) + 1}.png`;
                              }}
                            />
                            {student.flagged && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-base">
                              {student.name}
                            </h4>
                            <p className="text-xs text-gray-500">{student.email}</p>
                            <p className="text-xs text-indigo-600 font-semibold">
                              {student.rollNumber || `ROLL${String(idx + 1).padStart(6, '0')}`}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-blue-50 rounded-lg p-2 text-center">
                            <p className="text-base font-bold text-blue-700">
                              {student.level || 1}
                            </p>
                            <p className="text-xs text-blue-600">Level</p>
                          </div>
                          <div className="bg-indigo-50 rounded-lg p-2 text-center">
                            <p className="text-base font-bold text-indigo-700">
                              {student.pillarMastery ?? 0}%
                            </p>
                            <p className="text-xs text-indigo-600">Mastery</p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-2 text-center">
                            <p className="text-base font-bold text-green-700">
                              {student.streak || 0}
                            </p>
                            <p className="text-xs text-green-600">Streak</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-lg">{student.moodEmoji ?? '😊'}</span>
                            <span className="text-xs text-gray-600">{student.moodScore ?? 3}/5</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{student.lastActive ?? 'Never'}</span>
                          </div>
                        </div>
                      </Motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible relative">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Roll</th>
                          <th className="px-4 py-3 text-left font-semibold">Student</th>
                          <th className="px-4 py-3 text-center font-semibold">Level</th>
                          <th className="px-4 py-3 text-center font-semibold">Pillar Mastery %</th>
                          <th className="px-4 py-3 text-center font-semibold">Profile</th>
                          <th className="px-4 py-3 text-center font-semibold">Last Active</th>
                          <th className="px-4 py-3 text-center font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((student, idx) => (
                          <Motion.tr
                            key={student._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            onClick={() => handleStudentClick(student)}
                            className="border-b border-slate-100 hover:bg-indigo-50 transition-colors cursor-pointer"
                          >
                            <td className="px-4 py-3">
                              <span className="font-bold text-gray-700">
                                {student.rollNumber || `ROLL${String(idx + 1).padStart(6, '0')}`}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <img
                                    src={student.avatar || `/avatars/avatar${(idx % 6) + 1}.png`}
                                    alt={student.name}
                                    className="w-10 h-10 rounded-full border-2 border-indigo-300 object-cover"
                                    onError={(e) => {
                                      e.target.src = `/avatars/avatar${(idx % 6) + 1}.png`;
                                    }}
                                  />
                                  {student.flagged && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">{student.name}</p>
                                  <p className="text-xs text-gray-500">{student.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                                {student.level || 1}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      (student.pillarMastery || 0) >= 75
                                        ? "bg-gradient-to-r from-green-500 to-emerald-600"
                                        : (student.pillarMastery || 0) >= 50
                                        ? "bg-gradient-to-r from-blue-500 to-cyan-600"
                                        : (student.pillarMastery || 0) >= 25
                                        ? "bg-gradient-to-r from-amber-500 to-orange-600"
                                        : "bg-gradient-to-r from-red-500 to-pink-600"
                                    }`}
                                    style={{ width: `${student.pillarMastery || 0}%` }}
                                  />
                                </div>
                                <span className="text-sm font-bold text-gray-700 w-10 text-right">
                                  {student.pillarMastery || 0}%
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/school-teacher/student/${student._id}/progress`);
                                }}
                                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 mx-auto"
                              >
                                <ChevronRight className="w-4 h-4" />
                                <span className="text-sm font-semibold">View</span>
                              </Motion.button>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <p className="text-xs text-gray-600 flex items-center justify-center gap-1">
                                <Clock className="w-3 h-3" />
                                {student.lastActive || 'Never'}
                              </p>
                            </td>
                            <td className="px-4 py-3 relative overflow-visible">
                              <div 
                                className="flex items-center justify-center" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                              >
                                <StudentActionsMenu
                                  student={student}
                                  onMessage={(s) => {
                                    setSelectedStudent(s);
                                    setShowSlideoverPanel(true);
                                  }}
                                  onAddNote={(s) => {
                                    setSelectedStudent(s);
                                    setShowSlideoverPanel(true);
                                  }}
                                  onViewDetails={(s) => {
                                    setSelectedStudent(s);
                                    setShowSlideoverPanel(true);
                                  }}
                                  onAssignToGroup={(s) => {
                                    setSelectedStudent(s);
                                    setShowAssignToGroup(true);
                                  }}
                                  onViewFullProfile={(s) => {
                                    navigate(`/school-teacher/student/${s._id}/progress`);
                                  }}
                                  onRemoveFromClass={handleRemoveStudentFromClass}
                                />
                              </div>
                            </td>
                          </Motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {filteredStudents.length === 0 && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
                    <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-lg font-bold text-slate-600">No students found</p>
                    <p className="text-slate-500 mt-2 text-sm">Try adjusting your search or filters</p>
                  </div>
                )}
              </>
            ) : !studentsLoading ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-lg font-bold text-slate-600">Select a class</p>
                <p className="text-slate-500 mt-2 text-sm">Choose a class from the sidebar to view students</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Student Slideover Panel */}
      <StudentSlideoverPanel
        student={selectedStudent}
        isOpen={showSlideoverPanel}
        onClose={() => setShowSlideoverPanel(false)}
        onUpdate={refreshStudents}
      />

      {/* New Assignment Modal */}
      <NewAssignmentModal
        isOpen={showNewAssignment}
        onClose={() => setShowNewAssignment(false)}
        onSuccess={refreshStudents}
        defaultClassId={selectedClass?._id || selectedClass?.name}
        defaultClassName={selectedClass?.name}
      />

      {/* Invite Students Modal */}
      <InviteStudentsModal
        isOpen={showInviteStudents}
        onClose={() => {
          setShowInviteStudents(false);
          setInviteTargetClass(null);
        }}
        classId={inviteTargetClass?._id || inviteTargetClass?.name}
        className={inviteTargetClass?.name}
        onSuccess={refreshStudents}
      />

      {/* Assign to Group Modal */}
      <AssignToGroupModal
        isOpen={showAssignToGroup}
        onClose={() => setShowAssignToGroup(false)}
        student={selectedStudent}
        onSuccess={refreshStudents}
      />

      
    </div>
  );
};

export default TeacherStudents;
