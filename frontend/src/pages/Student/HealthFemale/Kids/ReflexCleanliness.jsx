import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10; // 10 seconds per round

const ReflexCleanliness = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-49";

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);
  const currentRoundRef = useRef(1);

  const questions = [
    {
      id: 1,
      question: "Which one is clean?",
      correctAnswer: "Washed Hands",
      options: [
        { text: "Muddy Shoes", isCorrect: false, emoji: "👞" },
        { text: "Washed Hands", isCorrect: true, emoji: "👐" },
        { text: "Sticky Table", isCorrect: false, emoji: "🍽️" },
        { text: "Trash Can", isCorrect: false, emoji: "🗑️" }
      ]
    },
    {
      id: 2,
      question: "Which one smells good?",
      correctAnswer: "Flowers",
      options: [
        { text: "Garbage", isCorrect: false, emoji: "🥡" },
        { text: "Old Socks", isCorrect: false, emoji: "🧦" },
        { text: "Flowers", isCorrect: true, emoji: "🌺" },
        { text: "Rotten Egg", isCorrect: false, emoji: "🥚" }
      ]
    },
    {
      id: 3,
      question: "What cleans teeth?",
      correctAnswer: "Brush",
      options: [
        { text: "Brush", isCorrect: true, emoji: "🪥" },
        { text: "Comb", isCorrect: false, emoji: "💇‍♀️" },
        { text: "Spoon", isCorrect: false, emoji: "🥄" },
        { text: "Pencil", isCorrect: false, emoji: "✏️" }
      ]
    },
    {
      id: 4,
      question: "When to wash?",
      correctAnswer: "After Play",
      options: [
        { text: "Never", isCorrect: false, emoji: "❌" },
        { text: "Before Sleep Only", isCorrect: false, emoji: "🛌" },
        { text: "Once a year", isCorrect: false, emoji: "📅" },
        { text: "After Play", isCorrect: true, emoji: "⚽" }
      ]
    },
    {
      id: 5,
      question: "What keeps hair neat?",
      correctAnswer: "Comb",
      options: [
        { text: "Glue", isCorrect: false, emoji: "🧴" },
        { text: "Fork", isCorrect: false, emoji: "🍴" },
        { text: "Towel", isCorrect: false, emoji: "🧖‍♀️" },
        { text: "Comb", isCorrect: true, emoji: "🪮" }
      ]
    }
  ];

  // Update ref when currentRound changes
  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  // Reset timer configuration when round changes
  useEffect(() => {
    if (gameState === "playing" && currentRound <= TOTAL_ROUNDS) {
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
    }
  }, [currentRound, gameState]);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    setAnswered(true);
    resetFeedback();

    setTimeout(() => {
      if (currentRoundRef.current >= TOTAL_ROUNDS) {
        setGameState("finished");
      } else {
        setCurrentRound((prev) => prev + 1);
      }
    }, 1000);
  }, []);

  // Timer logic - Restart on new round or playing state
  useEffect(() => {
    if (gameState !== "playing") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (timerRef.current) clearInterval(timerRef.current);

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
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState, currentRound, handleTimeUp]);

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

    setTimeout(() => {
      if (currentRound >= TOTAL_ROUNDS) {
        setGameState("finished");
      } else {
        setCurrentRound((prev) => prev + 1);
      }
    }, 1000);
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  const currentQ = questions[currentRound - 1];

  return (
    <GameShell
      title="Reflex: Cleanliness Quest"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}` : "Cleanliness Blitz!"}
      coins={score}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      score={score}
      gameId={gameId}
      gameType="health-female"
      maxScore={maxScore}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      showConfetti={gameState === "finished" && score === maxScore}
      backPath="/games/health-female/kids"
    
      nextGamePathProp="/student/health-female/kids/fresh-girl-badge"
      nextGameIdProp="health-female-kids-50">
      <div className="space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-6xl mb-6">🧼</div>
            <h3 className="text-2xl font-bold text-white mb-4">Cleanliness Blitz!</h3>
            <p className="text-white/90 text-lg mb-6">
              You have {ROUND_TIME} seconds to find the clean item!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-8 rounded-full text-xl font-bold shadow-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && currentQ && (
          <div className="space-y-8">
            {/* HUD */}
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg">
              <div className="text-white font-bold text-lg">
                Round: {currentRound}/{TOTAL_ROUNDS}
              </div>
              <div className={`font-mono text-2xl font-bold ${timeLeft <= 2 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>
                {timeLeft}s
              </div>
              <div className="text-white font-bold text-lg">
                Score: {score}
              </div>
            </div>

            {/* Question Area */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
              <h2 className="text-2xl font-bold text-white mb-8">{currentQ.question}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-[1.02] shadow-xl flex items-center justify-start gap-4 ${answered
                      ? option.isCorrect
                        ? 'bg-green-500 ring-4 ring-green-300'
                        : 'bg-white/10 opacity-50'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                      }`}
                  >
                    <span className="text-4xl">{option.emoji}</span>
                    <span className="text-white text-left">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {gameState === "finished" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-6xl mb-6">🏆</div>
            <h2 className="text-3xl font-bold text-white mb-4">Blitz Complete!</h2>
            <p className="text-xl text-white/90 mb-6">You scored {score} out of {TOTAL_ROUNDS}!</p>

            <div className="flex justify-center gap-4">
              <button
                onClick={startGame}
                className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-full transition-all"
              >
                Play Again
              </button>
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-full transition-all shadow-lg"
              >
                Next Game
              </button>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexCleanliness;