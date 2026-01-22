import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import teacherGameCompletionService from "../../../../../services/teacherGameCompletionService";
import teacherBadgeService from "../../../../../services/teacherBadgeService";
import api from "../../../../../utils/api";
import { Award, CheckCircle, Lock, Sparkles, Volume2, VolumeX } from "lucide-react";
import { toast } from "react-toastify";

const CompassionBalanceBadge = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get game data
  const gameId = "teacher-education-30";
  const gameData = getTeacherEducationGameById(gameId);

  const [loading, setLoading] = useState(true);
  const [gamesStatus, setGamesStatus] = useState([]);
  const [allCompleted, setAllCompleted] = useState(false);
  const [badgeCollected, setBadgeCollected] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [speechSynth, setSpeechSynth] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Required game IDs for Compassion Balance Badge (5 empathy balance tasks)
  const requiredGameIds = [
    'teacher-education-21',  // Understanding Compassion Fatigue
    'teacher-education-22',  // Empathy vs Overload Quiz
    'teacher-education-23',  // Emotional Boundary Builder
    'teacher-education-24',  // Energy Drain Tracker
    'teacher-education-25'   // Refill Rituals
  ];

  const gameNames = {
    'teacher-education-21': 'Understanding Compassion Fatigue',
    'teacher-education-22': 'Empathy vs Overload Quiz',
    'teacher-education-23': 'Emotional Boundary Builder',
    'teacher-education-24': 'Energy Drain Tracker',
    'teacher-education-25': 'Refill Rituals'
  };

  const gameIcons = {
    'teacher-education-21': '💔',
    'teacher-education-22': '🧠',
    'teacher-education-23': '🛡️',
    'teacher-education-24': '🔋',
    'teacher-education-25': '✨'
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
          toast.info('Complete all 5 empathy balance tasks first to unlock this badge!');
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
      const result = await teacherBadgeService.getCompassionBalanceBadgeStatus();
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
      const response = await api.post('/api/school/teacher/badge/compassion-balance/collect');

      const result = response.data;

      if (result.success && (result.badgeEarned || result.newlyEarned)) {
        setBadgeCollected(true);
        setShowCollectionModal(false);
        toast.success('🎉 Badge collected successfully!');

        // Play positive audio affirmation
        const affirmation = "Your care has clarity. Congratulations! You have earned the Compassion Balance Badge. Your commitment to healthy empathy and compassion balance sustains your wellbeing while serving others. You are a Compassion Balance Champion, modeling healthy empathy in school culture. Well done!";
        playAffirmation(affirmation);

        // Dispatch badge earned event
        window.dispatchEvent(new CustomEvent('teacherBadgeEarned', {
          detail: {
            badgeId: 'compassion-balance',
            badgeName: 'Compassion Balance',
            message: 'Your care has clarity.',
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
      toast.error(error.response?.data?.message || 'Failed to collect badge');
    } finally {
      setIsCollecting(false);
    }
  };

  const handlePlayAgain = () => {
    setShowCollectionModal(false);
    navigate('/school-teacher/games/mental-health-emotional-regulation');
  };

  const completedCount = gamesStatus.filter(s => s.completed).length;
  const progressPercentage = (completedCount / requiredGameIds.length) * 100;

  return (
    <TeacherGameShell
      title={gameData?.title || "Compassion Balance Badge"}
      subtitle={gameData?.description || "Recognize teachers who model healthy empathy in school culture"}
      showGameOver={false}
      score={badgeCollected ? 1 : 0}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={1}
      totalCoins={5}
      currentQuestion={1}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Checking your progress...</p>
          </div>
        ) : (
          <>
            {/* Badge Display */}
            <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-2xl shadow-lg p-8 mb-6 border-2 border-amber-200">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: badgeCollected ? 1 : 0.8 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="text-8xl mb-4"
                >
                  {badgeCollected ? '🏆' : '🔒'}
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Compassion Balance Badge
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Recognize teachers who model healthy empathy in school culture
                </p>

                {badgeCollected ? (
                  <div className="bg-white rounded-xl p-6 border-2 border-amber-300">
                    <div className="flex items-center justify-center gap-2 text-amber-700 mb-2">
                      <CheckCircle className="w-6 h-6" />
                      <span className="text-xl font-bold">Badge Collected!</span>
                    </div>
                    <p className="text-gray-700">
                      You've successfully completed all 5 empathy balance tasks and earned this badge!
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-6 border-2 border-amber-200">
                    <Lock className="w-8 h-8 mx-auto text-amber-600 mb-2" />
                    <p className="text-gray-700 font-semibold">
                      Complete all 5 empathy balance tasks to unlock this badge
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Empathy Balance Tasks Progress
              </h3>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span className="font-semibold">{completedCount} / {requiredGameIds.length} Completed</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 h-4 rounded-full"
                  />
                </div>
              </div>

              {/* Task List */}
              <div className="space-y-3">
                {gamesStatus.map((game, index) => (
                  <motion.div
                    key={game.gameId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border-2 transition-all ${game.completed
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                        : 'bg-gray-50 border-gray-300'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{game.icon}</div>
                        <div>
                          <h4 className={`font-semibold ${game.completed ? 'text-green-800' : 'text-gray-700'
                            }`}>
                            {game.name}
                          </h4>
                        </div>
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
                            <span className="font-semibold">Not Completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            {allCompleted && !badgeCollected && (
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCollectBadge}
                  disabled={isCollecting}
                  className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                >
                  {isCollecting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Collecting...
                    </>
                  ) : (
                    <>
                      <Award className="w-6 h-6" />
                      Collect Badge
                    </>
                  )}
                </motion.button>
              </div>
            )}

            {/* Collection Modal */}
            {showCollectionModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      className="text-8xl mb-4"
                    >
                      🏆
                    </motion.div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">
                      Badge Collected!
                    </h3>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200 mb-6">
                      <p className="text-xl font-semibold text-amber-900 mb-2">
                        "Your care has clarity."
                      </p>
                      <p className="text-gray-700">
                        You've successfully completed all 5 empathy balance tasks and earned the Compassion Balance Badge!
                      </p>
                    </div>

                    {/* Audio Controls */}
                    <div className="mb-6 flex items-center justify-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => playAffirmation("Your care has clarity.")}
                        disabled={isPlayingAudio}
                        className="bg-amber-500 text-white p-3 rounded-full hover:bg-amber-600 transition-all disabled:opacity-50"
                      >
                        {isPlayingAudio ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </motion.button>
                      {isPlayingAudio && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={stopAudio}
                          className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-all"
                        >
                          <VolumeX className="w-5 h-5" />
                        </motion.button>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePlayAgain}
                      className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all w-full"
                    >
                      Return to Games
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Celebrate badge earners with a wellness-circle recognition. The Compassion Balance Badge recognizes teachers who model healthy empathy in school culture. When colleagues earn this badge, celebrate them in a wellness circle where they can share their journey. This creates a positive culture where healthy empathy is valued and recognized. Use this as an opportunity to build community, share strategies, and reinforce the importance of maintaining compassion balance. Recognition in a supportive group setting amplifies the positive impact and encourages others to prioritize their empathy balance.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default CompassionBalanceBadge;