import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Award, CheckCircle, Target, Heart, Sparkles, BookOpen, Star, TrendingUp, Moon, Coffee, TreePine, Smartphone, VolumeX } from "lucide-react";
import teacherBadgeService from "../../../../../services/teacherBadgeService";
import teacherGameCompletionService from "../../../../../services/teacherGameCompletionService";
import { toast } from "react-hot-toast";

const SelfCareChampionBadge = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-100";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 20;
  const totalLevels = gameData?.totalQuestions || 1;
  
  // Required game IDs for Self-Care Champion Badge (5 self-care activities)
  const requiredGameIds = [
    'teacher-education-93',  // Evening Log-Off Ritual
    'teacher-education-95',  // Morning Nourish Routine
    'teacher-education-96',  // Nature Reconnect Challenge
    'teacher-education-91',  // Screen-Time Mirror
    'teacher-education-99'   // Silence & Stillness Practice
  ];

  const [gameCompletionStatus, setGameCompletionStatus] = useState({});
  const [badgeStatus, setBadgeStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Game names for display
  const gameNames = {
    'teacher-education-93': 'Evening Log-Off Ritual',
    'teacher-education-95': 'Morning Nourish Routine',
    'teacher-education-96': 'Nature Reconnect Challenge',
    'teacher-education-91': 'Screen-Time Mirror',
    'teacher-education-99': 'Silence & Stillness Practice'
  };

  const gameIcons = {
    'teacher-education-93': Moon,
    'teacher-education-95': Coffee,
    'teacher-education-96': TreePine,
    'teacher-education-91': Smartphone,
    'teacher-education-99': VolumeX
  };

  useEffect(() => {
    checkBadgeStatus();
    checkGameCompletions();
  }, []);

  const checkGameCompletions = async () => {
    try {
      const status = {};
      for (const gameId of requiredGameIds) {
        try {
          const result = await teacherGameCompletionService.getGameCompletionStatus(
            gameId,
            'teacher-education'
          );
          status[gameId] = result.fullyCompleted || false;
        } catch (error) {
          console.error(`Error checking completion for ${gameId}:`, error);
          status[gameId] = false;
        }
      }
      setGameCompletionStatus(status);
    } catch (error) {
      console.error('Error checking game completions:', error);
    }
  };

  const checkBadgeStatus = async () => {
    try {
      setLoading(true);
      const status = await teacherBadgeService.getSelfCareChampionBadgeStatus();
      setBadgeStatus(status);
      
      if (status.hasBadge) {
        setScore(1);
        setShowGameOver(true);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error checking badge status:', error);
      setLoading(false);
    }
  };

  const handleCollectBadge = async () => {
    try {
      // Verify all games are completed
      const allCompleted = requiredGameIds.every(id => gameCompletionStatus[id] === true);
      
      if (!allCompleted) {
        toast.error('Please complete all 5 required self-care activities first!');
        return;
      }

      const result = await teacherBadgeService.collectSelfCareChampionBadge();
      
      if (result.success) {
        toast.success('Self-Care Champion Badge collected! 🏆');
        setBadgeStatus(prev => ({ ...prev, hasBadge: true }));
        setScore(1);
        setShowGameOver(true);
        
        // Play affirmation
        playAffirmation("When you rest, your light grows brighter.");
      } else {
        toast.error(result.error || 'Failed to collect badge');
      }
    } catch (error) {
      console.error('Error collecting badge:', error);
      toast.error('Failed to collect badge. Please try again.');
    }
  };

  const playAffirmation = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const completedCount = requiredGameIds.filter(id => gameCompletionStatus[id] === true).length;
  const allCompleted = completedCount === requiredGameIds.length;
  const hasBadge = badgeStatus?.hasBadge || false;

  if (loading) {
    return (
      <TeacherGameShell
        title={gameData?.title || "Self-Care Champion Badge"}
        subtitle={gameData?.description || "Honour teachers who maintain consistent self-care and digital balance"}
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading badge status...</p>
          </div>
        </div>
      </TeacherGameShell>
    );
  }

  if (showGameOver && hasBadge) {
    return (
      <TeacherGameShell
        title={gameData?.title || "Self-Care Champion Badge"}
        subtitle={gameData?.description || "Honour teachers who maintain consistent self-care and digital balance"}
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="teacher-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentQuestion={1}
      >
        <div className="w-full max-w-5xl mx-auto px-4">
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
                🏆✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Self-Care Champion Badge Earned!
              </h2>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 inline-block mb-4">
                <p className="text-2xl font-bold text-indigo-600 leading-relaxed">
                  "When you rest, your light grows brighter."
                </p>
              </div>
              <p className="text-xl text-gray-600">
                You've completed all 5 self-care activities and maintained consistent self-care and digital balance
              </p>
            </div>

            {/* Badge Display */}
            <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-xl p-8 border-2 border-amber-300 mb-6">
              <div className="text-center">
                <div className="text-8xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">Self-Care Champion</h3>
                <p className="text-lg text-gray-700 mb-4">
                  You've demonstrated consistent commitment to self-care and digital balance
                </p>
              </div>
            </div>

            {/* Completed Activities */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Completed Self-Care Activities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {requiredGameIds.map((gameId, index) => {
                  const Icon = gameIcons[gameId];
                  const isCompleted = gameCompletionStatus[gameId] === true;
                  
                  return (
                    <motion.div
                      key={gameId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border-2 ${
                        isCompleted
                          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {Icon && (
                          <Icon className={`w-6 h-6 flex-shrink-0 mt-1 ${
                            isCompleted ? 'text-green-600' : 'text-gray-400'
                          }`} />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-bold text-sm ${
                              isCompleted ? 'text-green-800' : 'text-gray-500'
                            }`}>
                              {gameNames[gameId]}
                            </h4>
                            {isCompleted && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                The Power of Self-Care Champions
              </h3>
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Model sustainable teaching:</strong> Champions show that self-care is essential, not optional</li>
                <li>• <strong>Inspire others:</strong> Your commitment to self-care inspires colleagues and students</li>
                <li>• <strong>Prevent burnout:</strong> Consistent self-care protects against exhaustion and burnout</li>
                <li>• <strong>Improve teaching quality:</strong> Rested, balanced teachers are more effective educators</li>
                <li>• <strong>Create culture change:</strong> Champions help normalize rest and self-care in schools</li>
                <li>• <strong>Support longevity:</strong> Self-care practices sustain long-term teaching careers</li>
                <li>• <strong>Enhance well-being:</strong> Regular self-care improves physical, emotional, and mental health</li>
                <li>• <strong>Build resilience:</strong> Consistent self-care builds capacity to handle challenges</li>
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
                    <strong>Celebrate Self-Care Champions publicly each term to normalize rest culture.</strong> Public recognition transforms self-care from individual practice to cultural norm:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-2 list-disc">
                    <li><strong>Term celebrations:</strong> At the end of each term, publicly celebrate Self-Care Champions during staff meetings, assemblies, or newsletters. Regular celebration creates tradition.</li>
                    <li><strong>Share stories:</strong> Invite Champions to briefly share what self-care practices helped them most. Story-sharing inspires others and creates connection.</li>
                    <li><strong>Create displays:</strong> Feature Champions on bulletin boards, websites, or newsletters with photos and brief quotes. Visibility normalizes self-care.</li>
                    <li><strong>Offer platforms:</strong> Give Champions opportunities to lead wellness workshops, facilitate self-care groups, or mentor others. Leadership creates impact.</li>
                    <li><strong>Include all staff:</strong> Celebrate Champions from all roles—teachers, administrators, support staff. Inclusion creates comprehensive culture change.</li>
                    <li><strong>Highlight practices:</strong> Share specific self-care practices that Champions used—this gives others concrete ideas to try. Practical examples support adoption.</li>
                    <li><strong>Emphasize effort:</strong> Celebrate the effort and commitment, not perfection. This makes self-care accessible to everyone. Effort-focused celebration reduces barriers.</li>
                    <li><strong>Create rituals:</strong> Make celebration a regular ritual—same time, same format each term. Rituals create meaning and anticipation.</li>
                    <li><strong>Invite reflection:</strong> Ask Champions to reflect on how self-care has impacted their teaching and well-being. Reflection deepens understanding.</li>
                    <li><strong>Build community:</strong> Connect Champions with each other to share practices and support. Community creates sustained commitment.</li>
                    <li><strong>Model leadership:</strong> Leadership should also strive to be Champions, modeling that self-care is valued at all levels. Leadership by example creates credibility.</li>
                    <li><strong>Normalize rest:</strong> Public celebration sends a clear message: rest and self-care are valued, expected, and celebrated. This transforms school culture toward sustainability.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you celebrate Self-Care Champions publicly each term to normalize rest culture, you're creating a culture that values well-being, prevents burnout, supports sustainable teaching, and transforms schools into places where rest and self-care are expected and celebrated. Public celebration makes self-care visible, valued, and normal.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </TeacherGameShell>
    );
  }

  return (
    <TeacherGameShell
      title={gameData?.title || "Self-Care Champion Badge"}
      subtitle={gameData?.description || "Honour teachers who maintain consistent self-care and digital balance"}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={1}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Self-Care Champion Badge
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Complete 5 self-care activities to earn this badge and honor your commitment to self-care and digital balance
            </p>
          </div>

          {/* Progress */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                Progress
              </h3>
              <div className="text-2xl font-bold text-indigo-600">
                {completedCount} / {requiredGameIds.length}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / requiredGameIds.length) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              />
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              {allCompleted 
                ? '✅ All activities completed! You can collect your badge.'
                : `Complete ${requiredGameIds.length - completedCount} more activity${requiredGameIds.length - completedCount === 1 ? '' : 'ies'} to unlock this badge`
              }
            </p>
          </div>

          {/* Required Activities */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-600" />
              Required Self-Care Activities
            </h3>
            <div className="space-y-4">
              {requiredGameIds.map((gameId, index) => {
                const Icon = gameIcons[gameId];
                const isCompleted = gameCompletionStatus[gameId] === true;
                
                return (
                  <motion.div
                    key={gameId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isCompleted
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          {Icon && <Icon className="w-6 h-6" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className={`font-bold ${
                              isCompleted ? 'text-green-800' : 'text-gray-700'
                            }`}>
                              {index + 1}. {gameNames[gameId]}
                            </h4>
                            {isCompleted && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isCompleted
                          ? 'bg-green-200 text-green-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {isCompleted ? 'Completed' : 'Not Completed'}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Collect Badge Button */}
          {allCompleted && !hasBadge && (
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCollectBadge}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
              >
                <Award className="w-5 h-5" />
                Collect Self-Care Champion Badge
              </motion.button>
            </div>
          )}

          {/* Badge Already Earned */}
          {hasBadge && (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border-2 border-amber-200 text-center">
              <div className="text-5xl mb-3">🏆</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Badge Already Earned!
              </h3>
              <p className="text-gray-700 mb-4">
                You've already collected the Self-Care Champion Badge. Thank you for your commitment to self-care and digital balance!
              </p>
              <p className="text-lg font-bold text-indigo-600 leading-relaxed">
                "When you rest, your light grows brighter."
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mt-8">
            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              About This Badge
            </h3>
            <p className="text-blue-800 leading-relaxed mb-3">
              The Self-Care Champion Badge recognizes teachers who maintain consistent self-care and digital balance. By completing these 5 activities, you demonstrate commitment to:
            </p>
            <ul className="text-blue-800 space-y-2 text-sm ml-4 list-disc">
              <li>Evening rest rituals (Log-Off Ritual)</li>
              <li>Morning nourishment practices (Morning Nourish Routine)</li>
              <li>Nature connection (Nature Reconnect Challenge)</li>
              <li>Digital awareness (Screen-Time Mirror)</li>
              <li>Mindful stillness (Silence & Stillness Practice)</li>
            </ul>
          </div>
        </div>
      </div>
    </TeacherGameShell>
  );
};

export default SelfCareChampionBadge;

