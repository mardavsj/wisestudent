import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import teacherGameCompletionService from "../../../../../services/teacherGameCompletionService";
import teacherBadgeService from "../../../../../services/teacherBadgeService";
import api from "../../../../../utils/api";
import { Award, CheckCircle, Lock, Sparkles, Volume2, VolumeX, Book } from "lucide-react";
import { toast } from "react-toastify";

const ResilientEducatorBadge = () => {
  const navigate = useNavigate();

  // Get game data
  const gameId = "teacher-education-60";
  const gameData = getTeacherEducationGameById(gameId);

  const [loading, setLoading] = useState(true);
  const [gamesStatus, setGamesStatus] = useState([]);
  const [allCompleted, setAllCompleted] = useState(false);
  const [badgeCollected, setBadgeCollected] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [speechSynth, setSpeechSynth] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Required game IDs for Resilient Educator Badge (5 resilience activities)
  const requiredGameIds = useMemo(() => [
    'teacher-education-51',  // The Bounce-Back Quiz
    'teacher-education-52',  // Growth Mindset Puzzle
    'teacher-education-53',  // Tough Day Simulation
    'teacher-education-56',  // Challenge Journal
    'teacher-education-59'   // Gratitude Ladder
  ], []);

  const gameNames = useMemo(() => ({
    'teacher-education-51': 'The Bounce-Back Quiz',
    'teacher-education-52': 'Growth Mindset Puzzle',
    'teacher-education-53': 'Tough Day Simulation',
    'teacher-education-56': 'Challenge Journal',
    'teacher-education-59': 'Gratitude Ladder'
  }), []);

  const gameIcons = useMemo(() => ({
    'teacher-education-51': '🛡️',
    'teacher-education-52': '🧩',
    'teacher-education-53': '💪',
    'teacher-education-56': '📔',
    'teacher-education-59': '🪜'
  }), []);

  const checkGamesCompletion = useCallback(async () => {
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
          toast.info('Complete all 5 resilience activities first to unlock this badge!');
        }, 1000);
      }
    } catch (error) {
      console.error('Error checking games completion:', error);
      toast.error('Failed to check game completion status');
    } finally {
      setLoading(false);
    }
  }, [requiredGameIds, gameNames, gameIcons]);

  const checkBadgeStatus = useCallback(async () => {
    try {
      const result = await teacherBadgeService.getResilientEducatorBadgeStatus();
      if (result.hasBadge) {
        setBadgeCollected(true);
      }
    } catch (error) {
      console.error('Error checking badge status:', error);
    }
  }, []);

  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      setSpeechSynth(window.speechSynthesis);
    }

    checkGamesCompletion();
    checkBadgeStatus();
  }, [checkGamesCompletion, checkBadgeStatus]);

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
      const response = await api.post('/api/school/teacher/badge/resilient-educator/collect');

      const result = response.data;

      if (result.success && (result.badgeEarned || result.newlyEarned)) {
        setBadgeCollected(true);
        setShowCollectionModal(false);
        toast.success('🏆 Badge collected successfully!');

        // Play positive audio affirmation
        const affirmation = "Your strength lifts others. Congratulations! You have earned the Resilient Educator Badge. Your consistent bounce-back behaviors inspire those around you. You are a Resilience Role Model, demonstrating strength and perseverance in the face of challenges. Well done!";
        playAffirmation(affirmation);

        // Dispatch badge earned event
        window.dispatchEvent(new CustomEvent('teacherBadgeEarned', {
          detail: {
            badgeId: 'resilient-educator',
            badgeName: 'Resilient Educator',
            message: 'Your strength lifts others.',
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

  if (!allCompleted) {
    return (
      <TeacherGameShell
        title={gameData?.title || "Resilient Educator Badge"}
        subtitle="Locked - Complete all resilience activities to unlock"
        showGameOver={false}
        score={0}
        gameId={gameId}
        gameType="teacher-education"
        totalLevels={0}
        totalCoins={0}
        currentQuestion={0}
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
                Complete all 5 resilience activities to unlock this badge
              </p>
            </div>

            {/* Progress Tracker */}
            <div className="space-y-4 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Resilience Activities:</h3>
              {gamesStatus.map((game, index) => (
                <motion.div
                  key={game.gameId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 ${game.completed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {game.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>
                    )}
                    <span className="text-2xl">{game.icon}</span>
                    <span className={`font-medium text-lg ${game.completed ? 'text-green-800' : 'text-gray-600'
                      }`}>
                      {index + 1}. {game.name}
                    </span>
                  </div>
                  <span className={`text-sm font-semibold ${game.completed ? 'text-green-600' : 'text-gray-400'
                    }`}>
                    {game.completed ? 'Completed ✓' : 'Not Completed'}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span className="font-semibold">Progress</span>
                <span className="font-semibold">
                  {gamesStatus.filter(g => g.completed).length} / 5 activities completed
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <motion.div
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-4 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(gamesStatus.filter(g => g.completed).length / 5) * 100}%`
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 text-center">
              <p className="text-sm text-blue-700">
                Complete all 5 resilience activities to earn the Resilient Educator Badge!
              </p>
            </div>
          </div>
        </div>
      </TeacherGameShell>
    );
  }

  return (
    <TeacherGameShell
      title={gameData?.title || "Resilient Educator Badge"}
      subtitle="Celebrate teachers who display consistent bounce-back behaviors"
      showGameOver={false}
      score={0}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={0}
      totalCoins={0}
      currentQuestion={0}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!allCompleted ? null : loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            {badgeCollected ? (
              // Badge Already Collected
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 border-4 border-purple-300 mb-6"
                >
                  <Award className="w-16 h-16 text-purple-600" />
                </motion.div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  Resilient Educator Badge
                </h2>
                <p className="text-2xl text-indigo-600 font-medium italic mb-6">
                  "Your strength lifts others."
                </p>
                <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
                  <p className="text-gray-700 text-lg">
                    Congratulations! You have successfully completed all resilience activities and earned the Resilient Educator Badge. Your consistent bounce-back behaviors inspire those around you.
                  </p>
                </div>

                {/* Audio Affirmation Button */}
                <div className="mb-6">
                  <button
                    onClick={() => {
                      if (isPlayingAudio) {
                        stopAudio();
                      } else {
                        playAffirmation("Your strength lifts others. Congratulations! You have earned the Resilient Educator Badge. Your consistent bounce-back behaviors inspire those around you. You are a Resilience Role Model, demonstrating strength and perseverance in the face of challenges. Well done!");
                      }
                    }}
                    className="flex items-center gap-2 mx-auto px-6 py-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-xl font-semibold transition-all"
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


              </div>
            ) : (
              // Badge Collection Screen
              <div>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 border-4 border-purple-300 mb-6"
                >
                  <Sparkles className="w-16 h-16 text-purple-600" />
                </motion.div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  Congratulations!
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  You have successfully completed all 5 resilience activities
                </p>

                {/* Completed Tasks List */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-8">
                  <h3 className="text-lg font-bold text-green-800 mb-4">Completed Activities:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {gamesStatus.map((game, index) => (
                      <div
                        key={game.gameId}
                        className="flex items-center gap-2 text-green-700 bg-white rounded-lg p-3"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-lg">{game.icon}</span>
                        <span className="font-medium">{index + 1}. {game.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Badge Preview */}
                <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-8 border-4 border-purple-300 mb-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 via-indigo-400 to-pink-400 mb-4">
                    <Award className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Resilient Educator Badge
                  </h3>
                  <p className="text-xl text-indigo-600 font-medium italic">
                    "Your strength lifts others."
                  </p>
                </div>

                {/* Collect Badge Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCollectionModal(true)}
                  className="bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 text-white px-12 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform transition-all duration-200"
                >
                  Collect Badge
                </motion.button>
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
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 via-indigo-400 to-pink-400 mb-4">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Collect Your Badge
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Are you ready to collect your Resilient Educator Badge? You'll hear the affirmation "Your strength lifts others" when you collect it!
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
                      className="bg-gradient-to-r from-purple-400 to-indigo-400 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                    >
                      {isCollecting ? 'Collecting...' : 'Yes, Collect Badge!'}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Teacher Tip */}
            {badgeCollected && (
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 mt-8">
                <p className="text-sm font-semibold text-purple-800 mb-2">💡 Teacher Tip:</p>
                <p className="text-sm text-purple-700">
                  Create "Resilient Wall" highlighting badge holders to inspire peers. Showcasing resilience builds collective strength:
                  <ul className="mt-2 ml-4 space-y-1 list-disc text-left">
                    <li><strong>Display badge holders:</strong> Create a physical or digital "Resilient Wall" featuring teachers who have earned the Resilient Educator Badge.</li>
                    <li><strong>Share resilience stories:</strong> Invite badge holders to share brief stories about how they've bounced back from challenges.</li>
                    <li><strong>Peer inspiration:</strong> Seeing colleagues who have earned the badge inspires others to develop their own resilience skills.</li>
                    <li><strong>School-wide culture:</strong> Highlighting resilience builds a school-wide culture where bouncing back from challenges is celebrated and normalized.</li>
                    <li><strong>Recognition matters:</strong> Publicly recognizing resilience helps create an environment where teachers feel supported and inspired to grow.</li>
                  </ul>
                  When you create a "Resilient Wall" featuring badge holders, you're not just celebrating individual achievements—you're building collective resilience. This recognition inspires peers, normalizes bounce-back behaviors, and creates a supportive culture where teachers feel empowered to grow through challenges.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default ResilientEducatorBadge;