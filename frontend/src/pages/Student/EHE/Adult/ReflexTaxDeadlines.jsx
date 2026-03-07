import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_TAX_DEADLINES_STAGES = [
  {
    id: 1,
    prompt: "It's tax season, and you haven't organized your receipts from the entire year.",
    options: [
      { id: "opt1", text: "Ignore it and hope the tax agency forgets about you", outcome: "Wrong! Ignoring taxes leads to massive penalties and legal trouble.", isCorrect: false },
      { id: "opt3", text: "Guess the numbers to save time", outcome: "Wrong! Filing inaccurate taxes is illegal and will trigger audits.", isCorrect: false },
      { id: "opt4", text: "Decide to file next year instead", outcome: "Wrong! Delaying deadlines results in immediate financial penalties.", isCorrect: false },
      { id: "opt2", text: "Hire a professional accountant and hand over your messy receipts", outcome: "Correct! Seeking professional help is crucial when you're overwhelmed with compliance.", isCorrect: true },
    ],
  },
  {
    id: 2,
    prompt: "You receive an official notice that your business tax filing is due in two weeks.",
    options: [
      { id: "opt2", text: "Immediately set aside time to review your books and file on time", outcome: "Correct! Proactive compliance saves money and prevents business disruption.", isCorrect: true },
      { id: "opt1", text: "Throw the notice away because it stresses you out", outcome: "Wrong! Avoiding reality doesn't make the deadline disappear.", isCorrect: false },
      { id: "opt3", text: "Assume they will give you an extension automatically", outcome: "Wrong! You must officially apply for extensions, they are never automatic.", isCorrect: false },
      { id: "opt4", text: "Wait until the very last day to start looking at it", outcome: "Wrong! Rushing leads to errors, missed deductions, and extreme stress.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "You made a significant profit this quarter but didn't set aside any money for taxes.",
    options: [
      { id: "opt1", text: "Spend the profit on new equipment and worry about taxes later", outcome: "Wrong! You cannot use the government's money to fund your business expansion.", isCorrect: false },
      { id: "opt3", text: "Take out a high-interest personal loan to pay the tax bill when it arrives", outcome: "Wrong! This destroys your profit margin with unnecessary interest payments.", isCorrect: false },
      { id: "opt2", text: "Calculate the estimated tax immediately and move it to a separate reserve account", outcome: "Correct! Separating tax money immediately ensures you can always pay your obligations.", isCorrect: true },
      { id: "opt4", text: "Hide the profit in a personal account", outcome: "Wrong! Tax evasion is a crime.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "A friend tells you about a 'secret trick' to avoid paying any taxes at all.",
    options: [
      { id: "opt1", text: "Try the trick immediately to save cash", outcome: "Wrong! Following unverified tax advice often leads to severe audits and fines.", isCorrect: false },
      { id: "opt2", text: "Consult with a certified tax professional to understand legal deductions", outcome: "Correct! A professional will maximize your legal deductions safely and legally.", isCorrect: true },
      { id: "opt3", text: "Tell all your other business friends to do the trick too", outcome: "Wrong! Spreading bad financial advice hurts everyone's businesses.", isCorrect: false },
      { id: "opt4", text: "Stop reporting your income entirely", outcome: "Wrong! This is blatant tax evasion and will ruin your financial future.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "You realize you made a mistake on last year's tax return that favored you by a small amount.",
    options: [
      { id: "opt1", text: "Keep quiet and hope they don't audit you", outcome: "Wrong! Living in fear of an audit is a terrible way to run a business.", isCorrect: false },
      { id: "opt2", text: "Completely close your business and change its name", outcome: "Wrong! This extreme overreaction does not erase your past liability.", isCorrect: false },
      { id: "opt4", text: "Blame your accounting software", outcome: "Wrong! You are ultimately responsible for the accuracy of your financial filings.", isCorrect: false },
      { id: "opt3", text: "Work with your accountant to file an amended return and pay the difference", outcome: "Correct! Honest, proactive correction prevents larger penalties and builds a clean record.", isCorrect: true },
    ],
  },
];

const ReflexTaxDeadlines = () => {
  const location = useLocation();
  const gameId = "ehe-adults-62";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_TAX_DEADLINES_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 15;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 30;
  const stage = REFLEX_TAX_DEADLINES_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Missing tax deadlines guarantees paying unnecessary penalties!", isCorrect: false });
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
      title="Reflex: Tax Deadlines"
      subtitle={
        showResult
          ? "Excellent! You understand that proactive tax compliance protects your business."
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ File Taxes on Time' : '❌ Delay Deadlines / Pay Penalties'}</span>
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

export default ReflexTaxDeadlines;
