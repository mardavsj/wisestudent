import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "A shop earns ₹20,000 profit this month. The owner wants to buy a new smartphone. His old delivery bike also needs replacing. What should he do?",
    options: [
      { id: "opt1", text: "Buy the phone — he deserves a reward for hard work", outcome: "Incorrect. The bike directly generates revenue; the phone doesn't grow the business.", isCorrect: false },
      { id: "opt3", text: "Buy both on EMI — why choose?", outcome: "Incorrect. Double EMIs on limited profit can create a dangerous cash crunch.", isCorrect: false },
      { id: "opt2", text: "Fix or replace the bike first — it's a revenue-generating asset", outcome: "Correct! Re-investing in assets that earn money should always come before luxuries.", isCorrect: true },
    ],
  },
  {
    id: 2,
    prompt: "A tea-stall owner re-invests ₹5,000 of monthly profit into better ingredients and cups with a logo. What happens over 3 months?",
    options: [
      { id: "opt1", text: "Nothing changes — customers don't notice small upgrades", outcome: "Incorrect. Customers absolutely notice quality and branding improvements.", isCorrect: false },
      { id: "opt2", text: "Customer count grows, daily revenue increases, and the brand strengthens", outcome: "Correct! Small, consistent re-investments compound into significant growth.", isCorrect: true },
      { id: "opt3", text: "He loses ₹15,000 because those ₹5,000 were wasted each month", outcome: "Incorrect. Investing in quality and branding consistently shows measurable returns.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Two friends start identical shops. Owner A re-invests 30% of profit; Owner B spends all profit on lifestyle. After 2 years, what's the likely result?",
    options: [
      { id: "opt2", text: "Owner A has a bigger shop, more stock, and higher revenue while Owner B is stuck", outcome: "Correct! Re-investment compounds — even small amounts create huge gaps over time.", isCorrect: true },
      { id: "opt1", text: "Both end up at the same level — profit doesn't matter that much", outcome: "Incorrect. Compounding re-investment creates massive divergence over time.", isCorrect: false },
      { id: "opt3", text: "Owner B is happier because he enjoyed his money", outcome: "Incorrect. Short-term spending creates long-term financial stress when the business stagnates.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "When is it OK for a business owner to spend profit on personal luxuries?",
    options: [
      { id: "opt1", text: "Never — every rupee must go back into the business forever", outcome: "Incorrect. Burnout is real; owners need rewards, but only after securing the business.", isCorrect: false },
      { id: "opt2", text: "After the business has a stable emergency fund AND growth capital set aside", outcome: "Correct! Pay yourself after the business is secure — not before.", isCorrect: true },
      { id: "opt3", text: "Whenever there's profit — you earned it, spend it", outcome: "Incorrect. Spending all profit leaves nothing for emergencies or growth.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Final Verdict: Should profit be spent on personal luxury or put back into business?",
    options: [
      { id: "opt2", text: "Spend it all — you can always earn more next month", outcome: "Incorrect. One bad month with no reserves can shut down an entire business.", isCorrect: false },
      { id: "opt3", text: "Split 50-50 between luxury and business every single month", outcome: "Incorrect. A fixed 50% on luxury is too high for a growing business with no reserves.", isCorrect: false },
      { id: "opt1", text: "Re-invest first to build stability; reward yourself from the surplus after", outcome: "Correct! The formula is: Revenue → Expenses → Re-investment → Emergency Fund → Personal.", isCorrect: true },
    ],
  },
];

const DebateReinvestingProfit = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  // Registering at index 72
  const gameId = "finance-business-livelihood-finance-72";
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
      title="Debate: Re-investing Profit"
      subtitle={
        showResult
          ? "Debate concluded! Smart re-investment builds empires from small profits."
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
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-lime-500 to-green-600"></div>

              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8 border-b border-slate-700 pb-4">
                <span>Phase {progressLabel}</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Score: {score}/{totalStages}
                </span>
              </div>
              
              <div className="text-center mb-10">
                <span className="inline-block py-1 px-3 rounded-full bg-lime-900/50 text-lime-300 text-xs font-bold uppercase tracking-wider mb-4 border border-lime-500/30">
                  Topic of Debate
                </span>
                <p className="text-white text-xl md:text-2xl font-bold leading-relaxed">
                  "{stage.prompt}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "from-slate-800 to-slate-900 border-slate-700 hover:border-lime-500 hover:from-slate-800 hover:to-lime-900/40 text-slate-200";
                  
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

export default DebateReinvestingProfit;
