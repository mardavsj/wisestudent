import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AlertTriangle, ArrowLeft, CheckCircle, Clock, XCircle, Shield, Activity,
  User, Calendar, Flag, Plus, Filter, ExternalLink, Check, X, Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import { useSocket } from '../../context/SocketContext';

const IncidentManagement = () => {
  const { ticketNumber } = useParams();
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [expandedIncident, setExpandedIncident] = useState(null);
  const socket = useSocket();

  const fetchIncidents = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterSeverity !== 'all') params.severity = filterSeverity;

      const response = await api.get('/api/incidents', { params }).catch(() => ({ data: { data: [] } }));
      setIncidents(response.data.data || []);

      // Auto-expand if viewing specific ticket
      if (ticketNumber) {
        const incident = response.data.data.find(i => i.ticketNumber === ticketNumber);
        if (incident) setExpandedIncident(incident._id);
      }
    } catch (error) {
      console.error('Error fetching incidents:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load incidents');
      }
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterSeverity, ticketNumber]);

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchIncidents]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/incidents/stats').catch(() => ({ data: { data: null } }));
      setStats(response.data.data || null);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Real-time Socket.IO updates
  useEffect(() => {
    if (socket?.socket) {
      const handleIncidentUpdate = (data) => {
        setIncidents(prev => prev.map(i =>
          i._id === data.incidentId
            ? { ...i, ...data }
            : i
        ));
        fetchStats(); // Refresh stats
      };

      const handleNewIncident = (data) => {
        fetchIncidents(); // Refetch to get full incident data
        fetchStats();
        toast.success(`New ${data.severity || 'platform'} incident: ${data.ticketNumber || data._id || 'created'}`);
      };

      socket.socket.on('admin:incident:update', handleIncidentUpdate);
      socket.socket.on('admin:incident:new', handleNewIncident);
      return () => {
        socket.socket.off('admin:incident:update', handleIncidentUpdate);
        socket.socket.off('admin:incident:new', handleNewIncident);
      };
    }
  }, [socket, fetchStats, fetchIncidents]);

  const handleResolveIncident = async (incidentId) => {
    const notes = prompt('Enter resolution notes:');
    if (!notes) return;

    try {
      await api.put(`/api/incidents/${incidentId}/resolve`, { resolutionNotes: notes });
      toast.success('Incident resolved successfully');
      fetchIncidents();
      fetchStats();
    } catch (error) {
      console.error('Error resolving incident:', error);
      toast.error('Failed to resolve incident');
    }
  };

  const handleAssignIncident = async (incidentId, userId) => {
    try {
      await api.put(`/api/incidents/${incidentId}/assign`, { assignedTo: userId });
      toast.success('Incident assigned successfully');
      fetchIncidents();
    } catch (error) {
      console.error('Error assigning incident:', error);
      toast.error('Failed to assign incident');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <AlertTriangle className="w-6 h-6 text-red-600" />;
      case 'investigating': return <Clock className="w-6 h-6 text-yellow-600" />;
      case 'resolved': return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'closed': return <XCircle className="w-6 h-6 text-gray-600" />;
      default: return <Clock className="w-6 h-6 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'from-red-500 to-pink-500';
      case 'high': return 'from-orange-500 to-red-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getSeverityBorderLeft = (severity) => {
    switch (severity) {
      case 'critical': return 'border-l-red-500';
      case 'high': return 'border-l-orange-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-blue-500';
      default: return 'border-l-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-red-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const openCount = stats?.open ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      <header className="w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-2xl border border-purple-500/30 px-4 py-12 md:py-14">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors shrink-0 mt-0.5"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">Support & operations</p>
              <h1 className="text-2xl md:text-3xl font-black text-white mt-2 flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 shrink-0" />
                Incident Management
              </h1>
              <p className="text-sm text-white/85 max-w-2xl mt-1.5 leading-relaxed">
                Monitor and respond to platform incidents in real-time. Filter by status and severity.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-shrink-0 md:pl-4">
            <div className="text-right space-y-0.5">
              <p className="text-sm font-medium text-white/90">
                Open: <span className="font-bold text-white">{openCount}</span> incidents
              </p>
              <p className="text-xs text-white/70">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold transition border border-white/20"
              aria-label="Create incident"
            >
              <Plus className="w-5 h-5" />
              Create Incident
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total</span>
                <div className="p-2 rounded-lg bg-indigo-100">
                  <Activity className="w-4 h-4 text-indigo-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Open</span>
                <div className="p-2 rounded-lg bg-red-100">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.open}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Investigating</span>
                <div className="p-2 rounded-lg bg-amber-100">
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.investigating}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Resolved</span>
                <div className="p-2 rounded-lg bg-emerald-100">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.resolved}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Critical</span>
                <div className="p-2 rounded-lg bg-rose-100">
                  <Flag className="w-4 h-4 text-rose-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.critical}</p>
            </motion.div>
          </div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm p-5 mb-8 border border-slate-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex items-center gap-2 text-slate-700 mb-1 sm:mb-0">
              <Filter className="w-5 h-5 text-indigo-500 shrink-0" />
              <span className="text-sm font-semibold">Filters</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Status</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  aria-label="Filter by status"
                >
                  <option value="all">All statuses</option>
                  <option value="open">Open</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </label>
              <label className="block">
                <span className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Severity</span>
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  aria-label="Filter by severity"
                >
                  <option value="all">All severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Incidents List */}
        <div className="space-y-4">
          {incidents.map((incident, idx) => {
            const isExpanded = expandedIncident === incident._id;

            return (
              <motion.div
                key={incident._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all border-l-4 ${
                  isExpanded
                    ? 'border-l-indigo-500 bg-gradient-to-r from-indigo-50/80 to-white'
                    : `${getSeverityBorderLeft(incident.severity)} bg-gradient-to-r from-white to-slate-50/50`
                }`}
                onClick={() => setExpandedIncident(isExpanded ? null : incident._id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getStatusIcon(incident.status)}
                      <h3 className="text-xl font-black text-gray-900">{incident.title}</h3>
                      <span className={`px-4 py-1.5 rounded-xl text-sm font-bold border-2 ${getSeverityBg(incident.severity)}`}>
                        {incident.severity.toUpperCase()}
                      </span>
                      <span className="px-4 py-1.5 rounded-xl text-sm font-bold bg-gray-100 text-gray-700 border-2 border-gray-200">
                        #{incident.ticketNumber}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 text-base leading-relaxed">{incident.description}</p>

                    <div className="flex items-center gap-6 text-sm">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-gray-700">{new Date(incident.createdAt).toLocaleString()}</span>
                      </span>
                      {incident.assignedTo && (
                        <span className="flex items-center gap-2">
                          <User className="w-5 h-5 text-indigo-600" />
                          <span className="font-semibold text-gray-700">{incident.assignedTo.name}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {incident.incidentType === 'sla_breach' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`/admin/incidents/${incident.ticketNumber}`, '_blank');
                        }}
                        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all font-bold text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 pt-6 border-t-2 border-gray-200"
                  >
                    <div className="space-y-4">
                      {/* SLA Metrics */}
                      {incident.slaMetrics && (
                        <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
                          <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                            <Zap className="w-6 h-6 text-yellow-600" />
                            SLA Breach Details
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white rounded-xl">
                              <span className="text-sm font-semibold text-gray-600">Latency</span>
                              <div className="text-2xl font-black text-gray-900">
                                {incident.slaMetrics.latency}ms
                              </div>
                              <span className="text-xs text-gray-500">Threshold: {incident.slaMetrics.thresholdLatency}ms</span>
                            </div>
                            <div className="p-4 bg-white rounded-xl">
                              <span className="text-sm font-semibold text-gray-600">Error Rate</span>
                              <div className="text-2xl font-black text-gray-900">
                                {incident.slaMetrics.errorRate}%
                              </div>
                              <span className="text-xs text-gray-500">Threshold: {incident.slaMetrics.thresholdErrorRate}%</span>
                            </div>
                            <div className="p-4 bg-white rounded-xl">
                              <span className="text-sm font-semibold text-gray-600">Breach Duration</span>
                              <div className="text-2xl font-black text-gray-900">
                                {incident.slaMetrics.breachDuration}s
                              </div>
                            </div>
                            <div className="p-4 bg-white rounded-xl">
                              <span className="text-sm font-semibold text-gray-600">Endpoint</span>
                              <div className="text-lg font-bold text-gray-900 truncate">
                                {incident.slaMetrics.apiEndpoint || 'Global'}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Privacy Details */}
                      {incident.privacyDetails && (
                        <div className="p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border-2 border-red-200">
                          <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                            <Shield className="w-6 h-6 text-red-600" />
                            Privacy Incident Details
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white rounded-xl">
                              <span className="text-sm font-semibold text-gray-600">Affected Users</span>
                              <div className="text-2xl font-black text-red-600">
                                {incident.privacyDetails.affectedUsers || 'Unknown'}
                              </div>
                            </div>
                            <div className="p-4 bg-white rounded-xl">
                              <span className="text-sm font-semibold text-gray-600">Data Types</span>
                              <div className="text-lg font-bold text-gray-900">
                                {incident.privacyDetails.dataTypes.join(', ') || 'Unknown'}
                              </div>
                            </div>
                            <div className="p-4 bg-white rounded-xl">
                              <span className="text-sm font-semibold text-gray-600">Exposure</span>
                              <div className="text-lg font-bold text-gray-900">
                                {incident.privacyDetails.potentialExposure || 'Unknown'}
                              </div>
                            </div>
                            <div className="p-4 bg-white rounded-xl">
                              <span className="text-sm font-semibold text-gray-600">Containment</span>
                              <div className="text-lg font-bold text-red-600">
                                {incident.privacyDetails.containmentStatus?.replace('_', ' ').toUpperCase() || 'Unknown'}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Resolution Notes */}
                      {incident.resolutionNotes && (
                        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                          <h4 className="font-black text-gray-900 mb-3 flex items-center gap-2">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            Resolution Notes
                          </h4>
                          <p className="text-gray-700 leading-relaxed">{incident.resolutionNotes}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        {incident.status !== 'resolved' && incident.status !== 'closed' && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResolveIncident(incident._id);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-xl transition-all font-bold"
                            >
                              <Check className="w-5 h-5" />
                              Resolve Incident
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedIncident(null);
                                setExpandedIncident(incident._id);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all font-bold"
                            >
                              <User className="w-5 h-5" />
                              Assign
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}

          {incidents.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-slate-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">No incidents found</h3>
              <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                No incidents match the current filters, or all systems are operational.
              </p>
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition"
              >
                <Plus className="w-4 h-4" />
                Create incident
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Incident Modal */}
      {showCreateModal && (
        <CreateIncidentModal onClose={() => setShowCreateModal(false)} onSuccess={fetchIncidents} />
      )}
    </div>
  );
};

// Create Incident Modal Component
const CreateIncidentModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    incidentType: 'other',
    severity: 'medium',
    title: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/incidents', formData);
      toast.success('Incident created successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating incident:', error);
      toast.error('Failed to create incident');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-incident-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 max-w-lg w-full border border-slate-200 shadow-xl"
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <h2 id="create-incident-title" className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-100">
              <Plus className="w-5 h-5 text-indigo-600" />
            </span>
            Create Incident
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="incident-type" className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
              Incident type
            </label>
            <select
              id="incident-type"
              required
              value={formData.incidentType}
              onChange={(e) => setFormData({ ...formData, incidentType: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
              aria-label="Incident type"
            >
              <option value="sla_breach">SLA Breach</option>
              <option value="privacy_incident">Privacy Incident</option>
              <option value="security_breach">Security Breach</option>
              <option value="data_breach">Data Breach</option>
              <option value="performance_issue">Performance Issue</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="incident-severity" className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
              Severity
            </label>
            <select
              id="incident-severity"
              required
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
              aria-label="Severity"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label htmlFor="incident-title" className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
              Title
            </label>
            <input
              id="incident-title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
              placeholder="Brief incident description"
              aria-label="Incident title"
            />
          </div>
          <div>
            <label htmlFor="incident-description" className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
              Description
            </label>
            <textarea
              id="incident-description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none resize-none"
              placeholder="Detailed incident description"
              aria-label="Incident description"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition"
            >
              <Plus className="w-4 h-4" />
              Create Incident
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default IncidentManagement;
