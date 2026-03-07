import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_INTERNSHIP_ACTION_STAGES = [
  {
    id: 1,
    prompt: "You are in the final year of your degree but have no work experience.",
    options: [
      { id: "opt1", text: "Rely on Degree Alone and hope for the best", outcome: "Wrong! Without experience, you face Reduced Job Readiness compared to peers.", isCorrect: false },
      { id: "opt2", text: "Seek Internships immediately to build your resume", outcome: "Correct! Practical exposure makes you attractive to employers.", isCorrect: true },
      { id: "opt3", text: "Just relax until graduation", outcome: "Wrong! The job market is competitive; relaxing means falling behind.", isCorrect: false },
      { id: "opt4", text: "Assume companies will train you from scratch", outcome: "Wrong! Most companies want candidates who already understand basic workplace dynamics.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "You see an internship posting that fits your field but it's unpaid.",
    options: [
      { id: "opt1", text: "Ignore it and Rely on Degree Alone", outcome: "Wrong! You missed a chance to gain vital skills and networking.", isCorrect: false },
      { id: "opt2", text: "Complain about it online but do nothing else", outcome: "Wrong! Complaining doesn't improve your employability.", isCorrect: false },
      { id: "opt3", text: "Seek Internships like this if the learning value is high", outcome: "Correct! Sometimes the initial experience is worth more than a starting paycheck.", isCorrect: true },
      { id: "opt4", text: "Accept it but refuse to do any real work", outcome: "Wrong! A bad attitude will ruin any potential references.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "During your internship, you are given a tedious data entry task.",
    options: [
      { id: "opt1", text: "Quit immediately because it's boring", outcome: "Wrong! Quitting early looks terrible on a resume.", isCorrect: false },
      { id: "opt2", text: "Refuse to do it and demand 'real' work", outcome: "Wrong! Arrogance is a quick way to get fired.", isCorrect: false },
      { id: "opt4", text: "Do it poorly on purpose so they don't ask again", outcome: "Wrong! You just destroyed your professional reputation.", isCorrect: false },
      { id: "opt3", text: "Complete it efficiently and ask for more responsibility", outcome: "Correct! Proving reliability on small tasks earns you bigger opportunities.", isCorrect: true },
    ],
  },
  {
    id: 4,
    prompt: "You have a chance to attend a company networking event during your internship.",
    options: [
      { id: "opt1", text: "Skip it and go home early", outcome: "Wrong! You missed a major opportunity to build your network.", isCorrect: false },
      { id: "opt2", text: "Go, but only talk to your fellow interns", outcome: "Wrong! You need to connect with senior staff to secure future roles.", isCorrect: false },
      { id: "opt3", text: "Attend and actively introduce yourself to managers", outcome: "Correct! Networking is one of the biggest benefits of any internship.", isCorrect: true },
      { id: "opt4", text: "Go just for the free food and leave", outcome: "Wrong! You wasted the professional value of the event.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Your internship is ending, and you want a full-time job there.",
    options: [
      { id: "opt1", text: "Assume they will just offer it to you", outcome: "Wrong! Passivity rarely gets rewarded.", isCorrect: false },
      { id: "opt3", text: "Express your interest clearly to your manager", outcome: "Correct! Advocating for yourself is crucial for career progression.", isCorrect: true },
      { id: "opt2", text: "Leave on the last day without saying goodbye", outcome: "Wrong! You burned the bridge you spent months building.", isCorrect: false },
      { id: "opt4", text: "Demand they hire you or you'll leave a bad review", outcome: "Wrong! Threats will ensure you are never hired.", isCorrect: false },
    ],
  },
];

const ReflexInternshipAction = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-65";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_INTERNSHIP_ACTION_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 15;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 30;
  const stage = REFLEX_INTERNSHIP_ACTION_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Hesitation costs you the opportunity!", isCorrect: false });
      if (currentStageIndex === totalStages - 1) {
        setTimeout(() => {
          setShowResult(true);
        }, 800);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResult, selectedChoice, stage]);

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
      }, 800);
    }
  };

  const handleNextStage = () => {
    if (!selectedChoice) return;
    if (currentStageIndex === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrentStageIndex((prev) => prev + 1);
      setTimeLeft(10);
    }
    setSelectedChoice(null);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Reflex: Internship Action"
      subtitle={
        showResult
          ? "Excellent! You understand how to build practical experience."
          : `Scenario ${currentStageIndex + 1} of ${totalStages}`
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
      <div className="space-y-8">
        {!showResult && stage && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-700 shadow-2xl relative overflow-hidden">
              {/* Timer Bar */}
              <div 
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-cyan-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Scenario {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              {/* Question Display */}
              <div className="bg-black/50 border-2 border-cyan-900 shadow-[0_0_15px_rgba(34,211,238,0.2)] p-6 rounded-xl mt-6">
                 <div className="text-center font-mono text-cyan-300 text-lg tracking-widest uppercase mb-4 opacity-50">
                    ⚡ CAREER REFLEX ⚡
                 </div>
                 <p className="text-white text-xl md:text-2xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
                 <div className="text-center font-mono text-cyan-300 text-xs tracking-widest uppercase mt-4 opacity-50">
                    Make your decision before time runs out!
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "border-cyan-700 bg-slate-800 text-cyan-100 hover:bg-slate-700 hover:border-cyan-500 border-[3px]";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "bg-emerald-900/80 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.5)] scale-105"
                      : "bg-rose-900/80 border-rose-400 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.5)] scale-105";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "bg-emerald-900/40 border-emerald-500/50 text-emerald-300/80 ring-2 ring-emerald-500/30";
                  } else if (selectedChoice) {
                    baseStyle = "bg-slate-900/50 border-slate-700/50 text-slate-500 opacity-50 scale-95";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative flex items-center justify-center rounded-xl ${baseStyle} p-4 text-center font-bold transition-all disabled:cursor-not-allowed text-sm md:text-base leading-tight min-h-[90px]`}
                    >
                      <span className="z-10">{option.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {selectedChoice && (
          <div className="animate-fade-in-up">
            <div className={`rounded-xl border-2 p-5 text-center font-bold text-lg shadow-lg ${selectedChoice.isCorrect ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200' : 'bg-rose-900/60 border-rose-500 text-rose-200'}`}>
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Career Builder' : '❌ Missed Opportunity'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-cyan-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(34,211,238,0.4)] hover:scale-105 transform transition-all border border-cyan-400 hover:bg-cyan-500"
                >
                  NEXT →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexInternshipAction;
