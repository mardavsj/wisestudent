import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, BarChart3, BookOpen, Heart, Wallet,
  TrendingUp, Activity, Target, Award, Zap,
  Coins, Flame, Brain, Gamepad2, ArrowRight,
  Eye, Trophy, RefreshCw, Download,
  Lightbulb, AlertCircle, CheckCircle, X
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { ChildInfoCard, SnapshotKPIsStrip, DigitalTwinGrowthCard, SkillsDistributionCard } from './ParentDashboard';

const ParentChildAnalytics = () => {
  const navigate = useNavigate();
  const { childId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const fetchChildAnalytics = useCallback(async (showToast = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);
      
      const url = `/api/parent/child/${childId}/analytics${params.toString() ? `?${params.toString()}` : ''}`;
      const analyticsRes = await api.get(url);
      setAnalytics(analyticsRes.data);
      if (showToast) {
        toast.success('Analytics refreshed');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
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
      setExporting(true);
      const response = await api.post(`/api/parent/child/${childId}/report`, {
        format: 'json',
        type: 'analytics'
      });
      
      // Create a JSON report file with all analytics data
      const reportData = {
        ...response.data.reportData,
        analytics: {
          snapshotKPIs: analytics?.snapshotKPIs,
          overallMastery: analytics?.overallMastery,
          digitalTwinData: analytics?.digitalTwinData,
          skillsDistribution: analytics?.skillsDistribution,
          weeklyEngagement: analytics?.weeklyEngagement,
          moodSummary: analytics?.moodSummary,
          homeSupportPlan: analytics?.homeSupportPlan
        }
      };
      
      const jsonString = JSON.stringify(reportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-report-${childId}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('Error exporting report:', error);
      if (error.response?.status === 404) {
        toast.error('Child not found or access denied');
      } else {
        toast.error('Failed to export report');
      }
    } finally {
      setExporting(false);
    }
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
          <p className="text-slate-600 mb-4">Failed to load analytics</p>
          <button
            onClick={() => navigate('/parent/children')}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Back to Children
          </button>
        </div>
      </div>
    );
  }

  const {
    childCard,
    snapshotKPIs,
    level,
    xp,
    streak,
    healCoins,
    digitalTwinData,
    skillsDistribution,
    weeklyEngagement,
    recentAchievements
  } = analytics;

  const QuickAccessCard = ({ title, description, icon: Icon, color, onClick }) => (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 hover:border-indigo-300 cursor-pointer transition-all"
    >
      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-indigo-600" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-xs text-slate-600 mb-3">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-indigo-600 font-medium text-xs">View Details</span>
        <ArrowRight className="w-4 h-4 text-indigo-600" />
      </div>
    </motion.div>
  );

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
              onClick={() => navigate('/parent/children')}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back to My Children</span>
            </button>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  {childCard?.name || "Child"}'s Analytics
                </h1>
                <p className="text-sm text-white/80">
                  Comprehensive overview of learning progress and development
                </p>
              </div>
              <div className="flex items-center gap-2">
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
                  disabled={exporting || loading}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                  title="Export Report"
                >
                  <Download className={`w-4 h-4 ${exporting ? 'animate-pulse' : ''}`} />
                </button>
              </div>
            </div>
          </div>

        </motion.div>
        {/* Child Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <ChildInfoCard childCard={childCard} />
        </motion.div>

        {/* Snapshot KPIs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <SnapshotKPIsStrip 
            kpis={snapshotKPIs} 
            level={level} 
            xp={xp} 
            streak={streak} 
            healCoins={typeof healCoins === 'object' ? healCoins?.currentBalance : healCoins}
          />
        </motion.div>

        {/* Quick Access Navigation Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            Detailed Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickAccessCard
              title="Learning Progress"
              description="Detailed progress reports, achievements, and activity timeline"
              icon={BookOpen}
              color="from-blue-500 to-cyan-600"
              onClick={() => navigate(`/parent/child/${childId}/progress`)}
            />
            <QuickAccessCard
              title="Mood & Wellbeing"
              description="Mental health tracking, conversation prompts, and support plans"
              icon={Heart}
              color="from-pink-500 to-rose-600"
              onClick={() => navigate(`/parent/child/${childId}/wellbeing`)}
            />
            <QuickAccessCard
              title="Wallet & Rewards"
              description="HealCoins transactions, redemptions, and financial activity"
              icon={Wallet}
              color="from-green-500 to-emerald-600"
              onClick={() => navigate(`/parent/child/${childId}/wallet`)}
            />
          </div>
        </motion.div>

        {/* Growth Charts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Growth & Development Charts
          </h2>
            <div className="grid grid-cols-1 gap-4">
          <DigitalTwinGrowthCard digitalTwinData={digitalTwinData} skillsDistribution={skillsDistribution} />
            <SkillsDistributionCard skillsDistribution={skillsDistribution} />
          </div>
        </motion.div>

        {/* Weekly Engagement Overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
        >
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            Weekly Engagement Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <Gamepad2 className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-xs font-medium text-slate-700 mb-1">Games Played</p>
              <p className="text-2xl font-bold text-blue-600">{weeklyEngagement?.gameSessions || 0}</p>
            </div>
            <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
              <Activity className="w-6 h-6 text-indigo-600 mb-2" />
              <p className="text-xs font-medium text-slate-700 mb-1">Total Time</p>
              <p className="text-2xl font-bold text-indigo-600">{weeklyEngagement?.totalMinutes || 0}</p>
              <p className="text-xs text-slate-600 mt-1">minutes this week</p>
            </div>
          </div>
        </motion.div>

        {/* Recent Achievements Preview */}
        {recentAchievements && recentAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-indigo-600" />
                Recent Achievements
              </h2>
              <button
                onClick={() => navigate(`/parent/child/${childId}/progress`)}
                className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1.5 text-sm"
              >
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentAchievements.slice(0, 6).map((achievement, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  whileHover={{ y: -2 }}
                  className="rounded-lg border border-amber-200 bg-amber-50 p-3"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                      {achievement.type === 'badge' ? (
                        <Award className="w-4 h-4 text-white" />
                      ) : (
                        <Trophy className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">{achievement.game}</p>
                      <p className="text-xs text-slate-600 truncate">{achievement.category}</p>
                    </div>
                  </div>
                  <p className="text-xs text-amber-700 font-medium">{achievement.achievement}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ParentChildAnalytics;

