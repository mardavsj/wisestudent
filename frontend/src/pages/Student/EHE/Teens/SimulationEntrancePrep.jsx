import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationEntrancePrep = () => {
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
      text: "Teen has an entrance exam. What approach should she take?",
      options: [
        
        {
          id: "b",
          text: "Skip preparation",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "c",
          text: "Last-minute panic",
          emoji: "😰",
          isCorrect: false
        },
        {
          id: "a",
          text: "Study regularly",
          emoji: "📚",
          isCorrect: true
        },
        {
          id: "d",
          text: "Cram everything at once",
          emoji: "😵",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How should she prepare for the exam?",
      options: [
        {
          id: "a",
          text: "Create a study schedule and practice tests",
          emoji: "📅",
          isCorrect: true
        },
        {
          id: "b",
          text: "Study only favorite subjects",
          emoji: "❤️",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid weak areas",
          emoji: "🙈",
          isCorrect: false
        },
        {
          id: "d",
          text: "Memorize without understanding",
          emoji: "🧠",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What resources should she use for preparation?",
      options: [
        
        {
          id: "b",
          text: "Only social media",
          emoji: "📱",
          isCorrect: false
        },
        {
          id: "c",
          text: "Copy others' notes",
          emoji: "📎",
          isCorrect: false
        },
        {
          id: "a",
          text: "Books, online courses, and coaching",
          emoji: "📖",
          isCorrect: true
        },
        {
          id: "d",
          text: "Avoid all study material",
          emoji: "🗑️",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How can she manage exam stress?",
      options: [
        {
          id: "a",
          text: "Regular exercise and adequate sleep",
          emoji: "😴",
          isCorrect: true
        },
        {
          id: "b",
          text: "Drink excessive caffeine",
          emoji: "☕",
          isCorrect: false
        },
        {
          id: "c",
          text: "Stay awake all night",
          emoji: "🌙",
          isCorrect: false
        },
        {
          id: "d",
          text: "Avoid all breaks",
          emoji: "⛔",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What should she do on exam day?",
      options: [
        
        {
          id: "b",
          text: "Rush at the last minute",
          emoji: "🏃",
          isCorrect: false
        },
        {
          id: "c",
          text: "Panic about difficult questions",
          emoji: "😱",
          isCorrect: false
        },
        {
          id: "a",
          text: "Arrive early and stay calm",
          emoji: "⏰",
          isCorrect: true
        },
        {
          id: "d",
          text: "Give up halfway",
          emoji: "🏳️",
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
    navigate("/games/ehe/teens");
  };

  return (
    <GameShell
      title="Simulation: Entrance Prep"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-68"
      gameType="ehe"
      totalLevels={scenarios.length}
      currentLevel={currentStep + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    
      nextGamePathProp="/student/ehe/teens/reflex-teen-awareness"
      nextGameIdProp="ehe-teen-69">
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Step {currentStep + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="text-2xl font-bold text-white mb-2">Entrance Exam Prep Simulator</h3>
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

export default SimulationEntrancePrep;