import UnifiedGameProgress from '../models/UnifiedGameProgress.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

/**
 * Check if all required self-awareness games are completed
 */
export const checkRequiredSelfAwareGamesCompleted = async (userId) => {
  try {
    const requiredGameIds = [
      'teacher-education-1',  // Name Your Feeling
      'teacher-education-6',  // Inner Voice Check
      'teacher-education-7',  // Emotion Journal
      'teacher-education-8',  // Mirror Moment Simulation
      'teacher-education-9'   // Emotion Reflex
    ];

    const completedGames = await UnifiedGameProgress.find({
      userId,
      gameId: { $in: requiredGameIds },
      gameType: 'teacher-education',
      fullyCompleted: true,
      userRole: 'school_teacher'
    });

    const completedGameIds = new Set(completedGames.map(g => g.gameId));
    const allCompleted = requiredGameIds.every(id => completedGameIds.has(id));

    return {
      allCompleted,
      completedCount: completedGameIds.size,
      totalRequired: requiredGameIds.length,
      completedGameIds: Array.from(completedGameIds),
      missingGameIds: requiredGameIds.filter(id => !completedGameIds.has(id))
    };
  } catch (error) {
    console.error('Error checking required teacher games:', error);
    return {
      allCompleted: false,
      completedCount: 0,
      totalRequired: 5,
      completedGameIds: [],
      missingGameIds: []
    };
  }
};

/**
 * Check Self-Aware Teacher Badge status
 */
export const checkSelfAwareTeacherBadgeStatus = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { hasBadge: false, newlyEarned: false };
    }

    // Check if badge already exists
    const existingBadge = user.badges?.find(
      badge => badge.name === 'Self-Aware Teacher' || badge.badgeId === 'self-aware-teacher'
    );

    if (existingBadge) {
      const gamesStatus = await checkRequiredSelfAwareGamesCompleted(userId);
      return {
        hasBadge: true,
        newlyEarned: false,
        earnedAt: existingBadge.earnedAt,
        badge: existingBadge,
        ...gamesStatus
      };
    }

    // Check if all required games are completed
    const gamesStatus = await checkRequiredSelfAwareGamesCompleted(userId);

    return {
      hasBadge: false,
      newlyEarned: false,
      ...gamesStatus
    };
  } catch (error) {
    console.error('Error checking Self-Aware Teacher Badge status:', error);
    return { hasBadge: false, newlyEarned: false, error: error.message };
  }
};

/**
 * Collect/Award Self-Aware Teacher Badge
 * Only awards if all required games are completed
 */
export const collectSelfAwareTeacherBadge = async (userId) => {
  try {
    // Check if user already has the badge
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if badge already exists
    const existingBadge = user.badges?.find(
      badge => badge.name === 'Self-Aware Teacher' || badge.badgeId === 'self-aware-teacher'
    );

    if (existingBadge) {
      return {
        success: true,
        badgeEarned: false,
        alreadyEarned: true,
        badge: existingBadge,
        message: 'Badge already collected'
      };
    }

    // Verify all required games are completed
    const gamesStatus = await checkRequiredSelfAwareGamesCompleted(userId);

    if (!gamesStatus.allCompleted) {
      return {
        success: false,
        badgeEarned: false,
        error: 'All 5 self-awareness tasks must be completed before collecting the badge',
        gamesStatus
      };
    }

    // Award the badge
    if (!user.badges) {
      user.badges = [];
    }

    const badgeData = {
      badgeId: 'self-aware-teacher',
      name: 'Self-Aware Teacher',
      description: 'Understanding yourself brings peace to your classroom.',
      earnedAt: new Date(),
      category: 'teacher-education',
      icon: '🧘',
      message: 'Understanding yourself brings peace to your classroom.'
    };

    user.badges.push(badgeData);
    await user.save();

    // Create notification
    await Notification.create({
      userId,
      type: 'achievement',
      title: '🏆 Self-Aware Teacher Badge Collected!',
      message: 'Congratulations! You\'ve successfully completed all self-awareness tasks and collected your badge. Understanding yourself brings peace to your classroom.',
      metadata: {
        badgeId: 'self-aware-teacher',
        badgeName: 'Self-Aware Teacher',
        gamesCompleted: gamesStatus.completedCount
      }
    });

    return {
      success: true,
      badgeEarned: true,
      alreadyEarned: false,
      badge: badgeData,
      gamesStatus,
      message: 'Badge collected successfully!'
    };
  } catch (error) {
    console.error('Error collecting Self-Aware Teacher Badge:', error);
    return {
      success: false,
      badgeEarned: false,
      error: error.message
    };
  }
};

/**
 * GET /api/school/teacher/badge/self-aware-teacher
 * Get Self-Aware Teacher Badge status
 */
export const getSelfAwareTeacherBadgeStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate teacher role
    if (req.user.role !== 'school_teacher') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers can access teacher badges'
      });
    }

    const result = await checkSelfAwareTeacherBadgeStatus(userId);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error getting Self-Aware Teacher Badge status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get badge status',
      message: error.message
    });
  }
};

/**
 * POST /api/school/teacher/badge/self-aware-teacher/collect
 * Collect Self-Aware Teacher Badge (requires all 5 self-awareness tasks completed)
 */
export const collectSelfAwareTeacherBadgeEndpoint = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate teacher role
    if (req.user.role !== 'school_teacher') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers can collect teacher badges'
      });
    }

    const result = await collectSelfAwareTeacherBadge(userId);

    if (result.success) {
      res.json({
        success: true,
        ...result
      });
    } else {
      res.status(400).json({
        success: false,
        ...result
      });
    }
  } catch (error) {
    console.error('Error collecting Self-Aware Teacher Badge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect badge',
      message: error.message
    });
  }
};

/**
 * Check if all required calm practice games are completed
 */
export const checkRequiredCalmGamesCompleted = async (userId) => {
  try {
    const requiredGameIds = [
      'teacher-education-13',  // Quick Calm Reflex
      'teacher-education-14',  // Breathe with Rhythm
      'teacher-education-17',  // Workload Journal
      'teacher-education-18',  // Pause Practice Simulation
      'teacher-education-19'   // Stress Release Body Scan
    ];

    const completedGames = await UnifiedGameProgress.find({
      userId,
      gameId: { $in: requiredGameIds },
      gameType: 'teacher-education',
      fullyCompleted: true,
      userRole: 'school_teacher'
    });

    const completedGameIds = new Set(completedGames.map(g => g.gameId));
    const allCompleted = requiredGameIds.every(id => completedGameIds.has(id));

    return {
      allCompleted,
      completedCount: completedGameIds.size,
      totalRequired: requiredGameIds.length,
      completedGameIds: Array.from(completedGameIds),
      missingGameIds: requiredGameIds.filter(id => !completedGameIds.has(id))
    };
  } catch (error) {
    console.error('Error checking required calm games:', error);
    return {
      allCompleted: false,
      completedCount: 0,
      totalRequired: 5,
      completedGameIds: [],
      missingGameIds: []
    };
  }
};

/**
 * Check Calm Teacher Badge status
 */
export const checkCalmTeacherBadgeStatus = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { hasBadge: false, newlyEarned: false };
    }

    // Check if badge already exists
    const existingBadge = user.badges?.find(
      badge => badge.name === 'Calm Teacher' || badge.badgeId === 'calm-teacher'
    );

    if (existingBadge) {
      const gamesStatus = await checkRequiredCalmGamesCompleted(userId);
      return {
        hasBadge: true,
        newlyEarned: false,
        earnedAt: existingBadge.earnedAt,
        badge: existingBadge,
        ...gamesStatus
      };
    }

    // Check if all required games are completed
    const gamesStatus = await checkRequiredCalmGamesCompleted(userId);

    return {
      hasBadge: false,
      newlyEarned: false,
      ...gamesStatus
    };
  } catch (error) {
    console.error('Error checking Calm Teacher Badge status:', error);
    return { hasBadge: false, newlyEarned: false, error: error.message };
  }
};

/**
 * Collect/Award Calm Teacher Badge
 */
export const collectCalmTeacherBadge = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if badge already exists
    const existingBadge = user.badges?.find(
      badge => badge.name === 'Calm Teacher' || badge.badgeId === 'calm-teacher'
    );

    if (existingBadge) {
      return {
        success: true,
        badgeEarned: false,
        alreadyEarned: true,
        badge: existingBadge,
        message: 'Badge already collected'
      };
    }

    // Verify all required games are completed
    const gamesStatus = await checkRequiredCalmGamesCompleted(userId);

    if (!gamesStatus.allCompleted) {
      return {
        success: false,
        badgeEarned: false,
        error: 'All 5 calming activities must be completed before collecting the badge',
        gamesStatus
      };
    }

    // Award the badge
    if (!user.badges) {
      user.badges = [];
    }

    const badgeData = {
      badgeId: 'calm-teacher',
      name: 'Calm Teacher',
      description: 'Consistent daily stress management practice.',
      earnedAt: new Date(),
      category: 'teacher-education',
      icon: '🧘',
      message: 'Consistent daily stress management practice.'
    };

    user.badges.push(badgeData);
    await user.save();

    // Create notification
    await Notification.create({
      userId,
      type: 'achievement',
      title: '🏆 Calm Teacher Badge Collected!',
      message: 'Congratulations! You\'ve successfully completed all calming activities and collected your badge. Consistent daily stress management practice.',
      metadata: {
        badgeId: 'calm-teacher',
        badgeName: 'Calm Teacher',
        gamesCompleted: gamesStatus.completedCount
      }
    });

    return {
      success: true,
      badgeEarned: true,
      alreadyEarned: false,
      badge: badgeData,
      gamesStatus,
      message: 'Badge collected successfully!'
    };
  } catch (error) {
    console.error('Error collecting Calm Teacher Badge:', error);
    return {
      success: false,
      badgeEarned: false,
      error: error.message
    };
  }
};

/**
 * Check if all required compassion balance games are completed
 */
export const checkRequiredCompassionBalanceGamesCompleted = async (userId) => {
  try {
    const requiredGameIds = [
      'teacher-education-21',  // Understanding Compassion Fatigue
      'teacher-education-22',  // Empathy vs Overload Quiz
      'teacher-education-23',  // Emotional Boundary Builder
      'teacher-education-24',  // Energy Drain Tracker
      'teacher-education-25'   // Refill Rituals
    ];

    const completedGames = await UnifiedGameProgress.find({
      userId,
      gameId: { $in: requiredGameIds },
      gameType: 'teacher-education',
      fullyCompleted: true,
      userRole: 'school_teacher'
    });

    const completedGameIds = new Set(completedGames.map(g => g.gameId));
    const allCompleted = requiredGameIds.every(id => completedGameIds.has(id));

    return {
      allCompleted,
      completedCount: completedGameIds.size,
      totalRequired: requiredGameIds.length,
      completedGameIds: Array.from(completedGameIds),
      missingGameIds: requiredGameIds.filter(id => !completedGameIds.has(id))
    };
  } catch (error) {
    console.error('Error checking required compassion balance games:', error);
    return {
      allCompleted: false,
      completedCount: 0,
      totalRequired: 5,
      completedGameIds: [],
      missingGameIds: []
    };
  }
};

/**
 * Check Compassion Balance Badge status
 */
export const checkCompassionBalanceBadgeStatus = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { hasBadge: false, newlyEarned: false, error: 'User not found' };
    }

    const gamesStatus = await checkRequiredCompassionBalanceGamesCompleted(userId);

    // Check if user has the badge
    const hasBadge = user.badges?.some(
      badge => badge.name === 'Compassion Balance' || badge.badgeId === 'compassion-balance'
    ) || false;

    return {
      hasBadge,
      newlyEarned: false,
      ...gamesStatus
    };
  } catch (error) {
    console.error('Error checking Compassion Balance Badge status:', error);
    return { hasBadge: false, newlyEarned: false, error: error.message };
  }
};

/**
 * Collect/Award Compassion Balance Badge
 */
export const collectCompassionBalanceBadge = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if badge already exists
    const existingBadge = user.badges?.find(
      badge => badge.name === 'Compassion Balance' || badge.badgeId === 'compassion-balance'
    );

    if (existingBadge) {
      return {
        success: true,
        badgeEarned: false,
        alreadyEarned: true,
        badge: existingBadge,
        message: 'Badge already collected'
      };
    }

    // Verify all required games are completed
    const gamesStatus = await checkRequiredCompassionBalanceGamesCompleted(userId);

    if (!gamesStatus.allCompleted) {
      return {
        success: false,
        badgeEarned: false,
        error: 'All 5 empathy balance tasks must be completed before collecting the badge',
        gamesStatus
      };
    }

    // Award the badge
    if (!user.badges) {
      user.badges = [];
    }

    const badgeData = {
      badgeId: 'compassion-balance',
      name: 'Compassion Balance',
      description: 'Model healthy empathy in school culture.',
      earnedAt: new Date(),
      category: 'teacher-education',
      icon: '🏆',
      message: 'Your care has clarity.'
    };

    user.badges.push(badgeData);
    await user.save();

    // Create notification
    await Notification.create({
      userId,
      type: 'achievement',
      title: '🏆 Compassion Balance Badge Collected!',
      message: 'Congratulations! You\'ve successfully completed all empathy balance tasks and collected your badge. Your care has clarity.',
      metadata: {
        badgeId: 'compassion-balance',
        badgeName: 'Compassion Balance',
        gamesCompleted: gamesStatus.completedCount
      }
    });

    return {
      success: true,
      badgeEarned: true,
      alreadyEarned: false,
      badge: badgeData,
      gamesStatus,
      message: 'Badge collected successfully!'
    };
  } catch (error) {
    console.error('Error collecting Compassion Balance Badge:', error);
    return {
      success: false,
      badgeEarned: false,
      error: error.message
    };
  }
};

