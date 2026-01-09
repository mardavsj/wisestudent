import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ReflexPeerCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-63";
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

  const scenarios = [
    {
      id: 1,
      instruction: "Your friends want you to try smoking because they say it makes you look cool. What should you do to stay healthy?",
      options: [
        { id: 'a', text: "Politely decline and suggest a fun activity instead", emoji: "😊", isCorrect: true },
        { id: 'b', text: "Try it once to see what it's like", emoji: "🤔", isCorrect: false },
        { id: 'c', text: "Just watch and not participate", emoji: "👀", isCorrect: false },
        { id: 'd', text: "Laugh and say nothing", emoji: "😂", isCorrect: false }
      ]
    },
    {
      id: 2,
      instruction: "Your friends dare you to climb to a dangerous high place. What is the safest choice?",
      options: [
        { id: 'a', text: "Climb carefully but only if you feel safe", emoji: "🧗", isCorrect: false },
        { id: 'b', text: "Politely refuse and suggest a safer activity", emoji: "🚶", isCorrect: true },
        { id: 'c', text: "Stay and watch your friends climb", emoji: "👀", isCorrect: false },
        { id: 'd', text: "Tell them it's dangerous but stay anyway", emoji: "💬", isCorrect: false }
      ]
    },
    {
      id: 3,
      instruction: "A classmate offers to let you copy their answers during a test. What is the right thing to do?",
      options: [
        { id: 'a', text: "Accept the offer to get a good grade", emoji: "📝", isCorrect: false },
        { id: 'b', text: "Tell the teacher about the offer", emoji: "👩‍🏫", isCorrect: false },
        { id: 'd', text: "Just stay quiet and ignore", emoji: "🤐", isCorrect: false },
        { id: 'c', text: "Politely decline and do your best on your own", emoji: "💪", isCorrect: true },
      ]
    },
    {
      id: 4,
      instruction: "A friend suggests you take candy from a store without paying. What should you do?",
      options: [
        { id: 'a', text: "Take it because you think no one will notice", emoji: "🍬", isCorrect: false },
        { id: 'b', text: "Buy the candy with your own money instead", emoji: "💰", isCorrect: false },
        { id: 'c', text: "Politely say no and explain why stealing is wrong", emoji: "🚫", isCorrect: true },
        { id: 'd', text: "Ask the store owner if you can have some", emoji: "🙋", isCorrect: false }
      ]
    },
    {
      id: 5,
      instruction: "Friends dare you to cross a busy street without looking. What is the safest action?",
      options: [
        { id: 'a', text: "Run across quickly to get it over with", emoji: "🏃", isCorrect: false },
        { id: 'b', text: "Wait for the traffic light and use the crosswalk", emoji: "🚦", isCorrect: true },
        { id: 'c', text: "Follow your friends even though you're scared", emoji: "👥", isCorrect: false },
        { id: 'd', text: "Close your eyes and cross", emoji: "🙈", isCorrect: false }
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
    navigate("/games/health-male/kids");
  };

  const currentScenario = scenarios[currentRound - 1];

  return (
    <GameShell
      title="Reflex Peer Check"
      subtitle={gameState === "playing" ? `Round ${currentRound} of ${TOTAL_ROUNDS}` : gameState === "finished" ? "Game Complete!" : "Act fast!"}
      currentLevel={currentRound}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/peer-scenarios-puzzle"
      nextGameIdProp="health-male-kids-64"
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
            <p className="text-white/80 mb-6 text-lg">Choose the safe option quickly! You have {ROUND_TIME} seconds per round</p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
            <p className="text-white/60 mt-4">You'll have {ROUND_TIME} seconds per round</p>
          </div>
        )}

        {gameState === "playing" && currentScenario && (
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
                {currentScenario.instruction}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentScenario.options.map((option, index) => (
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

export default ReflexPeerCheck;