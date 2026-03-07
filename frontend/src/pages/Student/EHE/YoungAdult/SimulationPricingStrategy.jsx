import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "You are ready to set the price for your new product. What is your very first step?",
    options: [
      {
        id: "guess",
        text: "Guess a random price based on what feels right.",
        outcome: "Incorrect. Guessing often leads to underpricing and losing money, or overpricing and losing sales.",
        isCorrect: false,
      },
      {
        id: "cost",
        text: "Calculate the exact production cost first.",
        outcome: "Correct! You must know your baseline costs to ensure you maintain a profit margin.",
        isCorrect: true,
      },
      {
        id: "brand",
        text: "Focus only on brand strength and set the highest price possible.",
        outcome: "Incorrect. While brand matters, ignoring costs and market realities will backfire.",
        isCorrect: false,
      },
      
      {
        id: "undercut",
        text: "Set the price to exactly half of your biggest competitor.",
        outcome: "Incorrect. Blindly undercutting can destroy your profit margin and devalue your product.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "You've calculated that your direct material and labor cost is ₹500 per unit. Is ₹500 your final cost?",
    options: [
      {
        id: "no-overhead",
        text: "No, I need to add my overhead costs (rent, marketing, shipping) to find the true break-even point.",
        outcome: "Correct! Total costs include both direct unit costs and indirect business overheads.",
        isCorrect: true,
      },
      {
        id: "yes",
        text: "Yes, that is the exact cost to make it.",
        outcome: "Incorrect. You must also account for overhead costs like rent, marketing, and utilities.",
        isCorrect: false,
      },
      
      {
        id: "no-profit",
        text: "No, I just need to add ₹10 and call it done.",
        outcome: "Incorrect. A fixed small margin might not cover unseen expenses or allow business growth.",
        isCorrect: false,
      },
      {
        id: "yes-but",
        text: "Yes, but I should lower it to ₹400 to gain market share early.",
        outcome: "Incorrect. Selling below your cost price will quickly bankrupt your business.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "Your total cost per unit (including overhead) is ₹700. You want a 30% profit margin. What is your selling price?",
    options: [
      {
        id: "calc-1",
        text: "₹730",
        outcome: "Incorrect. You added ₹30, not 30%.",
        isCorrect: false,
      },
     
      {
        id: "calc-3",
        text: "₹910",
        outcome: "Incorrect. 700 + 30% = 910 gives you a 30% markup on cost, but only a ~23% margin on the sales price.",
        isCorrect: false,
      },
      {
        id: "calc-4",
        text: "₹1400",
        outcome: "Incorrect. This is a 100% markup, not 30%.",
        isCorrect: false,
      },
       {
        id: "calc-2",
        text: "₹1000",
        outcome: "Correct! (700 / (1 - 0.30) = 1000). This ensures a true 30% margin on the final selling price.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "At ₹1000, your product is 20% more expensive than competitors. How do you justify this price?",
    options: [
      {
        id: "hide",
        text: "Hide the price until the very last step of checkout.",
        outcome: "Incorrect. Frustrating customers with hidden pricing leads to abandoned carts and lost trust.",
        isCorrect: false,
      },
     
      {
        id: "complain",
        text: "Publicly insult your competitors' quality.",
        outcome: "Incorrect. This is unprofessional and makes your brand look insecure.",
        isCorrect: false,
      },
       {
        id: "value",
        text: "Clearly communicate your unique value proposition (better quality, faster shipping, excellent support).",
        outcome: "Correct! Customers will pay a premium if they perceive higher value and better service.",
        isCorrect: true,
      },
      {
        id: "panic",
        text: "Panic and drop the price back down to match them.",
        outcome: "Incorrect. If your costs require ₹1000, dropping the price destroys your profitability.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "A major distributor offers to buy 1,000 units, but demands a 25% discount. How do you respond?",
    options: [
      {
        id: "reject",
        text: "Reject it entirely because they are stealing your profit.",
        outcome: "Incorrect. Bulk orders usually require volume discounts and can still be highly profitable.",
        isCorrect: false,
      },
      {
        id: "analyze",
        text: "Analyze your profit margins at the discounted rate and negotiate a volume that works for both.",
        outcome: "Correct! Data-driven negotiation ensures the deal is profitable and expands your reach.",
        isCorrect: true,
      },
      {
        id: "accept",
        text: "Accept it immediately without running the numbers.",
        outcome: "Incorrect. You might accidentally agree to a deal that costs you money to fulfill.",
        isCorrect: false,
      },
      {
        id: "counter",
        text: "Tell them to pay full price or leave.",
        outcome: "Incorrect. This is too rigid for B2B wholesale negotiations.",
        isCorrect: false,
      },
    ],
  },
];

const SimulationPricingStrategy = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-34";
  const gameData = getGameDataById(gameId);
  const totalStages = SIMULATION_STAGES.length;

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  
  const stage = SIMULATION_STAGES[currentStageIndex];

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
      }, 1200);
    }
  };

  const handleNextStage = () => {
    if (!selectedChoice) return;
    if (currentStageIndex === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrentStageIndex((prev) => prev + 1);
    }
    setSelectedChoice(null);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Simulation: Pricing Strategy"
      subtitle={
        showResult
          ? "Simulation complete! You successfully developed a profitable pricing strategy."
          : `Scenario Step ${currentStageIndex + 1} of ${totalStages}`
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
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border-2 border-teal-500/30 shadow-2xl relative overflow-hidden">
               
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-teal-300 mb-6 relative z-10 border-b border-teal-500/20 pb-4">
                <span>Task {progressLabel}</span>
                <span className="bg-teal-950/80 px-4 py-1.5 rounded shadow-sm border border-teal-500/30">
                  Score: {score}/{totalStages}
                </span>
              </div>

              <div className="bg-gradient-to-br from-teal-950/80 to-slate-900/80 p-6 rounded-2xl border-l-4 border-teal-500 mb-8 shadow-inner relative z-10">
                 <p className="text-white text-xl md:text-2xl font-serif leading-relaxed italic">
                   {stage.prompt}
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  let baseStyle = "from-slate-800 to-teal-950 border-teal-500/30 hover:border-teal-400 hover:from-slate-700 hover:to-teal-900 text-slate-200";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "from-emerald-900 to-emerald-800 border-emerald-400 ring-4 ring-emerald-500/30 scale-[1.03] text-emerald-50 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      : "from-rose-900 to-rose-800 border-rose-400 ring-4 ring-rose-500/30 scale-[1.03] text-rose-50 shadow-[0_0_20px_rgba(244,63,94,0.3)]";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "from-emerald-950 to-emerald-900 border-emerald-500/50 text-emerald-200/70";
                  } else if (selectedChoice && !isSelected) {
                    baseStyle = "from-slate-900 to-slate-900 border-slate-700 opacity-40 text-slate-500";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative rounded-2xl bg-gradient-to-r ${baseStyle} border-2 p-5 text-left font-medium transition-all min-h-[110px] flex items-center disabled:cursor-not-allowed text-lg`}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {selectedChoice && (
          <div className="animate-fade-in-up max-w-3xl mx-auto mt-6">
            <div className={`rounded-xl border-l-[6px] p-6 text-lg shadow-xl bg-slate-900/95 ${selectedChoice.isCorrect ? 'border-emerald-500 text-emerald-100' : 'border-rose-500 text-rose-100'}`}>
              <span className={`block font-bold text-sm uppercase tracking-widest mb-2 ${selectedChoice.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                {selectedChoice.isCorrect ? 'Profitable Action' : 'Pricing Error'}
              </span> 
              <span className="font-serif italic leading-relaxed">{selectedChoice.outcome}</span>
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 text-white font-bold tracking-wide shadow-[0_5px_20px_rgba(20,184,166,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-lg"
                >
                  <span className="flex items-center gap-2">
                    Next Step <span>→</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationPricingStrategy;
