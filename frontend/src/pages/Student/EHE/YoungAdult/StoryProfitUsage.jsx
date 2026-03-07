import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STORY_STAGES = [
  {
    id: 1,
    prompt: "After months of hard work, your small business finally generates a true $5,000 profit! What is your first financial move?",
    options: [
      {
        id: "opt1",
        text: "Take the entire $5,000 and buy a designer watch to celebrate your success.",
        outcome: "Spending all initial profits on personal luxuries starves your business of capital just when it needs it most.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Reinvest a portion back into the business and set aside some for taxes.",
        outcome: "Correct! Smart play. Reinvesting fuels growth, and saving for taxes prevents future legal and financial trouble.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Give the entire amount to your friends as a loan because they asked.",
        outcome: "Lending startup capital to friends puts both your business and your relationships at extreme risk.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "You decided to reinvest part of the profit back into the business. Where should this initial capital go?",
    options: [
       {
        id: "opt2",
        text: "Purchasing inventory or tools that directly increase your production capacity or quality.",
        outcome: "Exactly! Reinvesting in core operations directly improves your ability to generate even more profit.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Buying a massive, expensive billboard in a wealthy neighborhood.",
        outcome: "Expensive, untargeted marketing is often a massive waste of money for early-stage startups.",
        isCorrect: false,
      },
     
      {
        id: "opt3",
        text: "Upgrading your personal office chair and buying an expensive espresso machine.",
        outcome: "While nice to have, vanity expenses do not generate a positive return on investment.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "A few months later, the business is making consistent profit every month. You want to start rewarding yourself. How?",
    options: [
      {
        id: "opt1",
        text: "Drain the business bank account at the end of every month for personal use.",
        outcome: "You leave the business with zero cash flow buffer for emergencies or slow months, greatly risking failure.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Refuse to pay yourself anything for five years to appear 'hardcore'.",
        outcome: "Total self-deprivation leads to severe burnout and personal financial stress, which ultimately harms the business.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Pay yourself a modest, consistent salary while keeping the rest in the business account.",
        outcome: "Correct! A set salary provides personal stability while ensuring the business maintains healthy cash reserves.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "Your business encounters an unexpected equipment failure that costs $3,000 to fix. How do you handle it?",
    options: [
      {
        id: "opt1",
        text: "Panic and take out a high-interest personal credit card loan to cover it.",
        outcome: "High-interest debt can quickly destroy your business's profitability and trap you in a debt cycle.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Use the retained earnings/cash buffer you built up from previous reinvested profits.",
        outcome: "This is exactly why you didn't spend all your previous profits! Your cash buffer saves the day without stress.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Ignore the broken equipment and hope customers don't notice the drop in quality.",
        outcome: "Ignoring core operational issues leads to lost customers and a damaged reputation.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "Looking back at your highly successful first year, what was the primary financial key to surviving and growing?",
    options: [
      {
        id: "opt1",
        text: "Looking rich on social media to attract investors.",
        outcome: "Real investors look at your balance sheet and cash flow, not your Instagram feed.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Spending every dollar the moment it entered the bank account.",
        outcome: "Zero cash flow management is the number one reason small businesses fail in their first year.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Treating profit as a tool to acquire better assets and build a safety net.",
        outcome: "Spot on! You've mastered the foundational rule of business finance: capital allocation determines long-term success.",
        isCorrect: true,
      },
    ],
  },
];

const StoryProfitUsage = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-44";
  const gameData = getGameDataById(gameId);
  const totalStages = STORY_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 10;
  const totalXp = gameData?.xp || location.state?.totalXp || 20;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = STORY_STAGES[currentStageIndex];

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
      title="Story: Profit Usage"
      subtitle={
        showResult
          ? "Excellent! You understand how to allocate capital."
          : `Scenario ${currentStageIndex + 1} of ${totalStages}`
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
                <span>Phase {progressLabel}</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Score: {score}/{totalStages}
                </span>
              </div>

              <div className="text-center mb-10">
                <span className="inline-block py-1 px-3 rounded-full bg-violet-900/50 text-violet-300 text-xs font-bold uppercase tracking-wider mb-4 border border-violet-500/30">
                  Financial Management
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

export default StoryProfitUsage;
