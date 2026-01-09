import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeSaverKid = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-10";
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
      title: "Piggy Bank",
      question: "What is the best way to save money?",
      options: [
       
        { 
          text: "Spend everything first", 
          emoji: "💸", 
          isCorrect: false
        },
         { 
          text: "Save a little bit regularly", 
          emoji: "🐷", 
          isCorrect: true
        },
        { 
          text: "Save only when you have a lot", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          text: "Keep it in your pocket", 
          emoji: "👛", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Excellent! Regular saving, even small amounts, builds good habits!",
        wrong: "The best way to save is to save a little bit regularly, not just when you have a lot!"
      }
    },
    {
      id: 2,
      title: "Safe Savings",
      question: "Where should you keep your savings?",
      options: [
       
        { 
          text: "Under your bed", 
          emoji: "🛏️", 
          isCorrect: false
        },
        { 
          text: "Spend it all immediately", 
          emoji: "🏃", 
          isCorrect: false
        },
        { 
          text: "In a shoe box at home", 
          emoji: "👟", 
          isCorrect: false
        },
         { 
          text: "In a safe place like a bank", 
          emoji: "🏦", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Perfect! Keeping money in a bank keeps it safe and can help it grow!",
        wrong: "Banks are the safest place to keep your savings - they protect your money!"
      }
    },
    {
      id: 3,
      title: "Extra Money",
      question: "What should you do with extra money?",
      options: [
        { 
          text: "Save it for future goals", 
          emoji: "🎯", 
          isCorrect: true
        },
        { 
          text: "Spend it all right away", 
          emoji: "🛒", 
          isCorrect: false
        },
        { 
          text: "Lose it or forget about it", 
          emoji: "😵", 
          isCorrect: false
        },
        { 
          text: "Give it all to friends", 
          emoji: "🤝", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Amazing! Saving extra money helps you reach your goals faster!",
        wrong: "Extra money should be saved for future goals, not spent immediately!"
      }
    },
    {
      id: 4,
      title: "Saving Importance",
      question: "Why is saving money important?",
      options: [
        
        { 
          text: "It's not important at all", 
          emoji: "🤷", 
          isCorrect: false
        },
        { 
          text: "You should never save", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "It helps you reach your goals", 
          emoji: "🏆", 
          isCorrect: true
        },
        { 
          text: "To show off to friends", 
          emoji: "🤝", 
          isCorrect: false
        },
      ],
      feedback: {
        correct: "Great! Saving money helps you achieve your dreams and goals!",
        wrong: "Saving money is very important - it helps you reach your goals and be prepared!"
      }
    },
    {
      id: 5,
      title: "Saving Habit",
      question: "What is a good saving habit?",
      options: [
       
        { 
          text: "Never save anything", 
          emoji: "❌", 
          isCorrect: false
        },
        { 
          text: "Spend more than you have", 
          emoji: "📈", 
          isCorrect: false
        },
         { 
          text: "Set goals and save regularly", 
          emoji: "🎯", 
          isCorrect: true
        },
        { 
          text: "Save only when feeling rich", 
          emoji: "🤑", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Wonderful! Setting goals and saving regularly makes you a smart saver!",
        wrong: "Good saving habits include setting goals and saving money regularly!"
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
      title="Badge: Saver Kid"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/finance/kids/ice-cream-story"
      nextGameIdProp="finance-kids-11"
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
                <h3 className="text-3xl font-bold text-white mb-4">Saver Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You made {finalScore} smart saving decisions out of {challenges.length} challenges!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Saver Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Saving Skills</h4>
                    <p className="text-white/90 text-sm">
                      You learned to save regularly, keep money safe, 
                      and make smart financial decisions!
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Financial Wisdom</h4>
                    <p className="text-white/90 text-sm">
                      These habits will help you achieve your financial goals!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {finalScore} smart saving decisions out of {challenges.length} challenges.
                </p>
                <p className="text-white/90 mb-6">
                  Remember, good saving habits include saving regularly, 
                  keeping money safe, and setting goals!
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

export default BadgeSaverKid;

