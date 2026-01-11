import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import teacherBadgeService from "../../../../../services/teacherBadgeService";
import teacherGameCompletionService from "../../../../../services/teacherGameCompletionService";
import { Users, Award, CheckCircle, BookOpen, Sparkles, Heart } from "lucide-react";

const ConnectedTeacherBadge = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-80";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  // Required game IDs for Connected Teacher Badge (5 support-oriented games)
  const requiredGameIds = [
    'teacher-education-71',  // The Support Circle
    'teacher-education-74',  // Team Gratitude Wall
    'teacher-education-76',  // Encourage-a-Colleague Challenge
    'teacher-education-78',  // Staffroom Connection Map
    'teacher-education-79'   // Team Harmony Simulation
  ];
  
  const [badgeStatus, setBadgeStatus] = useState(null);
  const [gameCompletionStatus, setGameCompletionStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  useEffect(() => {
    checkBadgeStatus();
  }, []);

  const checkBadgeStatus = async () => {
    try {
      setIsLoading(true);
      
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
      const status = await teacherBadgeService.getConnectedTeacherBadgeStatus();
      setBadgeStatus(status);
      
      if (status.hasBadge) {
        setScore(1);
        setShowGameOver(true);
      }
    } catch (error) {
      console.error('Error checking badge status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollectBadge = async () => {
    try {
      const result = await teacherBadgeService.collectConnectedTeacherBadge();
      if (result.success) {
        if (result.newlyEarned) {
          // Play affirmation audio
          playAffirmation("Connection creates calm.");
          setScore(1);
          setShowGameOver(true);
          await checkBadgeStatus();
        }
      }
    } catch (error) {
      console.error('Error collecting badge:', error);
      alert('Failed to collect badge. Please try again.');
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
  const allCompleted = completedCount === requiredGameIds.length;
  const progress = (completedCount / requiredGameIds.length) * 100;

  const gameNames = {
    'teacher-education-71': 'The Support Circle',
    'teacher-education-74': 'Team Gratitude Wall',
    'teacher-education-76': 'Encourage-a-Colleague Challenge',
    'teacher-education-78': 'Staffroom Connection Map',
    'teacher-education-79': 'Team Harmony Simulation'
  };

  if (isLoading) {
    return (
      <TeacherGameShell
        title={gameData?.title || "Connected Teacher Badge"}
        subtitle={gameData?.description || "Recognize teachers who nurture healthy community culture"}
        showGameOver={false}
        score={0}
        gameId={gameId}
        gameType="teacher-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentQuestion={1}
      >
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-gray-600">Loading badge status...</p>
          </div>
        </div>
      </TeacherGameShell>
    );
  }

  return (
    <TeacherGameShell
      title={gameData?.title || "Connected Teacher Badge"}
      subtitle={gameData?.description || "Recognize teachers who nurture healthy community culture"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={1}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🤝</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Connected Teacher Badge
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Recognize teachers who nurture healthy community culture through support, gratitude, encouragement, connection, and harmony.
              </p>
            </div>

            {/* Badge Display */}
            <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-xl p-8 border-2 border-pink-200 mb-8 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-8xl mb-4"
              >
                🤝✨
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Connected Teacher
              </h3>
              <p className="text-gray-600 mb-4">
                {badgeStatus?.hasBadge 
                  ? "You've earned this badge! Your commitment to building community creates calm and connection."
                  : "Complete 5 support-oriented games to unlock this badge."}
              </p>
            </div>

            {/* Progress */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Progress</h3>
                  <p className="text-gray-600">{completedCount} of {requiredGameIds.length} games completed</p>
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {completedCount} / {requiredGameIds.length}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-4 rounded-full"
                />
              </div>
              <p className="text-center text-sm text-gray-600">
                {progress.toFixed(0)}% Complete
              </p>
            </div>

            {/* Required Games List */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                Required Support-Oriented Games:
              </h3>
              <div className="space-y-3">
                {requiredGameIds.map((gameId, index) => {
                  const isCompleted = gameCompletionStatus[gameId] === true;
                  return (
                    <motion.div
                      key={gameId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                        isCompleted
                          ? 'bg-green-50 border-green-300'
                          : 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <span className="font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${
                          isCompleted ? 'text-green-900' : 'text-gray-800'
                        }`}>
                          {gameNames[gameId]}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {gameId === 'teacher-education-71' && 'Recognize the value of peer emotional support'}
                          {gameId === 'teacher-education-74' && 'Strengthen group morale through appreciation messages'}
                          {gameId === 'teacher-education-76' && 'Promote verbal appreciation in the workplace'}
                          {gameId === 'teacher-education-78' && 'Visualize support relationships in the workplace'}
                          {gameId === 'teacher-education-79' && 'Balance opinions, workload, and empathy in team meetings'}
                        </p>
                      </div>
                      {isCompleted && (
                        <div className="text-green-600 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-5 h-5" />
                          <span>Completed</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Collect Badge Button */}
            {allCompleted && !badgeStatus?.hasBadge && (
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCollectBadge}
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                >
                  <Award className="w-5 h-5" />
                  Collect Connected Teacher Badge
                </motion.button>
              </div>
            )}

            {badgeStatus?.hasBadge && (
              <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-green-900 mb-2">
                  Badge Collected!
                </h3>
                <p className="text-green-800">
                  You've earned the Connected Teacher Badge. Your commitment to nurturing healthy community culture is recognized.
                </p>
              </div>
            )}

            {!allCompleted && (
              <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200 text-center">
                <p className="text-amber-800 font-semibold mb-2">
                  Complete all {requiredGameIds.length} support-oriented games to unlock this badge.
                </p>
                <p className="text-sm text-amber-700">
                  Keep building connections and supporting your community!
                </p>
              </div>
            )}
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
                🤝✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Connected Teacher Badge Earned!
              </h2>
              <p className="text-xl text-gray-600 mb-4">
                "Connection creates calm."
              </p>
              <div className="text-4xl font-bold text-indigo-600 mb-6">
                Connected Teacher
              </div>
            </div>

            {/* Badge Description */}
            <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-pink-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-pink-600" />
                What This Badge Represents
              </h3>
              <p className="text-gray-800 leading-relaxed mb-4">
                The Connected Teacher Badge recognizes educators who actively nurture healthy community culture through support, gratitude, encouragement, connection, and harmony. You've demonstrated commitment to:
              </p>
              <ul className="space-y-2 text-gray-800 ml-4">
                <li>• <strong>Recognizing peer support:</strong> Understanding and valuing the importance of emotional support in teaching</li>
                <li>• <strong>Strengthening morale:</strong> Building group morale through appreciation and gratitude</li>
                <li>• <strong>Encouraging others:</strong> Promoting verbal appreciation and encouragement in the workplace</li>
                <li>• <strong>Building connections:</strong> Visualizing and strengthening support relationships</li>
                <li>• <strong>Creating harmony:</strong> Balancing opinions, workload, and empathy in team interactions</li>
              </ul>
            </div>

            {/* Impact */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Your Impact
              </h3>
              <p className="text-green-800 leading-relaxed mb-4">
                By nurturing healthy community culture, you create:
              </p>
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Stronger connections:</strong> Colleagues feel supported and connected</li>
                <li>• <strong>Reduced isolation:</strong> Teachers feel less alone and more part of a community</li>
                <li>• <strong>Higher morale:</strong> Appreciation and encouragement boost workplace satisfaction</li>
                <li>• <strong>Better collaboration:</strong> Strong relationships improve teamwork and problem-solving</li>
                <li>• <strong>Healthier culture:</strong> Balanced approaches create harmonious work environments</li>
                <li>• <strong>Resilience:</strong> Connected communities support individual and collective resilience</li>
              </ul>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <BookOpen className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed mb-3">
                    <strong>Display badge earners as peer-support ambassadors.</strong> Recognizing connected teachers creates visible role models and strengthens community culture:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Create visibility:</strong> Display badge earners' names or photos in staff areas, newsletters, or school websites. Visibility recognizes their contributions and inspires others.</li>
                    <li><strong>Celebrate publicly:</strong> Acknowledge badge earners during staff meetings, assemblies, or special events. Public recognition reinforces the value of community building.</li>
                    <li><strong>Assign ambassador roles:</strong> Give badge earners specific roles as peer-support ambassadors - they can mentor new teachers, lead support initiatives, or facilitate team-building activities.</li>
                    <li><strong>Build networks:</strong> Connect badge earners with each other to form a network of support ambassadors. This creates a peer-support infrastructure.</li>
                    <li><strong>Share stories:</strong> Highlight stories of how badge earners have supported colleagues or built connections. Stories inspire others and show the impact of community building.</li>
                    <li><strong>Offer resources:</strong> Provide badge earners with additional resources or training to expand their peer-support skills. Invest in their continued growth.</li>
                    <li><strong>Create pathways:</strong> Use badge earners to help others earn the badge. They can guide colleagues through the required games and support their journey.</li>
                    <li><strong>Recognize consistently:</strong> Regularly acknowledge and celebrate badge earners, not just once. Consistent recognition maintains motivation and culture.</li>
                    <li><strong>Link to initiatives:</strong> Connect badge earners to school initiatives around community building, wellness, or team development. They're natural leaders for these efforts.</li>
                    <li><strong>Inspire growth:</strong> Use badge earners as examples to inspire all teachers to build connections and support each other. They demonstrate what's possible.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you display badge earners as peer-support ambassadors, you're creating visible role models, celebrating community builders, building peer-support infrastructure, and inspiring others to prioritize connection and support. This recognition strengthens school culture, reduces isolation, improves collaboration, and creates a more connected and resilient teaching community.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default ConnectedTeacherBadge;

