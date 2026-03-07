import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_PROFESSIONAL_DISCIPLINE_STAGES = [
  {
    id: 1,
    prompt: "You are running 15 minutes late for work because you overslept.",
    options: [
      { id: "opt1", text: "Invent an elaborate lie about a flat tire", outcome: "Wrong! Excuses erode trust faster than simply being late.", isCorrect: false },
      { id: "opt3", text: "Sneak in through the back so no one notices", outcome: "Wrong! Hiding shows a lack of professional accountability.", isCorrect: false },
      { id: "opt4", text: "Blame your alarm clock and act like a victim", outcome: "Wrong! Deflecting blame onto your Personal Mood or objects is unprofessional.", isCorrect: false },
      { id: "opt2", text: "Communicate immediately and apologize without excuses", outcome: "Correct! Discipline and Reliability means owning mistakes transparently.", isCorrect: true },
    ],
  },
  {
    id: 2,
    prompt: "You've been assigned a tedious, repetitive task that you hate doing.",
    options: [
      { id: "opt1", text: "Do it poorly so they never ask you again", outcome: "Wrong! Delivering poor work ruins your reliability and reputation.", isCorrect: false },
      { id: "opt2", text: "Complain loudly to everyone in the office", outcome: "Wrong! Letting your Personal Mood dictate your actions creates a toxic environment.", isCorrect: false },
      { id: "opt3", text: "Complete it accurately and efficiently", outcome: "Correct! True Discipline means performing well regardless of how exciting the task is.", isCorrect: true },
      { id: "opt4", text: "Delegate it to an intern without permission", outcome: "Wrong! Offloading unpleasant work is a failure of responsibility.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "A client sends an angry email criticizing your recent project.",
    options: [
      { id: "opt4", text: "Take a breath, analyze the feedback, and respond professionally", outcome: "Correct! Discipline separates your emotional reaction from your professional response.", isCorrect: true },
      { id: "opt1", text: "Respond defensively immediately", outcome: "Wrong! Reacting purely on Personal Mood escalates conflicts.", isCorrect: false },
      { id: "opt2", text: "Ignore it and hope the problem goes away", outcome: "Wrong! Reliability means handling difficult conversations, not hiding.", isCorrect: false },
      { id: "opt3", text: "Curse out the client to your manager", outcome: "Wrong! Unprofessional venting damages your standing.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "You miss a critical deadline because you underestimated the work.",
    options: [
      { id: "opt2", text: "Blame a different department for holding you up", outcome: "Wrong! Excuses and finger-pointing destroy team cohesion.", isCorrect: false },
      { id: "opt1", text: "Own the miss, provide a new timeline, and deliver", outcome: "Correct! Reliability doesn't mean you're perfect; it means you manage failures responsibly.", isCorrect: true },
      { id: "opt3", text: "Quit your job because you're embarrassed", outcome: "Wrong! Letting Personal Mood drive drastic career choices is undisciplined.", isCorrect: false },
      { id: "opt4", text: "Wait until the client asks where the work is", outcome: "Wrong! Failing to communicate delays entirely ruins trust.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "You finish your work hours early on a Friday.",
    options: [
      { id: "opt1", text: "Leave without telling anyone", outcome: "Wrong! Leaving without communicating breaks the expectation of Reliability.", isCorrect: false },
      { id: "opt2", text: "Spend the rest of the day watching movies at your desk", outcome: "Wrong! 'Stealing time' shows a lack of intrinsic Discipline.", isCorrect: false },
      { id: "opt3", text: "Ask your team if anyone needs help or use the time to organize", outcome: "Correct! Consistent discipline elevates the whole team.", isCorrect: true },
      { id: "opt4", text: "Brag to your overworked coworkers about how fast you are", outcome: "Wrong! This damages morale and shows poor social discipline.", isCorrect: false },
    ],
  },
];

const ReflexProfessionalDiscipline = () => {
  const location = useLocation();
  const gameId = "ehe-adults-3";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_PROFESSIONAL_DISCIPLINE_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = REFLEX_PROFESSIONAL_DISCIPLINE_STAGES[currentStageIndex];

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
      title="Reflex: Professional Discipline"
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

export default ReflexProfessionalDiscipline;
