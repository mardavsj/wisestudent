import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeBankExplorer = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-50";
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
      title: "Bank Basics",
      question: "What is the main purpose of a bank?",
      options: [
        { 
          text: "To give free toys", 
          emoji: "🧸", 
          isCorrect: false
        },
        { 
          text: "Only for adults to visit", 
          emoji: "👨", 
          isCorrect: false
        },
        { 
          text: "To keep money safe and help it grow", 
          emoji: "💰", 
          isCorrect: true
        },
        { 
          text: "To play games", 
          emoji: "🎮", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Excellent! Banks keep your money safe and help it grow!",
        wrong: "Banks are for keeping money safe and helping it grow, not for toys or games!"
      }
    },
    {
      id: 2,
      title: "Savings Knowledge",
      question: "What happens when you put money in a savings account?",
      options: [
        { 
          text: "It stays safe and earns interest", 
          emoji: "🔒", 
          isCorrect: true
        },
        { 
          text: "The bank uses it for free", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "It disappears", 
          emoji: "👻", 
          isCorrect: false
        },
        { 
          text: "You can't get it back", 
          emoji: "❌", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Money in savings is safe and earns interest!",
        wrong: "Your money is safe in savings accounts and even earns interest over time!"
      }
    },
    {
      id: 3,
      title: "Card Security",
      question: "What should you NEVER do with your ATM card?",
      options: [
        { 
          text: "Share your PIN with strangers", 
          emoji: "🤫", 
          isCorrect: false
        },
        { 
          text: "Never share with anyone", 
          emoji: "🔒", 
          isCorrect: true
        },
        { 
          text: "Use it with parent's permission", 
          emoji: "👨‍👩", 
          isCorrect: false
        },
        { 
          text: "Tell friends your PIN", 
          emoji: "🗣️", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great! Never share your PIN with anyone, not even friends or family!",
        wrong: "Your PIN should never be shared with anyone, including family!"
      }
    },
    {
      id: 4,
      title: "Bank Safety",
      question: "Why do banks have security guards and cameras?",
      options: [
        { 
          text: "To scare children", 
          emoji: "👻", 
          isCorrect: false
        },
        { 
          text: "To protect everyone's money", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          text: "Just for decoration", 
          emoji: "🎨", 
          isCorrect: false
        },
        { 
          text: "To make it look fancy", 
          emoji: "💎", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Right! Security measures protect everyone's money!",
        wrong: "Security guards and cameras are there to protect everyone's money!"
      }
    },
    {
      id: 5,
      title: "Bank Services",
      question: "Which service do banks provide to help people?",
      options: [
        { 
          text: "Free vacations", 
          emoji: "✈️", 
          isCorrect: false
        },
        { 
          text: "Magic money machines", 
          emoji: "✨", 
          isCorrect: false
        },
        { 
          text: "Loans to start businesses or buy homes", 
          emoji: "🏠", 
          isCorrect: true
        },
        { 
          text: "Free money gifts", 
          emoji: "🎁", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Banks provide loans to help people start businesses and buy homes!",
        wrong: "Banks provide loans to help people achieve their goals like starting businesses or buying homes!"
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
      title="Badge: Bank Explorer"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/finance/kids/pencil-story"
      nextGameIdProp="finance-kids-51"
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
                <h3 className="text-3xl font-bold text-white mb-4">Bank Explorer Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You made {finalScore} smart banking decisions out of {challenges.length} challenges!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Bank Explorer</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Banking Skills</h4>
                    <p className="text-white/90 text-sm">
                      You learned about bank safety, savings accounts, card security, 
                      and bank services!
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Financial Wisdom</h4>
                    <p className="text-white/90 text-sm">
                      These habits will help you make better financial decisions and keep your money safe!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {finalScore} smart banking decisions out of {challenges.length} challenges.
                </p>
                <p className="text-white/90 mb-6">
                  Remember, banks keep your money safe, help it grow, and provide important services. 
                  Always protect your personal information!
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

export default BadgeBankExplorer;

