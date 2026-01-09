import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeSmartSpenderKid = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-20";
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
      title: "Birthday Money",
      question: "You received ₹500 as a birthday gift. What do you do?",
      options: [
        { 
          text: "Save ₹300, spend ₹200", 
          emoji: "💰", 
          isCorrect: true
        },
        { 
          text: "Spend all on toys", 
          emoji: "🧸", 
          isCorrect: false
        },
        { 
          text: "Save half, share half", 
          emoji: "🤝", 
          isCorrect: false
        },
        { 
          text: "Buy expensive gifts for others", 
          emoji: "🎁", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Excellent! Saving most of your money while spending some wisely is a smart approach!",
        wrong: "Remember to save most of your money for future needs while spending some wisely!"
      }
    },
    {
      id: 2,
      title: "Sale Offer",
      question: "Your favorite toy is on 50% off, but you already have similar toys. Do you buy it?",
      options: [
       
        { 
          text: "Buy because it's cheap", 
          emoji: "🛒", 
          isCorrect: false
        },
         { 
          text: "Don't buy", 
          emoji: "🙅", 
          isCorrect: true
        },
        { 
          text: "Buy as a gift", 
          emoji: "🎁", 
          isCorrect: false
        },
        { 
          text: "Ask parents first", 
          emoji: "👨‍👩", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Just because something is on sale doesn't mean you should buy it if you don't need it!",
        wrong: "Only buy things you actually need, even if they're on sale!"
      }
    },
    {
      id: 3,
      title: "Shopping List",
      question: "You're going to the market with ₹300. What's the smart approach?",
      options: [
        { 
          text: "Make a list first", 
          emoji: "📋", 
          isCorrect: true
        },
        { 
          text: "Buy what looks good", 
          emoji: "🛍️", 
          isCorrect: false
        },
        { 
          text: "Compare prices", 
          emoji: "🔍", 
          isCorrect: false
        },
        { 
          text: "Buy expensive items first", 
          emoji: "💸", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Amazing! Planning your purchases helps you spend wisely and avoid impulse buying!",
        wrong: "Planning your purchases before shopping helps you spend wisely and stick to your budget!"
      }
    },
    {
      id: 4,
      title: "Comparing Prices",
      question: "The same notebook is ₹50 at one store and ₹40 at another. Which do you choose?",
      options: [
       
        { 
          text: "Buy for ₹50", 
          emoji: "💸", 
          isCorrect: false
        },
        { 
          text: "Ask for advice", 
          emoji: "🙋", 
          isCorrect: false
        },
        { 
          text: "Buy from the familiar store", 
          emoji: "🏪", 
          isCorrect: false
        },
         { 
          text: "Buy for ₹40", 
          emoji: "🔍", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Great! Comparing prices helps you save money on the same item!",
        wrong: "Always compare prices to get the best value for your money!"
      }
    },
    {
      id: 5,
      title: "Impulse Purchase",
      question: "You planned to buy fruits for ₹100 but see candy on the way. What do you do?",
      options: [
        
        { 
          text: "Buy fruits and candy", 
          emoji: "🍬", 
          isCorrect: false
        },
        { 
          text: "Buy healthy snack", 
          emoji: "🥜", 
          isCorrect: false
        },
        { 
          text: "Buy only fruits", 
          emoji: "🍎", 
          isCorrect: true
        },
        { 
          text: "Forget the plan, buy what looks good", 
          emoji: "🤪", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Wonderful! Sticking to your plan helps you spend wisely and avoid unnecessary purchases!",
        wrong: "Sticking to your shopping plan helps you spend wisely and avoid impulse purchases!"
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
  const finalScore = score;

  return (
    <GameShell
      title="Badge: Smart Spender Kid"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/finance/kids/Candy-Story"
      nextGameIdProp="finance-kids-21"
      gameType="finance"
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === challenges.length}
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
            {finalScore >= 4 ? (
              <div>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-4">Smart Spender Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You made {finalScore} smart spending decisions out of {challenges.length} challenges!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Smart Spender Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Spending Skills</h4>
                    <p className="text-white/90 text-sm">
                      You learned to plan purchases, compare prices, 
                      and avoid impulse buying!
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Financial Wisdom</h4>
                    <p className="text-white/90 text-sm">
                      These habits will help you make smart financial decisions!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {finalScore} smart spending decisions out of {challenges.length} challenges.
                </p>
                <p className="text-white/90 mb-6">
                  Remember, smart spending means planning purchases, 
                  comparing prices, and avoiding impulse buys!
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

export default BadgeSmartSpenderKid;