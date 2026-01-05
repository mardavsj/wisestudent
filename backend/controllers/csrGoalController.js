import CSRGoal from '../models/CSRGoal.js';
import Campaign from '../models/Campaign.js';
import UserProgress from '../models/UserProgress.js';
import Organization from '../models/Organization.js';
import Transaction from '../models/Transaction.js';
import Reward from '../models/Reward.js';
import mongoose from 'mongoose';

// Create a new goal
export const createGoal = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const {
      goalName,
      description,
      goalType,
      category,
      period,
      startDate,
      endDate,
      targetValue,
      unit,
      priority,
      relatedCampaigns,
      milestones
    } = req.body;

    // Validate required fields
    if (!goalName || !goalType || !period || !startDate || !endDate || !targetValue) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: goalName, goalType, period, startDate, endDate, targetValue'
      });
    }

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    // Create goal
    const goal = new CSRGoal({
      goalName,
      description,
      goalType,
      category: category || 'impact',
      period,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      targetValue,
      unit: unit || 'count',
      priority: priority || 'medium',
      organizationId: orgObjectId,
      createdBy: req.user._id,
      status: 'active',
      relatedCampaigns: relatedCampaigns || [],
      progress: {
        milestones: milestones || []
      }
    });

    // Add audit trail
    goal.auditTrail.push({
      action: 'goal_created',
      performedBy: req.user._id,
      details: `Goal "${goalName}" created`,
      changes: goal.toObject()
    });

    await goal.save();

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io && organizationId) {
      io.to(organizationId.toString()).emit('csr:goals:update');
    }

    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      data: goal
    });
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create goal',
      error: error.message
    });
  }
};

// Get all goals
export const getGoals = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { status, period, goalType, category } = req.query;
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    const query = { organizationId: orgObjectId };
    
    if (status) query.status = status;
    if (period) query.period = period;
    if (goalType) query.goalType = goalType;
    if (category) query.category = category;

    const goals = await CSRGoal.find(query)
      .populate('createdBy', 'name email')
      .populate('relatedCampaigns', 'title status')
      .sort({ createdAt: -1 });

    // Update progress for all goals in parallel to avoid N+1 query problem
    await Promise.all(goals.map(async (goal) => {
      await updateGoalProgress(goal);
      await goal.save();
    }));

    res.json({
      success: true,
      data: goals
    });
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch goals',
      error: error.message
    });
  }
};

// Get goal by ID
export const getGoalById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { goalId } = req.params;
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    const goal = await CSRGoal.findOne({
      _id: goalId,
      organizationId: orgObjectId
    })
      .populate('createdBy', 'name email')
      .populate('relatedCampaigns', 'title status')
      .populate('notes.addedBy', 'name email');

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    // Update progress
    await updateGoalProgress(goal);
    await goal.save();

    res.json({
      success: true,
      data: goal
    });
  } catch (error) {
    console.error('Error fetching goal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch goal',
      error: error.message
    });
  }
};

// Update goal
export const updateGoal = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { goalId } = req.params;
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    const goal = await CSRGoal.findOne({
      _id: goalId,
      organizationId: orgObjectId
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    const oldValue = goal.toObject();
    const updates = req.body;

    // Update allowed fields
    if (updates.goalName) goal.goalName = updates.goalName;
    if (updates.description !== undefined) goal.description = updates.description;
    if (updates.targetValue !== undefined) goal.targetValue = updates.targetValue;
    if (updates.priority) goal.priority = updates.priority;
    if (updates.status) goal.status = updates.status;
    if (updates.endDate) goal.endDate = new Date(updates.endDate);
    if (updates.relatedCampaigns) goal.relatedCampaigns = updates.relatedCampaigns;
    if (updates.milestones) goal.progress.milestones = updates.milestones;

    // Recalculate progress
    goal.calculateProgress();
    goal.updateStatus();

    // Add audit trail
    goal.auditTrail.push({
      action: 'goal_updated',
      performedBy: req.user._id,
      details: 'Goal updated',
      changes: { old: oldValue, new: goal.toObject() }
    });

    await goal.save();

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io && organizationId) {
      io.to(organizationId.toString()).emit('csr:goals:update');
    }

    res.json({
      success: true,
      message: 'Goal updated successfully',
      data: goal
    });
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update goal',
      error: error.message
    });
  }
};

