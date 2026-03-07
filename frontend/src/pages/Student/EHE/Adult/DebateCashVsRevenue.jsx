import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Your business is generating record sales this quarter, but your bank account balance is dangerously low. What is the most likely cause?",
    options: [
      { id: "opt1", text: "You are managing cash flow properly, but the bank made an error.", outcome: "Incorrect. Bank errors of this magnitude are rare; the issue is usually cash cycle management.", isCorrect: false },
      { id: "opt2", text: "Your sales are strong, but you haven't collected the cash from your customers yet.", outcome: "Correct! Revenue on paper doesn't equal cash in the bank until the invoice is paid.", isCorrect: true },
      { id: "opt3", text: "High sales automatically mean high cash, so someone must be stealing.", outcome: "Incorrect. A mismatch between sales and cash is typical of delayed receivables, not necessarily theft.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Which of the following is more critically important for the day-to-day survival of a business?",
    options: [
      { id: "opt1", text: "High revenue reported on the income statement.", outcome: "Incorrect. Revenue is important for growth, but it doesn't pay bills today.", isCorrect: false },
      { id: "opt3", text: "The company's brand reputation on social media.", outcome: "Incorrect. While reputation matters long-term, it won't prevent immediate insolvency.", isCorrect: false },
      { id: "opt2", text: "Available cash to pay bills, suppliers, and payroll.", outcome: "Correct! Cash is the oxygen of a business; without it, operations stop immediately.", isCorrect: true },
    ],
  },
  {
    id: 3,
    prompt: "You close a massive $100,000 deal, but the client has 90 days to pay. You must pay your suppliers next week. How should you view this $100,000?",
    options: [
      { id: "opt1", text: "It is revenue, but it is not available cash right now.", outcome: "Correct! You must find another way to bridge the cash gap for your suppliers.", isCorrect: true },
      { id: "opt2", text: "It is available cash you can spend immediately on new equipment.", outcome: "Incorrect. Spending cash you don't possess yet will cause bounced checks.", isCorrect: false },
      { id: "opt3", text: "It means you don't need to worry about expenses for the next 90 days.", outcome: "Incorrect. Your expenses still require immediate cash payments.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "If a company focuses ONLY on driving revenue and completely ignores cash flow, what is the most likely risk?",
    options: [
      { id: "opt1", text: "They will become too profitable too quickly and have to pay excessive taxes.", outcome: "Incorrect. Focus on revenue without cash flow often leads to severe liquidity issues.", isCorrect: false },
      { id: "opt2", text: "They could go bankrupt even while making record sales, simply by running out of cash.", outcome: "Correct! This is a common trap for fast-growing but poorly managed businesses.", isCorrect: true },
      { id: "opt3", text: "They will have too much cash on hand to manage effectively.", outcome: "Incorrect. Ignoring cash flow usually means running out of cash, not accumulating it.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "What is the most sustainable financial strategy for a growing business?",
    options: [
      { id: "opt1", text: "Ignore cash flow entirely as long as monthly revenue keeps increasing.", outcome: "Incorrect. Unmanaged growth devours cash and can sink the company.", isCorrect: false },
      { id: "opt3", text: "Stop selling to new customers entirely just to keep cash in the bank.", outcome: "Incorrect. Stopping sales will eventually destroy the business; the goal is balance.", isCorrect: false },
      { id: "opt2", text: "Manage cash flow carefully to ensure survival while steadily growing revenue.", outcome: "Correct! Balancing profitable growth with strong liquidity management is the key to success.", isCorrect: true },
    ],
  },
];

const DebateCashVsRevenue = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  const gameId = "ehe-adults-46";
  const gameData = getGameDataById(gameId);
  // Default to 10 coins / 20 XP
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  
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
      title="Debate: Cash vs Revenue"
      subtitle={
        showResult
          ? "Debate concluded! Managing cash flow ensures survival while revenue ensures growth."
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
      gameType="ehe"
      nextGamePath={location.state?.nextGamePath}
      nextGameId={location.state?.nextGameId}
      backPath={location.state?.returnPath}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult && stage && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-slate-700 shadow-2xl relative overflow-hidden">
              
              {/* Podium aesthetic */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 to-indigo-600"></div>

              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8 border-b border-slate-700 pb-4">
                <span>Phase {progressLabel}</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Score: {score}/{totalStages}
                </span>
              </div>
              
              <div className="text-center mb-10">
                <span className="inline-block py-1 px-3 rounded-full bg-violet-900/50 text-violet-300 text-xs font-bold uppercase tracking-wider mb-4 border border-violet-500/30">
                  Topic of Debate
                </span>
                <p className="text-white text-xl md:text-2xl font-bold leading-relaxed">
                  "{stage.prompt}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "from-slate-800 to-slate-900 border-slate-700 hover:border-violet-500 hover:from-slate-800 hover:to-violet-900/40 text-slate-200";
                  
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

export default DebateCashVsRevenue;
