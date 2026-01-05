import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Filter, Search, Calendar, Users, Target, TrendingUp,
  Clock, CheckCircle, AlertCircle, Play, Pause, Edit, Eye,
  MoreVertical, Download, Share, BarChart3
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import campaignService from '../../services/campaignService';

const CampaignList = ({ onViewCampaign, onCreateCampaign, onEditCampaign }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Load campaigns
  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const response = await campaignService.getCampaigns(filters);
      setCampaigns(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, [filters]);

  // Get status color and icon
  const getStatusInfo = (status) => {
    const statusMap = {
      'draft': { color: 'gray', icon: Edit, label: 'Draft' },
      'scope_defined': { color: 'blue', icon: Target, label: 'Scope Defined' },
      'pending_approval': { color: 'orange', icon: Clock, label: 'Pending Approval' },
      'approved': { color: 'green', icon: CheckCircle, label: 'Approved' },
      'pilot': { color: 'purple', icon: Play, label: 'Pilot' },
      'rollout': { color: 'indigo', icon: TrendingUp, label: 'Rollout' },
      'active': { color: 'green', icon: Play, label: 'Active' },
      'completed': { color: 'gray', icon: CheckCircle, label: 'Completed' },
      'paused': { color: 'yellow', icon: Pause, label: 'Paused' },
      'cancelled': { color: 'red', icon: AlertCircle, label: 'Cancelled' }
    };
    return statusMap[status] || statusMap['draft'];
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get campaign duration
  const getCampaignDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'TBD';
    const duration = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    return `${duration} days`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Campaign Management</h2>
          <p className="text-xs text-gray-600">Manage and track all CSR campaigns</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateCampaign}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-md transition-all text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Create Campaign
        </motion.button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400"
              />
            </div>
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="pilot">Pilot</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400"
          >
            <option value="">All Types</option>
            <option value="wellness">Wellness</option>
            <option value="financial_literacy">Financial Literacy</option>
            <option value="values_education">Values Education</option>
            <option value="ai_skills">AI Skills</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            <Filter className="w-4 h-4" />
            More Filters
          </motion.button>
        </div>
      </div>

      {/* Campaign List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {campaigns.map((campaign, index) => {
              const statusInfo = getStatusInfo(campaign.status);
              const StatusIcon = statusInfo.icon;

              return (
                <motion.div
                  key={campaign._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {campaign.title}
                        </h3>
                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-3">{campaign.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(campaign.timeline?.startDate)} - {formatDate(campaign.timeline?.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{getCampaignDuration(campaign.timeline?.startDate, campaign.timeline?.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          <span>{campaign.quickMetrics?.totalParticipants || 0} participants</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5" />
                          <span>{campaign.quickMetrics?.completionRate?.toFixed(1) || 0}% completion</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onViewCampaign(campaign)}
                        className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onEditCampaign(campaign)}
                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit Campaign"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        title="View Metrics"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </motion.button>

                      <div className="relative">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {campaign.quickMetrics && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{campaign.quickMetrics.completionRate?.toFixed(1) || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${campaign.quickMetrics.completionRate || 0}%` }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-600">
                Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} campaigns
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilters({ ...filters, page: pagination.currentPage - 1 })}
                  disabled={pagination.currentPage === 1}
                  className="px-2.5 py-1.5 text-xs border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setFilters({ ...filters, page })}
                      className={`px-2.5 py-1.5 text-xs rounded-md ${
                        pagination.currentPage === page
                          ? 'bg-purple-500 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setFilters({ ...filters, page: pagination.currentPage + 1 })}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-2.5 py-1.5 text-xs border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignList;
