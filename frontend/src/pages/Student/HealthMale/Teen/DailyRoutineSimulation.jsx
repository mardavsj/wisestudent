import React, { useState } from "react";
import { useNavigate,  } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DailyRoutineSimulation = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-8";

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
  {
    id: 1,
    situation: "You wake up feeling mentally foggy before a long school day. Which action best sets your routine in motion?",
    options: [
      {
        id: "a",
        text: "Scroll social media to feel awake",
        emoji: "📱",
        isCorrect: false
      },
      {
        id: "b",
        text: "Lie down longer to recover",
        emoji: "🛌",
        isCorrect: false
      },
      {
        id: "c",
        text: "Skip routine and rush out",
        emoji: "🏃",
        isCorrect: false
      },
      {
        id: "d",
        text: "Hydrate and reset your body",
        emoji: "💧",
        isCorrect: true
      }
    ]
  },
  {
    id: 2,
    situation: "While getting ready, you notice yesterday’s clothes still look fine but don’t smell fresh. What decision shows routine discipline?",
    options: [
      {
        id: "a",
        text: "Use deodorant to mask it",
        emoji: "🧴",
        isCorrect: false
      },
      {
        id: "b",
        text: "Choose freshly cleaned clothes",
        emoji: "👕",
        isCorrect: true
      },
      {
        id: "c",
        text: "Wear it once more",
        emoji: "🔁",
        isCorrect: false
      },
      {
        id: "d",
        text: "Layer clothes to hide it",
        emoji: "🧥",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    situation: "You have a demanding academic day ahead that needs focus and stamina. Which routine choice supports long-term energy?",
    options: [
      {
        id: "a",
        text: "Eat a structured, nourishing meal",
        emoji: "🥗",
        isCorrect: true
      },
      {
        id: "b",
        text: "Rely on caffeine only",
        emoji: "☕",
        isCorrect: false
      },
      {
        id: "c",
        text: "Skip food to save time",
        emoji: "⏭️",
        isCorrect: false
      },
      {
        id: "d",
        text: "Snack randomly all day",
        emoji: "🍫",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    situation: "After returning home, your body feels uncomfortable and unfocused. What routine adjustment improves productivity next?",
    options: [
      {
        id: "a",
        text: "Sit down and start work immediately",
        emoji: "📚",
        isCorrect: false
      },
      {
        id: "b",
        text: "Ignore discomfort and relax",
        emoji: "🛋️",
        isCorrect: false
      },
      {
        id: "c",
        text: "Reset with personal hygiene and fresh clothes",
        emoji: "🚿",
        isCorrect: true
      },
      {
        id: "d",
        text: "Distract yourself with entertainment",
        emoji: "🎮",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    situation: "Before ending your day, which habit strengthens both discipline and mental clarity for tomorrow?",
    options: [
      {
        id: "a",
        text: "Sleep immediately to save time",
        emoji: "😴",
        isCorrect: false
      },
      
      {
        id: "c",
        text: "Stay active online till late",
        emoji: "🌐",
        isCorrect: false
      },
      {
        id: "d",
        text: "Think about plans without acting",
        emoji: "💭",
        isCorrect: false
      },
      {
        id: "b",
        text: "Complete hygiene and prep for next day",
        emoji: "🧼",
        isCorrect: true
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

  const handleNext = () => {
    navigate("/student/health-male/teens/hygiene-alert-reflex");
  };

  return (
    <GameShell
      title="Daily Routine Simulation"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <h2 className="text-xl font-semibold text-white mb-4">
            {scenarios[currentScenario].time}
          </h2>
          
          <p className="text-white/90 mb-6">
            {scenarios[currentScenario].situation}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {scenarios[currentScenario].options.map(option => (
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

export default DailyRoutineSimulation;
