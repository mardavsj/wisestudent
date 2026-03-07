import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_FINANCIAL_DISCIPLINE_STAGES = [
  {
    id: 1,
    prompt: "You get a 20% raise at work!",
    options: [
      { id: "opt1", text: "Immediately sign a lease for a luxury apartment (Lifestyle Expansion)", outcome: "Wrong! You just trapped your entire raise in fixed costs.", isCorrect: false },
      { id: "opt2", text: "Set up a Structured Saving Habit for the extra income", outcome: "Correct! Automating savings ensures your wealth grows with your salary.", isCorrect: true },
      { id: "opt3", text: "Take out loans to buy a new car because you 'deserve it'", outcome: "Wrong! Borrowing against future earnings keeps you broke.", isCorrect: false },
      { id: "opt4", text: "Start eating out at expensive restaurants every night", outcome: "Wrong! Lifestyle creep eats pay raises silently.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "You notice you have $500 left over at the end of the month.",
    options: [
      { id: "opt2", text: "Transfer it immediately to a high-yield savings account", outcome: "Correct! This builds your Structured Saving Habit and earns interest.", isCorrect: true },
      { id: "opt1", text: "Leave it in your checking account where it's easily spent", outcome: "Wrong! Idle money in checking usually disappears on impulse buys.", isCorrect: false },
      { id: "opt3", text: "Use it to finance an expensive watch (Borrowing more)", outcome: "Wrong! Financing luxury goods masks poor financial health.", isCorrect: false },
      { id: "opt4", text: "Upgrade your wardrobe just because you can (Lifestyle Expansion)", outcome: "Wrong! Expanding your lifestyle arbitrarily prevents long-term wealth.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Your friends invite you on an expensive spontaneous weekend trip.",
    options: [
      { id: "opt1", text: "Max out your credit card to afford it (Borrowing)", outcome: "Wrong! Funding lifestyle through high-interest debt is a trap.", isCorrect: false },
      { id: "opt2", text: "Pull from your emergency fund", outcome: "Wrong! A vacation is not a financial emergency.", isCorrect: false },
      { id: "opt4", text: "Just go and figure out how to pay for rent later", outcome: "Wrong! Ignoring essential bills for short-term fun equals disaster.", isCorrect: false },
      { id: "opt3", text: "Review your budget to see if it fits within your Structured Saving Habit", outcome: "Correct! Only spend what is already allocated for entertainment/travel.", isCorrect: true },
    ],
  },
  {
    id: 4,
    prompt: "You receive your annual bonus.",
    options: [
      { id: "opt1", text: "Use it as a down payment on a boat (Lifestyle Expansion)", outcome: "Wrong! A boat adds huge recurring maintenance costs.", isCorrect: false },
      { id: "opt2", text: "Take out a loan against the bonus for quick cash", outcome: "Wrong! Never borrow against variable future income.", isCorrect: false },
      { id: "opt3", text: "Invest 80% and use 20% for a sensible reward", outcome: "Correct! This rewards you while maintaining a Structured Saving Habit.", isCorrect: true },
      { id: "opt4", text: "Spend it all on a massive party for your friends", outcome: "Wrong! Your bonus is gone in a weekend with nothing to show for it.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "You want the newest smartphone, but your current one works perfectly fine.",
    options: [
      { id: "opt1", text: "Finance the new phone on a 36-month plan (Borrowing)", outcome: "Wrong! You are extending debt for a depreciating asset.", isCorrect: false },
      { id: "opt3", text: "Keep the current phone and stick to your Structured Saving Habit", outcome: "Correct! Delaying gratification accelerates your financial independence.", isCorrect: true },
      { id: "opt2", text: "Buy it outright to show off (Lifestyle Expansion)", outcome: "Wrong! Buying things just for status depletes your net worth.", isCorrect: false },
      { id: "opt4", text: "Take a payday loan to buy it today", outcome: "Wrong! Predatory loans will destroy your financial future over a phone.", isCorrect: false },
    ],
  },
];

const ReflexFinancialDiscipline = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-97";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_FINANCIAL_DISCIPLINE_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 20;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 40;
  const stage = REFLEX_FINANCIAL_DISCIPLINE_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Hesitation led to impulsive spending!", isCorrect: false });
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
      title="Reflex: Financial Discipline"
      subtitle={
        showResult
          ? "Excellent! You understand how to build wealth through structured habits."
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
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-amber-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Scenario {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              {/* Question Display */}
              <div className="bg-black/50 border-2 border-amber-900 shadow-[0_0_15px_rgba(251,191,36,0.2)] p-6 rounded-xl mt-6">
                 <div className="text-center font-mono text-amber-300 text-lg tracking-widest uppercase mb-4 opacity-50">
                    ⚡ WEALTH HABITS ⚡
                 </div>
                 <p className="text-white text-xl md:text-2xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
                 <div className="text-center font-mono text-amber-300 text-xs tracking-widest uppercase mt-4 opacity-50">
                    Make your decision before time runs out!
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "border-amber-700 bg-slate-800 text-amber-100 hover:bg-slate-700 hover:border-amber-500 border-[3px]";
                  
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Wealth Building' : '❌ Wealth Trap'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-amber-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(251,191,36,0.4)] hover:scale-105 transform transition-all border border-amber-400 hover:bg-amber-500"
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

export default ReflexFinancialDiscipline;
