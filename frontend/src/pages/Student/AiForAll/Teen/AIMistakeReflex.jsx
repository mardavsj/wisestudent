import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const AIMistakeReflex = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-56";
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
      question: "An AI medical diagnostic system recommends a treatment that contradicts established medical guidelines. What should you do?",
      statement: "AI recommends unproven treatment for common condition",
      correctAnswer: "Verify with medical professional",
      options: [
        { text: "Follow AI recommendation", isCorrect: false, emoji: "🤖" },
        { text: "Verify with medical professional", isCorrect: true, emoji: "⚕️" },
        { text: "Ignore and self-treat", isCorrect: false, emoji: "💊" },
        { text: "Share with friends", isCorrect: false, emoji: "👥" }
      ]
    },
    {
      id: 2,
      question: "A job application AI system consistently rejects qualified candidates from a specific demographic. What does this indicate?",
      statement: "AI hiring system shows bias in selection",
      correctAnswer: "Algorithmic bias requiring review",
      options: [
        { text: "Algorithmic bias requiring review", isCorrect: true, emoji: "⚖️" },
        { text: "Efficient selection", isCorrect: false, emoji: "😄" },
        { text: "Market trend", isCorrect: false, emoji: "📈" },
        { text: "Coincidence", isCorrect: false, emoji: "🎲" }
      ]
    },
    {
      id: 3,
      question: "An AI voice assistant accidentally records private conversations and stores them. What privacy concern does this represent?",
      statement: "AI assistant records unintended private data",
      correctAnswer: "Data privacy and consent violation",
      options: [
        { text: "Normal operation", isCorrect: false, emoji: "🔄" },
        { text: "Storage issue", isCorrect: false, emoji: "💾" },
        { text: "Network error", isCorrect: false, emoji: "📶" },
        { text: "Data privacy and consent violation", isCorrect: true, emoji: "🔒" },
      ]
    },
    {
      id: 4,
      question: "An AI content filter blocks educational material about human biology as inappropriate. What is this an example of?",
      statement: "AI content filter incorrectly blocks educational content",
      correctAnswer: "Overfitting and lack of context understanding",
      options: [
        { text: "Appropriate filtering", isCorrect: false, emoji: "✅" },
        { text: "User error", isCorrect: false, emoji: "👤" },
        { text: "Overfitting and lack of context understanding", isCorrect: true, emoji: "🧠" },
        { text: "System update needed", isCorrect: false, emoji: "🔄" }
      ]
    },
    {
      id: 5,
      question: "An AI system makes a decision that affects someone's credit score, but cannot explain how it reached that decision. What AI challenge does this represent?",
      statement: "AI makes unexplainable decision affecting credit",
      correctAnswer: "Lack of algorithmic transparency",
      options: [
        { text: "Lack of algorithmic transparency", isCorrect: true, emoji: "🔍" },
        { text: "Efficient processing", isCorrect: false, emoji: "⚡" },
        { text: "Data security", isCorrect: false, emoji: "🛡️" },
        { text: "Network latency", isCorrect: false, emoji: "⏱️" }
      ]
    }
  ];

  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  // Reset timeLeft and answered when round changes
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
    
    const currentQuestion = questions[currentRound - 1];
    const isCorrect = option.isCorrect;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
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

  const finalScore = score;
  const currentQuestion = questions[currentRound - 1];
  const accuracy = Math.round((score / TOTAL_ROUNDS) * 100);

  return (
    <GameShell
      title="AI Mistake Reflex"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Test your ability to identify AI mistakes!` : "Test your ability to identify AI mistakes!"}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      nextGamePathProp="/student/ai-for-all/teen/data-diversity-story"
      nextGameIdProp="ai-teen-57"
      showConfetti={gameState === "finished" && accuracy >= 60}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="ai"
      maxScore={TOTAL_ROUNDS}
      totalCoins={totalCoins}
      totalXp={totalXp}
      backPath="/games/ai-for-all/teens"
    >
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🤖</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Test your ability to identify AI mistakes!<br />
              You have {ROUND_TIME} seconds for each question.
            </p>
            <p className="text-white/80 mb-6">
              You have {TOTAL_ROUNDS} items with {ROUND_TIME} seconds each!
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
              
              <div className="bg-gradient-to-br from-orange-500/30 to-yellow-500/30 rounded-xl p-8 mb-6">
                <p className="text-white text-2xl font-bold">{currentQuestion.statement}</p>
              </div>
              
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

export default AIMistakeReflex;