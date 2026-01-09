import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeDebtSmart = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-60");
  const gameId = gameData?.id || "finance-teens-60";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for BadgeDebtSmart, using fallback ID");
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
      title: "Borrowing for Education",
      question: "You need money for education. What's the responsible approach?",
      options: [
        { 
          text: "Plan repayment and borrow responsibly", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          text: "Borrow without planning repayment", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Borrow more than needed", 
          emoji: "💸", 
          isCorrect: false
        },
        { 
          text: "Ignore the need for education", 
          emoji: "😴", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Repayment Planning",
      question: "You borrowed ₹1000. What should you do?",
      options: [
        { 
          text: "Forget about repayment", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "Borrow more to pay old debt", 
          emoji: "🔄", 
          isCorrect: false
        },
        { 
          text: "Create a repayment plan and stick to it", 
          emoji: "📋", 
          isCorrect: true
        },
        { 
          text: "Ignore payment dates", 
          emoji: "📅", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Borrowing for Wants",
      question: "You want a new gadget but can't afford it. What should you do?",
      options: [
        { 
          text: "Borrow immediately without plan", 
          emoji: "💸", 
          isCorrect: false
        },
        { 
          text: "Borrow and worry later", 
          emoji: "😊", 
          isCorrect: false
        },
        { 
          text: "Borrow from multiple sources", 
          emoji: "🔄", 
          isCorrect: false
        },
        { 
          text: "Save first or borrow only if you can repay", 
          emoji: "💰", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      title: "Communication with Lender",
      question: "You can't repay on time. What's the best action?",
      options: [
        { 
          text: "Communicate honestly and explain situation", 
          emoji: "💬", 
          isCorrect: true
        },
        { 
          text: "Hide and avoid lender", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Ignore the lender completely", 
          emoji: "📵", 
          isCorrect: false
        },
        { 
          text: "Borrow more to pay", 
          emoji: "🔄", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Avoiding Debt Trap",
      question: "How can you avoid falling into a debt trap?",
      options: [
        { 
          text: "Borrow often for wants", 
          emoji: "🔄", 
          isCorrect: false
        },
        { 
          text: "Ignore repayment plans", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Borrow only when necessary and always repay on time", 
          emoji: "⏰", 
          isCorrect: true
        },
        { 
          text: "Borrow without thinking", 
          emoji: "💸", 
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
      title="Badge: Debt Smart"
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      score={score}
      currentLevel={challenge + 1}
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/savings-account-story"
      nextGameIdProp="finance-teens-61"
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
                <h3 className="text-2xl font-bold text-white mb-4">Debt Smart Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} challenges correct!
                  You're a true Debt Smart expert!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Handle borrowing responsibly by planning repayment, borrowing only when necessary, communicating with lenders, and avoiding debt traps!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} challenges correct.
                  Practice makes perfect with responsible borrowing!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Always plan repayment before borrowing, borrow only when necessary, communicate with lenders if you can't pay, and avoid unnecessary debt!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeDebtSmart;

