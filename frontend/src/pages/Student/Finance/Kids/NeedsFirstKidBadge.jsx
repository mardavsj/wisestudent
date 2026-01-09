import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const NeedsFirstKidBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-40";
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
      title: "Smart Shopping",
      question: "You have ₹20. Buy candy or a school notebook?",
      options: [
        { 
          text: "Notebook", 
          emoji: "📓", 
          isCorrect: true
        },
        { 
          text: "Candy", 
          emoji: "🍬", 
          isCorrect: false
        },
        { 
          text: "Toys", 
          emoji: "🧸", 
          isCorrect: false
        },
        { 
          text: "Both", 
          emoji: "🛍️", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great choice! School supplies are needs that help you learn!",
        wrong: "Remember: Needs like school supplies come before wants like candy!"
      }
    },
    {
      id: 2,
      title: "Money Management",
      question: "You need ₹15 for lunch. You have ₹10. What's smart?",
      options: [
        { 
          text: "Buy snacks", 
          emoji: "🍟", 
          isCorrect: false
        },
        { 
          text: "Borrow ₹5", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Save ₹5 more", 
          emoji: "💰", 
          isCorrect: true
        },
        { 
          text: "Skip lunch", 
          emoji: "🍽️", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Wise decision! Saving more money shows good financial planning!",
        wrong: "It's better to save more money than to borrow or skip meals!"
      }
    },
    {
      id: 3,
      title: "Priority Choice",
      question: "You want a game but need shoes. What comes first?",
      options: [
        { 
          text: "Shoes", 
          emoji: "👟", 
          isCorrect: true
        },
        { 
          text: "Game", 
          emoji: "🎮", 
          isCorrect: false
        },
        { 
          text: "Both", 
          emoji: "🛍️", 
          isCorrect: false
        },
        { 
          text: "Neither", 
          emoji: "❌", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Needs like shoes come before wants like games!",
        wrong: "Remember: Always buy what you need first before buying what you want!"
      }
    },
    {
      id: 4,
      title: "Money Choice",
      question: "You have ₹30. Spend on needs or wants?",
      options: [
       
        { 
          text: "Wants like toys", 
          emoji: "🧸", 
          isCorrect: false
        },
         { 
          text: "Needs like books", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          text: "Give it away", 
          emoji: "🎁", 
          isCorrect: false
        },
        { 
          text: "Save all", 
          emoji: "🏦", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Excellent! Prioritizing needs over wants is smart financial behavior!",
        wrong: "Needs should come before wants when spending your money!"
      }
    },
    {
      id: 5,
      title: "Understanding Needs",
      question: "Why prioritize needs over wants?",
      options: [
        { 
          text: "Gets you more toys", 
          emoji: "🛒", 
          isCorrect: false
        },
        
        { 
          text: "Makes you popular", 
          emoji: "👥", 
          isCorrect: false
        },
        { 
          text: "No reason", 
          emoji: "❓", 
          isCorrect: false
        },
        { 
          text: "Meets essentials first", 
          emoji: "🥗", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Right! Needs meet your essential requirements for life!",
        wrong: "Needs are essential for survival and well-being, while wants are just nice to have!"
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
      title="Badge: Needs First Kid"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/finance/kids/bank-visit-story"
      nextGameIdProp="finance-kids-41"
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
                <h3 className="text-3xl font-bold text-white mb-4">Needs First Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You made {finalScore} smart need prioritization decisions out of {challenges.length} challenges!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Needs First Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Smart Choices</h4>
                    <p className="text-white/90 text-sm">
                      You learned to prioritize needs like school supplies, shoes, and essentials 
                      over wants like games and toys!
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Financial Wisdom</h4>
                    <p className="text-white/90 text-sm">
                      These habits will help you make better financial decisions and reach your goals!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {finalScore} smart need prioritization decisions out of {challenges.length} challenges.
                </p>
                <p className="text-white/90 mb-6">
                  Remember, needs come before wants when making financial decisions. 
                  This helps you build good financial habits!
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

export default NeedsFirstKidBadge;