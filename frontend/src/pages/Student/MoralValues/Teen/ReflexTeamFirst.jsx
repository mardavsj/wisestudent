import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexTeamFirst = () => {
  const location = useLocation();
  
  const gameId = "moral-teen-79";
  const gameData = getGameDataById(gameId);
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  const [gameState, setGameState] = useState("ready");
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);
  const currentRoundRef = useRef(0);

  const questions = [
    {
      id: 1,
      question: "You're leading a project and have a great idea, but a team member suggests an alternative that could work better. What do you do?",
      correctAnswer: "Consider the team member's idea",
      options: [
        { text: "Stick with your own idea", isCorrect: false, emoji: "🚫" },
        { text: "Consider the team member's idea", isCorrect: true, emoji: "🤝" },
        { text: "Ask for input from others", isCorrect: false, emoji: "💬" },
        { text: "Defer to the most experienced member", isCorrect: false, emoji: "👨‍💼" }
      ]
    },
    {
      id: 2,
      question: "The team is struggling to meet a deadline and everyone is stressed. What's your approach?",
      correctAnswer: "Offer help where needed",
      options: [
        { text: "Offer help where needed", isCorrect: true, emoji: "🤝" },
        { text: "Focus on your assigned tasks only", isCorrect: false, emoji: "✅" },
        { text: "Complain about the workload", isCorrect: false, emoji: "😤" },
        { text: "Ask for deadline extension", isCorrect: false, emoji: "⏰" }
      ]
    },
    {
      id: 3,
      question: "A teammate is falling behind on their part of the project. How do you respond?",
      correctAnswer: "Offer support and resources",
      options: [
        { text: "Report to the supervisor", isCorrect: false, emoji: "📋" },
        { text: "Take over their tasks", isCorrect: false, emoji: "🏃‍♂️" },
        { text: "Focus on your own work", isCorrect: false, emoji: "🔍" },
        { text: "Offer support and resources", isCorrect: true, emoji: "🤝" },
      ]
    },
    {
      id: 4,
      question: "There's an opportunity for individual recognition that would benefit you but might disadvantage the team. What do you do?",
      correctAnswer: "Consider the team impact",
      options: [
        { text: "Take the opportunity immediately", isCorrect: false, emoji: "🏃‍♂️" },
        { text: "Ask team for advice", isCorrect: false, emoji: "❓" },
        { text: "Consider the team impact", isCorrect: true, emoji: "🤝" },
        { text: "Decline the opportunity", isCorrect: false, emoji: "❌" }
      ]
    },
    {
      id: 5,
      question: "Your personal goals conflict with the team's objectives. How do you handle this?",
      correctAnswer: "Seek a compromise that benefits both",
      options: [
        { text: "Seek a compromise that benefits both", isCorrect: true, emoji: "🤝" },
        { text: "Prioritize your personal goals", isCorrect: false, emoji: "🎯" },
        { text: "Abandon your personal goals", isCorrect: false, emoji: "❌" },
        { text: "Try to change team objectives", isCorrect: false, emoji: "🔄" }
      ]
    }
  ];

  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  useEffect(() => {
    if (gameState === "playing" && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
    }
  }, [currentRound, gameState]);

  const handleTimeUp = useCallback(() => {
    if (currentRoundRef.current < TOTAL_ROUNDS) {
      setCurrentRound(prev => prev + 1);
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
    } else {
      setGameState("finished");
    }
  }, []);

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
  const currentQuestion = currentRound > 0 ? questions[currentRound - 1] : null;

  return (
    <GameShell
      title="Reflex: Team First Decisions"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Team-first or self-first decisions?` : "Team-first or self-first decisions?"}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      showConfetti={gameState === "finished" && finalScore === TOTAL_ROUNDS}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/moral-values/teen/badge-service-leader"
      nextGameIdProp="moral-teen-80"
      gameType="moral"
      maxScore={TOTAL_ROUNDS}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🤝</div>
            <h3 className="text-2xl font-bold text-white mb-4">Team-First Challenge!</h3>
            <p className="text-white/90 text-lg mb-6">
              Choose the most team-oriented response for each scenario!<br />
              You have {ROUND_TIME} seconds for each question.
            </p>
            <p className="text-white/80 mb-6">
              You have {TOTAL_ROUNDS} challenging questions with {ROUND_TIME} seconds each!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-4 px-8 rounded-full text-xl font-bold shadow-lg transition-all transform hover:scale-105"
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
                "{currentQuestion.question}"
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
            <div className="text-6xl mb-6">🏆</div>
            <h3 className="text-2xl font-bold text-white mb-4">Team-First Challenge Complete!</h3>
            <p className="text-xl text-white/90 mb-2">Your Score: {score} out of {TOTAL_ROUNDS}</p>
            <p className="text-lg text-white/80 mb-6">
              {score === TOTAL_ROUNDS ? "Perfect! You truly understand team-first values!" : 
               score >= TOTAL_ROUNDS/2 ? "Good job! You value team collaboration!" : 
               "Keep practicing team-first decision making!"}
            </p>
            
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-6 rounded-full font-bold transition-all"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexTeamFirst;

