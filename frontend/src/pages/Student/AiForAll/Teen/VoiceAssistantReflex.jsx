import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const VoiceAssistantReflex = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-27";
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
      question: "You're working on a group project and need to quickly schedule a meeting with all members. What can a voice assistant do?",
      task: { emoji: "📅", text: "Schedule a group meeting with multiple participants" },
      correctAnswer: "With limitations",
      options: [
        { text: "Yes, schedule instantly", isCorrect: false, emoji: "📔" },
        { text: "No, not possible", isCorrect: false, emoji: "🛑" },
        { text: "With limitations", isCorrect: true, emoji: "⚠️" },
        { text: "Only via calendar app", isCorrect: false, emoji: "📅" }
      ]
    },
    {
      id: 2,
      question: "You're studying and want to set up a focused work session with breaks. Can a voice assistant help manage your time?",
      task: { emoji: "⏰", text: "Set up a Pomodoro timer with work/break intervals" },
      correctAnswer: "Yes",
      options: [
        { text: "Yes, with timer skills", isCorrect: true, emoji: "⏱️" },
        { text: "No, not possible", isCorrect: false, emoji: "🚫" },
        { text: "Only basic timers", isCorrect: false, emoji: "⏱️" },
        { text: "Requires third-party app", isCorrect: false, emoji: "📱" }
      ]
    },
    {
      id: 3,
      question: "You need to translate a conversation in real-time with a friend who speaks a different language. Can a voice assistant handle this?",
      task: { emoji: "🌐", text: "Real-time voice translation between two people" },
      correctAnswer: "Limited capability",
      options: [
        { text: "Yes, perfectly", isCorrect: false, emoji: "👌" },
        { text: "No, not possible", isCorrect: false, emoji: "🙅" },
        { text: "Limited capability", isCorrect: true, emoji: "🗣️" },
        { text: "Only text translation", isCorrect: false, emoji: "📝" }
      ]
    },
    {
      id: 4,
      question: "You want to send a message to your study group while driving to avoid using your phone. Can a voice assistant help?",
      task: { emoji: "🚗", text: "Send a group message while driving hands-free" },
      correctAnswer: "Yes",
      options: [
        { text: "No, not safe", isCorrect: false, emoji: "🙅‍♀️" },
        { text: "Only with Bluetooth", isCorrect: false, emoji: "📡" },
        { text: "Requires app integration", isCorrect: false, emoji: "📱" },
        { text: "Yes, with voice commands", isCorrect: true, emoji: "⏺️" },
      ]
    },
    {
      id: 5,
      question: "You're cooking and want to set multiple timers for different dishes without touching a screen. Can a voice assistant handle this?",
      task: { emoji: "🍳", text: "Manage multiple simultaneous timers with different names" },
      correctAnswer: "Yes",
      options: [
        { text: "No, only one timer", isCorrect: false, emoji: "❌" },
        { text: "Yes, with named timers", isCorrect: true, emoji: "⏲️" },
        { text: "Only basic timers", isCorrect: false, emoji: "⏱️" },
        { text: "Requires screen interaction", isCorrect: false, emoji: "📱" }
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
      title="Voice Assistant Reflex"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Test your knowledge of voice AI capabilities!` : "Test your knowledge of voice AI capabilities!"}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
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
            <div className="text-5xl mb-6">🎤</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Test your knowledge of voice AI capabilities!<br />
              You have {ROUND_TIME} seconds for each question.
            </p>
            <p className="text-white/80 mb-6">
              You have {TOTAL_ROUNDS} tasks with {ROUND_TIME} seconds each!
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
              
              <div className="bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-xl p-8 mb-6">
                <div className="text-5xl mb-3 text-center">{currentQuestion.task.emoji}</div>
                <p className="text-2xl text-white font-bold text-center">{currentQuestion.task.text}</p>
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

export default VoiceAssistantReflex;