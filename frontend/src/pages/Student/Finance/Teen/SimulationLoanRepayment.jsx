import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SimulationLoanRepayment = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-58");
  const gameId = gameData?.id || "finance-teens-58";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SimulationLoanRepayment, using fallback ID");
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
    title: "Smart Borrowing Decision",
    description: "You need ₹1000 for a laptop. What's the smartest loan approach?",
    options: [
      { 
        id: "borrow-all", 
        text: "Borrow full amount without checking interest", 
        emoji: "💸", 
        isCorrect: false
      },
      
      { 
        id: "multiple-loans", 
        text: "Take multiple small loans from different lenders", 
        emoji: "🔢", 
        isCorrect: false
      },
      { 
        id: "wait", 
        text: "Wait indefinitely without plan", 
        emoji: "⏳", 
        isCorrect: false
      },
      { 
        id: "calculate-interest", 
        text: "Calculate interest, compare options, borrow wisely", 
        emoji: "🧮", 
        isCorrect: true
      },
    ]
  },
  {
    id: 2,
    title: "Prioritizing Loan Repayment",
    description: "You have 2 loans: ₹500 at 5% interest, ₹1000 at 12%. What should you repay first?",
    options: [
      { 
        id: "small-first", 
        text: "Repay smaller loan first", 
        emoji: "📏", 
        isCorrect: false
      },
      
      { 
        id: "equal", 
        text: "Split equally between both", 
        emoji: "⚖️", 
        isCorrect: false
      },
      { 
        id: "high-interest", 
        text: "Repay high-interest loan first", 
        emoji: "🔥", 
        isCorrect: true
      },
      { 
        id: "ignore", 
        text: "Ignore and pay randomly", 
        emoji: "🤷", 
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    title: "Impulse vs Planned Loan",
    description: "A friend suggests a loan to buy the latest phone. What’s wise?",
    options: [
      { 
        id: "impulse", 
        text: "Take loan impulsively to buy immediately", 
        emoji: "📱", 
        isCorrect: false
      },
      { 
        id: "planned", 
        text: "Plan repayment, assess need vs want, borrow if essential", 
        emoji: "📝", 
        isCorrect: true
      },
      { 
        id: "borrow-more", 
        text: "Borrow more than needed for extra perks", 
        emoji: "💎", 
        isCorrect: false
      },
      { 
        id: "skip-loan", 
        text: "Skip loan and risk missing opportunity", 
        emoji: "⏰", 
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    title: "Loan for Non-Essentials",
    description: "You want a bike worth ₹5000 but have only ₹1000 saved. Smart loan strategy?",
    options: [
      { 
        id: "save-then-borrow", 
        text: "Save part amount, borrow remaining with manageable EMI", 
        emoji: "💳", 
        isCorrect: true
      },
      { 
        id: "borrow-all", 
        text: "Borrow full ₹5000 immediately", 
        emoji: "🏍️", 
        isCorrect: false
      },
      
      { 
        id: "multiple-lenders", 
        text: "Borrow small from multiple sources to buy fast", 
        emoji: "🔢", 
        isCorrect: false
      },
      { 
        id: "delay", 
        text: "Wait without plan until you have full cash", 
        emoji: "⏳", 
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    title: "Emergency Loan Use",
    description: "You need ₹1200 for medical emergency. What’s safe borrowing advice?",
    options: [
      { 
        id: "use-loan-for-wants", 
        text: "Use emergency loan for non-essential wants", 
        emoji: "🎮", 
        isCorrect: false
      },
      
      { 
        id: "borrow-large", 
        text: "Borrow more than needed for safety buffer", 
        emoji: "💰", 
        isCorrect: false
      },
      { 
        id: "emergency-only", 
        text: "Use loans only for genuine emergencies", 
        emoji: "🚑", 
        isCorrect: true
      },
      { 
        id: "ignore-loan", 
        text: "Avoid loan even in emergency", 
        emoji: "🙅", 
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
      title="Simulation: Loan Repayment"
      subtitle={!showResult ? `Scenario ${currentScenario + 1} of ${scenarios.length}` : "Simulation Complete!"}
      score={score}
      currentLevel={currentScenario + 1}
      totalLevels={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={scenarios.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/reflex-debt-control"
      nextGameIdProp="finance-teens-59"
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
                <h3 className="text-2xl font-bold text-white mb-4">Excellent Loan Management!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {scenarios.length} scenarios correct!
                  You're mastering responsible loan practices!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Always calculate loan repayment before borrowing and prioritize needs over wants!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {scenarios.length} scenarios correct.
                  Remember to calculate before borrowing!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Only borrow for needs and ensure you can afford the monthly payments!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationLoanRepayment;

