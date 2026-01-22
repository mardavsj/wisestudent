import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { X, CheckCircle, TrendingUp, Sparkles, Lightbulb } from "lucide-react";

const GrowthMindsetPuzzle = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-52";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [negativeThoughts, setNegativeThoughts] = useState([
    { id: 1, text: "I can't do this", matched: false, selected: false },
    { id: 2, text: "I'm not good at this", matched: false, selected: false },
    { id: 3, text: "I failed", matched: false, selected: false },
    { id: 4, text: "This is too hard", matched: false, selected: false },
    { id: 5, text: "I give up", matched: false, selected: false }
  ]);

  const initialGrowthThoughts = [
    { id: 1, text: "I'll try a new way", matched: false, selected: false, pairId: 1 },
    { id: 2, text: "I'm still learning", matched: false, selected: false, pairId: 2 },
    { id: 3, text: "I learned what doesn't work", matched: false, selected: false, pairId: 3 },
    { id: 4, text: "This will take time and effort", matched: false, selected: false, pairId: 4 },
    { id: 5, text: "I'll use a different strategy", matched: false, selected: false, pairId: 5 }
  ];

  // Shuffle growth thoughts once on mount
  const [growthThoughts, setGrowthThoughts] = useState(() => {
    const shuffled = [...initialGrowthThoughts];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  const [selectedNegative, setSelectedNegative] = useState(null);
  const [selectedGrowth, setSelectedGrowth] = useState(null);
  const [showEmotionalBoost, setShowEmotionalBoost] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [wrongMatch, setWrongMatch] = useState(false);

  const handleNegativeClick = (negativeId) => {
    if (negativeThoughts.find(n => n.id === negativeId).matched) return;

    // Reset selection if clicking the same item
    if (selectedNegative === negativeId) {
      setSelectedNegative(null);
      setNegativeThoughts(prev => prev.map(n => ({ ...n, selected: false })));
      return;
    }

    setSelectedNegative(negativeId);
    setSelectedGrowth(null);
    setNegativeThoughts(prev => prev.map(n => ({ ...n, selected: n.id === negativeId })));
    setGrowthThoughts(prev => prev.map(g => ({ ...g, selected: false })));
    setWrongMatch(false);
  };

  const handleGrowthClick = (growthId) => {
    const growth = growthThoughts.find(g => g.id === growthId);
    if (growth.matched) return;

    if (!selectedNegative) {
      // Select the growth thought first
      setSelectedGrowth(growthId);
      setGrowthThoughts(prev => prev.map(g => ({ ...g, selected: g.id === growthId })));
      return;
    }

    // Check if this is the correct match
    const negative = negativeThoughts.find(n => n.id === selectedNegative);
    if (growth.pairId === negative.id) {
      // Correct match!
      setNegativeThoughts(prev => prev.map(n =>
        n.id === negative.id ? { ...n, matched: true, selected: false } : { ...n, selected: false }
      ));
      setGrowthThoughts(prev => prev.map(g =>
        g.id === growthId ? { ...g, matched: true, selected: false } : { ...g, selected: false }
      ));
      setMatchedPairs([...matchedPairs, { negative: negative.id, growth: growthId }]);
      setScore(prev => prev + 1);
      setSelectedNegative(null);
      setSelectedGrowth(null);
      setWrongMatch(false);

      // Show emotional boost animation
      setShowEmotionalBoost(true);
      setTimeout(() => setShowEmotionalBoost(false), 2000);

      // Check if all matched
      if (matchedPairs.length + 1 === 5) {
        setTimeout(() => setShowGameOver(true), 500);
      }
    } else {
      // Wrong match
      setWrongMatch(true);
      setTimeout(() => {
        setSelectedNegative(null);
        setSelectedGrowth(null);
        setNegativeThoughts(prev => prev.map(n => ({ ...n, selected: false })));
        setGrowthThoughts(prev => prev.map(g => ({ ...g, selected: false })));
        setWrongMatch(false);
      }, 1000);
    }
  };

  const allMatched = matchedPairs.length === 5;

  return (
    <TeacherGameShell
      title={gameData?.title || "Growth Mindset Puzzle"}
      subtitle={gameData?.description || "Learn to reframe 'failure' as feedback for improvement"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={matchedPairs.length}
    >
      <div className="w-full max-w-6xl mx-auto px-4">
        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Growth Mindset Puzzle</h2>
              <p className="text-gray-600 text-lg">
                Match negative thoughts with their growth mindset alternatives
              </p>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span className="font-semibold">Matches: {matchedPairs.length} / 5</span>
                <span className="font-semibold">{Math.round((matchedPairs.length / 5) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(matchedPairs.length / 5) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>How to play:</strong> Click on a negative thought, then click on its matching growth mindset alternative.
                When you make a correct match, watch for the emotional boost! 💚
              </p>
            </div>

            {/* Wrong Match Feedback */}
            <AnimatePresence>
              {wrongMatch && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-red-700">
                    <X className="w-5 h-5" />
                    <span className="font-semibold">Not a match! Try again.</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Emotional Boost Animation */}
            <AnimatePresence>
              {showEmotionalBoost && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  animate={{ opacity: 1, scale: 1.2, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: -50 }}
                  className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                >
                  <div className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-full p-8 shadow-2xl">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 0.6, repeat: 1 }}
                      className="text-white"
                    >
                      <Sparkles className="w-16 h-16" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-white text-2xl font-bold mt-4 text-center"
                    >
                      +1 Growth! 💚
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Negative Thoughts Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <X className="w-5 h-5 text-red-500" />
                Fixed Mindset Thoughts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {negativeThoughts.map((thought) => {
                  const isMatched = thought.matched;
                  const isSelected = thought.selected;

                  return (
                    <motion.button
                      key={thought.id}
                      whileHover={!isMatched ? { scale: 1.02 } : {}}
                      whileTap={!isMatched ? { scale: 0.98 } : {}}
                      onClick={() => handleNegativeClick(thought.id)}
                      disabled={isMatched}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${isMatched
                          ? 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed'
                          : isSelected
                            ? 'bg-red-100 border-red-400 shadow-lg'
                            : 'bg-white border-gray-300 hover:border-red-400 hover:bg-red-50'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${isMatched ? 'text-gray-500 line-through' : 'text-gray-800'
                          }`}>
                          {thought.text}
                        </span>
                        {isMatched && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
                        {isSelected && !isMatched && (
                          <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Growth Thoughts Section */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Growth Mindset Alternatives
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {growthThoughts.map((thought) => {
                  const isMatched = thought.matched;
                  const isSelected = thought.selected;

                  return (
                    <motion.button
                      key={thought.id}
                      whileHover={!isMatched ? { scale: 1.02 } : {}}
                      whileTap={!isMatched ? { scale: 0.98 } : {}}
                      onClick={() => handleGrowthClick(thought.id)}
                      disabled={isMatched}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${isMatched
                          ? 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed'
                          : isSelected || (selectedNegative && !selectedGrowth)
                            ? 'bg-green-100 border-green-400 shadow-lg'
                            : 'bg-white border-gray-300 hover:border-green-400 hover:bg-green-50'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${isMatched ? 'text-gray-500 line-through' : 'text-gray-800'
                          }`}>
                          {thought.text}
                        </span>
                        {isMatched && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
                        {isSelected && !isMatched && (
                          <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Puzzle Complete!</h2>
              <p className="text-xl text-gray-600">You've successfully reframed all negative thoughts!</p>
            </div>

            {/* Score */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {score} / 5 Matches
              </div>
              <p className="text-gray-700">
                Great job! You've mastered the art of reframing negative thoughts into growth mindset alternatives.
              </p>
            </div>

            {/* All Matched Pairs */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Growth Mindset Reframes:</h3>
              <div className="space-y-3">
                {[
                  { negative: "I can't do this", growth: "I'll try a new way" },
                  { negative: "I'm not good at this", growth: "I'm still learning" },
                  { negative: "I failed", growth: "I learned what doesn't work" },
                  { negative: "This is too hard", growth: "This will take time and effort" },
                  { negative: "I give up", growth: "I'll use a different strategy" }
                ].map((pair, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-red-50 via-white to-green-50 rounded-lg p-4 border-2 border-gray-200"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                        <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span className="text-gray-700 line-through">{pair.negative}</span>
                      </div>
                      <div className="text-gray-400">→</div>
                      <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                        <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-green-700 font-medium">{pair.growth}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Growth Mindset Insights */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Key Insights
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Reframing is a skill:</strong> The ability to reframe negative thoughts into growth alternatives gets stronger with practice.</li>
                <li>• <strong>Failure is feedback:</strong> When something doesn't work, it's information about what to try differently, not proof you can't do it.</li>
                <li>• <strong>Effort matters:</strong> Growth mindset recognizes that abilities can be developed through dedication and hard work.</li>
                <li>• <strong>Challenges are opportunities:</strong> Difficult situations are chances to learn and grow, not threats to avoid.</li>
                <li>• <strong>Self-talk shapes reality:</strong> The words you use with yourself influence your actions, emotions, and outcomes.</li>
              </ul>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed mb-3">
                    Post common "reframe phrases" around teacher desks. Create small reminder cards or posters with growth mindset reframes and place them around your desk, on your computer monitor, or in your planner. Having these phrases visible helps you practice reframing in the moment when negative thoughts arise. You might include:
                  </p>
                  <div className="bg-white/60 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-red-600 line-through">"I can't"</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-green-600 font-medium">"I'll try a new way"</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-red-600 line-through">"I failed"</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-green-600 font-medium">"I learned what doesn't work"</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-red-600 line-through">"This is too hard"</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-green-600 font-medium">"This will take time and effort"</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-red-600 line-through">"I'm not good at this"</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-green-600 font-medium">"I'm still learning"</span>
                    </div>
                  </div>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    These visual reminders help you catch negative self-talk in the moment and reframe it immediately. Share these reframe phrases with colleagues and create a supportive culture of growth mindset in your school. Consider having a "Reframe Board" in the staffroom where teachers can share their favorite growth mindset phrases and learn from each other.
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

export default GrowthMindsetPuzzle;