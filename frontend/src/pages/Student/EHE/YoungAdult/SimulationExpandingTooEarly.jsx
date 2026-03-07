import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "Your startup earned a profit for two months straight, and you want to expand immediately. What is the most financially responsible first step?",
    options: [
      {
        id: "opt1",
        text: "Open a new branch blindly to capture more market share.",
        outcome: "Incorrect. Premature scaling without data often leads to severe cash flow crises.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Check cash reserves and operations system stability first.",
        outcome: "Correct! Two months of profit is great, but you need long-term stability and enough cash buffer before expanding.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Spend the profit on a huge launch party to build hype.",
        outcome: "Incorrect. While fun, this drains your newly earned capital instead of reinvesting it strategically.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Hire 10 new employees immediately to handle anticipated growth.",
        outcome: "Incorrect. Overhiring before demand is sustained will burn through your cash reserves quickly.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "You review your cash reserves and find enough for 3 months of current operations. Is this enough to open a second location?",
    options: [
      {
        id: "opt1",
        text: "Yes, any reserve is enough to start expanding.",
        outcome: "Incorrect. Expanding requires its own capital and usually drains existing reserves temporarily.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Yes, the new location will pay for itself immediately.",
        outcome: "Incorrect. New locations almost always operate at a loss for the first few months.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "No, expanding requires additional dedicated capital and a larger buffer for your core business.",
        outcome: "Correct! You must protect your primary revenue source while funding the expansion separately.",
        isCorrect: true,
      },
      {
        id: "opt4",
        text: "No, you should never expand until you have 5 years of cash saved.",
        outcome: "Incorrect. This is overly conservative and stifles reasonable growth.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "Your current team is working at 100% capacity and barely keeping up with orders. Should you launch a new product line now?",
    options: [
      {
        id: "opt2",
        text: "No, you need to stabilize and document current operations so the team isn't overworked first.",
        outcome: "Correct! Stabilize your foundation before adding structural weight to the business.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Yes, more products mean more money immediately.",
        outcome: "Incorrect. Launching new products strains an already maxed-out team, leading to quality drops.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Yes, but don't tell the team until it launches.",
        outcome: "Incorrect. This will completely destroy team morale and trust.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Yes, just force everyone to work weekends.",
        outcome: "Incorrect. This leads to immediate burnout and high employee turnover.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What is a common sign of 'Premature Scaling' in a startup?",
    options: [
      {
        id: "opt1",
        text: "Taking too long to launch a perfect product.",
        outcome: "Incorrect. That is perfectionism, not premature scaling.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Focusing too much on team culture.",
        outcome: "Incorrect. Good culture is rarely the cause of startup failure.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Refusing to take any investor money.",
        outcome: "Incorrect. Bootstrapping is a valid strategy, not premature scaling.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Spending heavily on customer acquisition before clearly proving people want the product.",
        outcome: "Correct! Pumping money into an unproven, unprofitable product is a classic fatal startup mistake.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 5,
    prompt: "How should you handle unexpected drops in revenue during an expansion phase?",
    options: [
      {
        id: "opt1",
        text: "Ignore it; revenue always bounces back automatically.",
        outcome: "Incorrect. Ignoring financial realities is a fast track to bankruptcy.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Immediately take out the largest high-interest loan available.",
        outcome: "Incorrect. Debt without a repayment strategy will kill the business.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Rely on the cash buffer you set aside before expanding, and temporarily scale back new expenses.",
        outcome: "Correct! Planning for the worst allows you to survive temporary downturns while continuing to operate.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Fire your original core team to save money for the expansion.",
        outcome: "Incorrect. Losing your experienced core team will destroy your main revenue engine.",
        isCorrect: false,
      },
      
    ],
  },
];

const SimulationExpandingTooEarly = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-41";
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
      title="Simulation: Expanding Too Early"
      subtitle={
        showResult
          ? "Simulation complete! You successfully managed the expansion risks."
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
                {selectedChoice.isCorrect ? 'Sustainable Move' : 'Risky Mistake'}
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

export default SimulationExpandingTooEarly;
