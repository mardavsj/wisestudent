import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Award, CheckCircle, Target, Heart, Sparkles, BookOpen, Star, TrendingUp } from "lucide-react";
import teacherBadgeService from "../../../../../services/teacherBadgeService";
import teacherGameCompletionService from "../../../../../services/teacherGameCompletionService";

const PurposefulTeacherBadge = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-90";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [badgeStatus, setBadgeStatus] = useState(null);
  const [gameCompletionStatus, setGameCompletionStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [collecting, setCollecting] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Required game IDs for Purposeful Teacher Badge (5 purpose-related activities)
  const requiredGameIds = [
    'teacher-education-81',  // Why I Teach
    'teacher-education-85',  // Meaning in the Moment
    'teacher-education-86',  // Fulfillment Journal
    'teacher-education-87',  // Impact Visualization
    'teacher-education-82'   // The Ripple Effect
  ];

  // Game information for display
  const requiredGames = [
    {
      id: 'teacher-education-81',
      name: 'Why I Teach',
      description: 'Reconnect with the original reason for becoming a teacher',
      emoji: '💫',
      color: 'from-purple-400 to-indigo-500'
    },
    {
      id: 'teacher-education-85',
      name: 'Meaning in the Moment',
      description: 'Practice finding purpose in ordinary classroom moments',
      emoji: '💡',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'teacher-education-86',
      name: 'Fulfillment Journal',
      description: 'Reflect on the week\'s most meaningful teaching experience',
      emoji: '📔',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'teacher-education-87',
      name: 'Impact Visualization',
      description: 'Visualize future student success inspired by your teaching',
      emoji: '✨',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'teacher-education-82',
      name: 'The Ripple Effect',
      description: 'Realize the long-term impact teachers have on students\' lives',
      emoji: '🌊',
      color: 'from-blue-400 to-cyan-500'
    }
  ];

  useEffect(() => {
    checkBadgeStatus();
  }, []);

  const checkBadgeStatus = async () => {
    try {
      setLoading(true);
      
      // Check completion status for each required game
      const completionStatus = {};
      const completionPromises = requiredGameIds.map(async (gameId) => {
        try {
          const progress = await teacherGameCompletionService.getGameProgress(gameId);
          completionStatus[gameId] = progress?.fullyCompleted === true;
          return {
            gameId,
            completed: progress?.fullyCompleted === true
          };
        } catch (error) {
          console.error(`Error checking game ${gameId}:`, error);
          completionStatus[gameId] = false;
          return { gameId, completed: false };
        }
      });
      
      await Promise.all(completionPromises);
      setGameCompletionStatus(completionStatus);
      
      // Check badge status
      const status = await teacherBadgeService.getPurposefulTeacherBadgeStatus();
      setBadgeStatus(status);

      if (status.hasBadge) {
        setScore(1);
        setShowGameOver(true);
      }
    } catch (error) {
      console.error('Error checking badge status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectBadge = async () => {
    try {
      setCollecting(true);
      
      const result = await teacherBadgeService.collectPurposefulTeacherBadge();
      if (result.success) {
        if (result.newlyEarned) {
          // Play affirmation audio
          playAffirmation("Your purpose lights paths.");
          setScore(1);
          setShowGameOver(true);
          await checkBadgeStatus();
        }
      }
    } catch (error) {
      console.error('Error collecting badge:', error);
      alert('Failed to collect badge. Please try again.');
    } finally {
      setCollecting(false);
    }
  };

  const playAffirmation = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  const completedCount = Object.values(gameCompletionStatus).filter(status => status === true).length;
  const allRequiredCompleted = completedCount === requiredGameIds.length;
  const progress = (completedCount / requiredGameIds.length) * 100;

  if (loading) {
    return (
      <TeacherGameShell
        title={gameData?.title || "Purposeful Teacher Badge"}
        subtitle={gameData?.description || "Reward teachers who sustain joy, gratitude, and meaning in their work"}
        showGameOver={false}
        score={0}
        gameId={gameId}
        gameType="teacher-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentQuestion={1}
      >
        <div className="w-full max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-xl text-gray-600">Loading badge status...</p>
          </div>
        </div>
      </TeacherGameShell>
    );
  }

  return (
    <TeacherGameShell
      title={gameData?.title || "Purposeful Teacher Badge"}
      subtitle={gameData?.description || "Reward teachers who sustain joy, gratitude, and meaning in their work"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={1}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-6xl mb-4"
              >
                {badgeStatus?.hasBadge ? "✨" : "🎯"}
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Purposeful Teacher Badge
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Reward teachers who sustain joy, gratitude, and meaning in their work. Complete 5 purpose-related activities to unlock this badge.
              </p>
            </div>

            {/* Badge Display */}
            {badgeStatus?.hasBadge ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-8 border-2 border-purple-200 mb-8"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    className="text-8xl mb-4"
                  >
                    ✨
                  </motion.div>
                  <h3 className="text-2xl font-bold text-purple-800 mb-2">
                    Badge Earned!
                  </h3>
                  <p className="text-lg text-gray-700 mb-4">
                    You've sustained joy, gratitude, and meaning in your work!
                  </p>
                  <div className="bg-white rounded-lg p-6 border-2 border-purple-300 inline-block">
                    <p className="text-2xl font-bold text-purple-700 italic">
                      "Your purpose lights paths."
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Progress */}
                <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        Progress to Unlock Badge
                      </h3>
                      <p className="text-gray-600">
                        {completedCount} of {requiredGameIds.length} activities completed
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-purple-600 mb-1">
                        {Math.round(progress)}%
                      </div>
                      <p className="text-sm text-gray-600">Complete</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-4 rounded-full"
                    />
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    {allRequiredCompleted 
                      ? "🎉 All activities completed! You can now collect your badge."
                      : `Complete ${requiredGameIds.length - completedCount} more activity${requiredGameIds.length - completedCount > 1 ? 'ies' : ''} to unlock the badge.`}
                  </p>
                </div>

                {/* Required Activities */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Target className="w-6 h-6 text-purple-600" />
                    Required Activities
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Complete these 5 purpose-related activities to unlock the Purposeful Teacher Badge:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {requiredGames.map((game, index) => {
                      const isCompleted = gameCompletionStatus[game.id] === true;
                      return (
                        <motion.div
                          key={game.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-6 rounded-xl border-2 transition-all ${
                            isCompleted
                              ? `${game.color} bg-gradient-to-br text-white border-white shadow-lg`
                              : 'bg-white border-gray-300 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`text-4xl ${isCompleted ? 'filter drop-shadow-lg' : ''}`}>
                              {game.emoji}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className={`font-bold text-lg ${
                                  isCompleted ? 'text-white' : 'text-gray-800'
                                }`}>
                                  {game.name}
                                </h4>
                                {isCompleted && (
                                  <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                                )}
                              </div>
                              <p className={`text-sm ${
                                isCompleted ? 'text-white/90' : 'text-gray-600'
                              }`}>
                                {game.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Collect Badge Button */}
                {allRequiredCompleted && !badgeStatus?.hasBadge && (
                  <div className="text-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCollectBadge}
                      disabled={collecting}
                      className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {collecting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Collecting...
                        </>
                      ) : (
                        <>
                          <Award className="w-5 h-5" />
                          Collect Purposeful Teacher Badge
                        </>
                      )}
                    </motion.button>
                  </div>
                )}

                {/* Badge Preview */}
                <div className="bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100 rounded-xl p-6 border-2 border-purple-200 mt-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-purple-600" />
                    Badge Preview
                  </h3>
                  <div className="text-center">
                    <div className="text-6xl mb-4 filter drop-shadow-lg">✨</div>
                    <p className="text-xl font-bold text-purple-700 italic mb-2">
                      "Your purpose lights paths."
                    </p>
                    <p className="text-sm text-gray-600">
                      Earn this badge by completing 5 purpose-related activities that help you sustain joy, gratitude, and meaning in your teaching work.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Benefits */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mt-8">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                The Power of Purpose in Teaching
              </h3>
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Sustains joy:</strong> Connecting to purpose helps maintain joy even during challenges</li>
                <li>• <strong>Builds gratitude:</strong> Purpose awareness increases appreciation for meaningful moments</li>
                <li>• <strong>Creates meaning:</strong> Understanding purpose transforms ordinary moments into meaningful ones</li>
                <li>• <strong>Reduces burnout:</strong> Purpose connection protects against burnout and exhaustion</li>
                <li>• <strong>Strengthens resilience:</strong> Knowing your "why" builds resilience during difficulties</li>
                <li>• <strong>Guides decisions:</strong> Purpose clarity helps make decisions aligned with values</li>
                <li>• <strong>Inspires others:</strong> Living with purpose inspires students and colleagues</li>
                <li>• <strong>Creates legacy:</strong> Purpose-driven teaching creates lasting positive impact</li>
              </ul>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200 mt-6">
              <div className="flex items-start gap-3">
                <BookOpen className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed mb-3">
                    <strong>Showcase Purpose Badge earners during Teacher Appreciation Week.</strong> Celebrating teachers who sustain purpose creates inspiration and recognition:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Create display:</strong> Display badges and names of Purpose Badge earners in a prominent location during Teacher Appreciation Week. Visual recognition celebrates achievements.</li>
                    <li><strong>Share stories:</strong> Invite badge earners to share brief stories about their purpose journey. Stories inspire others and create connection.</li>
                    <li><strong>Highlight impact:</strong> Emphasize how purpose-driven teaching creates positive impact. Impact recognition reinforces value.</li>
                    <li><strong>Celebrate diversity:</strong> Recognize that purpose looks different for each teacher. Diversity celebration honors unique paths.</li>
                    <li><strong>Inspire others:</strong> Use badge earners as examples of purpose-sustained teaching. Inspiration encourages others to explore purpose.</li>
                    <li><strong>Create traditions:</strong> Make showcasing Purpose Badge earners a yearly tradition. Traditions create anticipation and continuity.</li>
                    <li><strong>Include students:</strong> Consider sharing with students (when appropriate) how teachers sustain purpose. Student inclusion builds connection.</li>
                    <li><strong>Document journey:</strong> Document the purpose journey through photos, quotes, or reflections. Documentation preserves impact.</li>
                    <li><strong>Network opportunities:</strong> Create opportunities for badge earners to connect and share. Networking strengthens community.</li>
                    <li><strong>Ongoing recognition:</strong> Continue recognizing purpose throughout the year, not just during one week. Ongoing recognition sustains motivation.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you showcase Purpose Badge earners during Teacher Appreciation Week, you're creating a practice that celebrates purpose, inspires others, recognizes impact, builds community, and reinforces the value of sustaining joy, gratitude, and meaning in teaching. This recognition transforms individual achievement into collective inspiration that benefits the entire school community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Over Summary */}
        {showGameOver && badgeStatus?.hasBadge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-6xl mb-4"
              >
                ✨🎯
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Purposeful Teacher Badge Earned!
              </h2>
              <p className="text-xl text-gray-600">
                You've sustained joy, gratitude, and meaning in your work
              </p>
            </div>

            {/* Badge Celebration */}
            <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-8 border-2 border-purple-200 mb-6">
              <div className="text-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  className="text-8xl mb-4 filter drop-shadow-lg"
                >
                  ✨
                </motion.div>
                <h3 className="text-3xl font-bold text-purple-800 mb-4">
                  Your Purpose Lights Paths
                </h3>
                <div className="bg-white rounded-lg p-6 border-2 border-purple-300 inline-block mb-4">
                  <p className="text-2xl font-bold text-purple-700 italic">
                    "Your purpose lights paths."
                  </p>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
                  You've completed 5 purpose-related activities that help you sustain joy, gratitude, and meaning in your teaching work. Your commitment to purpose-driven teaching creates ripples of impact that extend far beyond your classroom.
                </p>
              </div>
            </div>

            {/* Completed Activities */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Activities Completed
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requiredGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${game.color} rounded-xl p-4 border-2 border-white shadow-lg text-white`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{game.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold">{game.name}</h4>
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        </div>
                        <p className="text-sm text-white/90">{game.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Key Insight */}
            <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
              <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Remember:
              </h3>
              <p className="text-purple-800 leading-relaxed">
                Your purpose in teaching creates light that guides not only your own path but the paths of your students, colleagues, and school community. By sustaining joy, gratitude, and meaning in your work, you model what it means to teach with purpose and inspire others to do the same. Your purpose lights paths for generations to come.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default PurposefulTeacherBadge;

