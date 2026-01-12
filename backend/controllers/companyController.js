import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Company from "../models/Company.js";
import Organization from "../models/Organization.js";
import User from "../models/User.js";
import Subscription from "../models/Subscription.js";
import assignUserSubscription from "../utils/subscriptionAssignments.js";
import SchoolStudent from "../models/School/SchoolStudent.js";
import SchoolClass from "../models/School/SchoolClass.js";
import { generateToken } from "../utils/jwt.js";
import mongoose from "mongoose";

const toPlain = (doc) => (doc && typeof doc.toObject === "function" ? doc.toObject() : doc);

const mapReviewer = (reviewer) => {
  if (!reviewer) return null;
  const plain = toPlain(reviewer);
  if (!plain) return null;
  if (typeof plain === "string") {
    return { id: plain, name: null, email: null };
  }
  return {
    id: plain._id ? plain._id.toString() : plain.id?.toString?.() ?? null,
    name: plain.name || null,
    email: plain.email || null
  };
};

const mapReviewHistory = (history = []) =>
  history
    .map((entry) => {
      const plain = toPlain(entry) || {};
      return {
        id: plain._id ? plain._id.toString() : undefined,
        action: plain.action,
        note: plain.note || "",
        createdAt: plain.createdAt,
        reviewer: mapReviewer(plain.reviewer),
        relativeTime: formatRelativeTime(plain.createdAt)
      };
    })
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return aTime - bTime;
    });

const hoursBetween = (start, end) => {
  if (!start || !end) return null;
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) return null;
  return Math.round(((endMs - startMs) / 36e5) * 10) / 10;
};

const formatRelativeTime = (date) => {
  if (!date) return null;
  const timestamp = new Date(date).getTime();
  if (!Number.isFinite(timestamp)) return null;
  const diffMs = Date.now() - timestamp;
  if (diffMs < 0) return "just now";
  const diffMinutes = diffMs / 60000;
  if (diffMinutes < 60) return `${Math.max(1, Math.round(diffMinutes))}m ago`;
  const diffHours = diffMinutes / 60;
  if (diffHours < 24) return `${Math.max(1, Math.round(diffHours))}h ago`;
  const diffDays = diffHours / 24;
  if (diffDays < 30) return `${Math.max(1, Math.round(diffDays))}d ago`;
  const diffMonths = diffDays / 30;
  if (diffMonths < 12) return `${Math.max(1, Math.round(diffMonths))}mo ago`;
  const diffYears = diffMonths / 12;
  return `${Math.max(1, Math.round(diffYears))}y ago`;
};

const computeReadinessScore = (company = {}) => {
  const contactInfo = company.contactInfo || {};
  const academicInfo = company.academicInfo || {};
  let score = 40;
  if (contactInfo.phone) score += 12;
  if (contactInfo.address) score += 6;
  if (contactInfo.website) score += 8;
  if (contactInfo.city) score += 6;
  if (contactInfo.state) score += 6;
  if (academicInfo.totalStudents) score += 10;
  if (academicInfo.totalTeachers) score += 6;
  if (academicInfo.board) score += 4;
  return Math.min(100, score);
};

const EDUCATIONAL_PLAN_TYPE = "educational_institutions_premium";
const EDUCATIONAL_PLAN_NAME = "Educational Institutions Premium Plan";
const EDUCATIONAL_PLAN_FEATURES = {
  fullAccess: true,
  parentDashboard: true,
  advancedAnalytics: true,
  certificates: true,
  wiseClubAccess: true,
  inavoraAccess: true,
  gamesPerPillar: -1,
  totalGames: 2200,
};
const EDUCATIONAL_PLAN_DURATION_MS = 365 * 24 * 60 * 60 * 1000;
const EDUCATIONAL_PLAN_DETAILS_BLUEPRINT = {
  name: EDUCATIONAL_PLAN_TYPE,
  displayName: EDUCATIONAL_PLAN_NAME,
  price: 0,
  billingCycle: "yearly",
};
const EDUCATIONAL_PLAN_LIMITS_BLUEPRINT = {
  maxStudents: 10000,
  maxTeachers: 1000,
  maxClasses: 1000,
  maxCampuses: 20,
  maxStorage: 1000,
  maxTemplates: 2000,
  features: {
    ...EDUCATIONAL_PLAN_FEATURES,
    aiAssistant: true,
    customBranding: true,
    apiAccess: true,
    prioritySupport: true,
    whiteLabel: false,
    premiumTemplates: true,
    nepTracking: true,
    complianceTools: true,
    escalationChains: true,
  },
};
const cloneEducationalPlanDetails = () => ({
  ...EDUCATIONAL_PLAN_DETAILS_BLUEPRINT,
});
const cloneEducationalPlanLimits = () => ({
  ...EDUCATIONAL_PLAN_LIMITS_BLUEPRINT,
  features: { ...(EDUCATIONAL_PLAN_LIMITS_BLUEPRINT.features || {}) },
});

const extractPrimaryOrganization = (company) => {
  const organizations = Array.isArray(company?.organizations) ? company.organizations : [];
  if (!organizations.length) return null;
  const primaryOrg = toPlain(organizations[0]);
  if (!primaryOrg) return null;
  return {
    id: primaryOrg._id ? primaryOrg._id.toString() : primaryOrg.toString?.() ?? null,
    name: primaryOrg.name || null,
    tenantId: primaryOrg.tenantId || null,
    isActive: typeof primaryOrg.isActive === "boolean" ? primaryOrg.isActive : null
  };
};

const mapOrganizationSummary = (organizationDoc) => {
  const organization = toPlain(organizationDoc) || {};
  const campuses = Array.isArray(organization.campuses)
    ? organization.campuses.map((campus) => {
        const plain = toPlain(campus) || campus || {};
        return {
          campusId: plain.campusId || plain.id || plain._id?.toString?.() || null,
          name: plain.name || null,
          code: plain.code || null,
          location: plain.location || {},
          contactInfo: plain.contactInfo || {},
          isMain: typeof plain.isMain === "boolean" ? plain.isMain : null,
          isActive: typeof plain.isActive === "boolean" ? plain.isActive : null,
          studentCount: typeof plain.studentCount === "number" ? plain.studentCount : null,
          teacherCount: typeof plain.teacherCount === "number" ? plain.teacherCount : null,
          createdAt: plain.createdAt || null,
          updatedAt: plain.updatedAt || null
        };
      })
    : [];

  return {
    id: organization._id ? organization._id.toString() : organization.id?.toString?.(),
    name: organization.name || null,
    tenantId: organization.tenantId || null,
    isActive: typeof organization.isActive === "boolean" ? organization.isActive : null,
    campuses,
    campusCount: campuses.length,
    userCount: typeof organization.userCount === "number" ? organization.userCount : null,
    maxUsers: typeof organization.maxUsers === "number" ? organization.maxUsers : null,
    settings: organization.settings || {},
    createdAt: organization.createdAt || null,
    updatedAt: organization.updatedAt || null
  };
};

const mapAdminUserSummary = (adminDoc) => {
  const admin = toPlain(adminDoc) || {};
  return {
    id: admin._id ? admin._id.toString() : undefined,
    name: admin.name || null,
    email: admin.email || null,
    phone: admin.phone || admin.contactInfo?.phone || null,
    approvalStatus: admin.approvalStatus || null,
    status: admin.status || null,
    tenantId: admin.tenantId || null,
    orgId: admin.orgId ? admin.orgId.toString?.() : null,
    lastActiveAt: admin.lastActiveAt || admin.updatedAt || null,
    createdAt: admin.createdAt || null
  };
};

const mapSubscriptionSummary = (subscriptionDoc) => {
  const subscription = toPlain(subscriptionDoc) || {};
  
  // Compute actual status based on endDate
  let actualStatus = subscription.status || null;
  if (subscription.endDate) {
    const endDate = new Date(subscription.endDate);
    const now = new Date();
    if (endDate <= now && (actualStatus === 'active' || actualStatus === 'pending')) {
      actualStatus = 'expired';
    }
  }
  
  // Calculate current cycle start date (when current period started)
  let currentCycleStartDate = subscription.startDate || null;
  if (subscription.lastRenewedAt) {
    // If lastRenewedAt exists, use it as the current cycle start
    currentCycleStartDate = subscription.lastRenewedAt;
  } else if (subscription.endDate) {
    // Calculate from endDate based on billing cycle (default yearly = 12 months)
    const cycleMonths = subscription.plan?.billingCycle === 'yearly' ? 12 : 12;
    const cycleStart = new Date(subscription.endDate);
    cycleStart.setMonth(cycleStart.getMonth() - cycleMonths);
    currentCycleStartDate = cycleStart;
  }
  
  // Ensure plan name and displayName are set correctly based on status
  const plan = subscription.plan || {};
  const planName = plan.name;
  const planDisplayName = plan.displayName;
  
  // If plan is expired, set to free plan
  if (actualStatus === 'expired') {
    plan.name = 'free';
    plan.displayName = 'Free Plan';
  } else if (actualStatus === 'active' || actualStatus === 'pending') {
    // If plan is active/renewed, ensure it shows premium plan
    // If plan name is missing or "free" but we have limits that suggest premium, 
    // try to infer the correct plan from limits
    if ((!planName || planName === 'free') && subscription.endDate) {
      // Check if limits suggest it's an educational institutions premium plan
      const maxStudents = subscription.limits?.maxStudents || 0;
      const maxTeachers = subscription.limits?.maxTeachers || 0;
      if (maxStudents >= 10000 || maxTeachers >= 1000) {
        // Likely educational_institutions_premium
        plan.name = 'educational_institutions_premium';
        plan.displayName = 'Educational Institutions Premium Plan';
      } else if (!planName || planName === 'free') {
        // Default to educational_institutions_premium for active school subscriptions
        plan.name = 'educational_institutions_premium';
        plan.displayName = 'Educational Institutions Premium Plan';
      }
    }
  } else {
    // For cancelled or other statuses, show free plan
    plan.name = 'free';
    plan.displayName = 'Free Plan';
  }
  
  return {
    id: subscription._id ? subscription._id.toString() : undefined,
    status: actualStatus,
    plan: plan,
    limits: subscription.limits || {},
    usage: subscription.usage || {},
    startDate: subscription.startDate || null, // Original activation date
    currentCycleStartDate: currentCycleStartDate, // Current renewal cycle start date
    endDate: subscription.endDate || null,
    lastRenewedAt: subscription.lastRenewedAt || null,
    autoRenew: typeof subscription.autoRenew === "boolean" ? subscription.autoRenew : null,
    tenantId: subscription.tenantId || null,
    orgId: subscription.orgId ? subscription.orgId.toString?.() : null,
    renewalCount: typeof subscription.renewalCount === "number" ? subscription.renewalCount : null,
    lastPaymentAt: subscription.lastPaymentAt || subscription.lastRenewedAt || null
  };
};

