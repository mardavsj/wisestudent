import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MorningRoutineSimulation = () => {
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
      text: "Teen wakes up in the morning. What should she do first?",
      options: [
        {
          id: "a",
          text: "Brush teeth + take shower",
          emoji: "🪥",
          isCorrect: true
        },
        {
          id: "b",
          text: "Brush teeth only",
          emoji: "🪥",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip both",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "d",
          text: "Drink water and do light stretching",
          emoji: "💧",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "After getting ready, teen has her period. What should she do?",
      options: [
        
        {
          id: "b",
          text: "Continue with current product",
          emoji: "❌",
          isCorrect: false
        },
        {
          id: "a",
          text: "Change to fresh sanitary product",
          emoji: "🧻",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore period hygiene",
          emoji: "🚫",
          isCorrect: false
        },
        {
          id: "d",
          text: "Carry extra supplies in backpack",
          emoji: "🎒",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Before school, teen notices oily hair. What should she do?",
      options: [
       
        {
          id: "b",
          text: "Do nothing about oily hair",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "c",
          text: "Wash hair completely",
          emoji: "🚿",
          isCorrect: false
        },
         {
          id: "a",
          text: "Refresh hair with water or dry shampoo",
          emoji: "💧",
          isCorrect: true
        },
        {
          id: "d",
          text: "Style hair to cover the oiliness",
          emoji: "💇",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Teen has an important presentation at school. What hygiene preparation is needed?",
      options: [
        {
          id: "a",
          text: "Full hygiene routine + fresh clothes",
          emoji: "✨",
          isCorrect: true
        },
        {
          id: "b",
          text: "Just brush teeth quickly",
          emoji: "🪥",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip hygiene routine",
          emoji: "🤷",
          isCorrect: false
        },
        {
          id: "d",
          text: "Check breath with mint spray",
          emoji: "🌿",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "After morning routine, teen feels confident. Why?",
      options: [
        
        {
          id: "b",
          text: "Clothes make her feel good",
          emoji: "👕",
          isCorrect: false
        },
        {
          id: "c",
          text: "She's not sure why",
          emoji: "🤔",
          isCorrect: false
        },
        {
          id: "d",
          text: "She prepared well for the day",
          emoji: "📅",
          isCorrect: false
        },
        {
          id: "a",
          text: "Good hygiene boosts self-esteem",
          emoji: "🌟",
          isCorrect: true
        },
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = scenarios[currentStep].options.find(opt => opt.id === optionId);
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
    navigate("/student/health-female/teens/reflex-hygiene-alert");
  };

  return (
    <GameShell
      title="Simulation: Morning Routine"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-8"
      gameType="health-female"
      totalLevels={10}
      currentLevel={8}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    
      nextGamePathProp="/student/health-female/teens/reflex-hygiene-alert"
      nextGameIdProp="health-female-teen-9">
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Step {currentStep + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-2xl font-bold text-white mb-2">Morning Routine Simulator</h3>
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

export default MorningRoutineSimulation;