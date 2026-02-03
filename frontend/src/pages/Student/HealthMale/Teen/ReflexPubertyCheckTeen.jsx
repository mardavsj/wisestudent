import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexPubertyCheckTeen = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-23";

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);
  const currentRoundRef = useRef(0);

  const questions = [
  {
    id: 1,
    question: "You suddenly feel extremely hungry late at night. What’s the smart reflex?",
    correctAnswer: "Healthy snack",
    options: [
      { text: "Ignore it completely", isCorrect: false, emoji: "🚫" },
      { text: "Eat junk nonstop", isCorrect: false, emoji: "🍔" },
      { text: "Drink soda", isCorrect: false, emoji: "🥤" },
      { text: "Healthy snack", isCorrect: true, emoji: "🥬" },
    ]
  },
  {
    id: 2,
    question: "Your sleep schedule is messed up during puberty. Best quick fix?",
    correctAnswer: "Set sleep routine",
    options: [
      { text: "Scroll phone all night", isCorrect: false, emoji: "📱" },
      { text: "Set sleep routine", isCorrect: true, emoji: "⏰" },
      { text: "Skip sleep", isCorrect: false, emoji: "😵" },
      { text: "Drink coffee", isCorrect: false, emoji: "☕" }
    ]
  },
  {
    id: 3,
    question: "You feel suddenly self-conscious about your body in public. Reflex response?",
    correctAnswer: "Stay confident",
    options: [
      { text: "Hide at home", isCorrect: false, emoji: "🏠" },
      { text: "Compare with others", isCorrect: false, emoji: "📊" },
      { text: "Stay confident", isCorrect: true, emoji: "💪" },
      { text: "Blame yourself", isCorrect: false, emoji: "❌" }
    ]
  },
  {
    id: 4,
    question: "You feel tired more often than before. What should you react with?",
    correctAnswer: "Rest and fuel body",
    options: [
      { text: "Rest and fuel body", isCorrect: true, emoji: "🛌" },
      { text: "Push harder always", isCorrect: false, emoji: "🔥" },
      { text: "Skip meals", isCorrect: false, emoji: "🍽️" },
      { text: "Energy drinks", isCorrect: false, emoji: "⚡" }
    ]
  },
  {
    id: 5,
    question: "Your interests suddenly change during puberty. Best reflex mindset?",
    correctAnswer: "Explore safely",
    options: [
      { text: "Explore safely", isCorrect: true, emoji: "🧭" },
      { text: "Force old habits", isCorrect: false, emoji: "🔒" },
      { text: "Follow peers blindly", isCorrect: false, emoji: "👥" },
      { text: "Quit everything", isCorrect: false, emoji: "🏳️" }
    ]
  }
];

  // Set global window variables for useGameFeedback to ensure correct +1 popup
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Force cleanup first to prevent interference from other games
      window.__flashTotalCoins = null;
      window.__flashQuestionCount = null;
      window.__flashPointsMultiplier = 1;
      
      // Small delay to ensure cleanup
      setTimeout(() => {
        // Then set the correct values for this game
        window.__flashTotalCoins = totalCoins;        // 5
        window.__flashQuestionCount = TOTAL_ROUNDS;   // 5
        window.__flashPointsMultiplier = coinsPerLevel; // 1
      }, 50);
      
      return () => {
        // Clean up on unmount
        window.__flashTotalCoins = null;
        window.__flashQuestionCount = null;
        window.__flashPointsMultiplier = 1;
      };
    }
  }, [totalCoins, coinsPerLevel]);

  // Update ref when currentRound changes
  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  // Reset timer when round changes
  useEffect(() => {
    if (gameState === "playing" && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
    }
  }, [currentRound, gameState]);

  // Handle time up - move to next question or show results
  const handleTimeUp = useCallback(() => {
    setAnswered(true);
    resetFeedback();

    const isLastQuestion = currentRoundRef.current >= TOTAL_ROUNDS;

    setTimeout(() => {
      if (isLastQuestion) {
        setFinalScore(score);
        setShowResult(true);
      } else {
        setCurrentRound((prev) => prev + 1);
      }
    }, 1000);
  }, [score]);

  // Timer effect - countdown from 10 seconds for each question
  useEffect(() => {
    if (gameState !== "playing" || currentRound === 0 || currentRound > TOTAL_ROUNDS) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Start countdown timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          // Time's up for this round
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          handleTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState, currentRound, handleTimeUp]);

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(ROUND_TIME);
    setScore(0);
    setCurrentRound(1);
    resetFeedback();
  };

  const handleAnswer = (option) => {
    if (gameState !== "playing" || answered || currentRound > TOTAL_ROUNDS) return;

    // Clear the timer immediately when user answers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setAnswered(true);
    resetFeedback();

    if (option.isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    // Move to next round or show results after a short delay
    setTimeout(() => {
      if (currentRound >= TOTAL_ROUNDS) {
        setFinalScore(score + (option.isCorrect ? 1 : 0));
        setShowResult(true);
      } else {
        setCurrentRound((prev) => prev + 1);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setGameState("ready");
    setScore(0);
    setCurrentRound(0);
    setFinalScore(0);
    setTimeLeft(ROUND_TIME);
    setAnswered(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/puberty-signs-puzzle-teen");
  };

  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title="Reflex Puberty Check"
      score={score}
      subtitle={showResult ? "Game Complete!" : gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: React to changes!` : "React to changes!"}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/health-male/teens/puberty-signs-puzzle-teen"
      nextGameIdProp="health-male-teen-24"
      gameType="health-male"
      totalLevels={TOTAL_ROUNDS}
      currentLevel={currentRound}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/health-male/teens"
      maxScore={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">⚡</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              React to puberty challenges quickly!<br />
              You have {ROUND_TIME} seconds for each question.
            </p>
            <p className="text-white/80 mb-6">
              You have {TOTAL_ROUNDS} questions with {ROUND_TIME} seconds each!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-8 rounded-full text-xl font-bold shadow-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && currentQuestion && (
          <div className="space-y-8">
            {/* Status Bar with Timer */}
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-white">
                <span className="font-bold">Round:</span> {currentRound}/{TOTAL_ROUNDS}
              </div>
              <div className={`font-bold ${timeLeft <= 2 ? 'text-red-500' : timeLeft <= 3 ? 'text-yellow-500' : 'text-green-400'}`}>
                <span className="text-white">Time:</span> {timeLeft}s
              </div>
              <div className="text-white">
                <span className="font-bold">Score:</span> {score}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                {currentQuestion.question}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className="text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                  >
                    <div className="text-4xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-xl">{option.text}</h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {showResult && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20 text-center flex-1 flex flex-col justify-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-4xl md:text-5xl mb-4">⚡</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Puberty Pro!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {TOTAL_ROUNDS} challenges correct!
                  You understand how to handle puberty changes smartly!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  Great job! You know how to respond to puberty changes in healthy ways!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {TOTAL_ROUNDS} challenges correct.
                  Remember, understanding puberty changes helps you navigate them better!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to choose responses that show healthy ways to handle puberty changes.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexPubertyCheckTeen;

