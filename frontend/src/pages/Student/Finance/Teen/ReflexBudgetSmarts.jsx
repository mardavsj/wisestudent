import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexBudgetSmarts = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-29");
  const gameId = gameData?.id || "finance-teens-29";
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);

  const questions = [
    {
      id: 1,
      question: "What should you do before making a purchase?",
      correctAnswer: "Plan ahead and check your budget",
      options: [
        { text: "Plan ahead and check your budget", isCorrect: true, emoji: "📋" },
        { text: "Spend all your money immediately", isCorrect: false, emoji: "💸" },
        { text: "Ignore your budget completely", isCorrect: false, emoji: "🚫" },
        { text: "Buy without thinking", isCorrect: false, emoji: "⚡" }
      ]
    },
    {
      id: 2,
      question: "What's the smartest approach to managing money?",
      correctAnswer: "Save first, then spend",
      options: [
        { text: "Waste money on unnecessary items", isCorrect: false, emoji: "🗑️" },
        { text: "Save first, then spend", isCorrect: true, emoji: "💰" },
        { text: "Spend everything you have", isCorrect: false, emoji: "💳" },
        { text: "Never save anything", isCorrect: false, emoji: "❌" }
      ]
    },
    {
      id: 3,
      question: "How should you track your expenses?",
      correctAnswer: "Track costs regularly",
      options: [
        { text: "Ignore costs completely", isCorrect: false, emoji: "🙈" },
        { text: "Track costs only sometimes", isCorrect: false, emoji: "📝" },
        { text: "Track costs regularly", isCorrect: true, emoji: "✅" },
        { text: "Never track anything", isCorrect: false, emoji: "🚫" }
      ]
    },
    {
      id: 4,
      question: "What should you prioritize in your budget?",
      correctAnswer: "Prioritize needs over wants",
      options: [
        { text: "Buy wants before needs", isCorrect: false, emoji: "🛍️" },
        { text: "Prioritize needs over wants", isCorrect: true, emoji: "🎯" },
        { text: "Only buy wants", isCorrect: false, emoji: "💸" },
        { text: "Ignore priorities", isCorrect: false, emoji: "❌" }
      ]
    },
    {
      id: 5,
      question: "What should you do to stay on budget?",
      correctAnswer: "Check balance regularly",
      options: [
        { text: "Forget balance completely", isCorrect: false, emoji: "🙈" },
        { text: "Check balance rarely", isCorrect: false, emoji: "👀" },
        { text: "Check balance regularly", isCorrect: true, emoji: "✅" },
        { text: "Never check balance", isCorrect: false, emoji: "🚫" }
      ]
    }
  ];

  useEffect(() => {
    if (gameState === "playing" && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
    }
  }, [currentRound, gameState]);

  const handleTimeUp = useCallback(() => {
    if (currentRound < TOTAL_ROUNDS) {
      setCurrentRound(prev => prev + 1);
    } else {
      setGameState("finished");
    }
  }, [currentRound]);

  // Timer effect
  useEffect(() => {
    if (gameState === "playing" && !answered && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState, answered, timeLeft, handleTimeUp]);

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(ROUND_TIME);
    setScore(0);
    setCurrentRound(1);
    setAnswered(false);
    resetFeedback();
  };

  const handleAnswer = (option) => {
    if (answered || gameState !== "playing") return;
    
    setAnswered(true);
    resetFeedback();
    
    const isCorrect = option.isCorrect;
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    setTimeout(() => {
      if (currentRound < TOTAL_ROUNDS) {
        setCurrentRound(prev => prev + 1);
      } else {
        setGameState("finished");
      }
    }, 500);
  };



  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title="Reflex Budget Smarts"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Test your budget reflexes!` : "Test your budget reflexes!"}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      showConfetti={gameState === "finished" && score === TOTAL_ROUNDS}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/finance/teen/badge-budget-hero"
      nextGameIdProp="finance-teens-30"
      gameType="finance"
      maxScore={TOTAL_ROUNDS}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">💰</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Answer questions about budgeting habits!<br />
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

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                {currentQuestion.question}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className="w-full min-h-[80px] bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-6 py-4 rounded-xl text-white font-bold text-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <span className="text-3xl mr-2">{option.emoji}</span> {option.text}
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

export default ReflexBudgetSmarts;