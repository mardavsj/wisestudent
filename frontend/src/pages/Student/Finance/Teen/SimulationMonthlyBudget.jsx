import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SimulationMonthlyBudget = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-38");
  const gameId = gameData?.id || "finance-teens-38";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SimulationMonthlyBudget, using fallback ID");
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
    title: "Monthly Allowance Planning",
    description: "You get ₹2000 as monthly allowance. How should you plan it to cover essentials and still enjoy life?",
    amount: 2000,
    options: [
      { 
        id: "spend-wants", 
        text: "Spend mostly on wants without tracking", 
        emoji: "🛍️", 
        isCorrect: false
      },
      { 
        id: "budgeted-split", 
        text: "Allocate 50% needs, 30% savings, 20% wants", 
        emoji: "📊", 
        isCorrect: true
      },
      { 
        id: "save-all", 
        text: "Save the entire allowance, skip wants", 
        emoji: "💰", 
        isCorrect: false
      },
      { 
        id: "random", 
        text: "Spend randomly without a plan", 
        emoji: "🎲", 
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    title: "Part-Time Job Earnings",
    description: "You earn ₹2500 from a part-time job. Which approach ensures financial stability and fun?",
    amount: 2500,
    options: [
     
      { 
        id: "spend-all", 
        text: "Spend all immediately on desires", 
        emoji: "💸", 
        isCorrect: false
      },
      { 
        id: "invest-only", 
        text: "Invest everything, ignore monthly needs", 
        emoji: "📈", 
        isCorrect: false
      },
       { 
        id: "balanced-approach", 
        text: "Cover essentials first, allocate for fun and save remainder", 
        emoji: "⚖️", 
        isCorrect: true
      },
      { 
        id: "hoard", 
        text: "Keep cash unused without purpose", 
        emoji: "📦", 
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    title: "Scholarship Budgeting",
    description: "You receive ₹1800 as scholarship. How do you make it last the month efficiently?",
    amount: 1800,
    options: [
      { 
        id: "needs-first", 
        text: "Cover essentials first, allocate small amount for fun", 
        emoji: "🎓", 
        isCorrect: true
      },
      { 
        id: "luxury-spending", 
        text: "Spend all on luxury items", 
        emoji: "💎", 
        isCorrect: false
      },
      { 
        id: "ignore-budget", 
        text: "Ignore budgeting, spend randomly", 
        emoji: "😴", 
        isCorrect: false
      },
      { 
        id: "invest-all", 
        text: "Invest full amount in risky assets", 
        emoji: "📈", 
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    title: "Gift Money Management",
    description: "You get ₹3000 as a gift. What is the smart monthly budget strategy?",
    amount: 3000,
    options: [
      { 
        id: "instant-gratification", 
        text: "Spend it all at once for instant pleasure", 
        emoji: "🎁", 
        isCorrect: false
      },
      { 
        id: "save-unplanned", 
        text: "Hoard it without planning", 
        emoji: "📦", 
        isCorrect: false
      },
      { 
        id: "share-entirely", 
        text: "Give all to friends or charity immediately", 
        emoji: "🤝", 
        isCorrect: false
      },
      { 
        id: "strategic-plan", 
        text: "Allocate for needs, savings, and some fun", 
        emoji: "📝", 
        isCorrect: true
      }
    ]
  },
  {
    id: 5,
    title: "Seasonal Earnings Budget",
    description: "You earn ₹2200 from a summer job. Which plan maximizes benefits while avoiding waste?",
    amount: 2200,
    options: [
      { 
        id: "random-spending", 
        text: "Spend randomly without thinking", 
        emoji: "🎲", 
        isCorrect: false
      },
      { 
        id: "structured-plan", 
        text: "Plan for essentials, savings, and treat yourself wisely", 
        emoji: "🎯", 
        isCorrect: true
      },
      { 
        id: "debt-repayment", 
        text: "Use it to pay off debt only", 
        emoji: "💳", 
        isCorrect: false
      },
      
      { 
        id: "save-all", 
        text: "Save entire earnings without spending", 
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
      title="Simulation: Monthly Budget"
      subtitle={!showResult ? `Scenario ${currentScenario + 1} of ${scenarios.length}` : "Simulation Complete!"}
      score={score}
      currentLevel={currentScenario + 1}
      totalLevels={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={scenarios.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/reflex-smart-spend"
      nextGameIdProp="finance-teens-39"
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
                <h3 className="text-2xl font-bold text-white mb-4">Excellent Budgeting!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {scenarios.length} scenarios correct!
                  You're mastering the art of prioritizing needs over wants!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Always pay for needs first, then allocate remaining money to wants. This ensures financial stability!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {scenarios.length} scenarios correct.
                  Remember: Needs come first, then wants!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Allocate 60% to needs (essential expenses) and 40% to wants (optional expenses) for a balanced budget.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationMonthlyBudget;

