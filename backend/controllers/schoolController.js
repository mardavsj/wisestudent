import mongoose from 'mongoose';
import crypto from 'crypto';
import SchoolStudent from '../models/School/SchoolStudent.js';
import SchoolClass from '../models/School/SchoolClass.js';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import Company from '../models/Company.js';
import UserProgress from '../models/UserProgress.js';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';
import UnifiedGameProgress from '../models/UnifiedGameProgress.js';
import ActivityLog from '../models/ActivityLog.js';
import MoodLog from '../models/MoodLog.js';
import Notification from '../models/Notification.js';
import Assignment from '../models/Assignment.js';
import AssignmentAttempt from '../models/AssignmentAttempt.js';
import Timetable from '../models/Timetable.js';
import Announcement from '../models/Announcement.js';
import Template from '../models/Template.js';
import Subscription from '../models/Subscription.js';
import SubscriptionRenewalRequest from '../models/SubscriptionRenewalRequest.js';
import ConsentRecord from '../models/ConsentRecord.js';
import DataRetentionPolicy from '../models/DataRetentionPolicy.js';
import ComplianceAuditLog from '../models/ComplianceAuditLog.js';
import RolePermission from '../models/RolePermission.js';
import EscalationChain from '../models/EscalationChain.js';
import EscalationCase from '../models/EscalationCase.js';
import NEPCompetency from '../models/NEPCompetency.js';
import NEPCoverageLog from '../models/NEPCoverageLog.js';
import SupportTicket from '../models/SupportTicket.js';
import AnalyticsEvent from '../models/AnalyticsEvent.js';
import PDFDocument from 'pdfkit';
import { ErrorResponse } from '../utils/ErrorResponse.js';
import assignUserSubscription from '../utils/subscriptionAssignments.js';
import { sendEmail } from '../utils/sendMail.js';
import { getAllPillarGameCounts } from '../utils/gameCountUtils.js';

const BILLING_CYCLE_MONTHS = {
  yearly: 12
};

const BILLING_MULTIPLIER = {
  yearly: 12
};

const EXTRA_USAGE_RATES = {
  student: 40,
  teacher: 120
};

const PLAN_DISPLAY_NAMES = {
  free: 'Free Plan',
  student_premium: 'Student Premium Plan',
  student_parent_premium_pro: 'Student + Parent Premium Pro Plan',
  educational_institutions_premium: 'Educational Institutions Premium Plan'
};

const PLAN_LIMITS = {
  free: {
    price: 0,
    maxStudents: 100,
    maxTeachers: 10,
    maxClasses: 10,
    maxCampuses: 1,
    maxStorage: 5,
    maxTemplates: 50
  },
  student_premium: {
    price: 4499,
    maxStudents: 1000,
    maxTeachers: 100,
    maxClasses: 100,
    maxCampuses: 3,
    maxStorage: 200,
    maxTemplates: 200
  },
  student_parent_premium_pro: {
    price: 4999,
    maxStudents: 1000,
    maxTeachers: 100,
    maxClasses: 100,
    maxCampuses: 3,
    maxStorage: 200,
    maxTemplates: 200
  },
  educational_institutions_premium: {
    price: 0,
    maxStudents: 10000,
    maxTeachers: 1000,
    maxClasses: 1000,
    maxCampuses: 20,
    maxStorage: 1000,
    maxTemplates: 2000
  }
};

const PLAN_FEATURES = {
  free: {
    advancedAnalytics: false,
    aiAssistant: false,
    customBranding: false,
    apiAccess: false,
    prioritySupport: false,
    whiteLabel: false,
    premiumTemplates: false
  },
  student_premium: {
    advancedAnalytics: true,
    aiAssistant: false,
    customBranding: false,
    apiAccess: false,
    prioritySupport: false,
    whiteLabel: false,
    premiumTemplates: true
  },
  student_parent_premium_pro: {
    advancedAnalytics: true,
    aiAssistant: true,
    customBranding: false,
    apiAccess: false,
    prioritySupport: true,
    whiteLabel: false,
    premiumTemplates: true
  },
  educational_institutions_premium: {
    advancedAnalytics: true,
    aiAssistant: true,
    customBranding: true,
    apiAccess: true,
    prioritySupport: true,
    whiteLabel: false,
    premiumTemplates: true
  }
};

const EDUCATIONAL_PLAN_TYPE = 'educational_institutions_premium';
const EDUCATIONAL_PLAN_NAME = 'Educational Institutions Premium Plan';
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

const capitalize = (value = '') => value.charAt(0).toUpperCase() + value.slice(1);

const resolvePlanFeatures = (planName) => {
  const base = PLAN_FEATURES[planName] || PLAN_FEATURES.free;
  return { ...base };
};

const resolvePlanLimits = (planName) => {
  const base = PLAN_LIMITS[planName] || PLAN_LIMITS.free;
  const { price, ...limits } = base;
  return { ...limits };
};

const determinePlanFromUsage = (students = 0, teachers = 0) => {
  if (students <= 100 && teachers <= 10) return 'free';
  return 'educational_institutions_premium';
};

const computeBillingAmount = (planName, billingCycle, students = 0, teachers = 0) => {
  const plan = PLAN_LIMITS[planName] || PLAN_LIMITS.free;
  const cycle = billingCycle || 'yearly';
  const multiplier = BILLING_MULTIPLIER[cycle] || BILLING_MULTIPLIER.yearly;

  let amount = plan.price * multiplier;

  const extraStudents = plan.maxStudents === -1 ? 0 : Math.max(0, students - plan.maxStudents);
  const extraTeachers = plan.maxTeachers === -1 ? 0 : Math.max(0, teachers - plan.maxTeachers);

  amount += (extraStudents * EXTRA_USAGE_RATES.student + extraTeachers * EXTRA_USAGE_RATES.teacher) * multiplier;

  return {
    amount,
    extraStudents,
    extraTeachers
  };
};

// School Admin Dashboard Stats
export const getSchoolStats = async (req, res) => {
  try {
    const { tenantId } = req;

    const [
      totalStudents,
      totalTeachers,
      totalClasses,
      totalParents,
      totalFees,
      attendanceRate
    ] = await Promise.all([
      SchoolStudent.countDocuments({ tenantId }),
      User.countDocuments({ tenantId, role: 'school_teacher' }),
      SchoolClass.countDocuments({ tenantId }),
      User.countDocuments({ tenantId, role: 'school_parent' }),
      SchoolStudent.aggregate([
        { $match: { tenantId } },
        { $group: { _id: null, total: { $sum: '$fees.totalFees' } } }
      ]),
      SchoolStudent.aggregate([
        { $match: { tenantId } },
        { $group: { _id: null, avg: { $avg: '$attendance.percentage' } } }
      ])
    ]);

    res.json({
      totalStudents,
      totalTeachers,
      totalClasses,
      totalParents,
      totalFees: totalFees[0]?.total || 0,
      attendanceRate: Math.round(attendanceRate[0]?.avg || 0)
    });
  } catch (error) {
    console.error('Error fetching school stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// School Activities
export const getSchoolActivities = async (req, res) => {
  try {
    const { tenantId } = req;

    // Mock activities - in real app, this would come from ActivityLog model
    const activities = [
      {
        title: 'New student enrolled',
        description: 'John Doe enrolled in Class 10A',
        time: '2 hours ago'
      },
      {
        title: 'Fee payment received',
        description: '₹15,000 received from Jane Smith',
        time: '4 hours ago'
      },
      {
        title: 'Parent meeting scheduled',
        description: 'PTM scheduled for Class 8B',
        time: '1 day ago'
      }
    ];

    res.json(activities);
  } catch (error) {
    console.error('Error fetching school activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// School Classes
export const getSchoolClasses = async (req, res) => {
  try {
    const { tenantId } = req;

    const classes = await SchoolClass.find({ tenantId })
      .populate('sections.classTeacher', 'name email')
      .select('classNumber stream sections academicYear');

    const classesWithStats = classes.map(cls => ({
      name: `Class ${cls.classNumber}${cls.stream ? ` ${cls.stream}` : ''}`,
      students: cls.sections.reduce((sum, section) => sum + section.currentStrength, 0),
      sections: cls.sections.length,
      academicYear: cls.academicYear
    }));

    res.json(classesWithStats);
  } catch (error) {
    console.error('Error fetching school classes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// School Students
// Create Student (School Admin)
export const createSchoolStudent = async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
     const { name, email, password, classId, section, academicYear, admissionNumber } = req.body;
     if (!name || !email || !password || !classId || !section || !academicYear || !admissionNumber) {
       return res.status(400).json({ message: 'Missing required fields' });
     }
     // Hash password
     const bcrypt = (await import('bcryptjs')).default;
     const hashedPassword = await bcrypt.hash(password, 10);
     // Create user
     const user = await User.create({
       name,
       email,
       password: hashedPassword,
       role: 'school_student',
       tenantId: req.tenantId
     });
     // Create SchoolStudent record
     const schoolStudent = await SchoolStudent.create({
       userId: user._id,
       classId,
       section,
       academicYear,
       admissionNumber,
       tenantId: req.tenantId
     });
    res.status(201).json({ user, schoolStudent });
  } catch (error) {
    console.error('Error creating school student:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getSchoolStudents = async (req, res) => {
  try {
    const { tenantId } = req;

    const students = await SchoolStudent.find({ tenantId })
      .populate('userId', 'name email avatar phone')
      .populate('classId', 'classNumber stream')
      .select('admissionNumber rollNumber section academicYear parentIds personalInfo');

    const studentsWithDetails = students.map(student => ({
      id: student._id,
      name: student.userId.name,
      email: student.userId.email,
      avatar: student.userId.avatar,
      phone: student.userId.phone || 'N/A',
      gender: student.personalInfo?.gender || 'N/A',
      admissionNumber: student.admissionNumber,
      rollNumber: student.rollNumber,
      class: `Class ${student.classId?.classNumber || 'N/A'}${student.classId?.stream ? ` ${student.classId.stream}` : ''}`,
      grade: student.classId?.classNumber || 'N/A',
      section: student.section,
      academicYear: student.academicYear
    }));

    res.json(studentsWithDetails);
  } catch (error) {
    console.error('Error fetching school students:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// School Teachers
// Create Teacher (School Admin)
export const createSchoolTeacher = async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Hash password
    const bcrypt = (await import('bcryptjs')).default;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'school_teacher',
      tenantId: req.tenantId
    });
    res.status(201).json({ user });
  } catch (error) {
    console.error('Error creating school teacher:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getSchoolTeachers = async (req, res) => {
  try {
    const { tenantId } = req;
    const { status } = req.query;

    const query = { tenantId, role: 'school_teacher' };
    const teachers = await User.find(query)
      .select('name email avatar phone createdAt metadata lastActive')
      .lean();

    const teacherIds = teachers.map((teacher) => teacher._id);

    const [classAssignments, studentCounts] = teacherIds.length > 0 ? await Promise.all([
      SchoolClass.aggregate([
        { $match: { tenantId, 'sections.classTeacher': { $in: teacherIds } } },
        { $unwind: '$sections' },
        { $match: { 'sections.classTeacher': { $in: teacherIds } } },
        {
          $group: {
            _id: '$sections.classTeacher',
            classIds: { $addToSet: '$_id' },
            sections: {
              $addToSet: { classId: '$_id', section: '$sections.name' }
            }
          }
        },
        { $project: { totalClasses: { $size: '$classIds' }, sections: 1 } }
      ]),
      SchoolStudent.aggregate([
        { $match: { tenantId } },
        {
          $lookup: {
            from: 'schoolclasses',
            localField: 'classId',
            foreignField: '_id',
            as: 'classInfo'
          }
        },
        { $unwind: '$classInfo' },
        { $unwind: '$classInfo.sections' },
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$section', '$classInfo.sections.name'] },
                { $in: ['$classInfo.sections.classTeacher', teacherIds] }
              ]
            }
          }
        },
        { $group: { _id: '$classInfo.sections.classTeacher', totalStudents: { $sum: 1 } } }
      ])
    ]) : [[], []];

    const classAssignmentsMap = new Map();
    classAssignments.forEach((entry) => {
      classAssignmentsMap.set(entry._id.toString(), {
        totalClasses: entry.totalClasses || 0,
        sections: entry.sections || []
      });
    });

    const studentCountMap = new Map();
    studentCounts.forEach((entry) => {
      studentCountMap.set(entry._id.toString(), entry.totalStudents || 0);
    });

    const recentActivity = teacherIds.length > 0 ? await ActivityLog.aggregate([
      { $match: { userId: { $in: teacherIds }, createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: '$userId' } }
    ]) : [];
    const activeSet = new Set(recentActivity.map((row) => row._id?.toString()).filter(Boolean));
    const activeThreshold = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const enhancedTeachers = teachers.map((teacher) => {
      const teacherKey = teacher._id.toString();
      const classStats = classAssignmentsMap.get(teacherKey) || { totalClasses: 0 };
      const totalStudents = studentCountMap.get(teacherKey) || 0;

      const isActive = (teacher.lastActive && teacher.lastActive >= activeThreshold)
        || activeSet.has(teacher._id.toString());

      return {
        ...teacher,
        isActive,
        totalClasses: classStats.totalClasses || 0,
        totalStudents,
        experience: teacher.metadata?.experience || 0,
        qualification: teacher.metadata?.qualification || 'N/A',
        joiningDate: teacher.metadata?.joiningDate || teacher.createdAt
      };
    });

    const filteredTeachers = status === 'active'
      ? enhancedTeachers.filter((teacher) => teacher.isActive)
      : status === 'inactive'
        ? enhancedTeachers.filter((teacher) => !teacher.isActive)
        : enhancedTeachers;

    res.json({ teachers: filteredTeachers });
  } catch (error) {
    console.error('Error fetching school teachers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get available teachers (not assigned to any class)
export const getAvailableTeachers = async (req, res) => {
  try {
    const { tenantId } = req;

    // Get all teachers
    const allTeachers = await User.find({ tenantId, role: 'school_teacher' })
      .select('name email avatar phone createdAt metadata')
      .lean();

    // Get all assigned teachers
    const assignedTeachers = await SchoolClass.find({ tenantId })
      .select('sections.classTeacher')
      .lean();

    const assignedTeacherIds = new Set();
    assignedTeachers.forEach(classData => {
      classData.sections.forEach(section => {
        if (section.classTeacher) {
          assignedTeacherIds.add(section.classTeacher.toString());
        }
      });
    });

    // Filter out assigned teachers
    const availableTeachers = allTeachers.filter(teacher => 
      !assignedTeacherIds.has(teacher._id.toString())
    );

    res.json(availableTeachers);
  } catch (error) {
    console.error('Error fetching available teachers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get available students (not assigned to any class)
export const getAvailableStudents = async (req, res) => {
  try {
    const { tenantId } = req;

    // Get all students not assigned to any class
    const students = await SchoolStudent.find({ 
      tenantId, 
      classId: null 
    })
      .populate('userId', 'name email avatar phone')
      .select('admissionNumber rollNumber personalInfo')
      .lean();

    const studentsWithDetails = students.map(student => ({
      _id: student._id,
      name: student.userId?.name || 'N/A',
      email: student.userId?.email || 'N/A',
      avatar: student.userId?.avatar,
      phone: student.userId?.phone || 'N/A',
      gender: student.personalInfo?.gender || 'N/A',
      admissionNumber: student.admissionNumber,
      rollNumber: student.rollNumber
    }));

    res.json(studentsWithDetails);
  } catch (error) {
    console.error('Error fetching available students:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get teacher statistics for admin dashboard
export const getAdminTeacherStats = async (req, res) => {
  try {
    const { tenantId } = req;

    const [total, totalClasses, teachersData, teachersActivity] = await Promise.all([
      User.countDocuments({ tenantId, role: 'school_teacher' }),
      SchoolClass.countDocuments({ tenantId }),
      User.find({ tenantId, role: 'school_teacher' }).select('_id lastActive metadata').lean(),
      ActivityLog.aggregate([
        { $match: { tenantId, createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
        { $group: { _id: '$userId' } }
      ])
    ]);

    const activeThreshold = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeSet = new Set(teachersActivity.map((row) => row._id?.toString()).filter(Boolean));
    const activeTeachers = teachersData.filter((teacher) => {
      if (teacher.lastActive && teacher.lastActive >= activeThreshold) return true;
      return activeSet.has(teacher._id?.toString());
    }).length;

    // Calculate average experience
    const avgExperience = teachersData.length > 0 
      ? Math.round(teachersData.reduce((sum, t) => sum + (t.metadata?.experience || 0), 0) / teachersData.length)
      : 0;

    res.json({
      total,
      active: activeTeachers,
      inactive: Math.max(0, total - activeTeachers),
      totalClasses,
      avgExperience
    });
  } catch (error) {
    console.error('Error fetching teacher stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get individual teacher details
export const getTeacherDetailsById = async (req, res) => {
  try {
    const { tenantId } = req;
    const { teacherId } = req.params;

    const teacher = await User.findOne({ _id: teacherId, tenantId, role: 'school_teacher' })
      .select('name email phone avatar isActive createdAt lastActive metadata')
      .lean();

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Get assigned classes with student count
    const assignedClasses = await SchoolClass.find({
      tenantId,
      'sections.classTeacher': teacher._id
    }).select('classNumber stream sections academicYear').lean();

    const classesWithStudents = await Promise.all(assignedClasses.map(async (cls) => {
      // Find which sections this teacher is assigned to
      const teacherSections = cls.sections.filter(section => 
        section.classTeacher && section.classTeacher.toString() === teacher._id.toString()
      );

      const sectionNames = teacherSections.map(section => section.name).filter(Boolean);
      const studentCount = sectionNames.length > 0
        ? await SchoolStudent.countDocuments({
            tenantId,
            classId: cls._id,
            section: { $in: sectionNames }
          })
        : 0;

      return {
        _id: cls._id,
        classNumber: cls.classNumber,
        stream: cls.stream,
        academicYear: cls.academicYear,
        sections: teacherSections, // Only sections assigned to this teacher
        students: studentCount
      };
    }));

    const totalStudents = classesWithStudents.reduce((sum, cls) => sum + (cls.students || 0), 0);

    const teacherData = {
      ...teacher,
      experience: teacher.metadata?.experience || 0,
      qualification: teacher.metadata?.qualification || 'N/A',
      joiningDate: teacher.metadata?.joiningDate || teacher.createdAt,
      totalClasses: assignedClasses.length,
      totalStudents,
      assignedClasses: classesWithStudents,
      attendance: 95, // Mock data - would come from attendance tracking
      metrics: {
        student_satisfaction: 85,
        assignment_completion: 92,
        class_performance: 78
      }
    };

    res.json({ teacher: teacherData });
  } catch (error) {
    console.error('Error fetching teacher details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new teacher (Enhanced)
export const createTeacher = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { name, email, phone, qualification, experience, joiningDate, password, pronouns, customPronouns } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Missing required fields: name and email are required' });
    }

    // Check if teacher already exists
    const existingTeacher = await User.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Teacher with this email already exists' });
    }

    // Enforce teacher quota based on company academic info
    if (orgId) {
      const company = await Company.findOne({ organizations: orgId }).lean();
      const teacherLimit = Number(company?.academicInfo?.totalTeachers) || 0;
      if (teacherLimit > 0) {
        const currentTeachers = await User.countDocuments({ orgId, role: 'school_teacher' });
        if (currentTeachers >= teacherLimit) {
          return res.status(403).json({
            success: false,
            message: `Teacher limit reached. You can onboard up to ${teacherLimit} teachers as per the approved registration details.`
          });
        }
      }
    }

    // Create user account
    const bcrypt = (await import('bcryptjs')).default;
    const defaultPassword = password || 'teacher123';
    console.log('Creating teacher with password:', defaultPassword);
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    
    // Determine final pronouns value
    const finalPronouns = pronouns === 'other' ? customPronouns : pronouns;

    const teacher = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'school_teacher',
      tenantId,
      orgId,
      phone,
      pronouns: finalPronouns || '',
      metadata: {
        qualification: qualification || '',
        experience: parseInt(experience) || 0,
        joiningDate: joiningDate || new Date(),
      }
    });

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'teacher_created',
      targetType: 'teacher',
      targetId: teacher._id,
      targetName: name,
      description: `New teacher ${name} added`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    if (orgId && tenantId) {
      try {
        const subscription = await Subscription.findOne({ orgId, tenantId });
        const planName = subscription?.plan?.name || subscription?.plan?.planType || null;
        if (subscription && subscription.status === 'active' && planName === EDUCATIONAL_PLAN_TYPE) {
          const assignedSubscription = await assignUserSubscription({
            userId: teacher._id,
            planType: EDUCATIONAL_PLAN_TYPE,
            planName: EDUCATIONAL_PLAN_NAME,
            features: EDUCATIONAL_PLAN_FEATURES,
            amount: 0,
            startDate: new Date(),
            endDate: subscription.endDate ? new Date(subscription.endDate) : undefined,
            metadata: {
              orgId: orgId?.toString?.() ?? null,
              tenantId,
              source: 'school_teacher_creation',
            },
            initiator: {
              userId: req.user?._id || null,
              role: req.user?.role || 'school_admin',
              name: req.user?.name || 'School Admin',
              email: req.user?.email || null,
              context: 'school_admin',
            },
          });
          const io = req.app && typeof req.app.get === 'function' ? req.app.get('io') : null;
          if (io && assignedSubscription) {
            const payload = assignedSubscription.toObject ? assignedSubscription.toObject() : assignedSubscription;
            io.to(teacher._id.toString()).emit('subscription:activated', {
              userId: teacher._id.toString(),
              subscription: payload,
            });
          }
        }
      } catch (assignmentError) {
        console.error('Error assigning subscription to teacher:', assignmentError);
      }
    }

    // Emit socket events for realtime dashboard updates
    const io = req.app?.get('io');
    if (io && tenantId) {
      io.to(`school-admin-dashboard:${tenantId}`).emit('school:teachers:updated', {
        teacherId: teacher._id,
        action: 'created',
        tenantId,
        timestamp: new Date()
      });
      
      io.to(`school-admin-dashboard:${tenantId}`).emit('school-admin:dashboard:update', {
        type: 'teacher_created',
        timestamp: new Date()
      });

      // Emit campus statistics update if teacher has campusId
      if (teacher.campusId) {
        io.to(`school-admin-dashboard:${tenantId}`).emit('school:campus:stats:updated', {
          campusId: teacher.campusId,
          tenantId,
          timestamp: new Date()
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      teacher: {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        pronouns: teacher.pronouns
      }
    });
  } catch (error) {
    console.error('Error creating teacher:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete teacher
export const deleteTeacher = async (req, res) => {
  try {
    const { tenantId } = req;
    const { teacherId } = req.params;

    // Find the teacher
    const teacher = await User.findOne({ _id: teacherId, tenantId, role: 'school_teacher' });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const teacherName = teacher.name;
    const teacherEmail = teacher.email;

    // Check if teacher is assigned to any classes
    const assignedClasses = await SchoolClass.countDocuments({
      tenantId,
      $or: [
        { 'sections.classTeacher': teacherId },
        { 'subjects.teachers': teacherId }
      ]
    });

    if (assignedClasses > 0) {
      return res.status(400).json({
        message: `Cannot delete teacher. This teacher is assigned to ${assignedClasses} class(es). Please reassign or remove assignments first.`
      });
    }

    // Delete the teacher account
    await User.findByIdAndDelete(teacherId);

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'teacher_deleted',
      targetType: 'teacher',
      targetId: teacherId,
      targetName: teacherName,
      description: `Teacher ${teacherName} (${teacherEmail}) permanently deleted`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Emit socket events for realtime dashboard updates
    const io = req.app?.get('io');
    if (io && tenantId) {
      io.to(`school-admin-dashboard:${tenantId}`).emit('school:teachers:updated', {
        teacherId,
        action: 'deleted',
        tenantId,
        timestamp: new Date()
      });
      
      io.to(`school-admin-dashboard:${tenantId}`).emit('school-admin:dashboard:update', {
        type: 'teacher_deleted',
        timestamp: new Date()
      });

      // Emit campus statistics update if teacher had campusId
      if (teacher.campusId) {
        io.to(`school-admin-dashboard:${tenantId}`).emit('school:campus:stats:updated', {
          campusId: teacher.campusId,
          tenantId,
          timestamp: new Date()
        });
      }
    }

    res.json({
      success: true,
      message: 'Teacher deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export teachers to CSV
export const exportTeachers = async (req, res) => {
  try {
    const { tenantId } = req;
    const { status, format = 'csv' } = req.query;

    const query = { tenantId, role: 'school_teacher' };
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;

    const teachers = await User.find(query)
      .select('name email phone isActive createdAt metadata')
      .lean();

    if (format === 'csv') {
      // Create CSV content
      let csv = 'Name,Email,Phone,Qualification,Experience,Joining Date,Status\n';
      
      teachers.forEach(teacher => {
        csv += `"${teacher.name}","${teacher.email}","${teacher.phone || 'N/A'}","${teacher.metadata?.qualification || 'N/A'}","${teacher.metadata?.experience || 0}","${teacher.metadata?.joiningDate ? new Date(teacher.metadata.joiningDate).toLocaleDateString() : 'N/A'}","${teacher.isActive ? 'Active' : 'Inactive'}"\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=teachers-${Date.now()}.csv`);
      res.send(csv);
    } else {
      res.json({ teachers });
    }
  } catch (error) {
    console.error('Error exporting teachers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Teacher Dashboard Stats
export const getTeacherStats = async (req, res) => {
  try {
    const { tenantId, user } = req;

    // First get the classes assigned to this teacher
    const assignedClasses = await SchoolClass.find({
      tenantId,
      $or: [
        { 'sections.classTeacher': user._id },
        { 'subjects.teachers': user._id }
      ]
    }).select('_id').lean();

    const classIds = assignedClasses.map(cls => cls._id);

    // Get all assignments for this teacher
    const teacherAssignments = await Assignment.find({
      tenantId,
      teacherId: user._id,
      isActive: true
    }).select('_id').lean();

    const assignmentIds = teacherAssignments.map(a => a._id);

    // Count pending grading tasks (submitted but not graded)
    const pendingGradingCount = assignmentIds.length > 0 ? await AssignmentAttempt.countDocuments({
      assignmentId: { $in: assignmentIds },
      tenantId,
      status: 'submitted',
      graded: { $ne: true }
    }) : 0;

    const [
      totalStudents,
      totalClasses,
      attendanceRate,
      assignmentsGraded
    ] = await Promise.all([
      SchoolStudent.countDocuments({ 
        tenantId,
        classId: { $in: classIds }
      }).catch(() => 0),
      SchoolClass.countDocuments({ 
        tenantId,
        $or: [
          { 'sections.classTeacher': user._id },
          { 'subjects.teachers': user._id }
        ]
      }).catch(() => 0),
      SchoolStudent.aggregate([
        { $match: { tenantId, classId: { $in: classIds } } },
        { $group: { _id: null, avg: { $avg: '$attendance.percentage' } } }
      ]).catch(() => [{ avg: 0 }]),
      // Count graded assignments
      assignmentIds.length > 0 ? AssignmentAttempt.countDocuments({
        assignmentId: { $in: assignmentIds },
        tenantId,
        graded: true
      }).catch(() => 0) : Promise.resolve(0)
    ]);

    res.json({
      totalStudents: totalStudents || 0,
      totalClasses: totalClasses || 0,
      attendanceRate: Math.round(attendanceRate[0]?.avg || 0),
      assignmentsGraded: assignmentsGraded || 0,
      pendingTasks: pendingGradingCount || 0
    });
  } catch (error) {
    console.error('Error fetching teacher stats:', error);
    res.status(500).json({ 
      message: 'Server error',
      totalStudents: 0,
      totalClasses: 0,
      attendanceRate: 0,
      assignmentsGraded: 0,
      pendingTasks: 0
    });
  }
};

// Teacher Classes
export const getTeacherClasses = async (req, res) => {
  try {
    const { tenantId, user, isLegacyUser } = req;

    // Build query based on user type - check both classTeacher and subject teachers
    const query = {
      $or: [
        { 'sections.classTeacher': user._id },
        { 'subjects.teachers': user._id }
      ]
    };
    
    // Add tenantId filter for multi-tenant users
    if (!isLegacyUser && tenantId) {
      query.tenantId = tenantId;
    } else if (isLegacyUser) {
      query.allowLegacy = true; // Flag to bypass tenantId requirement
    }

    const classes = await SchoolClass.find(query)
      .populate('sections.classTeacher', 'name email')
      .populate('subjects.teachers', 'name email')
      .select('classNumber stream sections subjects academicYear isActive')
      .catch(err => {
        console.error('SchoolClass query error:', err);
        return [];
      });

    // If no classes found where teacher is assigned, get all active classes for the school
    if (classes.length === 0) {
      console.log('No classes found for teacher, fetching all available classes');
      
      // Get all active classes for the school
      const allClassesQuery = {
        isActive: true
      };
      
      if (!isLegacyUser && tenantId) {
        allClassesQuery.tenantId = tenantId;
      } else if (isLegacyUser) {
        allClassesQuery.allowLegacy = true;
      }

      const allClasses = await SchoolClass.find(allClassesQuery)
        .populate('sections.classTeacher', 'name email')
        .populate('subjects.teachers', 'name email')
        .select('classNumber stream sections subjects academicYear isActive')
        .limit(10); // Limit to 10 classes to avoid overwhelming the UI

      // Transform the classes to include proper names, IDs, and student counts
      const transformedClasses = await Promise.all(allClasses.map(async (cls) => {
        const studentCount = await SchoolStudent.countDocuments({
          tenantId,
          classId: cls._id
        });

        return {
          _id: cls._id,
          name: `Class ${cls.classNumber}${cls.stream ? ` ${cls.stream}` : ''}`,
          classNumber: cls.classNumber,
          stream: cls.stream,
          sections: cls.sections,
          subjects: cls.subjects,
          academicYear: cls.academicYear,
          isActive: cls.isActive,
          studentCount: studentCount
        };
      }));

      return res.json({
        success: true,
        classes: transformedClasses,
        message: 'Showing all available classes. Contact admin to assign you to specific classes.'
      });
    }

    // Transform the classes to include proper names, IDs, and student counts
    const transformedClasses = await Promise.all(classes.map(async (cls) => {
      const studentCount = await SchoolStudent.countDocuments({
        tenantId,
        classId: cls._id
      });

      return {
        _id: cls._id,
        name: `Class ${cls.classNumber}${cls.stream ? ` ${cls.stream}` : ''}`,
        classNumber: cls.classNumber,
        stream: cls.stream,
        sections: cls.sections,
        subjects: cls.subjects,
        academicYear: cls.academicYear,
        isActive: cls.isActive,
        studentCount: studentCount
      };
    }));

    res.json({
      success: true,
      classes: transformedClasses
    });
  } catch (error) {
    console.error('Error fetching teacher classes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Get assignment type statistics for teacher
export const getAssignmentTypeStats = async (req, res) => {
  try {
    const { tenantId, user } = req;

    // Get all assignments for this teacher
    const assignments = await Assignment.find({
      tenantId,
      teacherId: user._id,
      isActive: true
    }).select('type status createdAt dueDate _id').lean();

    // Get assignment IDs for fetching attempts
    const assignmentIds = assignments.map(a => a._id);

    // Get assignment attempts for completion stats
    const AssignmentAttempt = (await import('../models/AssignmentAttempt.js')).default;
    const attempts = await AssignmentAttempt.find({
      assignmentId: { $in: assignmentIds },
      tenantId
    }).select('assignmentId status totalScore percentage submittedAt').lean();

    // Group attempts by assignment ID
    const attemptsByAssignment = {};
    attempts.forEach(attempt => {
      if (!attemptsByAssignment[attempt.assignmentId]) {
        attemptsByAssignment[attempt.assignmentId] = [];
      }
      attemptsByAssignment[attempt.assignmentId].push(attempt);
    });

    // Calculate statistics by type
    const stats = {
      homework: {
        total: 0,
        published: 0,
        pending: 0,
        completed: 0,
        recent: 0, // Created in last 7 days
        totalSubmissions: 0,
        averageScore: 0,
        completionRate: 0,
        pendingGrading: 0
      },
      quiz: {
        total: 0,
        published: 0,
        pending: 0,
        completed: 0,
        recent: 0,
        totalSubmissions: 0,
        averageScore: 0,
        completionRate: 0,
        pendingGrading: 0
      },
      test: {
        total: 0,
        published: 0,
        pending: 0,
        completed: 0,
        recent: 0,
        totalSubmissions: 0,
        averageScore: 0,
        completionRate: 0,
        pendingGrading: 0
      },
      classwork: {
        total: 0,
        published: 0,
        pending: 0,
        completed: 0,
        recent: 0,
        totalSubmissions: 0,
        averageScore: 0,
        completionRate: 0,
        pendingGrading: 0
      },
      project: {
        total: 0,
        published: 0,
        pending: 0,
        completed: 0,
        recent: 0,
        totalSubmissions: 0,
        averageScore: 0,
        completionRate: 0,
        pendingGrading: 0
      }
    };

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    assignments.forEach(assignment => {
      const type = assignment.type || 'homework';
      if (stats[type]) {
        stats[type].total++;
        
        if (assignment.status === 'published' || assignment.status === 'in_progress') {
          stats[type].published++;
        } else if (assignment.status === 'pending' || assignment.status === 'pending_approval') {
          stats[type].pending++;
        } else if (assignment.status === 'completed' || assignment.status === 'approved') {
          stats[type].completed++;
        }

        if (assignment.createdAt && new Date(assignment.createdAt) >= sevenDaysAgo) {
          stats[type].recent++;
        }

        // Calculate submission stats for this assignment
        const assignmentAttempts = attemptsByAssignment[assignment._id.toString()] || [];
        const submittedAttempts = assignmentAttempts.filter(a => a.status === 'submitted');
        const pendingGrading = submittedAttempts.filter(a => !a.graded || a.graded === false).length;
        
        stats[type].totalSubmissions += submittedAttempts.length;
        stats[type].pendingGrading += pendingGrading;

        // Calculate average score properly (accumulate all scores, then average at the end)
        if (submittedAttempts.length > 0) {
          const totalScore = submittedAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0);
          // Store for proper calculation later
          if (!stats[type]._scoreSum) {
            stats[type]._scoreSum = 0;
            stats[type]._scoreCount = 0;
            stats[type]._expectedSubmissions = 0;
          }
          stats[type]._scoreSum += totalScore;
          stats[type]._scoreCount += submittedAttempts.length;
          
          // Add expected submissions for completion rate calculation
          const expectedStudents = studentCountsByAssignment[assignment._id.toString()] || 25;
          stats[type]._expectedSubmissions += expectedStudents;
        }
      }
    });

    // Calculate completion rates and finalize average scores
    Object.keys(stats).forEach(type => {
      if (stats[type].total > 0) {
        // Calculate proper average score from accumulated values
        if (stats[type]._scoreCount > 0) {
          stats[type].averageScore = Math.round((stats[type]._scoreSum / stats[type]._scoreCount) * 10) / 10;
        }
        
        // Calculate completion rate using actual expected submissions
        if (stats[type]._expectedSubmissions > 0) {
          stats[type].completionRate = Math.min(100, Math.round((stats[type].totalSubmissions / stats[type]._expectedSubmissions) * 100));
        }
        
        // Clean up temporary properties
        delete stats[type]._scoreSum;
        delete stats[type]._scoreCount;
        delete stats[type]._expectedSubmissions;
      }
    });

    res.json({
      success: true,
      stats,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Error fetching assignment type stats:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch assignment statistics',
      error: error.message 
    });
  }
};

// Teacher Assignments
export const getTeacherAssignments = async (req, res) => {
  try {
    const { tenantId, user } = req;
    const { type, status, search } = req.query;

    // Build query filters
    const query = {
      tenantId,
      teacherId: user._id,
      isActive: true,
      hiddenFromTeacher: { $ne: true } // Exclude assignments hidden from teacher
    };

    if (type && type !== 'all') {
      query.type = type;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const assignments = await Assignment.find(query)
      .populate('classId', 'name section academicYear')
      .populate('assignedToClasses', 'name section academicYear')
      .sort({ dueDate: 1 })
      .lean();

    // Get basic stats for each assignment
    const assignmentsWithStats = await Promise.all(
      assignments.map(async (assignment) => {
        const AssignmentAttempt = (await import('../models/AssignmentAttempt.js')).default;
        
        const totalAttempts = await AssignmentAttempt.countDocuments({
          assignmentId: assignment._id,
          tenantId
        });

        const submittedAttempts = await AssignmentAttempt.countDocuments({
          assignmentId: assignment._id,
          tenantId,
          status: 'submitted'
        });

        const averageScore = await AssignmentAttempt.aggregate([
          { $match: { assignmentId: assignment._id, tenantId, status: 'submitted' } },
          { $group: { _id: null, avgScore: { $avg: '$totalScore' } } }
        ]);

        return {
          ...assignment,
          stats: {
            totalAttempts,
            submittedAttempts,
            pendingAttempts: totalAttempts - submittedAttempts,
            completionRate: totalAttempts > 0 ? Math.round((submittedAttempts / totalAttempts) * 100) : 0,
            averageScore: averageScore.length > 0 ? Math.round(averageScore[0].avgScore * 100) / 100 : 0
          }
        };
      })
    );

    res.json({
      success: true,
      data: assignmentsWithStats,
      total: assignmentsWithStats.length
    });
  } catch (error) {
    console.error('Error fetching teacher assignments:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch assignments',
      error: error.message 
    });
  }
};

// Teacher Timetable
export const getTeacherTimetable = async (req, res) => {
  try {
    const { tenantId, user } = req;

    // Get current day
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = daysOfWeek[new Date().getDay()];

    const timetables = await Timetable.find({
      tenantId,
      'schedule.periods.teacherId': user._id,
      isActive: true
    }).lean();

    // Extract today's schedule for this teacher
    const todaySchedule = [];
    timetables.forEach(tt => {
      const daySchedule = tt.schedule.find(s => s.day === today);
      if (daySchedule) {
        daySchedule.periods.forEach(period => {
          if (period.teacherId && period.teacherId.toString() === user._id.toString()) {
            todaySchedule.push({
              subject: period.subject,
              class: tt.className,
              section: tt.section,
              time: period.startTime,
              room: period.room,
              startTime: period.startTime,
              endTime: period.endTime
            });
          }
        });
      }
    });

    res.json(todaySchedule);
  } catch (error) {
    console.error('Error fetching teacher timetable:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Student Dashboard Stats
export const getStudentStats = async (req, res) => {
  try {
    const { tenantId, user } = req;

    const student = await SchoolStudent.findOne({ 
      tenantId, 
      userId: user._id 
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      attendance: student.attendance?.percentage || 0,
      assignmentsCompleted: student.academicInfo?.assignmentsCompleted || 0,
      averageScore: student.academicInfo?.averageScore || 0,
      rank: student.academicInfo?.classRank || 0
    });
  } catch (error) {
    console.error('Error fetching student stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Student Assignments
export const getStudentAssignments = async (req, res) => {
  try {
    // Mock data - in real app, this would come from Assignment model
    const assignments = [
      {
        title: 'Math Homework - Algebra',
        subject: 'Mathematics',
        dueDate: '2024-01-15',
        status: 'completed'
      },
      {
        title: 'Science Project - Photosynthesis',
        subject: 'Science',
        dueDate: '2024-01-20',
        status: 'pending'
      },
      {
        title: 'English Essay - Climate Change',
        subject: 'English',
        dueDate: '2024-01-18',
        status: 'overdue'
      }
    ];

    res.json(assignments);
  } catch (error) {
    console.error('Error fetching student assignments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Student Timetable
export const getStudentTimetable = async (req, res) => {
  try {
    // Mock data - in real app, this would come from Timetable model
    const timetable = [
      {
        subject: 'Mathematics',
        time: '09:00 AM',
        teacher: 'Mr. Smith',
        room: 'Room 101'
      },
      {
        subject: 'Science',
        time: '10:30 AM',
        teacher: 'Ms. Johnson',
        room: 'Lab 2'
      },
      {
        subject: 'English',
        time: '02:00 PM',
        teacher: 'Mr. Brown',
        room: 'Room 102'
      }
    ];

    res.json(timetable);
  } catch (error) {
    console.error('Error fetching student timetable:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Student Grades
export const getStudentGrades = async (req, res) => {
  try {
    // Mock data - in real app, this would come from Grade model
    const grades = [
      {
        subject: 'Mathematics',
        assignment: 'Algebra Test',
        score: 85
      },
      {
        subject: 'Science',
        assignment: 'Physics Quiz',
        score: 92
      },
      {
        subject: 'English',
        assignment: 'Essay Writing',
        score: 78
      }
    ];

    res.json(grades);
  } catch (error) {
    console.error('Error fetching student grades:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Student Announcements - Redirect to announcement controller
export const getStudentAnnouncements = async (req, res) => {
  try {
    const { tenantId, user } = req;
    const { page = 1, limit = 10 } = req.query;

    // Get student's class information
    const student = await User.findById(user._id).populate('academic.classId');
    const studentClassId = student.academic?.classId?._id;

    // Build filter for announcements visible to students
    const filter = {
      tenantId,
      isActive: true,
      $or: [
        { targetAudience: 'all' },
        { targetAudience: 'students' },
        ...(studentClassId ? [{ targetClasses: studentClassId }] : [])
      ],
      $and: [
        { publishDate: { $lte: new Date() } },
        {
          $or: [
            { expiryDate: { $exists: false } },
            { expiryDate: null },
            { expiryDate: { $gte: new Date() } }
          ]
        }
      ]
    };

    const announcements = await Announcement.find(filter)
      .populate('createdBy', 'name email avatar')
      .populate('targetClasses', 'classNumber stream')
      .sort({ isPinned: -1, publishDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Announcement.countDocuments(filter);

    res.json({
      announcements,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching student announcements:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Parent Dashboard - Get Children
// Create Parent (School Admin)
export const createSchoolParent = async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { name, email, password, childId } = req.body;
    if (!name || !email || !password || !childId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Hash password
    const bcrypt = (await import('bcryptjs')).default;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'school_parent',
      tenantId: req.tenantId
    });
    // Link parent to child
    await SchoolStudent.findByIdAndUpdate(childId, { $push: { parentIds: user._id } });
    res.status(201).json({ user });
  } catch (error) {
    console.error('Error creating school parent:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getParentChildren = async (req, res) => {
  try {
    const { tenantId, user } = req;

    const children = await SchoolStudent.find({ 
      tenantId,
      parentIds: user._id
    })
    .populate('userId', 'name email avatar')
    .populate('classId', 'classNumber stream')
    .select('admissionNumber rollNumber section academicYear');

    const childrenWithDetails = children.map(child => ({
      id: child._id,
      name: child.userId.name,
      email: child.userId.email,
      avatar: child.userId.avatar,
      class: `Class ${child.classId.classNumber}${child.classId.stream ? ` ${child.classId.stream}` : ''}`,
      section: child.section,
      academicYear: child.academicYear
    }));

    res.json(childrenWithDetails);
  } catch (error) {
    console.error('Error fetching parent children:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Parent Dashboard - Child Stats
export const getChildStats = async (req, res) => {
  try {
    const { tenantId } = req;
    const { childId } = req.params;

    const child = await SchoolStudent.findOne({ 
      tenantId, 
      _id: childId 
    });

    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    res.json({
      attendance: child.attendance?.percentage || 0,
      averageScore: child.academicInfo?.averageScore || 0,
      assignmentsCompleted: child.academicInfo?.assignmentsCompleted || 0,
      rank: child.academicInfo?.classRank || 0
    });
  } catch (error) {
    console.error('Error fetching child stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Parent Activities
export const getParentActivities = async (req, res) => {
  try {
    // Mock data - in real app, this would come from ActivityLog model
    const activities = [
      {
        title: 'Assignment submitted',
        description: 'Math homework submitted by John',
        time: '2 hours ago'
      },
      {
        title: 'Attendance marked',
        description: 'Present in all classes today',
        time: '4 hours ago'
      },
      {
        title: 'Grade received',
        description: 'Science test - 92%',
        time: '1 day ago'
      }
    ];

    res.json(activities);
  } catch (error) {
    console.error('Error fetching parent activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Parent Fees
export const getParentFees = async (req, res) => {
  try {
    // Mock data - in real app, this would come from Fee model
    const fees = [
      {
        description: 'Tuition Fee - January',
        amount: 5000,
        dueDate: '2024-01-31',
        status: 'paid'
      },
      {
        description: 'Transport Fee - January',
        amount: 2000,
        dueDate: '2024-01-31',
        status: 'pending'
      },
      {
        description: 'Library Fee - January',
        amount: 500,
        dueDate: '2024-01-31',
        status: 'paid'
      }
    ];

    res.json(fees);
  } catch (error) {
    console.error('Error fetching parent fees:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Parent Announcements - Updated to use actual data
export const getParentAnnouncements = async (req, res) => {
  try {
    const { tenantId } = req;
    const { page = 1, limit = 10 } = req.query;

    // Build filter for announcements visible to parents
    const filter = {
      tenantId,
      isActive: true,
      $or: [
        { targetAudience: 'all' },
        { targetAudience: 'parents' }
      ],
      $and: [
        { publishDate: { $lte: new Date() } },
        {
          $or: [
            { expiryDate: { $exists: false } },
            { expiryDate: null },
            { expiryDate: { $gte: new Date() } }
          ]
        }
      ]
    };

    const announcements = await Announcement.find(filter)
      .populate('createdBy', 'name email avatar')
      .populate('targetClasses', 'classNumber stream')
      .sort({ isPinned: -1, publishDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Announcement.countDocuments(filter);

    res.json({
      announcements,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching parent announcements:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all students for teacher (search and filter)
export const getAllStudentsForTeacher = async (req, res) => {
  try {
    const { tenantId, user, isLegacyUser } = req;

    // First get the classes assigned to this teacher
    const assignedClasses = await SchoolClass.find({
      tenantId,
      $or: [
        { 'sections.classTeacher': user._id },
        { 'subjects.teachers': user._id }
      ]
    }).select('_id').lean();

    const classIds = assignedClasses.map(cls => cls._id);

    // If teacher has no assigned classes, return empty array
    if (classIds.length === 0) {
      return res.json({ students: [] });
    }

    // Get students from teacher's classes
    const schoolStudents = await SchoolStudent.find({
      tenantId,
      classId: { $in: classIds }
    })
      .populate('userId', 'name email avatar role tenantId orgId createdAt')
      .lean()
      .catch(err => {
        console.error('SchoolStudent query error:', err);
        return [];
      });

    const students = schoolStudents
      .map(ss => ss.userId)
      .filter(Boolean);

    // Get additional data for each student (enriched like getClassStudents)
    const pillarGameCounts = await getAllPillarGameCounts(UnifiedGameProgress);

    const enrichedStudents = await Promise.all(schoolStudents.map(async (schoolStudent, index) => {
      try {
        const student = schoolStudent.userId;
        if (!student || !student._id) return null;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const [progress, wallet, gameProgress, recentMoods, recentActivities] = await Promise.all([
          UserProgress.findOne({ userId: student._id }).lean(),
          Wallet.findOne({ userId: student._id }).lean(),
          UnifiedGameProgress.find({ userId: student._id }).lean(),
          MoodLog.find({ userId: student._id, createdAt: { $gte: sevenDaysAgo } }).sort({ createdAt: -1 }).limit(1).lean(),
          ActivityLog.find({ userId: student._id, createdAt: { $gte: sevenDaysAgo } }).lean()
        ]);

        const mapGameTypeToPillarKey = (gameType) => {
          switch (gameType) {
            case 'finance':
            case 'financial':
              return 'finance';
            case 'brain':
            case 'mental':
              return 'brain';
            case 'uvls':
              return 'uvls';
            case 'dcos':
              return 'dcos';
            case 'moral':
              return 'moral';
            case 'ai':
              return 'ai';
            case 'health-male':
              return 'health-male';
            case 'health-female':
              return 'health-female';
            case 'ehe':
              return 'ehe';
            case 'crgc':
            case 'civic-responsibility':
              return 'crgc';
            case 'sustainability':
              return 'sustainability';
            case 'educational':
              return 'educational';
            default:
              return 'general';
          }
        };

        const normalizeGender = (value) => {
          const normalized = String(value || '').trim().toLowerCase();
          if (!normalized) return '';
          if (normalized.startsWith('m')) return 'male';
          if (normalized.startsWith('f')) return 'female';
          return normalized;
        };

        const childGender = normalizeGender(
          schoolStudent?.personalInfo?.gender ||
          student?.gender ||
          ''
        );

        const basePillarKeys = [
          'finance',
          'brain',
          'uvls',
          'dcos',
          'moral',
          'ai',
          'ehe',
          'crgc',
          'sustainability'
        ];

        const pillarKeys = [...basePillarKeys];
        if (childGender === 'male') {
          pillarKeys.push('health-male');
        } else if (childGender === 'female') {
          pillarKeys.push('health-female');
        }

        const totalPossibleGames = pillarKeys.reduce((sum, key) => {
          return sum + (pillarGameCounts[key] || 0);
        }, 0);

        const completedGames = (gameProgress || []).filter((game) => {
          const pillarKey = mapGameTypeToPillarKey(game.gameType);
          if (!pillarKeys.includes(pillarKey)) return false;
          return Boolean(
            game?.fullyCompleted ||
            (game?.totalLevels && game.levelsCompleted >= game.totalLevels) ||
            game?.badgeAwarded
          );
        }).length;

        const pillarMastery = totalPossibleGames > 0
          ? Math.round((completedGames / totalPossibleGames) * 100)
          : 0;

        // Get recent mood
        const latestMood = recentMoods[0];
        const moodScore = latestMood?.score || 3;
        const moodEmojis = {
          1: '😢', 2: '😔', 3: '😊', 4: '😄', 5: '🤩'
        };

        const totalMinutes = recentActivities.reduce((sum, log) => sum + (log.duration || 0), 0);
        const avgMood = recentMoods.length > 0 ? recentMoods.reduce((sum, log) => sum + (log.score || 3), 0) / recentMoods.length : 3;
        const flagged = totalMinutes < 30 || avgMood < 2.5;

        // Format last active
        // Format last active (handle both Date objects and strings)
        let lastActive = 'Never';
        if (student.lastActive) {
          try {
            lastActive = formatTimeAgo(student.lastActive);
          } catch (error) {
            console.error(`Error formatting lastActive for student ${student._id}:`, error);
            lastActive = 'Unknown';
          }
        }

        // Get class/grade information
        let classInfo = 'N/A';
        let rollNumber = schoolStudent.rollNumber || 'N/A';
        
        try {
          if (schoolStudent.classId) {
            const classData = await SchoolClass.findById(schoolStudent.classId).select('classNumber stream').lean();
            if (classData?.classNumber) {
              classInfo = `Class ${classData.classNumber}${classData.stream ? ` ${classData.stream}` : ''}`;
            }
          }
        } catch (error) {
          console.error(`Error fetching class info for student ${student._id}:`, error);
        }

        // Generate roll number if not exists
        if (!rollNumber || rollNumber === 'N/A') {
          const year = new Date().getFullYear().toString().slice(-2);
          rollNumber = `ROLL${year}${String(index + 1).padStart(4, '0')}`;
        }

        return {
          _id: student._id,
          schoolStudentId: schoolStudent._id,
          name: student.name,
          email: student.email,
          avatar: student.avatar,
          class: classInfo,
          rollNumber: rollNumber,
          level: progress?.level || 1,
          xp: progress?.xp || 0,
          coins: wallet?.balance || 0,
          healCoins: wallet?.balance || 0,
          streak: progress?.streak || 0,
          pillarMastery,
          moodScore,
          moodEmoji: moodEmojis[moodScore] || '😊',
          lastActive,
          flagged,
          admissionNumber: schoolStudent.admissionNumber,
          section: schoolStudent.section,
          academicYear: schoolStudent.academicYear,
          createdAt: student.createdAt
        };
      } catch (error) {
        console.error(`Error enriching student:`, error);
        return null;
      }
    }));

    // Filter out null values
    const validStudents = enrichedStudents.filter(s => s !== null);

    // Get unique classes for filtering
    const classes = [...new Set(validStudents.map(s => s.class).filter(c => c !== 'N/A'))];

    res.json({
      students: validStudents,
      classes: classes.length > 0 ? classes : []
    });
  } catch (error) {
    console.error('Error fetching all students:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get parent information for a specific student
export const getStudentParent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { tenantId, isLegacyUser } = req;

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }

    // Find the student
    const student = await User.findById(studentId).select('name email linkedIds').lean();
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Fetch parent information
    let parentInfo = null;
    if (student.linkedIds && student.linkedIds.parentIds && student.linkedIds.parentIds.length > 0) {
      const parent = await User.findById(student.linkedIds.parentIds[0])
        .select('name email phone avatar childEmail')
        .lean();
      
      if (parent) {
        parentInfo = {
          name: parent.name,
          email: parent.email,
          phone: parent.phone,
          avatar: parent.avatar,
          childEmails: Array.isArray(parent.childEmail) ? parent.childEmail : [parent.childEmail].filter(Boolean)
        };
      }
    }

    if (!parentInfo) {
      return res.status(404).json({ message: 'No parent linked to this student' });
    }

    res.json({
      success: true,
      parent: parentInfo
    });
  } catch (error) {
    console.error('Error fetching parent for student:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Get individual student analytics for teacher (EXACT copy of parent analytics logic)
export const getStudentAnalyticsForTeacher = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { tenantId, isLegacyUser, user: teacher } = req;

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }

    // Fetch student data with parent information
    const student = await User.findById(studentId).select('name email role tenantId createdAt dob avatar academic institution linkedIds gender').lean();

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Verify tenant isolation (if applicable)
    if (!isLegacyUser && tenantId && student.tenantId !== tenantId) {
      return res.status(403).json({ message: 'Access denied to this student' });
    }

    // Fetch school name from SchoolStudent or Organization
    let schoolName = student.institution || 'Not specified';
    let schoolStudentRecord = null;
    try {
      const schoolStudent = await SchoolStudent.findOne({ userId: studentId, tenantId })
        .populate('orgId', 'name')
        .lean();

      schoolStudentRecord = schoolStudent;
      if (schoolStudent?.orgId?.name) {
        schoolName = schoolStudent.orgId.name;
      } else if (tenantId) {
        // Try to get from Organization using tenantId
        const organization = await Organization.findOne({ _id: tenantId }).select('name').lean();
        if (organization?.name) {
          schoolName = organization.name;
        }
      }
    } catch (error) {
      console.error('Error fetching school name:', error);
      // Keep default value
    }

    const normalizeGender = (value) => {
      const normalized = String(value || '').trim().toLowerCase();
      if (!normalized) return '';
      if (normalized.startsWith('m')) return 'male';
      if (normalized.startsWith('f')) return 'female';
      return normalized;
    };

    const childGender = normalizeGender(
      schoolStudentRecord?.personalInfo?.gender ||
      student.gender ||
      ''
    );

    // Fetch parent information
    let parentInfo = null;
    if (student.linkedIds && student.linkedIds.parentIds && student.linkedIds.parentIds.length > 0) {
      const parent = await User.findById(student.linkedIds.parentIds[0])
        .select('name email phone avatar')
        .lean();
      
      if (parent) {
        parentInfo = {
          name: parent.name,
          email: parent.email,
          phone: parent.phone,
          avatar: parent.avatar || '/avatars/avatar1.png'
        };
      }
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Fetch all required data in parallel (SAME AS PARENT)
    const [
      userProgress,
      gameProgress,
      wallet,
      transactions,
      moodLogs,
      activityLogs,
      notifications
    ] = await Promise.all([
      UserProgress.findOne({ userId: studentId }),
      UnifiedGameProgress.find({ userId: studentId }),
      Wallet.findOne({ userId: studentId }),
      Transaction.find({ 
        userId: studentId,
        createdAt: { $gte: sevenDaysAgo }
      }).sort({ createdAt: -1 }).limit(10),
      MoodLog.find({ 
        userId: studentId,
        createdAt: { $gte: sevenDaysAgo }
      }).sort({ createdAt: -1 }).limit(7),
      ActivityLog.find({
        userId: studentId,
        createdAt: { $gte: sevenDaysAgo }
      }).sort({ createdAt: -1 }),
      Notification.find({
        userId: studentId,
        createdAt: { $gte: sevenDaysAgo }
      }).sort({ createdAt: -1 }).limit(10)
    ]);

    const mapGameTypeToPillar = (gameType) => {
      switch (gameType) {
        case 'finance':
        case 'financial':
          return 'Financial Literacy';
        case 'brain':
        case 'mental':
          return 'Brain Health';
        case 'uvls':
          return 'UVLS';
        case 'dcos':
          return 'Digital Citizenship & Online Safety';
        case 'moral':
          return 'Moral Values';
        case 'ai':
          return 'AI for All';
        case 'health-male':
          return 'Health - Male';
        case 'health-female':
          return 'Health - Female';
        case 'ehe':
          return 'Entrepreneurship & Higher Education';
        case 'crgc':
        case 'civic-responsibility':
        case 'sustainability':
          return 'Civic Responsibility & Global Citizenship';
        case 'educational':
          return 'General Education';
        default:
          return 'General Education';
      }
    };

    const getProgressPercent = (game) => {
      if (game?.fullyCompleted) return 100;
      if (game?.totalLevels > 0) {
        return Math.round(((game.levelsCompleted || 0) / game.totalLevels) * 100);
      }
      if (game?.maxScore > 0) {
        return Math.round(((game.highestScore || 0) / game.maxScore) * 100);
      }
      return 0;
    };

    // 1. Calculate Overall Mastery % & Trend (SAME AS PARENT)
    const pillarNames = [
      'Financial Literacy',
      'Brain Health',
      'UVLS',
      'Digital Citizenship & Online Safety',
      'Moral Values',
      'AI for All',
      'Health - Male',
      'Health - Female',
      'Entrepreneurship & Higher Education',
      'Civic Responsibility & Global Citizenship',
      'General Education'
    ];

    const pillarTotals = pillarNames.reduce((acc, pillar) => {
      acc[pillar] = { total: 0, count: 0 };
      return acc;
    }, {});

    (gameProgress || []).forEach((game) => {
      const pillar = mapGameTypeToPillar(game.gameType);
      const progress = getProgressPercent(game);
      if (!pillarTotals[pillar]) {
        pillarTotals[pillar] = { total: 0, count: 0 };
      }
      pillarTotals[pillar].total += progress;
      pillarTotals[pillar].count += 1;
    });

    const pillarsData = pillarNames.reduce((acc, pillar) => {
      const data = pillarTotals[pillar];
      acc[pillar] = data && data.count > 0 ? Math.round(data.total / data.count) : 0;
      return acc;
    }, {});

    const overallMastery = Object.keys(pillarsData).length > 0
      ? Math.round(Object.values(pillarsData).reduce((a, b) => a + b, 0) / Object.keys(pillarsData).length)
      : 0;

    // 2. Weekly Engagement Minutes & Sessions Breakdown (SAME AS PARENT)
    const weeklyEngagement = {
      totalMinutes: 0,
      gamesMinutes: 0,
      lessonsMinutes: 0,
      totalSessions: (activityLogs || []).length,
      gameSessions: 0,
      lessonSessions: 0
    };

    (activityLogs || []).forEach(log => {
      const duration = log.duration || 5;
      weeklyEngagement.totalMinutes += duration;
      
      if (log.activityType === 'game' || log.action?.includes('game')) {
        weeklyEngagement.gamesMinutes += duration;
        weeklyEngagement.gameSessions++;
      } else {
        weeklyEngagement.lessonsMinutes += duration;
        weeklyEngagement.lessonSessions++;
      }
    });

    // 3. Last 7 Mood Entries Summary & Alerts (SAME AS PARENT)
    const moodSummary = {
      entries: (moodLogs || []).map(log => ({
        date: log.createdAt,
        mood: log.mood,
        score: log.score || 3,
        note: log.note || '',
        emoji: log.emoji || '😊'
      })),
      averageScore: (moodLogs || []).length > 0
        ? ((moodLogs || []).reduce((sum, log) => sum + (log.score || 3), 0) / (moodLogs || []).length).toFixed(1)
        : 3.0,
      alerts: []
    };

    // 4. Recent Achievements (SAME AS PARENT)
    const achievements = [];
    (gameProgress || []).forEach(game => {
      if (game.achievements && game.achievements.length > 0) {
        game.achievements.forEach(achievement => {
          achievements.push({
            game: game.game,
            category: game.category,
            achievement: achievement,
            unlockedAt: game.lastPlayed,
            type: 'badge'
          });
        });
      }
      
      if (game.completed) {
        achievements.push({
          game: game.game,
          category: game.category,
          achievement: 'Completion Certificate',
          unlockedAt: game.completedAt || game.lastPlayed,
          type: 'certificate'
        });
      }
    });

    achievements.sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt));
    const recentAchievements = achievements.slice(0, 10);

    // 5. HealCoins Earned & Recent Spends (SAME AS PARENT)
    const coinsEarned = transactions.filter(t => t.type === 'credit');
    const coinsSpent = transactions.filter(t => t.type === 'debit');
    
    const healCoins = {
      currentBalance: wallet?.balance || 0,
      weeklyEarned: coinsEarned.reduce((sum, t) => sum + t.amount, 0),
      weeklySpent: coinsSpent.reduce((sum, t) => sum + Math.abs(t.amount), 0),
      recentTransactions: transactions.slice(0, 5).map(t => ({
        type: t.type,
        amount: t.amount,
        description: t.description,
        date: t.createdAt
      }))
    };

    // 6. Calculate coins (align with parent logic)
    const coinEarnTypes = new Set(['earned', 'earn', 'credit']);
    const weeklyCoinsFromTransactions = (transactions || [])
      .filter(t => coinEarnTypes.has(t.type) && new Date(t.createdAt) >= sevenDaysAgo)
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const monthlyCoinsFromTransactions = (transactions || [])
      .filter(t => coinEarnTypes.has(t.type) && new Date(t.createdAt) >= thirtyDaysAgo)
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const weeklyCoinsFromProgress = (gameProgress || []).reduce((sum, game) => {
      if (!game?.coinsEarnedHistory?.length) return sum;
      const earned = game.coinsEarnedHistory
        .filter((entry) => entry?.earnedAt && new Date(entry.earnedAt) >= sevenDaysAgo)
        .reduce((entrySum, entry) => entrySum + (entry.amount || 0), 0);
      return sum + earned;
    }, 0);

    const monthlyCoinsFromProgress = (gameProgress || []).reduce((sum, game) => {
      if (!game?.coinsEarnedHistory?.length) return sum;
      const earned = game.coinsEarnedHistory
        .filter((entry) => entry?.earnedAt && new Date(entry.earnedAt) >= thirtyDaysAgo)
        .reduce((entrySum, entry) => entrySum + (entry.amount || 0), 0);
      return sum + earned;
    }, 0);

    const weeklyCoins = weeklyCoinsFromTransactions || weeklyCoinsFromProgress;
    const monthlyCoins = monthlyCoinsFromTransactions || monthlyCoinsFromProgress;

    const totalTimeMinutes = Math.round(
      (gameProgress || []).reduce((sum, game) => sum + (game.totalTimePlayed || 0), 0) / 60
    ) || weeklyEngagement.totalMinutes;

    // 7. Games completed per pillar (SAME AS PARENT)
    const gamesPerPillar = {};
    pillarNames.forEach((pillar) => {
      gamesPerPillar[pillar] = 0;
    });

    (gameProgress || []).forEach((game) => {
      const pillar = mapGameTypeToPillar(game.gameType);
      const isCompleted = Boolean(
        game?.fullyCompleted ||
        (game?.totalLevels && game.levelsCompleted >= game.totalLevels) ||
        game?.badgeAwarded
      );
      if (isCompleted) {
        gamesPerPillar[pillar] = (gamesPerPillar[pillar] || 0) + 1;
      }
    });

    // Build home support plan
    const homeSupportPlan = [
      {
        title: 'Complete Daily Practice',
        description: 'Encourage consistent learning habits with daily exercises',
        priority: 'high',
        pillar: 'Routine',
        actionable: 'Set aside 20 minutes daily for practice'
      },
      {
        title: 'Review Key Concepts',
        description: 'Reinforce understanding of recently learned topics',
        priority: 'medium',
        pillar: 'Learning',
        actionable: 'Review 2-3 concepts from last week'
      },
      {
        title: 'Track Progress Together',
        description: 'Monitor achievements and celebrate milestones',
        priority: 'low',
        pillar: 'Motivation',
        actionable: 'Weekly review of progress and goals'
      }
    ];

    // 8. Generate Conversation Prompts based on mood (SAME AS PARENT)
    const conversationPrompts = [];
    if (moodSummary.averageScore < 3) {
      conversationPrompts.push({
        icon: '💙',
        prompt: `"How was your day today, ${student.name}? I noticed you might be feeling a bit down lately."`,
        context: 'Low mood detected this week'
      });
      conversationPrompts.push({
        icon: '🤗',
        prompt: `"Is there anything on your mind that you'd like to talk about?"`,
        context: 'Open-ended support'
      });
    } else if (moodSummary.averageScore >= 4) {
      conversationPrompts.push({
        icon: '🎉',
        prompt: `"You seem to be in a great mood lately! What's been making you happy?"`,
        context: 'Positive mood trend'
      });
      conversationPrompts.push({
        icon: '🌟',
        prompt: `"What's been your favorite part about learning this week?"`,
        context: 'Engagement follow-up'
      });
    } else {
      conversationPrompts.push({
        icon: '😊',
        prompt: `"How was your day today, ${student.name}? Tell me what you learned!"`,
        context: 'General check-in'
      });
      conversationPrompts.push({
        icon: '🎯',
        prompt: `"What are you most excited to learn about next?"`,
        context: 'Goal setting'
      });
    }

    // 9. Strengths and Needs Support (AI-based analysis - SAME AS PARENT)
    const pillarEntries = Object.entries(pillarsData);
    const sortedPillars = pillarEntries.sort((a, b) => b[1] - a[1]);
    
    const strengths = sortedPillars
      .slice(0, 3)
      .map(([pillar, percentage]) => {
        const strengthMap = {
          'Financial Literacy': 'Financial Planning',
          'Brain Health': 'Problem Solving',
          'UVLS': 'Emotional Intelligence',
          'Digital Citizenship & Online Safety': 'Digital Safety',
          'Moral Values': 'Ethical Decision Making',
          'AI for All': 'AI Literacy',
          'Health - Male': 'Health Awareness',
          'Health - Female': 'Health Awareness',
          'Entrepreneurship & Higher Education': 'Entrepreneurial Thinking',
          'Civic Responsibility & Global Citizenship': 'Global Awareness'
        };
        return strengthMap[pillar] || pillar;
      });

    const needsSupport = sortedPillars
      .slice(-3)
      .map(([pillar, percentage]) => {
        const supportMap = {
          'Financial Literacy': 'Advanced Financial Planning',
          'Brain Health': 'Time Management',
          'UVLS': 'Leadership Skills',
          'Digital Citizenship & Online Safety': 'Advanced Coding',
          'Moral Values': 'Ethical Leadership',
          'AI for All': 'Advanced Coding',
          'Health - Male': 'Health Management',
          'Health - Female': 'Health Management',
          'Entrepreneurship & Higher Education': 'Business Strategy',
          'Civic Responsibility & Global Citizenship': 'Community Leadership'
        };
        return supportMap[pillar] || pillar;
      });

    // 10. Activity Timeline (enriched, human-readable)
    const humanizeActivity = (log) => {
      const type = log.activityType || log.type;
      const d = log.details || {};
      const m = log.metadata || {};
      const desc = log.description;

      // If description present, prefer it
      if (desc && typeof desc === 'string' && desc.trim()) return desc.trim();

      // Common fields that can describe the action
      const page = m.page || m.path || d.page || d.path || log.pageUrl;
      const endpoint = d.endpoint || m.endpoint;
      const feature = d.feature || m.feature;
      const actionName = d.action || m.action || log.action;
      const title = d.title || m.title;
      const name = d.name || m.name;
      const game = log.game || d.game || d.gameId || m.game || m.gameId;
      const mood = d.mood || m.mood || d.emoji || m.emoji;
      const level = d.level || m.level;
      const amount = d.amount || d.xp || m.amount || m.xp;

      switch (type) {
        case 'login': return 'Logged in';
        case 'logout': return 'Logged out';
        case 'page_view': return page ? `Viewed ${page}` : 'Viewed a page';
        case 'quiz_completed': return title ? `Completed quiz: ${title}` : 'Completed a quiz';
        case 'challenge_started': return name ? `Started challenge: ${name}` : 'Started a challenge';
        case 'challenge_completed': return name ? `Completed challenge: ${name}` : 'Completed a challenge';
        case 'reward_redeemed': return (name || title) ? `Redeemed reward: ${name || title}` : 'Redeemed a reward';
        case 'xp_earned': return amount ? `Earned ${amount} XP` : 'Earned XP';
        case 'level_up': return level ? `Leveled up to ${level}` : 'Leveled up';
        case 'mood_logged': return mood ? `Logged mood: ${mood}` : 'Logged a mood entry';
        case 'journal_entry': return title ? `Added journal: ${title}` : 'Added a journal entry';
        case 'feature_used': return feature ? `Used feature: ${feature}` : 'Used a feature';
        case 'analytics_view': return 'Viewed analytics';
        case 'student_interaction': return actionName ? `Interaction: ${actionName}` : 'Student interaction';
        case 'feedback_provided': return title ? `Provided feedback: ${title}` : 'Provided feedback';
        case 'assignment_created': return title ? `Created assignment: ${title}` : 'Created an assignment';
        case 'assignment_graded': return title ? `Graded assignment: ${title}` : 'Graded an assignment';
        case 'data_fetch': return endpoint ? `Fetched data: ${endpoint}` : 'Fetched data';
        case 'navigation': return page ? `Navigated to ${page}` : (actionName ? `Navigated: ${actionName}` : 'Navigated');
        case 'ui_interaction': return actionName ? `Interacted with ${actionName}` : (feature ? `Interacted with ${feature}` : 'UI interaction');
        case 'error': return (title || actionName) ? `Error: ${title || actionName}` : 'Error occurred';
        default: {
          // Game/learning fallbacks
          if (game) return `Played game: ${game}`;
          if (title) return title;
          if (actionName && actionName !== 'Activity') return actionName;
          if (page) return `Viewed ${page}`;
          return 'Activity';
        }
      }
    };

    const toDisplayType = (log) => {
      const t = (log.activityType || '').toLowerCase();
      if (t.includes('quiz')) return 'quiz';
      if (t.includes('mood')) return 'mood';
      if (t.includes('game')) return 'game';
      if (t.includes('lesson') || t.includes('page') || t.includes('navigation')) return 'lesson';
      return 'general';
    };

    const activityTimeline = (activityLogs || []).map(log => ({
      type: toDisplayType(log),
      action: humanizeActivity(log),
      category: log.category || log.details?.category || log.metadata?.category || 'General',
      duration: log.duration || log.details?.duration || 5,
      timestamp: log.timestamp || log.createdAt,
      xpEarned: log.xpEarned || log.details?.xp || 0
    }));

    // 11. Messages (SAME AS PARENT)
    const messages = (notifications || [])
      .filter(n => n.type === 'message')
      .slice(0, 5)
      .map(n => ({
        type: n.type,
        title: n.title,
        message: n.message,
        sender: 'System',
        timestamp: n.createdAt,
        read: n.read || false,
        requiresAction: n.title?.toLowerCase().includes('permission') || n.title?.toLowerCase().includes('consent')
      }));

    // 12. Detailed Progress Report Data (SAME AS PARENT)
    const detailedProgressReport = {
      weeklyCoins,
      monthlyCoins,
      totalTimeMinutes,
      dayStreak: userProgress?.streak || 0,
      gamesPerPillar,
      strengths,
      needsSupport,
      childGender
    };

    // 13. Wallet & Rewards Data (SAME AS PARENT)
    const redemptions = (transactions || [])
      .filter(t => t.type === 'spent' && t.description?.toLowerCase().includes('redemption'))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
      .map(t => ({
        item: t.description?.replace('Redemption: ', '') || 'Unknown Item',
        date: t.createdAt,
        coins: Math.abs(t.amount || 0),
        value: Math.abs(t.amount || 0) * 0.67
      }));

    const totalValueSaved = redemptions
      .filter(r => new Date(r.date) >= thirtyDaysAgo)
      .reduce((sum, r) => sum + r.value, 0);

    const walletRewards = {
      currentHealCoins: healCoins.currentBalance || 0,
      recentRedemptions: redemptions,
      totalValueSaved
    };

    // 14. Digital Twin Growth Data (SAME AS PARENT)
    const calculateWeeklyProgress = (gameProgress, category) => {
      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      const weeklyData = [0, 0, 0, 0];
      
      const categoryGames = (gameProgress || []).filter(g => g.category === category);
      
      categoryGames.forEach(game => {
        if (game.completed && game.lastPlayed) {
          const playDate = new Date(game.lastPlayed);
          const weekIndex = Math.min(Math.floor((Date.now() - playDate.getTime()) / (7 * 24 * 60 * 60 * 1000)), 3);
          if (weekIndex >= 0 && weekIndex < 4) {
            weeklyData[weekIndex] += (game.progress || 0) * 0.1;
          }
        }
      });
      
      for (let i = 1; i < 4; i++) {
        if (weeklyData[i] === 0) {
          weeklyData[i] = Math.min(weeklyData[i-1] + Math.random() * 5 + 2, 100);
        }
      }
      
      return weeklyData.map(val => Math.round(Math.min(val, 100)));
    };

    const digitalTwinData = {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      finance: calculateWeeklyProgress(gameProgress, 'Finance'),
      mentalWellness: calculateWeeklyProgress(gameProgress, 'Mental Wellness'),
      values: calculateWeeklyProgress(gameProgress, 'Values'),
      aiSkills: calculateWeeklyProgress(gameProgress, 'AI Skills')
    };

    const mapGameTypeToPillarKey = (gameType) => {
      switch (gameType) {
        case 'finance':
        case 'financial':
          return 'finance';
        case 'brain':
        case 'mental':
          return 'brain';
        case 'uvls':
          return 'uvls';
        case 'dcos':
          return 'dcos';
        case 'moral':
          return 'moral';
        case 'ai':
          return 'ai';
        case 'health-male':
          return 'health-male';
        case 'health-female':
          return 'health-female';
        case 'ehe':
          return 'ehe';
        case 'crgc':
        case 'civic-responsibility':
          return 'crgc';
        case 'sustainability':
          return 'sustainability';
        case 'educational':
          return 'educational';
        default:
          return 'general';
      }
    };

    const mapPillarKeyToLabel = (pillarKey) => {
      switch (pillarKey) {
        case 'finance':
          return 'Financial Literacy';
        case 'brain':
          return 'Brain Health';
        case 'uvls':
          return 'UVLS';
        case 'dcos':
          return 'Digital Citizenship & Online Safety';
        case 'moral':
          return 'Moral Values';
        case 'ai':
          return 'AI for All';
        case 'health-male':
          return 'Health - Male';
        case 'health-female':
          return 'Health - Female';
        case 'ehe':
          return 'Entrepreneurship & Higher Education';
        case 'crgc':
          return 'Civic Responsibility & Global Citizenship';
        case 'sustainability':
          return 'Sustainability';
        case 'educational':
          return 'General Education';
        default:
          return 'General Education';
      }
    };

    const pillarGameCounts = await getAllPillarGameCounts(UnifiedGameProgress);
    const playedGamesByPillar = {};
    const addPlayedGame = (pillarKey, gameId) => {
      if (!pillarKey || !gameId) return;
      if (!playedGamesByPillar[pillarKey]) {
        playedGamesByPillar[pillarKey] = new Set();
      }
      playedGamesByPillar[pillarKey].add(String(gameId));
    };

    (gameProgress || []).forEach((game) => {
      addPlayedGame(mapGameTypeToPillarKey(game.gameType), game.gameId);
    });

    const pillarPlayedPercentages = Object.keys(pillarGameCounts).reduce((acc, pillarKey) => {
      const totalGames = pillarGameCounts[pillarKey] || 0;
      const playedCount = playedGamesByPillar[pillarKey]?.size || 0;
      const percent = totalGames > 0 ? Math.round((playedCount / totalGames) * 100) : 0;
      acc[mapPillarKeyToLabel(pillarKey)] = percent;
      return acc;
    }, {});

    const skillsDistributionByPillar = Object.entries(pillarPlayedPercentages)
      .filter(([pillar]) => {
        if (childGender === 'male') return pillar !== 'Health - Female';
        if (childGender === 'female') return pillar !== 'Health - Male';
        return true;
      })
      .reduce((acc, [pillar, percent]) => {
        acc[pillar] = percent;
        return acc;
      }, {});

    const skillsDistribution = {
      byPillar: skillsDistributionByPillar,
      childGender
    };

    // 16. Child Card Info with Parent Information
    const childCard = {
      name: student.name,
      avatar: student.avatar || '/avatars/avatar1.png',
      email: student.email,
      grade: student.academic?.grade || 'Not specified',
      institution: schoolName,
      age: student.dob ? Math.floor((Date.now() - new Date(student.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : null,
      parentContact: parentInfo ? {
        name: parentInfo.name,
        email: parentInfo.email,
        phone: parentInfo.phone || 'Not provided',
        avatar: parentInfo.avatar
      } : {
        name: 'Not specified',
        email: 'Not specified',
        phone: 'Not specified',
        avatar: '/avatars/avatar1.png'
      }
    };

    // 17. Snapshot KPIs (SAME AS PARENT)
    const totalGamesCompleted = (gameProgress || []).filter((game) => (
      game.fullyCompleted ||
      (game.totalLevels && game.levelsCompleted >= game.totalLevels) ||
      game.badgeAwarded
    )).length;

    const snapshotKPIs = {
      totalGamesCompleted,
      totalTimeSpent: weeklyEngagement.totalMinutes,
      averageDailyEngagement: Math.round(weeklyEngagement.totalMinutes / 7),
      achievementsUnlocked: recentAchievements.length,
      currentStreak: userProgress?.streak || 0,
      moodTrend: parseFloat(moodSummary.averageScore) >= 3.5 ? 'positive' : parseFloat(moodSummary.averageScore) >= 2.5 ? 'neutral' : 'concerning'
    };

    // Return EXACT same structure as parent endpoint
    res.json({
      childCard,
      snapshotKPIs,
      detailedProgressReport,
      walletRewards,
      childName: student.name,
      overallMastery: {
        percentage: overallMastery,
        byPillar: pillarsData
      },
      digitalTwinData,
      skillsDistribution,
      weeklyEngagement,
      moodSummary: {
        ...moodSummary,
        conversationPrompts
      },
      activityTimeline,
      homeSupportPlan,
      messages,
      recentAchievements,
      healCoins,
      level: userProgress?.level || 1,
      xp: userProgress?.xp || 0,
      streak: userProgress?.streak || 0,
      // Also include student object for backward compatibility
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        avatar: student.avatar || '/avatars/avatar1.png',
        grade: student.academic?.grade || 'Not specified',
        institution: schoolName,
        age: student.dob ? Math.floor((Date.now() - new Date(student.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : null,
        level: userProgress?.level || 1,
        xp: userProgress?.xp || 0,
        healCoins: wallet?.balance || 0,
        streak: userProgress?.streak || 0
      },
      // Include analytics object for components that expect it
      analytics: {
        overallMastery,
        weeklyEngagement: weeklyEngagement.totalMinutes,
        totalSessions: weeklyEngagement.totalSessions,
        moodSummary: moodSummary.entries,
        conversationPrompts,
        activityLogs: activityTimeline,
        homeSupportPlan,
        digitalTwinData,
        skillsDistribution,
        notifications,
        recentTransactions: transactions
      }
    });
  } catch (error) {
    console.error('Error fetching student analytics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get student wallet transactions for teacher
export const getStudentTransactionsForTeacher = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { tenantId, user: teacher } = req;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const type = req.query.type;
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }

    const schoolStudent = await SchoolStudent.findOne({ userId: studentId, tenantId })
      .select('classId')
      .lean();

    if (!schoolStudent?.classId) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const classAccess = await SchoolClass.findOne({
      _id: schoolStudent.classId,
      tenantId,
      $or: [
        { 'sections.classTeacher': teacher._id },
        { 'subjects.teachers': teacher._id }
      ]
    }).select('_id').lean();

    if (!classAccess) {
      return res.status(403).json({ message: 'Access denied to this student' });
    }

    const query = { userId: studentId };
    if (type && (type === 'credit' || type === 'debit')) {
      query.type = type;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) {
        endDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDate;
      }
    }

    const totalCount = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      transactions,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error) {
    console.error('Error fetching student transactions:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};

// Get class mastery by pillar
export const getClassMasteryByPillar = async (req, res) => {
  try {
    const { tenantId, isLegacyUser } = req;
    const teacherId = req.user?._id;
    const { timeRange = 'week', classId } = req.query;

    if (!teacherId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Calculate date range based on timeRange
    const now = new Date();
    let startDate = new Date();
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'semester':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // First get the classes assigned to this teacher
    let classQuery = {
      tenantId,
      $or: [
        { 'sections.classTeacher': teacherId },
        { 'subjects.teachers': teacherId }
      ]
    };

    // Filter by specific class if provided
    if (classId && classId !== 'all') {
      classQuery._id = classId;
    }

    const assignedClasses = await SchoolClass.find(classQuery).select('_id').lean();

    const classIds = assignedClasses.map(cls => cls._id);

    if (classIds.length === 0) {
      return res.json({
        'Financial Literacy': 0,
        'Brain Health': 0,
        'UVLS': 0,
        'Digital Citizenship': 0,
        'Moral Values': 0,
        'AI for All': 0
      });
    }

    // Get students assigned to the teacher's classes
    const schoolStudents = await SchoolStudent.find({
      tenantId,
      classId: { $in: classIds }
    }).populate('userId', '_id').lean();

    const studentIds = schoolStudents
      .map(ss => ss.userId?._id)
      .filter(Boolean);

    if (studentIds.length === 0) {
      return res.json({
        'Financial Literacy': 0,
        'Brain Health': 0,
        'UVLS': 0,
        'Digital Citizenship': 0,
        'Moral Values': 0,
        'AI for All': 0
      });
    }

    // Get game progress for all students within time range
    const gameProgress = await UnifiedGameProgress.find({
      userId: { $in: studentIds },
      updatedAt: { $gte: startDate }
    }).lean();

    const mapGameTypeToPillar = (gameType) => {
      switch (gameType) {
        case 'finance':
        case 'financial':
          return 'Financial Literacy';
        case 'brain':
        case 'mental':
          return 'Brain Health';
        case 'uvls':
          return 'UVLS';
        case 'dcos':
          return 'Digital Citizenship & Online Safety';
        case 'moral':
          return 'Moral Values';
        case 'ai':
          return 'AI for All';
        case 'health-male':
          return 'Health - Male';
        case 'health-female':
          return 'Health - Female';
        case 'ehe':
          return 'Entrepreneurship & Higher Education';
        case 'crgc':
        case 'civic-responsibility':
        case 'sustainability':
          return 'Civic Responsibility & Global Citizenship';
        default:
          return 'General Education';
      }
    };

    const getProgressPercent = (game) => {
      if (game?.fullyCompleted) return 100;
      if (game?.totalLevels > 0) {
        return Math.round(((game.levelsCompleted || 0) / game.totalLevels) * 100);
      }
      if (game?.maxScore > 0) {
        return Math.round(((game.highestScore || 0) / game.maxScore) * 100);
      }
      return 0;
    };

    // Calculate mastery by pillar from actual progress data
    const pillarNames = [
      'Financial Literacy',
      'Brain Health',
      'UVLS',
      'Digital Citizenship & Online Safety',
      'Moral Values',
      'AI for All',
      'Health - Male',
      'Health - Female',
      'Entrepreneurship & Higher Education',
      'Civic Responsibility & Global Citizenship',
      'Sustainability'
    ];

    const pillarTotals = pillarNames.reduce((acc, pillar) => {
      acc[pillar] = { total: 0, count: 0 };
      return acc;
    }, {});

    (gameProgress || []).forEach((game) => {
      const pillar = mapGameTypeToPillar(game.gameType);
      const progress = getProgressPercent(game);
      if (!pillarTotals[pillar]) {
        pillarTotals[pillar] = { total: 0, count: 0 };
      }
      pillarTotals[pillar].total += progress;
      pillarTotals[pillar].count += 1;
    });

    const classMastery = pillarNames.reduce((acc, pillar) => {
      const data = pillarTotals[pillar];
      acc[pillar] = data && data.count > 0 ? Math.round(data.total / data.count) : 0;
      return acc;
    }, {});

    res.json(classMastery);
  } catch (error) {
    console.error('Error fetching class mastery:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get students at risk
export const getStudentsAtRisk = async (req, res) => {
  try {
    const { tenantId, isLegacyUser } = req;
    const teacherId = req.user._id;
    const { timeRange = 'week', classId } = req.query;

    // Calculate date range based on timeRange
    const now = new Date();
    let startDate = new Date();
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'semester':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // First get the classes assigned to this teacher
    let classQuery = {
      tenantId,
      $or: [
        { 'sections.classTeacher': teacherId },
        { 'subjects.teachers': teacherId }
      ]
    };

    // Filter by specific class if provided
    if (classId && classId !== 'all') {
      classQuery._id = classId;
    }

    const assignedClasses = await SchoolClass.find(classQuery).select('_id').lean();

    const classIds = assignedClasses.map(cls => cls._id);

    if (classIds.length === 0) {
      return res.json({ students: [] });
    }

    // Get students assigned to the teacher's classes
    const schoolStudents = await SchoolStudent.find({
      tenantId,
      classId: { $in: classIds }
    }).populate('userId', '_id name avatar').lean();

    const students = schoolStudents.map(ss => ss.userId).filter(Boolean);
    const atRiskStudents = [];

    // Check each student for risk factors
    for (const student of students) {
      // Check engagement
      const recentActivities = await ActivityLog.find({
        userId: student._id,
        createdAt: { $gte: startDate }
      }).lean();

      const totalMinutes = recentActivities.reduce((sum, log) => sum + (log.duration || 0), 0);

      // Check mood
      const recentMoods = await MoodLog.find({
        userId: student._id,
        createdAt: { $gte: startDate }
      }).lean();

      const avgMood = recentMoods.length > 0
        ? recentMoods.reduce((sum, log) => sum + (log.score || 3), 0) / recentMoods.length
        : 3;

      // Flag if low engagement (< 30 min/week) or low mood (< 2.5)
      if (totalMinutes < 30) {
        atRiskStudents.push({
          _id: student._id,
          name: student.name,
          avatar: student.avatar,
          reason: 'Low engagement',
          riskLevel: 'High',
          metric: `${totalMinutes}min/week`
        });
      } else if (avgMood < 2.5) {
        atRiskStudents.push({
          _id: student._id,
          name: student.name,
          avatar: student.avatar,
          reason: 'Low mood pattern',
          riskLevel: 'Medium',
          metric: `Avg mood: ${avgMood.toFixed(1)}`
        });
      }
    }

    res.json({ students: atRiskStudents.slice(0, 10) }); // Top 10 at-risk students
  } catch (error) {
    console.error('Error fetching students at risk:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get average session engagement
export const getSessionEngagement = async (req, res) => {
  try {
    const { tenantId, isLegacyUser } = req;
    const teacherId = req.user?._id;
    const { timeRange = 'week', classId } = req.query;

    if (!teacherId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Calculate date range based on timeRange
    const now = new Date();
    let startDate = new Date();
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'semester':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // First get the classes assigned to this teacher
    let classQuery = {
      tenantId,
      $or: [
        { 'sections.classTeacher': teacherId },
        { 'subjects.teachers': teacherId }
      ]
    };

    // Filter by specific class if provided
    if (classId && classId !== 'all') {
      classQuery._id = classId;
    }

    const assignedClasses = await SchoolClass.find(classQuery).select('_id').lean();

    const classIds = assignedClasses.map(cls => cls._id);

    if (classIds.length === 0) {
      return res.json({ 
        averageEngagement: 0,
        totalSessions: 0,
        engagementTrend: []
      });
    }

    // Get students assigned to the teacher's classes
    const schoolStudents = await SchoolStudent.find({
      tenantId,
      classId: { $in: classIds }
    }).populate('userId', '_id').lean();

    const studentIds = schoolStudents
      .map(ss => ss.userId?._id)
      .filter(Boolean);

    if (studentIds.length === 0) {
      return res.json({ 
        averageEngagement: 0,
        totalSessions: 0,
        engagementTrend: [],
        games: 0,
        lessons: 0,
        overall: 0
      });
    }

    const activeGameUsers = await UnifiedGameProgress.distinct('userId', {
      userId: { $in: studentIds },
      lastPlayedAt: { $gte: startDate }
    });

    const totalStudents = studentIds.length;
    const gamesPercent = totalStudents > 0
      ? Math.round((activeGameUsers.length / totalStudents) * 100)
      : 0;

    const engagement = {
      games: gamesPercent,
      lessons: 0,
      overall: gamesPercent
    };

    res.json(engagement);
  } catch (error) {
    console.error('Error fetching session engagement:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get pending grading tasks
export const getPendingTasks = async (req, res) => {
  try {
    const { tenantId, user } = req;

    // Get all active assignments for this teacher
    const assignments = await Assignment.find({
      tenantId,
      teacherId: user._id,
      isActive: true,
      status: { $in: ['published', 'in_progress'] }
    })
      .sort({ dueDate: 1 })
      .lean();

    // Get tasks that need grading (have submitted attempts that aren't graded)
    const tasksWithPendingGrading = await Promise.all(
      assignments.map(async (assignment) => {
        try {
          const submittedAttempts = await AssignmentAttempt.countDocuments({
            assignmentId: assignment._id,
            tenantId,
            status: 'submitted',
            graded: { $ne: true }
          });

          const totalAttempts = await AssignmentAttempt.countDocuments({
            assignmentId: assignment._id,
            tenantId
          });

          // Only include if there are submissions to grade
          if (submittedAttempts > 0) {
            return {
              _id: assignment._id,
              title: assignment.title,
              class: assignment.className || assignment.class || 'N/A',
              section: assignment.section || 'N/A',
              dueDate: assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'N/A',
              priority: submittedAttempts > 10 ? 'high' : submittedAttempts > 5 ? 'medium' : 'low',
              type: assignment.type || 'homework',
              status: assignment.status || 'published',
              submissions: submittedAttempts,
              totalStudents: totalAttempts
            };
          }
          return null;
        } catch (err) {
          console.error(`Error processing assignment ${assignment._id}:`, err);
          return null;
        }
      })
    );

    // Filter out null values and sort by priority and due date
    const tasks = tasksWithPendingGrading
      .filter(task => task !== null)
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return new Date(a.dueDate) - new Date(b.dueDate);
      });

    res.json({ tasks });
  } catch (error) {
    console.error('Error fetching pending tasks:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Get top 5 students leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const { tenantId, isLegacyUser } = req;
    const teacherId = req.user._id;
    const { timeRange = 'week', classId } = req.query;

    // First get the classes assigned to this teacher
    let classQuery = {
      tenantId,
      $or: [
        { 'sections.classTeacher': teacherId },
        { 'subjects.teachers': teacherId }
      ]
    };

    // Filter by specific class if provided
    if (classId && classId !== 'all') {
      classQuery._id = classId;
    }

    const assignedClasses = await SchoolClass.find(classQuery).select('_id').lean();

    const classIds = assignedClasses.map(cls => cls._id);

    if (classIds.length === 0) {
      return res.json({ leaderboard: [] });
    }

    // Get students assigned to the teacher's classes
    const schoolStudents = await SchoolStudent.find({
      tenantId,
      classId: { $in: classIds }
    }).populate('userId', '_id name avatar').lean();

    const students = schoolStudents.map(ss => ss.userId).filter(Boolean);
    
    // Get progress and wallet for each student
    const leaderboardData = await Promise.all(
      students.map(async (student) => {
        const [progress, wallet] = await Promise.all([
          UserProgress.findOne({ userId: student._id }).lean(),
          Wallet.findOne({ userId: student._id }).lean()
        ]);

        return {
          _id: student._id,
          name: student.name,
          avatar: student.avatar,
          class: 'N/A', // TODO: Get from student profile
          totalXP: progress?.xp || 0,
          level: progress?.level || 1,
          healCoins: wallet?.balance || 0,
          streak: progress?.streak || 0
        };
      })
    );

    // Sort by total XP (descending) and take top 5
    const topStudents = leaderboardData
      .sort((a, b) => {
        // Primary sort by XP
        if (b.totalXP !== a.totalXP) {
          return b.totalXP - a.totalXP;
        }
        // Secondary sort by level
        if (b.level !== a.level) {
          return b.level - a.level;
        }
        // Tertiary sort by streak
        return b.streak - a.streak;
      })
      .slice(0, 5);

    res.json({ leaderboard: topStudents });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
  };
  
const buildTeacherAnalyticsPdf = (reportData, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 40, bottom: 40, left: 40, right: 40 }
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      const colors = {
        primary: '#4F46E5',
        accent: '#EC4899',
        deep: '#312E81',
        text: '#0F172A',
        subText: '#475569',
        muted: '#E2E8F0',
        light: '#F8FAFC',
        border: '#CBD5F5'
      };

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const marginX = 40;
      const marginBottom = 40;

      let y = 40;

      const hexToRgb = (hex) => {
        const clean = hex.replace('#', '');
        const num = parseInt(clean, 16);
        return {
          r: (num >> 16) & 255,
          g: (num >> 8) & 255,
          b: num & 255
        };
      };

      const mixColor = (startHex, endHex, ratio) => {
        const start = hexToRgb(startHex);
        const end = hexToRgb(endHex);
        const mix = (a, b) => Math.round(a + (b - a) * ratio);
        const r = mix(start.r, end.r);
        const g = mix(start.g, end.g);
        const b = mix(start.b, end.b);
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      };

      const drawGradientBand = (startY, height, startColor, endColor) => {
        const steps = 8;
        const stepHeight = height / steps;
        for (let i = 0; i < steps; i += 1) {
          const color = mixColor(startColor, endColor, i / (steps - 1));
          doc.rect(0, startY + i * stepHeight, pageWidth, stepHeight).fill(color);
        }
      };

      const addPageHeader = () => {
        doc.rect(0, 0, pageWidth, 30).fill(colors.light);
        doc.rect(0, 30, pageWidth, 2).fill(colors.muted);
        doc.fillColor(colors.subText).font('Helvetica-Bold').fontSize(9).text('Class Analytics Report', marginX, 10);
      };

      const ensureSpace = (needed) => {
        if (y + needed > pageHeight - marginBottom) {
          doc.addPage();
          y = 40;
          addPageHeader();
          y = 50;
        }
      };

      const addSectionHeader = (title) => {
        y += 16;
        ensureSpace(48);
        doc.fillColor(colors.text).font('Helvetica-Bold').fontSize(14).text(title, marginX, y);
        doc.rect(marginX, y + 18, 48, 3).fill(colors.accent);
        y += 42;
      };

      const drawHeader = () => {
        drawGradientBand(0, 110, colors.primary, colors.accent);
        doc.rect(0, 110, pageWidth, 8).fill(colors.deep);
        doc.fillColor('white').font('Helvetica-Bold').fontSize(20).text('Class Analytics Report', marginX, 30);
        const subtitle = `${options.teacherName || 'Teacher'} | ${reportData.timeRange} | ${new Date(reportData.generatedAt).toLocaleDateString()}`;
        doc.font('Helvetica').fontSize(11).text(subtitle, marginX, 58);
        doc.fillColor('white').font('Helvetica').fontSize(9).text('Generated by WiseStudent Analytics', marginX, 78);
        y = 130;
      };

      const drawSummaryCards = () => {
        const cards = [
          { label: 'Total Classes', value: reportData.summary.totalClasses },
          { label: 'Total Students', value: reportData.summary.totalStudents },
          { label: 'Average Mastery', value: `${reportData.summary.averageMastery}%` },
          { label: 'Engagement Rate', value: `${reportData.summary.engagementRate}%` },
          { label: 'Students At Risk', value: reportData.summary.studentsAtRiskCount }
        ];

        const cardWidth = (pageWidth - (marginX * 2) - 20) / 2;
        const cardHeight = 64;
        const rowGap = 12;
        const colGap = 20;
        const rows = Math.ceil(cards.length / 2);

        ensureSpace(rows * (cardHeight + rowGap));

        cards.forEach((card, index) => {
          const col = index % 2;
          const row = Math.floor(index / 2);
          const x = marginX + col * (cardWidth + colGap);
          const yCard = y + row * (cardHeight + rowGap);

          doc.roundedRect(x, yCard, cardWidth, cardHeight, 10).fill(colors.light).stroke(colors.border);
          doc.rect(x, yCard, 6, cardHeight).fill(colors.accent);
          doc.fillColor(colors.subText).font('Helvetica-Bold').fontSize(10).text(card.label, x + 16, yCard + 12);
          doc.fillColor(colors.text).font('Helvetica-Bold').fontSize(18).text(String(card.value), x + 16, yCard + 32);
        });

        y += rows * (cardHeight + rowGap);
      };

      const pillarStyles = {
        'Financial Literacy': { short: 'FL', color: '#2563EB' },
        'Brain Health': { short: 'BH', color: '#16A34A' },
        'UVLS': { short: 'UV', color: '#F97316' },
        'Digital Citizenship': { short: 'DC', color: '#0EA5E9' },
        'Moral Values': { short: 'MV', color: '#8B5CF6' },
        'AI for All': { short: 'AI', color: '#EC4899' },
        'Health - Male': { short: 'HM', color: '#14B8A6' },
        'Health - Female': { short: 'HF', color: '#F43F5E' },
        'Entrepreneurship & Higher Education': { short: 'EH', color: '#6366F1' },
        'Civic Responsibility & Global Citizenship': { short: 'CG', color: '#22C55E' },
        'Sustainability': { short: 'SU', color: '#84CC16' },
        'Games': { short: 'GM', color: '#F59E0B' }
      };

      const drawPillarRow = (label, value) => {
        ensureSpace(40);
        const style = pillarStyles[label] || { short: label.slice(0, 2).toUpperCase(), color: colors.primary };
        const iconX = marginX;
        const iconY = y + 6;
        doc.circle(iconX + 10, iconY + 10, 10).fill(style.color);
        doc.fillColor('white').font('Helvetica-Bold').fontSize(8).text(style.short, iconX + 3, iconY + 6);
        doc.fillColor(colors.text).font('Helvetica-Bold').fontSize(10).text(label, iconX + 28, y + 4);
        doc.fillColor(colors.subText).font('Helvetica').fontSize(9).text(`${value}%`, pageWidth - marginX - 28, y + 4, { align: 'right' });
        const barY = y + 20;
        const barX = iconX + 28;
        const barWidth = pageWidth - marginX - barX;
        doc.roundedRect(barX, barY, barWidth, 10, 5).fill(colors.muted);
        const fillWidth = Math.max(0, Math.min(100, value)) / 100 * barWidth;
        const fillColor = value >= 75 ? '#16A34A' : value >= 50 ? colors.primary : '#D97706';
        doc.roundedRect(barX, barY, fillWidth, 10, 5).fill(fillColor);
        y += 36;
      };

      const drawClasses = () => {
        const classes = reportData.classes || [];
        if (classes.length === 0) {
          ensureSpace(18);
          doc.fillColor(colors.subText).font('Helvetica').fontSize(9).text('No class filter applied.', marginX, y);
          y += 14;
          return;
        }

        let x = marginX;
        const maxWidth = pageWidth - marginX * 2;
        const gap = 8;
        ensureSpace(18);
        classes.forEach((cls) => {
          const label = cls.name || `Class ${cls.classNumber || ''}`.trim();
          doc.font('Helvetica-Bold').fontSize(8);
          const width = doc.widthOfString(label) + 16;
          if (x + width > marginX + maxWidth) {
            x = marginX;
            y += 18;
            ensureSpace(18);
          }
          doc.roundedRect(x, y, width, 14, 7).fill(colors.light).stroke(colors.muted);
          doc.fillColor(colors.subText).text(label, x + 8, y + 3);
          x += width + gap;
        });
        y += 22;
      };

      const drawTable = (headers, rows, columnWidths) => {
        ensureSpace(24);
        const headerHeight = 18;
        const rowHeight = 18;
        let x = marginX;
        doc.rect(marginX, y, pageWidth - marginX * 2, headerHeight).fill(colors.light).stroke(colors.muted);
        headers.forEach((header, index) => {
          doc.fillColor(colors.subText).font('Helvetica-Bold').fontSize(9).text(header, x + 6, y + 5);
          x += columnWidths[index];
        });
        y += headerHeight;

        rows.forEach((row, index) => {
          ensureSpace(rowHeight + 6);
          const rowColor = index % 2 === 0 ? '#FFFFFF' : colors.light;
          doc.rect(marginX, y, pageWidth - marginX * 2, rowHeight).fill(rowColor).stroke(colors.muted);
          let cellX = marginX;
          row.forEach((cell, colIndex) => {
            doc.fillColor(colors.text).font('Helvetica').fontSize(9).text(String(cell), cellX + 6, y + 5, {
              width: columnWidths[colIndex] - 8,
              ellipsis: true
            });
            cellX += columnWidths[colIndex];
          });
          y += rowHeight;
        });
        y += 10;
      };

      drawHeader();

      addSectionHeader('Summary');
      drawSummaryCards();

      addSectionHeader('Classes Covered');
      drawClasses();

      addSectionHeader('Pillar Mastery');
      Object.entries(reportData.mastery || {}).forEach(([pillar, percentage]) => {
        drawPillarRow(pillar, percentage || 0);
      });

      addSectionHeader('Engagement');
      drawPillarRow('Games', reportData.engagement?.games || 0);

      addSectionHeader('Students Requiring Attention');
      const riskRows = (reportData.studentsAtRisk || []).slice(0, 8).map((student) => {
        return [
          student.name,
          student.reason,
          student.riskLevel,
          student.metric || ''
        ];
      });
      if (riskRows.length === 0) {
        ensureSpace(18);
        doc.fillColor(colors.subText).font('Helvetica').fontSize(9).text('No students currently at risk.', marginX, y);
        y += 16;
      } else {
        drawTable(
          ['Student', 'Reason', 'Risk', 'Metric'],
          riskRows,
          [160, 160, 80, 110]
        );
      }

      addSectionHeader('Class Leaderboard');
      const leaderboardRows = (reportData.leaderboard || []).map((student, index) => {
        return [
          `${index + 1}`,
          student.name,
          `L${student.level}`,
          `${student.totalXP} XP`,
          `${student.healCoins} Coins`
        ];
      });
      if (leaderboardRows.length === 0) {
        ensureSpace(18);
        doc.fillColor(colors.subText).font('Helvetica').fontSize(9).text('No leaderboard data available.', marginX, y);
        y += 16;
      } else {
        drawTable(
          ['#', 'Student', 'Level', 'XP', 'Coins'],
          leaderboardRows,
          [24, 200, 60, 80, 90]
        );
      }

      const footerY = pageHeight - marginBottom - 12;
      doc.fillColor(colors.subText).font('Helvetica').fontSize(8).text('Confidential - WiseStudent Teacher Analytics', marginX, footerY);
      doc.text(`Generated ${new Date(reportData.generatedAt).toLocaleString()}`, marginX, footerY, { align: 'right' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

const buildSchoolAnalyticsPdf = (reportData, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 40, bottom: 40, left: 40, right: 40 }
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      const colors = {
        primary: '#4F46E5',
        accent: '#EC4899',
        deep: '#312E81',
        text: '#0F172A',
        subText: '#475569',
        muted: '#E2E8F0',
        light: '#F8FAFC',
        border: '#CBD5F5'
      };

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const marginX = 40;
      const marginBottom = 40;
      let y = 40;

      const hexToRgb = (hex) => {
        const clean = hex.replace('#', '');
        const num = parseInt(clean, 16);
        return {
          r: (num >> 16) & 255,
          g: (num >> 8) & 255,
          b: num & 255
        };
      };

      const mixColor = (startHex, endHex, ratio) => {
        const start = hexToRgb(startHex);
        const end = hexToRgb(endHex);
        const mix = (a, b) => Math.round(a + (b - a) * ratio);
        const r = mix(start.r, end.r);
        const g = mix(start.g, end.g);
        const b = mix(start.b, end.b);
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      };

      const drawGradientBand = (startY, height, startColor, endColor) => {
        const steps = 8;
        const stepHeight = height / steps;
        for (let i = 0; i < steps; i += 1) {
          const color = mixColor(startColor, endColor, i / (steps - 1));
          doc.rect(0, startY + i * stepHeight, pageWidth, stepHeight).fill(color);
        }
      };

      const addPageHeader = () => {
        doc.rect(0, 0, pageWidth, 30).fill(colors.light);
        doc.rect(0, 30, pageWidth, 2).fill(colors.muted);
        doc.fillColor(colors.subText).font('Helvetica-Bold').fontSize(9).text('School Analytics Report', marginX, 10);
      };

      const ensureSpace = (needed) => {
        if (y + needed > pageHeight - marginBottom) {
          doc.addPage();
          y = 40;
          addPageHeader();
          y = 50;
        }
      };

      const addSectionHeader = (title) => {
        y += 16;
        ensureSpace(48);
        doc.fillColor(colors.text).font('Helvetica-Bold').fontSize(14).text(title, marginX, y);
        doc.rect(marginX, y + 18, 48, 3).fill(colors.accent);
        y += 42;
      };

      const drawHeader = () => {
        drawGradientBand(0, 110, colors.primary, colors.accent);
        doc.rect(0, 110, pageWidth, 8).fill(colors.deep);
        doc.fillColor('white').font('Helvetica-Bold').fontSize(20).text('School Analytics Report', marginX, 30);
        const subtitle = `${options.schoolName || 'School'} | ${reportData.timeRange} | ${new Date(reportData.generatedAt).toLocaleDateString()}`;
        doc.font('Helvetica').fontSize(11).text(subtitle, marginX, 58);
        doc.fillColor('white').font('Helvetica').fontSize(9).text('Generated by WiseStudent Analytics', marginX, 78);
        y = 130;
      };

      const drawSummaryCards = () => {
        const cards = [
          { label: 'Total Students', value: reportData.summary.totalStudents },
          { label: 'Active Students', value: reportData.summary.activeStudents },
          { label: 'Adoption Rate', value: `${reportData.summary.adoptionRate}%` },
          { label: 'Total Teachers', value: reportData.summary.totalTeachers },
          { label: 'Avg Pillar Mastery', value: `${reportData.summary.avgPillarMastery}%` }
        ];

        const cardWidth = (pageWidth - marginX * 2 - 20) / 2;
        const cardHeight = 64;
        const rowGap = 12;
        const colGap = 20;
        const rows = Math.ceil(cards.length / 2);

        ensureSpace(rows * (cardHeight + rowGap));

        cards.forEach((card, index) => {
          const col = index % 2;
          const row = Math.floor(index / 2);
          const x = marginX + col * (cardWidth + colGap);
          const yCard = y + row * (cardHeight + rowGap);

          doc.roundedRect(x, yCard, cardWidth, cardHeight, 10).fill(colors.light).stroke(colors.border);
          doc.rect(x, yCard, 6, cardHeight).fill(colors.accent);
          doc.fillColor(colors.subText).font('Helvetica-Bold').fontSize(10).text(card.label, x + 16, yCard + 12);
          doc.fillColor(colors.text).font('Helvetica-Bold').fontSize(18).text(String(card.value), x + 16, yCard + 32);
        });

        y += rows * (cardHeight + rowGap);
      };

      const pillarLabelMap = {
        finance: 'Financial Literacy',
        brain: 'Brain Health',
        uvls: 'UVLS (Life Skills & Values)',
        dcos: 'Digital Citizenship & Online Safety',
        moral: 'Moral Values',
        ai: 'AI for All',
        'health-male': 'Health - Male',
        'health-female': 'Health - Female',
        ehe: 'Entrepreneurship & Higher Education',
        crgc: 'Civic Responsibility & Global Citizenship',
        sustainability: 'Sustainability'
      };

      const pillarStyles = {
        'Financial Literacy': { short: 'FL', color: '#2563EB' },
        'Brain Health': { short: 'BH', color: '#16A34A' },
        'UVLS (Life Skills & Values)': { short: 'UV', color: '#F97316' },
        'Digital Citizenship & Online Safety': { short: 'DC', color: '#0EA5E9' },
        'Moral Values': { short: 'MV', color: '#8B5CF6' },
        'AI for All': { short: 'AI', color: '#EC4899' },
        'Health - Male': { short: 'HM', color: '#14B8A6' },
        'Health - Female': { short: 'HF', color: '#F43F5E' },
        'Entrepreneurship & Higher Education': { short: 'EH', color: '#6366F1' },
        'Civic Responsibility & Global Citizenship': { short: 'CG', color: '#22C55E' },
        'Sustainability': { short: 'SU', color: '#84CC16' }
      };

      const drawPillarBars = () => {
        addSectionHeader('Pillar Mastery');
        const pillarEntries = Object.entries(reportData.pillars || {});
        if (!pillarEntries.length) {
          doc.fillColor(colors.subText).font('Helvetica').fontSize(10).text('No pillar mastery data available.', marginX, y);
          y += 20;
          return;
        }

        pillarEntries.forEach(([pillar, value]) => {
          ensureSpace(40);
          const label = pillarLabelMap[pillar] || pillar;
          const percent = Math.max(0, Math.min(100, value || 0));
          const style = pillarStyles[label] || { short: label.slice(0, 2).toUpperCase(), color: colors.primary };

          const iconX = marginX;
          const iconY = y + 6;
          doc.circle(iconX + 10, iconY + 10, 10).fill(style.color);
          doc.fillColor('white').font('Helvetica-Bold').fontSize(8).text(style.short, iconX + 3, iconY + 6);
          doc.fillColor(colors.text).font('Helvetica-Bold').fontSize(10).text(label, iconX + 28, y + 4);
          doc.fillColor(colors.subText).font('Helvetica').fontSize(9).text(`${percent}%`, pageWidth - marginX - 28, y + 4, { align: 'right' });

          const barY = y + 20;
          const barX = iconX + 28;
          const barWidth = pageWidth - marginX - barX;
          doc.roundedRect(barX, barY, barWidth, 10, 5).fill(colors.muted);
          const fillWidth = (percent / 100) * barWidth;
          const fillColor = percent >= 75 ? '#16A34A' : percent >= 50 ? colors.primary : '#D97706';
          doc.roundedRect(barX, barY, fillWidth, 10, 5).fill(fillColor);
          y += 36;
        });
      };

      const drawEngagementTrend = () => {
        addSectionHeader('Engagement Trend');
        const trend = reportData.engagementTrend || [];
        if (!trend.length) {
          doc.fillColor(colors.subText).font('Helvetica').fontSize(10).text('No engagement data available.', marginX, y);
          y += 20;
          return;
        }

        const chartHeight = 170;
        const chartWidth = pageWidth - marginX * 2;
        ensureSpace(chartHeight + 38);
        const chartX = marginX;
        const chartY = y;
        const studentColor = '#3B82F6';
        const teacherColor = '#8B5CF6';

        const maxValue = Math.max(
          1,
          ...trend.map((point) => Math.max(point.students || 0, point.teachers || 0))
        );

        const plotPoint = (value, index) => {
          const x = chartX + (chartWidth * index) / Math.max(1, trend.length - 1);
          const yPoint = chartY + chartHeight - (value / maxValue) * chartHeight;
          return { x, y: yPoint };
        };

        const buildSmoothPath = (points) => {
          if (points.length < 2) return;
          for (let i = 0; i < points.length - 1; i += 1) {
            const p0 = i > 0 ? points[i - 1] : points[i];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = i + 2 < points.length ? points[i + 2] : p2;

            const c1 = {
              x: p1.x + (p2.x - p0.x) / 6,
              y: p1.y + (p2.y - p0.y) / 6
            };
            const c2 = {
              x: p2.x - (p3.x - p1.x) / 6,
              y: p2.y - (p3.y - p1.y) / 6
            };

            doc.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, p2.x, p2.y);
          }
        };

        // Grid lines
        doc.strokeColor(colors.muted).lineWidth(1);
        [0.25, 0.5, 0.75].forEach((ratio) => {
          const yLine = chartY + chartHeight * ratio;
          doc.moveTo(chartX, yLine).lineTo(chartX + chartWidth, yLine).stroke();
        });

        // Axes
        doc.moveTo(chartX, chartY).lineTo(chartX, chartY + chartHeight).stroke();
        doc.moveTo(chartX, chartY + chartHeight).lineTo(chartX + chartWidth, chartY + chartHeight).stroke();

        const drawSeries = (key, color) => {
          const points = trend.map((point, index) => plotPoint(point[key] || 0, index));
          if (!points.length) return;

          doc.save();
          doc.fillColor(color).fillOpacity(0.12);
          doc.moveTo(points[0].x, chartY + chartHeight);
          doc.lineTo(points[0].x, points[0].y);
          if (points.length > 1) {
            buildSmoothPath(points);
          }
          doc.lineTo(points[points.length - 1].x, chartY + chartHeight);
          doc.closePath().fill();
          doc.fillOpacity(1);
          doc.restore();

          doc.strokeColor(color).lineWidth(2).lineCap('round').lineJoin('round');
          doc.moveTo(points[0].x, points[0].y);
          if (points.length > 1) {
            buildSmoothPath(points);
          }
          doc.stroke();

          points.forEach((point) => {
            doc.circle(point.x, point.y, 2.5).fill(color);
          });
        };

        drawSeries('students', studentColor);
        drawSeries('teachers', teacherColor);

        // Legend
        const legendY = chartY + chartHeight + 12;
        doc.fillColor(studentColor).circle(chartX + 4, legendY + 4, 4).fill();
        doc.fillColor(colors.subText).font('Helvetica').fontSize(9).text('Students', chartX + 14, legendY);
        doc.fillColor(teacherColor).circle(chartX + 90, legendY + 4, 4).fill();
        doc.fillColor(colors.subText).font('Helvetica').fontSize(9).text('Teachers', chartX + 100, legendY);

        // X labels (first, mid, last)
        const labelIndices = [0, Math.floor(trend.length / 2), trend.length - 1].filter(
          (value, index, self) => self.indexOf(value) === index
        );
        labelIndices.forEach((idx) => {
          const point = trend[idx];
          const label = point.label || point.date || '';
          const x = chartX + (chartWidth * idx) / Math.max(1, trend.length - 1);
          const textWidth = doc.widthOfString(label);
          doc.fillColor(colors.subText).font('Helvetica').fontSize(8).text(label, x - textWidth / 2, chartY + chartHeight + 4, {
            lineBreak: false
          });
        });

        y += chartHeight + 30;
      };

      const drawPerformanceByGrade = () => {
        addSectionHeader('Performance by Grade');
        const grades = reportData.performanceByGrade || [];
        if (!grades.length) {
          doc.fillColor(colors.subText).font('Helvetica').fontSize(10).text('No grade performance data available.', marginX, y);
          y += 20;
          return;
        }

        const chartHeight = 160;
        const chartWidth = pageWidth - marginX * 2;
        ensureSpace(chartHeight + 36);
        const chartX = marginX;
        const chartY = y;
        const maxValue = Math.max(1, ...grades.map((item) => item.avgScore || 0));

        doc.strokeColor(colors.muted).lineWidth(1);
        doc.moveTo(chartX, chartY).lineTo(chartX, chartY + chartHeight).stroke();
        doc.moveTo(chartX, chartY + chartHeight).lineTo(chartX + chartWidth, chartY + chartHeight).stroke();

        const barColor = '#8B5CF6';
        const barCount = grades.length;
        const slotWidth = chartWidth / Math.max(1, barCount);
        const barWidth = Math.min(36, slotWidth * 0.6);

        grades.forEach((grade, index) => {
          const value = Math.max(0, grade.avgScore || 0);
          const barHeight = (value / maxValue) * (chartHeight - 12);
          const barX = chartX + index * slotWidth + (slotWidth - barWidth) / 2;
          const barY = chartY + chartHeight - barHeight;

          doc.roundedRect(barX, barY, barWidth, barHeight, 4).fill(barColor);
          doc.fillColor(colors.subText).font('Helvetica').fontSize(8).text(`${Math.round(value)}%`, barX - 4, barY - 12, { width: barWidth + 8, align: 'center' });
          doc.fillColor(colors.subText).font('Helvetica').fontSize(8).text(`Grade ${grade.grade}`, barX - 8, chartY + chartHeight + 4, { width: barWidth + 16, align: 'center' });
        });

        y += chartHeight + 26;
      };

      const drawTable = (headers, rows, columnWidths) => {
        ensureSpace(24);
        const headerHeight = 18;
        const rowHeight = 18;
        let x = marginX;
        doc.rect(marginX, y, pageWidth - marginX * 2, headerHeight).fill(colors.light).stroke(colors.muted);
        headers.forEach((header, index) => {
          doc.fillColor(colors.subText).font('Helvetica-Bold').fontSize(9).text(header, x + 6, y + 5);
          x += columnWidths[index];
        });
        y += headerHeight;

        rows.forEach((row, index) => {
          ensureSpace(rowHeight + 6);
          const rowColor = index % 2 === 0 ? '#FFFFFF' : colors.light;
          doc.rect(marginX, y, pageWidth - marginX * 2, rowHeight).fill(rowColor).stroke(colors.muted);
          let cellX = marginX;
          row.forEach((cell, colIndex) => {
            doc.fillColor(colors.text).font('Helvetica').fontSize(9).text(String(cell), cellX + 6, y + 5, {
              width: columnWidths[colIndex] - 8,
              ellipsis: true
            });
            cellX += columnWidths[colIndex];
          });
          y += rowHeight;
        });
        y += 10;
      };

      const drawTopPerformers = () => {
        const performers = reportData.topPerformers || [];
        addSectionHeader('Top Performers');
        const rows = performers.slice(0, 10).map((student, index) => ([
          `${index + 1}`,
          student.name,
          `Grade ${student.grade}${student.section ? ` ${student.section}` : ''}`.trim(),
          `${student.score}%`
        ]));

        if (!rows.length) {
          ensureSpace(18);
          doc.fillColor(colors.subText).font('Helvetica').fontSize(9).text('No top performer data available.', marginX, y);
          y += 16;
          return;
        }

        drawTable(
          ['#', 'Student', 'Grade', 'Score'],
          rows,
          [24, 210, 120, 70]
        );
      };

      addPageHeader();
      drawHeader();
      drawSummaryCards();
      drawPillarBars();
      drawEngagementTrend();
      drawPerformanceByGrade();
      drawTopPerformers();

      const footerY = pageHeight - marginBottom - 12;
      doc.fillColor(colors.subText).font('Helvetica').fontSize(8).text('Confidential - WiseStudent School Analytics', marginX, footerY);
      doc.text(`Generated ${new Date(reportData.generatedAt).toLocaleString()}`, marginX, footerY, { align: 'right' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

  // Export teacher analytics report
export const exportTeacherAnalytics = async (req, res) => {
  try {
    const { tenantId } = req;
    const teacherId = req.user?._id;
    const { timeRange = 'week', classId, format = 'json' } = req.query;

    if (!teacherId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'semester':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Get classes
    let classQuery = {
      tenantId,
      $or: [
        { 'sections.classTeacher': teacherId },
        { 'subjects.teachers': teacherId }
      ]
    };

    if (classId && classId !== 'all') {
      classQuery._id = classId;
    }

    const assignedClasses = await SchoolClass.find(classQuery).select('_id name classNumber stream').lean();
    const classIds = assignedClasses.map(cls => cls._id);

    // Fetch all analytics data directly (not via HTTP)
    const studentIds = classIds.length > 0 ? (await SchoolStudent.find({
      tenantId,
      classId: { $in: classIds }
    }).populate('userId', '_id').lean()).map(ss => ss.userId?._id).filter(Boolean) : [];

    // Get mastery data
    const gameProgress = studentIds.length > 0 ? await UnifiedGameProgress.find({
      userId: { $in: studentIds },
      updatedAt: { $gte: startDate }
    }).lean() : [];

    const mapGameTypeToPillar = (gameType) => {
      switch (gameType) {
        case 'finance':
        case 'financial':
          return 'Financial Literacy';
        case 'brain':
        case 'mental':
          return 'Brain Health';
        case 'uvls':
          return 'UVLS';
        case 'dcos':
          return 'Digital Citizenship & Online Safety';
        case 'moral':
          return 'Moral Values';
        case 'ai':
          return 'AI for All';
        case 'health-male':
          return 'Health - Male';
        case 'health-female':
          return 'Health - Female';
        case 'ehe':
          return 'Entrepreneurship & Higher Education';
        case 'crgc':
        case 'civic-responsibility':
          return 'Civic Responsibility & Global Citizenship';
        case 'sustainability':
          return 'Sustainability';
        default:
          return 'General Education';
      }
    };

    const getProgressPercent = (game) => {
      if (game?.fullyCompleted) return 100;
      if (game?.totalLevels > 0) {
        return Math.round(((game.levelsCompleted || 0) / game.totalLevels) * 100);
      }
      if (game?.maxScore > 0) {
        return Math.round(((game.highestScore || 0) / game.maxScore) * 100);
      }
      return 0;
    };

    const pillarNames = [
      'Financial Literacy',
      'Brain Health',
      'UVLS',
      'Digital Citizenship & Online Safety',
      'Moral Values',
      'AI for All',
      'Health - Male',
      'Health - Female',
      'Entrepreneurship & Higher Education',
      'Civic Responsibility & Global Citizenship',
      'Sustainability'
    ];

    const pillarTotals = pillarNames.reduce((acc, pillar) => {
      acc[pillar] = { total: 0, count: 0 };
      return acc;
    }, {});

    (gameProgress || []).forEach((game) => {
      const pillar = mapGameTypeToPillar(game.gameType);
      const progress = getProgressPercent(game);
      if (!pillarTotals[pillar]) {
        pillarTotals[pillar] = { total: 0, count: 0 };
      }
      pillarTotals[pillar].total += progress;
      pillarTotals[pillar].count += 1;
    });

    const masteryData = pillarNames.reduce((acc, pillar) => {
      const data = pillarTotals[pillar];
      acc[pillar] = data && data.count > 0 ? Math.round(data.total / data.count) : 0;
      return acc;
    }, {});

    // Get students at risk
    const schoolStudents = classIds.length > 0 ? await SchoolStudent.find({
      tenantId,
      classId: { $in: classIds }
    }).populate('userId', '_id name avatar').lean() : [];

    const atRiskStudents = [];
    for (const schoolStudent of schoolStudents) {
      const student = schoolStudent.userId;
      if (!student) continue;

      const [recentActivities, recentMoods] = await Promise.all([
        ActivityLog.find({ userId: student._id, createdAt: { $gte: startDate } }).lean(),
        MoodLog.find({ userId: student._id, createdAt: { $gte: startDate } }).lean()
      ]);

      const totalMinutes = recentActivities.reduce((sum, log) => sum + (log.duration || 0), 0);
      const avgMood = recentMoods.length > 0
        ? recentMoods.reduce((sum, log) => sum + (log.score || 3), 0) / recentMoods.length
        : 3;

      if (totalMinutes < 30) {
        atRiskStudents.push({
          _id: student._id,
          name: student.name,
          avatar: student.avatar,
          reason: 'Low engagement',
          riskLevel: 'High',
          metric: `${totalMinutes}min/${timeRange}`
        });
      } else if (avgMood < 2.5) {
        atRiskStudents.push({
          _id: student._id,
          name: student.name,
          avatar: student.avatar,
          reason: 'Low mood pattern',
          riskLevel: 'Medium',
          metric: `Avg mood: ${avgMood.toFixed(1)}`
        });
      }
    }

    // Get engagement data
    const activeGameUsers = studentIds.length > 0 ? await UnifiedGameProgress.distinct('userId', {
      userId: { $in: studentIds },
      lastPlayedAt: { $gte: startDate }
    }) : [];

    const totalStudents = studentIds.length;
    const gamesPercent = totalStudents > 0
      ? Math.round((activeGameUsers.length / totalStudents) * 100)
      : 0;

    const engagementData = {
      games: gamesPercent,
      lessons: 0,
      overall: gamesPercent
    };

    // Get leaderboard
    const leaderboardData = [];
    if (studentIds.length > 0) {
      const students = schoolStudents.map(ss => ss.userId).filter(Boolean);
      const leaderboardPromises = students.map(async (student) => {
        const [progress, wallet] = await Promise.all([
          UserProgress.findOne({ userId: student._id }).lean(),
          Wallet.findOne({ userId: student._id }).lean()
        ]);
        return {
          _id: student._id,
          name: student.name,
          avatar: student.avatar,
          class: 'N/A',
          totalXP: progress?.xp || 0,
          level: progress?.level || 1,
          healCoins: wallet?.balance || 0,
          streak: progress?.streak || 0
        };
      });
      const leaderboardResults = await Promise.all(leaderboardPromises);
      leaderboardData.push(...leaderboardResults.sort((a, b) => b.totalXP - a.totalXP).slice(0, 5));
    }

    const reportData = {
      generatedAt: new Date().toISOString(),
      timeRange,
      classFilter: classId || 'all',
      classes: assignedClasses.map(c => ({
        id: c._id,
        name: c.name || `Class ${c.classNumber}${c.stream ? ` ${c.stream}` : ''}`,
        classNumber: c.classNumber,
        stream: c.stream
      })),
      mastery: masteryData,
      studentsAtRisk: atRiskStudents,
      engagement: engagementData,
      leaderboard: leaderboardData,
      summary: {
        totalClasses: assignedClasses.length,
        totalStudents: leaderboardData.length,
        averageMastery: Object.values(masteryData).length > 0
          ? Math.round(Object.values(masteryData).reduce((a, b) => a + b, 0) / Object.values(masteryData).length)
          : 0,
        studentsAtRiskCount: atRiskStudents.length,
        engagementRate: engagementData.overall || 0
      }
    };

    const fileDate = new Date().toISOString().split('T')[0];

    if (format === 'pdf') {
      const pdfBuffer = await buildTeacherAnalyticsPdf(reportData, {
        teacherName: req.user?.name || 'Teacher'
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=analytics-report-${timeRange}-${fileDate}.pdf`);
      return res.send(pdfBuffer);
    }

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=analytics-report-${timeRange}-${fileDate}.json`);
      return res.status(200).json(reportData);
    } else {
      // CSV format
      const csv = `Teacher Analytics Report
Generated: ${new Date().toLocaleString()}
Time Range: ${timeRange}
Class Filter: ${classId || 'all'}

=== Summary ===
Total Classes: ${reportData.summary.totalClasses}
Total Students: ${reportData.summary.totalStudents}
Average Mastery: ${reportData.summary.averageMastery}%
Students At Risk: ${reportData.summary.studentsAtRiskCount}
Engagement Rate: ${reportData.summary.engagementRate}%

=== Pillar Mastery ===
${Object.entries(reportData.mastery).map(([pillar, percentage]) => `${pillar},${percentage}%`).join('\n')}

=== Students At Risk ===
Name,Reason,Risk Level,Metric
${reportData.studentsAtRisk.map(s => `${s.name},${s.reason},${s.riskLevel},${s.metric}`).join('\n')}

=== Top Performers ===
Rank,Name,Level,XP,Coins,Streak
${reportData.leaderboard.map((s, idx) => `${idx + 1},${s.name},${s.level},${s.totalXP},${s.healCoins},${s.streak}`).join('\n')}
`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=analytics-report-${timeRange}-${fileDate}.csv`);
      return res.send(csv);
    }
  } catch (error) {
    console.error('Error exporting teacher analytics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get students for a specific class
export const getClassStudents = async (req, res) => {
  try {
    const { classId } = req.params;
    const { tenantId, isLegacyUser } = req;

    // Get students assigned to the specific class
    const schoolStudents = await SchoolStudent.find({ 
      tenantId, 
      classId: classId 
    })
      .populate('userId', '_id name email avatar lastActive')
      .lean();

    if (!schoolStudents || schoolStudents.length === 0) {
      return res.json({ students: [] });
    }

    // Filter out any schoolStudent records with null userId (broken references)
    const validSchoolStudents = schoolStudents.filter(ss => ss.userId !== null && ss.userId !== undefined);

    if (validSchoolStudents.length === 0) {
      return res.json({ students: [] });
    }

    // Extract user data from populated SchoolStudent records
    // Enrich with progress data
    const pillarGameCounts = await getAllPillarGameCounts(UnifiedGameProgress);

    const enrichedStudents = await Promise.all(
      validSchoolStudents.map(async (schoolStudent, index) => {
        const student = schoolStudent.userId;
        
        // Additional safety check (shouldn't be needed after filter, but just in case)
        if (!student || !student._id) {
          return null;
        }
        
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const [progress, wallet, gameProgress, recentMoods, recentActivities] = await Promise.all([
          UserProgress.findOne({ userId: student._id }).lean(),
          Wallet.findOne({ userId: student._id }).lean(),
          UnifiedGameProgress.find({ userId: student._id }).lean(),
          MoodLog.find({ userId: student._id, createdAt: { $gte: sevenDaysAgo } }).sort({ createdAt: -1 }).limit(1).lean(),
          ActivityLog.find({ userId: student._id, createdAt: { $gte: sevenDaysAgo } }).lean()
        ]);

         const mapGameTypeToPillarKey = (gameType) => {
           switch (gameType) {
             case 'finance':
             case 'financial':
               return 'finance';
             case 'brain':
             case 'mental':
               return 'brain';
             case 'uvls':
               return 'uvls';
             case 'dcos':
               return 'dcos';
             case 'moral':
               return 'moral';
             case 'ai':
               return 'ai';
             case 'health-male':
               return 'health-male';
             case 'health-female':
               return 'health-female';
             case 'ehe':
               return 'ehe';
             case 'crgc':
             case 'civic-responsibility':
               return 'crgc';
             case 'sustainability':
               return 'sustainability';
             case 'educational':
               return 'educational';
             default:
               return 'general';
           }
         };

         const normalizeGender = (value) => {
           const normalized = String(value || '').trim().toLowerCase();
           if (!normalized) return '';
           if (normalized.startsWith('m')) return 'male';
           if (normalized.startsWith('f')) return 'female';
           return normalized;
         };

         const childGender = normalizeGender(
           schoolStudent?.personalInfo?.gender ||
           student?.gender ||
           ''
         );

         const basePillarKeys = [
           'finance',
           'brain',
           'uvls',
           'dcos',
           'moral',
           'ai',
           'ehe',
           'crgc',
           'sustainability'
         ];

         const pillarKeys = [...basePillarKeys];
         if (childGender === 'male') {
           pillarKeys.push('health-male');
         } else if (childGender === 'female') {
           pillarKeys.push('health-female');
         }

         const totalPossibleGames = pillarKeys.reduce((sum, key) => {
           return sum + (pillarGameCounts[key] || 0);
         }, 0);

         const completedGames = (gameProgress || []).filter((game) => {
           const pillarKey = mapGameTypeToPillarKey(game.gameType);
           if (!pillarKeys.includes(pillarKey)) return false;
           return Boolean(
             game?.fullyCompleted ||
             (game?.totalLevels && game.levelsCompleted >= game.totalLevels) ||
             game?.badgeAwarded
           );
         }).length;

         const pillarMastery = totalPossibleGames > 0
           ? Math.round((completedGames / totalPossibleGames) * 100)
           : 0;

        // Get recent mood
        const latestMood = recentMoods[0];
        const moodScore = latestMood?.score || 3;
        const moodEmojis = {
          1: '😢',
          2: '😔',
          3: '😊',
          4: '😄',
          5: '🤩'
        };

        const totalMinutes = recentActivities.reduce((sum, log) => sum + (log.duration || 0), 0);
        const avgMood = recentMoods.length > 0 ? recentMoods.reduce((sum, log) => sum + (log.score || 3), 0) / recentMoods.length : 3;
        const flagged = totalMinutes < 30 || avgMood < 2.5;

        // Format last active (handle both Date objects and strings)
        let lastActive = 'Never';
        if (student.lastActive) {
          try {
            lastActive = formatTimeAgo(student.lastActive);
          } catch (error) {
            console.error(`Error formatting lastActive for student ${student._id}:`, error);
            lastActive = 'Unknown';
          }
        }

        // Generate roll number if not exists
        let rollNumber = schoolStudent.rollNumber;
        if (!rollNumber) {
          // Generate roll number based on admission number or create one
          const admissionNum = schoolStudent.admissionNumber || '';
          const year = new Date().getFullYear().toString().slice(-2);
          rollNumber = `ROLL${year}${String(index + 1).padStart(4, '0')}`;
        }

        return {
          _id: student._id,
          schoolStudentId: schoolStudent._id,
          name: student.name,
          email: student.email,
          avatar: student.avatar,
          rollNumber,
          level: progress?.level || 1,
          xp: progress?.xp || 0,
          coins: wallet?.balance || 0,
          streak: progress?.streak || 0,
          pillarMastery,
          moodScore,
          moodEmoji: moodEmojis[moodScore] || '😊',
          lastActive,
          flagged,
          // Additional data for better display
          admissionNumber: schoolStudent.admissionNumber,
          section: schoolStudent.section,
          academicYear: schoolStudent.academicYear
        };
      })
    );

    // Filter out any null results (from invalid student references)
    const validEnrichedStudents = enrichedStudents.filter(student => student !== null);

    res.json({ students: validEnrichedStudents });
  } catch (error) {
    console.error('Error fetching class students:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get class missions analytics
export const getClassMissions = async (req, res) => {
  try {
    // Mock data - in real app, would come from Mission/Assignment model
    const missions = {
      total: 20,
      completed: 12,
      inProgress: 5,
      notStarted: 3
    };

    res.json(missions);
  } catch (error) {
    console.error('Error fetching class missions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create Assignment/Task
export const createAssignment = async (req, res) => {
  try {
    const { tenantId, user } = req;
    const assignmentData = req.body;

    console.log('Creating assignment with data:', assignmentData);

    // Validate required fields
    if (!assignmentData.title || !assignmentData.description || !assignmentData.subject || !assignmentData.dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, description, subject, and dueDate are required'
      });
    }

    if (!assignmentData.assignedTo || assignmentData.assignedTo.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one class must be selected'
      });
    }

    // Get orgId if available
    let orgId = user.orgId || null;
    if (!orgId && tenantId) {
      try {
        const org = await Organization.findOne({ tenantId });
        if (org) {
          orgId = org._id;
        }
      } catch (orgError) {
        console.error('Error fetching organization:', orgError);
        // Continue without orgId
      }
    }

    // Get class information if classId is provided
    let className = 'Multiple Classes';
    let classId = null;
    
    if (assignmentData.assignedTo && assignmentData.assignedTo.length > 0) {
      try {
        // If only one class is selected, get its details
        if (assignmentData.assignedTo.length === 1) {
          const classInfo = await SchoolClass.findById(assignmentData.assignedTo[0]);
          if (classInfo) {
            className = `Class ${classInfo.classNumber}${classInfo.stream ? ` ${classInfo.stream}` : ''}`;
            classId = classInfo._id;
          } else {
            console.warn('Class not found for ID:', assignmentData.assignedTo[0]);
            className = 'Unknown Class';
          }
        } else {
          // Multiple classes selected
          className = `${assignmentData.assignedTo.length} Classes`;
        }
      } catch (classError) {
        console.error('Error fetching class information:', classError);
        className = 'Multiple Classes';
      }
    }

    const assignmentToCreate = {
      title: assignmentData.title,
      description: assignmentData.description,
      subject: assignmentData.subject,
      type: assignmentData.type || 'homework',
      dueDate: new Date(assignmentData.dueDate),
      totalMarks: assignmentData.totalPoints || assignmentData.points || 100,
      priority: assignmentData.priority || 'medium',
      status: 'published',
      className: className,
      classId: classId,
      assignedToClasses: assignmentData.assignedTo || [], // Store all assigned class IDs
      tenantId: tenantId || 'default',
      teacherId: user._id,
      assignedDate: new Date(),
      isActive: true,
      // New fields for template-based assignments
      questions: (assignmentData.questions || []).map(q => {
        console.log('🔍 Processing question:', {
          type: q.type,
          question: q.question,
          options: q.options,
          optionsType: typeof q.options,
          isArray: Array.isArray(q.options)
        });
        
        // For project assignments, provide default question text if empty
        if (assignmentData.type === 'project' && !q.question && ['research_question', 'presentation', 'reflection'].includes(q.type)) {
          return {
            ...q,
            question: q.type === 'research_question' ? 'Research Task' : 
                     q.type === 'presentation' ? 'Presentation Task' : 
                     'Reflection Task'
          };
        }
        
        // Ensure options is properly formatted
        if (q.options && Array.isArray(q.options)) {
          // If options are strings (multiple choice), keep them as strings
          // If options are objects (matching), keep them as objects
          q.options = q.options.filter(opt => opt && opt.toString().trim() !== '');
        }
        
        return q;
      }),
      questionCount: assignmentData.questionCount || 0,
      instructions: assignmentData.instructions || (
        assignmentData.type === 'classwork' 
          ? "Participate actively and complete all activities during class time."
          : assignmentData.type === 'project'
          ? "Follow the project guidelines and submit all required deliverables."
          : "Complete all questions carefully."
      ),
      gradingType: assignmentData.gradingType || (
        assignmentData.type === 'classwork' ? "participation" 
        : assignmentData.type === 'project' ? "manual"
        : "auto"
      ),
      allowRetake: assignmentData.allowRetake !== false,
      maxAttempts: assignmentData.maxAttempts || (assignmentData.type === 'project' ? 1 : 3), // Projects typically allow only one submission
      duration: assignmentData.duration || (assignmentData.type === 'project' ? 0 : 60), // Projects don't have time limits
      // Project-specific fields
      projectMode: assignmentData.projectMode || 'instructions',
      projectData: assignmentData.projectData || {}
    };

    if (orgId) {
      assignmentToCreate.orgId = orgId;
    }

    // Add attachments if provided
    if (assignmentData.attachments && assignmentData.attachments.length > 0) {
      assignmentToCreate.attachments = assignmentData.attachments;
    }

    console.log('Assignment to create:', assignmentToCreate);

    const assignment = await Assignment.create(assignmentToCreate);

    // Populate assignment for socket emission
    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('classId', 'name section academicYear')
      .populate('assignedToClasses', 'name section academicYear')
      .populate('teacherId', 'name email')
      .lean();

    // Emit real-time notification via Socket.IO
    const io = req.app?.get('io');
    if (io) {
      // Emit to teacher
      io.to(user._id.toString()).emit('assignment:created', {
        assignment: populatedAssignment,
        tenantId,
        teacherId: user._id,
        createdAt: new Date()
      });

      // Emit to all users in tenant
      io.to(tenantId).emit('assignment:created', {
        assignment: populatedAssignment,
        tenantId,
        teacherId: user._id,
        createdAt: new Date()
      });
      
      // Emit teacher task update for dashboard refresh
      io.to(user._id.toString()).emit('teacher:task:update', {
        type: 'assignment_created',
        assignment: populatedAssignment,
        tenantId,
        teacherId: user._id,
        timestamp: new Date()
      });
    }

    res.status(201).json({ 
      success: true,
      assignment: populatedAssignment || assignment, 
      message: 'Assignment created successfully' 
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create assignment', 
      error: error.message 
    });
  }
};

// Update Assignment/Task
export const updateAssignment = async (req, res) => {
  try {
    const { tenantId, user } = req;
    const { assignmentId } = req.params;
    const updates = req.body;

    const assignment = await Assignment.findOneAndUpdate(
      { _id: assignmentId, tenantId, teacherId: user._id },
      updates,
      { new: true }
    )
      .populate('classId', 'name section academicYear')
      .populate('assignedToClasses', 'name section academicYear')
      .populate('teacherId', 'name email');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Emit real-time update via Socket.IO
    const io = req.app?.get('io');
    if (io) {
      // Emit to teacher
      io.to(user._id.toString()).emit('assignment:updated', {
        assignment,
        tenantId,
        teacherId: user._id,
        updatedAt: new Date()
      });

      // Emit to all users in tenant
      io.to(tenantId).emit('assignment:updated', {
        assignment,
        tenantId,
        teacherId: user._id,
        updatedAt: new Date()
      });
      
      // Emit teacher task update for dashboard refresh
      io.to(user._id.toString()).emit('teacher:task:update', {
        type: 'assignment_updated',
        assignment,
        tenantId,
        teacherId: user._id,
        timestamp: new Date()
      });
    }

    res.json({ assignment, message: 'Assignment updated successfully' });
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Assignment for Teacher Only (Soft Delete)
export const deleteAssignmentForTeacher = async (req, res) => {
  try {
    const { tenantId, user } = req;
    const { assignmentId } = req.params;

    const assignment = await Assignment.findOneAndUpdate(
      { _id: assignmentId, tenantId, teacherId: user._id },
      { 
        hiddenFromTeacher: true,
        deletedBy: user._id,
        deletedAt: new Date(),
        deleteType: 'soft_teacher'
      },
      { new: true }
    );

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Emit real-time delete via Socket.IO
    const io = req.app?.get('io');
    if (io) {
      // Emit to teacher
      io.to(user._id.toString()).emit('assignment:deleted', {
        assignmentId,
        tenantId,
        teacherId: user._id,
        deleteType: 'soft_teacher',
        deletedAt: new Date()
      });

      // Emit to all users in tenant
      io.to(tenantId).emit('assignment:deleted', {
        assignmentId,
        tenantId,
        teacherId: user._id,
        deleteType: 'soft_teacher',
        deletedAt: new Date()
      });
      
      // Emit teacher task update for dashboard refresh
      io.to(user._id.toString()).emit('teacher:task:update', {
        type: 'assignment_deleted',
        assignmentId,
        tenantId,
        teacherId: user._id,
        timestamp: new Date()
      });
    }

    res.json({ 
      success: true,
      message: 'Assignment deleted for you. Students can still see and access it.',
      deleteType: 'soft_teacher'
    });
  } catch (error) {
    console.error('Error deleting assignment for teacher:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Assignment for Everyone (Hard Delete)
export const deleteAssignmentForEveryone = async (req, res) => {
  try {
    const { tenantId, user } = req;
    const { assignmentId } = req.params;

    const assignment = await Assignment.findOneAndUpdate(
      { _id: assignmentId, tenantId, teacherId: user._id },
      { 
        isActive: false,
        hiddenFromStudents: true,
        hiddenFromTeacher: true,
        deletedBy: user._id,
        deletedAt: new Date(),
        deleteType: 'hard'
      },
      { new: true }
    );

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Also delete any related assignment attempts
    await AssignmentAttempt.updateMany(
      { assignmentId: assignmentId, tenantId },
      { isActive: false }
    );

    // Emit real-time delete via Socket.IO
    const io = req.app?.get('io');
    if (io) {
      // Emit to teacher
      io.to(user._id.toString()).emit('assignment:deleted', {
        assignmentId,
        tenantId,
        teacherId: user._id,
        deleteType: 'hard',
        deletedAt: new Date()
      });

      // Emit to all users in tenant
      io.to(tenantId).emit('assignment:deleted', {
        assignmentId,
        tenantId,
        teacherId: user._id,
        deleteType: 'hard',
        deletedAt: new Date()
      });
    }

    res.json({ 
      success: true,
      message: 'Assignment deleted for everyone. No one can access it anymore.',
      deleteType: 'hard'
    });
  } catch (error) {
    console.error('Error deleting assignment for everyone:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Assignment for Student (Soft Delete)
export const deleteAssignmentForStudent = async (req, res) => {
  try {
    const { tenantId, user } = req;
    const { assignmentId } = req.params;

    // Check if student has submitted this assignment
    const submittedAttempt = await AssignmentAttempt.findOne({
      assignmentId: assignmentId,
      studentId: user._id,
      tenantId,
      status: 'submitted'
    });

    if (!submittedAttempt) {
      return res.status(400).json({ 
        success: false,
        message: 'You can only delete assignments after submitting them' 
      });
    }

    // Add student to hidden list for this assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Add student to hiddenFromStudents list (we'll use a new field for this)
    if (!assignment.hiddenFromStudentsList) {
      assignment.hiddenFromStudentsList = [];
    }
    
    if (!assignment.hiddenFromStudentsList.includes(user._id.toString())) {
      assignment.hiddenFromStudentsList.push(user._id.toString());
      await assignment.save();
    }

    res.json({ 
      success: true,
      message: 'Assignment removed from your view. You can still access it from your submission history.',
      deleteType: 'soft_student'
    });
  } catch (error) {
    console.error('Error deleting assignment for student:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Single Assignment by ID
export const getAssignmentById = async (req, res) => {
  try {
    const { tenantId } = req;
    const { assignmentId } = req.params;

    const assignment = await Assignment.findOne({
      _id: assignmentId,
      tenantId,
      isActive: true
    })
    .populate('teacherId', 'name email')
    .populate('classId', 'name section academicYear');

    if (!assignment) {
      return res.status(404).json({ 
        success: false,
        message: 'Assignment not found' 
      });
    }

    res.json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error('Error getting assignment:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};


// Create sample data for testing
export const createSampleData = async (req, res) => {
  try {
    const { tenantId, user } = req;

    // Get orgId if available, otherwise null is fine (we made it optional)
    let orgId = user.orgId || null;
    
    // If no orgId, try to find existing organization
    if (!orgId && tenantId) {
      const org = await Organization.findOne({ tenantId });
      if (org) {
        orgId = org._id;
      }
    }

    // Create sample assignments
    const sampleAssignments = [];
    
    const assignmentTemplates = [
      {
        title: 'Math Quiz - Algebra',
        description: 'Complete algebra problems from chapter 5',
        subject: 'Mathematics',
        className: 'Class 10A',
        section: 'A',
        priority: 'high',
        type: 'grading',
        days: 7
      },
      {
        title: 'Science Project Review',
        description: 'Review and approve science fair projects',
        subject: 'Science',
        className: 'Class 9B',
        section: 'B',
        priority: 'medium',
        type: 'approval',
        days: 10
      },
      {
        title: 'English Essay Grading',
        description: 'Grade essays on climate change',
        subject: 'English',
        className: 'Class 8A',
        section: 'A',
        priority: 'low',
        type: 'grading',
        days: 14
      }
    ];

    for (const template of assignmentTemplates) {
      const assignment = {
        tenantId: tenantId || 'default',
        title: template.title,
        description: template.description,
        subject: template.subject,
        className: template.className,
        section: template.section,
        teacherId: user._id,
        dueDate: new Date(Date.now() + template.days * 24 * 60 * 60 * 1000),
        priority: template.priority,
        type: template.type,
        status: 'pending'
      };
      
      if (orgId) {
        assignment.orgId = orgId;
      }
      
      sampleAssignments.push(assignment);
    }

    const assignments = await Assignment.insertMany(sampleAssignments);

    // Create sample announcements
    const sampleAnnouncements = [];
    
    const announcementTemplates = [
      {
        title: 'Parent-Teacher Meeting',
        message: 'PTM scheduled for all classes on January 25th at 2 PM. Please ensure your availability.',
        type: 'meeting',
        priority: 'high',
        targetAudience: 'teachers',
        isPinned: true
      },
      {
        title: 'Fee Payment Reminder',
        message: 'Reminder: Quarterly fee payment deadline is approaching. Please inform parents.',
        type: 'fee',
        priority: 'normal',
        targetAudience: 'all',
        isPinned: false
      }
    ];

    for (const template of announcementTemplates) {
      const announcement = {
        tenantId: tenantId || 'default',
        title: template.title,
        message: template.message,
        type: template.type,
        priority: template.priority,
        targetAudience: template.targetAudience,
        createdBy: user._id,
        createdByName: user.name,
        createdByRole: user.role,
        isPinned: template.isPinned
      };
      
      if (orgId) {
        announcement.orgId = orgId;
      }
      
      sampleAnnouncements.push(announcement);
    }

    const announcements = await Announcement.insertMany(sampleAnnouncements);

    res.json({
      success: true,
      message: 'Sample data created successfully',
      data: {
        assignments: assignments.length,
        announcements: announcements.length,
        assignmentIds: assignments.map(a => a._id),
        announcementIds: announcements.map(a => a._id)
      }
    });
  } catch (error) {
    console.error('Error creating sample data:', error);
    console.error('Error details:', error.stack);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create sample data', 
      error: error.message
    });
  }
};

// Get teacher settings
export const getTeacherSettings = async (req, res) => {
  try {
    const teacher = await User.findById(req.user._id).select('preferences');
    
    const settings = {
      classroom: teacher.preferences?.classroom || {},
      notifications: teacher.preferences?.notifications || {},
      privacy: teacher.preferences?.privacy || {},
      display: teacher.preferences?.display || {}
    };

    res.json(settings);
  } catch (error) {
    console.error('Error fetching teacher settings:', error);
    res.status(500).json({ message: 'Failed to fetch settings', error: error.message });
  }
};
// Update teacher settings
export const updateTeacherSettings = async (req, res) => {
  try {
    const { classroom, notifications, privacy, display } = req.body;
    
    const update = {};
    if (classroom) update['preferences.classroom'] = classroom;
    if (notifications) update['preferences.notifications'] = notifications;
    if (privacy) update['preferences.privacy'] = privacy;
    if (display) update['preferences.display'] = display;

    await User.findByIdAndUpdate(req.user._id, { $set: update });

    res.json({ 
      success: true,
      message: 'Settings updated successfully' 
    });
  } catch (error) {
    console.error('Error updating teacher settings:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update settings', 
      error: error.message 
    });
  }
};

// Get detailed student info for slide-over panel
export const getStudentDetails = async (req, res) => {
  try {
    const { studentId } = req.params;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [student, activityLogs, moodLogs, userProgress, wallet] = await Promise.all([
      User.findById(studentId).select('name email avatar teacherNotes flaggedForCounselor flaggedReason consentFlags').lean(),
      ActivityLog.find({ userId: studentId, createdAt: { $gte: sevenDaysAgo } }).sort({ createdAt: -1 }).limit(10).lean(),
      MoodLog.find({ userId: studentId, createdAt: { $gte: sevenDaysAgo } }).sort({ createdAt: -1 }).limit(5).lean(),
      UserProgress.findOne({ userId: studentId }).lean(),
      Wallet.findOne({ userId: studentId }).lean()
    ]);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Format timeline (humanized)
    const humanizeActivity = (log) => {
      const type = log.activityType || log.type;
      const d = log.details || {};
      const m = log.metadata || {};
      const desc = log.description;
      if (desc && typeof desc === 'string' && desc.trim()) return desc.trim();
      const page = m.page || m.path || d.page || d.path || log.pageUrl;
      const endpoint = d.endpoint || m.endpoint;
      const feature = d.feature || m.feature;
      const actionName = d.action || m.action || log.action;
      const title = d.title || m.title;
      const name = d.name || m.name;
      const game = log.game || d.game || d.gameId || m.game || m.gameId;
      const mood = d.mood || m.mood || d.emoji || m.emoji;
      const level = d.level || m.level;
      const amount = d.amount || d.xp || m.amount || m.xp;
      switch (type) {
        case 'login': return 'Logged in';
        case 'logout': return 'Logged out';
        case 'page_view': return page ? `Viewed ${page}` : 'Viewed a page';
        case 'quiz_completed': return title ? `Completed quiz: ${title}` : 'Completed a quiz';
        case 'challenge_started': return name ? `Started challenge: ${name}` : 'Started a challenge';
        case 'challenge_completed': return name ? `Completed challenge: ${name}` : 'Completed a challenge';
        case 'reward_redeemed': return (name || title) ? `Redeemed reward: ${name || title}` : 'Redeemed a reward';
        case 'xp_earned': return amount ? `Earned ${amount} XP` : 'Earned XP';
        case 'level_up': return level ? `Leveled up to ${level}` : 'Leveled up';
        case 'mood_logged': return mood ? `Logged mood: ${mood}` : 'Logged a mood entry';
        case 'journal_entry': return title ? `Added journal: ${title}` : 'Added a journal entry';
        case 'feature_used': return feature ? `Used feature: ${feature}` : 'Used a feature';
        case 'analytics_view': return 'Viewed analytics';
        case 'student_interaction': return actionName ? `Interaction: ${actionName}` : 'Student interaction';
        case 'feedback_provided': return title ? `Provided feedback: ${title}` : 'Provided feedback';
        case 'assignment_created': return title ? `Created assignment: ${title}` : 'Created an assignment';
        case 'assignment_graded': return title ? `Graded assignment: ${title}` : 'Graded an assignment';
        case 'data_fetch': return endpoint ? `Fetched data: ${endpoint}` : 'Fetched data';
        case 'navigation': return page ? `Navigated to ${page}` : (actionName ? `Navigated: ${actionName}` : 'Navigated');
        case 'ui_interaction': return actionName ? `Interacted with ${actionName}` : (feature ? `Interacted with ${feature}` : 'UI interaction');
        case 'error': return (title || actionName) ? `Error: ${title || actionName}` : 'Error occurred';
        default: {
          if (game) return `Played game: ${game}`;
          if (title) return title;
          if (actionName && actionName !== 'Activity') return actionName;
          if (page) return `Viewed ${page}`;
          return 'Activity';
        }
      }
    };

    const normalizeType = (t) => {
      const s = (t || '').toLowerCase();
      if (s.includes('quiz')) return 'quiz';
      if (s.includes('mood')) return 'mood';
      if (s.includes('game')) return 'game';
      if (s.includes('page') || s.includes('lesson') || s.includes('navigation')) return 'lesson';
      return 'general';
    };

    const timeline = [
      ...activityLogs.map(log => ({
        type: normalizeType(log.activityType),
        action: humanizeActivity(log),
        details: log.details?.title || log.details?.name || log.game || log.category || '',
        time: formatTimeAgo(log.createdAt),
        timestamp: log.createdAt
      })),
      ...moodLogs.map(log => ({
        type: 'mood',
        action: `Logged mood: ${log.mood || 'Happy'}`,
        details: `Score: ${log.score || 3}/5${log.note ? ` - ${log.note}` : ''}`,
        time: formatTimeAgo(log.createdAt),
        timestamp: log.createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);

    // Get recent mood
    const recentMood = moodLogs[0] ? {
      mood: moodLogs[0].mood,
      score: moodLogs[0].score,
      emoji: moodLogs[0].emoji || '😊',
      note: moodLogs[0].note
    } : null;

    res.json({
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        avatar: student.avatar
      },
      timeline,
      notes: student.teacherNotes || [],
      flagged: student.flaggedForCounselor || false,
      flagReason: student.flaggedReason || '',
      recentMood,
      consentFlags: student.consentFlags || {},
      // Real-time stats
      level: userProgress?.level || 1,
      xp: userProgress?.xp || 0,
      coins: wallet?.balance || 0,
      streak: userProgress?.streak || 0
    });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Save teacher note for student
export const saveStudentNote = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { note } = req.body;
    const teacherId = req.user._id;

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Initialize teacherNotes if not exists
    if (!student.teacherNotes) {
      student.teacherNotes = [];
    }

    // Add new note
    student.teacherNotes.push({
      text: note,
      teacher: req.user.name,
      teacherId,
      date: new Date()
    });

    await student.save();

    // Emit socket event for real-time update
    const io = req.app?.get('io');
    const { tenantId } = req;
    if (io && tenantId) {
      io.to(`school-admin-dashboard:${tenantId}`).emit('school:students:updated', {
        studentId,
        action: 'note_added',
        tenantId,
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Note saved successfully',
      note: student.teacherNotes[student.teacherNotes.length - 1]
    });
  } catch (error) {
    console.error('Error saving student note:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle student flag for counselor
export const toggleStudentFlag = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { flagged, reason } = req.body;
    const { tenantId } = req;

    const student = await User.findByIdAndUpdate(
      studentId,
      {
        flaggedForCounselor: flagged,
        flaggedReason: reason || '',
        flaggedBy: req.user._id,
        flaggedAt: flagged ? new Date() : null
      },
      { new: true }
    ).select('flaggedForCounselor flaggedReason');

    // Emit socket events for realtime analytics updates
    const io = req.app?.get('io');
    if (io && tenantId) {
      io.to(`school-admin-dashboard:${tenantId}`).emit('student:wellbeing:updated', {
        studentId,
        flagged,
        tenantId,
        timestamp: new Date()
      });
      
      // Also emit general dashboard update
      io.to(`school-admin-dashboard:${tenantId}`).emit('school-admin:dashboard:update', {
        type: 'wellbeing_updated',
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      message: flagged ? 'Student flagged for counselor' : 'Flag removed',
      flagged: student.flaggedForCounselor
    });
  } catch (error) {
    console.error('Error toggling student flag:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Send message to student
export const sendStudentMessage = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { message } = req.body;
    const teacherId = req.user._id;
    const { tenantId } = req;

    // Create notification for student
    const notification = await Notification.create({
      userId: studentId,
      type: 'message',
      title: `Message from ${req.user.name}`,
      message: message,
      metadata: {
        senderId: teacherId,
        senderName: req.user.name,
        senderRole: req.user.role
      }
    });

    // Log activity for timeline
    await ActivityLog.create({
      userId: studentId,
      activityType: 'student_interaction',
      description: 'Teacher sent a message',
      details: { senderId: teacherId, senderName: req.user.name },
      metadata: { page: '/school-teacher/students' },
    });

    // Emit real-time notification via Socket.IO
    const io = req.app?.get('io');
    if (io) {
      io.to(studentId.toString()).emit('notification', {
        _id: notification._id,
        userId: studentId,
        type: 'message',
        title: `Message from ${req.user.name}`,
        message: message,
        metadata: {
          senderId: teacherId,
          senderName: req.user.name,
          senderRole: req.user.role
        },
        read: false,
        createdAt: notification.createdAt
      });
    }

    res.json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate invite link
export const generateInviteLink = async (req, res) => {
  try {
    const { classId, className } = req.body;
    const teacherId = req.user._id;
    const { tenantId } = req;

    // Create a unique invite code
    const inviteCode = `${tenantId || 'public'}-${classId}-${Date.now()}`;
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const inviteLink = `${baseUrl}/join-class?code=${inviteCode}&class=${classId}&teacher=${teacherId}`;

    // Store invite code in database (optional - for tracking)
    await User.findByIdAndUpdate(teacherId, {
      $push: {
        'metadata.inviteCodes': {
          code: inviteCode,
          classId,
          className,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      }
    });

    res.json({
      success: true,
      inviteLink,
      inviteCode
    });
  } catch (error) {
    console.error('Error generating invite link:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Send email invites
export const sendEmailInvites = async (req, res) => {
  try {
    const { emails, inviteLink, className } = req.body;
    const teacherName = req.user?.name || 'Your teacher';
    const classLabel = className || 'your class';

    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ message: 'At least one email is required' });
    }

    if (!inviteLink) {
      return res.status(400).json({ message: 'Invite link is required' });
    }

    const normalizedEmails = [...new Set(
      emails
        .map((email) => String(email || '').trim())
        .filter(Boolean)
    )];

    if (normalizedEmails.length === 0) {
      return res.status(400).json({ message: 'No valid email addresses provided' });
    }

    const subject = `You're invited to join ${classLabel} on Wise Student`;
    const buildInviteHtml = (recipient) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;font-family:Arial, sans-serif;background-color:#f5f5f5;">
        <table role="presentation" style="width:100%;border-collapse:collapse;background-color:#f5f5f5;">
          <tr>
            <td align="center" style="padding:32px 16px;">
              <table role="presentation" style="max-width:600px;width:100%;border-collapse:collapse;background-color:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 14px rgba(15, 23, 42, 0.1);">
                <tr>
                  <td style="padding:28px 32px;background:linear-gradient(135deg,#4f46e5,#9333ea);color:#ffffff;">
                    <h1 style="margin:0;font-size:22px;font-weight:700;">Wise Student</h1>
                    <p style="margin:6px 0 0;font-size:13px;opacity:0.9;">Class registration invitation</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px 32px;color:#0f172a;">
                    <p style="margin:0 0 14px;font-size:16px;">Hi${recipient ? ` ${recipient}` : ''},</p>
                    <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#334155;">
                      ${teacherName} invited you to join <strong>${classLabel}</strong> on Wise Student.
                      Use the button below to complete registration.
                    </p>
                    <div style="text-align:center;margin:24px 0;">
                      <a href="${inviteLink}" style="display:inline-block;padding:12px 24px;border-radius:999px;background:#4f46e5;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;">
                        Complete Registration
                      </a>
                    </div>
                    <p style="margin:0 0 10px;font-size:13px;color:#475569;">
                      Or copy and paste this link into your browser:
                    </p>
                    <p style="margin:0;font-size:12px;color:#64748b;word-break:break-all;">${inviteLink}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 32px;background-color:#f8fafc;color:#64748b;font-size:12px;text-align:center;">
                    If you did not expect this invitation, you can safely ignore this email.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const sendResults = await Promise.allSettled(
      normalizedEmails.map((email) =>
        sendEmail({
          to: email,
          subject,
          html: buildInviteHtml(''),
        })
      )
    );

    const failures = sendResults
      .map((result, index) => ({
        email: normalizedEmails[index],
        error: result.status === 'rejected' ? result.reason?.message || 'Failed to send' : null,
      }))
      .filter((result) => result.error);

    const successCount = normalizedEmails.length - failures.length;

    if (failures.length > 0) {
      console.error('Invite email failures:', failures);
    }

    res.json({
      success: failures.length === 0,
      message: failures.length === 0
        ? `Invites sent to ${successCount} email(s)`
        : `Invites sent to ${successCount} email(s), ${failures.length} failed`,
      emailsSent: successCount,
      failures,
    });
  } catch (error) {
    console.error('Error sending email invites:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get teacher's student groups
export const getTeacherGroups = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { tenantId } = req;

    // Get groups from teacher's metadata or a separate Groups collection
    const teacher = await User.findById(teacherId).select('metadata').lean();
    const groups = teacher?.metadata?.studentGroups || [];

    res.json({
      success: true,
      groups
    });
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create student group
export const createStudentGroup = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const teacherId = req.user._id;

    const newGroup = {
      _id: new Date().getTime().toString(),
      name,
      description,
      color: color || '#8B5CF6',
      students: [],
      createdAt: new Date(),
      createdBy: teacherId
    };

    await User.findByIdAndUpdate(teacherId, {
      $push: {
        'metadata.studentGroups': newGroup
      }
    });

    res.json({
      success: true,
      message: 'Group created successfully',
      group: newGroup
    });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update student's groups
export const updateStudentGroups = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { groups } = req.body;

    await User.findByIdAndUpdate(studentId, {
      $set: { 'metadata.groups': groups }
    });

    res.json({
      success: true,
      message: 'Student groups updated successfully'
    });
  } catch (error) {
    console.error('Error updating student groups:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search students by registration number or phone
export const searchStudents = async (req, res) => {
  try {
    const { query } = req.query;
    const { tenantId, isLegacyUser } = req;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Search by registration number, phone, or email
    const searchQuery = {
      $or: [
        { registrationNumber: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ],
      role: { $in: ['student', 'school_student'] }
    };

    if (!isLegacyUser && tenantId) {
      searchQuery.tenantId = tenantId;
    }

    const students = await User.find(searchQuery)
      .select('name email phone registrationNumber avatar')
      .limit(20)
      .lean();

    res.json({
      success: true,
      students
    });
  } catch (error) {
    console.error('Error searching students:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Assign existing students to class
export const assignStudentsToClass = async (req, res) => {
  try {
    const { classId, className, studentIds = [] } = req.body;
    const teacherId = req.user._id;
    const { tenantId } = req;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ message: 'No students selected' });
    }

    let classData = await SchoolClass.findOne({ _id: classId, tenantId });
    if (!classData) {
      const fallbackClass = await SchoolClass.findById(classId);
      if (!fallbackClass) {
        return res.status(404).json({ message: 'Class not found' });
      }
      if (fallbackClass.tenantId && tenantId && fallbackClass.tenantId.toString() !== tenantId.toString()) {
        return res.status(403).json({ message: 'You are not authorised to modify this class' });
      }
      classData = fallbackClass;
    }

    const targetSection = classData.sections?.[0]?.name;
    if (!targetSection) {
      return res.status(400).json({ message: 'No sections available in this class' });
    }

    const io = req.app && typeof req.app.get === 'function' ? req.app.get('io') : null;
    const derivedClassName =
      className || `Class ${classData.classNumber}${classData.stream ? ` - ${classData.stream}` : ''}`;

    // Prevent assigning students who are already in another class
    const studentsAlreadyAssigned = await SchoolStudent.find({
      userId: { $in: studentIds },
      tenantId,
      classId: { $nin: [null, classId] },
    })
      .populate('userId', 'name email')
      .populate('classId', 'classNumber');

    if (studentsAlreadyAssigned.length > 0) {
      return res.status(409).json({
        message: 'Some students are already assigned to other classes',
        conflicts: studentsAlreadyAssigned.map((student) => ({
          studentId: student.userId?._id,
          name: student.userId?.name,
          email: student.userId?.email,
          classNumber: student.classId?.classNumber,
        })),
      });
    }

    const ensureUniqueIdentifier = async (prefix, field) => {
      const maxAttempts = 6;
      const year = new Date().getFullYear();

      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const suffix = crypto.randomBytes(3).toString('hex').toUpperCase();
        const candidate = `${prefix}${year}${suffix}`;

        const exists = await SchoolStudent.exists({ tenantId, [field]: candidate });
        if (!exists) {
          return candidate;
        }
      }

      return `${prefix}${Date.now()}${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    };

    const normalizeGender = (value) => {
      if (!value) return undefined;
      const normalized = String(value).toLowerCase();
      if (normalized === 'male') return 'Male';
      if (normalized === 'female') return 'Female';
      return 'Other';
    };

    const assignmentTimestamp = new Date();
    const academicYear =
      classData.academicYear ||
      `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;

    const assignedStudentIds = [];
    const assignmentResults = [];

    for (const studentId of studentIds) {
      try {
        const studentUser = await User.findById(studentId).select(
          'name email role tenantId orgId linkedIds metadata dateOfBirth gender'
        );

        if (!studentUser) {
          assignmentResults.push({
            studentId,
            status: 'error',
            message: 'Student not found in the system',
          });
          continue;
        }

        if (!['student', 'school_student'].includes(studentUser.role)) {
          assignmentResults.push({
            studentId,
            status: 'error',
            message: 'User is not a student',
          });
          continue;
        }

        if (
          tenantId &&
          studentUser.tenantId &&
          studentUser.tenantId.toString() !== tenantId.toString()
        ) {
          assignmentResults.push({
            studentId,
            status: 'error',
            message: 'Student belongs to a different tenant',
          });
          continue;
        }

        const studentOrgId =
          studentUser.orgId || classData.orgId || req.user?.orgId || null;

        let schoolStudent = await SchoolStudent.findOne({ userId: studentId, tenantId });

        if (!schoolStudent) {
          const admissionNumber = await ensureUniqueIdentifier('ADM', 'admissionNumber');
          const rollNumber = await ensureUniqueIdentifier('ROLL', 'rollNumber');

          schoolStudent = new SchoolStudent({
            tenantId,
            orgId: studentOrgId,
            userId: studentId,
            admissionNumber,
            rollNumber,
            classId,
            section: targetSection,
            academicYear,
            grade: classData.classNumber,
            parentIds: Array.isArray(studentUser.linkedIds?.parentIds)
              ? studentUser.linkedIds.parentIds
              : [],
            personalInfo: {
              dateOfBirth: studentUser.dateOfBirth || null,
              gender: normalizeGender(studentUser.gender),
            },
            academicInfo: {
              admissionDate: assignmentTimestamp,
            },
            attendance: {
              totalDays: 0,
              presentDays: 0,
              percentage: 0,
            },
            isActive: true,
          });
        } else {
          schoolStudent.classId = classId;
          schoolStudent.section = targetSection;
          schoolStudent.academicYear = academicYear;
          schoolStudent.grade = classData.classNumber;
          schoolStudent.orgId = schoolStudent.orgId || studentOrgId;
          schoolStudent.isActive = true;

          if (!schoolStudent.admissionNumber) {
            schoolStudent.admissionNumber = await ensureUniqueIdentifier('ADM', 'admissionNumber');
          }
          if (!schoolStudent.rollNumber) {
            schoolStudent.rollNumber = await ensureUniqueIdentifier('ROLL', 'rollNumber');
          }
        }

        await schoolStudent.save();

        const classMetadataEntry = {
          classId,
          className: derivedClassName,
          classNumber: classData.classNumber,
          teacherId,
          section: targetSection,
          assignedAt: assignmentTimestamp,
        };

        await User.updateOne(
          { _id: studentId },
          {
            $set: {
              orgId: studentOrgId ?? studentUser.orgId ?? null,
              tenantId: studentUser.tenantId || tenantId,
              'metadata.schoolEnrollment': {
                classId,
                className: derivedClassName,
                classNumber: classData.classNumber,
                section: targetSection,
                academicYear,
                assignedBy: teacherId,
                assignedAt: assignmentTimestamp,
              },
            },
            $addToSet: {
              'metadata.classes': classMetadataEntry,
            },
          }
        );

        assignedStudentIds.push(studentId);
        assignmentResults.push({
          studentId,
          status: 'assigned',
          studentName: studentUser.name,
          studentEmail: studentUser.email,
          section: targetSection,
        });
      } catch (assignmentError) {
        console.error(`Error assigning student ${studentId} to class ${classId}:`, assignmentError);
        assignmentResults.push({
          studentId,
          status: 'error',
          message: assignmentError.message || 'Failed to assign student',
        });
      }
    }

    if (assignedStudentIds.length > 0) {
      const sectionIndex = classData.sections.findIndex((section) => section.name === targetSection);
      if (sectionIndex !== -1) {
        const currentCount = await SchoolStudent.countDocuments({
          tenantId,
          classId,
          section: targetSection,
        });
        classData.sections[sectionIndex].currentStrength = currentCount;
        await classData.save();
      }
    }

    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'students_assigned_to_class_by_teacher',
      targetType: 'class',
      targetId: classId,
      targetName: `Class ${classData.classNumber}`,
      description: `${assignedStudentIds.length} student(s) assigned to Class ${classData.classNumber} - Section ${targetSection} by teacher`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    if (io && assignedStudentIds.length > 0) {
      const payload = {
        tenantId,
        orgId: classData.orgId ? classData.orgId.toString() : null,
        classId: classId.toString(),
        studentIds: assignedStudentIds.map((id) => id.toString()),
        section: targetSection,
        count: assignedStudentIds.length,
        updatedAt: new Date().toISOString(),
      };

      io.emit('school:students:updated', payload);
      io.emit('school:class-roster:updated', payload);
      
      // Also emit to dashboard room for realtime updates
      if (tenantId) {
        io.to(`school-admin-dashboard:${tenantId}`).emit('school-admin:dashboard:update', {
          type: 'students_updated',
          timestamp: new Date()
        });
      }
    }

    res.json({
      success: true,
      message: `${assignedStudentIds.length} student(s) assigned to ${derivedClassName}`,
      count: assignedStudentIds.length,
      results: assignmentResults,
    });
  } catch (error) {
    console.error('Error assigning students:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate pre-filled registration link
export const generateRegistrationLink = async (req, res) => {
  try {
    const { classId, className } = req.body;
    const teacherId = req.user._id;
    const { tenantId } = req;

    // Create a unique registration code
    const registrationCode = `REG-${tenantId || 'public'}-${classId}-${Date.now()}`;
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const registrationLink = `${baseUrl}/register?code=${registrationCode}&class=${classId}&className=${encodeURIComponent(className)}&teacher=${teacherId}`;

    // Store registration code
    await User.findByIdAndUpdate(teacherId, {
      $push: {
        'metadata.registrationCodes': {
          code: registrationCode,
          classId,
          className,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
        }
      }
    });

    res.json({
      success: true,
      registrationLink,
      registrationCode
    });
  } catch (error) {
    console.error('Error generating registration link:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Bulk upload students from CSV
export const bulkUploadStudents = async (req, res) => {
  try {
    const { classId, className } = req.body;
    const teacherId = req.user._id;
    const { tenantId, isLegacyUser } = req;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Parse CSV file
    const csvData = req.file.buffer.toString('utf8');
    const lines = csvData.split('\n').filter(line => line.trim());

    if (lines.length === 0) {
      return res.status(400).json({ message: 'CSV file is empty' });
    }

    // Parse header
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['reg_no', 'first_name', 'last_name', 'dob', 'phone', 'email', 'grade', 'section'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

    if (missingHeaders.length > 0) {
      return res.status(400).json({
        message: `Missing required columns: ${missingHeaders.join(', ')}`
      });
    }

    // Parse rows
    const successResults = [];
    const errorResults = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim());
        const student = {};

        headers.forEach((header, index) => {
          student[header] = values[index] || '';
        });

        // Validate required fields
        if (!student.reg_no || !student.first_name || !student.last_name || !student.email || !student.phone) {
          errorResults.push({
            row: i,
            error: 'Missing required fields',
            data: student
          });
          continue;
        }

        // Check if student already exists
        const existingStudent = await User.findOne({
          $or: [
            { registrationNumber: student.reg_no },
            { email: student.email }
          ]
        });

        if (existingStudent) {
          // Assign existing student to class
          await User.findByIdAndUpdate(existingStudent._id, {
            $addToSet: {
              'metadata.classes': {
                classId,
                className,
                teacherId,
                assignedAt: new Date()
              }
            }
          });

          successResults.push({
            row: i,
            action: 'assigned_existing',
            studentId: existingStudent._id,
            name: existingStudent.name
          });
        } else {
          // Create new student
          const newStudent = await User.create({
            name: `${student.first_name} ${student.last_name}`,
            email: student.email,
            phone: student.phone,
            registrationNumber: student.reg_no,
            dateOfBirth: student.dob,
            role: 'school_student',
            tenantId: !isLegacyUser ? tenantId : undefined,
            password: `${student.reg_no}@2024`, // Default password
            metadata: {
              grade: student.grade,
              section: student.section,
              classes: [{
                classId,
                className,
                teacherId,
                assignedAt: new Date()
              }]
            }
          });

          successResults.push({
            row: i,
            action: 'created_new',
            studentId: newStudent._id,
            name: newStudent.name
          });
        }
      } catch (error) {
        errorResults.push({
          row: i,
          error: error.message,
          data: {}
        });
      }
    }

    // Emit socket events for real-time updates
    const io = req.app && typeof req.app.get === 'function' ? req.app.get('io') : null;
    if (io && successResults.length > 0 && classId) {
      const studentIds = successResults
        .filter(r => r.studentId)
        .map(r => r.studentId.toString());
      
      if (studentIds.length > 0) {
        const payload = {
          tenantId,
          orgId: req.user?.orgId ? req.user.orgId.toString() : null,
          classId: classId.toString(),
          studentIds,
          section: req.body.section || 'A',
          count: studentIds.length,
          updatedAt: new Date().toISOString(),
          action: 'bulk_upload'
        };

        io.emit('school:students:updated', payload);
        io.emit('school:class-roster:updated', payload);
      }
    }

    res.json({
      success: true,
      successCount: successResults.length,
      errorCount: errorResults.length,
      successRows: successResults,
      errors: errorResults,
      message: `Imported ${successResults.length} students successfully`
    });
  } catch (error) {
    console.error('Error bulk uploading students:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get Inavora catalog
export const getInavoraCatalog = async (req, res) => {
  try {
    // Mock Inavora modules - in production, fetch from Inavora API
    const modules = [
      {
        _id: "inv1",
        title: "Financial Literacy - Budgeting",
        provider: "Inavora",
        duration: 20,
        module_id: "FL-001",
        previewUrl: "https://inavora.com/preview/FL-001"
      },
      {
        _id: "inv2",
        title: "Brain Health - Memory Techniques",
        provider: "Inavora",
        duration: 25,
        module_id: "BH-002",
        previewUrl: "https://inavora.com/preview/BH-002"
      },
      {
        _id: "inv3",
        title: "Digital Citizenship - Online Safety",
        provider: "Inavora",
        duration: 30,
        module_id: "DC-003",
        previewUrl: "https://inavora.com/preview/DC-003"
      }
    ];

    res.json({ success: true, modules });
  } catch (error) {
    console.error("Error fetching Inavora catalog:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get available badges
export const getAvailableBadges = async (req, res) => {
  try {
    const badges = [
      { _id: "b1", name: "Quick Learner", description: "Complete assignment under time" },
      { _id: "b2", name: "Perfect Score", description: "Get 100% on assignment" },
      { _id: "b3", name: "Persistence", description: "Complete all attempts" },
      { _id: "b4", name: "Early Bird", description: "Submit before half time" },
      { _id: "b5", name: "Team Player", description: "Help others learn" },
      { _id: "b6", name: "Champion", description: "Top 3 in class" }
    ];

    res.json({ success: true, badges });
  } catch (error) {
    console.error("Error fetching badges:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get students for assignment
export const getStudentsForAssignment = async (req, res) => {
  try {
    const { classIds, scopeType } = req.body;
    const { tenantId, isLegacyUser } = req;

    let query = { role: { $in: ['student', 'school_student'] } };
    
    if (!isLegacyUser && tenantId) {
      query.tenantId = tenantId;
    }

    // If specific classes, filter by class
    if (scopeType === "single_class" || scopeType === "multiple_classes") {
      query['metadata.classes.classId'] = { $in: classIds };
    }

    const students = await User.find(query)
      .select('name email avatar')
      .lean();

    res.json({ success: true, students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// AI suggest students based on weak pillars
export const aiSuggestStudents = async (req, res) => {
  try {
    const { classIds } = req.body;
    const { tenantId, isLegacyUser } = req;

    // Get students in classes
    let query = {
      role: { $in: ['student', 'school_student'] },
      'metadata.classes.classId': { $in: classIds }
    };
    
    if (!isLegacyUser && tenantId) {
      query.tenantId = tenantId;
    }

    const students = await User.find(query).select('name').lean();

    // Fetch game progress for each student to identify weak pillars
    const suggestions = await Promise.all(
      students.map(async (student) => {
        const gameProgress = await UnifiedGameProgress.find({ userId: student._id }).lean();
        
        // Calculate performance per pillar
        const pillars = {};
        const pillarNames = ['Financial Literacy', 'Brain Health', 'UVLS', 'Digital Citizenship', 'Moral Values', 'AI for All'];
        
        pillarNames.forEach(pillar => {
          const pillarGames = gameProgress.filter(g => g.category === pillar);
          if (pillarGames.length > 0) {
            const avgProgress = pillarGames.reduce((sum, g) => sum + (g.progress || 0), 0) / pillarGames.length;
            pillars[pillar] = avgProgress;
          }
        });

        // Find weak pillars (< 50% progress)
        const weakPillars = Object.entries(pillars)
          .filter(([_, progress]) => progress < 50)
          .map(([pillar, _]) => pillar);

        // Only suggest if student has weak pillars
        if (weakPillars.length > 0) {
          return {
            studentId: student._id,
            studentName: student.name,
            weakPillars,
            confidence: Math.round(70 + Math.random() * 25) // 70-95% confidence
          };
        }
        return null;
      })
    );

    const filteredSuggestions = suggestions.filter(s => s !== null);

    res.json({
      success: true,
      suggestions: filteredSuggestions
    });
  } catch (error) {
    console.error("Error generating AI suggestions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Helper function to format time ago
const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

// ============= NEW SCHOOL ADMIN ANALYTICS ENDPOINTS =============

// 1. Active students vs enrolled (adoption %)
export const getStudentAdoption = async (req, res) => {
  try {
    const { tenantId } = req;
    const { classId, section } = req.query;

    // Build query filter
    const filter = { tenantId, isActive: true };
    if (classId) filter.classId = classId;
    if (section) filter.section = section;

    const totalEnrolled = await SchoolStudent.countDocuments(filter);
    
    // Active students are those who have logged in within the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get all student user IDs
    const students = await SchoolStudent.find(filter).select('userId');
    const studentUserIds = students.map(s => s.userId);

    // Count active users
    const activeStudents = await User.countDocuments({
      _id: { $in: studentUserIds },
      lastActive: { $gte: thirtyDaysAgo }
    });

    const adoptionRate = totalEnrolled > 0 
      ? ((activeStudents / totalEnrolled) * 100).toFixed(2) 
      : 0;

    res.json({
      totalEnrolled,
      activeStudents,
      inactiveStudents: totalEnrolled - activeStudents,
      adoptionRate: parseFloat(adoptionRate)
    });
  } catch (error) {
    console.error('Error fetching student adoption:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. Average pillar mastery school-wide (with grade filters)
export const getSchoolPillarMastery = async (req, res) => {
  try {
    const { tenantId } = req;
    const { classId, section } = req.query;

    // Build query filter
    const filter = { tenantId };
    const { grade } = req.query;
    
    if (classId && classId !== 'all') filter.classId = classId;
    if (section && section !== 'all') filter.section = section;
    if (grade && grade !== 'all') {
      // Find classes with the specified grade
      const classes = await SchoolClass.find({ 
        tenantId, 
        classNumber: parseInt(grade) 
      }).select('_id').lean();
      if (classes.length > 0) {
        filter.classId = { $in: classes.map(c => c._id) };
      } else {
        // No classes found for this grade
        return res.json({
          averages: {
            uvls: 0,
            dcos: 0,
            moral: 0,
            ehe: 0,
            crgc: 0,
            overall: 0,
            pillars: {
              uvls: 0,
              dcos: 0,
              moral: 0,
              ehe: 0,
              crgc: 0,
              overall: 0
            }
          },
          totalStudents: 0,
          byClass: []
        });
      }
    }

    const students = await SchoolStudent.find(filter)
      .populate('userId', '_id')
      .populate('classId', 'classNumber stream')
      .select('userId classId section')
      .lean();

    if (students.length === 0) {
      return res.json({
        averages: {
          uvls: 0,
          dcos: 0,
          moral: 0,
          ehe: 0,
          crgc: 0,
          overall: 0,
          pillars: {
            uvls: 0,
            dcos: 0,
            moral: 0,
            ehe: 0,
            crgc: 0,
            overall: 0
          }
        },
        totalStudents: 0,
        byClass: []
      });
    }

    const studentIds = students.map((student) => student.userId?._id).filter(Boolean);
    if (studentIds.length === 0) {
      return res.json({
        averages: {
          uvls: 0,
          dcos: 0,
          moral: 0,
          ehe: 0,
          crgc: 0,
          overall: 0,
          pillars: {
            uvls: 0,
            dcos: 0,
            moral: 0,
            ehe: 0,
            crgc: 0,
            overall: 0
          }
        },
        totalStudents: 0,
        byClass: []
      });
    }

    const userClassMap = students.reduce((acc, student) => {
      if (student.userId?._id) {
        acc[student.userId._id.toString()] = {
          classId: student.classId?._id,
          section: student.section
        };
      }
      return acc;
    }, {});

    const mapGameTypeToPillarKey = (gameType) => {
      switch (gameType) {
        case 'finance':
        case 'financial':
          return 'finance';
        case 'brain':
        case 'mental':
          return 'brain';
        case 'uvls':
          return 'uvls';
        case 'dcos':
          return 'dcos';
        case 'moral':
          return 'moral';
        case 'ai':
          return 'ai';
        case 'health-male':
          return 'health-male';
        case 'health-female':
          return 'health-female';
        case 'ehe':
          return 'ehe';
        case 'crgc':
        case 'civic-responsibility':
          return 'crgc';
        case 'sustainability':
          return 'sustainability';
        default:
          return null;
      }
    };

    const getProgressPercent = (game) => {
      if (game?.fullyCompleted) return 100;
      if (game?.totalLevels > 0) {
        return Math.round(((game.levelsCompleted || 0) / game.totalLevels) * 100);
      }
      if (game?.maxScore > 0) {
        return Math.round(((game.highestScore || 0) / game.maxScore) * 100);
      }
      return 0;
    };

    const pillarGameCounts = await getAllPillarGameCounts(UnifiedGameProgress);

    const pillarKeys = [
      'finance',
      'brain',
      'uvls',
      'dcos',
      'moral',
      'ai',
      'health-male',
      'health-female',
      'ehe',
      'crgc',
      'sustainability'
    ];
    const pillarLabelMap = {
      finance: 'Financial Literacy',
      brain: 'Brain Health',
      uvls: 'UVLS (Life Skills & Values)',
      dcos: 'Digital Citizenship & Online Safety',
      moral: 'Moral Values',
      ai: 'AI for All',
      'health-male': 'Health - Male',
      'health-female': 'Health - Female',
      ehe: 'Entrepreneurship & Higher Education',
      crgc: 'Civic Responsibility & Global Citizenship',
      sustainability: 'Sustainability'
    };

    const totals = pillarKeys.reduce((acc, key) => {
      acc[key] = { completed: 0 };
      return acc;
    }, {});

    const classTotals = {};
    students.forEach((student) => {
      if (!student.userId?._id) return;
      const classKey = student.classId?._id?.toString() || 'unassigned';
      if (!classTotals[classKey]) {
        classTotals[classKey] = {
          classId: student.classId?._id || null,
          section: student.section || null,
          studentIds: new Set(),
          totals: pillarKeys.reduce((acc, key) => {
            acc[key] = { completed: 0 };
            return acc;
          }, {})
        };
      }
      classTotals[classKey].studentIds.add(student.userId._id.toString());
    });

    const gameProgress = await UnifiedGameProgress.find({
      userId: { $in: studentIds }
    }).lean();

    (gameProgress || []).forEach((game) => {
      const pillarKey = mapGameTypeToPillarKey(game.gameType);
      if (!pillarKey) return;

      const isCompleted = getProgressPercent(game) >= 100;
      if (!isCompleted) return;
      totals[pillarKey].completed += 1;

      const userKey = game.userId?.toString();
      const classInfo = userClassMap[userKey];
      const classKey = classInfo?.classId?.toString() || 'unassigned';

      if (!classTotals[classKey]) {
        classTotals[classKey] = {
          classId: classInfo?.classId || null,
          section: classInfo?.section || null,
          studentIds: new Set(),
          totals: pillarKeys.reduce((acc, key) => {
            acc[key] = { completed: 0 };
            return acc;
          }, {})
        };
      }
      classTotals[classKey].totals[pillarKey].completed += 1;
    });

    const averages = pillarKeys.reduce((acc, key) => {
      const totalGames = pillarGameCounts[key] || 0;
      const totalStudents = studentIds.length;
      const denominator = totalGames * totalStudents;
      acc[key] = denominator > 0
        ? parseFloat(((totals[key].completed / denominator) * 100).toFixed(2))
        : 0;
      return acc;
    }, {});

    const overallValues = pillarKeys
      .map((key) => ((pillarGameCounts[key] || 0) > 0 ? averages[key] : null))
      .filter((value) => value !== null);

    const overall = overallValues.length > 0
      ? parseFloat((overallValues.reduce((sum, value) => sum + value, 0) / overallValues.length).toFixed(2))
      : 0;

    const byClass = Object.values(classTotals).map((cls) => {
      const classStudentCount = cls.studentIds?.size || 0;
      const classAverages = pillarKeys.reduce((acc, key) => {
        const totalGames = pillarGameCounts[key] || 0;
        const denominator = totalGames * classStudentCount;
        acc[key] = denominator > 0
          ? parseFloat(((cls.totals[key].completed / denominator) * 100).toFixed(2))
          : 0;
        return acc;
      }, {});
      const classOverallValues = pillarKeys
        .map((key) => ((pillarGameCounts[key] || 0) > 0 ? classAverages[key] : null))
        .filter((value) => value !== null);
      const classOverall = classOverallValues.length > 0
        ? parseFloat((classOverallValues.reduce((sum, value) => sum + value, 0) / classOverallValues.length).toFixed(2))
        : 0;

      return {
        classId: cls.classId,
        section: cls.section,
        studentCount: cls.studentIds?.size || 0,
        averages: {
          ...classAverages,
          overall: classOverall
        }
      };
    });

    res.json({
      averages: {
        ...averages,
        overall,
        pillars: {
          ...averages,
          overall
        }
      },
      totalStudents: studentIds.length,
      byClass
    });
  } catch (error) {
    console.error('Error fetching pillar mastery:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. Number of flagged wellbeing cases (open vs resolved)
export const getWellbeingCases = async (req, res) => {
  try {
    const { tenantId } = req;
    const { classId, section, severity } = req.query;

    // Build query filter
    const filter = { tenantId, isActive: true };
    if (classId) filter.classId = classId;
    if (section) filter.section = section;

    const students = await SchoolStudent.find(filter)
      .select('wellbeingFlags userId classId section')
      .populate('userId', 'name email');

    let allFlags = [];
    students.forEach(student => {
      if (student.wellbeingFlags && student.wellbeingFlags.length > 0) {
        student.wellbeingFlags.forEach(flag => {
          allFlags.push({
            studentId: student._id,
            studentName: student.userId?.name,
            studentEmail: student.userId?.email,
            classId: student.classId,
            section: student.section,
            ...flag.toObject()
          });
        });
      }
    });

    // Filter by severity if provided
    if (severity) {
      allFlags = allFlags.filter(flag => flag.severity === severity);
    }

    const openCases = allFlags.filter(flag => flag.status === 'open');
    const inProgressCases = allFlags.filter(flag => flag.status === 'in_progress');
    const resolvedCases = allFlags.filter(flag => flag.status === 'resolved');

    // Count by type
    const byType = {};
    allFlags.forEach(flag => {
      if (!byType[flag.type]) {
        byType[flag.type] = { open: 0, in_progress: 0, resolved: 0, total: 0 };
      }
      byType[flag.type][flag.status]++;
      byType[flag.type].total++;
    });

    // Count by severity
    const bySeverity = {
      low: allFlags.filter(f => f.severity === 'low').length,
      medium: allFlags.filter(f => f.severity === 'medium').length,
      high: allFlags.filter(f => f.severity === 'high').length
    };

    res.json({
      total: allFlags.length,
      open: openCases.length,
      inProgress: inProgressCases.length,
      resolved: resolvedCases.length,
      byType,
      bySeverity,
      recentCases: allFlags
        .sort((a, b) => new Date(b.flaggedAt) - new Date(a.flaggedAt))
        .slice(0, 10)
    });
  } catch (error) {
    console.error('Error fetching wellbeing cases:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 4. Teacher adoption (DAU/MAU) & pending training completions
export const getTeacherAdoption = async (req, res) => {
  try {
    const { tenantId } = req;

    const totalTeachers = await User.countDocuments({ 
      tenantId, 
      role: 'school_teacher' 
    });

    // Daily Active Users (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const dau = await User.countDocuments({
      tenantId,
      role: 'school_teacher',
      lastActive: { $gte: oneDayAgo }
    });

    // Monthly Active Users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const mau = await User.countDocuments({
      tenantId,
      role: 'school_teacher',
      lastActive: { $gte: thirtyDaysAgo }
    });

    // Get training completions
    const teachers = await User.find({
      tenantId,
      role: 'school_teacher'
    }).select('trainingModules name email');

    let totalModules = 0;
    let completedModules = 0;
    let pendingModules = 0;
    let inProgressModules = 0;

    const teacherTrainingStatus = teachers.map(teacher => {
      const modules = teacher.trainingModules || [];
      const completed = modules.filter(m => m.status === 'completed').length;
      const pending = modules.filter(m => m.status === 'not_started').length;
      const inProgress = modules.filter(m => m.status === 'in_progress').length;

      totalModules += modules.length;
      completedModules += completed;
      pendingModules += pending;
      inProgressModules += inProgress;

      return {
        teacherId: teacher._id,
        teacherName: teacher.name,
        teacherEmail: teacher.email,
        totalModules: modules.length,
        completedModules: completed,
        pendingModules: pending,
        inProgressModules: inProgress,
        completionRate: modules.length > 0 
          ? parseFloat(((completed / modules.length) * 100).toFixed(2))
          : 0
      };
    });

    const dauRate = totalTeachers > 0 
      ? parseFloat(((dau / totalTeachers) * 100).toFixed(2)) 
      : 0;
    
    const mauRate = totalTeachers > 0 
      ? parseFloat(((mau / totalTeachers) * 100).toFixed(2)) 
      : 0;

    const overallTrainingCompletion = totalModules > 0
      ? parseFloat(((completedModules / totalModules) * 100).toFixed(2))
      : 0;

    res.json({
      totalTeachers,
      dau,
      dauRate,
      mau,
      mauRate,
      training: {
        totalModules,
        completedModules,
        pendingModules,
        inProgressModules,
        completionRate: overallTrainingCompletion
      },
      teacherTrainingStatus: teacherTrainingStatus.sort((a, b) => a.completionRate - b.completionRate)
    });
  } catch (error) {
    console.error('Error fetching teacher adoption:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 5. NEP alignment index (percent of competencies covered)
export const getNEPAlignment = async (req, res) => {
  try {
    const { tenantId } = req;

    // NEP 2020 defines 5 core pillars we're tracking
    const nepPillars = ['uvls', 'dcos', 'moral', 'ehe', 'crgc'];
    
    // Get average pillar mastery across all students
    const students = await SchoolStudent.find({ tenantId, isActive: true })
      .select('pillars');

    if (students.length === 0) {
      return res.json({
        alignmentIndex: 0,
        pillarsAboveThreshold: 0,
        totalPillars: 5,
        pillarsMastery: {},
        nepComplianceLevel: 'Not Started'
      });
    }

    const pillarTotals = {
      uvls: 0,
      dcos: 0,
      moral: 0,
      ehe: 0,
      crgc: 0
    };

    students.forEach(student => {
      if (student.pillars) {
        pillarTotals.uvls += student.pillars.uvls || 0;
        pillarTotals.dcos += student.pillars.dcos || 0;
        pillarTotals.moral += student.pillars.moral || 0;
        pillarTotals.ehe += student.pillars.ehe || 0;
        pillarTotals.crgc += student.pillars.crgc || 0;
      }
    });

    const count = students.length;
    const pillarsMastery = {
      uvls: parseFloat((pillarTotals.uvls / count).toFixed(2)),
      dcos: parseFloat((pillarTotals.dcos / count).toFixed(2)),
      moral: parseFloat((pillarTotals.moral / count).toFixed(2)),
      ehe: parseFloat((pillarTotals.ehe / count).toFixed(2)),
      crgc: parseFloat((pillarTotals.crgc / count).toFixed(2))
    };

    // NEP considers a competency "covered" if average mastery is above 60%
    const threshold = 60;
    const pillarsAboveThreshold = Object.values(pillarsMastery).filter(
      value => value >= threshold
    ).length;

    // Calculate overall alignment index (0-100)
    const alignmentIndex = parseFloat(
      ((pillarsAboveThreshold / nepPillars.length) * 100).toFixed(2)
    );

    // Determine compliance level
    let nepComplianceLevel = 'Not Started';
    if (alignmentIndex >= 80) nepComplianceLevel = 'Excellent';
    else if (alignmentIndex >= 60) nepComplianceLevel = 'Good';
    else if (alignmentIndex >= 40) nepComplianceLevel = 'Developing';
    else if (alignmentIndex > 0) nepComplianceLevel = 'Beginning';

    res.json({
      alignmentIndex,
      pillarsAboveThreshold,
      totalPillars: nepPillars.length,
      pillarsMastery,
      nepComplianceLevel,
      recommendations: generateNEPRecommendations(pillarsMastery)
    });
  } catch (error) {
    console.error('Error fetching NEP alignment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to generate NEP recommendations
const generateNEPRecommendations = (pillarsMastery) => {
  const recommendations = [];
  const pillarNames = {
    uvls: 'Understanding Values & Life Skills',
    dcos: 'Digital Citizenship & Online Safety',
    moral: 'Moral & Spiritual Education',
    ehe: 'Environmental & Health Education',
    crgc: 'Cultural Roots & Global Citizenship'
  };

  Object.entries(pillarsMastery).forEach(([pillar, mastery]) => {
    if (mastery < 60) {
      recommendations.push({
        pillar: pillarNames[pillar],
        currentMastery: mastery,
        priority: mastery < 40 ? 'high' : 'medium',
        suggestion: `Increase focus on ${pillarNames[pillar]} activities and assessments`
      });
    }
  });

  return recommendations.sort((a, b) => a.currentMastery - b.currentMastery);
};

// ============= NEW COMPREHENSIVE SCHOOL ADMIN ENDPOINTS =============

// 1. Get organization campuses
export const getOrganizationCampuses = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;

    if (!orgId) {
      return res.json({ campuses: [], mainCampus: null });
    }

    const organization = await Organization.findOne({ _id: orgId, tenantId })
      .populate('campuses.principal', 'name email');

    if (!organization) {
      return res.json({ campuses: [], mainCampus: null });
    }

    // Filter campuses based on user permissions
    let accessibleCampuses = organization.campuses || [];
    
    // Check if user has campus restrictions
    if (req.rolePermission) {
      const { canAccessCampus } = await import('../utils/permissionChecker.js');
      const userCampusId = req.user?.campusId;
      
      // If user can only view own campus, filter to their campus
      if (req.rolePermission.permissions?.viewOwnCampusOnly && !req.rolePermission.permissions?.viewAllCampuses) {
        accessibleCampuses = accessibleCampuses.filter(campus => {
          return canAccessCampus(req.rolePermission, userCampusId, campus.campusId);
        });
      }
    }

    // Calculate real-time statistics for each campus
    const campusesWithStats = await Promise.all(
      accessibleCampuses.map(async (campus) => {
        const campusId = campus.campusId;

        // Calculate real-time student count
        const studentCount = await SchoolStudent.countDocuments({
          tenantId,
          campusId,
          isActive: true
        });

        // Calculate real-time teacher count
        const teacherCount = await User.countDocuments({
          tenantId,
          campusId,
          role: 'school_teacher',
          isActive: true
        });

        // Calculate real-time class count (count distinct classes that have students from this campus)
        let classCount = 0;
        try {
          const classIds = await SchoolStudent.distinct('classId', {
            tenantId,
            campusId,
            isActive: true,
            classId: { $exists: true, $ne: null }
          });
          classCount = classIds ? classIds.length : 0;
        } catch (error) {
          console.error(`Error calculating class count for campus ${campusId}:`, error);
          classCount = 0;
        }

        return {
          ...(campus.toObject ? campus.toObject() : campus),
          studentCount,
          teacherCount,
          classCount: classCount || 0
        };
      })
    );

    res.json({
      campuses: campusesWithStats,
      mainCampus: campusesWithStats.find(c => c.isMain),
    });
  } catch (error) {
    console.error('Error fetching campuses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. Add new campus
export const addCampus = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { name, code, location, contactInfo, principalId } = req.body;

    if (!orgId) {
      return res.status(400).json({ message: 'Organization ID required' });
    }

    const organization = await Organization.findOne({ _id: orgId, tenantId });
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const campusId = `CAMPUS_${Date.now()}`;
    const newCampus = {
      campusId,
      name,
      code,
      location,
      contactInfo,
      principal: principalId,
      isMain: !organization.campuses || organization.campuses.length === 0,
      isActive: true,
      studentCount: 0,
      teacherCount: 0,
    };

    if (!organization.campuses) {
      organization.campuses = [];
    }
    organization.campuses.push(newCampus);
    await organization.save();

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'campus_created',
      targetType: 'campus',
      targetId: campusId,
      targetName: name,
      description: `Campus "${name}" created`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Emit socket events for real-time dashboard updates
    const io = req.app?.get('io');
    if (io && tenantId) {
      io.to(`school-admin-dashboard:${tenantId}`).emit('school:campus:created', {
        campusId,
        campus: newCampus,
        tenantId,
        timestamp: new Date()
      });
      
      io.to(`school-admin-dashboard:${tenantId}`).emit('school-admin:dashboard:update', {
        type: 'campus_created',
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Campus added successfully',
      campus: newCampus,
    });
  } catch (error) {
    console.error('Error adding campus:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. Get comprehensive KPIs
export const getComprehensiveKPIs = async (req, res) => {
  try {
    const { tenantId } = req;
    const { campusId } = req.query;

    const filter = { tenantId, isActive: true };
    if (campusId) filter.campusId = campusId;

    // Get all key metrics in parallel
    const [
      totalStudents,
      activeStudents30d,
      totalTeachers,
      activeTeachers30d,
      totalClasses,
      avgAttendance,
      pendingAssignments,
      wellbeingFlags,
      avgPillarMastery,
    ] = await Promise.all([
      SchoolStudent.countDocuments(filter),
      SchoolStudent.find(filter).populate({
        path: 'userId',
        match: { lastActive: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      }).then(students => students.filter(s => s.userId).length),
      User.countDocuments({ tenantId, role: 'school_teacher', ...(campusId && { campusId }) }),
      User.countDocuments({
        tenantId,
        role: 'school_teacher',
        lastActive: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        ...(campusId && { campusId }),
      }),
      SchoolClass.countDocuments({ tenantId }),
      SchoolStudent.aggregate([
        { $match: filter },
        { $group: { _id: null, avg: { $avg: '$attendance.percentage' } } },
      ]),
      Assignment.countDocuments({
        tenantId,
        status: { $in: ['pending_approval', 'pending'] },
      }),
      SchoolStudent.aggregate([
        { $match: filter },
        { $unwind: '$wellbeingFlags' },
        { $match: { 'wellbeingFlags.status': { $in: ['open', 'in_progress'] } } },
        { $count: 'total' },
      ]),
      SchoolStudent.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            avgUvls: { $avg: '$pillars.uvls' },
            avgDcos: { $avg: '$pillars.dcos' },
            avgMoral: { $avg: '$pillars.moral' },
            avgEhe: { $avg: '$pillars.ehe' },
            avgCrgc: { $avg: '$pillars.crgc' },
          },
        },
      ]),
    ]);

    const studentAdoptionRate = totalStudents > 0
      ? ((activeStudents30d / totalStudents) * 100).toFixed(2)
      : 0;

    const teacherAdoptionRate = totalTeachers > 0
      ? ((activeTeachers30d / totalTeachers) * 100).toFixed(2)
      : 0;

      const avgPillar = avgPillarMastery[0] || {};
      const overallPillarMastery = avgPillar._id
        ? ((avgPillar.avgUvls + avgPillar.avgDcos + avgPillar.avgMoral + avgPillar.avgEhe + avgPillar.avgCrgc) / 5).toFixed(2)
        : 0;

      const attendanceAverageRaw = avgAttendance[0]?.avg || 0;
      const attendanceFallback = totalStudents > 0
        ? (activeStudents30d / totalStudents) * 100
        : 0;
      const attendanceAverage = attendanceAverageRaw > 0
        ? attendanceAverageRaw
        : attendanceFallback;

    res.json({
      students: {
        total: totalStudents,
        active: activeStudents30d,
        adoptionRate: parseFloat(studentAdoptionRate),
      },
      teachers: {
        total: totalTeachers,
        active: activeTeachers30d,
        adoptionRate: parseFloat(teacherAdoptionRate),
      },
      classes: {
        total: totalClasses,
      },
        attendance: {
          average: parseFloat(attendanceAverage.toFixed(2)),
        },
      pendingApprovals: pendingAssignments,
      wellbeingCases: wellbeingFlags[0]?.total || 0,
      pillarMastery: {
        overall: parseFloat(overallPillarMastery),
        breakdown: {
          uvls: avgPillar.avgUvls || 0,
          dcos: avgPillar.avgDcos || 0,
          moral: avgPillar.avgMoral || 0,
          ehe: avgPillar.avgEhe || 0,
          crgc: avgPillar.avgCrgc || 0,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching comprehensive KPIs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 4. Get heatmap data (adoption & pillar coverage by grade & campus)
export const getHeatmapData = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;

    // If no organization, return default campus
    let campuses = [{ campusId: 'default', name: 'Main Campus', isMain: true, isActive: true }];
    
    if (orgId) {
      const organization = await Organization.findOne({ _id: orgId, tenantId });
      if (organization && organization.campuses && organization.campuses.length > 0) {
        campuses = organization.campuses;
      }
    }

    const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    // Get all classes for grade mapping
    const classes = await SchoolClass.find({ tenantId }).select('classNumber');
    const classMap = {};
    classes.forEach(cls => {
      classMap[cls._id.toString()] = cls.classNumber;
    });

    // Build heatmap data
    const heatmapData = {
      adoption: [],
      pillars: [],
    };

    for (const campus of campuses) {
      for (const grade of grades) {
        // Find students by matching class numbers to grades
        const classIds = Object.keys(classMap).filter(id => classMap[id] === grade);

        const students = await SchoolStudent.find({
          tenantId,
          campusId: campus.campusId,
          classId: { $in: classIds.map(id => id) },
          isActive: true,
        }).populate('userId');

        const totalStudents = students.length;
        const activeStudents = students.filter(
          s => s.userId && s.userId.lastActive >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length;

        const adoptionRate = totalStudents > 0 ? (activeStudents / totalStudents) * 100 : 0;

        // Calculate average pillar mastery
        let pillarSum = 0;
        let pillarCount = 0;

        students.forEach(student => {
          if (student.pillars) {
            pillarSum += (student.pillars.uvls || 0) +
                        (student.pillars.dcos || 0) +
                        (student.pillars.moral || 0) +
                        (student.pillars.ehe || 0) +
                        (student.pillars.crgc || 0);
            pillarCount += 5;
          }
        });

        const avgPillarMastery = pillarCount > 0 ? pillarSum / pillarCount : 0;

        heatmapData.adoption.push({
          campus: campus.name,
          campusId: campus.campusId,
          grade: `Grade ${grade}`,
          gradeNumber: grade,
          value: parseFloat(adoptionRate.toFixed(2)),
          total: totalStudents,
          active: activeStudents,
        });

        heatmapData.pillars.push({
          campus: campus.name,
          campusId: campus.campusId,
          grade: `Grade ${grade}`,
          gradeNumber: grade,
          value: parseFloat(avgPillarMastery.toFixed(2)),
          studentCount: totalStudents,
        });
      }
    }

    res.json(heatmapData);
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// 5. Get pending approvals queue
export const getPendingApprovals = async (req, res) => {
  try {
    const { tenantId } = req;
    const { type, limit = 20, page = 1 } = req.query;

    const filter = {
      tenantId,
      status: 'pending_approval',
    };

    if (type) {
      filter.scope = type;
    }

    const [assignments, total] = await Promise.all([
      Assignment.find(filter)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .populate('teacherId', 'name email')
        .populate('classId', 'classNumber stream'),
      Assignment.countDocuments(filter),
    ]);

    // Get templates pending approval
    const templatesFilter = {
      approvalStatus: 'pending',
    };
    if (!type || type === 'template') {
      templatesFilter.tenantId = tenantId;
    }

    const pendingTemplates = await Template.find(templatesFilter)
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('createdBy', 'name email');

    res.json({
      assignments: assignments.map(a => ({
        id: a._id,
        type: 'assignment',
        title: a.title,
        description: a.description,
        scope: a.scope,
        teacher: a.teacherId,
        class: a.classId,
        createdAt: a.createdAt,
        priority: a.priority || 'medium',
        requiresApproval: a.approvalRequired,
      })),
      templates: pendingTemplates.map(t => ({
        id: t._id,
        type: 'template',
        title: t.title,
        description: t.description,
        category: t.category,
        creator: t.createdBy,
        createdAt: t.createdAt,
        isPremium: t.isPremium,
      })),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 6. Approve/Reject assignment or template
export const approveOrRejectItem = async (req, res) => {
  try {
    const { itemId, type, action, reason } = req.body;
    const userId = req.user?._id;
    const { tenantId } = req;

    let result;

    if (type === 'assignment') {
      const assignment = await Assignment.findById(itemId);
      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }

      if (action === 'approve') {
        assignment.status = 'approved';
        assignment.approvedBy = userId;
        assignment.approvedAt = new Date();
      } else {
        assignment.status = 'rejected';
        assignment.rejectionReason = reason;
      }

      await assignment.save();
      result = assignment;
    } else if (type === 'template') {
      const template = await Template.findById(itemId);
      if (!template) {
        return res.status(404).json({ message: 'Template not found' });
      }

      if (action === 'approve') {
        template.approvalStatus = 'approved';
        template.approvedBy = userId;
      } else {
        template.approvalStatus = 'rejected';
      }

      await template.save();
      result = template;
    }

    // Emit socket events for realtime dashboard updates
    const io = req.app?.get('io');
    if (io && tenantId) {
      if (type === 'assignment') {
        io.to(`school-admin-dashboard:${tenantId}`).emit(action === 'approve' ? 'assignment:approved' : 'assignment:rejected', {
          itemId,
          type,
          action,
          tenantId,
          timestamp: new Date()
        });
      } else if (type === 'template') {
        io.to(`school-admin-dashboard:${tenantId}`).emit(action === 'approve' ? 'template:approved' : 'template:rejected', {
          itemId,
          type,
          action,
          tenantId,
          timestamp: new Date()
        });
      }
      
      // Emit general dashboard update
      io.to(`school-admin-dashboard:${tenantId}`).emit('school-admin:dashboard:update', {
        type: 'approval_update',
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      message: `${type} ${action}d successfully`,
      item: result,
    });
  } catch (error) {
    console.error('Error approving/rejecting item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 7. Get all staff (teachers, admin, etc.)
export const getAllStaff = async (req, res) => {
  try {
    const { tenantId } = req;
    const { campusId, role, search, page = 1, limit = 20 } = req.query;

    const filter = {
      tenantId,
      role: { $in: ['school_teacher', 'school_admin', 'school_accountant', 'school_librarian'] },
    };

    if (campusId) filter.campusId = campusId;
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [staff, total] = await Promise.all([
      User.find(filter)
        .select('name email role campusId subjects position lastActive trainingModules createdAt')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit)),
      User.countDocuments(filter),
    ]);

    res.json({
      staff: staff.map(s => ({
        id: s._id,
        name: s.name,
        email: s.email,
        role: s.role,
        campusId: s.campusId,
        subjects: s.subjects,
        position: s.position,
        lastActive: s.lastActive,
        trainingProgress: s.trainingModules
          ? (s.trainingModules.filter(m => m.status === 'completed').length / s.trainingModules.length) * 100
          : 0,
        createdAt: s.createdAt,
      })),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 8. Assign teacher to class
export const assignTeacherToClass = async (req, res) => {
  try {
    const { teacherId, classId, section, isClassTeacher } = req.body;
    const { tenantId } = req;

    const teacher = await User.findOne({ _id: teacherId, tenantId, role: 'school_teacher' });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const schoolClass = await SchoolClass.findOne({ _id: classId, tenantId });
    if (!schoolClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Find or create section
    let targetSection = schoolClass.sections.find(s => s.sectionName === section);
    if (!targetSection) {
      schoolClass.sections.push({
        sectionName: section,
        classTeacher: isClassTeacher ? teacherId : null,
        subjects: [],
        currentStrength: 0,
        maxStrength: 40,
      });
      targetSection = schoolClass.sections[schoolClass.sections.length - 1];
    } else if (isClassTeacher) {
      targetSection.classTeacher = teacherId;
    }

    await schoolClass.save();

    res.json({
      success: true,
      message: 'Teacher assigned successfully',
      class: schoolClass,
    });
  } catch (error) {
    console.error('Error assigning teacher:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 9. Get templates
export const getTemplates = async (req, res) => {
  try {
    const { tenantId } = req;
    const { category, type, search, page = 1, limit = 20 } = req.query;

    const filter = {
      $or: [
        { tenantId },
        { isGlobal: true },
      ],
      isActive: true,
      approvalStatus: 'approved',
    };

    if (category) filter.category = category;
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const [templates, total] = await Promise.all([
      Template.find(filter)
        .select('-questions') // Don't send full questions in list
        .sort({ usageCount: -1, createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .populate('createdBy', 'name'),
      Template.countDocuments(filter),
    ]);

    res.json({
      templates,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 10. Create template
export const createTemplate = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const userId = req.user?._id;
    const templateData = req.body;

    const template = await Template.create({
      ...templateData,
      tenantId,
      orgId,
      createdBy: userId,
      approvalStatus: templateData.isPublic ? 'pending' : 'approved',
    });

    // Emit socket event for real-time updates
    const io = req.app?.get('io');
    if (io && tenantId) {
      io.to(`school-admin-dashboard:${tenantId}`).emit('template:created', {
        templateId: template._id,
        template: template.toObject ? template.toObject() : template,
        tenantId,
        timestamp: new Date()
      });
      
      io.to(`school-admin-dashboard:${tenantId}`).emit('school-admin:dashboard:update', {
        type: 'template_created',
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Template created successfully',
      template,
    });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get template by ID
export const getTemplateById = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { tenantId } = req;

    const template = await Template.findOne({ _id: templateId })
      .populate('createdBy', 'name email');

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve template
export const approveTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { tenantId } = req;
    const userId = req.user?._id;

    const template = await Template.findOne({ _id: templateId });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    template.approvalStatus = 'approved';
    template.approvedBy = userId;
    await template.save();

    // Emit socket event for real-time updates
    const io = req.app?.get('io');
    if (io && tenantId) {
      io.to(`school-admin-dashboard:${tenantId}`).emit('template:approved', {
        templateId: template._id,
        template: template.toObject ? template.toObject() : template,
        tenantId,
        timestamp: new Date()
      });
      
      io.to(`school-admin-dashboard:${tenantId}`).emit('school-admin:dashboard:update', {
        type: 'template_approved',
        timestamp: new Date()
      });
    }

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: template.orgId,
      userId,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'template_approved',
      targetType: 'template',
      targetId: template._id,
      targetName: template.title,
      description: `Template "${template.title}" approved`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Notify creator
    if (template.createdBy) {
      await Notification.create({
        userId: template.createdBy,
        type: 'template_approved',
        title: 'Template Approved',
        message: `Your template "${template.title}" has been approved and is now available.`,
        metadata: {
          templateId: template._id,
          approvedBy: userId,
        },
      });
    }

    res.json({
      success: true,
      message: 'Template approved successfully',
      template,
    });
  } catch (error) {
    console.error('Error approving template:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reject template
export const rejectTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { tenantId } = req;
    const { reason } = req.body;
    const userId = req.user?._id;

    const template = await Template.findOne({ _id: templateId });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    template.approvalStatus = 'rejected';
    template.rejectionReason = reason || 'Template does not meet requirements';
    await template.save();

    // Emit socket event for real-time updates
    const io = req.app?.get('io');
    if (io && tenantId) {
      io.to(`school-admin-dashboard:${tenantId}`).emit('template:rejected', {
        templateId: template._id,
        template: template.toObject ? template.toObject() : template,
        tenantId,
        timestamp: new Date()
      });
      
      io.to(`school-admin-dashboard:${tenantId}`).emit('school-admin:dashboard:update', {
        type: 'template_rejected',
        timestamp: new Date()
      });
    }

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: template.orgId,
      userId,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'template_rejected',
      targetType: 'template',
      targetId: template._id,
      targetName: template.title,
      description: `Template "${template.title}" rejected: ${reason}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Notify creator
    if (template.createdBy) {
      await Notification.create({
        userId: template.createdBy,
        type: 'template_rejected',
        title: 'Template Rejected',
        message: `Your template "${template.title}" was not approved. Reason: ${reason}`,
        metadata: {
          templateId: template._id,
          reason,
        },
      });
    }

    res.json({
      success: true,
      message: 'Template rejected',
      template,
    });
  } catch (error) {
    console.error('Error rejecting template:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 11. Update template
export const updateTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { tenantId } = req;
    const updates = req.body;

    const template = await Template.findOne({ _id: templateId, tenantId });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    Object.assign(template, updates);
    await template.save();

    // Emit socket event for real-time updates
    const io = req.app?.get('io');
    if (io && tenantId) {
      io.to(`school-admin-dashboard:${tenantId}`).emit('template:updated', {
        templateId: template._id,
        template: template.toObject ? template.toObject() : template,
        tenantId,
        timestamp: new Date()
      });
      
      io.to(`school-admin-dashboard:${tenantId}`).emit('school-admin:dashboard:update', {
        type: 'template_updated',
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Template updated successfully',
      template,
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 12. Delete template
export const deleteTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { tenantId } = req;

    const template = await Template.findOne({ _id: templateId, tenantId });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    template.isActive = false;
    await template.save();

    // Emit socket event for real-time updates
    const io = req.app?.get('io');
    if (io && tenantId) {
      io.to(`school-admin-dashboard:${tenantId}`).emit('template:deleted', {
        templateId: template._id,
        templateTitle: template.title,
        tenantId,
        timestamp: new Date()
      });
      
      io.to(`school-admin-dashboard:${tenantId}`).emit('school-admin:dashboard:update', {
        type: 'template_deleted',
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Template deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export templates with NEP competency data
export const exportTemplates = async (req, res) => {
  try {
    const { tenantId } = req;
    const { format = 'csv', category, includeNEP = 'true' } = req.query;

    const filter = {
      $or: [
        { tenantId },
        { isGlobal: true },
      ],
      isActive: true,
      approvalStatus: 'approved',
    };

    if (category) filter.category = category;

    // Get all templates with NEP competencies
    const templates = await Template.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    if (format === 'json') {
      // Return JSON format
      const exportData = templates.map(template => ({
        id: template._id,
        title: template.title,
        description: template.description,
        category: template.category,
        subject: template.subject,
        gradeLevel: template.gradeLevel,
        type: template.type,
        isPremium: template.isPremium,
        price: template.price,
        duration: template.duration,
        totalMarks: template.totalMarks,
        tags: template.tags,
        nepCompetencies: template.metadata?.nepLinks || [],
        pillarAlignment: template.metadata?.pillarAlignment || [],
        visibility: template.isPublic ? 'public' : 'school-only',
        usageCount: template.usageCount,
        createdBy: template.createdBy?.name || 'Unknown',
        createdAt: template.createdAt,
      }));

      res.json({
        success: true,
        templates: exportData,
        count: exportData.length,
      });
    } else {
      // Generate CSV
      const csvHeaders = 'ID,Title,Description,Category,Subject,Grade Levels,Type,Is Premium,Price,Duration (min),Total Marks,Tags,NEP Competencies,Pillar Alignment,Visibility,Usage Count,Created By,Created At\n';
      
      const csvRows = templates.map(template => {
        const nepLinks = template.metadata?.nepLinks || [];
        const pillarAlignment = template.metadata?.pillarAlignment || [];
        
        return [
          template._id,
          `"${template.title.replace(/"/g, '""')}"`,
          `"${(template.description || '').replace(/"/g, '""')}"`,
          template.category,
          template.subject || '',
          `"${(template.gradeLevel || []).join(', ')}"`,
          template.type || '',
          template.isPremium ? 'Yes' : 'No',
          template.price || 0,
          template.duration || 0,
          template.totalMarks || 0,
          `"${(template.tags || []).join(', ')}"`,
          `"${nepLinks.join(', ')}"`,
          `"${pillarAlignment.join(', ')}"`,
          template.isPublic ? 'Public' : 'School-only',
          template.usageCount || 0,
          template.createdBy?.name || 'Unknown',
          template.createdAt.toISOString(),
        ].join(',');
      }).join('\n');

      const csv = csvHeaders + csvRows;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=templates-export-${Date.now()}.csv`);
      res.send(csv);
    }
  } catch (error) {
    console.error('Error exporting templates:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 13. Get subscription details
export const getSubscriptionDetails = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;

    if (!orgId) {
      return res.status(400).json({ message: 'Organization ID required' });
    }

    let subscription = await Subscription.findOne({ tenantId, orgId });

    // Create default subscription if not exists
    if (!subscription) {
    const owningCompany = await Company.findOne({ organizations: normalizedOrgId }).select(
      'subscriptionPlan subscriptionStart subscriptionExpiry academicInfo'
    );

      const resolvedPlanName =
        owningCompany?.subscriptionPlan || determinePlanFromUsage();
      const resolvedLimits = resolvePlanLimits(resolvedPlanName);
      const resolvedFeatures = resolvePlanFeatures(resolvedPlanName);
      const planPrice = PLAN_LIMITS[resolvedPlanName]?.price || 0;

      subscription = await Subscription.create({
        tenantId,
        orgId: normalizedOrgId,
        plan: {
          name: resolvedPlanName,
          displayName: PLAN_DISPLAY_NAMES[resolvedPlanName] || `${capitalize(resolvedPlanName)} Plan`,
          price: planPrice,
          billingCycle: 'yearly',
        },
        limits: {
          ...resolvedLimits,
          features: resolvedFeatures,
        },
        status: 'active',
        startDate: owningCompany?.subscriptionStart || new Date(),
        endDate: owningCompany?.subscriptionExpiry || null,
        autoRenew: true,
      });
    }

    // Update current usage
    const [students, teachers, classes, templates, organization] = await Promise.all([
      SchoolStudent.countDocuments({ tenantId }),
      User.countDocuments({ tenantId, role: 'school_teacher' }),
      SchoolClass.countDocuments({ tenantId }),
      Template.countDocuments({ tenantId }),
      Organization.findOne({ _id: orgId, tenantId }),
    ]);

    const campuses = organization?.campuses?.length || 1;

    subscription.usage = {
      students,
      teachers,
      classes,
      campuses,
      storage: 0, // TODO: Calculate actual storage
      templates,
    };
    await subscription.save();

    res.json({
      subscription,
      daysUntilExpiry: subscription.daysUntilExpiry(),
      usagePercentages: {
        students: (students / subscription.limits.maxStudents * 100).toFixed(2),
        teachers: (teachers / subscription.limits.maxTeachers * 100).toFixed(2),
        classes: (classes / subscription.limits.maxClasses * 100).toFixed(2),
        campuses: (campuses / subscription.limits.maxCampuses * 100).toFixed(2),
        templates: (templates / subscription.limits.maxTemplates * 100).toFixed(2),
      },
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 14. Upgrade subscription
export const upgradeSubscription = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { plan } = req.body;

    if (!orgId) {
      return res.status(400).json({ message: 'Organization ID required' });
    }

    const subscription = await Subscription.findOne({ tenantId, orgId });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    const planConfig = PLAN_LIMITS[plan];
    if (!planConfig) {
      return res.status(400).json({ message: 'Invalid plan' });
    }

    const resolvedLimits = resolvePlanLimits(plan);
    const features = resolvePlanFeatures(plan);
    const cycle = 'yearly';
    const now = new Date();
    const cycleMonths = BILLING_CYCLE_MONTHS[cycle] || BILLING_CYCLE_MONTHS.yearly;
    const multiplier = BILLING_MULTIPLIER[cycle] || BILLING_MULTIPLIER.yearly;

    subscription.plan.name = plan;
    subscription.plan.displayName = PLAN_DISPLAY_NAMES[plan] || `${capitalize(plan)} Plan`;
    subscription.plan.price = planConfig.price;
    subscription.plan.billingCycle = cycle;
    subscription.limits = {
      ...resolvedLimits,
      features
    };

    subscription.status = 'active';
    subscription.startDate = subscription.startDate || now;

    const previousEndDate = subscription.endDate ? new Date(subscription.endDate) : null;
    const renewalBase = previousEndDate && previousEndDate > now ? previousEndDate : now;
    const nextEndDate = new Date(renewalBase);
    nextEndDate.setMonth(nextEndDate.getMonth() + cycleMonths);
    subscription.endDate = nextEndDate;

    const currentUsageStudents = subscription.usage?.students || 0;
    const currentUsageTeachers = subscription.usage?.teachers || 0;
    const { amount, extraStudents, extraTeachers } = computeBillingAmount(
      plan,
      cycle,
      currentUsageStudents,
      currentUsageTeachers
    );

    const addOns = (subscription.addOns || []).filter(addOn => !['extra_students', 'extra_teachers'].includes(addOn.name));

    if (extraStudents > 0) {
      addOns.push({
        name: 'extra_students',
        description: `${extraStudents} additional students`,
        price: EXTRA_USAGE_RATES.student * multiplier,
        quantity: extraStudents,
        active: true
      });
    }

    if (extraTeachers > 0) {
      addOns.push({
        name: 'extra_teachers',
        description: `${extraTeachers} additional teachers`,
        price: EXTRA_USAGE_RATES.teacher * multiplier,
        quantity: extraTeachers,
        active: true
      });
    }

    subscription.addOns = addOns;

    // Create invoice
    subscription.invoices.push({
      invoiceId: `INV-${Date.now()}`,
      amount,
      currency: 'INR',
      status: 'paid',
      paidAt: now,
      dueDate: nextEndDate,
      description: `${PLAN_DISPLAY_NAMES[plan] || capitalize(plan)} Plan - ${capitalize(cycle)}`
    });

    await subscription.save();

    const io = req.app.get('io');
    const payload = subscription.toObject ? subscription.toObject() : subscription;

    if (io) {
      const userRoom = req.user?._id ? req.user._id.toString() : null;
      if (userRoom) {
        io.to(userRoom).emit('school:subscription:updated', {
          subscription: payload,
          tenantId,
          orgId: orgId.toString(),
        });
      }
      io.emit('school:subscription:updated', {
        subscription: payload,
        tenantId,
        orgId: orgId.toString(),
      });
    }

    res.json({
      success: true,
      message: 'Subscription upgraded successfully',
      subscription: payload,
      billing: {
        amount,
        cycle,
        extraStudents,
        extraTeachers,
      },
    });
  } catch (error) {
    console.error('Error upgrading subscription:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const renewSubscription = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const {
      students,
      teachers,
      plan: preferredPlan,
    } = req.body || {};

    if (!orgId) {
      return res.status(400).json({ message: 'Organization ID required' });
    }

    const subscription = await Subscription.findOne({ tenantId, orgId });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Find Company associated with this organization
    const company = await Company.findOne({ organizations: orgId });
    if (!company) {
      return res.status(404).json({ message: 'Company not found for this organization' });
    }

    const parseCount = (value, fallback) => {
      if (value === undefined || value === null || value === '') {
        return fallback;
      }
      const parsed = Number(value);
      if (Number.isNaN(parsed) || parsed < 0) {
        return fallback;
      }
      return Math.floor(parsed);
    };

    const desiredStudents = parseCount(students, subscription.usage?.students || 0);
    const desiredTeachers = parseCount(teachers, subscription.usage?.teachers || 0);

    const targetPlanName = preferredPlan && PLAN_LIMITS[preferredPlan]
      ? preferredPlan
      : determinePlanFromUsage(desiredStudents, desiredTeachers);

    const planConfig = PLAN_LIMITS[targetPlanName];
    const cycle = 'yearly';
    const multiplier = BILLING_MULTIPLIER[cycle] || BILLING_MULTIPLIER.yearly;
    const { amount } = computeBillingAmount(
      targetPlanName,
      cycle,
      desiredStudents,
      desiredTeachers
    );

    // Check if there's already a pending renewal request
    const existingRequest = await SubscriptionRenewalRequest.findOne({
      orgId,
      tenantId,
      subscriptionId: subscription._id,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({ 
        message: 'You already have a pending renewal request. Please wait for admin approval.',
        requestId: existingRequest._id,
      });
    }

    // Create renewal request instead of directly renewing
    const renewalRequest = await SubscriptionRenewalRequest.create({
      orgId,
      tenantId,
      subscriptionId: subscription._id,
      companyId: company._id,
      requestedBy: req.user._id,
      requestedByName: req.user.name || 'School Admin',
      requestedByEmail: req.user.email || '',
      requestedPlan: {
        name: targetPlanName,
        displayName: PLAN_DISPLAY_NAMES[targetPlanName] || `${capitalize(targetPlanName)} Plan`,
      },
      requestedStudents: desiredStudents,
      requestedTeachers: desiredTeachers,
      billingCycle: cycle,
      estimatedAmount: amount,
      currentPlan: {
        name: subscription.plan?.name || 'free',
        displayName: subscription.plan?.displayName || 'Free Plan',
      },
      currentStudents: subscription.usage?.students || 0,
      currentTeachers: subscription.usage?.teachers || 0,
      currentEndDate: subscription.endDate || null,
      status: 'pending',
    });

    // Emit socket event for admin notification
    const io = req.app.get('io');
    if (io) {
      io.emit('admin:subscription-renewal:requested', {
        requestId: renewalRequest._id,
        orgId: orgId.toString(),
        companyName: company.name,
        requestedPlan: targetPlanName,
        requestedStudents: desiredStudents,
        requestedTeachers: desiredTeachers,
        estimatedAmount: amount,
      });
    }

    res.json({
      success: true,
      message: 'Renewal request submitted successfully. It will be reviewed by admin.',
      requestId: renewalRequest._id,
      status: 'pending',
      estimatedAmount: amount,
    });
  } catch (error) {
    console.error('Error creating renewal request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// ============= POLICY & COMPLIANCE ENDPOINTS =============
// 1. Get consent records
export const getConsentRecords = async (req, res) => {
  try {
    const { tenantId } = req;
    const { userId, status, consentType, page = 1, limit = 20 } = req.query;

    const filter = { tenantId };
    if (userId) filter.userId = userId;
    if (status) filter.status = status;
    if (consentType) filter.consentType = consentType;

    const [consents, total] = await Promise.all([
      ConsentRecord.find(filter)
        .populate('userId', 'name email role')
        .populate('guardianId', 'name email')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit)),
      ConsentRecord.countDocuments(filter),
    ]);

    // Get statistics
    const stats = await ConsentRecord.aggregate([
      { $match: { tenantId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCounts = {
      granted: 0,
      denied: 0,
      withdrawn: 0,
      expired: 0,
      pending: 0,
    };

    stats.forEach(stat => {
      statusCounts[stat._id] = stat.count;
    });

    // Check for expiring consents (within 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringConsents = await ConsentRecord.countDocuments({
      tenantId,
      status: 'granted',
      expiresAt: { $lte: thirtyDaysFromNow, $gte: new Date() },
    });

    res.json({
      consents,
      statistics: {
        total,
        ...statusCounts,
        expiringSOon: expiringConsents,
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
        total,
      },
    });
  } catch (error) {
    console.error('Error fetching consent records:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. Create consent record
export const createConsentRecord = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const consentData = req.body;

    const consent = await ConsentRecord.create({
      ...consentData,
      tenantId,
      orgId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Log audit trail
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: consent.status === 'granted' ? 'consent_granted' : 'consent_denied',
      targetType: 'consent',
      targetId: consent._id,
      targetName: consent.consentType,
      description: `Consent ${consent.status} for ${consent.consentType}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Consent record created successfully',
      consent,
    });
  } catch (error) {
    console.error('Error creating consent record:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. Withdraw consent
export const withdrawConsent = async (req, res) => {
  try {
    const { consentId } = req.params;
    const { reason } = req.body;
    const { tenantId } = req;

    const consent = await ConsentRecord.findOne({ _id: consentId, tenantId });
    if (!consent) {
      return res.status(404).json({ message: 'Consent record not found' });
    }

    await consent.withdraw(reason);

    // Log audit trail
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'consent_withdrawn',
      targetType: 'consent',
      targetId: consent._id,
      targetName: consent.consentType,
      description: `Consent withdrawn for ${consent.consentType}. Reason: ${reason}`,
      metadata: { reason },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Consent withdrawn successfully',
      consent,
    });
  } catch (error) {
    console.error('Error withdrawing consent:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 4. Get data retention policies
export const getDataRetentionPolicies = async (req, res) => {
  try {
    const { tenantId } = req;
    const { dataType, isActive } = req.query;

    const filter = { tenantId };
    if (dataType) filter.dataType = dataType;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const policies = await DataRetentionPolicy.find(filter)
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    // Get statistics
    const stats = {
      total: policies.length,
      active: policies.filter(p => p.isActive).length,
      autoEnforced: policies.filter(p => p.autoEnforce).length,
      totalRecordsAffected: policies.reduce((sum, p) => sum + p.recordsAffected, 0),
      totalRecordsDeleted: policies.reduce((sum, p) => sum + p.recordsDeleted, 0),
      totalRecordsArchived: policies.reduce((sum, p) => sum + p.recordsArchived, 0),
    };

    res.json({
      policies,
      statistics: stats,
    });
  } catch (error) {
    console.error('Error fetching data retention policies:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 5. Create data retention policy
export const createDataRetentionPolicy = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const policyData = req.body;

    const policy = await DataRetentionPolicy.create({
      ...policyData,
      tenantId,
      orgId,
      createdBy: req.user._id,
    });

    // Log audit trail
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'policy_created',
      targetType: 'policy',
      targetId: policy._id,
      targetName: policy.name,
      description: `Data retention policy created for ${policy.dataType}`,
      metadata: { policyData },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Data retention policy created successfully',
      policy,
    });
  } catch (error) {
    console.error('Error creating data retention policy:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 6. Update data retention policy
export const updateDataRetentionPolicy = async (req, res) => {
  try {
    const { policyId } = req.params;
    const { tenantId } = req;
    const updates = req.body;

    const policy = await DataRetentionPolicy.findOne({ _id: policyId, tenantId });
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    const oldData = policy.toObject();
    Object.assign(policy, updates);
    policy.lastModifiedBy = req.user._id;
    await policy.save();

    // Log audit trail
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'policy_updated',
      targetType: 'policy',
      targetId: policy._id,
      targetName: policy.name,
      description: `Data retention policy updated for ${policy.dataType}`,
      changes: { before: oldData, after: policy.toObject() },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Notify admins and parents about policy change
    const changeDescription = `Retention period changed from ${oldData.retentionPeriod?.value} ${oldData.retentionPeriod?.unit} to ${policy.retentionPeriod.value} ${policy.retentionPeriod.unit}`;
    
    // Notify school admins
    const admins = await User.find({ tenantId, role: 'school_admin' });
    const adminNotifications = await Promise.all(
      admins.map(admin =>
        Notification.create({
          userId: admin._id,
          type: 'policy_change',
          title: 'Policy Updated',
          message: `Data retention policy updated: ${policy.name} - ${changeDescription}`,
          metadata: {
            policyId: policy._id,
            policyName: policy.name,
            policyType: policy.dataType,
            retentionPeriod: `${policy.retentionPeriod.value} ${policy.retentionPeriod.unit}`,
            changeDescription,
            requiresParentNotification: true,
          },
          priority: 'high',
        })
      )
    );

    // Notify parents about policy change
    const parents = await User.find({ tenantId, role: 'parent' });
    const organization = await Organization.findById(req.user?.orgId);
    const parentNotifications = await Promise.all(
      parents.map(parent =>
        Notification.create({
          userId: parent._id,
          type: 'policy_change_parent',
          title: 'Data Policy Update',
          message: `Important: ${organization?.name || 'School'} has updated its data retention policy. ${changeDescription}. Please review the updated privacy policy.`,
          metadata: {
            policyId: policy._id,
            policyName: policy.name,
            retentionPeriod: `${policy.retentionPeriod.value} ${policy.retentionPeriod.unit}`,
            actionRequired: 'Please acknowledge',
            schoolName: organization?.name,
          },
          priority: 'high',
        })
      )
    );

    // Emit real-time notifications via Socket.IO
    const io = req.app?.get('io');
    if (io) {
      admins.forEach((admin, index) => {
        io.to(admin._id.toString()).emit('notification', adminNotifications[index]);
      });
      parents.forEach((parent, index) => {
        io.to(parent._id.toString()).emit('notification', parentNotifications[index]);
      });
    }

    res.json({
      success: true,
      message: 'Policy updated successfully. Notifications sent to admins and parents.',
      policy,
      notificationStats: {
        adminsNotified: adminNotifications.length,
        parentsNotified: parentNotifications.length,
      },
    });
  } catch (error) {
    console.error('Error updating policy:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 7. Delete data retention policy
export const deleteDataRetentionPolicy = async (req, res) => {
  try {
    const { policyId } = req.params;
    const { tenantId } = req;

    const policy = await DataRetentionPolicy.findOne({ _id: policyId, tenantId });
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    policy.isActive = false;
    await policy.save();

    // Log audit trail
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'policy_deleted',
      targetType: 'policy',
      targetId: policy._id,
      targetName: policy.name,
      description: `Data retention policy deactivated for ${policy.dataType}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Policy deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting policy:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 8. Get audit logs
export const getAuditLogs = async (req, res) => {
  try {
    const { tenantId } = req;
    const { 
      userId, action, targetType, startDate, endDate, 
      isPIIAccess, requiresReview, page = 1, limit = 50 
    } = req.query;

    const filter = { tenantId };
    if (userId) filter.userId = userId;
    if (action) filter.action = action;
    if (targetType) filter.targetType = targetType;
    if (isPIIAccess) filter.isPIIAccess = isPIIAccess === 'true';
    if (requiresReview) filter.requiresReview = requiresReview === 'true';
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const [logs, total] = await Promise.all([
      ComplianceAuditLog.find(filter)
        .populate('userId', 'name email role')
        .populate('reviewedBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit)),
      ComplianceAuditLog.countDocuments(filter),
    ]);

    // Get statistics
    const [actionStats, targetStats, piiAccessCount] = await Promise.all([
      ComplianceAuditLog.aggregate([
        { $match: { tenantId } },
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      ComplianceAuditLog.aggregate([
        { $match: { tenantId } },
        { $group: { _id: '$targetType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      ComplianceAuditLog.countDocuments({ tenantId, isPIIAccess: true }),
    ]);

    res.json({
      logs,
      statistics: {
        total,
        piiAccessCount,
        topActions: actionStats,
        byTargetType: targetStats,
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
        total,
      },
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 9. Export audit logs
export const exportAuditLogs = async (req, res) => {
  try {
    const { tenantId } = req;
    const { startDate, endDate, format = 'json' } = req.query;

    const filter = { tenantId };
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const logs = await ComplianceAuditLog.find(filter)
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .lean();

    // Log this export action
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'data_exported',
      targetType: 'system',
      description: `Audit logs exported (${logs.length} records)`,
      metadata: { recordCount: logs.length, format, startDate, endDate },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    if (format === 'csv') {
      // Convert to CSV
      const csv = convertLogsToCSV(logs);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${Date.now()}.csv`);
      return res.send(csv);
    }

    res.json({
      success: true,
      logs,
      exportedAt: new Date(),
    });
  } catch (error) {
    console.error('Error exporting audit logs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 10. Get compliance dashboard summary
export const getComplianceDashboard = async (req, res) => {
  try {
    const { tenantId } = req;

    const [
      totalConsents,
      activeConsents,
      expiringConsents,
      totalPolicies,
      activePolicies,
      recentAuditLogs,
      piiAccessLogs,
      consentsByType,
    ] = await Promise.all([
      ConsentRecord.countDocuments({ tenantId }),
      ConsentRecord.countDocuments({ tenantId, status: 'granted' }),
      ConsentRecord.countDocuments({
        tenantId,
        status: 'granted',
        expiresAt: { 
          $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          $gte: new Date()
        },
      }),
      DataRetentionPolicy.countDocuments({ tenantId }),
      DataRetentionPolicy.countDocuments({ tenantId, isActive: true }),
      ComplianceAuditLog.find({ tenantId })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('userId', 'name email'),
      ComplianceAuditLog.countDocuments({
        tenantId,
        isPIIAccess: true,
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
      ConsentRecord.aggregate([
        { $match: { tenantId } },
        { $group: { _id: '$consentType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    // Compliance score calculation (0-100)
    let complianceScore = 0;
    const totalStudents = await SchoolStudent.countDocuments({ tenantId });
    
    if (totalStudents > 0) {
      const studentsWithConsent = await ConsentRecord.distinct('userId', {
        tenantId,
        status: 'granted',
        consentType: 'data_collection',
      });
      
      complianceScore = (studentsWithConsent.length / totalStudents) * 100;
    }

    res.json({
      summary: {
        consents: {
          total: totalConsents,
          active: activeConsents,
          expiringSoon: expiringConsents,
          pending: await ConsentRecord.countDocuments({ tenantId, status: 'pending' }),
        },
        policies: {
          total: totalPolicies,
          active: activePolicies,
        },
        auditLogs: {
          recentCount: recentAuditLogs.length,
          piiAccessCount30d: piiAccessLogs,
        },
        complianceScore: parseFloat(complianceScore.toFixed(2)),
      },
      consentsByType,
      recentAuditLogs,
    });
  } catch (error) {
    console.error('Error fetching compliance dashboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 11. Enforce data retention policy
export const enforceDataRetention = async (req, res) => {
  try {
    const { policyId } = req.params;
    const { tenantId } = req;
    const { dryRun = false } = req.body;

    const policy = await DataRetentionPolicy.findOne({ _id: policyId, tenantId });
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    let affectedRecords = [];
    let deletedCount = 0;
    let archivedCount = 0;

    const retentionDays = policy.getRetentionDays();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    // Find records to process based on data type
    let recordsToProcess = [];

    switch (policy.dataType) {
      case 'activity_logs':
        recordsToProcess = await ActivityLog.find({
          timestamp: { $lt: cutoffDate },
        }).limit(1000);
        break;
      case 'audit_logs':
        recordsToProcess = await ComplianceAuditLog.find({
          tenantId,
          createdAt: { $lt: cutoffDate },
          requiresReview: false,
        }).limit(1000);
        break;
      case 'consent_records':
        recordsToProcess = await ConsentRecord.find({
          tenantId,
          status: { $in: ['denied', 'withdrawn', 'expired'] },
          createdAt: { $lt: cutoffDate },
        }).limit(1000);
        break;
      default:
        return res.status(400).json({ message: 'Data type not supported for auto-enforcement' });
    }

    if (!dryRun) {
      for (const record of recordsToProcess) {
        if (policy.actionAfterExpiry === 'delete') {
          await record.deleteOne();
          deletedCount++;
        } else if (policy.actionAfterExpiry === 'archive') {
          // In a real system, you'd move this to archive storage
          record.isArchived = true;
          await record.save();
          archivedCount++;
        }
      }

      // Update policy stats
      policy.recordsAffected += recordsToProcess.length;
      policy.recordsDeleted += deletedCount;
      policy.recordsArchived += archivedCount;
      policy.lastEnforcedAt = new Date();
      await policy.save();

      // Log enforcement
      await ComplianceAuditLog.logAction({
        tenantId,
        orgId: req.user?.orgId,
        userId: req.user._id,
        userRole: req.user.role,
        userName: req.user.name,
        action: 'policy_enforced',
        targetType: 'policy',
        targetId: policy._id,
        targetName: policy.name,
        description: `Data retention policy enforced: ${deletedCount} deleted, ${archivedCount} archived`,
        metadata: { deletedCount, archivedCount, totalProcessed: recordsToProcess.length },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
    }

    res.json({
      success: true,
      message: dryRun ? 'Dry run completed' : 'Policy enforced successfully',
      results: {
        totalRecordsFound: recordsToProcess.length,
        deleted: deletedCount,
        archived: archivedCount,
        dryRun,
      },
    });
  } catch (error) {
    console.error('Error enforcing data retention:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 12. Get user consent status
export const getUserConsentStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { tenantId } = req;

    const consents = await ConsentRecord.find({ tenantId, userId })
      .sort({ createdAt: -1 });

    const consentStatus = {};
    consents.forEach(consent => {
      if (!consentStatus[consent.consentType] || 
          new Date(consent.createdAt) > new Date(consentStatus[consent.consentType].createdAt)) {
        consentStatus[consent.consentType] = {
          status: consent.status,
          grantedAt: consent.grantedAt,
          expiresAt: consent.expiresAt,
          isValid: consent.isValid(),
        };
      }
    });

    res.json({
      userId,
      consents: consentStatus,
      totalConsents: consents.length,
      activeConsents: consents.filter(c => c.isValid()).length,
    });
  } catch (error) {
    console.error('Error fetching user consent status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// 13. Generate compliance report
export const generateComplianceReport = async (req, res) => {
  try {
    const { tenantId } = req;
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const [
      consentStats,
      policyStats,
      auditStats,
      dataAccessStats,
      userStats,
    ] = await Promise.all([
      ConsentRecord.aggregate([
        { $match: { tenantId, ...(Object.keys(dateFilter).length && { createdAt: dateFilter }) } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
      DataRetentionPolicy.aggregate([
        { $match: { tenantId } },
        {
          $group: {
            _id: null,
            totalPolicies: { $sum: 1 },
            totalRecordsDeleted: { $sum: '$recordsDeleted' },
            totalRecordsArchived: { $sum: '$recordsArchived' },
          },
        },
      ]),
      ComplianceAuditLog.aggregate([
        { $match: { tenantId, ...(Object.keys(dateFilter).length && { createdAt: dateFilter }) } },
        {
          $group: {
            _id: '$action',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      ComplianceAuditLog.countDocuments({
        tenantId,
        isPIIAccess: true,
        ...(Object.keys(dateFilter).length && { createdAt: dateFilter }),
      }),
      SchoolStudent.countDocuments({ tenantId }),
    ]);

    const report = {
      generatedAt: new Date(),
      period: {
        startDate: startDate || 'All time',
        endDate: endDate || 'Present',
      },
      consent: {
        summary: consentStats,
        totalUsers: userStats,
      },
      dataRetention: policyStats[0] || {
        totalPolicies: 0,
        totalRecordsDeleted: 0,
        totalRecordsArchived: 0,
      },
      auditTrail: {
        topActions: auditStats,
        piiAccessCount: dataAccessStats,
      },
      recommendations: generateComplianceRecommendations(consentStats, policyStats, userStats),
    };

    // Log report generation
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'audit_performed',
      targetType: 'system',
      description: 'Compliance report generated',
      metadata: { startDate, endDate },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json(report);
  } catch (error) {
    console.error('Error generating compliance report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper: Generate compliance recommendations
const generateComplianceRecommendations = (consentStats, policyStats, totalUsers) => {
  const recommendations = [];
  
  const pendingConsents = consentStats.find(s => s._id === 'pending')?.count || 0;
  const grantedConsents = consentStats.find(s => s._id === 'granted')?.count || 0;
  
  if (pendingConsents > totalUsers * 0.2) {
    recommendations.push({
      type: 'consent',
      severity: 'high',
      message: `${pendingConsents} pending consents require attention`,
      action: 'Send reminder emails to complete consent forms',
    });
  }
  
  if (grantedConsents < totalUsers * 0.8) {
    recommendations.push({
      type: 'consent',
      severity: 'medium',
      message: 'Consent coverage is below 80%',
      action: 'Implement consent collection workflow for new users',
    });
  }
  
  const activePolicies = policyStats[0]?.totalPolicies || 0;
  if (activePolicies < 5) {
    recommendations.push({
      type: 'policy',
      severity: 'medium',
      message: 'Limited data retention policies in place',
      action: 'Create comprehensive data retention policies for all data types',
    });
  }
  
  return recommendations;
};

// Helper: Convert logs to CSV
const convertLogsToCSV = (logs) => {
  const headers = ['Timestamp', 'User', 'Action', 'Target Type', 'Description', 'Status', 'IP Address'];
  const rows = logs.map(log => [
    new Date(log.createdAt).toISOString(),
    log.userId?.name || 'Unknown',
    log.action,
    log.targetType || '',
    log.description || '',
    log.status,
    log.ipAddress || '',
  ]);
  
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  return csv;
};

// ============= ENHANCED ASSIGNMENT APPROVAL SYSTEM =============

// 1. Get assignment preview for approval
export const getAssignmentPreview = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { tenantId } = req;

    const assignment = await Assignment.findOne({ _id: assignmentId, tenantId })
      .populate('teacherId', 'name email')
      .populate('classId', 'classNumber stream')
      .populate('modules.id');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Get affected students count
    const affectedStudentsCount = assignment.selectedStudents?.length || 0;

    res.json({
      assignment,
      metadata: {
        affectedStudentsCount,
        estimatedDuration: assignment.modules?.reduce((sum, m) => sum + (m.duration || 0), 0) || 0,
        totalMarks: assignment.totalMarks,
        requiresApproval: assignment.approvalRequired,
      },
    });
  } catch (error) {
    console.error('Error fetching assignment preview:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. Approve assignment with notification
export const approveAssignmentWithNotification = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { tenantId } = req;
    const { comments } = req.body;

    const assignment = await Assignment.findOne({ _id: assignmentId, tenantId })
      .populate('teacherId', 'name email')
      .populate('classId', 'name grade section');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Approve and publish - make visible to intended scope
    assignment.status = 'published';
    assignment.isPublished = true;
    assignment.publishedAt = new Date();
    assignment.approvedBy = req.user._id;
    assignment.approvedAt = new Date();
    await assignment.save();

    // Get all students in the target class/scope
    let targetStudents = [];
    if (assignment.classId) {
      // Find all students in this class
      const students = await User.find({
        tenantId,
        role: 'student',
        classId: assignment.classId._id,
      });
      targetStudents = students;
    }

    // Send notification to teacher
    await Notification.create({
      userId: assignment.teacherId._id,
      type: 'assignment_approved',
      title: 'Assignment Approved',
      message: `Your assignment "${assignment.title}" has been approved and published to ${assignment.classId?.name || 'students'}.${comments ? ` Admin comment: ${comments}` : ''}`,
      metadata: {
        assignmentId: assignment._id,
        assignmentTitle: assignment.title,
        approvedBy: req.user.name,
        comments,
        publishedTo: assignment.classId?.name,
        studentCount: targetStudents.length,
      },
      priority: 'high',
    });

    // Send notifications to all students in the scope
    if (targetStudents.length > 0) {
      const studentNotifications = targetStudents.map(student => ({
        userId: student._id,
        type: 'assignment_new',
        title: 'New Assignment Available',
        message: `New assignment "${assignment.title}" has been published for ${assignment.classId?.name}. Due date: ${assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'Not set'}`,
        metadata: {
          assignmentId: assignment._id,
          assignmentTitle: assignment.title,
          teacherName: assignment.teacherId?.name,
          className: assignment.classId?.name,
          dueDate: assignment.dueDate,
          subject: assignment.subject,
        },
        priority: 'medium',
      }));

      await Notification.insertMany(studentNotifications);

      // Emit real-time notifications to students via Socket.IO
      const io = req.app?.get('io');
      if (io) {
        targetStudents.forEach((student, index) => {
          io.to(student._id.toString()).emit('notification', studentNotifications[index]);
        });
      }
    }

    // Emit to teacher
    const io = req.app?.get('io');
    if (io) {
      io.to(assignment.teacherId._id.toString()).emit('assignment_approved', {
        assignmentId: assignment._id,
        title: assignment.title,
        studentsNotified: targetStudents.length,
      });

      // Emit to admin dashboard for real-time updates
      if (tenantId) {
        io.to(`school-admin-dashboard:${tenantId}`).emit('assignment:approved', {
          assignmentId: assignment._id,
          assignment: assignment.toObject ? assignment.toObject() : assignment,
          tenantId,
          timestamp: new Date()
        });
        
        io.to(`school-admin-dashboard:${tenantId}`).emit('school-admin:dashboard:update', {
          type: 'assignment_approved',
          timestamp: new Date()
        });
      }
    }

    // Log audit trail
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'assignment_approved',
      targetType: 'assignment',
      targetId: assignment._id,
      targetName: assignment.title,
      description: `Assignment approved and published to ${targetStudents.length} students in ${assignment.classId?.name || 'class'}`,
      metadata: { 
        comments,
        studentsNotified: targetStudents.length,
        className: assignment.classId?.name,
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Assignment approved and teacher notified',
      assignment,
    });
  } catch (error) {
    console.error('Error approving assignment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. Request changes to assignment
export const requestAssignmentChanges = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { tenantId } = req;
    const { changes, comments } = req.body;

    const assignment = await Assignment.findOne({ _id: assignmentId, tenantId })
      .populate('teacherId', 'name email');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    assignment.status = 'changes_requested';
    assignment.requestedChanges = {
      requestedBy: req.user._id,
      requestedAt: new Date(),
      changes,
      comments,
    };
    await assignment.save();

    // Notify teacher
    await Notification.create({
      userId: assignment.teacherId._id,
      type: 'assignment_changes_requested',
      title: 'Assignment Changes Requested',
      message: `Changes requested for "${assignment.title}". ${comments}`,
      metadata: {
        assignmentId: assignment._id,
        requestedBy: req.user.name,
        changes,
        comments,
      },
    });

    // Emit socket event for real-time updates
    const io = req.app?.get('io');
    if (io && tenantId) {
      io.to(`school-admin-dashboard:${tenantId}`).emit('assignment:changes_requested', {
        assignmentId: assignment._id,
        assignment: assignment.toObject ? assignment.toObject() : assignment,
        tenantId,
        timestamp: new Date()
      });
      
      io.to(`school-admin-dashboard:${tenantId}`).emit('school-admin:dashboard:update', {
        type: 'assignment_changes_requested',
        timestamp: new Date()
      });
    }

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'assignment_changes_requested',
      targetType: 'assignment',
      targetId: assignment._id,
      description: `Changes requested for assignment`,
      metadata: { changes, comments },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Changes requested and teacher notified',
    });
  } catch (error) {
    console.error('Error requesting changes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 4. Reject assignment
export const rejectAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { tenantId } = req;
    const { reason } = req.body;

    const assignment = await Assignment.findOne({ _id: assignmentId, tenantId })
      .populate('teacherId', 'name email');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    assignment.status = 'rejected';
    assignment.rejectionReason = reason;
    assignment.rejectedBy = req.user._id;
    assignment.rejectedAt = new Date();
    await assignment.save();

    // Notify teacher
    await Notification.create({
      userId: assignment.teacherId._id,
      type: 'assignment_rejected',
      title: 'Assignment Rejected',
      message: `Your assignment "${assignment.title}" was rejected. Reason: ${reason}`,
      metadata: {
        assignmentId: assignment._id,
        rejectedBy: req.user.name,
        reason,
      },
    });

    // Emit socket event for real-time updates
    const io = req.app?.get('io');
    if (io && tenantId) {
      io.to(`school-admin-dashboard:${tenantId}`).emit('assignment:rejected', {
        assignmentId: assignment._id,
        assignment: assignment.toObject ? assignment.toObject() : assignment,
        tenantId,
        timestamp: new Date()
      });
      
      io.to(`school-admin-dashboard:${tenantId}`).emit('school-admin:dashboard:update', {
        type: 'assignment_rejected',
        timestamp: new Date()
      });
    }

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'assignment_rejected',
      targetType: 'assignment',
      targetId: assignment._id,
      description: `Assignment rejected`,
      metadata: { reason },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Assignment rejected and teacher notified',
    });
  } catch (error) {
    console.error('Error rejecting assignment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============= ENHANCED TEMPLATE MANAGEMENT =============

// 5. Upload and tag template
export const uploadTemplateWithTags = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const {
      title, description, category, subject, gradeLevel,
      type, isPremium, price, content, questions,
      // New tagging fields
      pillarTags, nepLinks, visibility, duration, totalMarks
    } = req.body;

    const template = await Template.create({
      tenantId,
      orgId,
      title,
      description,
      category,
      subject,
      gradeLevel,
      type,
      isPremium,
      price,
      content,
      questions,
      duration,
      totalMarks,
      // Tagging
      tags: pillarTags || [],
      metadata: {
        nepLinks: nepLinks || [],
        pillarAlignment: pillarTags || [],
      },
      // Visibility
      isPublic: visibility === 'public',
      isGlobal: visibility === 'global',
      // Creator
      createdBy: req.user._id,
      approvalStatus: visibility === 'public' ? 'pending' : 'approved',
    });

    // Emit socket event for real-time updates
    const io = req.app?.get('io');
    if (io && tenantId) {
      io.to(`school-admin-dashboard:${tenantId}`).emit('template:created', {
        templateId: template._id,
        template: template.toObject ? template.toObject() : template,
        tenantId,
        timestamp: new Date()
      });
      
      io.to(`school-admin-dashboard:${tenantId}`).emit('school-admin:dashboard:update', {
        type: 'template_created',
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Template created successfully',
      template,
    });
  } catch (error) {
    console.error('Error uploading template:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 6. Update template with tags
export const updateTemplateWithTags = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { tenantId } = req;
    const { pillarTags, nepLinks, visibility, ...updates } = req.body;

    const template = await Template.findOne({ _id: templateId, tenantId });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    Object.assign(template, updates);
    
    if (pillarTags) {
      template.tags = pillarTags;
      template.metadata = template.metadata || {};
      template.metadata.pillarAlignment = pillarTags;
    }
    
    if (nepLinks) {
      template.metadata = template.metadata || {};
      template.metadata.nepLinks = nepLinks;
    }
    
    if (visibility) {
      template.isPublic = visibility === 'public';
      template.isGlobal = visibility === 'global';
      if (visibility === 'public' && template.approvalStatus !== 'approved') {
        template.approvalStatus = 'pending';
      }
    }

    await template.save();

    // Emit socket event for real-time updates
    const io = req.app?.get('io');
    if (io && tenantId) {
      io.to(`school-admin-dashboard:${tenantId}`).emit('template:updated', {
        templateId: template._id,
        template: template.toObject ? template.toObject() : template,
        tenantId,
        timestamp: new Date()
      });
      
      io.to(`school-admin-dashboard:${tenantId}`).emit('school-admin:dashboard:update', {
        type: 'template_updated',
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Template updated successfully',
      template,
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============= ROLE MANAGEMENT =============

// 7. Get all role permissions
export const getRolePermissions = async (req, res) => {
  try {
    const { tenantId } = req;

    const roles = await RolePermission.find({ tenantId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    // Get default roles if none exist
    if (roles.length === 0) {
      const defaultRoles = await createDefaultRoles(tenantId, req.user.orgId, req.user._id);
      return res.json({ roles: defaultRoles });
    }

    res.json({ roles });
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 8. Create custom role
export const createCustomRole = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { roleName, roleType, displayName, description, permissions, campusRestrictions } = req.body;

    const role = await RolePermission.create({
      tenantId,
      orgId,
      roleName,
      roleType,
      displayName,
      description,
      permissions,
      campusRestrictions,
      createdBy: req.user._id,
    });

    res.json({
      success: true,
      message: 'Role created successfully',
      role,
    });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 9. Update role permissions
export const updateRolePermissions = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { tenantId } = req;
    const { permissions, campusRestrictions } = req.body;

    const role = await RolePermission.findOne({ _id: roleId, tenantId });
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    if (permissions) {
      role.permissions = { ...role.permissions, ...permissions };
    }
    
    if (campusRestrictions) {
      role.campusRestrictions = campusRestrictions;
    }

    await role.save();

    res.json({
      success: true,
      message: 'Role permissions updated',
      role,
    });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 10. Create user with role
export const createUserWithRole = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { name, email, password, roleType, campusId, permissions } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: roleType,
      tenantId,
      orgId,
      campusId,
    });

    // Create or assign role permission
    let rolePermission = await RolePermission.findOne({ tenantId, roleType });
    if (!rolePermission && permissions) {
      rolePermission = await RolePermission.create({
        tenantId,
        orgId,
        roleName: roleType,
        roleType,
        permissions,
        createdBy: req.user._id,
      });
    }

    res.json({
      success: true,
      message: 'User created with role successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        campusId: user.campusId,
      },
    });
  } catch (error) {
    console.error('Error creating user with role:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============= ESCALATION CHAIN MANAGEMENT =============

// 11. Get escalation chains
export const getEscalationChains = async (req, res) => {
  try {
    const { tenantId } = req;

    const chains = await EscalationChain.find({ tenantId, isActive: true })
      .populate('levels.userId', 'name email role')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ chains });
  } catch (error) {
    console.error('Error fetching escalation chains:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 12. Create escalation chain
export const createEscalationChain = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { name, triggerType, description, levels, conditions } = req.body;

    const chain = await EscalationChain.create({
      tenantId,
      orgId,
      name,
      triggerType,
      description,
      levels,
      conditions,
      createdBy: req.user._id,
    });

    res.json({
      success: true,
      message: 'Escalation chain created successfully',
      chain,
    });
  } catch (error) {
    console.error('Error creating escalation chain:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 13. Update escalation chain
export const updateEscalationChain = async (req, res) => {
  try {
    const { chainId } = req.params;
    const { tenantId } = req;
    const updates = req.body;

    const chain = await EscalationChain.findOne({ _id: chainId, tenantId });
    if (!chain) {
      return res.status(404).json({ message: 'Escalation chain not found' });
    }

    Object.assign(chain, updates);
    await chain.save();

    res.json({
      success: true,
      message: 'Escalation chain updated',
      chain,
    });
  } catch (error) {
    console.error('Error updating escalation chain:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// 14. Trigger escalation
export const triggerEscalation = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const {
      studentId, triggerType, description, severity,
      relatedWellbeingFlagId, relatedAssignmentId
    } = req.body;

    // Find matching escalation chain
    const chain = await EscalationChain.findOne({
      tenantId,
      triggerType,
      isActive: true,
    }).populate('levels.userId', 'name email');

    if (!chain) {
      return res.status(404).json({ message: 'No escalation chain found for this trigger type' });
    }

    // Create escalation case
    const escalationCase = await EscalationCase.create({
      tenantId,
      orgId,
      chainId: chain._id,
      studentId,
      triggerType,
      triggerDescription: description,
      severity,
      relatedWellbeingFlagId,
      relatedAssignmentId,
      currentLevel: 1,
      escalationHistory: [{
        level: 1,
        assignedTo: chain.levels[0]?.userId?._id,
        assignedAt: new Date(),
      }],
    });

    // Send notification to first level
    if (chain.levels[0]?.userId) {
      await Notification.create({
        userId: chain.levels[0].userId._id,
        type: 'escalation_alert',
        title: `Escalation Alert: ${chain.name}`,
        message: description,
        metadata: {
          caseId: escalationCase.caseId,
          studentId,
          severity,
          level: 1,
        },
      });

      // Track notification
      escalationCase.notificationsSent.push({
        recipientId: chain.levels[0].userId._id,
        method: chain.levels[0].notificationMethod || 'email',
        sentAt: new Date(),
      });
      await escalationCase.save();
    }

    // Update chain stats
    chain.timesTriggered += 1;
    chain.lastTriggeredAt = new Date();
    await chain.save();

    res.json({
      success: true,
      message: 'Escalation triggered successfully',
      case: escalationCase,
    });
  } catch (error) {
    console.error('Error triggering escalation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 15. Get active escalation cases
export const getEscalationCases = async (req, res) => {
  try {
    const { tenantId } = req;
    const { status, campusId, severity } = req.query;

    const filter = { tenantId };
    if (status) filter.status = status;
    if (campusId) filter.campusId = campusId;
    if (severity) filter.severity = severity;

    const cases = await EscalationCase.find(filter)
      .populate('studentId', 'name email')
      .populate('chainId', 'name triggerType')
      .populate('escalationHistory.assignedTo', 'name email role')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    const stats = {
      total: cases.length,
      active: cases.filter(c => c.status === 'active').length,
      resolved: cases.filter(c => c.status === 'resolved').length,
      escalated: cases.filter(c => c.status === 'escalated').length,
      bySeverity: {
        low: cases.filter(c => c.severity === 'low').length,
        medium: cases.filter(c => c.severity === 'medium').length,
        high: cases.filter(c => c.severity === 'high').length,
        critical: cases.filter(c => c.severity === 'critical').length,
      },
    };

    res.json({
      cases,
      statistics: stats,
    });
  } catch (error) {
    console.error('Error fetching escalation cases:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 16. Resolve escalation case
export const resolveEscalationCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { tenantId } = req;
    const { resolutionNotes } = req.body;

    const escalationCase = await EscalationCase.findOne({ _id: caseId, tenantId });
    if (!escalationCase) {
      return res.status(404).json({ message: 'Escalation case not found' });
    }

    escalationCase.status = 'resolved';
    escalationCase.resolvedBy = req.user._id;
    escalationCase.resolvedAt = new Date();
    escalationCase.resolutionNotes = resolutionNotes;
    escalationCase.resolutionTime = Math.floor((new Date() - escalationCase.createdAt) / 60000); // minutes

    await escalationCase.save();

    res.json({
      success: true,
      message: 'Escalation case resolved',
      case: escalationCase,
    });
  } catch (error) {
    console.error('Error resolving case:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper: Create default roles
const createDefaultRoles = async (tenantId, orgId, createdBy) => {
  const defaultRoles = [
    {
      roleName: 'School Admin',
      roleType: 'school_admin',
      displayName: 'School Administrator',
      description: 'Full access to all features and campuses',
      permissions: {
        viewDashboard: true,
        viewAnalytics: true,
        viewAllCampuses: true,
        createStudent: true,
        editStudent: true,
        deleteStudent: true,
        viewStudentPII: true,
        createStaff: true,
        editStaff: true,
        deleteStaff: true,
        assignClasses: true,
        approveAssignments: true,
        createAssignments: true,
        viewAllAssignments: true,
        createTemplates: true,
        editTemplates: true,
        deleteTemplates: true,
        approveTemplates: true,
        publishTemplates: true,
        viewWellbeingCases: true,
        createWellbeingFlags: true,
        resolveWellbeingCases: true,
        accessCounselingData: true,
        viewFinancials: true,
        manageSubscription: true,
        manageSettings: true,
        manageCampuses: true,
        manageRoles: true,
        viewComplianceData: true,
        manageConsents: true,
        managePolicies: true,
        viewAuditLogs: true,
        viewEmergencyAlerts: true,
        createEmergencyAlerts: true,
        manageEscalation: true,
      },
    },
    {
      roleName: 'Campus Admin',
      roleType: 'campus_admin',
      displayName: 'Campus Administrator',
      description: 'Full access to assigned campus only',
      permissions: {
        viewDashboard: true,
        viewAnalytics: true,
        viewOwnCampusOnly: true,
        createStudent: true,
        editStudent: true,
        viewStudentPII: true,
        createStaff: true,
        editStaff: true,
        assignClasses: true,
        approveAssignments: true,
        viewAllAssignments: true,
        createTemplates: true,
        editTemplates: true,
        viewWellbeingCases: true,
        createWellbeingFlags: true,
        resolveWellbeingCases: true,
        viewEmergencyAlerts: true,
        createEmergencyAlerts: true,
      },
    },
    {
      roleName: 'Counselor',
      roleType: 'counselor',
      displayName: 'School Counselor',
      description: 'Access to wellbeing and counseling features',
      permissions: {
        viewDashboard: true,
        viewAnalytics: true,
        viewStudentPII: true,
        viewWellbeingCases: true,
        createWellbeingFlags: true,
        resolveWellbeingCases: true,
        accessCounselingData: true,
        viewEmergencyAlerts: true,
      },
    },
  ];

  const createdRoles = await RolePermission.insertMany(
    defaultRoles.map(role => ({ ...role, tenantId, orgId, createdBy }))
  );

  return createdRoles;
};

// 17. Assign role to user
export const assignRoleToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { tenantId } = req;
    const { roleType, campusId } = req.body;

    const user = await User.findOne({ _id: userId, tenantId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = roleType;
    if (campusId) {
      user.campusId = campusId;
    }
    await user.save();

    res.json({
      success: true,
      message: 'Role assigned successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        campusId: user.campusId,
      },
    });
  } catch (error) {
    console.error('Error assigning role:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============= NEP COMPETENCY TRACKING & EXPORT =============

// 1. Get all NEP competencies
export const getNEPCompetencies = async (req, res) => {
  try {
    const { grade, pillar, search } = req.query;

    const filter = { isActive: true };
    if (grade) filter.grade = parseInt(grade);
    if (pillar) filter.pillar = pillar;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { competencyId: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const competencies = await NEPCompetency.find(filter).sort({ grade: 1, pillar: 1, competencyId: 1 });

    res.json({
      competencies,
      total: competencies.length,
    });
  } catch (error) {
    console.error('Error fetching NEP competencies:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. Create NEP competency
export const createNEPCompetency = async (req, res) => {
  try {
    const competencyData = req.body;

    const competency = await NEPCompetency.create(competencyData);

    res.json({
      success: true,
      message: 'NEP competency created successfully',
      competency,
    });
  } catch (error) {
    console.error('Error creating NEP competency:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. Log NEP coverage (when assignment/template is used)
export const logNEPCoverage = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const {
      activityId, activityType, activityTitle, studentId, classId,
      grade, section, competenciesCovered, coverageHours, startDate, endDate
    } = req.body;

    const coverageLog = await NEPCoverageLog.create({
      tenantId,
      orgId,
      activityId,
      activityType,
      activityTitle,
      studentId,
      classId,
      grade,
      section,
      competenciesCovered,
      coverageHours,
      startDate,
      endDate,
      assignedBy: req.user._id,
    });

    res.json({
      success: true,
      message: 'NEP coverage logged successfully',
      coverageLog,
    });
  } catch (error) {
    console.error('Error logging NEP coverage:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 4. Get NEP coverage report
export const getNEPCoverageReport = async (req, res) => {
  try {
    const { tenantId } = req;
    const { startDate, endDate, grade, campusId } = req.query;

    const filter = { tenantId };
    
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }
    
    if (grade) filter.grade = parseInt(grade);
    if (campusId) filter.campusId = campusId;

    const coverageLogs = await NEPCoverageLog.find(filter)
      .populate('activityId')
      .populate('studentId', 'name')
      .populate('classId', 'classNumber')
      .sort({ startDate: -1 });

    // Aggregate by competency
    const competencyMap = {};
    coverageLogs.forEach(log => {
      log.competenciesCovered.forEach(comp => {
        if (!competencyMap[comp.competencyId]) {
          competencyMap[comp.competencyId] = {
            competencyId: comp.competencyId,
            pillar: comp.pillar,
            totalCoverageHours: 0,
            activitiesCount: 0,
            studentsCount: new Set(),
            activities: [],
          };
        }
        competencyMap[comp.competencyId].totalCoverageHours += log.coverageHours || 0;
        competencyMap[comp.competencyId].activitiesCount++;
        if (log.studentId) {
          competencyMap[comp.competencyId].studentsCount.add(log.studentId.toString());
        }
        competencyMap[comp.competencyId].activities.push({
          activityId: log.activityId,
          activityTitle: log.activityTitle,
          grade: log.grade,
          coverageHours: log.coverageHours,
          startDate: log.startDate,
        });
      });
    });

    // Convert to array and calculate percentages
    const competencyCoverage = Object.values(competencyMap).map(comp => ({
      ...comp,
      studentsCount: comp.studentsCount.size,
      activities: comp.activities.slice(0, 5), // Limit to 5 for response
    }));

    // Get all competencies for the grade
    let allCompetencies = [];
    if (grade) {
      allCompetencies = await NEPCompetency.find({ grade: parseInt(grade), isActive: true });
    }

    const coveragePercentage = allCompetencies.length > 0
      ? (Object.keys(competencyMap).length / allCompetencies.length) * 100
      : 0;

    res.json({
      summary: {
        totalActivities: coverageLogs.length,
        competenciesCovered: Object.keys(competencyMap).length,
        totalCompetencies: allCompetencies.length,
        coveragePercentage: parseFloat(coveragePercentage.toFixed(2)),
        totalCoverageHours: coverageLogs.reduce((sum, log) => sum + (log.coverageHours || 0), 0),
      },
      competencyCoverage,
      recentActivities: coverageLogs.slice(0, 10),
    });
  } catch (error) {
    console.error('Error fetching NEP coverage report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 5. Export NEP coverage as CSV
export const exportNEPCoverageCSV = async (req, res) => {
  try {
    const { tenantId } = req;
    const { startDate, endDate, grade, campusId } = req.query;

    const filter = { tenantId };
    
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }
    
    if (grade) filter.grade = parseInt(grade);
    if (campusId) filter.campusId = campusId;

    const coverageLogs = await NEPCoverageLog.find(filter)
      .populate('activityId')
      .sort({ startDate: -1 });

    // Format for CSV export
    const csvData = [];
    coverageLogs.forEach(log => {
      const competencyIds = log.competenciesCovered.map(c => c.competencyId).join('; ');
      csvData.push({
        grade: log.grade || 'N/A',
        activity_id: log.activityId || log.activityTitle || 'N/A',
        activity_title: log.activityTitle || 'N/A',
        activity_type: log.activityType,
        NEP_competencies: competencyIds,
        coverage_hours: log.coverageHours || 0,
        start_date: log.startDate ? new Date(log.startDate).toISOString().split('T')[0] : '',
        end_date: log.endDate ? new Date(log.endDate).toISOString().split('T')[0] : '',
        status: log.status,
        section: log.section || 'N/A',
      });
    });

    // Convert to CSV
    const headers = ['grade', 'activity_id', 'activity_title', 'activity_type', 'NEP_competencies', 'coverage_hours', 'start_date', 'end_date', 'status', 'section'];
    const rows = csvData.map(row => headers.map(h => row[h] || '').join(','));
    const csv = [headers.join(','), ...rows].join('\n');

    // Log export
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'data_exported',
      targetType: 'system',
      description: `NEP coverage report exported (${coverageLogs.length} records)`,
      metadata: { format: 'CSV', startDate, endDate, grade, recordCount: coverageLogs.length },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=nep-coverage-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Error exporting NEP coverage CSV:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 6. Export NEP coverage as JSON (for PDF generation on frontend)
export const exportNEPCoverageJSON = async (req, res) => {
  try {
    const { tenantId } = req;
    const { startDate, endDate, grade, campusId } = req.query;

    const filter = { tenantId };
    
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }
    
    if (grade) filter.grade = parseInt(grade);
    if (campusId) filter.campusId = campusId;

    const coverageLogs = await NEPCoverageLog.find(filter)
      .populate('studentId', 'name email')
      .populate('classId', 'classNumber stream')
      .sort({ startDate: -1 });

    // Get competency details
    const competencyIds = [...new Set(
      coverageLogs.flatMap(log => log.competenciesCovered.map(c => c.competencyId))
    )];

    const competencies = await NEPCompetency.find({
      competencyId: { $in: competencyIds }
    });

    const competencyLookup = {};
    competencies.forEach(comp => {
      competencyLookup[comp.competencyId] = comp;
    });

    // Format data for export
    const exportData = coverageLogs.map(log => ({
      grade: log.grade,
      activity_id: log.activityId?.toString() || log.activityTitle,
      activity_title: log.activityTitle,
      activity_type: log.activityType,
      NEP_competencies: log.competenciesCovered.map(c => ({
        competencyId: c.competencyId,
        title: competencyLookup[c.competencyId]?.title || c.competencyId,
        pillar: c.pillar,
        coverage: c.coveragePercentage,
        mastery: c.masteryLevel,
      })),
      coverage_hours: log.coverageHours,
      start_date: log.startDate,
      end_date: log.endDate,
      student: log.studentId?.name,
      class: log.classId?.classNumber,
      section: log.section,
      status: log.status,
    }));

    // Summary statistics
    const summary = {
      totalActivities: coverageLogs.length,
      totalCompetenciesCovered: competencyIds.length,
      totalCoverageHours: coverageLogs.reduce((sum, log) => sum + (log.coverageHours || 0), 0),
      byPillar: {
        uvls: competencyIds.filter(id => id.includes('UVLS')).length,
        dcos: competencyIds.filter(id => id.includes('DCOS')).length,
        moral: competencyIds.filter(id => id.includes('MORAL')).length,
        ehe: competencyIds.filter(id => id.includes('EHE')).length,
        crgc: competencyIds.filter(id => id.includes('CRGC')).length,
      },
      dateRange: {
        start: startDate || 'All time',
        end: endDate || 'Present',
      },
      grade: grade || 'All grades',
    };

    // Log export
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'data_exported',
      targetType: 'system',
      description: `NEP coverage report exported (${coverageLogs.length} records)`,
      metadata: { format: 'JSON', startDate, endDate, grade, recordCount: coverageLogs.length },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      summary,
      data: exportData,
      exportedAt: new Date(),
      format: 'standardized_nep_export',
    });
  } catch (error) {
    console.error('Error exporting NEP coverage JSON:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 7. Seed default NEP competencies
export const seedNEPCompetencies = async (req, res) => {
  try {
    // Check if competencies already exist
    const existingCount = await NEPCompetency.countDocuments();
    if (existingCount > 0) {
      return res.json({
        success: true,
        message: 'NEP competencies already seeded',
        count: existingCount,
      });
    }

    // Sample NEP competencies for each pillar and grade
    const sampleCompetencies = [];
    const pillars = ['uvls', 'dcos', 'moral', 'ehe', 'crgc'];
    const pillarNames = {
      uvls: 'Understanding Values & Life Skills',
      dcos: 'Digital Citizenship & Online Safety',
      moral: 'Moral & Spiritual Education',
      ehe: 'Environmental & Health Education',
      crgc: 'Cultural Roots & Global Citizenship',
    };

    for (let grade = 1; grade <= 12; grade++) {
      pillars.forEach((pillar, pillarIdx) => {
        for (let i = 1; i <= 5; i++) {
          const competencyId = `NEP-${grade}-${pillar.toUpperCase()}-${String(i).padStart(3, '0')}`;
          sampleCompetencies.push({
            competencyId,
            title: `${pillarNames[pillar]} Competency ${i} for Grade ${grade}`,
            description: `Develop ${pillarNames[pillar].toLowerCase()} through practical activities and assessments`,
            grade,
            pillar,
            learningOutcome: `Students will demonstrate understanding of ${pillarNames[pillar].toLowerCase()}`,
            assessmentCriteria: [
              'Can explain key concepts',
              'Can apply in real situations',
              'Shows critical thinking',
            ],
            difficulty: i <= 2 ? 'foundation' : i <= 4 ? 'intermediate' : 'advanced',
            recommendedHours: i * 2,
            domain: 'cognitive',
            bloomLevel: i <= 2 ? 'understand' : i <= 4 ? 'apply' : 'analyze',
            nepReference: {
              document: 'NEP 2020',
              section: `Grade ${grade} - ${pillarNames[pillar]}`,
              page: grade * 10 + pillarIdx,
            },
          });
        }
      });
    }

    const created = await NEPCompetency.insertMany(sampleCompetencies);

    res.json({
      success: true,
      message: `${created.length} NEP competencies seeded successfully`,
      count: created.length,
    });
  } catch (error) {
    console.error('Error seeding NEP competencies:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 8. Update template with NEP competencies
export const updateTemplateNEPCompetencies = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { tenantId } = req;
    const { competencyIds, nepLinks } = req.body;

    const template = await Template.findOne({ _id: templateId, tenantId });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Validate competency IDs exist
    const competencies = await NEPCompetency.find({
      competencyId: { $in: competencyIds }
    });

    if (!template.metadata) {
      template.metadata = {};
    }

    template.metadata.nepCompetencies = competencyIds;
    template.metadata.nepLinks = nepLinks || template.metadata.nepLinks || [];
    
    // Auto-tag pillars based on competencies
    const pillars = [...new Set(competencies.map(c => c.pillar))];
    template.tags = [...new Set([...(template.tags || []), ...pillars])];

    await template.save();

    res.json({
      success: true,
      message: 'Template NEP competencies updated',
      template,
      competenciesLinked: competencies.length,
    });
  } catch (error) {
    console.error('Error updating template NEP competencies:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// 9. Update assignment with NEP competencies
export const updateAssignmentNEPCompetencies = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { tenantId } = req;
    const { competencyIds } = req.body;

    const assignment = await Assignment.findOne({ _id: assignmentId, tenantId });
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Validate competency IDs
    const competencies = await NEPCompetency.find({
      competencyId: { $in: competencyIds }
    });

    if (!assignment.metadata) {
      assignment.metadata = {};
    }

    assignment.metadata = assignment.metadata || {};
    assignment.metadata.nepCompetencies = competencyIds;

    await assignment.save();

    // When assignment is published, log coverage
    if (assignment.status === 'published') {
      const estimatedHours = (assignment.modules?.reduce((sum, m) => sum + (m.duration || 0), 0) || 60) / 60;
      
      await NEPCoverageLog.create({
        tenantId,
        orgId: req.user?.orgId,
        activityId: assignment._id,
        activityType: 'assignment',
        activityTitle: assignment.title,
        classId: assignment.classId,
        grade: parseInt(assignment.className?.match(/\d+/)?.[0]) || null,
        section: assignment.section,
        competenciesCovered: competencyIds.map(id => {
          const comp = competencies.find(c => c.competencyId === id);
          return {
            competencyId: id,
            pillar: comp?.pillar || 'uvls',
            coveragePercentage: 100,
            masteryLevel: 'introduced',
          };
        }),
        coverageHours: estimatedHours,
        startDate: assignment.assignedDate || new Date(),
        endDate: assignment.dueDate,
        assignedBy: assignment.teacherId,
        status: 'scheduled',
      });
    }

    res.json({
      success: true,
      message: 'Assignment NEP competencies updated',
      assignment,
      competenciesLinked: competencies.length,
    });
  } catch (error) {
    console.error('Error updating assignment NEP competencies:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 10. Get NEP dashboard summary
export const getNEPDashboard = async (req, res) => {
  try {
    const { tenantId } = req;
    const { grade } = req.query;

    const filter = { tenantId };
    if (grade) filter.grade = parseInt(grade);

    // Get competencies for grade
    const allCompetencies = await NEPCompetency.find({
      ...(grade && { grade: parseInt(grade) }),
      isActive: true,
    });

    // Get coverage logs
    const coverageLogs = await NEPCoverageLog.find(filter);

    // Calculate coverage by pillar
    const pillarCoverage = {
      uvls: { total: 0, covered: 0, hours: 0 },
      dcos: { total: 0, covered: 0, hours: 0 },
      moral: { total: 0, covered: 0, hours: 0 },
      ehe: { total: 0, covered: 0, hours: 0 },
      crgc: { total: 0, covered: 0, hours: 0 },
    };

    allCompetencies.forEach(comp => {
      pillarCoverage[comp.pillar].total++;
    });

    const coveredCompetencies = new Set();
    coverageLogs.forEach(log => {
      log.competenciesCovered.forEach(comp => {
        coveredCompetencies.add(comp.competencyId);
        pillarCoverage[comp.pillar].hours += log.coverageHours || 0;
      });
    });

    coveredCompetencies.forEach(compId => {
      const comp = allCompetencies.find(c => c.competencyId === compId);
      if (comp) {
        pillarCoverage[comp.pillar].covered++;
      }
    });

    // Calculate percentages
    Object.keys(pillarCoverage).forEach(pillar => {
      const data = pillarCoverage[pillar];
      data.percentage = data.total > 0 ? (data.covered / data.total) * 100 : 0;
    });

    res.json({
      summary: {
        totalCompetencies: allCompetencies.length,
        coveredCompetencies: coveredCompetencies.size,
        coveragePercentage: allCompetencies.length > 0 
          ? (coveredCompetencies.size / allCompetencies.length) * 100 
          : 0,
        totalHours: coverageLogs.reduce((sum, log) => sum + (log.coverageHours || 0), 0),
      },
      pillarCoverage,
      recentActivities: coverageLogs.slice(-10),
    });
  } catch (error) {
    console.error('Error fetching NEP dashboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============= ADDITIONAL HELPER ENDPOINTS =============

// Get organization info
export const getOrganizationInfo = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;

    if (!orgId) {
      return res.json({
        organization: {
          name: 'School',
          email: '',
          address: '',
          phone: '',
          website: '',
          principalName: ''
        }
      });
    }

    const organization = await Organization.findById(orgId);
    
    if (!organization) {
      return res.json({
        organization: {
          name: 'School',
          email: '',
          address: '',
          phone: '',
          website: '',
          principalName: ''
        }
      });
    }
    
    // Handle address - it might be an object or string
    let addressString = '';
    if (organization.settings?.address) {
      if (typeof organization.settings.address === 'string') {
        addressString = organization.settings.address;
      } else if (typeof organization.settings.address === 'object') {
        const addr = organization.settings.address;
        // If street contains the full address (likely has commas or is long), use only street
        // Otherwise, combine all fields
        if (addr.street && (addr.street.includes(',') || addr.street.length > 50)) {
          // Street field contains the full address, use it directly
          addressString = addr.street;
        } else {
          // Build address string from object fields, filtering out duplicates
          const parts = [
            addr.street,
            addr.city,
            addr.state,
            addr.pincode,
            addr.country
          ].filter(Boolean);
          addressString = parts.join(', ') || '';
        }
      }
    }
    
    res.json({
      organization: {
        name: organization?.name || 'School',
        email: organization?.settings?.contactInfo?.email || '',
        address: addressString,
        phone: organization?.settings?.contactInfo?.phone || '',
        website: organization?.settings?.contactInfo?.website || ''
      }
    });
  } catch (error) {
    console.error('Error fetching organization info:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Update organization info
export const updateOrganizationInfo = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { name, email, phone, address, website } = req.body;

    console.log('📝 Update organization info request:', { name, email, phone, address, website });

    if (!orgId) {
      return res.status(400).json({ message: 'Organization ID required' });
    }

    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Update fields - name is required, so validate it
    if (name !== undefined && name !== null) {
      const trimmedName = typeof name === 'string' ? name.trim() : String(name).trim();
      if (!trimmedName) {
        return res.status(400).json({ message: 'School name is required' });
      }
      console.log('✅ Updating name from', organization.name, 'to', trimmedName);
      organization.name = trimmedName;
    } else {
      console.log('⚠️ Name not provided in request');
    }
    
    // Initialize settings if it doesn't exist
    if (!organization.settings) {
      organization.settings = {};
    }
    
    // Update contact info in settings
    if (!organization.settings.contactInfo) {
      organization.settings.contactInfo = {};
    }
    
    if (email !== undefined) {
      organization.settings.contactInfo.email = email || '';
    }
    if (phone !== undefined) {
      organization.settings.contactInfo.phone = phone || '';
    }
    if (website !== undefined) {
      organization.settings.contactInfo.website = website || '';
    }
    
    // Handle address - if it's a string, store it in a way that's compatible with the schema
    // The schema expects address to be an object, but we'll store the string in a way that works
    if (address !== undefined) {
      // If address is a string, store it in the street field and clear other fields to avoid duplication
      if (typeof address === 'string' && address.trim()) {
        // Store the full address string only in the street field
        // Clear other fields to prevent duplication when retrieving
        organization.settings.address = {
          street: address.trim()
        };
      } else if (typeof address === 'object' && address !== null) {
        // If it's already an object, use it directly
        organization.settings.address = { ...address };
      } else if (address === '' || address === null) {
        // Clear address if empty
        organization.settings.address = {};
      }
    }
    
    console.log('💾 Saving organization with name:', organization.name);
    await organization.save();
    console.log('✅ Organization saved successfully. New name:', organization.name);

    // Emit socket event for real-time updates
    const io = req.app?.get('io');
    if (io && tenantId) {
      io.to(`school-admin-dashboard:${tenantId}`).emit('organization:updated', {
        orgId: organization._id,
        tenantId,
        timestamp: new Date()
      });
      
      io.to(`school-admin-dashboard:${tenantId}`).emit('school-admin:dashboard:update', {
        type: 'organization_updated',
        timestamp: new Date()
      });
    }

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'settings_changed',
      targetType: 'system',
      targetId: organization._id,
      description: 'Organization information updated',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Organization updated successfully',
      organization: {
        name: organization.name,
        email: organization.settings?.contactInfo?.email || '',
        phone: organization.settings?.contactInfo?.phone || '',
        address: typeof organization.settings?.address === 'object' 
          ? (organization.settings.address.street || JSON.stringify(organization.settings.address))
          : (organization.settings?.address || ''),
        website: organization.settings?.contactInfo?.website || ''
      },
    });
  } catch (error) {
    console.error('Error updating organization:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Update campus
export const updateCampus = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { campusId } = req.params;
    const { name, code, location, contactInfo } = req.body;

    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const campusIndex = organization.campuses?.findIndex(c => c.campusId === campusId);
    if (campusIndex === -1 || campusIndex === undefined) {
      return res.status(404).json({ message: 'Campus not found' });
    }

    const campus = organization.campuses[campusIndex];

    // Update campus fields
    if (name) campus.name = name;
    if (code) campus.code = code;
    if (location) campus.location = location;
    if (contactInfo) campus.contactInfo = contactInfo;

    organization.campuses[campusIndex] = campus;
    organization.markModified('campuses');
    await organization.save();

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'campus_updated',
      targetType: 'campus',
      targetId: campusId,
      targetName: name,
      description: `Campus "${name}" updated`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Emit socket events for real-time dashboard updates
    const io = req.app?.get('io');
    if (io && tenantId) {
      io.to(`school-admin-dashboard:${tenantId}`).emit('school:campus:updated', {
        campusId,
        campus,
        tenantId,
        timestamp: new Date()
      });
      
      io.to(`school-admin-dashboard:${tenantId}`).emit('school-admin:dashboard:update', {
        type: 'campus_updated',
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Campus updated successfully',
      campus,
    });
  } catch (error) {
    console.error('Error updating campus:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete campus
export const deleteCampus = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { campusId } = req.params;

    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const campus = organization.campuses?.find(c => c.campusId === campusId);
    if (!campus) {
      return res.status(404).json({ message: 'Campus not found' });
    }

    if (campus.isMain) {
      return res.status(400).json({ message: 'Cannot delete main campus' });
    }

    const campusName = campus.name;

    // Remove campus
    organization.campuses = organization.campuses.filter(c => c.campusId !== campusId);
    organization.markModified('campuses');
    await organization.save();

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'campus_deleted',
      targetType: 'campus',
      targetId: campusId,
      targetName: campusName,
      description: `Campus "${campusName}" deleted`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Emit socket events for real-time dashboard updates
    const io = req.app?.get('io');
    if (io && tenantId) {
      io.to(`school-admin-dashboard:${tenantId}`).emit('school:campus:deleted', {
        campusId,
        campusName,
        tenantId,
        timestamp: new Date()
      });
      
      io.to(`school-admin-dashboard:${tenantId}`).emit('school-admin:dashboard:update', {
        type: 'campus_deleted',
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Campus deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting campus:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update preferences
export const updatePreferences = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const preferences = req.body;

    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Update preferences in organization settings
    if (!organization.settings) organization.settings = {};
    organization.settings.preferences = {
      ...(organization.settings.preferences || {}),
      ...preferences
    };
    organization.markModified('settings');
    await organization.save();

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'preferences_updated',
      targetType: 'organization',
      targetId: organization._id,
      description: 'System preferences updated',
      metadata: preferences,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: organization.settings.preferences,
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get recent activity
export const getRecentActivity = async (req, res) => {
  try {
    const { tenantId } = req;
    const limit = parseInt(req.query.limit) || 20;

    const activities = await ComplianceAuditLog.find({ tenantId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('action userName targetType targetName description createdAt');

    const formattedActivities = activities.map(activity => ({
      title: activity.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: activity.description || `${activity.userName} performed ${activity.action} on ${activity.targetType}`,
      timestamp: activity.createdAt,
      userName: activity.userName,
    }));

    res.json({
      success: true,
      activities: formattedActivities,
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get top performing students
export const getTopPerformers = async (req, res) => {
  try {
    const { tenantId } = req;
    const limit = parseInt(req.query.limit) || 10;

    // Get all students for the tenant
    const students = await SchoolStudent.find({ tenantId })
      .populate('userId', 'name email')
      .populate('classId', 'classNumber stream')
      .lean();

    if (students.length === 0) {
      return res.json({
        success: true,
        students: []
      });
    }

    const studentIds = students.map((student) => student.userId?._id).filter(Boolean);
    if (studentIds.length === 0) {
      return res.json({
        success: true,
        students: []
      });
    }

    const pillarGameCounts = await getAllPillarGameCounts(UnifiedGameProgress);
    const pillarKeys = [
      'finance',
      'brain',
      'uvls',
      'dcos',
      'moral',
      'ai',
      'health-male',
      'health-female',
      'ehe',
      'crgc',
      'sustainability'
    ];

    const mapGameTypeToPillarKey = (gameType) => {
      switch (gameType) {
        case 'finance':
        case 'financial':
          return 'finance';
        case 'brain':
        case 'mental':
          return 'brain';
        case 'uvls':
          return 'uvls';
        case 'dcos':
          return 'dcos';
        case 'moral':
          return 'moral';
        case 'ai':
          return 'ai';
        case 'health-male':
          return 'health-male';
        case 'health-female':
          return 'health-female';
        case 'ehe':
          return 'ehe';
        case 'crgc':
        case 'civic-responsibility':
          return 'crgc';
        case 'sustainability':
          return 'sustainability';
        default:
          return null;
      }
    };

    const getProgressPercent = (game) => {
      if (game?.fullyCompleted) return 100;
      if (game?.totalLevels > 0) {
        return Math.round(((game.levelsCompleted || 0) / game.totalLevels) * 100);
      }
      if (game?.maxScore > 0) {
        return Math.round(((game.highestScore || 0) / game.maxScore) * 100);
      }
      return 0;
    };

    const progressDocs = await UnifiedGameProgress.find({
      userId: { $in: studentIds }
    }).lean();

    const completedByStudent = new Map();
    studentIds.forEach((id) => {
      const key = id.toString();
      const totals = pillarKeys.reduce((acc, pillar) => {
        acc[pillar] = 0;
        return acc;
      }, {});
      completedByStudent.set(key, totals);
    });

    (progressDocs || []).forEach((game) => {
      const pillarKey = mapGameTypeToPillarKey(game.gameType);
      if (!pillarKey) return;
      if (getProgressPercent(game) < 100) return;
      const userKey = game.userId?.toString();
      if (!completedByStudent.has(userKey)) return;
      completedByStudent.get(userKey)[pillarKey] += 1;
    });

    const performersWithScores = students.map((student) => {
      if (!student.userId?._id) return null;

      const userId = student.userId._id;
      const userKey = userId.toString();
      const completedCounts = completedByStudent.get(userKey) || {};

      const pillarMasteryValues = pillarKeys
        .map((pillar) => {
          const totalGames = pillarGameCounts[pillar] || 0;
          if (totalGames === 0) return null;
          const completed = completedCounts[pillar] || 0;
          return Math.round((completed / totalGames) * 100);
        })
        .filter((value) => value !== null);

      const overallMastery = pillarMasteryValues.length > 0
        ? Math.round(pillarMasteryValues.reduce((sum, value) => sum + value, 0) / pillarMasteryValues.length)
        : 0;

      return {
        _id: student._id,
        name: student.userId?.name || 'Unknown',
        grade: student.classId?.classNumber || student.grade || 0,
        section: student.section || 'A',
        score: overallMastery,
        userId
      };
    });

    // Filter out null values and sort by score (descending)
    const performers = performersWithScores
      .filter(p => p !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ _id, userId, ...rest }) => ({
        studentId: _id,
        userId,
        ...rest
      }));

    res.json({
      success: true,
      students: performers,
    });
  } catch (error) {
    console.error('Error fetching top performers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get weekly trend
export const getWeeklyTrend = async (req, res) => {
  try {
    const { tenantId } = req;

    // Get last 7 days of data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trend = await AnalyticsEvent.aggregate([
      {
        $match: {
          tenantId,
          timestamp: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      trend: trend.map(t => ({
        date: t._id,
        events: t.count,
      })),
    });
  } catch (error) {
    console.error('Error fetching weekly trend:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all classes with enhanced data
export const getAllClasses = async (req, res) => {
  try {
    const { tenantId } = req;
    const { grade, stream } = req.query;

    const filter = { tenantId, isActive: true };
    if (grade && grade !== 'all') filter.classNumber = parseInt(grade);
    if (stream && stream !== 'all') filter.stream = stream;

    const classes = await SchoolClass.find(filter)
      .populate('sections.classTeacher', 'name email subject')
      .populate('subjects.teachers', 'name email subject')
      .lean();

    // Enhance with student count
    const classesWithCounts = await Promise.all(classes.map(async (cls) => {
      const studentCount = await SchoolStudent.countDocuments({
        tenantId,
        classId: cls._id
      });

      return {
        ...cls,
        totalStudents: studentCount
      };
    }));

    res.json({
      success: true,
      classes: classesWithCounts,
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get class statistics
export const getClassStats = async (req, res) => {
  try {
    const { tenantId } = req;

    const [totalClasses, classesData] = await Promise.all([
      SchoolClass.countDocuments({ tenantId, isActive: true }),
      SchoolClass.find({ tenantId, isActive: true }).lean()
    ]);

    const totalSections = classesData.reduce((sum, cls) => sum + (cls.sections?.length || 0), 0);
    const totalSubjects = classesData.reduce((sum, cls) => sum + (cls.subjects?.length || 0), 0);
    
    const totalStudents = await SchoolStudent.countDocuments({ tenantId, isActive: true });

    res.json({
      success: true,
      total: totalClasses,
      totalSections,
      totalSubjects,
      totalStudents
    });
  } catch (error) {
    console.error('Error fetching class stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single class details
export const getClassDetails = async (req, res) => {
  try {
    const { tenantId } = req;
    const { classId } = req.params;

    const classData = await SchoolClass.findOne({ _id: classId, tenantId })
      .populate('sections.classTeacher', 'name email phone subject')
      .populate('subjects.teachers', 'name email phone subject')
      .lean();

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Get students in this class
    const students = await SchoolStudent.find({ tenantId, classId })
      .populate('userId', 'name email phone')
      .limit(100)
      .lean();

    const studentsData = students.map(s => ({
      _id: s._id,
      name: s.userId?.name || s.name,
      email: s.userId?.email || s.email,
      rollNumber: s.rollNumber,
      section: s.section,
      grade: s.grade
    }));

    res.json({
      success: true,
      class: {
        ...classData,
        students: studentsData,
        totalStudents: students.length
      }
    });
  } catch (error) {
    console.error('Error fetching class details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new class
export const createClass = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { classNumber, stream, sections, subjects, academicYear, selectedTeachers } = req.body;

    if (!classNumber || !academicYear || !sections || sections.length === 0) {
      return res.status(400).json({ 
        message: 'Missing required fields: classNumber, academicYear, and at least one section are required' 
      });
    }

    // Validate stream for classes 11-12
    if (parseInt(classNumber) >= 11 && !stream) {
      return res.status(400).json({ message: 'Stream is required for classes 11 and 12' });
    }

    // Check if class already exists
    const existingClass = await SchoolClass.findOne({
      tenantId,
      classNumber: parseInt(classNumber),
      stream: stream || null,
      academicYear
    });

    if (existingClass) {
      return res.status(400).json({ 
        message: 'A class with this number, stream, and academic year already exists' 
      });
    }

    // Create the class
    const newClass = await SchoolClass.create({
      tenantId,
      orgId,
      classNumber: parseInt(classNumber),
      stream: stream || undefined,
      sections: sections.map(s => ({
        name: s.name,
        capacity: s.capacity || 40,
        currentStrength: 0,
        classTeacher: s.classTeacher || undefined
      })),
      subjects: subjects || [],
      academicYear,
      isActive: true
    });

    // Assign selected teachers to the class if any
    if (selectedTeachers && selectedTeachers.length > 0) {
      try {
        // Get the class data to update sections
        const classData = await SchoolClass.findById(newClass._id);
        
        // Assign teachers to sections (one teacher per section, cycling if more teachers than sections)
        selectedTeachers.forEach((teacherId, index) => {
          const sectionIndex = index % classData.sections.length;
          if (!classData.sections[sectionIndex].classTeacher) {
            classData.sections[sectionIndex].classTeacher = teacherId;
          }
        });

        await classData.save();

        // Log teacher assignment
        await ComplianceAuditLog.logAction({
          tenantId,
          orgId,
          userId: req.user._id,
          userRole: req.user.role,
          userName: req.user.name,
          action: 'teachers_assigned_to_class',
          targetType: 'class',
          targetId: newClass._id,
          targetName: `Class ${classNumber}${stream ? ` - ${stream}` : ''}`,
          description: `${selectedTeachers.length} teacher(s) assigned to Class ${classNumber}`,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        });
      } catch (teacherError) {
        console.error('Error assigning teachers to class:', teacherError);
        // Don't fail the class creation if teacher assignment fails
      }
    }

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'class_created',
      targetType: 'class',
      targetId: newClass._id,
      targetName: `Class ${classNumber}${stream ? ` - ${stream}` : ''}`,
      description: `New class created: Class ${classNumber}${stream ? ` - ${stream}` : ''} for ${academicYear}${selectedTeachers && selectedTeachers.length > 0 ? ` with ${selectedTeachers.length} teacher(s)` : ''}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({
      success: true,
      message: selectedTeachers && selectedTeachers.length > 0 
        ? `Class created successfully with ${selectedTeachers.length} teacher(s) assigned`
        : 'Class created successfully',
      class: newClass
    });
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Add students to class
export const addStudentsToClass = async (req, res) => {
  try {
    const { tenantId } = req;
    const { classId } = req.params;
    const { studentIds, section } = req.body;

    if (!studentIds || studentIds.length === 0) {
      return res.status(400).json({ message: 'No students provided' });
    }

    // Get class details
    const classData = await SchoolClass.findOne({ _id: classId, tenantId });
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Determine section - use provided or first available section
    const targetSection = section || classData.sections[0]?.name;
    if (!targetSection) {
      return res.status(400).json({ message: 'No sections available in this class' });
    }

    // Check for students already assigned to other classes
    const studentsAlreadyAssigned = await SchoolStudent.find({
      _id: { $in: studentIds },
      tenantId,
      classId: { $ne: classId, $ne: null }
    }).populate('classId', 'classNumber');

    if (studentsAlreadyAssigned.length > 0) {
      const errorMessages = studentsAlreadyAssigned.map(student => 
        `${student.name || 'Student'} is already assigned to Class ${student.classId?.classNumber || 'Unknown'}`
      );
      return res.status(400).json({ 
        message: 'Some students are already assigned to other classes',
        errors: errorMessages,
        studentsAlreadyAssigned: studentsAlreadyAssigned.map(s => s._id)
      });
    }

    // Update both SchoolStudent and User models
    const updatePromises = studentIds.map(async (studentId) => {
      // Update SchoolStudent model
      const schoolStudent = await SchoolStudent.findOneAndUpdate(
        { _id: studentId, tenantId },
        {
          classId: classId,
          grade: classData.classNumber,
          section: targetSection,
          academicYear: classData.academicYear
        },
        { new: true }
      );

      // Update User model if SchoolStudent exists
      if (schoolStudent && schoolStudent.userId) {
        await User.findByIdAndUpdate(schoolStudent.userId, {
          $addToSet: {
            'metadata.classes': {
              classId,
              className: `Class ${classData.classNumber}`,
              teacherId: null, // Admin assignment
              assignedAt: new Date()
            }
          }
        });
      }

      return schoolStudent;
    });

    await Promise.all(updatePromises);

    // Update section strength
    const sectionIndex = classData.sections.findIndex(s => s.name === targetSection);
    if (sectionIndex !== -1) {
      const currentCount = await SchoolStudent.countDocuments({
        tenantId,
        classId,
        section: targetSection
      });
      classData.sections[sectionIndex].currentStrength = currentCount;
      await classData.save();
    }

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'students_added_to_class',
      targetType: 'class',
      targetId: classId,
      targetName: `Class ${classData.classNumber}`,
      description: `${studentIds.length} student(s) added to Class ${classData.classNumber} - Section ${targetSection}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: `${studentIds.length} student(s) added successfully`
    });
  } catch (error) {
    console.error('Error adding students to class:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add students to class by email
export const addStudentsByEmailToClass = async (req, res) => {
  try {
    const { tenantId } = req;
    const { classId } = req.params;
    const { emails, section } = req.body;

    if (!emails || emails.length === 0) {
      return res.status(400).json({ message: 'No email addresses provided' });
    }

    if (!section) {
      return res.status(400).json({ message: 'Section is required' });
    }

    // Get class details
    const classData = await SchoolClass.findOne({ _id: classId, tenantId });
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Verify section exists
    const sectionExists = classData.sections.some(s => s.name === section);
    if (!sectionExists) {
      return res.status(400).json({ message: 'Section does not exist in this class' });
    }

    const results = {
      success: [],
      errors: [],
      alreadyAssigned: []
    };

    // Process each email
    for (const email of emails) {
      try {
        // Find user by email
        const user = await User.findOne({ email, tenantId });
        if (!user) {
          results.errors.push({ email, error: 'User not found' });
          continue;
        }

        // Check if user is a student
        if (user.role !== 'student' && user.role !== 'school_student') {
          results.errors.push({ email, error: 'User is not a student' });
          continue;
        }

        // Find or create SchoolStudent record
        let schoolStudent = await SchoolStudent.findOne({ userId: user._id, tenantId });
        
        if (!schoolStudent) {
          // Create SchoolStudent record
          const admissionNumber = `ADM${new Date().getFullYear()}${Date.now().toString().slice(-6)}`;
          const rollNumber = `ROLL${Date.now().toString().slice(-6)}`;
          
          schoolStudent = await SchoolStudent.create({
            tenantId,
            orgId: req.user?.orgId,
            userId: user._id,
            admissionNumber,
            rollNumber,
            classId: classId,
            section: section,
            academicYear: classData.academicYear,
            parentIds: [], // Will be assigned later
            personalInfo: {
              gender: 'Other' // Default, can be updated later
            },
            academicInfo: {
              admissionDate: new Date()
            },
            fees: {
              totalFees: 0,
              paidAmount: 0,
              pendingAmount: 0
            },
            attendance: {
              totalDays: 0,
              presentDays: 0,
              percentage: 0
            },
            isActive: true,
            wellbeingFlags: [],
            pillars: {
              uvls: 0,
              dcos: 0,
              moral: 0,
              ehe: 0,
              crgc: 0,
            },
          });
        } else {
          // Check if already assigned to this class
          if (schoolStudent.classId && schoolStudent.classId.toString() === classId) {
            results.alreadyAssigned.push({ email, message: 'Student already assigned to this class' });
            continue;
          }

          // Update existing SchoolStudent record
          schoolStudent.classId = classId;
          schoolStudent.grade = classData.classNumber;
          schoolStudent.section = section;
          schoolStudent.academicYear = classData.academicYear;
          await schoolStudent.save();

          // Update User model
          await User.findByIdAndUpdate(user._id, {
            $addToSet: {
              'metadata.classes': {
                classId,
                className: `Class ${classData.classNumber}`,
                teacherId: null, // Admin assignment
                assignedAt: new Date()
              }
            }
          });

          results.success.push({ email, studentId: schoolStudent._id });
        }
      } catch (error) {
        console.error(`Error processing email ${email}:`, error);
        results.errors.push({ email, error: error.message });
      }
    }

    // Update section strength
    const sectionIndex = classData.sections.findIndex(s => s.name === section);
    if (sectionIndex !== -1) {
      const currentCount = await SchoolStudent.countDocuments({
        tenantId,
        classId,
        section: section
      });
      classData.sections[sectionIndex].currentStrength = currentCount;
      await classData.save();
    }

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'students_added_to_class_by_email',
      targetType: 'class',
      targetId: classId,
      targetName: `Class ${classData.classNumber}`,
      description: `${results.success.length} student(s) added to Class ${classData.classNumber} - Section ${section} by email`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: `Processed ${emails.length} email(s)`,
      results
    });
  } catch (error) {
    console.error('Error adding students by email:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add teachers to class
export const addTeachersToClass = async (req, res) => {
  try {
    const { tenantId } = req;
    const { classId } = req.params;
    const { teacherIds } = req.body;

    if (!teacherIds || teacherIds.length === 0) {
      return res.status(400).json({ message: 'No teachers provided' });
    }

    // Get class details
    const classData = await SchoolClass.findOne({ _id: classId, tenantId });
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const results = {
      success: [],
      errors: []
    };

    // Process each teacher
    for (const teacherId of teacherIds) {
      try {
        // Find teacher
        const teacher = await User.findOne({ _id: teacherId, tenantId, role: 'school_teacher' });
        if (!teacher) {
          results.errors.push({ teacherId, error: 'Teacher not found or not a school teacher' });
          continue;
        }

        // Check if teacher is already assigned to this class
        const alreadyAssigned = classData.sections.some(section => 
          section.classTeacher && section.classTeacher.toString() === teacherId
        );

        if (alreadyAssigned) {
          results.errors.push({ teacherId, error: 'Teacher already assigned to this class' });
          continue;
        }

        // Check if teacher is already assigned to any other class
        const assignedToOtherClass = await SchoolClass.findOne({
          tenantId,
          _id: { $ne: classId },
          'sections.classTeacher': teacherId
        });

        if (assignedToOtherClass) {
          results.errors.push({ 
            teacherId, 
            error: `Teacher is already assigned to Class ${assignedToOtherClass.classNumber}. One teacher can only manage one class.` 
          });
          continue;
        }

        // Assign teacher to first available section without a class teacher
        let assigned = false;
        for (let i = 0; i < classData.sections.length; i++) {
          if (!classData.sections[i].classTeacher) {
            classData.sections[i].classTeacher = teacherId;
            assigned = true;
            break;
          }
        }

        if (!assigned) {
          // If all sections have teachers, assign to first section
          classData.sections[0].classTeacher = teacherId;
        }

        results.success.push({ teacherId, name: teacher.name });

      } catch (error) {
        console.error(`Error processing teacher ${teacherId}:`, error);
        results.errors.push({ teacherId, error: error.message });
      }
    }

    // Save class with updated teachers
    await classData.save();

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'teachers_added_to_class',
      targetType: 'class',
      targetId: classId,
      targetName: `Class ${classData.classNumber}`,
      description: `${results.success.length} teacher(s) added to Class ${classData.classNumber}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: `Processed ${teacherIds.length} teacher(s)`,
      results: {
        success: results.success.length,
        errors: results.errors.length,
        details: results
      }
    });

  } catch (error) {
    console.error('Error adding teachers to class:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove teacher from class
export const removeTeacherFromClass = async (req, res) => {
  try {
    const { tenantId } = req;
    const { classId, teacherId } = req.params;

    // Get class details
    const classData = await SchoolClass.findOne({ _id: classId, tenantId });
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Find and remove teacher from sections
    let teacherRemoved = false;
    classData.sections.forEach(section => {
      if (section.classTeacher && section.classTeacher.toString() === teacherId) {
        section.classTeacher = undefined;
        teacherRemoved = true;
      }
    });

    if (!teacherRemoved) {
      return res.status(404).json({ message: 'Teacher not found in this class' });
    }

    await classData.save();

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'teacher_removed_from_class',
      targetType: 'class',
      targetId: classId,
      description: `Teacher removed from Class ${classData.classNumber}`,
      metadata: { teacherId }
    });

    res.json({
      success: true,
      message: 'Teacher removed from class successfully'
    });
  } catch (error) {
    console.error('Error removing teacher from class:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove student from class
export const removeStudentFromClass = async (req, res) => {
  try {
    const { tenantId } = req;
    const { classId, studentId } = req.params;

    const classData = await SchoolClass.findOne({ _id: classId, tenantId });
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const schoolStudent = await SchoolStudent.findOne({
      _id: studentId,
      tenantId,
      classId,
    }).populate('userId', 'name email metadata tenantId orgId');

    if (!schoolStudent) {
      return res.status(404).json({ message: 'Student not found in this class' });
    }

    await SchoolStudent.updateOne(
      { _id: schoolStudent._id, tenantId },
      {
        $set: {
          classId: null,
          grade: null,
          section: null,
          academicYear: null,
        },
      }
    );

    if (schoolStudent.section) {
      const sectionIndex = classData.sections.findIndex((section) => section.name === schoolStudent.section);
      if (sectionIndex !== -1) {
        const currentCount = await SchoolStudent.countDocuments({
          tenantId,
          classId,
          section: schoolStudent.section,
        });
        classData.sections[sectionIndex].currentStrength = currentCount;
        await classData.save();
      }
    }

    if (schoolStudent.userId) {
      const metadataClasses = schoolStudent.userId.metadata?.classes || [];
      const filteredClasses = metadataClasses.filter(
        (entry) => entry.classId?.toString() !== classId.toString()
      );

      await User.updateOne(
        { _id: schoolStudent.userId._id },
        {
          $set: {
            'metadata.classes': filteredClasses,
            'metadata.schoolEnrollment': null,
          },
        }
      );
    }

    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'student_removed_from_class',
      targetType: 'class',
      targetId: classId,
      targetName: `Class ${classData.classNumber}`,
      description: `Student ${schoolStudent.userId?.name || 'Unknown'} removed from Class ${classData.classNumber}`,
      metadata: { studentId },
    });

    const io = req.app && typeof req.app.get === 'function' ? req.app.get('io') : null;
    if (io) {
      const payload = {
        tenantId,
        orgId: classData.orgId ? classData.orgId.toString() : null,
        classId: classId.toString(),
        studentId: schoolStudent.userId?._id?.toString() || studentId,
        removedAt: new Date().toISOString(),
      };
      io.emit('school:students:removed', payload);
      io.emit('school:class-roster:updated', payload);
      
      // Also emit to dashboard room for realtime updates
      if (tenantId) {
        io.to(`school-admin-dashboard:${tenantId}`).emit('school-admin:dashboard:update', {
          type: 'students_removed',
          timestamp: new Date()
        });
      }
    }

    res.json({
      success: true,
      message: 'Student removed from class successfully',
    });
  } catch (error) {
    console.error('Error removing student from class:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Create class with teachers and students sequentially
export const createSequentialClass = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { classInfo, teachers, students } = req.body;

    // Validate class information
    if (!classInfo.classNumber || !classInfo.academicYear || !classInfo.sections || classInfo.sections.length === 0) {
      return res.status(400).json({ 
        message: 'Missing required class fields: classNumber, academicYear, and at least one section are required' 
      });
    }

    // Validate stream for classes 11-12
    if (parseInt(classInfo.classNumber) >= 11 && !classInfo.stream) {
      return res.status(400).json({ message: 'Stream is required for classes 11 and 12' });
    }

    // Validate teachers
    if (!teachers || teachers.length === 0) {
      return res.status(400).json({ message: 'At least one teacher is required' });
    }

    // Validate students
    if (!students || students.length === 0) {
      return res.status(400).json({ message: 'At least one student is required' });
    }

    // Check if class already exists
    const existingClass = await SchoolClass.findOne({
      tenantId,
      classNumber: parseInt(classInfo.classNumber),
      stream: classInfo.stream || null,
      academicYear: classInfo.academicYear
    });

    if (existingClass) {
      return res.status(400).json({ 
        message: 'A class with this number, stream, and academic year already exists' 
      });
    }

    // Start transaction
    const session = await SchoolClass.startSession();
    session.startTransaction();

    try {
      // 1. Create the class
      const newClass = await SchoolClass.create([{
        tenantId,
        orgId,
        classNumber: parseInt(classInfo.classNumber),
        stream: classInfo.stream || undefined,
        sections: classInfo.sections.map(s => ({
          name: s.name,
          capacity: s.capacity || 40,
          currentStrength: 0
        })),
        subjects: [],
        academicYear: classInfo.academicYear,
        isActive: true
      }], { session });

      const classId = newClass[0]._id;

      // 2. Create teachers
      const createdTeachers = [];
      for (const teacherData of teachers) {
        // Check if teacher email already exists
        const existingTeacher = await User.findOne({
          email: teacherData.email,
          tenantId
        });

        if (existingTeacher) {
          throw new Error(`Teacher with email ${teacherData.email} already exists`);
        }

        // Create user account for teacher
        const teacherUser = await User.create([{
          tenantId,
          orgId,
          name: teacherData.name,
          email: teacherData.email,
          phone: teacherData.phone,
          role: 'school_teacher',
          subject: teacherData.subject,
          metadata: {
            qualification: teacherData.qualification,
            experience: teacherData.experience,
            joiningDate: teacherData.joiningDate
          }
        }], { session });

        createdTeachers.push(teacherUser[0]);
      }

      // 3. Create students
      const createdStudents = [];
      for (let i = 0; i < students.length; i++) {
        const studentData = students[i];
        
        // Check if student email already exists
        const existingStudent = await User.findOne({
          email: studentData.email,
          tenantId
        });

        if (existingStudent) {
          throw new Error(`Student with email ${studentData.email} already exists`);
        }
        
        // Use provided admission number or generate one
        const admissionNumber = studentData.admissionNumber || `ADM${classInfo.academicYear.slice(-2)}${classInfo.classNumber.toString().padStart(2, '0')}${(i + 1).toString().padStart(3, '0')}`;
        
        // Check if admission number already exists
        const existingAdmission = await SchoolStudent.findOne({
          admissionNumber: admissionNumber,
          tenantId
        });

        if (existingAdmission) {
          throw new Error(`Student with admission number ${admissionNumber} already exists`);
        }
        
        // Create user account for student
        const studentUser = await User.create([{
          tenantId,
          orgId,
          name: studentData.name,
          email: studentData.email,
          phone: studentData.phone,
          role: 'school_student',
          isActive: true,
          profile: {
            rollNumber: studentData.rollNumber,
            grade: studentData.grade,
            section: studentData.section,
            gender: studentData.gender
          }
        }], { session });

        // Create a temporary parent user for the student (required field)
        const parentEmail = `parent_${studentData.email}`;
        
        // Check if parent email already exists
        let tempParentUser;
        const existingParent = await User.findOne({
          email: parentEmail,
          tenantId
        });

        if (existingParent) {
          // Use existing parent
          tempParentUser = existingParent;
        } else {
          // Create new parent
          const newParent = await User.create([{
            tenantId,
            orgId,
            name: `${studentData.name} Parent`,
            email: parentEmail,
            phone: studentData.phone || '0000000000',
            role: 'school_parent',
            isActive: true,
            profile: {
              relation: 'parent',
              studentId: studentUser[0]._id
            }
          }], { session });
          tempParentUser = newParent[0];
        }

        // Create school student record
        const schoolStudent = await SchoolStudent.create([{
          tenantId,
          orgId,
          userId: studentUser[0]._id,
          admissionNumber: admissionNumber,
          classId: classId,
          name: studentData.name,
          email: studentData.email,
          phone: studentData.phone,
          rollNumber: studentData.rollNumber,
          grade: studentData.grade,
          section: studentData.section,
          gender: studentData.gender,
          academicYear: classInfo.academicYear,
          parentIds: [tempParentUser._id], // Required field
          isActive: true,
          attendance: {
            totalDays: 0,
            presentDays: 0,
            percentage: 0
          },
          fees: {
            totalFees: 0,
            paidFees: 0,
            pendingFees: 0
          }
        }], { session });

        createdStudents.push(schoolStudent[0]);

        // Create wallet for student
        await Wallet.create([{
          tenantId,
          userId: studentUser[0]._id,
          balance: 0,
          currency: 'INR'
        }], { session });

        // Create user progress record
        await UserProgress.create([{
          tenantId,
          userId: studentUser[0]._id,
          level: 1,
          xp: 0,
          coins: 0,
          streak: 0,
          lastActive: new Date()
        }], { session });
      }

      // 4. Update class with student count
      const sectionCounts = {};
      createdStudents.forEach(student => {
        const section = student.section;
        sectionCounts[section] = (sectionCounts[section] || 0) + 1;
      });

      // Update section strengths
      const updatedSections = newClass[0].sections.map(section => ({
        ...section,
        currentStrength: sectionCounts[section.name] || 0
      }));

      await SchoolClass.findByIdAndUpdate(
        classId,
        { sections: updatedSections },
        { session }
      );

      // Commit transaction
      await session.commitTransaction();

      // 5. Log audit (after successful transaction)
      try {
        await ComplianceAuditLog.logAction({
          tenantId,
          orgId,
          userId: req.user._id,
          userRole: req.user.role,
          userName: req.user.name,
          action: 'class_created',
          targetType: 'class',
          targetId: classId,
          targetName: `Class ${classInfo.classNumber}${classInfo.stream ? ` - ${classInfo.stream}` : ''}`,
          description: `Sequential class creation: Class ${classInfo.classNumber}${classInfo.stream ? ` - ${classInfo.stream}` : ''} with ${createdTeachers.length} teachers and ${createdStudents.length} students`,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        });
      } catch (auditError) {
        console.error('Error logging audit action:', auditError);
        // Don't fail the main operation if audit logging fails
      }

      res.status(201).json({
        success: true,
        message: 'Class created successfully with teachers and students',
        class: {
          id: classId,
          classNumber: classInfo.classNumber,
          stream: classInfo.stream,
          academicYear: classInfo.academicYear,
          sections: updatedSections,
          teachersCount: createdTeachers.length,
          studentsCount: createdStudents.length
        }
      });

    } catch (error) {
      // Rollback transaction
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error('Error creating sequential class:', error);
    
    // Handle specific error types
    if (error.message.includes('already exists')) {
      res.status(400).json({ 
        message: error.message,
        error: 'DUPLICATE_ENTRY'
      });
    } else if (error.name === 'ValidationError') {
      res.status(400).json({ 
        message: 'Validation error: ' + error.message,
        error: 'VALIDATION_ERROR'
      });
    } else {
      res.status(500).json({ 
        message: 'Server error', 
        error: error.message 
      });
    }
  }
};

// Update class
export const updateClass = async (req, res) => {
  try {
    const { tenantId } = req;
    const { classId } = req.params;
    const updates = req.body;

    const classData = await SchoolClass.findOneAndUpdate(
      { _id: classId, tenantId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json({
      success: true,
      message: 'Class updated successfully',
      class: classData
    });
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete class
export const deleteClass = async (req, res) => {
  try {
    const { tenantId } = req;
    const { classId } = req.params;

    // Get class data first
    const classData = await SchoolClass.findOne({ _id: classId, tenantId });
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if class has students
    const studentsInClass = await SchoolStudent.find({ tenantId, classId });
    const studentCount = studentsInClass.length;

    if (studentCount > 0) {
      // Remove students from the class (set classId to null)
      await SchoolStudent.updateMany(
        { tenantId, classId },
        { 
          $set: { 
            classId: null, 
            grade: null, 
            section: null 
          } 
        }
      );

      // Log audit for student removal
      await ComplianceAuditLog.logAction({
        tenantId,
        orgId: req.user?.orgId,
        userId: req.user._id,
        userRole: req.user.role,
        userName: req.user.name,
        action: 'students_unassigned_from_class',
        targetType: 'class',
        targetId: classId,
        targetName: `Class ${classData.classNumber}`,
        description: `${studentCount} student(s) unassigned from Class ${classData.classNumber} before deletion`,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
    }

    // Delete the class
    await SchoolClass.findOneAndDelete({ _id: classId, tenantId });

    // Log audit for class deletion
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'class_deleted',
      targetType: 'class',
      targetId: classId,
      targetName: `Class ${classData.classNumber}`,
      description: `Class ${classData.classNumber}${classData.stream ? ` - ${classData.stream}` : ''} deleted${studentCount > 0 ? ` (${studentCount} students unassigned)` : ''}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: studentCount > 0 
        ? `Class deleted successfully. ${studentCount} student(s) have been unassigned from this class.`
        : 'Class deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get students with filters
export const getStudentsWithFilters = async (req, res) => {
  try {
    const { tenantId } = req;
    const { classId, grade, section, status } = req.query;
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 200);

    const filter = { tenantId };
    if (section && section !== 'all') filter.section = section;

    // If filtering by grade, first find classes with that grade
    if (grade && grade !== 'all') {
      const classes = await SchoolClass.find({ 
        tenantId, 
        classNumber: parseInt(grade) 
      }).select('_id');
      
      if (classes.length > 0) {
        filter.classId = { $in: classes.map(c => c._id) };
      } else {
        // No classes found for this grade, return empty
        return res.json({
          success: true,
          students: [],
        });
      }
    } else if (classId && classId !== 'all') {
      filter.classId = classId;
    }

    const students = await SchoolStudent.find(filter)
      .populate('userId', 'name email phone gender dateOfBirth lastActive linkedIds flaggedForCounselor flaggedReason flaggedAt')
      .populate('classId', 'classNumber stream')
      .populate('parentIds', 'name email phone avatar')
      .select('userId personalInfo pillars parentIds rollNumber section classId wellbeingFlags')
      .limit(limit)
      .sort({ createdAt: -1 }); // Show newest first

    const studentUserIds = students
      .map((s) => s.userId?._id)
      .filter(Boolean);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [activityAgg7, activityAgg30, moodAgg] = studentUserIds.length > 0
      ? await Promise.all([
          ActivityLog.aggregate([
            { $match: { userId: { $in: studentUserIds }, createdAt: { $gte: sevenDaysAgo } } },
            { $group: { _id: '$userId', totalMinutes: { $sum: { $ifNull: ['$duration', 0] } } } }
          ]),
          ActivityLog.aggregate([
            { $match: { userId: { $in: studentUserIds }, createdAt: { $gte: thirtyDaysAgo } } },
            { $group: { _id: '$userId', activityCount: { $sum: 1 } } }
          ]),
          MoodLog.aggregate([
            { $match: { userId: { $in: studentUserIds }, createdAt: { $gte: sevenDaysAgo } } },
            { $group: { _id: '$userId', avgMood: { $avg: { $ifNull: ['$score', 3] } } } }
          ])
        ])
      : [[], []];

    const activityMap = new Map(
      (activityAgg7 || []).map((entry) => [entry._id.toString(), entry.totalMinutes || 0])
    );
    const activityCountMap = new Map(
      (activityAgg30 || []).map((entry) => [entry._id.toString(), entry.activityCount || 0])
    );
    const moodMap = new Map(
      (moodAgg || []).map((entry) => [entry._id.toString(), entry.avgMood])
    );
    const hasActivityData = (activityAgg30 || []).length > 0;

    // Fetch parent data for all students, checking both SchoolStudent.parentIds and User.linkedIds.parentIds
    let filteredStudents = await Promise.all(students.map(async (s) => {
      let parents = [];
      
      // First, try to get parents from SchoolStudent.parentIds (if populated)
      if (Array.isArray(s.parentIds) && s.parentIds.length > 0) {
        parents = s.parentIds
          .filter(p => p && typeof p === 'object' && p._id) // Check if populated
          .map(p => ({
            _id: p._id,
            name: p.name || 'N/A',
            email: p.email || 'N/A',
            phone: p.phone || 'N/A',
            avatar: p.avatar
          }));
      }
      
      // If no parents found in SchoolStudent, check User's linkedIds.parentIds
      if (parents.length === 0 && s.userId?.linkedIds?.parentIds && s.userId.linkedIds.parentIds.length > 0) {
        const parentUsers = await User.find({
          _id: { $in: s.userId.linkedIds.parentIds }
        }).select('name email phone avatar').lean();
        
        parents = parentUsers.map(p => ({
          _id: p._id,
          name: p.name || 'N/A',
          email: p.email || 'N/A',
          phone: p.phone || 'N/A',
          avatar: p.avatar
        }));
      }
      
      const totalMinutes = activityMap.get(s.userId?._id?.toString()) || 0;
      const avgMood = moodMap.get(s.userId?._id?.toString()) ?? 3;
      const wellbeingFlags = s.wellbeingFlags || [];
      const activeWellbeingFlags = wellbeingFlags.filter(
        (flag) => flag.status !== 'resolved'
      );
      const hasHighSeverityOpenFlag = activeWellbeingFlags.some(
        (flag) => flag.severity === 'high'
      );
      const counselorFlag = Boolean(s.userId?.flaggedForCounselor);
      const lowEngagement = totalMinutes < 15;
      const lowMood = avgMood < 2.0;
      const riskSignals = [hasHighSeverityOpenFlag, counselorFlag, lowEngagement, lowMood].filter(Boolean).length;
      const highRisk = hasHighSeverityOpenFlag || (lowEngagement && lowMood);
      const flagged = activeWellbeingFlags.length > 0 || counselorFlag;

      const activityCount = activityCountMap.get(s.userId?._id?.toString()) || 0;
      const isActive = hasActivityData
        ? activityCount > 0
        : s.userId?.lastActive
          ? s.userId.lastActive >= thirtyDaysAgo
          : false;

      return {
        ...s.toObject(),
        _id: s._id,
        name: s.userId?.name || 'N/A',
        email: s.userId?.email || 'N/A',
        phone: s.userId?.phone || 'N/A',
        gender: s.personalInfo?.gender || s.userId?.gender || 'N/A',
        rollNumber: s.rollNumber || 'N/A',
        section: s.section || 'A',
        grade: s.classId?.classNumber || 0,
        lastActive: s.userId?.lastActive || null,
        isActive,
        avgScore: Math.round(
          ((s.pillars?.uvls || 0) + (s.pillars?.dcos || 0) + (s.pillars?.moral || 0) + (s.pillars?.ehe || 0) + (s.pillars?.crgc || 0)) / 5
        ),
        totalMinutes,
        avgMood,
        flagged,
        riskSignals,
        highRisk,
        parents: parents,
      };
    }));

    if (status === 'active') {
      filteredStudents = filteredStudents.filter(s => s.isActive);
    } else if (status === 'inactive') {
      filteredStudents = filteredStudents.filter(s => !s.isActive);
    } else if (status === 'flagged') {
      filteredStudents = filteredStudents.filter(s => s.flagged);
    } else if (status === 'at-risk') {
      filteredStudents = filteredStudents.filter(s => s.highRisk);
    }

    res.json({
      success: true,
      students: filteredStudents,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get admin student statistics
export const getAdminStudentStats = async (req, res) => {
  try {
    const { tenantId } = req;

    const total = await SchoolStudent.countDocuments({ tenantId });
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const studentIds = await SchoolStudent.find({ tenantId }).distinct('userId');
    const activityAgg = await ActivityLog.aggregate([
      { $match: { userId: { $in: studentIds }, createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: '$userId' } }
    ]);
    const hasActivityData = activityAgg.length > 0;
    const active = hasActivityData
      ? activityAgg.length
      : await User.countDocuments({
          _id: { $in: studentIds },
          lastActive: { $gte: thirtyDaysAgo }
        });

    const [flaggedFlags, flaggedCounselor] = await Promise.all([
      SchoolStudent.countDocuments({ tenantId, 'wellbeingFlags.0': { $exists: true } }),
      User.countDocuments({ tenantId, role: 'school_student', flaggedForCounselor: true })
    ]);

    res.json({
      total,
      active,
      flagged: flaggedFlags + flaggedCounselor,
      inactive: total - active,
    });
  } catch (error) {
    console.error('Error fetching student stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new student
export const createStudent = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { name, email, phone, password, gender, dateOfBirth } = req.body;

    if (!name || !email || !phone || !password || !gender || !dateOfBirth) {
      return res.status(400).json({ message: 'Missing required fields: name, email, phone, gender, dateOfBirth, and password are required' });
    }

    // Validate date of birth
    const dob = new Date(dateOfBirth);
    const today = new Date();
    if (dob >= today) {
      return res.status(400).json({ message: 'Date of birth cannot be in the future' });
    }

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Enforce student quota based on company academic info
    if (orgId) {
      const company = await Company.findOne({ organizations: orgId }).lean();
      const studentLimit = Number(company?.academicInfo?.totalStudents) || 0;
      if (studentLimit > 0) {
        const currentStudents = await SchoolStudent.countDocuments({ orgId });
        if (currentStudents >= studentLimit) {
          return res.status(403).json({
            success: false,
            message: `Student limit reached. You can onboard up to ${studentLimit} students as per the approved registration details.`
          });
        }
      }
    }

    // Generate admission number (unique)
    const currentYear = new Date().getFullYear();
    const admissionNumber = `ADM${currentYear}${Date.now().toString().slice(-6)}`;

    // Get current academic year
    const academicYear = `${currentYear}-${currentYear + 1}`;

    // Generate roll number (unique)
    const rollNumber = `ROLL${Date.now().toString().slice(-6)}`;

    // Check if student with roll number already exists
    const existingStudent = await SchoolStudent.findOne({ tenantId, rollNumber });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this roll number already exists' });
    }

    // No automatic class assignment - students will be assigned to classes later by admin
    const classId = null;
    const grade = null;
    const section = null;

    // Create user account with provided password
    const bcrypt = (await import('bcryptjs')).default;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('Creating student with:', {
      name,
      email,
      password: password.substring(0, 3) + '***', // Only show first 3 chars for security
      hashedPassword: hashedPassword.substring(0, 20) + '...', // Show first 20 chars of hash
      role: 'school_student',
      tenantId,
      orgId
    });
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'school_student',
      tenantId,
      orgId,
      phone,
      gender,
      dateOfBirth: new Date(dateOfBirth),
    });
    
    console.log('Student created successfully:', {
      id: user._id,
      email: user.email,
      role: user.role,
      hasPassword: !!user.password
    });

    // Create student profile
    const student = await SchoolStudent.create({
      tenantId,
      orgId,
      userId: user._id,
      admissionNumber,
      rollNumber,
      classId: classId, // null - will be assigned later by admin
      section: section, // null - will be assigned later by admin
      academicYear,
      parentIds: [], // Empty array - parents will link themselves later
      personalInfo: {
        dateOfBirth: new Date(dateOfBirth),
        gender: gender,
        bloodGroup: null,
      },
      academicInfo: {
        admissionDate: new Date(),
        previousSchool: null,
        tcNumber: null,
        subjects: []
      },
      fees: {
        totalFees: 0,
        paidAmount: 0,
        pendingAmount: 0
      },
      attendance: {
        totalDays: 0,
        presentDays: 0,
        percentage: 0
      },
      isActive: true,
      wellbeingFlags: [],
      pillars: {
        uvls: 0,
        dcos: 0,
        moral: 0,
        ehe: 0,
        crgc: 0,
      },
    });

    if (orgId && tenantId) {
      try {
        const subscription = await Subscription.findOne({ orgId, tenantId });
        const planName = subscription?.plan?.name || subscription?.plan?.planType || null;
        if (subscription && subscription.status === 'active' && planName === EDUCATIONAL_PLAN_TYPE) {
          const assignedSubscription = await assignUserSubscription({
            userId: user._id,
            planType: EDUCATIONAL_PLAN_TYPE,
            planName: EDUCATIONAL_PLAN_NAME,
            features: EDUCATIONAL_PLAN_FEATURES,
            amount: 0,
            startDate: new Date(),
            endDate: subscription.endDate ? new Date(subscription.endDate) : undefined,
            metadata: {
              orgId: orgId?.toString?.() ?? null,
              tenantId,
              source: 'school_student_creation',
              studentRecordId: student?._id?.toString?.() ?? null,
            },
            initiator: {
              userId: req.user?._id || null,
              role: req.user?.role || 'school_admin',
              name: req.user?.name || 'School Admin',
              email: req.user?.email || null,
              context: 'school_admin',
            },
          });
          const io = req.app && typeof req.app.get === 'function' ? req.app.get('io') : null;
          if (io && assignedSubscription) {
            const payload = assignedSubscription.toObject ? assignedSubscription.toObject() : assignedSubscription;
            io.to(user._id.toString()).emit('subscription:activated', {
              userId: user._id.toString(),
              subscription: payload,
            });
          }
        }
      } catch (assignmentError) {
        console.error('Error assigning subscription to student:', assignmentError);
      }
    }

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'student_created',
      targetType: 'student',
      targetId: student._id,
      targetName: name,
      description: `New student ${name} (${rollNumber}) created - class assignment pending`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Emit socket events for realtime dashboard updates
    const io = req.app?.get('io');
    if (io && tenantId) {
      // Emit student update event
      io.to(`school-admin-dashboard:${tenantId}`).emit('school:students:updated', {
        studentId: student._id,
        action: 'created',
        tenantId,
        timestamp: new Date()
      });
      
      // Emit general dashboard update
      io.to(`school-admin-dashboard:${tenantId}`).emit('school-admin:dashboard:update', {
        type: 'student_created',
        timestamp: new Date()
      });
      
      // Emit activity update
      io.to(`school-admin-dashboard:${tenantId}`).emit('school:activity:new', {
        type: 'student_created',
        studentName: name,
        tenantId,
        timestamp: new Date()
      });

      // Emit campus statistics update if student has campusId
      if (student.campusId) {
        io.to(`school-admin-dashboard:${tenantId}`).emit('school:campus:stats:updated', {
          campusId: student.campusId,
          tenantId,
          timestamp: new Date()
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Student account created successfully - class assignment pending',
      student: {
        _id: student._id,
        name,
        email,
        rollNumber,
        admissionNumber,
        grade: null, // No class assigned yet
        section: null, // No class assigned yet
        academicYear,
        gender
      },
      loginCredentials: {
        email,
        note: 'Student can now login using their email and the password provided'
      }
    });
  } catch (error) {
    console.error('Error creating student:', error);
    console.error('Error details:', error.message);
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reset student password
export const resetStudentPassword = async (req, res) => {
  try {
    const { tenantId } = req;
    const { studentId } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Find the student
    const student = await SchoolStudent.findOne({ _id: studentId, tenantId })
      .populate('userId', 'name email');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const userId = student.userId?._id;
    if (!userId) {
      return res.status(400).json({ message: 'No user account found for this student' });
    }

    // Hash new password
    const bcrypt = (await import('bcryptjs')).default;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await User.findByIdAndUpdate(userId, {
      password: hashedPassword
    });

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'password_changed',
      targetType: 'student',
      targetId: studentId,
      targetName: student.userId?.name || 'Unknown Student',
      description: `Password reset for student ${student.userId?.name} by admin`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Emit socket events for realtime updates
    const io = req.app?.get('io');
    if (io && tenantId) {
      io.to(`school-admin-dashboard:${tenantId}`).emit('school:students:updated', {
        studentId,
        action: 'password_reset',
        tenantId,
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const { tenantId } = req;
    const { studentId } = req.params;

    // Find the student and populate user data
    const student = await SchoolStudent.findOne({ _id: studentId, tenantId })
      .populate('userId', 'name email');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const studentName = student.userId?.name || 'Unknown Student';
    const rollNumber = student.rollNumber;
    const userId = student.userId?._id;

    // Store campusId before deletion for stats update
    const studentCampusId = student.campusId;

    // Delete the student profile (using proper query with tenantId)
    await SchoolStudent.findOneAndDelete({ _id: studentId, tenantId });

    // Delete the associated user account
    if (userId) {
      await User.findByIdAndDelete(userId);
    }

    // Delete associated parent placeholder accounts
    if (student.parentIds && student.parentIds.length > 0) {
      for (const parentId of student.parentIds) {
        const parent = await User.findById(parentId);
        // Only delete if it's a placeholder parent (email contains @temp.school)
        if (parent && parent.email.includes('@temp.school')) {
          await User.findByIdAndDelete(parentId);
        }
      }
    }

    // Log audit
    await ComplianceAuditLog.logAction({
      tenantId,
      orgId: req.user?.orgId,
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name,
      action: 'student_deleted',
      targetType: 'student',
      targetId: studentId,
      targetName: studentName,
      description: `Student ${studentName} (${rollNumber}) permanently deleted`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Emit socket events for realtime updates
    const io = req.app?.get('io');
    if (io && tenantId) {
      // Emit student removed event
      io.to(`school-admin-dashboard:${tenantId}`).emit('school:students:removed', {
        studentId,
        studentName,
        tenantId,
        timestamp: new Date()
      });
      
      // Also emit general update
      io.to(`school-admin-dashboard:${tenantId}`).emit('school:students:updated', {
        studentId,
        action: 'deleted',
        tenantId,
        timestamp: new Date()
      });
      
      // Emit dashboard update
      io.to(`school-admin-dashboard:${tenantId}`).emit('school-admin:dashboard:update', {
        type: 'student_deleted',
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Sync gender for existing students
export const syncStudentGender = async (req, res) => {
  try {
    const { tenantId } = req;
    let updated = 0;
    let skipped = 0;

    // Get all school students
    const students = await SchoolStudent.find({ tenantId }).populate('userId');
    
    for (const student of students) {
      if (student.userId) {
        // Check if user has gender
        if (!student.userId.gender && student.personalInfo?.gender) {
          // Update user with gender from SchoolStudent
          await User.findByIdAndUpdate(student.userId._id, {
            gender: student.personalInfo.gender
          });
          updated++;
        } else {
          // Check if SchoolStudent needs gender from User
          if (!student.personalInfo?.gender && student.userId.gender) {
            // Update SchoolStudent with gender from User
            student.personalInfo = student.personalInfo || {};
            student.personalInfo.gender = student.userId.gender;
            await student.save();
            updated++;
          } else if (student.userId.gender || student.personalInfo?.gender) {
            skipped++;
          }
        }
      }
    }

    res.json({
      success: true,
      message: `Gender synced successfully. ${updated} records updated, ${skipped} already had gender`,
      updated,
      skipped
    });
  } catch (error) {
    console.error('Error syncing gender:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get individual student details (School Admin)
export const getSchoolStudentDetails = async (req, res) => {
  try {
    const { tenantId } = req;
    const { studentId } = req.params;

    const student = await SchoolStudent.findOne({ _id: studentId, tenantId })
      .populate('userId', 'name email phone gender dateOfBirth lastActive linkedIds')
      .populate('classId', 'classNumber stream')
      .populate('parentIds', 'name email phone avatar')
      .lean(); // Use lean() to get plain JavaScript object

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Fetch parents from both sources
    let parents = [];
    
    // First, try to get parents from SchoolStudent.parentIds (if populated)
    if (Array.isArray(student.parentIds) && student.parentIds.length > 0) {
      parents = student.parentIds
        .filter(p => p && typeof p === 'object' && p._id)
        .map(p => ({
          _id: p._id,
          name: p.name || 'N/A',
          email: p.email || 'N/A',
          phone: p.phone || 'N/A',
          avatar: p.avatar
        }));
    }
    
    // If no parents found in SchoolStudent, check User's linkedIds.parentIds
    if (parents.length === 0 && student.userId?.linkedIds?.parentIds && student.userId.linkedIds.parentIds.length > 0) {
      const parentUsers = await User.find({
        _id: { $in: student.userId.linkedIds.parentIds }
      }).select('name email phone avatar').lean();
      
      parents = parentUsers.map(p => ({
        _id: p._id,
        name: p.name || 'N/A',
        email: p.email || 'N/A',
        phone: p.phone || 'N/A',
        avatar: p.avatar
      }));
    }

    // Get pillars data directly from student document
    const pillarsData = student.pillars || {
      uvls: 0,
      dcos: 0,
      moral: 0,
      ehe: 0,
      crgc: 0
    };

    // Extract userId as string (important for frontend API calls)
    const userIdString = student.userId?._id?.toString() || student.userId?.toString() || null;

    const studentData = {
      ...student,
      _id: student._id,
      userId: userIdString, // Include userId as string for frontend to fetch real-time data
      name: student.userId?.name || 'N/A',
      email: student.userId?.email || 'N/A',
      phone: student.userId?.phone || 'N/A',
      gender: student.personalInfo?.gender || student.userId?.gender || 'N/A',
      rollNumber: student.rollNumber || 'N/A',
      section: student.section || 'A',
      lastActive: student.userId?.lastActive || null,
      isActive: student.userId?.lastActive ? student.userId.lastActive >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : false,
      grade: student.classId?.classNumber || 'N/A',
      class: student.classId ? `Class ${student.classId.classNumber}${student.classId.stream ? ` - ${student.classId.stream}` : ''}` : 'N/A',
      attendance: {
        percentage: student.attendance?.percentage || 0,
        presentDays: student.attendance?.presentDays || 0,
        totalDays: student.attendance?.totalDays || 0
      },
      pillars: {
        uvls: pillarsData.uvls || 0,
        dcos: pillarsData.dcos || 0,
        moral: pillarsData.moral || 0,
        ehe: pillarsData.ehe || 0,
        crgc: pillarsData.crgc || 0
      },
      avgScore: Math.round(
        ((pillarsData.uvls || 0) + (pillarsData.dcos || 0) + (pillarsData.moral || 0) + (pillarsData.ehe || 0) + (pillarsData.crgc || 0)) / 5
      ),
      wellbeingFlags: student.wellbeingFlags || [],
      parents: parents,
    };

    res.json({
      success: true,
      student: studentData,
    });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export students
export const exportStudents = async (req, res) => {
  try {
    const { tenantId } = req;
    const { format = 'csv', grade, section, status } = req.query;

    const filter = { tenantId };
    if (grade && grade !== 'all') filter.grade = parseInt(grade);
    if (section && section !== 'all') filter.section = section;

    const students = await SchoolStudent.find(filter)
      .populate('userId', 'name email lastActive')
      .sort({ grade: 1, section: 1, rollNumber: 1 });

    let filteredStudents = students.map(s => ({
      name: s.userId?.name || s.name,
      email: s.userId?.email || s.email,
      rollNumber: s.rollNumber,
      grade: s.grade,
      section: s.section,
      phone: s.phone,
      isActive: s.userId?.lastActive >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      avgScore: Math.round(
        ((s.pillars?.uvls || 0) + (s.pillars?.dcos || 0) + (s.pillars?.moral || 0) + (s.pillars?.ehe || 0) + (s.pillars?.crgc || 0)) / 5
      ),
      attendance: s.attendance?.percentage || 0,
      lastActive: s.userId?.lastActive || s.lastActive,
    }));

    if (status === 'active') {
      filteredStudents = filteredStudents.filter(s => s.isActive);
    } else if (status === 'inactive') {
      filteredStudents = filteredStudents.filter(s => !s.isActive);
    } else if (status === 'flagged') {
      filteredStudents = filteredStudents.filter(s => s.wellbeingFlags?.length > 0);
    }

    if (format === 'csv') {
      const csvHeaders = 'Name,Email,Roll Number,Grade,Section,Phone,Avg Score,Attendance,Status,Last Active\n';
      const csvRows = filteredStudents.map(s =>
        [
          `"${s.name}"`,
          s.email,
          s.rollNumber,
          s.grade,
          s.section,
          s.phone || '',
          s.avgScore,
          s.attendance,
          s.isActive ? 'Active' : 'Inactive',
          s.lastActive ? new Date(s.lastActive).toLocaleDateString() : 'Never',
        ].join(',')
      ).join('\n');

      const csv = csvHeaders + csvRows;
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=students-export-${Date.now()}.csv`);
      res.send(csv);
    } else {
      res.json({
        success: true,
        students: filteredStudents,
        count: filteredStudents.length,
      });
    }
  } catch (error) {
    console.error('Error exporting students:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get engagement trend
export const getEngagementTrend = async (req, res) => {
  try {
    const { tenantId } = req;
    const { days = 7 } = req.query;

    const daysNum = Math.max(parseInt(days, 10) || 7, 1);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (daysNum - 1));
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const [studentUsers, teacherUsers] = await Promise.all([
      User.find({ tenantId, role: { $in: ['student', 'school_student'] } }).select('_id').lean(),
      User.find({ tenantId, role: 'school_teacher' }).select('_id').lean()
    ]);

    const studentIds = studentUsers.map((u) => u._id);
    const teacherIds = teacherUsers.map((u) => u._id);

    const aggregateEngagement = async (userIds) => {
      if (!userIds.length) return new Map();
      const results = await ActivityLog.aggregate([
        {
          $match: {
            userId: { $in: userIds }
          }
        },
        {
          $addFields: {
            activityDate: { $ifNull: ['$timestamp', '$createdAt'] }
          }
        },
        {
          $match: {
            activityDate: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              date: {
                $dateToString: { format: '%Y-%m-%d', date: '$activityDate' }
              },
              userId: '$userId'
            }
          }
        },
        {
          $group: {
            _id: '$_id.date',
            users: { $sum: 1 }
          }
        }
      ]);

      return new Map(results.map((row) => [row._id, row.users]));
    };

    const [studentEngagement, teacherEngagement] = await Promise.all([
      aggregateEngagement(studentIds),
      aggregateEngagement(teacherIds)
    ]);

    const trend = [];
    for (let i = 0; i < daysNum; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];

      trend.push({
        date: dateKey,
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        students: studentEngagement.get(dateKey) || 0,
        teachers: teacherEngagement.get(dateKey) || 0
      });
    }

    res.json({
      success: true,
      trend
    });
  } catch (error) {
    console.error('Error fetching engagement trend:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get performance by grade
export const getPerformanceByGrade = async (req, res) => {
  try {
    const { tenantId } = req;

    const students = await SchoolStudent.find({ tenantId, isActive: true })
      .populate('classId', 'classNumber')
      .select('userId classId')
      .lean();

    const gradeMap = new Map();
    const studentGradeMap = new Map();

    students.forEach((student) => {
      const gradeKey = student.classId?.classNumber;
      const userId = student.userId?.toString();
      if (!gradeKey || !userId) return;

      if (!gradeMap.has(gradeKey)) {
        gradeMap.set(gradeKey, {
          studentIds: new Set(),
          completedByPillar: {}
        });
      }
      gradeMap.get(gradeKey).studentIds.add(userId);
      studentGradeMap.set(userId, gradeKey);
    });

    if (gradeMap.size === 0) {
      return res.json({
        success: true,
        grades: []
      });
    }

    const pillarGameCounts = await getAllPillarGameCounts(UnifiedGameProgress);
    const pillarKeys = [
      'finance',
      'brain',
      'uvls',
      'dcos',
      'moral',
      'ai',
      'health-male',
      'health-female',
      'ehe',
      'crgc',
      'sustainability'
    ];

    const mapGameTypeToPillarKey = (gameType) => {
      switch (gameType) {
        case 'finance':
        case 'financial':
          return 'finance';
        case 'brain':
        case 'mental':
          return 'brain';
        case 'uvls':
          return 'uvls';
        case 'dcos':
          return 'dcos';
        case 'moral':
          return 'moral';
        case 'ai':
          return 'ai';
        case 'health-male':
          return 'health-male';
        case 'health-female':
          return 'health-female';
        case 'ehe':
          return 'ehe';
        case 'crgc':
        case 'civic-responsibility':
          return 'crgc';
        case 'sustainability':
          return 'sustainability';
        default:
          return null;
      }
    };

    const getProgressPercent = (game) => {
      if (game?.fullyCompleted) return 100;
      if (game?.totalLevels > 0) {
        return Math.round(((game.levelsCompleted || 0) / game.totalLevels) * 100);
      }
      if (game?.maxScore > 0) {
        return Math.round(((game.highestScore || 0) / game.maxScore) * 100);
      }
      return 0;
    };

    const allStudentIds = Array.from(studentGradeMap.keys());
    const gameProgress = await UnifiedGameProgress.find({
      userId: { $in: allStudentIds }
    }).lean();

    gameProgress.forEach((game) => {
      const userId = game.userId?.toString();
      const gradeKey = studentGradeMap.get(userId);
      if (!gradeKey) return;
      const pillarKey = mapGameTypeToPillarKey(game.gameType);
      if (!pillarKey) return;

      if (getProgressPercent(game) < 100) return;
      const gradeEntry = gradeMap.get(gradeKey);
      if (!gradeEntry.completedByPillar[pillarKey]) {
        gradeEntry.completedByPillar[pillarKey] = 0;
      }
      gradeEntry.completedByPillar[pillarKey] += 1;
    });

    const gradesData = Array.from(gradeMap.entries()).map(([grade, data]) => {
      const studentCount = data.studentIds.size;
      const pillarPercentages = {};
      const pillarValues = pillarKeys.map((pillar) => {
        const totalGames = pillarGameCounts[pillar] || 0;
        const completed = data.completedByPillar[pillar] || 0;
        const denominator = totalGames * studentCount;
        const percent = denominator > 0 ? (completed / denominator) * 100 : 0;
        pillarPercentages[pillar] = Math.round(percent);
        return totalGames > 0 ? percent : null;
      }).filter((value) => value !== null);

      const avgScore = pillarValues.length > 0
        ? Math.round(pillarValues.reduce((sum, value) => sum + value, 0) / pillarValues.length)
        : 0;

      return {
        grade,
        studentCount,
        avgScore,
        pillars: pillarPercentages
      };
    }).sort((a, b) => a.grade - b.grade);

    res.json({
      success: true,
      grades: gradesData
    });
  } catch (error) {
    console.error('Error fetching performance by grade:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export analytics report
export const exportAnalyticsReport = async (req, res) => {
  try {
    const { tenantId } = req;
    const { campusId, grade, timeRange, format = 'csv' } = req.query;

    const filter = { tenantId, isActive: true };
    if (campusId && campusId !== 'all') filter.campusId = campusId;
    let gradeClassIds = null;
    if (grade && grade !== 'all') {
      const gradeClasses = await SchoolClass.find({
        tenantId,
        classNumber: parseInt(grade, 10)
      }).select('_id').lean();
      gradeClassIds = gradeClasses.map((cls) => cls._id);
      if (gradeClassIds.length > 0) {
        filter.classId = { $in: gradeClassIds };
      } else {
        filter.classId = { $in: [] };
      }
    }

    // Fetch comprehensive analytics data
    const [students, wellbeing, adoption, teachers] = await Promise.all([
      SchoolStudent.find(filter).select('userId').lean(),
      SchoolStudent.aggregate([
        { $match: filter },
        { $unwind: '$wellbeingFlags' },
        {
          $group: {
            _id: '$wellbeingFlags.status',
            count: { $sum: 1 }
          }
        }
      ]),
      SchoolStudent.find(filter).populate('userId').then(students =>
        students.filter(s => s.userId?.lastActive >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length
      ),
      User.countDocuments({ tenantId, role: 'school_teacher' })
    ]);

    const studentIds = students.map((s) => s.userId).filter(Boolean);
    const pillarGameCounts = await getAllPillarGameCounts(UnifiedGameProgress);
    const pillarKeys = [
      'finance',
      'brain',
      'uvls',
      'dcos',
      'moral',
      'ai',
      'health-male',
      'health-female',
      'ehe',
      'crgc',
      'sustainability'
    ];

    const mapGameTypeToPillarKey = (gameType) => {
      switch (gameType) {
        case 'finance':
        case 'financial':
          return 'finance';
        case 'brain':
        case 'mental':
          return 'brain';
        case 'uvls':
          return 'uvls';
        case 'dcos':
          return 'dcos';
        case 'moral':
          return 'moral';
        case 'ai':
          return 'ai';
        case 'health-male':
          return 'health-male';
        case 'health-female':
          return 'health-female';
        case 'ehe':
          return 'ehe';
        case 'crgc':
        case 'civic-responsibility':
          return 'crgc';
        case 'sustainability':
          return 'sustainability';
        default:
          return null;
      }
    };

    const getProgressPercent = (game) => {
      if (game?.fullyCompleted) return 100;
      if (game?.totalLevels > 0) {
        return Math.round(((game.levelsCompleted || 0) / game.totalLevels) * 100);
      }
      if (game?.maxScore > 0) {
        return Math.round(((game.highestScore || 0) / game.maxScore) * 100);
      }
      return 0;
    };

    const totals = pillarKeys.reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {});

    const gameProgressAll = studentIds.length > 0 ? await UnifiedGameProgress.find({
      userId: { $in: studentIds }
    }).lean() : [];

    gameProgressAll.forEach((game) => {
      const pillarKey = mapGameTypeToPillarKey(game.gameType);
      if (!pillarKey) return;
      if (getProgressPercent(game) < 100) return;
      totals[pillarKey] += 1;
    });

    const totalStudents = studentIds.length;
    const pillars = pillarKeys.reduce((acc, key) => {
      const totalGames = pillarGameCounts[key] || 0;
      const denominator = totalGames * totalStudents;
      acc[key] = denominator > 0 ? Math.round((totals[key] / denominator) * 100) : 0;
      return acc;
    }, {});

    const pillarValues = pillarKeys
      .map((key) => (pillarGameCounts[key] ? pillars[key] : null))
      .filter((value) => value !== null);
    const avgPillarScore = pillarValues.length > 0
      ? Math.round(pillarValues.reduce((sum, value) => sum + value, 0) / pillarValues.length)
      : 0;

    const timeRangeToDays = (range) => {
      switch (range) {
        case 'week':
          return 7;
        case 'month':
          return 30;
        case 'semester':
          return 180;
        case 'year':
          return 365;
        default:
          return 30;
      }
    };

    const daysNum = timeRangeToDays(timeRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (daysNum - 1));
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const aggregateEngagement = async (userIds) => {
      if (!userIds.length) return new Map();
      const results = await ActivityLog.aggregate([
        { $match: { userId: { $in: userIds } } },
        { $addFields: { activityDate: { $ifNull: ['$timestamp', '$createdAt'] } } },
        { $match: { activityDate: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: { date: { $dateToString: { format: '%Y-%m-%d', date: '$activityDate' } }, userId: '$userId' } } },
        { $group: { _id: '$_id.date', users: { $sum: 1 } } }
      ]);
      return new Map(results.map((row) => [row._id, row.users]));
    };

    const teacherIds = await User.find({ tenantId, role: 'school_teacher' }).distinct('_id');
    const [studentEngagement, teacherEngagement] = await Promise.all([
      aggregateEngagement(studentIds),
      aggregateEngagement(teacherIds)
    ]);

    const engagementTrend = [];
    for (let i = 0; i < daysNum; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      engagementTrend.push({
        date: dateKey,
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        students: studentEngagement.get(dateKey) || 0,
        teachers: teacherEngagement.get(dateKey) || 0
      });
    }

    const studentsWithClasses = await SchoolStudent.find(filter)
      .populate('classId', 'classNumber')
      .select('userId classId')
      .lean();

    const gradeMap = new Map();
    const studentGradeMap = new Map();

    studentsWithClasses.forEach((student) => {
      const gradeKey = student.classId?.classNumber;
      const userId = student.userId?.toString();
      if (!gradeKey || !userId) return;

      if (!gradeMap.has(gradeKey)) {
        gradeMap.set(gradeKey, {
          studentIds: new Set(),
          completedByPillar: {}
        });
      }
      gradeMap.get(gradeKey).studentIds.add(userId);
      studentGradeMap.set(userId, gradeKey);
    });

    if (gradeMap.size > 0) {
      gameProgressAll.forEach((game) => {
        const userId = game.userId?.toString();
        const gradeKey = studentGradeMap.get(userId);
        if (!gradeKey) return;
        const pillarKey = mapGameTypeToPillarKey(game.gameType);
        if (!pillarKey) return;
        if (getProgressPercent(game) < 100) return;

        const gradeEntry = gradeMap.get(gradeKey);
        if (!gradeEntry.completedByPillar[pillarKey]) {
          gradeEntry.completedByPillar[pillarKey] = 0;
        }
        gradeEntry.completedByPillar[pillarKey] += 1;
      });
    }

    const performanceByGrade = Array.from(gradeMap.entries()).map(([gradeKey, data]) => {
      const studentCount = data.studentIds.size;
      const pillarValuesForGrade = pillarKeys.map((pillar) => {
        const totalGames = pillarGameCounts[pillar] || 0;
        const completed = data.completedByPillar[pillar] || 0;
        const denominator = totalGames * studentCount;
        const percent = denominator > 0 ? (completed / denominator) * 100 : 0;
        return totalGames > 0 ? percent : null;
      }).filter((value) => value !== null);

      const avgScore = pillarValuesForGrade.length > 0
        ? Math.round(pillarValuesForGrade.reduce((sum, value) => sum + value, 0) / pillarValuesForGrade.length)
        : 0;

      return {
        grade: gradeKey,
        studentCount,
        avgScore
      };
    }).sort((a, b) => a.grade - b.grade);

    const topPerformerFilter = { tenantId };
    if (campusId && campusId !== 'all') topPerformerFilter.campusId = campusId;
    if (gradeClassIds) {
      topPerformerFilter.classId = gradeClassIds.length > 0 ? { $in: gradeClassIds } : { $in: [] };
    }

    const topPerformerStudents = await SchoolStudent.find(topPerformerFilter)
      .populate('classId', 'classNumber')
      .populate('userId', 'name avatar')
      .select('userId classId section grade')
      .lean();

    const topPerformerIds = topPerformerStudents
      .map((student) => student.userId?._id)
      .filter(Boolean);
    const topPerformerProgress = topPerformerIds.length > 0 ? await UnifiedGameProgress.find({
      userId: { $in: topPerformerIds }
    }).lean() : [];

    const completedByStudent = new Map();
    topPerformerStudents.forEach((student) => {
      const userId = student.userId?._id?.toString();
      if (!userId) return;
      completedByStudent.set(
        userId,
        pillarKeys.reduce((acc, pillar) => {
          acc[pillar] = 0;
          return acc;
        }, {})
      );
    });

    topPerformerProgress.forEach((game) => {
      const userKey = game.userId?.toString();
      if (!userKey || !completedByStudent.has(userKey)) return;
      const pillarKey = mapGameTypeToPillarKey(game.gameType);
      if (!pillarKey) return;
      if (getProgressPercent(game) < 100) return;
      completedByStudent.get(userKey)[pillarKey] += 1;
    });

    const topPerformers = topPerformerStudents
      .map((student) => {
        const userId = student.userId?._id?.toString();
        if (!userId) return null;
        const completedCounts = completedByStudent.get(userId) || {};
        const pillarMasteryValues = pillarKeys
          .map((pillar) => {
            const totalGames = pillarGameCounts[pillar] || 0;
            if (totalGames === 0) return null;
            const completed = completedCounts[pillar] || 0;
            return Math.round((completed / totalGames) * 100);
          })
          .filter((value) => value !== null);
        const overallMastery = pillarMasteryValues.length > 0
          ? Math.round(pillarMasteryValues.reduce((sum, value) => sum + value, 0) / pillarMasteryValues.length)
          : 0;

        return {
          studentId: student._id,
          userId: student.userId?._id,
          name: student.userId?.name || 'Unknown',
          grade: student.classId?.classNumber || student.grade || 0,
          section: student.section || 'A',
          score: overallMastery
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    if (format === 'pdf') {
      const reportData = {
        generatedAt: new Date().toISOString(),
        timeRange: timeRange || 'All Time',
        summary: {
          totalStudents,
          activeStudents: adoption,
          adoptionRate: totalStudents > 0 ? parseFloat(((adoption / totalStudents) * 100).toFixed(2)) : 0,
          totalTeachers: teachers,
          avgPillarMastery: avgPillarScore,
          studentsAtRiskCount: 0
        },
        pillars,
        engagementTrend,
        performanceByGrade,
        topPerformers,
        wellbeing: wellbeing.reduce((acc, w) => {
          acc[w._id] = w.count;
          return acc;
        }, {})
      };

      const pdfBuffer = await buildSchoolAnalyticsPdf(reportData, {
        schoolName: req.user?.organization || req.user?.name
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=analytics-report-${Date.now()}.pdf`);
      return res.send(pdfBuffer);
    }

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=analytics-report-${Date.now()}.json`);
      return res.json({
        success: true,
        report: {
          generated: new Date(),
          timeRange: timeRange || 'All Time',
          filters: { campusId, grade },
          summary: {
            totalStudents,
            activeStudents: adoption,
            adoptionRate: totalStudents > 0 ? parseFloat(((adoption / totalStudents) * 100).toFixed(2)) : 0,
            totalTeachers: teachers,
            avgPillarMastery: avgPillarScore,
            studentsAtRiskCount: 0
          },
          pillars,
          engagementTrend,
          performanceByGrade,
          topPerformers,
          wellbeing: wellbeing.reduce((acc, w) => {
            acc[w._id] = w.count;
            return acc;
          }, {})
        }
      });
    }

    if (format === 'csv') {
      const csv = `School Analytics Report
Generated: ${new Date().toLocaleString()}
Time Range: ${timeRange || 'All Time'}
${campusId && campusId !== 'all' ? `Campus ID: ${campusId}` : 'All Campuses'}
${grade && grade !== 'all' ? `Grade: ${grade}` : 'All Grades'}

SUMMARY METRICS
Total Students,${totalStudents}
Active Students (30 days),${adoption}
Student Adoption Rate,${totalStudents > 0 ? ((adoption / totalStudents) * 100).toFixed(2) : 0}%
Total Teachers,${teachers}
Average Pillar Mastery,${avgPillarScore}%

PILLAR BREAKDOWN
${pillarKeys.map((key) => `${pillarLabelMap[key] || key},${Math.round(pillars[key] || 0)}%`).join('\n')}

WELLBEING CASES
${wellbeing.map(w => `${w._id},${w.count}`).join('\n')}
`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=analytics-report-${Date.now()}.csv`);
      res.send(csv);
      return;
    }

    res.status(400).json({ message: 'Unsupported export format' });
  } catch (error) {
    console.error('Error exporting analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get staff stats
export const getStaffStats = async (req, res) => {
  try {
    const { tenantId } = req;

    const [totalTeachers, activeToday, trainingData] = await Promise.all([
      User.countDocuments({ tenantId, role: 'school_teacher' }),
      User.countDocuments({
        tenantId,
        role: 'school_teacher',
        lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),
      User.find({ tenantId, role: 'school_teacher' }),
    ]);

    const completedTraining = trainingData.filter(t =>
      t.trainingModules?.every(m => m.completed)
    ).length;

    res.json({
      totalTeachers,
      activeToday,
      trainingComplete: totalTeachers > 0 ? Math.round((completedTraining / totalTeachers) * 100) : 0,
      pendingReviews: 0,
      active: activeToday,
    });
  } catch (error) {
    console.error('Error fetching staff stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============= ENHANCED BILLING & SUBSCRIPTION MANAGEMENT =============

// 1. Get enhanced subscription details with all features
export const getEnhancedSubscriptionDetails = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;

    if (!orgId) {
      return res.status(400).json({ message: 'Organization ID required' });
    }

    const normalizedOrgId = mongoose.Types.ObjectId.isValid(orgId)
      ? new mongoose.Types.ObjectId(orgId)
      : orgId;

    const owningCompany = await Company.findOne({ organizations: normalizedOrgId }).select(
      'subscriptionPlan subscriptionStart subscriptionExpiry academicInfo'
    );

    let subscription = await Subscription.findOne({ tenantId, orgId: normalizedOrgId });

    // Create default subscription if not exists
    if (!subscription) {
      const resolvedPlanName =
        owningCompany?.subscriptionPlan || determinePlanFromUsage();
      const resolvedLimits = resolvePlanLimits(resolvedPlanName);
      const resolvedFeatures = resolvePlanFeatures(resolvedPlanName);
      const planPrice = PLAN_LIMITS[resolvedPlanName]?.price || 0;

      subscription = await Subscription.create({
        tenantId,
        orgId: normalizedOrgId,
        plan: {
          name: resolvedPlanName,
          displayName: PLAN_DISPLAY_NAMES[resolvedPlanName] || `${capitalize(resolvedPlanName)} Plan`,
          price: planPrice,
          billingCycle: 'yearly',
        },
        limits: {
          ...resolvedLimits,
          features: resolvedFeatures,
        },
        status: 'active',
        startDate: owningCompany?.subscriptionStart || new Date(),
        endDate: owningCompany?.subscriptionExpiry || null,
        autoRenew: true,
      });
    }

    // Get current usage
    const [students, teachers, classes, campuses, templates, activeStudents, premiumTemplatesCount] = await Promise.all([
      SchoolStudent.countDocuments({ tenantId }),
      User.countDocuments({ tenantId, role: 'school_teacher' }),
      SchoolClass.countDocuments({ tenantId }),
      Organization.findOne({ _id: normalizedOrgId, tenantId }).then(org => org?.campuses?.length || 1),
      Template.countDocuments({ tenantId }),
      SchoolStudent.find({ tenantId }).populate('userId').then(students => 
        students.filter(s => s.userId && s.userId.lastActive >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length
      ),
      Template.countDocuments({ isPremium: true, isActive: true }),
    ]);

    subscription.usage = {
      students,
      teachers,
      classes,
      campuses,
      storage: 0,
      templates,
    };
    await subscription.save();

    // Calculate next billing date
    const nextBillingDate = subscription.endDate || null;

    // Get payment status
    const lastInvoice = subscription.invoices?.length > 0 
      ? subscription.invoices[subscription.invoices.length - 1]
      : null;

    // Calculate days remaining
    const daysRemaining = subscription.daysUntilExpiry();

    // Get available premium templates based on plan
    const availablePremiumTemplates = subscription.limits.features.premiumTemplates 
      ? premiumTemplatesCount 
      : 0;

    const allowedStudentCount = owningCompany?.academicInfo?.totalStudents ?? subscription.limits?.maxStudents ?? 0;
    const allowedTeacherCount = owningCompany?.academicInfo?.totalTeachers ?? subscription.limits?.maxTeachers ?? 0;
    const allowedClassCount = subscription.limits?.maxClasses ?? 0;
    const allowedCampusCount = subscription.limits?.maxCampuses ?? 0;

    const normalizeLimit = (value, fallback) => {
      const numeric = Number(value);
      if (!Number.isFinite(numeric) || numeric <= 0) return fallback;
      return numeric;
    };

    const studentLimitForPercent = normalizeLimit(allowedStudentCount, normalizeLimit(subscription.limits?.maxStudents, 1));
    const teacherLimitForPercent = normalizeLimit(allowedTeacherCount, normalizeLimit(subscription.limits?.maxTeachers, 1));
    const classLimitForPercent = normalizeLimit(allowedClassCount, normalizeLimit(subscription.limits?.maxClasses, 1));
    const campusLimitForPercent = normalizeLimit(allowedCampusCount, normalizeLimit(subscription.limits?.maxCampuses, 1));

    // Compute actual status based on endDate
    const actualStatus = subscription.getActualStatus ? subscription.getActualStatus() : subscription.status;
    
    // Calculate current cycle start date
    const getCurrentCycleStartDate = () => {
      if (subscription.lastRenewedAt) {
        return subscription.lastRenewedAt;
      }
      if (subscription.endDate) {
        const cycleMonths = subscription.plan?.billingCycle === 'yearly' ? 12 : 12;
        const cycleStart = new Date(subscription.endDate);
        cycleStart.setMonth(cycleStart.getMonth() - cycleMonths);
        return cycleStart;
      }
      return subscription.startDate || new Date();
    };
    
    const currentCycleStartDate = getCurrentCycleStartDate();
    
    res.json({
      subscription: {
        ...subscription.toObject ? subscription.toObject() : subscription,
        status: actualStatus, // Override with computed status
        currentCycleStartDate: currentCycleStartDate, // Add current cycle start date
      },
      enhancedDetails: {
        planName: subscription.plan.displayName,
        planType: subscription.plan.name,
        price: subscription.plan.price,
        billingCycle: subscription.plan.billingCycle,
        status: actualStatus, // Use computed status
        currentCycleStartDate: currentCycleStartDate, // Add current cycle start date
        nextBillingDate,
        daysRemaining,
        activeStudentCount: activeStudents,
        totalStudentCount: students,
        activeTeacherCount: teachers,
        features: subscription.limits.features,
        availablePremiumTemplates,
        usagePercentages: {
          students: ((students / studentLimitForPercent) * 100).toFixed(2),
          teachers: ((teachers / teacherLimitForPercent) * 100).toFixed(2),
          classes: ((classes / classLimitForPercent) * 100).toFixed(2),
          campuses: ((campuses / campusLimitForPercent) * 100).toFixed(2),
          templates: (subscription.limits.maxTemplates
            ? (templates / subscription.limits.maxTemplates * 100).toFixed(2)
            : '0.00'),
        },
        invoices: subscription.invoices || [],
        lastPaymentStatus: lastInvoice?.status || 'none',
        lastPaymentDate: lastInvoice?.paidAt || null,
        lastPaymentAmount: lastInvoice?.amount || 0,
        allowedStudentCount,
        allowedTeacherCount,
        allowedClassCount,
        allowedCampusCount,
      },
    });
  } catch (error) {
    console.error('Error fetching enhanced subscription:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. Get support tickets
export const getSupportTickets = async (req, res) => {
  try {
    const { tenantId } = req;
    const { status, type } = req.query;

    const filter = { tenantId };
    if (status) filter.status = status;
    if (type) filter.type = type;

    const tickets = await SupportTicket.find(filter)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    const stats = {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in_progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      pending: tickets.filter(t => t.approvalRequired && !t.approvedBy).length,
    };

    res.json({
      tickets,
      statistics: stats,
    });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// 5. Get invoice details
export const getInvoiceDetails = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { tenantId } = req;
    const orgId = req.user?.orgId;

    const subscription = await Subscription.findOne({ tenantId, orgId });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    const invoice = subscription.invoices.find(inv => inv.invoiceId === invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const organization = await Organization.findById(orgId);

    res.json({
      invoice,
      organization: {
        name: organization.name,
        address: organization.settings?.address,
        contactInfo: organization.settings?.contactInfo,
      },
      subscription: {
        planName: subscription.plan.displayName,
        billingCycle: subscription.plan.billingCycle,
      },
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 6. Update payment method
export const updatePaymentMethod = async (req, res) => {
  try {
    const { tenantId } = req;
    const orgId = req.user?.orgId;
    const { paymentMethod } = req.body;

    const subscription = await Subscription.findOne({ tenantId, orgId });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    subscription.paymentMethod = paymentMethod;
    await subscription.save();

    res.json({
      success: true,
      message: 'Payment method updated successfully',
      subscription,
    });
  } catch (error) {
    console.error('Error updating payment method:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 7. Get plan comparison
export const getPlanComparison = async (req, res) => {
  try {
    const plans = [
      {
        name: 'free',
        displayName: PLAN_DISPLAY_NAMES.free,
        price: 0,
        duration: 'Yearly',
        limits: {
          maxStudents: PLAN_LIMITS.free.maxStudents,
          maxTeachers: PLAN_LIMITS.free.maxTeachers,
          maxClasses: PLAN_LIMITS.free.maxClasses,
          maxCampuses: PLAN_LIMITS.free.maxCampuses,
          maxStorage: PLAN_LIMITS.free.maxStorage,
          maxTemplates: PLAN_LIMITS.free.maxTemplates,
        },
        features: {
          ...PLAN_FEATURES.free,
        },
      },
      {
        name: 'student_premium',
        displayName: PLAN_DISPLAY_NAMES.student_premium,
        price: PLAN_LIMITS.student_premium.price,
        duration: 'Yearly',
        limits: {
          maxStudents: PLAN_LIMITS.student_premium.maxStudents,
          maxTeachers: PLAN_LIMITS.student_premium.maxTeachers,
          maxClasses: PLAN_LIMITS.student_premium.maxClasses,
          maxCampuses: PLAN_LIMITS.student_premium.maxCampuses,
          maxStorage: PLAN_LIMITS.student_premium.maxStorage,
          maxTemplates: PLAN_LIMITS.student_premium.maxTemplates,
        },
        features: {
          ...PLAN_FEATURES.student_premium,
        },
      },
      {
        name: 'student_parent_premium_pro',
        displayName: PLAN_DISPLAY_NAMES.student_parent_premium_pro,
        price: PLAN_LIMITS.student_parent_premium_pro.price,
        duration: 'Yearly',
        limits: {
          maxStudents: PLAN_LIMITS.student_parent_premium_pro.maxStudents,
          maxTeachers: PLAN_LIMITS.student_parent_premium_pro.maxTeachers,
          maxClasses: PLAN_LIMITS.student_parent_premium_pro.maxClasses,
          maxCampuses: PLAN_LIMITS.student_parent_premium_pro.maxCampuses,
          maxStorage: PLAN_LIMITS.student_parent_premium_pro.maxStorage,
          maxTemplates: PLAN_LIMITS.student_parent_premium_pro.maxTemplates,
        },
        features: {
          ...PLAN_FEATURES.student_parent_premium_pro,
        },
      },
      {
        name: 'educational_institutions_premium',
        displayName: PLAN_DISPLAY_NAMES.educational_institutions_premium,
        price: PLAN_LIMITS.educational_institutions_premium.price,
        duration: 'Yearly',
        limits: {
          maxStudents: PLAN_LIMITS.educational_institutions_premium.maxStudents,
          maxTeachers: PLAN_LIMITS.educational_institutions_premium.maxTeachers,
          maxClasses: PLAN_LIMITS.educational_institutions_premium.maxClasses,
          maxCampuses: PLAN_LIMITS.educational_institutions_premium.maxCampuses,
          maxStorage: PLAN_LIMITS.educational_institutions_premium.maxStorage,
          maxTemplates: PLAN_LIMITS.educational_institutions_premium.maxTemplates,
        },
        features: {
          ...PLAN_FEATURES.educational_institutions_premium,
        },
      },
    ];

    res.json({ plans });
  } catch (error) {
    console.error('Error fetching plan comparison:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
