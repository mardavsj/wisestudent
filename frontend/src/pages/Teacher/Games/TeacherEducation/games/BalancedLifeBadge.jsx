import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import teacherGameCompletionService from "../../../../../services/teacherGameCompletionService";
import teacherBadgeService from "../../../../../services/teacherBadgeService";
import api from "../../../../../utils/api";
import { Award, CheckCircle, Lock, Sparkles, Volume2, VolumeX, Calendar, Ban, Smartphone, Heart, TrendingUp } from "lucide-react";
import { toast } from "react-toastify";

const BalancedLifeBadge = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get game data
  const gameId = "teacher-education-40";
  const gameData = getTeacherEducationGameById(gameId);

  const [loading, setLoading] = useState(true);
  const [gamesStatus, setGamesStatus] = useState([]);
  const [allCompleted, setAllCompleted] = useState(false);
  const [badgeCollected, setBadgeCollected] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [speechSynth, setSpeechSynth] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Required game IDs for Balanced Life Badge (5 balance activities)
  const requiredGameIds = [
    'teacher-education-35',  // Weekend Recharge Plan
    'teacher-education-36',  // The "No" Practice
    'teacher-education-37',  // Work–Life Tracker Journal
    'teacher-education-38',  // Family Connection Challenge
    'teacher-education-39'   // Digital Shutdown Simulation
  ];

  const gameNames = {
    'teacher-education-35': 'Weekend Recharge Plan',
    'teacher-education-36': 'The "No" Practice',
    'teacher-education-37': 'Work–Life Tracker Journal',
    'teacher-education-38': 'Family Connection Challenge',
    'teacher-education-39': 'Digital Shutdown Simulation'
  };

  const gameIcons = {
    'teacher-education-35': '📅',
    'teacher-education-36': '🚫',
    'teacher-education-37': '📊',
    'teacher-education-38': '💝',
    'teacher-education-39': '📱'
  };

  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      setSpeechSynth(window.speechSynthesis);
    }

    checkGamesCompletion();
    checkBadgeStatus();
  }, []);

  const checkGamesCompletion = async () => {
    try {
      setLoading(true);
      const statusPromises = requiredGameIds.map(async (id) => {
        try {
          const progress = await teacherGameCompletionService.getGameProgress(id);
          return {
            gameId: id,
            name: gameNames[id] || id,
            icon: gameIcons[id] || '📝',
            completed: progress?.fullyCompleted === true
          };
        } catch (error) {
          console.error(`Error checking game ${id}:`, error);
          return {
            gameId: id,
            name: gameNames[id] || id,
            icon: gameIcons[id] || '📝',
            completed: false
          };
        }
      });

      const statuses = await Promise.all(statusPromises);
      setGamesStatus(statuses);

      const allCompletedCheck = statuses.every(status => status.completed);
      setAllCompleted(allCompletedCheck);

      if (!allCompletedCheck) {
        setTimeout(() => {
          toast.info('Complete all 5 balance activities first to unlock this badge!');
        }, 1000);
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
      const result = await teacherBadgeService.getBalancedLifeBadgeStatus();
      if (result.hasBadge) {
        setBadgeCollected(true);
      }
    } catch (error) {
      console.error('Error checking badge status:', error);
    }
  };

  const playAffirmation = (text) => {
    if (!speechSynth) return;

    speechSynth.cancel();
    setIsPlayingAudio(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    speechSynth.speak(utterance);
  };

  const stopAudio = () => {
    if (speechSynth) {
      speechSynth.cancel();
      setIsPlayingAudio(false);
    }
  };

  const handleCollectBadge = async () => {
    try {
      setIsCollecting(true);
      const response = await api.post('/api/school/teacher/badge/balanced-life/collect');

      const result = response.data;

      if (result.success && (result.badgeEarned || result.newlyEarned)) {
        setBadgeCollected(true);
        setShowCollectionModal(false);
        toast.success('🎉 Badge collected successfully!');

        // Play positive audio affirmation
        const affirmation = "Congratulations! You have earned the Balanced Life Badge. Your consistent practice of work-life balance shows your commitment to wellbeing. You have mastered weekend planning, saying no, tracking work-life balance, connecting with family, and digital shutdown. Your balanced approach benefits not only you but also your students and colleagues. Well done!";
        playAffirmation(affirmation);

        // Dispatch badge earned event
        window.dispatchEvent(new CustomEvent('teacherBadgeEarned', {
          detail: {
            badgeId: 'balanced-life',
            badgeName: 'Balanced Life',
            message: 'Maintain consistent rest and self-care routines',
            badge: result.badge
          }
        }));

        // Register the badge game as completed in the game progress system
        // This is crucial for sequential unlocking of the next game
        try {
          await teacherGameCompletionService.completeGame({
            gameId,
            gameType: 'teacher-education',
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

  const completedCount = gamesStatus.filter(status => status.completed).length;
  const totalRequired = requiredGameIds.length;
  const progressPercentage = (completedCount / totalRequired) * 100;

  return (
    <TeacherGameShell
      title={gameData?.title || "Balanced Life Badge"}
      subtitle={gameData?.description || "Reward teachers who maintain consistent rest and self-care routines"}
      showGameOver={false}
      score={0}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={0}
      totalCoins={0}
      currentQuestion={0}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Badge Header */}
            <div className="text-center mb-8">
              <div className="mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${allCompleted && badgeCollected
                      ? 'from-amber-400 via-yellow-400 to-orange-400'
                      : allCompleted
                        ? 'from-amber-300 via-yellow-300 to-orange-300'
                        : 'from-gray-300 to-gray-400'
                    } flex items-center justify-center shadow-lg border-4 border-white`}
                >
                  {badgeCollected ? (
                    <Award className="w-20 h-20 text-white" />
                  ) : allCompleted ? (
                    <Lock className="w-20 h-20 text-white opacity-50" />
                  ) : (
                    <Lock className="w-20 h-20 text-white" />
                  )}
                </motion.div>
              </div>

              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Balanced Life Badge
              </h2>
              <p className="text-gray-600 text-lg mb-4">
                Maintain consistent rest and self-care routines
              </p>

              {/* Progress */}
              <div className="max-w-md mx-auto mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress: {completedCount} / {totalRequired} activities</span>
                  <span className="font-semibold">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 h-3 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Games Tracker */}
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Required Activities:
              </h3>

              {gamesStatus.map((game, index) => (
                <motion.div
                  key={game.gameId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-xl p-5 border-2 ${game.completed
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                      : 'bg-gray-50 border-gray-300'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-4xl ${game.completed ? '' : 'opacity-50 grayscale'
                      }`}>
                      {game.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold text-lg mb-1 ${game.completed ? 'text-gray-800' : 'text-gray-500'
                        }`}>
                        {game.name}
                      </h4>
                      {!game.completed && (
                        <p className="text-sm text-gray-500">
                          Complete this activity to progress
                        </p>
                      )}
                    </div>
                    <div>
                      {game.completed ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-6 h-6" />
                          <span className="font-semibold">Completed</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Lock className="w-6 h-6" />
                          <span className="font-semibold">Incomplete</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Button */}
            {allCompleted && !badgeCollected && (
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCollectionModal(true)}
                  disabled={isCollecting}
                  className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
                >
                  <Award className="w-6 h-6" />
                  Collect Badge
                </motion.button>
              </div>
            )}

            {badgeCollected && (
              <div className="text-center">
                <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200 mb-6">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Badge Collected! 🏆
                  </h3>
                  <p className="text-gray-700 text-lg mb-4">
                    "Balance brings brilliance."
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    {isPlayingAudio ? (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={stopAudio}
                        className="bg-white text-indigo-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                      >
                        <VolumeX className="w-5 h-5" />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => playAffirmation("Balance brings brilliance.")}
                        className="bg-white text-indigo-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                      >
                        <Volume2 className="w-5 h-5" />
                      </motion.button>
                    )}
                    <span className="text-sm text-gray-600">Listen to affirmation</span>
                  </div>
                </div>
              </div>
            )}

            {!allCompleted && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-2">
                      Complete all 5 activities to unlock:
                    </p>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                      <li>Weekend Recharge Plan</li>
                      <li>The "No" Practice</li>
                      <li>Work–Life Tracker Journal</li>
                      <li>Family Connection Challenge</li>
                      <li>Digital Shutdown Simulation</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Collection Confirmation Modal */}
            {showCollectionModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 mb-4">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Collect Your Badge
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Are you ready to collect your Balanced Life Badge? You'll hear a positive affirmation when you collect it!
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => setShowCollectionModal(false)}
                      disabled={isCollecting}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-full font-semibold transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCollectBadge}
                      disabled={isCollecting}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                    >
                      {isCollecting ? 'Collecting...' : 'Yes, Collect Badge!'}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Audio Affirmation Section */}
            {badgeCollected && (
              <div className="mb-6">
                <button
                  onClick={() => {
                    if (isPlayingAudio) {
                      stopAudio();
                    } else {
                      playAffirmation("Congratulations! You have earned the Balanced Life Badge. Your consistent practice of work-life balance shows your commitment to wellbeing. You have mastered weekend planning, saying no, tracking work-life balance, connecting with family, and digital shutdown. Your balanced approach benefits not only you but also your students and colleagues. Well done!");
                    }
                  }}
                  className="flex items-center gap-2 mx-auto px-6 py-3 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-xl font-semibold transition-all"
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-5 h-5" />
                      Stop Affirmation
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-5 h-5" />
                      Hear Affirmation Again
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Teacher Tip */}
            {badgeCollected && (
              <div className="mt-8 bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
                <div className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-amber-900 mb-2">
                      💡 Teacher Tip:
                    </p>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      Recognize badge earners publicly to promote rest culture, not overwork. Create a "Balanced Life Champions" board in the staffroom or digital space where teachers who earn this badge are celebrated. Share their success during staff meetings with a brief acknowledgment: "We celebrate teachers who model healthy boundaries and self-care." This recognition shifts the school culture from glorifying overwork to valuing sustainability and wellbeing. Consider monthly "Wellbeing Spotlight" features highlighting teachers who demonstrate balance, share their strategies, or mentor others in self-care practices. Public recognition of rest and self-care sends a powerful message that the school values teacher wellbeing, not just productivity. When teachers see balance being celebrated, it normalizes boundaries and makes it easier for everyone to prioritize their own wellbeing.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default BalancedLifeBadge;