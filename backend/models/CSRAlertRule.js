import mongoose from 'mongoose';

const csrAlertRuleSchema = new mongoose.Schema({
  // Rule Identification
  ruleId: {
    type: String,
    required: true,
    unique: true
  },
  ruleName: {
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
  
  // Alert Type & Source
  alertType: {
    type: String,
    enum: ['goal_progress', 'goal_at_risk', 'goal_overdue', 'compliance_due_soon', 'compliance_overdue', 
            'budget_threshold', 'budget_low', 'roi_threshold', 'campaign_milestone', 'custom'],
    required: true
  },
  sourceType: {
    type: String,
    enum: ['goal', 'compliance_event', 'budget', 'roi_calculation', 'campaign', 'custom'],
    required: true
  },
  
  // Conditions
  conditions: {
    // For goals
    goalStatus: [{
      type: String,
      enum: ['at_risk', 'behind', 'overdue']
    }],
    goalProgressThreshold: {
      type: Number,
      min: 0,
      max: 100
    },
    goalTimeRemainingThreshold: {
      type: Number // days
    },
    
    // For compliance events
    complianceDaysBeforeDue: {
      type: Number
    },
    complianceStatus: [{
      type: String,
      enum: ['pending', 'overdue']
    }],
    
    // For budget
    budgetThreshold: {
      type: Number // percentage
    },
    budgetAmount: {
      type: Number
    },
    
    // For ROI
    roiThreshold: {
      type: Number // percentage
    },
    
    // Custom conditions
    customCondition: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  
  // Notification Settings
  notificationSettings: {
    enabled: {
      type: Boolean,
      default: true
    },
    channels: [{
      type: String,
      enum: ['in_app', 'email', 'sms'],
      default: ['in_app']
    }],
    frequency: {
      type: String,
      enum: ['once', 'daily', 'weekly', 'recurring'],
      default: 'once'
    },
    recipients: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    // If empty, send to all CSR users in organization
  },
  
  // Alert Message Template
  messageTemplate: {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    actionUrl: String, // URL to navigate when alert is clicked
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'paused'],
    default: 'active',
    index: true
  },
  
  // Last Check
  lastChecked: Date,
  lastTriggered: Date,
  triggerCount: {
    type: Number,
    default: 0
  },
  
  // Schedule
  checkInterval: {
    type: Number, // minutes
    default: 60 // Check every hour by default
  },
  nextCheck: Date,
  
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
    details: String
  }]
}, {
  timestamps: true
});

// Indexes
csrAlertRuleSchema.index({ organizationId: 1, status: 1 });
csrAlertRuleSchema.index({ organizationId: 1, alertType: 1 });
csrAlertRuleSchema.index({ nextCheck: 1, status: 1 });
csrAlertRuleSchema.index({ sourceType: 1 });

// Pre-save hook to generate ruleId
csrAlertRuleSchema.pre('save', async function(next) {
  if (!this.ruleId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('CSRAlertRule').countDocuments({
      organizationId: this.organizationId,
      createdAt: { $gte: new Date(year, 0, 1) }
    });
    this.ruleId = `CSR-ALERT-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  
  // Set next check time
  if (!this.nextCheck || this.status === 'active') {
    const intervalMs = (this.checkInterval || 60) * 60 * 1000;
    this.nextCheck = new Date(Date.now() + intervalMs);
  }
  
  next();
});

const CSRAlertRule = mongoose.model('CSRAlertRule', csrAlertRuleSchema);

export default CSRAlertRule;

