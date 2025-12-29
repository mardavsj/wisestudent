import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Trophy,
  Activity,
  ArrowRight,
  Calendar,
  Clock,
  BarChart3,
  UserPlus,
  Award,
  Zap,
  Loader2,
  TrendingDown,
  Target,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import InviteStudentsModal from "../../components/InviteStudentsModal";
import ExpiredSubscriptionModal from "../../components/School/ExpiredSubscriptionModal";
import { useSocket } from "../../context/SocketContext";

const TeacherOverview = () => {
  const navigate = useNavigate();
  const socket = useSocket()?.socket;
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [classes, setClasses] = useState([]);
  const [studentsAtRisk, setStudentsAtRisk] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [classMastery, setClassMastery] = useState({});
  const [sessionEngagement, setSessionEngagement] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [showInviteStudents, setShowInviteStudents] = useState(false);
  const [selectedClassForInvite, setSelectedClassForInvite] = useState(null);
  
  // Access control state
  const [hasAccess, setHasAccess] = useState(true);
  const [accessLoading, setAccessLoading] = useState(true);
  const [accessInfo, setAccessInfo] = useState(null);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  
  // Refresh states
  const [refreshing, setRefreshing] = useState(false);
  const [refreshingActivities, setRefreshingActivities] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Check teacher access on mount and when socket connects
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
          toast.success('Access restored! Your school has renewed its subscription.', {
            duration: 5000,
            icon: '🎉'
          });
          fetchDashboardData();
        } else {
          setShowExpiredModal(true);
          toast.warning('Your school\'s subscription has expired. Access restricted.', {
            duration: 5000,
            icon: '⚠️'
          });
        }
      }
    };

    const handleActivityUpdate = (data) => {
      if (data && data.type === 'student_activity') {
        fetchRecentActivities();
      }
    };

    const handleTaskUpdate = (data) => {
      if (data) {
        fetchDashboardData();
      }
    };

    socket.on('teacher:access:updated', handleAccessUpdate);
    socket.on('teacher:activity:update', handleActivityUpdate);
    socket.on('teacher:task:update', handleTaskUpdate);
    socket.on('assignment:submitted', handleTaskUpdate);

    return () => {
      socket.off('teacher:access:updated', handleAccessUpdate);
      socket.off('teacher:activity:update', handleActivityUpdate);
      socket.off('teacher:task:update', handleTaskUpdate);
      socket.off('assignment:submitted', handleTaskUpdate);
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
        
        if (!accessData.hasAccess) {
          setShowExpiredModal(true);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Error checking teacher access:', error);
      setHasAccess(false);
      setShowExpiredModal(true);
      setLoading(false);
    } finally {
      setAccessLoading(false);
    }
  };

  useEffect(() => {
    if (hasAccess && !accessLoading) {
      fetchDashboardData();
    }
  }, [hasAccess, accessLoading]);

  const formatRelativeTime = (date) => {
    if (!date) return "just now";
    const value = new Date(date).getTime();
    if (Number.isNaN(value)) {
      return "just now";
    }
    const diff = Date.now() - value;
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  };

  const fetchRecentActivities = async (showLoading = false) => {
    try {
      if (showLoading) setRefreshingActivities(true);
      
      // Optimized: Fetch only student IDs first, then get recent activities
      // This avoids the heavy all-students endpoint that enriches every student
      const studentsRes = await api.get("/api/school/teacher/all-students?limit=10&minimal=true").catch(() => ({ data: { students: [] } }));
      const students = studentsRes.data?.students || [];
      
      if (students.length === 0) {
        setRecentActivities([]);
        if (showLoading) setRefreshingActivities(false);
        return;
      }

      const activities = [];
      const studentIds = students.map(s => s._id || s.userId?._id).filter(Boolean).slice(0, 3); // Limit to 3 students for faster loading
      const studentMap = new Map(students.map(s => [(s._id || s.userId?._id).toString(), s.name || "Student"]));

      // Fetch activity logs in parallel but with timeout to prevent blocking
      const activityPromises = studentIds.map(async (studentId) => {
        try {
          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
          
          // Add timeout to prevent slow requests from blocking
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000)
          );
          
          const analyticsRes = await Promise.race([
            api.get(`/api/school/teacher/student/${studentId}/analytics?startDate=${sevenDaysAgo}`),
            timeoutPromise
          ]).catch(() => ({ data: { activityTimeline: [] } }));

          const activityTimeline = analyticsRes.data?.activityTimeline || [];
          const studentName = studentMap.get(studentId.toString()) || "Student";
          
          // Only process the most recent 2 activities per student
          activityTimeline.slice(0, 2).forEach((log) => {
            let icon = "🎯";
            let action = "";

            const activityType = log.type || log.activityType || "";
            const activityTitle = log.title || log.action || "";
            const activityDescription = log.description || "";
            const activityDetails = log.details || {};

            const actualActivityName = 
              activityTitle || 
              activityDescription || 
              activityDetails?.gameName || 
              activityDetails?.activityName || 
              activityDetails?.name ||
              activityDetails?.title ||
              "";

            if (activityType.includes("game") || activityType.includes("mission") || activityTitle.toLowerCase().includes("mission")) {
              icon = "🎯";
              action = actualActivityName ? `${studentName} completed ${actualActivityName}` : `${studentName} completed a mission`;
            } else if (activityType.includes("lesson") || activityType.includes("learning")) {
              icon = "📚";
              action = actualActivityName ? `${studentName} completed ${actualActivityName}` : `${studentName} completed a lesson`;
            } else if (activityType.includes("achievement") || activityType.includes("badge")) {
              icon = "🏆";
              action = actualActivityName ? `${studentName} achieved ${actualActivityName}` : `${studentName} achieved a new badge`;
            } else if (activityType.includes("quiz") || activityType.includes("assignment")) {
              icon = "✅";
              action = actualActivityName ? `${studentName} completed ${actualActivityName}` : `${studentName} completed a quiz`;
            } else {
              icon = "📝";
              action = actualActivityName ? `${studentName} ${actualActivityName}` : (activityType ? `${studentName} ${activityType.replace(/_/g, " ")}` : `${studentName} completed an activity`);
            }

            activities.push({
              action,
              time: formatRelativeTime(log.timestamp || log.createdAt),
              icon,
              student: studentName,
              timestamp: new Date(log.timestamp || log.createdAt).getTime(),
            });
          });
        } catch (error) {
          console.error(`Error fetching activities for student ${studentId}:`, error);
        }
      });

      // Use Promise.allSettled to not block on individual failures
      await Promise.allSettled(activityPromises);

      const sortedActivities = activities
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 3);

      setRecentActivities(sortedActivities);
      if (showLoading) {
        toast.success("Recent activities refreshed");
      }
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      setRecentActivities([]);
      if (showLoading) {
        toast.error("Failed to refresh activities");
      }
    } finally {
      if (showLoading) setRefreshingActivities(false);
    }
  };

  const fetchDashboardData = async (showLoading = true, showToast = false) => {
    try {
      if (showLoading) setLoading(true);
      if (showToast) setRefreshing(true);
      
      const [
        statsRes,
        classesRes,
        atRiskRes,
        leaderboardRes,
        pendingRes,
        messagesRes,
        profileRes,
        masteryRes,
        engagementRes,
      ] = await Promise.all([
        api.get("/api/school/teacher/stats").catch((err) => {
          console.error("Error fetching stats:", err);
          return { data: {} };
        }),
        api.get("/api/school/teacher/classes").catch((err) => {
          console.error("Error fetching classes:", err);
          return { data: { classes: [] } };
        }),
        api.get("/api/school/teacher/students-at-risk").catch((err) => {
          console.error("Error fetching at-risk students:", err);
          return { data: { students: [] } };
        }),
        api.get("/api/school/teacher/leaderboard").catch((err) => {
          console.error("Error fetching leaderboard:", err);
          return { data: { leaderboard: [] } };
        }),
        api.get("/api/school/teacher/pending-tasks").catch((err) => {
          console.error("Error fetching pending tasks:", err);
          return { data: { tasks: [] } };
        }),
        api.get("/api/school/teacher/messages").catch(() => ({ data: { messages: [] } })),
        api.get("/api/user/profile").catch(() => ({ data: null })),
        api.get("/api/school/teacher/class-mastery").catch((err) => {
          console.error("Error fetching class mastery:", err);
          return { data: {} };
        }),
        api.get("/api/school/teacher/session-engagement").catch((err) => {
          console.error("Error fetching session engagement:", err);
          return { data: {} };
        }),
      ]);

      setStats(statsRes.data || {});
      const classesData = classesRes.data?.classes || [];
      setClasses(classesData);
      setStudentsAtRisk(atRiskRes.data?.students || []);
      setLeaderboard(leaderboardRes.data?.leaderboard || []);
      setPendingTasks(pendingRes.data?.tasks || []);
      setMessages(messagesRes.data?.messages || []);
      setTeacherProfile(profileRes.data);
      setClassMastery(masteryRes.data || {});
      setSessionEngagement(engagementRes.data || {
        games: 0,
        lessons: 0,
        overall: 0
      });
      
      setLastUpdated(new Date());
      
      // Load activities in background (non-blocking)
      fetchRecentActivities().catch(err => {
        console.error("Error loading activities in background:", err);
      });
      
      if (showToast) {
        toast.success("Dashboard refreshed successfully");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      if (showLoading) setLoading(false);
      if (showToast) setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(true, true);
  };

  const StatCard = ({ title, value, icon: Icon, gradient, trend, onClick, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all ${
        onClick ? "cursor-pointer hover:border-indigo-300 hover:shadow-lg" : ""
      }`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-md`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700">{trend}</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
    </motion.div>
  );

  const handleOpenInviteStudents = (classInfo) => {
    const fallbackClass = classInfo || classes[0];
    if (!fallbackClass) {
      toast.error("No classes available. Please create a class or contact your school admin.");
      return;
    }

    const resolvedClassId =
      fallbackClass._id ||
      fallbackClass.id ||
      fallbackClass.classId ||
      null;

    const resolvedClassName =
      fallbackClass.name ||
      (fallbackClass.classNumber
        ? `Class ${fallbackClass.classNumber}${fallbackClass.stream ? ` ${fallbackClass.stream}` : ""}`
        : undefined);

    if (!resolvedClassId) {
      toast.error("Unable to determine class details. Please try again or refresh the page.");
      return;
    }

    setSelectedClassForInvite({
      id: resolvedClassId,
      name: resolvedClassName || "My Class",
    });
    setShowInviteStudents(true);
  };

  if (accessLoading || (loading && hasAccess)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!hasAccess && !accessLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ExpiredSubscriptionModal
          isOpen={true}
          onClose={() => {}}
          schoolInfo={accessInfo ? {
            name: accessInfo.schoolName,
            planStatus: accessInfo.subscriptionStatus,
            planEndDate: accessInfo.subscriptionEndDate,
          } : null}
          contactInfo={accessInfo?.schoolContact || null}
          onCheckAgain={checkTeacherAccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-6 rounded-t-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  Welcome back, {teacherProfile?.name?.split(" ")[0] || "Teacher"}! 👋
                </h1>
                <p className="text-sm text-white/90">
                  Here's what's happening with your classes today
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-white/80 mb-1">
                    {new Date().toLocaleDateString("en-US", { weekday: "long" })}
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {new Date().toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 180 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg border border-white/30 transition-all disabled:opacity-50"
                  title="Refresh dashboard"
                >
                  <RefreshCw className={`w-5 h-5 text-white ${refreshing ? 'animate-spin' : ''}`} />
                </motion.button>
              </div>
            </div>
            {lastUpdated && (
              <div className="mt-2 text-xs text-white/70">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Students"
            value={stats.totalStudents || 0}
            icon={Users}
            gradient="from-blue-500 to-cyan-600"
            trend="+5%"
            subtitle="Across all classes"
            onClick={() => navigate("/school-teacher/students")}
          />
          <StatCard
            title="Active Classes"
            value={Array.isArray(classes) ? classes.length : 0}
            icon={BookOpen}
            gradient="from-purple-500 to-pink-600"
            subtitle="Teaching this semester"
            onClick={() => navigate("/school-teacher/students")}
          />
          <StatCard
            title="At Risk Students"
            value={studentsAtRisk.length}
            icon={AlertCircle}
            gradient="from-red-500 to-pink-600"
            trend={studentsAtRisk.length > 5 ? "+3" : "-2"}
            subtitle="Needs attention"
            onClick={() => navigate("/school-teacher/analytics")}
          />
          <StatCard
            title="Pending Tasks"
            value={pendingTasks.length}
            icon={CheckCircle}
            gradient="from-amber-500 to-orange-600"
            subtitle="Assignments to grade"
            onClick={() => navigate("/school-teacher/tasks")}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Classes */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    My Classes
                  </h2>
                  <button
                    onClick={() => navigate("/school-teacher/students")}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition-colors"
                  >
                    View All <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(Array.isArray(classes) ? classes : []).length > 0 ? (
                    (Array.isArray(classes) ? classes : []).slice(0, 4).map((cls, idx) => {
                      if (!cls || typeof cls !== 'object') return null;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ y: -2 }}
                          onClick={() => navigate("/school-teacher/students")}
                          className="p-5 rounded-lg bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-200 cursor-pointer hover:border-indigo-400 hover:shadow-lg transition-all"
                        >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-slate-900">{cls.name || 'Unnamed Class'}</h3>
                          <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{cls.studentCount || cls.students || 0}</p>
                            <p className="text-xs text-slate-600 font-medium">Students</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">{Array.isArray(cls.subjects) ? cls.subjects.length : (cls.subjects ? 1 : 0)}</p>
                            <p className="text-xs text-slate-600 font-medium">Subjects</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-indigo-600">{cls.academicYear || new Date().getFullYear().toString()}</p>
                            <p className="text-xs text-slate-600 font-medium">Year</p>
                          </div>
                        </div>
                      </motion.div>
                      );
                    })
                  ) : (
                    <div className="col-span-2 text-center py-12">
                      <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm mb-3">No classes assigned yet</p>
                      <button
                        onClick={() => navigate("/school-teacher/students")}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        View Students
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    Recent Activity
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05, rotate: 180 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fetchRecentActivities(true)}
                    disabled={refreshingActivities}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all disabled:opacity-50"
                    title="Refresh activities"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshingActivities ? 'animate-spin' : ''}`} />
                  </motion.button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {refreshingActivities ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                    </div>
                  ) : recentActivities.length > 0 ? (
                    recentActivities.map((activity, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-indigo-50/50 via-purple-50/50 to-pink-50/50 border border-indigo-200/50 hover:border-indigo-300 hover:shadow-md transition-all"
                      >
                        <span className="text-2xl">{activity.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900">
                            {activity.action}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {activity.student} • {activity.time}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm mb-3">No recent activity</p>
                      <button
                        onClick={() => fetchRecentActivities(true)}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        Refresh to check for updates
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Class Mastery by Pillar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    Class Mastery by Pillar
                  </h2>
                  <button
                    onClick={() => navigate("/school-teacher/analytics")}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition-colors"
                  >
                    Details <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {Object.keys(classMastery).length > 0 ? (
                    Object.entries(classMastery).slice(0, 6).map(([pillar, percentage], idx) => (
                    <motion.div
                      key={pillar}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-700">{pillar}</span>
                        <span className="text-sm font-bold text-slate-900">{percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                          className={`h-full rounded-full ${
                            percentage >= 75
                              ? "bg-gradient-to-r from-emerald-500 to-green-600"
                              : percentage >= 50
                              ? "bg-gradient-to-r from-blue-500 to-cyan-600"
                              : "bg-gradient-to-r from-amber-500 to-orange-600"
                          }`}
                        />
                      </div>
                    </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm">No mastery data available</p>
                      <p className="text-xs text-slate-400 mt-1">Data will appear as students complete activities</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* At Risk Students */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="border-b border-slate-200 bg-gradient-to-r from-red-50 via-pink-50 to-rose-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    At Risk
                  </h2>
                  <button
                    onClick={() => navigate("/school-teacher/analytics")}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition-colors"
                  >
                    View All <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {studentsAtRisk.slice(0, 5).map((student, idx) => (
                    <motion.div
                      key={student._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -2 }}
                      onClick={() => navigate(`/school-teacher/student/${student._id}/progress`)}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-red-50/50 via-pink-50/50 to-rose-50/50 border border-red-200/50 hover:border-red-400 hover:shadow-md cursor-pointer transition-all"
                    >
                      <img
                        src={student.avatar || "/avatars/avatar1.png"}
                        alt={student.name}
                        className="w-10 h-10 rounded-full border-2 border-red-400"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">{student.name}</p>
                        <p className="text-xs text-red-600 truncate">{student.reason}</p>
                      </div>
                      <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        student.riskLevel === "High" ? "bg-red-500 text-white" : "bg-amber-500 text-white"
                      }`}>
                        {student.riskLevel}
                      </div>
                    </motion.div>
                  ))}
                  {studentsAtRisk.length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                      <p className="text-slate-600 text-sm font-medium">All students doing well!</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Pending Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="border-b border-slate-200 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    Pending Tasks
                  </h2>
                  <button
                    onClick={() => navigate("/school-teacher/tasks")}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition-colors"
                  >
                    View All <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {pendingTasks.slice(0, 4).map((task, idx) => (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -2 }}
                      onClick={() => navigate("/school-teacher/tasks")}
                      className="p-4 rounded-lg bg-gradient-to-r from-amber-50/50 via-orange-50/50 to-yellow-50/50 border border-amber-200/50 hover:border-amber-400 hover:shadow-md cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold text-slate-900 text-sm flex-1">{task.title}</p>
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ml-2 ${
                          task.priority === "high" ? "bg-red-500 text-white" :
                          task.priority === "medium" ? "bg-amber-500 text-white" :
                          "bg-emerald-500 text-white"
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{task.dueDate}</span>
                        <span className="mx-1">•</span>
                        <span>{task.class}</span>
                      </div>
                    </motion.div>
                  ))}
                  {pendingTasks.length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                      <p className="text-slate-600 text-sm font-medium">All caught up!</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 px-6 py-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  Quick Actions
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button
                    onClick={() => handleOpenInviteStudents()}
                    className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200 rounded-lg font-semibold text-slate-900 transition-all flex items-center justify-between group"
                  >
                    <span>Invite Students</span>
                    <UserPlus className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => navigate("/school-teacher/analytics")}
                    className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200 rounded-lg font-semibold text-slate-900 transition-all flex items-center justify-between group"
                  >
                    <span>Analytics Dashboard</span>
                    <BarChart3 className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => navigate("/school-teacher/messages")}
                    className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200 rounded-lg font-semibold text-slate-900 transition-all flex items-center justify-between group"
                  >
                    <span>View Messages</span>
                    <MessageSquare className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <InviteStudentsModal
        isOpen={showInviteStudents}
        onClose={() => {
          setShowInviteStudents(false);
          setSelectedClassForInvite(null);
        }}
        classId={selectedClassForInvite?.id}
        className={selectedClassForInvite?.name}
      />

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
    </div>
  );
};

export default TeacherOverview;
