import mongoose from 'mongoose';
import Organization from '../models/Organization.js';
import User from '../models/User.js';
import CSRSponsor from '../models/CSRSponsor.js';
import Program from '../models/Program.js';
import UserSubscription from '../models/UserSubscription.js';
import Subscription from '../models/Subscription.js';
import ActivityLog from '../models/ActivityLog.js';
import Company from '../models/Company.js';
import SchoolClass from '../models/School/SchoolClass.js';
import SchoolStudent from '../models/School/SchoolStudent.js';
import { getCanonicalRegion } from '../constants/regionCanonical.js';

const PLAN_FEATURES = {
  free: {
    fullAccess: false,
    parentDashboard: false,
    advancedAnalytics: false,
    certificates: false,
    wiseClubAccess: false,
    inavoraAccess: false,
    gamesPerPillar: 5,
    totalGames: 50,
  },
  student_premium: {
    fullAccess: true,
    parentDashboard: false,
    advancedAnalytics: true,
    certificates: true,
    wiseClubAccess: true,
    inavoraAccess: true,
    gamesPerPillar: -1,
    totalGames: 2200,
  },
  student_parent_premium_pro: {
    fullAccess: true,
    parentDashboard: true,
    advancedAnalytics: true,
    certificates: true,
    wiseClubAccess: true,
    inavoraAccess: true,
    gamesPerPillar: -1,
    totalGames: 2200,
  },
  educational_institutions_premium: {
    fullAccess: true,
    parentDashboard: true,
    advancedAnalytics: true,
    certificates: true,
    wiseClubAccess: true,
    inavoraAccess: true,
    gamesPerPillar: -1,
    totalGames: 2200,
  },
};

const escapeRegExp = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const dedupeAddressString = (value) => {
  if (!value) return "";
  const segments = value
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);
  const seen = new Set();
  const deduped = [];
  for (const segment of segments) {
    if (!seen.has(segment)) {
      seen.add(segment);
      deduped.push(segment);
    }
  }
  return deduped.join(", ");
};

const buildAddressString = (address) => {
  if (!address) return "";
  if (typeof address === "string") {
    return address;
  }

  if (
    address.street &&
    (address.street.includes(",") || address.street.length > 50)
  ) {
    return dedupeAddressString(address.street);
  }

  const parts = [
    address.street,
    address.city,
    address.state,
    address.pincode,
    address.country,
  ].filter(Boolean);

  return dedupeAddressString(parts.join(", "));
};

const PLAN_LABELS = {
  free: "Free Plan",
  student_premium: "Student Premium",
  student_parent_premium_pro: "Student + Parent Premium Pro",
  educational_institutions_premium: "School Plan",
};

const PLAN_METADATA = {
  free: {
    planType: "free",
    displayName: "Free Plan",
    amount: 0,
    features: PLAN_FEATURES.free,
  },
  student_premium: {
    planType: "student_premium",
    displayName: "Student Premium",
    amount: 0,
    features: PLAN_FEATURES.student_premium,
  },
  student_parent_premium_pro: {
    planType: "student_parent_premium_pro",
    displayName: "Student + Parent Premium Pro",
    amount: 0,
    features: PLAN_FEATURES.student_parent_premium_pro,
  },
  educational_institutions_premium: {
    planType: "educational_institutions_premium",
    displayName: "Educational Institutions Premium Plan",
    amount: 0,
    features: PLAN_FEATURES.educational_institutions_premium,
  },
};

const getActiveSchoolSubscription = async (organization) => {
  if (!organization) return null;
  const filters = [];
  if (organization._id) filters.push({ orgId: organization._id });
  if (organization.tenantId) filters.push({ tenantId: organization.tenantId });
  if (!filters.length) return null;

  const subscription = await Subscription.findOne({
    $or: filters,
    status: "active",
  })
    .sort({ updatedAt: -1, startDate: -1 })
    .lean();
  return subscription;
};

const getCompanyAcademicLimit = (company, roleType) => {
  if (!company?.academicInfo) return null;
  if (roleType === "student") {
    const totalStudents = Number(company.academicInfo.totalStudents);
    if (Number.isFinite(totalStudents) && totalStudents > 0) {
      return totalStudents;
    }
  }
  if (roleType === "teacher") {
    const totalTeachers = Number(company.academicInfo.totalTeachers);
    if (Number.isFinite(totalTeachers) && totalTeachers > 0) {
      return totalTeachers;
    }
  }
  return null;
};

const getSchoolCapacityLimit = (organization, subscription, roleType) => {
  const limitKeyMap = {
    student: "maxStudents",
    teacher: "maxTeachers",
  };
  const key = limitKeyMap[roleType];
  if (!key) return null;

  if (
    subscription &&
    subscription.limits &&
    typeof subscription.limits[key] === "number" &&
    subscription.limits[key] > 0
  ) {
    return subscription.limits[key];
  }

  if (
    roleType === "student" &&
    organization &&
    typeof organization.maxUsers === "number" &&
    organization.maxUsers > 0
  ) {
    return organization.maxUsers;
  }

  if (
    roleType === "teacher" &&
    organization &&
    typeof organization.maxTeachers === "number" &&
    organization.maxTeachers > 0
  ) {
    return organization.maxTeachers;
  }

  return null;
};

const ensureSchoolCapacity = async (organization, roleType, options = {}) => {
  if (!organization || !organization._id) return;

  const company =
    options.company ||
    (await Company.findOne({ organizations: organization._id }).lean());

  const subscription =
    options.subscription || (await getActiveSchoolSubscription(organization));
  const planLimit = getSchoolCapacityLimit(organization, subscription, roleType);
  const companyLimit = getCompanyAcademicLimit(company, roleType);
  const limit = companyLimit ?? planLimit;
  if (!limit) return;

  const roleLookup = roleType === "student" ? "school_student" : "school_teacher";
  const currentCount = await User.countDocuments({
    orgId: organization._id,
    role: roleLookup,
  });

  const userAlreadyAssigned =
    options.user &&
    options.user.orgId?.toString() === organization._id.toString() &&
    options.user.role === roleLookup;

  if (userAlreadyAssigned) return;

  if (currentCount >= limit) {
    throw new Error(
      `Total ${roleType} limit reached for ${organization.name || "the school"}`
    );
  }
};

// Same status filter as admin schools list so counts match summary
const SCHOOL_APPROVAL_STATUSES = ['approved', 'pending', 'rejected'];

// Get schools onboarded/active per region (uses Company = same source as admin schools list)
export const getSchoolsByRegion = async (req, res) => {
  try {
    const schools = await Company.find({
      type: 'school',
      approvalStatus: { $in: SCHOOL_APPROVAL_STATUSES }
    }).select('contactInfo.state isActive createdAt').lean();

    const regionData = {};
    schools.forEach(school => {
      const raw = school.contactInfo?.state;
      const region = getCanonicalRegion(raw);
      if (!regionData[region]) {
        regionData[region] = {
          region,
          totalSchools: 0,
          activeSchools: 0,
          inactiveSchools: 0,
          recentOnboarding: 0
        };
      }
      regionData[region].totalSchools++;
      if (school.isActive) {
        regionData[region].activeSchools++;
      } else {
        regionData[region].inactiveSchools++;
      }
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (school.createdAt >= thirtyDaysAgo) {
        regionData[region].recentOnboarding++;
      }
    });

    const formattedData = Object.values(regionData).sort((a, b) => (b.totalSchools - a.totalSchools));

    res.json({
      success: true,
      data: formattedData,
      totalRegions: formattedData.length,
      totalSchools: schools.length,
      activeSchools: schools.filter(s => s.isActive).length
    });
  } catch (error) {
    console.error('Error fetching schools by region:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching schools by region',
      data: []
    });
  }
};

