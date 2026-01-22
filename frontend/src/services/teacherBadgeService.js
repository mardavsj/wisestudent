import api from '../utils/api';

/**
 * Teacher Badge Service
 * Handles badge checking and retrieval for teachers
 */
class TeacherBadgeService {
  /**
   * Get Self-Aware Teacher Badge status
   * @returns {Promise<Object>} Badge status
   */
  async getSelfAwareBadgeStatus() {
    try {
      const response = await api.get('/api/school/teacher/badge/self-aware-teacher');
      return response.data;
    } catch (error) {
      console.error('Failed to get Self-Aware Teacher Badge status:', error);
      return {
        success: false,
        hasBadge: false,
        newlyEarned: false
      };
    }
  }

  /**
   * Get Calm Teacher Badge status
   * @returns {Promise<Object>} Badge status
   */
  async getCalmBadgeStatus() {
    try {
      const response = await api.get('/api/school/teacher/badge/calm-teacher');
      return response.data;
    } catch (error) {
      console.error('Failed to get Calm Teacher Badge status:', error);
      return {
        success: false,
        hasBadge: false,
        newlyEarned: false
      };
    }
  }

  /**
   * Get Compassion Balance Badge status
   * @returns {Promise<Object>} Badge status
   */
  async getCompassionBalanceBadgeStatus() {
    try {
      const response = await api.get('/api/school/teacher/badge/compassion-balance');
      return response.data;
    } catch (error) {
      console.error('Failed to get Compassion Balance Badge status:', error);
      return {
        success: false,
        hasBadge: false,
        newlyEarned: false
      };
    }
  }

  /**
   * Get Balanced Life Badge status
   * @returns {Promise<Object>} Badge status
   */
  async getBalancedLifeBadgeStatus() {
    try {
      const response = await api.get('/api/school/teacher/badge/balanced-life');
      return response.data;
    } catch (error) {
      console.error('Failed to get Balanced Life Badge status:', error);
      return {
        success: false,
        hasBadge: false,
        newlyEarned: false
      };
    }
  }

  /**
   * Get Mindful Mastery Badge status
   * @returns {Promise<Object>} Badge status
   */
  async getMindfulMasteryBadgeStatus() {
    try {
      const response = await api.get('/api/school/teacher/badge/mindful-mastery');
      return response.data;
    } catch (error) {
      console.error('Failed to get Mindful Mastery Badge status:', error);
      return {
        success: false,
        hasBadge: false,
        newlyEarned: false
      };
    }
  }

  /**
   * Get Resilient Educator Badge status
   * @returns {Promise<Object>} Badge status
   */
  async getResilientEducatorBadgeStatus() {
    try {
      const response = await api.get('/api/school/teacher/badge/resilient-educator');
      return response.data;
    } catch (error) {
      console.error('Failed to get Resilient Educator Badge status:', error);
      return {
        success: false,
        hasBadge: false,
        newlyEarned: false
      };
    }
  }

  /**
   * Get Clear Communicator Badge status
   * @returns {Promise<Object>} Badge status
   */
  async getClearCommunicatorBadgeStatus() {
    try {
      const response = await api.get('/api/school/teacher/badge/clear-communicator');
      return response.data;
    } catch (error) {
      console.error('Failed to get Clear Communicator Badge status:', error);
      return {
        success: false,
        hasBadge: false,
        newlyEarned: false
      };
    }
  }

  /**
   * Get Connected Teacher Badge status
   * @returns {Promise<Object>} Badge status
   */
  async getConnectedTeacherBadgeStatus() {
    try {
      const response = await api.get('/api/school/teacher/badge/connected-teacher');
      return response.data;
    } catch (error) {
      console.error('Failed to get Connected Teacher Badge status:', error);
      return {
        success: false,
        hasBadge: false,
        newlyEarned: false
      };
    }
  }

  /**
   * Collect Connected Teacher Badge
   * @returns {Promise<Object>} Collection result
   */
  async collectConnectedTeacherBadge() {
    try {
      const response = await api.post('/api/school/teacher/badge/connected-teacher/collect');
      return response.data;
    } catch (error) {
      console.error('Failed to collect Connected Teacher Badge:', error);
      throw error;
    }
  }

  /**
   * Get Purposeful Teacher Badge status
   * @returns {Promise<Object>} Badge status
   */
  async getPurposefulTeacherBadgeStatus() {
    try {
      const response = await api.get('/api/school/teacher/badge/purposeful-teacher');
      return response.data;
    } catch (error) {
      console.error('Failed to get Purposeful Teacher Badge status:', error);
      return {
        success: false,
        hasBadge: false,
        newlyEarned: false
      };
    }
  }

  /**
   * Collect Purposeful Teacher Badge
   * @returns {Promise<Object>} Collection result
   */
  async collectPurposefulTeacherBadge() {
    try {
      const response = await api.post('/api/school/teacher/badge/purposeful-teacher/collect');
      return response.data;
    } catch (error) {
      console.error('Failed to collect Purposeful Teacher Badge:', error);
      throw error;
    }
  }

  /**
   * Get Self-Care Champion Badge status
   * @returns {Promise<Object>} Badge status
   */
  async getSelfCareChampionBadgeStatus() {
    try {
      const response = await api.get('/api/school/teacher/badge/self-care-champion');
      return response.data;
    } catch (error) {
      console.error('Failed to get Self-Care Champion Badge status:', error);
      return {
        success: false,
        hasBadge: false,
        newlyEarned: false
      };
    }
  }

  /**
   * Collect Self-Care Champion Badge
   * @returns {Promise<Object>} Collection result
   */
  async collectSelfCareChampionBadge() {
    try {
      const response = await api.post('/api/school/teacher/badge/self-care-champion/collect');
      return response.data;
    } catch (error) {
      console.error('Failed to collect Self-Care Champion Badge:', error);
      throw error;
    }
  }

  /**
   * Get all teacher badges
   * @returns {Promise<Object>} All badges
   */
  async getAllBadges() {
    try {
      const response = await api.get('/api/school/teacher/badges');
      return response.data;
    } catch (error) {
      console.error('Failed to get teacher badges:', error);
      return {
        success: false,
        badges: [],
        selfAwareBadge: {
          hasBadge: false,
          newlyEarned: false
        },
        calmBadge: {
          hasBadge: false,
          newlyEarned: false
        },
        compassionBalanceBadge: {
          hasBadge: false,
          newlyEarned: false
        }
      };
    }
  }
}

export default new TeacherBadgeService();
