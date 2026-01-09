import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ReflexHealthySteps = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-79";
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
      question: "What happens to your teeth if you don't brush them after eating sugary food?",
      options: [
        { id: 'a', text: "They become stronger", emoji: "🦷", isCorrect: false },
        { id: 'b', text: "Cavities can form", emoji: "🕳️", isCorrect: true },
        { id: 'c', text: "They turn invisible", emoji: "👻", isCorrect: false },
        { id: 'd', text: "Nothing happens", emoji: "😐", isCorrect: false }
      ]
    },
    {
      id: 2,
      question: "Why is it important to wash your hands before eating?",
      options: [
        { id: 'b', text: "To remove germs that can make you sick", emoji: "🤧", isCorrect: true },
        { id: 'a', text: "So they smell nice", emoji: "👃", isCorrect: false },
        { id: 'c', text: "To make them soft", emoji: "🤲", isCorrect: false },
        { id: 'd', text: "To make food taste better", emoji: "😋", isCorrect: false }
      ]
    },
    {
      id: 3,
      question: "How many hours of sleep does a child need each night for healthy growth?",
      options: [
        { id: 'a', text: "2-3 hours", emoji: "😴", isCorrect: false },
        { id: 'b', text: "5-6 hours", emoji: "😪", isCorrect: false },
        { id: 'c', text: "10-12 hours", emoji: "🌙", isCorrect: true },
        { id: 'd', text: "15-16 hours", emoji: "😵", isCorrect: false }
      ]
    },
    {
      id: 4,
      question: "Which drink helps keep your body hydrated without added sugar?",
      options: [
        { id: 'a', text: "Soda", emoji: "🥤", isCorrect: false },
        { id: 'b', text: "Fruit juice", emoji: "🧃", isCorrect: false },
        { id: 'd', text: "Energy drinks", emoji: "⚡", isCorrect: false },
        { id: 'c', text: "Water", emoji: "💧", isCorrect: true },
      ]
    },
    {
      id: 5,
      question: "What is the best way to prevent catching germs from others?",
      options: [
        { id: 'a', text: "Shake hands a lot", emoji: "🤝", isCorrect: false },
        { id: 'b', text: "Sneeze without covering your nose", emoji: "🤧", isCorrect: false },
        { id: 'c', text: "Wash hands frequently", emoji: "🤲", isCorrect: true },
        { id: 'd', text: "Stay in crowded places", emoji: "👥", isCorrect: false }
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
        setAnswered(false); // Reset answered state for next round
      }
    }, 500);
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/safety-smart-kid-badge");
  };

  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title="Reflex Healthy Steps"
      subtitle={gameState === "playing" ? `Round ${currentRound} of ${TOTAL_ROUNDS}` : gameState === "finished" ? "Game Complete!" : "Act fast!"}
      currentLevel={currentRound}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/safety-smart-kid-badge"
      nextGameIdProp="health-male-kids-80"
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
            <p className="text-white/80 mb-6 text-lg">Choose the healthy step quickly! You have {ROUND_TIME} seconds per round</p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
            <p className="text-white/60 mt-4">You'll have {ROUND_TIME} seconds per round</p>
          </div>
        )}

        {gameState === "playing" && currentQuestion && (
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
                {currentQuestion.question}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
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

export default ReflexHealthySteps;