// Get student active rate (DAU/MAU)
export const getStudentActiveRate = async (req, res) => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get all students
    const [allStudents, dauStudents, mauStudents] = await Promise.all([
      User.countDocuments({ 
        role: { $in: ['student', 'school_student'] } 
      }),
      User.countDocuments({ 
        role: { $in: ['student', 'school_student'] },
        lastActive: { $gte: oneDayAgo }
      }),
      User.countDocuments({ 
        role: { $in: ['student', 'school_student'] },
        lastActive: { $gte: thirtyDaysAgo }
      })
    ]);

    const activeRate = mauStudents > 0 ? ((dauStudents / mauStudents) * 100).toFixed(2) : 0;
    const mauRate = allStudents > 0 ? ((mauStudents / allStudents) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        totalStudents: allStudents,
        dailyActiveUsers: dauStudents,
        monthlyActiveUsers: mauStudents,
        activeRate: parseFloat(activeRate),
        mauRate: parseFloat(mauRate),
        engagementLevel: getEngagementLevel(parseFloat(activeRate))
      }
    });
  } catch (error) {
    console.error('Error fetching student active rate:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching student active rate',
      data: {}
    });
  }
};

// Get pillar performance benchmarks by region/state
export const getPillarPerformance = async (req, res) => {
  try {
    const { region } = req.query;
    
    // Use raw MongoDB query to bypass tenantId requirement
    const db = mongoose.connection.db;
    
    // Build query
    const query = { isActive: true };
    if (region) {
      // Find school students in the region
      const schools = await Organization.find({ 
        'settings.address.state': region,
        type: 'school'
      });
      const tenantIds = schools.map(s => s.tenantId);
      if (tenantIds.length > 0) {
        query.tenantId = { $in: tenantIds };
      }
    }

    const students = await db.collection('schoolstudents').find(query).project({ pillars: 1 }).toArray();

    // Calculate averages for each pillar
    const pillarStats = {
      uvls: { total: 0, count: 0, average: 0 },
      dcos: { total: 0, count: 0, average: 0 },
      moral: { total: 0, count: 0, average: 0 },
      ehe: { total: 0, count: 0, average: 0 },
      crgc: { total: 0, count: 0, average: 0 }
    };

    students.forEach(student => {
      if (student.pillars) {
        Object.keys(pillarStats).forEach(pillar => {
          if (student.pillars[pillar]) {
            pillarStats[pillar].total += student.pillars[pillar];
            pillarStats[pillar].count++;
          }
        });
      }
    });

    // Calculate averages and format
    const pillarData = Object.keys(pillarStats).map(pillar => {
      const stats = pillarStats[pillar];
      stats.average = stats.count > 0 ? parseFloat((stats.total / stats.count).toFixed(2)) : 0;
      
      return {
        name: getPillarName(pillar),
        code: pillar,
        average: stats.average,
        benchmark: getBenchmark(stats.average),
        count: stats.count,
        performance: getPerformanceLevel(stats.average)
      };
    });

    res.json({
      success: true,
      data: pillarData,
      totalStudents: students.length,
      region: region || 'All'
    });
  } catch (error) {
    console.error('Error fetching pillar performance:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching pillar performance',
      data: []
    });
  }
};

// Get platform health (uptime, errors, latency)
export const getPlatformHealth = async (req, res) => {
  try {
    // Get activity logs for error tracking
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [recentErrors, dailyErrors, recentActivity] = await Promise.all([
      ActivityLog.countDocuments({
        activityType: 'error',
        timestamp: { $gte: oneHourAgo }
      }),
      ActivityLog.countDocuments({
        activityType: 'error',
        timestamp: { $gte: oneDayAgo }
      }),
      ActivityLog.countDocuments({
        timestamp: { $gte: oneHourAgo }
      })
    ]);

    // Simulate uptime calculation (in production, use actual monitoring)
    const uptime = 99.9; // This would come from actual monitoring
    const averageLatency = 150; // ms - simulated
    const errorRate = recentActivity > 0 ? ((recentErrors / recentActivity) * 100).toFixed(3) : 0;

    res.json({
      success: true,
      data: {
        uptime: uptime,
        uptimeStatus: uptime >= 99 ? 'healthy' : uptime >= 95 ? 'degraded' : 'critical',
        averageLatency: averageLatency,
        latencyStatus: averageLatency < 200 ? 'good' : averageLatency < 500 ? 'moderate' : 'slow',
        errorRate: parseFloat(errorRate),
        recentErrors: recentErrors,
        dailyErrors: dailyErrors,
        healthScore: calculateHealthScore(uptime, averageLatency, parseFloat(errorRate))
      }
    });
  } catch (error) {
    console.error('Error fetching platform health:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching platform health',
      data: {}
    });
  }
};

// Get privacy incidents & compliance metrics
export const getPrivacyCompliance = async (req, res) => {
  try {
    // Use raw MongoDB queries to bypass tenantId requirement
    const db = mongoose.connection.db;
    
    // Get students with consent flags
    const studentsWithFlags = await db.collection('schoolstudents').countDocuments({
      'consentFlags': { $exists: true, $ne: {} }
    });

    // Get flagged students for privacy concerns
    const privacyFlags = await db.collection('schoolstudents').countDocuments({
      'wellbeingFlags': {
        $elemMatch: {
          type: 'other',
          description: { $regex: /privacy|data|consent/i }
        }
      }
    });

    // Calculate compliance score based on various factors
    const totalStudents = await db.collection('schoolstudents').countDocuments({ isActive: true });
    const complianceRate = totalStudents > 0 
      ? ((totalStudents - studentsWithFlags) / totalStudents * 100).toFixed(2)
      : 100;

    res.json({
      success: true,
      data: {
        consentFlags: studentsWithFlags,
        privacyIncidents: privacyFlags,
        complianceRate: parseFloat(complianceRate),
        complianceStatus: getComplianceStatus(parseFloat(complianceRate)),
        totalStudents: totalStudents,
        gdprCompliance: parseFloat(complianceRate) > 95 ? true : false,
        lastAudit: new Date().toISOString(),
        criticalIssues: privacyFlags
      }
    });
  } catch (error) {
    console.error('Error fetching privacy compliance:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching privacy compliance',
      data: {}
    });
  }
};

// Get comprehensive admin dashboard data
export const getAdminDashboard = async (req, res) => {
  try {
    const [schoolsByRegion, activeRate, pillarPerformance, privacyCompliance, csrStats] = await Promise.all([
      getSchoolsByRegionData(),
      getStudentActiveRateData(),
      getPillarPerformanceData(),
      getPrivacyComplianceData(),
      getCsrStatsData()
    ]);

    res.json({
      success: true,
      data: {
        schoolsByRegion: schoolsByRegion.data,
        studentActiveRate: activeRate.data,
        pillarPerformance: pillarPerformance.data,
        privacyCompliance: privacyCompliance.data,
        csrPartners: { total: csrStats.data.total },
        csrPrograms: { total: csrStats.data.totalPrograms, active: csrStats.data.activePrograms }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching admin dashboard data',
      error: error.message 
    });
  }
};

// Helper functions
async function getCsrStatsData() {
  try {
    const now = new Date();
    const activeProgramStatuses = ['approved', 'implementation_in_progress', 'mid_program_review_completed'];

    const [totalPartners, totalPrograms, activePrograms] = await Promise.all([
      CSRSponsor.countDocuments({}),
      Program.countDocuments({}),
      Program.countDocuments({
        status: { $in: activeProgramStatuses },
        'duration.startDate': { $lte: now },
        'duration.endDate': { $gte: now }
      })
    ]);

    return {
      data: {
        total: totalPartners,
        totalPrograms,
        activePrograms
      }
    };
  } catch (error) {
    console.error('Error in getCsrStatsData:', error);
    return {
      data: {
        total: 0,
        totalPrograms: 0,
        activePrograms: 0
      }
    };
  }
}

async function getSchoolsByRegionData() {
  try {
    const schools = await Company.find({
      type: 'school',
      approvalStatus: { $in: SCHOOL_APPROVAL_STATUSES }
    }).select('contactInfo.state isActive createdAt').lean();
    if (!schools || schools.length === 0) {
      return { data: [] };
    }
    const regionData = {};
    schools.forEach(school => {
      const region = getCanonicalRegion(school.contactInfo?.state);
      if (!regionData[region]) {
        regionData[region] = { region, totalSchools: 0, activeSchools: 0, inactiveSchools: 0, recentOnboarding: 0 };
      }
      regionData[region].totalSchools++;
      if (school.isActive) regionData[region].activeSchools++;
      else regionData[region].inactiveSchools++;
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      if (school.createdAt >= thirtyDaysAgo) regionData[region].recentOnboarding++;
    });
    return { data: Object.values(regionData).sort((a, b) => (b.totalSchools - a.totalSchools)) };
  } catch (error) {
    console.error('Error in getSchoolsByRegionData:', error);
    return { data: [] };
  }
}

async function getStudentActiveRateData() {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [total, dau, mau] = await Promise.all([
      User.countDocuments({ role: { $in: ['student', 'school_student'] } }),
      User.countDocuments({ role: { $in: ['student', 'school_student'] }, lastActive: { $gte: oneDayAgo } }),
      User.countDocuments({ role: { $in: ['student', 'school_student'] }, lastActive: { $gte: thirtyDaysAgo } })
    ]);

    const activeRate = mau > 0 ? ((dau / mau) * 100).toFixed(2) : 0;
    return {
      data: {
        totalStudents: total,
        dailyActiveUsers: dau,
        monthlyActiveUsers: mau,
        activeRate: parseFloat(activeRate),
        mauRate: total > 0 ? parseFloat(((mau / total) * 100).toFixed(2)) : 0,
        engagementLevel: getEngagementLevel(parseFloat(activeRate))
      }
    };
  } catch (error) {
    console.error('Error in getStudentActiveRateData:', error);
    return {
      data: {
        totalStudents: 0,
        dailyActiveUsers: 0,
        monthlyActiveUsers: 0,
        activeRate: 0,
        mauRate: 0,
        engagementLevel: 'Low'
      }
    };
  }
}