/**
 * GET /api/school/teacher/badge/compassion-balance
 * Get Compassion Balance Badge status
 */
export const getCompassionBalanceBadgeStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate teacher role
    if (req.user.role !== 'school_teacher') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers can access teacher badges'
      });
    }

    const result = await checkCompassionBalanceBadgeStatus(userId);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error getting Compassion Balance Badge status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get badge status',
      message: error.message
    });
  }
};

/**
 * POST /api/school/teacher/badge/compassion-balance/collect
 * Collect Compassion Balance Badge
 */
export const collectCompassionBalanceBadgeEndpoint = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate teacher role
    if (req.user.role !== 'school_teacher') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers can collect teacher badges'
      });
    }

    const result = await collectCompassionBalanceBadge(userId);

    if (result.success) {
      res.json({
        success: true,
        ...result
      });
    } else {
      res.status(400).json({
        success: false,
        ...result
      });
    }
  } catch (error) {
    console.error('Error collecting Compassion Balance Badge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect badge',
      message: error.message
    });
  }
};

/**
 * GET /api/school/teacher/badges
 * Get all teacher badges
 */
export const getTeacherBadges = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate teacher role
    if (req.user.role !== 'school_teacher') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers can access teacher badges'
      });
    }

    const user = await User.findById(userId).select('badges');
    const badges = user?.badges || [];

    // Also check all badge statuses
    const selfAwareBadgeStatus = await checkSelfAwareTeacherBadgeStatus(userId);
    const calmBadgeStatus = await checkCalmTeacherBadgeStatus(userId);
    const compassionBalanceBadgeStatus = await checkCompassionBalanceBadgeStatus(userId);
    const balancedLifeBadgeStatus = await checkBalancedLifeBadgeStatus(userId);
    const mindfulMasteryBadgeStatus = await checkMindfulMasteryBadgeStatus(userId);
    const resilientEducatorBadgeStatus = await checkResilientEducatorBadgeStatus(userId);
    const clearCommunicatorBadgeStatus = await checkClearCommunicatorBadgeStatus(userId);
    const connectedTeacherBadgeStatus = await checkConnectedTeacherBadgeStatus(userId);
    const purposefulTeacherBadgeStatus = await checkPurposefulTeacherBadgeStatus(userId);
    const selfCareChampionBadgeStatus = await checkSelfCareChampionBadgeStatus(userId);

    res.json({
      success: true,
      badges,
      selfAwareBadge: selfAwareBadgeStatus,
      calmBadge: calmBadgeStatus,
      compassionBalanceBadge: compassionBalanceBadgeStatus,
      balancedLifeBadge: balancedLifeBadgeStatus,
      mindfulMasteryBadge: mindfulMasteryBadgeStatus,
      resilientEducatorBadge: resilientEducatorBadgeStatus,
      clearCommunicatorBadge: clearCommunicatorBadgeStatus,
      connectedTeacherBadge: connectedTeacherBadgeStatus,
      purposefulTeacherBadge: purposefulTeacherBadgeStatus,
      selfCareChampionBadge: selfCareChampionBadgeStatus
    });
  } catch (error) {
    console.error('Error getting teacher badges:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get badges',
      message: error.message
    });
  }
};

/**
 * Check if all required balanced life games are completed
 */
export const checkRequiredBalancedLifeGamesCompleted = async (userId) => {
  try {
    const requiredGameIds = [
      'teacher-education-35',  // Weekend Recharge Plan
      'teacher-education-36',  // The "No" Practice
      'teacher-education-37',  // Work–Life Tracker Journal
      'teacher-education-38',  // Family Connection Challenge
      'teacher-education-39'   // Digital Shutdown Simulation
    ];

    const completedGames = await UnifiedGameProgress.find({
      userId,
      gameId: { $in: requiredGameIds },
      gameType: 'teacher-education',
      fullyCompleted: true,
      userRole: 'school_teacher'
    });

    const completedGameIds = new Set(completedGames.map(g => g.gameId));
    const allCompleted = requiredGameIds.every(id => completedGameIds.has(id));

    return {
      allCompleted,
      completedCount: completedGameIds.size,
      totalRequired: requiredGameIds.length,
      completedGameIds: Array.from(completedGameIds),
      missingGameIds: requiredGameIds.filter(id => !completedGameIds.has(id))
    };
  } catch (error) {
    console.error('Error checking required balanced life games:', error);
    return {
      allCompleted: false,
      completedCount: 0,
      totalRequired: 5,
      completedGameIds: [],
      missingGameIds: []
    };
  }
};

/**
 * Check Balanced Life Badge status
 */
export const checkBalancedLifeBadgeStatus = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { hasBadge: false, newlyEarned: false, error: 'User not found' };
    }

    const gamesStatus = await checkRequiredBalancedLifeGamesCompleted(userId);

    // Check if user has the badge
    const hasBadge = user.badges?.some(
      badge => badge.name === 'Balanced Life' || badge.badgeId === 'balanced-life'
    ) || false;

    return {
      hasBadge,
      newlyEarned: false,
      ...gamesStatus
    };
  } catch (error) {
    console.error('Error checking Balanced Life Badge status:', error);
    return { hasBadge: false, newlyEarned: false, error: error.message };
  }
};

/**
 * Collect/Award Balanced Life Badge
 */
export const collectBalancedLifeBadge = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if badge already exists
    const existingBadge = user.badges?.find(
      badge => badge.name === 'Balanced Life' || badge.badgeId === 'balanced-life'
    );

    if (existingBadge) {
      return {
        success: true,
        badgeEarned: false,
        alreadyEarned: true,
        badge: existingBadge,
        message: 'Badge already collected'
      };
    }

    // Verify all required games are completed
    const gamesStatus = await checkRequiredBalancedLifeGamesCompleted(userId);

    if (!gamesStatus.allCompleted) {
      return {
        success: false,
        badgeEarned: false,
        error: 'All 5 balance activities must be completed before collecting the badge',
        gamesStatus
      };
    }

    // Award the badge
    if (!user.badges) {
      user.badges = [];
    }

    const badgeData = {
      badgeId: 'balanced-life',
      name: 'Balanced Life',
      description: 'Maintain consistent rest and self-care routines.',
      earnedAt: new Date(),
      category: 'teacher-education',
      icon: '⚖️',
      message: 'Balance brings brilliance.'
    };

    user.badges.push(badgeData);
    await user.save();

    // Create notification
    await Notification.create({
      userId,
      type: 'achievement',
      title: '🏆 Balanced Life Badge Collected!',
      message: 'Congratulations! You\'ve successfully completed all balance activities and collected your badge. Balance brings brilliance.',
      metadata: {
        badgeId: 'balanced-life',
        badgeName: 'Balanced Life',
        gamesCompleted: gamesStatus.completedCount
      }
    });

    return {
      success: true,
      badgeEarned: true,
      alreadyEarned: false,
      badge: badgeData,
      gamesStatus,
      message: 'Badge collected successfully!'
    };
  } catch (error) {
    console.error('Error collecting Balanced Life Badge:', error);
    return {
      success: false,
      badgeEarned: false,
      error: error.message
    };
  }
};

