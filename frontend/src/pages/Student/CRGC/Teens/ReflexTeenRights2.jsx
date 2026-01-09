import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexTeenRights2 = () => {
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
      question: "What should you do if you witness discrimination against a classmate based on their appearance?",
      emoji: "🌍",
      correctAnswer: "Intervene respectfully and report the incident to appropriate authorities",
      options: [
        { text: "Join in the discrimination to avoid becoming a target yourself", isCorrect: false },
        { text: "Ignore the situation since it doesn't directly affect you", isCorrect: false },
        { text: "Intervene respectfully and report the incident to appropriate authorities", isCorrect: true },
        { text: "Film the incident to share on social media for views", isCorrect: false }
      ],
      feedback: {
        correct: "Great job! Intervening respectfully and reporting discrimination helps create a safer environment for everyone!",
        incorrect: "Joining in or ignoring discrimination perpetuates harm. Intervene respectfully and report the incident to appropriate authorities!"
      }
    },
    {
      id: 2,
      question: "How should you respond when you learn about unfair labor practices affecting young workers in your community?",
      emoji: "✋",
      correctAnswer: "Research the issue and support organizations working to protect worker rights",
      options: [
        { text: "Accept it as normal since it's common in many industries", isCorrect: false },
        { text: "Complain to friends but take no meaningful action", isCorrect: false },
        { text: "Avoid products from those companies but tell no one", isCorrect: false },
        { text: "Research the issue and support organizations working to protect worker rights", isCorrect: true },
      ],
      feedback: {
        correct: "Excellent! Researching issues and supporting protective organizations contributes to systemic change for worker rights!",
        incorrect: "Accepting or staying silent about unfair practices doesn't help. Research the issue and support organizations working to protect worker rights!"
      }
    },
    {
      id: 3,
      question: "What's the best approach when you notice someone being denied services because of their accent or language?",
      emoji: "🗣️",
      correctAnswer: "Stand up for the person and advocate for respectful treatment",
      options: [
        { text: "Stay quiet to avoid confrontation", isCorrect: false },
        { text: "Stand up for the person and advocate for respectful treatment", isCorrect: true },
        { text: "Mock the person's accent along with others", isCorrect: false },
        { text: "Record the incident for personal entertainment", isCorrect: false }
      ],
      feedback: {
        correct: "Perfect! Standing up for others and advocating for respectful treatment reinforces the principle that everyone deserves dignity!",
        incorrect: "Staying quiet or mocking others violates human dignity. Stand up for the person and advocate for respectful treatment!"
      }
    },
    {
      id: 4,
      question: "How should you react when you discover that some students in your school don't have access to the same educational resources?",
      emoji: "🤲",
      correctAnswer: "Work with student government or administration to advocate for equal access",
      options: [
        { text: "Ignore the disparity since it's not your responsibility", isCorrect: false },
        { text: "Boast about your own advantages to make others feel worse", isCorrect: false },
        { text: "Work with student government or administration to advocate for equal access", isCorrect: true },
        { text: "Take advantage of the situation to get ahead", isCorrect: false }
      ],
      feedback: {
        correct: "Well done! Working with others to advocate for equal access helps ensure all students have opportunities to succeed!",
        incorrect: "Ignoring disparities or exploiting them is unjust. Work with student government or administration to advocate for equal access!"
      }
    },
    {
      id: 5,
      question: "What should you do if you observe someone being treated differently in housing based on their background?",
      emoji: "⚖️",
      correctAnswer: "Learn about fair housing laws and report violations to proper authorities",
      options: [
        { text: "Consider it normal since housing markets vary by location", isCorrect: false },
        { text: "Gossip about the situation without taking action", isCorrect: false },
        { text: "Learn about fair housing laws and report violations to proper authorities", isCorrect: true },
        { text: "Avoid renting in that neighborhood yourself", isCorrect: false }
      ],
      feedback: {
        correct: "Awesome! Learning about fair housing laws and reporting violations helps protect everyone's right to equal treatment!",
        incorrect: "Accepting or gossiping about housing discrimination doesn't solve problems. Learn about fair housing laws and report violations to proper authorities!"
      }
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

  const handleNext = () => {
    navigate("/games/civic-responsibility/teens");
  };

  const finalScore = score;
  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title="Reflex Teen Rights"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Quick rights choices!` : "Quick rights choices!"}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={finalScore}
      gameId="civic-responsibility-teens-69"
      gameType="civic-responsibility"
      totalLevels={TOTAL_ROUNDS}
      currentLevel={currentRound}
      showConfetti={gameState === "finished" && finalScore === TOTAL_ROUNDS}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={TOTAL_ROUNDS} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/civic-responsibility/teens/badge-justice-teen"
      nextGameIdProp="civic-responsibility-teens-70">
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🌍✋🗣️🤲⚖️</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Quick rights choices!<br />
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
                {currentQuestion.question}
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
                {finalScore >= 4 ? "Excellent job! You're a rights champion!" : 
                 finalScore >= 3 ? "Good work! Keep developing your awareness of rights issues!" : 
                 "Continue learning about human rights and you'll improve!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexTeenRights2;