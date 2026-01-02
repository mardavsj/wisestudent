import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationTeenStressDay = () => {
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
    title: "Morning Rush",
    description: "You wake up late and have an important exam. What do you do?",
    options: [
      {
        id: "a",
        text: "Panic and leave without thinking clearly",
        emoji: "😰",
        isCorrect: false
      },
      {
        id: "b",
        text: "Skip the exam and go back to sleep",
        emoji: "😴",
        isCorrect: false
      },
      {
        id: "c",
        text: "Stay calm, get ready quickly, and focus on key topics",
        emoji: "⏰",
        isCorrect: true
      },
      {
        id: "d",
        text: "Call a friend and waste time talking",
        emoji: "📞",
        isCorrect: false
      }
    ]
  },

  {
    id: 2,
    title: "Practice Session",
    description: "During practice, you make several mistakes. How do you respond?",
    options: [
      {
        id: "a",
        text: "Get upset and stop practicing completely",
        emoji: "😤",
        isCorrect: false
      },
      {
        id: "b",
        text: "Blame others for your mistakes",
        emoji: "😠",
        isCorrect: false
      },
      {
        id: "c",
        text: "Ignore the mistakes and continue without learning",
        emoji: "🙈",
        isCorrect: false
      },
      {
        id: "d",
        text: "Take a short break and then practice with focus",
        emoji: "⏸️",
        isCorrect: true
      }
    ]
  },

  {
    id: 3,
    title: "Lunch Break",
    description: "You're feeling overwhelmed with studies. What's your approach?",
    options: [
      {
        id: "a",
        text: "Skip lunch and keep studying nonstop",
        emoji: "📚",
        isCorrect: false
      },
      {
        id: "c",
        text: "Take a proper break, eat well, and relax",
        emoji: "🍽️",
        isCorrect: true
      },
      {
        id: "b",
        text: "Eat junk food while stressing about work",
        emoji: "🍟",
        isCorrect: false
      },
      
      {
        id: "d",
        text: "Scroll on your phone without resting your mind",
        emoji: "📱",
        isCorrect: false
      }
    ]
  },

  {
    id: 4,
    title: "After School",
    description: "You have extra classes and homework. How do you manage?",
    options: [
      {
        id: "a",
        text: "Do everything at the last minute without planning",
        emoji: "⏳",
        isCorrect: false
      },
      {
        id: "b",
        text: "Procrastinate and feel stressed later",
        emoji: "😴",
        isCorrect: false
      },
      {
        id: "c",
        text: "Avoid homework and distract yourself",
        emoji: "🎮",
        isCorrect: false
      },
      {
        id: "d",
        text: "Plan tasks and manage time wisely",
        emoji: "📋",
        isCorrect: true
      }
    ]
  },

  {
    id: 5,
    title: "Evening Wind-Down",
    description: "After a stressful day, how do you end your day?",
    options: [
      {
        id: "d",
        text: "Relax, think positively, and sleep on time",
        emoji: "🧘",
        isCorrect: true
      },
      {
        id: "a",
        text: "Worry about tomorrow and sleep late",
        emoji: "🌙",
        isCorrect: false
      },
      {
        id: "b",
        text: "Watch screens for hours without resting",
        emoji: "📺",
        isCorrect: false
      },
      {
        id: "c",
        text: "Overplan the next day and feel anxious",
        emoji: "📝",
        isCorrect: false
      },
      
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
    navigate("/student/health-female/teens/reflex-emotional-health");
  };

  return (
    <GameShell
      title="Simulation: Teen Stress Day"
      subtitle={`${getCurrentScenario().title}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-58"
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

export default SimulationTeenStressDay;