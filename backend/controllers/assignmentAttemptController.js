import AssignmentAttempt from '../models/AssignmentAttempt.js';
import Assignment from '../models/Assignment.js';
import User from '../models/User.js';
import SchoolClass from '../models/School/SchoolClass.js';

// Start assignment attempt
export const startAttempt = async (req, res) => {
  try {
    console.log('🚀 startAttempt called with:', {
      assignmentId: req.params.assignmentId,
      studentId: req.user?._id,
      tenantId: req.tenantId || req.user?.tenantId || 'default',
      userRole: req.user?.role
    });
    
    const { assignmentId } = req.params;
    const studentId = req.user._id;
    const tenantId = req.tenantId || req.user.tenantId || 'default';

    // Get assignment details
    console.log('🔍 Looking for assignment:', { assignmentId, tenantId });
    const assignment = await Assignment.findOne({ 
      _id: assignmentId, 
      tenantId,
      isActive: true 
    });

    console.log('📋 Assignment found:', assignment ? 'Yes' : 'No');
    if (assignment) {
      console.log('📋 Assignment details:', {
        id: assignment._id,
        title: assignment.title,
        type: assignment.type,
        dueDate: assignment.dueDate,
        isActive: assignment.isActive
      });
    }

    if (!assignment) {
      console.log('❌ Assignment not found');
      return res.status(404).json({ 
        success: false, 
        message: 'Assignment not found' 
      });
    }

    // Check if assignment is still active
    console.log('⏰ Checking assignment deadline:', {
      dueDate: assignment.dueDate,
      currentTime: new Date(),
      isOverdue: new Date() > new Date(assignment.dueDate)
    });
    
    if (new Date() > new Date(assignment.dueDate)) {
      console.log('❌ Assignment deadline has passed');
      return res.status(400).json({ 
        success: false, 
        message: 'Assignment deadline has passed' 
      });
    }

    // Check if student is assigned to this assignment
    console.log('👤 Checking student assignment:', {
      assignedToClasses: assignment.assignedToClasses,
      userRole: req.user.role,
      userMetadata: req.user.metadata,
      userClasses: req.user.metadata?.classes
    });
    
    let isAssigned = false;
    
    if (req.user.role === 'school_student') {
      // For school students, check if assignment is assigned to their class
      // We need to get the student's class from SchoolStudent model
      const SchoolStudent = (await import('../models/School/SchoolStudent.js')).default;
      const schoolStudent = await SchoolStudent.findOne({ 
        userId: studentId, 
        tenantId 
      });
      
      if (schoolStudent && schoolStudent.classId) {
        isAssigned = assignment.assignedToClasses.some(classId => 
          classId.toString() === schoolStudent.classId.toString()
        );
        console.log('🏫 School student class check:', {
          studentClassId: schoolStudent.classId,
          assignedToClasses: assignment.assignedToClasses,
          isAssigned
        });
      }
    } else {
      // For regular students, check metadata.classes
      isAssigned = assignment.assignedToClasses.some(classId => 
        req.user.metadata?.classes?.some(cls => cls.classId.toString() === classId.toString())
      );
    }

    console.log('✅ Is student assigned:', isAssigned);

    if (!isAssigned) {
      console.log('❌ Student not assigned to this assignment');
      return res.status(403).json({ 
        success: false, 
        message: 'You are not assigned to this assignment' 
      });
    }

    // Check existing attempts
    console.log('🔍 Checking existing attempts...');
    const existingAttempts = await AssignmentAttempt.find({
      assignmentId,
      studentId,
      tenantId
    }).sort({ attemptNumber: -1 });

    console.log('📊 Existing attempts found:', existingAttempts.length);

    // Check if max attempts reached
    if (assignment.maxAttempts && existingAttempts.length >= assignment.maxAttempts) {
      console.log('❌ Maximum attempts reached');
      return res.status(400).json({ 
        success: false, 
        message: `Maximum attempts (${assignment.maxAttempts}) reached` 
      });
    }

    // Check if already has a submitted attempt and retake not allowed
    const submittedAttempt = existingAttempts.find(attempt => attempt.status === 'submitted');
    if (submittedAttempt && !assignment.allowRetake) {
      console.log('❌ Assignment already submitted and retake not allowed');
      return res.status(400).json({ 
        success: false, 
        message: 'Assignment already submitted and retake not allowed' 
      });
    }

    // Create new attempt
    console.log('🆕 Creating new attempt...');
    const attemptNumber = existingAttempts.length + 1;
    const newAttempt = new AssignmentAttempt({
      assignmentId,
      studentId,
      classId: assignment.classId,
      tenantId,
      maxScore: assignment.totalMarks || assignment.questions?.reduce((sum, q) => sum + (q.points || 0), 0) || 100,
      attemptNumber
    });

    console.log('💾 Saving attempt to database...');
    await newAttempt.save();
    console.log('✅ Attempt saved successfully:', newAttempt._id);

    console.log('📤 Sending response...');
    res.json({
      success: true,
      message: 'Assignment attempt started',
      data: {
        attemptId: newAttempt._id,
        assignment: {
          _id: assignment._id,
          title: assignment.title,
          description: assignment.description,
          type: assignment.type,
          questions: assignment.questions || [],
          instructions: assignment.instructions,
          duration: assignment.duration,
          dueDate: assignment.dueDate,
          totalMarks: assignment.totalMarks,
          projectMode: assignment.projectMode,
          projectData: assignment.projectData
        },
        attempt: {
          _id: newAttempt._id,
          status: newAttempt.status,
          attemptNumber: newAttempt.attemptNumber,
          timeSpent: newAttempt.timeSpent
        }
      }
    });
    console.log('✅ Response sent successfully');

  } catch (error) {
    console.error('Error starting assignment attempt:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to start assignment attempt',
      error: error.message 
    });
  }
};

