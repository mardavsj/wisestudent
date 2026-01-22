import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
    },
    avatarData: {
      type: {
        type: String,
        enum: ['uploaded', 'generated'],
        default: 'generated'
      },
      url: String,
      initials: String,
      colors: {
        bg: String,
        text: String
      },
      icon: String,
      role: String,
      isGenerated: {
        type: Boolean,
        default: true
      },
      generatedAt: Date,
      updatedAt: Date
    },
    // Legacy field (string). Kept for backward compatibility.
    dob: {
      type: String,
    },
    // New normalized date field for date of birth
    dateOfBirth: {
      type: Date,
    },
    institution: {
      type: String,
    },
    username: {
      type: String,
    },
    phone: {
      type: String,
    },
    location: {
      type: String,
    },
    website: {
      type: String,
    },
    bio: {
      type: String,
    },
    pronouns: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'non_binary', 'prefer_not_to_say', 'other'],
      lowercase: true,
      trim: true,
    },
    city: {
      type: String,
    },
    language: {
      type: String,
    },
    academic: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    professional: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    preferences: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    guardianEmail: {
      type: String,
    },
    role: {
      type: String,
      enum: [
        // Admin role
        "admin",
        // Legacy roles
        "student", "parent", "seller", "csr",
        // School roles
        "school_admin", "school_teacher", "school_student", "school_parent", 
        "school_accountant", "school_librarian", "school_transport_staff"
      ],
      default: "student",
    },
    // Multi-tenant fields
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    tenantId: {
      type: String,
      // index removed, only keep as field
    },
    campusId: {
      type: String,
      index: true,
    },
    sponsorBadge: {
      sponsorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CSRSponsor",
        index: true,
      },
      sponsorName: String,
      sponsorLogo: String,
      message: String,
      awardedAt: Date,
    },
    // Linked relationships
    linkedIds: {
      parentIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }],
      childIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }],
      teacherIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }],
      studentIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }],
    },
    // Parent-specific fields
    childEmail: {
      type: [String],
      default: [],
      validate: {
        validator: function(emails) {
          if (!emails) return true;
          if (Array.isArray(emails)) {
            return emails.every(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
          }
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emails);
        },
        message: 'Please enter valid child email addresses'
      }
    },
    linkingCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    linkingCodeIssuedAt: {
      type: Date,
    },
    // Seller-specific fields
    businessName: {
      type: String,
      required: function () {
        return this.role === "seller";
      },
    },
    shopType: {
      type: String,
      enum: ["Stationery", "Uniforms", "Food", "Books", "Electronics", "Other"],
      required: function () {
        return this.role === "seller";
      },
    },
    // CSR-specific fields
    organization: {
      type: String,
      required: function () {
        return this.role === "csr";
      },
    },
    isVerified: {
      type: Boolean,
      default: function () {
        return this.role === "parent" || this.role === "seller" || this.role === "csr" || this.role === "admin";
      },
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: function () {
        // Auto-approve parent accounts; others may require admin approval
        if (this.role === "parent") return "approved";
        if (["seller", "csr", "school_admin"].includes(this.role)) {
          return "pending";
        }
        return "approved";
      },
    },
    otp: {
      type: String,
    },
    otpExpiresAt: {
      type: Date,
    },
    otpType: {
      type: String,
      enum: ["verify", "reset"],
    },
    resetToken: {
      type: String,
    },
    resetTokenExpires: {
      type: Date,
    },
    fromGoogle: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
    createdByAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rejectedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
    lastActive: {
      type: Date,
      default: Date.now
    },
    // Add these fields to your userSchema
    completedChallengeIds: {
      type: [String],
      default: []
    },
    dailyChallengeHistory: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    // Teacher notes and flags
    teacherNotes: [{
      text: String,
      teacher: String,
      teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      date: {
        type: Date,
        default: Date.now
      }
    }],
    flaggedForCounselor: {
      type: Boolean,
      default: false
    },
    flaggedReason: String,
    flaggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    flaggedAt: Date,
    consentFlags: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    // Registration codes and class assignments
    registrationNumber: String,
    dateOfBirth: Date,
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    // Teacher training modules
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
    // Parent badges
    badges: [{
      badgeId: String,
      name: String,
      description: String,
      earnedAt: {
        type: Date,
        default: Date.now
      },
      category: String,
      icon: String,
      message: String
    }],
  },
  { timestamps: true }
);

userSchema.statics.generateUniqueLinkingCode = async function(prefix = "LN", length = 6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const characters = alphabet.length;
  let attempts = 0;
  while (attempts < 5) {
    let randomPart = "";
    for (let i = 0; i < length; i += 1) {
      const randomByte = crypto.randomBytes(1)[0];
      randomPart += alphabet[randomByte % characters];
    }
    const code = `${prefix}-${randomPart}`;
    const existing = await this.findOne({ linkingCode: code });
    if (!existing) {
      return code;
    }
    attempts += 1;
  }
  throw new Error("Unable to generate unique linking code");
};

userSchema.pre("save", async function (next) {
  if (this.role === "admin" && !this.password) {
    return next(new Error("Password is required for admin accounts"));
  }

  // Generate linking code for new users or existing users without one
  if (["student", "parent", "school_student"].includes(this.role) && !this.linkingCode) {
    try {
      let prefix = "ST";
      if (this.role === "parent") {
        prefix = "PR";
      } else if (this.role === "school_student") {
        prefix = "SST"; // School Student prefix
      }
      this.linkingCode = await this.constructor.generateUniqueLinkingCode(prefix);
      this.linkingCodeIssuedAt = new Date();
    } catch (err) {
      return next(err);
    }
  }

  return next();
});

userSchema.virtual("canUseGoogleLogin").get(function () {
  return this.role === "student";
});

userSchema.virtual("needsOTPVerification").get(function () {
  return this.role === "student" && !this.isVerified;
});

// Ensure virtual fields are included in JSON output
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
