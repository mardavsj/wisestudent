import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { Moon, Clock, Bed, Zap } from 'lucide-react';

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const RestAlertReflex = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-69");
  const gameId = gameData?.id || "brain-kids-69";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for RestAlertReflex, using fallback ID");
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
  const currentRoundRef = useRef(0);

  const questions = [
  {
    id: 1,
    text: "A junior weather reporter must stay alert to read the morning forecast clearly. Which evening choice supports this?",
    options: [
      { id: "b", text: "Checking messages again and again", emoji: "💬", isCorrect: false },
      { id: "a", text: "Turning lights low before sleep", emoji: "🌗", isCorrect: true },
      { id: "c", text: "Watching one more episode", emoji: "🎞️", isCorrect: false },
      { id: "d", text: "Snacking while lying in bed", emoji: "🍿", isCorrect: false }
    ]
  },
  {
    id: 2,
    text: "A young traffic police helper needs quick reactions during a school drill. What habit makes mornings smoother?",
    options: [
      { id: "b", text: "Playing calm games before bed", emoji: "🧩", isCorrect: true },
      { id: "a", text: "Sleeping at a changing time daily", emoji: "🔄", isCorrect: false },
      { id: "c", text: "Drinking sweet drinks late", emoji: "🥤", isCorrect: false },
      { id: "d", text: "Keeping room lights bright", emoji: "💡", isCorrect: false }
    ]
  },
  {
    id: 3,
    text: "A space trainee wants their mind sharp for morning practice. What night choice helps alertness?",
    options: [
      { id: "a", text: "Listening to loud music", emoji: "🎧", isCorrect: false },
      { id: "b", text: "Lying awake planning tomorrow", emoji: "📋", isCorrect: false },
      { id: "c", text: "Having a short wind-down routine", emoji: "🌿", isCorrect: true },
      { id: "d", text: "Scrolling videos until sleepy", emoji: "📱", isCorrect: false }
    ]
  },
  {
    id: 4,
    text: "A wildlife guide must stay focused during early forest walks. What supports steady energy?",
    options: [
      { id: "c", text: "Resting at nearly the same time daily", emoji: "⏳", isCorrect: true },
      { id: "a", text: "Eating heavy food very late", emoji: "🍔", isCorrect: false },
      { id: "b", text: "Sleeping with toys scattered around", emoji: "🧸", isCorrect: false },
      { id: "d", text: "Keeping TV noise in background", emoji: "📺", isCorrect: false },
    ]
  },
  {
    id: 5,
    text: "A young classroom helper wants to stay calm and alert all day. What night habit helps most?",
    options: [
      { id: "a", text: "Rushing to bed feeling worried", emoji: "☁️", isCorrect: false },
      { id: "b", text: "Skipping rest to finish tasks", emoji: "📝", isCorrect: false },
      { id: "c", text: "Resting only on weekends", emoji: "📆", isCorrect: false },
      { id: "d", text: "Following the same calming steps nightly", emoji: "🛏️", isCorrect: true }
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
    
    const isCorrect = option.isCorrect;
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
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

  return (
    <GameShell
      title="Reflex Rest Alert"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Test your rest habits reflexes!` : "Test your rest habits reflexes!"}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      showConfetti={gameState === "finished" && finalScore === TOTAL_ROUNDS}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/brain/kids/badge-sleep-champ"
      nextGameIdProp="brain-kids-70"
      gameType="brain"
      maxScore={TOTAL_ROUNDS}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">😴</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Identify good rest habits!<br />
              You have {ROUND_TIME} seconds for each question.
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
                {currentQuestion.text}
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
      </div>
    </GameShell>
  );
};

export default RestAlertReflex;

