import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import teacherGameCompletionService from "../../../../../services/teacherGameCompletionService";
import teacherBadgeService from "../../../../../services/teacherBadgeService";
import api from "../../../../../utils/api";
import { Award, CheckCircle, Target, Heart, Sparkles, BookOpen, Star, TrendingUp, Moon, Coffee, TreePine, Smartphone, VolumeX, Lock, Volume2 } from "lucide-react";
import { toast } from "react-toastify";

const SelfCareChampionBadge = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get game data
  const gameId = "teacher-education-100";
  const gameData = getTeacherEducationGameById(gameId);

  const [loading, setLoading] = useState(true);
  const [gamesStatus, setGamesStatus] = useState([]);
  const [allCompleted, setAllCompleted] = useState(false);
  const [badgeCollected, setBadgeCollected] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [speechSynth, setSpeechSynth] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Required game IDs for Self-Care Champion Badge (5 self-care activities)
  const requiredGameIds = [
    'teacher-education-93',  // Evening Log-Off Ritual
    'teacher-education-95',  // Morning Nourish Routine
    'teacher-education-96',  // Nature Reconnect Challenge
    'teacher-education-91',  // Screen-Time Mirror
    'teacher-education-99'   // Silence & Stillness Practice
  ];

  const gameNames = {
    'teacher-education-93': 'Evening Log-Off Ritual',
    'teacher-education-95': 'Morning Nourish Routine',
    'teacher-education-96': 'Nature Reconnect Challenge',
    'teacher-education-91': 'Screen-Time Mirror',
    'teacher-education-99': 'Silence & Stillness Practice'
  };

  const gameIcons = {
    'teacher-education-93': '🌙',
    'teacher-education-95': '☕',
    'teacher-education-96': '🌲',
    'teacher-education-91': '📱',
    'teacher-education-99': '🤫'
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
          toast.info('Complete all 5 self-care activities first to unlock this badge!');
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
      const result = await teacherBadgeService.getSelfCareChampionBadgeStatus();

      if (result.hasBadge || result.badgeCollected) {
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
      const result = await teacherBadgeService.collectSelfCareChampionBadge();

      if (result.success && (result.badgeEarned || result.newlyEarned)) {
        setBadgeCollected(true);
        setShowCollectionModal(false);
        toast.success('🎉 Badge collected successfully!');

        // Play positive audio affirmation
        const affirmation = "When you rest, your light grows brighter. Congratulations! You have earned the Self-Care Champion Badge. Your commitment to maintaining consistent self-care and digital balance demonstrates sustainable teaching practices. You are a Self-Care Champion, showing others that rest and balance are essential. Well done!";
        playAffirmation(affirmation);

        // Dispatch badge earned event
        window.dispatchEvent(new CustomEvent('teacherBadgeEarned', {
          detail: {
            badgeId: 'self-care-champion',
            badgeName: 'Self-Care Champion',
            message: 'When you rest, your light grows brighter.',
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

  const completedCount = gamesStatus.filter(g => g.completed).length;
  const progress = (completedCount / requiredGameIds.length) * 100;

  if (loading) {
    return (
      <TeacherGameShell
        title={gameData?.title || "Self-Care Champion Badge"}
        subtitle="Checking your progress..."
        showGameOver={false}
        score={completedCount}
        gameId={gameId}
        gameType="teacher-education"
        totalLevels={5}
        totalCoins={0}
        currentQuestion={completedCount}
      >
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading badge information...</p>
          </div>
        </div>
      </TeacherGameShell>
    );
  }

  if (!allCompleted) {
    return (
      <TeacherGameShell
        title={gameData?.title || "Self-Care Champion Badge"}
        subtitle="Locked - Complete all self-care activities to unlock"
        showGameOver={false}
        score={completedCount}
        gameId={gameId}
        gameType="teacher-education"
        totalLevels={5}
        totalCoins={0}
        currentQuestion={completedCount}
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
                Complete all 5 self-care activities to unlock this badge
              </p>
            </div>

            {/* Progress Tracker */}
            <div className="space-y-4 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Self-Care Activities:</h3>
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
                Complete all 5 self-care activities to earn the Self-Care Champion Badge!
              </p>
            </div>
          </div>
        </div>
      </TeacherGameShell>
    );
  }

  return (
    <TeacherGameShell
      title={gameData?.title || "Self-Care Champion Badge"}
      subtitle="Honour teachers who maintain consistent self-care and digital balance"
      showGameOver={false}
      score={completedCount}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={5}
      totalCoins={0}
      currentQuestion={completedCount}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        {badgeCollected ? (
          // Badge Already Collected
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-4 border-amber-300 mb-6"
            >
              <Award className="w-16 h-16 text-amber-600" />
            </motion.div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Self-Care Champion Badge
            </h2>
            <p className="text-2xl text-indigo-600 font-medium italic mb-6">
              "When you rest, your light grows brighter."
            </p>
            <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <p className="text-gray-700 text-lg">
                Congratulations! You have successfully completed all self-care activities and earned the Self-Care Champion Badge. Your commitment to maintaining consistent self-care and digital balance demonstrates sustainable teaching practices.
              </p>
            </div>

            {/* Audio Affirmation Button */}
            <div className="mb-6">
              <button
                onClick={() => {
                  if (isPlayingAudio) {
                    stopAudio();
                  } else {
                    playAffirmation("When you rest, your light grows brighter. Congratulations! You have earned the Self-Care Champion Badge. Your commitment to maintaining consistent self-care and digital balance demonstrates sustainable teaching practices. You are a Self-Care Champion, showing others that rest and balance are essential. Well done!");
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

            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <p className="text-sm font-semibold text-amber-800 mb-2">💡 Teacher Tip:</p>
              <p className="text-sm text-amber-700">
                Celebrate Self-Care Champions publicly each term to normalize rest culture. Public recognition transforms self-care from individual practice to cultural norm: Term celebrations: At the end of each term, publicly celebrate Self-Care Champions during staff meetings, assemblies, or newsletters. Regular celebration creates tradition. Share stories: Invite Champions to briefly share what self-care practices helped them most. Story-sharing inspires others and creates connection. Create displays: Feature Champions on bulletin boards, websites, or newsletters with photos and brief quotes. Visibility normalizes self-care. Offer platforms: Give Champions opportunities to lead wellness workshops, facilitate self-care groups, or mentor others. Leadership creates impact. Include all staff: Celebrate Champions from all roles—teachers, administrators, support staff. Inclusion creates comprehensive culture change. Highlight practices: Share specific self-care practices that Champions used—this gives others concrete ideas to try. Practical examples support adoption. Emphasize effort: Celebrate the effort and commitment, not perfection. This makes self-care accessible to everyone. Effort-focused celebration reduces barriers. Create rituals: Make celebration a regular ritual—same time, same format each term. Rituals create meaning and anticipation. Invite reflection: Ask Champions to reflect on how self-care has impacted their teaching and well-being. Reflection deepens understanding. Build community: Connect Champions with each other to share practices and support. Community creates sustained commitment. Model leadership: Leadership should also strive to be Champions, modeling that self-care is valued at all levels. Leadership by example creates credibility. Normalize rest: Public celebration sends a clear message: rest and self-care are valued, expected, and celebrated. This transforms school culture toward sustainability. When you celebrate Self-Care Champions publicly each term to normalize rest culture, you're creating a culture that values well-being, prevents burnout, supports sustainable teaching, and transforms schools into places where rest and self-care are expected and celebrated. Public celebration makes self-care visible, valued, and normal.
              </p>
            </div>
          </div>
        ) : (
          // Badge Collection Screen
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-4 border-amber-300 mb-6"
            >
              <Sparkles className="w-16 h-16 text-amber-600" />
            </motion.div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Congratulations!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              You have successfully completed all 5 self-care activities
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
            <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-xl p-8 border-4 border-amber-300 mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 mb-4">
                <Award className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Self-Care Champion Badge
              </h3>
              <p className="text-xl text-indigo-600 font-medium italic">
                "When you rest, your light grows brighter."
              </p>
            </div>

            {/* Collect Badge Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCollectionModal(true)}
              className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-white px-12 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform transition-all duration-200"
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
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 mb-4">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Collect Your Badge
              </h3>
              <p className="text-gray-600 mb-6">
                Are you ready to collect your Self-Care Champion Badge? You'll hear the affirmation "When you rest, your light grows brighter" when you collect it!
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
                  className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                >
                  {isCollecting ? 'Collecting...' : 'Yes, Collect Badge!'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default SelfCareChampionBadge;