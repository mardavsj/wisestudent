import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "You receive a job offer, but the salary structure mentions 'CTC' without a clear breakdown of in-hand salary. What do you do?",
    options: [
        {
        id: "clarify",
        text: "Clarify terms professionally and ask for a detailed breakdown.",
        outcome: "Correct! Always understand your exact take-home pay and deductions.",
        isCorrect: true,
      },
      {
        id: "accept",
        text: "Accept immediately to secure the job.",
        outcome: "Incorrect. You don't know your actual take-home pay.",
        isCorrect: false,
      },
      {
        id: "reject",
        text: "Reject emotionally because they seem to be hiding something.",
        outcome: "Incorrect. It's standard practice, it just requires clarification.",
        isCorrect: false,
      },
    
      {
        id: "ignore",
        text: "Ignore it; you can figure it out when the first paycheck arrives.",
        outcome: "Incorrect. You lose all negotiation leverage once you sign.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "The HR representative tells you the salary is 'non-negotiable'. You still feel it's below market rate. How do you respond?",
    options: [
      {
        id: "ultimatum",
        text: "Say 'If you don't increase it, I'm walking away.'",
        outcome: "Incorrect. Ultimatums often burn bridges unnecessarily.",
        isCorrect: false,
      },
      
      {
        id: "complain",
        text: "Tell them they are underpaying and being unfair.",
        outcome: "Incorrect. Emotionally charged responses are unprofessional.",
        isCorrect: false,
      },
      {
        id: "accept",
        text: "Accept it immediately because you are afraid of losing the offer.",
        outcome: "Incorrect. While you might accept it eventually, exploring other benefits first is wiser.",
        isCorrect: false,
      },
      {
        id: "flexible",
        text: "Ask if there is flexibility in other benefits like bonuses, remote work, or extra leave.",
        outcome: "Correct! Negotiation isn't just about base salary.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 3,
    prompt: "You decide to negotiate your base salary. What is the best way to justify your request?",
    options: [
      {
        id: "personal",
        text: "Say 'I need more money to pay off my student loans and rent.'",
        outcome: "Incorrect. Personal financial needs are not the employer's concern.",
        isCorrect: false,
      },
      {
        id: "comparison",
        text: "Tell them your friend at another company makes much more.",
        outcome: "Incorrect. Subjective comparisons lack professional grounding.",
        isCorrect: false,
      },
      {
        id: "value",
        text: "Present market research and highlight specific skills you bring that add value.",
        outcome: "Correct! Basing negotiations on your professional value and data is most effective.",
        isCorrect: true,
      },
      {
        id: "demand",
        text: "Ask for exactly double their offer to see what they say.",
        outcome: "Incorrect. Unrealistic requests make you seem out of touch with the market.",
        isCorrect: false,
      },
      
    ],
  },
  {
    id: 4,
    prompt: "The employer counters your negotiation with an offer that is slightly better, but still below your target. What is your next step?",
    options: [
      {
        id: "reject",
        text: "Reject it instantly out of pride.",
        outcome: "Incorrect. You might walk away from a great career opportunity over a small difference.",
        isCorrect: false,
      },
      {
        id: "review",
        text: "Ask for a day to review the revised offer and consider the total compensation package.",
        outcome: "Correct! Taking time to evaluate the full picture prevents rash decisions.",
        isCorrect: true,
      },
      {
        id: "demand",
        text: "Demand they meet your original number immediately.",
        outcome: "Incorrect. Real negotiation usually involves compromise from both sides.",
        isCorrect: false,
      },
      
      {
        id: "complain",
        text: "Accept it but tell them you are disappointed.",
        outcome: "Incorrect. Either accept the offer with grace and enthusiasm or decline it.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "You finally agree on a compensation package verbally over the phone. What should you do next to finalize it?",
    options: [
      {
        id: "written",
        text: "Request the final agreed-upon terms in writing via a formal offer letter.",
        outcome: "Correct! Always secure the final offer in writing before taking any further actions.",
        isCorrect: true,
      },
      {
        id: "wait",
        text: "Consider the negotiation done and wait for your first day.",
        outcome: "Incorrect. Verbal agreements can be forgotten or misunderstood.",
        isCorrect: false,
      },
      {
        id: "quit",
        text: "Resign from your current job immediately.",
        outcome: "Incorrect. Never resign until you have a signed, written offer in hand.",
        isCorrect: false,
      },
      
      {
        id: "text",
        text: "Text the HR manager a thumbs-up emoji to confirm.",
        outcome: "Incorrect. A professional process requires formal documentation, not casual texts.",
        isCorrect: false,
      },
    ],
  },
];

const SimulationSalaryNegotiation = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-15";
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
      title="Simulation: Salary Negotiation"
      subtitle={
        showResult
          ? "Simulation complete! You successfully navigated a professional salary negotiation."
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
                {selectedChoice.isCorrect ? 'Professional Action' : 'Negotiation Error'}
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
