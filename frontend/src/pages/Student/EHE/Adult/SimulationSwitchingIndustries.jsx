import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "You are feeling burnout in your current role and want to completely change your industry by pursuing a new qualification. What is your first step?",
    options: [
      {
        id: "opt1",
        text: "Make an emotional impulse jump and quit your current job immediately.",
        outcome: "Incorrect. Quitting without a solid plan or new qualifications leads to severe financial stress.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Start the new qualification without any research into the new industry.",
        outcome: "Incorrect. You might spend time and money on a qualification that isn't actually valued by employers.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Evaluate the skill gap and map out a realistic transition timeline.",
        outcome: "Correct! Careful planning and understanding what is required helps ensure a smooth, secure transition.",
        isCorrect: true,
      },
      {
        id: "opt4",
        text: "Complain to your manager to see if they'll give you a different role.",
        outcome: "Incorrect. If you want to change industries, your current manager likely cannot help you cross over.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "You start looking at required qualifications for the new industry. How do you pick the right one?",
    options: [
      {
        id: "opt1",
        text: "Choose the easiest and shortest course available online.",
        outcome: "Incorrect. Employers usually look for robust, recognized credentials, not just quick fixes.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Identify certifications highly requested in job postings and respected by professionals in that field.",
        outcome: "Correct! Matching your education to actual market demand increases your employability.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Just pick whatever degree has the fanciest title.",
        outcome: "Incorrect. Titles matter less than the actual skills and industry recognition of the program.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Ask your family what sounds best.",
        outcome: "Incorrect. Your family won't be hiring you; industry standards should dictate your choice.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "While studying for the new qualification, how do you manage your current career?",
    options: [
      {
        id: "opt1",
        text: "Stop performing well at your current job since you're leaving anyway.",
        outcome: "Incorrect. Burning bridges and getting fired will ruin your financial stability during the transition.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Tell everyone at work you hate the industry and are studying to leave.",
        outcome: "Incorrect. Announcing your departure prematurely can lead to being sidelined or let go.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Use company time to complete your coursework.",
        outcome: "Incorrect. Time theft is unethical and grounds for immediate termination.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Balance your time carefully, maintaining good performance while studying after hours.",
        outcome: "Correct! A disciplined approach secures your current income while building your future.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "You complete the qualification and begin applying for roles in the new industry. What compensation expectations are realistic?",
    options: [
         {
        id: "opt3",
        text: "Expect to start at a similar or slightly lower level while you build relevant industry experience.",
        outcome: "Correct! Being realistic about entry-level compensation in a new field prevents disappointment.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Expect an immediate salary hike because you have a new degree.",
        outcome: "Incorrect. You are starting fresh in a new field and lack practical experience.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Demand your current salary level plus a premium for your previous unrelated experience.",
        outcome: "Incorrect. Unrelated experience doesn't necessarily translate to higher value in a new industry immediately.",
        isCorrect: false,
      },
     
      {
        id: "opt4",
        text: "Refuse any job that doesn't make you a manager right away.",
        outcome: "Incorrect. You must prove your new skills before commanding leadership roles in a new sector.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "You receive a job offer in the new industry! What is the best way to leverage your previous background?",
    options: [
      {
        id: "opt1",
        text: "Hide your past experience so they only look at your new qualification.",
        outcome: "Incorrect. Many transferable skills (like communication or problem-solving) are highly valuable.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Constantly bring up how things were done in your old industry.",
        outcome: "Incorrect. While some insight is good, being overly attached to old ways can make you seem inflexible.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Skillfully weave transferable skills from your past into your new role to offer a unique perspective.",
        outcome: "Correct! Blending your old strengths with your new skills makes you a versatile and unique asset.",
        isCorrect: true,
      },
      {
        id: "opt4",
        text: "Assume your past experience means you don't need to learn the basics of your new job.",
        outcome: "Incorrect. Arrogance will alienate your new peers and hinder your ability to learn the ropes.",
        isCorrect: false,
      },
    ],
  },
];

const SimulationSwitchingIndustries = () => {
  const location = useLocation();
  const gameId = "ehe-adults-92";
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
      title="Simulation: Switching Industries"
      subtitle={
        showResult
          ? "Simulation complete! You successfully managed an industry transition."
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
                {selectedChoice.isCorrect ? 'Smart Choice' : 'Career Misstep'}
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

export default SimulationSwitchingIndustries;
