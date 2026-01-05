import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, CreditCard, TrendingUp, PieChart, BarChart3,
  Plus, Download, Eye, Edit, Calendar, Users, Target
} from 'lucide-react';
import CSRFinancialDashboard from '../../components/CSR/CSRFinancialDashboard';
import PaymentModal from '../../components/CSR/PaymentModal';
import csrFinancialService from '../../services/csrFinancialService';

const CSRFinancial = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [financialStats, setFinancialStats] = useState({
    totalBudget: 0,
    healCoinsPool: 0,
    activePayments: 0,
    roi: 0
  });
  const [loading, setLoading] = useState(true);

  // Load financial statistics
  const loadFinancialStats = async () => {
    setLoading(true);
    try {
      const [financialSummary, payments] = await Promise.all([
        csrFinancialService.getFinancialSummary(),
        csrFinancialService.getPayments({ status: 'active' })
      ]);

      setFinancialStats({
        totalBudget: financialSummary.data?.totalBudget || 0,
        healCoinsPool: financialSummary.data?.healCoinsPool || 0,
        activePayments: payments.data?.length || 0,
        roi: financialSummary.data?.roi || 0
      });
    } catch (error) {
      console.error('Error loading financial stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinancialStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="bg-gradient-to-r from-indigo-50/95 via-purple-50/95 to-pink-50/95 backdrop-blur-xl border-b border-indigo-200/60 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-md shadow-indigo-500/30 flex-shrink-0">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                Financial Management
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5 hidden sm:block">
                Manage CSR payments, budgets, and financial analytics
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

          {/* Quick Financial Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            {[
              {
                title: 'Total Budget',
                value: loading ? '...' : `₹${(financialStats.totalBudget / 100000).toFixed(1)}L`,
                change: '+0% this quarter',
                icon: DollarSign,
                color: 'from-emerald-500 to-teal-500',
                bgColor: 'from-emerald-50 to-teal-50',
                borderColor: 'border-emerald-200'
              },
              {
                title: 'HealCoins Pool',
                value: loading ? '...' : `${(financialStats.healCoinsPool / 1000000).toFixed(1)}M`,
                change: '+0% increase',
                icon: CreditCard,
                color: 'from-blue-500 to-cyan-500',
                bgColor: 'from-blue-50 to-cyan-50',
                borderColor: 'border-blue-200'
              },
              {
                title: 'Active Payments',
                value: loading ? '...' : financialStats.activePayments.toString(),
                change: '0 pending',
                icon: TrendingUp,
                color: 'from-purple-500 to-pink-500',
                bgColor: 'from-purple-50 to-pink-50',
                borderColor: 'border-purple-200'
              },
              {
                title: 'ROI',
                value: loading ? '...' : `${financialStats.roi}%`,
                change: '+0% improvement',
                icon: BarChart3,
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

        {/* Financial Dashboard Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <CSRFinancialDashboard
            onShowPaymentModal={() => setShowPaymentModal(true)}
          />
        </motion.div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <PaymentModal
            onClose={() => setShowPaymentModal(false)}
            onSuccess={() => {
              setShowPaymentModal(false);
              loadFinancialStats(); // Refresh financial stats after payment creation
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CSRFinancial;
