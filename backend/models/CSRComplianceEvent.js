import mongoose from 'mongoose';

const csrComplianceEventSchema = new mongoose.Schema({
  // Event Identification
  eventId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
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
  
  // Event Type & Category
  eventType: {
    type: String,
    enum: ['report_submission', 'payment_due', 'audit', 'compliance_check', 'deadline', 'renewal', 'custom'],
    required: true
  },
  category: {
    type: String,
    enum: ['regulatory', 'financial', 'operational', 'legal', 'reporting'],
    default: 'regulatory'
  },
  
  // Dates
  dueDate: {
    type: Date,
    required: true,
    index: true
  },
  reminderDate: Date, // When to send reminder
  completedDate: Date,
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'overdue', 'cancelled'],
    default: 'pending',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  
  // Related Items
  relatedReportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CSRReport'
  },
  relatedPaymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CSRPayment'
  },
  relatedCampaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  
  // Reminders
  reminders: [{
    sentAt: Date,
    sentTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reminderType: {
      type: String,
      enum: ['email', 'notification', 'both']
    }
  }],
  
  // Completion
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  completionNotes: String,
  
  // Recurring
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrencePattern: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly']
  },
  nextOccurrence: Date,
  
  // Attachments & Documents
  attachments: [{
    name: String,
    url: String,
    uploadedAt: Date,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Notes
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
csrComplianceEventSchema.index({ organizationId: 1, dueDate: 1 });
csrComplianceEventSchema.index({ organizationId: 1, status: 1 });
csrComplianceEventSchema.index({ dueDate: 1, status: 1 });
csrComplianceEventSchema.index({ eventType: 1, category: 1 });

// Pre-save hook to generate eventId
csrComplianceEventSchema.pre('save', async function(next) {
  if (!this.eventId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('CSRComplianceEvent').countDocuments({
      organizationId: this.organizationId,
      createdAt: { $gte: new Date(year, 0, 1) }
    });
    this.eventId = `CSR-COMP-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  
  // Auto-update status based on due date
  const now = new Date();
  if (this.status === 'pending' && now > this.dueDate) {
    this.status = 'overdue';
  }
  
  next();
});

// Virtual for days until due
csrComplianceEventSchema.virtual('daysUntilDue').get(function() {
  const now = new Date();
  const remaining = this.dueDate.getTime() - now.getTime();
  return Math.ceil(remaining / (1000 * 60 * 60 * 24));
});

// Virtual for isOverdue
csrComplianceEventSchema.virtual('isOverdue').get(function() {
  const now = new Date();
  return now > this.dueDate && this.status !== 'completed' && this.status !== 'cancelled';
});

// Virtual for isDueSoon (within 7 days)
csrComplianceEventSchema.virtual('isDueSoon').get(function() {
  const daysUntilDue = this.daysUntilDue;
  return daysUntilDue >= 0 && daysUntilDue <= 7;
});

csrComplianceEventSchema.set('toJSON', { virtuals: true });
csrComplianceEventSchema.set('toObject', { virtuals: true });

const CSRComplianceEvent = mongoose.model('CSRComplianceEvent', csrComplianceEventSchema);

export default CSRComplianceEvent;

