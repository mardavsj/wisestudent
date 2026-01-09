import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SimulationDigitalSpend = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-48");
  const gameId = gameData?.id || "finance-teens-48";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SimulationDigitalSpend, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const scenarios = [
  {
    id: 1,
    title: "Subscription Trap",
    description: "You have ₹1000. Multiple apps offer free trials then ₹300/month. What’s smart?",
    options: [
      { 
        id: "all-trials", 
        text: "Sign up for all trials blindly", 
        emoji: "📱", 
        isCorrect: false
      },
      { 
        id: "plan-trials", 
        text: "Check app value, subscribe only if useful", 
        emoji: "🧠", 
        isCorrect: true
      },
      { 
        id: "ignore", 
        text: "Avoid all digital services", 
        emoji: "🙈", 
        isCorrect: false
      },
      { 
        id: "auto-renew", 
        text: "Auto-renew all trials to avoid missing benefits", 
        emoji: "🔄", 
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    title: "Impulse Purchase Challenge",
    description: "You see a cool gadget online for ₹700, wallet has ₹1000. What’s smart?",
    options: [
      { 
        id: "review", 
        text: "Review need vs budget, wait 24 hrs", 
        emoji: "⏳", 
        isCorrect: true
      },
      { 
        id: "buy-now", 
        text: "Buy immediately for fun", 
        emoji: "🛒", 
        isCorrect: false
      },
      
      { 
        id: "borrow", 
        text: "Borrow extra money to buy it", 
        emoji: "💳", 
        isCorrect: false
      },
      { 
        id: "ignore-forever", 
        text: "Ignore it completely, even if useful later", 
        emoji: "🚫", 
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    title: "Digital Gift Dilemma",
    description: "Friend asks for ₹500 gift via an app. Wallet has ₹800. What’s smart?",
    options: [
      { 
        id: "send-all", 
        text: "Send without thinking, just to please", 
        emoji: "🎁", 
        isCorrect: false
      },
      
      { 
        id: "ignore-friend", 
        text: "Ignore request completely", 
        emoji: "🙅", 
        isCorrect: false
      },
      { 
        id: "borrow-money", 
        text: "Borrow to give more than wallet", 
        emoji: "💳", 
        isCorrect: false
      },
      { 
        id: "check-budget", 
        text: "Check budget, balance social kindness & savings", 
        emoji: "⚖️", 
        isCorrect: true
      },
    ]
  },
  {
    id: 4,
    title: "Online Game Coins",
    description: "Game offers ₹100 coins pack for ₹200. Wallet ₹1000. How to act wisely?",
    options: [
      { 
        id: "buy-many", 
        text: "Buy as many as possible", 
        emoji: "🎮", 
        isCorrect: false
      },
      
      { 
        id: "ignore-entirely", 
        text: "Avoid games completely", 
        emoji: "🚫", 
        isCorrect: false
      },
      { 
        id: "limit-purchase", 
        text: "Set limit, buy only if fun + affordable", 
        emoji: "📊", 
        isCorrect: true
      },
      { 
        id: "borrow", 
        text: "Borrow money to buy more coins", 
        emoji: "💳", 
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    title: "Digital Privacy Spending",
    description: "App wants ₹500 for premium feature but requires all personal data. Wallet ₹1200. Decision?",
    options: [
      { 
        id: "pay", 
        text: "Pay without reading terms", 
        emoji: "💸", 
        isCorrect: false
      },
      { 
        id: "research", 
        text: "Check privacy, decide if worth it", 
        emoji: "🔍", 
        isCorrect: true
      },
      { 
        id: "ignore", 
        text: "Never pay for anything digital", 
        emoji: "🙈", 
        isCorrect: false
      },
      { 
        id: "share-data", 
        text: "Share unnecessary data for convenience", 
        emoji: "📲", 
        isCorrect: false
      }
    ]
  }
];


  const handleAnswer = (optionId) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    const scenario = scenarios[currentScenario];
    const selectedOption = scenario.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption?.isCorrect;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    const isLastScenario = currentScenario === scenarios.length - 1;
    
    setTimeout(() => {
      if (isLastScenario) {
        setShowResult(true);
      } else {
        setCurrentScenario(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentScenario(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const current = scenarios[currentScenario];

  return (
    <GameShell
      title="Simulation: Digital Spend"
      subtitle={!showResult ? `Scenario ${currentScenario + 1} of ${scenarios.length}` : "Simulation Complete!"}
      score={score}
      currentLevel={currentScenario + 1}
      totalLevels={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={scenarios.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/reflex-fraud-alert"
      nextGameIdProp="finance-teens-49"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="finance"
    >
      <div className="space-y-8">
        {!showResult && current ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{scenarios.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{current.title}</h3>
              <p className="text-white text-lg mb-6">
                {current.description}
              </p>
              
            
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {current.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-center transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : "bg-red-500/20 border-2 border-red-400 opacity-75"
                        : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="text-4xl">{option.emoji}</span>
                      <span className="font-semibold text-lg">{option.text}</span>
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
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Excellent Digital Finance Skills!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {scenarios.length} scenarios correct!
                  You're mastering digital spending strategies!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Always track your digital spending and plan expenses to stay within budget!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {scenarios.length} scenarios correct.
                  Remember to track and plan your digital expenses!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Plan your digital expenses and track them regularly to maintain financial health!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationDigitalSpend;

