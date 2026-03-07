import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_LOAN_MANAGEMENT_STAGES = [
  {
    id: 1,
    prompt: "Your business hits a slow month, and you are short on cash to pay suppliers.",
    options: [
      { id: "opt1", text: "Take out three different high-interest cash advances immediately", outcome: "Wrong! Rapidly accumulating small, high-interest loans traps you in a debt cycle.", isCorrect: false },
      { id: "opt2", text: "Ignore the suppliers and hope they don't notice the late payment", outcome: "Wrong! Ignoring obligations destroys your vendor relationships and credit.", isCorrect: false },
      { id: "opt4", text: "Close the business immediately because of one bad month", outcome: "Wrong! Cash flow gaps are normal; overreacting destroys your progress.", isCorrect: false },
      { id: "opt3", text: "Evaluate your cash flow, reduce non-essential expenses, and negotiate payment terms", outcome: "Correct! Structured cash flow evaluation is safer than panic-borrowing.", isCorrect: true },
    ],
  },
  {
    id: 2,
    prompt: "You are offered a large loan with a variable interest rate that seems low right now.",
    options: [
      { id: "opt2", text: "Calculate how a future rate increase would impact your monthly cash flow", outcome: "Correct! Evaluating worst-case debt scenarios protects you from future defaults.", isCorrect: true },
      { id: "opt1", text: "Accept it without reading the terms because you need money fast", outcome: "Wrong! Blindly accepting debt increases your financial burden dangerously.", isCorrect: false },
      { id: "opt3", text: "Borrow twice as much as you need just in case", outcome: "Wrong! Over-borrowing needlessly increases your debt burden and interest costs.", isCorrect: false },
      { id: "opt4", text: "Use the loan to buy a personal luxury car to look successful", outcome: "Wrong! Mixing business loans with personal vanity purchases is financial ruin.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "You have three existing loans and the monthly payments are suffocating your business.",
    options: [
      { id: "opt1", text: "Take out a fourth loan to pay off the first three", outcome: "Wrong! Paying debt with more debt accelerates your path to bankruptcy.", isCorrect: false },
      { id: "opt2", text: "Explore debt consolidation for a lower combined interest rate and single payment", outcome: "Correct! Strategic consolidation reduces your monthly debt burden practically.", isCorrect: true },
      { id: "opt3", text: "Stop paying the smallest loan and hope they forget", outcome: "Wrong! Defaulting on any loan ruins your credit rating and invites lawsuits.", isCorrect: false },
      { id: "opt4", text: "Gamble your remaining cash hoping for a big win to pay them all off", outcome: "Wrong! This is reckless and will almost certainly result in total loss.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "A lender offers you a quick 'no credit check' loan but demands daily automatic withdrawals from your account.",
    options: [
      { id: "opt1", text: "Sign up immediately because it's fast cash", outcome: "Wrong! Daily withdrawal loans (like MCAs) can instantly drain your operational cash.", isCorrect: false },
      { id: "opt3", text: "Take the loan and then close that bank account", outcome: "Wrong! This is fraud and will lead to severe legal consequences.", isCorrect: false },
      { id: "opt2", text: "Decline the offer and look for traditional, transparent financing options", outcome: "Correct! Avoiding predatory lending prevents sudden operational cash shortages.", isCorrect: true },
      { id: "opt4", text: "Borrow the maximum amount allowed just because they offered it", outcome: "Wrong! You should only borrow exactly what you need and can afford to repay.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Your business is finally showing consistent profit after a year of struggling.",
    options: [
      { id: "opt3", text: "Build a cash reserve first before taking on any new expansion debt", outcome: "Correct! Cash reserves buffer you against risk, reducing your need for emergency loans.", isCorrect: true },
      { id: "opt1", text: "Immediately get a huge loan to expand to five new cities", outcome: "Wrong! Premature, debt-fueled expansion is incredibly risky.", isCorrect: false },
      { id: "opt2", text: "Increase your own salary to consume all the profit", outcome: "Wrong! Failing to build a cash reserve leaves you vulnerable to the next slow month.", isCorrect: false },
      { id: "opt4", text: "Stop tracking your finances because you feel successful now", outcome: "Wrong! Financial discipline is required even during profitable periods.", isCorrect: false },
    ],
  },
];

const ReflexLoanManagement = () => {
  const location = useLocation();
  const gameId = "ehe-adults-67";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_LOAN_MANAGEMENT_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 15;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 30;
  const stage = REFLEX_LOAN_MANAGEMENT_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Hesitation in financial planning can trap you in high-interest debt!", isCorrect: false });
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
      title="Reflex: Loan Management"
      subtitle={
        showResult
          ? "Excellent! You understand that managing cash flow is safer than reactive borrowing."
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Evaluate Cash Flow' : '❌ Rapidly Accumulate Small Loans / Increase Debt Burden'}</span>
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

export default ReflexLoanManagement;
