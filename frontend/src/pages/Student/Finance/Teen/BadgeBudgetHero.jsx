import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeBudgetHero = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-30");
  const gameId = gameData?.id || "finance-teens-30";
  
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
      title: "Budget Planning",
      question: "What should you do first when creating a budget?",
      options: [
        
        { 
          text: "Spend money on wants first", 
          emoji: "🛍️", 
          isCorrect: false
        },
        { 
          text: "Ignore your expenses", 
          emoji: "📝", 
          isCorrect: false
        },
        { 
          text: "Save everything without planning", 
          emoji: "🏦", 
          isCorrect: false
        },
        { 
          text: "List all your income and expenses", 
          emoji: "📋", 
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      title: "Prioritizing Expenses",
      question: "What should you prioritize in your budget?",
      options: [
        { 
          text: "Buy wants before needs", 
          emoji: "🎮", 
          isCorrect: false
        },
        { 
          text: "Cover essential needs first, then wants", 
          emoji: "📋", 
          isCorrect: true
        },
        { 
          text: "Spend equally on everything", 
          emoji: "⚖️", 
          isCorrect: false
        },
        { 
          text: "Only spend on wants", 
          emoji: "💸", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Saving Strategy",
      question: "What's the best way to save money?",
      options: [
        { 
          text: "Save whatever is left after spending", 
          emoji: "📊", 
          isCorrect: false
        },
        
        { 
          text: "Never save anything", 
          emoji: "❌", 
          isCorrect: false
        },
        { 
          text: "Save first, then spend the rest", 
          emoji: "🔐", 
          isCorrect: true
        },
        { 
          text: "Save only when you have extra", 
          emoji: "📈", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Budget Tracking",
      question: "How often should you review your budget?",
      options: [
        { 
          text: "Never review it", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Review it regularly (weekly or monthly)", 
          emoji: "📅", 
          isCorrect: true
        },
        { 
          text: "Review it only once a year", 
          emoji: "📆", 
          isCorrect: false
        },
        { 
          text: "Review it only when you run out of money", 
          emoji: "📉", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Budget Flexibility",
      question: "What should you do if you overspend in one category?",
      options: [
        { 
          text: "Adjust other categories to stay within budget", 
          emoji: "🔄", 
          isCorrect: true
        },
        { 
          text: "Ignore it and continue spending", 
          emoji: "🙈", 
          isCorrect: false
        },
        
        { 
          text: "Spend even more", 
          emoji: "💳", 
          isCorrect: false
        },
        { 
          text: "Give up on budgeting", 
          emoji: "😔", 
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
      title="Badge: Budget Hero"
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      score={score}
      currentLevel={challenge + 1}
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/movie-vs-bus-fare-story"
      nextGameIdProp="finance-teens-31"
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
                <h3 className="text-2xl font-bold text-white mb-4">Budget Hero Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} challenges correct!
                  You're a true Budget Hero!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Smart budgeting helps you achieve your financial goals and build a secure future!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} challenges correct.
                  Practice makes perfect with budgeting!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Remember to plan your budget, prioritize needs, save first, track regularly, and adjust as needed!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeBudgetHero;