import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeMoneySmartKid = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-kids-30";
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
      title: "Money Management",
      question: "What should you do with money you receive?",
      options: [
        { 
          text: "Save some, spend some wisely, and share some", 
          emoji: "💰", 
          isCorrect: true
        },
        { 
          text: "Spend it all immediately", 
          emoji: "💸", 
          isCorrect: false
        },
        { 
          text: "Hide it where no one can find it", 
          emoji: "🕵️", 
          isCorrect: false
        },
        
        { 
          text: "Lend it to strangers online", 
          emoji: "🌐", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! This balanced approach helps you build good financial habits!",
        wrong: "The best approach is to save some, spend some wisely, and share some with others."
      }
    },
    {
      id: 2,
      title: "Smart Shopping",
      question: "Why is it important to compare prices before buying?",
      options: [
        { 
          text: "To make shopping take longer", 
          emoji: "⏱️", 
          isCorrect: false
        },
        { 
          text: "To spend as much money as possible", 
          emoji: "💸", 
          isCorrect: false
        },
        
        { 
          text: "To collect more shopping bags", 
          emoji: "🛍️", 
          isCorrect: false
        },
        { 
          text: "To get the best value for your money", 
          emoji: "💡", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Exactly! Comparing prices helps you save money!",
        wrong: "Comparing prices helps you get the best value for your money."
      }
    },
    {
      id: 3,
      title: "Banking Benefits",
      question: "What's the benefit of saving money in a bank?",
      options: [
        { 
          text: "Banks will give you free toys", 
          emoji: "トイ", 
          isCorrect: false
        },
        { 
          text: "Your money is safe and can earn interest", 
          emoji: "🏦", 
          isCorrect: true
        },
        { 
          text: "Banks charge you to hold your money", 
          emoji: "❌", 
          isCorrect: false
        },
        
        { 
          text: "Banks will buy you whatever you want", 
          emoji: "🛒", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Banks keep your money safe and pay you interest!",
        wrong: "Banks keep your money safe and can even pay you interest for saving."
      }
    },
    {
      id: 4,
      title: "Needs vs Wants",
      question: "What's the difference between needs and wants?",
      options: [
        { 
          text: "Needs cost more than wants", 
          emoji: "🏷️", 
          isCorrect: false
        },
        { 
          text: "Wants are more important than needs", 
          emoji: "👑", 
          isCorrect: false
        },
        { 
          text: "Needs are essential for survival, wants make life better", 
          emoji: "💡", 
          isCorrect: true
        },
        { 
          text: "Needs are luxuries, wants are necessities", 
          emoji: "🔄", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Correct! Needs like food and shelter are essential, while wants like toys make life more enjoyable.",
        wrong: "Needs are essential for survival, while wants make life better but aren't necessary."
      }
    },
    {
      id: 5,
      title: "Big Purchases",
      question: "What should you do when you want to buy something expensive?",
      options: [
        { 
          text: "Save up for it over time", 
          emoji: "⏰", 
          isCorrect: true
        },
        { 
          text: "Ask strangers online for money", 
          emoji: "🌐", 
          isCorrect: false
        },
        { 
          text: "Buy it immediately with borrowed money", 
          emoji: "💳", 
          isCorrect: false
        },
        
        { 
          text: "Steal money to buy it", 
          emoji: "🚨", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Saving teaches patience and makes purchases more rewarding!",
        wrong: "The best approach is to save up for expensive items over time."
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
      title="Badge: Money Smart Kid"
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
      backPath="/games/ehe/kids"
    
      nextGamePathProp="/student/ehe/kids/problem-story"
      nextGameIdProp="ehe-kids-31">
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
                <h3 className="text-3xl font-bold text-white mb-4">Money Smart Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong financial knowledge with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Money Smart Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Financial Literacy</h4>
                    <p className="text-white/90 text-sm">
                      You understand the basics of money management, saving, and smart spending.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Decision Making</h4>
                    <p className="text-white/90 text-sm">
                      You know how to make smart financial decisions and differentiate between needs and wants.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    window.location.href = "/games/ehe/kids";
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review money management concepts to strengthen your knowledge and earn your badge.
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

export default BadgeMoneySmartKid;