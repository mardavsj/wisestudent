import mongoose from 'mongoose';

const csrGoalSchema = new mongoose.Schema({
  // Goal Identification
  goalId: {
    type: String,
    required: true,
    unique: true
  },
  goalName: {
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
  
  // Goal Type & Category
  goalType: {
    type: String,
    enum: ['students_reached', 'schools_reached', 'budget_utilization', 'campaign_completion', 'engagement_lift', 'certificates_issued', 'custom'],
    required: true
  },
  category: {
    type: String,
    enum: ['impact', 'financial', 'engagement', 'operational', 'compliance'],
    default: 'impact'
  },
  
  // Goal Period
  period: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly', 'custom'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  
  // Goal Metrics
  targetValue: {
    type: Number,
    required: true,
    min: 0
  },
  currentValue: {
    type: Number,
    default: 0,
    min: 0
  },
  unit: {
    type: String,
    default: 'count', // count, percentage, currency, etc.
    enum: ['count', 'percentage', 'currency', 'students', 'schools', 'campaigns']
  },
  
  // Progress Tracking
  progress: {
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    milestones: [{
      milestone: String,
      targetValue: Number,
      achievedValue: Number,
      achievedAt: Date,
      achieved: {
        type: Boolean,
        default: false
      }
    }]
  },
  
  // Status & Priority
  status: {
    type: String,
    enum: ['draft', 'active', 'on_track', 'at_risk', 'behind', 'completed', 'cancelled'],
    default: 'draft'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  
  // Alerts & Notifications
  alerts: {
    enabled: {
      type: Boolean,
      default: true
    },
    thresholds: [{
      percentage: Number, // Alert when progress reaches this percentage
      notified: {
        type: Boolean,
        default: false
      },
      notifiedAt: Date
    }],
    riskThreshold: {
      type: Number,
      default: 80 // Alert if progress is below 80% when 80% of time has passed
    }
  },
  
  // Related Campaigns
  relatedCampaigns: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  }],
  
  // Notes & Updates
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
  
  // Completion
  completedAt: Date,
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  actualValue: Number, // Final value when goal is completed
  
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
csrGoalSchema.index({ organizationId: 1, status: 1 });
csrGoalSchema.index({ organizationId: 1, period: 1, startDate: 1, endDate: 1 });
csrGoalSchema.index({ status: 1, endDate: 1 });
csrGoalSchema.index({ goalType: 1, category: 1 });

// Pre-save hook to generate goalId
csrGoalSchema.pre('save', async function(next) {
  if (!this.goalId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('CSRGoal').countDocuments({
      organizationId: this.organizationId,
      createdAt: { $gte: new Date(year, 0, 1) }
    });
    this.goalId = `CSR-GOAL-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Method to calculate progress
csrGoalSchema.methods.calculateProgress = function() {
  if (this.targetValue === 0) return 0;
  const percentage = (this.currentValue / this.targetValue) * 100;
  this.progress.percentage = Math.min(Math.max(percentage, 0), 100);
  this.progress.lastUpdated = new Date();
  return this.progress.percentage;
};

// Method to update status based on progress
csrGoalSchema.methods.updateStatus = function() {
  const progress = this.calculateProgress();
  const now = new Date();
  const totalDuration = this.endDate.getTime() - this.startDate.getTime();
  const elapsed = now.getTime() - this.startDate.getTime();
  const timeProgress = (elapsed / totalDuration) * 100;
  
  if (this.status === 'completed' || this.status === 'cancelled') {
    return; // Don't change status if already completed/cancelled
  }
  
  if (progress >= 100) {
    this.status = 'completed';
    this.completedAt = now;
  } else if (timeProgress >= 80 && progress < 80) {
    this.status = 'at_risk';
  } else if (timeProgress >= 50 && progress < 50) {
    this.status = 'behind';
  } else if (progress >= timeProgress * 0.9) {
    this.status = 'on_track';
  } else {
    this.status = 'active';
  }
};

// Method to check if alerts should be sent
csrGoalSchema.methods.checkAlerts = function() {
  const progress = this.calculateProgress();
  const alertsToSend = [];
  
  if (!this.alerts.enabled) return alertsToSend;
  
  // Check threshold alerts
  this.alerts.thresholds.forEach(threshold => {
    if (progress >= threshold.percentage && !threshold.notified) {
      alertsToSend.push({
        type: 'threshold',
        message: `Goal "${this.goalName}" reached ${threshold.percentage}% progress`,
        threshold: threshold.percentage
      });
      threshold.notified = true;
      threshold.notifiedAt = new Date();
    }
  });
  
  // Check risk alerts
  const now = new Date();
  const totalDuration = this.endDate.getTime() - this.startDate.getTime();
  const elapsed = now.getTime() - this.startDate.getTime();
  const timeProgress = (elapsed / totalDuration) * 100;
  
  if (timeProgress >= this.alerts.riskThreshold && progress < this.alerts.riskThreshold) {
    alertsToSend.push({
      type: 'risk',
      message: `Goal "${this.goalName}" is at risk - ${progress.toFixed(1)}% progress with ${timeProgress.toFixed(1)}% time elapsed`,
      progress,
      timeProgress
    });
  }
  
  return alertsToSend;
};

// Virtual for days remaining
csrGoalSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const remaining = this.endDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24)));
});

// Virtual for days elapsed
csrGoalSchema.virtual('daysElapsed').get(function() {
  const now = new Date();
  const elapsed = now.getTime() - this.startDate.getTime();
  return Math.max(0, Math.floor(elapsed / (1000 * 60 * 60 * 24)));
});

// Virtual for isOverdue
csrGoalSchema.virtual('isOverdue').get(function() {
  const now = new Date();
  return now > this.endDate && this.status !== 'completed' && this.status !== 'cancelled';
});

csrGoalSchema.set('toJSON', { virtuals: true });
csrGoalSchema.set('toObject', { virtuals: true });

const CSRGoal = mongoose.model('CSRGoal', csrGoalSchema);

export default CSRGoal;

