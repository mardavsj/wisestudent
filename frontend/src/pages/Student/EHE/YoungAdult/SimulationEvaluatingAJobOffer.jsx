import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "You receive an unexpectedly high-paying job offer, but it is completely unrelated to your field of study or long-term career goals. What do you do?",
    options: [
      {
        id: "opt1",
        text: "Accept it immediately for the salary only.",
        outcome: "Incorrect. High short-term pay in an unrelated field can derail your long-term career trajectory and earning potential.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Ask peers for social validation before accepting.",
        outcome: "Incorrect. Peers will likely focus only on the salary and ignore your unique professional goals.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Evaluate long-term career alignment and the transferability of skills gained.",
        outcome: "Correct! If the skills don't transfer to your ultimate goal, this is a dangerous detour despite the money.",
        isCorrect: true,
      },
      {
        id: "opt4",
        text: "Reject it without any thought because it's not the exact job title you wanted.",
        outcome: "Incorrect. Sometimes 'unrelated' roles offer highly transferable skills (like sales or management) that accelerate your primary career.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "You receive the official offer letter. The 'Total Cost to Company (CTC)' is written as ₹12,000,000 per year, which sounds amazing. What is your next step?",
    options: [
       {
        id: "opt3",
        text: "Calculate the exact monthly in-hand take-home pay after taxes and mandatory deductions.",
        outcome: "Correct! A high CTC often hides aggressive taxes, forced retirement contributions, and unrealistic variable bonuses.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Celebrate immediately; you are now rich.",
        outcome: "Incorrect. CTC includes variables and benefits you might never see in cash.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Demand they increase it to ₹15,000,000.",
        outcome: "Incorrect. Negotiating without analyzing the breakdown is unprofessional and likely to backfire.",
        isCorrect: false,
      },
     
      {
        id: "opt4",
        text: "Sign it immediately before they change their minds.",
        outcome: "Incorrect. Never sign an offer without understanding the cash flow reality.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "The offer includes 'Unlimited PTO (Paid Time Off)'. How should you interpret this?",
    options: [
      {
        id: "opt1",
        text: "As a major red flag that they will never let you take time off.",
        outcome: "Incorrect. While it can be mismanaged, it isn't automatically a red flag.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "As permission to work only 3 months a year.",
        outcome: "Incorrect. 'Unlimited' usually means 'at your manager's discretion', and performance is still evaluated.",
        isCorrect: false,
      },
      
      {
        id: "opt4",
        text: "Use it to negotiate a higher base salary.",
        outcome: "Incorrect. PTO structures are usually company-wide policies, not tools to increase your base pay.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Ask current employees or the hiring manager about the actual company culture regarding taking time off.",
        outcome: "Correct! The true value of 'Unlimited PTO' depends entirely on company culture and whether people actually use it without penalty.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "The contract includes a strict 'Non-Compete Clause' stating you cannot work in the same industry for 2 years after leaving. Is this a problem?",
    options: [
      {
        id: "opt1",
        text: "No, they probably won't enforce it.",
        outcome: "Incorrect. Assuming contracts won't be enforced is a massive legal risk.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Yes, you should seek legal counsel or negotiate the terms to avoid getting trapped out of your career later.",
        outcome: "Correct! Restrictive clauses can destroy your career mobility. Always negotiate the scope or duration.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Yes, you must refuse to sign the contract completely.",
        outcome: "Incorrect. Walking away without discussing it loses you the job unnecessarily.",
        isCorrect: false,
      },
      
      {
        id: "opt4",
        text: "No, it just proves they value you highly.",
        outcome: "Incorrect. It proves they want to protect their business, not your career.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "You notice the role has no defined career progression plan or mentorship structure. How do you address this?",
    options: [
      {
        id: "opt1",
        text: "Accept it. Titles and promotions don't matter if the pay is okay.",
        outcome: "Incorrect. Stagnation in your 20s severely limits your lifetime earning potential.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Demand they create a new management role for you immediately.",
        outcome: "Incorrect. This is arrogant and will likely cause them to pull the offer.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Ask specific questions during the offer stage about how performance is measured and how advancement occurs.",
        outcome: "Correct! Clarifying evaluation metrics and promotion pathways before signing ensures you aren't walking into a dead-end job.",
        isCorrect: true,
      },
      {
        id: "opt4",
        text: "Plan to aggressively out-work everyone and force them to promote you.",
        outcome: "Incorrect. Hard work without a structural path often just leads to burnout without reward.",
        isCorrect: false,
      },
    ],
  },
];

const SimulationEvaluatingAJobOffer = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-79";
  const gameData = getGameDataById(gameId);
  const totalStages = SIMULATION_STAGES.length;

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 20;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 40;
  
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
      title="Simulation: Evaluating a Job Offer"
      subtitle={
        showResult
          ? "Simulation complete! You successfully evaluated the true value of the job offer."
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
                {selectedChoice.isCorrect ? 'Strategic Choice' : 'Career Misstep'}
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

export default SimulationEvaluatingAJobOffer;
