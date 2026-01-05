import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, DollarSign, AlertTriangle, CreditCard, BarChart3,
  PieChart, Calendar, Target, Users, Activity, Clock
} from 'lucide-react';
import LiveBudgetTracking from '../../components/CSR/LiveBudgetTracking';
import budgetTrackingService from '../../services/budgetTrackingService';

const CSRBudgetTracking = () => {
  const [budgetStats, setBudgetStats] = useState({
    totalBudget: 0,
    spent: 0,
    remaining: 0,
    alerts: 0
  });
  const [loading, setLoading] = useState(true);

  // Load budget statistics
  const loadBudgetStats = async () => {
    setLoading(true);
    try {
      const response = await budgetTrackingService.getBudgetTracking();
      const data = response.data;
      
      setBudgetStats({
        totalBudget: data.totalBudget || 0,
        spent: data.spent || 0,
        remaining: data.remaining || 0,
        alerts: data.alerts?.length || 0
      });
    } catch (error) {
      console.error('Error loading budget stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgetStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="bg-gradient-to-r from-indigo-50/95 via-purple-50/95 to-pink-50/95 backdrop-blur-xl border-b border-indigo-200/60 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-md shadow-indigo-500/30 flex-shrink-0">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                Live Budget Tracking
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5 hidden sm:block">
                Real-time budget monitoring with spend vs remaining and threshold warnings
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

          {/* Budget Overview Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            {[
              {
                title: 'Total Budget',
                value: loading ? '...' : `₹${(budgetStats.totalBudget / 100000).toFixed(1)}L`,
                change: 'Allocated',
                icon: DollarSign,
                color: 'from-rose-500 to-pink-500',
                bgColor: 'from-rose-50 to-pink-50',
                borderColor: 'border-rose-200'
              },
              {
                title: 'Spent',
                value: loading ? '...' : `₹${(budgetStats.spent / 100000).toFixed(1)}L`,
                change: budgetStats.totalBudget > 0 ? `${Math.round((budgetStats.spent / budgetStats.totalBudget) * 100)}% utilized` : '0% utilized',
                icon: CreditCard,
                color: 'from-blue-500 to-cyan-500',
                bgColor: 'from-blue-50 to-cyan-50',
                borderColor: 'border-blue-200'
              },
              {
                title: 'Remaining',
                value: loading ? '...' : `₹${(budgetStats.remaining / 100000).toFixed(1)}L`,
                change: budgetStats.totalBudget > 0 ? `${Math.round((budgetStats.remaining / budgetStats.totalBudget) * 100)}% left` : '0% left',
                icon: Target,
                color: 'from-green-500 to-emerald-500',
                bgColor: 'from-green-50 to-emerald-50',
                borderColor: 'border-green-200'
              },
              {
                title: 'Alerts',
                value: loading ? '...' : budgetStats.alerts.toString(),
                change: '80% threshold',
                icon: AlertTriangle,
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

        {/* Budget Tracking Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-5 shadow-md border border-gray-100 mb-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-500" />
            Live Tracking Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Real-time Monitoring',
                description: 'Live updates of budget spend and remaining amounts',
                icon: BarChart3,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'Threshold Alerts',
                description: 'Automatic warnings when hitting 80% budget threshold',
                icon: AlertTriangle,
                color: 'from-orange-500 to-red-500'
              },
              {
                title: 'Spend Analytics',
                description: 'Detailed breakdown of spending by category and campaign',
                icon: PieChart,
                color: 'from-purple-500 to-pink-500'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.color} w-fit mb-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1.5">{feature.title}</h4>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Live Budget Tracking Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <LiveBudgetTracking
            onShowBudgetAlert={(alert) => console.log('Show budget alert:', alert)}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default CSRBudgetTracking;