const buildAdminSchoolPayload = (companyDoc, context) => {
  const company = toPlain(companyDoc) || {};
  const organizations = Array.isArray(company.organizations)
    ? company.organizations.map(mapOrganizationSummary).filter((org) => Boolean(org?.id))
    : [];

  const primaryOrganization = organizations[0] || null;
  const orgId = primaryOrganization?.id || null;
  const tenantId = primaryOrganization?.tenantId || null;

  const admin = orgId ? context.adminMap.get(orgId) || null : null;
  const subscription = orgId ? context.subscriptionMap.get(orgId) || null : null;

  const studentCount =
    tenantId !== null && tenantId !== undefined
      ? context.studentCountMap.get(tenantId) ?? null
      : null;
  const teacherCount =
    tenantId !== null && tenantId !== undefined
      ? context.teacherCountMap.get(tenantId) ?? null
      : null;
  const classCount =
    tenantId !== null && tenantId !== undefined
      ? context.classCountMap.get(tenantId) ?? null
      : null;

  const reviewHistory = mapReviewHistory(company.reviewHistory || []);
  const readinessScore = computeReadinessScore(company);

  const pendingDurationHours =
    company.approvalStatus === "pending" && company.createdAt
      ? hoursBetween(company.createdAt, new Date())
      : null;

  const decisionTimeHours =
    company.approvalStatus !== "pending"
      ? hoursBetween(
          company.createdAt,
          company.approvedAt || company.lastReviewedAt || company.updatedAt
        )
      : null;

  return {
    id: company._id ? company._id.toString() : undefined,
    name: company.name || null,
    email: company.email || null,
    approvalStatus: company.approvalStatus,
    status: company.approvalStatus,
    institutionId: company.institutionId || null,
    contactInfo: company.contactInfo || {},
    academicInfo: company.academicInfo || {},
    createdAt: company.createdAt || null,
    updatedAt: company.updatedAt || null,
    approvedAt: company.approvedAt || null,
    lastReviewedAt: company.lastReviewedAt || null,
    approvalNotes: company.approvalNotes || null,
    rejectionReason: company.rejectionReason || null,
    subscriptionPlan: company.subscriptionPlan || null,
    subscriptionStart: company.subscriptionStart || null,
    subscriptionExpiry: company.subscriptionExpiry || null,
    organizations,
    primaryOrganization,
    admin,
    subscription,
    metrics: {
      studentCount:
        studentCount !== null && studentCount !== undefined
          ? studentCount
          : company.academicInfo?.totalStudents ?? null,
      teacherCount:
        teacherCount !== null && teacherCount !== undefined
          ? teacherCount
          : company.academicInfo?.totalTeachers ?? null,
      classCount,
      campusCount: primaryOrganization?.campusCount ?? null,
      userCount: primaryOrganization?.userCount ?? null,
      maxUsers: primaryOrganization?.maxUsers ?? null
    },
    computed: {
      readinessScore,
      pendingDurationHours,
      decisionTimeHours,
      submissionRelativeTime: formatRelativeTime(company.createdAt),
    },
    reviewHistory,
  };
};

const hydrateSchoolData = async (companies) => {
  if (!Array.isArray(companies) || companies.length === 0) {
    return [];
  }

  const items = companies
    .map((doc) => toPlain(doc) || {})
    .filter((company) => company && company._id);

  if (!items.length) {
    return [];
  }

  const orgIdSet = new Set();
  const tenantIdSet = new Set();

  items.forEach((company) => {
    const organizations = Array.isArray(company.organizations) ? company.organizations : [];
    organizations.forEach((orgDoc) => {
      const org = toPlain(orgDoc) || {};
      const orgId = org._id ? org._id.toString() : org.id?.toString?.();
      if (orgId) orgIdSet.add(orgId);
      if (org.tenantId) tenantIdSet.add(org.tenantId);
    });
  });

  const orgIds = Array.from(orgIdSet).map((id) => new mongoose.Types.ObjectId(id));
  const tenantIds = Array.from(tenantIdSet);

  const [adminUsers, subscriptions, studentCounts, teacherCounts, classCounts] = await Promise.all([
    orgIds.length
      ? User.find({ role: "school_admin", orgId: { $in: orgIds } })
          .select("name email phone contactInfo approvalStatus lastActiveAt orgId tenantId status createdAt updatedAt")
          .lean()
      : [],
    orgIds.length ? Subscription.find({ orgId: { $in: orgIds } }).lean() : [],
    tenantIds.length
      ? SchoolStudent.aggregate([
          { $match: { tenantId: { $in: tenantIds } } },
          { $group: { _id: "$tenantId", count: { $sum: 1 } } },
        ])
      : [],
    tenantIds.length
      ? User.aggregate([
          { $match: { tenantId: { $in: tenantIds }, role: "school_teacher" } },
          { $group: { _id: "$tenantId", count: { $sum: 1 } } },
        ])
      : [],
    tenantIds.length
      ? SchoolClass.aggregate([
          { $match: { tenantId: { $in: tenantIds } } },
          { $group: { _id: "$tenantId", count: { $sum: 1 } } },
        ])
      : [],
  ]);

  const adminMap = new Map();
  adminUsers.forEach((admin) => {
    if (!admin?.orgId) return;
    adminMap.set(admin.orgId.toString(), mapAdminUserSummary(admin));
  });

  const subscriptionMap = new Map();
  subscriptions.forEach((subscription) => {
    if (!subscription?.orgId) return;
    subscriptionMap.set(subscription.orgId.toString(), mapSubscriptionSummary(subscription));
  });

  const studentCountMap = new Map(studentCounts.map((entry) => [entry._id, entry.count]));
  const teacherCountMap = new Map(teacherCounts.map((entry) => [entry._id, entry.count]));
  const classCountMap = new Map(classCounts.map((entry) => [entry._id, entry.count]));

  return items.map((company) =>
    buildAdminSchoolPayload(company, {
      adminMap,
      subscriptionMap,
      studentCountMap,
      teacherCountMap,
      classCountMap,
    })
  );
};

const emitAdminSchoolUpdate = async (io, companyDoc) => {
  if (!io || !companyDoc) return;
  try {
    const [payload] = await hydrateSchoolData([companyDoc]);
    if (payload) {
      io.emit("admin:schools:update", {
        id: payload.id,
        data: payload,
      });
    }
  } catch (error) {
    console.error("Error emitting admin school update:", error);
  }
};

const buildSchoolApprovalView = (companyDoc, adminUserDoc = null) => {
  const company = toPlain(companyDoc) || {};
  const adminUser = adminUserDoc ? toPlain(adminUserDoc) : null;
  const createdAt = company.createdAt ? new Date(company.createdAt) : null;
  const nowMs = Date.now();
  const pendingDurationHours =
    company.approvalStatus === "pending" && createdAt
      ? Math.round(((nowMs - createdAt.getTime()) / 36e5) * 10) / 10
      : null;

  const decisionTimeHours =
    company.approvalStatus !== "pending"
      ? hoursBetween(company.createdAt, company.approvedAt || company.lastReviewedAt || company.updatedAt)
      : null;

  return {
    id: company._id ? company._id.toString() : undefined,
    name: company.name,
    email: company.email,
    institutionId: company.institutionId,
    approvalStatus: company.approvalStatus,
    status: company.approvalStatus,
    submittedAt: company.createdAt,
    submittedAgoHuman: formatRelativeTime(company.createdAt),
    approvalNotes: company.approvalNotes || "",
    rejectionReason: company.rejectionReason || "",
    lastReviewedAt: company.lastReviewedAt || null,
    pendingDurationHours,
    decisionTimeHours,
    contactInfo: company.contactInfo || {},
    academicInfo: company.academicInfo || {},
    organization: extractPrimaryOrganization(company),
    adminUser: adminUser
      ? {
          id: adminUser._id ? adminUser._id.toString() : adminUser.id?.toString?.() ?? null,
          name: adminUser.name || null,
          email: adminUser.email || null,
          approvalStatus: adminUser.approvalStatus || null,
          createdAt: adminUser.createdAt || null
        }
      : null,
    approvedBy: mapReviewer(company.approvedBy),
    reviewHistory: mapReviewHistory(company.reviewHistory),
    metrics: {
      readinessScore: computeReadinessScore(company),
      totalStudents: (company.academicInfo && company.academicInfo.totalStudents) || 0,
      totalTeachers: (company.academicInfo && company.academicInfo.totalTeachers) || 0
    }
  };
};

const decoratePendingSchool = (approval) => {
  const formatted = { ...approval };
  const pendingHours = formatted.pendingDurationHours || 0;
  const readiness = formatted.metrics?.readinessScore || 0;

  if (!formatted.priority) {
    formatted.priority =
      pendingHours >= 120 ? "critical" :
      pendingHours >= 72 ? "high" :
      readiness >= 85 ? "expedite" :
      "standard";
  }

  formatted.submittedAgoHuman = formatted.submittedAgoHuman || formatRelativeTime(formatted.submittedAt);
  const tags = formatted.tags ? [...formatted.tags] : [];

  if (readiness >= 85 && !tags.includes("High readiness")) {
    tags.push("High readiness");
  }
  if (pendingHours >= 72 && !tags.includes("Aging >72h")) {
    tags.push("Aging >72h");
  }
  if (formatted.contactInfo?.state) {
    const stateTag = `State:${formatted.contactInfo.state}`;
    if (!tags.includes(stateTag)) {
      tags.push(stateTag);
    }
  }

  formatted.tags = tags.filter(Boolean);
  return formatted;
};

const normalizeOrganizationContext = (organizationDoc) => {
  const plain = toPlain(organizationDoc) || {};

  const rawId =
    plain._id ??
    plain.id ??
    organizationDoc?._id ??
    organizationDoc?.id ??
    (typeof organizationDoc.toString === "function" ? organizationDoc.toString() : null);

  const idString =
    typeof rawId === "string"
      ? rawId
      : rawId && typeof rawId.toString === "function"
        ? rawId.toString()
        : null;

  const normalized = {
    idString,
    tenantId: plain.tenantId || null,
    objectId: null,
  };

  if (idString && mongoose.Types.ObjectId.isValid(idString)) {
    normalized.objectId = new mongoose.Types.ObjectId(idString);
  }

  return normalized;
};

