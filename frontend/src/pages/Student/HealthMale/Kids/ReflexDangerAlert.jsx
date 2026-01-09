import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ReflexDangerAlert = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-89";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const ROUND_TIME = 10;
  const TOTAL_ROUNDS = 5;

  const [currentRound, setCurrentRound] = useState(1);
  const [gameState, setGameState] = useState('ready'); // ready, playing, finished
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answered, setAnswered] = useState(false);

  const timerRef = useRef(null);
  const currentRoundRef = useRef(1);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
  {
    id: 1,
    instruction: "An alarm sounds and you notice smoke near a room. Your body needs to react fast. What action fits the alert?",
    options: [
      { id: 'a', emoji: "👀", text: "Look for the source closely", isCorrect: false },
      { id: 'b', emoji: "🏃", text: "Move away toward fresh air", isCorrect: true },
      { id: 'c', emoji: "📱", text: "Record a video", isCorrect: false },
      { id: 'd', emoji: "🪑", text: "Sit and wait", isCorrect: false }
    ]
  },
  {
    id: 2,
    instruction: "A classmate hands you something unknown and says it will help you feel better. What response matches a safety reflex?",
    options: [
      { id: 'a', emoji: "✋", text: "Refuse and keep distance", isCorrect: true },
      { id: 'b', emoji: "💊", text: "Examine it closely", isCorrect: false },
      { id: 'c', emoji: "😅", text: "Laugh it off", isCorrect: false },
      { id: 'd', emoji: "🎒", text: "Put it in your bag", isCorrect: false }
    ]
  },
  {
    id: 3,
    instruction: "You feel uncomfortable when someone keeps insisting after you say no. What reflex action helps protect you?",
    options: [
      { id: 'a', emoji: "🤐", text: "Stay silent", isCorrect: false },
      { id: 'b', emoji: "👀", text: "Watch what happens next", isCorrect: false },
      { id: 'c', emoji: "😬", text: "Try to ignore it", isCorrect: false },
      { id: 'd', emoji: "🗣️", text: "Reach out to a trusted adult", isCorrect: true }
    ]
  },
  {
    id: 4,
    instruction: "A vehicle slows down and someone you don’t know calls your name. Your reflex should guide you. What fits best?",
    options: [
      { id: 'a', emoji: "👋", text: "Answer politely", isCorrect: false },
      { id: 'b', emoji: "❓", text: "Ask why they stopped", isCorrect: false },
      { id: 'c', emoji: "🚫", text: "Keep distance and do not engage", isCorrect: true },
      { id: 'd', emoji: "📍", text: "Stand still", isCorrect: false }
    ]
  },
  {
    id: 5,
    instruction: "You notice a risky object lying around at home that could cause harm. What reflex action supports safety?",
    options: [
      { id: 'a', emoji: "👨‍👩‍👧", text: "Inform a responsible adult", isCorrect: true },
      { id: 'b', emoji: "🧪", text: "Test how it works", isCorrect: false },
      { id: 'c', emoji: "📦", text: "Hide it somewhere", isCorrect: false },
      { id: 'd', emoji: "🎮", text: "Ignore and move on", isCorrect: false }
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
      }
    }, 1000);
  }, []);

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
  }, [gameState, handleTimeUp, currentRound]);

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(ROUND_TIME);
    setScore(0);
    setCurrentRound(1);
    resetFeedback();
  };

  const handleOptionClick = (option) => {
    if (gameState !== "playing" || answered || currentRound > TOTAL_ROUNDS) return;

    // Clear the timer immediately when user answers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setAnswered(true);
    resetFeedback();

    const isCorrect = option.isCorrect;
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    // Show result feedback for a moment, then move to next round or show results
    setTimeout(() => {
      if (currentRound >= TOTAL_ROUNDS) {
        setGameState("finished");
      } else {
        setCurrentRound((prev) => prev + 1);
        setAnswered(false); // Reset answered state for next round
      }
    }, 1000);
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/safe-kid-badge");
  };

  const currentQ = questions[currentRound - 1];

  return (
    <GameShell
      title="Reflex Danger Alert"
      subtitle={gameState === "playing" ? `Round ${currentRound} of ${TOTAL_ROUNDS}` : gameState === "finished" ? "Game Complete!" : "Act fast!"}
      currentLevel={currentRound}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/safe-kid-badge"
      nextGameIdProp="health-male-kids-90"
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      totalLevels={TOTAL_ROUNDS}
      maxScore={TOTAL_ROUNDS}
      showConfetti={gameState === "finished" && score >= 3}
      totalCoins={totalCoins}
      totalXp={totalXp}
      onNext={handleNext}
    >
      <div className="space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/80 mb-6 text-lg">Identify the danger quickly! You have {ROUND_TIME} seconds per round</p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
            <p className="text-white/60 mt-4">You'll have {ROUND_TIME} seconds per round</p>
          </div>
        )}

        {gameState === "playing" && currentQ && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-white">
                <span className="font-bold">Round:</span> {currentRound}/{TOTAL_ROUNDS}
              </div>
              <div className={`font-bold ${timeLeft <= 2 ? 'text-red-500' : timeLeft <= 3 ? 'text-yellow-500' : 'text-green-400'}`}>
                <span className="text-white">Time:</span> {timeLeft}s
              </div>
              <div className="text-white">
                <span className="font-bold">Score:</span> {score}/{TOTAL_ROUNDS}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                {currentQ.instruction}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-4xl mb-3">{option.emoji}</div>
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

export default ReflexDangerAlert;

