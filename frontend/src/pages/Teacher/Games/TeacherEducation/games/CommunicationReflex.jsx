import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Zap, CheckCircle, XCircle, MessageCircle, TrendingUp, BookOpen, Clock, Target } from "lucide-react";

const CommunicationReflex = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-69";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 20;
  
  const [gameState, setGameState] = useState("instructions"); // instructions, playing, gameOver
  const [currentCard, setCurrentCard] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30); // 30 seconds
  const [selectedCards, setSelectedCards] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showGameOver, setShowGameOver] = useState(false);
  const [reactionTime, setReactionTime] = useState([]);
  const [startTime, setStartTime] = useState(null);

  // Communication cue flash cards (positive vs negative)
  const communicationCues = [
    {
      id: 1,
      text: "You never listen",
      type: "negative",
      explanation: "Negative: Uses 'never' which is absolute and accusatory. Creates defensiveness."
    },
    {
      id: 2,
      text: "Can we talk?",
      type: "positive",
      explanation: "Positive: Invites dialogue with openness. Creates space for conversation."
    },
    {
      id: 3,
      text: "This is all your fault",
      type: "negative",
      explanation: "Negative: Places blame entirely on one person. Creates defensiveness and conflict."
    },
    {
      id: 4,
      text: "I'd like to understand your perspective",
      type: "positive",
      explanation: "Positive: Shows curiosity and openness. Invites collaboration."
    },
    {
      id: 5,
      text: "You always do this",
      type: "negative",
      explanation: "Negative: Uses 'always' which is absolute and dismissive. Doesn't invite dialogue."
    },
    {
      id: 6,
      text: "I hear you",
      type: "positive",
      explanation: "Positive: Validates feelings and shows active listening. Creates connection."
    },
    {
      id: 7,
      text: "That's a stupid idea",
      type: "negative",
      explanation: "Negative: Dismissive and insulting. Shuts down communication."
    },
    {
      id: 8,
      text: "Help me understand why you think that",
      type: "positive",
      explanation: "Positive: Invites explanation with curiosity. Opens dialogue."
    },
    {
      id: 9,
      text: "Why can't you just...",
      type: "negative",
      explanation: "Negative: Frustrated tone suggests the other person should be different. Creates defensiveness."
    },
    {
      id: 10,
      text: "I see your point, and here's another way to look at it",
      type: "positive",
      explanation: "Positive: Acknowledges their perspective while offering alternative. Balances validation with direction."
    },
    {
      id: 11,
      text: "You're wrong",
      type: "negative",
      explanation: "Negative: Absolute statement without explanation. Shuts down conversation."
    },
    {
      id: 12,
      text: "I see it differently, and here's why",
      type: "positive",
      explanation: "Positive: Shares perspective without invalidating theirs. Opens dialogue."
    },
    {
      id: 13,
      text: "This is ridiculous",
      type: "negative",
      explanation: "Negative: Dismissive and judgmental. Doesn't invite understanding."
    },
    {
      id: 14,
      text: "I understand this is important to you",
      type: "positive",
      explanation: "Positive: Validates importance of the topic to them. Creates connection."
    },
    {
      id: 15,
      text: "Whatever",
      type: "negative",
      explanation: "Negative: Dismissive and uninterested. Shuts down communication."
    },
    {
      id: 16,
      text: "Let's work on this together",
      type: "positive",
      explanation: "Positive: Invites collaboration and partnership. Creates shared solution-finding."
    },
    {
      id: 17,
      text: "You don't get it",
      type: "negative",
      explanation: "Negative: Assumes lack of understanding. Creates defensiveness and shuts down dialogue."
    },
    {
      id: 18,
      text: "Can you help me understand what you mean?",
      type: "positive",
      explanation: "Positive: Asks for clarification with curiosity. Opens understanding."
    },
    {
      id: 19,
      text: "That makes no sense",
      type: "negative",
      explanation: "Negative: Dismissive without explanation. Doesn't invite understanding."
    },
    {
      id: 20,
      text: "I'm not sure I understand. Can you explain more?",
      type: "positive",
      explanation: "Positive: Acknowledges confusion and asks for clarification. Opens dialogue."
    },
    {
      id: 21,
      text: "You're overreacting",
      type: "negative",
      explanation: "Negative: Invalidates their emotional experience. Dismissive and creates defensiveness."
    },
    {
      id: 22,
      text: "I can see this is really affecting you",
      type: "positive",
      explanation: "Positive: Validates emotional experience without judgment. Creates connection."
    },
    {
      id: 23,
      text: "This is pointless",
      type: "negative",
      explanation: "Negative: Dismissive and hopeless. Shuts down communication and problem-solving."
    },
    {
      id: 24,
      text: "This is challenging, and let's find a way forward",
      type: "positive",
      explanation: "Positive: Acknowledges difficulty while maintaining hope. Invites solution-finding."
    },
    {
      id: 25,
      text: "You're being unreasonable",
      type: "negative",
      explanation: "Negative: Judgment about their behavior. Creates defensiveness and conflict."
    },
    {
      id: 26,
      text: "I understand you're frustrated, and let's find a solution",
      type: "positive",
      explanation: "Positive: Validates feeling while maintaining direction toward solutions. Balances empathy with firmness."
    },
    {
      id: 27,
      text: "Stop complaining",
      type: "negative",
      explanation: "Negative: Dismissive command. Shuts down expression and creates resentment."
    },
    {
      id: 28,
      text: "I hear your concerns, and what would help?",
      type: "positive",
      explanation: "Positive: Validates concerns and invites problem-solving. Creates collaboration."
    },
    {
      id: 29,
      text: "You're being difficult",
      type: "negative",
      explanation: "Negative: Labels the person negatively. Creates defensiveness and shuts down communication."
    },
    {
      id: 30,
      text: "This seems challenging. How can I support you?",
      type: "positive",
      explanation: "Positive: Acknowledges difficulty and offers support. Creates connection and collaboration."
    }
  ];

  // Shuffle cards for each game
  const [shuffledCards, setShuffledCards] = useState([]);
  const [currentShuffledIndex, setCurrentShuffledIndex] = useState(0);

  useEffect(() => {
    if (gameState === "playing") {
      // Shuffle and select subset
      const shuffled = [...communicationCues].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, totalLevels);
      setShuffledCards(selected);
      setCurrentShuffledIndex(0);
      setScore(0);
      setSelectedCards({});
      setTimeRemaining(30);
      setReactionTime([]);
      setStartTime(Date.now());
      setShowFeedback(false);
    }
  }, [gameState, totalLevels]);

  // Timer countdown
  useEffect(() => {
    if (gameState === "playing" && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState === "playing" && timeRemaining === 0) {
      // Time's up
      setShowGameOver(true);
      setGameState("gameOver");
    }
  }, [gameState, timeRemaining]);

  const handleCardTap = (isPositive) => {
    if (gameState !== "playing" || selectedCards[currentShuffledIndex]) return;
    
    const card = shuffledCards[currentShuffledIndex];
    const isCorrect = (isPositive && card.type === "positive") || (!isPositive && card.type === "negative");
    
    // Calculate reaction time
    const reaction = Date.now() - startTime;
    setReactionTime(prev => [...prev, reaction]);
    setStartTime(Date.now());

    setSelectedCards(prev => ({
      ...prev,
      [currentShuffledIndex]: {
        selected: isPositive,
        correct: isCorrect,
        card: card
      }
    }));

    if (isCorrect && card.type === "positive") {
      setScore(prev => prev + 1);
      setFeedbackMessage(`✓ Correct! Positive communication. ${card.explanation}`);
    } else if (!isCorrect && card.type === "positive") {
      setFeedbackMessage(`✗ Missed! This was positive: "${card.text}". ${card.explanation}`);
    } else if (!isCorrect && card.type === "negative") {
      setFeedbackMessage(`✗ Incorrect. This was negative: "${card.text}". ${card.explanation}`);
    }

    setShowFeedback(true);

    // Move to next card after brief feedback
    setTimeout(() => {
      setShowFeedback(false);
      if (currentShuffledIndex < shuffledCards.length - 1) {
        setCurrentShuffledIndex(prev => prev + 1);
        setStartTime(Date.now());
      } else {
        // All cards shown
        setShowGameOver(true);
        setGameState("gameOver");
      }
    }, 1500);
  };

  const startGame = () => {
    setGameState("playing");
  };

  const resetGame = () => {
    setGameState("instructions");
    setScore(0);
    setCurrentShuffledIndex(0);
    setSelectedCards({});
    setTimeRemaining(30);
    setShowGameOver(false);
    setShowFeedback(false);
    setReactionTime([]);
  };

  const currentCardData = shuffledCards[currentShuffledIndex];
  const progress = shuffledCards.length > 0 ? ((currentShuffledIndex + 1) / shuffledCards.length) * 100 : 0;
  const positiveCount = shuffledCards.filter(c => c && c.type === "positive").length;
  const averageReactionTime = reactionTime.length > 0
    ? Math.round(reactionTime.reduce((a, b) => a + b, 0) / reactionTime.length)
    : 0;
  const correctPositiveSelections = Object.values(selectedCards).filter(
    (sel, idx) => sel && shuffledCards[idx] && shuffledCards[idx].type === "positive" && sel.selected === true
  ).length;
  const awarenessScore = shuffledCards.length > 0
    ? Math.round((correctPositiveSelections / positiveCount) * 100)
    : 0;

  return (
    <TeacherGameShell
      title={gameData?.title || "Communication Reflex"}
      subtitle={gameData?.description || "Quickly identify positive vs negative communication cues"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentShuffledIndex + 1}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        {/* Instructions */}
        {gameState === "instructions" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">⚡</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Communication Reflex
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Quickly identify positive communication cues! Tap positive ones as fast as you can.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-blue-600" />
                How to Play:
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <span><strong>Tap positive communication cues</strong> quickly as they appear. Examples: "Can we talk?", "I hear you", "Let's work together"</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                  <span><strong>Don't tap negative cues</strong>. Examples: "You never listen", "That's stupid", "You're wrong"</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                  <span><strong>Speed matters!</strong> You have limited time. The faster you identify positive cues, the better your score.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
                  <span><strong>Build your awareness</strong> of positive vs negative communication patterns to improve your communication skills.</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200 mb-6">
              <h3 className="text-lg font-bold text-amber-900 mb-2">
                Quick Examples:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-green-700 mb-2">✓ Positive (Tap These):</p>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• "Can we talk?"</li>
                    <li>• "I hear you"</li>
                    <li>• "Let's work together"</li>
                    <li>• "I'd like to understand"</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-700 mb-2">✗ Negative (Don't Tap):</p>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• "You never listen"</li>
                    <li>• "That's stupid"</li>
                    <li>• "You're wrong"</li>
                    <li>• "You always do this"</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Start Game
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Game Play */}
        {gameState === "playing" && currentCardData && (
          <div className="w-full">
            {/* Timer and Score */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-lg font-bold text-gray-800">
                      {timeRemaining}s
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    <span className="text-lg font-bold text-gray-800">
                      Score: {score}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Card {currentShuffledIndex + 1} of {shuffledCards.length}
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                />
              </div>
            </div>

            {/* Flash Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentShuffledIndex}
                initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateX: 90 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                <div className={`bg-gradient-to-br rounded-2xl p-12 shadow-2xl border-4 min-h-[300px] flex items-center justify-center ${
                  currentCardData.type === "positive"
                    ? "from-green-100 via-emerald-100 to-teal-100 border-green-300"
                    : "from-red-100 via-rose-100 to-pink-100 border-red-300"
                }`}>
                  <p className="text-3xl font-bold text-center text-gray-800 leading-relaxed">
                    "{currentCardData.text}"
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Action Buttons */}
            {!showFeedback && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCardTap(true)}
                  className="p-8 rounded-xl border-4 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all shadow-lg"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-green-800">Positive</p>
                    <p className="text-sm text-green-600">Tap if positive!</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCardTap(false)}
                  className="p-8 rounded-xl border-4 border-gray-400 bg-gradient-to-br from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 transition-all shadow-lg"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-400 to-slate-500 flex items-center justify-center shadow-lg">
                      <XCircle className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">Negative</p>
                    <p className="text-sm text-gray-600">Tap if negative (or skip)</p>
                  </div>
                </motion.button>
              </div>
            )}

            {/* Feedback Message */}
            {showFeedback && feedbackMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6 mt-6 border-2 border-blue-200"
              >
                <p className="text-lg text-gray-800 leading-relaxed text-center">
                  {feedbackMessage}
                </p>
              </motion.div>
            )}
          </div>
        )}

        {/* Game Over */}
        {showGameOver && (
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
                ⚡✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Communication Reflex Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You identified {score} positive communication cues
              </p>
            </div>

            {/* Score Summary */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">{score}</div>
                  <p className="text-sm text-gray-700">Positive Cues Identified</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{awarenessScore}%</div>
                  <p className="text-sm text-gray-700">Awareness Score</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {averageReactionTime > 0 ? `${averageReactionTime}ms` : '—'}
                  </div>
                  <p className="text-sm text-gray-700">Avg Reaction Time</p>
                </div>
              </div>
            </div>

            {/* Awareness Feedback */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Communication Awareness
              </h3>
              {awarenessScore >= 90 ? (
                <p className="text-green-800 leading-relaxed">
                  <strong>Excellent!</strong> You have strong awareness of positive communication cues. You quickly identify phrases that invite dialogue, validate feelings, and create connection. Keep practicing to maintain this awareness in real conversations.
                </p>
              ) : awarenessScore >= 70 ? (
                <p className="text-green-800 leading-relaxed">
                  <strong>Good!</strong> You have solid awareness of positive communication cues. Continue practicing to improve your speed and recognition. Focus on identifying phrases that invite collaboration and validate feelings.
                </p>
              ) : awarenessScore >= 50 ? (
                <p className="text-green-800 leading-relaxed">
                  <strong>Developing.</strong> You're building awareness of positive communication cues. Practice identifying phrases that invite dialogue, show empathy, and create connection. The more you practice, the faster you'll recognize positive communication.
                </p>
              ) : (
                <p className="text-green-800 leading-relaxed">
                  <strong>Keep practicing!</strong> Building awareness of positive communication cues takes time. Focus on identifying phrases that invite dialogue, validate feelings, and create connection. Practice regularly to improve your recognition speed.
                </p>
              )}
            </div>

            {/* Key Patterns */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Positive Communication Patterns
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Inviting phrases:</strong> "Can we talk?", "Let's work together", "I'd like to understand"</li>
                <li>• <strong>Validating phrases:</strong> "I hear you", "I understand", "I see your point"</li>
                <li>• <strong>Collaborative phrases:</strong> "Let's find a solution", "How can I support you?", "What would help?"</li>
                <li>• <strong>Curious phrases:</strong> "Help me understand", "Can you explain more?", "I'm curious about..."</li>
                <li>• <strong>Balanced phrases:</strong> "I hear you, and here's what we can do" - blends empathy with direction</li>
              </ul>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200 mb-6">
              <div className="flex items-start gap-3">
                <BookOpen className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed mb-3">
                    <strong>Use this as a pre-meeting game to reset tone.</strong> Playing Communication Reflex before important meetings helps you recognize positive communication patterns and enter conversations with greater awareness:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Reset your communication mindset:</strong> Playing this game before meetings helps you shift into a positive communication mindset. You become more aware of how to invite dialogue and validate feelings.</li>
                    <li><strong>Recognize patterns quickly:</strong> The speed practice helps you quickly identify positive vs negative communication cues in real-time conversations. You'll catch yourself using negative patterns before they escalate.</li>
                    <li><strong>Enter with awareness:</strong> When you practice positive communication recognition, you enter meetings more aware of your communication style and more ready to use positive patterns.</li>
                    <li><strong>Build team culture:</strong> Use this game with your team before meetings to create shared awareness of positive communication. This builds a culture of respectful, collaborative dialogue.</li>
                    <li><strong>Reduce conflict:</strong> Greater awareness of positive communication patterns helps prevent conflicts and de-escalate tense situations. You'll naturally use more inviting, validating phrases.</li>
                    <li><strong>Improve outcomes:</strong> Meetings that start with positive communication awareness tend to be more productive, collaborative, and solution-focused.</li>
                    <li><strong>Make it a habit:</strong> Play this game regularly, especially before difficult conversations or important meetings. The more you practice, the more naturally positive communication comes to you.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you use this as a pre-meeting game to reset tone, you're actively preparing yourself for positive communication. This practice builds awareness, reduces conflict, and creates more productive, collaborative conversations. Regular practice makes positive communication a natural reflex.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Play Again
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default CommunicationReflex;

