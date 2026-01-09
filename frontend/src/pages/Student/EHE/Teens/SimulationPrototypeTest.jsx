import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationPrototypeTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0); // Add coins state
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      text: "A teen designs an app idea to help students organize homework. What should she do next?",
      options: [
        
        {
          id: "b",
          text: "Hide it and never show anyone",
          emoji: "🙈",
          isCorrect: false
        },
        {
          id: "a",
          text: "Test with friends to get feedback",
          emoji: "👥",
          isCorrect: true
        },
        {
          id: "c",
          text: "Give up because it might have flaws",
          emoji: "🏳️",
          isCorrect: false
        },
        {
          id: "d",
          text: "Create a detailed marketing plan before testing",
          emoji: "📊",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "During testing, users suggest improvements. How should the teen respond?",
      options: [
        {
          id: "a",
          text: "Listen carefully and consider the feedback",
          emoji: "👂",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore all feedback to preserve her vision",
          emoji: "🙉",
          isCorrect: false
        },
        {
          id: "c",
          text: "Get defensive and argue with users",
          emoji: "😠",
          isCorrect: false
        },
        {
          id: "d",
          text: "Thank users and document all suggestions for later review",
          emoji: "📝",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "The prototype has some issues users identified. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Refine the prototype based on feedback",
          emoji: "🔧",
          isCorrect: true
        },
        {
          id: "b",
          text: "Launch immediately without changes",
          emoji: "🚀",
          isCorrect: false
        },
        {
          id: "c",
          text: "Start over completely from scratch",
          emoji: "🗑️",
          isCorrect: false
        },
        {
          id: "d",
          text: "Prioritize fixes based on impact and feasibility",
          emoji: "🎯",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How many rounds of testing and refinement are ideal?",
      options: [
       
        {
          id: "b",
          text: "Just one round then launch",
          emoji: "1️⃣",
          isCorrect: false
        },
        {
          id: "c",
          text: "Never test - go straight to market",
          emoji: "⏩",
          isCorrect: false
        },
         {
          id: "a",
          text: "Multiple rounds to improve the solution",
          emoji: "🔄",
          isCorrect: true
        },
        {
          id: "d",
          text: "Continue until all users are completely satisfied",
          emoji: "💯",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the benefit of testing with diverse users?",
      options: [
        
        {
          id: "b",
          text: "Complicates the development process",
          emoji: "🔄",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only test with similar people",
          emoji: "👥",
          isCorrect: false
        },
        {
          id: "d",
          text: "Validates assumptions across different user groups",
          emoji: "✅",
          isCorrect: false
        },
        {
          id: "a",
          text: "Reveals different perspectives and needs",
          emoji: "🌍",
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
      setCoins(prev => prev + 1); // Increment coins when correct
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
    navigate("/student/ehe/teens/reflex-teen-design-thinking");
  };

  return (
    <GameShell
      title="Simulation: Prototype Test"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-38"
      gameType="ehe"
      totalLevels={scenarios.length}
      currentLevel={currentStep + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    
      nextGamePathProp="/student/ehe/teens/reflex-teen-design-thinking"
      nextGameIdProp="ehe-teen-39">
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Step {currentStep + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-2xl font-bold text-white mb-2">Prototype Testing Simulator</h3>
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

export default SimulationPrototypeTest;