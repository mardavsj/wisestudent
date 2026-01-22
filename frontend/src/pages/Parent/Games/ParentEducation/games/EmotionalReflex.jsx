import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const EmotionalReflex = () => {
  const location = useLocation();

  // Get game data
  const gameId = "parent-education-9";
  const gameData = getParentEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentRound, setCurrentRound] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(5); // 5 seconds per round
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isRoundActive, setIsRoundActive] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [roundResults, setRoundResults] = useState([]);

  const timerRef = useRef(null);
  const roundStartTimeRef = useRef(null);

  // Emotion faces with emojis representing different emotions
  const emotionFaces = [
    { emoji: '😊', label: 'Happy', description: 'Joyful and content' },
    { emoji: '😢', label: 'Sad', description: 'Feeling down or disappointed' },
    { emoji: '😡', label: 'Angry', description: 'Frustrated or upset' },
    { emoji: '😨', label: 'Fearful', description: 'Scared or anxious' },
    { emoji: '😲', label: 'Surprised', description: 'Shocked or astonished' },
    { emoji: '😌', label: 'Calm', description: 'Peaceful and relaxed' },
    { emoji: '😟', label: 'Worried', description: 'Anxious or concerned' },
    { emoji: '🤗', label: 'Grateful', description: 'Thankful and appreciative' },
    { emoji: '😴', label: 'Tired', description: 'Exhausted or sleepy' },
    { emoji: '😤', label: 'Irritated', description: 'Annoyed or frustrated' },
    { emoji: '😔', label: 'Disappointed', description: 'Let down or discouraged' },
    { emoji: '😎', label: 'Confident', description: 'Self-assured and bold' },
    { emoji: '😰', label: 'Anxious', description: 'Nervous or worried' },
    { emoji: '🤔', label: 'Confused', description: 'Uncertain or puzzled' },
    { emoji: '😍', label: 'Loving', description: 'Affectionate and warm' }
  ];

  // Game rounds with emotion faces and distractors
  const gameRounds = [
    {
      id: 1,
      correctEmotion: { emoji: '😢', label: 'Sad' },
      options: ['Sad', 'Tired', 'Calm', 'Confused'],
      context: "A child after losing their favorite toy"
    },
    {
      id: 2,
      correctEmotion: { emoji: '😡', label: 'Angry' },
      options: ['Happy', 'Angry', 'Surprised', 'Calm'],
      context: "A teenager whose plans got cancelled"
    },
    {
      id: 3,
      correctEmotion: { emoji: '😨', label: 'Fearful' },
      options: ['Confused', 'Tired', 'Fearful', 'Irritated'],
      context: "A child seeing a big dog for the first time"
    },
    {
      id: 4,
      correctEmotion: { emoji: '😊', label: 'Happy' },
      options: ['Worried', 'Happy', 'Disappointed', 'Anxious'],
      context: "A parent receiving good news about their child"
    },
    {
      id: 5,
      correctEmotion: { emoji: '😟', label: 'Worried' },
      options: ['Confident', 'Grateful', 'Calm', 'Worried'],
      context: "A parent waiting for important test results"
    }
  ];

  // Start a new round
  const startRound = () => {
    setIsRoundActive(true);
    setTimeRemaining(5);
    setSelectedAnswer(null);
    setShowFeedback(false);
    roundStartTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0.1) {
          handleTimeUp();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
  };

  // Handle time running out
  const handleTimeUp = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRoundActive(false);
    setShowFeedback(true);

    const result = {
      round: currentRound + 1,
      correct: false,
      answerTime: 5,
      wasTimeout: true
    };
    setRoundResults([...roundResults, result]);

    setTimeout(() => {
      moveToNextRound();
    }, 2000);
  };

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    if (!isRoundActive || selectedAnswer !== null) return;

    const answerTime = ((Date.now() - roundStartTimeRef.current) / 1000).toFixed(2);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setIsRoundActive(false);
    setSelectedAnswer(answer);
    setShowFeedback(true);

    const currentRoundData = gameRounds[currentRound];
    const isCorrect = answer === currentRoundData.correctEmotion.label;

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    const result = {
      round: currentRound + 1,
      correct: isCorrect,
      answerTime: parseFloat(answerTime),
      wasTimeout: false
    };
    setRoundResults([...roundResults, result]);

    setTimeout(() => {
      moveToNextRound();
    }, 2000);
  };

  // Move to next round
  const moveToNextRound = () => {
    if (currentRound < gameRounds.length - 1) {
      setCurrentRound(currentRound + 1);
    } else {
      // All rounds completed
      setShowGameOver(true);
    }
  };

  // Initialize first round
  useEffect(() => {
    if (currentRound < gameRounds.length && !showGameOver) {
      startRound();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentRound]);

  const currentRoundData = gameRounds[currentRound];
  const isCorrect = selectedAnswer === currentRoundData?.correctEmotion.label;
  const hasAnswered = selectedAnswer !== null || timeRemaining <= 0;

  // Get parent tip based on round
  const getParentTip = () => {
    if (roundResults.length === 0) {
      return "Quick emotion recognition helps you respond to your child's needs faster. Practice noticing facial expressions in real life too.";
    }
    const correctRate = roundResults.filter(r => r.correct).length / roundResults.length;
    if (correctRate >= 0.8) {
      return "Excellent! You're building strong empathy skills. Apply this quick recognition in daily interactions with your children.";
    } else if (correctRate >= 0.6) {
      return "Good progress! Keep practicing—the more you notice emotions, the faster you'll become at reading them.";
    } else {
      return "Reading emotions quickly takes practice. Start by noticing one emotion per day in your child's face—you'll improve with time.";
    }
  };

  return (
    <ParentGameShell
      title={gameData?.title || "Emotional Reflex"}
      subtitle={gameData?.description || "React quickly to name visible emotions in others"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentRound}
    >
      {currentRound < gameRounds.length && !showGameOver ? (
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">
                  Round {currentRound + 1} of {gameRounds.length}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  Score: {score}/{gameRounds.length}
                </span>
              </div>
            </div>

            {/* Timer Display */}
            <div className="mb-6">
              <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full h-4 mb-2 relative overflow-hidden">
                <div
                  className={`h-full transition-all duration-100 ${timeRemaining > 2.5 ? 'bg-green-500' : timeRemaining > 1.25 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  style={{ width: `${(timeRemaining / 5) * 100}%` }}
                ></div>
              </div>
              <div className="text-center">
                <span className={`text-2xl font-bold ${timeRemaining > 2.5 ? 'text-green-600' : timeRemaining > 1.25 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                  {timeRemaining.toFixed(1)}s
                </span>
              </div>
            </div>

            {/* Context Description */}
            <div className="mb-8 text-center">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-200 mb-4">
                <p className="text-base text-gray-700 italic">
                  "{currentRoundData.context}"
                </p>
              </div>
            </div>

            {/* Emotion Face Display */}
            <div className="mb-8">
              <div className="bg-white rounded-2xl p-12 border-4 border-gray-300 shadow-2xl text-center transform transition-all hover:scale-105">
                <div className="text-9xl mb-4 animate-pulse-slow">
                  {currentRoundData.correctEmotion.emoji}
                </div>
                <p className="text-xl font-bold text-gray-800">
                  What emotion is this?
                </p>
              </div>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {currentRoundData.options.map((option, index) => {
                let buttonStyle = "bg-white border-gray-300 hover:border-blue-500 hover:bg-blue-50";
                let textStyle = "text-gray-700";

                if (hasAnswered) {
                  if (option === currentRoundData.correctEmotion.label) {
                    buttonStyle = "bg-green-100 border-green-500";
                    textStyle = "text-green-700 font-bold";
                  } else if (option === selectedAnswer && !isCorrect) {
                    buttonStyle = "bg-red-100 border-red-500";
                    textStyle = "text-red-700";
                  } else {
                    buttonStyle = "bg-gray-100 border-gray-300 opacity-50";
                    textStyle = "text-gray-500";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={hasAnswered}
                    className={`p-6 rounded-xl border-2 text-lg font-semibold transition-all ${!hasAnswered ? 'cursor-pointer hover:scale-105 hover:shadow-lg' : 'cursor-not-allowed'
                      } ${buttonStyle} ${textStyle}`}
                  >
                    {option}
                    {hasAnswered && option === currentRoundData.correctEmotion.label && (
                      <span className="ml-2 text-2xl">✓</span>
                    )}
                    {hasAnswered && option === selectedAnswer && !isCorrect && (
                      <span className="ml-2 text-2xl">✗</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback Message */}
            {showFeedback && (
              <div className={`mb-6 p-6 rounded-xl border-2 animate-fade-in ${isCorrect
                  ? 'bg-green-50 border-green-200'
                  : timeRemaining <= 0
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">
                    {isCorrect ? '🎯' : timeRemaining <= 0 ? '⏱️' : '❌'}
                  </span>
                  <div>
                    <h4 className={`font-bold text-lg mb-1 ${isCorrect ? 'text-green-800' : 'text-orange-800'
                      }`}>
                      {isCorrect
                        ? 'Correct! Great reaction time!'
                        : timeRemaining <= 0
                          ? 'Time\'s up!'
                          : 'Not quite right'}
                    </h4>
                    <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-orange-700'
                      }`}>
                      {isCorrect
                        ? `You identified ${currentRoundData.correctEmotion.label} in ${selectedAnswer !== null ? roundResults[roundResults.length - 1]?.answerTime.toFixed(2) : '5.00'}s!`
                        : timeRemaining <= 0
                          ? `The correct emotion was ${currentRoundData.correctEmotion.label}. Quick recognition takes practice!`
                          : `The correct emotion was ${currentRoundData.correctEmotion.label}. Keep practicing!`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="text-xs font-semibold text-blue-800 mb-1">Parent Tip:</p>
                  <p className="text-sm text-blue-700">
                    {getParentTip()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </ParentGameShell>
  );
};

export default EmotionalReflex;