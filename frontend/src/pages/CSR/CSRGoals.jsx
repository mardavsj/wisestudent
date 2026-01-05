import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Plus, Edit, Trash2, CheckCircle, AlertTriangle, Clock,
  TrendingUp, TrendingDown, Calendar, Award, BarChart3, X,
  Save, Eye, MessageSquare, Filter, Download, ArrowRight, Percent
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import csrGoalService from '../../services/csrGoalService';
import { exportToCSV } from '../../utils/exportUtils';

const CSRGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    period: 'all',
    goalType: 'all'
  });
  const [progressSummary, setProgressSummary] = useState(null);

  const [formData, setFormData] = useState({
    goalName: '',
    description: '',
    goalType: 'students_reached',
    category: 'impact',
    period: 'quarterly',
    startDate: '',
    endDate: '',
    targetValue: '',
    unit: 'count',
    priority: 'medium',
    milestones: []
  });

  useEffect(() => {
    loadGoals();
    loadProgressSummary();
  }, [filters]);

  const loadGoals = async () => {
    setLoading(true);
    try {
      const queryParams = {};
      if (filters.status !== 'all') queryParams.status = filters.status;
      if (filters.period !== 'all') queryParams.period = filters.period;
      if (filters.goalType !== 'all') queryParams.goalType = filters.goalType;

      const response = await csrGoalService.getGoals(queryParams);
      setGoals(response.data || []);
    } catch (error) {
      console.error('Error loading goals:', error);
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const loadProgressSummary = async () => {
    try {
      const response = await csrGoalService.getGoalProgress();
      setProgressSummary(response.data);
    } catch (error) {
      console.error('Error loading progress summary:', error);
    }
  };

  const handleCreateGoal = async () => {
    try {
      if (!formData.goalName || !formData.startDate || !formData.endDate || !formData.targetValue) {
        toast.error('Please fill in all required fields');
        return;
      }

      await csrGoalService.createGoal(formData);
      toast.success('Goal created successfully');
      setShowCreateModal(false);
      resetForm();
      loadGoals();
      loadProgressSummary();
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error(error.response?.data?.message || 'Failed to create goal');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    try {
      await csrGoalService.deleteGoal(goalId);
      toast.success('Goal deleted successfully');
      loadGoals();
      loadProgressSummary();
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  const resetForm = () => {
    setFormData({
      goalName: '',
      description: '',
      goalType: 'students_reached',
      category: 'impact',
      period: 'quarterly',
      startDate: '',
      endDate: '',
      targetValue: '',
      unit: 'count',
      priority: 'medium',
      milestones: []
    });
  };

  const handleExportGoals = () => {
    try {
      if (goals.length === 0) {
        toast.error('No goals to export');
        return;
      }

      const exportData = goals.map(goal => ({
        'Goal ID': goal.goalId || '',
        'Goal Name': goal.goalName || '',
        'Type': goal.goalType || '',
        'Category': goal.category || '',
        'Period': goal.period || '',
        'Status': goal.status || '',
        'Priority': goal.priority || '',
        'Target Value': goal.targetValue || 0,
        'Current Value': goal.currentValue || 0,
        'Progress %': goal.progress?.percentage?.toFixed(1) || 0,
        'Start Date': goal.startDate ? new Date(goal.startDate).toLocaleDateString() : '',
        'End Date': goal.endDate ? new Date(goal.endDate).toLocaleDateString() : '',
        'Days Remaining': goal.daysRemaining || 0
      }));

      exportToCSV(exportData, 'csr-goals');
      toast.success('Goals exported successfully');
    } catch (error) {
      console.error('Error exporting goals:', error);
      toast.error('Failed to export goals');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', badge: 'bg-green-100 text-green-800' };
      case 'on_track': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-800' };
      case 'at_risk': return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-800' };
      case 'behind': return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-800' };
      case 'active': return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', badge: 'bg-gray-100 text-gray-800' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', badge: 'bg-gray-100 text-gray-800' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'on_track': return TrendingUp;
      case 'at_risk': return AlertTriangle;
      case 'behind': return TrendingDown;
      default: return Clock;
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'from-green-500 to-emerald-500';
    if (progress >= 50) return 'from-blue-500 to-cyan-500';
    if (progress >= 30) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const goalTypes = [
    { value: 'students_reached', label: 'Students Reached' },
    { value: 'schools_reached', label: 'Schools Reached' },
    { value: 'budget_utilization', label: 'Budget Utilization' },
    { value: 'campaign_completion', label: 'Campaign Completion' },
    { value: 'engagement_lift', label: 'Engagement Lift' },
    { value: 'certificates_issued', label: 'Certificates Issued' }
  ];

  const periods = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'custom', label: 'Custom' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"
          />
          <h2 className="text-sm font-bold text-gray-900 mb-1">Loading Goals</h2>
          <p className="text-xs text-gray-600">Fetching goal data...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50/95 via-purple-50/95 to-pink-50/95 backdrop-blur-xl border-b border-indigo-200/60 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-md shadow-indigo-500/30 flex-shrink-0">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                    Goal Management
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm mt-0.5 hidden sm:block">
                    Set, track, and monitor strategic CSR goals with progress indicators
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportGoals}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                title="Export Goals"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Create Goal
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Progress Summary */}
        {progressSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6"
          >
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="text-xs font-semibold text-gray-600 mb-1">Total Goals</div>
              <div className="text-3xl font-bold text-gray-900">{progressSummary.total}</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 shadow-md border border-green-200">
              <div className="text-xs font-semibold text-gray-600 mb-1">On Track</div>
              <div className="text-3xl font-bold text-green-600">{progressSummary.onTrack}</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 shadow-md border border-yellow-200">
              <div className="text-xs font-semibold text-gray-600 mb-1">At Risk</div>
              <div className="text-3xl font-bold text-yellow-600">{progressSummary.atRisk}</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 shadow-md border border-orange-200">
              <div className="text-xs font-semibold text-gray-600 mb-1">Behind</div>
              <div className="text-3xl font-bold text-orange-600">{progressSummary.behind}</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 shadow-md border border-blue-200">
              <div className="text-xs font-semibold text-gray-600 mb-1">Avg Progress</div>
              <div className="text-3xl font-bold text-blue-600">{progressSummary.averageProgress?.toFixed(1) || 0}%</div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-md border border-gray-100 mb-6"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-700">Filters:</span>
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="on_track">On Track</option>
              <option value="at_risk">At Risk</option>
              <option value="behind">Behind</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={filters.period}
              onChange={(e) => setFilters({ ...filters, period: e.target.value })}
              className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400"
            >
              <option value="all">All Periods</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <select
              value={filters.goalType}
              onChange={(e) => setFilters({ ...filters, goalType: e.target.value })}
              className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400"
            >
              <option value="all">All Types</option>
              {goalTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-8 text-center shadow-md border border-gray-100"
          >
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-900 mb-1.5">No Goals Found</h3>
            <p className="text-xs text-gray-600 mb-4">Create your first goal to start tracking progress</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all"
            >
              Create Goal
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal, index) => {
              const StatusIcon = getStatusIcon(goal.status);
              const statusColors = getStatusColor(goal.status);
              const progress = goal.progress?.percentage || 0;
              const daysRemaining = goal.daysRemaining || 0;

              return (
                <motion.div
                  key={goal._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2, scale: 1.01 }}
                  className={`bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">{goal.goalName}</h3>
                      {goal.description && (
                        <p className="text-xs text-gray-600 line-clamp-2">{goal.description}</p>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${statusColors.badge} whitespace-nowrap ml-2`}>
                      {goal.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <StatusIcon className={`w-3.5 h-3.5 ${statusColors.text}`} />
                        <span className="text-xs font-semibold text-gray-700">Progress</span>
                      </div>
                      <span className="text-xs font-bold text-gray-900">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className={`h-full bg-gradient-to-r ${getProgressColor(progress)} rounded-full`}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Current</div>
                      <div className="text-sm font-bold text-gray-900">{goal.currentValue?.toLocaleString() || 0}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Target</div>
                      <div className="text-sm font-bold text-gray-900">{goal.targetValue?.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="capitalize">{goal.period}</span>
                      </div>
                      {daysRemaining > 0 && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{daysRemaining}d left</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedGoal(goal)}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteGoal(goal._id)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Create Goal Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-5 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Create New Goal</h2>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Goal Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.goalName}
                      onChange={(e) => setFormData({ ...formData, goalName: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                      placeholder="e.g., Reach 10,000 students this quarter"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                      rows={3}
                      placeholder="Describe the goal and its importance"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Goal Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.goalType}
                        onChange={(e) => setFormData({ ...formData, goalType: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                      >
                        {goalTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Period <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.period}
                        onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                      >
                        {periods.map(period => (
                          <option key={period.value} value={period.value}>{period.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Target Value <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.targetValue}
                        onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                        placeholder="e.g., 10000"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateGoal}
                    className="flex-1 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all"
                  >
                    Create Goal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Goal Detail Modal */}
        <AnimatePresence>
          {selectedGoal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedGoal(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-5 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">{selectedGoal.goalName}</h2>
                  <button
                    onClick={() => setSelectedGoal(null)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Status */}
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(selectedGoal.status).badge}`}>
                      {selectedGoal.status.replace('_', ' ')}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold capitalize">
                      {selectedGoal.priority} Priority
                    </span>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-gray-900">Progress</h3>
                      <span className="text-xl font-bold text-gray-900">
                        {selectedGoal.progress?.percentage?.toFixed(1) || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(selectedGoal.progress?.percentage || 0, 100)}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full bg-gradient-to-r ${getProgressColor(selectedGoal.progress?.percentage || 0)} rounded-full`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-0.5">Current Value</div>
                        <div className="text-sm font-bold text-gray-900">{selectedGoal.currentValue?.toLocaleString() || 0}</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-0.5">Target Value</div>
                        <div className="text-sm font-bold text-gray-900">{selectedGoal.targetValue?.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  {selectedGoal.description && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-1.5">Description</h3>
                      <p className="text-xs text-gray-700">{selectedGoal.description}</p>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Period</div>
                      <div className="font-semibold text-xs text-gray-900 capitalize">{selectedGoal.period}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Category</div>
                      <div className="font-semibold text-xs text-gray-900 capitalize">{selectedGoal.category}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Start Date</div>
                      <div className="font-semibold text-xs text-gray-900">
                        {selectedGoal.startDate ? new Date(selectedGoal.startDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">End Date</div>
                      <div className="font-semibold text-xs text-gray-900">
                        {selectedGoal.endDate ? new Date(selectedGoal.endDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                    {selectedGoal.daysRemaining !== undefined && (
                      <div>
                        <div className="text-xs text-gray-500 mb-0.5">Days Remaining</div>
                        <div className="font-semibold text-xs text-gray-900">{selectedGoal.daysRemaining} days</div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CSRGoals;

