import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_INITIATIVE_STAGES = [
  {
    id: 1,
    prompt: "You've finished all your assigned tasks for the day by 3 PM. What is your next move?",
    options: [
      { id: "opt1", text: "Take initiative and ask your manager for a new project", outcome: "Correct! Proactively seeking responsibility shows leadership potential.", isCorrect: true },
      { id: "opt2", text: "Stay unnoticed and browse the internet until 5 PM", outcome: "Wrong! Hiding when you have capacity stalls your career growth.", isCorrect: false },
      { id: "opt3", text: "Complain about your workload being too light", outcome: "Wrong! Complaining without offering solutions creates a negative impression.", isCorrect: false },
      { id: "opt4", text: "Leave work early without telling anyone", outcome: "Wrong! This is unprofessional and damages trust.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "A project your team is working on is falling behind schedule. No one has been explicitly assigned to fix it.",
    options: [
      { id: "opt1", text: "Wait to see if someone else gets assigned to it", outcome: "Wrong! Bystander syndrome won't help your team or your career.", isCorrect: false },
      { id: "opt2", text: "Complain about how badly the project is managed", outcome: "Wrong! Pointing out problems without offering help is unproductive.", isCorrect: false },
      { id: "opt3", text: "Take initiative to analyze the bottleneck and propose a solution", outcome: "Correct! Stepping up during a crisis is a fast track to advancement.", isCorrect: true },
      { id: "opt4", text: "Ensure your own small part is done and ignore the rest", outcome: "Wrong! A career mindset involves caring about the overall team success.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "You notice an inefficient, repetitive process that wastes 30 minutes every day for your team.",
    options: [
      { id: "opt1", text: "Stay unnoticed and keep doing it the slow way", outcome: "Wrong! Accepting inefficiency limits your value to the company.", isCorrect: false },
      { id: "opt2", text: "Complain about the workload caused by the bad process", outcome: "Wrong! Negativity doesn't fix the underlying problem.", isCorrect: false },
      { id: "opt3", text: "Tell everyone else to fix it", outcome: "Wrong! Delegating without authority or solutions rarely works.", isCorrect: false },
      { id: "opt4", text: "Take initiative to automate or simplify the process", outcome: "Correct! Solving systemic problems demonstrates high-value thinking.", isCorrect: true },
    ],
  },
  {
    id: 4,
    prompt: "Your manager asks for a volunteer to present the weekly report to the department head.",
    options: [
      { id: "opt1", text: "Look away and hope they pick someone else", outcome: "Wrong! Avoiding visibility keeps you from building a strong reputation.", isCorrect: false },
      { id: "opt2", text: "Take initiative and volunteer for the presentation", outcome: "Correct! Taking on visible roles builds your network and credibility.", isCorrect: true },
      { id: "opt3", text: "Complain that the report is too much work to present", outcome: "Wrong! Rejecting opportunities makes you seem uncooperative.", isCorrect: false },
      { id: "opt4", text: "Nominate your coworker without asking them", outcome: "Wrong! This is unfair to your coworker and avoids taking responsibility yourself.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "A senior leader mentions they are looking for ideas on a new initiative during a town hall meeting.",
    options: [
      { id: "opt3", text: "Take initiative, research a concept, and send a thoughtful proposal", outcome: "Correct! Going above and beyond to provide value gets you noticed by the right people.", isCorrect: true },
      { id: "opt1", text: "Stay unnoticed since you're just a junior employee", outcome: "Wrong! Good ideas can come from anywhere; don't count yourself out.", isCorrect: false },
      { id: "opt2", text: "Complain that management never knows what to do", outcome: "Wrong! Cynicism won't get you promoted.", isCorrect: false },
      { id: "opt4", text: "Only share your idea if they promise you a bonus first", outcome: "Wrong! Holding your ideas hostage shows a transactional rather than a career mindset.", isCorrect: false },
    ],
  },
];

const ReflexInitiative = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-11";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_INITIATIVE_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = REFLEX_INITIATIVE_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Too slow! Initiative requires quick, decisive action.", isCorrect: false });
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
      showCorrectAnswerFeedback(coinsPerLevel, true);
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
      title="Reflex: Initiative"
      subtitle={
        showResult
          ? "Great job! Taking initiative is key to career growth."
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
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-sky-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Scenario {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-sky-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              {/* Question Display */}
              <div className="bg-black/50 border-2 border-sky-900 shadow-[0_0_15px_rgba(56,189,248,0.2)] p-6 rounded-xl mt-6">
                 <div className="text-center font-mono text-sky-300 text-lg tracking-widest uppercase mb-4 opacity-50">
                    ⚡ INITIATIVE CHECK ⚡
                 </div>
                 <p className="text-white text-xl md:text-2xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
                 <div className="text-center font-mono text-sky-300 text-xs tracking-widest uppercase mt-4 opacity-50">
                    React appropriately before time runs out!
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "border-sky-700 bg-slate-800 text-sky-100 hover:bg-slate-700 hover:border-sky-500 border-[3px]";
                  
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Correct' : '❌ Missed Opportunity'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-sky-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(56,189,248,0.4)] hover:scale-105 transform transition-all border border-sky-400 hover:bg-sky-500"
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

export default ReflexInitiative;
