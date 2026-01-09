import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SimulationMiniStartup = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-78");
  const gameId = gameData?.id || "finance-teens-78";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SimulationMiniStartup, using fallback ID");
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
    title: "Mini Startup: Online Snack Delivery",
    description: "You have ₹500. Which strategy maximizes profit safely?",
    amount: 500,
    options: [
      { 
        id: "invest-all", 
        text: "Invest entire ₹500 in ingredients without market check", 
        emoji: "💸", 
        isCorrect: false
      },
      
      { 
        id: "borrow-more", 
        text: "Borrow extra ₹500 to buy more stock", 
        emoji: "💳", 
        isCorrect: false
      },
      { 
        id: "wait", 
        text: "Wait and save more before starting", 
        emoji: "⏳", 
        isCorrect: false
      },
      { 
        id: "market-test", 
        text: "Test small batch, learn demand, then expand", 
        emoji: "📊", 
        isCorrect: true
      },
    ]
  },
  {
    id: 2,
    title: "Mini Startup: Handmade Crafts",
    description: "You have ₹400. What's the smart approach?",
    amount: 400,
    options: [
      { 
        id: "overspend", 
        text: "Spend all ₹400 on materials without profit estimate", 
        emoji: "🎨", 
        isCorrect: false
      },
      
      { 
        id: "scale-fast", 
        text: "Produce large quantity hoping to sell quickly", 
        emoji: "⚡", 
        isCorrect: false
      },
      { 
        id: "calculate-profit", 
        text: "Estimate cost vs selling price, start small batch", 
        emoji: "🧮", 
        isCorrect: true
      },
      { 
        id: "delay", 
        text: "Wait for trend to become popular", 
        emoji: "⏳", 
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    title: "Mini Startup: Lemonade Stand",
    description: "You have ₹300. What's the most strategic move?",
    amount: 300,
    options: [
      { 
        id: "random-location", 
        text: "Set up anywhere without checking foot traffic", 
        emoji: "📍", 
        isCorrect: false
      },
      { 
        id: "smart-location", 
        text: "Choose high foot-traffic area, budget ingredients wisely", 
        emoji: "🛒", 
        isCorrect: true
      },
      { 
        id: "borrow-extra", 
        text: "Borrow ₹500 more to expand immediately", 
        emoji: "💳", 
        isCorrect: false
      },
      { 
        id: "save-instead", 
        text: "Save ₹300 instead of starting", 
        emoji: "💰", 
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    title: "Mini Startup: Book Resale",
    description: "You have ₹600. How do you minimize risk?",
    amount: 600,
    options: [
      { 
        id: "bulk-buy", 
        text: "Buy all books from seller without quality check", 
        emoji: "📚", 
        isCorrect: false
      },
      
      { 
        id: "borrow-more", 
        text: "Borrow extra ₹400 to stock quickly", 
        emoji: "💳", 
        isCorrect: false
      },
      { 
        id: "wait", 
        text: "Wait for better deal later", 
        emoji: "⏳", 
        isCorrect: false
      },
      { 
        id: "inspect-sample", 
        text: "Inspect sample books, estimate demand, buy accordingly", 
        emoji: "🔍", 
        isCorrect: true
      },
    ]
  },
  {
    id: 5,
    title: "Mini Startup: Tutoring Service",
    description: "You have ₹500. How do you maximize success?",
    amount: 500,
    options: [
      { 
        id: "targeted-plan", 
        text: "Create a skill-focused plan, target audience, advertise smartly", 
        emoji: "🎯", 
        isCorrect: true
      },
      { 
        id: "random-ad", 
        text: "Spend all on random ads without targeting", 
        emoji: "📢", 
        isCorrect: false
      },
      
      { 
        id: "hire-random", 
        text: "Hire someone without checking skills", 
        emoji: "👥", 
        isCorrect: false
      },
      { 
        id: "save", 
        text: "Save money instead of starting business", 
        emoji: "💰", 
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
      title="Simulation: Mini Startup"
      subtitle={!showResult ? `Scenario ${currentScenario + 1} of ${scenarios.length}` : "Simulation Complete!"}
      score={score}
      currentLevel={currentScenario + 1}
      totalLevels={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={scenarios.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/reflex-smart-entrepreneur"
      nextGameIdProp="finance-teens-79"
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
              
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <span className="text-white font-semibold text-lg">Amount: </span>
                  <span className="text-green-400 font-bold text-2xl">₹{current.amount}</span>
                </div>
              </div>
              
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
                <h3 className="text-2xl font-bold text-white mb-4">Excellent Decision!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {scenarios.length} scenarios correct!
                  You understand mini startup economics!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Mini startups can be smart investments when you have good profit margins (40%+). Always calculate profit = Revenue - Cost!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {scenarios.length} scenarios correct.
                  Remember, profit = Revenue - Cost, and 40%+ profit is good!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Calculate profit = Revenue - Cost. If you invest ₹300 and earn ₹500, that's ₹200 profit (67% return) - that's smart!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationMiniStartup;

