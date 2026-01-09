import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexTeenFutureCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
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
      action: "Cybersecurity Jobs",
      emoji: "🛡️",
      correctAnswer: "Real future career",
      options: [
        { text: "Ghost Hunters", isCorrect: false },
        { text: "Real future career", isCorrect: true },
        { text: "Dinosaur Hunters", isCorrect: false },
        { text: "Alien Communicators", isCorrect: false }
      ]
    },
    {
      id: 2,
      action: "AI Development",
      emoji: "🤖",
      correctAnswer: "Real future career",
      options: [
        { text: "Dinosaur Hunters", isCorrect: false },
        { text: "Time Travel Guides", isCorrect: false },
        { text: "Real future career", isCorrect: true },
        { text: "Ghost Hunters", isCorrect: false }
      ]
    },
    {
      id: 3,
      action: "Green Energy",
      emoji: "☀️",
      correctAnswer: "Real future career",
      options: [
        { text: "Real future career", isCorrect: true },
        { text: "Time Travel Guides", isCorrect: false },
        { text: "Ghost Hunters", isCorrect: false },
        { text: "Alien Communicators", isCorrect: false }
      ]
    },
    {
      id: 4,
      action: "Data Science",
      emoji: "📊",
      correctAnswer: "Real future career",
      options: [
        { text: "Alien Communicators", isCorrect: false },
        { text: "Real future career", isCorrect: true },
        { text: "Dinosaur Hunters", isCorrect: false },
        { text: "Time Travel Guides", isCorrect: false }
      ]
    },
    {
      id: 5,
      action: "Biotechnology",
      emoji: "🧬",
      correctAnswer: "Real future career",
      options: [
        { text: "Real future career", isCorrect: true },
        { text: "Ghost Hunters", isCorrect: false },
        { text: "Dinosaur Hunters", isCorrect: false },
        { text: "Time Travel Guides", isCorrect: false }
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

  // Start the game
  const startGame = () => {
    setGameState("playing");
    setCurrentRound(1);
    setTimeLeft(ROUND_TIME);
  };

  // Handle answer selection
  const handleAnswer = (option) => {
    if (answered) return;
    
    setAnswered(true);
    const isCorrect = option.isCorrect;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    // Move to next round after delay
    setTimeout(() => {
      resetFeedback();
      if (currentRound < TOTAL_ROUNDS) {
        setCurrentRound(prev => prev + 1);
      } else {
        setGameState("finished");
      }
    }, 1000);
  };

  // Handle time running out
  const handleTimeUp = useCallback(() => {
    if (!answered) {
      setAnswered(true);
      showCorrectAnswerFeedback(0, false);
      
      // Move to next round after delay
      setTimeout(() => {
        resetFeedback();
        if (currentRound < TOTAL_ROUNDS) {
          setCurrentRound(prev => prev + 1);
        } else {
          setGameState("finished");
        }
      }, 1000);
    }
  }, [answered, currentRound, showCorrectAnswerFeedback, resetFeedback]);

  const handleNext = () => {
    navigate("/student/ehe/teens/puzzle-match-careers");
  };

  // Timer effect
  useEffect(() => {
    if (gameState === "playing" && !answered && currentRound > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, answered, currentRound, handleTimeUp]);

  const finalScore = score;
  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title="Reflex Teen Future Check"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Future career decisions!` : "Future career decisions!"}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={finalScore}
      gameId="ehe-teen-73"
      gameType="ehe"
      totalLevels={TOTAL_ROUNDS}
      currentLevel={currentRound}
      showConfetti={gameState === "finished" && finalScore === TOTAL_ROUNDS}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={TOTAL_ROUNDS} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/ehe/teens/puzzle-match-careers"
      nextGameIdProp="ehe-teen-74">
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🛡️🤖☀️📊🧬</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Future career decisions!<br />
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
                Is "{currentQuestion.action}" a real future career?
              </h3>
              
              <div className="bg-gray-800/50 rounded-xl p-12 mb-6 flex justify-center items-center">
                <div className="text-9xl animate-pulse">{currentQuestion.emoji}</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className="w-full min-h-[80px] bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-6 py-4 rounded-xl text-white font-bold text-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {gameState === "finished" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Game Over!</h2>
            <p className="text-xl text-white/80 mb-2">Your final score: <span className="text-yellow-400 font-bold">{finalScore}</span>/{TOTAL_ROUNDS}</p>
            <p className="text-white/80 mb-6">You earned {finalScore} coins!</p>
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">How did you do?</h3>
              <p className="text-white/80">
                {finalScore >= 4 ? "Excellent job! You have great insight into future careers!" : 
                 finalScore >= 3 ? "Good work! Keep developing your knowledge of future careers!" : 
                 "Keep learning about emerging career fields to improve!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexTeenFutureCheck;