import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "You recently graduated with top marks in your degree but lack practical knowledge of the software tools companies actually use. What is your strategy?",
    options: [
      {
        id: "opt1",
        text: "Wait passively for campus placement; the marks alone guarantee a top job.",
        outcome: "Incorrect. High marks get you an interview, but lack of practical skills often costs you the job offer.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Apply heavily anyway and hope they train you on the job.",
        outcome: "Incorrect. While some offer training, most companies prefer candidates who can contribute immediately.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Immediately start targeted, practical skill training on industry-standard tools.",
        outcome: "Correct! Bridging the gap between academic theory and practical application makes you highly employable.",
        isCorrect: true,
      },
      {
        id: "opt4",
        text: "Enroll in another purely theoretical Master's degree immediately.",
        outcome: "Incorrect. More theory does not solve a practical skills deficit, it just delays the problem.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "You find a highly rated online course teaching exactly what you need. How do you approach the learning process?",
    options: [
      {
        id: "opt1",
        text: "Watch all the videos passively on 2x speed without taking notes.",
        outcome: "Incorrect. Passive watching creates an illusion of competence but zero actual skill.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Pause the videos to actively build your own project alongside the instructor.",
        outcome: "Correct! Active, hands-on building is the only way to convert information into a usable skill.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Memorize the terms so you can sound smart in the interview.",
        outcome: "Incorrect. Interviewers will quickly test your practical ability, exposing memorization.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Just download the certificate at the end and add it to your resume.",
        outcome: "Incorrect. A certificate without the underlying capability destroys your professional credibility.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "You've built up some basic practical skills. How do you prove this to employers?",
    options: [
      {
        id: "opt2",
        text: "Create a portfolio of demonstrable, practical projects to show your work.",
        outcome: "Correct! A portfolio is undeniable proof of your capability and drastically increases your hireability.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Just write 'Proficient' on your resume and hope they trust you.",
        outcome: "Incorrect. Claiming proficiency without proof is standard; proof is what makes you stand out.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Argue with the interviewer that your high GPA proves you are smart enough to figure it out.",
        outcome: "Incorrect. Arrogance and lack of preparation is an immediate red flag.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Bring your university textbooks to the interview to show what you studied.",
        outcome: "Incorrect. Employers care about what you can execute, not just the theory you read.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "During an interview, you are handed a brief practical test on a software tool. You know 80% of it, but get stuck on one feature.",
    options: [
      {
        id: "opt1",
        text: "Give up instantly and apologize for not knowing.",
        outcome: "Incorrect. Giving up shows poor problem-solving grit.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Pretend you know it and confidently do it wrong.",
        outcome: "Incorrect. Faking competence damages trust and guarantees a rejection.",
        isCorrect: false,
      },
      
      {
        id: "opt4",
        text: "Complain that the test is unfair because your university didn't teach that specific button.",
        outcome: "Incorrect. Deflecting blame shows poor accountability.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Communicate your thought process, explain how you would find the answer (documentation/Google), and attempt a solution.",
        outcome: "Correct! Employers value resourcefulness and honest communication over having every answer memorized.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 5,
    prompt: "You get the job! After 6 months, a completely new major software update changes how your main tool works. The company hasn't organized training yet.",
    options: [
      {
        id: "opt1",
        text: "Refuse to use it and complain about the lack of company training.",
        outcome: "Incorrect. Refusing to adapt makes you obsolete quickly.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Keep using the outdated legacy version indefinitely.",
        outcome: "Incorrect. This breaks collaboration with the rest of the team and slows down work.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Proactively spend a weekend figuring out the new update using release notes and tutorials.",
        outcome: "Correct! The highest value employees are self-driven learners who stay ahead of the curve.",
        isCorrect: true,
      },
      {
        id: "opt4",
        text: "Wait for a colleague to figure it out and then ask them to teach you everything.",
        outcome: "Incorrect. While asking for help is fine, entirely depending on others drains team resources.",
        isCorrect: false,
      },
    ],
  },
];

const SimulationPracticalSkillGap = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-71";
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
      title="Simulation: Practical Skill Gap"
      subtitle={
        showResult
          ? "Simulation complete! You successfully bridged the gap to employability."
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
                {selectedChoice.isCorrect ? 'Practical Growth' : 'Career Stagnation'}
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

export default SimulationPracticalSkillGap;
