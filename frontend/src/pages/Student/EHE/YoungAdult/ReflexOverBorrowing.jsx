import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_OVER_BORROWING_STAGES = [
  {
    id: 1,
    prompt: "Your business needs new office supplies that cost $200.",
    options: [
      { id: "opt1", text: "Take multiple small loans just in case", outcome: "Wrong! Borrowing more than you need leads to unnecessary interest and debt burden.", isCorrect: false },
      { id: "opt2", text: "Use cash flow and practice Loan discipline", outcome: "Correct! Small, manageable expenses should be covered by operational revenue.", isCorrect: true },
      { id: "opt3", text: "Open a new high-interest credit card", outcome: "Wrong! Using high-interest debt for minor supplies destroys profitability.", isCorrect: false },
      { id: "opt4", text: "Take out a quick payday loan", outcome: "Wrong! Predatory lending creates an immediate and severe debt burden.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "You receive three different pre-approved loan offers in the mail.",
    options: [
      { id: "opt1", text: "Accept all of them to have maximum cash", outcome: "Wrong! This creates a massive debt burden you cannot service.", isCorrect: false },
      { id: "opt2", text: "Take multiple small loans without reading the terms", outcome: "Wrong! Hidden fees and variable interest rates will trap you.", isCorrect: false },
      { id: "opt3", text: "Shred them and maintain Loan discipline", outcome: "Correct! Never accept loans you do not have a specific, profitable plan for.", isCorrect: true },
      { id: "opt4", text: "Max them out to buy personal luxury items", outcome: "Wrong! This is a fast track to personal bankruptcy.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Your revenue dipped slightly this month due to a holiday.",
    options: [
      { id: "opt1", text: "Panic and Take multiple small loans to cover the gap", outcome: "Wrong! Borrowing to cover temporary revenue dips creates a permanent debt burden.", isCorrect: false },
      { id: "opt2", text: "Use your emergency reserve and maintain Loan discipline", outcome: "Correct! Reserves exist exactly for seasonal or temporary fluctuations.", isCorrect: true },
      { id: "opt3", text: "Borrow money from dangerous lenders", outcome: "Wrong! Desperation borrowing leads to business ruin.", isCorrect: false },
      { id: "opt4", text: "Take a loan to throw a massive party to boost morale", outcome: "Wrong! Frivolous spending during a dip accelerates financial collapse.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "You want to buy a software subscription, but it charges annually upfront.",
    options: [
      { id: "opt2", text: "Evaluate if monthly billing is safer for cash flow", outcome: "Correct! Smart Loan discipline means analyzing alternatives before borrowing.", isCorrect: true },
      { id: "opt1", text: "Take multiple small loans from friends", outcome: "Wrong! Mixing personal relationships with unnecessary business debt is risky.", isCorrect: false },
      { id: "opt3", text: "Create a debt burden by financing it on a credit card and paying minimums", outcome: "Wrong! The interest will quickly exceed the value of the software.", isCorrect: false },
      { id: "opt4", text: "Steal the software", outcome: "Wrong! Piracy results in severe legal and financial penalties.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "A bank offers to double your credit line 'just in case' you need it.",
    options: [
      { id: "opt1", text: "Accept it and immediately spend it on unproven marketing", outcome: "Wrong! Spending borrowed money without a strategy guarantees a debt burden.", isCorrect: false },
      { id: "opt2", text: "Take multiple small loans alongside it to maximize leverage", outcome: "Wrong! Over-leveraging fundamentally destabilizes your business.", isCorrect: false },
      { id: "opt4", text: "Draw the cash and put it in a risky personal investment", outcome: "Wrong! Commingling funds and gambling borrowed money is a disaster.", isCorrect: false },
      { id: "opt3", text: "Politely decline or strictly lock it away with Loan discipline", outcome: "Correct! Accessible credit is a tool, not free money to be spent.", isCorrect: true },
    ],
  },
];

const ReflexOverBorrowing = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-57";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_OVER_BORROWING_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 15;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 30;
  const stage = REFLEX_OVER_BORROWING_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Hesitation led to a bad financial decision!", isCorrect: false });
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
      title="Reflex: Over-Borrowing"
      subtitle={
        showResult
          ? "Excellent! You understand how to maintain loan discipline."
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
              <div className="bg-black/50 border-2 border-teal-900 shadow-[0_0_15px_rgba(45,212,191,0.2)] p-6 rounded-xl mt-6">
                 <div className="text-center font-mono text-teal-300 text-lg tracking-widest uppercase mb-4 opacity-50">
                    ⚡ DEBT AWARENESS ⚡
                 </div>
                 <p className="text-white text-xl md:text-2xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
                 <div className="text-center font-mono text-teal-300 text-xs tracking-widest uppercase mt-4 opacity-50">
                    Make your decision before time runs out!
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Financial Discipline' : '❌ Debt Trap!'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-teal-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(45,212,191,0.4)] hover:scale-105 transform transition-all border border-teal-400 hover:bg-teal-500"
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

export default ReflexOverBorrowing;
