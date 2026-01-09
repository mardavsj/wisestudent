import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SimulationCharityChoice = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-98");
  const gameId = gameData?.id || "finance-teens-98";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SimulationCharityChoice, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const scenarios = [
  {
    id: 1,
    title: "Impact vs Emotion",
    description: "You want to donate ₹1000. Which choice creates the most real impact?",
    options: [
      {
        id: "street",
        text: "Give cash randomly on the street",
        emoji: "🤲",
        isCorrect: false
      },
      {
        id: "trusted",
        text: "Donate to a verified charity with clear reports",
        emoji: "📋",
        isCorrect: true
      },
      {
        id: "viral",
        text: "Donate to trending online campaigns",
        emoji: "🔥",
        isCorrect: false
      },
      {
        id: "delay",
        text: "Wait forever for the perfect moment",
        emoji: "⏳",
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    title: "Short-Term Help vs Long-Term Change",
    description: "A charity can either provide meals today or education support for months. What’s smarter?",
    options: [
      {
        id: "education",
        text: "Support education & skill-building",
        emoji: "🎓",
        isCorrect: true
      },
      {
        id: "meals",
        text: "One-time food distribution",
        emoji: "🍱",
        isCorrect: false
      },
      
      {
        id: "split",
        text: "Randomly split money",
        emoji: "🎲",
        isCorrect: false
      },
      {
        id: "none",
        text: "Avoid donating",
        emoji: "🙈",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    title: "Transparency Check",
    description: "Before donating, what should you check first?",
    options: [
      {
        id: "celebrity",
        text: "Celebrity endorsement",
        emoji: "🌟",
        isCorrect: false
      },
      {
        id: "emotional",
        text: "Emotional stories only",
        emoji: "😢",
        isCorrect: false
      },
      
      {
        id: "pressure",
        text: "Social pressure",
        emoji: "👥",
        isCorrect: false
      },
      {
        id: "reports",
        text: "Financial transparency & impact reports",
        emoji: "📊",
        isCorrect: true
      },
    ]
  },
  {
    id: 4,
    title: "Charity vs Personal Growth",
    description: "You have limited money. What builds both empathy and financial sense?",
    options: [
      {
        id: "donate-blind",
        text: "Donate without understanding",
        emoji: "🙃",
        isCorrect: false
      },
      
      {
        id: "spend",
        text: "Spend everything on yourself",
        emoji: "🛍️",
        isCorrect: false
      },
      {
        id: "learn",
        text: "Learn about causes, then donate mindfully",
        emoji: "🧠",
        isCorrect: true
      },
      {
        id: "avoid",
        text: "Avoid charity completely",
        emoji: "🚫",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    title: "Sustainable Giving",
    description: "Which habit makes charity effective over a lifetime?",
    options: [
      {
        id: "big-once",
        text: "One big donation once",
        emoji: "💥",
        isCorrect: false
      },
       {
        id: "consistent",
        text: "Small, regular, planned giving",
        emoji: "📅",
        isCorrect: true
      },
      {
        id: "guilt",
        text: "Donate only when feeling guilty",
        emoji: "😬",
        isCorrect: false
      },
     
      {
        id: "impulse",
        text: "Impulse donations",
        emoji: "⚡",
        isCorrect: false
      }
    ]
  }
];


  const handleAnswer = (optionId) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    const scenario = scenarios[currentScenario];
    const selectedOption = scenario.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption?.isCorrect;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    const isLastScenario = currentScenario === scenarios.length - 1;
    
    setTimeout(() => {
      if (isLastScenario) {
        setShowResult(true);
      } else {
        setCurrentScenario(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const current = scenarios[currentScenario];

  return (
    <GameShell
      title="Simulation: Charity Choice"
      subtitle={!showResult ? `Scenario ${currentScenario + 1} of ${scenarios.length}` : "Simulation Complete!"}
      score={score}
      currentLevel={currentScenario + 1}
      totalLevels={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={scenarios.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/reflex-fairness"
      nextGameIdProp="finance-teens-99"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="finance"
    >
      <div className="space-y-8">
        {!showResult && current ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{scenarios.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{current.title}</h3>
              <p className="text-white text-lg mb-6">
                {current.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {current.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-center transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : "bg-red-500/20 border-2 border-red-400 opacity-75"
                        : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="text-4xl">{option.emoji}</span>
                      <span className="font-semibold text-lg">{option.text}</span>

                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default SimulationCharityChoice;

