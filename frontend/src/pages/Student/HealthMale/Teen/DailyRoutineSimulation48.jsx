import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DailyRoutineSimulation48 = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-48";

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const steps = [
  {
    id: 1,
    time: "6:45 AM",
    activity: "You wake up feeling slightly dehydrated and sluggish.",
    options: [
      {
        id: "a",
        text: "Ignore it and rush out",
        emoji: "🏃",
        isCorrect: false
      },
      {
        id: "b",
        text: "Drink water + light movement",
        emoji: "🧘",
        isCorrect: true
      },
      {
        id: "c",
        text: "Energy drink immediately",
        emoji: "⚡",
        isCorrect: false
      },
      {
        id: "d",
        text: "Scroll social media in bed",
        emoji: "📱",
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    time: "7:20 AM",
    activity: "Weather is humid. You’ll be active all day.",
    options: [
      
      {
        id: "b",
        text: "Wear thick fashionable clothes",
        emoji: "🧥",
        isCorrect: false
      },
      {
        id: "c",
        text: "Layer heavily to look cool",
        emoji: "😎",
        isCorrect: false
      },
      {
        id: "d",
        text: "Reuse yesterday’s outfit",
        emoji: "🔁",
        isCorrect: false
      },
      {
        id: "a",
        text: "Choose breathable fabrics",
        emoji: "🌬️",
        isCorrect: true
      },
    ]
  },
  {
    id: 3,
    time: "1:00 PM",
    activity: "After lunch, you feel sticky and uncomfortable.",
    options: [
      
      {
        id: "b",
        text: "Ignore discomfort",
        emoji: "🙃",
        isCorrect: false
      },
      {
        id: "c",
        text: "Blame food only",
        emoji: "🍔",
        isCorrect: false
      },
      {
        id: "a",
        text: "Adjust hygiene discreetly",
        emoji: "🧴",
        isCorrect: true
      },
      {
        id: "d",
        text: "Overuse fragrance",
        emoji: "🌸",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    time: "5:30 PM",
    activity: "You’re tired after activity but have plans later.",
    options: [
      
      {
        id: "b",
        text: "Stay in sweaty clothes",
        emoji: "🥵",
        isCorrect: false
      },
      {
        id: "a",
        text: "Reset body with quick clean + rest",
        emoji: "♻️",
        isCorrect: true
      },
      {
        id: "c",
        text: "Just sit and recover",
        emoji: "🛋️",
        isCorrect: false
      },
      {
        id: "d",
        text: "Cover it up with spray",
        emoji: "🌫️",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    time: "10:00 PM",
    activity: "Before sleep, you reflect on tomorrow.",
    options: [
      {
        id: "a",
        text: "Prepare clothes & hygiene kit",
        emoji: "🎒",
        isCorrect: true
      },
      {
        id: "b",
        text: "Sleep immediately",
        emoji: "😴",
        isCorrect: false
      },
      {
        id: "c",
        text: "Late-night snacks",
        emoji: "🍕",
        isCorrect: false
      },
      {
        id: "d",
        text: "Gaming till midnight",
        emoji: "🎮",
        isCorrect: false
      }
    ]
  }
];


  const handleChoice = (optionId) => {
    const selectedOption = steps[currentStep].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/reflex-hygiene-alert-49");
  };

  return (
    <GameShell
      title="Daily Routine Simulation"
      subtitle={`Scenario ${currentStep + 1} of ${steps.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={steps.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Scenario {currentStep + 1}/{steps.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <h2 className="text-xl font-semibold text-white mb-4">
            {steps[currentStep].time}
          </h2>
          
          <p className="text-white/90 mb-6">
            {steps[currentStep].activity}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps[currentStep].options.map(option => (
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

export default DailyRoutineSimulation48;
