import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle, XCircle, Clock, AlertTriangle, Eye, Edit, 
  Users, Building, Calendar, DollarSign, Target, FileText,
  Plus, Filter, Search, Download, Share2, Bell
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import campaignApprovalService from '../../services/campaignApprovalService';

const CampaignApprovalManager = ({ onShowApprovalModal, onShowPilotResults }) => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    approvalType: 'all',
    search: ''
  });
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    loadApprovals();
    loadStats();
  }, [filters]);

  const loadApprovals = async () => {
    try {
      const response = await campaignApprovalService.getApprovals(filters);
      setApprovals(response.data);
    } catch (error) {
      console.error('Error loading approvals:', error);
      toast.error('Failed to load approval requests');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const response = await campaignApprovalService.getApprovalStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleStatusChange = async (approvalId, status) => {
    try {
      await campaignApprovalService.updateApprovalStatus(approvalId, status);
      toast.success(`Approval ${status} successfully`);
      loadApprovals();
    } catch (error) {
      toast.error('Failed to update approval status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'expired': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApprovalTypeColor = (type) => {
    switch (type) {
      case 'pilot': return 'bg-blue-100 text-blue-800';
      case 'full_rollout': return 'bg-purple-100 text-purple-800';
      case 'renewal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Campaign Approvals</h2>
          <p className="text-xs text-gray-600">Manage pilot mode approvals and school consent</p>
        </div>
        <button
          onClick={onShowApprovalModal}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold"
        >
          <Plus className="w-4 h-4" />
          New Approval Request
        </button>
      </div>

      {/* Statistics Cards */}
      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
              <div className="animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-xl shadow-md border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600">Total Approvals</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalApprovals || 0}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-4 rounded-xl shadow-md border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600">Pending</p>
                <p className="text-xl font-bold text-yellow-600">
                  {stats.statusBreakdown?.find(s => s._id === 'pending')?.count || 0}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-4 rounded-xl shadow-md border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600">Approved</p>
                <p className="text-xl font-bold text-green-600">
                  {stats.statusBreakdown?.find(s => s._id === 'approved')?.count || 0}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-4 rounded-xl shadow-md border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600">Pilot Mode</p>
                <p className="text-xl font-bold text-blue-600">
                  {stats.approvalTypes?.find(t => t._id === 'pilot')?.count || 0}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-700">Filters:</span>
          </div>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>

          <select
            value={filters.approvalType}
            onChange={(e) => setFilters({ ...filters, approvalType: e.target.value })}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400"
          >
            <option value="all">All Types</option>
            <option value="pilot">Pilot</option>
            <option value="full_rollout">Full Rollout</option>
            <option value="renewal">Renewal</option>
          </select>

          <div className="flex items-center gap-2 flex-1">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search campaigns or schools..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400"
            />
          </div>
        </div>
      </div>

      {/* Approvals List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Approval Requests</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {approvals && approvals.length > 0 ? approvals.map((approval) => (
                <tr key={approval._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div>
                      <div className="text-xs font-semibold text-gray-900">
                        {approval.campaignId?.title || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {approval.campaignDetails?.targetStudents || 0} students
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
                      <div>
                        <div className="text-xs font-semibold text-gray-900">
                          {approval.schoolName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {approval.schoolType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getApprovalTypeColor(approval.approvalType)}`}>
                      {approval.approvalType.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(approval.status)}
                      <span className={`ml-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${getStatusColor(approval.status)}`}>
                        {approval.status.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${approval.approvalProgress || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">
                        {approval.approvalProgress || 0}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                    {new Date(approval.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <button className="p-1 text-blue-500 hover:bg-blue-50 rounded">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1 text-green-500 hover:bg-green-50 rounded">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {approval.approvalType === 'pilot' && approval.status === 'approved' && (
                        <button 
                          onClick={() => onShowPilotResults(approval)}
                          className="p-1 text-purple-500 hover:bg-purple-50 rounded"
                        >
                          <Target className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">No Approval Requests</h3>
                    <p className="text-xs text-gray-500">Create your first approval request to get started</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CampaignApprovalManager;
