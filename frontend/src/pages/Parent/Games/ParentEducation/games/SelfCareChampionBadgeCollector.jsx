import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import parentGameCompletionService from "../../../../../services/parentGameCompletionService";
import parentBadgeService from "../../../../../services/parentBadgeService";
import api from "../../../../../utils/api";
import { Award, CheckCircle, Lock, Target, Heart } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const SelfCareChampionBadgeCollector = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get game data
  const gameId = "parent-education-100";
  const gameData = getParentEducationGameById(gameId);
  
  const [loading, setLoading] = useState(true);
  const [gamesStatus, setGamesStatus] = useState([]);
  const [allCompleted, setAllCompleted] = useState(false);
  const [badgeCollected, setBadgeCollected] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);

  // Required game IDs (93, 94, 95, 96, 97) - Self-care games
  const requiredGameIds = [
    'parent-education-93', // Evening Log-Off Ritual
    'parent-education-94', // Nature Reconnect
    'parent-education-95', // Self-Care Inventory
    'parent-education-96', // Morning Nourish Routine
    'parent-education-97'  // Silence Challenge
  ];

  const gameNames = {
    'parent-education-93': 'Evening Log-Off Ritual',
    'parent-education-94': 'Nature Reconnect',
    'parent-education-95': 'Self-Care Inventory',
    'parent-education-96': 'Morning Nourish Routine',
    'parent-education-97': 'Silence Challenge'
  };

  const gameIcons = {
    'parent-education-93': '🌙',
    'parent-education-94': '🌿',
    'parent-education-95': '📊',
    'parent-education-96': '☀️',
    'parent-education-97': '🤫'
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
          toast.error('Complete all 5 self-care activities first to unlock this badge!');
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
      const result = await parentBadgeService.getSelfCareChampionBadgeStatus();
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
      const response = await api.post('/api/parent/badge/self-care-champion/collect');

      const result = response.data;

      if (result.success && result.badgeEarned) {
        setBadgeCollected(true);
        setShowCollectionModal(false);
        toast.success('🎉 Badge collected successfully!');
        
        // Dispatch badge earned event
        window.dispatchEvent(new CustomEvent('parentBadgeEarned', {
          detail: {
            badgeId: 'self-care-champion',
            badgeName: 'Self-Care Champion',
            message: 'When you care for yourself, you teach your child how to live with peace.',
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
        title={gameData?.title || "Self-Care Champion Badge"}
        subtitle="Checking your progress..."
        showGameOver={false}
        score={0}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={1}
        totalCoins={0}
        currentLevel={1}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </ParentGameShell>
    );
  }

  if (!allCompleted) {
    return (
      <ParentGameShell
        title={gameData?.title || "Self-Care Champion Badge"}
        subtitle="Complete All Self-Care Activities to Unlock"
        showGameOver={false}
        score={0}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={1}
        totalCoins={0}
        currentLevel={1}
      >
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Complete All Self-Care Activities to Unlock
              </h2>
              <p className="text-gray-600">
                Complete all 5 self-care activities to earn the Self-Care Champion Badge.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {gamesStatus.map((game, index) => (
                <motion.div
                  key={game.gameId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                    game.completed
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{gameIcons[game.gameId] || '🎮'}</span>
                    <span className={`font-medium ${
                      game.completed ? 'text-green-800' : 'text-gray-600'
                    }`}>
                      {game.name}
                    </span>
                  </div>
                  {game.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Lock className="w-6 h-6 text-gray-400" />
                  )}
                </motion.div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Display your badge at home — a visual reminder that calmness is contagious. Complete these self-care activities to unlock the Self-Care Champion Badge and celebrate your commitment to modeling self-care and digital discipline.
              </p>
            </div>
          </motion.div>
        </div>
      </ParentGameShell>
    );
  }

  if (badgeCollected) {
    return (
      <ParentGameShell
        title={gameData?.title || "Self-Care Champion Badge"}
        subtitle="Badge Collected!"
        showGameOver={false}
        score={0}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={1}
        totalCoins={0}
        currentLevel={1}
      >
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-8xl mb-6"
            >
              🌟
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Self-Care Champion Badge Collected!
            </h2>
            <p className="text-xl text-green-600 font-semibold mb-6">
              "When you care for yourself, you teach your child how to live with peace."
            </p>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <p className="text-gray-700 font-medium">
                <strong>💡 Parent Tip:</strong> Display your badge at home — a visual reminder that calmness is contagious. When you consistently model self-care and digital discipline, you're teaching your children more than habits—you're teaching them how to live with peace. Your self-care isn't selfish—it's instructional. Every time you rest, disconnect, recharge, and honor your boundaries, you're showing your children that self-care is normal, necessary, and non-negotiable. Display your badge proudly as a reminder that calmness is contagious. Your peace becomes their peace. Your self-care becomes their model for life.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/parent/games/parent-education')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Return to Games
            </motion.button>
          </motion.div>
        </div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Self-Care Champion Badge"}
      subtitle="Collect Your Badge"
      showGameOver={false}
      score={0}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={1}
      totalCoins={0}
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
              🌟
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Congratulations!
            </h2>
            <p className="text-xl text-gray-600 mb-2">
              You have successfully completed all self-care activities!
            </p>
            <p className="text-lg text-green-600 font-semibold mb-6">
              "When you care for yourself, you teach your child how to live with peace."
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {gamesStatus.map((game, index) => (
              <motion.div
                key={game.gameId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-green-50 border-2 border-green-300"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{gameIcons[game.gameId] || '🎮'}</span>
                  <span className="font-medium text-green-800">
                    {game.name}
                  </span>
                </div>
                <CheckCircle className="w-6 h-6 text-green-600" />
              </motion.div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
            <p className="text-gray-700 font-medium text-center">
              <strong>💡 Parent Tip:</strong> Display your badge at home — a visual reminder that calmness is contagious. By completing these self-care activities, you're not just earning a badge—you're modeling the most important lesson: that self-care is essential. When you consistently care for yourself—resting, disconnecting, recharging, setting boundaries—you're teaching your children how to live with peace. Your calmness becomes their calmness. Your self-care becomes their model for a balanced, peaceful life.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCollectionModal(true)}
            disabled={isCollecting}
            className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <Award className="w-6 h-6" />
            {isCollecting ? 'Collecting Badge...' : 'Collect Badge'}
          </motion.button>
        </motion.div>
      </div>

      {/* Collection Modal */}
      {showCollectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Collect Self-Care Champion Badge?
              </h3>
              <p className="text-gray-600">
                You've completed all 5 self-care activities. Ready to collect your badge?
              </p>
            </div>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCollectBadge}
                disabled={isCollecting}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCollecting ? 'Collecting...' : 'Yes, Collect Badge'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCollectionModal(false)}
                disabled={isCollecting}
                className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </ParentGameShell>
  );
};

export default SelfCareChampionBadgeCollector;