// Delete goal
export const deleteGoal = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { goalId } = req.params;
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    const goal = await CSRGoal.findOneAndDelete({
      _id: goalId,
      organizationId: orgObjectId
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io && organizationId) {
      io.to(organizationId.toString()).emit('csr:goals:update');
    }

    res.json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete goal',
      error: error.message
    });
  }
};

// Get goal progress summary
export const getGoalProgress = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    const goals = await CSRGoal.find({
      organizationId: orgObjectId,
      status: { $in: ['active', 'on_track', 'at_risk', 'behind'] }
    });

    // Update progress for all goals
    for (const goal of goals) {
      await updateGoalProgress(goal);
      goal.updateStatus();
      await goal.save();
    }

    const summary = {
      total: goals.length,
      onTrack: goals.filter(g => g.status === 'on_track').length,
      atRisk: goals.filter(g => g.status === 'at_risk').length,
      behind: goals.filter(g => g.status === 'behind').length,
      completed: goals.filter(g => g.status === 'completed').length,
      averageProgress: goals.length > 0
        ? goals.reduce((sum, g) => sum + g.progress.percentage, 0) / goals.length
        : 0
    };

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching goal progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch goal progress',
      error: error.message
    });
  }
};

// Helper function to update goal progress based on actual data
const updateGoalProgress = async (goal) => {
  try {
    const organizationId = goal.organizationId;
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);
    const now = new Date();
    
    let currentValue = 0;

    switch (goal.goalType) {
      case 'students_reached':
        currentValue = await UserProgress.countDocuments({
          organizationId: orgObjectId,
          createdAt: { $gte: goal.startDate, $lte: goal.endDate }
        });
        break;

      case 'schools_reached':
        // Count distinct school organizations that had student activity during the goal period
        // Filter by the CSR's organization context to prevent cross-tenant data leakage
        const csrOrg = await Organization.findById(orgObjectId);
        if (!csrOrg) {
          currentValue = 0;
          break;
        }

        // Get all school organizations that belong to the same tenant as the CSR organization
        const schoolOrgs = await Organization.find({ 
          tenantId: csrOrg.tenantId,
          type: 'school'
        }).select('_id');
        const schoolOrgIds = schoolOrgs.map(org => org._id);

        // Get distinct school organizations that had student activity during the goal period
        // Filter by school organization IDs to ensure we only count schools in the CSR's tenant
        const schoolsWithActivity = schoolOrgIds.length > 0
          ? await UserProgress.distinct('organizationId', {
              organizationId: { $in: schoolOrgIds },
              createdAt: { $gte: goal.startDate, $lte: goal.endDate }
            })
          : [];
        currentValue = schoolsWithActivity.length;
        break;

      case 'budget_utilization':
        const budgetData = await Transaction.aggregate([
          {
            $match: {
              organizationId: orgObjectId,
              createdAt: { $gte: goal.startDate, $lte: goal.endDate },
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
        currentValue = budgetData[0]?.total || 0;
        break;

      case 'campaign_completion':
        const campaigns = await Campaign.countDocuments({
          organizationId: orgObjectId,
          status: 'completed',
          'timeline.endDate': { $gte: goal.startDate, $lte: goal.endDate }
        });
        currentValue = campaigns;
        break;

      case 'engagement_lift':
        // This would require calculating engagement metrics
        // For now, set to 0 or use a placeholder
        currentValue = 0;
        break;

      case 'certificates_issued':
        // This would require a certificates model or calculation
        currentValue = 0;
        break;

      default:
        currentValue = 0;
    }

    goal.currentValue = currentValue;
    goal.calculateProgress();
    goal.updateStatus();

    return goal;
  } catch (error) {
    console.error('Error updating goal progress:', error);
    return goal;
  }
};

// Add note to goal
export const addGoalNote = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { goalId } = req.params;
    const { note } = req.body;
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    const goal = await CSRGoal.findOne({
      _id: goalId,
      organizationId: orgObjectId
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    goal.notes.push({
      note,
      addedBy: req.user._id
    });

    await goal.save();

    res.json({
      success: true,
      message: 'Note added successfully',
      data: goal
    });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add note',
      error: error.message
    });
  }
};

export default {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  getGoalProgress,
  addGoalNote
};

