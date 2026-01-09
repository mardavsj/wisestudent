import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexWiseUse = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-9";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);
  const currentRoundRef = useRef(0);

  const questions = [
    {
      id: 1,
      question: "What is the wisest way to use your money?",
      correctAnswer: "Invest for Growth",
      options: [
        { text: "Invest for Growth", isCorrect: true, emoji: "📈" },
        { text: "Waste on Junk", isCorrect: false, emoji: "🗑️" },
        { text: "Impulse Buy", isCorrect: false, emoji: "⚡" },
        { text: "Spend on FOMO", isCorrect: false, emoji: "😱" }
      ]
    },
    {
      id: 2,
      question: "What should you prioritize for financial security?",
      correctAnswer: "Emergency Fund",
      options: [
        { text: "Luxury Splurge", isCorrect: false, emoji: "💎" },
        { text: "Emergency Fund", isCorrect: true, emoji: "🛡️" },
        { text: "Peer Pressure", isCorrect: false, emoji: "👥" },
        { text: "Spend All", isCorrect: false, emoji: "💸" }
      ]
    },
    {
      id: 3,
      question: "What helps your money grow over time?",
      correctAnswer: "Compound Interest",
      options: [
        { text: "No Planning", isCorrect: false, emoji: "🚫" },
        { text: "Compound Interest", isCorrect: true, emoji: "💰" },
        { text: "Quick Spending", isCorrect: false, emoji: "⚡" },
        { text: "Ignore Savings", isCorrect: false, emoji: "🙈" }
      ]
    },
    {
      id: 4,
      question: "What should guide your financial decisions?",
      correctAnswer: "Financial Plan",
      options: [
        { text: "Financial Plan", isCorrect: true, emoji: "📋" },
        { text: "Emotions", isCorrect: false, emoji: "😢" },
        { text: "Peer Pressure", isCorrect: false, emoji: "👥" },
        { text: "Impulse", isCorrect: false, emoji: "🎲" }
      ]
    },
    {
      id: 5,
      question: "What should you focus on for long-term success?",
      correctAnswer: "Long-term Goals",
      options: [
        { text: "Instant Gratification", isCorrect: false, emoji: "🎁" },
        { text: "Short-term Wants", isCorrect: false, emoji: "🛍️" },
        { text: "Long-term Goals", isCorrect: true, emoji: "🎯" },
        { text: "No Planning", isCorrect: false, emoji: "🚫" }
      ]
    }
  ];

  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  useEffect(() => {
    if (gameState === "playing" && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
    }
  }, [currentRound, gameState]);

  const handleTimeUp = useCallback(() => {
    if (currentRoundRef.current < TOTAL_ROUNDS) {
      setCurrentRound(prev => prev + 1);
    } else {
      setGameState("finished");
    }
  }, []);

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
      }
    };
  }, [gameState, answered, timeLeft, handleTimeUp]);

  const handleAnswer = (isCorrect) => {
    if (answered || gameState !== "playing") return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    setTimeout(() => {
      if (currentRound < TOTAL_ROUNDS) {
        setCurrentRound(prev => prev + 1);
      } else {
        setGameState("finished");
      }
    }, 500);
  };

  const startGame = () => {
    setGameState("playing");
    setCurrentRound(1);
    setScore(0);
    setTimeLeft(ROUND_TIME);
    setAnswered(false);
    resetFeedback();
  };

  const getTimerColor = () => {
    if (timeLeft > 6) return "bg-green-500";
    if (timeLeft > 3) return "bg-yellow-500";
    return "bg-red-500 animate-pulse";
  };

  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title="Reflex Wise Use"
      subtitle={
        gameState === "ready" 
          ? "Test your financial wisdom!" 
          : gameState === "playing" 
          ? `Round ${currentRound}/${TOTAL_ROUNDS} | Time: ${timeLeft}s | Score: ${score}` 
          : "Game Complete!"
      }
      showGameOver={gameState === "finished"}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/finance/teen/badge-smart-saver"
      nextGameIdProp="finance-teens-10"
      gameType="finance"
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      currentLevel={currentRound}
      showConfetti={gameState === "finished" && score === TOTAL_ROUNDS}
      maxScore={TOTAL_ROUNDS}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Reflex Wise Use Challenge</h2>
            <p className="text-white/90 text-lg mb-6">
              Answer questions about wise money use. You have {ROUND_TIME} seconds per question!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-green-500/20 p-4 rounded-xl border border-green-500/30">
                <h3 className="font-bold text-green-300 mb-2 text-lg">Wise Choices</h3>
                <p className="text-white/80 text-sm">Invest for Growth, Emergency Fund, Compound Interest, Financial Plan, Long-term Goals</p>
              </div>
              <div className="bg-red-500/20 p-4 rounded-xl border border-red-500/30">
                <h3 className="font-bold text-red-300 mb-2 text-lg">Poor Choices</h3>
                <p className="text-white/80 text-sm">Waste on Junk, Impulse Buy, Spend on FOMO, Luxury Splurge, Peer Pressure</p>
              </div>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-8 rounded-full font-bold text-lg shadow-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && currentQuestion && (
          <div className="space-y-6">
            {/* Status Bar */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                  <span className="font-bold">Round:</span>
                  <span>{currentRound}/{TOTAL_ROUNDS}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">Time:</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getTimerColor()}`}></div>
                    <span className={timeLeft <= 3 ? "text-red-400 font-bold" : ""}>{timeLeft}s</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">Score:</span>
                  <span className="text-yellow-400">{score}/{TOTAL_ROUNDS}</span>
                </div>
              </div>

            </div>

            {/* Question */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
                {currentQuestion.question}
              </h3>
              
              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[80px] flex items-center justify-center gap-3"
                  >
                    <span className="text-3xl">{option.emoji}</span>
                    <span className="text-lg font-semibold">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {gameState === "finished" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Game Complete!</h2>
            
            <div className="mb-6">
              <div className="text-6xl mb-4">
                {score === TOTAL_ROUNDS ? "🏆" : score >= 3 ? "👍" : "💪"}
              </div>
              <p className="text-2xl font-bold text-white mb-2">
                Score: {score}/{TOTAL_ROUNDS}
              </p>
              <p className="text-white/90 text-lg">
                {score === TOTAL_ROUNDS 
                  ? "Perfect! You're a financial wisdom master!" 
                  : score >= 3 
                  ? "Great job! You understand wise money use!" 
                  : "Keep learning about wise financial decisions!"}
              </p>
            </div>
            
            {score >= 3 && (
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
                <span>+{score} Coins</span>
              </div>
            )}
            
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexWiseUse;