import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "You have various daily business costs piling up. At the end of the first week, how do you handle tracking them?",
    options: [
      {
        id: "opt1",
        text: "Guess the total at the end of the month.",
        outcome: "Incorrect. Guessing leads to inaccurate financial records and potential cash flow problems.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Ignore tracking entirely as long as there is money in the bank.",
        outcome: "Incorrect. Ignoring expenses completely is a surefire way to lose track of profitability.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Track expenses daily to maintain financial visibility.",
        outcome: "Correct! Recording daily expenses gives you an accurate view of your actual financial health.",
        isCorrect: true,
      },
      {
        id: "opt4",
        text: "Wait until tax season to figure it out.",
        outcome: "Incorrect. Waiting until tax time makes reconciliation extremely stressful and prone to errors.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "A client prepays for a long-term project. How should you record this inflow of cash?",
    options: [
      {
        id: "opt1",
        text: "Spend it immediately on team celebrations.",
        outcome: "Incorrect. Recognizing prepayment as unrestricted cash can cripple future project operations.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Record it as unearned revenue and recognize it as the work is completed.",
        outcome: "Correct! Proper accounting ensures you only count revenue when you've actually earned it.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Count it as full profit for the current month.",
        outcome: "Incorrect. It's not profit yet, since you haven't delivered the service or paid associated costs.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Hide the money so your partner doesn't know.",
        outcome: "Incorrect. Transparency is necessary for legitimate business operations.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "You notice an unexpected spike in your monthly utility costs. What is the most appropriate action?",
    options: [
      {
        id: "opt1",
        text: "Ignore it and hope it goes down next month.",
        outcome: "Incorrect. Unchecked rising fixed costs can silently destroy your profit margin.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Raise prices immediately to cover the cost.",
        outcome: "Incorrect. Knee-jerk price increases can alienate customers without addressing the root cause.",
        isCorrect: false,
      },
      
      {
        id: "opt4",
        text: "Refuse to pay the bill.",
        outcome: "Incorrect. Refusing to pay will disrupt operations and hurt your business credit.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Investigate your facility for leaks or inefficiency and review the bill details.",
        outcome: "Correct! Investigating the cause stops the financial leak at its source.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "Your team wants to purchase new software to improve productivity, but it requires a recurring monthly fee.",
    options: [
      {
        id: "opt1",
        text: "Calculate the expected ROI and weigh it against your current cash flow.",
        outcome: "Correct! Structured financial evaluation prevents unnecessary recurring drains on cash.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Subscribe instantly because software always helps.",
        outcome: "Incorrect. Not every subscription provides enough value to justify the recurring cost.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Deny the request without looking into it.",
        outcome: "Incorrect. You might be missing out on a tool that significantly boosts efficiency.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Buy it using personal credit cards.",
        outcome: "Incorrect. Mixing personal and business finances creates accounting nightmares.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "At the end of the quarter, you need to determine if your business is truly profitable. Which action is most important?",
    options: [
      {
        id: "opt1",
        text: "Just look at the bank account balance.",
        outcome: "Incorrect. Bank balances do not reflect outstanding debts, taxes owed, or depreciation.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Review a comprehensive profit and loss (P&L) statement.",
        outcome: "Correct! A P&L statement accurately summarizes revenue against all categorized expenses.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Ask your employees if they feel the business is doing well.",
        outcome: "Incorrect. Profitability is verified through math, not feelings.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Assume you are profitable as long as you can pay the bills.",
        outcome: "Incorrect. Being able to pay bills doesn't necessarily mean the business is generating a surplus.",
        isCorrect: false,
      },
    ],
  },
];

const SimulationExpenseTracking = () => {
  const location = useLocation();
  const gameId = "ehe-adults-65";
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
          ? "Simulation complete! You successfully managed your business expenses."
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
                {selectedChoice.isCorrect ? 'Professional Move' : 'Career Misstep'}
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
