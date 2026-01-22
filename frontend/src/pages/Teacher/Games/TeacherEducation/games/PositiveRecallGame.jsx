import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Sparkles, CheckCircle, Star, Award, Heart, Camera } from "lucide-react";

const PositiveRecallGame = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-54";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [memories, setMemories] = useState(["", "", "", "", ""]);
  const [completedCount, setCompletedCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState([false, false, false, false, false]);
  const [optimismScore, setOptimismScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Photo-style prompts for success memories
  const prompts = [
    {
      id: 1,
      icon: Heart,
      prompt: "When did a student thank you?",
      description: "Think of a moment when a student expressed gratitude or appreciation for your teaching.",
      placeholder: "e.g., A student stayed after class to thank me for helping them understand..."
    },
    {
      id: 2,
      icon: Star,
      prompt: "When did a lesson really work?",
      description: "Recall a time when a lesson clicked, students were engaged, and learning happened beautifully.",
      placeholder: "e.g., When I used that hands-on activity, every student was fully engaged..."
    },
    {
      id: 3,
      icon: Award,
      prompt: "When did you make a difference?",
      description: "Remember a moment when you truly made a positive impact on a student's life or learning.",
      placeholder: "e.g., A student who struggled finally understood a concept and their face lit up..."
    },
    {
      id: 4,
      icon: Camera,
      prompt: "When did you overcome a challenge?",
      description: "Think of a time when you successfully navigated a difficult situation or obstacle in your teaching.",
      placeholder: "e.g., When I had to adapt my lesson plan mid-class due to unexpected circumstances..."
    },
    {
      id: 5,
      icon: Sparkles,
      prompt: "When did you learn something new?",
      description: "Recall a moment when you gained new insight, skill, or knowledge that improved your teaching.",
      placeholder: "e.g., A colleague shared a strategy that transformed my approach to classroom management..."
    }
  ];

  // Confetti particles component
  const Confetti = ({ show }) => {
    if (!show) return null;

    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1 + Math.random() * 0.5,
    }));

    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {particles.map((particle) => {
          const colors = ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
          const color = colors[Math.floor(Math.random() * colors.length)];

          return (
            <motion.div
              key={particle.id}
              initial={{
                x: `${particle.x}%`,
                y: '50%',
                opacity: 1,
                scale: 1,
              }}
              animate={{
                y: '150%',
                opacity: 0,
                scale: 0,
                rotate: 360,
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: "easeOut",
              }}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: color,
                left: `${particle.x}%`,
                top: '20%',
              }}
            />
          );
        })}
        {/* Star particles */}
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={`star-${i}`}
            initial={{
              x: `${Math.random() * 100}%`,
              y: '50%',
              opacity: 1,
              scale: 1,
              rotate: 0,
            }}
            animate={{
              y: '150%',
              opacity: 0,
              scale: 0,
              rotate: 720,
            }}
            transition={{
              duration: 1.5 + Math.random() * 0.5,
              delay: Math.random() * 0.3,
              ease: "easeOut",
            }}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: '20%',
            }}
          >
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </motion.div>
        ))}
      </div>
    );
  };

  const handleMemoryChange = (index, value) => {
    const wasCompleted = memories[index].trim().length > 0;
    const newMemories = [...memories];
    newMemories[index] = value;
    setMemories(newMemories);

    const isNowCompleted = value.trim().length > 0;

    // If just completed, trigger confetti and update count
    if (isNowCompleted && !wasCompleted) {
      const newConfetti = [...showConfetti];
      newConfetti[index] = true;
      setShowConfetti(newConfetti);

      setTimeout(() => {
        const resetConfetti = [...newConfetti];
        resetConfetti[index] = false;
        setShowConfetti(resetConfetti);
      }, 2000);

      setCompletedCount(prev => prev + 1);
    } else if (!isNowCompleted && wasCompleted) {
      // If uncompleted, decrease count
      setCompletedCount(prev => Math.max(0, prev - 1));
    }

    // Calculate optimism score
    const completed = newMemories.filter(m => m.trim().length > 0).length;
    const newOptimismScore = Math.round((completed / 5) * 100);
    setOptimismScore(newOptimismScore);
  };

  const handleComplete = () => {
    const completed = memories.filter(m => m.trim().length > 0).length;

    if (completed === 0) {
      alert("Please write at least one success memory to reinforce optimism.");
      return;
    }

    if (completed < 5) {
      if (!confirm(`You've written ${completed} success memor${completed !== 1 ? 'ies' : 'y'}. Would you like to add more, or complete with what you have?`)) {
        return;
      }
    }

    setScore(completed);
    setShowGameOver(true);
  };

  const currentCompleted = memories.filter(m => m.trim().length > 0).length;
  const allCompleted = currentCompleted === 5;

  return (
    <TeacherGameShell
      title={gameData?.title || "Positive Recall Game"}
      subtitle={gameData?.description || "Reinforce optimism by recalling moments of past success"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={0}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        {/* Confetti Animation */}
        {showConfetti.some(c => c) && (
          <Confetti show={showConfetti.some(c => c)} />
        )}

        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">📸</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Recall Your Success Moments
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Take a mental photo of your successes. Write 5 moments when you made a positive impact, and watch confetti celebrate each one!
              </p>
            </div>

            {/* Optimism Score Indicator */}
            <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 rounded-xl p-6 border-2 border-yellow-200 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${optimismScore >= 66 ? 'from-yellow-400 to-orange-500' :
                      optimismScore >= 33 ? 'from-orange-400 to-pink-500' :
                        'from-gray-300 to-gray-400'
                    } flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
                    {optimismScore}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Optimism Score</h3>
                    <p className="text-sm text-gray-600">Rises as you recall successes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Memories Written</p>
                  <p className="text-3xl font-bold text-orange-600">{currentCompleted} / 5</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${optimismScore}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-4 rounded-full ${optimismScore >= 66 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                      optimismScore >= 33 ? 'bg-gradient-to-r from-orange-400 to-pink-500' :
                        'bg-gradient-to-r from-gray-300 to-gray-400'
                    } shadow-md`}
                />
              </div>

              {/* Optimism Score Message */}
              <p className="text-sm text-center text-gray-600 mt-2">
                {optimismScore === 0 && "Start writing success memories to build optimism..."}
                {optimismScore > 0 && optimismScore < 20 && "Great start! Recall more successes..."}
                {optimismScore >= 20 && optimismScore < 40 && "You're building optimism! Continue..."}
                {optimismScore >= 40 && optimismScore < 60 && "Keep going! You're making progress..."}
                {optimismScore >= 60 && optimismScore < 80 && "Almost there! Just a bit more..."}
                {optimismScore >= 80 && optimismScore < 100 && "Wonderful! Almost there..."}
                {optimismScore === 100 && "Perfect! You've reinforced optimism with positive recall."}
              </p>
            </div>

            {/* Success Memory Input Boxes */}
            <div className="space-y-6 mb-8">
              {prompts.map((promptData, index) => {
                const Icon = promptData.icon;
                const isCompleted = memories[index].trim().length > 0;
                const showConfettiForThis = showConfetti[index];

                return (
                  <motion.div
                    key={promptData.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative rounded-xl border-2 transition-all ${isCompleted
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-md'
                        : 'bg-white border-gray-300 hover:border-orange-400'
                      }`}
                  >
                    {showConfettiForThis && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center z-10"
                      >
                        <motion.div
                          initial={{ scale: 0, rotate: 0 }}
                          animate={{ scale: [1, 1.5, 1], rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className="text-6xl"
                        >
                          🎉
                        </motion.div>
                      </motion.div>
                    )}

                    <div className="p-6 relative">
                      <div className="flex items-start gap-4 mb-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg'
                            : 'bg-gray-200'
                          }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-white" />
                          ) : (
                            <Icon className={`w-6 h-6 ${isCompleted ? 'text-white' : 'text-gray-500'}`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Camera className="w-4 h-4 text-gray-400" />
                            <label className="block text-lg font-bold text-gray-800">
                              {promptData.prompt}
                            </label>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {promptData.description}
                          </p>
                        </div>
                        {isCompleted && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <Sparkles className="w-6 h-6 text-yellow-500" />
                          </motion.div>
                        )}
                      </div>
                      <textarea
                        value={memories[index]}
                        onChange={(e) => handleMemoryChange(index, e.target.value)}
                        placeholder={promptData.placeholder}
                        className={`w-full h-32 p-4 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none ${isCompleted
                            ? 'bg-white border-yellow-300 focus:border-yellow-400'
                            : 'bg-gray-50 border-gray-300 focus:border-orange-400'
                          }`}
                      />
                      {isCompleted && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 text-sm text-orange-600 font-medium flex items-center gap-2"
                        >
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>Success memory saved! Recalling past wins builds optimism.</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Examples */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 font-semibold mb-2">
                💡 Remember: Every success moment matters
              </p>
              <p className="text-xs text-blue-700 leading-relaxed">
                Success memories don't have to be big achievements. Small moments of connection, understanding, progress, or growth all count. Recalling these moments reinforces your sense of competence and builds optimism for future challenges.
              </p>
            </div>

            {/* Complete Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleComplete}
                disabled={currentCompleted === 0}
                className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all ${allCompleted
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-xl'
                    : currentCompleted > 0
                      ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {allCompleted ? (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Complete & Celebrate!
                  </span>
                ) : currentCompleted > 0 ? (
                  `Complete with ${currentCompleted} Memor${currentCompleted !== 1 ? 'ies' : 'y'} `
                ) : (
                  "Write at least one success memory to complete"
                )}
              </motion.button>
            </div>
          </div>
        )}

        {/* Game Over Summary */}
        {showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-6xl mb-4"
              >
                🎉✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Success Memories Captured!
              </h2>
              <p className="text-xl text-gray-600">
                You've reinforced optimism by recalling your wins
              </p>
            </div>

            {/* Final Optimism Score */}
            <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 rounded-xl p-6 border-2 border-yellow-200 mb-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Final Optimism Score</h3>
                <div className={`text-5xl font-bold mb-2 ${optimismScore >= 66 ? 'text-yellow-600' :
                    optimismScore >= 33 ? 'text-orange-600' :
                      'text-gray-600'
                  }`}>
                  {optimismScore}%
                </div>
                <p className="text-gray-700">
                  {optimismScore >= 66
                    ? "Excellent! You've reinforced strong optimism by recalling multiple success moments."
                    : optimismScore >= 33
                      ? "Good progress! Recalling success moments builds optimism and resilience."
                      : "Every success memory counts! Recalling even one moment reinforces optimism."}
                </p>
              </div>
            </div>

            {/* Success Memories Summary */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Success Memories:</h3>
              <div className="space-y-4">
                {memories.map((memory, index) => {
                  if (!memory.trim()) return null;
                  const Icon = prompts[index].icon;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-5 border-2 border-yellow-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 mb-1">{prompts[index].prompt}</p>
                          <p className="text-gray-700 leading-relaxed">{memory}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Optimism Insights */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Optimism Building Insights
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Recall reinforces resilience:</strong> Actively recalling past successes strengthens your belief in your ability to handle future challenges.</li>
                <li>• <strong>Positive memory building:</strong> Regularly recalling success moments creates a library of positive memories that you can draw on during difficult times.</li>
                <li>• <strong>Evidence-based optimism:</strong> These memories provide concrete evidence of your competence and impact, making optimism more grounded and sustainable.</li>
                <li>• <strong>Small wins matter:</strong> Success doesn't have to be big. Small moments of connection, understanding, progress, or growth all contribute to building optimism.</li>
                <li>• <strong>Consistency is key:</strong> Making this practice regular (like weekly) helps maintain and build optimism over time.</li>
              </ul>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <Camera className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Use "3 Wins of the Week" practice on Fridays. At the end of each week, take 10-15 minutes to:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Write down 3 wins:</strong> Recall 3 moments from the week when things went well, you made a difference, or you felt successful.</li>
                    <li><strong>Share with colleagues:</strong> Create a "Wins Sharing" time where teachers share one win each. This builds collective optimism and creates a positive school culture.</li>
                    <li><strong>Create a wins journal:</strong> Keep a dedicated journal or digital document where you record weekly wins. Review it when you need a boost of optimism.</li>
                    <li><strong>Make it a ritual:</strong> Set a Friday reminder or calendar event to ensure you consistently practice "3 Wins of the Week."</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    This weekly practice helps you end the week on a positive note, reinforces your sense of competence and impact, and builds optimism that carries into the next week. Regular recall of success moments creates a foundation of positive memories that support resilience and well-being throughout the school year. Consider making it a staff-wide practice to build collective optimism and positive school culture.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default PositiveRecallGame;