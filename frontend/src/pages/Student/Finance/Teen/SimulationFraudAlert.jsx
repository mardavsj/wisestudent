import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SimulationFraudAlert = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-88");
  const gameId = gameData?.id || "finance-teens-88";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SimulationFraudAlert, using fallback ID");
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
    title: "Suspicious App Request",
    description: "A new app asks for your bank OTP to 'verify account'. Wallet ₹500. What’s smart?",
    options: [
      { 
        id: "share-otp", 
        text: "Share OTP immediately", 
        emoji: "🔢", 
        isCorrect: false
      },
     
      { 
        id: "check-forum", 
        text: "Check app reviews & forums before deciding", 
        emoji: "🧐", 
        isCorrect: false
      },
      { 
        id: "install-anyway", 
        text: "Install and see if it works", 
        emoji: "📱", 
        isCorrect: false
      },
       { 
        id: "ignore-app", 
        text: "Ignore app and uninstall it", 
        emoji: "📴", 
        isCorrect: true
      },
    ]
  },
  {
    id: 2,
    title: "Fake Scholarship Email",
    description: "Email claims 'Scholarship ₹50,000, click to register.' What’s safe?",
    options: [
      { 
        id: "click-link", 
        text: "Click link to register fast", 
        emoji: "🔗", 
        isCorrect: false
      },
      { 
        id: "verify-university", 
        text: "Verify email with official university site", 
        emoji: "🏫", 
        isCorrect: true
      },
      { 
        id: "share-email", 
        text: "Share email with friends", 
        emoji: "📤", 
        isCorrect: false
      },
      { 
        id: "ignore-and-forget", 
        text: "Ignore it completely without checking", 
        emoji: "🙈", 
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    title: "Fake Friend Request",
    description: "Someone unknown sends friend request offering 'free game points'. Safe choice?",
    options: [
      { 
        id: "accept", 
        text: "Accept to get points", 
        emoji: "🎮", 
        isCorrect: false
      },
      
      { 
        id: "share-data", 
        text: "Send your game credentials for points", 
        emoji: "🔑", 
        isCorrect: false
      },
      { 
        id: "block-report", 
        text: "Block and report account", 
        emoji: "🚫", 
        isCorrect: true
      },
      { 
        id: "ignore-only", 
        text: "Ignore without reporting", 
        emoji: "🙅", 
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    title: "Online Store Scam",
    description: "Website offers phone at 90% discount. Payment via UPI only. Teen decision?",
    options: [
      { 
        id: "research-store", 
        text: "Check website legitimacy & reviews before any payment", 
        emoji: "🧐", 
        isCorrect: true
      },
      { 
        id: "pay-now", 
        text: "Pay immediately, deal is too good to miss", 
        emoji: "💳", 
        isCorrect: false
      },
      
      { 
        id: "borrow-money", 
        text: "Borrow extra to buy faster", 
        emoji: "💰", 
        isCorrect: false
      },
      { 
        id: "share-link", 
        text: "Share deal with friends", 
        emoji: "📤", 
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    title: "Social Media Investment Scam",
    description: "Influencer promises 200% return in a week, asks for ₹500 via Paytm. What’s correct?",
    options: [
      { 
        id: "invest-quick", 
        text: "Send money quickly", 
        emoji: "💸", 
        isCorrect: false
      },
      
      { 
        id: "consult-unknown", 
        text: "Ask unknown friend to verify", 
        emoji: "👤", 
        isCorrect: false
      },
      { 
        id: "verify-source", 
        text: "Verify legitimacy, research before investing", 
        emoji: "🔍", 
        isCorrect: true
      },
      { 
        id: "share-link", 
        text: "Forward link to others", 
        emoji: "📤", 
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
      title="Simulation: Fraud Alert"
      subtitle={!showResult ? `Scenario ${currentScenario + 1} of ${scenarios.length}` : "Simulation Complete!"}
      score={score}
      currentLevel={currentScenario + 1}
      totalLevels={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={scenarios.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/reflex-scam-check"
      nextGameIdProp="finance-teens-89"
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

export default SimulationFraudAlert;

