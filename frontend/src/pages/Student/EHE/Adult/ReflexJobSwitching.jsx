import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_JOB_SWITCHING_STAGES = [
  {
    id: 1,
    prompt: "You've been at your current job for 4 months and face your first major project challenge.",
    options: [
      { id: "opt1", text: "Look for a new job immediately", outcome: "Wrong! Quitting at the first sign of difficulty prevents you from building resilience.", isCorrect: false },
      { id: "opt3", text: "Work through the challenge to build Strong credibility", outcome: "Correct! Overcoming obstacles proves your value and builds deep expertise.", isCorrect: true },
      { id: "opt2", text: "Complain that the work is too hard", outcome: "Wrong! Complaining without attempting to solve the issue damages your reputation.", isCorrect: false },
      { id: "opt4", text: "Quiet quit and do the bare minimum", outcome: "Wrong! Disengaging guarantees you won't learn or advance.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "A recruiter offers you a role with a 5% raise, making it your 4th job in 2 years.",
    options: [
      { id: "opt1", text: "Take it instantly for the money", outcome: "Wrong! Frequent hopping for minor raises creates Doubt about stability in your resume.", isCorrect: false },
      { id: "opt2", text: "Use it to blackmail your current boss for a counter-offer", outcome: "Wrong! This creates a hostile relationship with your current employer.", isCorrect: false },
      { id: "opt3", text: "Decline and stay to complete your current major project", outcome: "Correct! Staying to show impact yields Higher respect and better long-term offers.", isCorrect: true },
      { id: "opt4", text: "Accept it but secretly keep working your old job too", outcome: "Wrong! This is unethical and will likely get you fired from both.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "You feel bored after mastering the basic tasks of your role at the 6-month mark.",
    options: [
      { id: "opt1", text: "Quit because the company 'has nothing left to teach you'", outcome: "Wrong! You've only scratched the surface. Mastery takes years.", isCorrect: false },
      { id: "opt3", text: "Start intensely interviewing elsewhere during work hours", outcome: "Wrong! You are stealing company time and risking your current standing.", isCorrect: false },
      { id: "opt4", text: "Spend your days scrolling social media", outcome: "Wrong! Wasting time destroys your professional momentum.", isCorrect: false },
      { id: "opt2", text: "Ask for new responsibilities to build Strong credibility", outcome: "Correct! Proactively seeking growth within your current role accelerates your career.", isCorrect: true },
    ],
  },
  {
    id: 4,
    prompt: "A hiring manager asks why you've had 5 jobs in 3 years.",
    options: [
      { id: "opt4", text: "You wouldn't be asked this, because you stayed to build Strong credibility", outcome: "Correct! Tenure proves you can handle long-term goals and difficult phases.", isCorrect: true },
      { id: "opt1", text: "Blame all your previous toxic managers", outcome: "Wrong! Trashing former employers is a massive red flag for recruiters.", isCorrect: false },
      { id: "opt2", text: "Admit you get bored easily", outcome: "Wrong! This confirms their Doubt about stability and makes you an unappealing hire.", isCorrect: false },
      { id: "opt3", text: "You realize you have no good answer and struggle", outcome: "Wrong! Your lack of commitment has finally caught up with you.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "It's time for annual promotions. Leadership is choosing between you and a newer employee.",
    options: [
      { id: "opt1", text: "Threaten to leave if you don't get it", outcome: "Wrong! Ultimatums usually backfire when trust isn't fully established.", isCorrect: false },
      { id: "opt3", text: "You win the promotion because of your tenure and Higher respect", outcome: "Correct! Companies invest in people who have proven their commitment and impact.", isCorrect: true },
      { id: "opt2", text: "You are passed over due to Doubt about stability", outcome: "Wrong! They didn't promote you because they think you'll just leave soon anyway.", isCorrect: false },
      { id: "opt4", text: "Sabotage the newer employee's project", outcome: "Wrong! Toxic behavior will get you fired, not promoted.", isCorrect: false },
    ],
  },
];

const ReflexJobSwitching = () => {
  const location = useLocation();
  const gameId = "ehe-adults-8";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_JOB_SWITCHING_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = REFLEX_JOB_SWITCHING_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Indecision makes you look unreliable!", isCorrect: false });
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
      title="Reflex: Job Switching"
      subtitle={
        showResult
          ? "Excellent! You understand the value of tenure and building deep credibility."
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
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-fuchsia-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Scenario {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-fuchsia-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              {/* Question Display */}
              <div className="bg-black/50 border-2 border-fuchsia-900 shadow-[0_0_15px_rgba(217,70,239,0.2)] p-6 rounded-xl mt-6">
                 <div className="text-center font-mono text-fuchsia-300 text-lg tracking-widest uppercase mb-4 opacity-50">
                    ⚡ CAREER CHOICE ⚡
                 </div>
                 <p className="text-white text-xl md:text-2xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
                 <div className="text-center font-mono text-fuchsia-300 text-xs tracking-widest uppercase mt-4 opacity-50">
                    Tap your decision before time runs out!
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "border-fuchsia-700 bg-slate-800 text-fuchsia-100 hover:bg-slate-700 hover:border-fuchsia-500 border-[3px]";
                  
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Career Builder' : '❌ Red Flag'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-fuchsia-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(217,70,239,0.4)] hover:scale-105 transform transition-all border border-fuchsia-400 hover:bg-fuchsia-500"
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

export default ReflexJobSwitching;
