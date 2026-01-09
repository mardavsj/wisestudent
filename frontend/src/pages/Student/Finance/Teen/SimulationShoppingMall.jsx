import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SimulationShoppingMall = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-18";
  const gameData = getGameDataById(gameId);
  
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
      title: "Back to School Shopping",
      description: "You have ₹150 for school supplies. What's the best approach?",
      budget: 150,
      options: [
        
        { 
          id: "everything", 
          text: "Buy everything I want", 
          emoji: "🛍️", 
          isCorrect: false
        },
        { 
          id: "needs-only", 
          text: "Buy only essentials", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          id: "nothing", 
          text: "Buy nothing, save all", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          id: "random", 
          text: "Buy random items", 
          emoji: "🎲", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Holiday Gift Shopping",
      description: "You have ₹100 for holiday gifts. What's the smartest choice?",
      budget: 100,
      options: [
        { 
          id: "thoughtful", 
          text: "Thoughtful gifts within budget", 
          emoji: "💝", 
          isCorrect: true
        },
        { 
          id: "expensive", 
          text: "Most expensive gifts possible", 
          emoji: "💎", 
          isCorrect: false
        },
        { 
          id: "cheap", 
          text: "Cheapest gifts to save money", 
          emoji: "🏷️", 
          isCorrect: false
        },
        { 
          id: "none", 
          text: "No gifts, keep money", 
          emoji: "🤐", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Emergency Clothing Needs",
      description: "You need new clothes after an accident. How do you prioritize?",
      budget: 110,
      options: [
        
        { 
          id: "brand-new", 
          text: "All brand new designer clothes", 
          emoji: "👗", 
          isCorrect: false
        },
        { 
          id: "essentials-first", 
          text: "Essential items first, then extras", 
          emoji: "👕", 
          isCorrect: true
        },
        { 
          id: "secondhand", 
          text: "All secondhand to save money", 
          emoji: "📦", 
          isCorrect: false
        },
        { 
          id: "borrow", 
          text: "Borrow from friends", 
          emoji: "🤝", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Entertainment and Socializing",
      description: "You have ₹60 for entertainment. How do you balance fun and finances?",
      budget: 60,
      options: [
        
        { 
          id: "all-fun", 
          text: "Spend all on entertainment", 
          emoji: "🎉", 
          isCorrect: false
        },
        { 
          id: "no-fun", 
          text: "Save all, no entertainment", 
          emoji: "📵", 
          isCorrect: false
        },
        { 
          id: "balanced-fun", 
          text: "Some fun, some savings", 
          emoji: "🎬", 
          isCorrect: true
        },
        { 
          id: "borrow-fun", 
          text: "Borrow money for fun", 
          emoji: "💳", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Balanced Shopping Day",
      description: "You have ₹200 for various needs. What's the best allocation?",
      budget: 200,
      options: [
       
        { 
          id: "all-needs", 
          text: "All needs, no wants or savings", 
          emoji: "🧾", 
          isCorrect: false
        },
        { 
          id: "impulse", 
          text: "Impulse buying whatever I like", 
          emoji: "🛒", 
          isCorrect: false
        },
        { 
          id: "all-wants", 
          text: "All wants, no needs", 
          emoji: "🛍️", 
          isCorrect: false
        },
         { 
          id: "smart-mix", 
          text: "Mix of needs, some wants, save rest", 
          emoji: "🛒", 
          isCorrect: true
        },
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

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentScenario(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const current = scenarios[currentScenario];

  return (
    <GameShell
      title="Simulation: Shopping Mall"
      subtitle={!showResult ? `Scenario ${currentScenario + 1} of ${scenarios.length}` : "Simulation Complete!"}
      score={score}
      currentLevel={currentScenario + 1}
      totalLevels={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={scenarios.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/reflex-control"
      nextGameIdProp="finance-teens-19"
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
              
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <span className="text-white font-semibold text-lg">Budget: </span>
                  <span className="text-green-400 font-bold text-2xl">₹{current.budget}</span>
                </div>
              </div>
              
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
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Financial Decisions!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {scenarios.length} scenarios correct!
                  You understand smart shopping decisions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Balancing needs, wants, and savings leads to smart financial choices!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {scenarios.length} scenarios correct.
                  Remember to balance needs, wants, and savings!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Always prioritize needs first, then some wants, and save the rest!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationShoppingMall;