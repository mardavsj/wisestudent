import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexNeedsFirst = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-19";
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
      question: "Which of these is a basic need?",
      correctAnswer: "Food",
      options: [
        { text: "Video Games", isCorrect: false, emoji: "🎮" },
        { text: "Food", isCorrect: true, emoji: "🍎" },
        { text: "Designer Clothes", isCorrect: false, emoji: "👕" },
        { text: "Luxury Car", isCorrect: false, emoji: "🚗" }
      ]
    },
    {
      id: 2,
      question: "Which item represents a need for education?",
      correctAnswer: "School Books",
      options: [
        { text: "School Books", isCorrect: true, emoji: "📚" },
        { text: "Expensive Toys", isCorrect: false, emoji: "🧸" },
        { text: "Gadgets", isCorrect: false, emoji: "📱" },
        { text: "Snacks", isCorrect: false, emoji: "🍪" }
      ]
    },
    {
      id: 3,
      question: "Which is essential for health?",
      correctAnswer: "Medicine",
      options: [
        { text: "Candy", isCorrect: false, emoji: "🍬" },
        { text: "Soda", isCorrect: false, emoji: "🥤" },
        { text: "Medicine", isCorrect: true, emoji: "💊" },
        { text: "Jewelry", isCorrect: false, emoji: "💍" }
      ]
    },
    {
      id: 4,
      question: "Which item is a basic necessity?",
      correctAnswer: "Shelter",
      options: [
        { text: "Vacation", isCorrect: false, emoji: "✈️" },
        { text: "Entertainment", isCorrect: false, emoji: "🎬" },
        { text: "Luxury Dining", isCorrect: false, emoji: "🍽️" },
        { text: "Shelter", isCorrect: true, emoji: "🏠" },
      ]
    },
    {
      id: 5,
      question: "Which is a fundamental need?",
      correctAnswer: "Clean Water",
      options: [
        { text: "Clean Water", isCorrect: true, emoji: "💧" },
        { text: "Ice Cream", isCorrect: false, emoji: "🍦" },
        { text: "Designer Bag", isCorrect: false, emoji: "👜" },
        { text: "Concert Tickets", isCorrect: false, emoji: "🎫" }
      ]
    }
  ];

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
        setGameState("finished");
      } else {
        setCurrentRound((prev) => prev + 1);
        setAnswered(false);
      }
    }, 1000);
  }, [resetFeedback]);

  // Timer effect - countdown from 10 seconds for each question
  useEffect(() => {
    if (gameState !== "playing") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Check if game should be finished
    if (currentRoundRef.current > TOTAL_ROUNDS) {
      setGameState("finished");
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
  }, [gameState, handleTimeUp]);

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

    // Clear the timer immediately when user answers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setAnswered(true);
    resetFeedback();

    const isCorrect = option.isCorrect;
    const isLastQuestion = currentRound === questions.length;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    // Move to next round or show results after a short delay
    setTimeout(() => {
      if (isLastQuestion) {
        setGameState("finished");
      } else {
        setCurrentRound((prev) => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const handleNext = () => {
    navigate("/student/finance/kids/badge-smart-spender-kid");
  };

  const finalScore = score;

  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title="Reflex Needs First"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Identify needs vs wants!` : "Identify needs vs wants!"}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={gameState === "finished"}
      score={finalScore}
      gameId="finance-kids-19"
      gameType="finance"
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      currentLevel={9}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={gameState === "finished" && finalScore === 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePathProp="/student/finance/kids/badge-smart-spender-kid"
      nextGameIdProp="finance-kids-20"
    >
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">📋</div>
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Test Your Needs vs Wants Skills?</h3>
            <p className="text-white/90 text-lg mb-6">
              Answer questions about identifying needs versus wants.
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

        {gameState === "finished" && null}
      </div>
    </GameShell>
  );
};

export default ReflexNeedsFirst;