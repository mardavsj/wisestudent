import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const Simulation1000Choice = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-68");
  const gameId = gameData?.id || "finance-teens-68";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for Simulation1000Choice, using fallback ID");
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
    title: "₹1000 & Inflation Reality",
    description: "You keep ₹1000 in cash for one year while prices rise. What is the smartest move?",
    amount: 1000,
    options: [
      { id: "cash", text: "Keep cash at home", emoji: "💵", isCorrect: false },
      { id: "spend", text: "Spend immediately", emoji: "🛍️", isCorrect: false },
      { id: "savings", text: "Savings account only", emoji: "🏦", isCorrect: false },
      { id: "invest", text: "Invest where returns beat inflation", emoji: "📈", isCorrect: true }
    ]
  },
  {
    id: 2,
    title: "Risk vs Safety Choice",
    description: "You may need this ₹1000 in 3 months. What’s the best option?",
    amount: 1000,
    options: [
      { id: "fd", text: "Short-term safe savings", emoji: "🛡️", isCorrect: true },
      { id: "stocks", text: "High-risk stocks", emoji: "📉", isCorrect: false },
      { id: "crypto", text: "Crypto trading", emoji: "🪙", isCorrect: false },
      { id: "lock", text: "Long-term locked investment", emoji: "🔒", isCorrect: false }
    ]
  },
  {
    id: 3,
    title: "Delayed Reward Scenario",
    description: "You can either enjoy ₹1000 today or grow it slowly. What builds wealth?",
    amount: 1000,
    options: [
      { id: "enjoy", text: "Spend for instant happiness", emoji: "🎮", isCorrect: false },
      { id: "compound", text: "Invest and let it compound", emoji: "🌱", isCorrect: true },
      { id: "loan", text: "Lend to friends", emoji: "🤝", isCorrect: false },
      { id: "idle", text: "Keep idle for safety", emoji: "😐", isCorrect: false }
    ]
  },
  {
    id: 4,
    title: "Diversification Test",
    description: "One investment fails. How do you protect your ₹1000?",
    amount: 1000,
    options: [
      { id: "allone", text: "Put all money in one place", emoji: "🎯", isCorrect: false },
      { id: "fear", text: "Avoid investing completely", emoji: "🙈", isCorrect: false },
      { id: "gamble", text: "Increase risk to recover fast", emoji: "🎲", isCorrect: false },
      { id: "diversify", text: "Split across different assets", emoji: "⚖️", isCorrect: true },
    ]
  },
  {
    id: 5,
    title: "Smart Teen Decision",
    description: "You earn ₹1000 as pocket money. What shows financial maturity?",
    amount: 1000,
    options: [
      { id: "spendall", text: "Spend all on trends", emoji: "🛍️", isCorrect: false },
      { id: "saveall", text: "Save without learning investing", emoji: "💰", isCorrect: false },
      { id: "plan", text: "Split: save, invest, learn", emoji: "📊", isCorrect: true },
      { id: "ignore", text: "Do nothing with money", emoji: "😴", isCorrect: false }
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
      title="Simulation: ₹1000 Choice"
      subtitle={!showResult ? `Scenario ${currentScenario + 1} of ${scenarios.length}` : "Simulation Complete!"}
      score={score}
      currentLevel={currentScenario + 1}
      totalLevels={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={scenarios.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/reflex-smart-growth"
      nextGameIdProp="finance-teens-69"
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
                  <span className="text-white font-semibold text-lg">Amount: </span>
                  <span className="text-green-400 font-bold text-2xl">₹{current.amount}</span>
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
                <h3 className="text-2xl font-bold text-white mb-4">Excellent Choice!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {scenarios.length} scenarios correct!
                  You understand smart investment allocation!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: The best strategy is to mix Fixed Deposit (for safety) and Stocks (for growth) to balance risk and return!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {scenarios.length} scenarios correct.
                  Remember, mixing FD and Stocks is the best strategy!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: The best choice is to mix Fixed Deposit (safe, low return) with Stocks (risky, high return) for balanced growth!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default Simulation1000Choice;


