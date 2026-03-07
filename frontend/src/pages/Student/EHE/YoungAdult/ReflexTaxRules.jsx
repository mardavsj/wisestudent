import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_TAX_RULES_STAGES = [
  {
    id: 1,
    prompt: "You have started making a consistent profit from your side business. What should you do?",
    options: [
      { id: "opt1", text: "Ignore tax rules and hope nobody notices", outcome: "Wrong! Ignoring taxes is a crime and leads to Legal penalties.", isCorrect: false },
      { id: "opt2", text: "Learn basic tax registration", outcome: "Correct! Registering early keeps your business legally compliant and safe.", isCorrect: true },
      { id: "opt3", text: "Spend all the profit immediately so there's nothing to tax", outcome: "Wrong! Revenue might still be taxable, and zero cash flow kills businesses.", isCorrect: false },
      { id: "opt4", text: "Keep everything in cash and don't declare it", outcome: "Wrong! Tax evasion carries massive Legal penalties.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "You receive an official letter requesting clarification on your business filings.",
    options: [
      { id: "opt1", text: "Respond promptly and clarify with records", outcome: "Correct! Working with the authorities early prevents minor issues from becoming Legal penalties.", isCorrect: true },
      { id: "opt2", text: "Throw the letter away and ignore it", outcome: "Wrong! They won't forget, and they will fine you.", isCorrect: false },
      { id: "opt3", text: "Panic and close your business permanently", outcome: "Wrong! It's often just a routine check or a small mistake.", isCorrect: false },
      { id: "opt4", text: "Argue with them aggressively over the phone", outcome: "Wrong! Be professional. Aggression doesn't change tax rules.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "How should you track your business expenses throughout the year for tax purposes?",
    options: [
      { id: "opt1", text: "Rely entirely on your memory at year-end", outcome: "Wrong! You will forget, miss deductions, and file inaccurately.", isCorrect: false },
      { id: "opt2", text: "Mix business expenses with your personal grocery receipts", outcome: "Wrong! Commingling funds makes filing a nightmare.", isCorrect: false },
      { id: "opt3", text: "Keep detailed records and a dedicated ledger", outcome: "Correct! Organised books make tax season quick, accurate, and stress-free.", isCorrect: true },
      { id: "opt4", text: "Assume that small business expenses don't matter at all", outcome: "Wrong! Small expenses add up to major legal tax deductions.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "Tax season is approaching, and you realize you don't know how to file correctly.",
    options: [
      { id: "opt1", text: "Guess the numbers to finish it faster", outcome: "Wrong! Guessing leads directly to audits and Legal penalties.", isCorrect: false },
      { id: "opt3", text: "Ignore the deadline to avoid the stress", outcome: "Wrong! Missing the deadline triggers automatic late fees.", isCorrect: false },
      { id: "opt4", text: "Submit a blank form and let them figure it out", outcome: "Wrong! This will trigger an immediate rejection and inspection.", isCorrect: false },
      { id: "opt2", text: "Consult a professional or use official tax software", outcome: "Correct! When in doubt, always seek qualified professional help.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "What is the ultimate consequence of actively evading business taxes?",
    options: [
      { id: "opt1", text: "You just get a polite warning letter", outcome: "Wrong! Tax evasion is taken much more seriously than a warning.", isCorrect: false },
      { id: "opt2", text: "Severe Legal penalties and business closure", outcome: "Correct! Tax evasion is a crime that can completely ruin your life and business.", isCorrect: true },
      { id: "opt3", text: "Nothing, if your business is small enough", outcome: "Wrong! Even small businesses face audits and Legal penalties.", isCorrect: false },
      { id: "opt4", text: "The government will just pay your taxes for you", outcome: "Wrong! That's simply not how taxes work anywhere.", isCorrect: false },
    ],
  },
];

const ReflexTaxRules = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-52";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_TAX_RULES_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 15;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 30;
  const stage = REFLEX_TAX_RULES_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "The tax deadline passed!", isCorrect: false });
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
      title="Reflex: Tax Rules"
      subtitle={
        showResult
          ? "Great job! Keep your business legally compliant."
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
              <div className="bg-black/50 border-2 border-amber-900 shadow-[0_0_15px_rgba(245,158,11,0.2)] p-6 rounded-xl mt-6">
                 <div className="text-center font-mono text-amber-300 text-lg tracking-widest uppercase mb-4 opacity-50">
                    ⚡ COMPLIANCE CHECK ⚡
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Law Abiding' : '❌ Legal Risk'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-amber-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(245,158,11,0.4)] hover:scale-105 transform transition-all border border-amber-400 hover:bg-amber-500"
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

export default ReflexTaxRules;
