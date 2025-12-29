import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Award,
  TrendingUp,
  Bell,
  Settings,
  User,
  GraduationCap,
  BarChart3,
  Target,
  Trophy,
  Activity,
  Mail,
  Send,
  MessageSquare,
  Grid,
  List,
  Flag,
  Star,
  Zap,
  Coins,
  FileText,
  UserPlus,
  BookMarked,
  TrendingDown,
  Heart,
  Brain,
  Shield,
  Sparkles,
  Flame,
  ChevronRight,
  X,
  Gamepad2,
} from "lucide-react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../../utils/api";
import { toast } from "react-hot-toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SchoolTeacherDashboard = () => {
  const navigate = useNavigate();
  const socket = useSocket()?.socket;
  const [loading, setLoading] = useState(true);
  
  // Access control state
  const [hasAccess, setHasAccess] = useState(true);
  const [accessLoading, setAccessLoading] = useState(true);
  const [accessInfo, setAccessInfo] = useState(null);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    attendanceRate: 0,
    assignmentsGraded: 0,
  });
  const [classes, setClasses] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [classMastery, setClassMastery] = useState({});
  const [studentsAtRisk, setStudentsAtRisk] = useState([]);
  const [sessionEngagement, setSessionEngagement] = useState({});
  const [pendingTasks, setPendingTasks] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState("all");
  const [filterSection, setFilterSection] = useState("all");
  const [filterFlagged, setFilterFlagged] = useState(false);
  const [messages, setMessages] = useState([]);
  const [classMissions, setClassMissions] = useState({});
  const [teacherProfile, setTeacherProfile] = useState(null);

  // Check teacher access on mount
  useEffect(() => {
    checkTeacherAccess();
  }, []);

  // Listen for real-time access updates
  useEffect(() => {
    if (!socket) return;

    const handleAccessUpdate = (data) => {
      if (data) {
        setHasAccess(data.hasAccess === true);
        if (data.hasAccess === true) {
          setShowExpiredModal(false);
          // Refresh dashboard data
          fetchDashboardData();
        } else {
          setShowExpiredModal(true);
        }
      }
    };

    socket.on('teacher:access:updated', handleAccessUpdate);

    return () => {
      socket.off('teacher:access:updated', handleAccessUpdate);
    };
  }, [socket]);

  const checkTeacherAccess = async () => {
    try {
      setAccessLoading(true);
      const response = await api.get('/api/school/teacher/access');
      if (response.data.success) {
        const accessData = response.data;
        setHasAccess(accessData.hasAccess === true);
        setAccessInfo(accessData);
        
        // Show modal if access is denied
        if (!accessData.hasAccess) {
          setShowExpiredModal(true);
        }
      }
    } catch (error) {
      console.error('Error checking teacher access:', error);
      // On error, assume access is denied for safety
      setHasAccess(false);
      setShowExpiredModal(true);
    } finally {
      setAccessLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch dashboard data if teacher has access
    if (hasAccess && !accessLoading) {
      fetchDashboardData();
    }
  }, [hasAccess, accessLoading]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        statsRes,
        classesRes,
        assignmentsRes,
        timetableRes,
        masteryRes,
        atRiskRes,
        engagementRes,
        pendingRes,
        leaderboardRes,
        messagesRes,
        missionsRes,
        profileRes,
      ] = await Promise.all([
        api.get("/api/school/teacher/stats"),
        api.get("/api/school/teacher/classes"),
        api.get("/api/school/teacher/assignments"),
        api.get("/api/school/teacher/timetable"),
        api.get("/api/school/teacher/class-mastery"),
        api.get("/api/school/teacher/students-at-risk"),
        api.get("/api/school/teacher/session-engagement"),
        api.get("/api/school/teacher/pending-tasks"),
        api.get("/api/school/teacher/leaderboard"),
        api
          .get("/api/school/teacher/messages")
          .catch(() => ({ data: { messages: [] } })),
        api
          .get("/api/school/teacher/class-missions")
          .catch(() => ({ data: {} })),
        api.get("/api/user/profile").catch(() => ({ data: null })),
      ]);

      setStats(statsRes.data);
      const classesData = classesRes.data?.classes || [];
      setClasses(classesData);
      if (classesData.length > 0 && !selectedClass) {
        setSelectedClass(classesData[0]);
      }
      setRecentAssignments(assignmentsRes.data?.data || []);
      setTimetable(timetableRes.data);
      setClassMastery(masteryRes.data);
      setStudentsAtRisk(atRiskRes.data.students || []);
      setSessionEngagement(engagementRes.data);
      setPendingTasks(pendingRes.data.tasks || []);
      setLeaderboard(leaderboardRes.data.leaderboard || []);
      setMessages(messagesRes.data.messages || []);
      setClassMissions(missionsRes.data);
      setTeacherProfile(profileRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchClassStudents = async (classId) => {
    try {
      const response = await api.get(
        `/api/school/teacher/class/${classId}/students`
      );
      setClassStudents(response.data.students || []);
    } catch (error) {
      console.error("Error fetching class students:", error);
      toast.error("Failed to load class students");
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchClassStudents(selectedClass._id || selectedClass.name);
    }
  }, [selectedClass]);

  const StatCard = ({ title, value, icon, color, change, changeType }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <TrendingUp
                className={`w-4 h-4 mr-1 ${
                  changeType === "increase" ? "text-green-500" : "text-red-500"
                }`}
              />
              <span
                className={`text-sm ${
                  changeType === "increase" ? "text-green-600" : "text-red-600"
                }`}
              >
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-r ${color}`}>
          <div className="text-white">{icon}</div>
        </div>
      </div>
    </motion.div>
  );

  const performanceData = {
    labels: ["Class 6A", "Class 7B", "Class 8A", "Class 9B", "Class 10A"],
    datasets: [
      {
        label: "Average Score",
        data: [85, 78, 92, 88, 95],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
    ],
  };

  const attendanceData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Attendance %",
        data: [95, 92, 88, 94, 96],
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const filteredStudents = classStudents.filter((student) => {
    const matchesSearch =
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFlagged = !filterFlagged || student.flagged;
    return matchesSearch && matchesFlagged;
  });

  // Show loading state while checking access
  if (accessLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking access...</p>
        </div>
      </div>
    );
  }

  // Show expired subscription modal if access is denied
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <ExpiredSubscriptionModal
          isOpen={showExpiredModal}
          onClose={() => setShowExpiredModal(false)}
          schoolInfo={accessInfo ? {
            name: accessInfo.schoolName,
            planStatus: accessInfo.subscriptionStatus,
            planEndDate: accessInfo.subscriptionEndDate,
          } : null}
          contactInfo={accessInfo?.schoolContact || null}
          onCheckAgain={checkTeacherAccess}
        />
        {/* Blocked content overlay */}
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
            <p className="text-gray-600 mb-6">
              Your school's subscription has expired. Please contact your school administrator to renew the subscription.
            </p>
            <button
              onClick={checkTeacherAccess}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Check Access Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <>
      {/* Expired subscription modal (hidden but ready for real-time updates) */}
      <ExpiredSubscriptionModal
        isOpen={showExpiredModal}
        onClose={() => setShowExpiredModal(false)}
        schoolName={accessInfo?.schoolName}
        schoolContact={accessInfo?.schoolContact}
        onRefresh={checkTeacherAccess}
      />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Global Toolbar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-lg">
        <div className="px-6 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none bg-white font-medium"
              >
                <option value="all">All Grades</option>
                <option value="8">Grade 8</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
              </select>

              <select
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
                className="px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none bg-white font-medium"
              >
                <option value="all">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterFlagged(!filterFlagged)}
                className={`px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  filterFlagged
                    ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg"
                    : "bg-white border-2 border-gray-200 text-gray-700"
                }`}
              >
                <Flag className="w-4 h-4" />
                Flagged
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="flex min-h-screen">
        {/* LEFT RAIL - Teacher Profile + Class Instances */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          {/* Teacher Profile */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border-2 border-white flex items-center justify-center text-2xl font-bold">
                    {teacherProfile?.name?.charAt(0) || "T"}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {teacherProfile?.name || "Teacher"}
                    </h3>
                    <p className="text-sm opacity-90">
                      {teacherProfile?.email || ""}
                    </p>
                    {teacherProfile?.subject && (
                      <p className="text-xs opacity-75 mt-1">
                        Subject: {teacherProfile.subject}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="bg-white/20 backdrop-blur-md rounded-lg p-2 text-center">
                    <p className="text-2xl font-bold">{classes.length}</p>
                    <p className="text-xs opacity-90">Classes</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md rounded-lg p-2 text-center">
                    <p className="text-2xl font-bold">{stats.totalStudents}</p>
                    <p className="text-xs opacity-90">Students</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Class Instances List */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              My Classes
            </h3>
            <div className="space-y-3">
              {classes.map((cls, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  onClick={() => setSelectedClass(cls)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    selectedClass?.name === cls.name
                      ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg"
                      : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 hover:from-purple-50 hover:to-pink-50 border border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-lg">{cls.name}</h4>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div
                      className={`${
                        selectedClass?.name === cls.name
                          ? "bg-white/20"
                          : "bg-blue-100"
                      } rounded px-2 py-1`}
                    >
                      <p
                        className={`font-bold ${
                          selectedClass?.name === cls.name
                            ? "text-white"
                            : "text-blue-700"
                        }`}
                      >
                        {cls.students || 0}
                      </p>
                      <p
                        className={`${
                          selectedClass?.name === cls.name
                            ? "text-white/80"
                            : "text-blue-600"
                        }`}
                      >
                        Students
                      </p>
                    </div>
                    <div
                      className={`${
                        selectedClass?.name === cls.name
                          ? "bg-white/20"
                          : "bg-green-100"
                      } rounded px-2 py-1`}
                    >
                      <p
                        className={`font-bold ${
                          selectedClass?.name === cls.name
                            ? "text-white"
                            : "text-green-700"
                        }`}
                      >
                        {cls.sections || 0}
                      </p>
                      <p
                        className={`${
                          selectedClass?.name === cls.name
                            ? "text-white/80"
                            : "text-green-600"
                        }`}
                      >
                        Sections
                      </p>
                    </div>
                    <div
                      className={`${
                        selectedClass?.name === cls.name
                          ? "bg-white/20"
                          : "bg-purple-100"
                      } rounded px-2 py-1`}
                    >
                      <p
                        className={`font-bold ${
                          selectedClass?.name === cls.name
                            ? "text-white"
                            : "text-purple-700"
                        }`}
                      >
                        {cls.avg || 85}%
                      </p>
                      <p
                        className={`${
                          selectedClass?.name === cls.name
                            ? "text-white/80"
                            : "text-purple-600"
                        }`}
                      >
                        Avg
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER - Class Canvas */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedClass ? (
            <>
              {/* Class Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                <div className="relative z-10">
                  <h2 className="text-3xl font-black mb-2">
                    {selectedClass.name}
                  </h2>
                  <p className="text-white/90">
                    Academic Year {selectedClass.academicYear || "2024-25"}
                  </p>
                </div>
              </motion.div>

              {/* KPI Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-white shadow-lg"
                >
                  <Users className="w-8 h-8 mb-2" />
                  <p className="text-3xl font-black">
                    {selectedClass.students || 0}
                  </p>
                  <p className="text-sm opacity-90">Total Students</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg"
                >
                  <Activity className="w-8 h-8 mb-2" />
                  <p className="text-3xl font-black">
                    {sessionEngagement.overall || 0}%
                  </p>
                  <p className="text-sm opacity-90">Engagement</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 text-white shadow-lg"
                >
                  <Trophy className="w-8 h-8 mb-2" />
                  <p className="text-3xl font-black">
                    {selectedClass.avg || 85}%
                  </p>
                  <p className="text-sm opacity-90">Class Average</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-4 text-white shadow-lg"
                >
                  <AlertCircle className="w-8 h-8 mb-2" />
                  <p className="text-3xl font-black">{studentsAtRisk.length}</p>
                  <p className="text-sm opacity-90">At Risk</p>
                </motion.div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Class Students
                </h3>
                <div className="flex gap-2 bg-white rounded-xl p-1 border-2 border-gray-200">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      viewMode === "grid"
                        ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      viewMode === "list"
                        ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Student Grid/List */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredStudents.map((student, idx) => (
                    <motion.div
                      key={student._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      onClick={() => window.location.href = `/school-teacher/student/${student._id}/progress`}
                      className="bg-white rounded-xl p-4 shadow-lg border-2 border-gray-100 hover:border-purple-300 hover:shadow-xl transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={student.avatar || "/avatars/avatar1.png"}
                          alt={student.name}
                          className="w-12 h-12 rounded-full border-2 border-purple-300 shadow"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">
                            {student.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {student.email}
                          </p>
                        </div>
                        {student.flagged && (
                          <Flag className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-blue-50 rounded-lg p-2 text-center">
                          <p className="text-sm font-bold text-blue-700">
                            {student.level || 1}
                          </p>
                          <p className="text-xs text-blue-600">Level</p>
                        </div>
                        <div className="bg-amber-50 rounded-lg p-2 text-center">
                          <p className="text-sm font-bold text-amber-700">
                            {student.xp || 0}
                          </p>
                          <p className="text-xs text-amber-600">XP</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-2 text-center">
                          <p className="text-sm font-bold text-green-700">
                            {student.coins || 0}
                          </p>
                          <p className="text-xs text-green-600">Coins</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">
                          Student
                        </th>
                        <th className="px-4 py-3 text-center font-semibold">
                          Level
                        </th>
                        <th className="px-4 py-3 text-center font-semibold">
                          XP
                        </th>
                        <th className="px-4 py-3 text-center font-semibold">
                          Coins
                        </th>
                        <th className="px-4 py-3 text-center font-semibold">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student, idx) => (
                        <motion.tr
                          key={student._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => window.location.href = `/school-teacher/student/${student._id}/progress`}
                          className="border-b border-gray-100 hover:bg-purple-50 transition-colors cursor-pointer"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={student.avatar || "/avatars/avatar1.png"}
                                alt={student.name}
                                className="w-10 h-10 rounded-full border-2 border-purple-300"
                              />
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {student.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {student.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="font-bold text-blue-600">
                              {student.level || 1}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="font-bold text-amber-600">
                              {student.xp || 0}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="font-bold text-green-600">
                              {student.coins || 0}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {student.flagged ? (
                              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                At Risk
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                Active
                              </span>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a class to view students</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - Quick Actions, Inbox, Analytics */}
        <div className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">
                  New Assignment
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">
                  Invite Students
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <BookMarked className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">
                  Create Mission
                </span>
              </motion.button>
            </div>
          </motion.div>

          {/* Inbox */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-600" />
              Inbox
              {messages.length > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                  {messages.length}
                </span>
              )}
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">No new messages</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 cursor-pointer"
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 ${
                          msg.read
                            ? "bg-gray-300"
                            : "bg-purple-500 animate-pulse"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900">
                          {msg.subject || "Message"}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {msg.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {msg.time || "Just now"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Class Missions Analytics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              Class Missions
            </h3>
            <div className="space-y-3">
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Completed
                  </span>
                  <span className="text-xl font-black text-green-600">
                    {classMissions.completed || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                    style={{
                      width: `${
                        ((classMissions.completed || 0) /
                          (classMissions.total || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    In Progress
                  </span>
                  <span className="text-xl font-black text-blue-600">
                    {classMissions.inProgress || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full"
                    style={{
                      width: `${
                        ((classMissions.inProgress || 0) /
                          (classMissions.total || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Not Started
                  </span>
                  <span className="text-xl font-black text-gray-600">
                    {classMissions.notStarted || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gray-400 h-2 rounded-full"
                    style={{
                      width: `${
                        ((classMissions.notStarted || 0) /
                          (classMissions.total || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Comprehensive Analytics Section */}
      <div className="bg-gradient-to-br from-white via-purple-50 to-pink-50 border-t-4 border-purple-500 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-12 text-center flex items-center justify-center gap-4"
          >
            <BarChart3 className="w-10 h-10 text-purple-600" />
            Comprehensive Class Analytics
            <Sparkles className="w-10 h-10 text-pink-600" />
          </motion.h2>

          {/* Analytics Grid */}
          <div className="space-y-8">
            {/* Row 1: Class Mastery & Students At Risk */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Class Mastery by Pillar - Enhanced */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl shadow-2xl border-2 border-purple-200 p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-30 -mr-32 -mt-32" />
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <span>Class Mastery by Pillar</span>
                </h3>
                <div className="space-y-4 relative z-10">
                  {Object.keys(classMastery).length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <BarChart3 className="w-16 h-16 mx-auto mb-3" />
                      <p className="font-semibold">No mastery data available</p>
                    </div>
                  ) : (
                    Object.entries(classMastery).map(([pillar, percentage], idx) => {
                      const colors = [
                        'from-blue-500 to-cyan-600',
                        'from-green-500 to-emerald-600',
                        'from-purple-500 to-pink-600',
                        'from-amber-500 to-orange-600',
                        'from-red-500 to-rose-600',
                        'from-indigo-500 to-purple-600'
                      ];
                      return (
                        <motion.div
                          key={pillar}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-gray-700">{pillar}</span>
                            <span className="text-xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              {percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: idx * 0.1 + 0.3 }}
                              className={`bg-gradient-to-r ${colors[idx % colors.length]} h-3 rounded-full shadow-lg relative`}
                            >
                              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                            </motion.div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </motion.div>

              {/* Students At Risk - Enhanced */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl shadow-2xl border-2 border-red-200 p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-100 to-pink-100 rounded-full opacity-30 -mr-32 -mt-32" />
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <span>Students At Risk</span>
                  <span className="ml-auto px-4 py-1 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full text-lg font-black shadow-lg">
                    {studentsAtRisk.length}
                  </span>
                </h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto relative z-10 pr-2">
                  {studentsAtRisk.length === 0 ? (
                    <div className="text-center py-12">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <CheckCircle className="w-20 h-20 mx-auto mb-4 text-green-500" />
                      </motion.div>
                      <p className="text-xl font-bold text-green-600">All students are thriving!</p>
                      <p className="text-sm text-gray-500 mt-2">No students at risk detected</p>
                    </div>
                  ) : (
                    studentsAtRisk.map((student, idx) => (
                      <motion.div
                        key={student._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.08 }}
                        whileHover={{ scale: 1.03, x: 5 }}
                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border-2 border-red-200 shadow-md hover:shadow-xl transition-all cursor-pointer"
                      >
                        <div className="relative">
                          <img
                            src={student.avatar || '/avatars/avatar1.png'}
                            alt={student.name}
                            className="w-14 h-14 rounded-full border-3 border-white shadow-lg"
                          />
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                            <AlertCircle className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-lg">{student.name}</p>
                          <p className="text-sm text-gray-600 font-semibold">{student.reason}</p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <TrendingDown className="w-3 h-3" />
                            {student.metric}
                          </p>
                        </div>
                        <div>
                          <motion.span
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className={`px-3 py-1.5 rounded-full text-xs font-black uppercase shadow-md block ${
                              student.riskLevel === 'High' ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' :
                              student.riskLevel === 'Medium' ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white' :
                              'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
                            }`}
                          >
                            {student.riskLevel}
                          </motion.span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>

            {/* Row 2: Session Engagement & Pending Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Session Engagement - Enhanced */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl shadow-2xl border-2 border-blue-200 p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full opacity-30 -mr-32 -mt-32" />
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <span>Session Engagement</span>
                </h3>
                <div className="space-y-4 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.03, y: -3 }}
                  >
                    <div className="p-6 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl text-white shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                          <Gamepad2 className="w-10 h-10" />
                          <span className="font-bold text-xl">Games/Missions</span>
                        </div>
                        <span className="text-5xl font-black">{sessionEngagement.games || 0}%</span>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.03, y: -3 }}
                  >
                    <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-10 h-10" />
                          <span className="font-bold text-xl">Lessons</span>
                        </div>
                        <span className="text-5xl font-black">{sessionEngagement.lessons || 0}%</span>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.03, y: -3 }}
                  >
                    <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl text-white shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-10 h-10" />
                          <span className="font-bold text-xl">Overall Average</span>
                        </div>
                        <span className="text-5xl font-black">{sessionEngagement.overall || 0}%</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Pending Tasks - Enhanced */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl shadow-2xl border-2 border-orange-200 p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full opacity-30 -mr-32 -mt-32" />
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <span>Pending Grading & Approvals</span>
                  <span className="ml-auto px-4 py-1 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-full text-lg font-black shadow-lg">
                    {pendingTasks.length}
                  </span>
                </h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto relative z-10 pr-2">
                  {pendingTasks.length === 0 ? (
                    <div className="text-center py-12">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <CheckCircle className="w-20 h-20 mx-auto mb-4 text-green-500" />
                      </motion.div>
                      <p className="text-xl font-bold text-green-600">All caught up!</p>
                      <p className="text-sm text-gray-500 mt-2">No pending grading tasks</p>
                    </div>
                  ) : (
                    pendingTasks.map((task, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.03, x: -5 }}
                        className={`p-5 rounded-xl shadow-lg border-2 transition-all cursor-pointer ${
                          task.priority === 'high' ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-300 hover:border-red-400' :
                          task.priority === 'medium' ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300 hover:border-yellow-400' :
                          'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300 hover:border-blue-400'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 text-lg mb-1">{task.title}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <GraduationCap className="w-4 h-4" />
                              <span className="font-semibold">{task.class}</span>
                              <span>•</span>
                              <Calendar className="w-4 h-4" />
                              <span>Due: {task.dueDate}</span>
                            </div>
                          </div>
                          <motion.span
                            whileHover={{ scale: 1.15, rotate: 5 }}
                            className={`px-3 py-1.5 rounded-full text-xs font-black uppercase shadow-md ${
                              task.priority === 'high' ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' :
                              task.priority === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white' :
                              'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                            }`}
                          >
                            {task.priority}
                          </motion.span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/50 rounded-lg px-3 py-2">
                          <FileText className="w-4 h-4" />
                          <span className="font-semibold">Type: {task.type || 'Grading'}</span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>

            {/* Row 3: Leaderboard (Full Width) */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl shadow-2xl border-2 border-yellow-200 p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full opacity-20 -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-100 to-red-100 rounded-full opacity-20 -ml-48 -mb-48" />
              
              <h3 className="text-3xl font-black text-gray-900 mb-10 flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <span className="bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                  🏆 Top 5 Students Leaderboard
                </span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                {leaderboard.length === 0 ? (
                  <div className="col-span-5 text-center py-12">
                    <Trophy className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                    <p className="text-xl font-bold text-gray-600">No leaderboard data yet</p>
                    <p className="text-sm text-gray-500 mt-2">Students will appear here as they earn XP</p>
                  </div>
                ) : (
                  leaderboard.map((student, idx) => (
                    <motion.div
                      key={student._id}
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: idx * 0.15,
                        type: "spring",
                        stiffness: 100
                      }}
                      whileHover={{ y: -15, scale: 1.05 }}
                      className={`relative ${idx === 0 ? 'md:col-span-1' : ''}`}
                    >
                      {/* Podium Effect */}
                      <div className={`relative ${
                        idx === 0 ? 'pt-0' : 
                        idx === 1 ? 'pt-8' : 
                        idx === 2 ? 'pt-12' : 
                        'pt-16'
                      }`}>
                        <div className={`bg-gradient-to-br ${
                          idx === 0 ? 'from-yellow-400 via-amber-500 to-orange-500 shadow-2xl border-4 border-yellow-300' :
                          idx === 1 ? 'from-gray-300 via-gray-400 to-gray-500 shadow-xl border-4 border-gray-200' :
                          idx === 2 ? 'from-orange-400 via-red-500 to-pink-500 shadow-xl border-4 border-orange-300' :
                          'from-blue-400 to-indigo-500 shadow-lg border-2 border-blue-300'
                        } rounded-2xl p-5 text-white transform transition-all`}>
                          
                          {/* Rank Badge */}
                          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                            <motion.div
                              animate={{ 
                                rotate: idx === 0 ? [0, 5, -5, 0] : 0,
                                scale: idx === 0 ? [1, 1.1, 1] : 1
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-2xl shadow-2xl ${
                                idx === 0 ? 'bg-gradient-to-br from-yellow-300 to-amber-400 text-yellow-900 ring-4 ring-yellow-200' :
                                idx === 1 ? 'bg-gradient-to-br from-gray-200 to-slate-300 text-gray-700 ring-4 ring-gray-100' :
                                idx === 2 ? 'bg-gradient-to-br from-orange-300 to-red-400 text-orange-900 ring-4 ring-orange-200' :
                                'bg-gradient-to-br from-blue-300 to-indigo-400 text-blue-900 ring-4 ring-blue-200'
                              } border-4 border-white`}
                            >
                              #{idx + 1}
                            </motion.div>
                          </div>

                          {/* Student Info */}
                          <div className="text-center mt-8">
                            <div className="relative inline-block mb-4">
                              <motion.img
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                src={student.avatar || '/avatars/avatar1.png'}
                                alt={student.name}
                                className={`w-24 h-24 rounded-full border-4 border-white shadow-2xl mx-auto ${
                                  idx === 0 ? 'ring-4 ring-yellow-300' : ''
                                }`}
                              />
                              {idx === 0 && (
                                <motion.div
                                  animate={{ scale: [1, 1.3, 1], rotate: [0, 360] }}
                                  transition={{ duration: 3, repeat: Infinity }}
                                  className="absolute -top-2 -right-2"
                                >
                                  <Star className="w-10 h-10 text-yellow-300 fill-yellow-300 drop-shadow-lg" />
                                </motion.div>
                              )}
                            </div>
                            <h4 className="font-black text-xl mb-1">{student.name}</h4>
                            <p className="text-sm opacity-90 mb-4">{student.class}</p>
                            
                            {/* Stats */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 shadow-md">
                                <span className="text-sm font-semibold flex items-center gap-2">
                                  <Zap className="w-4 h-4" /> Total XP
                                </span>
                                <span className="font-black text-lg">{student.totalXP || 0}</span>
                              </div>
                              <div className="flex items-center justify-between bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 shadow-md">
                                <span className="text-sm font-semibold flex items-center gap-2">
                                  <Coins className="w-4 h-4" /> Coins
                                </span>
                                <span className="font-black text-lg">{student.healCoins || 0}</span>
                              </div>
                              <div className="flex items-center justify-between bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 shadow-md">
                                <span className="text-sm font-semibold flex items-center gap-2">
                                  <Flame className="w-4 h-4" /> Streak
                                </span>
                                <span className="font-black text-lg">{student.streak || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

    </div>
    </>
  );
};

export default SchoolTeacherDashboard;
