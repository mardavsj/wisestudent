import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexTeenRoutine = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameState, setGameState] = useState('waiting');
  const [gameFinished, setGameFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [answered, setAnswered] = useState(false);

  const startTimeRef = useRef(0);
  const timerRef = useRef(null);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const TOTAL_ROUNDS = 5;
  const ROUND_TIME = 10;

  const scenarios = [
  {
    id: 1,
    question: "It's past 10 PM and your phone buzzes with notifications. What keeps your routine healthy?",
    options: [
      { text: "Scroll social media endlessly", isCorrect: false, emoji: "📱" },
      { text: "Stick to sleep schedule", isCorrect: true, emoji: "😴" },
      { text: "Reply to every message", isCorrect: false, emoji: "💬" },
      { text: "Watch late-night videos", isCorrect: false, emoji: "📹" }
    ]
  },
  {
    id: 2,
    question: "You have multiple homework assignments due tomorrow. What choice supports success?",
    options: [
      { text: "Play video games to relax", isCorrect: false, emoji: "🎮" },
      { text: "Procrastinate and rush later", isCorrect: false, emoji: "⏳" },
      { text: "Prioritize and do homework first", isCorrect: true, emoji: "📝" },
      { text: "Binge-watch TV", isCorrect: false, emoji: "📺" }
    ]
  },
  {
    id: 3,
    question: "You are tempted to skip your daily exercise. Best reflex choice?",
    options: [
      { text: "Sit on the couch", isCorrect: false, emoji: "🛋️" },
      { text: "Eat snacks instead", isCorrect: false, emoji: "🍔" },
      { text: "Skip and plan tomorrow", isCorrect: false, emoji: "🚫" },
      { text: "Complete the workout", isCorrect: true, emoji: "💪" },
    ]
  },
  {
    id: 4,
    question: "Feeling overwhelmed by an upcoming test, what’s a productive response?",
    options: [
      { text: "Panic and stress out", isCorrect: false, emoji: "😱" },
      { text: "Follow a structured study plan", isCorrect: true, emoji: "📅" },
      { text: "Ignore preparation", isCorrect: false, emoji: "🙈" },
      { text: "Cheat during the test", isCorrect: false, emoji: "👀" }
    ]
  },
  {
    id: 5,
    question: "Your room is extremely messy. How do you respond to maintain a good habit?",
    options: [
      { text: "Clean and organize immediately", isCorrect: true, emoji: "🧹" },
      { text: "Leave it for later", isCorrect: false, emoji: "🗑️" },
      { text: "Wait for someone else to do it", isCorrect: false, emoji: "👩" },
      { text: "Hide the mess temporarily", isCorrect: false, emoji: "📦" }
    ]
  }
];


  const handleNext = () => {
    navigate("/student/health-male/teens/habit-builder-puzzle");
  };

  // Handle time up
  const handleTimeUp = useCallback(() => {
    setAnswered(true);
    resetFeedback();

    setTimeout(() => {
      if (currentRound >= TOTAL_ROUNDS) {
        setGameState("finished");
      } else {
        setCurrentRound((prev) => prev + 1);
        setTimeLeft(ROUND_TIME);
        setAnswered(false);
      }
    }, 1000);
  }, [currentRound, TOTAL_ROUNDS, resetFeedback]);

  // Timer effect
  useEffect(() => {
    if (gameState !== "playing" || answered) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, answered, handleTimeUp]);

  useEffect(() => {
    if (gameState === "playing") {
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
      resetFeedback();
    }
  }, [currentRound, gameState]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setCurrentRound(1);
    setTimeLeft(ROUND_TIME);
    setAnswered(false);
    resetFeedback();
  };

  const handleAnswer = (option) => {
    if (gameState !== "playing" || answered) return;

    setAnswered(true);
    resetFeedback();

    if (option.isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (currentRound >= TOTAL_ROUNDS) {
        setGameState("finished");
      } else {
        setCurrentRound((prev) => prev + 1);
      }
    }, 1000);
  };

  const currentQuestion = scenarios[currentRound - 1];

  return (
    <GameShell
      title="Reflex Teen Routine"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}` : "Test your Routine Instincts!"}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={score}
      gameId="health-male-teen-93"
      gameType="health-male"
      totalLevels={TOTAL_ROUNDS}
      maxScore={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={gameState === "finished" && score > 3}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {gameState === "waiting" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">⏰</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready for Routine Check!</h3>
            <p className="text-white/90 text-lg mb-6">
              You have {ROUND_TIME} seconds to choose the HEALTHY ROUTINE for each situation.<br />
              Be quick and disciplined!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-10 rounded-full text-xl font-bold shadow-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && currentQuestion && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-white">
                <span className="font-bold">Round:</span> {currentRound}/{TOTAL_ROUNDS}
              </div>
              <div className={`font-bold text-xl ${timeLeft <= 2 ? 'text-red-500 animate-pulse' : timeLeft <= 3 ? 'text-yellow-500' : 'text-green-400'}`}>
                ⏱️ {timeLeft}s
              </div>
              <div className="text-white">
                <span className="font-bold text-yellow-400">Score:</span> {score}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 text-center">
              <h3 className="text-xl md:text-2xl font-bold mb-8 text-white min-h-[60px] flex items-center justify-center">
                {currentQuestion.question}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className={`p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed ${answered && option.isCorrect
                        ? 'bg-green-500/80 border-2 border-green-400 text-white'
                        : answered && !option.isCorrect
                          ? 'bg-gray-500/50 border-2 border-transparent text-white/50'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg'
                      }`}
                  >
                    <div className="text-4xl mb-2">{option.emoji}</div>
                    <div>{option.text}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexTeenRoutine;