const findSchoolAdminUsers = async (companyDoc) => {
  if (!companyDoc) {
    return [];
  }

  const company = toPlain(companyDoc) || {};
  const organizations = Array.isArray(companyDoc.organizations) ? companyDoc.organizations : [];

  const contexts = organizations.map(normalizeOrganizationContext).filter((ctx) => ctx.idString || ctx.tenantId);

  const orgObjectIds = Array.from(
    new Set(
      contexts
        .map((ctx) => ctx.objectId)
        .filter(Boolean)
        .map((objectId) => objectId.toString())
    )
  ).map((id) => new mongoose.Types.ObjectId(id));

  const tenantIds = Array.from(
    new Set(
      contexts
        .map((ctx) => ctx.tenantId || ctx.idString)
        .filter(Boolean)
    )
  );

  const orConditions = [];
  const email = typeof company.email === "string" ? company.email.toLowerCase() : null;

  if (email) {
    orConditions.push({ email });
  }

  if (orgObjectIds.length) {
    orConditions.push({ orgId: { $in: orgObjectIds } });
  }

  if (tenantIds.length) {
    orConditions.push({ tenantId: { $in: tenantIds } });
  }

  if (!orConditions.length) {
    return [];
  }

  return User.find({
    role: "school_admin",
    $or: orConditions,
  });
};
// Company Signup
export const companySignup = async (req, res) => {
  try {
    const io = req.app && typeof req.app.get === 'function' ? req.app.get('io') : null;
    const { name, email, password, contactInfo, type, academicInfo, schoolId } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "Name, email, and password are required" 
      });
    }

    // Check if company already exists with same email and type
    const existingCompany = await Company.findOne({ 
      email: email.toLowerCase(),
      type: type || 'company'
    });
    if (existingCompany) {
      return res.status(400).json({ 
        message: `${type === 'school' ? 'School' : 'Company'} with this email already exists`,
        error: 'DUPLICATE_EMAIL'
      });
    }

    // Check if institution ID already exists
    if (schoolId) {
      const existingInstitution = await Company.findOne({ 
        institutionId: schoolId 
      });
      if (existingInstitution) {
        return res.status(400).json({ 
          message: `School ID already exists`,
          error: 'DUPLICATE_INSTITUTION_ID'
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const submissionEntry = {
      action: 'submitted',
      note: 'Registration submitted for review.',
      createdAt: new Date(),
      reviewer: null
    };

    // Create company with institution type
    const company = await Company.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      contactInfo: contactInfo || {},
      type: type || 'company',
      academicInfo: academicInfo || {},
      institutionId: schoolId,
      isActive: false,
      approvalStatus: 'pending',
      approvalNotes: '',
      reviewHistory: [submissionEntry],
      lastReviewedAt: null
    });

    // Create organization based on type
    let organization;
    if (type === 'school') {
      organization = new Organization({
        name,
        type: 'school',
        companyId: company._id,
        tenantId: 'temp', // Set temporary tenantId to match schema
        settings: {
          board: academicInfo?.board || '',
          establishedYear: academicInfo?.establishedYear || '',
          totalStudents: academicInfo?.totalStudents || 0,
          totalTeachers: academicInfo?.totalTeachers || 0,
          contactInfo: {
            phone: contactInfo?.phone || '',
            email: contactInfo?.email || email.toLowerCase(),
            website: contactInfo?.website || ''
          }
        }
      });
      // Save to generate the _id first
      organization.isActive = false;
      await organization.save();
      // Set the correct tenantId and save again
      organization.tenantId = `school_${organization._id.toString()}`;
      await organization.save();

      company.organizations = company.organizations || [];
      const alreadyAdded = company.organizations.some(orgId => orgId.toString() === organization._id.toString());
      if (!alreadyAdded) {
        company.organizations.push(organization._id);
        await company.save();
      }
    }

    // Create admin user for the organization
    const adminRole = type === 'school' ? 'school_admin' : 'admin';
    const adminUser = await User.create({
      name: `${name} Admin`,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: adminRole,
      orgId: organization?._id,
      tenantId: organization?.tenantId || (organization?._id ? organization._id.toString() : null),
      isVerified: false,
      approvalStatus: 'pending',
      phone: contactInfo?.phone || '',
      professional: {
        position: 'School Administrator',
        joiningDate: new Date()
      }
    });

    if (io) {
      const plainCompany = company.toObject();
      plainCompany.organizations = organization ? [organization.toObject()] : plainCompany.organizations;
      const formattedPayload = decoratePendingSchool(buildSchoolApprovalView(plainCompany, adminUser));
      io.emit('admin:school-approval:new', formattedPayload);
    }

    res.status(201).json({
      message: `${type === 'school' ? 'School' : 'Company'} registration submitted for approval`,
      status: 'pending',
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        approvalStatus: company.approvalStatus
      },
      organization: organization ? {
        id: organization._id,
        name: organization.name,
        type: organization.type
      } : null
    });
  } catch (error) {
    console.error("Company signup error:", error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      if (field === 'email') {
        return res.status(400).json({ 
          message: "Email already exists",
          error: 'DUPLICATE_EMAIL'
        });
      } else if (field === 'institutionId') {
        return res.status(400).json({ 
          message: "Institution ID already exists",
          error: 'DUPLICATE_INSTITUTION_ID'
        });
      }
    }
    
    res.status(500).json({ 
      message: "Server error during registration",
      error: error.message 
    });
  }
};

