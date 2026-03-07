import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "A high-interest loan is offered for quick expansion of your business. How do you respond to this opportunity?",
    options: [
      {
        id: "opt1",
        text: "Accept the loan immediately to expand as quickly as possible.",
        outcome: "Incorrect. Accepting a loan without understanding the terms or your ability to repay is highly risky.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Evaluate your repayment capacity before making any decision.",
        outcome: "Correct! Structured evaluation of your financial capacity is essential when taking on debt.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Ask your friends for advice and do whatever they suggest.",
        outcome: "Incorrect. Friends might not understand your specific business financials. You must evaluate the numbers yourself.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Reject the loan purely out of fear of debt.",
        outcome: "Incorrect. While caution is good, rejecting capital without analysis might stunt your growth.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Your evaluation reveals the interest rate is very high, but the terms are somewhat flexible. What is your next move?",
    options: [
      {
        id: "opt1",
        text: "Take the loan anyway. Expansion is the only thing that matters.",
        outcome: "Incorrect. Ignoring the high cost of capital can lead to financial distress.",
        isCorrect: false,
      },
     
      {
        id: "opt3",
        text: "Hide the high interest rate from your co-founders.",
        outcome: "Incorrect. Financial deception destroys trust within the leadership team.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Complain about the high rates publicly.",
        outcome: "Incorrect. This is unprofessional and damages your relationship with financial institutions.",
        isCorrect: false,
      },
       {
        id: "opt2",
        text: "Negotiate for better terms or explore alternative funding options.",
        outcome: "Correct! Seeking competitive rates and exploring options mitigates financial risk.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 3,
    prompt: "You find a better loan, but it requires a detailed business plan showing how you will use the funds.",
    options: [
      {
        id: "opt4",
        text: "Create a structured, data-driven business plan outlining clear ROI.",
        outcome: "Correct! Lenders want to see a solid roadmap for growth, and this exercise benefits you as well.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Write a vague plan and hope they don't look too closely.",
        outcome: "Incorrect. Lenders require clear data to assess risk.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Refuse the loan because the paperwork is too much effort.",
        outcome: "Incorrect. Essential business planning should not be considered unnecessary paperwork.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Borrow from an unregistered, high-risk lender to avoid the process.",
        outcome: "Incorrect. This puts your business in extreme danger with unregulated entities.",
        isCorrect: false,
      },
      
    ],
  },
  {
    id: 4,
    prompt: "The loan is approved and the funds arrive in your business account. What is your first spending priority?",
    options: [
      
      {
        id: "opt2",
        text: "Buy luxury office furniture to look more successful to clients.",
        outcome: "Incorrect. Vanity metrics don't generate revenue and waste crucial expansion capital.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Increase your personal salary significantly right away.",
        outcome: "Incorrect. Taking capital out of the business prematurely hurts your expansion goals.",
        isCorrect: false,
      },
      {
        id: "opt1",
        text: "Allocate funds strictly according to the business plan you submitted.",
        outcome: "Correct! Strategic discipline ensures the capital generates the expected return.",
        isCorrect: true,
      },
      {
        id: "opt4",
        text: "Spend it randomly as daily needs arise without tracking.",
        outcome: "Incorrect. Undisciplined spending guarantees failure to achieve your expansion plan.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "Your expansion efforts hit a temporary snag, reducing your revenue. Your first loan repayment is due soon.",
    options: [
      {
        id: "opt1",
        text: "Communicate with the lender proactively while adjusting your budget to meet the obligation.",
        outcome: "Correct! Transparency and flexibility help manage financial difficulties responsibly.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Ignore the payment and hope the lender forgets or gives you a pass.",
        outcome: "Incorrect. Defaulting damages your credit score and legal standing.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Take out another high-interest loan just to pay this one.",
        outcome: "Incorrect. Entering a debt spiral is extremely dangerous for long-term viability.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Blame the current market conditions and simply refuse to pay.",
        outcome: "Incorrect. Emotional deflections do not relieve you of your financial obligations.",
        isCorrect: false,
      },
    ],
  },
];

const SimulationBusinessLoan = () => {
  const location = useLocation();
  const gameId = "ehe-adults-47";
  const gameData = getGameDataById(gameId);
  const totalStages = SIMULATION_STAGES.length;

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;

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
      title="Simulation: Business Loan"
      subtitle={
        showResult
          ? "Simulation complete! You successfully managed the pressures of a business loan."
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

export default SimulationBusinessLoan;
