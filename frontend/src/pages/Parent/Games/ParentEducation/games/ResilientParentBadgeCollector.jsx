import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import parentGameCompletionService from "../../../../../services/parentGameCompletionService";
import parentBadgeService from "../../../../../services/parentBadgeService";
import api from "../../../../../utils/api";
import { Award, CheckCircle, Lock, Sparkles, Heart, Shield } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const ResilientParentBadgeCollector = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get game data
  const gameId = "parent-education-60";
  const gameData = getParentEducationGameById(gameId);
  
  const [loading, setLoading] = useState(true);
  const [gamesStatus, setGamesStatus] = useState([]);
  const [allCompleted, setAllCompleted] = useState(false);
  const [badgeCollected, setBadgeCollected] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);

  // Required game IDs (54, 55, 57, 58, 59) - Resilience games
  const requiredGameIds = [
    'parent-education-54', // Forgive Yourself Journal
    'parent-education-55', // Challenge–Choice Simulation
    'parent-education-57', // Resilience Ladder
    'parent-education-58', // Support Network Builder
    'parent-education-59'  // Gratitude for Growth
  ];

  const gameNames = {
    'parent-education-54': 'Forgive Yourself Journal',
    'parent-education-55': 'Challenge–Choice Simulation',
    'parent-education-57': 'Resilience Ladder',
    'parent-education-58': 'Support Network Builder',
    'parent-education-59': 'Gratitude for Growth'
  };

  const gameIcons = {
    'parent-education-54': '📖',
    'parent-education-55': '🎯',
    'parent-education-57': '🪜',
    'parent-education-58': '🗺️',
    'parent-education-59': '🌳'
  };

  useEffect(() => {
    checkGamesCompletion();
    checkBadgeStatus();
  }, []);

  const checkGamesCompletion = async () => {
    try {
      setLoading(true);
      const statusPromises = requiredGameIds.map(async (id) => {
        try {
          const progress = await parentGameCompletionService.getGameProgress(id);
          return {
            gameId: id,
            name: gameNames[id] || id,
            completed: progress?.fullyCompleted === true
          };
        } catch (error) {
          console.error(`Error checking game ${id}:`, error);
          return {
            gameId: id,
            name: gameNames[id] || id,
            completed: false
          };
        }
      });

      const statuses = await Promise.all(statusPromises);
      setGamesStatus(statuses);

      const allCompletedCheck = statuses.every(status => status.completed);
      setAllCompleted(allCompletedCheck);

      // If not all completed, redirect after showing message
      if (!allCompletedCheck) {
        setTimeout(() => {
          toast.error('Complete all 5 resilience activities first to unlock this badge!');
          navigate('/parent/games/parent-education');
        }, 3000);
      }
    } catch (error) {
      console.error('Error checking games completion:', error);
      toast.error('Failed to check game completion status');
    } finally {
      setLoading(false);
    }
  };

  const checkBadgeStatus = async () => {
    try {
      const result = await parentBadgeService.getResilientParentBadgeStatus();
      if (result.hasBadge) {
        setBadgeCollected(true);
      }
    } catch (error) {
      console.error('Error checking badge status:', error);
    }
  };

  const handleCollectBadge = async () => {
    try {
      setIsCollecting(true);
      const response = await api.post('/api/parent/badge/resilient-parent/collect');

      const result = response.data;

      if (result.success && result.badgeEarned) {
        setBadgeCollected(true);
        setShowCollectionModal(false);
        toast.success('🎉 Badge collected successfully!');
        
        // Dispatch badge earned event
        window.dispatchEvent(new CustomEvent('parentBadgeEarned', {
          detail: {
            badgeId: 'resilient-parent',
            badgeName: 'Resilient Parent',
            message: 'You rise, your family rises.',
            badge: result.badge
          }
        }));
        try {
          await parentGameCompletionService.completeGame({
            gameId,
            gameType: 'parent-education',
            gameIndex: gameData?.gameIndex || null,
            score: 5,
            totalLevels: 5,
            totalCoins: 0,
            isReplay: false
          });
        } catch (error) {
          console.error('Failed to mark badge game completed:', error);
        }

      } else {
        toast.error(result.error || 'Failed to collect badge');
      }
    } catch (error) {
      console.error('Error collecting badge:', error);
      const errorMessage = error.response?.data?.error || 'Failed to collect badge. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsCollecting(false);
    }
  };

  if (loading) {
    return (
      <ParentGameShell
        title={gameData?.title || "Resilient Parent Badge"}
        subtitle="Checking your progress..."
        showGameOver={false}
        score={0}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={1}
        totalCoins={0}
        currentLevel={1}
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking your resilience activities...</p>
          </div>
        </div>
      </ParentGameShell>
    );
  }

  if (badgeCollected) {
    return (
      <ParentGameShell
        title={gameData?.title || "Resilient Parent Badge"}
        subtitle="Badge Collected!"
        showGameOver={true}
        score={5}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={1}
        totalCoins={5}
        currentLevel={1}
        allAnswersCorrect={true}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-7xl mb-4"
              >
                🏆
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Resilient Parent Badge Earned!</h2>
              <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 rounded-xl p-6 border-2 border-purple-200 mb-6">
                <p className="text-2xl font-bold text-gray-800 mb-2">"You rise, your family rises."</p>
                <p className="text-lg text-gray-600">
                  You've successfully completed all resilience activities and proven your ability to recover and grow through challenges.
                </p>
              </div>
            </div>

            {/* Completed Games List */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Completed Resilience Activities</h3>
              <div className="space-y-3">
                {gamesStatus.map((status, index) => (
                  <motion.div
                    key={status.gameId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg p-4 flex items-center gap-3 shadow-sm"
                  >
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <span className="text-2xl">{gameIcons[status.gameId]}</span>
                    <span className="text-gray-800 font-medium flex-1">{status.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Keep your badge visible—your strength anchors your home. When you display your Resilient Parent Badge, you're showing your children that challenges can be overcome, that growth comes from hardship, and that resilience is a strength worth celebrating. Your ability to recover and grow through challenges teaches your children that they too can rise after falling. Your strength becomes their anchor—knowing you've navigated difficult times gives them confidence in their own resilience. Display this badge proudly; it represents not just your achievements, but the strength you're modeling for your family.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  if (!allCompleted) {
    return (
      <ParentGameShell
        title={gameData?.title || "Resilient Parent Badge"}
        subtitle="Master Resilience to Unlock"
        showGameOver={false}
        score={0}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={1}
        totalCoins={0}
        currentLevel={1}
      >
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Complete All Resilience Activities</h2>
              <p className="text-gray-600 mb-6">
                Master all 5 resilience activities to unlock the Resilient Parent Badge.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Required Activities:</h3>
              <div className="space-y-3">
                {gamesStatus.map((status, index) => (
                  <div
                    key={status.gameId}
                    className={`bg-white rounded-lg p-4 flex items-center gap-3 ${
                      status.completed ? 'opacity-100' : 'opacity-60'
                    }`}
                  >
                    {status.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex-shrink-0" />
                    )}
                    <span className="text-2xl">{gameIcons[status.gameId]}</span>
                    <span className={`flex-1 ${status.completed ? 'text-gray-800' : 'text-gray-500'}`}>
                      {status.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Resilient Parent Badge"}
      subtitle="Collect Your Badge"
      showGameOver={false}
      score={0}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={1}
      totalCoins={5}
      currentLevel={1}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-7xl mb-4"
            >
              🏆
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Congratulations!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You've completed all 5 resilience activities. You're ready to collect your Resilient Parent Badge!
            </p>
          </div>

          {/* Completed Games */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">All Activities Completed ✓</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {gamesStatus.map((status) => (
                <div
                  key={status.gameId}
                  className="bg-white rounded-lg p-3 flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-xl">{gameIcons[status.gameId]}</span>
                  <span className="text-gray-700 text-sm">{status.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Badge Preview */}
          <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 rounded-xl p-8 border-2 border-purple-300 mb-6 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Resilient Parent Badge</h3>
            <p className="text-lg text-gray-700 mb-4">"You rise, your family rises."</p>
            <p className="text-gray-600">
              Recognize parents who recover and grow through challenges
            </p>
          </div>

          {/* Collect Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCollectBadge}
            disabled={isCollecting}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isCollecting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Collecting...
              </>
            ) : (
              <>
                <Award className="w-5 h-5" />
                Collect Badge
              </>
            )}
          </motion.button>

          {/* Parent Tip */}
          <div className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
            <p className="text-sm text-gray-700 text-center">
              <strong>💡 Parent Tip:</strong> Keep your badge visible—your strength anchors your home. When you display your Resilient Parent Badge, you're showing your children that challenges can be overcome and that resilience is a strength worth celebrating.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default ResilientParentBadgeCollector;

