import CSRROICalculation from '../models/CSRROICalculation.js';
import mongoose from 'mongoose';

// Create a new ROI calculation
export const createROICalculation = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const {
      calculationName,
      description,
      inputs,
      benefits,
      impactMetrics,
      startDate,
      endDate,
      relatedCampaignId,
      relatedGoalId,
      assumptions
    } = req.body;

    // Validate required fields
    if (!calculationName || !inputs || !inputs.totalInvestment || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: calculationName, inputs.totalInvestment, startDate, endDate'
      });
    }

    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    const calculation = new CSRROICalculation({
      calculationName,
      description,
      inputs: {
        totalInvestment: inputs.totalInvestment || 0,
        operationalCosts: inputs.operationalCosts || 0,
        marketingCosts: inputs.marketingCosts || 0,
        administrativeCosts: inputs.administrativeCosts || 0,
        otherCosts: inputs.otherCosts || 0
      },
      benefits: {
        costSavings: benefits?.costSavings || 0,
        revenueGenerated: benefits?.revenueGenerated || 0,
        taxBenefits: benefits?.taxBenefits || 0,
        brandValueIncrease: benefits?.brandValueIncrease || 0,
        employeeEngagementValue: benefits?.employeeEngagementValue || 0,
        communityGoodwillValue: benefits?.communityGoodwillValue || 0,
        socialImpactValue: benefits?.socialImpactValue || 0,
        environmentalImpactValue: benefits?.environmentalImpactValue || 0
      },
      impactMetrics: {
        studentsReached: impactMetrics?.studentsReached || 0,
        schoolsReached: impactMetrics?.schoolsReached || 0,
        certificatesIssued: impactMetrics?.certificatesIssued || 0,
        jobsCreated: impactMetrics?.jobsCreated || 0,
        communitiesImpacted: impactMetrics?.communitiesImpacted || 0
      },
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      organizationId: orgObjectId,
      createdBy: req.user._id,
      relatedCampaignId: relatedCampaignId || null,
      relatedGoalId: relatedGoalId || null,
      assumptions: assumptions || []
    });

    // Calculate ROI (will be done in pre-save hook)
    calculation.calculateROI();

    // Add audit trail
    calculation.auditTrail.push({
      action: 'calculation_created',
      performedBy: req.user._id,
      details: `ROI calculation "${calculationName}" created`,
      changes: calculation.toObject()
    });

    await calculation.save();

    res.status(201).json({
      success: true,
      message: 'ROI calculation created successfully',
      data: calculation
    });
  } catch (error) {
    console.error('Error creating ROI calculation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create ROI calculation',
      error: error.message
    });
  }
};

// Get all ROI calculations
export const getROICalculations = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { status, startDate, endDate } = req.query;
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    const query = { organizationId: orgObjectId };
    
    if (status) query.status = status;
    
    if (startDate || endDate) {
      query.calculationDate = {};
      if (startDate) query.calculationDate.$gte = new Date(startDate);
      if (endDate) query.calculationDate.$lte = new Date(endDate);
    }

    const calculations = await CSRROICalculation.find(query)
      .populate('createdBy', 'name email')
      .populate('relatedCampaignId', 'title')
      .populate('relatedGoalId', 'goalName')
      .sort({ calculationDate: -1 });

    res.json({
      success: true,
      data: calculations
    });
  } catch (error) {
    console.error('Error fetching ROI calculations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ROI calculations',
      error: error.message
    });
  }
};

// Get calculation by ID
export const getCalculationById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { calculationId } = req.params;
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    const calculation = await CSRROICalculation.findOne({
      _id: calculationId,
      organizationId: orgObjectId
    })
      .populate('createdBy', 'name email')
      .populate('relatedCampaignId', 'title')
      .populate('relatedGoalId', 'goalName')
      .populate('notes.addedBy', 'name email');

    if (!calculation) {
      return res.status(404).json({
        success: false,
        message: 'Calculation not found'
      });
    }

    // Recalculate ROI to ensure it's up to date
    calculation.calculateROI();
    await calculation.save();

    res.json({
      success: true,
      data: calculation
    });
  } catch (error) {
    console.error('Error fetching calculation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch calculation',
      error: error.message
    });
  }
};

