import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "A shop owner has saved ₹30,000 over 6 months. She needs ₹1,00,000 to buy a new display fridge. Should she keep saving or take a loan?",
    options: [
      { id: "opt2", text: "Take a small formal loan now and use the fridge to boost daily sales immediately", outcome: "Correct! A well-planned loan that generates more revenue than its EMI is smart leverage.", isCorrect: true },
      { id: "opt1", text: "Keep saving — she'll have enough in about 2 more years", outcome: "By then, competitors may grab the market. Timing matters in business.", isCorrect: false },
      { id: "opt3", text: "Borrow from a moneylender — it's faster than a bank", outcome: "Dangerous. Informal lenders charge extreme interest that can cripple profit.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "A vendor takes a ₹50,000 Mudra Loan at 12% annual interest. His new inventory earns him ₹8,000 extra profit per month. Is this a good deal?",
    options: [
      { id: "opt1", text: "No — any loan is bad; debt is always dangerous", outcome: "Incorrect. A loan that earns more than its EMI is productive debt, not dangerous debt.", isCorrect: false },
      { id: "opt2", text: "Yes — monthly profit of ₹8,000 far exceeds the ₹500 monthly interest cost", outcome: "Correct! When returns exceed loan cost, the loan is a growth accelerator.", isCorrect: true },
      { id: "opt3", text: "It depends on the weather outside", outcome: "Incorrect. Loan decisions depend on financial math, not weather.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "What is the biggest risk of taking a loan to expand your business?",
    options: [
      { id: "opt1", text: "The bank will take your house if you're one day late", outcome: "Incorrect. Banks have grace periods and restructuring options for small delays.", isCorrect: false },
      { id: "opt3", text: "People will think you're poor because you took a loan", outcome: "Incorrect. Most successful businesses use loans strategically. It's a sign of ambition.", isCorrect: false },
      { id: "opt2", text: "If the expansion doesn't generate enough extra income to cover the EMI", outcome: "Correct! The core risk is borrowing for something that doesn't pay for itself.", isCorrect: true },
    ],
  },
  {
    id: 4,
    prompt: "When is saving better than taking a loan?",
    options: [
      { id: "opt2", text: "Always — loans are never worth it", outcome: "Incorrect. Missing a time-sensitive opportunity costs more than interest.", isCorrect: false },
      { id: "opt1", text: "When the purchase is non-urgent and won't generate immediate extra revenue", outcome: "Correct! If there's no rush and no revenue upside, saving avoids unnecessary interest.", isCorrect: true },
      { id: "opt3", text: "When you have zero savings and no emergency fund", outcome: "Incorrect. Having no savings actually makes a loan more risky, not more justified.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Final Verdict: Loan vs Savings for business expansion?",
    options: [
      { id: "opt1", text: "Use savings for small, non-urgent needs; use loans for time-sensitive growth that generates revenue", outcome: "Correct! The smartest approach combines both strategies based on context.", isCorrect: true },
      { id: "opt2", text: "Never take a loan under any circumstances", outcome: "Incorrect. This limits growth when competitors are scaling with smart debt.", isCorrect: false },
      { id: "opt3", text: "Always take the biggest loan possible to grow fast", outcome: "Incorrect. Overleveraging is the #1 cause of small business failure.", isCorrect: false },
    ],
  },
];

const DebateLoanVsSavings = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  // Registering at index 46
  const gameId = "finance-business-livelihood-finance-46";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(2, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
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
      title="Debate: Loan vs Savings"
      subtitle={
        showResult
          ? "Debate concluded! Smart borrowing and disciplined saving go hand in hand."
          : `Point ${currentStageIndex + 1} of ${totalStages}`
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
      gameType="finance"
      nextGamePath={location.state?.nextGamePath}
      nextGameId={location.state?.nextGameId}
      backPath={location.state?.returnPath}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult && stage && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-slate-700 shadow-2xl relative overflow-hidden">
              
              {/* Podium aesthetic */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-emerald-600"></div>

              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8 border-b border-slate-700 pb-4">
                <span>Phase {progressLabel}</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Score: {score}/{totalStages}
                </span>
              </div>
              
              <div className="text-center mb-10">
                <span className="inline-block py-1 px-3 rounded-full bg-teal-900/50 text-teal-300 text-xs font-bold uppercase tracking-wider mb-4 border border-teal-500/30">
                  Topic of Debate
                </span>
                <p className="text-white text-xl md:text-2xl font-bold leading-relaxed">
                  "{stage.prompt}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "from-slate-800 to-slate-900 border-slate-700 hover:border-teal-500 hover:from-slate-800 hover:to-teal-900/40 text-slate-200";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "from-emerald-900/80 to-emerald-800 border-emerald-500 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-[1.02]"
                      : "from-rose-900/80 to-rose-800 border-rose-500 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.3)] scale-[1.02]";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "from-emerald-900/30 to-slate-900 border-emerald-500/50 text-emerald-400/80 ring-1 ring-emerald-500/30 opacity-80";
                  } else if (selectedChoice) {
                    baseStyle = "from-slate-900 to-slate-900 border-slate-800 text-slate-600 opacity-40";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative rounded-xl bg-gradient-to-r ${baseStyle} border-2 p-5 text-left font-medium transition-all duration-300 disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? (option.isCorrect ? 'border-emerald-400 bg-emerald-500/20' : 'border-rose-400 bg-rose-500/20') : 'border-slate-600'}`}>
                           {isSelected && <div className={`w-2.5 h-2.5 rounded-full ${option.isCorrect ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>}
                        </div>
                        <div className="flex-1">
                          <span className="block text-lg">{option.text}</span>
                          
                          <div className={`overflow-hidden transition-all duration-500 ${isSelected ? 'max-h-24 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className={`text-sm font-semibold p-3 rounded-lg ${option.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                              <span className="uppercase text-xs tracking-wider opacity-70 block mb-1">
                                {option.isCorrect ? 'Strong Argument' : 'Weak Argument'}
                              </span>
                              {option.outcome}
                            </div>
                          </div>
                        </div>
                      </div>
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

export default DebateLoanVsSavings;
