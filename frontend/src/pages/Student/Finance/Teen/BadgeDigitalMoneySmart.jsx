import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeDigitalMoneySmart = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-50");
  const gameId = gameData?.id || "finance-teens-50";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for BadgeDigitalMoneySmart, using fallback ID");
  }
  
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
      title: "Safe Online Payment",
      question: "What's the safest way to pay online?",
      options: [
        { 
          text: "Use UPI with OTP verification", 
          emoji: "🔒", 
          isCorrect: true
        },
        { 
          text: "Share PIN with seller", 
          emoji: "🔓", 
          isCorrect: false
        },
        { 
          text: "Send card details via email", 
          emoji: "📧", 
          isCorrect: false
        },
        { 
          text: "Skip verification steps", 
          emoji: "⏭️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Protecting Card Information",
      question: "How should you protect your card details?",
      options: [
        { 
          text: "Share CVV with friends", 
          emoji: "👥", 
          isCorrect: false
        },
        { 
          text: "Hide CVV and never share", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          text: "Post card photo online", 
          emoji: "📸", 
          isCorrect: false
        },
        { 
          text: "Write PIN on card", 
          emoji: "✍️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Verifying Website Security",
      question: "What should you check before entering payment details?",
      options: [
        { 
          text: "Ignore website security", 
          emoji: "🚫", 
          isCorrect: false
        },
        
        { 
          text: "Enter details on any site", 
          emoji: "🌐", 
          isCorrect: false
        },
        { 
          text: "Trust all websites", 
          emoji: "😊", 
          isCorrect: false
        },
        { 
          text: "Check for HTTPS and padlock", 
          emoji: "🔒", 
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      title: "Handling Suspicious Messages",
      question: "What should you do with suspicious payment requests?",
      options: [
        { 
          text: "Click suspicious links", 
          emoji: "🔗", 
          isCorrect: false
        },
        { 
          text: "Ignore and delete suspicious messages", 
          emoji: "🗑️", 
          isCorrect: true
        },
        { 
          text: "Share OTP immediately", 
          emoji: "📢", 
          isCorrect: false
        },
        { 
          text: "Forward to everyone", 
          emoji: "📤", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Secure Password Practice",
      question: "What's the best practice for digital payment passwords?",
      options: [
        { 
          text: "Use '1234' as password", 
          emoji: "🔓", 
          isCorrect: false
        },
        
        { 
          text: "Share password with friends", 
          emoji: "👥", 
          isCorrect: false
        },
        { 
          text: "Create strong, unique passwords", 
          emoji: "🔑", 
          isCorrect: true
        },
        { 
          text: "Never change password", 
          emoji: "📜", 
          isCorrect: false
        }
      ]
    }
  ];

  const handleAnswer = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
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

  return (
    <GameShell
      title="Badge: Digital Money Smart"
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      score={score}
      currentLevel={challenge + 1}
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/money-borrow-story"
      nextGameIdProp="finance-teens-51"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="finance"
    >
      <div className="space-y-8">
        {!showResult && challenges[challenge] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Challenge {challenge + 1}/{challenges.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{challenges.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{challenges[challenge].title}</h3>
              <p className="text-white text-lg mb-6">
                {challenges[challenge].question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges[challenge].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedAnswer(idx);
                      handleAnswer(option.isCorrect);
                    }}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-left transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : selectedAnswer === idx
                          ? "bg-red-500/20 border-4 border-red-400 ring-4 ring-red-400"
                          : "bg-white/5 border-2 border-white/20 opacity-50"
                        : "bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="text-white font-semibold">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-white mb-4">Digital Money Smart Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} challenges correct!
                  You're a true Digital Money Smart expert!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Safely using digital money means using UPI with OTP, protecting card details, verifying website security, ignoring suspicious messages, and using strong passwords!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} challenges correct.
                  Practice makes perfect with digital money safety!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Always use UPI with OTP, hide CVV, check HTTPS, ignore suspicious messages, and create strong passwords for safe digital payments!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeDigitalMoneySmart;

