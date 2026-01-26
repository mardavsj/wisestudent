import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SimulationMonthlyMoney = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-8";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenarios = [
  {
    id: 1,
    title: "Smart Allowance Allocation",
    description: "You get ₹500 monthly allowance. How should you manage it to balance fun and savings?",
    choices: [
      { 
        id: "save-half", 
        text: "Save ₹250, spend ₹250 on wants", 
        emoji: "💰", 
        isCorrect: true
      },
      { 
        id: "spend-all", 
        text: "Spend all immediately on treats", 
        emoji: "🛍️", 
        isCorrect: false
      },
      { 
        id: "lend-friends", 
        text: "Lend to friends without plan", 
        emoji: "👥", 
        isCorrect: false
      },
      { 
        id: "invest-all", 
        text: "Invest full amount in risky scheme", 
        emoji: "📈", 
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    title: "Handling Unexpected Costs",
    description: "Your headphones break, repair costs ₹300. You have ₹200 saved. What’s the smart move?",
    choices: [
      { 
        id: "borrow", 
        text: "Borrow remaining from parents immediately", 
        emoji: "👨‍👩‍👧‍👦", 
        isCorrect: false
      },
      { 
        id: "save-plus-earn", 
        text: "Use savings and earn remaining to cover cost", 
        emoji: "🏦", 
        isCorrect: true
      },
      { 
        id: "credit-use", 
        text: "Use credit card without plan", 
        emoji: "💳", 
        isCorrect: false
      },
      { 
        id: "ignore", 
        text: "Ignore the problem and wait", 
        emoji: "⏰", 
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    title: "Bonus Money Strategy",
    description: "You get ₹200 bonus for high grades. How should you use it?",
    choices: [
      { 
        id: "spend-all", 
        text: "Spend everything on snacks and games", 
        emoji: "🎉", 
        isCorrect: false
      },
      { 
        id: "lend-friends", 
        text: "Lend it to friends for fun", 
        emoji: "👥", 
        isCorrect: false
      },
      { 
        id: "save-treat", 
        text: "Save most, use small portion for treat", 
        emoji: "🎯", 
        isCorrect: true
      },
      { 
        id: "donate-all", 
        text: "Donate entire bonus", 
        emoji: "💝", 
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    title: "Part-Time Job Earnings",
    description: "You earn ₹1000 from part-time work. How can you use it wisely for the month?",
    choices: [
      { 
        id: "spend-lifestyle", 
        text: "Spend all on lifestyle without plan", 
        emoji: "🛍️", 
        isCorrect: false
      },
      { 
        id: "split-save-spend", 
        text: "Save 50%, spend 50% strategically", 
        emoji: "📈", 
        isCorrect: true
      },
      { 
        id: "invest-risky", 
        text: "Invest in risky schemes entirely", 
        emoji: "🎰", 
        isCorrect: false
      },
      { 
        id: "crypto-only", 
        text: "Put everything in crypto", 
        emoji: "🪙", 
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    title: "Balancing Wants and Needs",
    description: "You want ₹800 shoes but need ₹500 textbooks. What’s the financially smart choice?",
    choices: [
      { 
        id: "credit-both", 
        text: "Buy both on credit immediately", 
        emoji: "💸", 
        isCorrect: false
      },
      { 
        id: "buy-wants-first", 
        text: "Buy shoes first, textbooks later", 
        emoji: "👟", 
        isCorrect: false
      },
      { 
        id: "borrow-money", 
        text: "Borrow extra money for both", 
        emoji: "💳", 
        isCorrect: false
      },
      { 
        id: "buy-needs-first", 
        text: "Buy textbooks first, save or plan for shoes later", 
        emoji: "📚", 
        isCorrect: true
      }
    ]
  }
];


  const handleChoice = (selectedChoice) => {
    const newChoices = [...choices, { 
      scenarioId: scenarios[currentScenario].id, 
      choice: selectedChoice,
      isCorrect: scenarios[currentScenario].choices.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = scenarios[currentScenario].choices.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next scenario or show results
    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentScenario(prev => prev + 1);
      }, isCorrect ? 1000 : 0); // Delay if correct to show animation
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentScenario(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/finance/teen/reflex-wise-use");
  };

  const getCurrentScenario = () => scenarios[currentScenario];

  return (
    <GameShell
      title="Simulation: Monthly Money"
      score={coins}
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/finance/teen/reflex-wise-use"
      nextGameIdProp="finance-teens-9"
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp} // Pass if 3 or more correct
      showGameOver={showResult && finalScore >= 3}
      
      gameId="finance-teens-8"
      gameType="finance"
      totalLevels={5}
      currentLevel={8}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
                <span className="text-yellow-400 font-bold">Coins: {coins}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{getCurrentScenario().title}</h3>
              <p className="text-white text-lg mb-6">
                {getCurrentScenario().description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {getCurrentScenario().choices.map(choice => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice.id)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-3xl mb-3">{choice.emoji}</div>
                      <h4 className="font-bold text-lg mb-2">{choice.text}</h4>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Simulation!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {finalScore} smart money decisions out of {scenarios.length} scenarios!
                  You're learning to manage money wisely!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  You understand the importance of saving, prioritizing needs over wants, and avoiding risky financial decisions!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {finalScore} smart money decisions out of {scenarios.length} scenarios.
                  Remember, saving money and making thoughtful financial decisions are important!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to choose the option that saves money and makes thoughtful financial decisions.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationMonthlyMoney;