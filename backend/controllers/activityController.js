import ActivityLog from '../models/ActivityLog.js';
import User from '../models/User.js';
import GameProgress from '../models/GameProgress.js';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';
import Assignment from '../models/Assignment.js';
import AssignmentAttempt from '../models/AssignmentAttempt.js';
import Task from '../models/Task.js';
import TeacherChallenge from '../models/TeacherChallenge.js';
import TeacherActivity from '../models/TeacherActivity.js';
import SchoolStudent from '../models/School/SchoolStudent.js';
import { ErrorResponse } from '../utils/ErrorResponse.js';

// Log a new activity
export const logActivity = async (req, res, next) => {
  try {
    const { activityType, description, metadata, pageUrl } = req.body;
    const userId = req.user._id;

    if (!activityType) {
      throw new ErrorResponse('Activity type is required', 400);
    }

    const activityLog = await ActivityLog.create({
      userId,
      activityType,
      description: description || '', // Provide default empty string if description is not provided
      metadata: metadata || {},
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      pageUrl: pageUrl || req.headers.referer,
    });

    // Emit real-time notification to teacher if student has an assigned teacher
    const io = req.app.get('io');
    if (io) {
      // If the student has an assigned teacher, emit to that teacher's room
      if (req.user.linkedIds?.teacherIds?.length > 0) {
        req.user.linkedIds.teacherIds.forEach(teacherId => {
          // Emit legacy event for backward compatibility
          io.to(`teacher-${teacherId}`).emit('student-activity', {
            activityLog,
            user: {
              id: req.user._id,
              name: req.user.name,
              role: req.user.role,
            },
          });
          
          // Emit new event for teacher dashboard
          io.to(teacherId.toString()).emit('teacher:activity:update', {
            type: 'student_activity',
            activityLog,
            student: {
              id: req.user._id,
              name: req.user.name,
              role: req.user.role,
            },
            timestamp: new Date()
          });
        });
      }
      
      // Also emit to tenant room for broader updates
      const tenantId = req.user.tenantId || req.tenantId;
      if (tenantId) {
        io.to(tenantId).emit('teacher:activity:update', {
          type: 'student_activity',
          activityLog,
          student: {
            id: req.user._id,
            name: req.user.name,
            role: req.user.role,
          },
          timestamp: new Date()
        });
      }
    }

    res.status(201).json({
      success: true,
      data: activityLog,
    });
  } catch (err) {
    next(err);
  }
};

// Get activities for a specific user (for admin and s)
export const getUserActivities = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, activityType, limit = 50, page = 1 } = req.query;

    // Check if the user exists
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      throw new ErrorResponse('User not found', 404);
    }

    // Check if the requester has permission to view this user's activities
    if (req.user.role === 'parent') {
      const student = await User.findById(userId);
      if (!student || !student.linkedIds?.parentIds?.includes(req.user._id)) {
        throw new ErrorResponse('You do not have permission to view this student\'s activities', 403);
      }
    }

    // Build query
    const query = { userId };

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    if (activityType) {
      query.activityType = activityType;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const activities = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: activities.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
      data: activities,
    });
  } catch (err) {
    next(err);
  }
};

// Get my activities (for students to see their own activity)
export const getMyActivities = async (req, res, next) => {
  try {
    const { startDate, endDate, activityType, limit = 50, page = 1 } = req.query;

    // Build query
    const query = { userId: req.user._id };

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    if (activityType) {
      query.activityType = activityType;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const activities = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: activities.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
      data: activities,
    });
  } catch (err) {
    next(err);
  }
};

