import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { CheckCircle, XCircle, Clock, Zap, TrendingUp, Sparkles, Book } from "lucide-react";

const TheReframeReflex = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-58";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 20;
  
  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [currentStatement, setCurrentStatement] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5); // 5 seconds per statement
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showPraise, setShowPraise] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [answeredStatements, setAnsweredStatements] = useState([]);
  const [responseTimes, setResponseTimes] = useState([]);
  const timerRef = useRef(null);

  // 20 flash statements with negative thoughts and growth responses
  const statements = [
    {
      id: 1,
      negative: "I'm not enough",
      growth: "I'm still learning",
      options: ["I'm still learning", "I'll never be good", "This is impossible", "I'm a failure"],
      correctIndex: 0
    },
    {
      id: 2,
      negative: "I failed",
      growth: "I learned what doesn't work",
      options: ["I learned what doesn't work", "I'm terrible at this", "I should quit", "This is pointless"],
      correctIndex: 0
    },
    {
      id: 3,
      negative: "I can't do this",
      growth: "I'll try a new way",
      options: ["I'll try a new way", "This is too hard for me", "I give up", "I'm not smart enough"],
      correctIndex: 0
    },
    {
      id: 4,
      negative: "I'm bad at this",
      growth: "I can get better with effort",
      options: ["I can get better with effort", "I'll never improve", "I'm hopeless", "I'm wasting my time"],
      correctIndex: 0
    },
    {
      id: 5,
      negative: "I made a mistake",
      growth: "Mistakes help me learn",
      options: ["Mistakes help me learn", "I'm so stupid", "I always mess up", "I can't do anything right"],
      correctIndex: 0
    },
    {
      id: 6,
      negative: "This is too hard",
      growth: "This will take time and effort",
      options: ["This will take time and effort", "I can't handle this", "It's too difficult", "I'm not cut out for this"],
      correctIndex: 0
    },
    {
      id: 7,
      negative: "I'll never be able to do this",
      growth: "I'm improving with practice",
      options: ["I'm improving with practice", "This is impossible", "I'll always fail", "I don't have what it takes"],
      correctIndex: 0
    },
    {
      id: 8,
      negative: "I'm not smart enough",
      growth: "I can develop my abilities",
      options: ["I can develop my abilities", "I'm too dumb", "I'll never understand", "I'm just not good enough"],
      correctIndex: 0
    },
    {
      id: 9,
      negative: "I give up",
      growth: "I'll use a different strategy",
      options: ["I'll use a different strategy", "It's not worth trying", "I'm done", "There's no point"],
      correctIndex: 0
    },
    {
      id: 10,
      negative: "This is pointless",
      growth: "I can find meaning in challenges",
      options: ["I can find meaning in challenges", "Nothing matters", "This doesn't help", "It's all useless"],
      correctIndex: 0
    },
    {
      id: 11,
      negative: "I'm overwhelmed",
      growth: "I can break this into smaller steps",
      options: ["I can break this into smaller steps", "This is too much", "I can't handle it", "I'm drowning"],
      correctIndex: 0
    },
    {
      id: 12,
      negative: "I don't know what to do",
      growth: "I can learn and figure this out",
      options: ["I can learn and figure this out", "I'm lost", "I'm clueless", "I have no idea"],
      correctIndex: 0
    },
    {
      id: 13,
      negative: "Everyone is better than me",
      growth: "I'm on my own learning journey",
      options: ["I'm on my own learning journey", "I'm the worst", "I'll never catch up", "I'm behind everyone"],
      correctIndex: 0
    },
    {
      id: 14,
      negative: "I'm a failure",
      growth: "This is feedback, not failure",
      options: ["This is feedback, not failure", "I'm worthless", "I'm a loser", "I can't do anything"],
      correctIndex: 0
    },
    {
      id: 15,
      negative: "I should be further along",
      growth: "Progress happens at different paces",
      options: ["Progress happens at different paces", "I'm behind", "I'm not good enough", "I'm failing"],
      correctIndex: 0
    },
    {
      id: 16,
      negative: "I always mess things up",
      growth: "Each attempt teaches me something new",
      options: ["Each attempt teaches me something new", "I'm hopeless", "I ruin everything", "I'm a disaster"],
      correctIndex: 0
    },
    {
      id: 17,
      negative: "I'm not cut out for this",
      growth: "I can grow into this with practice",
      options: ["I can grow into this with practice", "This isn't for me", "I'm not talented", "I'll never get it"],
      correctIndex: 0
    },
    {
      id: 18,
      negative: "This is impossible",
      growth: "This is challenging but achievable",
      options: ["This is challenging but achievable", "It can't be done", "I'm doomed", "There's no way"],
      correctIndex: 0
    },
    {
      id: 19,
      negative: "I'm wasting my time",
      growth: "Every effort builds my skills",
      options: ["Every effort builds my skills", "This is pointless", "Nothing helps", "I'm going nowhere"],
      correctIndex: 0
    },
    {
      id: 20,
      negative: "I'll never understand this",
      growth: "Understanding comes with time and effort",
      options: ["Understanding comes with time and effort", "I'm too slow", "I'm hopeless", "It's too confusing"],
      correctIndex: 0
    }
  ];

  // Shuffle statements for variety
  const [shuffledStatements, setShuffledStatements] = useState(() => {
    const shuffled = [...statements];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  // Shuffle options for each statement (only once when statement changes)
  useEffect(() => {
    if (gameState === "playing" && currentStatementData && !shuffledOptionsPerStatement[currentStatementData.id]) {
      const shuffled = [...currentStatementData.options];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      // Find the new index of the correct answer
      const newCorrectIndex = shuffled.findIndex(opt => opt === currentStatementData.growth);
      setShuffledOptionsPerStatement(prev => ({
        ...prev,
        [currentStatementData.id]: { options: shuffled, correctIndex: newCorrectIndex }
      }));
    }
  }, [gameState, currentStatementData, shuffledOptionsPerStatement]);

  // Timer effect - 5 seconds per statement
  useEffect(() => {
    if (gameState !== "playing") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (currentStatement >= shuffledStatements.length) {
      setGameState("finished");
      return;
    }

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Reset timer for new statement
    setTimeLeft(5);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowPraise(false);

    // Start countdown timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 0.1;
        if (newTime <= 0) {
          // Time's up
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          handleTimeUp();
          return 0;
        }
        return Math.max(0, newTime);
      });
    }, 100); // Update every 100ms for smoother countdown

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState, currentStatement]);

  const handleTimeUp = () => {
    const statement = shuffledStatements[currentStatement];
    setSelectedAnswer('timeUp');
    setShowFeedback(true);
    
    setAnsweredStatements(prev => [...prev, {
      statementId: statement.id,
      negative: statement.negative,
      correct: false,
      timeUp: true
    }]);

    // Move to next statement after showing feedback
    setTimeout(() => {
      if (currentStatement < shuffledStatements.length - 1) {
        setCurrentStatement(prev => prev + 1);
      } else {
        setGameState("finished");
      }
    }, 2000);
  };

  const handleAnswer = (optionIndex) => {
    if (selectedAnswer !== null || gameState !== "playing") return;

    // Clear the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const statement = shuffledStatements[currentStatement];
    const shuffledOptions = shuffledOptionsPerStatement[statement.id];
    if (!shuffledOptions) return;
    
    const isCorrect = optionIndex === shuffledOptions.correctIndex;
    const timeUsed = 5 - timeLeft;

    setSelectedAnswer(optionIndex);
    setShowFeedback(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
      setShowPraise(true);
      // Play praise sound (visual feedback)
      setTimeout(() => setShowPraise(false), 1500);
      setResponseTimes(prev => [...prev, timeUsed]);
    }

    setAnsweredStatements(prev => [...prev, {
      statementId: statement.id,
      negative: statement.negative,
      growth: statement.growth,
      selected: statement.options[optionIndex],
      correct: isCorrect,
      timeUsed: timeUsed
    }]);

    // Move to next statement after showing feedback
    setTimeout(() => {
      if (currentStatement < shuffledStatements.length - 1) {
        setCurrentStatement(prev => prev + 1);
      } else {
        setGameState("finished");
      }
    }, 2000);
  };

  const startGame = () => {
    setGameState("playing");
    setCurrentStatement(0);
    setScore(0);
    setTimeLeft(5);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowPraise(false);
    setAnsweredStatements([]);
    setResponseTimes([]);
    setShuffledOptionsPerStatement({});
  };

  const handleFinish = () => {
    setShowGameOver(true);
  };

  const currentStatementData = shuffledStatements[currentStatement];
  const progress = ((currentStatement + 1) / shuffledStatements.length) * 100;
  const currentAnswer = answeredStatements.find(a => a.statementId === currentStatementData?.id);
  const shuffledOptions = currentStatementData ? shuffledOptionsPerStatement[currentStatementData.id] : { options: [], correctIndex: 0 };
  const averageTime = responseTimes.length > 0 
    ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1)
    : 0;

  return (
    <TeacherGameShell
      title={gameData?.title || "The Reframe Reflex"}
      subtitle={gameData?.description || "Quickly convert negative thoughts into empowering ones"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentStatement}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        {gameState === "ready" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-6">⚡</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              The Reframe Reflex
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Speed game! Tap the growth mindset response fast when you see negative thoughts. 
              Build your reframing reflexes!
            </p>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-6 max-w-2xl mx-auto">
              <h3 className="font-semibold text-gray-800 mb-3">How to play:</h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li>• {shuffledStatements.length} negative thoughts will flash on screen</li>
                <li>• Quickly tap the <strong>Growth</strong> response (green) for each one</li>
                <li>• Avoid tapping fixed mindset responses (red)</li>
                <li>• You have 5 seconds per statement</li>
                <li>• Get instant praise for correct growth responses! ✨</li>
              </ul>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
            >
              <Zap className="w-6 h-6" />
              Start Game
            </motion.button>
          </div>
        )}

        {gameState === "playing" && currentStatementData && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Statement {currentStatement + 1} of {shuffledStatements.length}</span>
                <span>Score: {score} / {currentStatement + 1}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Timer */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Clock className={`w-5 h-5 ${timeLeft <= 1 ? 'text-red-500' : timeLeft <= 2 ? 'text-orange-500' : 'text-gray-600'}`} />
                <div className={`text-2xl font-bold ${timeLeft <= 1 ? 'text-red-500' : timeLeft <= 2 ? 'text-orange-500' : 'text-gray-700'}`}>
                  {timeLeft.toFixed(1)}s
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${
                    timeLeft <= 1 ? 'bg-red-500' :
                    timeLeft <= 2 ? 'bg-orange-500' :
                    'bg-green-500'
                  }`}
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeLeft / 5) * 100}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>

            {/* Negative Thought */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-200 mb-6 text-center">
              <motion.div
                key={currentStatementData.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Negative Thought:</h3>
                <p className="text-3xl font-bold text-red-600">{currentStatementData.negative}</p>
              </motion.div>
            </div>

            {/* Praise Animation */}
            <AnimatePresence>
              {showPraise && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  animate={{ opacity: 1, scale: 1.2, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: -50 }}
                  className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                >
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-8 shadow-2xl">
                    <div className="text-6xl">✨</div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.5, repeat: 1 }}
                      className="text-white text-2xl font-bold mt-4"
                    >
                      Excellent! Growth Mindset!
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Response Options */}
            {!showFeedback && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shuffledOptions.options.map((option, index) => {
                  const isGrowth = option === currentStatementData.growth;
                  
                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${
                        isGrowth
                          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 hover:border-green-400 hover:shadow-lg'
                          : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-300 hover:border-red-400'
                      } ${selectedAnswer !== null ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center gap-3">
                        {isGrowth ? (
                          <TrendingUp className="w-6 h-6 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                        )}
                        <p className={`font-semibold text-lg ${isGrowth ? 'text-green-800' : 'text-red-800'}`}>
                          {option}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Feedback */}
            <AnimatePresence>
              {showFeedback && currentAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mt-6 rounded-xl p-6 border-2 ${
                    currentAnswer.correct
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                      : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {currentAnswer.correct ? (
                      <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <h4 className={`font-bold text-xl mb-2 ${currentAnswer.correct ? 'text-green-800' : 'text-red-800'}`}>
                        {currentAnswer.correct ? 'Great! Growth Mindset!' : currentAnswer.timeUp ? 'Time\'s Up!' : 'Not Quite'}
                      </h4>
                      <p className="text-gray-700 mb-2">
                        <strong>Negative:</strong> "{currentStatementData.negative}"
                      </p>
                      <p className="text-gray-700 mb-2">
                        <strong>Growth Response:</strong> "{currentStatementData.growth}"
                      </p>
                      {currentAnswer.timeUsed && (
                        <p className="text-sm text-gray-600">
                          Response time: {currentAnswer.timeUsed.toFixed(1)}s
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {gameState === "finished" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-6xl mb-6"
            >
              {score >= shuffledStatements.length * 0.8 ? '🎉✨' : score >= shuffledStatements.length * 0.6 ? '👍💪' : '📚🌱'}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Game Complete!
            </h2>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-6 max-w-2xl mx-auto">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {score} / {shuffledStatements.length}
              </div>
              <p className="text-lg text-gray-700 mb-4">
                Growth responses selected correctly
              </p>
              {averageTime > 0 && (
                <p className="text-sm text-gray-600">
                  Average response time: {averageTime}s
                </p>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFinish}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              View Summary
            </motion.button>
          </div>
        )}

        {showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-6xl mb-4"
              >
                {score >= shuffledStatements.length * 0.8 ? '🎉✨' : '💪📚'}
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Reframe Reflex Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You've practiced quick reframing {score} times
              </p>
            </div>

            {/* Score Summary */}
            <div className={`bg-gradient-to-br rounded-xl p-6 border-2 mb-6 ${
              score >= shuffledStatements.length * 0.8
                ? 'from-green-50 to-emerald-50 border-green-200'
                : score >= shuffledStatements.length * 0.6
                ? 'from-blue-50 to-cyan-50 border-blue-200'
                : 'from-yellow-50 to-orange-50 border-yellow-200'
            }`}>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Your Score</h3>
                <div className={`text-5xl font-bold mb-2 ${
                  score >= shuffledStatements.length * 0.8 ? 'text-green-600' :
                  score >= shuffledStatements.length * 0.6 ? 'text-blue-600' :
                  'text-yellow-600'
                }`}>
                  {score} / {shuffledStatements.length}
                </div>
                <p className="text-gray-700">
                  {score >= shuffledStatements.length * 0.8
                    ? "Excellent! You've built strong reframing reflexes!"
                    : score >= shuffledStatements.length * 0.6
                    ? "Good work! Keep practicing to strengthen your reframing skills."
                    : "Keep practicing! Each game builds your reframing reflexes."}
                </p>
              </div>
            </div>

            {/* Reframing Insights */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Reframing Insights
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Speed builds reflex:</strong> Practicing quick reframing makes it automatic when negative thoughts arise.</li>
                <li>• <strong>Growth mindset is learnable:</strong> The more you practice reframing, the easier it becomes.</li>
                <li>• <strong>Instant reframing reduces anxiety:</strong> Quickly converting negative thoughts to growth ones prevents them from spiraling.</li>
                <li>• <strong>Practice makes permanent:</strong> Regular practice of reframing creates neural pathways that make it reflexive.</li>
                <li>• <strong>Every reframe strengthens resilience:</strong> Each time you reframe a negative thought, you build mental resilience.</li>
              </ul>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <Book className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Practice this before evaluations to reduce anxiety. The reframe reflex helps you quickly shift from negative to growth mindset thoughts:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Before evaluations:</strong> Practice reframing negative thoughts about your performance. Convert "I'm not prepared" to "I'll use this as a learning opportunity."</li>
                    <li><strong>During evaluations:</strong> When anxiety arises, quickly reframe: "I'm nervous" becomes "I'm energized and ready to show what I know."</li>
                    <li><strong>After evaluations:</strong> Reframe feedback: "I got negative feedback" becomes "I received valuable information for growth."</li>
                    <li><strong>Daily practice:</strong> Set aside 2-3 minutes daily to practice quick reframing. This builds the reflex so it's automatic when you need it.</li>
                    <li><strong>Create reframe cards:</strong> Write common negative thoughts on cards with their growth alternatives. Review them regularly to build the reflex.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you practice the reframe reflex regularly, especially before evaluations, you build automatic pathways that help you quickly shift from anxiety-provoking thoughts to empowering ones. This practice reduces evaluation anxiety, improves performance, and strengthens your resilience in high-stakes situations.
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

export default TheReframeReflex;

