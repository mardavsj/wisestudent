import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You expect high demand for an unproven product, so you consider buying a massive amount of stock upfront to save on per-unit cost. Why might this be dangerous?",
    options: [
      { id: "opt2", text: "It creates a huge cash blockage risk if the product fails to sell quickly.", outcome: "Correct! Sinking all your cash into unproven stock leaves you paralyzed if demand is low.", isCorrect: true },
      { id: "opt1", text: "It's the best way to guarantee immediate massive profits.", outcome: "Incorrect. Profit only exists when the item is actually sold.", isCorrect: false },
      { id: "opt3", text: "It usually means competitors will copy your product faster.", outcome: "Incorrect. The real danger is tying up your working capital.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "What happens to a newly established business if too much of its available cash is tied up in unsold inventory in a warehouse?",
    options: [
      { id: "opt2", text: "It automatically is considered highly valuable by external investors.", outcome: "Incorrect. Investors value liquidity and sales, not stagnant boxes.", isCorrect: false },
      { id: "opt1", text: "It struggles to pay essential daily operational expenses like rent, marketing, and salaries.", outcome: "Correct! Even with shelves full of products, a business without cash will collapse.", isCorrect: true },
      { id: "opt3", text: "It forces the team to work less hours.", outcome: "Incorrect. It usually causes panic and forces stressful emergency measures.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "A supplier aggressively offers you a 15% discount if you order triple your usual stock quantity. How should you approach this?",
    options: [
      { id: "opt1", text: "Accept immediately. The discount guarantees higher profit margins.", outcome: "Incorrect. Theoretical margins mean nothing if the product doesn't sell.", isCorrect: false },
      { id: "opt2", text: "Decline initially. Check if you have the proven sales volume to move the stock without destroying cash flow.", outcome: "Correct! Never let a discount trick you into a fatal cash blockage.", isCorrect: true },
      { id: "opt3", text: "Borrow money with a high-interest, short-term loan just to get the discount.", outcome: "Incorrect. Financing inventory with expensive debt wipes out the discount.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "Instead of massive, risky bulk buying, what inventory strategy is much safer for a new startup finding its footing?",
    options: [
      { id: "opt2", text: "Starting with smaller, frequent batches to validate actual market demand.", outcome: "Correct! Test demand with small orders before committing significant capital.", isCorrect: true },
      { id: "opt1", text: "Buying products one by one, ignoring any wholesale relationships.", outcome: "Incorrect. You still need a functioning supply chain, just not an overloaded one.", isCorrect: false },
      { id: "opt3", text: "Renting a larger, much more expensive warehouse to store future purchases.", outcome: "Incorrect. This just increases your overhead cash burn.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Ultimately, what is the core lesson about managing business cash flow in relationship to physical inventory?",
    options: [
      { id: "opt1", text: "Inventory equals wealth, so maximizing stock makes the company richer.", outcome: "Incorrect. Inventory is a liability until a customer pays for it.", isCorrect: false },
      { id: "opt2", text: "Having unspent cash in the bank is always a sign of a bad business owner.", outcome: "Incorrect. Cash reserves are critical for survival and seizing opportunities.", isCorrect: false },
      { id: "opt3", text: "Cash is king; maintaining liquidity is strictly more important than unproven bulk purchase discounts.", outcome: "Correct! A business survives on liquid cash, not stagnant inventory levels.", isCorrect: true },
    ],
  },
];

const DebateInventoryOverPurchase = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  const gameId = "ehe-young-adult-46";
  const gameData = getGameDataById(gameId);
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
      title="Debate: Inventory Over-Purchase"
      subtitle={
        showResult
          ? "Debate concluded! Protecting liquidity is more vital than theoretical discounts."
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

export default DebateInventoryOverPurchase;