/**
 * Check if all required mindful mastery games are completed
 */
export const checkRequiredMindfulMasteryGamesCompleted = async (userId) => {
  try {
    const requiredGameIds = [
      'teacher-education-41',  // Present Moment Awareness
      'teacher-education-42',  // One-Minute Pause
      'teacher-education-43',  // Focus Anchor Exercise
      'teacher-education-45',  // Guided Meditation Audio
      'teacher-education-49'   // Gratitude in the Moment
    ];

    const completedGames = await UnifiedGameProgress.find({
      userId,
      gameId: { $in: requiredGameIds },
      gameType: 'teacher-education',
      fullyCompleted: true,
      userRole: 'school_teacher'
    });

    const completedGameIds = new Set(completedGames.map(g => g.gameId));
    const allCompleted = requiredGameIds.every(id => completedGameIds.has(id));

    return {
      allCompleted,
      completedCount: completedGameIds.size,
      totalRequired: requiredGameIds.length,
      completedGameIds: Array.from(completedGameIds),
      missingGameIds: requiredGameIds.filter(id => !completedGameIds.has(id))
    };
  } catch (error) {
    console.error('Error checking required mindful mastery games:', error);
    return {
      allCompleted: false,
      completedCount: 0,
      totalRequired: 5,
      completedGameIds: [],
      missingGameIds: []
    };
  }
};

/**
 * Check Mindful Mastery Badge status
 */
export const checkMindfulMasteryBadgeStatus = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { hasBadge: false, newlyEarned: false, error: 'User not found' };
    }

    const gamesStatus = await checkRequiredMindfulMasteryGamesCompleted(userId);

    // Check if user has the badge
    const hasBadge = user.badges?.some(
      badge => badge.name === 'Mindful Mastery' || badge.badgeId === 'mindful-mastery'
    ) || false;

    return {
      hasBadge,
      newlyEarned: false,
      ...gamesStatus
    };
  } catch (error) {
    console.error('Error checking Mindful Mastery Badge status:', error);
    return { hasBadge: false, newlyEarned: false, error: error.message };
  }
};

/**
 * Collect/Award Mindful Mastery Badge
 */
export const collectMindfulMasteryBadge = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if badge already exists
    const existingBadge = user.badges?.find(
      badge => badge.name === 'Mindful Mastery' || badge.badgeId === 'mindful-mastery'
    );

    if (existingBadge) {
      return {
        success: true,
        badgeEarned: false,
        alreadyEarned: true,
        badge: existingBadge,
        message: 'Badge already collected'
      };
    }

    // Verify all required games are completed
    const gamesStatus = await checkRequiredMindfulMasteryGamesCompleted(userId);

    if (!gamesStatus.allCompleted) {
      return {
        success: false,
        badgeEarned: false,
        error: 'All 5 mindfulness activities must be completed before collecting the badge',
        gamesStatus
      };
    }

    // Award the badge
    if (!user.badges) {
      user.badges = [];
    }

    const badgeData = {
      badgeId: 'mindful-mastery',
      name: 'Mindful Mastery',
      description: 'Sustain mindful habits daily.',
      earnedAt: new Date(),
      category: 'teacher-education',
      icon: '🧘',
      message: 'Your calm inspires clarity.'
    };

    user.badges.push(badgeData);
    await user.save();

    // Create notification
    await Notification.create({
      userId,
      type: 'achievement',
      title: '🏆 Mindful Mastery Badge Collected!',
      message: 'Congratulations! You\'ve successfully completed all mindfulness activities and collected your badge. Your calm inspires clarity.',
      metadata: {
        badgeId: 'mindful-mastery',
        badgeName: 'Mindful Mastery',
        gamesCompleted: gamesStatus.completedCount
      }
    });

    return {
      success: true,
      badgeEarned: true,
      alreadyEarned: false,
      badge: badgeData,
      gamesStatus,
      message: 'Badge collected successfully!'
    };
  } catch (error) {
    console.error('Error collecting Mindful Mastery Badge:', error);
    return {
      success: false,
      badgeEarned: false,
      error: error.message
    };
  }
};

/**
 * Check if all required games for Resilient Educator Badge are completed
 */
export const checkRequiredResilientEducatorGamesCompleted = async (userId) => {
  try {
    const requiredGameIds = [
      'teacher-education-51',  // The Bounce-Back Quiz
      'teacher-education-52',  // Growth Mindset Puzzle
      'teacher-education-53',  // Tough Day Simulation
      'teacher-education-56',  // Challenge Journal
      'teacher-education-59'   // Gratitude Ladder
    ];

    const completedGames = await UnifiedGameProgress.find({
      userId,
      gameId: { $in: requiredGameIds },
      gameType: 'teacher-education',
      fullyCompleted: true,
      userRole: 'school_teacher'
    });

    const completedGameIds = new Set(completedGames.map(g => g.gameId));
    const allCompleted = requiredGameIds.every(id => completedGameIds.has(id));

    return {
      allCompleted,
      completedCount: completedGameIds.size,
      totalRequired: requiredGameIds.length,
      completedGameIds: Array.from(completedGameIds),
      missingGameIds: requiredGameIds.filter(id => !completedGameIds.has(id))
    };
  } catch (error) {
    console.error('Error checking required Resilient Educator games:', error);
    return {
      allCompleted: false,
      completedCount: 0,
      totalRequired: 5,
      completedGameIds: [],
      missingGameIds: []
    };
  }
};

/**
 * Check Resilient Educator Badge Status
 */
export const checkResilientEducatorBadgeStatus = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { hasBadge: false, newlyEarned: false, error: 'User not found' };
    }

    // Check games completion status
    const gamesStatus = await checkRequiredResilientEducatorGamesCompleted(userId);

    // Check if user has the badge
    const hasBadge = user.badges?.some(
      badge => badge.name === 'Resilient Educator' || badge.badgeId === 'resilient-educator'
    ) || false;

    return {
      hasBadge,
      newlyEarned: false,
      ...gamesStatus
    };
  } catch (error) {
    console.error('Error checking Resilient Educator Badge status:', error);
    return { hasBadge: false, newlyEarned: false, error: error.message };
  }
};

