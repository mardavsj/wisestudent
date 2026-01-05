import mongoose from 'mongoose';

const csrROICalculationSchema = new mongoose.Schema({
  // Calculation Identification
  calculationId: {
    type: String,
    required: true,
    unique: true
  },
  calculationName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Organization Reference
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Financial Inputs
  inputs: {
    totalInvestment: {
      type: Number,
      required: true,
      min: 0
    },
    operationalCosts: {
      type: Number,
      default: 0,
      min: 0
    },
    marketingCosts: {
      type: Number,
      default: 0,
      min: 0
    },
    administrativeCosts: {
      type: Number,
      default: 0,
      min: 0
    },
    otherCosts: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  
  // Benefits/Returns
  benefits: {
    // Direct Benefits
    costSavings: {
      type: Number,
      default: 0,
      min: 0
    },
    revenueGenerated: {
      type: Number,
      default: 0,
      min: 0
    },
    taxBenefits: {
      type: Number,
      default: 0,
      min: 0
    },
    
    // Indirect Benefits (quantified)
    brandValueIncrease: {
      type: Number,
      default: 0,
      min: 0
    },
    employeeEngagementValue: {
      type: Number,
      default: 0,
      min: 0
    },
    communityGoodwillValue: {
      type: Number,
      default: 0,
      min: 0
    },
    
    // Social Impact (monetized)
    socialImpactValue: {
      type: Number,
      default: 0,
      min: 0
    },
    environmentalImpactValue: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  
  // Impact Metrics
  impactMetrics: {
    studentsReached: {
      type: Number,
      default: 0
    },
    schoolsReached: {
      type: Number,
      default: 0
    },
    certificatesIssued: {
      type: Number,
      default: 0
    },
    jobsCreated: {
      type: Number,
      default: 0
    },
    communitiesImpacted: {
      type: Number,
      default: 0
    }
  },
  
  // Calculated ROI Metrics
  roiMetrics: {
    totalCost: {
      type: Number,
      default: 0
    },
    totalBenefit: {
      type: Number,
      default: 0
    },
    netBenefit: {
      type: Number,
      default: 0
    },
    roiPercentage: {
      type: Number,
      default: 0
    },
    paybackPeriod: {
      type: Number, // in months
      default: 0
    },
    benefitCostRatio: {
      type: Number,
      default: 0
    }
  },
  
  // Time Period
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  calculationDate: {
    type: Date,
    default: Date.now
  },
  
  // Related Items
  relatedCampaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  relatedGoalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CSRGoal'
  },
  
  // Assumptions & Notes
  assumptions: [{
    assumption: String,
    value: mongoose.Schema.Types.Mixed,
    notes: String
  }],
  notes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'calculated', 'reviewed', 'approved'],
    default: 'draft'
  },
  
  // Audit Trail
  auditTrail: [{
    action: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: String,
    changes: mongoose.Schema.Types.Mixed
  }]
}, {
  timestamps: true
});

// Indexes
csrROICalculationSchema.index({ organizationId: 1, calculationDate: -1 });
csrROICalculationSchema.index({ organizationId: 1, status: 1 });
csrROICalculationSchema.index({ relatedCampaignId: 1 });

// Pre-save hook to generate calculationId and calculate ROI
csrROICalculationSchema.pre('save', async function(next) {
  if (!this.calculationId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('CSRROICalculation').countDocuments({
      organizationId: this.organizationId,
      createdAt: { $gte: new Date(year, 0, 1) }
    });
    this.calculationId = `CSR-ROI-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  
  // Calculate ROI metrics
  this.calculateROI();
  
  next();
});

// Method to calculate ROI
csrROICalculationSchema.methods.calculateROI = function() {
  // Calculate total cost
  this.roiMetrics.totalCost = 
    this.inputs.totalInvestment +
    this.inputs.operationalCosts +
    this.inputs.marketingCosts +
    this.inputs.administrativeCosts +
    this.inputs.otherCosts;
  
  // Calculate total benefit
  this.roiMetrics.totalBenefit = 
    this.benefits.costSavings +
    this.benefits.revenueGenerated +
    this.benefits.taxBenefits +
    this.benefits.brandValueIncrease +
    this.benefits.employeeEngagementValue +
    this.benefits.communityGoodwillValue +
    this.benefits.socialImpactValue +
    this.benefits.environmentalImpactValue;
  
  // Calculate net benefit
  this.roiMetrics.netBenefit = this.roiMetrics.totalBenefit - this.roiMetrics.totalCost;
  
  // Calculate ROI percentage
  if (this.roiMetrics.totalCost > 0) {
    this.roiMetrics.roiPercentage = (this.roiMetrics.netBenefit / this.roiMetrics.totalCost) * 100;
  } else {
    this.roiMetrics.roiPercentage = 0;
  }
  
  // Calculate benefit-cost ratio
  if (this.roiMetrics.totalCost > 0) {
    this.roiMetrics.benefitCostRatio = this.roiMetrics.totalBenefit / this.roiMetrics.totalCost;
  } else {
    this.roiMetrics.benefitCostRatio = 0;
  }
  
  // Calculate payback period (simplified - assumes monthly benefits)
  if (this.roiMetrics.netBenefit > 0) {
    const monthlyBenefit = this.roiMetrics.netBenefit / 12; // Simplified
    if (monthlyBenefit > 0) {
      this.roiMetrics.paybackPeriod = this.roiMetrics.totalCost / monthlyBenefit;
    } else {
      this.roiMetrics.paybackPeriod = 0;
    }
  } else {
    this.roiMetrics.paybackPeriod = 0;
  }
  
  // Update status
  if (this.status === 'draft' && this.roiMetrics.totalCost > 0) {
    this.status = 'calculated';
  }
};

csrROICalculationSchema.set('toJSON', { virtuals: true });
csrROICalculationSchema.set('toObject', { virtuals: true });

const CSRROICalculation = mongoose.model('CSRROICalculation', csrROICalculationSchema);

export default CSRROICalculation;

