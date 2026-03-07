import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "You receive a short-term contract job offer with a high hourly rate, but absolutely no benefits (health insurance, PF, leave). What is your first reaction?",
    options: [
      {
        id: "salary-only",
        text: "Accept it immediately because the monthly cash will be higher than a regular job.",
        outcome: "Incorrect. High cash flow now doesn't compensate for long-term insecurity and lack of benefits.",
        isCorrect: false,
      },
      {
        id: "ask-peers",
        text: "Ask your peers what they would do and just follow the majority opinion.",
        outcome: "Incorrect. Your financial and career needs are unique to you; peer advice might not align with your goals.",
        isCorrect: false,
      },
      {
        id: "evaluate",
        text: "Evaluate the long-term stability, career prospects, and out-of-pocket costs for benefits.",
        outcome: "Correct! Calculating total value vs. risk is essential for contract roles.",
        isCorrect: true,
      },
      {
        id: "reject-instantly",
        text: "Reject it instantly because contract roles are always a trap.",
        outcome: "Incorrect. Contract roles can offer great experience or a foot in the door; they just need careful evaluation.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "You need to compare the contract offer against a lower-paying full-time offer. How do you decide?",
    options: [
      {
        id: "compare-cash",
        text: "Just look at the monthly take-home pay and pick the higher number.",
        outcome: "Incorrect. This ignores the monetary value of benefits like insurance and paid time off.",
        isCorrect: false,
      },
      {
        id: "calculate-total",
        text: "Calculate the total compensation of the full-time role (salary + benefits + bonuses) vs the contract role minus self-funded benefits.",
        outcome: "Correct! This provides an accurate 'apples-to-apples' financial comparison.",
        isCorrect: true,
      },
      {
        id: "guess",
        text: "Guess which one feels better and go with your gut instinct.",
        outcome: "Incorrect. Financial decisions require hard numbers, not just feelings.",
        isCorrect: false,
      },
      {
        id: "ask-hr",
        text: "Ask the contract recruiter which one is better.",
        outcome: "Incorrect. The recruiter has a vested interest in you taking their offer.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "The contract role is for 6 months. What is your strategy exactly one month into the job?",
    options: [
      {
        id: "relax",
        text: "Relax and enjoy the high pay, worrying about the next job in month 5.",
        outcome: "Incorrect. Contract work requires constant pipeline building to avoid income gaps.",
        isCorrect: false,
      },
      {
        id: "complain",
        text: "Complain to your manager that you want a full-time role already.",
        outcome: "Incorrect. You agreed to a contract; demanding a change immediately is unprofessional.",
        isCorrect: false,
      },
      {
        id: "slack-off",
        text: "Do the bare minimum since you aren't a permanent employee anyway.",
        outcome: "Incorrect. This ruins your reputation and guarantees the contract won't be extended.",
        isCorrect: false,
      },
      {
        id: "network",
        text: "Perform excellently while actively networking internally to spot permanent opportunities.",
        outcome: "Correct! Proactive networking and high performance turn short contracts into long-term gains.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "You get sick and need to take 3 days off. How does this affect your contract role?",
    options: [
      {
        id: "paid-leave",
        text: "You take the days off and get paid normally.",
        outcome: "Incorrect. Contract roles typically do not offer paid sick leave.",
        isCorrect: false,
      },
      {
        id: "unpaid",
        text: "You lose 3 days of income, which you should have budgeted for in an emergency fund.",
        outcome: "Correct! Working without benefits means you must self-insure against illness.",
        isCorrect: true,
      },
      {
        id: "demand-pay",
        text: "Demand the company pay you anyway because you work hard.",
        outcome: "Incorrect. Contract terms are legally binding; you agreed to no paid leave.",
        isCorrect: false,
      },
      {
        id: "quit",
        text: "Quit the contract because it's unfair you aren't getting paid while sick.",
        outcome: "Incorrect. This is a known condition of contract work. Quitting burns a professional bridge.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "The 6-month contract is ending next week, and there is no offer for extension or conversion. What is the professional way to exit?",
    options: [
       {
        id: "handoff",
        text: "Document your work, complete a smooth handover, and connect with colleagues on LinkedIn.",
        outcome: "Correct! A strong, professional exit secures your reputation and builds your network.",
        isCorrect: true,
      },
      {
        id: "stop-working",
        text: "Stop going to work since it's almost over anyway.",
        outcome: "Incorrect. This leaves a terrible final impression and ruins potential references.",
        isCorrect: false,
      },
      {
        id: "steal-data",
        text: "Download company confidential documents to use in your next job.",
        outcome: "Incorrect. This is unethical, illegal, and will destroy your career.",
        isCorrect: false,
      },
     
      {
        id: "beg-extension",
        text: "Beg the manager every day to keep you on.",
        outcome: "Incorrect. While expressing interest is fine, begging is unprofessional and rarely works.",
        isCorrect: false,
      },
    ],
  },
];

const SimulationContractRoleDecision = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-24";
  const gameData = getGameDataById(gameId);
  const totalStages = SIMULATION_STAGES.length;

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  
  const stage = SIMULATION_STAGES[currentStageIndex];

  const handleChoice = (option) => {
    if (selectedChoice || !stage) return;
    setSelectedChoice(option);

    if (option.isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(coinsPerLevel, true);
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
      title="Simulation: Contract Role Decision"
      subtitle={
        showResult
          ? "Simulation complete! You successfully navigated a contract role decision."
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
                {selectedChoice.isCorrect ? 'Professional Action' : 'Career Error'}
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

export default SimulationContractRoleDecision;
