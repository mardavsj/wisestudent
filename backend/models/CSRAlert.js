import mongoose from 'mongoose';

const csrAlertSchema = new mongoose.Schema({
  // Alert Identification
  alertId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Organization Reference
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true
  },
  
  // Alert Rule Reference
  ruleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CSRAlertRule',
    required: true,
    index: true
  },
  
  // Source Reference
  sourceType: {
    type: String,
    enum: ['goal', 'compliance_event', 'budget', 'roi_calculation', 'campaign', 'custom'],
    required: true
  },
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  
  // Alert Details
  alertType: {
    type: String,
    enum: ['goal_progress', 'goal_at_risk', 'goal_overdue', 'compliance_due_soon', 'compliance_overdue', 
            'budget_threshold', 'budget_low', 'roi_threshold', 'campaign_milestone', 'custom'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
    index: true
  },
  
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  
  // Context Data
  context: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Action URL
  actionUrl: String,
  
  // Recipients
  recipients: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    notificationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notification'
    },
    sentAt: Date,
    readAt: Date,
    acknowledged: {
      type: Boolean,
      default: false
    },
    acknowledgedAt: Date
  }],
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'sent', 'acknowledged', 'resolved', 'dismissed'],
    default: 'pending',
    index: true
  },
  
  // Resolution
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: Date,
  resolutionNotes: String,
  
  // Dismissal
  dismissedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dismissedAt: Date,
  dismissalReason: String,
  
  // Timestamps
  triggeredAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  expiresAt: Date, // Auto-resolve after this time if not acknowledged
}, {
  timestamps: true
});

// Indexes
csrAlertSchema.index({ organizationId: 1, status: 1 });
csrAlertSchema.index({ organizationId: 1, alertType: 1 });
csrAlertSchema.index({ organizationId: 1, severity: 1 });
csrAlertSchema.index({ triggeredAt: -1 });
csrAlertSchema.index({ sourceType: 1, sourceId: 1 });
csrAlertSchema.index({ 'recipients.userId': 1, status: 1 });

// Pre-save hook to generate alertId
csrAlertSchema.pre('save', async function(next) {
  if (!this.alertId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('CSRAlert').countDocuments({
      organizationId: this.organizationId,
      createdAt: { $gte: new Date(year, 0, 1) }
    });
    this.alertId = `CSR-ALERT-${year}-${String(count + 1).padStart(6, '0')}`;
  }
  
  // Set expiration (default 7 days)
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
  
  next();
});

// Virtual for isExpired
csrAlertSchema.virtual('isExpired').get(function() {
  return this.expiresAt && new Date() > this.expiresAt;
});

csrAlertSchema.set('toJSON', { virtuals: true });
csrAlertSchema.set('toObject', { virtuals: true });

const CSRAlert = mongoose.model('CSRAlert', csrAlertSchema);

export default CSRAlert;

