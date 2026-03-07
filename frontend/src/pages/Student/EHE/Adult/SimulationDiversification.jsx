import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "Your business currently relies on a single product that generates 90% of your revenue. What is the smartest way to ensure long-term stability?",
    options: [
      {
        id: "opt1",
        text: "Keep focusing solely on this product because it is working now.",
        outcome: "Incorrect. Relying on one source of income is highly risky if market trends change.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Take out a massive loan to advertise the single product even more.",
        outcome: "Incorrect. Increased debt without diversification increases your risk profile.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Start researching and developing complementary products or services.",
        outcome: "Correct! Diversification reduces risk and opens new revenue streams.",
        isCorrect: true,
      },
      {
        id: "opt4",
        text: "Sell the business immediately before things change.",
        outcome: "Incorrect. A growing business should be diversified, not abandoned prematurely.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "A sudden market shift occurs, and demand for your main product drops by 30%. How do you respond?",
    options: [
      {
        id: "opt1",
        text: "Heavily discount the product to maintain sales volume.",
        outcome: "Incorrect. Short-term discounting hurts brand value and profit margins without solving the root problem.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Accelerate the launch of the diversified services you have been testing.",
        outcome: "Correct! Activating your backup revenue streams provides stability during the downturn.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Panic and lay off a large portion of your team.",
        outcome: "Incorrect. Knee-jerk cost cutting damages company culture and operational capacity.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Ignore the shift and hope demand returns to normal.",
        outcome: "Incorrect. Ignoring market shifts usually leads to deeper financial trouble.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "You decide to diversify. Which approach is generally the safest when introducing a new revenue stream?",
    options: [
      {
        id: "opt1",
        text: "Invest all your cash reserves into an entirely unrelated industry.",
        outcome: "Incorrect. Moving into unknown markets requires massive capital and carries the highest risk.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Copy a competitor's completely different product line exactly.",
        outcome: "Incorrect. Copying without a unique value proposition rarely works out long-term.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Launch five new products simultaneously to see what sticks.",
        outcome: "Incorrect. Splitting your focus too widely can drain resources and guarantee failure for all of them.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Offer a new service that naturally complements your existing product and customer base.",
        outcome: "Correct! Leveraging your existing audience with a related offer is a lower-risk diversification strategy.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "Your new secondary product line is starting to gain traction, but it requires significant attention from your core team. What do you do?",
    options: [
      {
        id: "opt1",
        text: "Pull everyone off the original main product to work on the new one.",
        outcome: "Incorrect. Neglecting your primary revenue engine can crash your current business.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Structure the team to dedicate a specialized group to the new product while maintaining the core business.",
        outcome: "Correct! Proper resource allocation ensures both the core and the new streams thrive.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Shut down the new product because it takes too much effort.",
        outcome: "Incorrect. Innovation often requires initial heavy lifting; giving up too early wastes the investment.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Force everyone to work overtime until both are stable.",
        outcome: "Incorrect. Chronic overwork leads to burnout and high turnover.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "A year later, your business has three distinct revenue streams. One is experiencing a slow quarter while the other two are thriving. How do you view this?",
    options: [
      {
        id: "opt3",
        text: "It proves diversification works, as the business remains profitable and stable overall.",
        outcome: "Correct! This is the exact purpose of creating multiple revenue streams: balancing out risks and dips.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "It proves the slow product should be canceled immediately.",
        outcome: "Incorrect. Seasonal or temporary dips are normal; this is why you diversified in the first place.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "It means you failed to manage the business properly.",
        outcome: "Incorrect. It is rare for all parts of a business to peak simultaneously.",
        isCorrect: false,
      },
      
      {
        id: "opt4",
        text: "You should lower prices on the thriving products to help the slow one.",
        outcome: "Incorrect. Punishing successful products to subsidize weak ones makes no strategic sense.",
        isCorrect: false,
      },
    ],
  },
];

const SimulationDiversification = () => {
  const location = useLocation();
  const gameId = "ehe-adults-76";
  const gameData = getGameDataById(gameId);
  const totalStages = SIMULATION_STAGES.length;

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 20;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 40;
  
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
      title="Simulation: Diversification"
      subtitle={
        showResult
          ? "Simulation complete! You successfully managed to build diversified revenue streams."
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

export default SimulationDiversification;
