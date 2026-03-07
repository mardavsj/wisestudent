import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "You've just graduated. You have a solid job offer, but you also have an idea for a startup. How do you make your initial decision?",
    options: [
      {
        id: "opt1",
        text: "Decide based entirely on the emotional excitement of being a 'founder'.",
        outcome: "Incorrect. Emotional excitement fades quickly when the difficult reality of running a business sets in.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Follow the social trend because all your friends are doing startups.",
        outcome: "Incorrect. Your friends' financial risk tolerance and skills are different from yours.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Conduct a thorough, objective risk and financial evaluation of both paths.",
        outcome: "Correct! You must quantify the guaranteed salary against the high-risk, high-reward potential of the startup.",
        isCorrect: true,
      },
      {
        id: "opt4",
        text: "Flip a coin; it's all just luck anyway.",
        outcome: "Incorrect. Career trajectories are built on deliberate strategy, not random chance.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "During your financial evaluation, you realize you have ₹0 in savings and a small student loan. The startup will need 6 months to generate revenue.",
    options: [
      {
        id: "opt1",
        text: "Take out high-interest personal loans to fund your living expenses while you build the startup.",
        outcome: "Incorrect. Funding living expenses with debt while building a pre-revenue startup is a path to bankruptcy.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Accept the job offer to build financial stability and work on the startup idea slowly on weekends.",
        outcome: "Correct! The job provides the capital to survive and potentially fund the startup without catastrophic risk.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Ignore the math. Passion will somehow pay the rent.",
        outcome: "Incorrect. Passion does not cover living expenses or debt payments.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Ask your parents to sacrifice their retirement fund to support your idea.",
        outcome: "Incorrect. Imposing extreme financial risk on family based on an unproven idea is irresponsible.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "You decide to take the job and work on the startup part-time. How do you validate if your startup idea is actually good before quitting your job later?",
    options: [
      {
        id: "opt1",
        text: "Ask your closest friends and family if they like the idea.",
        outcome: "Incorrect. Friends and family will often lie to support you, providing false validation.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Spend 6 months building the perfect product in secret.",
        outcome: "Incorrect. Without customer feedback, you risk building something nobody wants to buy.",
        isCorrect: false,
      },
      
      {
        id: "opt4",
        text: "Assume it's brilliant because you thought of it.",
        outcome: "Incorrect. Confidence is not a substitute for market research and customer validation.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Create a basic prototype and see if strangers will actually pay money for it.",
        outcome: "Correct! The only real validation of a business idea is paying customers.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "Your weekend startup idea starts making a small, steady profit. Your job is very demanding and leaving you exhausted. What now?",
    options: [
      {
        id: "opt2",
        text: "Review if the startup's profit can consistently cover your minimum living expenses.",
        outcome: "Correct! The transition point from job to startup is when the startup's revenue can reliably sustain your basic life needs.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Quit the job immediately; any profit proves the startup will make millions.",
        outcome: "Incorrect. Small profit is not proof of scale. You might not have enough cash flow to survive.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Quit the startup. The job is safer.",
        outcome: "Incorrect. If the startup is actually gaining traction, quitting too early wastes a massive opportunity.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Stop performing well at your job so they fire you, forcing you to do the startup.",
        outcome: "Incorrect. Burning professional bridges and relying on severance/unemployment is a terrible strategy.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "A wealthy investor offers you seed funding for the startup, but demands 60% of the company ownership and control. What is the impact?",
    options: [
      {
        id: "opt1",
        text: "Take it instantly; any funding is good funding.",
        outcome: "Incorrect. Giving up 60% early means you are essentially an employee in your own company.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Negotiate aggressively but be prepared to walk away if the terms mean you lose control of your vision.",
        outcome: "Correct! Funding should accelerate your vision, not surrender control of your company entirely.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Insult the investor for offering terrible terms.",
        outcome: "Incorrect. Professionalism requires polite negotiation, even when declining bad offers.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Give them the 60% because having a wealthy partner guarantees success.",
        outcome: "Incorrect. Execution matters more than just having rich investors, and losing control kills founder motivation.",
        isCorrect: false,
      },
    ],
  },
];

const SimulationCareerVsStartupChoice = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-91";
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
      title="Simulation: Career vs Startup Choice"
      subtitle={
        showResult
          ? "Simulation complete! You balanced ambition with financial reality."
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
                {selectedChoice.isCorrect ? 'Calculated Risk' : 'Reckless Action'}
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

export default SimulationCareerVsStartupChoice;