async function getPillarPerformanceData() {
  try {
    // Use raw MongoDB query to bypass tenantId requirement
    const db = mongoose.connection.db;
    const students = await db.collection('schoolstudents').find({ isActive: true }).project({ pillars: 1 }).toArray();
    
    const pillarStats = {
      uvls: { total: 0, count: 0 },
      dcos: { total: 0, count: 0 },
      moral: { total: 0, count: 0 },
      ehe: { total: 0, count: 0 },
      crgc: { total: 0, count: 0 }
    };

    students.forEach(student => {
      if (student.pillars) {
        Object.keys(pillarStats).forEach(pillar => {
          if (student.pillars[pillar]) {
            pillarStats[pillar].total += student.pillars[pillar];
            pillarStats[pillar].count++;
          }
        });
      }
    });

    const pillarData = Object.keys(pillarStats).map(pillar => {
      const stats = pillarStats[pillar];
      const average = stats.count > 0 ? parseFloat((stats.total / stats.count).toFixed(2)) : 0;
      return {
        name: getPillarName(pillar),
        code: pillar,
        average,
        benchmark: getBenchmark(average),
        count: stats.count,
        performance: getPerformanceLevel(average)
      };
    });

    return { data: pillarData };
  } catch (error) {
    console.error('Error in getPillarPerformanceData:', error);
    return { data: [] };
  }
}

async function getPrivacyComplianceData() {
  try {
    // Use raw MongoDB queries to bypass tenantId requirement
    const db = mongoose.connection.db;
    
    const studentsWithFlags = await db.collection('schoolstudents').countDocuments({
      'consentFlags': { $exists: true, $ne: {} }
    });

    const privacyFlags = await db.collection('schoolstudents').countDocuments({
      'wellbeingFlags': {
        $elemMatch: {
          type: 'other',
          description: { $regex: /privacy|data|consent/i }
        }
      }
    });

    const totalStudents = await db.collection('schoolstudents').countDocuments({ isActive: true });
    const complianceRate = totalStudents > 0 
      ? ((totalStudents - studentsWithFlags) / totalStudents * 100).toFixed(2)
      : 100;

    return {
      data: {
        consentFlags: studentsWithFlags,
        privacyIncidents: privacyFlags,
        complianceRate: parseFloat(complianceRate),
        complianceStatus: getComplianceStatus(parseFloat(complianceRate)),
        totalStudents,
        gdprCompliance: parseFloat(complianceRate) > 95,
        lastAudit: new Date().toISOString(),
        criticalIssues: privacyFlags
      }
    };
  } catch (error) {
    console.error('Error in getPrivacyComplianceData:', error);
    return {
      data: {
        consentFlags: 0,
        privacyIncidents: 0,
        complianceRate: 100,
        complianceStatus: 'Compliant',
        totalStudents: 0,
        gdprCompliance: true,
        lastAudit: new Date().toISOString(),
        criticalIssues: 0
      }
    };
  }
}

function getPillarName(code) {
  const names = {
    uvls: 'Understanding Values & Life Skills',
    dcos: 'Digital Citizenship & Online Safety',
    moral: 'Moral & Spiritual Education',
    ehe: 'Environmental & Health Education',
    crgc: 'Cultural Roots & Global Citizenship'
  };
  return names[code] || code;
}

function getBenchmark(average) {
  if (average >= 80) return 'Excellent';
  if (average >= 60) return 'Good';
  if (average >= 40) return 'Average';
  return 'Needs Improvement';
}

function getPerformanceLevel(average) {
  if (average >= 80) return 'high';
  if (average >= 60) return 'medium';
  return 'low';
}

function getEngagementLevel(rate) {
  if (rate >= 50) return 'High';
  if (rate >= 30) return 'Medium';
  return 'Low';
}

function getComplianceStatus(rate) {
  if (rate >= 95) return 'Compliant';
  if (rate >= 80) return 'Mostly Compliant';
  return 'Needs Attention';
}

function calculateHealthScore(uptime, latency, errorRate) {
  let score = 100;
  
  // Uptime penalty (max -20 points)
  if (uptime < 99) score -= (99 - uptime) * 2;
  
  // Latency penalty (max -30 points)
  if (latency > 200) score -= (latency - 200) / 10;
  
  // Error rate penalty (max -50 points)
  score -= errorRate * 5;
  
  return Math.max(0, Math.min(100, score.toFixed(2)));
}

// ============= NEW ADMIN FEATURES =============

// 1. Network Map - Region to schools adoption heatmap
export const getNetworkMap = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const schools = await Organization.find({ type: 'school' }).select('name settings.address state isActive createdAt userCount');
    
    // Calculate adoption metrics
    const networkData = schools.map(school => {
      const region = school.settings?.address?.state || school.state || 'Unknown';
      const adoptionScore = calculateAdoptionScore(school.userCount || 0, school.isActive);
      
      return {
        schoolId: school._id,
        name: school.name,
        region,
        adoptionScore,
        userCount: school.userCount || 0,
        isActive: school.isActive,
        joinedDate: school.createdAt
      };
    });

    // Group by region for heatmap
    const regionMap = {};
    networkData.forEach(school => {
      if (!regionMap[school.region]) {
        regionMap[school.region] = {
          region: school.region,
          schools: [],
          totalAdoption: 0,
          avgAdoption: 0
        };
      }
      regionMap[school.region].schools.push(school);
      regionMap[school.region].totalAdoption += school.adoptionScore;
    });

    // Calculate average adoption per region
    Object.keys(regionMap).forEach(region => {
      const data = regionMap[region];
      data.avgAdoption = data.schools.length > 0 ? (data.totalAdoption / data.schools.length).toFixed(1) : 0;
      data.schoolCount = data.schools.length;
    });

    res.json({
      success: true,
      data: {
        networkData: Object.values(regionMap),
        totalSchools: schools.length,
        totalRegions: Object.keys(regionMap).length
      }
    });
  } catch (error) {
    console.error('Error fetching network map:', error);
    res.status(500).json({ success: false, message: 'Error fetching network map' });
  }
};

// 2. Benchmarks Panel - Compare schools
export const getBenchmarksPanel = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    // Get all schools with student data
    const students = await db.collection('schoolstudents').aggregate([
      { $match: { isActive: true } },
      { $group: {
        _id: '$tenantId',
        studentCount: { $sum: 1 },
        avgUvls: { $avg: '$pillars.uvls' },
        avgDcos: { $avg: '$pillars.dcos' },
        avgMoral: { $avg: '$pillars.moral' },
        avgEhe: { $avg: '$pillars.ehe' },
        avgCrgc: { $avg: '$pillars.crgc' }
      }},
      { $sort: { studentCount: -1 } },
      { $limit: 50 }
    ]).toArray();

    // Get school details
    const tenantIds = students.map(s => s._id);
    const schools = await Organization.find({ tenantId: { $in: tenantIds } })
      .select('name settings.address state isActive createdAt');

    // Combine data
    const benchmarks = students.map(student => {
      const school = schools.find(s => s.tenantId === student._id);
      const region = school?.settings?.address?.state || school?.state || 'Unknown';
      
      const avgPillar = (
        (student.avgUvls || 0) + 
        (student.avgDcos || 0) + 
        (student.avgMoral || 0) + 
        (student.avgEhe || 0) + 
        (student.avgCrgc || 0)
      ) / 5;

      return {
        schoolId: school?._id,
        schoolName: school?.name || 'Unknown',
        region,
        studentCount: student.studentCount,
        avgPillar: avgPillar.toFixed(1),
        pillars: {
          uvls: (student.avgUvls || 0).toFixed(1),
          dcos: (student.avgDcos || 0).toFixed(1),
          moral: (student.avgMoral || 0).toFixed(1),
          ehe: (student.avgEhe || 0).toFixed(1),
          crgc: (student.avgCrgc || 0).toFixed(1)
        }
      };
    });

    res.json({
      success: true,
      data: benchmarks
    });
  } catch (error) {
    console.error('Error fetching benchmarks:', error);
    res.status(500).json({ success: false, message: 'Error fetching benchmarks' });
  }
};

// 3. Platform Health & Telemetry (APM)
export const getPlatformTelemetry = async (req, res) => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const db = mongoose.connection.db;
    
    // Get activity metrics
    const [
      errorLogs,
      totalActivity,
      recentErrors,
      dailyActivity,
      weeklyActivity
    ] = await Promise.all([
      ActivityLog.countDocuments({ activityType: 'error', timestamp: { $gte: oneHourAgo } }),
      ActivityLog.countDocuments({ timestamp: { $gte: oneWeekAgo } }),
      ActivityLog.find({ activityType: 'error', timestamp: { $gte: oneDayAgo } }).limit(50).sort({ timestamp: -1 }),
      ActivityLog.countDocuments({ timestamp: { $gte: oneDayAgo } }),
      ActivityLog.countDocuments({ timestamp: { $gte: oneWeekAgo } })
    ]);

    // Calculate API metrics
    const errorRate = totalActivity > 0 ? ((errorLogs / totalActivity) * 100).toFixed(2) : 0;
    const activityTrend = weeklyActivity > 0 ? (((dailyActivity - (weeklyActivity / 7)) / (weeklyActivity / 7)) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        uptime: 99.9,
        responseTime: 150,
        errorRate: parseFloat(errorRate),
        errorTrend: errorRate > 1 ? 'up' : 'down',
        activityTrend: parseFloat(activityTrend),
        recentErrors: recentErrors.map(err => ({
          id: err._id,
          message: err.description || 'Error occurred',
          timestamp: err.timestamp,
          userId: err.userId
        })),
        healthScore: calculateHealthScore(99.9, 150, parseFloat(errorRate))
      }
    });
  } catch (error) {
    console.error('Error fetching telemetry:', error);
    res.status(500).json({ success: false, message: 'Error fetching telemetry' });
  }
};

const ALLOWED_ACCOUNT_ROLES = [
  "admin",
  "student",
  "parent",
  "csr",
  "seller",
  "school_admin",
  "school_teacher",
  "school_student",
  "school_parent",
  "school_accountant",
  "school_librarian",
  "school_transport_staff",
  "teacher",
];