/**
 * Collect/Award Resilient Educator Badge
 */
export const collectResilientEducatorBadge = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if badge already exists
    const existingBadge = user.badges?.find(
      badge => badge.name === 'Resilient Educator' || badge.badgeId === 'resilient-educator'
    );

    if (existingBadge) {
      return {
        success: true,
        badgeEarned: false,
        alreadyEarned: true,
        badge: existingBadge,
        message: 'Badge already collected'
      };
    }

    // Verify all required games are completed
    const gamesStatus = await checkRequiredResilientEducatorGamesCompleted(userId);

    if (!gamesStatus.allCompleted) {
      return {
        success: false,
        badgeEarned: false,
        error: 'All 5 resilience activities must be completed before collecting the badge',
        gamesStatus
      };
    }

    // Award the badge
    if (!user.badges) {
      user.badges = [];
    }

    const badgeData = {
      badgeId: 'resilient-educator',
      name: 'Resilient Educator',
      description: 'Display consistent bounce-back behaviors.',
      earnedAt: new Date(),
      category: 'teacher-education',
      icon: '🏆',
      message: 'Your strength lifts others.'
    };

    user.badges.push(badgeData);
    await user.save();

    // Create notification
    await Notification.create({
      userId,
      type: 'achievement',
      title: '🏆 Resilient Educator Badge Collected!',
      message: 'Congratulations! You\'ve successfully completed all resilience activities and collected your badge. Your strength lifts others.',
      metadata: {
        badgeId: 'resilient-educator',
        badgeName: 'Resilient Educator',
        gamesCompleted: gamesStatus.completedCount
      }
    });

    return {
      success: true,
      badgeEarned: true,
      alreadyEarned: false,
      badge: badgeData,
      gamesStatus,
      message: 'Badge collected successfully!'
    };
  } catch (error) {
    console.error('Error collecting Resilient Educator Badge:', error);
    return {
      success: false,
      badgeEarned: false,
      error: error.message
    };
  }
};

/**
 * GET /api/school/teacher/badge/resilient-educator
 * Get Resilient Educator Badge status
 */
export const getResilientEducatorBadgeStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate teacher role
    if (req.user.role !== 'school_teacher') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers can access teacher badges'
      });
    }

    const result = await checkResilientEducatorBadgeStatus(userId);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error getting Resilient Educator Badge status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get badge status',
      message: error.message
    });
  }
};

/**
 * POST /api/school/teacher/badge/resilient-educator/collect
 * Collect Resilient Educator Badge
 */
export const collectResilientEducatorBadgeEndpoint = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate teacher role
    if (req.user.role !== 'school_teacher') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers can collect teacher badges'
      });
    }

    const result = await collectResilientEducatorBadge(userId);

    if (result.success) {
      res.json({
        success: true,
        ...result
      });
    } else {
      res.status(400).json({
        success: false,
        ...result
      });
    }
  } catch (error) {
    console.error('Error collecting Resilient Educator Badge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect badge',
      message: error.message
    });
  }
};

/**
 * Check if all required Clear Communicator games are completed
 */
export const checkRequiredClearCommunicatorGamesCompleted = async (userId) => {
  try {
    const requiredGameIds = [
      'teacher-education-61',  // Communication game 1
      'teacher-education-62',  // Communication game 2
      'teacher-education-63',  // Communication game 3
      'teacher-education-64',  // Communication game 4
      'teacher-education-65'   // Communication game 5
    ];

    const completedGames = await UnifiedGameProgress.find({
      userId,
      gameId: { $in: requiredGameIds },
      gameType: 'teacher-education',
      fullyCompleted: true,
      userRole: 'school_teacher'
    });

    const completedGameIds = new Set(completedGames.map(g => g.gameId));
    const allCompleted = requiredGameIds.every(id => completedGameIds.has(id));

    return {
      allCompleted,
      completedCount: completedGameIds.size,
      totalRequired: requiredGameIds.length,
      completedGameIds: Array.from(completedGameIds),
      missingGameIds: requiredGameIds.filter(id => !completedGameIds.has(id))
    };
  } catch (error) {
    console.error('Error checking required Clear Communicator games:', error);
    return {
      allCompleted: false,
      completedCount: 0,
      totalRequired: 5,
      completedGameIds: [],
      missingGameIds: []
    };
  }
};

/**
 * Check Clear Communicator Badge status
 */
export const checkClearCommunicatorBadgeStatus = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { hasBadge: false, newlyEarned: false, error: 'User not found' };
    }

    const gamesStatus = await checkRequiredClearCommunicatorGamesCompleted(userId);

    // Check if user has the badge
    const hasBadge = user.badges?.some(
      badge => badge.name === 'Clear Communicator' || badge.badgeId === 'clear-communicator'
    ) || false;

    return {
      hasBadge,
      newlyEarned: false,
      ...gamesStatus
    };
  } catch (error) {
    console.error('Error checking Clear Communicator Badge status:', error);
    return { hasBadge: false, newlyEarned: false, error: error.message };
  }
};

/**
 * Collect/Award Clear Communicator Badge
 */
export const collectClearCommunicatorBadge = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if badge already exists
    const existingBadge = user.badges?.find(
      badge => badge.name === 'Clear Communicator' || badge.badgeId === 'clear-communicator'
    );

    if (existingBadge) {
      return {
        success: true,
        badgeEarned: false,
        alreadyEarned: true,
        badge: existingBadge,
        message: 'Badge already collected'
      };
    }

    // Verify all required games are completed
    const gamesStatus = await checkRequiredClearCommunicatorGamesCompleted(userId);

    if (!gamesStatus.allCompleted) {
      return {
        success: false,
        badgeEarned: false,
        error: 'All 5 communication activities must be completed before collecting the badge',
        gamesStatus
      };
    }

    // Award the badge
    if (!user.badges) {
      user.badges = [];
    }

    const badgeData = {
      badgeId: 'clear-communicator',
      name: 'Clear Communicator',
      description: 'Practice clear and compassionate communication.',
      earnedAt: new Date(),
      category: 'teacher-education',
      icon: '💬',
      message: 'Clear words create calm connections.'
    };

    user.badges.push(badgeData);
    await user.save();

    // Create notification
    await Notification.create({
      userId,
      type: 'achievement',
      title: '🏆 Clear Communicator Badge Collected!',
      message: 'Congratulations! You\'ve successfully completed all communication activities and collected your badge. Clear words create calm connections.',
      metadata: {
        badgeId: 'clear-communicator',
        badgeName: 'Clear Communicator',
        gamesCompleted: gamesStatus.completedCount
      }
    });

    return {
      success: true,
      badgeEarned: true,
      alreadyEarned: false,
      badge: badgeData,
      gamesStatus,
      message: 'Badge collected successfully!'
    };
  } catch (error) {
    console.error('Error collecting Clear Communicator Badge:', error);
    return {
      success: false,
      badgeEarned: false,
      error: error.message
    };
  }
};

/**
 * GET /api/school/teacher/badge/clear-communicator
 * Get Clear Communicator Badge status
 */
export const getClearCommunicatorBadgeStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate teacher role
    if (req.user.role !== 'school_teacher') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers can access teacher badges'
      });
    }

    const result = await checkClearCommunicatorBadgeStatus(userId);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error getting Clear Communicator Badge status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get badge status',
      message: error.message
    });
  }
};

/**
 * POST /api/school/teacher/badge/clear-communicator/collect
 * Collect Clear Communicator Badge
 */
export const collectClearCommunicatorBadgeEndpoint = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate teacher role
    if (req.user.role !== 'school_teacher') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers can collect teacher badges'
      });
    }

    const result = await collectClearCommunicatorBadge(userId);

    if (result.success) {
      res.json({
        success: true,
        ...result
      });
    } else {
      res.status(400).json({
        success: false,
        ...result
      });
    }
  } catch (error) {
    console.error('Error collecting Clear Communicator Badge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect badge',
      message: error.message
    });
  }
};

/**
 * GET /api/school/teacher/badge/mindful-mastery
 * Get Mindful Mastery Badge status
 */
export const getMindfulMasteryBadgeStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate teacher role
    if (req.user.role !== 'school_teacher') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers can access teacher badges'
      });
    }

    const result = await checkMindfulMasteryBadgeStatus(userId);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error getting Mindful Mastery Badge status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get badge status',
      message: error.message
    });
  }
};

/**
 * POST /api/school/teacher/badge/mindful-mastery/collect
 * Collect Mindful Mastery Badge
 */
export const collectMindfulMasteryBadgeEndpoint = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate teacher role
    if (req.user.role !== 'school_teacher') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers can collect teacher badges'
      });
    }

    const result = await collectMindfulMasteryBadge(userId);

    if (result.success) {
      res.json({
        success: true,
        ...result
      });
    } else {
      res.status(400).json({
        success: false,
        ...result
      });
    }
  } catch (error) {
    console.error('Error collecting Mindful Mastery Badge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect badge',
      message: error.message
    });
  }
};

/**
 * GET /api/school/teacher/badge/calm-teacher
 * Get Calm Teacher Badge status
 */
export const getCalmTeacherBadgeStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate teacher role
    if (req.user.role !== 'school_teacher') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers can access teacher badges'
      });
    }

    const result = await checkCalmTeacherBadgeStatus(userId);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error getting Calm Teacher Badge status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get badge status',
      message: error.message
    });
  }
};

/**
 * POST /api/school/teacher/badge/calm-teacher/collect
 * Collect Calm Teacher Badge
 */
export const collectCalmTeacherBadgeEndpoint = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate teacher role
    if (req.user.role !== 'school_teacher') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers can collect teacher badges'
      });
    }

    const result = await collectCalmTeacherBadge(userId);

    if (result.success) {
      res.json({
        success: true,
        ...result
      });
    } else {
      res.status(400).json({
        success: false,
        ...result
      });
    }
  } catch (error) {
    console.error('Error collecting Calm Teacher Badge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect badge',
      message: error.message
    });
  }
};

/**
 * Check if all required Connected Teacher games are completed
 */
export const checkRequiredConnectedTeacherGamesCompleted = async (userId) => {
  try {
    const requiredGameIds = [
      'teacher-education-71',  // The Support Circle
      'teacher-education-74',  // Team Gratitude Wall
      'teacher-education-76',  // Encourage-a-Colleague Challenge
      'teacher-education-78',  // Staffroom Connection Map
      'teacher-education-79'   // Team Harmony Simulation
    ];

    const completedGames = await UnifiedGameProgress.find({
      userId,
      gameId: { $in: requiredGameIds },
      gameType: 'teacher-education',
      fullyCompleted: true,
      userRole: 'school_teacher'
    });

    const completedGameIds = new Set(completedGames.map(g => g.gameId));
    const allCompleted = requiredGameIds.every(id => completedGameIds.has(id));

    return {
      allCompleted,
      completedCount: completedGameIds.size,
      totalRequired: requiredGameIds.length,
      completedGameIds: Array.from(completedGameIds),
      missingGameIds: requiredGameIds.filter(id => !completedGameIds.has(id)),
      requiredGames: requiredGameIds.map(id => ({
        gameId: id,
        completed: completedGameIds.has(id)
      }))
    };
  } catch (error) {
    console.error('Error checking required Connected Teacher games:', error);
    return {
      allCompleted: false,
      completedCount: 0,
      totalRequired: 5,
      completedGameIds: [],
      missingGameIds: [],
      requiredGames: []
    };
  }
};

/**
 * Check Connected Teacher Badge status
 */
export const checkConnectedTeacherBadgeStatus = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return {
        hasBadge: false,
        newlyEarned: false
      };
    }

    const hasBadge = user.badges?.some(badge => 
      badge.badgeId === 'connected-teacher' && badge.earned === true
    );

    const newlyEarned = user.badges?.some(badge => 
      badge.badgeId === 'connected-teacher' && badge.newlyEarned === true
    );

    const gamesStatus = await checkRequiredConnectedTeacherGamesCompleted(userId);

    return {
      hasBadge: hasBadge || false,
      newlyEarned: newlyEarned || false,
      ...gamesStatus
    };
  } catch (error) {
    console.error('Error checking Connected Teacher Badge status:', error);
    return {
      hasBadge: false,
      newlyEarned: false,
      allCompleted: false,
      completedCount: 0,
      totalRequired: 5
    };
  }
};

/**
 * Collect Connected Teacher Badge
 */
