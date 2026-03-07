import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PROFIT_REINVESTMENT_STAGES = [
  {
    id: 1,
    prompt: "Your new business has just completed its first highly profitable quarter. You have a significant surplus of cash. What is your initial instinct?",
    options: [
      {
        id: "opt1",
        text: "Withdraw all the profits immediately to buy a luxury car to celebrate",
        outcome: "Emptying the business accounts for personal luxury leaves the company vulnerable to any slight downturn.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Analyze your upcoming expenses and potential growth opportunities before making any moves",
        outcome: "Correct! Prudent financial management starts with understanding your position and future needs.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Double everyone's salary immediately as a reward",
        outcome: "While generous, permanently increasing fixed costs based on one good quarter can quickly lead to bankruptcy.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "You identify that your current manufacturing equipment is old and causing delays, limiting how much you can sell. How do you handle the profits now?",
    options: [
      {
        id: "opt1",
        text: "Use the profits to upgrade the equipment so you can produce and sell more next quarter",
        outcome: "Exactly! Reinvesting in operations that directly increase capacity or efficiency drives future growth.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Keep the old equipment and put all the money in a personal savings account",
        outcome: "While personal savings are nice, starving a growing business of capital stunts its potential.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Spend the money on a massive, unfocused marketing campaign without fixing the delays",
        outcome: "Generating more demand when you can't fulfill current orders will only anger new customers.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "By reinvesting in the equipment, production speeds up, and profits double next quarter. Now you have even more surplus. What is a wise strategic move?",
    options: [
      {
        id: "opt1",
        text: "Finally, take 100% of the money out for personal use. The business is fine now.",
        outcome: "Taking 100% out leaves no safety net. Markets change, and businesses always need a cash buffer.",
        isCorrect: false,
      },
     
      {
        id: "opt3",
        text: "Buy a competitor's failing business just to say you own two companies",
        outcome: "Buying a failing business without a clear synergy or turnaround plan is a fast way to burn cash.",
        isCorrect: false,
      },
       {
        id: "opt2",
        text: "Expand the product line or hire key personnel to delegate tasks and scale further",
        outcome: "Perfect! Continued strategic reinvestment creates a compounding effect on business growth.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "A sudden economic dip occurs in your industry. Which business is more likely to survive?",
    options: [
      {
        id: "opt1",
        text: "The one where the owner consistently withdrew all profits for personal expenses",
        outcome: "This business has no cash reserves and will likely fail during a downturn.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "The one that reinvested profits into efficiency, cash reserves, and diverse product lines",
        outcome: "Spot on! Reinvestment builds resilience, padding the business against external shocks.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "The one that took out massive loans to fund personal owner payouts",
        outcome: "High debt combined with an economic dip is the quickest recipe for bankruptcy.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the ultimate lesson about early business profits?",
    options: [
      {
        id: "opt1",
        text: "Early profits are meant to be fuel to grow the business engine, not just a personal ATM",
        outcome: "Exactly! Treating early profits as growth fuel ensures the engine runs larger and faster in the future.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "You should never take a salary from your business ever",
        outcome: "Owners must be paid a reasonable salary eventually, but not at the cost of starving the company's growth capital.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Profits are just a sign that you are charging too much",
        outcome: "Profits are the reward for creating value efficiently, not necessarily a sign of overcharging.",
        isCorrect: false,
      },
    ],
  },
];

const ProfitReinvestmentStory = () => {
  const location = useLocation();
  const gameId = "ehe-adults-54";
  const gameData = getGameDataById(gameId);
  const totalStages = PROFIT_REINVESTMENT_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 15;
  const totalXp = gameData?.xp || location.state?.totalXp || 30;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = PROFIT_REINVESTMENT_STAGES[currentStageIndex];

  const handleChoice = (option) => {
    if (selectedChoice) return;
    setSelectedChoice(option);
    if (option.isCorrect) {
      setScore((s) => s + 1);
      showCorrectAnswerFeedback(1, true);
    }
  };

  const handleNext = () => {
    if (currentStageIndex === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrentStageIndex((i) => i + 1);
    }
    setSelectedChoice(null);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Profit Reinvestment Story"
      subtitle={
        showResult
          ? "Well done! You learned how to use profits as growth fuel."
          : `Question ${currentStageIndex + 1} of ${totalStages}`
      }
      currentLevel={currentStageIndex + 1}
      totalLevels={totalStages}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      score={score}
      showConfetti={showResult && score === totalStages}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="ehe"
      nextGamePath={location.state?.nextGamePath}
      nextGameId={location.state?.nextGameId}
      backPath={location.state?.returnPath}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult && stage && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-slate-700 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 to-indigo-600"></div>

              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8 border-b border-slate-700 pb-4">
                <span>Question {progressLabel}</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Score: {score}/{totalStages}
                </span>
              </div>

              <div className="text-center mb-10">
                <span className="inline-block py-1 px-3 rounded-full bg-violet-900/50 text-violet-300 text-xs font-bold uppercase tracking-wider mb-4 border border-violet-500/30">
                  Business Choice
                </span>
                <p className="text-white text-xl md:text-2xl font-bold leading-relaxed">
                  "{stage.prompt}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;

                  let baseStyle = "from-slate-800 to-slate-900 border-slate-700 hover:border-violet-500 hover:from-slate-800 hover:to-violet-900/40 text-slate-200";

                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "from-emerald-900/80 to-emerald-800 border-emerald-500 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-[1.02]"
                      : "from-rose-900/80 to-rose-800 border-rose-500 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.3)] scale-[1.02]";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "from-emerald-900/30 to-slate-900 border-emerald-500/50 text-emerald-400/80 ring-1 ring-emerald-500/30 opacity-80";
                  } else if (selectedChoice) {
                    baseStyle = "from-slate-900 to-slate-900 border-slate-800 text-slate-600 opacity-40";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative rounded-xl bg-gradient-to-r ${baseStyle} border-2 p-5 text-left font-medium transition-all duration-300 disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? (option.isCorrect ? 'border-emerald-400 bg-emerald-500/20' : 'border-rose-400 bg-rose-500/20') : 'border-slate-600'}`}>
                          {isSelected && <div className={`w-2.5 h-2.5 rounded-full ${option.isCorrect ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>}
                        </div>
                        <div className="flex-1">
                          <span className="block text-lg">{option.text}</span>

                          <div className={`overflow-hidden transition-all duration-500 ${isSelected ? 'max-h-24 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className={`text-sm font-semibold p-3 rounded-lg ${option.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                              <span className="uppercase text-xs tracking-wider opacity-70 block mb-1">
                                {option.isCorrect ? '✅ Correct' : '❌ Incorrect'}
                              </span>
                              {option.outcome}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedChoice && (
                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg shadow-violet-500/25 transition-all duration-300 hover:scale-105 hover:shadow-violet-500/40"
                  >
                    {currentStageIndex === totalStages - 1 ? "See Results" : "Next →"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ProfitReinvestmentStory;
