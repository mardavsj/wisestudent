import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "A critical client project is delayed due to an unexpected technical failure. The deadline is in 2 hours. What is your first reaction?",
    options: [
      {
        id: "opt1",
        text: "Panic and blame the IT team for the failure.",
        outcome: "Incorrect. An emotional reaction wastes valuable time and damages team morale.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Ignore the deadline and hope the client doesn't notice.",
        outcome: "Incorrect. Delaying indefinitely destroys trust and professionalism.",
        isCorrect: false,
      },
      
      {
        id: "opt4",
        text: "Tell the client the project is finished and send them a broken version.",
        outcome: "Incorrect. This is a panicked reaction that will ruin the client relationship instantly.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Quickly assess the impact and communicate a revised timeline to the client.",
        outcome: "Correct! A structured evaluation of the impact allows for transparent and realistic communication.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "During a major product launch, a key vendor fails to deliver a crucial component. The launch event starts in 30 minutes.",
    options: [
      {
        id: "opt1",
        text: "Cancel the entire launch immediately and send angry emails to the vendor.",
        outcome: "Incorrect. Canceling in a panic causes maximum disruption without exploring alternatives.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Wait and see if the vendor magically shows up at the last minute.",
        outcome: "Incorrect. Delaying action indefinitely leaves you completely unprepared.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Evaluate backup options and adjust the launch plan to focus on available features.",
        outcome: "Correct! Structured evaluation helps you pivot and salvage the event gracefully under pressure.",
        isCorrect: true,
      },
      {
        id: "opt4",
        text: "Hide the missing component and hope nobody asks about it.",
        outcome: "Incorrect. A deceptive, emotional reaction will lead to embarrassment during the launch.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "Your main competitor just released a feature you were planning to launch next month, but theirs is cheaper. How do you respond?",
    options: [
      {
        id: "opt1",
        text: "Force your team to work overnight to release your feature tomorrow, regardless of quality.",
        outcome: "Incorrect. A panicked reaction leads to burnout and a buggy release.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Analyze their feature's strengths and weaknesses to refine your own unique value proposition.",
        outcome: "Correct! Structured evaluation allows you to adapt strategically rather than reacting blindly.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Stop development on your feature entirely since they beat you to it.",
        outcome: "Incorrect. Giving up indefinitely wastes all your previous effort without analysis.",
        isCorrect: false,
      },
      
      {
        id: "opt4",
        text: "Publicly criticize their feature on social media.",
        outcome: "Incorrect. An emotional outburst looks unprofessional and desperate.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "A major financial error is discovered in the quarterly report just before the board meeting. You are presenting in 10 minutes.",
    options: [
      {
        id: "opt3",
        text: "Acknowledge the error upfront, explain the impact, and present a plan to correct it.",
        outcome: "Correct! Structured evaluation and transparency build credibility even in difficult moments.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Refuse to present and walk out of the room.",
        outcome: "Incorrect. This emotional reaction shows a complete lack of accountability and leadership.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Present the report as-is and hope nobody notices the error.",
        outcome: "Incorrect. Delaying the inevitable is unethical and highly damaging when discovered.",
        isCorrect: false,
      },
      
      {
        id: "opt4",
        text: "Blame the accounting software during the presentation.",
        outcome: "Incorrect. Deflecting blame emotionally makes you look unreliable.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "A PR crisis occurs involving a misunderstood comment by your CEO. Social media is demanding an immediate response.",
    options: [
      {
        id: "opt1",
        text: "Send out an angry defensive tweet immediately from the company account.",
        outcome: "Incorrect. Emotional reactions online always escalate PR crises.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Gather the facts, evaluate the sentiment, and draft a calm, clarifying statement.",
        outcome: "Correct! Structured evaluation ensures your response is accurate, measured, and effective.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Go silent and hope the controversy dies down in a few days.",
        outcome: "Incorrect. Delaying indefinitely allows others to control the narrative.",
        isCorrect: false,
      },
      
      {
        id: "opt4",
        text: "Fire the social media manager to make it look like someone else's fault.",
        outcome: "Incorrect. A knee-jerk emotional reaction hurts innocent team members and doesn't solve the core issue.",
        isCorrect: false,
      },
    ],
  },
];

const SimulationUnderPressure = () => {
  const location = useLocation();
  const gameId = "ehe-adults-35";
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
      title="Simulation: Under Pressure"
      subtitle={
        showResult
          ? "Simulation complete! You successfully navigated pressure with structured evaluation."
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

export default SimulationUnderPressure;
