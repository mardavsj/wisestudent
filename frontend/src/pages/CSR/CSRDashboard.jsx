import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  Users, Activity, MapPin, Clock, DollarSign, Target, TrendingUp,
  Bell, Calendar, AlertTriangle, ArrowRight, BarChart3, Sparkles, Zap
} from 'lucide-react';
import { csrOverviewService } from '../../services/csrOverviewService';
import csrGoalService from '../../services/csrGoalService';
import csrComplianceService from '../../services/csrComplianceService';
import csrAlertService from '../../services/csrAlertService';
import { useSocket } from '../../context/SocketContext';

const CSRDashboard = () => {
  const socketContext = useSocket();
  const socket = socketContext?.socket || null;
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [overviewData, setOverviewData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [liveStats, setLiveStats] = useState(null);
  const [goalsSummary, setGoalsSummary] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(0);
  const [activeGoals, setActiveGoals] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null);

      const [
        overviewResponse,
        activityResponse,
        liveStatsResponse,
        goalsProgressResponse,
        upcomingEventsResponse,
        unreadAlertsResponse,
        goalsResponse
      ] = await Promise.all([
        csrOverviewService.getOverviewData({ period: timeRange }),
        csrOverviewService.getRecentActivity(10),
        csrOverviewService.getLiveStats(),
        csrGoalService.getGoalProgress().catch(() => ({ data: null })),
        csrComplianceService.getUpcomingEvents().catch(() => ({ data: [] })),
        csrAlertService.getUnreadAlertsCount().catch(() => ({ count: 0 })),
        csrGoalService.getGoals({ status: 'active' }).catch(() => ({ data: [] }))
      ]);

      setOverviewData(overviewResponse.data);
      setRecentActivity(activityResponse.data);
      setLiveStats(liveStatsResponse.data);
      setGoalsSummary(goalsProgressResponse?.data || null);
      setUpcomingEvents(upcomingEventsResponse?.data || []);
      setUnreadAlertsCount(unreadAlertsResponse?.count || 0);
      setActiveGoals((goalsResponse?.data || []).slice(0, 3));
    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);
      
      if (err.response?.status === 401) {
        return;
      }
      
      setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  // Initial data fetch and when time range changes
  useEffect(() => {
    setLoading(true);
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Real-time updates via Socket.IO
  useEffect(() => {
    if (!socket) return;

    // Listen for CSR dashboard updates
    const handleDashboardUpdate = (data) => {
      if (data.overviewData) setOverviewData(data.overviewData);
      if (data.liveStats) setLiveStats(data.liveStats);
      if (data.recentActivity) setRecentActivity(data.recentActivity);
    };

    // Listen for goals updates
    const handleGoalsUpdate = async () => {
      try {
        const [goalsProgressResponse, goalsResponse] = await Promise.all([
          csrGoalService.getGoalProgress().catch(() => ({ data: null })),
          csrGoalService.getGoals({ status: 'active' }).catch(() => ({ data: [] }))
        ]);
        setGoalsSummary(goalsProgressResponse?.data || null);
        setActiveGoals((goalsResponse?.data || []).slice(0, 3));
      } catch (error) {
        console.error('Error updating goals:', error);
      }
    };

    // Listen for compliance events updates
    const handleComplianceUpdate = async () => {
      try {
        const response = await csrComplianceService.getUpcomingEvents().catch(() => ({ data: [] }));
        setUpcomingEvents(response?.data || []);
      } catch (error) {
        console.error('Error updating compliance events:', error);
      }
    };

    // Listen for alerts updates
    const handleAlertsUpdate = async () => {
      try {
        const response = await csrAlertService.getUnreadAlertsCount().catch(() => ({ count: 0 }));
        setUnreadAlertsCount(response?.count || 0);
      } catch (error) {
        console.error('Error updating alerts:', error);
      }
    };

    // Handle new activity events
    const handleNewActivity = (activity) => {
      setRecentActivity(prev => [activity, ...prev].slice(0, 10));
    };

    // Subscribe to real-time events
    socket.on('csr:dashboard:update', handleDashboardUpdate);
    socket.on('csr:goals:update', handleGoalsUpdate);
    socket.on('csr:compliance:update', handleComplianceUpdate);
    socket.on('csr:alerts:update', handleAlertsUpdate);
    socket.on('csr:activity:new', handleNewActivity);

    // Cleanup listeners
    return () => {
      socket.off('csr:dashboard:update', handleDashboardUpdate);
      socket.off('csr:goals:update', handleGoalsUpdate);
      socket.off('csr:compliance:update', handleComplianceUpdate);
      socket.off('csr:alerts:update', handleAlertsUpdate);
      socket.off('csr:activity:new', handleNewActivity);
    };
  }, [socket]);

  // Fallback polling for real-time updates (every 30 seconds if socket not available)
  useEffect(() => {
    if (socket) return; // Don't poll if socket is available

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [socket, fetchDashboardData]);

  // Quick stats with colorful gradients
  const quickStats = [
    {
      title: 'Students Impacted',
      value: overviewData?.studentsImpacted?.toLocaleString() || '0',
      change: overviewData?.studentsGrowth ? `+${overviewData.studentsGrowth.toFixed(1)}%` : '+0%',
      changeType: 'positive',
      icon: Users,
      gradient: 'from-blue-500 via-cyan-400 to-blue-600',
      bgGradient: 'from-blue-50 via-cyan-50 to-blue-50',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      iconColor: 'text-white',
      shadowColor: 'shadow-blue-500/20'
    },
    {
      title: 'Schools Reached',
      value: overviewData?.schoolsReached?.toString() || '0',
      change: overviewData?.schoolsGrowth ? `+${overviewData.schoolsGrowth.toFixed(1)}%` : 'N/A',
      changeType: 'positive',
      icon: Target,
      gradient: 'from-green-500 via-emerald-400 to-green-600',
      bgGradient: 'from-green-50 via-emerald-50 to-green-50',
      iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500',
      iconColor: 'text-white',
      shadowColor: 'shadow-green-500/20'
    },
    {
      title: 'Total Value Funded',
      value: overviewData?.totalValueFunded ? `₹${(overviewData.totalValueFunded / 100000).toFixed(1)}L` : '₹0L',
      change: overviewData?.valueFundedGrowth ? `+${overviewData.valueFundedGrowth.toFixed(1)}%` : 'N/A',
      changeType: 'positive',
      icon: DollarSign,
      gradient: 'from-purple-500 via-pink-400 to-purple-600',
      bgGradient: 'from-purple-50 via-pink-50 to-purple-50',
      iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500',
      iconColor: 'text-white',
      shadowColor: 'shadow-purple-500/20'
    },
    {
      title: 'Active Users',
      value: liveStats?.activeUsers?.toString() || '0',
      change: liveStats?.usersGrowth ? `+${liveStats.usersGrowth.toFixed(1)}%` : 'N/A',
      changeType: 'positive',
      icon: Activity,
      gradient: 'from-orange-500 via-red-400 to-orange-600',
      bgGradient: 'from-orange-50 via-red-50 to-orange-50',
      iconBg: 'bg-gradient-to-br from-orange-500 to-red-500',
      iconColor: 'text-white',
      shadowColor: 'shadow-orange-500/20'
    }
  ];

  // Quick summary cards with colors
  const summaryCards = [
    {
      title: 'Active Goals',
      value: goalsSummary?.totalActive || 0,
      subtitle: `${goalsSummary?.completed || 0} completed`,
      icon: Target,
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      iconColor: 'text-white',
      link: '/csr/goals',
      shadowColor: 'shadow-blue-500/20'
    },
    {
      title: 'Upcoming Events',
      value: upcomingEvents.length || 0,
      subtitle: 'Compliance deadlines',
      icon: Calendar,
      gradient: 'from-green-500 to-teal-600',
      bgGradient: 'from-green-50 to-teal-50',
      iconBg: 'bg-gradient-to-br from-green-500 to-teal-600',
      iconColor: 'text-white',
      link: '/csr/compliance',
      shadowColor: 'shadow-green-500/20'
    },
    {
      title: 'Unread Alerts',
      value: unreadAlertsCount || 0,
      subtitle: unreadAlertsCount > 0 ? 'Requires attention' : 'All clear',
      icon: Bell,
      gradient: unreadAlertsCount > 0 ? 'from-red-500 to-rose-600' : 'from-gray-400 to-gray-600',
      bgGradient: unreadAlertsCount > 0 ? 'from-red-50 to-rose-50' : 'from-gray-50 to-slate-50',
      iconBg: unreadAlertsCount > 0 ? 'bg-gradient-to-br from-red-500 to-rose-600' : 'bg-gradient-to-br from-gray-400 to-gray-600',
      iconColor: 'text-white',
      link: '/csr/alerts',
      badge: unreadAlertsCount > 0,
      shadowColor: unreadAlertsCount > 0 ? 'shadow-red-500/20' : 'shadow-gray-400/20'
    }
  ];

  // Calculate progress percentage
  const getGoalProgress = (goal) => {
    if (!goal.targetValue || goal.targetValue === 0) return 0;
    const current = goal.currentValue || 0;
    return Math.min((current / goal.targetValue) * 100, 100);
  };

  // Get progress color based on percentage
  const getProgressColor = (progress) => {
    if (progress >= 80) return 'from-green-500 via-emerald-400 to-green-600';
    if (progress >= 50) return 'from-blue-500 via-cyan-400 to-blue-600';
    if (progress >= 30) return 'from-yellow-500 via-orange-400 to-yellow-600';
    return 'from-red-500 via-rose-400 to-red-600';
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get days until event
  const getDaysUntil = (dateString) => {
    if (!dateString) return 0;
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Dashboard</h2>
          <p className="text-gray-600">Fetching your CSR impact data...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md bg-white rounded-2xl p-8 shadow-xl border border-red-200"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setLoading(true);
              fetchDashboardData();
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-50/95 via-purple-50/95 to-pink-50/95 backdrop-blur-xl border-b border-indigo-200/60 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-md shadow-indigo-500/30 flex-shrink-0">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                    CSR Impact Dashboard
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm mt-0.5 hidden sm:block">
                    Comprehensive overview of your corporate social responsibility initiatives
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white border border-purple-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all cursor-pointer"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-white rounded-xl shadow-md border border-gray-100 px-4 py-3"
        >
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </div>
              <span className="font-bold text-gray-900">Live Data</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4 text-purple-500" />
              <span className="font-medium">Last updated: {overviewData?.lastUpdated ? new Date(overviewData.lastUpdated).toLocaleTimeString() : new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{overviewData?.regionsActive || 0} Active Regions</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Activity className="w-4 h-4 text-orange-500" />
              <span className="font-medium">{liveStats?.activeUsers || 0} Active Users</span>
            </div>
            {socket && (
              <div className="flex items-center gap-2 ml-auto">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </div>
                <span className="text-xs text-blue-600 font-bold">Real-time enabled</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ y: -2, scale: 1.01 }}
                className={`relative overflow-hidden bg-white rounded-xl shadow-md border border-gray-100 ${stat.bgGradient ? `bg-gradient-to-br ${stat.bgGradient}` : ''}`}
              >
                <div className="relative p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 ${stat.iconBg} rounded-lg shadow-sm`}>
                      <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                    </div>
                    {stat.change !== 'N/A' && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-xs font-semibold">
                        <TrendingUp className="w-3 h-3" />
                        <span>{stat.change}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-0.5">
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs font-semibold text-gray-600">{stat.title}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + index * 0.05 }}
                whileHover={{ y: -2, scale: 1.01 }}
              >
                <Link
                  to={card.link}
                  className={`block group relative overflow-hidden bg-white rounded-xl shadow-md border border-gray-100 ${card.bgGradient ? `bg-gradient-to-br ${card.bgGradient}` : ''}`}
                >
                  <div className="relative p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 ${card.iconBg} rounded-lg shadow-sm`}>
                        <Icon className={`w-5 h-5 ${card.iconColor}`} />
                      </div>
                      {card.badge && (
                        <div className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
                      <p className="text-xs font-semibold text-gray-700">{card.title}</p>
                      <p className="text-xs text-gray-600 mt-1 font-medium">{card.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                      <span>View all</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Active Goals & Upcoming Events Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Active Goals Overview */}
          {activeGoals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Active Goals</h2>
                    <p className="text-xs text-gray-600">Track your progress</p>
                  </div>
                </div>
                <Link
                  to="/csr/goals"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                >
                  View all
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              
              <div className="space-y-3">
                {activeGoals.slice(0, 3).map((goal, index) => {
                  const progress = getGoalProgress(goal);
                  const progressColor = getProgressColor(progress);
                  return (
                    <motion.div
                      key={goal._id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 + index * 0.1 }}
                      className="pb-3 border-b border-gray-200 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-900 truncate flex-1">{goal.goalName || goal.name}</p>
                        <span className="text-sm font-bold text-gray-900 ml-3">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          className={`h-full bg-gradient-to-r ${progressColor} rounded-full`}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-gray-600">{goal.currentValue || 0} / {goal.targetValue || 0} {goal.unit || ''}</span>
                        {goal.endDate && (
                          <span className="text-gray-600">Due {formatDate(goal.endDate)}</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Upcoming Compliance Events */}
          {upcomingEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Upcoming Events</h2>
                    <p className="text-xs text-gray-600">Compliance deadlines</p>
                  </div>
                </div>
                <Link
                  to="/csr/compliance"
                  className="text-xs font-semibold text-green-600 hover:text-green-700 flex items-center gap-1 transition-colors"
                >
                  View all
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              
              <div className="space-y-3">
                {upcomingEvents.slice(0, 5).map((event, index) => {
                  const daysUntil = getDaysUntil(event.dueDate);
                  const isOverdue = daysUntil < 0;
                  const isUrgent = daysUntil >= 0 && daysUntil <= 7;
                  
                  return (
                    <motion.div
                      key={event._id || index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="pb-3 border-b border-gray-200 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate mb-1">{event.eventName || event.name}</p>
                          <p className="text-xs text-gray-600">{event.description || event.category}</p>
                        </div>
                        {isOverdue && (
                          <div className="ml-3 flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-md text-xs font-semibold">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Overdue</span>
                          </div>
                        )}
                        {!isOverdue && isUrgent && (
                          <div className="ml-3 flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-md text-xs font-semibold">
                            <span>Urgent</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-gray-600">{formatDate(event.dueDate)}</span>
                        <span className={isOverdue ? 'text-red-600 font-bold' : isUrgent ? 'text-orange-600 font-bold' : 'text-gray-600'}>
                          {isOverdue ? `${Math.abs(daysUntil)} days overdue` : daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

        {/* Recent Activity Feed */}
        {recentActivity && recentActivity.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-md border border-gray-100 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <Activity className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                  <p className="text-xs text-gray-600">Live updates</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </div>
                <span className="text-green-600">Live</span>
              </div>
            </div>
            
            <div className="space-y-2">
              {recentActivity.slice(0, 8).map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + index * 0.05 }}
                  className="flex items-start gap-3 p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer group"
                >
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                    activity.color === 'blue' ? 'bg-blue-500' :
                    activity.color === 'green' ? 'bg-green-500' :
                    activity.color === 'orange' ? 'bg-orange-500' :
                    activity.color === 'purple' ? 'bg-purple-500' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 group-hover:text-purple-700 transition-colors mb-0.5">{activity.action}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-600">{activity.location}</p>
                      <span className="text-xs text-gray-400">•</span>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CSRDashboard;