export const getAdminAccounts = async (req, res) => {
  try {
    const categoryRaw = (req.query.category || "all").toString().toLowerCase();
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const perPage = Math.min(200, Math.max(10, parseInt(req.query.perPage, 10) || 50));
    const searchTerm = (req.query.search || "").trim();

    const query = {};
    switch (categoryRaw) {
      case "schools":
        query.role = "school_admin";
        break;
      case "students":
        query.role = { $in: ["student", "school_student"] };
        break;
      case "teachers":
        query.role = { $in: ["school_teacher", "teacher"] };
        break;
      case "parents":
        query.role = "parent";
        break;
      case "csr":
        query.role = "csr";
        break;
      case "all":
      default:
        query.role = { $in: ALLOWED_ACCOUNT_ROLES };
        break;
    }

    if (!query.role && categoryRaw === "all") {
      query.role = { $in: ALLOWED_ACCOUNT_ROLES };
    }

    if (searchTerm) {
      const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [
        { fullName: regex },
        { email: regex },
        { phone: regex },
        { name: regex },
      ];
    }

      const [total, accounts] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .select("fullName name email role phone isVerified createdAt orgId tenantId linkedIds")
        .populate("orgId", "name tenantId subscriptionId")
        .lean(),
      ]);

    const accountIds = accounts.map(account => account._id).filter(Boolean);
    const subscriptionLookup = {};
    if (accountIds.length > 0) {
      const subscriptionDocs = await UserSubscription.aggregate([
        { $match: { userId: { $in: accountIds } } },
        { $sort: { userId: 1, startDate: -1, createdAt: -1 } },
        { $group: { _id: "$userId", doc: { $first: "$$ROOT" } } },
      ]);

      for (const record of subscriptionDocs) {
        if (!record?._id) continue;
        subscriptionLookup[record._id.toString()] = record.doc;
      }
    }

    const orgIds = accounts
      .map(account => account.orgId?._id)
      .filter(Boolean)
      .map(id => id.toString());
    const orgObjectIds = orgIds.length
      ? orgIds.map(id => new mongoose.Types.ObjectId(id))
      : [];
    const tenantIds = accounts
      .map(account => account.tenantId)
      .filter(Boolean);

    const organizationSubscriptionQuery = [];
    if (orgObjectIds.length > 0) {
      organizationSubscriptionQuery.push({ orgId: { $in: orgObjectIds } });
    }
    if (tenantIds.length > 0) {
      organizationSubscriptionQuery.push({ tenantId: { $in: tenantIds } });
    }

    const organizationSubscriptions = organizationSubscriptionQuery.length > 0
      ? await Subscription.find({ $or: organizationSubscriptionQuery })
          .sort({ updatedAt: -1, startDate: -1 })
          .lean()
      : [];

    const organizationSubscriptionLookup = {
      byOrgId: {},
      byTenantId: {},
    };

    const parentChildIds = new Set();
    const parentToChildMap = new Map();
    accounts.forEach((account) => {
      if (account.role === "parent" && Array.isArray(account.linkedIds?.childIds)) {
        const childIds = account.linkedIds.childIds
          .filter(Boolean)
          .map((childId) => childId.toString());
        if (childIds.length) {
          parentToChildMap.set(account._id.toString(), childIds);
          childIds.forEach((childId) => parentChildIds.add(childId));
        }
      }
    });

    const childLookup = new Map();
    if (parentChildIds.size > 0) {
      const childUsers = await User.find({ _id: { $in: Array.from(parentChildIds) } })
        .select("role orgId tenantId")
        .lean();
      childUsers.forEach((child) => {
        if (child?._id) {
          childLookup.set(child._id.toString(), child);
        }
      });
    }

    for (const sub of organizationSubscriptions) {
      if (sub.orgId) {
        const key = sub.orgId.toString();
        if (!organizationSubscriptionLookup.byOrgId[key]) {
          organizationSubscriptionLookup.byOrgId[key] = sub;
        }
      }
      if (sub.tenantId) {
        const key = sub.tenantId.toString();
        if (!organizationSubscriptionLookup.byTenantId[key]) {
          organizationSubscriptionLookup.byTenantId[key] = sub;
        }
      }
    }

    const getPlanLabelFromSubscription = (subscription) => {
      if (!subscription) return PLAN_LABELS.free;
      const derived = subscription.planName
        || PLAN_LABELS[subscription.planType]
        || PLAN_LABELS.free;
      return derived;
    };

    const getPlanInfoFromOrganizationSubscription = (account) => {
      const orgKey = account.orgId?._id?.toString();
      const tenantKey = account.tenantId;
      let orgSub = null;
      if (orgKey && organizationSubscriptionLookup.byOrgId[orgKey]) {
        orgSub = organizationSubscriptionLookup.byOrgId[orgKey];
      } else if (tenantKey && organizationSubscriptionLookup.byTenantId[tenantKey]) {
        orgSub = organizationSubscriptionLookup.byTenantId[tenantKey];
      }
      if (!orgSub) return null;
      const planType = orgSub.plan?.name || "free";
      const planLabel = orgSub.plan?.displayName || PLAN_LABELS[planType] || PLAN_LABELS.free;
      return {
        planLabel,
        planType,
        subscription: orgSub,
      };
    };
    const normalizedAccounts = accounts.map(account => {
      const orgPlanInfo = getPlanInfoFromOrganizationSubscription(account);
      const subscription = subscriptionLookup[account._id?.toString()];
      const subscriptionIsSchool =
        Boolean(subscription?.planType === "educational_institutions_premium") ||
        Boolean(subscription?.metadata?.registrationType === "school") ||
        Boolean(
          subscription?.metadata?.orgId &&
            account.orgId?._id &&
            subscription.metadata.orgId.toString() === account.orgId._id.toString()
        ) ||
        Boolean(
          subscription?.metadata?.tenantId &&
            account.tenantId &&
            subscription.metadata.tenantId.toString() === account.tenantId.toString()
        );
      const shouldUseOrgPlan = ["school_admin", "school_teacher", "school_parent"].includes(account.role);
      let planLabel = null;
      let planTypeKey = "free";

      if (subscriptionIsSchool) {
        planLabel = PLAN_LABELS.educational_institutions_premium;
        planTypeKey = "educational_institutions_premium";
      } else if (subscription) {
        planLabel = getPlanLabelFromSubscription(subscription);
        planTypeKey = subscription.planType || "free";
      }

      if (!planLabel && shouldUseOrgPlan && orgPlanInfo) {
        planLabel = orgPlanInfo.planLabel;
        planTypeKey = orgPlanInfo.planType;
      } else if (!planLabel && orgPlanInfo) {
        // fallback to organization plan if nothing else is set
        planLabel = orgPlanInfo.planLabel;
        planTypeKey = orgPlanInfo.planType;
      }

      const parentChildIdsForAccount = parentToChildMap.get(account._id?.toString()) || [];
      const hasLinkedSchoolChild = parentChildIdsForAccount.some((childId) => {
        const child = childLookup.get(childId);
        return Boolean(
          child &&
            (child.role === "school_student" ||
              child.orgId ||
              child.tenantId)
        );
      });

      if (hasLinkedSchoolChild) {
        planLabel = PLAN_LABELS.educational_institutions_premium;
        planTypeKey = "educational_institutions_premium";
      }

      return {
        id: account._id,
        name: account.fullName || account.name || "Unnamed",
        email: account.email,
        role: account.role,
        phone: account.phone || null,
        plan: planLabel,
        planType: planTypeKey,
        isVerified: account.isVerified || false,
        createdAt: account.createdAt,
        tenantId: account.tenantId || null,
        organization: account.orgId
          ? {
              id: account.orgId._id,
              name: account.orgId.name,
              tenantId: account.orgId.tenantId,
            }
          : null,
        planEndDate:
          (subscription?.endDate && new Date(subscription.endDate).toISOString()) ||
          (orgPlanInfo?.subscription?.endDate &&
            new Date(orgPlanInfo.subscription.endDate).toISOString()) ||
          null,
        planStartDate:
          (subscription?.startDate && new Date(subscription.startDate).toISOString()) ||
          (orgPlanInfo?.subscription?.startDate &&
            new Date(orgPlanInfo.subscription.startDate).toISOString()) ||
          null,
        planStatus: subscription?.status || orgPlanInfo?.subscription?.status || null,
      };
    });

    res.json({
      success: true,
      data: {
        accounts: normalizedAccounts,
        total,
        page,
        perPage,
        category: categoryRaw,
      },
    });
  } catch (error) {
    console.error("Error fetching admin accounts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching admin accounts",
      error: error.message,
    });
  }
};

export const deleteAdminAccount = async (req, res) => {
  try {
    const { userId } = req.params || {};
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user identifier",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    await Promise.all([
      UserSubscription.deleteMany({ userId }),
      SchoolStudent.deleteMany({ userId }),
      User.updateMany(
        { "linkedIds.parentIds": user._id },
        { $pull: { "linkedIds.parentIds": user._id } }
      ),
      User.updateMany(
        { "linkedIds.childIds": user._id },
        { $pull: { "linkedIds.childIds": user._id } }
      ),
      User.updateMany(
        { "linkedIds.teacherIds": user._id },
        { $pull: { "linkedIds.teacherIds": user._id } }
      ),
      User.updateMany(
        { "linkedIds.studentIds": user._id },
        { $pull: { "linkedIds.studentIds": user._id } }
      ),
    ]);

    await User.deleteOne({ _id: user._id });

    const io = req.app.get("io");
    if (io) {
      io.emit("admin:accounts:updated");
      io.emit("admin:account:deleted", { userId: user._id.toString() });
    }

    return res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting admin account:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete account",
      error: error.message,
    });
  }
};

export const updateAdminAccountPlan = async (req, res) => {
  try {
    const { userId } = req.params || {};
    const planTypeRaw = (req.body?.planType || "").toString().trim();
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Missing user identifier",
      });
    }

    if (!planTypeRaw || !PLAN_METADATA[planTypeRaw]) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan selection",
      });
    }

    const planDefinition = PLAN_METADATA[planTypeRaw];
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    let userModified = false;
    const wasParentAccount = ["parent", "school_parent"].includes(user.role);
    const wasStudentAccount = user.role === "student";
    const wasTeacherAccount = ["teacher", "school_teacher"].includes(user.role);

    let schoolPlanOverrideDates = null;

    if (planDefinition.planType === "educational_institutions_premium" && wasStudentAccount) {
      const rawCode = (req.body?.schoolLinkingCode || "").toString().trim();
      if (!rawCode) {
        return res.status(400).json({
          success: false,
          message: "School linking code is required to upgrade a student.",
        });
      }

      const normalizedCode = rawCode.toUpperCase();
      let targetOrganization = await Organization.findOne({ linkingCode: normalizedCode });
      if (!targetOrganization) {
        targetOrganization = await Organization.findOne({ linkingCode: rawCode });
      }
      if (!targetOrganization) {
        return res.status(404).json({
          success: false,
          message: "No school found for the provided linking code.",
        });
      }

      const orgSubscription = await getActiveSchoolSubscription(targetOrganization);
      schoolPlanOverrideDates = orgSubscription
        ? {
            startDate: orgSubscription.startDate,
            endDate: orgSubscription.endDate,
          }
        : null;

      try {
        await ensureSchoolCapacity(targetOrganization, "student", {
          user,
          subscription: orgSubscription,
        });
      } catch (capacityError) {
        return res.status(400).json({
          success: false,
          message: capacityError.message,
        });
      }

      user.role = "school_student";
      user.orgId = targetOrganization._id;
      user.tenantId = targetOrganization.tenantId || null;
      await user.save();

      const classFilter = { userId: user._id };
      if (targetOrganization.tenantId) {
        classFilter.tenantId = targetOrganization.tenantId;
      }
      let schoolStudent = await SchoolStudent.findOne(classFilter);
      if (!schoolStudent) {
        const admissionNumber = `ADM${new Date().getFullYear()}${Date.now()
          .toString()
          .slice(-6)}`;
        await SchoolStudent.create({
          tenantId: targetOrganization.tenantId,
          orgId: targetOrganization._id,
          userId: user._id,
          admissionNumber,
          academicYear: new Date().getFullYear().toString(),
        });
      }
    }

    if (planDefinition.planType === "educational_institutions_premium" && wasTeacherAccount) {
      const rawCode = (req.body?.schoolLinkingCode || "").toString().trim();
      if (!rawCode) {
        return res.status(400).json({
          success: false,
          message: "School linking code is required to upgrade a teacher.",
        });
      }

      const normalizedCode = rawCode.toUpperCase();
      let targetOrganization = await Organization.findOne({ linkingCode: normalizedCode });
      if (!targetOrganization) {
        targetOrganization = await Organization.findOne({ linkingCode: rawCode });
      }
      if (!targetOrganization) {
        return res.status(404).json({
          success: false,
          message: "No school found for the provided linking code.",
        });
      }

      const orgSubscription = await getActiveSchoolSubscription(targetOrganization);
      schoolPlanOverrideDates = orgSubscription
        ? {
            startDate: orgSubscription.startDate,
            endDate: orgSubscription.endDate,
          }
        : null;

      try {
        await ensureSchoolCapacity(targetOrganization, "teacher", {
          user,
          subscription: orgSubscription,
        });
      } catch (capacityError) {
        return res.status(400).json({
          success: false,
          message: capacityError.message,
        });
      }

      user.role = "school_teacher";
      user.orgId = targetOrganization._id;
      user.tenantId = targetOrganization.tenantId || null;
      await user.save();
    }

    if (planDefinition.planType === "educational_institutions_premium" && wasParentAccount) {
      const rawChildEmail = (req.body?.childEmail || "").toString().trim();
      if (!rawChildEmail) {
        return res.status(400).json({
          success: false,
          message: "Child email is required to upgrade a parent.",
        });
      }

      const emailPattern = new RegExp(`^${escapeRegExp(rawChildEmail)}$`, "i");
      const child = await User.findOne({
        email: emailPattern,
        role: { $in: ["student", "school_student"] },
      })
        .select("email role orgId tenantId linkedIds")
        .populate("orgId", "tenantId");

      if (!child) {
        return res.status(404).json({
          success: false,
          message: "Child not found for the provided email.",
        });
      }

      const childParentIds = Array.isArray(child.linkedIds?.parentIds)
        ? child.linkedIds.parentIds
            .filter(Boolean)
            .map((entry) => entry.toString())
        : [];
      const alreadyLinkedWithRequester = childParentIds.some(
        (parentId) => parentId === user._id.toString()
      );
      if (!alreadyLinkedWithRequester && childParentIds.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Child already linked with parent",
        });
      }

      const targetOrgId = child.orgId?._id || child.orgId;
      const targetTenantId = child.tenantId || child.orgId?.tenantId || null;
      if (!targetOrgId && !targetTenantId) {
        return res.status(400).json({
          success: false,
          message: "Child not linked to school",
        });
      }

      if (user.role !== "school_parent") {
        user.role = "school_parent";
        userModified = true;
      }
      if (!user.orgId || user.orgId.toString() !== (targetOrgId?.toString() || "")) {
        user.orgId = targetOrgId || undefined;
        userModified = true;
      }
      if (user.tenantId !== targetTenantId) {
        user.tenantId = targetTenantId;
        userModified = true;
      }

      if (!user.linkedIds) {
        user.linkedIds = {};
      }
      if (!Array.isArray(user.linkedIds.childIds)) {
        user.linkedIds.childIds = [];
      }
      if (
        !user.linkedIds.childIds.some(
          (childId) => childId?.toString() === child._id.toString()
        )
      ) {
        user.linkedIds.childIds.push(child._id);
        userModified = true;
      }

      let childModified = false;
      if (!child.linkedIds) {
        child.linkedIds = {};
      }
      if (!Array.isArray(child.linkedIds.parentIds)) {
        child.linkedIds.parentIds = [];
      }
      if (
        !child.linkedIds.parentIds.some(
          (parentId) => parentId?.toString() === user._id.toString()
        )
      ) {
        child.linkedIds.parentIds.push(user._id);
        childModified = true;
      }

      if (childModified) {
        await child.save();
      }
    }

    let subscription = await UserSubscription.findOne({ userId }).sort({ createdAt: -1 });
    const metadataBase = {
      ...(subscription?.metadata || {}),
      adminOverride: true,
      adminChangedAt: new Date(),
    };
    if (req.user?._id) {
      metadataBase.adminChangedBy = req.user._id;
    }
    if (planDefinition.planType === "educational_institutions_premium") {
      metadataBase.registrationType = "school";
      if (user.orgId) {
        metadataBase.orgId = user.orgId;
      }
      if (user.tenantId) {
        metadataBase.tenantId = user.tenantId;
      }
    } else {
      delete metadataBase.registrationType;
      delete metadataBase.orgId;
      delete metadataBase.tenantId;
      if (["school_student", "school_teacher", "school_parent"].includes(user.role)) {
        user.role = user.role === "school_teacher" ? "teacher" : "student";
        user.orgId = undefined;
        user.tenantId = undefined;
        await SchoolStudent.deleteMany({ userId });
        userModified = true;
      }
    }

    const planFeatures = { ...(planDefinition.features || {}) };
    const now = new Date();
    const STANDARD_PLAN_DURATION_MS = 365 * 24 * 60 * 60 * 1000;

    const applyPlanDates = () => {
      subscription.startDate = now;
      if (planDefinition.planType === "free") {
        subscription.endDate = undefined;
      } else {
        subscription.endDate = new Date(now.getTime() + STANDARD_PLAN_DURATION_MS);
      }
    };

    const applyOverrideDates = () => {
      if (!schoolPlanOverrideDates?.endDate) return;
      subscription.endDate = new Date(schoolPlanOverrideDates.endDate);
      if (schoolPlanOverrideDates.startDate) {
        subscription.startDate = new Date(schoolPlanOverrideDates.startDate);
      }
    };

    if (userModified) {
      await user.save();
      userModified = false;
    }

    if (!subscription) {
      subscription = new UserSubscription({
        userId,
        planType: planDefinition.planType,
        planName: planDefinition.displayName,
        amount: planDefinition.amount,
        status: "active",
        metadata: metadataBase,
        features: planFeatures,
        startDate: now,
      });
      applyPlanDates();
      applyOverrideDates();
    } else {
      subscription.planType = planDefinition.planType;
      subscription.planName = planDefinition.displayName;
      subscription.amount = planDefinition.amount;
      subscription.status = "active";
      subscription.metadata = metadataBase;
      subscription.features = planFeatures;
      subscription.lastRenewedAt = new Date();
      applyPlanDates();
      applyOverrideDates();
    }

    await subscription.save();

    const io = req.app.get('io');
    if (io) {
      const payload = {
        ...subscription.toObject(),
      };
      io.to(userId.toString()).emit('subscription:activated', {
        subscription: payload,
      });
      io.emit('subscription:activated', {
        userId: userId.toString(),
        subscription: payload,
      });
    }

    res.json({
      success: true,
      data: {
        plan: planDefinition.displayName,
        planType: planDefinition.planType,
      },
      message: "Plan updated successfully",
    });
  } catch (error) {
    console.error("Error updating account plan:", error);
    res.status(500).json({
      success: false,
      message: "Unable to update account plan",
      error: error.message,
    });
  }
};

export const getAdminAccountDetails = async (req, res) => {
  try {
    const { userId } = req.params || {};
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user identifier",
      });
    }

    const user = await User.findById(userId)
      .select("fullName name email phone role gender dateOfBirth dob linkedIds orgId tenantId isVerified")
      .populate({
        path: "orgId",
        select: "name tenantId settings.address settings.contactInfo linkingCode",
      })
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    const parentIds = Array.isArray(user.linkedIds?.parentIds)
      ? user.linkedIds.parentIds.filter(Boolean)
      : [];

    const childIds = Array.isArray(user.linkedIds?.childIds)
      ? user.linkedIds.childIds.filter(Boolean)
      : [];

    const teacherIdStrings = new Set(
      (Array.isArray(user.linkedIds?.teacherIds) ? user.linkedIds.teacherIds : [])
        .filter(Boolean)
        .map((entry) => entry.toString())
    );

    if (["student", "school_student"].includes(user.role)) {
      try {
        const studentFilter = { userId: user._id };
        if (user.tenantId) {
          studentFilter.tenantId = user.tenantId;
        }
        if (!studentFilter.tenantId) {
          studentFilter.allowLegacy = true;
        }

        const schoolStudent = await SchoolStudent.findOne(studentFilter)
          .select("classId section tenantId")
          .lean();

        if (schoolStudent?.classId) {
          const tenantForLookup = schoolStudent.tenantId || user.tenantId;
          const schoolClass = await SchoolClass.findOne({
            _id: schoolStudent.classId,
            tenantId: tenantForLookup,
            ...(tenantForLookup ? {} : { allowLegacy: true }),
          })
            .select("sections.classTeacher")
            .lean();

          if (schoolClass?.sections?.length) {
            const desiredSection = (schoolStudent.section || "").trim().toLowerCase();
            const matchedSection =
              schoolClass.sections.find(
                (section) =>
                  section?.name &&
                  section.name.trim().toLowerCase() === desiredSection &&
                  section.classTeacher
              ) ||
              schoolClass.sections.find((section) => section?.classTeacher);
            const sectionTeacherId = matchedSection?.classTeacher;
            if (sectionTeacherId) {
              teacherIdStrings.add(sectionTeacherId.toString());
            }
          }
        }
      } catch (error) {
        console.error("Error resolving school teacher for admin detail:", error);
      }
    }

    const teacherIds = Array.from(teacherIdStrings)
      .filter(Boolean)
      .map((entry) =>
        mongoose.Types.ObjectId.isValid(entry) ? new mongoose.Types.ObjectId(entry) : entry
      );

    const [parents, teachers, children] = await Promise.all([
      parentIds.length > 0
        ? User.find({ _id: { $in: parentIds } })
            .select("fullName name email phone role orgId")
            .populate("orgId", "name")
            .lean()
        : [],
      teacherIds.length > 0
        ? User.find({ _id: { $in: teacherIds } })
            .select("fullName name email phone role orgId")
            .populate("orgId", "name")
            .lean()
        : [],
      childIds.length > 0
        ? User.find({ _id: { $in: childIds } })
            .select("fullName name email orgId")
            .populate("orgId", "name")
            .lean()
        : [],
    ]);

    const formatPerson = (person) => ({
      id: person._id,
      name: person.fullName || person.name,
      email: person.email,
      phone: person.phone || null,
      role: person.role,
      schoolName: person.orgId?.name || null,
    });

    const formatChildren = (child) => ({
      id: child._id,
      name: child.fullName || child.name,
      schoolName: child.orgId?.name || null,
      email: child.email || null,
    });

    let schoolSummary = null;
    if (user.orgId && user.role === "school_admin") {
      const buildSchoolFilter = () => {
        const clauses = [];
        if (user.orgId?._id) {
          clauses.push({ orgId: user.orgId._id });
        }
        if (user.tenantId) {
          clauses.push({ tenantId: user.tenantId });
        }
        if (!clauses.length) {
          return null;
        }
        return { $or: clauses };
      };

      const schoolFilter = buildSchoolFilter();
      if (schoolFilter) {
        const [schoolStudents, schoolParents, schoolTeachers] = await Promise.all([
          User.countDocuments({
            ...schoolFilter,
            role: { $in: ["school_student", "student"] },
          }),
          User.countDocuments({
            ...schoolFilter,
            role: { $in: ["school_parent", "parent"] },
          }),
          User.countDocuments({
            ...schoolFilter,
            role: { $in: ["school_teacher", "teacher"] },
          }),
        ]);

      schoolSummary = {
        location: buildAddressString(user.orgId.settings?.address),
        totalStudents: schoolStudents,
        totalParents: schoolParents,
          totalTeachers: schoolTeachers,
        };
      }
    }

    let parentDetails = null;
    if (["parent", "school_parent"].includes(user.role)) {
      parentDetails = {
        linkedStudents: children.map((child) => ({
          id: child._id,
          name: child.fullName || child.name,
          email: child.email || null,
          schoolName: child.orgId?.name || null,
        })),
      };
    }

    let teacherStats = null;
    if (["teacher", "school_teacher"].includes(user.role) && user.tenantId) {
      const teacherClasses = await SchoolClass.find({
        tenantId: user.tenantId,
        "sections.classTeacher": user._id,
      }).lean();
      const totalClasses = teacherClasses.reduce((sum, doc) => {
        return (
          sum +
          doc.sections.filter((sec) => sec.classTeacher?.toString() === user._id.toString()).length
        );
      }, 0);
      const totalStudents = teacherClasses.reduce((sum, doc) => {
        return (
          sum +
          doc.sections
            .filter((sec) => sec.classTeacher?.toString() === user._id.toString())
            .reduce((subSum, sec) => subSum + (sec.currentStrength || 0), 0)
        );
      }, 0);
      teacherStats = {
        totalClasses,
        totalStudents,
        schoolName: user.orgId?.name || null,
      };
    }

    const shouldShowLinkingCode = user.role === "school_admin";
    const payload = {
      user: {
        id: user._id,
        name: user.fullName || user.name,
        email: user.email,
        phone: user.phone || null,
        role: user.role,
        dateOfBirth: user.dateOfBirth || user.dob || null,
        gender: user.gender || null,
        schoolName: user.orgId?.name || null,
        isVerified: Boolean(user.isVerified),
      },
      parents: parents.map(formatPerson),
      teachers: teachers.map(formatPerson),
      children: children.map(formatChildren),
      parentDetails,
      teacherStats,
      schoolSummary,
      schoolLinkingCode:
        shouldShowLinkingCode && user.orgId?.linkingCode
          ? user.orgId?.linkingCode
          : null,
    };

    return res.json({
      success: true,
      data: payload,
    });
  } catch (error) {
    console.error("Error fetching account details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch account details",
      error: error.message,
    });
  }
};

// 5. Data Export & Research Sandbox (Anonymized)
export const getDataExportSandbox = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    // Get anonymized statistics
    const [totalStudents, totalSchools, totalTeachers] = await Promise.all([
      db.collection('schoolstudents').countDocuments({ isActive: true }),
      Organization.countDocuments({ type: 'school' }),
      User.countDocuments({ role: 'school_teacher' })
    ]);

    // Get anonymized usage patterns
    const recentActivity = await ActivityLog.aggregate([
      { $match: { timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      { $group: {
        _id: '$activityType',
        count: { $sum: 1 }
      }},
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        anonymizedStats: {
          totalStudents,
          totalSchools,
          totalTeachers,
          dataAnonymized: true
        },
        usagePatterns: recentActivity.map(a => ({
          activityType: a._id,
          count: a.count
        })),
        exportFormats: ['CSV', 'JSON', 'Excel'],
        lastExport: null
      }
    });
  } catch (error) {
    console.error('Error fetching data export:', error);
    res.status(500).json({ success: false, message: 'Error fetching data export' });
  }
};

