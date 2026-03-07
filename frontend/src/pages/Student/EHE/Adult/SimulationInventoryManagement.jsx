import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "A major seasonal holiday is approaching, and you feel optimistic about a surge in sales. How do you prepare your inventory?",
    options: [
      {
        id: "opt1",
        text: "Over-purchase stock immediately to ensure you don't run out.",
        outcome: "Incorrect. Buying too much stock based purely on optimism can lead to massive unsold inventory and cash flow issues.",
        isCorrect: false,
      },
     
      {
        id: "opt3",
        text: "Don't order anything extra. Just sell what you currently have.",
        outcome: "Incorrect. Failing to prepare for peak seasons results in lost revenue and disappointed customers.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Borrow heavily to buy out your supplier's entire warehouse.",
        outcome: "Incorrect. Taking on huge debt for unconfirmed demand is a reckless gamble.",
        isCorrect: false,
      },
       {
        id: "opt2",
        text: "Evaluate potential cash blockage and storage costs before placing orders.",
        outcome: "Correct! Calculating the financial impact of holding inventory prevents tying up crucial capital.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "You need to determine exactly how much to order. What method do you use to forecast demand?",
    options: [
      {
        id: "opt1",
        text: "Guess based on how you feel the market is doing right now.",
        outcome: "Incorrect. Gut feelings are notoriously inaccurate for inventory management.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Analyze historical sales data from previous similar seasons and adjust for current trends.",
        outcome: "Correct! Data-driven forecasting is the most reliable way to optimize inventory levels.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Ask your competitors how much they are ordering.",
        outcome: "Incorrect. Competitors have different capacities, target audiences, and financial situations.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Order exactly double what you sold last month.",
        outcome: "Incorrect. Arbitrary multipliers ignore actual seasonal patterns and market realities.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "Halfway through the season, a key product is selling much faster than expected and you are running low. What do you do?",
    options: [
      {
        id: "opt4",
        text: "Calculate a precise reorder point weighing expedited shipping costs against lost sales profit.",
        outcome: "Correct! A mathematical approach ensures you only restock if it makes financial sense.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Panic order a massive quantity via expensive expedited shipping.",
        outcome: "Incorrect. The shipping costs will eliminate your profit margin on those items.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Tell customers the item is discontinued so they buy something else.",
        outcome: "Incorrect. Lying to customers destroys trust and damages your brand.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Do nothing and just let it sell out completely.",
        outcome: "Incorrect. You are actively missing out on capitalized profit from high-demand items.",
        isCorrect: false,
      },
      
    ],
  },
  {
    id: 4,
    prompt: "The season ends, and despite good planning, you have 15% of a trendy seasonal item left over. What is your strategy?",
    options: [
      {
        id: "opt1",
        text: "Keep it in the warehouse at full price until next year.",
        outcome: "Incorrect. Storing out-of-season inventory ties up space and capital, and trends change.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Throw the remaining inventory in the trash to clear space immediately.",
        outcome: "Incorrect. This is a complete write-off and terrible for both profits and the environment.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Implement a markdown strategy to liquidate the stock and recover your cash.",
        outcome: "Correct! Recovering cash flow is often more important than protecting margins on dying inventory.",
        isCorrect: true,
      },
      {
        id: "opt4",
        text: "Force your employees to buy the overstock.",
        outcome: "Incorrect. This is highly unethical and illegal in many jurisdictions.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "Moving forward, you want to avoid this situation entirely. What inventory system do you implement?",
    options: [
      {
        id: "opt1",
        text: "Stop selling seasonal products entirely to avoid any risk.",
        outcome: "Incorrect. You are giving up a major revenue source instead of managing the risk.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Implement a Just-In-Time (JIT) or automated inventory tracking system.",
        outcome: "Correct! Better systems lead to tighter inventory control, less waste, and better cash flow.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Go back to keeping track of stock on a piece of scrap paper.",
        outcome: "Incorrect. Manual tracking is highly prone to errors and doesn't scale as your business grows.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Fire your supplier and build your own factory.",
        outcome: "Incorrect. This is an extreme and costly overreaction to a common business challenge.",
        isCorrect: false,
      },
    ],
  },
];

const SimulationInventoryManagement = () => {
  const location = useLocation();
  const gameId = "ehe-adults-59";
  const gameData = getGameDataById(gameId);
  const totalStages = SIMULATION_STAGES.length;

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 15;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 30;

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
      title="Simulation: Inventory Management"
      subtitle={
        showResult
          ? "Simulation complete! You successfully managed inventory and cash flow."
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
                {selectedChoice.isCorrect ? 'Professional Move' : 'Career Misstep'}
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

export default SimulationInventoryManagement;
