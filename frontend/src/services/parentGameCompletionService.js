import api from '../utils/api';
import { toast } from 'react-toastify';

/**
 * Parent Game Completion Service
 * Handles Healcoins for parent games (no XP/Level system)
 */
class ParentGameCompletionService {
  constructor() {
    this.completedGames = new Map();
  }

  /**
   * Complete a parent game and award Healcoins
   * @param {Object} gameData - Game completion data
   * @param {string} gameData.gameId - Unique game identifier
   * @param {string} gameData.gameType - Game category ('parent-education')
   * @param {number} gameData.gameIndex - 1-based game index
   * @param {number} gameData.score - Number of correct answers (0-5)
   * @param {number} gameData.totalLevels - Total questions (always 5 for parent games)
   * @param {number} gameData.totalCoins - Healcoins for this game (5/10/15/20)
   * @param {boolean} gameData.isReplay - Whether this is a replay attempt
   * @returns {Promise<Object>} - Completion result with Healcoins earned
   */
  async completeGame(gameData) {
    try {
      const {
        gameId,
        gameType = 'parent-education',
        gameIndex,
        score = 0,
        totalLevels = 5,
        totalCoins = null,
        isReplay = false
      } = gameData;

      // Validate required data
      if (!gameId) {
        throw new Error('Game ID is required');
      }

      // Get current completion status from backend
      const progressResponse = await api.get(`/api/parent/game/progress/${gameId}`);
      const currentProgress = progressResponse.data || {
        levelsCompleted: 0,
        totalCoinsEarned: 0,
        fullyCompleted: false,
        replayUnlocked: false
      };

      // Check if this is a replay attempt
      const isReplayAttempt = isReplay === true || 
        (currentProgress.fullyCompleted && currentProgress.replayUnlocked === true);

      // Send completion data to backend
      console.log('📤 Sending parent game completion to backend:', {
        gameId,
        gameType,
        gameIndex,
        score,
        totalLevels,
        totalCoins,
        isReplayAttempt
      });

      // Only mark as fully completed if all answers are correct (score === totalLevels)
      const allAnswersCorrect = score === totalLevels;
      
      const response = await api.post('/api/parent/game/complete', {
        gameId,
        gameType,
        gameIndex,
        score,
        totalLevels,
        totalCoins,
        isFullCompletion: allAnswersCorrect, // Only true if all answers are correct
        isReplay: isReplayAttempt,
        allAnswersCorrect: allAnswersCorrect
      });

      const result = response.data;

      if (result.success) {
        // Dispatch game completion event
        window.dispatchEvent(new CustomEvent('parentGameCompleted', {
          detail: {
            gameId,
            fullyCompleted: true,
            isReplay: result.isReplay === true,
            replayUnlocked: result.replayUnlocked === true,
            calmCoinsEarned: result.calmCoinsEarned || 0
          }
        }));

        // If it was a replay, also dispatch replay event
        if (result.isReplay === true) {
          window.dispatchEvent(new CustomEvent('parentGameReplayed', {
            detail: {
              gameId,
              replayUnlocked: result.replayUnlocked === true
            }
          }));
        }
      }

      return result;
    } catch (error) {
      console.error('Failed to complete parent game:', error);
      toast.error('Failed to save progress. Please try again.');
      throw error;
    }
  }

  /**
   * Get game progress for a parent game
   * @param {string} gameId - Game identifier
   * @returns {Promise<Object>} - Game progress data
   */
  async getGameProgress(gameId) {
    try {
      const response = await api.get(`/api/parent/game/progress/${gameId}`);
      return response.data || {
        levelsCompleted: 0,
        totalCoinsEarned: 0,
        fullyCompleted: false,
        replayUnlocked: false
      };
    } catch (error) {
      console.error('Failed to get parent game progress:', error);
      return {
        levelsCompleted: 0,
        totalCoinsEarned: 0,
        fullyCompleted: false,
        replayUnlocked: false
      };
    }
  }

  /**
   * Unlock replay for a completed parent game
   * @param {string} gameId - Game identifier
   * @param {number} gameIndex - 1-based game index
   * @returns {Promise<Object>} - Unlock result
   */
  async unlockReplay(gameId, gameIndex) {
    try {
      const response = await api.post(`/api/parent/game/unlock-replay/${gameId}`);
      
      if (response.data.success) {
        toast.success(`Replay unlocked! ${response.data.replayCost} Healcoins deducted.`);
      }
      
      return response.data;
    } catch (error) {
      console.error('Failed to unlock replay:', error);
      const errorMessage = error.response?.data?.error || 'Failed to unlock replay';
      toast.error(errorMessage);
      throw error;
    }
  }
}

export default new ParentGameCompletionService();

