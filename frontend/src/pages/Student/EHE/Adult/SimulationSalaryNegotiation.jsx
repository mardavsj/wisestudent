import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "You are offered a major promotion to a management role, but the offer letter vaguely states compensation will be 'reviewed later'. What is your first response?",
    options: [
      {
        id: "opt1",
        text: "Accept it immediately. You don't want to seem ungrateful for the new title.",
        outcome: "Incorrect. Accepting a role without clear compensation terms often leads to doing more work for the same pay.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Reject it emotionally, telling them it's insulting to offer a promotion without a raise.",
        outcome: "Incorrect. Emotional rejection burns bridges and shuts down any chance of negotiation.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Professionally thank them for the offer and request a meeting to clarify the specific compensation expectations.",
        outcome: "Correct! Clarifying expectations before accepting is the foundation of professional negotiation.",
        isCorrect: true,
      },
      {
        id: "opt4",
        text: "Accept it, but secretly plan to do a terrible job until they pay you more.",
        outcome: "Incorrect. Sabotaging your own performance ruins your reputation and ensures you won't get a raise.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "During the clarification meeting, your boss says the budget is tight, offering the promotion with only a 2% pay increase. How do you prepare to counter?",
    options: [
      {
        id: "opt1",
        text: "Prepare a data-driven document showing the market rate for this new role and the specific value you bring.",
        outcome: "Correct! Data and market research remove emotion from the negotiation and provide objective justification.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Complain about your personal expenses, like your high rent, to guilt them into a raise.",
        outcome: "Incorrect. The company pays you for the value you provide to the business, not your personal financial needs.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Tell them you know exactly how much your coworkers make and demand the same.",
        outcome: "Incorrect. Relying on workplace gossip as leverage is unprofessional and rarely successful.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Immediately accept the 2% because any increase is better than none.",
        outcome: "Incorrect. Accepting the first low offer without countering anchors your value artificially low.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "You present your market research, but your boss is firm: base salary cannot increase more than 2%. What alternative should you negotiate?",
    options: [
      {
        id: "opt1",
        text: "There are no alternatives. Threaten to quit on the spot.",
        outcome: "Incorrect. Ultimatums should only be used if you actually have another job lined up and are willing to leave.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Negotiate for non-salary benefits like extra PTO, a performance bonus structure, or remote work days.",
        outcome: "Correct! Total compensation includes benefits. If base pay is rigid, negotiate other valuable perks.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Demand they lay off a team member so they have budget for your raise.",
        outcome: "Incorrect. Demanding someone else be fired for your benefit is highly unethical and unprofessional.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Accept the 2% and hold a grudge permanently.",
        outcome: "Incorrect. Passive aggression is toxic for your career. If you accept a deal, you must commit to it.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "The boss agrees to your proposed performance bonus structure: you get a 10% bonus if you hit specific targets. What is the critical next step?",
    options: [
      {
        id: "opt1",
        text: "Assume they will honor it verbally and just get back to work.",
        outcome: "Incorrect. Verbal agreements in business are frequently forgotten or denied later.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Celebrate with your team by telling everyone exactly what deal you got.",
        outcome: "Incorrect. Discussing intricate bonus arrangements publicly can cause unnecessary team friction.",
        isCorrect: false,
      },
      
      {
        id: "opt4",
        text: "Ask to change the terms again now that they've agreed once.",
        outcome: "Incorrect. Renegotiating an already agreed-upon deal destroys trust and makes you look unreliable.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Get the agreed-upon targets and bonus structure clearly documented in writing and signed.",
        outcome: "Correct! If it isn't in writing, it doesn't exist. Written terms protect both you and the company.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 5,
    prompt: "Six months later, you crush the targets and receive the bonus. When considering your overall career, what did this negotiation teach you?",
    options: [
      {
        id: "opt1",
        text: "Negotiation is a combative battle where one side must lose.",
        outcome: "Incorrect. Good negotiation is collaborative problem-solving, not a fight.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Advocating for your own value professionally, using data and flexibility, yields the best long-term results.",
        outcome: "Correct! You must be your own advocate. Clear expectations and written agreements ensure fair compensation.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "You should never accept a base salary increase under 15%.",
        outcome: "Incorrect. Market conditions and internal budgets vary; rigid, arbitrary rules limit your options.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Money is the only thing that matters in a career.",
        outcome: "Incorrect. Total compensation, work environment, and growth opportunities all matter.",
        isCorrect: false,
      },
    ],
  },
];

const SimulationSalaryNegotiation = () => {
  const location = useLocation();
  const gameId = "ehe-adults-18";
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
      title="Simulation: Salary Negotiation"
      subtitle={
        showResult
          ? "Simulation complete! You successfully advocated for your value."
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
                {selectedChoice.isCorrect ? 'Professional Tactics' : 'Negotiation Error'}
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

export default SimulationSalaryNegotiation;