// Company Login
export const companyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find company
    const company = await Company.findOne({ email: email.toLowerCase() })
      .populate('organizations');

    if (!company) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, company.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check approval status
    if (company.approvalStatus === 'pending') {
      return res.status(403).json({
        message: "Your organization is currently under review. You will be able to sign in once an admin approves your account.",
        approvalStatus: 'pending'
      });
    }

    if (company.approvalStatus === 'rejected') {
      return res.status(403).json({
        message: "Your organization registration was rejected. Please contact support for assistance.",
        approvalStatus: 'rejected',
        rejectionReason: company.rejectionReason
      });
    }

    // Check if company is active
    if (!company.isActive) {
      return res.status(403).json({ message: "Company account is deactivated" });
    }

    // Generate token
    const token = generateToken(company._id);

    res.status(200).json({
      message: "Login successful",
      token,
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        organizations: company.organizations,
        subscriptionPlan: company.subscriptionPlan,
        subscriptionExpiry: company.subscriptionExpiry,
      },
    });
  } catch (error) {
    console.error("Company login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Enhanced Organization Registration with Auto-Setup
export const registerOrganization = async (req, res) => {
  try {
    const { 
      organizationName,
      organizationType, // "school"
      adminName,
      adminEmail,
      adminPassword,
      contactInfo = {}
    } = req.body;

    // Validation
    if (!organizationName || !organizationType || !adminName || !adminEmail || !adminPassword) {
      return res.status(400).json({ 
        message: "All required fields must be provided" 
      });
    }

    if (!['school'].includes(organizationType)) {
      return res.status(400).json({ 
        message: "Organization type must be 'school'" 
      });
    }

    // Check if admin email already exists
    const existingUser = await User.findOne({ email: adminEmail.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Admin email already exists" });
    }

    // Create company
    const company = await Company.create({
      name: organizationName,
      email: adminEmail.toLowerCase(),
      password: await bcrypt.hash(adminPassword, 12),
      contactInfo,
      type: organizationType
    });

    // Create organization
    const organization = new Organization({
      name: organizationName,
      type: organizationType,
      companyId: company._id,
      settings: {
        academicYear: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // Generate tenantId
    await organization.save();
    organization.tenantId = `${organizationType}_${organization._id.toString()}`;
    await organization.save();

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    const adminRole = organizationType === "school" ? "school_admin" : "admin";

    const admin = await User.create({
      name: adminName,
      email: adminEmail.toLowerCase(),
      password: hashedPassword,
      role: adminRole,
      orgId: organization._id,
      tenantId: organization.tenantId,
      isVerified: true,
      approvalStatus: "approved",
      phone: contactInfo.phone || "",
      professional: {
        position: contactInfo.position || "School Administrator",
        joiningDate: contactInfo.joiningDate || new Date()
      },
      contactInfo
    });

    // Add admin to organization
    organization.admins = [admin._id];
    await organization.save();

    // Update company's organizations
    company.organizations = [organization._id];
    await company.save();

    // Auto-setup based on organization type
    if (organizationType === "school") {
      await setupSchoolDefaults(organization._id, organization.tenantId);
    }

    // Generate token for admin user
    const token = generateToken(admin._id);

    res.status(201).json({
      message: "Registration successful",
      organization: {
        id: organization._id,
        name: organization.name,
        type: organization.type,
        tenantId: organization.tenantId,
      },
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token
      },
      redirectUrl: organizationType === "school" ? "/school/admin" : "/admin/dashboard"
    });
  } catch (error) {
    console.error("Organization registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const getPendingSchoolRegistrations = async (req, res) => {
  try {
    const {
      search,
      state,
      sort = 'oldest',
      limit: limitParam = 100
    } = req.query;

    const limit = Math.min(parseInt(limitParam, 10) || 100, 500);

    const query = {
      type: 'school',
      approvalStatus: 'pending'
    };

    if (state) {
      query['contactInfo.state'] = new RegExp(`^${state}$`, 'i');
    }

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { email: regex },
        { institutionId: regex },
        { 'contactInfo.phone': regex },
        { 'contactInfo.city': regex },
        { 'contactInfo.state': regex }
      ];
    }

    const sortOption = sort === 'newest' ? { createdAt: -1 } : { createdAt: 1 };

    const pendingCompanies = await Company.find(query)
      .sort(sortOption)
      .limit(limit)
      .populate([
        { path: 'approvedBy', select: 'name email' },
        { path: 'organizations', select: 'name tenantId isActive' },
        { path: 'reviewHistory.reviewer', select: 'name email' }
      ])
      .lean();

    const orgIdSet = new Set();
    pendingCompanies.forEach((company) => {
      (company.organizations || []).forEach((org) => {
        const orgId = (org && org._id) ? org._id : org;
        if (orgId) {
          orgIdSet.add(orgId.toString());
        }
      });
    });

    const orgObjectIds = Array.from(orgIdSet).map((id) => new mongoose.Types.ObjectId(id));

    const adminUsers = await User.find({
      role: 'school_admin',
      ...(orgObjectIds.length > 0 ? { orgId: { $in: orgObjectIds } } : {})
    })
      .select('name email approvalStatus orgId createdAt')
      .lean();

    const adminByOrg = new Map();
    adminUsers.forEach((admin) => {
      if (admin.orgId) {
        adminByOrg.set(admin.orgId.toString(), admin);
      }
    });

    const pendingSchools = pendingCompanies.map((company) => {
      const primaryOrg = extractPrimaryOrganization(company);
      const adminUser =
        (primaryOrg && adminByOrg.get(primaryOrg.id)) ||
        adminUsers.find((admin) => admin.email?.toLowerCase() === company.email?.toLowerCase());

      const formatted = buildSchoolApprovalView(company, adminUser);
      return decoratePendingSchool(formatted);
    });

    res.json({
      success: true,
      data: pendingSchools,
      meta: {
        total: pendingSchools.length
      }
    });
  } catch (error) {
    console.error("Error fetching pending school approvals:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending school approvals",
      error: error.message
    });
  }
};

export const getSchoolApprovalDashboard = async (req, res) => {
  try {
    const now = new Date();
    const last7 = new Date(now);
    last7.setDate(now.getDate() - 7);
    const last30 = new Date(now);
    last30.setDate(now.getDate() - 30);

    const [
      pendingCount,
      approvedDocs,
      rejectedDocs,
      submissionsLast7,
      recentDocs,
      pendingStateAgg,
      agingCount,
      pendingHighlightsRaw
    ] = await Promise.all([
      Company.countDocuments({ type: 'school', approvalStatus: 'pending' }),
      Company.find({ type: 'school', approvalStatus: 'approved', approvedAt: { $gte: last30 } })
        .select('createdAt approvedAt')
        .lean(),
      Company.find({ type: 'school', approvalStatus: 'rejected', lastReviewedAt: { $gte: last30 } })
        .select('createdAt lastReviewedAt')
        .lean(),
      Company.find({ type: 'school', createdAt: { $gte: last7 } })
        .select('createdAt')
        .lean(),
      Company.find({ type: 'school' })
        .sort({ updatedAt: -1 })
        .limit(8)
        .populate([
          { path: 'approvedBy', select: 'name email' },
          { path: 'reviewHistory.reviewer', select: 'name email' },
          { path: 'organizations', select: 'name tenantId isActive' }
        ])
        .lean(),
      Company.aggregate([
        { $match: { type: 'school', approvalStatus: 'pending' } },
        {
          $group: {
            _id: { $ifNull: ['$contactInfo.state', 'Unknown'] },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Company.countDocuments({
        type: 'school',
        approvalStatus: 'pending',
        createdAt: { $lte: new Date(Date.now() - 72 * 36e5) }
      }),
      Company.find({ type: 'school', approvalStatus: 'pending' })
        .sort({ createdAt: 1 })
        .limit(5)
        .populate([
          { path: 'organizations', select: 'name tenantId isActive' },
          { path: 'reviewHistory.reviewer', select: 'name email' },
          { path: 'approvedBy', select: 'name email' }
        ])
        .lean()
    ]);

    const approvedLast30 = approvedDocs.length;
    const rejectedLast30 = rejectedDocs.length;

    const decisionHoursArr = approvedDocs
      .map((doc) => hoursBetween(doc.createdAt, doc.approvedAt))
      .filter((value) => typeof value === 'number');

    const averageDecisionHours = decisionHoursArr.length
      ? Math.round((decisionHoursArr.reduce((sum, val) => sum + val, 0) / decisionHoursArr.length) * 10) / 10
      : null;

    const totalDecisions = approvedLast30 + rejectedLast30;
    const approvalRate = totalDecisions ? Math.round((approvedLast30 / totalDecisions) * 100) : null;

    const pendingByState = pendingStateAgg.map((entry) => ({
      state: entry._id === 'Unknown' ? 'Unknown' : entry._id,
      count: entry.count
    }));

    const timeline = Array.from({ length: 7 }).map((_, idx) => {
      const day = new Date(now);
      day.setDate(now.getDate() - (6 - idx));
      const dayKey = day.toISOString().slice(0, 10);
      const submissionsCount = submissionsLast7.filter((doc) => {
        if (!doc.createdAt) return false;
        const docDate = new Date(doc.createdAt).toISOString().slice(0, 10);
        return docDate === dayKey;
      }).length;
      return {
        date: dayKey,
        label: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        submissions: submissionsCount
      };
    });

    const recentActivity = recentDocs.map((doc) => {
      const history = mapReviewHistory(doc.reviewHistory || []);
      const latest = history.length ? history[history.length - 1] : null;
      const reviewer =
        latest?.reviewer ||
        mapReviewer(doc.approvedBy);
      const timestamp = latest?.createdAt || doc.updatedAt;

      return {
        id: doc._id.toString(),
        name: doc.name,
        status: doc.approvalStatus,
        note: latest?.note || '',
        reviewer,
        timestamp,
        relativeTime: formatRelativeTime(timestamp),
        readinessScore: computeReadinessScore(doc)
      };
    });

    const highlightOrgIds = new Set();
    pendingHighlightsRaw.forEach((doc) => {
      (doc.organizations || []).forEach((org) => {
        const orgId = (org && org._id) ? org._id : org;
        if (orgId) highlightOrgIds.add(orgId.toString());
      });
    });

    const highlightAdmins = highlightOrgIds.size
      ? await User.find({
          role: 'school_admin',
          orgId: { $in: Array.from(highlightOrgIds).map((id) => new mongoose.Types.ObjectId(id)) }
        })
          .select('name email approvalStatus orgId createdAt')
          .lean()
      : [];

    const highlightAdminMap = new Map();
    highlightAdmins.forEach((admin) => {
      if (admin.orgId) {
        highlightAdminMap.set(admin.orgId.toString(), admin);
      }
    });

    const pendingHighlights = pendingHighlightsRaw.map((doc) => {
      const primaryOrg = extractPrimaryOrganization(doc);
      const adminUser =
        (primaryOrg && highlightAdminMap.get(primaryOrg.id)) ||
        highlightAdmins.find((admin) => admin.email?.toLowerCase() === doc.email?.toLowerCase());
      return decoratePendingSchool(buildSchoolApprovalView(doc, adminUser));
    });

    res.json({
      success: true,
      data: {
        summary: {
          pending: pendingCount,
          approvedLast30,
          rejectedLast30,
          approvalRate,
          averageDecisionHours,
          agingBacklog: agingCount
        },
        pendingByState,
        submissionTimeline: timeline,
        pendingHighlights,
        recentActivity
      }
    });
  } catch (error) {
    console.error("Error fetching school approval dashboard:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch school approval dashboard",
      error: error.message
    });
  }
};

export const getSchoolApprovalHistory = async (req, res) => {
  try {
    const {
      status = 'all',
      search,
      page: pageParam = 1,
      limit: limitParam = 20
    } = req.query;

    const limit = Math.min(parseInt(limitParam, 10) || 20, 200);
    const page = Math.max(parseInt(pageParam, 10) || 1, 1);
    const skip = (page - 1) * limit;

    const statusFilter = status === 'all' ? ['approved', 'rejected'] : [status];

    const query = {
      type: 'school',
      approvalStatus: { $in: statusFilter }
    };

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { email: regex },
        { institutionId: regex },
        { 'contactInfo.phone': regex },
        { 'contactInfo.city': regex },
        { 'contactInfo.state': regex }
      ];
    }

    const [total, companies] = await Promise.all([
      Company.countDocuments(query),
      Company.find(query)
        .sort({ lastReviewedAt: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate([
          { path: 'organizations', select: 'name tenantId isActive' },
          { path: 'reviewHistory.reviewer', select: 'name email' },
          { path: 'approvedBy', select: 'name email' }
        ])
        .lean()
    ]);

    const orgIdSet = new Set();
    companies.forEach((company) => {
      (company.organizations || []).forEach((org) => {
        const orgId = (org && org._id) ? org._id : org;
        if (orgId) orgIdSet.add(orgId.toString());
      });
    });

    const historyAdmins = orgIdSet.size
      ? await User.find({
          role: 'school_admin',
          orgId: { $in: Array.from(orgIdSet).map((id) => new mongoose.Types.ObjectId(id)) }
        })
          .select('name email approvalStatus orgId createdAt')
          .lean()
      : [];

    const historyAdminMap = new Map();
    historyAdmins.forEach((admin) => {
      if (admin.orgId) historyAdminMap.set(admin.orgId.toString(), admin);
    });

    const history = companies.map((company) => {
      const primaryOrg = extractPrimaryOrganization(company);
      const adminUser =
        (primaryOrg && historyAdminMap.get(primaryOrg.id)) ||
        historyAdmins.find((admin) => admin.email?.toLowerCase() === company.email?.toLowerCase());

      const formatted = buildSchoolApprovalView(company, adminUser);
      const decisionTimestamp = formatted.lastReviewedAt || company.approvedAt || company.updatedAt;

      return {
        ...formatted,
        decisionAt: decisionTimestamp,
        decisionRelativeTime: formatRelativeTime(decisionTimestamp),
        decisionOutcome: formatted.approvalStatus,
        reviewNote: formatted.approvalStatus === 'rejected'
          ? formatted.rejectionReason
          : formatted.approvalNotes
      };
    });

    res.json({
      success: true,
      data: history,
      meta: {
        total,
        page,
        limit,
        pages: Math.max(1, Math.ceil(total / limit))
      }
    });
  } catch (error) {
    console.error("Error fetching school approval history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch school approval history",
      error: error.message
    });
  }
};

export const approveSchoolRegistration = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { note } = req.body || {};

    const company = await Company.findById(companyId)
      .populate('organizations', 'name tenantId isActive')
      .populate('reviewHistory.reviewer', 'name email')
      .populate('approvedBy', 'name email');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "School registration not found"
      });
    }

    if (company.approvalStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: "This registration is not pending approval"
      });
    }

    const io = req.app && typeof req.app.get === "function" ? req.app.get("io") : null;

    const organizations = company.organizations || [];
    const contactInfo = company.contactInfo || {};

    const primaryOrgDoc = organizations[0] || null;
    const orgContext = primaryOrgDoc ? normalizeOrganizationContext(primaryOrgDoc) : null;
    const organizationTenantId =
      orgContext?.tenantId ||
      (typeof primaryOrgDoc?.tenantId === 'string' ? primaryOrgDoc.tenantId : null);
    const organizationObjectId = orgContext?.objectId || (primaryOrgDoc?._id ?? null);

    const adminUsers = await findSchoolAdminUsers(company);
    const primaryAdminUser = adminUsers.length ? adminUsers[0] : null;

    const decisionTimestamp = new Date();
    const trimmedNote = note?.toString().trim() || '';

    company.approvalStatus = 'approved';
    company.approvedAt = decisionTimestamp;
    company.approvedBy = req.user?._id;
    company.rejectionReason = undefined;
    company.approvalNotes = trimmedNote;
    company.isActive = true;
    company.lastReviewedAt = decisionTimestamp;
    company.reviewHistory = Array.isArray(company.reviewHistory) ? company.reviewHistory : [];
    company.reviewHistory.push({
      reviewer: req.user?._id || null,
      action: 'approved',
      note: trimmedNote || 'Approved',
      createdAt: decisionTimestamp
    });

    const premiumExpiryDate = new Date(decisionTimestamp.getTime() + 365 * 24 * 60 * 60 * 1000);
    company.subscriptionPlan = EDUCATIONAL_PLAN_TYPE;
    company.subscriptionStart = decisionTimestamp;
    company.subscriptionExpiry = premiumExpiryDate;

    await company.save();

    const institutionPlanDetails = cloneEducationalPlanDetails();
    const institutionPlanLimits = cloneEducationalPlanLimits();

    if (organizations.length > 0) {
      const organizationIds = organizations.map((org) => (org && org._id) ? org._id : org);
      await Organization.updateMany(
        { _id: { $in: organizationIds } },
        {
          $set: {
            isActive: true,
            name: company.name,
            'settings.address.street': contactInfo.address || '',
            'settings.address.city': contactInfo.city || '',
            'settings.address.state': contactInfo.state || '',
            'settings.address.pincode': contactInfo.pincode || '',
            'settings.contactInfo.phone': contactInfo.phone || '',
            'settings.contactInfo.email': company.email || '',
            'settings.contactInfo.website': contactInfo.website || '',
            'settings.academicYear.startDate': company.createdAt || new Date(),
            'settings.schoolSettings.hasStreams': false,
            'settings.schoolSettings.streams': []
          }
        }
      );

      for (const orgDoc of organizations) {
        const orgId = orgDoc?._id;
        const tenantId = orgDoc?.tenantId;
        if (!orgId || !tenantId) {
          continue;
        }

        let subscription = await Subscription.findOne({ orgId, tenantId });
        if (!subscription) {
          subscription = new Subscription({
            orgId,
            tenantId,
            plan: { ...institutionPlanDetails },
            limits: { ...institutionPlanLimits },
            status: 'active',
            startDate: decisionTimestamp,
            endDate: premiumExpiryDate,
            autoRenew: true,
          });
        } else {
          subscription.plan = { ...institutionPlanDetails };
          subscription.limits = { ...institutionPlanLimits };
          subscription.status = 'active';
          subscription.startDate = subscription.startDate || decisionTimestamp;
          subscription.endDate = premiumExpiryDate;
          subscription.autoRenew = true;
        }

        await subscription.save();
      }
    }

    const schoolMemberRoles = ['school_admin', 'school_teacher', 'school_student'];
    let schoolMembers = [];
    if (organizationObjectId) {
      schoolMembers = await User.find({
        orgId: organizationObjectId,
        role: { $in: schoolMemberRoles },
      }).select('_id role name email');
    }

    const membersMap = new Map();
    adminUsers.forEach((adminUser) => {
      if (adminUser?._id) {
        membersMap.set(adminUser._id.toString(), adminUser);
      }
    });
    schoolMembers.forEach((member) => {
      if (member?._id) {
        membersMap.set(member._id.toString(), member);
      }
    });

    const membersList = Array.from(membersMap.values());
    const memberAssignments = await Promise.all(
      membersList.map(async (member) => ({
        member,
        subscription: await assignUserSubscription({
          userId: member._id,
          planType: EDUCATIONAL_PLAN_TYPE,
          planName: EDUCATIONAL_PLAN_NAME,
          features: EDUCATIONAL_PLAN_FEATURES,
          amount: 0,
          startDate: decisionTimestamp,
          endDate: premiumExpiryDate,
          metadata: {
            orgId: organizationObjectId ? organizationObjectId.toString() : null,
            tenantId: organizationTenantId || null,
            source: 'school_approval',
            role: member.role || null,
          },
          initiator: {
            userId: req.user?._id || null,
            role: req.user?.role || 'admin',
            name: req.user?.name || 'Admin',
            email: req.user?.email || null,
            context: 'admin',
          },
        }),
      }))
    );

    if (io) {
      memberAssignments.forEach(({ member, subscription }) => {
        if (!subscription || !member?._id) return;
        const payload = subscription.toObject ? subscription.toObject() : subscription;
        io.to(member._id.toString()).emit('subscription:activated', {
          userId: member._id.toString(),
          subscription: payload,
        });
      });
    }

    if (organizationObjectId && organizationTenantId) {
      await Promise.all([
        SchoolClass.updateMany(
          { orgId: organizationObjectId, tenantId: { $ne: organizationTenantId } },
          { tenantId: organizationTenantId }
        ),
        SchoolStudent.updateMany(
          { orgId: organizationObjectId, tenantId: { $ne: organizationTenantId } },
          { tenantId: organizationTenantId }
        ),
      ]);
    }

    if (adminUsers.length) {
      await Promise.all(
        adminUsers.map((adminUser) => {
          if (organizationObjectId && (!adminUser.orgId || adminUser.orgId.toString() !== organizationObjectId.toString())) {
            adminUser.orgId = organizationObjectId;
          }
          if (organizationTenantId && adminUser.tenantId !== organizationTenantId) {
            adminUser.tenantId = organizationTenantId;
          }
          adminUser.approvalStatus = 'approved';
          adminUser.isVerified = true;
          adminUser.approvedAt = decisionTimestamp;
          adminUser.approvedBy = req.user?._id || adminUser.approvedBy;
          adminUser.rejectionReason = null;
          adminUser.rejectedAt = null;

          if (adminUser === primaryAdminUser) {
            if (company.name && adminUser.name !== `${company.name} Admin`) {
              adminUser.name = `${company.name} Admin`;
            }
            const normalizedEmail = company.email?.toLowerCase?.();
            if (normalizedEmail && adminUser.email !== normalizedEmail) {
              adminUser.email = normalizedEmail;
            }
            adminUser.contactInfo = {
              ...(adminUser.contactInfo || {}),
              phone: contactInfo.phone || adminUser.contactInfo?.phone,
              address: contactInfo.address || adminUser.contactInfo?.address,
              city: contactInfo.city || adminUser.contactInfo?.city,
              state: contactInfo.state || adminUser.contactInfo?.state,
              pincode: contactInfo.pincode || adminUser.contactInfo?.pincode,
              website: contactInfo.website || adminUser.contactInfo?.website
            };
          }

          return adminUser.save();
        })
      );
    }

    await company.populate([
      { path: 'organizations', select: 'name tenantId isActive settings' },
      { path: 'reviewHistory.reviewer', select: 'name email' },
      { path: 'approvedBy', select: 'name email' }
    ]);

    const formatted = buildSchoolApprovalView(company, primaryAdminUser);

    if (io) {
      io.emit('admin:school-approval:update', {
        status: 'approved',
        data: formatted
      });
      await emitAdminSchoolUpdate(io, company);
    }

    res.json({
      success: true,
      message: "School registration approved successfully",
      data: formatted
    });
  } catch (error) {
    console.error("Error approving school registration:", error);
    res.status(500).json({
      success: false,
      message: "Failed to approve school registration",
      error: error.message
    });
  }
};

