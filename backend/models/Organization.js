import mongoose from "mongoose";
import crypto from "crypto";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["school"],
      required: true,
    },
    tenantId: {
      type: String,
      required: true,
      unique: true,
      // index removed, only unique
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    admins: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    settings: {
      academicYear: {
        startDate: Date,
        endDate: Date,
      },
      timezone: {
        type: String,
        default: "Asia/Kolkata",
      },
      currency: {
        type: String,
        default: "INR",
      },
      logo: String,
      address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: {
          type: String,
          default: "India",
        },
      },
      contactInfo: {
        phone: String,
        email: String,
        website: String,
      },
      // School specific settings
      schoolSettings: {
        hasStreams: {
          type: Boolean,
          default: true,
        },
        streams: [{
          name: {
            type: String,
            enum: ["Science", "Commerce", "Arts"],
          },
          classes: [Number], // Which classes have this stream
        }],
        gradingSystem: {
          type: String,
          enum: ["percentage", "gpa", "cgpa"],
          default: "percentage",
        },
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    userCount: {
      type: Number,
      default: 0,
    },
    maxUsers: {
      type: Number,
      default: 100, // Based on subscription
    },
    // Multi-campus support
    campuses: [{
      campusId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      code: String, // Short code like "MAIN", "EAST", "WEST"
      location: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: String,
      },
      contactInfo: {
        phone: String,
        email: String,
      },
      principal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      isMain: {
        type: Boolean,
        default: false,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      studentCount: {
        type: Number,
        default: 0,
      },
      teacherCount: {
        type: Number,
        default: 0,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
    },
    sponsorshipInfo: {
      sponsorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CSRSponsor",
      },
      sponsorshipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sponsorship",
      },
      status: {
        type: String,
        enum: ["active", "pending", "expired", "renewal"],
        default: "pending",
      },
      studentsCovered: {
        type: Number,
        default: 0,
      },
      committedAmount: {
        type: Number,
        default: 0,
      },
      lastUpdated: Date,
      nextRenewalDate: Date,
      lastThankYou: {
        message: String,
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: Date,
      },
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
  },
  {
    timestamps: true,
  }
);

// Only keep companyId and type+tenantId indexes, tenantId is already unique
organizationSchema.index({ companyId: 1 });
organizationSchema.index({ type: 1, tenantId: 1 });
organizationSchema.index({ "sponsorshipInfo.sponsorId": 1 });
organizationSchema.index({ "sponsorshipInfo.sponsorshipId": 1 });

// Generate unique tenantId before saving
organizationSchema.statics.generateUniqueLinkingCode = async function(prefix = "SC", length = 6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const characters = alphabet.length;
  let attempts = 0;

  while (attempts < 10) {
    let randomPart = "";
    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i += 1) {
      randomPart += alphabet[randomBytes[i] % characters];
    }
    const code = `${prefix}-${randomPart}`;
    const existing = await this.findOne({ linkingCode: code });
    if (!existing) {
      return code;
    }
    attempts += 1;
  }

  throw new Error("Unable to generate unique organization linking code");
};

organizationSchema.pre("save", async function (next) {
  if (!this.tenantId) {
    this.tenantId = `${this.type}_${this._id.toString()}`;
  }

  if (!this.linkingCode) {
    try {
      this.linkingCode = await this.constructor.generateUniqueLinkingCode("SC");
      this.linkingCodeIssuedAt = new Date();
    } catch (err) {
      return next(err);
    }
  }

  return next();
});

const Organization = mongoose.model("Organization", organizationSchema);
export default Organization;
