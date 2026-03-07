import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You are deciding whether to pursue a Master's degree. What is the most financially sound approach?",
    options: [
      { id: "opt2", text: "Calculate the exact career trajectory it unlocks and whether the increased salary justifies the cost and time out of the workforce.", outcome: "Correct! Education must be evaluated as an investment with a clear expected return.", isCorrect: true },
      { id: "opt1", text: "Do it immediately after undergrad just to avoid looking for a job right now.", outcome: "Using expensive higher education as a hiding place from the job market creates massive debt without direction.", isCorrect: false },
      { id: "opt3", text: "Choose the most expensive, prestigious program even if you have to borrow 100% of the cost at high interest.", outcome: "Brand name alone rarely justifies crippling student loan debt if the field doesn't pay well.", isCorrect: false },
      { id: "opt4", text: "Assume any extra degree automatically guarantees a higher salary forever.", outcome: "Many advanced degrees do not increase earning potential enough to offset their cost.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Your chosen career field values practical portfolios more than academic credentials (e.g., design, coding). What should you focus on?",
    options: [
      { id: "opt1", text: "Spend 4 years getting a theoretical degree without ever building a single real-world project.", outcome: "Graduating with a degree but empty hands makes you unemployable in portfolio-driven fields.", isCorrect: false },
      { id: "opt2", text: "Focus entirely on passing written exams with perfect scores.", outcome: "Perfect exam scores do not prove you can actually do the job in the real world.", isCorrect: false },
      { id: "opt4", text: "Complain that companies are unfair for not hiring you based on your degree alone.", outcome: "The market determines value based on what you can produce, not what you feel you deserve.", isCorrect: false },
      { id: "opt3", text: "Build a strong portfolio of real projects, open-source contributions, or freelance work while selectively taking focused short courses.", outcome: "Correct! In skill-based fields, tangible proof of ability always beats theoretical certificates.", isCorrect: true },
    ],
  },
  {
    id: 3,
    prompt: "You want to pivot to a completely new industry. How should you approach education for this shift?",
    options: [
      { id: "opt1", text: "Immediately quit your job and enroll in a generic 4-year degree in the new field.", outcome: "A complete reset is incredibly expensive and risky before testing the waters.", isCorrect: false },
      { id: "opt3", text: "Just apply for senior roles in the new industry and hope they train you from scratch.", outcome: "Companies hire for existing value; they will not pay to train you for a senior pivot.", isCorrect: false },
      { id: "opt2", text: "Start with low-cost or free online certifications and side projects to validate your interest and aptitude first.", outcome: "Correct! Validating the pivot with low-risk micro-credentials protects your financial stability.", isCorrect: true },
      { id: "opt4", text: "Wait for a mentor to magically appear and teach you everything.", outcome: "Passive waiting guarantees stagnation; career pivots require aggressive self-education.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "You are considering taking out an education loan. What is the critical calculation?",
    options: [
      { id: "opt1", text: "Estimating your post-graduation monthly loan payment and seeing if a realistic entry-level salary in your field can comfortably cover it.", outcome: "Correct! This calculation (Debt-to-Income expectation) prevents lifetime financial paralysis.", isCorrect: true },
      { id: "opt2", text: "Only looking at the minimum monthly payment the bank asks for right now.", outcome: "Ignoring total interest and changing repayment terms is a debt trap.", isCorrect: false },
      { id: "opt3", text: "Taking the maximum loan amount offered so you can have a lavish lifestyle while studying.", outcome: "Borrowing for lifestyle using education loans is financial self-destruction.", isCorrect: false },
      { id: "opt4", text: "Assuming the debt will somehow be forgiven in the future.", outcome: "Never make financial commitments based on the unpredictable hope of future policy changes.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "A specialized bootcamp promises 'guaranteed jobs' but costs as much as a year of college. How do you assess it?",
    options: [
      { id: "opt1", text: "Trust their marketing materials completely because they look professional.", outcome: "Marketing is designed to sell, not to protect your best interests.", isCorrect: false },
      { id: "opt2", text: "Take out a high-interest private loan immediately to secure your spot.", outcome: "Rushing into expensive, high-interest debt for unverified programs is incredibly reckless.", isCorrect: false },
      { id: "opt3", text: "Assume that paying a lot of money means the education must be excellent.", outcome: "High price does not guarantee high quality or industry relevance.", isCorrect: false },
      { id: "opt4", text: "Search for independent reviews, contact alumni directly on LinkedIn, and scrutinize the fine print of the 'guarantee'.", outcome: "Correct! Due diligence is required to separate genuine accelerators from predatory programs.", isCorrect: true },
    ],
  },
];

const BadgeEducationPlanner = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  
  const gameId = "ehe-young-adult-70";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 15;
  // User requested 3 coins per question
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 30;
  
  const stage = STAGES[currentStageIndex];

  const handleChoice = (option) => {
    if (selectedChoice || !stage) return;
    setSelectedChoice(option);
    if (option.isCorrect) {
      setScore((s) => s + 1);
      showCorrectAnswerFeedback(1, true);
    }
    setTimeout(() => {
      if (currentStageIndex === totalStages - 1) {
        setShowResult(true);
      } else {
        setCurrentStageIndex((i) => i + 1);
      }
      setSelectedChoice(null);
    }, 3500);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Badge: Education Planner"
      subtitle={
        showResult
          ? "Achievement unlocked! You understand education alignment."
          : `Decision ${currentStageIndex + 1} of ${totalStages}`
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
      isBadgeGame={gameData?.isBadgeGame}
      badgeName={gameData?.badgeName}
      badgeImage={gameData?.badgeImage}
      gameId={gameId}
      gameType="ehe"
      nextGamePath={location.state?.nextGamePath}
      nextGameId={location.state?.nextGameId}
      backPath={location.state?.returnPath}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult && stage && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.15)] overflow-hidden relative">
              
              {/* Premium aesthetic background */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-indigo-500/5 to-purple-900/20 pointer-events-none"></div>
              
              {/* Animated scanning line effect */}
              <div className="absolute left-0 top-0 w-full h-[2px] bg-indigo-500/50 blur-sm animate-[scan_4s_ease-in-out_infinite]"></div>

              <div className="flex items-center justify-between text-sm font-bold uppercase tracking-[0.2em] text-indigo-400 mb-6 border-b border-indigo-500/30 pb-4 relative z-10">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                  Decision {progressLabel}
                </span>
                <span className="bg-indigo-500/10 px-3 py-1 rounded border border-indigo-500/30">
                  Planning Accuracy: {score}/{totalStages}
                </span>
              </div>
              
              <div className="bg-black/40 rounded-2xl p-6 mb-8 border border-indigo-500/20 shadow-inner relative z-10">
                <p className="text-white text-xl md:text-2xl font-serif leading-relaxed">
                  {stage.prompt}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "bg-slate-800 border-slate-700 hover:border-indigo-400 hover:bg-slate-700 text-slate-200";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "bg-emerald-900 border-emerald-400 text-emerald-50 shadow-[0_0_20px_rgba(52,211,153,0.4)] scale-[1.02]"
                      : "bg-rose-900 border-rose-500 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.4)] scale-[1.02]";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "bg-emerald-900/30 border-emerald-500/50 text-emerald-300 opacity-90 ring-1 ring-emerald-500/50";
                  } else if (selectedChoice) {
                    baseStyle = "bg-slate-900/60 border-slate-800 text-slate-500 opacity-50";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative rounded-xl ${baseStyle} border-2 p-5 text-left font-medium transition-all duration-300 disabled:cursor-not-allowed`}
                    >
                      <span className="block text-lg leading-snug">{option.text}</span>
                      
                      {isSelected && (
                         <div className={`mt-4 text-sm font-semibold p-3 rounded-lg bg-black/50 border ${option.isCorrect ? 'text-emerald-300 border-emerald-500/40' : 'text-rose-300 border-rose-500/40'} animate-fade-in-up`}>
                           <span className="uppercase text-[10px] tracking-widest opacity-70 block mb-1">
                             {option.isCorrect ? 'Smart Choice' : 'Critical Misstep'}
                           </span>
                           {option.outcome}
                         </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeEducationPlanner;
