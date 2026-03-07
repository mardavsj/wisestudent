import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "You receive a high-paying job offer just 3 months before completing your degree. The company wants you to start immediately and drop out. What is your initial approach?",
    options: [
      {
        id: "opt1",
        text: "Accept it immediately for the salary alone because money is all that matters.",
        outcome: "Incorrect. Sacrificing your core qualifications for immediate cash is completely short-sighted.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Base the decision on social recognition and how impressed your friends will be.",
        outcome: "Incorrect. Operating based on peer validation rather than strategic alignment is dangerous.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Carefully evaluate the long-term career impact of dropping out versus the immediate salary.",
        outcome: "Correct! You must weigh the lifetime value of the degree against the short-term cash offer.",
        isCorrect: true,
      },
      {
        id: "opt4",
        text: "Tell the company they are insulting you and block them.",
        outcome: "Incorrect. Burning professional bridges over a legal offer is unprofessional.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "During your evaluation, you discover the job is a dead-end support role with high turnover, while your degree path leads to senior leadership. What is the reality?",
    options: [
      {
        id: "opt1",
        text: "Take it anyway, the immediate cash is too good to pass up right now.",
        outcome: "Incorrect. You are trading high lifetime earning potential for a low, immediate ceiling.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Reject the immediate full-time dropout demand; trading long-term potential for a dead-end role is a terrible deal.",
        outcome: "Correct! It is a trap. The degree provides the foundation to bypass these low-ceiling roles entirely.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Try to do both full-time and inevitably fail at both due to extreme exhaustion.",
        outcome: "Incorrect. Over-committing guarantees failure in both arenas.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Ask your parents to make the final decision for you.",
        outcome: "Incorrect. You must learn to analyze and own your career choices as an adult.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "The employer counters: they offer to let you work part-time until you graduate, but at a slightly lower hourly rate than the full-time offer.",
    options: [
      {
        id: "opt1",
        text: "Be deeply offended by the lower rate and reject it entirely out of pride.",
        outcome: "Incorrect. Ego-driven decisions blind you to perfectly reasonable compromises.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Accept the part-time offer, as it builds your resume while letting you finish the degree safely.",
        outcome: "Correct! This is a win-win. You gain industry experience without sacrificing your educational foundation.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Take it and then secretly work full-time hours anyway, skipping your final classes.",
        outcome: "Incorrect. You will fail your classes and waste the tuition you already paid.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Demand the full-time rate for part-time work and threaten to walk away entirely.",
        outcome: "Incorrect. Part-time roles carry different benefit structures; aggression will just lose the offer.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "If you were to drop out for the job, what is the biggest hidden risk 5 years from now?",
    options: [
      {
        id: "opt1",
        text: "The company might restructure, leaving you unemployed with no degree and a gap in fundamental qualifications.",
        outcome: "Correct! Without the degree, your resume might be filtered out by HR algorithms at future jobs, trapping you.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "You will definitely become a millionaire and not need the degree anyway.",
        outcome: "Incorrect. Survivor bias makes you think all dropouts become billionaires; most do not.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "You will easily be able to enroll again and finish it in exactly 3 months whenever you want.",
        outcome: "Incorrect. Life gets busy, curriculums change, and returning to school years later is incredibly difficult.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "There are no hidden risks, dropping out for money is always mathematically smart.",
        outcome: "Incorrect. The statistics overwhelmingly favor degree-holders for lifetime earnings.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "After careful consideration, you decide finishing your degree is the right long-term choice. How do you communicate this to the eager employer?",
    options: [
      {
        id: "opt1",
        text: "Ghost them; they don't deserve a response if you're not taking the job.",
        outcome: "Incorrect. Ghosting burns your professional reputation permanently in that industry.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Send an angry email telling them it's unethical to ask you to drop out of university.",
        outcome: "Incorrect. The offer wasn't a personal attack, it was just business. React calmly.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Lie and say you have a medical emergency so they stop pressuring you.",
        outcome: "Incorrect. Lying is a terrible foundation for a professional relationship.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Professionally decline the immediate full-time start, express strong interest in joining post-graduation, and propose the part-time compromise.",
        outcome: "Correct! This shows maturity, negotiation skills, and keeps the door wide open for the future.",
        isCorrect: true,
      },
    ],
  },
];

const SimulationEducationVsImmediateJob = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-88";
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
      title="Simulation: Education vs Immediate Job"
      subtitle={
        showResult
          ? "Simulation complete! You successfully managed the job offer dilemma."
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
                {selectedChoice.isCorrect ? 'Strategic Thinking' : 'Short-Term Trap'}
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

export default SimulationEducationVsImmediateJob;
