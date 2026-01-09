import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import parentGameCompletionService from "../../../../../services/parentGameCompletionService";
import parentBadgeService from "../../../../../services/parentBadgeService";
import api from "../../../../../utils/api";
import { Award, CheckCircle, Lock, Sparkles, Eye, Clock } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const PresentParentBadgeCollector = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get game data
  const gameId = "parent-education-40";
  const gameData = getParentEducationGameById(gameId);
  
  const [loading, setLoading] = useState(true);
  const [gamesStatus, setGamesStatus] = useState([]);
  const [allCompleted, setAllCompleted] = useState(false);
  const [badgeCollected, setBadgeCollected] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);

  // Required game IDs (34, 35, 36, 38, 39) - Presence and Balance games
  const requiredGameIds = [
    'parent-education-34', // Work Worry Box
    'parent-education-35', // Presence Practice
    'parent-education-36', // Shared Meal Challenge
    'parent-education-38', // Quality Over Quantity
    'parent-education-39'  // Work–Family Boundary Planner
  ];

  const gameNames = {
    'parent-education-34': 'Work Worry Box',
    'parent-education-35': 'Presence Practice',
    'parent-education-36': 'Shared Meal Challenge',
    'parent-education-38': 'Quality Over Quantity',
    'parent-education-39': 'Work–Family Boundary Planner'
  };

  const gameIcons = {
    'parent-education-34': '📦',
    'parent-education-35': '👁️',
    'parent-education-36': '🍽️',
    'parent-education-38': '⏱️',
    'parent-education-39': '🎯'
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
          toast.error('Complete all 5 presence and balance activities first to unlock this badge!');
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
      const result = await parentBadgeService.getPresentParentBadgeStatus();
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
      const response = await api.post('/api/parent/badge/present-parent/collect');

      const result = response.data;

      if (result.success && result.badgeEarned) {
        setBadgeCollected(true);
        setShowCollectionModal(false);
        toast.success('🎉 Badge collected successfully!');
        
        // Dispatch badge earned event
        window.dispatchEvent(new CustomEvent('parentBadgeEarned', {
          detail: {
            badgeId: 'present-parent',
            badgeName: 'Present Parent',
            message: 'Your time is love made visible.',
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
        title={gameData?.title || "Present Parent Badge"}
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </ParentGameShell>
    );
  }

  if (badgeCollected) {
    return (
      <ParentGameShell
        title={gameData?.title || "Present Parent Badge"}
        subtitle="Badge Collected!"
        showGameOver={true}
        score={1}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={1}
        totalCoins={0}
        currentLevel={1}
        allAnswersCorrect={true}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl shadow-xl p-8 text-center border-2 border-blue-200">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="text-8xl mb-6"
            >
              👁️
            </motion.div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Present Parent Badge</h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl text-indigo-700 font-semibold mb-8"
            >
              Your time is love made visible.
            </motion.p>
            <div className="bg-white rounded-xl p-6 mb-6">
              <p className="text-lg text-gray-700 mb-4">
                You've successfully completed all presence and balance activities, demonstrating your commitment to being fully present with your family.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>💡 Parent Tip:</strong> Let your family celebrate your badge—togetherness is contagious. Share this achievement with your children and let them see that you value presence over distractions. Your commitment to being present teaches them that they matter, and that time together is precious.
                </p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-2 text-indigo-600"
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Badge Collected Successfully!</span>
            </motion.div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  if (!allCompleted) {
    const completedCount = gamesStatus.filter(s => s.completed).length;
    return (
      <ParentGameShell
        title={gameData?.title || "Present Parent Badge"}
        subtitle="Complete All Activities to Unlock"
        showGameOver={false}
        score={0}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={1}
        totalCoins={0}
        currentLevel={1}
      >
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg p-8 border-2 border-gray-300">
            <div className="text-center mb-8">
              <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Present Parent Badge</h2>
              <p className="text-lg text-gray-600 mb-2">
                Complete all 5 presence and balance activities to unlock this badge
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-800">
                  <strong>Progress:</strong> {completedCount} of 5 activities completed
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Required Activities:</h3>
              {gamesStatus.map((status, index) => (
                <motion.div
                  key={status.gameId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                    status.completed
                      ? 'bg-green-50 border-green-300'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{gameIcons[status.gameId]}</span>
                    <div>
                      <p className={`font-medium ${status.completed ? 'text-green-800' : 'text-gray-700'}`}>
                        {status.name}
                      </p>
                    </div>
                  </div>
                  {status.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Lock className="w-6 h-6 text-gray-400" />
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>💡 Parent Tip:</strong> Complete all presence and balance activities to unlock this badge. These activities help you create clear boundaries between work and family, practice mindful presence, and prioritize quality time together.
              </p>
            </div>
          </div>
        </div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Present Parent Badge"}
      subtitle="Congratulations!"
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
          className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl shadow-xl p-8 border-2 border-blue-300"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-8xl mb-6"
            >
              👁️
            </motion.div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Present Parent Badge</h2>
            <p className="text-xl text-gray-600 mb-2">Congratulations!</p>
            <p className="text-2xl text-indigo-700 font-semibold mb-6">
              You have successfully completed all presence and balance activities!
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-indigo-600" />
              Completed Activities:
            </h3>
            <div className="space-y-3">
              {gamesStatus.map((status, index) => (
                <motion.div
                  key={status.gameId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{gameIcons[status.gameId]}</span>
                    <span className="font-medium text-green-800">{status.name}</span>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6 mb-6 border-2 border-indigo-300">
            <p className="text-2xl font-bold text-center text-indigo-900 mb-2">
              Your time is love made visible.
            </p>
            <p className="text-center text-gray-700">
              You've demonstrated your commitment to being fully present with your family, creating boundaries, and prioritizing quality time together.
            </p>
          </div>

          {!showCollectionModal ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCollectionModal(true)}
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
            >
              <Award className="w-6 h-6" />
              Collect Badge
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 border-2 border-indigo-300"
            >
              <p className="text-center text-gray-700 mb-4">
                Are you ready to collect your Present Parent Badge?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowCollectionModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCollectBadge}
                  disabled={isCollecting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCollecting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Collecting...
                    </>
                  ) : (
                    <>
                      <Award className="w-5 h-5" />
                      Collect Now
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>💡 Parent Tip:</strong> Let your family celebrate your badge—togetherness is contagious. Share this achievement with your children and let them see that you value presence over distractions. Your commitment to being present teaches them that they matter, and that time together is precious.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default PresentParentBadgeCollector;