// Get activity summary for admin dashboard
export const getActivitySummary = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    // Get activity counts by type
    const activityCounts = await ActivityLog.aggregate([
      {
        $match: {
          timestamp: { $gte: daysAgo },
        },
      },
      {
        $group: {
          _id: '$activityType',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Get activity counts by day
    const activityByDay = await ActivityLog.aggregate([
      {
        $match: {
          timestamp: { $gte: daysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get most active users
    const mostActiveUsers = await ActivityLog.aggregate([
      {
        $match: {
          timestamp: { $gte: daysAgo },
        },
      },
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 1,
          count: 1,
          'user.name': 1,
          'user.username': 1,
          'user.role': 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        activityCounts,
        activityByDay,
        mostActiveUsers,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get real-time activity stream (for admin dashboard)
export const getActivityStream = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;

    const activities = await ActivityLog.find()
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'name username role');

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (err) {
    next(err);
  }
};

// Get student activity with filtering and time range
export const getStudentActivity = async (req, res, next) => {
  try {
    console.log('🔍 getStudentActivity called with:', {
      filter: req.query.filter,
      timeRange: req.query.timeRange,
      userId: req.user?._id,
      userRole: req.user?.role
    });

    const { filter = 'all', timeRange = 'week' } = req.query;
    const userId = req.user._id;
    const user = req.user;

    // Ensure user has required fields with proper validation
    if (!user) {
      console.error('❌ User object is null or undefined');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Get tenantId from request (set by tenant middleware) or user object
    const tenantId = req.tenantId || user.tenantId || 'default';
    console.log('🏢 Tenant ID:', {
      fromRequest: req.tenantId,
      fromUser: user.tenantId,
      final: tenantId
    });

    // Validate user role
    if (!user.role) {
      console.error('❌ User role is missing');
      return res.status(400).json({
        success: false,
        message: 'User role is required'
      });
    }

    // Calculate date range
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
      default:
        startDate = new Date(0); // Beginning of time
        break;
    }

    // Get student's class information
    let studentClass = null;
    let classId = null;

    if (user.role === 'school_student') {
      try {
        const schoolStudent = await SchoolStudent.findOne({ userId, tenantId }).populate('classId');
        if (schoolStudent) {
          studentClass = schoolStudent.classId;
          classId = schoolStudent.classId?._id;
          console.log('🎓 Student class info:', {
            studentId: userId,
            schoolStudentId: schoolStudent._id,
            classId: classId,
            className: schoolStudent.classId?.classNumber,
            tenantId: tenantId,
            schoolStudentTenantId: schoolStudent.tenantId
          });
        } else {
          console.log('⚠️ No school student record found for user:', userId);
        }
      } catch (classError) {
        console.error('❌ Error fetching student class info:', classError);
        // Continue without class info
      }
    } else {
      console.log('ℹ️ User is not a school student, skipping class lookup');
    }

    // Debug: Check if there are any assignments in the database
    try {
      const allAssignments = await Assignment.find({ tenantId: tenantId }).limit(5);
      console.log('🔍 Debug - All assignments in tenant:', {
        tenantId: tenantId,
        count: allAssignments.length,
        assignments: allAssignments.map(a => ({
          id: a._id,
          title: a.title,
          classId: a.classId,
          assignedToClasses: a.assignedToClasses,
          tenantId: a.tenantId
        }))
      });
    } catch (debugError) {
      console.error('❌ Debug error:', debugError);
    }

    // Base query for all content
    const baseQuery = {
      tenantId: tenantId,
      isActive: true,
      hiddenFromStudents: { $ne: true }, // Exclude assignments hidden from students
    };

    // For students, also exclude assignments they've hidden themselves
    if (user.role === 'school_student') {
      baseQuery.hiddenFromStudentsList = { $nin: [user._id.toString()] };
    }

    // Add class filter for school students
    if (user.role === 'school_student' && classId) {
      baseQuery.classId = classId;
    }

    // Get all teacher/admin-created content
    let assignments = [];
    let tasks = [];
    let challenges = [];
    let activities = [];

    // Query content for school students
    if (user.role === 'school_student') {
      try {
        console.log('🔍 Querying content for school student:', {
          userId: userId,
          classId: classId,
          tenantId: user.tenantId,
          hasClass: !!classId
        });

        // Build query conditions
        let assignmentQuery = { ...baseQuery };
        let taskQuery = { ...baseQuery };
        let challengeQuery = { ...baseQuery };
        let activityQuery = { ...baseQuery };

        // Add class-specific conditions if student has a class
        if (classId) {
          const classConditions = [
            { classId: classId }, // Single class assignment
            { assignedToClasses: classId }, // Multiple classes assignment
            { classId: null, tenantId: tenantId } // Fallback for old assignments
          ];

          assignmentQuery.$or = classConditions;
          taskQuery.$or = [
            { classId: classId },
            { classId: null, tenantId: tenantId }
          ];
          challengeQuery.$or = [
            { classId: classId },
            { classId: null, tenantId: tenantId }
          ];
          activityQuery.$or = [
            { classId: classId },
            { classId: null, tenantId: tenantId }
          ];
        } else {
          // If no class, show all assignments for the tenant
          console.log('⚠️ Student has no class assigned, showing all tenant assignments');
        }

        // Add date filters
        assignmentQuery.assignedDate = { $gte: startDate };
        taskQuery.assignedDate = { $gte: startDate };
        challengeQuery.startDate = { $lte: now };
        challengeQuery.endDate = { $gte: startDate };
        activityQuery.scheduledDate = { $gte: startDate };

        [assignments, tasks, challenges, activities] = await Promise.all([
          // Assignments
          (filter === 'all' || filter === 'assignments')
            ? Assignment.find(assignmentQuery)
              .populate('teacherId', 'name')
              .sort({ assignedDate: -1 })
              .limit(50)
            : [],

          // Tasks
          (filter === 'all' || filter === 'tasks')
            ? Task.find(taskQuery)
              .populate('createdBy', 'name')
              .sort({ assignedDate: -1 })
              .limit(50)
            : [],

          // Challenges
          (filter === 'all' || filter === 'challenges')
            ? TeacherChallenge.find(challengeQuery)
              .populate('createdBy', 'name')
              .sort({ startDate: -1 })
              .limit(50)
            : [],

          // Activities
          (filter === 'all' || filter === 'activities')
            ? TeacherActivity.find(activityQuery)
              .populate('createdBy', 'name')
              .sort({ scheduledDate: -1 })
              .limit(50)
            : []
        ]);

        console.log('✅ Database queries completed:', {
          assignments: assignments.length,
          tasks: tasks.length,
          challenges: challenges.length,
          activities: activities.length,
          queryConditions: {
            assignmentQuery: Object.keys(assignmentQuery),
            taskQuery: Object.keys(taskQuery),
            challengeQuery: Object.keys(challengeQuery),
            activityQuery: Object.keys(activityQuery)
          }
        });

        // Debug: Show assignment details
        if (assignments.length > 0) {
          console.log('📝 Found assignments:', assignments.map(a => ({
            id: a._id,
            title: a.title,
            classId: a.classId,
            assignedToClasses: a.assignedToClasses,
            tenantId: a.tenantId,
            assignedDate: a.assignedDate
          })));
        } else {
          console.log('❌ No assignments found with query:', assignmentQuery);
        }
      } catch (dbError) {
        console.error('❌ Database query error:', dbError);
        // Continue with empty arrays if database queries fail
        assignments = [];
        tasks = [];
        challenges = [];
        activities = [];
      }
    } else {
      console.log('ℹ️ Skipping content queries - user is not a school student');
    }

    // Get submission status for each assignment if user is a student
    let assignmentSubmissionStatus = {};
    if (user.role === 'school_student') {
      const assignmentIds = assignments.map(a => a._id);
      const attempts = await AssignmentAttempt.find({
        assignmentId: { $in: assignmentIds },
        studentId: user._id,
        tenantId
      }).select('assignmentId status submittedAt');

      assignmentSubmissionStatus = attempts.reduce((acc, attempt) => {
        acc[attempt.assignmentId.toString()] = {
          status: attempt.status,
          submittedAt: attempt.submittedAt
        };
        return acc;
      }, {});
    }

    // Transform assignments
    const transformedAssignments = assignments.map(assignment => ({
      _id: assignment._id,
      title: assignment.title,
      description: assignment.description || `Assignment: ${assignment.title}`,
      type: 'assignment',
      assignmentType: assignment.type, // Add the actual assignment type
      timestamp: assignment.assignedDate,
      createdAt: assignment.assignedDate,
      category: assignment.subject || 'assignment',
      points: assignment.totalMarks || 0,
      action: `Assignment: ${assignment.title}`,
      message: `New assignment: ${assignment.title}`,
      location: 'Classroom',
      time: assignment.assignedDate.toLocaleTimeString(),
      color: getActivityColor('assignment'),
      dueDate: assignment.dueDate,
      teacher: assignment.teacherId?.name || 'Teacher',
      priority: assignment.priority,
      status: assignment.status,
      subject: assignment.subject,
      className: assignment.className,
      createdBy: assignment.teacherId?.name || 'Teacher',
      questions: assignment.questions,
      instructions: assignment.instructions,
      duration: assignment.duration,
      allowRetake: assignment.allowRetake,
      maxAttempts: assignment.maxAttempts,
      gradingType: assignment.gradingType,
      createdByRole: 'teacher',
      // Add submission status for students
      submissionStatus: assignmentSubmissionStatus[assignment._id.toString()] || null,
      canDelete: user.role === 'school_student' && assignmentSubmissionStatus[assignment._id.toString()]?.status === 'submitted'
    }));

    // Transform tasks
    const transformedTasks = tasks.map(task => ({
      _id: task._id,
      title: task.title,
      description: task.description || `Task: ${task.title}`,
      type: 'task',
      timestamp: task.assignedDate,
      createdAt: task.assignedDate,
      category: task.subject || 'task',
      points: task.points || 0,
      action: `Task: ${task.title}`,
      message: `New task: ${task.title}`,
      location: task.location || 'Classroom',
      time: task.assignedDate.toLocaleTimeString(),
      color: getActivityColor('task'),
      dueDate: task.dueDate,
      teacher: task.createdBy?.name || 'Teacher',
      priority: task.priority,
      status: task.status,
      subject: task.subject,
      className: task.className,
      createdBy: task.createdBy?.name || 'Teacher',
      createdByRole: 'teacher',
      taskType: task.type
    }));

    // Transform challenges
    const transformedChallenges = challenges.map(challenge => ({
      _id: challenge._id,
      title: challenge.title,
      description: challenge.description || `Challenge: ${challenge.title}`,
      type: 'challenge',
      timestamp: challenge.startDate,
      createdAt: challenge.startDate,
      category: challenge.type || 'challenge',
      points: challenge.points || 0,
      action: `Challenge: ${challenge.title}`,
      message: `New challenge: ${challenge.title}`,
      location: 'Classroom',
      time: challenge.startDate.toLocaleTimeString(),
      color: getActivityColor('challenge'),
      startDate: challenge.startDate,
      endDate: challenge.endDate,
      teacher: challenge.createdBy?.name || 'Teacher',
      difficulty: challenge.difficulty,
      status: challenge.status,
      subject: challenge.subject,
      className: challenge.className,
      createdBy: challenge.createdBy?.name || 'Teacher',
      createdByRole: 'teacher',
      challengeType: challenge.type,
      duration: challenge.duration
    }));

    // Transform activities
    const transformedActivities = activities.map(activity => ({
      _id: activity._id,
      title: activity.title,
      description: activity.description || `Activity: ${activity.title}`,
      type: 'activity',
      timestamp: activity.scheduledDate,
      createdAt: activity.scheduledDate,
      category: activity.type || 'activity',
      points: activity.points || 0,
      action: `Activity: ${activity.title}`,
      message: `New activity: ${activity.title}`,
      location: activity.location || 'Classroom',
      time: activity.scheduledDate.toLocaleTimeString(),
      color: getActivityColor('activity'),
      scheduledDate: activity.scheduledDate,
      duration: activity.duration,
      teacher: activity.createdBy?.name || 'Teacher',
      status: activity.status,
      subject: activity.subject,
      className: activity.className,
      createdBy: activity.createdBy?.name || 'Teacher',
      createdByRole: 'teacher',
      activityType: activity.type,
      objectives: activity.objectives
    }));

    // Combine and sort all content
    const allContent = [
      ...transformedAssignments,
      ...transformedTasks,
      ...transformedChallenges,
      ...transformedActivities
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // If no content found and user is not a school student, return empty array with success
    if (allContent.length === 0 && user.role !== 'school_student') {
      console.log('ℹ️ No content found for non-school student, returning empty array');
    }

    console.log('✅ getStudentActivity returning:', {
      totalContent: allContent.length,
      assignments: transformedAssignments.length,
      tasks: transformedTasks.length,
      challenges: transformedChallenges.length,
      activities: transformedActivities.length,
      studentClassId: classId,
      studentRole: user.role
    });

    res.status(200).json({
      success: true,
      activities: allContent
    });
  } catch (err) {
    console.error('❌ Error in getStudentActivity:', err);
    next(err);
  }
};

// Get student activity statistics
export const getStudentActivityStats = async (req, res, next) => {
  try {
    console.log('🔍 getStudentActivityStats called with:', {
      userId: req.user?._id,
      userRole: req.user?.role
    });

    const userId = req.user._id;
    const user = req.user;

    // Validate user object
    if (!user) {
      console.error('❌ User object is null or undefined');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Get tenantId from request (set by tenant middleware) or user object
    const tenantId = req.tenantId || user.tenantId || 'default';

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get activity counts with error handling
    let totalActivities = 0;
    let weekActivities = 0;
    let monthActivities = 0;
    let gamesPlayed = 0;
    let lessonsCompleted = 0;
    let walletTransactions = 0;

    try {
      [totalActivities, weekActivities, monthActivities, gamesPlayed, lessonsCompleted, walletTransactions] = await Promise.all([
        ActivityLog.countDocuments({ userId }),
        ActivityLog.countDocuments({
          userId,
          timestamp: { $gte: weekAgo }
        }),
        ActivityLog.countDocuments({
          userId,
          timestamp: { $gte: monthAgo }
        }),
        GameProgress.countDocuments({
          userId,
          progress: { $gt: 0 }
        }),
        GameProgress.countDocuments({
          userId,
          progress: 100
        }),
        Transaction.countDocuments({
          userId,
          type: 'earned'
        })
      ]);
    } catch (statsError) {
      console.error('❌ Error getting basic stats:', statsError);
      // Continue with default values
    }

    // Get assignment statistics for school students
    let assignmentsAssigned = 0;
    let assignmentsCompleted = 0;
    let assignmentsPending = 0;

    if (user.role === 'school_student') {
      try {
        const schoolStudent = await SchoolStudent.findOne({ userId, tenantId }).populate('classId');
        if (schoolStudent && schoolStudent.classId) {
          // Get assignments assigned to the student's class
          assignmentsAssigned = await Assignment.countDocuments({
            classId: schoolStudent.classId._id,
            isActive: true,
            assignedDate: { $gte: monthAgo },
            tenantId
          });

          // Get assignments completed by the student
          assignmentsCompleted = await Assignment.countDocuments({
            classId: schoolStudent.classId._id,
            isActive: true,
            'submissions.studentId': userId,
            'submissions.status': 'submitted',
            tenantId
          });

          // Get pending assignments
          assignmentsPending = await Assignment.countDocuments({
            classId: schoolStudent.classId._id,
            isActive: true,
            dueDate: { $gte: now },
            'submissions.studentId': { $ne: userId },
            tenantId
          });
        }
      } catch (statsError) {
        console.error('❌ Error getting assignment stats:', statsError);
        // Continue with default values
      }
    }

    // Calculate trends (simplified)
    const activitiesTrend = weekActivities > 0 ? Math.round((weekActivities / 7) * 30) : 0;
    const gamesTrend = gamesPlayed > 0 ? Math.round((gamesPlayed / 30) * 100) : 0;
    const lessonsTrend = lessonsCompleted > 0 ? Math.round((lessonsCompleted / 30) * 100) : 0;
    const assignmentsTrend = assignmentsAssigned > 0 ? Math.round((assignmentsCompleted / assignmentsAssigned) * 100) : 0;

    console.log('✅ getStudentActivityStats returning:', {
      totalActivities,
      gamesPlayed,
      lessonsCompleted,
      assignmentsAssigned,
      assignmentsCompleted,
      assignmentsPending
    });

    res.status(200).json({
      success: true,
      totalActivities,
      gamesPlayed,
      lessonsCompleted,
      assignmentsAssigned,
      assignmentsCompleted,
      assignmentsPending,
      challengesWon: 0, // No challenges anymore
      walletTransactions,
      activitiesTrend,
      gamesTrend,
      lessonsTrend,
      assignmentsTrend,
      challengesTrend: 0 // No challenges anymore
    });
  } catch (err) {
    console.error('❌ Error in getStudentActivityStats:', err);
    next(err);
  }
};

// Helper function to get activity color
const getActivityColor = (activityType) => {
  const colorMap = {
    'game': 'blue',
    'lesson': 'green',
    'challenge': 'purple',
    'achievement': 'orange',
    'quiz': 'pink',
    'mood': 'red',
    'wallet': 'yellow',
    'level_up': 'violet',
    'assignment': 'indigo',
    'task': 'teal',
    'activity': 'emerald'
  };
  return colorMap[activityType] || 'gray';
};

