import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import teacherGameCompletionService from "../../../../../services/teacherGameCompletionService";
import teacherBadgeService from "../../../../../services/teacherBadgeService";
import api from "../../../../../utils/api";
import { Award, CheckCircle, Lock, Sparkles, Volume2, VolumeX, MessageCircle } from "lucide-react";
import { toast } from "react-toastify";

const ClearCommunicatorBadge = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get game data
  const gameId = "teacher-education-70";
  const gameData = getTeacherEducationGameById(gameId);
  
  const [loading, setLoading] = useState(true);
  const [gamesStatus, setGamesStatus] = useState([]);
  const [allCompleted, setAllCompleted] = useState(false);
  const [badgeCollected, setBadgeCollected] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [speechSynth, setSpeechSynth] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Required game IDs for Clear Communicator Badge (5 communication activities)
  const requiredGameIds = [
    'teacher-education-60',  // The Respectful "No"
    'teacher-education-61',  // Active Listening Quiz
    'teacher-education-68',  // Empathetic Dialogue Roleplay
    'teacher-education-66',  // Communication Mirror
    'teacher-education-69'   // Communication Reflex
  ];

  const gameNames = {
    'teacher-education-60': 'The Respectful "No"',
    'teacher-education-61': 'Active Listening Quiz',
    'teacher-education-68': 'Empathetic Dialogue Roleplay',
    'teacher-education-66': 'Communication Mirror',
    'teacher-education-69': 'Communication Reflex'
  };

  const gameIcons = {
    'teacher-education-60': '🙏',
    'teacher-education-61': '👂',
    'teacher-education-68': '💬',
    'teacher-education-66': '🪞',
    'teacher-education-69': '⚡'
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

      // If not all completed, show message but don't redirect immediately
      if (!allCompletedCheck) {
        setTimeout(() => {
          toast.info('Complete all 5 communication activities first to unlock this badge!');
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
      const result = await teacherBadgeService.getClearCommunicatorBadgeStatus();
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
      const response = await api.post('/api/school/teacher/badge/clear-communicator/collect');
      
      if (response.data.success) {
        setBadgeCollected(true);
        setShowCollectionModal(true);
        playAffirmation("You speak with calm clarity.");
        
        toast.success('🎉 Clear Communicator Badge Collected!');
      } else {
        toast.error(response.data.error || 'Failed to collect badge');
      }
    } catch (error) {
      console.error('Error collecting badge:', error);
      toast.error(error.response?.data?.error || 'Failed to collect badge');
    } finally {
      setIsCollecting(false);
    }
  };

  const handleGameClick = (gameId) => {
    navigate(`/school-teacher/games/mental-health-emotional-regulation/${gameId}`);
  };

  const completedCount = gamesStatus.filter(g => g.completed).length;
  const progressPercentage = (completedCount / requiredGameIds.length) * 100;

  return (
    <TeacherGameShell
      title={gameData?.title || "Clear Communicator Badge"}
      subtitle={gameData?.description || "Reward consistent use of assertive, empathetic communication"}
      showGameOver={false}
      score={0}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={1}
      totalCoins={gameData?.calmCoins || 10}
      currentQuestion={1}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Checking badge status...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Badge Display */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="inline-block mb-4"
              >
                {badgeCollected ? (
                  <div className="relative">
                    <div className="text-8xl mb-2">🎯</div>
                    <div className="absolute -top-2 -right-2">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="text-8xl mb-2 opacity-50">🎯</div>
                    <div className="absolute -top-2 -right-2">
                      <Lock className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                )}
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Clear Communicator Badge
              </h2>
              <p className="text-xl text-gray-600 mb-4">
                {badgeCollected 
                  ? "You speak with calm clarity." 
                  : "Complete 5 communication activities to unlock this badge"}
              </p>
            </div>

            {/* Progress Tracker */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <MessageCircle className="w-6 h-6 text-indigo-600" />
                    Communication Activities Progress
                  </h3>
                  <span className="text-lg font-semibold text-gray-700">
                    {completedCount} / {requiredGameIds.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {Math.round(progressPercentage)}% Complete
                </p>
              </div>

              {/* Games List */}
              <div className="space-y-4">
                {gamesStatus.map((game, index) => (
                  <motion.div
                    key={game.gameId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      game.completed
                        ? 'bg-green-50 border-green-300 hover:bg-green-100'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => handleGameClick(game.gameId)}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-3xl">{game.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{game.name}</h4>
                        <p className="text-sm text-gray-600">
                          {game.completed ? 'Completed' : 'Not completed'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {game.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Lock className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Collection Button */}
            {allCompleted && !badgeCollected && (
              <div className="text-center mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCollectBadge}
                  disabled={isCollecting}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
                >
                  {isCollecting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Collecting...</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-6 h-6" />
                      <span>Collect Badge</span>
                    </>
                  )}
                </motion.button>
              </div>
            )}

            {/* Badge Collected Modal */}
            {showCollectionModal && badgeCollected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowCollectionModal(false)}
              >
                <motion.div
                  initial={{ y: 50 }}
                  animate={{ y: 0 }}
                  className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="text-8xl mb-4"
                  >
                    🎯✨
                  </motion.div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">
                    Badge Collected!
                  </h3>
                  <p className="text-xl text-indigo-600 font-semibold mb-6">
                    "You speak with calm clarity."
                  </p>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <button
                      onClick={() => {
                        stopAudio();
                        setShowCollectionModal(false);
                      }}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      {isPlayingAudio ? (
                        <span className="flex items-center gap-2">
                          <VolumeX className="w-4 h-4" />
                          Stop Audio
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Volume2 className="w-4 h-4" />
                          Play Again
                        </span>
                      )}
                    </button>
                    {isPlayingAudio && (
                      <button
                        onClick={stopAudio}
                        className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <VolumeX className="w-4 h-4" />
                          Stop
                        </span>
                      </button>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      stopAudio();
                      setShowCollectionModal(false);
                    }}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Continue
                  </motion.button>
                </motion.div>
              </motion.div>
            )}

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    <strong>Highlight badge earners during staff communication workshops.</strong> Recognizing teachers who have earned the Clear Communicator Badge creates positive reinforcement, inspires others, and builds a culture of effective communication. Share their achievements, invite them to share insights, and celebrate their commitment to assertive, empathetic communication.
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

export default ClearCommunicatorBadge;

