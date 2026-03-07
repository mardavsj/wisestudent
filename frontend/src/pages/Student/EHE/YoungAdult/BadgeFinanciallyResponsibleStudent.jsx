import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You receive your student loan disbursement for the semester. What is the smartest way to manage these funds?",
    options: [
      { id: "opt2", text: "Place the funds in a separate account, budget strictly for tuition and essential living costs, and stretch it over the entire semester.", outcome: "Correct! Treating loan money as a strict budget, not a windfall, is crucial for financial survival.", isCorrect: true },
      { id: "opt1", text: "Spend a large portion immediately on a vacation to celebrate the start of the semester.", outcome: "Spending borrowed money on non-essential lifestyle choices leads to crippling post-graduation debt.", isCorrect: false },
      { id: "opt3", text: "Use it to throw parties and buy expensive gifts for friends to boost your social status.", outcome: "You are literally paying interest for decades on temporary social validation.", isCorrect: false },
      { id: "opt4", text: "Invest the entire loan amount in highly volatile cryptocurrency hoping to double it quickly.", outcome: "Gambling with money you owe to the government or a bank is incredibly dangerous.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "A credit card company on campus offers you a free t-shirt if you sign up for a card. What should you do?",
    options: [
      { id: "opt1", text: "Sign up immediately, max it out on clothes, and only pay the minimum balance.", outcome: "Revolving high-interest credit card debt destroys your credit score before you even graduate.", isCorrect: false },
      { id: "opt2", text: "Sign up but never use it, just keeping it in a drawer forever.", outcome: "While safer, an unused card with potential annual fees isn't actively helping build a good credit history either.", isCorrect: false },
      { id: "opt3", text: "Understand the interest rates, sign up only if there are no hidden fees, use it for small, planned purchases, and pay the balance in full every single month.", outcome: "Correct! Responsible credit use builds a strong credit score essential for your post-grad life.", isCorrect: true },
      { id: "opt4", text: "Sign up for five different cards to get multiple free t-shirts.", outcome: "Multiple hard credit inquiries and unmanaged available credit signal high financial risk.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "You want to live off-campus. When evaluating housing options, what is the biggest financial mistake?",
    options: [
      { id: "opt1", text: "Factoring in commuting costs, utility bills, and internet when comparing prices.", outcome: "This is the correct approach to calculating the True Cost of Living.", isCorrect: false },
      { id: "opt3", text: "Finding roommates to split the cost of rent and utilities.", outcome: "Splitting costs is a financially sound strategy for students.", isCorrect: false },
      { id: "opt4", text: "Reading the lease agreement carefully before signing.", outcome: "Understanding your legal and financial obligations is fundamental adulting.", isCorrect: false },
      { id: "opt2", text: "Choosing an apartment solely based on its luxury amenities, completely ignoring your actual monthly income/loan allowance.", outcome: "Correct! Being 'house poor' forces you into debt just to feed yourself.", isCorrect: true },
    ],
  },
  {
    id: 4,
    prompt: "Your friends invite you to eat at expensive restaurants several times a week. You are on a tight budget. How do you handle this?",
    options: [
      { id: "opt3", text: "Be honest about your budget, suggest lower-cost alternatives like cooking together or grabbing coffee, and learn to confidently say 'no' to expenses you can't afford.", outcome: "Correct! True friends respect financial boundaries. Setting them early builds discipline.", isCorrect: true },
      { id: "opt1", text: "Go every time and quietly put it on a credit card so you don't feel left out.", outcome: "Hiding financial stress with debt eventually leads to a collapse.", isCorrect: false },
      { id: "opt2", text: "Complain bitterly every time they ask until they stop inviting you entirely.", outcome: "This damages relationships without addressing the root financial issue maturely.", isCorrect: false },
      { id: "opt4", text: "Steal food from the dining hall to save money for the expensive dinners.", outcome: "Risking your enrollment status for social conformity is irrational and unethical.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "As graduation approaches, you realize you have significant student debt. What is your first step managing it?",
    options: [
      { id: "opt1", text: "Avoid opening the mail or looking at the loan servicer website because it causes anxiety.", outcome: "Ignoring debt guarantees late fees, defaulted loans, and ruined credit.", isCorrect: false },
      { id: "opt2", text: "Assume the government will pass a law to cancel it, so you don't have to worry.", outcome: "Relying on unpredictable political outcomes is not a financial plan.", isCorrect: false },
      { id: "opt3", text: "Wait until collection agencies start calling before figuring out a payment plan.", outcome: "By the time collections call, the damage to your financial reputation is severe.", isCorrect: false },
      { id: "opt4", text: "Log in immediately, understand your total balance, interest rates, and grace periods, and explore income-driven repayment options before the first bill is due.", outcome: "Correct! Proactive debt management prevents small issues from becoming financial disasters.", isCorrect: true },
    ],
  },
];

const BadgeFinanciallyResponsibleStudent = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  
  const gameId = "ehe-young-adult-90";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 20;
  // User requested 4 coins per level.
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 40;
  
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
      title="Badge: Financially Responsible Student"
      subtitle={
        showResult
          ? "Achievement unlocked! You understand student finances."
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
            <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.15)] overflow-hidden relative">
              
              {/* Premium aesthetic background */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-amber-500/5 to-orange-900/20 pointer-events-none"></div>
              
              {/* Animated scanning line effect */}
              <div className="absolute left-0 top-0 w-full h-[2px] bg-amber-500/50 blur-sm animate-[scan_4s_ease-in-out_infinite]"></div>

              <div className="flex items-center justify-between text-sm font-bold uppercase tracking-[0.2em] text-amber-400 mb-6 border-b border-amber-500/30 pb-4 relative z-10">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  Decision {progressLabel}
                </span>
                <span className="bg-amber-500/10 px-3 py-1 rounded border border-amber-500/30">
                  Financial Planning: {score}/{totalStages}
                </span>
              </div>
              
              <div className="bg-black/40 rounded-2xl p-6 mb-8 border border-amber-500/20 shadow-inner relative z-10">
                <p className="text-white text-xl md:text-2xl font-serif leading-relaxed">
                  {stage.prompt}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "bg-slate-800 border-slate-700 hover:border-amber-400 hover:bg-slate-700 text-slate-200";
                  
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
                             {option.isCorrect ? 'Responsible Move' : 'Critical Misstep'}
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

export default BadgeFinanciallyResponsibleStudent;
