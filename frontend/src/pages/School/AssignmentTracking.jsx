import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  BarChart3,
  Eye,
  Download,
  RefreshCw,
  Filter,
  Search,
  Calendar,
  Target,
  Award,
  FileText,
  X,
  FileDown,
  ArrowRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useSocket } from '../../context/SocketContext';

const AssignmentTracking = () => {
  const navigate = useNavigate();
  const socket = useSocket()?.socket;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignmentStats, setAssignmentStats] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAssignments = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setRefreshing(true);
      else setLoading(true);
      
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('type', filter);
      
      const response = await api.get(`/api/school/teacher/assignments?${params.toString()}`);
      if (response.data.success) {
        setAssignments(response.data.data || []);
        setLastUpdated(new Date());
        if (showLoading) toast.success('Assignments refreshed!');
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load assignments');
      setAssignments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // Real-time updates via socket
  useEffect(() => {
    if (!socket) return;

    const handleAssignmentCreated = (data) => {
      console.log("Real-time assignment created:", data);
      toast.success(`New assignment "${data.assignment?.title || 'created'}" added!`, { icon: '📝' });
      fetchAssignments(true);
    };

    const handleAssignmentUpdated = (data) => {
      console.log("Real-time assignment updated:", data);
      // Update the specific assignment in the list
      setAssignments(prev => prev.map(a => 
        a._id === data.assignment?._id ? { ...a, ...data.assignment } : a
      ));
      // Refresh stats if this assignment is currently selected
      if (selectedAssignment === data.assignment?._id) {
        fetchAssignmentStats(selectedAssignment);
      }
      toast.info(`Assignment "${data.assignment?.title || 'updated'}" has been updated.`, { icon: '🔄' });
    };

    const handleAssignmentDeleted = (data) => {
      console.log("Real-time assignment deleted:", data);
      setAssignments(prev => prev.filter(a => a._id !== data.assignmentId));
      if (selectedAssignment === data.assignmentId) {
        setAssignmentStats(null);
        setSelectedAssignment(null);
      }
      toast.info("An assignment has been deleted.", { icon: '🗑️' });
    };

    const handleAssignmentSubmitted = (data) => {
      console.log("Real-time assignment submitted:", data);
      // Update assignment stats if this assignment is currently selected
      if (selectedAssignment === data.assignmentId) {
        fetchAssignmentStats(selectedAssignment);
      }
      // Update the assignment in the list to reflect new submission
      setAssignments(prev => prev.map(a => {
        if (a._id === data.assignmentId) {
          return {
            ...a,
            stats: {
              ...a.stats,
              totalAttempts: (a.stats?.totalAttempts || 0) + 1,
              submittedAttempts: (a.stats?.submittedAttempts || 0) + 1,
              pendingAttempts: Math.max(0, (a.stats?.pendingAttempts || 0) - 1),
              completionRate: a.stats?.totalAttempts > 0 
                ? Math.round(((a.stats?.submittedAttempts || 0) + 1) / ((a.stats?.totalAttempts || 0) + 1) * 100)
                : 0
            }
          };
        }
        return a;
      }));
      toast.success(`${data.studentName || 'A student'} submitted "${data.assignmentTitle || 'an assignment'}"!`, { icon: '✅' });
    };

    socket.on('assignment:created', handleAssignmentCreated);
    socket.on('assignment:updated', handleAssignmentUpdated);
    socket.on('assignment:deleted', handleAssignmentDeleted);
    socket.on('assignment:submitted', handleAssignmentSubmitted);

    return () => {
      socket.off('assignment:created', handleAssignmentCreated);
      socket.off('assignment:updated', handleAssignmentUpdated);
      socket.off('assignment:deleted', handleAssignmentDeleted);
      socket.off('assignment:submitted', handleAssignmentSubmitted);
    };
  }, [socket, selectedAssignment, fetchAssignments]);

  const fetchAssignmentStats = useCallback(async (assignmentId) => {
    try {
      const response = await api.get(`/api/assignment-attempts/stats/${assignmentId}`);
      if (response.data.success) {
        setAssignmentStats(response.data.data);
        setSelectedAssignment(assignmentId);
      } else {
        toast.error('Failed to load assignment statistics');
      }
    } catch (error) {
      console.error('Error fetching assignment stats:', error);
      toast.error('Failed to load assignment statistics');
      setAssignmentStats(null);
      setSelectedAssignment(null);
    }
  }, []);

  // Use useMemo for efficient filtering without causing re-renders
  const filteredAssignments = useMemo(() => {
    return assignments.filter(assignment => {
      const matchesFilter = filter === 'all' || assignment.type === filter;
      const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assignment.subject?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [assignments, filter, searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateCompletionRate = (stats) => {
    if (!stats || stats.completionStats.total === 0) return 0;
    return Math.round((stats.completionStats.submitted / stats.completionStats.total) * 100);
  };

  const getCompletionColor = (rate) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const exportAssignmentData = (assignment) => {
    if (!assignmentStats) return;
    
    const csvData = [
      ['Student Name', 'Email', 'Score', 'Percentage', 'Submitted At', 'Time Spent', 'Status', 'Is Late'],
      ...assignmentStats.attempts.map(attempt => [
        attempt.student.name,
        attempt.student.email,
        attempt.totalScore,
        `${attempt.percentage}%`,
        formatDate(attempt.submittedAt),
        `${attempt.timeSpent}m`,
        attempt.status,
        attempt.isLate ? 'Yes' : 'No'
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${assignment.title}_submissions.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const exportAllAssignmentsData = () => {
    if (filteredAssignments.length === 0) {
      toast.error('No assignments to export');
      return;
    }

    const csvData = [
      ['Assignment Title', 'Type', 'Subject', 'Due Date', 'Total Marks', 'Total Attempts', 'Submitted', 'Pending', 'Completion Rate']
    ];

    filteredAssignments.forEach(assignment => {
      csvData.push([
        assignment.title,
        assignment.type,
        assignment.subject || 'N/A',
        formatDate(assignment.dueDate),
        assignment.totalMarks || 100,
        assignment.stats?.totalAttempts || 0,
        assignment.stats?.submittedAttempts || 0,
        assignment.stats?.pendingAttempts || 0,
        `${assignment.stats?.completionRate || 0}%`
      ]);
    });

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `all_assignments_tracking_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    toast.success('All assignments data exported successfully');
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
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  Assignment Tracking
                </h1>
                <p className="text-sm text-white/80">
                  Monitor student progress and completion rates in real-time
                  {lastUpdated && (
                    <span className="ml-2">• Last updated: {lastUpdated.toLocaleTimeString()}</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fetchAssignments(true)}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium transition-all border border-white/20 hover:border-white/30 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={exportAllAssignmentsData}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium transition-all border border-white/20 hover:border-white/30"
                >
                  <FileDown className="w-4 h-4" />
                  Export All Data
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/school-teacher/tasks')}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium transition-all border border-white/20 hover:border-white/30"
                >
                  Manage Assignments
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none bg-white"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none bg-white font-medium"
              >
                <option value="all">All Types</option>
                <option value="quiz">Quiz</option>
                <option value="test">Test</option>
                <option value="homework">Homework</option>
                <option value="classwork">Classwork</option>
                <option value="project">Project</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Assignments List */}
        <div className="grid gap-6">
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment) => (
              <motion.div
                key={assignment._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <h3 className="text-lg font-bold text-slate-900">{assignment.title}</h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(assignment.status)}`}>
                          {assignment.status}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${getPriorityColor(assignment.priority)}`}>
                          {assignment.priority}
                        </span>
                      </div>
                      <p className="text-slate-600 mb-4 text-sm line-clamp-2">{assignment.description}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
                        <span className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span className="font-medium">{assignment.type}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">Due: {formatDate(assignment.dueDate)}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          <span className="font-medium">{assignment.questions?.length || 0} questions</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          <span className="font-medium">{assignment.totalMarks || 100} points</span>
                        </span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => fetchAssignmentStats(assignment._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all ml-4"
                    >
                      <Eye className="w-4 h-4" />
                      View Stats
                    </motion.button>
                  </div>

                  {/* Quick Stats Preview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                      <div className="text-2xl font-bold text-indigo-600">
                        {assignment.stats?.totalAttempts || 0}
                      </div>
                      <div className="text-xs font-medium text-indigo-700 uppercase tracking-wide">Total Attempts</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-600">
                        {assignment.stats?.submittedAttempts || 0}
                      </div>
                      <div className="text-xs font-medium text-green-700 uppercase tracking-wide">Submitted</div>
                    </div>
                    <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="text-2xl font-bold text-amber-600">
                        {assignment.stats?.pendingAttempts || 0}
                      </div>
                      <div className="text-xs font-medium text-amber-700 uppercase tracking-wide">Pending</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className={`text-2xl font-bold ${getCompletionColor(assignment.stats?.completionRate || 0)}`}>
                        {assignment.stats?.completionRate || 0}%
                      </div>
                      <div className="text-xs font-medium text-purple-700 uppercase tracking-wide">Completion Rate</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12">
                <div className="p-4 rounded-full bg-indigo-50 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No Assignments Found</h3>
                <p className="text-sm text-slate-600 mb-6">No assignments match your current filters.</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={fetchAssignments}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all"
                >
                  Refresh Assignments
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Assignment Statistics Modal */}
        {assignmentStats && selectedAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => {
              setAssignmentStats(null);
              setSelectedAssignment(null);
            }} />
            <div className="relative w-full max-w-6xl bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden max-h-[90vh]">
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Assignment Statistics</h2>
                    <p className="text-xs text-white/80 mt-1">
                      {assignmentStats.assignment?.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => fetchAssignmentStats(selectedAssignment)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-all border border-white/20"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => exportAssignmentData(assignmentStats.assignment)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-all border border-white/20"
                    >
                      <Download className="w-4 h-4" />
                      Export CSV
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setAssignmentStats(null);
                        setSelectedAssignment(null);
                      }}
                      className="p-2 hover:bg-white/20 rounded-lg transition-all"
                    >
                      <X className="w-5 h-5 text-white" />
                    </motion.button>
                  </div>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {/* Assignment Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{assignmentStats.assignment.title}</h3>
                  <p className="text-sm text-slate-600">Type: {assignmentStats.assignment.type} • Due: {formatDate(assignmentStats.assignment.dueDate)}</p>
                </div>

                {/* Completion Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Submitted</p>
                    <p className="text-2xl font-bold text-slate-900">{assignmentStats.completionStats.submitted}</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 bg-amber-50 rounded-lg">
                        <Clock className="w-5 h-5 text-amber-600" />
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Pending</p>
                    <p className="text-2xl font-bold text-slate-900">{assignmentStats.completionStats.pending}</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 bg-indigo-50 rounded-lg">
                        <Users className="w-5 h-5 text-indigo-600" />
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Total Students</p>
                    <p className="text-2xl font-bold text-slate-900">{assignmentStats.completionStats.total}</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 bg-purple-50 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Completion Rate</p>
                    <p className={`text-2xl font-bold ${getCompletionColor(assignmentStats.completionStats.completionRate)}`}>
                      {assignmentStats.completionStats.completionRate}%
                    </p>
                  </motion.div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 bg-indigo-50 rounded-lg">
                        <Award className="w-5 h-5 text-indigo-600" />
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Average Score</p>
                    <p className="text-2xl font-bold text-slate-900">{assignmentStats.averageScore || 0}</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 bg-amber-50 rounded-lg">
                        <Clock className="w-5 h-5 text-amber-600" />
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Avg Time Spent</p>
                    <p className="text-2xl font-bold text-slate-900">{assignmentStats.averageTimeSpent || 0}m</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 bg-purple-50 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Recent Activity (7d)</p>
                    <p className="text-2xl font-bold text-slate-900">{assignmentStats.recentActivity || 0}</p>
                  </motion.div>
                </div>

                {/* Score Distribution */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Score Distribution</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm"
                    >
                      <div className="text-2xl font-bold text-green-600">{assignmentStats.scoreDistribution.excellent}</div>
                      <div className="text-xs font-medium text-slate-600 mt-1">Excellent (90%+)</div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm"
                    >
                      <div className="text-2xl font-bold text-indigo-600">{assignmentStats.scoreDistribution.good}</div>
                      <div className="text-xs font-medium text-slate-600 mt-1">Good (70-89%)</div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm"
                    >
                      <div className="text-2xl font-bold text-amber-600">{assignmentStats.scoreDistribution.average}</div>
                      <div className="text-xs font-medium text-slate-600 mt-1">Average (50-69%)</div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm"
                    >
                      <div className="text-2xl font-bold text-red-600">{assignmentStats.scoreDistribution.poor}</div>
                      <div className="text-xs font-medium text-slate-600 mt-1">Poor (&lt;50%)</div>
                    </motion.div>
                  </div>
                </div>

                {/* Question-wise Statistics */}
                {assignmentStats.questionStats && assignmentStats.questionStats.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Question Performance</h3>
                    <div className="space-y-3">
                      {assignmentStats.questionStats.map((question, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-bold text-slate-900">
                              Question {question.questionIndex + 1}
                            </h4>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-green-600 font-bold">
                                {question.accuracy}% accuracy
                              </span>
                              <span className="text-slate-600 font-medium">
                                {question.correctAnswers}/{question.totalAttempts} correct
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                            {question.questionText}
                          </p>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <motion.div 
                              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-1000"
                              initial={{ width: 0 }}
                              animate={{ width: `${question.accuracy}%` }}
                              transition={{ delay: index * 0.05 + 0.3, duration: 1 }}
                            ></motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Student Submissions */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Student Submissions</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-xs uppercase tracking-wide">Student</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-xs uppercase tracking-wide">Score</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-xs uppercase tracking-wide">Percentage</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-xs uppercase tracking-wide">Submitted</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-xs uppercase tracking-wide">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignmentStats.attempts.map((attempt, index) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.02 }}
                            className="border-b border-slate-200 hover:bg-slate-50 transition-all"
                          >
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-semibold text-slate-900">{attempt.student.name}</div>
                                <div className="text-slate-500 text-xs">{attempt.student.email}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-900">
                                {attempt.totalScore}/{assignmentStats.assignment.totalMarks}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className={`font-semibold ${getCompletionColor(attempt.percentage)}`}>
                                {attempt.percentage}%
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-slate-600 text-xs">
                                {formatDate(attempt.submittedAt)}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2 flex-wrap">
                                {attempt.isLate ? (
                                  <span className="px-2 py-0.5 text-xs font-medium text-red-700 bg-red-100 rounded">
                                    Late
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 text-xs font-medium text-green-700 bg-green-100 rounded">
                                    On Time
                                  </span>
                                )}
                                {attempt.autoGraded && (
                                  <span className="px-2 py-0.5 text-xs font-medium text-indigo-700 bg-indigo-100 rounded">
                                    Auto-graded
                                  </span>
                                )}
                                {!attempt.graded && !attempt.autoGraded && (
                                  <span className="px-2 py-0.5 text-xs font-medium text-amber-700 bg-amber-100 rounded">
                                    Needs Grading
                                  </span>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentTracking;
