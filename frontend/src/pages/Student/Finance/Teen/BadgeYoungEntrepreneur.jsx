import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeYoungEntrepreneur = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-80");
  const gameId = gameData?.id || "finance-teens-80";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for BadgeYoungEntrepreneur, using fallback ID");
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
      title: "Starting a Business",
      question: "What's the first step to start a business?",
      options: [
        { 
          text: "Have a good idea and plan", 
          emoji: "💡", 
          isCorrect: true
        },
        { 
          text: "Spend all your money", 
          emoji: "💸", 
          isCorrect: false
        },
        { 
          text: "Wait forever", 
          emoji: "⏳", 
          isCorrect: false
        },
        { 
          text: "Copy others exactly", 
          emoji: "📋", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Business Planning",
      question: "What should you do before starting?",
      options: [
        { 
          text: "Start immediately", 
          emoji: "⚡", 
          isCorrect: false
        },
        { 
          text: "Research market and costs", 
          emoji: "🔍", 
          isCorrect: true
        },
        { 
          text: "Ignore planning", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "Spend without thinking", 
          emoji: "💳", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Managing Money",
      question: "How should you handle business money?",
      options: [
        { 
          text: "Spend everything", 
          emoji: "💸", 
          isCorrect: false
        },
        { 
          text: "Ignore finances", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Track income and expenses", 
          emoji: "📊", 
          isCorrect: true
        },
        { 
          text: "No tracking needed", 
          emoji: "😴", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Customer Service",
      question: "What's important for business success?",
      options: [
        { 
          text: "Ignore customers", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Cheat customers", 
          emoji: "😈", 
          isCorrect: false
        },
        { 
          text: "No service needed", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "Satisfy customers", 
          emoji: "😊", 
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      title: "Growing Business",
      question: "How should you grow your business?",
      options: [
        { 
          text: "Start small and expand gradually", 
          emoji: "🌱", 
          isCorrect: true
        },
        { 
          text: "Start huge immediately", 
          emoji: "🎯", 
          isCorrect: false
        },
        { 
          text: "Never grow", 
          emoji: "📉", 
          isCorrect: false
        },
        { 
          text: "Grow without planning", 
          emoji: "🚀", 
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
      title="Badge: Young Entrepreneur"
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      score={score}
      currentLevel={challenge + 1}
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/fake-online-offer-story"
      nextGameIdProp="finance-teens-81"
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
                <h3 className="text-2xl font-bold text-white mb-4">Young Entrepreneur Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} challenges correct!
                  You're a true Young Entrepreneur expert!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Young entrepreneurs have good ideas, plan carefully, track finances, satisfy customers, and grow gradually!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} challenges correct.
                  Practice makes perfect with entrepreneurship!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Always have a good idea and plan, research market and costs, track finances, satisfy customers, and start small!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeYoungEntrepreneur;

