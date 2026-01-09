import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeMoneyWiseTeen = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-teen-30";
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
      title: "Profit Calculation",
      question: "A lemonade stand sells 20 cups at $2 each with $15 expenses. What is the profit?",
      options: [
        { 
          text: "$15", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          text: "$20", 
          emoji: "💵", 
          isCorrect: false
        },
        { 
          text: "$25", 
          emoji: "💸", 
          isCorrect: true
        },
        { 
          text: "$40", 
          emoji: "💳", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Profit = Revenue ($40) - Expenses ($15) = $25!",
        wrong: "Profit equals total revenue minus expenses. Calculate: (20 × $2) - $15 = $25."
      }
    },
    {
      id: 2,
      title: "Financial Terms",
      question: "Which term describes money received from selling products or services?",
      options: [
        { 
          text: "Expenses", 
          emoji: "📉", 
          isCorrect: false
        },
        
        { 
          text: "Liabilities", 
          emoji: "📝", 
          isCorrect: false
        },
        { 
          text: "Revenue", 
          emoji: "📈", 
          isCorrect: true
        },
        { 
          text: "Assets", 
          emoji: "🏠", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Revenue is the money received from selling products or services!",
        wrong: "Revenue is the term for money received from selling products or services."
      }
    },
    {
      id: 3,
      title: "Smart Choices",
      question: "Which is the smartest financial decision for a teenager?",
      options: [
        { 
          text: "Saving a portion of allowance regularly", 
          emoji: "🐷", 
          isCorrect: true
        },
        { 
          text: "Buying luxury items with borrowed money", 
          emoji: "🛍️", 
          isCorrect: false
        },
        
        { 
          text: "Spending all money immediately", 
          emoji: "💸", 
          isCorrect: false
        },
        { 
          text: "Ignoring all financial responsibilities", 
          emoji: "🙈", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Saving a portion of allowance regularly builds good financial habits!",
        wrong: "The smartest financial decision is saving a portion of allowance regularly to build good habits."
      }
    },
    {
      id: 4,
      title: "Business Terms",
      question: "What does 'budget' mean in financial planning?",
      options: [
        { 
          text: "Spending money without tracking", 
          emoji: "🛒", 
          isCorrect: false
        },
       
        { 
          text: "Earning money from investments only", 
          emoji: "🏦", 
          isCorrect: false
        },
        { 
          text: "Borrowing money for purchases", 
          emoji: "💳", 
          isCorrect: false
        },
         { 
          text: "A plan for how to spend and save money", 
          emoji: "📋", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Perfect! A budget is a plan for how to spend and save money!",
        wrong: "A budget is a plan for how to spend and save money effectively."
      }
    },
    {
      id: 5,
      title: "Budget Planning",
      question: "What is the primary purpose of creating a budget?",
      options: [
        { 
          text: "To restrict all spending completely", 
          emoji: "🔒", 
          isCorrect: false
        },
        { 
          text: "To track income and expenses for financial control", 
          emoji: "📊", 
          isCorrect: true
        },
        { 
          text: "To increase debt for lifestyle upgrades", 
          emoji: "🧬", 
          isCorrect: false
        },
        { 
          text: "To eliminate all entertainment expenses", 
          emoji: "🎭", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Budgets track income and expenses for financial control!",
        wrong: "The primary purpose of a budget is to track income and expenses for financial control."
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

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: Money Wise Teen"
      subtitle={showResult ? "Game Complete!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      gameType="ehe"
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ehe/teens"
    
      nextGamePathProp="/student/ehe/teens/empathy-story"
      nextGameIdProp="ehe-teen-31">
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
                <h3 className="text-3xl font-bold text-white mb-4">Money Wise Teen Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong financial literacy with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Money Wise Teen</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Financial Skills</h4>
                    <p className="text-white/90 text-sm">
                      You understand profit calculation, budgeting, and smart financial decision-making.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Business Knowledge</h4>
                    <p className="text-white/90 text-sm">
                      You know key financial terms and their practical applications.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    window.location.href = "/games/ehe/teens";
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Building Financial Wisdom!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review financial concepts to strengthen your knowledge and earn your badge.
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

export default BadgeMoneyWiseTeen;