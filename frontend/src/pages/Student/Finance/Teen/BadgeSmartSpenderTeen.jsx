import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeSmartSpenderTeen = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-20";
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
      title: "Expensive Purchase Decision",
      question: "What's the best approach when you want to buy an expensive item?",
      options: [
        { 
          text: "Buy it immediately if you have enough money", 
          emoji: "⚡", 
          isCorrect: false
        },
        { 
          text: "Wait and save money over time while considering if you really need it", 
          emoji: "💰", 
          isCorrect: true
        },
        { 
          text: "Ask friends to lend you money", 
          emoji: "👥", 
          isCorrect: false
        },
        { 
          text: "Buy it on credit even if you can't afford it", 
          emoji: "💳", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Excellent! Waiting and saving helps you make thoughtful decisions and avoid impulse purchases.",
        wrong: "Remember: Take time to evaluate if you really need expensive items before buying."
      }
    },
    {
      id: 2,
      title: "Needs vs Wants",
      question: "Which of these is a 'need' rather than a 'want'?",
      options: [
        { 
          text: "Groceries for your family", 
          emoji: "🛒", 
          isCorrect: true
        },
        { 
          text: "Latest smartphone", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          text: "Designer clothes", 
          emoji: "👔", 
          isCorrect: false
        },
        { 
          text: "Video game console", 
          emoji: "🎮", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Groceries are essential for survival, making them a need rather than a want.",
        wrong: "Think about what's essential for survival - groceries are a basic need."
      }
    },
    {
      id: 3,
      title: "Unexpected Money",
      question: "What should you do with unexpected money like a gift or bonus?",
      options: [
        { 
          text: "Spend it all on something fun immediately", 
          emoji: "🎉", 
          isCorrect: false
        },
        { 
          text: "Ignore it and pretend you never received it", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Save at least half and spend the rest thoughtfully", 
          emoji: "💰", 
          isCorrect: true
        },
        { 
          text: "Use it to pay off all your friends' debts", 
          emoji: "💸", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great balance! Balancing saving and spending helps build healthy financial habits.",
        wrong: "A good rule: Save most of unexpected money, but allow some for thoughtful spending."
      }
    },
    {
      id: 4,
      title: "Price Comparison",
      question: "What's the benefit of comparing prices before making a purchase?",
      options: [
        { 
          text: "It helps you find the best value and save money", 
          emoji: "💡", 
          isCorrect: true
        },
        { 
          text: "It wastes time and prevents spontaneous decisions", 
          emoji: "⏰", 
          isCorrect: false
        },
        { 
          text: "It makes shopping more complicated", 
          emoji: "😵", 
          isCorrect: false
        },
        { 
          text: "It's only useful for expensive items", 
          emoji: "💎", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Smart thinking! Price comparison helps you make informed decisions and stretch your budget further.",
        wrong: "Comparing prices helps you find better deals and save money, even on small purchases."
      }
    },
    {
      id: 5,
      title: "Entertainment Budget",
      question: "What's a good strategy for managing a limited entertainment budget?",
      options: [
        { 
          text: "Spend it all in one day to maximize enjoyment", 
          emoji: "🎊", 
          isCorrect: false
        },
        { 
          text: "Plan affordable activities and look for free options", 
          emoji: "📅", 
          isCorrect: true
        },
        { 
          text: "Borrow money to increase your entertainment budget", 
          emoji: "💳", 
          isCorrect: false
        },
        { 
          text: "Avoid all entertainment to save money", 
          emoji: "🚫", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect planning! Planning helps you enjoy entertainment while staying within your means.",
        wrong: "Balance is key - plan affordable activities that fit your budget rather than overspending or avoiding fun entirely."
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
      title="Badge: Smart Spender"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/finance/teen/allowance-story"
      nextGameIdProp="finance-teens-21"
      gameType="finance"
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
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
                    className={`bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3 ${
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
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 4 ? (
              <div>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-4">Smart Spender Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You made {score} smart spending decisions out of {challenges.length} challenges!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Smart Spender</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Smart Choices</h4>
                    <p className="text-white/90 text-sm">
                      You chose to distinguish needs from wants, compare prices, plan entertainment budgets, 
                      and make thoughtful spending decisions.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Financial Wisdom</h4>
                    <p className="text-white/90 text-sm">
                      These habits will help you manage your money wisely and achieve your financial goals!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {score} smart spending decisions out of {challenges.length} challenges.
                </p>
                <p className="text-white/90 mb-6">
                  Remember, smart spending means distinguishing needs from wants, comparing prices, 
                  and making thoughtful financial decisions.
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

export default BadgeSmartSpenderTeen;