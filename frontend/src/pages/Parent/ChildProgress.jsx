import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Trophy, Activity, Target,
  TrendingUp, Star, Award, Zap, Brain, Gamepad2,
  RefreshCw, Download, Filter, X, ChevronDown, ChevronUp, Clock
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { 
  ChildInfoCard, 
  DetailedProgressReportCard, 
  ActivityTimelineCard,
  AchievementsCard
} from './ParentDashboard';

const ChildProgress = () => {
  const navigate = useNavigate();
  const { childId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [parentProfile, setParentProfile] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [selectedPillar, setSelectedPillar] = useState('all');
  const [activityFilter, setActivityFilter] = useState('all');

  const fetchChildAnalytics = useCallback(async (showToast = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);
      
      const url = `/api/parent/child/${childId}/analytics${params.toString() ? `?${params.toString()}` : ''}`;
      const [analyticsRes, profileRes] = await Promise.all([
        api.get(url),
        api.get("/api/user/profile").catch(() => ({ data: null }))
      ]);
      setAnalytics(analyticsRes.data);
      setParentProfile(profileRes.data);
      if (showToast) {
        toast.success('Progress data refreshed');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [childId, dateRange]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchChildAnalytics(true);
  };

  const handleExport = async () => {
    try {
      toast.loading('Generating progress report...');
      const response = await api.post(`/api/parent/child/${childId}/report`, {
        format: 'json',
        type: 'progress'
      });
      
      // Create a JSON report file
      const reportData = {
        ...response.data.reportData,
        analytics: {
          overallMastery: analytics?.overallMastery,
          detailedProgressReport: analytics?.detailedProgressReport,
          recentAchievements: analytics?.recentAchievements,
          activityTimeline: analytics?.activityTimeline
        }
      };
      
      const jsonString = JSON.stringify(reportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `progress-report-${childId}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success('Progress report downloaded successfully');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.dismiss();
      if (error.response?.status === 404) {
        toast.error('Child not found or access denied');
      } else {
        toast.error('Failed to export report');
      }
    }
  };

  const clearFilters = () => {
    setDateRange({ startDate: '', endDate: '' });
    setSelectedPillar('all');
    setActivityFilter('all');
  };

  useEffect(() => {
    if (childId) {
      fetchChildAnalytics();
    }
  }, [childId]);

  useEffect(() => {
    if (childId && (dateRange.startDate || dateRange.endDate)) {
      const timeoutId = setTimeout(() => {
        fetchChildAnalytics();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [dateRange, childId]);

  // Filter activities based on selected filter
  const getFilteredActivities = () => {
    if (!analytics?.activityTimeline) return [];
    let filtered = [...analytics.activityTimeline];
    
    if (activityFilter !== 'all') {
      filtered = filtered.filter(activity => activity.type === activityFilter);
    }
    
    if (selectedPillar !== 'all') {
      filtered = filtered.filter(activity => 
        activity.category?.toLowerCase().includes(selectedPillar.toLowerCase()) ||
        activity.details?.category?.toLowerCase().includes(selectedPillar.toLowerCase())
      );
    }
    
    return filtered;
  };

  // Filter achievements based on selected pillar
  const getFilteredAchievements = () => {
    if (!analytics?.recentAchievements) return [];
    if (selectedPillar === 'all') return analytics.recentAchievements;
    return analytics.recentAchievements.filter(achievement =>
      achievement.category?.toLowerCase().includes(selectedPillar.toLowerCase())
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Failed to load progress data</p>
          <button
            onClick={() => navigate(`/parent/child/${childId}/analytics`)}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Back to Analytics
          </button>
        </div>
      </div>
    );
  }

  const {
    childCard,
    detailedProgressReport,
    activityTimeline,
    recentAchievements,
    overallMastery
  } = analytics;

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
            <button
              onClick={() => navigate(`/parent/child/${childId}/analytics`)}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back to Analytics Overview</span>
            </button>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                  <BookOpen className="w-6 h-6" />
                  Learning Progress & Development
                </h1>
                <p className="text-sm text-white/80">
                  Detailed insights into {analytics?.childCard?.name || analytics?.childName || "your child"}'s learning journey
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Filters"
                >
                  <Filter className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing || loading}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                  title="Refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={handleExport}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Export Report"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-6 py-4 bg-slate-50 border-t border-slate-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-700">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Pillar/Category</label>
                  <select
                    value={selectedPillar}
                    onChange={(e) => setSelectedPillar(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Pillars</option>
                    {analytics?.overallMastery?.byPillar && Object.keys(analytics.overallMastery.byPillar).map(pillar => (
                      <option key={pillar} value={pillar.toLowerCase()}>{pillar}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Activity Type</label>
                  <select
                    value={activityFilter}
                    onChange={(e) => setActivityFilter(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Activities</option>
                    <option value="game">Games</option>
                    <option value="lesson">Lessons</option>
                    <option value="quiz">Quizzes</option>
                    <option value="mood">Mood Logs</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
        {/* Overall Mastery */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6"
        >
          <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            Overall Mastery by Pillar
          </h2>
            <div className="space-y-3">
              {analytics?.overallMastery?.byPillar && (() => {
                const gender = (analytics?.detailedProgressReport?.childGender || '').toLowerCase();
                return Object.entries(analytics.overallMastery.byPillar).filter(([pillar]) => {
                  if (gender === 'male') return pillar !== 'Health - Female';
                  if (gender === 'female') return pillar !== 'Health - Male';
                  return true;
                });
              })().map(([pillar, percentage], idx) => {
                const colorClasses = [
                  'from-blue-500 to-indigo-600',
                  'from-emerald-500 to-teal-600',
                  'from-purple-500 to-pink-600',
                  'from-amber-500 to-orange-600',
                  'from-rose-500 to-red-600',
                  'from-cyan-500 to-sky-600'
                ];
                const mastery = (() => {
                  if (Array.isArray(percentage)) {
                    const values = percentage.map(Number).filter((value) => Number.isFinite(value));
                    if (values.length === 0) return 0;
                    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
                  }
                  const value = Number(percentage);
                  return Number.isFinite(value) ? value : 0;
                })();
                const clampedMastery = Math.max(0, Math.min(100, mastery));
                return (
                  <motion.div
                    key={pillar}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-slate-700 capitalize">{pillar}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${clampedMastery}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.03 + 0.2 }}
                        className={`bg-gradient-to-r ${colorClasses[idx % colorClasses.length]} h-2 rounded-full`}
                      />
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </motion.div>

        {/* Detailed Progress Report */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <DetailedProgressReportCard progressReport={analytics?.detailedProgressReport} />
        </motion.div>

        {/* Recent Achievements */}
        {analytics?.recentAchievements && analytics.recentAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <AchievementsCard achievements={getFilteredAchievements()} />
          </motion.div>
        )}

        {/* Progress Summary Stats */}
        {analytics?.detailedProgressReport && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Progress Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <Gamepad2 className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-xs font-medium text-slate-700 mb-1">Games Completed</p>
                <p className="text-2xl font-bold text-blue-600">{analytics.detailedProgressReport.gamesCompleted || 0}</p>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <Zap className="w-6 h-6 text-emerald-600 mb-2" />
                <p className="text-xs font-medium text-slate-700 mb-1">HealCoins Earned</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {analytics?.detailedProgressReport?.totalCoinsEarned
                    ?? ((analytics?.detailedProgressReport?.weeklyCoins || 0)
                      + (analytics?.detailedProgressReport?.monthlyCoins || 0))}
                </p>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <Clock className="w-6 h-6 text-amber-600 mb-2" />
                <p className="text-xs font-medium text-slate-700 mb-1">Time Spent</p>
                <p className="text-2xl font-bold text-amber-600">{analytics.detailedProgressReport.timeSpent || 0}m</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChildProgress;

