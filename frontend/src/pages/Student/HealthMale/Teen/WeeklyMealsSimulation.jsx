import React, { useState, useEffect } from "react";
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
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

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
  }, [totalCoins, coinsPerLevel]);

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
    navigate("/student/health-male/teens/reflex-smart-drink");
  };

  return (
    <GameShell
      title="Weekly Meals Simulation"
      score={coins}
      subtitle={showResult ? "Simulation Complete!" : `Scenario ${currentScenario + 1} of ${scenarios.length}`}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/health-male/teens/reflex-smart-drink"
      nextGameIdProp="health-male-teen-19"
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
                <span className="text-white/80 text-sm md:text-base">Scenario {currentScenario + 1}/{scenarios.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
              </div>
              
              <h2 className="text-white text-base md:text-lg lg:text-xl mb-4 md:mb-6 text-center">
                {scenarios[currentScenario].day}
              </h2>
              
              <p className="text-white/90 text-base md:text-lg mb-6 text-center">
                {scenarios[currentScenario].situation}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {scenarios[currentScenario].options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl md:text-3xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-base md:text-xl mb-2">{option.text}</h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20 text-center flex-1 flex flex-col justify-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-4xl md:text-5xl mb-4">🍽️</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Weekly Meals Master!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {scenarios.length} meal choices correct!
                  You understand how to plan healthy weekly meals!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  Great job! You know how to make nutritious food choices for every day of the week!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {scenarios.length} meal choices correct.
                  Remember, balanced meals help you stay healthy and energized!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to choose the option that shows balanced, nutritious meal planning.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default WeeklyMealsSimulation;