// Save attempt progress
export const saveProgress = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers, timeSpent } = req.body;
    const studentId = req.user._id;
    const tenantId = req.tenantId || req.user.tenantId || 'default';

    const attempt = await AssignmentAttempt.findOne({
      _id: attemptId,
      studentId,
      tenantId,
      status: 'in_progress'
    });

    if (!attempt) {
      return res.status(404).json({ 
        success: false, 
        message: 'Attempt not found or already submitted' 
      });
    }

    // Update answers and time spent
    attempt.answers = answers || attempt.answers;
    attempt.timeSpent = timeSpent || attempt.timeSpent;

    await attempt.save();

    res.json({
      success: true,
      message: 'Progress saved',
      data: { attemptId: attempt._id }
    });

  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save progress',
      error: error.message 
    });
  }
};

// Submit assignment
export const submitAssignment = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers, timeSpent } = req.body;
    const studentId = req.user._id;
    const tenantId = req.tenantId || req.user.tenantId || 'default';

    const attempt = await AssignmentAttempt.findOne({
      _id: attemptId,
      studentId,
      tenantId,
      status: 'in_progress'
    });

    if (!attempt) {
      return res.status(404).json({ 
        success: false, 
        message: 'Attempt not found or already submitted' 
      });
    }

    // Get assignment for validation
    const assignment = await Assignment.findById(attempt.assignmentId);
    if (!assignment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Assignment not found' 
      });
    }

    // Check if deadline has passed
    const isLate = new Date() > new Date(assignment.dueDate);
    attempt.isLate = isLate;

    // Update attempt with final answers
    attempt.answers = answers || attempt.answers;
    attempt.timeSpent = timeSpent || attempt.timeSpent;
    attempt.status = 'submitted';
    attempt.submittedAt = new Date();

    // For projects, mark as requiring manual grading
    if (assignment.type === 'project') {
      attempt.autoGraded = false;
      attempt.graded = false;
      attempt.requiresManualGrading = true;
      // Projects may not have objective scoring, so set initial score to 0
      attempt.totalScore = 0;
      attempt.maxScore = assignment.totalMarks || 100;
      attempt.percentage = 0;
    }

    // Auto-grade if possible (quizzes, tests, and classwork support auto-grading for objective questions)
    // Classwork can use auto-grading for objective questions, but may also include participation-based activities
    // Projects require manual grading as they are typically research-based, creative, or multi-phase assignments
    if (assignment.type === 'quiz' || assignment.type === 'test' || assignment.type === 'classwork') {
      let totalScore = 0;
      let autoGradableCount = 0;
      let manualGradingCount = 0;
      
      attempt.answers.forEach(answer => {
        const question = assignment.questions.find(q => q.id === answer.questionId || q._id?.toString() === answer.questionId);
        if (question) {
          let isCorrect = false;
          let canAutoGrade = true;
          
          // Auto-grade supported question types
          if (question.type === 'multiple_choice') {
            isCorrect = answer.answer === question.correctAnswer || 
                       answer.answer?.toString() === question.correctAnswer?.toString();
          } else if (question.type === 'true_false') {
            isCorrect = answer.answer === question.correctAnswer || 
                       answer.answer?.toString() === question.correctAnswer?.toString();
          } else if (question.type === 'fill_in_blank' || question.type === 'fill_blank') {
            const correctAnswer = (question.correctAnswer || '').toLowerCase().trim();
            const studentAnswer = (answer.answer || '').toLowerCase().trim();
            isCorrect = correctAnswer === studentAnswer || 
                       correctAnswer.split(',').some(ca => ca.trim() === studentAnswer);
          } else if (question.type === 'short_answer') {
            // For short answer, try to match if correct answer is provided
            if (question.correctAnswer) {
              const correctAnswer = question.correctAnswer.toLowerCase().trim();
              const studentAnswer = (answer.answer || '').toLowerCase().trim();
              // Allow partial matches for short answers
              isCorrect = correctAnswer === studentAnswer || 
                         studentAnswer.includes(correctAnswer) || 
                         correctAnswer.includes(studentAnswer);
            } else {
              canAutoGrade = false; // Needs manual grading
            }
          } else if (question.type === 'matching') {
            // For matching questions, check if all pairs match
            if (question.correctAnswer && answer.answer) {
              try {
                const correctPairs = Array.isArray(question.correctAnswer) 
                  ? question.correctAnswer 
                  : JSON.parse(question.correctAnswer);
                const studentPairs = Array.isArray(answer.answer) 
                  ? answer.answer 
                  : JSON.parse(answer.answer);
                
                if (Array.isArray(correctPairs) && Array.isArray(studentPairs)) {
                  isCorrect = correctPairs.every((cp, idx) => {
                    const sp = studentPairs[idx];
                    return sp && cp.left === sp.left && cp.right === sp.right;
                  });
                }
              } catch (e) {
                canAutoGrade = false; // Needs manual grading
              }
            } else {
              canAutoGrade = false; // Needs manual grading
            }
          } else {
            // Essay, problem_solving, word_problem, etc. need manual grading
            canAutoGrade = false;
          }
          
          if (canAutoGrade) {
            answer.isCorrect = isCorrect;
            answer.points = isCorrect ? (question.points || 0) : 0;
            totalScore += answer.points;
            autoGradableCount++;
          } else {
            // Mark for manual grading
            answer.isCorrect = null;
            answer.points = 0; // Will be set by teacher during manual grading
            answer.requiresManualGrading = true;
            manualGradingCount++;
          }
        }
      });
      
      attempt.totalScore = totalScore;
      attempt.maxScore = assignment.totalMarks || assignment.questions?.reduce((sum, q) => sum + (q.points || 0), 0) || 100;
      attempt.percentage = attempt.maxScore > 0 ? Math.round((totalScore / attempt.maxScore) * 100 * 10) / 10 : 0;
      
      // Mark as auto-graded if all questions were auto-gradable
      if (manualGradingCount === 0) {
        attempt.autoGraded = true;
        attempt.graded = true; // Fully auto-graded
      } else if (autoGradableCount > 0) {
        attempt.autoGraded = true; // Partially auto-graded
        attempt.graded = false; // Needs manual grading for some questions
        attempt.requiresManualGrading = true;
      } else {
        attempt.autoGraded = false;
        attempt.graded = false;
        attempt.requiresManualGrading = true;
      }
    }

    await attempt.save();

    // Get student info for notification
    const User = (await import('../models/User.js')).default;
    const student = await User.findById(studentId).select('name email').lean();

    // Emit real-time notification via Socket.IO
    const io = req.app?.get('io');
    if (io && assignment.teacherId) {
      // Emit to teacher
      io.to(assignment.teacherId.toString()).emit('assignment:submitted', {
        assignmentId: assignment._id,
        assignmentTitle: assignment.title,
        assignmentType: assignment.type, // Include assignment type for filtering
        studentId: studentId,
        studentName: student?.name || 'Student',
        attemptId: attempt._id,
        submittedAt: attempt.submittedAt,
        isLate: attempt.isLate,
        autoGraded: attempt.autoGraded,
        totalScore: attempt.totalScore,
        percentage: attempt.percentage,
        tenantId
      });

      // Also emit to tenant room
      io.to(tenantId).emit('assignment:submitted', {
        assignmentId: assignment._id,
        assignmentTitle: assignment.title,
        assignmentType: assignment.type, // Include assignment type for filtering
        studentId: studentId,
        studentName: student?.name || 'Student',
        attemptId: attempt._id,
        submittedAt: attempt.submittedAt,
        isLate: attempt.isLate,
        autoGraded: attempt.autoGraded,
        totalScore: attempt.totalScore,
        percentage: attempt.percentage,
        tenantId
      });
      
      // Emit teacher task update for dashboard refresh
      io.to(assignment.teacherId.toString()).emit('teacher:task:update', {
        type: 'assignment_submitted',
        assignmentId: assignment._id,
        assignmentTitle: assignment.title,
        studentId: studentId,
        studentName: student?.name || 'Student',
        tenantId,
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Assignment submitted successfully',
      data: {
        attemptId: attempt._id,
        totalScore: attempt.totalScore,
        maxScore: attempt.maxScore,
        percentage: attempt.percentage,
        isLate: attempt.isLate,
        autoGraded: attempt.autoGraded
      }
    });

  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit assignment',
      error: error.message 
    });
  }
};

