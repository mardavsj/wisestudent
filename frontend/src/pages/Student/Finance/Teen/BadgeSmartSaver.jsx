import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeSmartSaver = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-10";
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
      title: "Emergency Situation",
      question: "Your bike needs urgent repairs costing ₹500. You have ₹300 saved. What do you do?",
      options: [
        
        { 
          text: "Borrow from friends", 
          emoji: "👥", 
          isCorrect: false
        },
        { 
          text: "Use credit card", 
          emoji: "💳", 
          isCorrect: false
        },
        { 
          text: "Use savings + earn more", 
          emoji: "🛠️", 
          isCorrect: true
        },
        { 
          text: "Ignore the repair", 
          emoji: "🚫", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Smart choice! Using savings and earning more shows financial responsibility!",
        wrong: "Remember: Use your savings first and earn more rather than borrowing unnecessarily."
      }
    },
    {
      id: 2,
      title: "Investment Opportunity",
      question: "A friend offers 50% return on ₹1000 investment in 1 month. What's your choice?",
      options: [
       
        { 
          text: "Invest the money", 
          emoji: "🎰", 
          isCorrect: false
        },
         { 
          text: "Decline risky offer", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          text: "Invest half", 
          emoji: "⚖️", 
          isCorrect: false
        },
        { 
          text: "Ask for more details", 
          emoji: "❓", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Excellent! High returns in short time are usually too good to be true!",
        wrong: "Be cautious! Unrealistic returns often indicate scams or high risk."
      }
    },
    {
      id: 3,
      title: "Shopping Temptation",
      question: "You see a ₹2000 gadget you want, but you're saving for college fees. Do you buy it?",
      options: [
        { 
          text: "Stick to college goal", 
          emoji: "🎓", 
          isCorrect: true
        },
        { 
          text: "Buy the gadget", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          text: "Buy on credit", 
          emoji: "💳", 
          isCorrect: false
        },
        { 
          text: "Borrow money", 
          emoji: "💸", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Prioritizing important goals over wants is smart saving!",
        wrong: "Remember: Important goals like education should come before wants."
      }
    },
    {
      id: 4,
      title: "Bonus Dilemma",
      question: "You receive ₹1000 bonus. Should you save it all or spend some?",
      options: [
        
        { 
          text: "Spend 50% on fun", 
          emoji: "🎉", 
          isCorrect: false
        },
        { 
          text: "Spend it all", 
          emoji: "🛍️", 
          isCorrect: false
        },
        { 
          text: "Save 80%, spend 20%", 
          emoji: "💰", 
          isCorrect: true
        },
        { 
          text: "Save it all", 
          emoji: "🏦", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great balance! Saving most while enjoying a small reward is wise!",
        wrong: "A good rule: Save most of unexpected money, but allow a small reward for motivation."
      }
    },
    {
      id: 5,
      title: "Peer Pressure",
      question: "Friends are planning an expensive trip. You can't afford it but don't want to miss out. What do you do?",
      options: [
        { 
          text: "Plan affordable alternative", 
          emoji: "🧭", 
          isCorrect: true
        },
        { 
          text: "Borrow to join", 
          emoji: "💸", 
          isCorrect: false
        },
        { 
          text: "Use credit card", 
          emoji: "💳", 
          isCorrect: false
        },
        { 
          text: "Skip and stay home", 
          emoji: "🏠", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Smart! Finding affordable alternatives shows financial maturity!",
        wrong: "Don't let peer pressure lead to poor financial decisions. Suggest affordable options!"
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
      title="Badge: Smart Saver"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/finance/teen/savings-saga"
      nextGameIdProp="finance-teens-11"
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
                <h3 className="text-3xl font-bold text-white mb-4">Smart Saver Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You made {score} smart saving decisions out of {challenges.length} challenges!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Smart Saver</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Smart Choices</h4>
                    <p className="text-white/90 text-sm">
                      You chose to save for emergencies, avoid risky investments, prioritize important goals, 
                      and resist peer pressure spending.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Financial Wisdom</h4>
                    <p className="text-white/90 text-sm">
                      These habits will help you build wealth and achieve your long-term financial goals!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {score} smart saving decisions out of {challenges.length} challenges.
                </p>
                <p className="text-white/90 mb-6">
                  Remember, smart saving means prioritizing important goals, avoiding risky investments, 
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

export default BadgeSmartSaver;