export const rejectSchoolRegistration = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { note, reason } = req.body || {};

    const rejectionNote = (note ?? reason ?? '').toString().trim();
    if (!rejectionNote) {
      return res.status(400).json({
        success: false,
        message: "Rejection note is required"
      });
    }

    const company = await Company.findById(companyId)
      .populate('organizations', 'name tenantId isActive')
      .populate('reviewHistory.reviewer', 'name email')
      .populate('approvedBy', 'name email');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "School registration not found"
      });
    }

    if (company.approvalStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: "This registration is not pending approval"
      });
    }

    const organizations = company.organizations || [];
    const primaryOrgDoc = organizations[0] || null;
    const orgContext = primaryOrgDoc ? normalizeOrganizationContext(primaryOrgDoc) : null;
    const organizationTenantId = orgContext?.tenantId || null;
    const organizationObjectId = orgContext?.objectId || (primaryOrgDoc?._id ?? null);

    const adminUsers = await findSchoolAdminUsers(company);
    const primaryAdminUser = adminUsers.length ? adminUsers[0] : null;

    const decisionTimestamp = new Date();

    company.approvalStatus = 'rejected';
    company.rejectionReason = rejectionNote;
    company.approvalNotes = rejectionNote;
    company.isActive = false;
    company.approvedAt = null;
    company.approvedBy = req.user?._id;
    company.lastReviewedAt = decisionTimestamp;
    company.reviewHistory = Array.isArray(company.reviewHistory) ? company.reviewHistory : [];
    company.reviewHistory.push({
      reviewer: req.user?._id || null,
      action: 'rejected',
      note: rejectionNote,
      createdAt: decisionTimestamp
    });

    await company.save();

    if (organizations.length > 0) {
      await Organization.updateMany(
        { _id: { $in: organizations.map((org) => (org._id ? org._id : org)) } },
        {
          $set: {
            isActive: false
          }
        }
      );
    }

    if (adminUsers.length) {
      await Promise.all(
        adminUsers.map((adminUser) => {
          if (organizationObjectId && (!adminUser.orgId || adminUser.orgId.toString() !== organizationObjectId.toString())) {
            adminUser.orgId = organizationObjectId;
          }
          if (organizationTenantId && adminUser.tenantId !== organizationTenantId) {
            adminUser.tenantId = organizationTenantId;
          }
          adminUser.approvalStatus = 'rejected';
          adminUser.isVerified = false;
          adminUser.rejectedAt = decisionTimestamp;
          adminUser.rejectionReason = rejectionNote;
          adminUser.approvedAt = null;
          return adminUser.save();
        })
      );
    }

    await company.populate([
      { path: 'organizations', select: 'name tenantId isActive' },
      { path: 'reviewHistory.reviewer', select: 'name email' },
      { path: 'approvedBy', select: 'name email' }
    ]);

    const formatted = buildSchoolApprovalView(company, primaryAdminUser);

    const io = req.app && typeof req.app.get === "function" ? req.app.get("io") : null;
    if (io) {
      io.emit('admin:school-approval:update', {
        status: 'rejected',
        data: formatted
      });
      await emitAdminSchoolUpdate(io, company);
    }

    res.json({
      success: true,
      message: "School registration rejected",
      data: formatted
    });
  } catch (error) {
    console.error("Error rejecting school registration:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject school registration",
      error: error.message
    });
  }
};

export const updatePendingSchoolRegistration = async (req, res) => {
  try {
    const { companyId } = req.params;
    const {
      name,
      institutionId,
      email,
      contactInfo = {},
      academicInfo = {},
      note
    } = req.body || {};

    const company = await Company.findById(companyId).populate('organizations').populate('reviewHistory.reviewer', 'name email');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'School registration not found'
      });
    }

    if (company.approvalStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending registrations can be edited'
      });
    }

    if (institutionId && institutionId !== company.institutionId) {
      const existingInstitution = await Company.findOne({ institutionId: institutionId.trim(), _id: { $ne: company._id } });
      if (existingInstitution) {
        return res.status(409).json({
          success: false,
          message: 'Another organization is already using this institution ID'
        });
      }
    }

    if (email && email.toLowerCase() !== company.email.toLowerCase()) {
      const existingEmail = await Company.findOne({ email: email.toLowerCase(), _id: { $ne: company._id } });
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: 'Another organization is already using this email address'
        });
      }
    }

    const now = new Date();

    if (typeof name === 'string' && name.trim()) {
      company.name = name.trim();
    }

    if (typeof institutionId === 'string' && institutionId.trim()) {
      company.institutionId = institutionId.trim();
    }

    if (typeof email === 'string' && email.trim()) {
      company.email = email.trim().toLowerCase();
    }

    company.contactInfo = {
      ...(company.contactInfo || {}),
      ...contactInfo
    };

    const updatedAcademicInfo = {
      ...(company.academicInfo || {}),
      ...academicInfo
    };

    if (updatedAcademicInfo.totalStudents !== undefined && updatedAcademicInfo.totalStudents !== null) {
      const totalStudentsNumber = Number(updatedAcademicInfo.totalStudents);
      updatedAcademicInfo.totalStudents = Number.isFinite(totalStudentsNumber) ? totalStudentsNumber : company.academicInfo?.totalStudents || 0;
    }

    if (updatedAcademicInfo.totalTeachers !== undefined && updatedAcademicInfo.totalTeachers !== null) {
      const totalTeachersNumber = Number(updatedAcademicInfo.totalTeachers);
      updatedAcademicInfo.totalTeachers = Number.isFinite(totalTeachersNumber) ? totalTeachersNumber : company.academicInfo?.totalTeachers || 0;
    }

    company.academicInfo = updatedAcademicInfo;
    company.lastReviewedAt = now;

    company.reviewHistory = Array.isArray(company.reviewHistory) ? company.reviewHistory : [];
    company.reviewHistory.push({
      reviewer: req.user?._id || null,
      action: 'commented',
      note: note?.toString()?.trim() || 'School details updated by admin',
      createdAt: now
    });

    const organizations = company.organizations || [];
    if (organizations.length > 0) {
      const orgIds = organizations.map((org) => (org && org._id ? org._id : org));
      await Organization.updateMany(
        { _id: { $in: orgIds } },
        {
          $set: {
            name: typeof name === 'string' && name.trim() ? name.trim() : company.name,
            'settings.board': updatedAcademicInfo.board || '',
            'settings.establishedYear': updatedAcademicInfo.establishedYear || '',
            'settings.totalStudents': updatedAcademicInfo.totalStudents || 0,
            'settings.totalTeachers': updatedAcademicInfo.totalTeachers || 0
          }
        }
      );
    }

    const adminUsers = await findSchoolAdminUsers(company);
    const primaryAdminUser = adminUsers.length ? adminUsers[0] : null;

    if (adminUsers.length) {
      await Promise.all(
        adminUsers.map((adminUser) => {
          if (adminUser === primaryAdminUser) {
            if (typeof name === 'string' && name.trim()) {
              adminUser.name = `${name.trim()} Admin`;
            }
            if (typeof email === 'string' && email.trim()) {
              adminUser.email = email.trim().toLowerCase();
            }
          }
          return adminUser.save();
        })
      );
    }

    await company.save();

    const formatted = buildSchoolApprovalView(company, primaryAdminUser);

    const io = req.app && typeof req.app.get === 'function' ? req.app.get('io') : null;
    if (io) {
      io.emit('admin:school-approval:update', {
        companyId: company._id.toString(),
        status: 'updated',
        data: formatted
      });
      await emitAdminSchoolUpdate(io, company);
    }

    res.json({
      success: true,
      message: 'School details updated successfully',
      data: formatted
    });
  } catch (error) {
    console.error('Error updating school details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update school details',
      error: error.message
    });
  }
};

export const getAdminSchools = async (req, res) => {
  try {
    const {
      status = 'all',
      search = '',
      sort = 'recent',
      page: pageParam = 1,
      limit: limitParam = 18
    } = req.query;

    const allowableStatuses = ['pending', 'approved', 'rejected'];
    const normalizedStatus = typeof status === 'string' ? status.toLowerCase() : 'all';
    const statusFilter = normalizedStatus === 'all'
      ? allowableStatuses
      : allowableStatuses.includes(normalizedStatus)
        ? [normalizedStatus]
        : allowableStatuses;

    const limit = Math.min(Math.max(parseInt(limitParam, 10) || 18, 1), 100);
    const page = Math.max(parseInt(pageParam, 10) || 1, 1);
    const skip = (page - 1) * limit;

    const query = {
      type: 'school',
      approvalStatus: { $in: statusFilter }
    };

    if (search && typeof search === 'string' && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { email: regex },
        { institutionId: regex },
        { 'contactInfo.city': regex },
        { 'contactInfo.state': regex },
        { 'contactInfo.phone': regex }
      ];
    }

    const sortOption = (() => {
      switch (sort) {
        case 'name':
          return { name: 1 };
        case 'oldest':
          return { createdAt: 1 };
        case 'students':
          return { 'academicInfo.totalStudents': -1, updatedAt: -1 };
        case 'recent':
        default:
          return { updatedAt: -1, createdAt: -1 };
      }
    })();

    const [total, companies] = await Promise.all([
      Company.countDocuments(query),
      Company.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .populate([
          {
            path: 'organizations',
            select: 'name tenantId isActive campuses userCount maxUsers settings createdAt updatedAt'
          },
          { path: 'reviewHistory.reviewer', select: 'name email' },
          { path: 'approvedBy', select: 'name email' }
        ])
    ]);

    const [approvedCount, pendingCount, rejectedCount, totalSchools] = await Promise.all([
      Company.countDocuments({ type: 'school', approvalStatus: 'approved' }),
      Company.countDocuments({ type: 'school', approvalStatus: 'pending' }),
      Company.countDocuments({ type: 'school', approvalStatus: 'rejected' }),
      Company.countDocuments({ type: 'school' })
    ]);

    const hydrated = await hydrateSchoolData(companies);

    const grouped = {
      approved: [],
      pending: [],
      rejected: []
    };
    hydrated.forEach((school) => {
      if (grouped[school.approvalStatus]) {
        grouped[school.approvalStatus].push(school);
      }
    });

    res.json({
      success: true,
      data: hydrated,
      grouped,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit))
      },
      summary: {
        total: totalSchools,
        approved: approvedCount,
        pending: pendingCount,
        rejected: rejectedCount
      },
      filters: {
        status: normalizedStatus,
        search,
        sort
      }
    });
  } catch (error) {
    console.error('Error fetching admin schools:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch schools',
      error: error.message
    });
  }
};

export const getAdminSchoolDetail = async (req, res) => {
  try {
    const { companyId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid school identifier'
      });
    }

    const company = await Company.findById(companyId).populate([
      {
        path: 'organizations',
        select: 'name tenantId isActive campuses userCount maxUsers settings createdAt updatedAt'
      },
      { path: 'reviewHistory.reviewer', select: 'name email' },
      { path: 'approvedBy', select: 'name email' }
    ]);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    const io = req.app && typeof req.app.get === 'function' ? req.app.get('io') : null;
    const organizations = Array.isArray(company.organizations) ? company.organizations : [];
    const primaryOrgDoc = organizations[0] || null;
    let primaryOrganizationRecord = null;
    let orgId = null;

    if (primaryOrgDoc) {
      orgId = primaryOrgDoc._id || primaryOrgDoc;
      try {
        primaryOrganizationRecord = await Organization.findById(orgId);
      } catch (error) {
        console.error("Error loading organization for school update:", error);
      }
    }

    const orgContext = primaryOrgDoc ? normalizeOrganizationContext(primaryOrgDoc) : null;
    const organizationTenantId =
      orgContext?.tenantId ||
      (typeof primaryOrgDoc?.tenantId === 'string' ? primaryOrgDoc.tenantId : null);
    const organizationObjectId = orgContext?.objectId || (primaryOrgDoc?._id ?? null);

    const adminUsers = await findSchoolAdminUsers(company);
    const primaryAdminUser = adminUsers.length ? adminUsers[0] : null;

    const [detail] = await hydrateSchoolData([company]);
    if (!detail) {
      return res.status(404).json({
        success: false,
        message: 'Unable to load school detail'
      });
    }

    let analytics = null;
    const tenantId = detail?.primaryOrganization?.tenantId;
    if (tenantId) {
      const [admissions, activeTeachers] = await Promise.all([
        SchoolStudent.aggregate([
          {
            $match: {
              tenantId,
              createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
            }
          },
          {
            $group: {
              _id: '$grade',
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ]),
        User.countDocuments({
          tenantId,
          role: 'school_teacher',
          lastActiveAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        })
      ]);

      analytics = {
        admissionsLast30: admissions.map((entry) => ({
          grade: entry._id || 'Unknown',
          count: entry.count
        })),
        activeTeachers7d: activeTeachers
      };
    }

    res.json({
      success: true,
      data: detail,
      analytics,
      meta: {
        availableStatuses: ['pending', 'approved', 'rejected']
      }
    });
  } catch (error) {
    console.error('Error fetching school detail:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch school detail',
      error: error.message
    });
  }
};

export const updateAdminSchool = async (req, res) => {
  try {
    const { companyId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid school identifier'
      });
    }

    const io = req.app && typeof req.app.get === 'function' ? req.app.get('io') : null;

    const {
      name,
      email,
      contactInfo,
      academicInfo,
      approvalStatus,
      rejectionReason,
      approvalNotes,
      note,
      organization: organizationPayload,
      subscription: subscriptionPayload,
      admin: adminPayload
    } = req.body || {};

    const company = await Company.findById(companyId).populate([
      {
        path: 'organizations',
        select: 'name tenantId isActive campuses userCount maxUsers settings createdAt updatedAt'
      },
      { path: 'reviewHistory.reviewer', select: 'name email' },
      { path: 'approvedBy', select: 'name email' }
    ]);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    const organizations = Array.isArray(company.organizations) ? company.organizations : [];
    const primaryOrgDoc = organizations[0] || null;
    let primaryOrganizationRecord = null;
    let orgId = null;

    if (primaryOrgDoc) {
      orgId = primaryOrgDoc._id || primaryOrgDoc;
      try {
        primaryOrganizationRecord = await Organization.findById(orgId);
      } catch (error) {
        console.error("Error loading organization for school update:", error);
      }
    }

    const orgContext = primaryOrgDoc ? normalizeOrganizationContext(primaryOrgDoc) : null;
    const organizationObjectId = orgContext?.objectId || (primaryOrgDoc?._id ?? null);
    const organizationTenantId =
      orgContext?.tenantId ||
      (typeof primaryOrgDoc?.tenantId === 'string' ? primaryOrgDoc.tenantId : null);

    const adminUsers = await findSchoolAdminUsers(company);
    const primaryAdminUser = adminUsers.length ? adminUsers[0] : null;

    const normalizedName = typeof name === 'string' ? name.trim() : null;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : null;

    if (normalizedName && normalizedName !== company.name) {
      company.name = normalizedName;
    }

    if (normalizedEmail && normalizedEmail !== company.email) {
      const existingWithEmail = await Company.findOne({
        email: normalizedEmail,
        _id: { $ne: company._id }
      });
      if (existingWithEmail) {
        return res.status(409).json({
          success: false,
          message: 'Another organization is already using this email address'
        });
      }
      company.email = normalizedEmail;
    }

    if (contactInfo && typeof contactInfo === 'object') {
      company.contactInfo = {
        ...(company.contactInfo || {}),
        ...contactInfo
      };
    }

    if (academicInfo && typeof academicInfo === 'object') {
      const mergedAcademic = {
        ...(company.academicInfo || {}),
        ...academicInfo
      };
      if (mergedAcademic.totalStudents !== undefined && mergedAcademic.totalStudents !== null) {
        const totalStudents = Number(mergedAcademic.totalStudents);
        mergedAcademic.totalStudents = Number.isFinite(totalStudents)
          ? totalStudents
          : company.academicInfo?.totalStudents ?? null;
      }
      if (mergedAcademic.totalTeachers !== undefined && mergedAcademic.totalTeachers !== null) {
        const totalTeachers = Number(mergedAcademic.totalTeachers);
        mergedAcademic.totalTeachers = Number.isFinite(totalTeachers)
          ? totalTeachers
          : company.academicInfo?.totalTeachers ?? null;
      }
      company.academicInfo = mergedAcademic;

      // Update Organization settings with academic info
      if (organizationObjectId && organizationTenantId) {
        const orgIds = organizations.map((org) => (org && org._id ? org._id : org));
        if (orgIds.length > 0) {
          await Organization.updateMany(
            { _id: { $in: orgIds } },
            {
              $set: {
                'settings.board': mergedAcademic.board || '',
                'settings.establishedYear': mergedAcademic.establishedYear || '',
                'settings.totalStudents': mergedAcademic.totalStudents || 0,
                'settings.totalTeachers': mergedAcademic.totalTeachers || 0
              }
            }
          );
        }
      }
    }

    const now = new Date();
    let statusChanged = false;
    const allowableStatuses = ['pending', 'approved', 'rejected'];

    if (approvalStatus && allowableStatuses.includes(approvalStatus) && approvalStatus !== company.approvalStatus) {
      statusChanged = true;
      company.approvalStatus = approvalStatus;
      company.lastReviewedAt = now;

      if (approvalStatus === 'approved') {
        company.isActive = true;
        company.approvedAt = now;
        company.approvedBy = req.user?._id || company.approvedBy;
        company.rejectionReason = null;
        company.approvalNotes = typeof approvalNotes === 'string' ? approvalNotes.trim() : company.approvalNotes;
        if (primaryOrganizationRecord) {
          primaryOrganizationRecord.isActive = true;
        }

        const premiumExpiryDate = new Date(now.getTime() + EDUCATIONAL_PLAN_DURATION_MS);
        company.subscriptionPlan = EDUCATIONAL_PLAN_TYPE;
        company.subscriptionStart = now;
        company.subscriptionExpiry = premiumExpiryDate;

        if (adminUsers.length) {
          adminUsers.forEach((adminUser) => {
            if (organizationObjectId && (!adminUser.orgId || adminUser.orgId.toString() !== organizationObjectId.toString())) {
              adminUser.orgId = organizationObjectId;
            }
            if (organizationTenantId && adminUser.tenantId !== organizationTenantId) {
              adminUser.tenantId = organizationTenantId;
            }
            adminUser.approvalStatus = 'approved';
            adminUser.isVerified = true;
            adminUser.approvedAt = now;
            adminUser.rejectionReason = null;
            adminUser.rejectedAt = null;
            adminUser.approvedBy = req.user?._id || adminUser.approvedBy;
          });
        }

        const contactInfoSnapshot = company.contactInfo || {};
        const organizationContexts = organizations.map(normalizeOrganizationContext);
        const organizationObjectIds = Array.from(
          new Set(
            organizationContexts
              .map((ctx) => ctx?.objectId)
              .filter(Boolean)
              .map((objectId) => objectId.toString())
          )
        ).map((id) => new mongoose.Types.ObjectId(id));

        if (organizationObjectIds.length) {
          await Organization.updateMany(
            { _id: { $in: organizationObjectIds } },
            {
              $set: {
                isActive: true,
                name: company.name,
                'settings.address.street': contactInfoSnapshot.address || '',
                'settings.address.city': contactInfoSnapshot.city || '',
                'settings.address.state': contactInfoSnapshot.state || '',
                'settings.address.pincode': contactInfoSnapshot.pincode || '',
                'settings.contactInfo.phone': contactInfoSnapshot.phone || '',
                'settings.contactInfo.email': company.email || '',
                'settings.contactInfo.website': contactInfoSnapshot.website || '',
                'settings.academicYear.startDate': company.createdAt || new Date(),
                'settings.schoolSettings.hasStreams': false,
                'settings.schoolSettings.streams': [],
              },
            }
          );
        }

        for (const orgContext of organizationContexts) {
          const normalizedOrgId = orgContext?.objectId;
          const tenantValue =
            orgContext?.tenantId ||
            organizationTenantId ||
            null;
          if (!normalizedOrgId || !tenantValue) {
            continue;
          }

          let subscription = await Subscription.findOne({ orgId: normalizedOrgId, tenantId: tenantValue });
          if (!subscription) {
            subscription = new Subscription({ orgId: normalizedOrgId, tenantId: tenantValue });
          }

          subscription.plan = cloneEducationalPlanDetails();
          subscription.limits = cloneEducationalPlanLimits();
          subscription.status = 'active';
          subscription.startDate = now;
          subscription.endDate = premiumExpiryDate;
          subscription.autoRenew = true;

          await subscription.save();
        }

        const schoolMemberRoles = ['school_admin', 'school_teacher', 'school_student'];
        let schoolMembers = [];
        if (organizationObjectId) {
          schoolMembers = await User.find({
            orgId: organizationObjectId,
            role: { $in: schoolMemberRoles },
          }).select('_id role name email');
        }

        const membersMap = new Map();
        adminUsers.forEach((adminUser) => {
          if (adminUser?._id) {
            membersMap.set(adminUser._id.toString(), adminUser);
          }
        });
        schoolMembers.forEach((member) => {
          if (member?._id) {
            membersMap.set(member._id.toString(), member);
          }
        });

        const membersList = Array.from(membersMap.values());
        if (membersList.length) {
          const memberAssignments = await Promise.all(
            membersList.map(async (member) => ({
              member,
              subscription: await assignUserSubscription({
                userId: member._id,
                planType: EDUCATIONAL_PLAN_TYPE,
                planName: EDUCATIONAL_PLAN_NAME,
                features: EDUCATIONAL_PLAN_FEATURES,
                amount: 0,
                startDate: now,
                endDate: premiumExpiryDate,
                metadata: {
                  orgId: organizationObjectId ? organizationObjectId.toString() : null,
                  tenantId: organizationTenantId || null,
                  source: 'school_approval',
                  role: member.role || null,
                },
                initiator: {
                  userId: req.user?._id || null,
                  role: req.user?.role || 'admin',
                  name: req.user?.name || 'Admin',
                  email: req.user?.email || null,
                  context: 'admin',
                },
              }),
            }))
          );

          if (io) {
            memberAssignments.forEach(({ member, subscription }) => {
              if (!subscription || !member?._id) return;
              const payload = subscription.toObject ? subscription.toObject() : subscription;
              io.to(member._id.toString()).emit('subscription:activated', {
                userId: member._id.toString(),
                subscription: payload,
              });
            });
          }
        }
      } else if (approvalStatus === 'rejected') {
        company.isActive = false;
        const rejection = (rejectionReason ?? approvalNotes ?? '').toString().trim();
        company.rejectionReason = rejection || company.rejectionReason || '';
        company.approvalNotes = (approvalNotes ?? rejectionReason ?? '').toString().trim() || company.approvalNotes || '';
        if (primaryOrganizationRecord) {
          primaryOrganizationRecord.isActive = false;
        }
        if (adminUsers.length) {
          adminUsers.forEach((adminUser) => {
            if (organizationObjectId && (!adminUser.orgId || adminUser.orgId.toString() !== organizationObjectId.toString())) {
              adminUser.orgId = organizationObjectId;
            }
            if (organizationTenantId && adminUser.tenantId !== organizationTenantId) {
              adminUser.tenantId = organizationTenantId;
            }
            adminUser.approvalStatus = 'rejected';
            adminUser.isVerified = false;
            adminUser.rejectedAt = now;
            adminUser.rejectionReason = rejection || adminUser.rejectionReason || '';
            adminUser.approvedAt = null;
          });
        }
      } else {
        company.isActive = false;
        company.approvedAt = null;
        if (primaryOrganizationRecord) {
          primaryOrganizationRecord.isActive = false;
        }
        if (adminUsers.length) {
          adminUsers.forEach((adminUser) => {
            if (organizationObjectId && (!adminUser.orgId || adminUser.orgId.toString() !== organizationObjectId.toString())) {
              adminUser.orgId = organizationObjectId;
            }
            if (organizationTenantId && adminUser.tenantId !== organizationTenantId) {
              adminUser.tenantId = organizationTenantId;
            }
            adminUser.approvalStatus = 'pending';
            adminUser.isVerified = false;
            adminUser.approvedAt = null;
            adminUser.rejectedAt = null;
          });
        }
      }
    } else {
      if (typeof approvalNotes === 'string') {
        company.approvalNotes = approvalNotes.trim();
      }
      if (typeof rejectionReason === 'string') {
        company.rejectionReason = rejectionReason.trim();
      }
    }

    const reviewNote = note?.toString()?.trim() || null;
    if (statusChanged || reviewNote) {
      company.reviewHistory = Array.isArray(company.reviewHistory) ? company.reviewHistory : [];
      company.reviewHistory.push({
        reviewer: req.user?._id || null,
        action: statusChanged
          ? approvalStatus === 'approved'
            ? 'approved'
            : approvalStatus === 'rejected'
              ? 'rejected'
              : 'commented'
          : 'commented',
        note: reviewNote || (statusChanged ? `Status updated to ${approvalStatus}` : 'School details updated by admin'),
        createdAt: now
      });
    }

    await company.save();

    if (primaryOrgDoc && organizationPayload && typeof organizationPayload === 'object') {
      if (primaryOrganizationRecord) {
        if (typeof organizationPayload.name === 'string' && organizationPayload.name.trim()) {
          primaryOrganizationRecord.name = organizationPayload.name.trim();
        }
        if (typeof organizationPayload.isActive === 'boolean') {
          primaryOrganizationRecord.isActive = organizationPayload.isActive;
        }
        if (typeof organizationPayload.maxUsers === 'number' && Number.isFinite(organizationPayload.maxUsers)) {
          primaryOrganizationRecord.maxUsers = organizationPayload.maxUsers;
        }
        if (organizationPayload.settings && typeof organizationPayload.settings === 'object') {
          primaryOrganizationRecord.settings = {
            ...(primaryOrganizationRecord.settings || {}),
            ...organizationPayload.settings,
            address: {
              ...(primaryOrganizationRecord.settings?.address || {}),
              ...(organizationPayload.settings.address || {}),
            },
            contactInfo: {
              ...(primaryOrganizationRecord.settings?.contactInfo || {}),
              ...(organizationPayload.settings.contactInfo || {}),
            },
          };
        }
        if (Array.isArray(organizationPayload.campuses)) {
          primaryOrganizationRecord.campuses = organizationPayload.campuses;
        }
      }
    }

    if (adminPayload && primaryAdminUser) {
      if (organizationObjectId && (!primaryAdminUser.orgId || primaryAdminUser.orgId.toString() !== organizationObjectId.toString())) {
        primaryAdminUser.orgId = organizationObjectId;
      }
      if (organizationTenantId && primaryAdminUser.tenantId !== organizationTenantId) {
        primaryAdminUser.tenantId = organizationTenantId;
      }
      if (typeof adminPayload.name === 'string' && adminPayload.name.trim()) {
        primaryAdminUser.name = adminPayload.name.trim();
      }
      if (typeof adminPayload.email === 'string' && adminPayload.email.trim()) {
        const normalizedAdminEmail = adminPayload.email.trim().toLowerCase();
        if (normalizedAdminEmail !== primaryAdminUser.email) {
          const conflict = await User.findOne({
            email: normalizedAdminEmail,
            _id: { $ne: primaryAdminUser._id },
          });
          if (conflict) {
            return res.status(409).json({
              success: false,
              message: 'Another user already uses this admin email address',
            });
          }
          primaryAdminUser.email = normalizedAdminEmail;
        }
      }
      if (typeof adminPayload.phone === 'string' && adminPayload.phone.trim()) {
        primaryAdminUser.phone = adminPayload.phone.trim();
      }
      if (adminPayload.contactInfo && typeof adminPayload.contactInfo === 'object') {
        primaryAdminUser.contactInfo = {
          ...(primaryAdminUser.contactInfo || {}),
          ...adminPayload.contactInfo,
        };
      }
      if (adminPayload.approvalStatus && allowableStatuses.includes(adminPayload.approvalStatus)) {
        primaryAdminUser.approvalStatus = adminPayload.approvalStatus;
      }
    }

    if (subscriptionPayload && primaryOrgDoc) {
      const subscriptionOrgId = orgId || primaryOrgDoc._id || primaryOrgDoc;
      const tenantId =
        primaryOrganizationRecord?.tenantId ||
        primaryOrgDoc.tenantId ||
        (primaryOrgDoc.toObject ? primaryOrgDoc.toObject().tenantId : null) ||
        company.organizations?.[0]?.tenantId ||
        null;

      if (tenantId) {
        const subscription =
          (await Subscription.findOne({ orgId: subscriptionOrgId, tenantId })) || new Subscription({ orgId: subscriptionOrgId, tenantId });

        if (subscriptionPayload.plan && typeof subscriptionPayload.plan === 'object') {
          subscription.plan = {
            ...(subscription.plan || {}),
            ...subscriptionPayload.plan,
            billingCycle: 'yearly'
          };
        } else if (subscription.plan) {
          subscription.plan.billingCycle = 'yearly';
        } else {
          subscription.plan = {
            billingCycle: 'yearly'
          };
        }
        if (subscriptionPayload.status) {
          subscription.status = subscriptionPayload.status;
        }
        if (subscriptionPayload.autoRenew !== undefined) {
          subscription.autoRenew = Boolean(subscriptionPayload.autoRenew);
        }
        if (subscriptionPayload.startDate) {
          subscription.startDate = new Date(subscriptionPayload.startDate);
        }
        if (subscriptionPayload.endDate) {
          subscription.endDate = new Date(subscriptionPayload.endDate);
        }
        if (typeof subscriptionPayload.renewalCount === 'number') {
          subscription.renewalCount = subscriptionPayload.renewalCount;
        }
        if (subscriptionPayload.limits && typeof subscriptionPayload.limits === 'object') {
          subscription.limits = {
            ...(subscription.limits || {}),
            ...subscriptionPayload.limits
          };
        }
        if (subscriptionPayload.usage && typeof subscriptionPayload.usage === 'object') {
          subscription.usage = {
            ...(subscription.usage || {}),
            ...subscriptionPayload.usage
          };
        }

        await subscription.save();
      }
    }

    if (organizationObjectId && organizationTenantId) {
      await Promise.all([
        SchoolClass.updateMany(
          { orgId: organizationObjectId, tenantId: { $ne: organizationTenantId } },
          { tenantId: organizationTenantId }
        ),
        SchoolStudent.updateMany(
          { orgId: organizationObjectId, tenantId: { $ne: organizationTenantId } },
          { tenantId: organizationTenantId }
        ),
      ]);
    }

    if (primaryOrganizationRecord) {
      await primaryOrganizationRecord.save();
    }

    if (adminUsers.length) {
      await Promise.all(adminUsers.map((adminUser) => adminUser.save()));
    }

    await company.populate([
      {
        path: 'organizations',
        select: 'name tenantId isActive campuses userCount maxUsers settings createdAt updatedAt'
      },
      { path: 'reviewHistory.reviewer', select: 'name email' },
      { path: 'approvedBy', select: 'name email' }
    ]);

    const [detail] = await hydrateSchoolData([company]);

    // Calculate analytics for the response
    let analytics = null;
    const tenantId = detail?.primaryOrganization?.tenantId;
    if (tenantId) {
      const [admissions, activeTeachers] = await Promise.all([
        SchoolStudent.aggregate([
          {
            $match: {
              tenantId,
              createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
            }
          },
          {
            $group: {
              _id: '$grade',
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ]),
        User.countDocuments({
          tenantId,
          role: 'school_teacher',
          lastActiveAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        })
      ]);

      analytics = {
        admissionsLast30: admissions.map((entry) => ({
          grade: entry._id || 'Unknown',
          count: entry.count
        })),
        activeTeachers7d: activeTeachers
      };
    }

    if (io) {
      await emitAdminSchoolUpdate(io, company);
    }

    res.json({
      success: true,
      message: 'School updated successfully',
      data: detail || null,
      analytics: analytics || null
    });
  } catch (error) {
    console.error('Error updating school:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
        error: error.errors
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update school',
      error: error.message
    });
  }
};

// Helper function to setup default classes for schools
async function setupSchoolDefaults(orgId, tenantId) {
  const SchoolClass = mongoose.model('SchoolClass');
  
  // Create classes 1-12
  for (let classNumber = 1; classNumber <= 12; classNumber++) {
    // For classes 11-12, create separate classes for each stream
    if (classNumber >= 11) {
      const streams = ["Science", "Commerce", "Arts"];
      
      for (const stream of streams) {
        await SchoolClass.create({
          tenantId,
          orgId,
          classNumber,
          stream,
          sections: [{ name: "A", capacity: 40 }],
          subjects: [
            { name: "English" },
            ...(stream === "Science" ? [
              { name: "Physics" },
              { name: "Chemistry" },
              { name: "Mathematics" },
              { name: "Biology" }
            ] : stream === "Commerce" ? [
              { name: "Accountancy" },
              { name: "Business Studies" },
              { name: "Economics" },
              { name: "Mathematics" }
            ] : [ // Arts
              { name: "History" },
              { name: "Geography" },
              { name: "Political Science" },
              { name: "Sociology" }
            ])
          ]
        });
      }
    } else {
      // For classes 1-10, create regular classes
      await SchoolClass.create({
        tenantId,
        orgId,
        classNumber,
        sections: [{ name: "A", capacity: 40 }],
        subjects: [
          { name: "English" },
          { name: "Mathematics" },
          { name: "Science" },
          { name: "Social Studies" },
          classNumber >= 6 ? { name: "Second Language" } : null
        ].filter(Boolean)
      });
    }
  }
}

// Get Company Organizations
export const getCompanyOrganizations = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const company = await Company.findById(decoded.id)
      .populate({
        path: 'organizations',
        select: 'name type tenantId isActive userCount maxUsers createdAt',
        match: { isActive: true }
      });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        subscriptionPlan: company.subscriptionPlan,
        subscriptionExpiry: company.subscriptionExpiry,
      },
      organizations: company.organizations,
    });
  } catch (error) {
    console.error("Get organizations error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Company Profile
export const updateCompanyProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { name, contactInfo } = req.body;
    
    const company = await Company.findByIdAndUpdate(
      decoded.id,
      { 
        ...(name && { name }),
        ...(contactInfo && { contactInfo })
      },
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({
      message: "Company profile updated successfully",
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        contactInfo: company.contactInfo,
      },
    });
  } catch (error) {
    console.error("Update company profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Clear test data (for development only)
export const clearTestData = async (req, res) => {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: "Not allowed in production" });
    }

    await Company.deleteMany({ type: 'school' });
    await Organization.deleteMany({ type: 'school' });
    await User.deleteMany({ role: 'school_admin' });

    res.json({ message: "Test data cleared successfully" });
  } catch (error) {
    console.error("Clear test data error:", error);
    res.status(500).json({ message: "Error clearing test data" });
  }
};
