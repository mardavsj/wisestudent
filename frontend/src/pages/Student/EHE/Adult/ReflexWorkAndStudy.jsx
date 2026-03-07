import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_WORK_AND_STUDY_STAGES = [
  {
    id: 1,
    prompt: "You just enrolled in a part-time course and received your first week's assignments.",
    options: [
      { id: "opt1", text: "Try to do everything at the last minute and hope it works out", outcome: "Wrong! 'No Time Planning' reduces your chance of success.", isCorrect: false },
      { id: "opt2", text: "Create a structured study schedule mapping out when to handle work and coursework", outcome: "Correct! 'Structured Schedule & Discipline' sets you up for success.", isCorrect: true },
      { id: "opt3", text: "Ignore your work tasks to focus completely on the new course", outcome: "Wrong! 'Ignoring Workload' puts your job at risk.", isCorrect: false },
      { id: "opt4", text: "Worry about it later and play video games instead", outcome: "Wrong! Delaying action leads to unnecessary stress.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Your manager asks for a report by Friday, and you have a major exam on Saturday.",
    options: [
      { id: "opt1", text: "Call in sick to work so you can study", outcome: "Wrong! 'Ignoring Workload' breaks professional trust.", isCorrect: false },
      { id: "opt2", text: "Procrastinate on both until Thursday night", outcome: "Wrong! 'No Time Planning' will lead to exhaustion.", isCorrect: false },
      { id: "opt3", text: "Communicate proactively, finish the report early, and allocate the rest of the time to studying", outcome: "Correct! 'Structured Schedule & Discipline' balances both priorities.", isCorrect: true },
      { id: "opt4", text: "Ignore the exam and just focus on the report", outcome: "Wrong! Neglecting your studies defeats the purpose of your goals.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "You're feeling overwhelmed balancing a full-time job and a part-time degree.",
    options: [
      { id: "opt1", text: "Reach out to your manager and professors to discuss a balanced approach", outcome: "Correct! Proactive communication is a sign of 'Structured Schedule & Discipline'.", isCorrect: true },
      { id: "opt2", text: "Drop out of the course without telling anyone", outcome: "Wrong! Giving up without communicating is not effective.", isCorrect: false },
      { id: "opt3", text: "Stop showing up to work and only focus on studying", outcome: "Wrong! 'Ignoring Workload' damages your career.", isCorrect: false },
      { id: "opt4", text: "Keep suffering in silence with no time planning", outcome: "Wrong! 'No Time Planning' only increases the pressure.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "You have a mandatory evening class but your team wants you to stay late for a project.",
    options: [
      { id: "opt1", text: "Stay late and just miss the class without notice", outcome: "Wrong! 'No Time Planning' leads to missed educational opportunities.", isCorrect: false },
      { id: "opt2", text: "Explain your schedule to the team and offer to catch up on the project earlier in the day", outcome: "Correct! 'Structured Schedule & Discipline' helps you manage commitments.", isCorrect: true },
      { id: "opt3", text: "Just leave work abruptly without saying anything", outcome: "Wrong! 'Ignoring Workload' and lack of communication damages relationships.", isCorrect: false },
      { id: "opt4", text: "Complain about how busy you are to everyone", outcome: "Wrong! Complaining without problem-solving wastes time.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "It's the weekend. You have course reading to do and household chores.",
    options: [
      { id: "opt1", text: "Set specific time blocks for reading, chores, and relaxation to stay disciplined", outcome: "Correct! 'Structured Schedule & Discipline' ensures all tasks get done efficiently.", isCorrect: true },
      { id: "opt2", text: "Watch TV all weekend and skip reading", outcome: "Wrong! 'No Time Planning' puts you behind in your course.", isCorrect: false },
      { id: "opt3", text: "Push all your work to late Sunday night", outcome: "Wrong! Last-minute cramming is poor time management.", isCorrect: false },
      { id: "opt4", text: "Use time to catch up on office work you ignored", outcome: "Wrong! 'Ignoring Workload' during the week ruins your weekend.", isCorrect: false },
    ],
  },
];

const ReflexWorkAndStudy = () => {
  const location = useLocation();
  const gameId = "ehe-adults-84";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_WORK_AND_STUDY_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 20;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 40;
  const stage = REFLEX_WORK_AND_STUDY_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Missing the moment can look like a lack of reliability!", isCorrect: false });
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
      title="Reflex: Work & Study"
      subtitle={
        showResult
          ? "Excellent! You consistently act with discipline instead of making excuses."
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
                    ⚡ RAPID DECISION ⚡
                 </div>
                 <p className="text-white text-xl md:text-2xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
                 <div className="text-center font-mono text-cyan-300 text-xs tracking-widest uppercase mt-4 opacity-50">
                    Tap the right behavior before time runs out!
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Reliable' : '❌ Unprofessional'}</span>
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

export default ReflexWorkAndStudy;
