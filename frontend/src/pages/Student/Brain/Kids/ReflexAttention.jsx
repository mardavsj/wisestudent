import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { Zap, Ear, Brain, Coffee, VolumeX } from 'lucide-react';

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexAttention = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-13");
  const gameId = gameData?.id || "brain-kids-13";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ReflexAttention, using fallback ID");
  }
  
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
      question: "Which activity helps improve focus and attention?",
      correctAnswer: "Listening carefully to instructions",
      options: [
        { text: "Listening carefully to instructions", isCorrect: true, emoji: "👂" },
        { text: "Daydreaming during class", isCorrect: false, emoji: "☁️" },
        { text: "Chatting with friends while studying", isCorrect: false, emoji: "💬" },
        { text: "Multitasking on multiple devices", isCorrect: false, emoji: "📱" }
      ]
    },
    {
      id: 2,
      question: "What is the best approach to maintain concentration?",
      correctAnswer: "Eliminate distractions and focus on one task",
      options: [
        { text: "Switch between tasks rapidly", isCorrect: false, emoji: "🔄" },
        { text: "Eliminate distractions and focus on one task", isCorrect: true, emoji: "🎯" },
        { text: "Work in a noisy environment", isCorrect: false, emoji: "🔊" },
        { text: "Check social media frequently", isCorrect: false, emoji: "📱" }
      ]
    },
    {
      id: 3,
      question: "Which technique improves attention span?",
      correctAnswer: "Practice mindfulness exercises",
      options: [
        { text: "Rushing through assignments", isCorrect: false, emoji: "🏃" },
        { text: "Practice mindfulness exercises", isCorrect: true, emoji: "🧘" },
        { text: "Skipping breakfast regularly", isCorrect: false, emoji: "🍽️" },
        { text: "Staying up late every night", isCorrect: false, emoji: "🌙" }
      ]
    },
    {
      id: 4,
      question: "What helps sustain attention during long tasks?",
      correctAnswer: "Take regular short breaks",
      options: [
        { text: "Work for hours without stopping", isCorrect: false, emoji: "⏰" },
        { text: "Take regular short breaks", isCorrect: true, emoji: "⏸️" },
        { text: "Drink lots of sugary drinks", isCorrect: false, emoji: "🥤" },
        { text: "Avoid all physical activity", isCorrect: false, emoji: "🛋️" }
      ]
    },
    {
      id: 5,
      question: "Which habit supports better attention skills?",
      correctAnswer: "Get adequate sleep each night",
      options: [
        { text: "Stay up past bedtime regularly", isCorrect: false, emoji: "😴" },
        { text: "Eat junk food for energy", isCorrect: false, emoji: "🍔" },
        { text: "Skip important meals", isCorrect: false, emoji: "🍽️" },
        { text: "Get adequate sleep each night", isCorrect: true, emoji: "🛌" },
      ]
    }
  ];

  // Handle time up - move to next question or show results
  const handleTimeUp = useCallback(() => {
    setAnswered(true);
    resetFeedback();

    const isLastQuestion = currentRound >= TOTAL_ROUNDS;

    setTimeout(() => {
      if (isLastQuestion) {
        setGameState("finished");
      } else {
        setCurrentRound((prev) => prev + 1);
        setAnswered(false);
      }
    }, 1000);
  }, [currentRound, resetFeedback]);

  useEffect(() => {
    if (gameState === "playing" && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
    }
  }, [currentRound, gameState]);

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
    if (currentRound > TOTAL_ROUNDS) {
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

  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title="Reflex Attention"
      score={score}
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Test your attention reflexes!` : "Test your attention reflexes!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={gameState === "finished"}
      gameId={gameId}
      nextGamePathProp="/student/brain/kids/puzzle-of-focus"
      nextGameIdProp="brain-kids-14"
      gameType="brain"
      totalLevels={TOTAL_ROUNDS}
      currentLevel={currentRound}
      maxScore={TOTAL_ROUNDS}
      showConfetti={gameState === "finished" && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🧠</div>
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Test Your Attention Skills?</h3>
            <p className="text-white/90 text-lg mb-6">
              Answer questions about focus and attention improvement.
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

        {gameState === "finished" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🧠</div>
            <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
            <p className="text-white/90 text-lg mb-6">
              You scored {score} out of {TOTAL_ROUNDS}!
            </p>
            <p className="text-white/80 mb-6">
              You're developing strong attention skills!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexAttention;