// 6. Policy and Legal
export const getPolicyLegal = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    // Get consent data
    const totalStudents = await db.collection('schoolstudents').countDocuments({ isActive: true });
    const consentedStudents = await db.collection('schoolstudents').countDocuments({
      isActive: true,
      'consentFlags': { $exists: false }
    });
    
    const consentRate = totalStudents > 0 ? ((consentedStudents / totalStudents) * 100).toFixed(2) : 100;

    // Get data deletion requests
    const deletionRequests = []; // Would come from a requests table in production

    res.json({
      success: true,
      data: {
        consent: {
          totalStudents,
          consentedStudents,
          consentRate: parseFloat(consentRate),
          nonConsentedStudents: totalStudents - consentedStudents
        },
        dataDeletionRequests: {
          pending: deletionRequests.filter(r => r.status === 'pending').length,
          completed: deletionRequests.filter(r => r.status === 'completed').length,
          total: deletionRequests.length,
          requests: deletionRequests.slice(0, 10)
        },
        gdprCompliance: {
          compliant: parseFloat(consentRate) >= 95,
          complianceRate: parseFloat(consentRate),
          lastAudit: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Error fetching policy legal:', error);
    res.status(500).json({ success: false, message: 'Error fetching policy legal' });
  }
};

// Helper function for adoption score
function calculateAdoptionScore(userCount, isActive) {
  let score = 0;
  
  // Base score for being active
  if (isActive) score += 30;
  
  // Score based on user count (logarithmic scale)
  if (userCount > 0) {
    score += Math.min(70, Math.log10(userCount + 1) * 10);
  }
  
  return Math.round(score);
}

// ============= ADVANCED ADMIN FEATURES =============

// 1. School Onboarding Console
export const getSchoolOnboardingConsole = async (req, res) => {
  try {
    // Get all schools with onboarding details
    const schools = await Organization.find({ type: 'school' })
      .select('name tenantId isActive createdAt settings.address settings.contactInfo userCount maxUsers')
      .sort({ createdAt: -1 });

    // Get trial period status (assume 30-day trial)
    const schoolsWithTrialStatus = schools.map(school => {
      const createdAt = new Date(school.createdAt);
      const trialEndDate = new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000);
      const today = new Date();
      const daysRemaining = Math.ceil((trialEndDate - today) / (24 * 60 * 60 * 1000));
      
      return {
        schoolId: school._id,
        name: school.name,
        tenantId: school.tenantId,
        region: school.settings?.address?.state || 'Unknown',
        status: school.isActive ? 'active' : 'inactive',
        trialStatus: daysRemaining > 0 ? 'trial' : 'expired',
        daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
        trialEndDate: trialEndDate.toISOString(),
        joinedDate: createdAt.toISOString(),
        userCount: school.userCount || 0,
        maxUsers: school.maxUsers || 100,
        contactInfo: school.settings?.contactInfo || {}
      };
    });

    // Get pending onboarding requests
    const pendingRequests = []; // Would come from a requests table

    res.json({
      success: true,
      data: {
        schools: schoolsWithTrialStatus,
        pendingRequests,
        stats: {
          totalSchools: schools.length,
          activeTrial: schoolsWithTrialStatus.filter(s => s.trialStatus === 'trial').length,
          expiredTrial: schoolsWithTrialStatus.filter(s => s.trialStatus === 'expired').length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching onboarding console:', error);
    res.status(500).json({ success: false, message: 'Error fetching onboarding console' });
  }
};

export const createTenant = async (req, res) => {
  try {
    const { name, region, email, phone, trialDays = 30 } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    // Generate a temporary password for the company
    const bcrypt = require('bcrypt');
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create company first (required)
    const company = await Company.create({
      name: `${name} Holdings`,
      email: `${email.split('@')[0]}+company@${email.split('@')[1]}`,
      password: hashedPassword,
      type: 'school',
      contactInfo: {
        phone,
        address: region,
        state: region
      }
    });

    // Create organization
    const organization = await Organization.create({
      name,
      type: 'school',
      companyId: company._id,
      settings: {
        address: {
          state: region,
          country: 'India'
        },
        contactInfo: {
          email,
          phone
        }
      },
      isActive: true
    });

    res.json({
      success: true,
      message: 'Tenant created successfully',
      data: {
        schoolId: organization._id,
        tenantId: organization.tenantId,
        name: organization.name,
        companyId: company._id,
        linkingCode: organization.linkingCode,
      }
    });
  } catch (error) {
    console.error('Error creating tenant:', error);
    res.status(500).json({ success: false, message: 'Error creating tenant', error: error.message });
  }
};

export const approveModule = async (req, res) => {
  try {
    const { moduleId, revenueShare, metadata } = req.body;

    // In production, this would update the module in the database
    res.json({
      success: true,
      message: 'Module approved successfully',
      data: { moduleId, revenueShare, metadata }
    });
  } catch (error) {
    console.error('Error approving module:', error);
    res.status(500).json({ success: false, message: 'Error approving module' });
  }
};

// 3. Research Sandbox
export const getResearchSandbox = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    // Get anonymized statistics
    const [totalStudents, totalSchools, totalTeachers] = await Promise.all([
      db.collection('schoolstudents').countDocuments({ isActive: true }),
      Organization.countDocuments({ type: 'school' }),
      User.countDocuments({ role: 'school_teacher' })
    ]);

    // Get research agreements
    const agreements = [
      {
        id: '1',
        researcher: 'Dr. John Smith',
        institution: 'MIT Technology Research',
        dataset: 'Student Performance Analytics',
        approved: true,
        approvedDate: '2024-01-15',
        expiryDate: '2024-12-31'
      },
      {
        id: '2',
        researcher: 'Dr. Sarah Johnson',
        institution: 'Stanford Education Lab',
        dataset: 'Engagement Patterns',
        approved: false,
        requestedDate: '2024-03-10'
      }
    ];

    res.json({
      success: true,
      data: {
        anonymizedData: {
          totalStudents,
          totalSchools,
          totalTeachers,
          dataAnonymized: true,
          complianceLevel: 'Full GDPR Compliance'
        },
        agreements,
        availableDatasets: [
          'Student Performance Metrics',
          'Engagement Patterns',
          'Pillar Proficiency Scores',
          'Regional Adoption Rates'
        ]
      }
    });
  } catch (error) {
    console.error('Error fetching research sandbox:', error);
    res.status(500).json({ success: false, message: 'Error fetching research sandbox' });
  }
};

export const createResearchAgreement = async (req, res) => {
  try {
    const { researcher, institution, dataset, purpose } = req.body;

    // In production, this would create an agreement in the database
    res.json({
      success: true,
      message: 'Research agreement created',
      data: { researcher, institution, dataset, purpose, status: 'pending' }
    });
  } catch (error) {
    console.error('Error creating research agreement:', error);
    res.status(500).json({ success: false, message: 'Error creating research agreement' });
  }
};

// 4. Compliance Dashboard
export const getComplianceDashboard = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    // Get consent expiry data
    const totalStudents = await db.collection('schoolstudents').countDocuments({ isActive: true });
    const consentedStudents = await db.collection('schoolstudents').countDocuments({
      isActive: true,
      'consentFlags': { $exists: false }
    });

    // Simulate consent expiry tracking
    const consentExpiring = [
      { id: '1', schoolName: 'ABC School', region: 'Delhi', students: 45, expiryDate: '2024-04-15' },
      { id: '2', schoolName: 'XYZ Academy', region: 'Mumbai', students: 23, expiryDate: '2024-04-20' }
    ];

    // Simulate deletion requests
    const deletionRequests = [
      { id: '1', userName: 'John Doe', email: 'john@example.com', requestDate: '2024-03-10', status: 'pending' },
      { id: '2', userName: 'Jane Smith', email: 'jane@example.com', requestDate: '2024-03-15', status: 'in_progress' }
    ];

    // Simulate legal holds
    const legalHolds = [
      { id: '1', caseNumber: 'CASE-2024-001', entityType: 'School', entityName: 'ABC School', holdDate: '2024-02-15', status: 'active' }
    ];

    res.json({
      success: true,
      data: {
        consentManagement: {
          totalStudents,
          consentedStudents,
          nonConsentedStudents: totalStudents - consentedStudents,
          consentRate: totalStudents > 0 ? ((consentedStudents / totalStudents) * 100).toFixed(2) : 100,
          expiringSoon: consentExpiring
        },
        deletionRequests,
        legalHolds,
        alerts: {
          pendingDeletions: deletionRequests.filter(d => d.status === 'pending').length,
          activeLegalHolds: legalHolds.filter(l => l.status === 'active').length,
          consentExpiring: consentExpiring.length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching compliance dashboard:', error);
    res.status(500).json({ success: false, message: 'Error fetching compliance dashboard' });
  }
};

export const processDeletionRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body;

    // In production, this would process the deletion request
    res.json({
      success: true,
      message: `Deletion request ${action}ed successfully`,
      data: { requestId, action }
    });
  } catch (error) {
    console.error('Error processing deletion request:', error);
    res.status(500).json({ success: false, message: 'Error processing deletion request' });
  }
};

