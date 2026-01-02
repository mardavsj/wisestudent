import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationDailyRoutine = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0); // Add coins state
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      title: "Morning Routine",
      description: "It's the start of a new day. What's your morning hygiene routine?",
      options: [
        {
          id: "a",
          text: "Only brush teeth, skip washing face",
          emoji: "🦷",
          isCorrect: false
        },
        {
          id: "b",
          text: "Brush teeth, wash face, shower",
          emoji: "🌞",
          isCorrect: true
        },
        {
          id: "c",
          text: "Follow a consistent skincare routine",
          emoji: "🧴",
          isCorrect: false
        },
        {
          id: "d",
          text: "Skip hygiene completely to save time",
          emoji: "⏰",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "School Day",
      description: "During school, you feel sweaty. What do you do?",
      options: [
        {
          id: "a",
          text: "Ignore the feeling and continue",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ask to go home immediately",
          emoji: "🏠",
          isCorrect: false
        },
        {
          id: "c",
          text: "Use wet wipes and change if possible",
          emoji: "🧻",
          isCorrect: true
        },
        {
          id: "d",
          text: "Carry extra supplies for touch-ups",
          emoji: "🎒",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Period Management",
      description: "You're at school during your period. What's your approach?",
      options: [
        {
          id: "a",
          text: "Change only once at lunch",
          emoji: "🍱",
          isCorrect: false
        },
        {
          id: "b",
          text: "Avoid drinking water to reduce flow",
          emoji: "❌",
          isCorrect: false
        },
        {
          id: "c",
          text: "Regular checks and change during breaks",
          emoji: "🩹",
          isCorrect: true
        },
        {
          id: "d",
          text: "Keep extra supplies in locker or backpack",
          emoji: "🔒",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "After School",
      description: "You return home from school. What's your after-school routine?",
      options: [
        {
          id: "a",
          text: "Continue in school clothes until dinner",
          emoji: "📚",
          isCorrect: false
        },
        {
          id: "b",
          text: "Immediately lie down without changing",
          emoji: "🛋️",
          isCorrect: false
        },
        {
          id: "c",
          text: "Take a quick shower before starting homework",
          emoji: "🚿",
          isCorrect: false
        },
        {
          id: "d",
          text: "Change clothes, wash hands, freshen up",
          emoji: "👕",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      title: "Evening Routine",
      description: "It's bedtime. What's your nighttime hygiene routine?",
      options: [
        {
          id: "a",
          text: "Only brush teeth, skip shower",
          emoji: "🦷",
          isCorrect: false
        },
        {
          id: "b",
          text: "Skip hygiene completely when tired",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "c",
          text: "Prepare tomorrow's outfit and hygiene items",
          emoji: "📅",
          isCorrect: false
        },
        {
          id: "d",
          text: "Shower, wash face, brush teeth, change into clean PJs",
          emoji: "🛁",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = scenarios[currentScenario].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCoins(prev => prev + 1); // Increment coins when correct
    }

    setChoices([...choices, { scenario: currentScenario, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const getCurrentScenario = () => scenarios[currentScenario];

  const handleNext = () => {
    navigate("/student/health-female/teens/reflex-teen-freshness");
  };

  return (
    <GameShell
      title="Simulation: Daily Routine"
      subtitle={`${getCurrentScenario().title}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-48"
      gameType="health-female"
      totalLevels={10}
      currentLevel={8}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentScenario().description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {getCurrentScenario().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default SimulationDailyRoutine;