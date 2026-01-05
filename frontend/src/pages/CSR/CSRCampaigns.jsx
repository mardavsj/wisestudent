import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Eye, Edit, Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';
import CampaignList from '../../components/CSR/CampaignList';
import CampaignWizardEnhanced from '../../components/CSR/CampaignWizardEnhanced';
import campaignService from '../../services/campaignService';

const CSRCampaigns = () => {
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalReach: 0,
    budgetAllocated: 0,
    successRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);

  // Load campaign statistics
  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await campaignService.getCampaigns({ status: 'active' });
      const allCampaigns = await campaignService.getCampaigns({});
      
      const activeCampaigns = response.data?.length || 0;
      const totalCampaigns = allCampaigns.data?.length || 0;
      
      // Calculate total reach (sum of all campaign participants)
      const totalReach = allCampaigns.data?.reduce((sum, campaign) => 
        sum + (campaign.participants?.length || 0), 0) || 0;
      
      // Calculate total budget allocated
      const budgetAllocated = allCampaigns.data?.reduce((sum, campaign) => 
        sum + (campaign.budget?.totalAmount || 0), 0) || 0;
      
      // Calculate success rate (completed campaigns / total campaigns)
      const completedCampaigns = allCampaigns.data?.filter(campaign => 
        campaign.status === 'completed').length || 0;
      const successRate = totalCampaigns > 0 ? Math.round((completedCampaigns / totalCampaigns) * 100) : 0;

      setStats({
        activeCampaigns,
        totalReach,
        budgetAllocated,
        successRate
      });
    } catch (error) {
      console.error('Error loading campaign stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="bg-gradient-to-r from-indigo-50/95 via-purple-50/95 to-pink-50/95 backdrop-blur-xl border-b border-indigo-200/60 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-md shadow-indigo-500/30 flex-shrink-0">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                CSR Campaigns
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5 hidden sm:block">
                Manage and monitor all CSR campaigns and initiatives
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

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            {[
              {
                title: 'Active Campaigns',
                value: loading ? '...' : stats.activeCampaigns.toString(),
                change: '+0 this month',
                icon: Target,
                color: 'from-green-500 to-emerald-500',
                bgColor: 'from-green-50 to-emerald-50',
                borderColor: 'border-green-200'
              },
              {
                title: 'Total Reach',
                value: loading ? '...' : `${(stats.totalReach / 1000).toFixed(1)}K`,
                change: '+0% growth',
                icon: Users,
                color: 'from-blue-500 to-cyan-500',
                bgColor: 'from-blue-50 to-cyan-50',
                borderColor: 'border-blue-200'
              },
              {
                title: 'Budget Allocated',
                value: loading ? '...' : `₹${(stats.budgetAllocated / 100000).toFixed(1)}L`,
                change: '+0% increase',
                icon: DollarSign,
                color: 'from-purple-500 to-pink-500',
                bgColor: 'from-purple-50 to-pink-50',
                borderColor: 'border-purple-200'
              },
              {
                title: 'Success Rate',
                value: loading ? '...' : `${stats.successRate}%`,
                change: '+0% improvement',
                icon: TrendingUp,
                color: 'from-orange-500 to-red-500',
                bgColor: 'from-orange-50 to-red-50',
                borderColor: 'border-orange-200'
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

        {/* Campaign List Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <CampaignList
            onViewCampaign={(campaign) => {
              // Handle view campaign logic
              console.log('View campaign:', campaign);
            }}
            onCreateCampaign={() => {
              setShowWizard(true);
            }}
            onEditCampaign={(campaign) => {
              // Handle edit campaign logic
              console.log('Edit campaign:', campaign);
            }}
          />
        </motion.div>
      </div>

      {/* Campaign Wizard Modal */}
      {showWizard && (
        <CampaignWizardEnhanced
          onClose={() => setShowWizard(false)}
          onSuccess={() => {
            setShowWizard(false);
            loadStats(); // Refresh stats after creating campaign
          }}
        />
      )}
    </div>
  );
};

export default CSRCampaigns;
