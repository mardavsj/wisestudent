import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Heart, MessageSquare, Lightbulb, 
  TrendingUp, AlertTriangle, Smile, Frown, Meh,
  Calendar, Activity, Target, Brain, RefreshCw,
  Download, Filter, X, ChevronRight
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { 
  ChildInfoCard, 
  MoodWithPromptsCard, 
  HomeSupportPlanCard 
} from './ParentDashboard';

const ChildMoodWellbeing = () => {
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
  const [showMoodHistory, setShowMoodHistory] = useState(false);

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
        toast.success('Wellbeing data refreshed');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load wellbeing data');
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
      toast.loading('Generating mood report...');
      const response = await api.post(`/api/parent/child/${childId}/report`, {
        format: 'json',
        type: 'mood'
      });
      
      // Create a JSON report file with mood data
      const reportData = {
        ...response.data.reportData,
        moodAnalytics: {
          moodSummary: analytics?.moodSummary,
          homeSupportPlan: analytics?.homeSupportPlan
        }
      };
      
      const jsonString = JSON.stringify(reportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mood-wellbeing-report-${childId}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success('Mood report downloaded successfully');
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMoodEmoji = (score) => {
    if (score >= 4) return '😄';
    if (score === 3) return '😊';
    if (score === 2) return '😐';
    return '😔';
  };

  const getMoodColor = (score) => {
    if (score >= 4) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score === 3) return 'text-amber-600 bg-amber-50 border-amber-200';
    if (score === 2) return 'text-slate-600 bg-slate-50 border-slate-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
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
          <p className="text-slate-600 mb-4">Failed to load wellbeing data</p>
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
    moodSummary,
    homeSupportPlan
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
                  <Heart className="w-6 h-6" />
                  Mood & Mental Wellbeing
                </h1>
                <p className="text-sm text-white/80">
                  Track {childCard?.name || "your child"}'s emotional health and get support recommendations
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
                <h3 className="text-sm font-semibold text-slate-700">Date Range Filter</h3>
                <button
                  onClick={clearFilters}
                  className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              </div>
            </motion.div>
          )}
        </motion.div>
        {/* Mood Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <MoodWithPromptsCard moodSummary={moodSummary} />
        </motion.div>

        {/* Mood Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6"
        >
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Mood Statistics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <Smile className="w-6 h-6 text-emerald-600 mb-2" />
              <p className="text-xs font-medium text-slate-700 mb-1">Positive Days</p>
              <p className="text-2xl font-bold text-emerald-600">
                {moodSummary?.entries?.filter(e => e.score >= 4).length || 0}
              </p>
              <p className="text-xs text-slate-600 mt-1">out of {moodSummary?.entries?.length || 0} entries</p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <Meh className="w-6 h-6 text-amber-600 mb-2" />
              <p className="text-xs font-medium text-slate-700 mb-1">Neutral Days</p>
              <p className="text-2xl font-bold text-amber-600">
                {moodSummary?.entries?.filter(e => e.score === 3).length || 0}
              </p>
              <p className="text-xs text-slate-600 mt-1">balanced mood</p>
            </div>
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
              <Frown className="w-6 h-6 text-rose-600 mb-2" />
              <p className="text-xs font-medium text-slate-700 mb-1">Challenging Days</p>
              <p className="text-2xl font-bold text-rose-600">
                {moodSummary?.entries?.filter(e => e.score <= 2).length || 0}
              </p>
              <p className="text-xs text-slate-600 mt-1">needs attention</p>
            </div>
          </div>
        </motion.div>

        {/* Mood Alerts */}
        {moodSummary?.alerts && moodSummary.alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              Mood Alerts & Concerns
            </h2>
            <div className="space-y-2">
              {moodSummary.alerts.map((alert, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`p-3 rounded-lg border ${
                    alert.severity === 'high' 
                      ? 'bg-rose-50 border-rose-200' 
                      : 'bg-amber-50 border-amber-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className={`w-4 h-4 ${
                      alert.severity === 'high' ? 'text-rose-600' : 'text-amber-600'
                    } shrink-0 mt-0.5`} />
                    <div className="flex-1">
                      <p className={`font-semibold text-sm mb-0.5 ${
                        alert.severity === 'high' ? 'text-rose-900' : 'text-amber-900'
                      }`}>
                        {alert.type === 'alert' ? 'Alert' : 'Warning'}
                      </p>
                      <p className="text-xs text-slate-700">{alert.message}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Mood History Timeline */}
        {moodSummary?.entries && moodSummary.entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Mood History Timeline
              </h2>
              <button
                onClick={() => setShowMoodHistory(!showMoodHistory)}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
              >
                {showMoodHistory ? 'Hide' : 'View All'}
                <ChevronRight className={`w-4 h-4 transition-transform ${showMoodHistory ? 'rotate-90' : ''}`} />
              </button>
            </div>
            
            {showMoodHistory ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {moodSummary.entries.map((entry, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className={`p-3 rounded-lg border ${getMoodColor(entry.score)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getMoodEmoji(entry.score)}</span>
                        <div>
                          <p className="font-semibold text-sm text-slate-900">
                            Score: {entry.score}/5
                          </p>
                          <p className="text-xs text-slate-600">
                            {formatDate(entry.date || entry.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-slate-600">
                          {entry.note || entry.comment || 'No notes'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {moodSummary.entries.slice(0, 7).map((entry, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="text-center"
                  >
                    <div className={`p-3 rounded-lg border ${getMoodColor(entry.score)}`}>
                      <div className="text-2xl mb-1">{getMoodEmoji(entry.score)}</div>
                      <p className="text-xs font-semibold text-slate-700">{entry.score}/5</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(entry.date || entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default ChildMoodWellbeing;

