import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationTeenBusiness = () => {
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
      text: "Teen runs an online store. Customer orders arrive. What should she do?",
      options: [
        {
          id: "a",
          text: "Deliver on time",
          emoji: "📦",
          isCorrect: true
        },
        {
          id: "b",
          text: "Delay delivery",
          emoji: "⏰",
          isCorrect: false
        },
        {
          id: "c",
          text: "Quit the business",
          emoji: "🏳️",
          isCorrect: false
        },
        {
          id: "d",
          text: "Ignore customer messages",
          emoji: "🔇",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How should she handle customer complaints?",
      options: [
        
        {
          id: "b",
          text: "Argue with customers",
          emoji: "😠",
          isCorrect: false
        },
        {
          id: "a",
          text: "Listen and resolve issues professionally",
          emoji: "👂",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore all complaints",
          emoji: "🙈",
          isCorrect: false
        },
        {
          id: "d",
          text: "Blame suppliers only",
          emoji: "😤",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What approach should she take to pricing?",
      options: [
       
        {
          id: "b",
          text: "Price randomly",
          emoji: "🎲",
          isCorrect: false
        },
        {
          id: "c",
          text: "Always undercut competitors",
          emoji: "📉",
          isCorrect: false
        },
         {
          id: "a",
          text: "Research market rates and stay competitive",
          emoji: "📊",
          isCorrect: true
        },
        {
          id: "d",
          text: "Charge maximum without value",
          emoji: "💸",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How should she manage finances?",
      options: [
        
        {
          id: "b",
          text: "Spend without records",
          emoji: "💳",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore all financial data",
          emoji: "🗑️",
          isCorrect: false
        },
        {
          id: "d",
          text: "Overspend consistently",
          emoji: "💸",
          isCorrect: false
        },
        {
          id: "a",
          text: "Track income and expenses carefully",
          emoji: "💰",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "What should she do to grow her business?",
      options: [
        {
          id: "a",
          text: "Improve quality and seek feedback",
          emoji: "📈",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stop innovating",
          emoji: "🛑",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid customer interaction",
          emoji: "🔇",
          isCorrect: false
        },
        {
          id: "d",
          text: "Copy competitors without improvement",
          emoji: "📎",
          isCorrect: false
        }
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
    navigate("/games/ehe/teens");
  };

  return (
    <GameShell
      title="Simulation: Teen Business"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-48"
      gameType="ehe"
      totalLevels={10}
      currentLevel={8}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    
      nextGamePathProp="/student/ehe/teens/reflex-teen-boss"
      nextGameIdProp="ehe-teen-49">
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Step {currentStep + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🏪</div>
            <h3 className="text-2xl font-bold text-white mb-2">Teen Business Simulator</h3>
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

export default SimulationTeenBusiness;