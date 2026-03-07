import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_SCHOLARSHIP_STAGES = [
  {
    id: 1,
    prompt: "You realize your tuition costs exceed your current savings.",
    options: [
      { id: "opt1", text: "Ignore Options and hope for a miracle", outcome: "Wrong! Ignoring financial shortfalls leads to dropped classes and debt.", isCorrect: false },
      { id: "opt2", text: "Take out the maximum high-interest loan immediately", outcome: "Wrong! Exhaust free money options before taking on debt.", isCorrect: false },
      { id: "opt3", text: "Apply for Available Scholarships aligned with your profile", outcome: "Correct! Proactively seeking grants reduces your financial burden.", isCorrect: true },
      { id: "opt4", text: "Complain that education is too expensive and do nothing", outcome: "Wrong! Complaining doesn't pay your tuition.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "A scholarship application requires a 500-word personal essay.",
    options: [
      { id: "opt1", text: "Write the essay to Apply for Available Scholarships", outcome: "Correct! Effort in applying brings high returns compared to the time spent.", isCorrect: true },
      { id: "opt2", text: "Skip it and Lose Financial Support because writing is hard", outcome: "Wrong! You just passed up thousands of dollars over a few hours of work.", isCorrect: false },
      { id: "opt3", text: "Submit a blank document", outcome: "Wrong! This guarantees instant rejection.", isCorrect: false },
      { id: "opt4", text: "Plagiarize an essay from the internet", outcome: "Wrong! Plagiarism is unethical and will disqualify you.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "You find a local community scholarship that offers a small amount ($500).",
    options: [
      { id: "opt1", text: "Ignore Options because it's not a full ride", outcome: "Wrong! Small scholarships add up quickly and have less competition.", isCorrect: false },
      { id: "opt2", text: "Apply for Available Scholarships since every bit helps", outcome: "Correct! Accumulating smaller awards is a smart strategy.", isCorrect: true },
      { id: "opt3", text: "Laugh at the amount and tell your friends it's useless", outcome: "Wrong! Arrogance costs you easy financial support.", isCorrect: false },
      { id: "opt4", text: "Assume someone else needs it more and don't apply", outcome: "Wrong! Let the committee decide who needs it; advocate for yourself.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "You are given a deadline of Friday to submit your financial aid renewal.",
    options: [
      { id: "opt2", text: "Forget about it and Lose Financial Support", outcome: "Wrong! Carelessness with administrative tasks has severe financial consequences.", isCorrect: false },
      { id: "opt3", text: "Start filling it out at 11:55 PM on Friday", outcome: "Wrong! Last-minute rushing leads to errors and missed submissions.", isCorrect: false },
      { id: "opt4", text: "Assume they will extend the deadline for you", outcome: "Wrong! Financial aid deadlines are notoriously strict.", isCorrect: false },
      { id: "opt1", text: "Plan your week to Apply for Available Scholarships on time", outcome: "Correct! Missing deadlines is the easiest way to lose funding.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "You receive a rejection from a major national scholarship.",
    options: [
      { id: "opt1", text: "Give up entirely and Ignore Options", outcome: "Wrong! Rejection is normal; stopping your search is the only real failure.", isCorrect: false },
      { id: "opt2", text: "Assume the system is rigged and get angry", outcome: "Wrong! Bitterness won't help you find other funding.", isCorrect: false },
      { id: "opt3", text: "Keep looking and Apply for Available Scholarships locally", outcome: "Correct! Persistence is key when securing educational funding.", isCorrect: true },
      { id: "opt4", text: "Drop out of school immediately", outcome: "Wrong! That is a massive overreaction to a single rejection.", isCorrect: false },
    ],
  },
];

const ReflexScholarshipOptions = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-83";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_SCHOLARSHIP_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 20;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 40;
  const stage = REFLEX_SCHOLARSHIP_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Hesitation caused you to lose financial support!", isCorrect: false });
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
      title="Reflex: Scholarship Options"
      subtitle={
        showResult
          ? "Excellent! You understand the value of seeking financial aid actively."
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
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-lime-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Scenario {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-lime-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              {/* Question Display */}
              <div className="bg-black/50 border-2 border-lime-900 shadow-[0_0_15px_rgba(163,230,53,0.2)] p-6 rounded-xl mt-6">
                 <div className="text-center font-mono text-lime-300 text-lg tracking-widest uppercase mb-4 opacity-50">
                    ⚡ AID OPPORTUNITY ⚡
                 </div>
                 <p className="text-white text-xl md:text-2xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
                 <div className="text-center font-mono text-lime-300 text-xs tracking-widest uppercase mt-4 opacity-50">
                    Make your decision before time runs out!
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "border-lime-700 bg-slate-800 text-lime-100 hover:bg-slate-700 hover:border-lime-500 border-[3px]";
                  
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Financial Win' : '❌ Missed Support'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-lime-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(163,230,53,0.4)] hover:scale-105 transform transition-all border border-lime-400 hover:bg-lime-500"
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

export default ReflexScholarshipOptions;