// Update calculation
export const updateCalculation = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { calculationId } = req.params;
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    const calculation = await CSRROICalculation.findOne({
      _id: calculationId,
      organizationId: orgObjectId
    });

    if (!calculation) {
      return res.status(404).json({
        success: false,
        message: 'Calculation not found'
      });
    }

    const oldValue = calculation.toObject();
    const updates = req.body;

    // Update allowed fields
    if (updates.calculationName) calculation.calculationName = updates.calculationName;
    if (updates.description !== undefined) calculation.description = updates.description;
    if (updates.inputs) {
      Object.keys(updates.inputs).forEach(key => {
        if (calculation.inputs[key] !== undefined) {
          calculation.inputs[key] = updates.inputs[key];
        }
      });
    }
    if (updates.benefits) {
      Object.keys(updates.benefits).forEach(key => {
        if (calculation.benefits[key] !== undefined) {
          calculation.benefits[key] = updates.benefits[key];
        }
      });
    }
    if (updates.impactMetrics) {
      Object.keys(updates.impactMetrics).forEach(key => {
        if (calculation.impactMetrics[key] !== undefined) {
          calculation.impactMetrics[key] = updates.impactMetrics[key];
        }
      });
    }
    if (updates.status) calculation.status = updates.status;
    if (updates.assumptions) calculation.assumptions = updates.assumptions;

    // Recalculate ROI
    calculation.calculateROI();

    // Add audit trail
    calculation.auditTrail.push({
      action: 'calculation_updated',
      performedBy: req.user._id,
      details: 'Calculation updated',
      changes: { old: oldValue, new: calculation.toObject() }
    });

    await calculation.save();

    res.json({
      success: true,
      message: 'Calculation updated successfully',
      data: calculation
    });
  } catch (error) {
    console.error('Error updating calculation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update calculation',
      error: error.message
    });
  }
};

// Delete calculation
export const deleteCalculation = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { calculationId } = req.params;
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    const calculation = await CSRROICalculation.findOneAndDelete({
      _id: calculationId,
      organizationId: orgObjectId
    });

    if (!calculation) {
      return res.status(404).json({
        success: false,
        message: 'Calculation not found'
      });
    }

    res.json({
      success: true,
      message: 'Calculation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting calculation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete calculation',
      error: error.message
    });
  }
};

// Get ROI summary/statistics
export const getROISummary = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    const calculations = await CSRROICalculation.find({
      organizationId: orgObjectId,
      status: { $in: ['calculated', 'reviewed', 'approved'] }
    });

    const summary = {
      totalCalculations: calculations.length,
      totalInvestment: calculations.reduce((sum, calc) => sum + (calc.roiMetrics.totalCost || 0), 0),
      totalBenefits: calculations.reduce((sum, calc) => sum + (calc.roiMetrics.totalBenefit || 0), 0),
      totalNetBenefit: calculations.reduce((sum, calc) => sum + (calc.roiMetrics.netBenefit || 0), 0),
      averageROI: calculations.length > 0
        ? calculations.reduce((sum, calc) => sum + (calc.roiMetrics.roiPercentage || 0), 0) / calculations.length
        : 0,
      averageBenefitCostRatio: calculations.length > 0
        ? calculations.reduce((sum, calc) => sum + (calc.roiMetrics.benefitCostRatio || 0), 0) / calculations.length
        : 0
    };

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching ROI summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ROI summary',
      error: error.message
    });
  }
};

// Add note to calculation
export const addCalculationNote = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { calculationId } = req.params;
    const { note } = req.body;
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    const calculation = await CSRROICalculation.findOne({
      _id: calculationId,
      organizationId: orgObjectId
    });

    if (!calculation) {
      return res.status(404).json({
        success: false,
        message: 'Calculation not found'
      });
    }

    calculation.notes.push({
      note,
      addedBy: req.user._id
    });

    await calculation.save();

    res.json({
      success: true,
      message: 'Note added successfully',
      data: calculation
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
  createROICalculation,
  getROICalculations,
  getCalculationById,
  updateCalculation,
  deleteCalculation,
  getROISummary,
  addCalculationNote
};

