import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_DOCUMENTATION_STAGES = [
  {
    id: 1,
    prompt: "You completed a major project successfully ahead of schedule. How do you record this?",
    options: [
      { id: "opt1", text: "Assume management will just remember it", outcome: "Wrong! Without records, achievements are quickly forgotten in a busy office.", isCorrect: false },
      { id: "opt2", text: "Add it to a Documented Performance tracker with metrics", outcome: "Correct! Quantified achievements are the strongest argument for a promotion.", isCorrect: true },
      { id: "opt3", text: "Leave No Records and only mention it casually", outcome: "Wrong! Casual mentions do not hold up during formal performance reviews.", isCorrect: false },
      { id: "opt4", text: "Wait for someone else to document it for you", outcome: "Wrong! You must own your career narrative and track your own wins.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Your performance review is next week. How do you prepare?",
    options: [
      { id: "opt1", text: "Show up with No Records and plan to wing it", outcome: "Wrong! Unprepared reviews lead to Reduced Promotion Readiness.", isCorrect: false },
      { id: "opt2", text: "Rely solely on your manager's notes", outcome: "Wrong! Managers have multiple direct reports and cannot remember everything you did.", isCorrect: false },
      { id: "opt3", text: "Present a portfolio of Documented Performance & Certifications", outcome: "Correct! Coming prepared with evidence makes advocating for yourself much easier.", isCorrect: true },
      { id: "opt4", text: "Assume you will get a raise simply because of your tenure", outcome: "Wrong! Raises are tied to value and impact, which must be proven.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "A client sends an email praising your exceptional support on a difficult issue.",
    options: [
      { id: "opt1", text: "Read it and immediately delete it to keep a clean inbox", outcome: "Wrong! You just deleted valuable proof of your performance.", isCorrect: false },
      { id: "opt2", text: "Keep it to yourself to avoid seeming arrogant", outcome: "Wrong! Sharing positive feedback professionally is not arrogant.", isCorrect: false },
      { id: "opt3", text: "Save the email in a 'Kudos' folder as Documented Performance", outcome: "Correct! A Kudos folder is excellent ammo for your year-end review.", isCorrect: true },
      { id: "opt4", text: "Reply only with emojis", outcome: "Wrong! While friendly, it doesn't help your professional documentation strategy.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "You want to pivot to a higher-paying, specialized role in your department.",
    options: [
      { id: "opt1", text: "Complain that you haven't been promoted yet", outcome: "Wrong! Complaining without proof of readiness harms your reputation.", isCorrect: false },
      { id: "opt2", text: "Rely on No Records and hope they see your potential", outcome: "Wrong! Hope is not a strategy. This leads to Reduced Promotion Readiness.", isCorrect: false },
      { id: "opt4", text: "Threaten to quit unless they promote you", outcome: "Wrong! Ultimatums without leverage or documentation rarely work.", isCorrect: false },
      { id: "opt3", text: "Complete and share relevant Certifications aligned with the role", outcome: "Correct! Documented upskilling proves you possess the desired competencies.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "You are asked to update your resume for an internal talent mobility program.",
    options: [
      { id: "opt2", text: "Use your Documented Performance log to highlight recent high-impact projects", outcome: "Correct! A continuously updated achievement log makes resume writing effortless and accurate.", isCorrect: true },
      { id: "opt1", text: "Submit an outdated resume with No Records of recent wins", outcome: "Wrong! Missing recent data guarantees Reduced Promotion Readiness.", isCorrect: false },
      { id: "opt3", text: "Write vague descriptions of your day-to-day tasks", outcome: "Wrong! Task lists don't stand out; documented accomplishments do.", isCorrect: false },
      { id: "opt4", text: "Refuse to apply because updating a resume takes too long", outcome: "Wrong! You are sabotaging your own career progression.", isCorrect: false },
    ],
  },
];

const ReflexProfessionalDocumentation = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-29";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_DOCUMENTATION_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = REFLEX_DOCUMENTATION_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Lost opportunity to document your win!", isCorrect: false });
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
      title="Reflex: Professional Documentation"
      subtitle={
        showResult
          ? "Excellent! Keep tracking those wins to guarantee career growth."
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
                    ⚡ RECORD CHECK ⚡
                 </div>
                 <p className="text-white text-xl md:text-2xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
                 <div className="text-center font-mono text-cyan-300 text-xs tracking-widest uppercase mt-4 opacity-50">
                    Document this event before time runs out!
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Well Documented' : '❌ Missed Record!'}</span>
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

export default ReflexProfessionalDocumentation;
