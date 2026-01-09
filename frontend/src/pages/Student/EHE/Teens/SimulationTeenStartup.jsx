import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationTeenStartup = () => {
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
      text: "As a teen entrepreneur, you must choose between product options for your startup:",
      options: [
        {
          id: "a",
          text: "Cheap product that harms the environment",
          emoji: "💰",
          isCorrect: false
        },
        {
          id: "d",
          text: "Emphasize your unique value proposition and quality",
          emoji: "✨",
          isCorrect: true
        },
        {
          id: "b",
          text: "Safe, eco-friendly product with higher costs",
          emoji: "🌱",
          isCorrect: false
        },
        {
          id: "c",
          text: "Copy a competitor's product exactly",
          emoji: "📋",
          isCorrect: false
        },
        
      ]
    },
    {
      id: 2,
      text: "Your startup receives investment offers from different sources:",
      options: [
         {
          id: "b",
          text: "Patient investor who supports your mission",
          emoji: "🎯",
          isCorrect: true
        },
        {
          id: "a",
          text: "Investor who demands quick returns and cost-cutting",
          emoji: "⏱️",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Investor who wants to control all decisions",
          emoji: "👑",
          isCorrect: false
        },
        {
          id: "d",
          text: "Investor who offers moderate funding with reasonable terms",
          emoji: "🤝",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should you price your eco-friendly product?",
      options: [
        {
          id: "a",
          text: "Extremely high to maximize profit per unit",
          emoji: "💎",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Below cost to gain market share quickly",
          emoji: "📉",
          isCorrect: false
        },
        {
          id: "d",
          text: "Match competitor prices exactly",
          emoji: "🔁",
          isCorrect: false
        },
        {
          id: "b",
          text: "Balanced pricing that covers costs and allows growth",
          emoji: "⚖️",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "A competitor launches a similar product at a lower price. How do you respond?",
      options: [
        {
          id: "a",
          text: "Lower your prices to match, even if it means cutting quality",
          emoji: "⬇️",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Give up and quit the market",
          emoji: "🏳️",
          isCorrect: false
        },
        {
          id: "b",
          text: "Differentiate your product through unique features and branding",
          emoji: "🌟",
          isCorrect: true
        },
        {
          id: "d",
          text: "Focus on improving customer service to retain clients",
          emoji: "👥",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How should you measure your startup's success?",
      options: [
        {
          id: "a",
          text: "Only financial metrics like revenue and profit",
          emoji: "📊",
          isCorrect: false
        },
        {
          id: "b",
          text: "Balanced metrics including social impact and sustainability",
          emoji: "🌍",
          isCorrect: true
        },
        {
          id: "c",
          text: "Number of social media followers only",
          emoji: "📱",
          isCorrect: false
        },
        {
          id: "d",
          text: "Customer satisfaction and retention rates",
          emoji: "😊",
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
    navigate("/student/ehe/teens/reflex-teen-responsibility");
  };

  return (
    <GameShell
      title="Simulation: Teen Startup"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-88"
      gameType="ehe"
      totalLevels={90}
      currentLevel={88}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    
      nextGamePathProp="/student/ehe/teens/reflex-teen-responsibility"
      nextGameIdProp="ehe-teen-89">
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Step {currentStep + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🏢</div>
            <h3 className="text-2xl font-bold text-white mb-2">Teen Startup Simulator</h3>
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

export default SimulationTeenStartup;