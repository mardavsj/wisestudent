import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_FINANCIAL_SAFETY_STAGES = [
  {
    id: 1,
    prompt: "You rely entirely on your monthly paycheck. What is your most critical first step?",
    options: [
      { id: "opt1", text: "Build emergency funds", outcome: "Correct! An emergency fund is your first line of defense against unexpected shocks.", isCorrect: true },
      { id: "opt2", text: "Maintain financial vulnerability", outcome: "Wrong! Living paycheck to paycheck leaves you exposed to sudden disasters.", isCorrect: false },
      { id: "opt3", text: "Increase lifestyle spending", outcome: "Wrong! Spending more before you have a safety net is extremely risky.", isCorrect: false },
      { id: "opt4", text: "Apply for maximum credit card limits", outcome: "Wrong! Credit is debt, not an emergency fund.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Your laptop unexpectedly breaks and you need it for work. How do you pay for a repair?",
    options: [
      { id: "opt1", text: "Panic and ignore the repair", outcome: "Wrong! Ignoring essential tools hurts your ability to earn an income.", isCorrect: false },
      { id: "opt2", text: "Take out a high-interest payday loan", outcome: "Wrong! Payday loans trap you in a cycle of expensive debt.", isCorrect: false },
      { id: "opt3", text: "Use money from your dedicated emergency fund", outcome: "Correct! This is exactly what emergency funds are built for.", isCorrect: true },
      { id: "opt4", text: "Sell your essential furniture", outcome: "Wrong! You shouldn't have to sell basic living items if you're prepared.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "You get a 15% salary increase. What should you do with the extra money?",
    options: [
      { id: "opt1", text: "Immediately move into a much more expensive apartment", outcome: "Wrong! Immediate lifestyle inflation prevents you from building real wealth.", isCorrect: false },
      { id: "opt2", text: "Accelerate your emergency fund and investments", outcome: "Correct! Directing windfalls to financial security speeds up your safety goals.", isCorrect: true },
      { id: "opt3", text: "Start eating out at luxury restaurants every night", outcome: "Wrong! This creates higher lifestyle spending without long-term benefits.", isCorrect: false },
      { id: "opt4", text: "Ignore it and keep financial vulnerability", outcome: "Wrong! A salary bump is a lifeline to escape financial vulnerability. Don't waste it.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "How many months of basic living expenses should your emergency fund ideally cover?",
    options: [
      { id: "opt1", text: "Zero — use credit cards instead", outcome: "Wrong! Debt is not an emergency fund and comes with crushing interest.", isCorrect: false },
      { id: "opt2", text: "Just 1 week of expenses", outcome: "Wrong! A single week is not enough to survive unexpected job loss or major illness.", isCorrect: false },
      { id: "opt4", text: "Only enough to cover your next weekend trip", outcome: "Wrong! Vacations are predictable expenses, not unpredictable emergencies.", isCorrect: false },
      { id: "opt3", text: "3 to 6 months of essential living expenses", outcome: "Correct! This provides enough runway to recover from major life events safely.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "A friend invites you to go on an expensive trip that would drain your newly built emergency fund.",
    options: [
      { id: "opt1", text: "Go on the trip and rebuild the fund later", outcome: "Wrong! Draining emergency funds for non-emergencies restores your financial vulnerability.", isCorrect: false },
      { id: "opt2", text: "Politely decline and save up separately for a future trip", outcome: "Correct! Maintaining financial boundaries protects your hard-earned safety net.", isCorrect: true },
      { id: "opt3", text: "Take on credit card debt to go", outcome: "Wrong! Financing lifestyle spending with debt destroys your financial safety.", isCorrect: false },
      { id: "opt4", text: "Complain that being responsible is boring", outcome: "Wrong! Financial security provides peace of mind, which is worth the discipline.", isCorrect: false },
    ],
  },
];

const ReflexFinancialSafety = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-23";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_FINANCIAL_SAFETY_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = REFLEX_FINANCIAL_SAFETY_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Financial emergencies don't wait! Stay prepared.", isCorrect: false });
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
      showCorrectAnswerFeedback(coinsPerLevel, true);
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
      title="Reflex: Financial Safety"
      subtitle={
        showResult
          ? "Excellent! You understand how to build a robust financial safety net."
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
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-teal-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Scenario {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-teal-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              {/* Question Display */}
              <div className="bg-black/50 border-2 border-teal-900 shadow-[0_0_15px_rgba(20,184,166,0.2)] p-6 rounded-xl mt-6">
                 <div className="text-center font-mono text-teal-300 text-lg tracking-widest uppercase mb-4 opacity-50">
                    ⚡ SAFETY REFLEX ⚡
                 </div>
                 <p className="text-white text-xl md:text-2xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
                 <div className="text-center font-mono text-teal-300 text-xs tracking-widest uppercase mt-4 opacity-50">
                    Secure your financial position before time runs out!
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "border-teal-700 bg-slate-800 text-teal-100 hover:bg-slate-700 hover:border-teal-500 border-[3px]";
                  
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Secure Move' : '❌ Risky Decision'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-teal-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(20,184,166,0.4)] hover:scale-105 transform transition-all border border-teal-400 hover:bg-teal-500"
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

export default ReflexFinancialSafety;