// Get attempt details
export const getAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const studentId = req.user._id;
    const tenantId = req.tenantId || req.user.tenantId || 'default';

    const attempt = await AssignmentAttempt.findOne({
      _id: attemptId,
      studentId,
      tenantId
    }).populate('assignmentId', 'title description type questions instructions duration dueDate totalMarks projectMode projectData');

    if (!attempt) {
      return res.status(404).json({ 
        success: false, 
        message: 'Attempt not found' 
      });
    }

    res.json({
      success: true,
      data: attempt
    });

  } catch (error) {
    console.error('Error getting attempt:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get attempt details',
      error: error.message 
    });
  }
};

// Get student's attempts for an assignment
export const getStudentAttempts = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const studentId = req.user._id;
    const tenantId = req.tenantId || req.user.tenantId || 'default';

    const attempts = await AssignmentAttempt.find({
      assignmentId,
      studentId,
      tenantId
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: attempts
    });

  } catch (error) {
    console.error('Error getting student attempts:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get attempts',
      error: error.message 
    });
  }
};

// Get assignment statistics for teacher
export const getAssignmentStats = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const teacherId = req.user._id;
    const tenantId = req.tenantId || req.user.tenantId || 'default';

    console.log('📊 Getting assignment stats for:', { assignmentId, teacherId, tenantId });

    // Verify teacher owns this assignment
    const assignment = await Assignment.findOne({
      _id: assignmentId,
      teacherId,
      tenantId
    }).populate('classId', 'name section academicYear')
      .populate('assignedToClasses', 'name section academicYear');

    if (!assignment) {
      console.log('❌ Assignment not found');
      return res.status(404).json({ 
        success: false, 
        message: 'Assignment not found' 
      });
    }

    console.log('✅ Assignment found:', assignment.title);

    // Get total number of students assigned to this assignment
    // Count students from assigned classes
    const SchoolStudent = (await import('../models/SchoolStudent.js')).default;
    let totalAssignedStudents = 0;
    
    if (assignment.assignedToClasses && assignment.assignedToClasses.length > 0) {
      const classIds = assignment.assignedToClasses.map(c => c._id || c);
      totalAssignedStudents = await SchoolStudent.countDocuments({
        tenantId,
        classId: { $in: classIds }
      });
    } else if (assignment.classId) {
      totalAssignedStudents = await SchoolStudent.countDocuments({
        tenantId,
        classId: assignment.classId._id || assignment.classId
      });
    }

    // Get all attempts for this assignment
    const attempts = await AssignmentAttempt.find({
      assignmentId,
      tenantId
    }).populate('studentId', 'name email')
      .sort({ submittedAt: -1 });

    console.log('📈 Found attempts:', attempts.length);
    console.log('👥 Total assigned students:', totalAssignedStudents);

    // Calculate statistics
    // Use totalAssignedStudents if available, otherwise fall back to unique students who have attempts
    const uniqueStudentsWithAttempts = new Set(attempts.map(a => a.studentId?._id?.toString() || a.studentId?.toString()));
    const totalStudents = totalAssignedStudents > 0 ? totalAssignedStudents : uniqueStudentsWithAttempts.size;
    const submittedAttempts = attempts.filter(attempt => attempt.status === 'submitted');
    const submittedCount = submittedAttempts.length;
    const pendingCount = totalStudents - submittedCount;
    const inProgressCount = attempts.filter(attempt => attempt.status === 'in_progress').length;

    const averageScore = submittedAttempts.length > 0 
      ? submittedAttempts.reduce((sum, attempt) => sum + (attempt.totalScore || 0), 0) / submittedAttempts.length 
      : 0;

    const averagePercentage = submittedAttempts.length > 0 
      ? submittedAttempts.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0) / submittedAttempts.length 
      : 0;

    // Calculate time statistics
    const averageTimeSpent = submittedAttempts.length > 0 
      ? submittedAttempts.reduce((sum, attempt) => sum + (attempt.timeSpent || 0), 0) / submittedAttempts.length 
      : 0;

    // Group by completion status
    const completionStats = {
      total: totalStudents,
      submitted: submittedCount,
      pending: pendingCount,
      inProgress: inProgressCount,
      completionRate: totalStudents > 0 ? Math.round((submittedCount / totalStudents) * 100) : 0
    };

    // Score distribution
    const scoreDistribution = {
      excellent: submittedAttempts.filter(attempt => (attempt.percentage || 0) >= 90).length,
      good: submittedAttempts.filter(attempt => (attempt.percentage || 0) >= 70 && (attempt.percentage || 0) < 90).length,
      average: submittedAttempts.filter(attempt => (attempt.percentage || 0) >= 50 && (attempt.percentage || 0) < 70).length,
      poor: submittedAttempts.filter(attempt => (attempt.percentage || 0) < 50).length
    };

    // Question-wise statistics
    const questionStats = assignment.questions?.map((question, index) => {
      const questionAttempts = submittedAttempts.filter(attempt => 
        attempt.answers && attempt.answers[index]
      );
      
      const correctAnswers = questionAttempts.filter(attempt => {
        const answer = attempt.answers[index];
        return answer && answer.isCorrect;
      }).length;

      return {
        questionIndex: index,
        questionText: question.question,
        totalAttempts: questionAttempts.length,
        correctAnswers,
        accuracy: questionAttempts.length > 0 ? Math.round((correctAnswers / questionAttempts.length) * 100) : 0
      };
    }) || [];

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentActivity = attempts.filter(attempt => 
      attempt.submittedAt && new Date(attempt.submittedAt) >= sevenDaysAgo
    ).length;

    console.log('📊 Stats calculated:', {
      totalStudents,
      submittedCount,
      averageScore: Math.round(averageScore * 100) / 100,
      completionRate: completionStats.completionRate
    });

    res.json({
      success: true,
      data: {
        assignment: {
          _id: assignment._id,
          title: assignment.title,
          description: assignment.description,
          type: assignment.type,
          dueDate: assignment.dueDate,
          totalMarks: assignment.totalMarks,
          questions: assignment.questions?.length || 0,
          duration: assignment.duration,
          instructions: assignment.instructions,
          classId: assignment.classId,
          assignedToClasses: assignment.assignedToClasses
        },
        completionStats,
        scoreDistribution,
        questionStats,
        averageScore: Math.round(averageScore * 100) / 100,
        averagePercentage: Math.round(averagePercentage * 100) / 100,
        averageTimeSpent: Math.round(averageTimeSpent),
        recentActivity,
        attempts: submittedAttempts.map(attempt => ({
          _id: attempt._id,
          student: {
            _id: attempt.studentId._id,
            name: attempt.studentId.name,
            email: attempt.studentId.email
          },
          totalScore: attempt.totalScore || 0,
          percentage: attempt.percentage || 0,
          submittedAt: attempt.submittedAt,
          isLate: attempt.isLate || false,
          timeSpent: attempt.timeSpent || 0,
          status: attempt.status,
          attemptNumber: attempt.attemptNumber || 1,
          autoGraded: attempt.autoGraded || false,
          graded: attempt.graded || false,
          requiresManualGrading: attempt.requiresManualGrading || false
        }))
      }
    });

  } catch (error) {
    console.error('Error getting assignment stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get assignment statistics',
      error: error.message 
    });
  }
};
