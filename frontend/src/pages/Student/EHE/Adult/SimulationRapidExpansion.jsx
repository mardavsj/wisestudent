import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "Your startup has been profitable for 3 consecutive months, and you have accumulated surplus funds. How do you approach expansion?",
    options: [
      {
        id: "opt1",
        text: "Open 2 new branch locations instantly to capture more market share.",
        outcome: "Incorrect. Rapid expansion without evaluating operational capacity often leads to overextension and failure.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Evaluate your operational stability and capacity to handle increased scale first.",
        outcome: "Correct! Structured evaluation ensures your core business can support expansion before committing capital.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Spend the funds on an extravagant marketing campaign without changing operations.",
        outcome: "Incorrect. Driving massive demand without capacity will damage your brand reputation.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Distribute the surplus funds entirely as bonuses to the founders.",
        outcome: "Incorrect. Starving a growing business of capital stunts long-term potential.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "You decide to evaluate stability. You find that your current team is already working at 95% capacity. What is the next logical step?",
    options: [
      {
        id: "opt1",
        text: "Push the team to work 120% capacity so you don't have to spend on hiring.",
        outcome: "Incorrect. This leads directly to burnout, high turnover, and operational collapse.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Delay expansion indefinitely because hiring is too difficult.",
        outcome: "Incorrect. Complete stagnation is a missed opportunity for a profitable business.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Invest in technology or hire key roles to build capacity before expanding.",
        outcome: "Correct! Building operational capacity is the foundation of sustainable growth.",
        isCorrect: true,
      },
      {
        id: "opt4",
        text: "Expand anyway and hope the team figures it out under pressure.",
        outcome: "Incorrect. Hoping for the best is not a valid operational strategy.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "You are considering expanding into a new geographic market. What is your strategy for entering this new area?",
    options: [
      {
        id: "opt2",
        text: "Conduct localized market research to validate demand and understand nuances.",
        outcome: "Correct! Structured research minimizes the risk of entering an unprofitable market.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Assume the new market is exactly like your current one and copy everything.",
        outcome: "Incorrect. Markets vary significantly; assumptions without data lead to costly mistakes.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Send your least experienced manager to run the new location as a test.",
        outcome: "Incorrect. New ventures require strong, experienced leadership to navigate early challenges.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Lower your prices to zero for the first month to buy customers.",
        outcome: "Incorrect. Deep discounting sets unsustainable expectations and burns cash too fast.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "An investor offers you a massive injection of capital, but demands you grow at an unrealistic, hyper-aggressive pace.",
    options: [
      {
        id: "opt1",
        text: "Accept the money and promise you can meet their impossible targets.",
        outcome: "Incorrect. Overpromising to investors creates immense destructive pressure and compromises integrity.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Reject the money outright and insult their growth strategy.",
        outcome: "Incorrect. Burning bridges with investors is unprofessional.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Take the money, but use it to pay off your personal mortgage instead.",
        outcome: "Incorrect. This is fraudulent and illegal.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Present a realistic, data-backed growth model and negotiate sustainable terms.",
        outcome: "Correct! Aligning investor expectations with operational reality is crucial for long-term success.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 5,
    prompt: "During the expansion phase, a core process breaks down, causing customer complaints to spike. How do you respond?",
    options: [
      {
        id: "opt1",
        text: "Ignore the complaints; focus entirely on acquiring new customers.",
        outcome: "Incorrect. A leaky bucket strategy destroys your brand and long-term viability.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Fire the customer support team for not handling the complaints better.",
        outcome: "Incorrect. Blaming downstream teams for a systemic process failure is toxic leadership.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Pause expansion efforts temporarily to fix the core process breakdown.",
        outcome: "Correct! Prioritizing a stable foundation over reckless growth ensures long-term survival.",
        isCorrect: true,
      },
      {
        id: "opt4",
        text: "Delete the negative reviews online and pretend nothing went wrong.",
        outcome: "Incorrect. Deception destroys trust and doesn't fix the underlying operational issue.",
        isCorrect: false,
      },
    ],
  },
];

const SimulationRapidExpansion = () => {
  const location = useLocation();
  const gameId = "ehe-adults-51";
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
      title="Simulation: Rapid Expansion"
      subtitle={
        showResult
          ? "Simulation complete! You successfully managed rapid expansion with stability."
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

export default SimulationRapidExpansion;
