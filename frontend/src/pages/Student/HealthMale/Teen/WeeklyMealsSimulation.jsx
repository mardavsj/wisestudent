import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const WeeklyMealsSimulation = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-18";

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
  {
    id: 1,
    day: "Monday Breakfast",
    situation: "You have a long school day and morning sports practice.",
    options: [
      {
        id: "a",
        text: "Sugary cereal only",
        emoji: "🥣",
        isCorrect: false
      },
      {
        id: "b",
        text: "Toast with jam",
        emoji: "🍞",
        isCorrect: false
      },
      {
        id: "c",
        text: "Peanut butter sandwich",
        emoji: "🥪",
        isCorrect: false
      },
      {
        id: "d",
        text: "Egg wrap with vegetables",
        emoji: "🌯",
        isCorrect: true
      }
    ]
  },
  {
    id: 2,
    day: "Tuesday Lunch",
    situation: "You feel sleepy after yesterday’s heavy dinner.",
    options: [
      {
        id: "a",
        text: "Extra cheesy pasta",
        emoji: "🧀",
        isCorrect: false
      },
      {
        id: "b",
        text: "Instant noodles",
        emoji: "🍜",
        isCorrect: false
      },
      {
        id: "c",
        text: "Rice, lentils & salad",
        emoji: "🍚",
        isCorrect: true
      },
      {
        id: "d",
        text: "Energy drink",
        emoji: "⚡",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    day: "Wednesday Snack",
    situation: "You need focus for an evening exam revision.",
    options: [
      {
        id: "a",
        text: "Chocolate bar",
        emoji: "🍫",
        isCorrect: false
      },
      {
        id: "c",
        text: "Roasted chickpeas",
        emoji: "🌰",
        isCorrect: true
      },
      {
        id: "b",
        text: "Flavored chips",
        emoji: "🍟",
        isCorrect: false
      },
      
      {
        id: "d",
        text: "Cold soda",
        emoji: "🥤",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    day: "Thursday Dinner",
    situation: "You worked out in the evening and need recovery food.",
    options: [
      {
        id: "c",
        text: "Paneer stir-fry with veggies",
        emoji: "🥘",
        isCorrect: true
      },
      {
        id: "a",
        text: "Plain white rice",
        emoji: "🍚",
        isCorrect: false
      },
      {
        id: "b",
        text: "Fried street food",
        emoji: "🍗",
        isCorrect: false
      },
      
      {
        id: "d",
        text: "Skip dinner",
        emoji: "🚫",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    day: "Friday Treat Choice",
    situation: "Friends plan a food hangout after school.",
    options: [
      {
        id: "a",
        text: "Unlimited fast food challenge",
        emoji: "🍔",
        isCorrect: false
      },
      {
        id: "b",
        text: "Only dessert, no meal",
        emoji: "🍰",
        isCorrect: false
      },
      {
        id: "c",
        text: "Balanced meal + one treat",
        emoji: "⚖️",
        isCorrect: true
      },
      {
        id: "d",
        text: "Skip food to save calories",
        emoji: "🤐",
        isCorrect: false
      }
    ]
  }
];


  const handleChoice = (optionId) => {
    const selectedOption = scenarios[currentScenario].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/reflex-smart-drink");
  };

  return (
    <GameShell
      title="Weekly Meals Simulation"
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
            {scenarios[currentScenario].day}
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
      {gameFinished && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Simulation Complete!</h3>
          <p className="text-xl text-white/90 mb-6">
            You earned {coins} coins!
          </p>
          <p className="text-white/80 mb-8">
            Healthy eating habits will help you grow strong!
          </p>
          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all transform hover:scale-105"
          >
            Next Challenge
          </button>
        </div>
      )}
    </GameShell>
  );
};

export default WeeklyMealsSimulation;
