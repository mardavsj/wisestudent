import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexCultureBasics = () => {
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
      question: "What should you do when invited to a cultural celebration from a different background?",
      emoji: "🎉",
      correctAnswer: "Participate respectfully and learn about the traditions",
      options: [
        { text: "Decline because it seems strange", isCorrect: false },
        { text: "Mock the traditions when you get home", isCorrect: false },
        { text: "Participate respectfully and learn about the traditions", isCorrect: true },
        { text: "Attend just to get free food", isCorrect: false }
      ],
      feedback: {
        correct: "Great job! Participating respectfully helps build bridges between communities!",
        incorrect: "Remember, declining or mocking cultural celebrations shows disrespect. Participate respectfully and learn about the traditions!"
      }
    },
    {
      id: 2,
      question: "How should you respond when someone speaks a language you don't understand?",
      emoji: "🗣️",
      correctAnswer: "Listen politely and use translation tools if needed",
      options: [
        { text: "Make fun of their accent", isCorrect: false },
        { text: "Listen politely and use translation tools if needed", isCorrect: true },
        { text: "Ignore them completely", isCorrect: false },
        { text: "Speak louder as if they're deaf", isCorrect: false }
      ],
      feedback: {
        correct: "Excellent! Listening politely shows respect and helps you learn about other cultures!",
        incorrect: "Making fun or ignoring someone who speaks differently is disrespectful. Listen politely and use translation tools if needed!"
      }
    },
    {
      id: 3,
      question: "What's the best way to learn about different cultural practices?",
      emoji: "📚",
      correctAnswer: "Ask respectful questions and research authentic sources",
      options: [
        { text: "Rely only on stereotypes from movies", isCorrect: false },
        { text: "Ask respectful questions and research authentic sources", isCorrect: true },
        { text: "Make assumptions based on appearances", isCorrect: false },
        { text: "Copy practices without understanding meaning", isCorrect: false }
      ],
      feedback: {
        correct: "Perfect! Asking respectful questions and researching authentic sources gives you accurate cultural understanding!",
        incorrect: "Relying on stereotypes or making assumptions leads to misunderstandings. Ask respectful questions and research authentic sources!"
      }
    },
    {
      id: 4,
      question: "How should you handle cultural differences in food preferences?",
      emoji: "🍛",
      correctAnswer: "Be open to trying new foods while respecting others' dietary needs",
      options: [
        { text: "Insist everyone eat what you prefer", isCorrect: false },
        { text: "Refuse to try anything different", isCorrect: false },
        { text: "Make negative comments about unfamiliar dishes", isCorrect: false },
        { text: "Be open to trying new foods while respecting others' dietary needs", isCorrect: true },
      ],
      feedback: {
        correct: "Well done! Being open to new foods while respecting others' needs shows cultural sensitivity!",
        incorrect: "Insisting on your preferences or refusing to try different foods shows closed-mindedness. Be open to trying new foods while respecting others' dietary needs!"
      }
    },
    {
      id: 5,
      question: "What should you do if you accidentally offend someone from another culture?",
      emoji: "😔",
      correctAnswer: "Apologize sincerely and learn from the mistake",
      options: [
        { text: "Deny you did anything wrong", isCorrect: false },
        { text: "Apologize sincerely and learn from the mistake", isCorrect: true },
        { text: "Blame them for being too sensitive", isCorrect: false },
        { text: "Avoid them completely from then on", isCorrect: false }
      ],
      feedback: {
        correct: "Awesome! Apologizing sincerely and learning from mistakes helps build better cross-cultural relationships!",
        incorrect: "Denying wrongdoing or blaming others prevents growth. Apologize sincerely and learn from the mistake!"
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
    navigate("/games/civic-responsibility/kids");
  };

  const finalScore = score;
  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title="Reflex Culture Basics"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Quick cultural choices!` : "Quick cultural choices!"}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={finalScore}
      gameId="civic-responsibility-kids-83"
      gameType="civic-responsibility"
      totalLevels={TOTAL_ROUNDS}
      currentLevel={currentRound}
      showConfetti={gameState === "finished" && finalScore === TOTAL_ROUNDS}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={TOTAL_ROUNDS} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/civic-responsibility/kids/puzzle-match-countries"
      nextGameIdProp="civic-responsibility-kids-84">
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🎉🗣️📚🍛😔</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Quick cultural choices!<br />
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
                {finalScore >= 4 ? "Excellent job! You're a cultural awareness champion!" : 
                 finalScore >= 3 ? "Good work! Keep embracing cultural diversity!" : 
                 "Keep learning about cultural respect and you'll improve!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexCultureBasics;