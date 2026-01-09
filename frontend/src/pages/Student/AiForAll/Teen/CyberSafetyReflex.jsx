import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const CyberSafetyReflex = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-93";
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
      question: "You receive an email claiming you've won a prize. What should you do?",
      message: "You receive an email claiming you've won a prize",
      correctAnswer: "Delete the email and report it",
      options: [
        { text: "Click the link to claim your prize", isCorrect: false, emoji: "🔗" },
        { text: "Delete the email and report it", isCorrect: true, emoji: "🗑️" },
        { text: "Forward it to friends", isCorrect: false, emoji: "📩" },
        { text: "Reply asking for more details", isCorrect: false, emoji: "💬" }
      ],
      hint: "Never click suspicious links in unsolicited emails."
    },
    {
      id: 2,
      question: "A stranger online asks for your personal information. What should you do?",
      message: "A stranger online asks for your personal information",
      correctAnswer: "Do not share any personal information",
      options: [
        { text: "Share your name and age", isCorrect: false, emoji: "👤" },
        { text: "Share your location", isCorrect: false, emoji: "📍" },
        { text: "Do not share any personal information", isCorrect: true, emoji: "🔒" },
        { text: "Meet them in person", isCorrect: false, emoji: "👥" }
      ],
      hint: "Never share personal information with strangers online."
    },
    {
      id: 3,
      question: "Your bank contacts you asking for your password. What should you do?",
      message: "Your bank contacts you asking for your password",
      correctAnswer: "Hang up and call your bank directly",
      options: [
        { text: "Provide your password", isCorrect: false, emoji: "🔑" },
        { text: "Give them your account number", isCorrect: false, emoji: "💳" },
        { text: "Ignore the call", isCorrect: false, emoji: "🔇" },
        { text: "Hang up and call your bank directly", isCorrect: true, emoji: "📞" },
      ],
      hint: "Legitimate banks never ask for passwords or PINs."
    },
    {
      id: 4,
      question: "You find a USB drive in a parking lot. What should you do?",
      message: "You find a USB drive in a parking lot",
      correctAnswer: "Do not plug it into any device",
      options: [
        { text: "Plug it into your computer", isCorrect: false, emoji: "💻" },
        { text: "Give it to a friend", isCorrect: false, emoji: "🎁" },
        { text: "Do not plug it into any device", isCorrect: true, emoji: "🛡️" },
        { text: "Leave it where you found it", isCorrect: false, emoji: "🚶" }
      ],
      hint: "Unknown USB drives may contain malware."
    },
    {
      id: 5,
      question: "Which is the safest way to create a password?",
      message: "Creating a secure password",
      correctAnswer: "Use a mix of letters, numbers, and symbols",
      options: [
        { text: "Use a mix of letters, numbers, and symbols", isCorrect: true, emoji: "🔐" },
        { text: "Use your pet's name", isCorrect: false, emoji: "🐕" },
        { text: "Use your birthdate", isCorrect: false, emoji: "🎂" },
        { text: "Use the same password for all accounts", isCorrect: false, emoji: "🔁" }
      ],
      hint: "Strong passwords should be complex and unique."
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
      title="Cyber Safety Reflex"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Test your cyber safety knowledge!` : "Test your cyber safety knowledge!"}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      nextGamePathProp="/student/ai-for-all/teen/global-fairness-quiz"
      nextGameIdProp="ai-teen-94"
      showConfetti={gameState === "finished" && accuracy >= 80}
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
              Test your cyber safety knowledge!<br />
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
              
              <div className="bg-red-500/20 rounded-xl p-6 mb-6">
                <p className="text-white text-2xl text-center font-semibold">
                  {currentQuestion.message}
                </p>
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
              
              {answered && (
                <p className="text-center text-white/80 mt-4 text-lg italic">
                  {currentQuestion.hint}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CyberSafetyReflex;