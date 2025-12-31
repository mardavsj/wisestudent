import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TeenStressDaySimulation = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const scenarios = [
  {
    id: 1,
    text: "Teen has exams and sports practice in the same day. How to manage?",
    options: [
      { id: "a", text: "Panic and do everything at once", emoji: "😰", isCorrect: false },
      { id: "b", text: "Relax, prioritize tasks, and plan schedule", emoji: "📅", isCorrect: true },
      { id: "c", text: "Skip sports and focus only on exams", emoji: "🏃", isCorrect: false },
      { id: "d", text: "Ask teacher or coach for guidance", emoji: "🤝", isCorrect: false }
    ]
  },
  {
    id: 2,
    text: "Feeling overwhelmed during study session. Best approach?",
    options: [
      { id: "a", text: "Take a 10-minute mindfulness break", emoji: "🧘", isCorrect: true },
      { id: "b", text: "Push through without pause", emoji: "💪", isCorrect: false },
      { id: "c", text: "Quit studying for the day", emoji: "😞", isCorrect: false },
      { id: "d", text: "Distract yourself with phone", emoji: "📱", isCorrect: false }
    ]
  },
  {
    id: 3,
    text: "After sports practice, energy is low and stress is high. What helps recover?",
    options: [
      { id: "a", text: "Do more intense exercise", emoji: "🏋️", isCorrect: false },
      { id: "b", text: "Skip meals and sleep", emoji: "😴", isCorrect: false },
      { id: "c", text: "Do light stretching + have a healthy snack", emoji: "🥗", isCorrect: true },
      { id: "d", text: "Take a nap for 2 hours immediately", emoji: "💤", isCorrect: false }
    ]
  },
  {
    id: 4,
    text: "Can't sleep at night due to worries. Best way to calm mind?",
    options: [
      { id: "b", text: "Read a book or listen to calming music", emoji: "🎧", isCorrect: true },
      { id: "a", text: "Scroll social media endlessly", emoji: "📱", isCorrect: false },
      { id: "c", text: "Stare at ceiling and overthink", emoji: "👀", isCorrect: false },
      { id: "d", text: "Write worries in a journal to organize thoughts", emoji: "📝", isCorrect: false }
    ]
  },
  {
    id: 5,
    text: "Friend cancels plans last minute. Healthy response?",
    options: [
      { id: "a", text: "Get angry and lash out", emoji: "😡", isCorrect: false },
      { id: "b", text: "Feel rejected and stay upset", emoji: "😢", isCorrect: false },
      { id: "c", text: "Accept and reschedule without communication", emoji: "🤝", isCorrect: false },
      { id: "d", text: "Communicate calmly and plan an alternative", emoji: "💬", isCorrect: true }
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
    navigate("/student/health-male/teens/reflex-emotional-health");
  };



  return (
    <GameShell
      title="Simulation: Teen Stress Day"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-teen-58"
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
            Stress Day Simulation
          </h2>
          
          <p className="text-white/90 mb-6">
            {scenarios[currentScenario].text}
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
            Managing stress is a daily practice. Keep making healthy choices!
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

export default TeenStressDaySimulation;
