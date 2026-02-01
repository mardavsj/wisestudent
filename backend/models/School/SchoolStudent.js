import mongoose from "mongoose";

const schoolStudentSchema = new mongoose.Schema(
  {
    tenantId: {
      type: String,
      required: true,
      // index removed, only keep schema.index()
    },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    campusId: {
      type: String,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    admissionNumber: {
      type: String,
      required: true,
      unique: true,
    },
    rollNumber: String,
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchoolClass",
      required: false, // Made optional to allow students without class assignment
    },
    section: {
      type: String,
      required: false, // Made optional to allow students without class assignment
    },
    academicYear: {
      type: String,
      required: true,
    },
    parentIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Parents can be added later
    }],
    personalInfo: {
      dateOfBirth: Date,
      gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
      },
      bloodGroup: String,
      address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
      },
      emergencyContact: {
        name: String,
        phone: String,
        relation: String,
      },
    },
    academicInfo: {
      admissionDate: {
        type: Date,
        default: Date.now,
      },
      previousSchool: String,
      tcNumber: String, // Transfer Certificate
      subjects: [{
        subjectId: mongoose.Schema.Types.ObjectId,
        isOptional: Boolean,
      }],
    },
    fees: {
      totalFees: Number,
      paidAmount: {
        type: Number,
        default: 0,
      },
      pendingAmount: {
        type: Number,
        default: 0,
      },
      lastPaymentDate: Date,
      paymentHistory: [{
        amount: Number,
        date: Date,
        receiptNumber: String,
        paymentMode: {
          type: String,
          enum: ["cash", "cheque", "online", "card"],
        },
      }],
    },
    attendance: {
      totalDays: {
        type: Number,
        default: 0,
      },
      presentDays: {
        type: Number,
        default: 0,
      },
      percentage: {
        type: Number,
        default: 0,
      },
    },
    transport: {
      isUsing: {
        type: Boolean,
        default: false,
      },
      routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TransportRoute",
      },
      stopName: String,
      fees: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    wellbeingFlags: [{
      type: {
        type: String,
        enum: ['mood_concern', 'low_engagement', 'academic_stress', 'social_issue', 'other'],
        required: true,
      },
      description: String,
      severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
      },
      flaggedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      flaggedAt: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ['open', 'in_progress', 'resolved'],
        default: 'open',
      },
      resolvedAt: Date,
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      notes: String,
    }],
    pillars: {
      uvls: { type: Number, default: 0, min: 0, max: 100 }, // Understanding Values & Life Skills
      dcos: { type: Number, default: 0, min: 0, max: 100 }, // Digital Citizenship & Online Safety
      moral: { type: Number, default: 0, min: 0, max: 100 }, // Moral & Spiritual Education
      ehe: { type: Number, default: 0, min: 0, max: 100 }, // Environmental & Health Education
      crgc: { type: Number, default: 0, min: 0, max: 100 }, // Cultural Roots & Global Citizenship
    },
    lastActive: {
      type: Date,
    },
    trainingModules: [{
      moduleId: String,
      moduleName: String,
      status: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed'],
        default: 'not_started',
      },
      startedAt: Date,
      completedAt: Date,
      progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    }],
    // Certificate in progress / delivered: Super Admin marks from Certificate delivered section
    certificatesInProgress: { type: Number, default: 0 },
    certificatesDelivered: { type: Number, default: 0 },
    certificatesDeliveredUpdatedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
schoolStudentSchema.index({ tenantId: 1, admissionNumber: 1 });
schoolStudentSchema.index({ tenantId: 1, classId: 1, section: 1 }, { sparse: true }); // Sparse index for optional fields
schoolStudentSchema.index({ tenantId: 1, academicYear: 1 });
schoolStudentSchema.index({ userId: 1, tenantId: 1 });

// Pre-save middleware for calculations
schoolStudentSchema.pre("save", function(next) {
  // Parents can be added later - no validation required
  
  // Calculate pending fees
  if (this.fees.totalFees && this.fees.paidAmount) {
    this.fees.pendingAmount = this.fees.totalFees - this.fees.paidAmount;
  }
  
  // Calculate attendance percentage
  if (this.attendance.totalDays > 0) {
    this.attendance.percentage = (this.attendance.presentDays / this.attendance.totalDays) * 100;
  }
  
  next();
});

// Ensure tenant isolation
schoolStudentSchema.pre(/^find/, function() {
  const query = this.getQuery();
  if (query.tenantId) {
    return;
  }
  if (query.allowLegacy) {
    delete query.allowLegacy;
    return;
  }
  throw new Error("TenantId is required for all queries");
});

const SchoolStudent = mongoose.model("SchoolStudent", schoolStudentSchema);
export default SchoolStudent;
