import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { Zap, Copy, Lightbulb } from 'lucide-react';

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const CreativeThinkingReflex = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-89");
  const gameId = gameData?.id || "brain-kids-89";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for CreativeThinkingReflex, using fallback ID");
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
      question: "Which activity shows creative thinking?",
      correctAnswer: "Designing a new toy",
      options: [
        { text: "Copying homework", isCorrect: false, emoji: "📋" },
        { text: "Following exact instructions", isCorrect: false, emoji: "📜" },
        { text: "Designing a new toy", isCorrect: true, emoji: "🧸" },
        { text: "Doing things the same way", isCorrect: false, emoji: "🔄" }
      ]
    },
    {
      id: 2,
      question: "What demonstrates creative problem-solving?",
      correctAnswer: "Finding a new solution",
      options: [
        { text: "Using the usual method", isCorrect: false, emoji: "🔁" },
        { text: "Asking someone else to solve it", isCorrect: false, emoji: "🙋" },
        { text: "Giving up when stuck", isCorrect: false, emoji: "😞" },
        { text: "Finding a new solution", isCorrect: true, emoji: "🔍" }
      ]
    },
    {
      id: 3,
      question: "Which approach shows creativity?",
      correctAnswer: "Combining different ideas",
      options: [
        { text: "Sticking to one method", isCorrect: false, emoji: "📏" },
        { text: "Repeating what others did", isCorrect: false, emoji: "🔁" },
        { text: "Combining different ideas", isCorrect: true, emoji: "🔀" },
        { text: "Avoiding new challenges", isCorrect: false, emoji: "🛡️" }
      ]
    },
    {
      id: 4,
      question: "What is a sign of creative thinking?",
      correctAnswer: "Asking 'what if' questions",
      options: [
        { text: "Accepting the first answer", isCorrect: false, emoji: "✅" },
        { text: "Following set procedures", isCorrect: false, emoji: "📋" },
        { text: "Avoiding mistakes", isCorrect: false, emoji: "⚠️" },
        { text: "Asking 'what if' questions", isCorrect: true, emoji: "❓" },
      ]
    },
    {
      id: 5,
      question: "Which behavior shows creative thinking?",
      correctAnswer: "Experimenting with new approaches",
      options: [
        { text: "Doing everything by the book", isCorrect: false, emoji: "📚" },
        { text: "Copying successful methods exactly", isCorrect: false, emoji: "🖨️" },
        { text: "Experimenting with new approaches", isCorrect: true, emoji: "🧪" },
        { text: "Sticking to familiar routines", isCorrect: false, emoji: "🧭" }
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

  // Reset timer when round changes
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

  // Ensure game always starts fresh when component mounts
  useEffect(() => {
    setGameState("ready");
    setCurrentRound(0);
    setScore(0);
    setTimeLeft(ROUND_TIME);
    setAnswered(false);
    resetFeedback();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const currentQ = currentRound > 0 && currentRound <= TOTAL_ROUNDS ? questions[currentRound - 1] : null;

  return (
    <GameShell
      title="Reflex Creative Thinking"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Test your creative thinking reflexes!` : "Test your creative thinking reflexes!"}
      score={score}
      currentLevel={currentRound || 1}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      maxScore={TOTAL_ROUNDS}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/brain/kids/badge-creative-kid"
      nextGameIdProp="brain-kids-90"
      showConfetti={gameState === "finished" && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="brain"
    >
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🎨</div>
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Test Your Creative Thinking Skills?</h3>
            <p className="text-white/90 text-lg mb-6">
              Answer questions about creative thinking and problem-solving.
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

        {gameState === "playing" && currentQ && (
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
                {currentQ.question}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQ.options.map((option, index) => (
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
            <div className="text-5xl mb-6">🎨</div>
            <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
            <p className="text-white/90 text-lg mb-6">
              You scored {score} out of {TOTAL_ROUNDS}!
            </p>
            <p className="text-white/80 mb-6">
              You're developing strong creative thinking skills!
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

export default CreativeThinkingReflex;

