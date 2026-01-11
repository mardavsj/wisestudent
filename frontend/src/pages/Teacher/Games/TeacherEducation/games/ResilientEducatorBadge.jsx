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
      
      if (response.data.success && response.data.badgeEarned) {
        setBadgeCollected(true);
        setShowCollectionModal(true);
        
        // Play affirmation audio
        setTimeout(() => {
          playAffirmation("Your strength lifts others.");
        }, 500);
        
        toast.success('🏆 Resilient Educator Badge Collected! Your strength lifts others.');
      } else if (response.data.alreadyEarned) {
        setBadgeCollected(true);
        toast.info('You already have this badge!');
      } else {
        toast.error(response.data.error || 'Failed to collect badge. Please complete all required activities first.');
      }
    } catch (error) {
      console.error('Error collecting badge:', error);
      toast.error(error.response?.data?.error || 'Failed to collect badge');
    } finally {
      setIsCollecting(false);
    }
  };

  const handleGameClick = (gameId) => {
    const gameData = getTeacherEducationGameById(gameId);
    if (gameData) {
      navigate(gameData.path, { state: { fromBadge: true } });
    }
  };

  const completedCount = gamesStatus.filter(status => status.completed).length;
  const totalRequired = requiredGameIds.length;
  const progressPercentage = (completedCount / totalRequired) * 100;

  return (
    <TeacherGameShell
      title={gameData?.title || "Resilient Educator Badge"}
      subtitle={gameData?.description || "Celebrate teachers who display consistent bounce-back behaviors"}
      showGameOver={badgeCollected}
      score={badgeCollected ? 1 : 0}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={1}
      totalCoins={gameData?.calmCoins || 5}
      currentQuestion={1}
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
                {badgeCollected ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="text-8xl mb-4"
                  >
                    🏆
                  </motion.div>
                ) : (
                  <div className="text-8xl mb-4 opacity-50">
                    🏆
                  </div>
                )}
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Resilient Educator Badge
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Celebrate teachers who display consistent bounce-back behaviors
              </p>
              {badgeCollected && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-300 max-w-md mx-auto">
                  <p className="text-xl font-bold text-green-800">
                    "Your strength lifts others."
                  </p>
                </div>
              )}
            </div>

            {/* Progress Section */}
            <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Progress</h3>
                  <p className="text-sm text-gray-600">Complete all 5 resilience activities</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Activities Completed</p>
                  <p className="text-3xl font-bold text-indigo-600">
                    {completedCount} / {totalRequired}
                  </p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 h-4 rounded-full"
                />
              </div>

              <p className="text-sm text-center text-gray-600">
                {completedCount === totalRequired
                  ? "✨ All activities completed! You're ready to collect your badge!"
                  : `${totalRequired - completedCount} more activit${totalRequired - completedCount === 1 ? 'y' : 'ies'} needed to unlock the badge`}
              </p>
            </div>

            {/* Required Activities List */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Required Activities:</h3>
              <div className="space-y-3">
                {gamesStatus.map((game, index) => (
                  <motion.div
                    key={game.gameId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      game.completed
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-md'
                        : 'bg-gray-50 border-gray-300 hover:border-indigo-400 cursor-pointer'
                    }`}
                    onClick={() => !game.completed && handleGameClick(game.gameId)}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 ${
                      game.completed
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg'
                        : 'bg-gray-200'
                    }`}>
                      {game.completed ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <span>{game.icon}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold text-lg ${
                        game.completed ? 'text-green-800' : 'text-gray-800'
                      }`}>
                        {game.name}
                      </h4>
                      {!game.completed && (
                        <p className="text-sm text-gray-600">Click to complete this activity</p>
                      )}
                    </div>
                    {game.completed && (
                      <Sparkles className="w-5 h-5 text-green-500 flex-shrink-0" />
                    )}
                    {!game.completed && (
                      <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Collect Badge Button */}
            {allCompleted && !badgeCollected && (
              <div className="text-center mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCollectBadge}
                  disabled={isCollecting}
                  className="bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                >
                  {isCollecting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Collecting...
                    </>
                  ) : (
                    <>
                      <Award className="w-6 h-6" />
                      Collect Resilient Educator Badge
                    </>
                  )}
                </motion.button>

                {/* Audio Control */}
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => isPlayingAudio ? stopAudio() : playAffirmation("Your strength lifts others.")}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
                  >
                    {isPlayingAudio ? (
                      <VolumeX className="w-5 h-5 text-gray-600" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  <span className="text-sm text-gray-600">Listen to badge message</span>
                </div>
              </div>
            )}

            {/* Badge Collected Modal */}
            {showCollectionModal && badgeCollected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={() => setShowCollectionModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="text-8xl mb-4"
                  >
                    🏆✨
                  </motion.div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">
                    Resilient Educator Badge Collected!
                  </h3>
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
                    <p className="text-2xl font-bold text-purple-800 mb-2">
                      "Your strength lifts others."
                    </p>
                    <p className="text-gray-700">
                      Congratulations! You've completed all resilience activities and earned your badge. 
                      Your consistent bounce-back behaviors inspire those around you.
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCollectionModal(false)}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Close
                  </motion.button>
                </motion.div>
              </motion.div>
            )}

            {/* Teacher Tip */}
            {badgeCollected && (
              <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200 mt-8">
                <div className="flex items-start gap-3">
                  <Book className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900 mb-2">
                      💡 Teacher Tip:
                    </p>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      Create "Resilient Wall" highlighting badge holders to inspire peers. Showcasing resilience builds collective strength:
                    </p>
                    <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                      <li><strong>Display badge holders:</strong> Create a physical or digital "Resilient Wall" featuring teachers who have earned the Resilient Educator Badge.</li>
                      <li><strong>Share resilience stories:</strong> Invite badge holders to share brief stories about how they've bounced back from challenges.</li>
                      <li><strong>Peer inspiration:</strong> Seeing colleagues who have earned the badge inspires others to develop their own resilience skills.</li>
                      <li><strong>School-wide culture:</strong> Highlighting resilience builds a school-wide culture where bouncing back from challenges is celebrated and normalized.</li>
                      <li><strong>Recognition matters:</strong> Publicly recognizing resilience helps create an environment where teachers feel supported and inspired to grow.</li>
                    </ul>
                    <p className="text-sm text-amber-800 leading-relaxed mt-3">
                      When you create a "Resilient Wall" featuring badge holders, you're not just celebrating individual achievements—you're building collective resilience. This recognition inspires peers, normalizes bounce-back behaviors, and creates a supportive culture where teachers feel empowered to grow through challenges.
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

export default ResilientEducatorBadge;

