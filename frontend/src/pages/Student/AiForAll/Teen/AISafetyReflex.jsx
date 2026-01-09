import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const AISafetyReflex = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-80";
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
      question: "An AI suggests sharing personal information online. What should you do?",
      situation: "An AI suggests sharing personal information online",
      correctAnswer: "Reject the suggestion",
      options: [
        { text: "Reject the suggestion", isCorrect: true, emoji: "🛡️" },
        { text: "Share the information", isCorrect: false, emoji: "📤" },
        { text: "Ask for more details", isCorrect: false, emoji: "❓" },
        { text: "Ignore the AI", isCorrect: false, emoji: "🔇" }
      ]
    },
    {
      id: 2,
      question: "An AI offers to help steal a phone. What should you do?",
      situation: "An AI offers to help steal a phone",
      correctAnswer: "Reject the offer",
      options: [
        { text: "Reject the offer", isCorrect: true, emoji: "🛡️" },
        { text: "Accept the offer", isCorrect: false, emoji: "📥" },
        { text: "Report to authorities", isCorrect: false, emoji: "👮" },
        { text: "Discuss with friends", isCorrect: false, emoji: "👥" }
      ]
    },
    {
      id: 3,
      question: "An AI suggests helping people in need. What should you do?",
      situation: "An AI suggests helping people in need",
      correctAnswer: "Accept the suggestion",
      options: [
        { text: "Reject the suggestion", isCorrect: false, emoji: "🛡️" },
        { text: "Accept the suggestion", isCorrect: true, emoji: "🤝" },
        { text: "Ask for payment", isCorrect: false, emoji: "💰" },
        { text: "Ignore the AI", isCorrect: false, emoji: "🔇" }
      ]
    },
    {
      id: 4,
      question: "An AI asks for your password to 'verify your account'. What should you do?",
      situation: "An AI asks for your password to 'verify your account'",
      correctAnswer: "Reject the request",
      options: [
        { text: "Provide the password", isCorrect: false, emoji: "🔓" },
        { text: "Ask for a different verification method", isCorrect: false, emoji: "❓" },
        { text: "Give a fake password", isCorrect: false, emoji: "🎭" },
        { text: "Reject the request", isCorrect: true, emoji: "🛡️" },
      ]
    },
    {
      id: 5,
      question: "An AI suggests posting harmful content about someone. What should you do?",
      situation: "An AI suggests posting harmful content about someone",
      correctAnswer: "Reject the suggestion",
      options: [
        { text: "Post the content", isCorrect: false, emoji: "📢" },
        { text: "Modify to be less harmful", isCorrect: false, emoji: "✂️" },
        { text: "Reject the suggestion", isCorrect: true, emoji: "🛡️" },
        { text: "Ask who the person is", isCorrect: false, emoji: "👤" }
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
      title="AI Safety Reflex 🤖"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Test your AI safety knowledge!` : "Test your AI safety knowledge!"}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      nextGamePathProp="/student/ai-for-all/teen/cyberbullying-storyy"
      nextGameIdProp="ai-teen-81"
      showConfetti={gameState === "finished" && accuracy >= 70}
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
            <div className="text-5xl mb-6">🛡️</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Test your AI safety knowledge!<br />
              You have {ROUND_TIME} seconds for each question.
            </p>
            <p className="text-white/80 mb-6">
              You have {TOTAL_ROUNDS} situations with {ROUND_TIME} seconds each!
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
              
              <div className="bg-gradient-to-br from-green-500/30 to-blue-500/30 rounded-xl p-8 mb-6 text-center">
                <p className="text-white text-2xl font-bold">{currentQuestion.situation}</p>
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

export default AISafetyReflex;