export const collectConnectedTeacherBadge = async (userId) => {
  try {
    const gamesStatus = await checkRequiredConnectedTeacherGamesCompleted(userId);
    
    if (!gamesStatus.allCompleted) {
      return {
        success: false,
        error: 'Not all required games are completed',
        gamesStatus
      };
    }

    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Check if badge already exists
    const existingBadgeIndex = user.badges?.findIndex(badge => 
      badge.badgeId === 'connected-teacher'
    );

    let newlyEarned = false;

    if (existingBadgeIndex >= 0) {
      // Update existing badge
      if (!user.badges[existingBadgeIndex].earned) {
        user.badges[existingBadgeIndex].earned = true;
        user.badges[existingBadgeIndex].earnedAt = new Date();
        user.badges[existingBadgeIndex].newlyEarned = true;
        newlyEarned = true;
      }
    } else {
      // Add new badge
      if (!user.badges) {
        user.badges = [];
      }
      user.badges.push({
        badgeId: 'connected-teacher',
        badgeName: 'Connected Teacher',
        earned: true,
        earnedAt: new Date(),
        newlyEarned: true
      });
      newlyEarned = true;
    }

    await user.save();

    // Create notification
    if (newlyEarned) {
      try {
        await Notification.create({
          userId,
          type: 'badge_earned',
          title: 'Connected Teacher Badge Earned!',
          message: 'You\'ve earned the Connected Teacher Badge! "Connection creates calm."',
          relatedId: 'connected-teacher',
          relatedType: 'badge'
        });
      } catch (notifError) {
        console.error('Error creating notification:', notifError);
      }
    }

    return {
      success: true,
      newlyEarned,
      badge: {
        badgeId: 'connected-teacher',
        badgeName: 'Connected Teacher',
        earned: true,
        earnedAt: user.badges.find(b => b.badgeId === 'connected-teacher')?.earnedAt
      }
    };
  } catch (error) {
    console.error('Error collecting Connected Teacher Badge:', error);
    return {
      success: false,
      error: 'Failed to collect badge',
      message: error.message
    };
  }
};

/**
 * GET /api/school/teacher/badge/connected-teacher
 * Get Connected Teacher Badge status
 */
export const getConnectedTeacherBadgeStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate teacher role
    if (req.user.role !== 'school_teacher') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers can access teacher badges'
      });
    }

    const result = await checkConnectedTeacherBadgeStatus(userId);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error getting Connected Teacher Badge status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get badge status',
      message: error.message
    });
  }
};

/**
 * POST /api/school/teacher/badge/connected-teacher/collect
 * Collect Connected Teacher Badge
 */
export const collectConnectedTeacherBadgeEndpoint = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate teacher role
    if (req.user.role !== 'school_teacher') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers can collect teacher badges'
      });
    }

    const result = await collectConnectedTeacherBadge(userId);

    if (result.success) {
      res.json({
        success: true,
        ...result
      });
    } else {
      res.status(400).json({
        success: false,
        ...result
      });
    }
  } catch (error) {
    console.error('Error collecting Connected Teacher Badge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect badge',
      message: error.message
    });
  }
};

/**
 * Check if all required Purposeful Teacher games are completed
 */
export const checkRequiredPurposefulTeacherGamesCompleted = async (userId) => {
  try {
    const requiredGameIds = [
      'teacher-education-81',  // Why I Teach
      'teacher-education-85',  // Meaning in the Moment
      'teacher-education-86',  // Fulfillment Journal
      'teacher-education-87',  // Impact Visualization
      'teacher-education-82'   // The Ripple Effect
    ];

    const completedGames = await UnifiedGameProgress.find({
      userId,
      gameId: { $in: requiredGameIds },
      gameType: 'teacher-education',
      fullyCompleted: true,
      userRole: 'school_teacher'
    });

    const completedGameIds = new Set(completedGames.map(g => g.gameId));
    const allCompleted = requiredGameIds.every(id => completedGameIds.has(id));

    return {
      allCompleted,
      completedCount: completedGameIds.size,
      totalRequired: requiredGameIds.length,
      completedGameIds: Array.from(completedGameIds),
      missingGameIds: requiredGameIds.filter(id => !completedGameIds.has(id)),
      requiredGames: requiredGameIds.map(id => ({
        gameId: id,
        completed: completedGameIds.has(id)
      }))
    };
  } catch (error) {
    console.error('Error checking required Purposeful Teacher games:', error);
    return {
      allCompleted: false,
      completedCount: 0,
      totalRequired: 5,
      completedGameIds: [],
      missingGameIds: [],
      requiredGames: []
    };
  }
};

/**
 * Check Purposeful Teacher Badge status
 */
export const checkPurposefulTeacherBadgeStatus = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return {
        hasBadge: false,
        newlyEarned: false
      };
    }

    const hasBadge = user.badges?.some(badge => 
      badge.badgeId === 'purposeful-teacher' && badge.earned === true
    );

    const newlyEarned = user.badges?.some(badge => 
      badge.badgeId === 'purposeful-teacher' && badge.newlyEarned === true
    );

    const gamesStatus = await checkRequiredPurposefulTeacherGamesCompleted(userId);

    return {
      hasBadge: hasBadge || false,
      newlyEarned: newlyEarned || false,
      ...gamesStatus
    };
  } catch (error) {
    console.error('Error checking Purposeful Teacher Badge status:', error);
    return {
      hasBadge: false,
      newlyEarned: false,
      allCompleted: false,
      completedCount: 0,
      totalRequired: 5
    };
  }
};

/**
 * Collect Purposeful Teacher Badge
 */
export const collectPurposefulTeacherBadge = async (userId) => {
  try {
    const gamesStatus = await checkRequiredPurposefulTeacherGamesCompleted(userId);
    
    if (!gamesStatus.allCompleted) {
      return {
        success: false,
        error: 'Not all required games are completed',
        gamesStatus
      };
    }

    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Check if badge already exists
    const existingBadgeIndex = user.badges?.findIndex(badge => 
      badge.badgeId === 'purposeful-teacher'
    );

    let newlyEarned = false;

    if (existingBadgeIndex >= 0) {
      // Update existing badge
      if (!user.badges[existingBadgeIndex].earned) {
        user.badges[existingBadgeIndex].earned = true;
        user.badges[existingBadgeIndex].earnedAt = new Date();
        user.badges[existingBadgeIndex].newlyEarned = true;
        newlyEarned = true;
      }
    } else {
      // Add new badge
      if (!user.badges) {
        user.badges = [];
      }
      user.badges.push({
        badgeId: 'purposeful-teacher',
        badgeName: 'Purposeful Teacher',
        earned: true,
        earnedAt: new Date(),
        newlyEarned: true
      });
      newlyEarned = true;
    }

    await user.save();

    // Create notification
    if (newlyEarned) {
      try {
        await Notification.create({
          userId,
          type: 'badge_earned',
          title: 'Purposeful Teacher Badge Earned!',
          message: 'You\'ve earned the Purposeful Teacher Badge! "Your purpose lights paths."',
          relatedId: 'purposeful-teacher',
          relatedType: 'badge'
        });
      } catch (notifError) {
        console.error('Error creating notification:', notifError);
      }
    }

    return {
      success: true,
      newlyEarned,
      badge: {
        badgeId: 'purposeful-teacher',
        badgeName: 'Purposeful Teacher',
        earned: true,
        earnedAt: user.badges.find(b => b.badgeId === 'purposeful-teacher')?.earnedAt
      }
    };
  } catch (error) {
    console.error('Error collecting Purposeful Teacher Badge:', error);
    return {
      success: false,
      error: 'Failed to collect badge',
      message: error.message
    };
  }
};

