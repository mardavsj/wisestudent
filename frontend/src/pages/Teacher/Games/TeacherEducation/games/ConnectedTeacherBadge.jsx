import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import teacherGameCompletionService from "../../../../../services/teacherGameCompletionService";
import teacherBadgeService from "../../../../../services/teacherBadgeService";
import api from "../../../../../utils/api";
import { Users, Award, CheckCircle, BookOpen, Sparkles, Heart, Lock, Volume2, VolumeX } from "lucide-react";
import { toast } from "react-toastify";

const ConnectedTeacherBadge = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get game data
  const gameId = "teacher-education-80";
  const gameData = getTeacherEducationGameById(gameId);

  const [loading, setLoading] = useState(true);
  const [gamesStatus, setGamesStatus] = useState([]);
  const [allCompleted, setAllCompleted] = useState(false);
  const [badgeCollected, setBadgeCollected] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [speechSynth, setSpeechSynth] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Required game IDs for Connected Teacher Badge (5 support-oriented games)
  const requiredGameIds = [
    'teacher-education-71',  // The Support Circle
    'teacher-education-74',  // Team Gratitude Wall
    'teacher-education-76',  // Encourage-a-Colleague Challenge
    'teacher-education-78',  // Staffroom Connection Map
    'teacher-education-79'   // Team Harmony Simulation
  ];

  const gameNames = {
    'teacher-education-71': 'The Support Circle',
    'teacher-education-74': 'Team Gratitude Wall',
    'teacher-education-76': 'Encourage-a-Colleague Challenge',
    'teacher-education-78': 'Staffroom Connection Map',
    'teacher-education-79': 'Team Harmony Simulation'
  };

  const gameIcons = {
    'teacher-education-71': '🤝',
    'teacher-education-74': '🙏',
    'teacher-education-76': '💬',
    'teacher-education-78': '🗺️',
    'teacher-education-79': '🤝'
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
          toast.info('Complete all 5 support-oriented games first to unlock this badge!');
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
      console.log('Checking badge status...');
      const result = await teacherBadgeService.getConnectedTeacherBadgeStatus();
      console.log('Badge status result:', result);
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
      console.log('Making API request to collect badge...');
      const response = await api.post('/api/school/teacher/badge/connected-teacher/collect');
      console.log('Response received:', response);

      const result = response.data;
      console.log('Result parsed:', result);

      if (result.success && (result.badgeEarned || result.newlyEarned)) {
        console.log('Badge collected successfully, updating state...');
        setBadgeCollected(true);
        setShowCollectionModal(false);
        toast.success('🎉 Badge collected successfully!');

        // Play positive audio affirmation
        const affirmation = "Connection creates calm. Congratulations! You have earned the Connected Teacher Badge. Your commitment to building community and nurturing healthy culture through support, gratitude, encouragement, connection, and harmony is recognized. You are a Community Builder, creating calm and connection in your teaching environment. Well done!";
        playAffirmation(affirmation);

        // Dispatch badge earned event
        window.dispatchEvent(new CustomEvent('teacherBadgeEarned', {
          detail: {
            badgeId: 'connected-teacher',
            badgeName: 'Connected Teacher',
            message: 'Connection creates calm.',
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
        console.error('Badge collection failed:', result);
        toast.error(result.error || 'Failed to collect badge');
      }
    } catch (error) {
      console.error('Error collecting badge:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to collect badge. Please try again.';
      toast.error(errorMessage);
    } finally {
      console.log('Setting isCollecting to false');
      setIsCollecting(false);
    }
  };

  const completedCount = gamesStatus.filter(g => g.completed).length;
  const progress = (completedCount / requiredGameIds.length) * 100;

  if (loading) {
    return (
      <TeacherGameShell
        title={gameData?.title || "Connected Teacher Badge"}
        subtitle="Checking your progress..."
        showGameOver={false}
        score={0}
        gameId={gameId}
        gameType="teacher-education"
        totalLevels={0}
        totalCoins={0}
        currentQuestion={0}
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
        title={gameData?.title || "Connected Teacher Badge"}
        subtitle="Locked - Complete all support-oriented games to unlock"
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
                Complete all 5 support-oriented games to unlock this badge
              </p>
            </div>

            {/* Progress Tracker */}
            <div className="space-y-4 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Support-Oriented Games:</h3>
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
                  {gamesStatus.filter(g => g.completed).length} / 5 games completed
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
                Complete all 5 support-oriented games to earn the Connected Teacher Badge!
              </p>
            </div>
          </div>
        </div>
      </TeacherGameShell>
    );
  }

  return (
    <TeacherGameShell
      title={gameData?.title || "Connected Teacher Badge"}
      subtitle="Recognize teachers who nurture healthy community culture"
      showGameOver={false}
      score={5}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={5}
      totalCoins={0}
      currentQuestion={0}
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
              Connected Teacher Badge
            </h2>
            <p className="text-2xl text-indigo-600 font-medium italic mb-6">
              "Connection creates calm."
            </p>
            <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-pink-200 mb-6">
              <p className="text-gray-700 text-lg">
                Congratulations! You have successfully completed all support-oriented games and earned the Connected Teacher Badge. Your commitment to nurturing healthy community culture through support, gratitude, encouragement, connection, and harmony is recognized.
              </p>
            </div>

            {/* Audio Affirmation Button */}
            <div className="mb-6">
              <button
                onClick={() => {
                  if (isPlayingAudio) {
                    stopAudio();
                  } else {
                    playAffirmation("Connection creates calm. Congratulations! You have earned the Connected Teacher Badge. Your commitment to building community and nurturing healthy culture through support, gratitude, encouragement, connection, and harmony is recognized. You are a Community Builder, creating calm and connection in your teaching environment. Well done!");
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
                Display badge earners as peer-support ambassadors. Recognizing connected teachers creates visible role models and strengthens community culture: Create visibility: Display badge earners' names or photos in staff areas, newsletters, or school websites. Visibility recognizes their contributions and inspires others. Celebrate publicly: Acknowledge badge earners during staff meetings, assemblies, or special events. Public recognition reinforces the value of community building. Assign ambassador roles: Give badge earners specific roles as peer-support ambassadors - they can mentor new teachers, lead support initiatives, or facilitate team-building activities. Build networks: Connect badge earners with each other to form a network of support ambassadors. This creates a peer-support infrastructure. Share stories: Highlight stories of how badge earners have supported colleagues or built connections. Stories inspire others and show the impact of community building. Offer resources: Provide badge earners with additional resources or training to expand their peer-support skills. Invest in their continued growth. Create pathways: Use badge earners to help others earn the badge. They can guide colleagues through the required games and support their journey. Recognize consistently: Regularly acknowledge and celebrate badge earners, not just once. Consistent recognition maintains motivation and culture. Link to initiatives: Connect badge earners to school initiatives around community building, wellness, or team development. They're natural leaders for these efforts. Inspire growth: Use badge earners as examples to inspire all teachers to build connections and support each other. They demonstrate what's possible. When you display badge earners as peer-support ambassadors, you're creating visible role models, celebrating community builders, building peer-support infrastructure, and inspiring others to prioritize connection and support. This recognition strengthens school culture, reduces isolation, improves collaboration, and creates a more connected and resilient teaching community.
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
              You have successfully completed all 5 support-oriented games
            </p>

            {/* Completed Tasks List */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-8">
              <h3 className="text-lg font-bold text-green-800 mb-4">Completed Games:</h3>
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
                Connected Teacher Badge
              </h3>
              <p className="text-xl text-indigo-600 font-medium italic">
                "Connection creates calm."
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
                Are you ready to collect your Connected Teacher Badge? You'll hear the affirmation "Connection creates calm" when you collect it!
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

export default ConnectedTeacherBadge;