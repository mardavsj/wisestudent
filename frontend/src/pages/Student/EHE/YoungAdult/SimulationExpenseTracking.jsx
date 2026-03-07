import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "You have various small, daily business costs like coffee for clients and minor supplies. How do you handle them?",
    options: [
      {
        id: "opt1",
        text: "Do not record them to save time since they are small.",
        outcome: "Incorrect. Small daily unrecorded expenses add up and quietly destroy your profit margin.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Guess the total expenses at the end of the month.",
        outcome: "Incorrect. Guessing guarantees inaccurate financials and potential tax issues.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Pay for them out of your personal wallet so the business looks more profitable.",
        outcome: "Incorrect. Mixing personal and business finances masks the true cost of running your business.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Track daily expenses diligently in a ledger or app.",
        outcome: "Correct! Every rupee spent must be tracked to understand true profitability and cash flow.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "A client pays you ₹50,000 in cash. What is the proper immediate action?",
    options: [
      {
        id: "opt1",
        text: "Deposit it into the business bank account and record it as income.",
        outcome: "Correct! Clear trails of all income are necessary for accounting, taxes, and business valuation.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Keep the cash hidden in a drawer to avoid paying taxes on it.",
        outcome: "Incorrect. Tax evasion is illegal and prevents you from ever proving your business's true value to investors.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Spend it immediately on personal items without recording it.",
        outcome: "Incorrect. You are stealing from your own business and ruining its financial records.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Use it to pay suppliers in cash directly without keeping receipts.",
        outcome: "Incorrect. Without receipts, you cannot prove the expense, inflating your tax liability.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "It's the end of the month. How do you determine if you actually made a profit?",
    options: [
      {
        id: "opt1",
        text: "Look at the bank account balance. If it's higher than last month, we made a profit.",
        outcome: "Incorrect. Cash balance does not equal profit. You may have unpaid bills or unearned revenue.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Subtract all recorded expenses (including overhead and taxes) from total revenue.",
        outcome: "Correct! Profit is what remains only after absolutely all costs of doing business are subtracted from revenue.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Ask the sales team how much they sold.",
        outcome: "Incorrect. High sales volume means nothing if the expenses to get those sales were even higher.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Assume a 20% profit margin based on industry averages.",
        outcome: "Incorrect. Industry averages are estimates; you must calculate your actual, specific numbers.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "You notice an unexpected, recurring ₹2,000 monthly software subscription on your expense report.",
    options: [
      {
        id: "opt1",
        text: "Ignore it, ₹2,000 is too small to worry about.",
        outcome: "Incorrect. A ₹2,000 monthly leak costs you ₹24,000 a year for nothing.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Yell at the accounting team without checking what it is.",
        outcome: "Incorrect. It might be a critical software you approved but forgot about. Investigate first.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Investigate immediately, cancel it if unused, and update your records.",
        outcome: "Correct! Regular expense audits are crucial to catch leaks and optimize cash flow before they compound.",
        isCorrect: true,
      },
      {
        id: "opt4",
        text: "Accept it as a cost of doing business.",
        outcome: "Incorrect. Passive acceptance of unjustified expenses destroys margins.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "Why is separating personal and business bank accounts strictly necessary from day one?",
    options: [
      {
        id: "opt1",
        text: "It isn't necessary; keeping them together is easier to manage.",
        outcome: "Incorrect. Commingling funds makes accounting a nightmare and pierces your corporate legal liability shield.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "So you can expense personal vacations to the business.",
        outcome: "Incorrect. That is tax fraud.",
        isCorrect: false,
      },
      
      {
        id: "opt4",
        text: "Only so the bank can charge you extra fees.",
        outcome: "Incorrect. The legal and accounting protections far outweigh any minor banking fees.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "It provides a clear, legally protected audit trail for taxes, evaluating profit, and securing loans.",
        outcome: "Correct! Clear separation protects you legally and provides accurate data on business health.",
        isCorrect: true,
      },
    ],
  },
];

const SimulationExpenseTracking = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-55";
  const gameData = getGameDataById(gameId);
  const totalStages = SIMULATION_STAGES.length;

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 15;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 30;
  
  const stage = SIMULATION_STAGES[currentStageIndex];

  const handleChoice = (option) => {
    if (selectedChoice || !stage) return;
    setSelectedChoice(option);

    if (option.isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentStageIndex === totalStages - 1) {
      setTimeout(() => {
        setShowResult(true);
      }, 1200);
    }
  };

  const handleNextStage = () => {
    if (!selectedChoice) return;
    if (currentStageIndex === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrentStageIndex((prev) => prev + 1);
    }
    setSelectedChoice(null);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Simulation: Expense Tracking"
      subtitle={
        showResult
          ? "Simulation complete! Your finances are balanced and tracked."
          : `Scenario Step ${currentStageIndex + 1} of ${totalStages}`
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
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border-2 border-teal-500/30 shadow-2xl relative overflow-hidden">
               
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-teal-300 mb-6 relative z-10 border-b border-teal-500/20 pb-4">
                <span>Task {progressLabel}</span>
                <span className="bg-teal-950/80 px-4 py-1.5 rounded shadow-sm border border-teal-500/30">
                  Score: {score}/{totalStages}
                </span>
              </div>

              <div className="bg-gradient-to-br from-teal-950/80 to-slate-900/80 p-6 rounded-2xl border-l-4 border-teal-500 mb-8 shadow-inner relative z-10">
                 <p className="text-white text-xl md:text-2xl font-serif leading-relaxed italic">
                   {stage.prompt}
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  let baseStyle = "from-slate-800 to-teal-950 border-teal-500/30 hover:border-teal-400 hover:from-slate-700 hover:to-teal-900 text-slate-200";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "from-emerald-900 to-emerald-800 border-emerald-400 ring-4 ring-emerald-500/30 scale-[1.03] text-emerald-50 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      : "from-rose-900 to-rose-800 border-rose-400 ring-4 ring-rose-500/30 scale-[1.03] text-rose-50 shadow-[0_0_20px_rgba(244,63,94,0.3)]";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "from-emerald-950 to-emerald-900 border-emerald-500/50 text-emerald-200/70";
                  } else if (selectedChoice && !isSelected) {
                    baseStyle = "from-slate-900 to-slate-900 border-slate-700 opacity-40 text-slate-500";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative rounded-2xl bg-gradient-to-r ${baseStyle} border-2 p-5 text-left font-medium transition-all min-h-[110px] flex items-center disabled:cursor-not-allowed text-lg`}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {selectedChoice && (
          <div className="animate-fade-in-up max-w-3xl mx-auto mt-6">
            <div className={`rounded-xl border-l-[6px] p-6 text-lg shadow-xl bg-slate-900/95 ${selectedChoice.isCorrect ? 'border-emerald-500 text-emerald-100' : 'border-rose-500 text-rose-100'}`}>
              <span className={`block font-bold text-sm uppercase tracking-widest mb-2 ${selectedChoice.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                {selectedChoice.isCorrect ? 'Accounted For' : 'Accounting Error'}
              </span> 
              <span className="font-serif italic leading-relaxed">{selectedChoice.outcome}</span>
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 text-white font-bold tracking-wide shadow-[0_5px_20px_rgba(20,184,166,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-lg"
                >
                  <span className="flex items-center gap-2">
                    Next Step <span>→</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationExpenseTracking;
