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
  const totalLevels = gameData?.totalQuestions || 5;

  const [gameState, setGameState] = useState("instructions"); // instructions, playing, gameOver
  const [currentCard, setCurrentCard] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(45); // 45 seconds
  const [selectedCards, setSelectedCards] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showGameOver, setShowGameOver] = useState(false);
  const [reactionTime, setReactionTime] = useState([]);
  const [startTime, setStartTime] = useState(null);

  // Communication cue flash cards (positive vs negative) - Teacher focused scenarios
  const communicationCues = [
    {
      id: 1,
      text: "I understand you're concerned about your child's progress. Let's work together to find solutions.",
      type: "positive",
      explanation: "Positive: Validates concern and invites collaboration. Builds partnership with parents."
    },
    {
      id: 2,
      text: "Parents like you just don't care about their children's education.",
      type: "negative",
      explanation: "Negative: Makes sweeping generalizations about parents. Creates defensiveness and conflict."
    },
    {
      id: 3,
      text: "I noticed your student responded well to positive reinforcement today. Thanks for sharing that insight.",
      type: "positive",
      explanation: "Positive: Recognizes positive behavior and validates parent's contribution. Strengthens home-school connection."
    },
    {
      id: 4,
      text: "This is all because of your poor parenting.",
      type: "negative",
      explanation: "Negative: Places blame on parent. Creates hostility and shuts down productive communication."
    },
    {
      id: 5,
      text: "I'd love to hear your thoughts on how we can support your child's learning goals.",
      type: "positive",
      explanation: "Positive: Invites parental input and shows collaborative approach. Values parent perspective."
    }
  ];

  // Shuffle cards for each game
  const [shuffledCards, setShuffledCards] = useState([]);
  const [currentShuffledIndex, setCurrentShuffledIndex] = useState(0);

  useEffect(() => {
    if (gameState === "playing") {
      // Select subset without shuffling
      const selected = communicationCues.slice(0, totalLevels);
      setShuffledCards(selected);
      setCurrentShuffledIndex(0);
      setScore(0);
      setSelectedCards({});
      setTimeRemaining(45);
      setReactionTime([]);
      setStartTime(Date.now());
      setShowFeedback(false);
    }
  }, [gameState, totalLevels]);

  // Timer countdown
  useEffect(() => {
    if (gameState === "playing" && timeRemaining > 0 && currentShuffledIndex < shuffledCards.length) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState === "playing" && timeRemaining === 0) {
      // Time's up
      setShowGameOver(true);
      setGameState("gameOver");
    }
  }, [gameState, timeRemaining, currentShuffledIndex, shuffledCards.length]);

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

    if (isCorrect) {
      setScore(prev => prev + 1);
      if (card.type === "positive") {
        setFeedbackMessage(`✓ Correct! Positive communication. ${card.explanation}`);
      } else {
        setFeedbackMessage(`✓ Correct! Negative communication. ${card.explanation}`);
      }
    } else {
      if (card.type === "positive") {
        setFeedbackMessage(`✗ Missed! This was positive: "${card.text}". ${card.explanation}`);
      } else {
        setFeedbackMessage(`✗ Incorrect. This was negative: "${card.text}". ${card.explanation}`);
      }
    }

    setShowFeedback(true);

    // Move to next card after brief feedback
    setTimeout(() => {
      setShowFeedback(false);
      if (currentShuffledIndex < shuffledCards.length - 1) {
        setCurrentShuffledIndex(prev => prev + 1);
        setStartTime(Date.now());
        setTimeRemaining(45); // Reset timer for next card
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
    setTimeRemaining(45);
    setShowGameOver(false);
    setShowFeedback(false);
    setReactionTime([]);
  };

  const currentCardData = shuffledCards[currentShuffledIndex];
  const progress = shuffledCards.length > 0 ? ((currentShuffledIndex + 1) / shuffledCards.length) * 100 : 0;
  const totalPossible = shuffledCards.length;
  const averageReactionTime = reactionTime.length > 0
    ? Math.round(reactionTime.reduce((a, b) => a + b, 0) / reactionTime.length)
    : 0;
  const totalCorrect = Object.values(selectedCards).filter(
    (sel, idx) => sel && sel.correct
  ).length;
  const awarenessScore = totalPossible > 0
    ? Math.round((totalCorrect / totalPossible) * 100)
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
      currentQuestion={currentShuffledIndex}
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
                Identify positive vs negative communication in parent-teacher interactions! Tap positive or negative cues as they appear.
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
                  <span><strong>Identify positive communication cues</strong> in parent-teacher interactions. Tap the "Positive" button when you see supportive phrases.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                  <span><strong>Identify negative communication cues</strong> that create barriers. Tap the "Negative" button when you see problematic phrases.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                  <span><strong>Respond thoughtfully!</strong> You have 45 seconds per question to strengthen your communication awareness.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
                  <span><strong>Build your awareness</strong> of effective parent-teacher communication to improve your professional interactions.</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200 mb-6">
              <h3 className="text-lg font-bold text-amber-900 mb-2">
                Quick Examples:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-green-700 mb-2">✓ Positive Examples:</p>
                  <ul className="text-sm text-green-800 space-y-1">

                    <li>• "I appreciate your time"</li>
                    <li>• "I see your child's potential"</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-700 mb-2">✗ Negative Examples:</p>
                  <ul className="text-sm text-red-800 space-y-1">

                    <li>• "You don't care about education"</li>
                    <li>• "Some students aren't cut out for success"</li>
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
                    Question {currentShuffledIndex + 1} of {shuffledCards.length}
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
                <div className={`bg-gradient-to-br rounded-2xl p-12 shadow-2xl border-4 min-h-[300px] flex items-center justify-center ${currentCardData.type === "positive"
                    ? "from-green-100 via-emerald-100 to-teal-100 border-green-300"
                    : "from-green-100 via-emerald-100 to-teal-100 border-green-300"
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
                  className="p-8 rounded-xl border-4 border-gray-400 bg-gradient-to-br from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 transition-all shadow-lg"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">Positive</p>
                    <p className="text-sm text-gray-600">Tap if positive!</p>
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
                You completed {shuffledCards.length} communication scenarios
              </p>
            </div>

            {/* Score Summary */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">{score}</div>
                  <p className="text-sm text-gray-700">Correct Responses</p>
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
                  <strong>Excellent!</strong> You have strong awareness of effective parent-teacher communication. You quickly identify phrases that build partnerships, validate concerns, and create positive dialogue. This awareness will enhance your professional interactions with families.
                </p>
              ) : awarenessScore >= 70 ? (
                <p className="text-green-800 leading-relaxed">
                  <strong>Good!</strong> You have solid awareness of effective parent-teacher communication. Continue practicing to improve your recognition of phrases that invite collaboration and validate parental concerns. This strengthens home-school connections.
                </p>
              ) : awarenessScore >= 50 ? (
                <p className="text-green-800 leading-relaxed">
                  <strong>Developing.</strong> You're building awareness of effective parent-teacher communication. Practice identifying phrases that invite dialogue, acknowledge parental perspectives, and create positive partnerships. This will improve your home-school relationships.
                </p>
              ) : (
                <p className="text-green-800 leading-relaxed">
                  <strong>Keep practicing!</strong> Building awareness of effective parent-teacher communication takes time. Focus on recognizing phrases that build trust, validate concerns, and create collaborative partnerships. Regular practice enhances your professional communication skills.
                </p>
              )}
            </div>

            {/* Key Patterns */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Effective Parent-Teacher Communication
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Partnership phrases:</strong> "Let's work together", "I appreciate your time", "How can we support your child"</li>
                <li>• <strong>Validation phrases:</strong> "I understand your concerns", "I see your child's potential", "Thank you for sharing"</li>
                <li>• <strong>Collaborative phrases:</strong> "What are your thoughts?", "How can I help?", "Let's find solutions together"</li>
                <li>• <strong>Growth-focused phrases:</strong> "I see progress", "With support they can grow", "Building on strengths"</li>
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
                    <strong>Practice this awareness before parent conferences.</strong> Playing Communication Reflex regularly helps you recognize positive and negative communication patterns that arise in parent-teacher interactions. This awareness enables you to respond thoughtfully rather than reactively:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Prepare your mindset:</strong> Before parent conferences, spend a few minutes reviewing positive communication patterns. This primes you to focus on collaborative, solution-oriented language.</li>
                    <li><strong>Recognize triggers:</strong> Awareness of negative communication patterns helps you identify when conversations may be becoming unproductive. You can then pivot to more positive approaches.</li>
                    <li><strong>Build rapport:</strong> When you consistently use positive communication, parents feel heard and respected. This creates a foundation for productive discussions about their child's needs.</li>
                    <li><strong>Model for students:</strong> Your positive communication with parents demonstrates the respectful dialogue you want to see in your classroom. Students benefit when they see respectful adult communication modeled.</li>
                    <li><strong>De-escalate tensions:</strong> When conversations become tense, your awareness of positive communication patterns helps you redirect toward solutions and mutual understanding.</li>
                    <li><strong>Strengthen partnerships:</strong> Parents who feel heard and respected are more likely to support your classroom initiatives and collaborate on their child's education.</li>
                    <li><strong>Self-reflection:</strong> Regular practice with identifying communication patterns helps you reflect on your own communication style and continuously improve your professional interactions.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you practice this awareness before parent conferences, you're actively preparing yourself for positive, productive interactions. This practice builds stronger home-school partnerships, reduces misunderstandings, and creates more collaborative relationships with families. Regular awareness exercises make thoughtful communication a natural reflex.</p>
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