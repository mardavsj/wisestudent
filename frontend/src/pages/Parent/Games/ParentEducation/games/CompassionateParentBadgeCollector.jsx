import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import parentGameCompletionService from "../../../../../services/parentGameCompletionService";
import parentBadgeService from "../../../../../services/parentBadgeService";
import api from "../../../../../utils/api";
import { Award, CheckCircle, Lock, Sparkles, Heart } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const CompassionateParentBadgeCollector = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get game data
  const gameId = "parent-education-30";
  const gameData = getParentEducationGameById(gameId);
  
  const [loading, setLoading] = useState(true);
  const [gamesStatus, setGamesStatus] = useState([]);
  const [allCompleted, setAllCompleted] = useState(false);
  const [badgeCollected, setBadgeCollected] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);

  // Required game IDs (21, 22, 27, 28, 29) - Empathy games
  const requiredGameIds = [
    'parent-education-21',
    'parent-education-22',
    'parent-education-27',
    'parent-education-28',
    'parent-education-29'
  ];

  const gameNames = {
    'parent-education-21': 'Walk in Their Shoes',
    'parent-education-22': 'Feelings First',
    'parent-education-27': 'Family Feelings Circle',
    'parent-education-28': 'Gratitude for Effort',
    'parent-education-29': 'Emotional Repair Practice'
  };

  const gameIcons = {
    'parent-education-21': '👟',
    'parent-education-22': '💙',
    'parent-education-27': '💬',
    'parent-education-28': '🙏',
    'parent-education-29': '🔧'
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
          toast.error('Complete all 5 empathy tasks first to unlock this badge!');
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
      const result = await parentBadgeService.getCompassionateParentBadgeStatus();
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
      const response = await api.post('/api/parent/badge/compassionate-parent/collect');

      const result = response.data;

      if (result.success && result.badgeEarned) {
        setBadgeCollected(true);
        setShowCollectionModal(false);
        toast.success('🎉 Badge collected successfully!');
        
        // Dispatch badge earned event
        window.dispatchEvent(new CustomEvent('parentBadgeEarned', {
          detail: {
            badgeId: 'compassionate-parent',
            badgeName: 'Compassionate Parent',
            message: 'Your kindness shapes your child\'s heart.',
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
        title={gameData?.title || "Compassionate Parent Badge"}
        subtitle="Checking your progress..."
        showGameOver={false}
        score={0}
        gameId={gameId}
        gameData={gameData}
        totalLevels={0}
        totalCoins={0}
        currentLevel={0}
      >
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading badge information...</p>
          </div>
        </div>
      </ParentGameShell>
    );
  }

  if (!allCompleted) {
    return (
      <ParentGameShell
        title={gameData?.title || "Compassionate Parent Badge"}
        subtitle="Locked - Complete all empathy tasks to unlock"
        showGameOver={false}
        score={0}
        gameId={gameId}
        gameData={gameData}
        totalLevels={0}
        totalCoins={0}
        currentLevel={0}
      >
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-200 mb-4">
                <Lock className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Badge Locked
              </h2>
              <p className="text-lg text-gray-600">
                Complete all 5 empathy tasks to unlock this badge
              </p>
            </div>

            {/* Games Status List */}
            <div className="space-y-3 mb-6">
              {gamesStatus.map((game, index) => (
                <motion.div
                  key={game.gameId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                    game.completed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{gameIcons[game.gameId] || '📋'}</span>
                    {game.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>
                    )}
                    <span className={`font-medium ${
                      game.completed ? 'text-green-800' : 'text-gray-600'
                    }`}>
                      {index + 1}. {game.name}
                    </span>
                  </div>
                  <span className={`text-sm font-semibold ${
                    game.completed ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {game.completed ? 'Completed' : 'Not Completed'}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{gamesStatus.filter(g => g.completed).length} / 5 empathy tasks completed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${(gamesStatus.filter(g => g.completed).length / 5) * 100}%`
                  }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full"
                ></motion.div>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-4 border border-green-200 text-center">
              <p className="text-sm text-green-700">
                Complete all 5 empathy tasks to earn the Compassionate Parent Badge!
              </p>
            </div>
          </div>
        </div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Compassionate Parent Badge"}
      subtitle="Celebrate consistent empathy and emotional connection"
      showGameOver={false}
      score={0}
      gameId={gameId}
      gameData={gameData}
      totalLevels={0}
      totalCoins={0}
      currentLevel={0}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        {badgeCollected ? (
          // Badge Already Collected
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 mb-6"
            >
              <Heart className="w-16 h-16 text-white" />
            </motion.div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Compassionate Parent Badge
            </h2>
            <p className="text-2xl text-green-600 font-medium italic mb-6">
              "Your kindness shapes your child's heart."
            </p>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <p className="text-gray-700 text-lg">
                Congratulations! You have successfully completed all empathy tasks and earned the Compassionate Parent Badge.
              </p>
            </div>

            {/* Completed Games List */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Completed Empathy Tasks:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {gamesStatus.map((game) => (
                  <div
                    key={game.gameId}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200"
                  >
                    <span className="text-xl">{gameIcons[game.gameId] || '✅'}</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">{game.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800">
                <strong>💡 Parent Tip:</strong> Display the badge digitally—children learn compassion from modeled warmth. 
                Show your children this badge and explain what it means. Your consistent practice of empathy teaches them 
                that compassion is a skill worth developing.
              </p>
            </div>
          </div>
        ) : (
          // Badge Ready to Collect
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 mb-6"
              >
                <Sparkles className="w-16 h-16 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                All Empathy Tasks Completed!
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                You've successfully completed all 5 empathy tasks
              </p>
            </div>

            {/* Completed Games List */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Completed Empathy Tasks:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {gamesStatus.map((game) => (
                  <motion.div
                    key={game.gameId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: gamesStatus.indexOf(game) * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-green-200"
                  >
                    <span className="text-xl">{gameIcons[game.gameId] || '✅'}</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">{game.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Badge Preview */}
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl p-8 border-2 border-green-300 mb-6 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 mb-4">
                <Heart className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Compassionate Parent Badge
              </h3>
              <p className="text-xl text-green-700 font-medium italic mb-4">
                "Your kindness shapes your child's heart."
              </p>
              <p className="text-gray-600">
                This badge recognizes your consistent practice of empathy, emotional connection, and compassionate parenting.
              </p>
            </div>

            {/* Collect Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCollectBadge}
              disabled={isCollecting}
              className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCollecting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Collecting Badge...</span>
                </>
              ) : (
                <>
                  <Award className="w-5 h-5" />
                  <span>Collect Badge</span>
                </>
              )}
            </motion.button>

            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <p className="text-sm text-amber-800">
                <strong>💡 Parent Tip:</strong> Display the badge digitally—children learn compassion from modeled warmth. 
                Your consistent empathy and emotional connection teach your children that kindness and understanding are 
                essential life skills.
              </p>
            </div>
          </div>
        )}
      </div>
    </ParentGameShell>
  );
};

export default CompassionateParentBadgeCollector;

