import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
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
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [coins, setCoins] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

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

  // Set global window variables for useGameFeedback to ensure correct +1 popup
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Force cleanup first to prevent interference from other games
      window.__flashTotalCoins = null;
      window.__flashQuestionCount = null;
      window.__flashPointsMultiplier = 1;
      
      // Small delay to ensure cleanup
      setTimeout(() => {
        // Then set the correct values for this game
        window.__flashTotalCoins = totalCoins;        // 5
        window.__flashQuestionCount = scenarios.length; // 5
        window.__flashPointsMultiplier = coinsPerLevel; // 1
      }, 50);
      
      return () => {
        // Clean up on unmount
        window.__flashTotalCoins = null;
        window.__flashQuestionCount = null;
        window.__flashPointsMultiplier = 1;
      };
    }
  }, [totalCoins, coinsPerLevel, scenarios.length]);

  const handleChoice = (optionId) => {
    const newChoices = [...choices, { 
      scenarioId: scenarios[currentScenario].id, 
      choice: optionId,
      isCorrect: scenarios[currentScenario].options.find(opt => opt.id === optionId)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = scenarios[currentScenario].options.find(opt => opt.id === optionId)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    // Move to next scenario or show results
    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentScenario(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentScenario(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/hygiene-alert-reflex");
  };

  return (
    <GameShell
      title="Daily Routine Simulation"
      score={coins}
      subtitle={showResult ? "Simulation Complete!" : `Scenario ${currentScenario + 1} of ${scenarios.length}`}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/health-male/teens/hygiene-alert-reflex"
      nextGameIdProp="health-male-teen-9"
      gameType="health-male"
      totalLevels={scenarios.length}
      currentLevel={currentScenario + 1}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/health-male/teens"
      maxScore={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Scenario {currentScenario + 1}/{scenarios.length || 0}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
              </div>
              
              <h2 className="text-white text-base md:text-lg lg:text-xl mb-4 md:mb-6 text-center">
                {scenarios[currentScenario] ? scenarios[currentScenario].situation : "Loading..."}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {scenarios[currentScenario] ? scenarios[currentScenario].options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl md:text-3xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-base md:text-xl mb-2">{option.text}</h3>
                  </button>
                )) : null}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20 text-center flex-1 flex flex-col justify-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-4xl md:text-5xl mb-4">📅</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Routine Master!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {scenarios.length} scenarios correct!
                  You understand how to build healthy daily habits!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  Great job! You know how to establish routines that support your health and productivity!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {scenarios.length} scenarios correct.
                  Remember, good routines build discipline and long-term success!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to choose the option that shows proper daily routine habits.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DailyRoutineSimulation;

