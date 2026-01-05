import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Plus, AlertTriangle, CheckCircle, Clock, X,
  Target, Calendar, DollarSign, TrendingUp, Settings, Eye, Trash2,
  Filter, Save, RefreshCw, Volume2, VolumeX
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import csrAlertService from '../../services/csrAlertService';

const CSRAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [rules, setRules] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('alerts'); // alerts, rules
  const [showCreateRuleModal, setShowCreateRuleModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    severity: 'all',
    alertType: 'all'
  });

  const [formData, setFormData] = useState({
    ruleName: '',
    description: '',
    alertType: 'goal_at_risk',
    conditions: {
      threshold: '',
      operator: 'greater_than'
    },
    severity: 'medium',
    enabled: true,
    channels: ['in_app'],
    frequency: 'once',
    messageTemplate: {
      title: '',
      message: ''
    }
  });

  useEffect(() => {
    loadAlerts();
    loadRules();
  }, [filters]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const queryParams = {};
      if (filters.status !== 'all') queryParams.status = filters.status;
      if (filters.severity !== 'all') queryParams.severity = filters.severity;
      if (filters.alertType !== 'all') queryParams.alertType = filters.alertType;

      const [alertsRes, unreadRes] = await Promise.all([
        csrAlertService.getAlerts(queryParams),
        csrAlertService.getUnreadAlertsCount()
      ]);

      setAlerts(alertsRes.data || []);
      setUnreadCount(unreadRes.data?.count || 0);
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const loadRules = async () => {
    try {
      const response = await csrAlertService.getAlertRules();
      setRules(response.data || []);
    } catch (error) {
      console.error('Error loading rules:', error);
      toast.error('Failed to load alert rules');
    }
  };

  const handleAcknowledgeAlert = async (alertId) => {
    try {
      await csrAlertService.acknowledgeAlert(alertId);
      toast.success('Alert acknowledged');
      loadAlerts();
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      toast.error('Failed to acknowledge alert');
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await csrAlertService.resolveAlert(alertId);
      toast.success('Alert resolved');
      loadAlerts();
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast.error('Failed to resolve alert');
    }
  };

  const handleDismissAlert = async (alertId) => {
    try {
      await csrAlertService.dismissAlert(alertId);
      toast.success('Alert dismissed');
      loadAlerts();
    } catch (error) {
      console.error('Error dismissing alert:', error);
      toast.error('Failed to dismiss alert');
    }
  };

  const handleCreateRule = async () => {
    try {
      if (!formData.ruleName || !formData.messageTemplate.title || !formData.messageTemplate.message) {
        toast.error('Please fill in all required fields');
        return;
      }

      await csrAlertService.createAlertRule(formData);
      toast.success('Alert rule created successfully');
      setShowCreateRuleModal(false);
      resetForm();
      loadRules();
    } catch (error) {
      console.error('Error creating rule:', error);
      toast.error(error.response?.data?.message || 'Failed to create rule');
    }
  };

  const handleDeleteRule = async (ruleId) => {
    if (!window.confirm('Are you sure you want to delete this alert rule?')) {
      return;
    }

    try {
      await csrAlertService.deleteAlertRule(ruleId);
      toast.success('Rule deleted successfully');
      loadRules();
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast.error('Failed to delete rule');
    }
  };

  const handleToggleRule = async (ruleId, enabled) => {
    try {
      await csrAlertService.updateAlertRule(ruleId, { enabled });
      toast.success(`Rule ${enabled ? 'enabled' : 'disabled'}`);
      loadRules();
    } catch (error) {
      console.error('Error toggling rule:', error);
      toast.error('Failed to update rule');
    }
  };

  const resetForm = () => {
    setFormData({
      ruleName: '',
      description: '',
      alertType: 'goal_at_risk',
      conditions: {
        threshold: '',
        operator: 'greater_than'
      },
      severity: 'medium',
      enabled: true,
      channels: ['in_app'],
      frequency: 'once',
      messageTemplate: {
        title: '',
        message: ''
      }
    });
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-500', badge: 'bg-red-100 text-red-800' };
      case 'high': return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-500', badge: 'bg-orange-100 text-orange-800' };
      case 'medium': return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-500', badge: 'bg-yellow-100 text-yellow-800' };
      case 'low': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-500', badge: 'bg-blue-100 text-blue-800' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-500', badge: 'bg-gray-100 text-gray-800' };
    }
  };

  const getAlertTypeIcon = (type) => {
    if (type.includes('goal')) return Target;
    if (type.includes('compliance')) return Calendar;
    if (type.includes('budget')) return DollarSign;
    if (type.includes('roi')) return TrendingUp;
    return AlertTriangle;
  };

  const alertTypes = [
    { value: 'goal_at_risk', label: 'Goal At Risk' },
    { value: 'goal_overdue', label: 'Goal Overdue' },
    { value: 'goal_progress', label: 'Goal Progress Threshold' },
    { value: 'compliance_due_soon', label: 'Compliance Due Soon' },
    { value: 'compliance_overdue', label: 'Compliance Overdue' },
    { value: 'budget_threshold', label: 'Budget Threshold' },
    { value: 'roi_threshold', label: 'ROI Threshold' }
  ];

  if (loading && alerts.length === 0 && rules.length === 0) {
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
          <h2 className="text-sm font-bold text-gray-900 mb-1">Loading Alerts</h2>
          <p className="text-xs text-gray-600">Fetching alert data...</p>
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
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                    Alerts & Notifications
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm mt-0.5 hidden sm:block">
                    Monitor and manage automated alerts for goals, compliance, budgets, and ROI thresholds
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {unreadCount > 0 && (
                <div className="bg-red-500 text-white px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold flex items-center gap-1.5 rounded-lg shadow-sm">
                  <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{unreadCount} Unread</span>
                  <span className="sm:hidden">{unreadCount}</span>
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreateRuleModal(true)}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Create Rule</span>
                <span className="sm:hidden">Create</span>
              </motion.button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-200 mt-4">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-4 py-2 text-sm font-semibold transition-colors relative ${
                activeTab === 'alerts'
                  ? 'text-indigo-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Alerts ({alerts.length})
              {activeTab === 'alerts' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-4 py-2 text-sm font-semibold transition-colors relative ${
                activeTab === 'rules'
                  ? 'text-indigo-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Alert Rules ({rules.length})
              {activeTab === 'rules' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
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
                  <option value="pending">Pending</option>
                  <option value="sent">Sent</option>
                  <option value="acknowledged">Acknowledged</option>
                  <option value="resolved">Resolved</option>
                </select>
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                  className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400"
                >
                  <option value="all">All Severity</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <select
                  value={filters.alertType}
                  onChange={(e) => setFilters({ ...filters, alertType: e.target.value })}
                  className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400"
                >
                  <option value="all">All Types</option>
                  {alertTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* Alerts List */}
            {alerts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-8 text-center shadow-md border border-gray-100"
              >
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-gray-900 mb-1.5">No Alerts Found</h3>
                <p className="text-xs text-gray-600">You're all caught up! No alerts at this time.</p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert, index) => {
                  const Icon = getAlertTypeIcon(alert.alertType);
                  const isUnread = alert.status === 'pending' || alert.status === 'sent';
                  const severityColors = getSeverityColor(alert.severity);

                  return (
                    <motion.div
                      key={alert._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 2, scale: 1.01 }}
                      className={`bg-white rounded-lg p-4 shadow-md border-l-4 ${
                        isUnread ? severityColors.border : 'border-gray-300'
                      } hover:shadow-lg transition-all`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${
                            isUnread ? severityColors.bg : 'bg-gray-100'
                          } border ${severityColors.border}`}>
                            <Icon className={`w-4 h-4 ${severityColors.text}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              <h3 className="font-bold text-xs text-gray-900">{alert.title}</h3>
                              {isUnread && (
                                <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-md">
                                  New
                                </span>
                              )}
                              <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${severityColors.badge}`}>
                                {alert.severity}
                              </span>
                            </div>
                            <p className="text-xs text-gray-700 mb-2">{alert.message}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{new Date(alert.triggeredAt).toLocaleString()}</span>
                              </div>
                              <span className="capitalize">{alert.status}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 ml-3">
                          {isUnread && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleAcknowledgeAlert(alert._id)}
                                className="p-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                                title="Acknowledge"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleResolveAlert(alert._id)}
                                className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                                title="Resolve"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </motion.button>
                            </>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedAlert(alert)}
                            className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDismissAlert(alert._id)}
                            className="p-1.5 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                            title="Dismiss"
                          >
                            <X className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Rules Tab */}
        {activeTab === 'rules' && (
          <div className="space-y-4">
            {rules.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-8 text-center shadow-md border border-gray-100"
              >
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-gray-900 mb-1.5">No Alert Rules</h3>
                <p className="text-xs text-gray-600 mb-4">Create your first alert rule to get started</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateRuleModal(true)}
                  className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all"
                >
                  Create Rule
                </motion.button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rules.map((rule, index) => {
                  const Icon = getAlertTypeIcon(rule.alertType);
                  const severityColors = getSeverityColor(rule.severity);

                  return (
                    <motion.div
                      key={rule._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -2, scale: 1.01 }}
                      className={`bg-white rounded-xl p-4 shadow-md border ${
                        rule.enabled ? severityColors.border : 'border-gray-300'
                      } hover:shadow-lg transition-all`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-sm font-bold text-gray-900 mb-1">{rule.ruleName}</h3>
                          {rule.description && (
                            <p className="text-xs text-gray-600 line-clamp-2">{rule.description}</p>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleToggleRule(rule._id, !rule.enabled)}
                          className={`p-1.5 rounded-md transition-colors ${
                            rule.enabled 
                              ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                              : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                          }`}
                          title={rule.enabled ? 'Disable Rule' : 'Enable Rule'}
                        >
                          {rule.enabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        </motion.button>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${severityColors.bg} border ${severityColors.border}`}>
                          <Icon className={`w-4 h-4 ${severityColors.text}`} />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-gray-600 mb-0.5">Alert Type</div>
                          <div className="text-xs font-bold text-gray-900 capitalize">
                            {rule.alertType.replace(/_/g, ' ')}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg mb-3">
                        <span className="text-xs font-semibold text-gray-600">Severity</span>
                        <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${severityColors.badge}`}>
                          {rule.severity}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteRule(rule._id)}
                          className="flex-1 px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Create Rule Modal */}
        <AnimatePresence>
          {showCreateRuleModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => {
                setShowCreateRuleModal(false);
                resetForm();
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-5 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Create Alert Rule</h2>
                  <button
                    onClick={() => {
                      setShowCreateRuleModal(false);
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
                      Rule Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.ruleName}
                      onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                      placeholder="e.g., Goal At Risk Alert"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                      rows={3}
                      placeholder="Describe the alert rule"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Alert Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.alertType}
                        onChange={(e) => setFormData({ ...formData, alertType: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                      >
                        {alertTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Severity <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.severity}
                        onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Threshold <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.conditions.threshold}
                      onChange={(e) => setFormData({
                        ...formData,
                        conditions: { ...formData.conditions, threshold: e.target.value }
                      })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                      placeholder="e.g., 80"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Alert Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.messageTemplate.title}
                      onChange={(e) => setFormData({
                        ...formData,
                        messageTemplate: { ...formData.messageTemplate, title: e.target.value }
                      })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                      placeholder="e.g., Goal Progress Alert"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Alert Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.messageTemplate.message}
                      onChange={(e) => setFormData({
                        ...formData,
                        messageTemplate: { ...formData.messageTemplate, message: e.target.value }
                      })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                      rows={3}
                      placeholder="e.g., Goal progress has reached the threshold"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="enabled"
                      checked={formData.enabled}
                      onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="enabled" className="text-xs font-semibold text-gray-700">Enable Rule</label>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateRule}
                    className="flex-1 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all"
                  >
                    Create Rule
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowCreateRuleModal(false);
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

        {/* Alert Detail Modal */}
        <AnimatePresence>
          {selectedAlert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedAlert(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-5 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">{selectedAlert.title}</h2>
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getSeverityColor(selectedAlert.severity).badge}`}>
                      {selectedAlert.severity}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold capitalize">
                      {selectedAlert.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1.5">Message</h3>
                    <p className="text-xs text-gray-700">{selectedAlert.message}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Triggered At</div>
                      <div className="font-semibold text-xs text-gray-900">
                        {new Date(selectedAlert.triggeredAt).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Alert Type</div>
                      <div className="font-semibold text-xs text-gray-900 capitalize">
                        {selectedAlert.alertType.replace(/_/g, ' ')}
                      </div>
                    </div>
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

export default CSRAlerts;
