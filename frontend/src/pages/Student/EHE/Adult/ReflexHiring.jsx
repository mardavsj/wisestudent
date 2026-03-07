import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_HIRING_STAGES = [
  {
    id: 1,
    prompt: "Workload has doubled, and you desperately need a graphic designer for your business.",
    options: [
      { id: "opt1", text: "Hire your best friend who needs a job, even with zero design experience", outcome: "Wrong! Hiring friends without necessary skills damages business quality and strains the relationship.", isCorrect: false },
      { id: "opt3", text: "Work 100 hours a week and do it yourself to save money", outcome: "Wrong! Refusing to hire leads to extreme burnout and limits business growth.", isCorrect: false },
      { id: "opt2", text: "Post a clear job description focusing on required design skills and portfolio", outcome: "Correct! Role clarity and skill-based hiring ensure you get the right person for the job.", isCorrect: true },
      { id: "opt4", text: "Hire the first person who walks in without asking about their skills", outcome: "Wrong! Blind hiring is a fast way to waste money and time.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "You receive 20 applications. One is from an acquaintance with a known poor track record.",
    options: [
      { id: "opt1", text: "Immediately hire the acquaintance to do them a favor", outcome: "Wrong! Your business is not a charity; hiring based on favors risks performance.", isCorrect: false },
      { id: "opt2", text: "Objectively evaluate all portfolios and interview the top 3 based on skill", outcome: "Correct! Structured evaluation based on competence protects your business standards.", isCorrect: true },
      { id: "opt3", text: "Throw away the applications and just hire your cousin", outcome: "Wrong! Ignoring qualified candidates for nepotism weakens your team.", isCorrect: false },
      { id: "opt4", text: "Ignore the applications because the process seems like too much work", outcome: "Wrong! Avoiding the hiring process leaves you understaffed and overwhelmed.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "During interviews, a candidate asks about the exact responsibilities of the role.",
    options: [
      { id: "opt1", text: "Provide a documented list of daily tasks and clear performance expectations", outcome: "Correct! Clear expectations allow employees to succeed and be held accountable.", isCorrect: true },
      { id: "opt2", text: "Tell them, 'We'll figure it out as we go, just do whatever I say.'", outcome: "Wrong! Lack of role clarity causes confusion, inefficiency, and frustration.", isCorrect: false },
      { id: "opt3", text: "Say, 'Your job is to make my life easier, no specific details.'", outcome: "Wrong! Vague instructions mean they cannot proactively add value.", isCorrect: false },
      { id: "opt4", text: "Tell them you expect them to intuitively know what to do without being told", outcome: "Wrong! Expecting mind-reading is terrible management.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "A highly skilled candidate asks for a salary matching your budget, but you don't click personally.",
    options: [
      { id: "opt1", text: "Reject them because you want to hire someone you can hang out with on weekends", outcome: "Wrong! You are running a business, not a social club.", isCorrect: false },
      { id: "opt2", text: "Hire an unqualified fun friend instead", outcome: "Wrong! Fun friends do not automatically make competent employees.", isCorrect: false },
      { id: "opt4", text: "Insult their personality and end the interview abruptly", outcome: "Wrong! This is incredibly unprofessional and damages your company's reputation.", isCorrect: false },
      { id: "opt3", text: "Hire them for their role-specific skills and maintain a professional relationship", outcome: "Correct! Professional competence is more valuable than personal friendship at work.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "Your business partner suggests hiring their nephew to manage finances, despite him having no accounting background.",
    options: [
      { id: "opt1", text: "Agree immediately to keep the peace with your partner", outcome: "Wrong! Avoiding conflict by making bad hires puts the entire business at risk.", isCorrect: false },
      { id: "opt2", text: "Let him manage the finances but secretly try to do the accounting yourself at night", outcome: "Wrong! This creates duplicate work, resentment, and inevitable errors.", isCorrect: false },
      { id: "opt3", text: "Explain that financial roles require expertise and propose a formal skills test for all candidates", outcome: "Correct! Prioritizing skill over personal connections is essential for critical roles.", isCorrect: true },
      { id: "opt4", text: "Fire your business partner for even suggesting it", outcome: "Wrong! An extreme overreaction to a bad suggestion ruins your partnership.", isCorrect: false },
    ],
  },
];

const ReflexHiring = () => {
  const location = useLocation();
  const gameId = "ehe-adults-52";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_HIRING_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 15;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 30;
  const stage = REFLEX_HIRING_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Indecision in hiring can cost you great candidates or leave you understaffed!", isCorrect: false });
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
      title="Reflex: Hiring"
      subtitle={
        showResult
          ? "Excellent! You understand that role clarity and skills drive a successful business."
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Role Clarity & Skill' : '❌ Hiring Friends Only / Unstructured'}</span>
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

export default ReflexHiring;
