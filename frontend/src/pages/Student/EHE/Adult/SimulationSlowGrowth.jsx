import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "You notice that your career growth has been incredibly slow in your current company without any clear promotions in sight. What is your first reaction?",
    options: [
      {
        id: "opt1",
        text: "Blame management only.",
        outcome: "Incorrect. Blaming management doesn't solve your problem or improve your market value.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Stop working seriously.",
        outcome: "Incorrect. 'Quiet quitting' damages your own skills and professional reputation.",
        isCorrect: false,
      },
      
      {
        id: "opt4",
        text: "Complain publicly on social media.",
        outcome: "Incorrect. Public complaining is unprofessional and hurts future job prospects.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Improve your skills and explore external options.",
        outcome: "Correct! Taking ownership of your career by upskilling and networking is the proactive choice.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "You decide to upskill. However, your current company doesn't offer any training budget for employees. What do you do?",
    options: [
      {
        id: "opt1",
        text: "Demand they pay for your training or you quit.",
        outcome: "Incorrect. Demanding things aggressively often leads to termination without a backup plan.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Take affordable online courses or self-learn through personal projects.",
        outcome: "Correct! Investing in yourself is your responsibility when the company won't.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Wait until you join a company that pays for it.",
        outcome: "Incorrect. Waiting causes continued stagnation and makes you less hirable.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Find another internal department to complain to.",
        outcome: "Incorrect. Complaining internally without taking action is unproductive.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "While exploring external options, a recruiter reaches out with a role that pays 20% more but has terrible reviews for work-life balance.",
    options: [
      {
        id: "opt1",
        text: "Accept it immediately for the money.",
        outcome: "Incorrect. Ignoring toxic culture reviews often leads to severe burnout.",
        isCorrect: false,
      },
     
      {
        id: "opt3",
        text: "Ignore the recruiter completely.",
        outcome: "Incorrect. You should network, even if this specific job isn't perfect.",
        isCorrect: false,
      },
       {
        id: "opt2",
        text: "Validate the reviews by tactfully asking current or past employees on professional networks.",
        outcome: "Correct! Perform due diligence to ensure you aren't jumping from slow growth into a toxic trap.",
        isCorrect: true,
      },
      {
        id: "opt4",
        text: "Tell your boss about the offer to make them panic and give you a raise.",
        outcome: "Incorrect. Bluffing with an offer you don't actually intend to take is highly risky.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "Your manager calls you in and asks why your performance seems uninspired lately.",
    options: [
      {
        id: "opt3",
        text: "Professionally express that you are looking for more challenging responsibilities to grow.",
        outcome: "Correct! Framing your dissatisfaction as a desire for more responsibility is constructive and professional.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Deny everything and get defensive.",
        outcome: "Incorrect. Defensiveness breaks trust and stops constructive dialogue.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Tell them you are bored and looking for other jobs.",
        outcome: "Incorrect. Being too blunt before securing a new offer can put your current job at risk.",
        isCorrect: false,
      },
      
      {
        id: "opt4",
        text: "Blame your team members for giving you boring work.",
        outcome: "Incorrect. Throwing colleagues under the bus destroys team relationships.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "Finally, you receive a strong external offer. How do you handle your resignation from your current slow-growth company?",
    options: [
      {
        id: "opt1",
        text: "Leave immediately without notice.",
        outcome: "Incorrect. Burning bridges in your industry can haunt your career later.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Give standard notice and ensure a smooth handover to protect your professional network.",
        outcome: "Correct! Networking is long-term. Even if growth was slow, leaving gracefully is the mark of a true professional.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Trash talk the management on your way out.",
        outcome: "Incorrect. Unnecessary negativity achieves nothing and hurts your credibility.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Stop showing up and wait for them to fire you.",
        outcome: "Incorrect. This is extremely unprofessional and voids references.",
        isCorrect: false,
      },
    ],
  },
];

const SimulationSlowGrowth = () => {
  const location = useLocation();
  const gameId = "ehe-adults-5";
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
      title="Simulation: Slow Growth"
      subtitle={
        showResult
          ? "Simulation complete! You successfully navigated a stagnant career situation."
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

export default SimulationSlowGrowth;
