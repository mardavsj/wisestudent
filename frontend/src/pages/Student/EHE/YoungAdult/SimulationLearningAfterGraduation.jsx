import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "You graduate and get your first job. What is your approach to learning now?",
    options: [
      {
        id: "stop",
        text: "Stop learning completely; you have your degree and a job.",
        outcome: "Incorrect. The real world requires constant adaptation.",
        isCorrect: false,
      },
      {
        id: "wait",
        text: "Wait for opportunities and training provided by your company.",
        outcome: "Incorrect. Relying solely on your company limits your potential.",
        isCorrect: false,
      },
      
      {
        id: "complain",
        text: "Complain that the job doesn't use everything you learned in college.",
        outcome: "Incorrect. College provides a foundation, but you must keep building.",
        isCorrect: false,
      },
      {
        id: "continue",
        text: "Continue learning new skills relevant to your career.",
        outcome: "Correct! Proactive learning is the key to long-term success.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "Your industry announces a shift to a new technology over the next three years. How do you respond?",
    options: [
      {
        id: "ignore",
        text: "Ignore the shift; it probably won't affect your specific job.",
        outcome: "Incorrect. Ignoring industry trends leaves you vulnerable to becoming obsolete.",
        isCorrect: false,
      },
      {
        id: "panic",
        text: "Panic and decide to completely change your career path.",
        outcome: "Incorrect. Rash decisions won't help. A strategic approach to upskilling is better.",
        isCorrect: false,
      },
      {
        id: "upskill",
        text: "Research the shift and start learning the required new skills.",
        outcome: "Correct! Anticipating change and proactively upskilling ensures your long-term career growth.",
        isCorrect: true,
      },
      {
        id: "wait",
        text: "Wait for your employer to tell you exactly what you need to learn.",
        outcome: "Incorrect. Employers prefer individuals who manage their own professional development.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "A colleague gets promoted because they demonstrated a skill you don't have. What's your next step?",
    options: [
      {
        id: "jealousy",
        text: "Complain that the promotion was unfair and stop working hard.",
        outcome: "Incorrect. Resentment doesn't lead to personal growth.",
        isCorrect: false,
      },
      {
        id: "learn",
        text: "Ask them for resources to learn that skill and start studying.",
        outcome: "Correct! Learning from peers is an excellent way to grow and show initiative.",
        isCorrect: true,
      },
      {
        id: "ignore",
        text: "Ignore it and hope you get promoted next time based on seniority.",
        outcome: "Incorrect. Promotions are earned through value, not just time served.",
        isCorrect: false,
      },
      {
        id: "quit",
        text: "Look for another job where your current skills are enough.",
        outcome: "Incorrect. Avoiding skill gaps will catch up with you wherever you go.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "You have some free time on the weekend. How do you balance rest with career growth?",
    options: [
      {
        id: "balance",
        text: "Dedicate a couple of hours to a course and spend the rest resting.",
        outcome: "Correct! A balanced approach helps you grow without sacrificing mental health.",
        isCorrect: true,
      },
      {
        id: "burnout",
        text: "Spend all weekend studying; rest is a waste of time.",
        outcome: "Incorrect. Without adequate rest, you'll face burnout very quickly.",
        isCorrect: false,
      },
      
      {
        id: "party",
        text: "Completely ignore any productive habits and only focus on entertainment.",
        outcome: "Incorrect. While rest is important, dedicating 0 hours to personal goals limits growth.",
        isCorrect: false,
      },
      {
        id: "plan",
        text: "Plan to study but easily give up to watch an entire TV series.",
        outcome: "Incorrect. Consistency is key in lifelong learning.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "After 2 years, your manager asks what you see yourself doing next. How does your answer reflect your learning mindset?",
    options: [
      {
        id: "same",
        text: "'I want to keep doing exactly what I am doing now forever.'",
        outcome: "Incorrect. This shows a lack of ambition and adaptability.",
        isCorrect: false,
      },
      {
        id: "demand",
        text: "'I expect to be a manager, even though I haven't learned management skills.'",
        outcome: "Incorrect. Ambition without the willingness to learn the necessary skills is unrealistic.",
        isCorrect: false,
      },
      
      {
        id: "clueless",
        text: "'I have no idea, you tell me.'",
        outcome: "Incorrect. You must take ownership of your own career trajectory.",
        isCorrect: false,
      },
      {
        id: "growth",
        text: "'I want to take on more complex projects and I'm learning X skill to prepare.'",
        outcome: "Correct! This demonstrates forward-thinking and active preparation for the future.",
        isCorrect: true,
      },
    ],
  },
];

const SimulationLearningAfterGraduation = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-6";
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
      title="Simulation: Learning After Graduation"
      subtitle={
        showResult
          ? "Simulation complete! You demonstrated a strong commitment to lifelong learning."
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
                {selectedChoice.isCorrect ? 'Excellent Choice' : 'Missed Opportunity'}
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

export default SimulationLearningAfterGraduation;
