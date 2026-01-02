import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LifelongHealthyGirlBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "health-female-teen-100";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      title: "Sustainable Health",
      question: "What is the most sustainable approach to maintaining a healthy lifestyle?",
      options: [
        { 
          text: "Extreme dieting for quick results", 
          emoji: "🚨", 
          isCorrect: false
        },
        { 
          text: "Gradual changes that can be maintained long-term", 
          emoji: "🌱", 
          isCorrect: true
        },
        { 
          text: "Skipping meals to lose weight", 
          emoji: "🍽️", 
          isCorrect: false
        },
        { 
          text: "Exercising excessively every day", 
          emoji: "🔥", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Small, gradual changes are much more sustainable than extreme approaches!",
        wrong: "Sustainable health comes from making small, consistent changes over time rather than drastic measures."
      }
    },
    {
      id: 2,
      title: "Well-being Habits",
      question: "Which habit is most important for mental and physical well-being?",
      options: [
        { 
          text: "Getting adequate sleep regularly", 
          emoji: "😴", 
          isCorrect: true
        },
        { 
          text: "Staying up late to finish tasks", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "Drinking energy drinks for alertness", 
          emoji: "☕", 
          isCorrect: false
        },
        { 
          text: "Multitasking during meals", 
          emoji: "📋", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Right! Quality sleep is foundational for both mental clarity and physical health!",
        wrong: "Regular, adequate sleep is one of the most important factors for overall well-being."
      }
    },
    {
      id: 3,
      title: "Hydration",
      question: "What is the best way to stay hydrated throughout the day?",
      options: [
        { 
          text: "Drink water consistently throughout the day", 
          emoji: "🚰", 
          isCorrect: true
        },
        { 
          text: "Only drink when feeling thirsty", 
          emoji: "👅", 
          isCorrect: false
        },
        { 
          text: "Replace water with sugary drinks", 
          emoji: "🥤", 
          isCorrect: false
        },
        { 
          text: "Drink large amounts only in the morning", 
          emoji: "⏰", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Consistent hydration throughout the day supports all bodily functions!",
        wrong: "The best hydration strategy is to drink water regularly throughout the day rather than in large quantities at once."
      }
    },
    {
      id: 4,
      title: "Stress Management",
      question: "How can stress be managed in a healthy way?",
      options: [
        
        { 
          text: "By avoiding all responsibilities", 
          emoji: "🌱", 
          isCorrect: false
        },
        { 
          text: "Eating comfort foods regularly", 
          emoji: "🍔", 
          isCorrect: false
        },
        { 
          text: "By using social media", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          text: "Through regular exercise and mindfulness", 
          emoji: "🧘", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Exactly! Relaxation techniques like deep breathing help manage stress effectively!",
        wrong: "Healthy stress management includes techniques like meditation, deep breathing, or progressive muscle relaxation."
      }
    },
    {
      id: 5,
      title: "Habit Formation",
      question: "What is the most effective approach to building lasting healthy habits?",
      options: [
        { 
          text: "Focus on one habit at a time", 
          emoji: "🎯", 
          isCorrect: false
        },
        { 
          text: "Try to change everything at once", 
          emoji: "🔄", 
          isCorrect: false
        },
        { 
          text: "Rely on motivation alone", 
          emoji: "💭", 
          isCorrect: false
        },
        { 
          text: "Create systems that support habits", 
          emoji: "⚙️", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Great choice! Systems and environments that support habits are more effective than relying on willpower alone!",
        wrong: "Lasting habits are built through creating supportive systems rather than depending solely on motivation."
      }
    }
  ];

  const handleAnswer = (isCorrect, optionIndex) => {
    if (answered) return;
    
    setAnswered(true);
    setSelectedAnswer(optionIndex);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastChallenge = challenge === challenges.length - 1;
    
    setTimeout(() => {
      if (isLastChallenge) {
        setShowResult(true);
      } else {
        setChallenge(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 2000);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setChallenge(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    resetFeedback();
  };

  const handleNext = () => {
    window.location.href = "/games/health-female/teens";
  };

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: Lifelong Healthy Girl"
      subtitle={showResult ? "Game Complete!" : `Question ${challenge + 1} of ${challenges.length}`}
      onNext={handleNext}
      nextEnabled={true}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      gameType="health-female"
      totalLevels={challenges.length}
      currentLevel={challenge + 1}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={challenges.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult && currentChallenge ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-2">{currentChallenge.title}</h3>
              <p className="text-white text-lg mb-6">
                {currentChallenge.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentChallenge.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option.isCorrect, idx)}
                    disabled={answered}
                    className={`bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3 ${
                      answered && selectedAnswer === idx
                        ? option.isCorrect
                          ? "ring-4 ring-green-400"
                          : "ring-4 ring-red-400"
                        : ""
                    }`}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="font-bold text-lg">{option.text}</span>
                  </button>
                ))}
              </div>
              
              {answered && (
                <div className={`mt-4 p-4 rounded-xl ${
                  currentChallenge.options[selectedAnswer]?.isCorrect
                    ? "bg-green-500/20 border border-green-500/30"
                    : "bg-red-500/20 border border-red-500/30"
                }`}>
                  <p className="text-white font-semibold">
                    {currentChallenge.options[selectedAnswer]?.isCorrect
                      ? currentChallenge.feedback.correct
                      : currentChallenge.feedback.wrong}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 4 ? (
              <div>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-4">Lifelong Healthy Girl Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge of healthy living with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-green-400 to-teal-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Lifelong Healthy Girl</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Healthy Habits</h4>
                    <p className="text-white/90 text-sm">
                      You understand the foundations of sustainable wellness practices.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Lifestyle Mastery</h4>
                    <p className="text-white/90 text-sm">
                      You know how to create systems that support long-term health.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Building Healthy Habits!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review healthy lifestyle concepts to strengthen your knowledge and earn your badge.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default LifelongHealthyGirlBadge;