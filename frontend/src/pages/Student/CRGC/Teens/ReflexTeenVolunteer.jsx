import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexTeenVolunteer = () => {
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
      question: "What's the best way to contribute to environmental conservation in your community?",
      emoji: "🌳",
      correctAnswer: "Organize or participate in local clean-up events and tree planting initiatives",
      options: [
        { text: "Complain about environmental issues on social media without taking action", isCorrect: false },
        { text: "Ignore environmental problems since they seem too big to solve", isCorrect: false },
        { text: "Organize or participate in local clean-up events and tree planting initiatives", isCorrect: true },
        { text: "Litter in hidden places to keep your own spaces clean", isCorrect: false }
      ],
      feedback: {
        correct: "Great job! Organizing or participating in local environmental initiatives creates tangible positive change!",
        incorrect: "Complaining without action or ignoring problems doesn't help. Organize or participate in local clean-up events and tree planting initiatives!"
      }
    },
    {
      id: 2,
      question: "How should you respond when you notice elderly neighbors struggling with groceries?",
      emoji: "🧓",
      correctAnswer: "Offer to help carry their groceries or assist with errands",
      options: [
        { text: "Mind your own business and continue walking past them", isCorrect: false },
        { text: "Offer to help carry their groceries or assist with errands", isCorrect: true },
        { text: "Post about them on social media to gain sympathy", isCorrect: false },
        { text: "Tell others about their struggles for entertainment", isCorrect: false }
      ],
      feedback: {
        correct: "Excellent! Offering direct assistance to those in need shows genuine compassion and community spirit!",
        incorrect: "Ignoring or gossiping about neighbors in need isn't helpful. Offer to help carry their groceries or assist with errands!"
      }
    },
    {
      id: 3,
      question: "What's the most effective approach to supporting a local food bank?",
      emoji: "🥡",
      correctAnswer: "Donate non-perishable items and volunteer your time regularly",
      options: [
        { text: "Donate non-perishable items and volunteer your time regularly", isCorrect: true },
        { text: "Drop off expired items to get rid of them", isCorrect: false },
        { text: "Only donate when there's a school requirement", isCorrect: false },
        { text: "Take photos of donations for social media without actual contribution", isCorrect: false }
      ],
      feedback: {
        correct: "Perfect! Regular donations and volunteering provide sustainable support for those facing food insecurity!",
        incorrect: "Donating expired items or only contributing for requirements isn't truly helpful. Donate non-perishable items and volunteer your time regularly!"
      }
    },
    {
      id: 4,
      question: "How can you best support younger students who are struggling academically?",
      emoji: "📖",
      correctAnswer: "Offer tutoring sessions and share effective study strategies",
      options: [
        { text: "Boast about your academic achievements to make them feel worse", isCorrect: false },
        { text: "Ignore their struggles to avoid extra responsibility", isCorrect: false },
        { text: "Offer tutoring sessions and share effective study strategies", isCorrect: true },
        { text: "Spread rumors about their academic difficulties", isCorrect: false }
      ],
      feedback: {
        correct: "Well done! Offering tutoring and sharing study strategies empowers younger students to improve academically!",
        incorrect: "Boasting or spreading rumors about struggling students is harmful. Offer tutoring sessions and share effective study strategies!"
      }
    },
    {
      id: 5,
      question: "What's the most impactful way to contribute to disaster relief efforts?",
      emoji: "⛑️",
      correctAnswer: "Donate to verified organizations and volunteer with legitimate relief efforts",
      options: [
        { text: "Create fake donation pages to collect money for yourself", isCorrect: false },
        { text: "Only share disaster news on social media without contributing", isCorrect: false },
        { text: "Hoard supplies that might be needed by others", isCorrect: false },
        { text: "Donate to verified organizations and volunteer with legitimate relief efforts", isCorrect: true },
      ],
      feedback: {
        correct: "Awesome! Donating to verified organizations and volunteering ensures your contribution actually helps those affected!",
        incorrect: "Creating fake donation pages or hoarding supplies is harmful. Donate to verified organizations and volunteer with legitimate relief efforts!"
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
      title="Reflex Teen Volunteer"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Quick volunteering choices!` : "Quick volunteering choices!"}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={finalScore}
      gameId="civic-responsibility-teens-53"
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
      nextGamePathProp="/student/civic-responsibility/teens/puzzle-volunteer-areas"
      nextGameIdProp="civic-responsibility-teens-54">
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🌳🧓🥡📖⛑️</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Quick volunteering choices!<br />
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
                {finalScore >= 4 ? "Excellent job! You're a volunteering champion!" : 
                 finalScore >= 3 ? "Good work! Keep practicing civic responsibility!" : 
                 "Keep developing your sense of community service and you'll improve!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexTeenVolunteer;