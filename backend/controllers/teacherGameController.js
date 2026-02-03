import UnifiedGameProgress from '../models/UnifiedGameProgress.js';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';

/**
 * Calculate CalmCoins reward based on game index
 */
const getCalmCoinsForGame = (gameIndex) => {
  if (!gameIndex || gameIndex <= 0) return 5;
  if (gameIndex <= 25) return 5;   // Games 1-25: 5 CalmCoins
  if (gameIndex <= 50) return 10;  // Games 26-50: 10 CalmCoins
  if (gameIndex <= 75) return 15;  // Games 51-75: 15 CalmCoins
  return 20;                        // Games 76-100: 20 CalmCoins
};

/**
 * Calculate replay cost based on game index
 */
const getReplayCostForGame = (gameIndex) => {
  if (!gameIndex || gameIndex <= 0) return 2;
  if (gameIndex <= 25) return 2;   // Games 1-25: 2 CalmCoins
  if (gameIndex <= 50) return 4;   // Games 26-50: 4 CalmCoins
  if (gameIndex <= 75) return 6;   // Games 51-75: 6 CalmCoins
  return 8;                        // Games 76-100: 8 CalmCoins
};

/**
 * POST /api/teacher/game/complete
 * Complete a teacher game and award CalmCoins
 */
export const completeTeacherGame = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      gameId,
      gameType = 'teacher-education',
      gameIndex,
      score = 0,
      totalLevels = 5,
      totalCoins = null,
      isFullCompletion = true,
      isReplay = false
    } = req.body;

    // Validate teacher role
    if (req.user.role !== 'school_teacher') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers can complete teacher games'
      });
    }

    // Validate: Teacher games always have 5 questions
    if (totalLevels !== 5) {
      return res.status(400).json({
        success: false,
        error: 'Teacher games must have exactly 5 questions',
        received: totalLevels
      });
    }

    // Calculate CalmCoins from gameIndex (if not provided)
    const calculatedCalmCoins = gameIndex ? getCalmCoinsForGame(gameIndex) : (totalCoins || 5);
    const calmCoinsToAward = totalCoins || calculatedCalmCoins;

    // Find or create game progress
    let gameProgress = await UnifiedGameProgress.findOne({
      userId,
      gameId,
      gameType
    });

    if (!gameProgress) {
      gameProgress = new UnifiedGameProgress({
        userId,
        gameId,
        gameType,
        userRole: 'school_teacher',
        levelsCompleted: 0,
        totalLevels: 5,
        fullyCompleted: false,
        replayUnlocked: false,
        totalCoinsEarned: 0
      });
    }

    // Check if this is a replay attempt
    const isReplayAttempt = isReplay === true ||
      (gameProgress.fullyCompleted && gameProgress.replayUnlocked === true);

    // Check if all 5 questions were answered correctly
    const allAnswersCorrect = score === 5 && totalLevels === 5;

    let calmCoinsEarned = 0;
    let newBalance = 0;

    // Award CalmCoins ONLY if:
    // 1. First-time completion (not replay)
    // 2. All 5 questions answered correctly
    if (!isReplayAttempt && !gameProgress.fullyCompleted && allAnswersCorrect) {
      // First-time completion with all correct - award CalmCoins
      calmCoinsEarned = calmCoinsToAward;

      // Update wallet with CalmCoins
      let wallet = await Wallet.findOne({ userId });
      if (!wallet) {
        wallet = new Wallet({ userId, balance: 0 });
      }
      wallet.balance += calmCoinsEarned;
      wallet.lastUpdated = new Date();
      await wallet.save();
      newBalance = wallet.balance;

      // Create transaction with CalmCoins type
      await Transaction.create({
        userId,
        type: 'credit',
        amount: calmCoinsEarned,
        description: `CalmCoins earned from ${gameId} (5/5 correct)`,
        coinType: 'calmcoins' // Differentiate from HealCoins
      });

      // Update game progress
      gameProgress.totalCoinsEarned += calmCoinsEarned;
      gameProgress.coinsEarnedHistory = gameProgress.coinsEarnedHistory || [];
      gameProgress.coinsEarnedHistory.push({
        amount: calmCoinsEarned,
        reason: 'full-completion',
        earnedAt: new Date()
      });
      gameProgress.fullyCompleted = true;
    } else if (isReplayAttempt) {
      // Replay - no coins awarded, lock game again
      gameProgress.replayUnlocked = false;
      gameProgress.replayUnlockedAt = null;

      // Get current wallet balance for response
      const wallet = await Wallet.findOne({ userId });
      newBalance = wallet?.balance || 0;
    } else {
      // Not all answers correct or already completed - get current balance
      const wallet = await Wallet.findOne({ userId });
      newBalance = wallet?.balance || 0;
    }

    // Update game progress
    
    gameProgress.levelsCompleted = Math.max(gameProgress.levelsCompleted, totalLevels);
    gameProgress.highestScore = Math.max(gameProgress.highestScore, score);
    gameProgress.lastPlayedAt = new Date();
    await gameProgress.save();

    // Emit socket event for real-time wallet update
    const io = req.app.get('io');
    if (io && calmCoinsEarned > 0) {
      io.to(userId.toString()).emit('wallet:updated', {
        newBalance,
        calmCoinsEarned
      });
    }

    res.json({
      success: true,
      calmCoinsEarned,
      newBalance,
      fullyCompleted: true,
      allAnswersCorrect,
      replayUnlocked: gameProgress.replayUnlocked,
      score,
      totalLevels: 5
    });
  } catch (error) {
    console.error('Error completing teacher game:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete game',
      message: error.message
    });
  }
};

/**
 * GET /api/teacher/game/progress/:gameId
 * Get game progress for a teacher game
 */
export const getTeacherGameProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { gameId } = req.params;

    // Validate teacher role
    if (req.user.role !== 'school_teacher') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers can access teacher game progress'
      });
    }

    const gameProgress = await UnifiedGameProgress.findOne({
      userId,
      gameId,
      userRole: 'school_teacher'
    });

    if (!gameProgress) {
      return res.json({
        success: true,
        levelsCompleted: 0,
        totalCoinsEarned: 0,
        fullyCompleted: false,
        replayUnlocked: false
      });
    }

    res.json({
      success: true,
      levelsCompleted: gameProgress.levelsCompleted || 0,
      totalCoinsEarned: gameProgress.totalCoinsEarned || 0,
      fullyCompleted: gameProgress.fullyCompleted || false,
      replayUnlocked: gameProgress.replayUnlocked || false,
      highestScore: gameProgress.highestScore || 0
    });
  } catch (error) {
    console.error('Error getting teacher game progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get game progress',
      message: error.message
    });
  }
};

/**
 * POST /api/teacher/game/unlock-replay/:gameId
 * Unlock replay for a completed teacher game
 */
export const unlockTeacherGameReplay = async (req, res) => {
  try {
    const userId = req.user._id;
    const { gameId } = req.params;

    // Validate teacher role
    if (req.user.role !== 'school_teacher') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers can unlock teacher game replay'
      });
    }

    // Extract game index from gameId (format: teacher-education-1)
    const gameIdParts = gameId.split('-');
    const gameIndex = gameIdParts.length >= 3 ?
      parseInt(gameIdParts[gameIdParts.length - 1], 10) : null;

    const replayCost = getReplayCostForGame(gameIndex);

    // Check if game progress exists and is completed
    const gameProgress = await UnifiedGameProgress.findOne({
      userId,
      gameId,
      userRole: 'school_teacher'
    });

    if (!gameProgress) {
      return res.status(400).json({
        success: false,
        error: 'Game progress not found. Please complete the game first.'
      });
    }

    if (!gameProgress.fullyCompleted) {
      return res.status(400).json({
        success: false,
        error: 'Game must be completed before it can be replayed'
      });
    }

    // Check if already unlocked
    if (gameProgress.replayUnlocked) {
      const wallet = await Wallet.findOne({ userId });
      return res.json({
        success: true,
        message: 'Game is already unlocked for replay',
        replayUnlocked: true,
        newBalance: wallet?.balance || 0
      });
    }

    // Check wallet balance (CalmCoins)
    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      wallet = new Wallet({ userId, balance: 0 });
    }

    if (wallet.balance < replayCost) {
      return res.status(400).json({
        success: false,
        error: `Insufficient balance. You need ${replayCost} CalmCoins to unlock replay.`,
        required: replayCost,
        currentBalance: wallet.balance
      });
    }

    // Deduct CalmCoins from wallet
    wallet.balance -= replayCost;
    wallet.lastUpdated = new Date();
    await wallet.save();

    // Record transaction
    await Transaction.create({
      userId,
      type: 'debit',
      amount: replayCost,
      description: `Unlock replay for ${gameId} game`,
      coinType: 'calmcoins'
    });

    // Unlock replay
    gameProgress.replayUnlocked = true;
    gameProgress.replayUnlockedAt = new Date();
    await gameProgress.save();

    // Emit socket event for real-time wallet update
    const io = req.app.get('io');
    if (io) {
      io.to(userId.toString()).emit('wallet:updated', {
        newBalance: wallet.balance
      });
    }

    res.json({
      success: true,
      message: 'Replay unlocked successfully',
      replayUnlocked: true,
      newBalance: wallet.balance,
      replayCost
    });
  } catch (error) {
    console.error('Error unlocking teacher game replay:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to unlock replay',
      message: error.message
    });
  }
};

