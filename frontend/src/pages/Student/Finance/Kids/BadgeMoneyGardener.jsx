import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeMoneyGardener = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-70";
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
      question: "You got 100 rupees for your birthday. What will you do?",
      options: [
        
        { 
          text: "Spend all on candy today", 
          emoji: "🍬", 
          isCorrect: false
        },
        { 
          text: "Save 80, spend 20 - Plant seeds for growth", 
          emoji: "🌱", 
          isCorrect: true
        },
        { 
          text: "Give all away immediately", 
          emoji: "🎁", 
          isCorrect: false
        },
        { 
          text: "Hide it under your pillow", 
          emoji: "🛌", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Excellent! Saving most of your money helps it grow like a seed!",
        wrong: "Remember, saving money helps it grow - like planting seeds in a garden!"
      }
    },
    {
      id: 2,
      title: "Patience Practice",
      question: "Your friend bought a new toy, but you're saving. What do you do?",
      options: [
        { 
          text: "Stay patient, keep saving for bigger goals", 
          emoji: "🧘", 
          isCorrect: true
        },
        { 
          text: "Break your piggy bank for instant fun", 
          emoji: "🐷", 
          isCorrect: false
        },
        { 
          text: "Feel sad and give up saving", 
          emoji: "😢", 
          isCorrect: false
        },
        { 
          text: "Ask parents for more money", 
          emoji: "👨‍💼", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Patience helps your money garden grow bigger and better!",
        wrong: "Stay patient! Your savings will grow into something even better!"
      }
    },
    {
      id: 3,
      title: "Toy Goal",
      question: "You want a 500 rupee toy but have only 300 saved. What's the smart choice?",
      options: [
        
        { 
          text: "Borrow from parents and buy now", 
          emoji: "💳", 
          isCorrect: false
        },
        { 
          text: "Save 200 more before buying - Let it grow!", 
          emoji: "🌲", 
          isCorrect: true
        },
        { 
          text: "Buy a cheaper toy you don't want", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          text: "Spend it on snacks instead", 
          emoji: "🍪", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Amazing! Saving until you have enough is the smart gardener's way!",
        wrong: "Keep saving until you reach your goal - that's how money gardens grow!"
      }
    },
    {
      id: 4,
      title: "Grandma's Offer",
      question: "Your piggy bank is full! Grandma offers to add 10% to your savings if you wait one month. What do you choose?",
      options: [
        
        { 
          text: "Take money out immediately", 
          emoji: "💨", 
          isCorrect: false
        },
        { 
          text: "Spend half now, save half", 
          emoji: "⚖️", 
          isCorrect: false
        },
        { 
          text: "Doubt the offer, don't wait", 
          emoji: "🤔", 
          isCorrect: false
        },
        { 
          text: "Wait one month - Money can make money!", 
          emoji: "🌸", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Great! Waiting for your money to grow is what smart gardeners do!",
        wrong: "When money can make more money, wait and let it grow!"
      }
    },
    {
      id: 5,
      title: "Big Savings",
      question: "After months of saving, you have 1000 rupees! What's the wisest choice?",
      options: [
       
        { 
          text: "Spend everything at once", 
          emoji: "💸", 
          isCorrect: false
        },
        { 
          text: "Never spend, just keep saving forever", 
          emoji: "🔒", 
          isCorrect: false
        },
         { 
          text: "Keep 800 saved, spend 200 on something special", 
          emoji: "🏆", 
          isCorrect: true
        },
        { 
          text: "Give it all to charity", 
          emoji: "💝", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Wonderful! Balancing saving and spending makes you a true money gardener!",
        wrong: "A good money gardener saves most but enjoys some rewards too!"
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
      title="Badge: Money Gardener"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/finance/kids/lemonade-story"
      nextGameIdProp="finance-kids-71"
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
                <h3 className="text-3xl font-bold text-white mb-4">Money Gardener Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You made {finalScore} smart money decisions out of {challenges.length} challenges!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Money Gardener</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Money Skills</h4>
                    <p className="text-white/90 text-sm">
                      You learned to save wisely, be patient with your money, 
                      and make balanced spending decisions!
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Financial Wisdom</h4>
                    <p className="text-white/90 text-sm">
                      These habits will help your money grow like a beautiful garden!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {finalScore} smart money decisions out of {challenges.length} challenges.
                </p>
                <p className="text-white/90 mb-6">
                  Remember, good money gardeners save most of their money, 
                  wait patiently for it to grow, and make wise spending choices!
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

export default BadgeMoneyGardener;

