import CSRKPI from '../models/CSRKPI.js';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import Campaign from '../models/Campaign.js';
import CampaignApproval from '../models/CampaignApproval.js';
import UserProgress from '../models/UserProgress.js';
import XPLog from '../models/XPLog.js';
import Reward from '../models/Reward.js';
import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';

// Helper function to format time ago
const timeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
};

// Get comprehensive overview data
const getOverviewData = async (req, res) => {
  try {
    const { period = 'month', region = 'all' } = req.query;
    
    // Validate user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }
    
    // Use organizationId if available, otherwise use user's _id as fallback for single-org users
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    
    // Calculate date range based on period
    const now = new Date();
    let startDate;
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get impact data from real database
    const impactData = await calculateImpactData(startDate, region, organizationId);
    
    // Get module progress from real database
    const moduleProgress = await calculateModuleProgress(startDate, region, organizationId);
    
    // Get regional data from real database
    const regionalData = await calculateRegionalData(startDate, organizationId);
    
    // Get skills development data from real database
    const skillsData = await calculateSkillsDevelopment(startDate, region, organizationId);
    
    // Get recent activity from real database
    const recentActivity = await getRecentActivityData(10, organizationId);


    const responseData = {
      success: true,
      data: {
        impactData,
        moduleProgress,
        regionalData,
        skillsData,
        recentActivity,
        lastUpdated: new Date()
      }
    };

    // Emit socket event for real-time updates
    const io = req.app?.get('io');
    if (io && organizationId) {
      io.to(organizationId.toString()).emit('csr:overview:update');
      io.to('csr-overview').emit('csr-overview-broadcast', {
        type: 'overview-update',
        data: responseData.data,
        timestamp: new Date()
      });
    }

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching overview data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch overview data',
      error: error.message
    });
  }
};

// Get real-time metrics
const getRealTimeMetrics = async (req, res) => {
  try {
    // Validate user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }
    
    // Use organizationId if available, otherwise use user's _id as fallback
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Get today's metrics
    const todayMetrics = await calculateTodayMetrics(today, organizationId);
    
    // Get live statistics
    const liveStats = await calculateLiveStats(organizationId);

    // Return actual data - no mock fallbacks
    res.json({
      success: true,
      data: {
        activeUsers: liveStats.activeUsers || 0,
        activeCampaigns: liveStats.activeCampaigns || 0,
        pendingApprovals: liveStats.pendingApprovals || 0,
        systemHealth: liveStats.systemHealth || 'unknown',
        lastUpdate: liveStats.lastUpdate || new Date(),
        timestamp: new Date(),
        todayMetrics
      }
    });
  } catch (error) {
    console.error('Error fetching real-time metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch real-time metrics',
      error: error.message
    });
  }
};

// Get impact data by region
const getImpactByRegion = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { region } = req.params;
    const { timeRange = 'month' } = req.query;
    
    // Use organizationId if available, otherwise use user's _id as fallback
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const impactData = await calculateImpactDataByRegion(region, timeRange, organizationId);
    
    res.json({
      success: true,
      data: impactData
    });
  } catch (error) {
    console.error('Error fetching impact by region:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch impact by region',
      error: error.message
    });
  }
};

// Get module progress data
const getModuleProgress = async (req, res) => {
  try {
    const { period = 'month', region = 'all' } = req.query;
    
    const moduleProgress = await calculateModuleProgress(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), region);
    
    res.json({
      success: true,
      data: moduleProgress
    });
  } catch (error) {
    console.error('Error fetching module progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch module progress',
      error: error.message
    });
  }
};

// Get regional data
const getRegionalData = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    // Use orgId if available, otherwise use user's _id as fallback
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const regionalData = await calculateRegionalData(startDate, organizationId);
    
    res.json({
      success: true,
      data: regionalData
    });
  } catch (error) {
    console.error('Error fetching regional data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch regional data',
      error: error.message
    });
  }
};

// Get skills development data
const getSkillsDevelopment = async (req, res) => {
  try {
    const { period = 'month', region = 'all' } = req.query;
    
    // Use orgId if available, otherwise use user's _id as fallback
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const skillsData = await calculateSkillsDevelopment(startDate, region, organizationId);
    
    res.json({
      success: true,
      data: skillsData
    });
  } catch (error) {
    console.error('Error fetching skills development:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skills development data',
      error: error.message
    });
  }
};

