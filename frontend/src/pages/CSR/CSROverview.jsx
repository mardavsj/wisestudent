import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Building, DollarSign, Gift, Target, BarChart3,
  Wifi, WifiOff, RefreshCw, Clock, TrendingUp, Activity
} from 'lucide-react';
import CSRKPIComponent from '../../components/CSR/CSRKPIComponent';
import csrOverviewService from '../../services/csrOverviewService';
import { useSocket } from '../../context/SocketContext';

const CSROverview = () => {
  const socketContext = useSocket();
  const socket = socketContext?.socket || null;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [impactData, setImpactData] = useState(null);
  const [moduleProgress, setModuleProgress] = useState(null);
  const [skillsData, setSkillsData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [showKPIs, setShowKPIs] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [timeRange, setTimeRange] = useState('month');
  const [error, setError] = useState(null);
  
  // Use refs to track filter values for socket handlers
  const filtersRef = useRef({ timeRange, selectedRegion });
  
  // Update refs when filters change
  useEffect(() => {
    filtersRef.current = { timeRange, selectedRegion };
  }, [timeRange, selectedRegion]);

  const fetchOverviewData = useCallback(async (isRefresh = false) => {
    try {
      setError(null);
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await csrOverviewService.getOverviewData({
        period: timeRange,
        region: selectedRegion
      });

      if (response.success) {
        setImpactData(response.data.impactData);
        setModuleProgress(response.data.moduleProgress);
        setSkillsData(response.data.skillsData);
        setLastUpdated(response.data.lastUpdated);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error fetching overview data:', error);
      setError(error.response?.data?.message || 'Failed to fetch overview data');
      setIsConnected(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timeRange, selectedRegion]);

  // Initial data fetch and when filters change
  useEffect(() => {
    fetchOverviewData();
  }, [fetchOverviewData]);

  // Memoize filters object to prevent unnecessary re-renders of CSRKPIComponent
  const kpiFilters = useMemo(() => ({
    period: timeRange,
    region: selectedRegion
  }), [timeRange, selectedRegion]);

  // Real-time updates via Socket.IO
  useEffect(() => {
    if (!socket) return;

    // Listen for overview updates - use ref to get latest filter values
    const handleOverviewUpdate = async () => {
      try {
        const { timeRange: currentTimeRange, selectedRegion: currentRegion } = filtersRef.current;
        const response = await csrOverviewService.getOverviewData({
          period: currentTimeRange,
          region: currentRegion
        });
        if (response.success) {
          setImpactData(response.data.impactData);
          setModuleProgress(response.data.moduleProgress);
          setSkillsData(response.data.skillsData);
          setLastUpdated(response.data.lastUpdated);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error updating overview data:', error);
      }
    };

    // Listen for impact data updates
    const handleImpactUpdate = (data) => {
      if (data && data.data) {
        setImpactData(prev => ({
          ...prev,
          ...data.data,
          lastUpdated: new Date()
        }));
        setLastUpdated(new Date());
      }
    };

    // Listen for module progress updates
    const handleModuleProgressUpdate = (data) => {
      if (data && data.data) {
        setModuleProgress(data.data);
        setLastUpdated(new Date());
      }
    };

    // Listen for skills development updates
    const handleSkillsUpdate = (data) => {
      if (data && data.data) {
        setSkillsData(data.data);
        setLastUpdated(new Date());
      }
    };

    // Listen for broadcast updates
    const handleBroadcast = (data) => {
      if (data.type === 'overview-update') {
        handleOverviewUpdate();
      } else if (data.type === 'impact-update') {
        handleImpactUpdate(data);
      } else if (data.type === 'module-progress-update') {
        handleModuleProgressUpdate(data);
      }
    };

    // Connection status
    const handleConnect = () => {
      setIsConnected(true);
      console.log('CSR Overview: Socket connected');
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log('CSR Overview: Socket disconnected');
    };

    // Handler for csr-overview-update event
    const handleOverviewDataUpdate = (data) => {
      if (data && data.data) {
        // Update all data from the overview update
        if (data.data.impactData) setImpactData(data.data.impactData);
        if (data.data.moduleProgress) setModuleProgress(data.data.moduleProgress);
        if (data.data.skillsData) setSkillsData(data.data.skillsData);
        setLastUpdated(new Date());
        setIsConnected(true);
      } else {
        // If no data, trigger full refresh
        handleOverviewUpdate();
      }
    };

    // Handler for connection confirmation
    const handleConnected = () => {
      setIsConnected(true);
      // Don't emit here - the initial fetchOverviewData will handle it
    };

    // Subscribe to real-time events
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('csr-overview-update', handleOverviewDataUpdate);
    socket.on('csr-overview-broadcast', handleBroadcast);
    socket.on('impact-update', handleImpactUpdate);
    socket.on('module-progress-update', handleModuleProgressUpdate);
    socket.on('csr:overview:update', handleOverviewUpdate);
    socket.on('csr-overview-connected', handleConnected);

    // Request initial real-time data if already connected (only once on mount)
    // Remove this - it will be requested by the initial fetchOverviewData call

    // Cleanup listeners
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('csr-overview-update', handleOverviewDataUpdate);
      socket.off('csr-overview-broadcast', handleBroadcast);
      socket.off('impact-update', handleImpactUpdate);
      socket.off('module-progress-update', handleModuleProgressUpdate);
      socket.off('csr:overview:update', handleOverviewUpdate);
      socket.off('csr-overview-connected', handleConnected);
    };
  }, [socket]); // Only depend on socket, not filters

  // Fallback polling for real-time updates (every 30 seconds if socket not available)
  useEffect(() => {
    if (socket && socket.connected) return; // Don't poll if socket is available

    const interval = setInterval(() => {
      fetchOverviewData(true);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [socket, socket?.connected, fetchOverviewData]);

  const handleRefresh = () => {
    fetchOverviewData(true);
    // Request real-time update via socket if available
    if (socket && socket.connected) {
      socket.emit('request-csr-overview-data', {
        period: timeRange,
        region: selectedRegion
      });
    }
  };

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
                    CSR Overview
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm mt-0.5 hidden sm:block">
                    Comprehensive view of CSR impact and performance metrics
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {isConnected ? (
                <div className="flex items-center gap-2 text-green-600">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </div>
                  <span className="text-sm font-bold">Live</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <WifiOff className="w-4 h-4" />
                  <span className="text-sm font-semibold">Offline</span>
                </div>
              )}
              {lastUpdated && (
                <div className="text-sm text-gray-600 flex items-center gap-2 font-medium">
                  <Clock className="w-4 h-4 text-purple-500" />
                  {new Date(lastUpdated).toLocaleTimeString()}
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-3 py-1.5 bg-purple-600 text-white rounded-lg shadow-sm flex items-center gap-2 hover:bg-purple-700 hover:shadow-md transition-all disabled:opacity-50 text-sm font-semibold"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-white rounded-xl shadow-md border border-gray-100 p-4"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300/50 focus:border-blue-400 transition-all text-sm font-medium text-gray-700 cursor-pointer"
            >
              <option value="all">All Regions</option>
              <option value="north">North India</option>
              <option value="south">South India</option>
              <option value="east">East India</option>
              <option value="west">West India</option>
              <option value="central">Central India</option>
            </select>

            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all text-sm font-medium text-gray-700 cursor-pointer"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 3 Months</option>
              <option value="year">Last Year</option>
              <option value="all">All Time</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowKPIs(!showKPIs)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 hover:shadow-md transition-all flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              {showKPIs ? 'Hide KPIs' : 'Show KPIs'}
            </motion.button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <WifiOff className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-900">Error Loading Data</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <button
                  onClick={handleRefresh}
                  className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </motion.div>
          )}

          {showKPIs && (
            <CSRKPIComponent 
              filters={kpiFilters}
            />
          )}

          {!showKPIs && (
            <>
              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center h-64">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-6"
                    />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Overview</h2>
                    <p className="text-gray-600">Fetching CSR impact data...</p>
                  </motion.div>
                </div>
              )}

              {/* Key Metrics Cards */}
              {!loading && impactData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
                >
                  {[
                    {
                      title: 'Students Impacted',
                      value: impactData.studentsImpacted?.toLocaleString() || '0',
                      change: `+${impactData.monthlyGrowth?.toFixed(1) || 0}%`,
                      icon: Users,
                      iconBg: 'bg-blue-500',
                      iconColor: 'text-white',
                      bgColor: 'bg-blue-50',
                      borderColor: 'border-blue-200',
                      textColor: 'text-blue-700'
                    },
                    {
                      title: 'Schools Reached',
                      value: impactData.schoolsReached?.toLocaleString() || '0',
                      change: impactData.schoolsGrowth ? `+${impactData.schoolsGrowth.toFixed(1)}%` : 'N/A',
                      icon: Building,
                      iconBg: 'bg-green-500',
                      iconColor: 'text-white',
                      bgColor: 'bg-green-50',
                      borderColor: 'border-green-200',
                      textColor: 'text-green-700'
                    },
                    {
                      title: 'Total Value Funded',
                      value: `₹${((impactData.totalValueFunded || 0) / 100000).toFixed(1)}L`,
                      change: impactData.valueGrowth ? `+${impactData.valueGrowth.toFixed(1)}%` : 'N/A',
                      icon: DollarSign,
                      iconBg: 'bg-purple-500',
                      iconColor: 'text-white',
                      bgColor: 'bg-purple-50',
                      borderColor: 'border-purple-200',
                      textColor: 'text-purple-700'
                    },
                    {
                      title: 'Items Distributed',
                      value: impactData.itemsDistributed?.toLocaleString() || '0',
                      change: impactData.itemsGrowth ? `+${impactData.itemsGrowth.toFixed(1)}%` : 'N/A',
                      icon: Gift,
                      iconBg: 'bg-orange-500',
                      iconColor: 'text-white',
                      bgColor: 'bg-orange-50',
                      borderColor: 'border-orange-200',
                      textColor: 'text-orange-700'
                    }
                  ].map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                      <motion.div
                        key={metric.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + index * 0.05 }}
                        whileHover={{ y: -2, scale: 1.01 }}
                        className={`${metric.bgColor} border border-gray-100 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-2 ${metric.iconBg} rounded-lg shadow-sm`}>
                            <Icon className={`w-5 h-5 ${metric.iconColor}`} />
                          </div>
                          {metric.change !== 'N/A' && (
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-xs font-semibold">
                              <TrendingUp className="w-3 h-3" />
                              {metric.change}
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-0.5">
                          <h3 className="text-3xl font-bold text-gray-900">
                            {metric.value}
                          </h3>
                          <p className="text-xs font-semibold text-gray-600">
                            {metric.title}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {/* Module Progress */}
              {!loading && moduleProgress && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl shadow-md border border-gray-100 p-5 mb-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-purple-100 rounded-lg">
                      <Activity className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Module Progress</h2>
                      <p className="text-xs text-gray-600">Track module completion</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(moduleProgress).map(([module, data], index) => {
                      const moduleStyles = {
                        finance: {
                          iconBg: 'bg-emerald-500',
                          bgColor: 'bg-emerald-50',
                          borderColor: 'border-emerald-200',
                          textColor: 'text-emerald-700',
                          progressColor: 'bg-emerald-500'
                        },
                        mental: {
                          iconBg: 'bg-blue-500',
                          bgColor: 'bg-blue-50',
                          borderColor: 'border-blue-200',
                          textColor: 'text-blue-700',
                          progressColor: 'bg-blue-500'
                        },
                        values: {
                          iconBg: 'bg-purple-500',
                          bgColor: 'bg-purple-50',
                          borderColor: 'border-purple-200',
                          textColor: 'text-purple-700',
                          progressColor: 'bg-purple-500'
                        },
                        ai: {
                          iconBg: 'bg-orange-500',
                          bgColor: 'bg-orange-50',
                          borderColor: 'border-orange-200',
                          textColor: 'text-orange-700',
                          progressColor: 'bg-orange-500'
                        }
                      };
                      
                      const moduleIcons = {
                        finance: DollarSign,
                        mental: Activity,
                        values: Target,
                        ai: BarChart3
                      };
                      
                      const Icon = moduleIcons[module] || Activity;
                      const styles = moduleStyles[module] || moduleStyles.mental;
                      
                      return (
                        <motion.div
                          key={module}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.35 + index * 0.05 }}
                          className={`${styles.bgColor} border border-gray-200 rounded-lg p-3`}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <div className={`p-1.5 ${styles.iconBg} rounded-md shadow-sm`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-gray-900 capitalize">
                                {module} Module
                              </h3>
                              <p className="text-xs text-gray-600">
                                {data.progress}% Complete
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">Progress</span>
                              <span className="text-xs font-bold text-gray-900">{data.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${data.progress}%` }}
                                transition={{ duration: 1, delay: 0.4 + index * 0.05 }}
                                className={`${styles.progressColor} h-2 rounded-full`}
                              />
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-600">{data.students} students</span>
                              <span className="text-gray-600">Active</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Skills Development Chart */}
              {!loading && skillsData && skillsData.labels?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-xl shadow-md border border-gray-100 p-5"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-indigo-100 rounded-lg">
                      <BarChart3 className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Skills Development</h2>
                      <p className="text-xs text-gray-600">Track skill growth</p>
                    </div>
                  </div>
                  
                  <div className="h-80">
                    {/* Chart placeholder */}
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border-2 border-dashed border-indigo-200">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
                        <p className="text-gray-700 font-semibold text-sm">Skills Development Chart</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {skillsData.labels.length} skills tracked
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CSROverview;