/**
 * GET /api/school/teacher/badge/purposeful-teacher
 * Get Purposeful Teacher Badge status
 */
export const getPurposefulTeacherBadgeStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate teacher role
    if (req.user.role !== 'school_teacher') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers can access teacher badges'
      });
    }

    const result = await checkPurposefulTeacherBadgeStatus(userId);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error getting Purposeful Teacher Badge status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get badge status',
      message: error.message
    });
  }
};

/**
 * POST /api/school/teacher/badge/purposeful-teacher/collect
 * Collect Purposeful Teacher Badge
 */
export const collectPurposefulTeacherBadgeEndpoint = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate teacher role
    if (req.user.role !== 'school_teacher') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers can collect teacher badges'
      });
    }

    const result = await collectPurposefulTeacherBadge(userId);

    if (result.success) {
      res.json({
        success: true,
        ...result
      });
    } else {
      res.status(400).json({
        success: false,
        ...result
      });
    }
  } catch (error) {
    console.error('Error collecting Purposeful Teacher Badge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect badge',
      message: error.message
    });
  }
};

/**
 * Check if all required Self-Care Champion games are completed
 */
export const checkRequiredSelfCareChampionGamesCompleted = async (userId) => {
  try {
    const requiredGameIds = [
      'teacher-education-93',  // Evening Log-Off Ritual
      'teacher-education-95',  // Morning Nourish Routine
      'teacher-education-96',  // Nature Reconnect Challenge
      'teacher-education-91',  // Screen-Time Mirror
      'teacher-education-99'   // Silence & Stillness Practice
    ];

    const completedGames = await UnifiedGameProgress.find({
      userId,
      gameId: { $in: requiredGameIds },
      gameType: 'teacher-education',
      fullyCompleted: true,
      userRole: 'school_teacher'
    });

    const completedGameIds = new Set(completedGames.map(g => g.gameId));
    const allCompleted = requiredGameIds.every(id => completedGameIds.has(id));

    return {
      allCompleted,
      completedCount: completedGameIds.size,
      totalRequired: requiredGameIds.length,
      completedGameIds: Array.from(completedGameIds),
      missingGameIds: requiredGameIds.filter(id => !completedGameIds.has(id)),
      requiredGames: requiredGameIds.map(id => ({
        gameId: id,
        completed: completedGameIds.has(id)
      }))
    };
  } catch (error) {
    console.error('Error checking required Self-Care Champion games:', error);
    return {
      allCompleted: false,
      completedCount: 0,
      totalRequired: 5,
      completedGameIds: [],
      missingGameIds: [],
      requiredGames: []
    };
  }
};

/**
 * Check Self-Care Champion Badge status
 */
export const checkSelfCareChampionBadgeStatus = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return {
        hasBadge: false,
        newlyEarned: false
      };
    }

    const hasBadge = user.badges?.some(badge => 
      badge.badgeId === 'self-care-champion' && badge.earned === true
    );

    const newlyEarned = user.badges?.some(badge => 
      badge.badgeId === 'self-care-champion' && badge.newlyEarned === true
    );

    const gamesStatus = await checkRequiredSelfCareChampionGamesCompleted(userId);

    return {
      hasBadge: hasBadge || false,
      newlyEarned: newlyEarned || false,
      ...gamesStatus
    };
  } catch (error) {
    console.error('Error checking Self-Care Champion Badge status:', error);
    return {
      hasBadge: false,
      newlyEarned: false,
      allCompleted: false,
      completedCount: 0,
      totalRequired: 5
    };
  }
};

/**
 * Collect Self-Care Champion Badge
 */
export const collectSelfCareChampionBadge = async (userId) => {
  try {
    const gamesStatus = await checkRequiredSelfCareChampionGamesCompleted(userId);
    
    if (!gamesStatus.allCompleted) {
      return {
        success: false,
        error: 'Not all required games are completed',
        gamesStatus
      };
    }

    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Check if badge already exists
    const existingBadgeIndex = user.badges?.findIndex(badge => 
      badge.badgeId === 'self-care-champion'
    );

    let newlyEarned = false;

    if (existingBadgeIndex >= 0) {
      // Update existing badge
      if (!user.badges[existingBadgeIndex].earned) {
        user.badges[existingBadgeIndex].earned = true;
        user.badges[existingBadgeIndex].earnedAt = new Date();
        user.badges[existingBadgeIndex].newlyEarned = true;
        newlyEarned = true;
      }
    } else {
      // Add new badge
      if (!user.badges) {
        user.badges = [];
      }
      user.badges.push({
        badgeId: 'self-care-champion',
        badgeName: 'Self-Care Champion',
        earned: true,
        earnedAt: new Date(),
        newlyEarned: true
      });
      newlyEarned = true;
    }

    await user.save();

    // Create notification
    if (newlyEarned) {
      try {
        await Notification.create({
          userId,
          type: 'badge_earned',
          title: 'Self-Care Champion Badge Earned!',
          message: 'You\'ve earned the Self-Care Champion Badge! "When you rest, your light grows brighter."',
          relatedId: 'self-care-champion',
          relatedType: 'badge'
        });
      } catch (notifError) {
        console.error('Error creating notification:', notifError);
      }
    }

    return {
      success: true,
      newlyEarned,
      badge: {
        badgeId: 'self-care-champion',
        badgeName: 'Self-Care Champion',
        earned: true,
        earnedAt: user.badges.find(b => b.badgeId === 'self-care-champion')?.earnedAt
      }
    };
  } catch (error) {
    console.error('Error collecting Self-Care Champion Badge:', error);
    return {
      success: false,
      error: 'Failed to collect badge',
      message: error.message
    };
  }
};

/**
 * GET /api/school/teacher/badge/self-care-champion
 * Get Self-Care Champion Badge status
 */
export const getSelfCareChampionBadgeStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate teacher role
    if (req.user.role !== 'school_teacher') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers can access teacher badges'
      });
    }

    const result = await checkSelfCareChampionBadgeStatus(userId);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error getting Self-Care Champion Badge status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get badge status',
      message: error.message
    });
  }
};

/**
 * POST /api/school/teacher/badge/self-care-champion/collect
 * Collect Self-Care Champion Badge
 */
export const collectSelfCareChampionBadgeEndpoint = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate teacher role
    if (req.user.role !== 'school_teacher') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers can collect teacher badges'
      });
    }

    const result = await collectSelfCareChampionBadge(userId);

    if (result.success) {
      res.json({
        success: true,
        ...result
      });
    } else {
      res.status(400).json({
        success: false,
        ...result
      });
    }
  } catch (error) {
    console.error('Error collecting Self-Care Champion Badge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect badge',
      message: error.message
    });
  }
};