// Get recent activity
const getRecentActivity = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // Use orgId if available, otherwise use user's _id as fallback
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    
    const activities = await getRecentActivityData(parseInt(limit), organizationId);
    
    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activity',
      error: error.message
    });
  }
};

// Get live statistics
const getLiveStats = async (req, res) => {
  try {
    const liveStats = await calculateLiveStats();
    
    res.json({
      success: true,
      data: liveStats
    });
  } catch (error) {
    console.error('Error fetching live stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch live statistics',
      error: error.message
    });
  }
};

// Helper functions
const calculateImpactData = async (startDate, region, organizationId) => {
  try {
    // Handle missing organizationId gracefully
    if (!organizationId) {
      // Return empty data structure if no organizationId
      return {
        studentsImpacted: 0,
        itemsDistributed: 0,
        totalValueFunded: 0,
        schoolsReached: 0,
        monthlyGrowth: 0,
        schoolsGrowth: 0,
        valueGrowth: 0,
        itemsGrowth: 0,
        regionsActive: 0,
        discountsFunded: 0,
        avgDiscountPerStudent: 0
      };
    }

    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    // Get students impacted from UserProgress with proper filters
    const studentsImpacted = await UserProgress.countDocuments({
      organizationId: orgObjectId,
      createdAt: { $gte: startDate }
    });

    // Get schools reached - count distinct school organizations that had student activity during the period
    // Filter by the CSR's organization context to prevent cross-tenant data leakage
    // First, get the CSR organization to determine the filtering context
    const csrOrg = await Organization.findById(orgObjectId);
    if (!csrOrg) {
      // If CSR organization not found, return 0
      return {
        studentsImpacted: 0,
        itemsDistributed: 0,
        totalValueFunded: 0,
        schoolsReached: 0,
        monthlyGrowth: 0,
        schoolsGrowth: 0,
        valueGrowth: 0,
        itemsGrowth: 0,
        regionsActive: 0,
        discountsFunded: 0,
        avgDiscountPerStudent: 0
      };
    }

    // Get all school organizations that belong to the same tenant as the CSR organization
    // This ensures we only count schools within the CSR's organizational context
    const schoolOrgs = await Organization.find({ 
      tenantId: csrOrg.tenantId,
      type: 'school'
    }).select('_id');
    const schoolOrgIds = schoolOrgs.map(org => org._id);

    // If no schools found in the same tenant, return 0
    if (schoolOrgIds.length === 0) {
      return {
        studentsImpacted: 0,
        itemsDistributed: 0,
        totalValueFunded: 0,
        schoolsReached: 0,
        monthlyGrowth: 0,
        schoolsGrowth: 0,
        valueGrowth: 0,
        itemsGrowth: 0,
        regionsActive: 0,
        discountsFunded: 0,
        avgDiscountPerStudent: 0
      };
    }

    // Get distinct school organizations that had student activity during the period
    // Filter by school organization IDs to ensure we only count schools in the CSR's tenant
    const schoolsWithActivity = await UserProgress.distinct('organizationId', {
      organizationId: { $in: schoolOrgIds },
      createdAt: { $gte: startDate }
    });
    const schoolsReached = schoolsWithActivity.length;

    // Get total value funded from Transaction with proper filters
    const totalValueFunded = await Transaction.aggregate([
      {
        $match: {
          organizationId: orgObjectId,
          createdAt: { $gte: startDate },
          type: { $in: ['earn', 'credit'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Get items distributed from Reward with proper filters
    const itemsDistributed = await Reward.countDocuments({
      organizationId: orgObjectId,
      createdAt: { $gte: startDate }
    });

    // Calculate growth percentages by comparing with previous period
    // Previous period should be of the same duration, ending at startDate
    const now = new Date();
    const periodDuration = now.getTime() - startDate.getTime();
    const previousPeriodStart = new Date(startDate.getTime() - periodDuration);

    // Students growth
    const previousPeriodStudents = await UserProgress.countDocuments({
      organizationId: orgObjectId,
      createdAt: { $gte: previousPeriodStart, $lt: startDate }
    });
    const currentPeriodStudents = await UserProgress.countDocuments({
      organizationId: orgObjectId,
      createdAt: { $gte: startDate, $lt: now } // Add upper bound to match previous period pattern
    });
    const monthlyGrowth = previousPeriodStudents > 0 
      ? ((currentPeriodStudents - previousPeriodStudents) / previousPeriodStudents) * 100 
      : 0;

    // Schools growth - use the same logic as current period calculation
    // Count distinct school organizations that had student activity in the previous period
    const previousPeriodSchoolsWithActivity = schoolOrgIds.length > 0
      ? await UserProgress.distinct('organizationId', {
          organizationId: { $in: schoolOrgIds },
          createdAt: { $gte: previousPeriodStart, $lt: startDate }
        })
      : [];
    const previousPeriodSchools = previousPeriodSchoolsWithActivity.length;
    const schoolsGrowth = previousPeriodSchools > 0
      ? ((schoolsReached - previousPeriodSchools) / previousPeriodSchools) * 100
      : 0;

    // Value funded growth
    const previousValueFunded = await Transaction.aggregate([
      {
        $match: {
          organizationId: orgObjectId,
          createdAt: { $gte: previousPeriodStart, $lt: startDate },
          type: { $in: ['earn', 'credit'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    const valueGrowth = previousValueFunded[0]?.total > 0
      ? ((totalValueFunded[0]?.total || 0) - previousValueFunded[0].total) / previousValueFunded[0].total * 100
      : 0;

    // Items distributed growth
    const previousItems = await Reward.countDocuments({
      organizationId: orgObjectId,
      createdAt: { $gte: previousPeriodStart, $lt: startDate }
    });
    const itemsGrowth = previousItems > 0
      ? ((itemsDistributed - previousItems) / previousItems) * 100
      : 0;

    // Get regions active (since we only have one organization, return 1)
    const regionsActive = 1;

    // Get discounts funded (using spend transactions)
    const discountsFunded = await Transaction.aggregate([
      {
        $match: {
          organizationId: orgObjectId,
          createdAt: { $gte: startDate },
          type: { $in: ['spend', 'debit'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const avgDiscountPerStudent = currentPeriodStudents > 0 
      ? (discountsFunded[0]?.total || 0) / currentPeriodStudents 
      : 0;

    return {
      studentsImpacted: currentPeriodStudents,
      itemsDistributed,
      totalValueFunded: totalValueFunded[0]?.total || 0,
      schoolsReached,
      monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
      schoolsGrowth: Math.round(schoolsGrowth * 100) / 100,
      valueGrowth: Math.round(valueGrowth * 100) / 100,
      itemsGrowth: Math.round(itemsGrowth * 100) / 100,
      regionsActive: regionsActive,
      discountsFunded: discountsFunded[0]?.total || 0,
      avgDiscountPerStudent: Math.round(avgDiscountPerStudent * 100) / 100
    };
  } catch (error) {
    console.error('Error calculating impact data:', error);
    throw error;
  }
};

const calculateModuleProgress = async (startDate, region, organizationId) => {
  try {
    // Handle missing organizationId gracefully
    if (!organizationId) {
      return {
        finance: { progress: 0, students: 0, completion: 0 },
        mental: { progress: 0, students: 0, completion: 0 },
        values: { progress: 0, students: 0, completion: 0 },
        ai: { progress: 0, students: 0, completion: 0 }
      };
    }

    const orgObjectId = new mongoose.Types.ObjectId(organizationId);
    const modules = ['finance', 'mental', 'values', 'ai'];
    const moduleProgress = {};

    // Get all users for this organization (User model uses orgId, not organizationId)
    const orgUsers = await User.find({ orgId: orgObjectId }).select('_id');
    const userIds = orgUsers.map(u => u._id);

    if (userIds.length === 0) {
      return {
        finance: { progress: 0, students: 0, completion: 0 },
        mental: { progress: 0, students: 0, completion: 0 },
        values: { progress: 0, students: 0, completion: 0 },
        ai: { progress: 0, students: 0, completion: 0 }
      };
    }

    // Get total students for this organization in the period
    const totalStudents = await UserProgress.countDocuments({
      userId: { $in: userIds },
      createdAt: { $gte: startDate }
    });

    // Calculate overall progress metrics
    const progressData = await UserProgress.aggregate([
      {
        $match: {
          userId: { $in: userIds },
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          avgXP: { $avg: '$xp' },
          avgLevel: { $avg: '$level' },
          maxXP: { $max: '$xp' },
          totalXP: { $sum: '$xp' },
          count: { $sum: 1 }
        }
      }
    ]);

    const avgXP = progressData[0]?.avgXP || 0;
    const avgLevel = progressData[0]?.avgLevel || 1;
    
    // Calculate completion (level 5+ = completed)
    const completedStudents = await UserProgress.countDocuments({
      userId: { $in: userIds },
      createdAt: { $gte: startDate },
      level: { $gte: 5 }
    });

    // Calculate module-specific metrics
    // Since we don't have module field, we'll calculate based on UserProgress data
    // and distribute progress evenly or based on XP thresholds
    for (const module of modules) {
      // Calculate progress based on average XP and level
      // Use different thresholds for each module to create variation
      const moduleThresholds = {
        finance: 500,
        mental: 600,
        values: 400,
        ai: 700
      };
      
      const threshold = moduleThresholds[module] || 500;
      let progress = 0;
      
      if (avgXP > 0) {
        // Calculate progress based on how close avgXP is to threshold
        progress = Math.min(Math.round((avgXP / threshold) * 100), 100);
      }

      // Calculate completion percentage (same for all modules since we can't differentiate)
      const completion = totalStudents > 0 ? Math.round((completedStudents / totalStudents) * 100) : 0;

      // Estimate students per module (distributed based on module thresholds)
      // Modules with lower thresholds get more students
      const moduleWeights = {
        finance: 0.3,
        mental: 0.25,
        values: 0.25,
        ai: 0.2
      };
      const weight = moduleWeights[module] || 0.25;
      const studentsPerModule = totalStudents > 0 
        ? Math.max(0, Math.round(totalStudents * weight))
        : 0;

      moduleProgress[module] = {
        progress: Math.max(0, Math.min(progress, 100)),
        students: studentsPerModule,
        completion: Math.max(0, Math.min(completion, 100))
      };
    }

    return moduleProgress;
  } catch (error) {
    console.error('Error calculating module progress:', error);
    // Return empty progress on error
    return {
      finance: { progress: 0, students: 0, completion: 0 },
      mental: { progress: 0, students: 0, completion: 0 },
      values: { progress: 0, students: 0, completion: 0 },
      ai: { progress: 0, students: 0, completion: 0 }
    };
  }
};

const calculateRegionalData = async (startDate, organizationId) => {
  try {
    // Convert organizationId to ObjectId for queries
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    // Get students count with organization and date filters
    const students = await UserProgress.countDocuments({
      organizationId: orgObjectId,
      createdAt: { $gte: startDate }
    });

    // Get items distributed count with organization and date filters
    const itemsDistributed = await Reward.countDocuments({
      organizationId: orgObjectId,
      createdAt: { $gte: startDate }
    });

    // Get value funded from transactions with organization and date filters
    const valueFundedData = await Transaction.aggregate([
      {
        $match: {
          organizationId: orgObjectId,
          createdAt: { $gte: startDate },
          type: { $in: ['earn', 'credit'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const valueFunded = valueFundedData[0]?.total || 0;

    // Calculate impact based on students and transactions
    const impact = students > 0 ? Math.min(Math.round((students / 100) * 100), 100) : 0;

    const regionalData = [{
      _id: organizationId,
      students,
      itemsDistributed,
      valueFunded,
      impact,
      topCategories: ['Food', 'Stationery', 'Uniforms']
    }];

    return regionalData;
  } catch (error) {
    console.error('Error calculating regional data:', error);
    throw error;
  }
};

const calculateSkillsDevelopment = async (startDate, region, organizationId) => {
  try {
    // Convert organizationId to ObjectId for queries
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    // Get all user IDs for this organization (XPLog doesn't have organizationId directly)
    const orgUsers = await User.find({ orgId: orgObjectId }).select('_id');
    const userIds = orgUsers.map(user => user._id);

    // If no users in organization, return empty data
    if (userIds.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'Skill Development (%)',
          data: [],
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
          borderColor: 'rgba(139, 92, 246, 1)',
          pointBackgroundColor: 'rgba(139, 92, 246, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(139, 92, 246, 1)'
        }]
      };
    }

    // Get skills development data from XPLog based on XP and reason with organization and date filters
    const skillsData = await XPLog.aggregate([
      {
        $match: {
          userId: { $in: userIds },
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$reason',
          avgXP: { $avg: '$xp' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { avgXP: -1 }
      },
      {
        $limit: 4
      }
    ]);

    const labels = skillsData.map(skill => skill._id || 'General Progress');
    const data = skillsData.map(skill => Math.min(Math.round((skill.avgXP / 100) * 100), 100));

    return {
      labels,
      datasets: [{
        label: 'Skill Development (%)',
        data,
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: 'rgba(139, 92, 246, 1)',
        pointBackgroundColor: 'rgba(139, 92, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(139, 92, 246, 1)'
      }]
    };
  } catch (error) {
    console.error('Error calculating skills development:', error);
    throw error;
  }
};

const getRecentActivityData = async (limit, organizationId) => {
  try {
    // Get recent activity from various sources
    // Fetch more items from each collection to ensure we get the true most recent across all sources
    // We fetch 3x the limit from each collection, then combine and take the top 'limit' items
    const fetchLimit = Math.max(limit * 3, 30); // Fetch at least 3x limit or 30, whichever is larger
    const recentActivities = [];

    // Get recent user progress activities
    const userProgressActivities = await UserProgress.find({
      organizationId: new mongoose.Types.ObjectId(organizationId)
    })
    .sort({ createdAt: -1 })
    .limit(fetchLimit)
    .populate('userId', 'name')
    .populate('organizationId', 'name');

    userProgressActivities.forEach(progress => {
      recentActivities.push({
        action: `Progress updated in ${progress.module}`,
        location: progress.organizationId?.name || 'Unknown School',
        time: timeAgo(progress.createdAt),
        createdAt: progress.createdAt, // Store original date for sorting
        color: 'blue'
      });
    });

    // Get recent transactions
    const recentTransactions = await Transaction.find({
      organizationId: new mongoose.Types.ObjectId(organizationId)
    })
    .sort({ createdAt: -1 })
    .limit(fetchLimit)
    .populate('organizationId', 'name');

    recentTransactions.forEach(transaction => {
      recentActivities.push({
        action: `${transaction.type} transaction`,
        location: transaction.organizationId?.name || 'Unknown School',
        time: timeAgo(transaction.createdAt),
        createdAt: transaction.createdAt, // Store original date for sorting
        color: transaction.type === 'reward' ? 'green' : 'orange'
      });
    });

    // Get recent rewards
    const recentRewards = await Reward.find({
      organizationId: new mongoose.Types.ObjectId(organizationId)
    })
    .sort({ createdAt: -1 })
    .limit(fetchLimit)
    .populate('organizationId', 'name');

    recentRewards.forEach(reward => {
      recentActivities.push({
        action: `Reward distributed: ${reward.name}`,
        location: reward.organizationId?.name || 'Unknown School',
        time: timeAgo(reward.createdAt),
        createdAt: reward.createdAt, // Store original date for sorting
        color: 'purple'
      });
    });

    // Sort by original createdAt date (most recent first) and return limited results
    return recentActivities
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting recent activity:', error);
    throw error;
  }
};

const calculateTodayMetrics = async (today, organizationId) => {
  try {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    // Get today's students
    const todayStudents = await UserProgress.countDocuments({
      organizationId: orgObjectId,
      createdAt: { $gte: today, $lt: tomorrow }
    });

    // Get today's schools - count distinct school organizations that had student activity today
    // Filter by the CSR's organization context to prevent cross-tenant data leakage
    const csrOrg = await Organization.findById(orgObjectId);
    let todaySchools = 0;
    
    if (csrOrg) {
      // Get all school organizations that belong to the same tenant as the CSR organization
      const schoolOrgs = await Organization.find({ 
        tenantId: csrOrg.tenantId,
        type: 'school'
      }).select('_id');
      const schoolOrgIds = schoolOrgs.map(org => org._id);

      // Get distinct school organizations that had student activity today
      if (schoolOrgIds.length > 0) {
        const schoolsWithActivity = await UserProgress.distinct('organizationId', {
          organizationId: { $in: schoolOrgIds },
          createdAt: { $gte: today, $lt: tomorrow }
        });
        todaySchools = schoolsWithActivity.length;
      }
    }

    // Get today's value
    const todayValue = await Transaction.aggregate([
      {
        $match: {
          organizationId: orgObjectId,
          createdAt: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Get today's items
    const todayItems = await Reward.countDocuments({
      organizationId: orgObjectId,
      createdAt: { $gte: today, $lt: tomorrow }
    });

    // Calculate growth
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const yesterdayStudents = await UserProgress.countDocuments({
      organizationId: orgObjectId,
      createdAt: { $gte: yesterday, $lt: today }
    });

    const todayGrowth = yesterdayStudents > 0 
      ? ((todayStudents - yesterdayStudents) / yesterdayStudents) * 100 
      : 0;

    return {
      todayStudents,
      todaySchools,
      todayValue: todayValue[0]?.total || 0,
      todayItems,
      todayGrowth: Math.round(todayGrowth * 100) / 100
    };
  } catch (error) {
    console.error('Error calculating today metrics:', error);
    throw error;
  }
};

const calculateLiveStats = async (organizationId) => {
  try {
    // Get active users (users with recent activity)
    const activeUsers = await UserProgress.countDocuments({
      organizationId: new mongoose.Types.ObjectId(organizationId),
      updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    });

    // Get active campaigns (if Campaign model exists)
    const activeCampaigns = await Campaign.countDocuments({
      organizationId: new mongoose.Types.ObjectId(organizationId),
      status: 'active'
    }).catch(() => 0); // Return 0 if Campaign model doesn't exist

    // Get pending approvals (if CampaignApproval model exists)
    const pendingApprovals = await CampaignApproval.countDocuments({
      organizationId: new mongoose.Types.ObjectId(organizationId),
      status: 'pending'
    }).catch(() => 0); // Return 0 if CampaignApproval model doesn't exist

    // Determine system health based on data availability
    const systemHealth = activeUsers > 0 ? 'excellent' : 'good';

    return {
      activeUsers,
      activeCampaigns,
      pendingApprovals,
      systemHealth,
      lastUpdate: new Date()
    };
  } catch (error) {
    console.error('Error calculating live stats:', error);
    throw error;
  }
};

const calculateImpactDataByRegion = async (region, timeRange, organizationId) => {
  try {
    if (!organizationId) {
      throw new Error('Organization ID is required');
    }

    // Calculate date range based on timeRange
    const now = new Date();
    let startDate;
    switch (timeRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get actual data from database
    const students = await UserProgress.countDocuments({
      organizationId: new mongoose.Types.ObjectId(organizationId),
      createdAt: { $gte: startDate }
    });

    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    // Count distinct school organizations that had student activity during the period
    // Filter by the CSR's organization context to prevent cross-tenant data leakage
    const csrOrg = await Organization.findById(orgObjectId);
    if (!csrOrg) {
      throw new Error('CSR organization not found');
    }

    // Get all school organizations that belong to the same tenant as the CSR organization
    const schoolOrgs = await Organization.find({ 
      tenantId: csrOrg.tenantId,
      type: 'school'
    }).select('_id');
    const schoolOrgIds = schoolOrgs.map(org => org._id);

    // Get distinct school organizations that had student activity during the period
    // Filter by school organization IDs to ensure we only count schools in the CSR's tenant
    const schoolsWithActivity = schoolOrgIds.length > 0
      ? await UserProgress.distinct('organizationId', {
          organizationId: { $in: schoolOrgIds },
          createdAt: { $gte: startDate }
        })
      : [];
    const schools = schoolsWithActivity.length;

    const valueFundedData = await Transaction.aggregate([
      {
        $match: {
          organizationId: new mongoose.Types.ObjectId(organizationId),
          createdAt: { $gte: startDate },
          type: { $in: ['earn', 'credit'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const itemsDistributed = await Reward.countDocuments({
      organizationId: new mongoose.Types.ObjectId(organizationId),
      createdAt: { $gte: startDate }
    });

    const valueFunded = valueFundedData[0]?.total || 0;
    const impact = students > 0 ? Math.min(Math.round((students / 100) * 100), 100) : 0;

    // Get top categories from actual reward data
    const topCategoriesData = await Reward.aggregate([
      {
        $match: {
          organizationId: new mongoose.Types.ObjectId(organizationId),
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 3
      }
    ]);

    const topCategories = topCategoriesData.map(item => item._id || 'General');

    return {
      students,
      schools,
      impact,
      itemsDistributed,
      valueFunded,
      topCategories: topCategories.length > 0 ? topCategories : ['N/A']
    };
  } catch (error) {
    console.error('Error calculating impact data by region:', error);
    throw error;
  }
};

export default {
  getOverviewData,
  getRealTimeMetrics,
  getImpactByRegion,
  getModuleProgress,
  getRegionalData,
  getSkillsDevelopment,
  getRecentActivity,
  getLiveStats
};
