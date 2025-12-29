import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  Users,
  Award,
  Trophy,
  Target,
  Calendar,
  Download,
  Filter,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Zap,
  Brain,
  Heart,
  Sparkles,
  Globe,
  Shield,
  BookOpen,
  Activity,
  ArrowRight,
  Plus,
  Mail,
  RefreshCw,
  Loader2,
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import InviteStudentsModal from "../../components/InviteStudentsModal";
import NewAssignmentModal from "../../components/NewAssignmentModal";
import { useSocket } from "../../context/SocketContext";

const TeacherAnalytics = () => {
  const navigate = useNavigate();
  const socket = useSocket()?.socket;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [classMastery, setClassMastery] = useState({});
  const [studentsAtRisk, setStudentsAtRisk] = useState([]);
  const [sessionEngagement, setSessionEngagement] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState("week");
  const [selectedClass, setSelectedClass] = useState("all");
  const [classes, setClasses] = useState([]);
  const [showInviteStudents, setShowInviteStudents] = useState(false);
  const [showNewAssignment, setShowNewAssignment] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedTimeRange, selectedClass]);

  // Real-time socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleStudentActivity = (data) => {
      console.log("Real-time student activity:", data);
      toast.success(`New activity from ${data.studentName || 'a student'}!`, { icon: '⚡' });
      fetchAnalyticsData(false);
    };

    const handleStudentsUpdated = (data) => {
      console.log("Real-time students update:", data);
      toast.info("Student roster updated", { icon: '🔄' });
      fetchAnalyticsData(false);
    };

    const handleAssignmentUpdate = (data) => {
      console.log("Real-time assignment update:", data);
      fetchAnalyticsData(false);
    };

    socket.on('student:activity:new', handleStudentActivity);
    socket.on('school:students:updated', handleStudentsUpdated);
    socket.on('school:class-roster:updated', handleStudentsUpdated);
    socket.on('assignment:submitted', handleAssignmentUpdate);
    socket.on('teacher:task:update', handleAssignmentUpdate);

    return () => {
      socket.off('student:activity:new', handleStudentActivity);
      socket.off('school:students:updated', handleStudentsUpdated);
      socket.off('school:class-roster:updated', handleStudentsUpdated);
      socket.off('assignment:submitted', handleAssignmentUpdate);
      socket.off('teacher:task:update', handleAssignmentUpdate);
    };
  }, [socket]);

  const fetchAnalyticsData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      
      const params = {
        timeRange: selectedTimeRange,
        classId: selectedClass !== "all" ? selectedClass : undefined
      };

      const [
        masteryRes,
        atRiskRes,
        engagementRes,
        leaderboardRes,
        profileRes,
        classesRes,
      ] = await Promise.all([
        api.get("/api/school/teacher/class-mastery", { params }),
        api.get("/api/school/teacher/students-at-risk", { params }),
        api.get("/api/school/teacher/session-engagement", { params }),
        api.get("/api/school/teacher/leaderboard", { params }),
        api.get("/api/user/profile"),
        api.get("/api/school/teacher/classes"),
      ]);

      setClassMastery(masteryRes.data || {});
      setStudentsAtRisk(atRiskRes.data.students || []);
      setSessionEngagement(engagementRes.data || {
        games: 0,
        lessons: 0,
        overall: 0
      });
      setLeaderboard(leaderboardRes.data.leaderboard || []);
      setTeacherProfile(profileRes.data);
      setClasses(classesRes.data?.classes || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
      // Set fallback empty data
      setClassMastery({});
      setStudentsAtRisk([]);
      setSessionEngagement({ games: 0, lessons: 0, overall: 0 });
      setLeaderboard([]);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [selectedTimeRange, selectedClass]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchAnalyticsData(false);
      toast.success("Analytics refreshed successfully", { icon: '✅' });
    } catch (error) {
      console.error("Error refreshing analytics:", error);
      toast.error("Failed to refresh analytics");
    } finally {
      setRefreshing(false);
    }
  }, [fetchAnalyticsData]);

  const handleExportReport = async () => {
    try {
      toast.loading("Generating report...", { id: 'export' });
      const params = {
        timeRange: selectedTimeRange,
        classId: selectedClass !== "all" ? selectedClass : undefined,
        format: 'json'
      };

      const response = await api.get("/api/school/teacher/analytics/export", { params });

      // Convert JSON response to blob for download
      const jsonStr = JSON.stringify(response.data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics-report-${selectedTimeRange}-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Report exported successfully!", { id: 'export' });
    } catch (error) {
      console.error("Error exporting report:", error);
      toast.error("Failed to export report", { id: 'export' });
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

  const pillarIcons = {
    "Financial Literacy": "💰",
    "Brain Health": "🧠",
    "UVLS": "❤️",
    "Digital Citizenship": "🌐",
    "Moral Values": "🛡️",
    "AI for All": "✨",
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
                  Class Analytics Dashboard
                </h1>
                <p className="text-sm text-white/80">
                  {teacherProfile?.name}'s comprehensive class performance insights
                  {lastUpdated && (
                    <span className="ml-2 text-white/70">
                      • Last updated: {formatTimeAgo(lastUpdated)}
                    </span>
                  )}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={refreshing || loading}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </motion.button>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => navigate("/school-teacher/students")}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2 border border-white/20 hover:border-white/30"
                >
                  <Users className="w-4 h-4" />
                  Manage Students
                </button>
                <button
                  onClick={() => setShowNewAssignment(true)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2 border border-white/20 hover:border-white/30"
                >
                  <Plus className="w-4 h-4" />
                  Create Assignment
                </button>
                <button
                  onClick={() => navigate("/school-teacher/messages")}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2 border border-white/20 hover:border-white/30"
                >
                  <Mail className="w-4 h-4" />
                  View Messages
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6 flex items-center justify-between flex-wrap gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none bg-white font-medium"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="semester">This Semester</option>
                <option value="year">This Year</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none bg-white font-medium"
              >
                <option value="all">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls._id || cls.id} value={cls._id || cls.id}>
                    {cls.name || `Class ${cls.classNumber}${cls.stream ? ` ${cls.stream}` : ''}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportReport}
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            Export Report
          </motion.button>
        </motion.div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pillar Mastery Chart */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                Educational Pillar Mastery
              </h2>
            </div>

            <div className="space-y-4">
              {Object.entries(classMastery).map(([pillar, percentage], idx) => (
                <motion.div
                  key={pillar}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{pillarIcons[pillar] || "📚"}</span>
                        <span className="text-sm font-bold text-slate-900">{pillar}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-base font-bold text-slate-900">{percentage}%</span>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          percentage >= 75 ? "bg-green-100 text-green-700" :
                          percentage >= 50 ? "bg-indigo-100 text-indigo-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>
                          {percentage >= 75 ? "Excellent" : percentage >= 50 ? "Good" : "Needs Focus"}
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                          className={`h-full rounded-full ${
                            percentage >= 75
                              ? "bg-green-600"
                              : percentage >= 50
                              ? "bg-indigo-600"
                              : "bg-amber-600"
                          }`}
                        />
                      </div>
                    </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Overall Performance */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-sm p-6 text-white">
              <h3 className="font-bold mb-4 text-sm">Overall Class Performance</h3>
              <div className="text-center">
                <div className="inline-block p-4 bg-white/20 backdrop-blur rounded-full mb-3">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <p className="text-4xl font-black mb-2">
                  {Object.values(classMastery).length > 0
                    ? Math.round(Object.values(classMastery).reduce((a, b) => a + b, 0) / Object.values(classMastery).length)
                    : 0}%
                </p>
                <p className="text-xs opacity-90">Average Mastery</p>
              </div>
            </div>

            {/* Engagement Breakdown */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                Engagement Split
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-500" />
                      Games
                    </span>
                    <span className="text-sm font-bold">{sessionEngagement.games || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="h-full rounded-full bg-pink-600"
                      style={{ width: `${sessionEngagement.games || 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-500" />
                      Lessons
                    </span>
                    <span className="text-sm font-bold">{sessionEngagement.lessons || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{ width: `${sessionEngagement.lessons || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Students at Risk Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-indigo-600" />
              Students Requiring Attention
            </h2>
            <button
              onClick={() => navigate("/school-teacher/students")}
              className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1.5 text-sm"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {studentsAtRisk.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">All Students Doing Great!</h3>
              <p className="text-slate-600 text-sm">No students currently at risk. Keep up the excellent work!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studentsAtRisk.map((student, idx) => (
                <motion.div
                  key={student._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -2 }}
                  onClick={() => navigate(`/school-teacher/student/${student._id}/progress`)}
                  className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-red-300 hover:shadow-md cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={student.avatar || "/avatars/avatar1.png"}
                      alt={student.name}
                      className="w-12 h-12 rounded-full border-2 border-red-300"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{student.name}</p>
                      <p className="text-xs text-slate-600">{student.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      student.riskLevel === "High" ? "bg-red-500 text-white" : "bg-amber-500 text-white"
                    }`}>
                      {student.riskLevel} Risk
                    </span>
                    <span className="text-xs text-slate-600">{student.metric}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Leaderboard & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performers */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-indigo-600" />
                Class Leaderboard
              </h2>
            </div>

            <div className="space-y-3">
              {leaderboard.map((student, idx) => (
                <motion.div
                  key={student._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -2 }}
                  onClick={() => navigate(`/school-teacher/student/${student._id}/progress`)}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all"
                >
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${
                      idx === 0 ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg" :
                      idx === 1 ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-md" :
                      idx === 2 ? "bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-md" :
                      "bg-gradient-to-br from-blue-400 to-blue-500 text-white"
                    }`}>
                      {idx + 1}
                    </div>
                  </div>
                  <img
                    src={student.avatar || "/avatars/avatar1.png"}
                    alt={student.name}
                    className="w-14 h-14 rounded-full border-3 border-amber-300"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{student.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-slate-600">Level {student.level}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-xs font-bold text-indigo-600">{student.totalXP} XP</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="font-bold text-amber-600">{student.healCoins}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-orange-500">🔥</span>
                      <span className="font-bold text-orange-600">{student.streak}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Performance Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* Overall Score */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-sm p-6 text-white">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-sm">
                <Target className="w-5 h-5" />
                Class Average
              </h3>
              <div className="text-center">
                <p className="text-4xl font-black mb-2">
                  {Object.values(classMastery).length > 0
                    ? Math.round(Object.values(classMastery).reduce((a, b) => a + b, 0) / Object.values(classMastery).length)
                    : 0}%
                </p>
                <p className="text-xs opacity-90">Overall Mastery</p>
              </div>
            </div>

            {/* Insights Cards */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                Key Insights
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-green-900">Strong Performance</p>
                      <p className="text-xs text-green-700 mt-1">
                        {Object.entries(classMastery).filter(([, p]) => p >= 75).length} pillars above 75%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-900">Needs Attention</p>
                      <p className="text-xs text-amber-700 mt-1">
                        {Object.entries(classMastery).filter(([, p]) => p < 50).length} pillars below 50%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Engagement Rate</p>
                      <p className="text-xs text-blue-700 mt-1">
                        {sessionEngagement.overall || 0}% active participation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                Recommendations
              </h3>
              <div className="space-y-2">
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <p className="text-sm font-semibold text-indigo-900 mb-1">Focus on Weak Pillars</p>
                  <p className="text-xs text-indigo-700">
                    Create targeted assignments for pillars below 50%
                  </p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <p className="text-sm font-semibold text-indigo-900 mb-1">Engage At-Risk Students</p>
                  <p className="text-xs text-indigo-700">
                    {studentsAtRisk.length} students need individual attention
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <NewAssignmentModal
        isOpen={showNewAssignment}
        onClose={() => setShowNewAssignment(false)}
        onSuccess={fetchAnalyticsData}
      />

      <InviteStudentsModal
        isOpen={showInviteStudents}
        onClose={() => setShowInviteStudents(false)}
      />
    </div>
  );
};

export default TeacherAnalytics;
