import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TeenRoutineSimulation = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-28";

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
    time: "Morning Shower",
    situation: "You're running late for school. What’s the best choice?",
    options: [
      { id: "b", text: "Skip it entirely", emoji: "🏃", isCorrect: false },
      { id: "a", text: "Take a quick 3-min shower", emoji: "🚿", isCorrect: true },
      { id: "c", text: "Only wash underarms", emoji: "🙋‍♂️", isCorrect: false },
      { id: "d", text: "Splash cold water on face", emoji: "💧", isCorrect: false }
    ]
  },
  {
    id: 2,
    time: "Getting Dressed",
    situation: "Your favorite shirt is stained. What’s best?",
    options: [
      { id: "a", text: "Spray perfume on it", emoji: "💨", isCorrect: false },
      { id: "c", text: "Wear it anyway and hope no one notices", emoji: "👔", isCorrect: false },
      { id: "b", text: "Wear a different clean shirt", emoji: "👕", isCorrect: true },
      { id: "d", text: "Cover it with a jacket", emoji: "🧥", isCorrect: false }
    ]
  },
  {
    id: 3,
    time: "After School",
    situation: "You played soccer and are sweaty. What do you do first?",
    options: [
      { id: "a", text: "Wash face and hands", emoji: "🖐️", isCorrect: true },
      { id: "b", text: "Go straight to homework", emoji: "📚", isCorrect: false },
      { id: "c", text: "Take a long shower and skip snack", emoji: "🚿", isCorrect: false },
      { id: "d", text: "Sit on sofa and relax without washing", emoji: "🛋️", isCorrect: false }
    ]
  },
  {
    id: 4,
    time: "Shaving",
    situation: "You notice facial hair. How to shave safely?",
    options: [
      { id: "b", text: "Shave dry with just a razor", emoji: "🌵", isCorrect: false },
      { id: "c", text: "Use only soap", emoji: "🧼", isCorrect: false },
      { id: "d", text: "Pluck with fingers", emoji: "🤏", isCorrect: false },
      { id: "a", text: "Use shaving gel and razor", emoji: "🧴", isCorrect: true },
    ]
  },
  {
    id: 5,
    time: "Bedtime",
    situation: "You are exhausted. How to care for teeth?",
    options: [
      { id: "b", text: "Chew gum instead", emoji: "🍬", isCorrect: false },
      { id: "a", text: "Brush for 2 minutes", emoji: "🪥", isCorrect: true },
      { id: "c", text: "Skip brushing tonight", emoji: "😴", isCorrect: false },
      { id: "d", text: "Brush and floss carefully", emoji: "🦷", isCorrect: false }
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
    navigate("/student/health-male/teens/reflex-healthy-teen");
  };

  return (
    <GameShell
      title="Teen Routine Simulation"
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

export default TeenRoutineSimulation;
