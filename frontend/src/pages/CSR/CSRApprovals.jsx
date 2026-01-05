import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle, Clock, XCircle, AlertTriangle, Users, Building,
  Calendar, Target, TrendingUp, FileText, Eye, Edit
} from 'lucide-react';
import CampaignApprovalManager from '../../components/CSR/CampaignApprovalManager';
import campaignApprovalService from '../../services/campaignApprovalService';

const CSRApprovals = () => {
  const [approvalStats, setApprovalStats] = useState({
    totalApprovals: 0,
    pendingReview: 0,
    approved: 0,
    pilotMode: 0
  });
  const [loading, setLoading] = useState(true);

  // Load approval statistics
  const loadApprovalStats = async () => {
    setLoading(true);
    try {
      const response = await campaignApprovalService.getApprovalStats();
      const stats = response.data;
      
      setApprovalStats({
        totalApprovals: stats.statusBreakdown?.reduce((sum, item) => sum + (item.count || 0), 0) || 0,
        pendingReview: stats.statusBreakdown?.find(s => s._id === 'pending')?.count || 0,
        approved: stats.statusBreakdown?.find(s => s._id === 'approved')?.count || 0,
        pilotMode: stats.approvalTypes?.find(t => t._id === 'pilot')?.count || 0
      });
    } catch (error) {
      console.error('Error loading approval stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApprovalStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="bg-gradient-to-r from-indigo-50/95 via-purple-50/95 to-pink-50/95 backdrop-blur-xl border-b border-indigo-200/60 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-md shadow-indigo-500/30 flex-shrink-0">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                Campaign Approvals
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5 hidden sm:block">
                Manage campaign approval workflows and school consent processes
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >

          {/* Approval Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            {[
              {
                title: 'Total Approvals',
                value: loading ? '...' : approvalStats.totalApprovals.toString(),
                change: '+0 this week',
                icon: FileText,
                color: 'from-indigo-500 to-blue-500',
                bgColor: 'from-indigo-50 to-blue-50',
                borderColor: 'border-indigo-200'
              },
              {
                title: 'Pending Review',
                value: loading ? '...' : approvalStats.pendingReview.toString(),
                change: '0 urgent',
                icon: Clock,
                color: 'from-yellow-500 to-orange-500',
                bgColor: 'from-yellow-50 to-orange-50',
                borderColor: 'border-yellow-200'
              },
              {
                title: 'Approved',
                value: loading ? '...' : approvalStats.approved.toString(),
                change: '0% success rate',
                icon: CheckCircle,
                color: 'from-green-500 to-emerald-500',
                bgColor: 'from-green-50 to-emerald-50',
                borderColor: 'border-green-200'
              },
              {
                title: 'Pilot Mode',
                value: loading ? '...' : approvalStats.pilotMode.toString(),
                change: 'Active pilots',
                icon: Target,
                color: 'from-purple-500 to-pink-500',
                bgColor: 'from-purple-50 to-pink-50',
                borderColor: 'border-purple-200'
              }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -2, scale: 1.01 }}
                  className={`bg-gradient-to-br ${stat.bgColor} border border-gray-100 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} shadow-sm`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md bg-gradient-to-r ${stat.color} text-white`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-0.5">{stat.value}</h3>
                  <p className="text-xs font-semibold text-gray-600">{stat.title}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Approval Workflow Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-5 shadow-md border border-gray-100 mb-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            Approval Workflow Process
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: '1',
                title: 'School Admin Review',
                description: 'Initial review by school administration',
                icon: Building,
                color: 'from-blue-500 to-cyan-500',
                status: 'Completed'
              },
              {
                step: '2',
                title: 'Infrastructure Assessment',
                description: 'Technical and resource evaluation',
                icon: CheckCircle,
                color: 'from-green-500 to-emerald-500',
                status: 'In Progress'
              },
              {
                step: '3',
                title: 'Final Approval',
                description: 'Central admin approval for launch',
                icon: Target,
                color: 'from-purple-500 to-pink-500',
                status: 'Pending'
              }
            ].map((workflow, index) => {
              const Icon = workflow.icon;
              return (
                <motion.div
                  key={workflow.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${workflow.color} text-white font-bold text-sm`}>
                      {workflow.step}
                    </div>
                    <div className={`p-1.5 rounded-lg bg-gradient-to-r ${workflow.color}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1.5">{workflow.title}</h4>
                  <p className="text-xs text-gray-600 mb-2.5">{workflow.description}</p>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                    workflow.status === 'Completed' 
                      ? 'bg-green-100 text-green-800'
                      : workflow.status === 'In Progress'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {workflow.status}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Approval Manager Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <CampaignApprovalManager />
        </motion.div>
      </div>
    </div>
  );
};

export default CSRApprovals;
