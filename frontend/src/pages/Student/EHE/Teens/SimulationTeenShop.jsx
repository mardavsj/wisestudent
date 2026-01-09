import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationTeenShop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      text: "Teen opens a small shop. What should be the first priority?",
      options: [
        
        {
          id: "b",
          text: "Spend money on decorations before selling anything",
          emoji: "🎨",
          isCorrect: false
        },
        {
          id: "a",
          text: "Keep detailed accounts of income and expenses",
          emoji: "📊",
          isCorrect: true
        },
        {
          id: "c",
          text: "Close the shop because it seems complicated",
          emoji: "🚪",
          isCorrect: false
        },
        {
          id: "d",
          text: "Research competitors and market demand",
          emoji: "🕵️",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "The shop's first week shows more expenses than income. What should the teen do?",
      options: [
        {
          id: "a",
          text: "Analyze expenses, adjust pricing or reduce costs",
          emoji: "🔍",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore the numbers and hope it gets better",
          emoji: "🙈",
          isCorrect: false
        },
        {
          id: "c",
          text: "Spend more money on advertising immediately",
          emoji: "📢",
          isCorrect: false
        },
        {
          id: "d",
          text: "Seek advice from a business mentor",
          emoji: "👨‍🏫",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "A customer wants to buy an item on credit. How should the teen handle this?",
      options: [
        
        {
          id: "b",
          text: "Give credit to every customer without records",
          emoji: "🤝",
          isCorrect: false
        },
        {
          id: "c",
          text: "Refuse all credit sales completely",
          emoji: "❌",
          isCorrect: false
        },
        {
          id: "a",
          text: "Establish clear credit terms and track receivables",
          emoji: "📝",
          isCorrect: true
        },
        {
          id: "d",
          text: "Offer installment plans for larger purchases",
          emoji: "💳",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "The shop has a good month with high profits. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Save some profit, reinvest some, spend some responsibly",
          emoji: "🎯",
          isCorrect: true
        },
        {
          id: "b",
          text: "Spend all profit immediately on personal items",
          emoji: "🎉",
          isCorrect: false
        },
        {
          id: "c",
          text: "Never take any money out of the business",
          emoji: "🔒",
          isCorrect: false
        },
        {
          id: "d",
          text: "Expand to multiple locations immediately",
          emoji: "🏙️",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How often should the teen review the shop's financial statements?",
      options: [
        
        {
          id: "b",
          text: "Once a year when taxes are due",
          emoji: "🗓️",
          isCorrect: false
        },
        {
          id: "c",
          text: "Never - just hope everything works out",
          emoji: "🤞",
          isCorrect: false
        },
        {
          id: "d",
          text: "Daily for detailed transaction monitoring",
          emoji: "📈",
          isCorrect: false
        },
        {
          id: "a",
          text: "Regularly (weekly or monthly) to track performance",
          emoji: "📅",
          isCorrect: true
        },
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentScenario().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }

    setChoices([...choices, { step: currentStep, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentStep < scenarios.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const getCurrentScenario = () => scenarios[currentStep];

  const handleNext = () => {
    navigate("/student/ehe/teens/reflex-business-alert");
  };

  return (
    <GameShell
      title="Simulation: Teen Shop"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-28"
      gameType="ehe"
      totalLevels={30}
      currentLevel={28}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    
      nextGamePathProp="/student/ehe/teens/reflex-business-alert"
      nextGameIdProp="ehe-teen-29">
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Step {currentStep + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🏪</div>
            <h3 className="text-2xl font-bold text-white mb-2">Teen Shop Simulator</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentScenario().text}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {getCurrentScenario().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>

                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default SimulationTeenShop;