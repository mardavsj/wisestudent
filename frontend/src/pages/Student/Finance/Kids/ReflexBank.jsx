import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexBank = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-43";
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
      question: "What should you do to put money in the bank?",
      correctAnswer: "Deposit",
      options: [
        { text: "Deposit", isCorrect: true, emoji: "💰" },
        { text: "Steal", isCorrect: false, emoji: "🚫" },
        { text: "Lose", isCorrect: false, emoji: "❌" },
        { text: "Ignore", isCorrect: false, emoji: "🙈" }
      ]
    },
    {
      id: 2,
      question: "What is the smart way to keep your money safe?",
      correctAnswer: "Save",
      options: [
        { text: "Spend", isCorrect: false, emoji: "💸" },
        { text: "Save", isCorrect: true, emoji: "💵" },
        { text: "Waste", isCorrect: false, emoji: "🗑️" },
        { text: "Forget", isCorrect: false, emoji: "😴" }
      ]
    },
    {
      id: 3,
      question: "How do you take money out of your bank account?",
      correctAnswer: "Withdraw",
      options: [
        { text: "Lose", isCorrect: false, emoji: "❌" },
        { text: "Steal", isCorrect: false, emoji: "🚫" },
        { text: "Ignore", isCorrect: false, emoji: "🙈" },
        { text: "Withdraw", isCorrect: true, emoji: "🏦" },
      ]
    },
    {
      id: 4,
      question: "What should you do to start saving money at a bank?",
      correctAnswer: "Open Account",
      options: [
        { text: "Ignore", isCorrect: false, emoji: "🙈" },
        { text: "Spend All", isCorrect: false, emoji: "💸" },
        { text: "Open Account", isCorrect: true, emoji: "📝" },
        { text: "Forget", isCorrect: false, emoji: "😴" }
      ]
    },
    {
      id: 5,
      question: "What should you do to know how much money you have?",
      correctAnswer: "Check Balance",
      options: [
        { text: "Check Balance", isCorrect: true, emoji: "📊" },
        { text: "Forget", isCorrect: false, emoji: "😴" },
        { text: "Spend All", isCorrect: false, emoji: "💸" },
        { text: "Ignore", isCorrect: false, emoji: "🙈" }
      ]
    }
  ];

  // Update ref when currentRound changes
  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  // Combined timer effect - handles both round changes and timing
  useEffect(() => {
    if (gameState === "playing" && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
      
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Start new timer for this round
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up for this round
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            
            // Handle time up - move to next question or show results
            setAnswered(true);
            resetFeedback();
            
            const isLastQuestion = currentRoundRef.current >= TOTAL_ROUNDS;
            
            setTimeout(() => {
              if (isLastQuestion) {
                setGameState("finished");
              } else {
                setCurrentRound((prev) => prev + 1);
              }
            }, 1000);
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentRound, gameState]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

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
        setGameState("finished");
    } else {
        setCurrentRound((prev) => prev + 1);
    }
    }, 500);
  };

  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title="Reflex Bank Basics"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Test your banking knowledge!` : "Test your banking knowledge!"}
      currentLevel={currentRound}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      score={score}
      gameId={gameId}
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      totalLevels={5}
      maxScore={5}
      showConfetti={gameState === "finished" && score === 5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/kids/puzzle-bank-uses"
      nextGameIdProp="finance-kids-44">
      <div className="space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🏦</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Answer banking questions correctly!<br />
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
            {/* Status Bar with Timer - Similar to ReflexSavings */}
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
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed min-h-[80px] flex items-center justify-center"
                  >
                    <div className="text-4xl mr-3">{option.emoji}</div>
                    <h3 className="font-bold text-xl">{option.text}</h3>
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

export default ReflexBank;