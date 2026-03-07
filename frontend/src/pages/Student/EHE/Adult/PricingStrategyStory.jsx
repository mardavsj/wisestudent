import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PRICING_STRATEGY_STAGES = [
  {
    id: 1,
    prompt: "You are launching a new product. To attract a massive customer base quickly, you consider setting the price significantly lower than your actual production cost. What is the immediate risk of this strategy?",
    options: [
      {
        id: "opt1",
        text: "You will become an instant millionaire because everyone will buy it",
        outcome: "Selling below cost means every sale actually loses you money, not makes you money.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Your competitors will immediately close their businesses and surrender to you",
        outcome: "Competitors may just wait for you to run out of money rather than closing down.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "You will incur a financial loss on every single unit sold",
        outcome: "Correct! Selling below your manufacturing and operational costs guarantees immediate losses.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "Despite the losses, you believe that once you capture a huge market share, you can just double the price later. How do customers usually react to sudden, massive price hikes?",
    options: [
      {
        id: "opt1",
        text: "They feel betrayed and many will abandon your product for competitors",
        outcome: "Exactly! Customers acquired solely on cheap pricing have no loyalty to your brand.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "They are happy to pay double to support your growing business",
        outcome: "Customers rarely prefer to pay more for the exact same product unless exceptional value is added.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "They will buy even more units before the price goes up again",
        outcome: "A temporary spike before a hike is possible, but the long-term churn will be devastating.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "You have been selling below cost for six months. Your customer base is huge, but your bank account is almost empty. What is this business state called?",
    options: [
      {
        id: "opt1",
        text: "Long-term stable growth",
        outcome: "Growth without profit or capital is a ticking time bomb, not stability.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "A highly successful charity organization",
        outcome: "You intended to run a profitable business, so this state is a failure of your model.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Unsustainable cash burn",
        outcome: "Spot on! Running out of cash is the leading cause of business failure, no matter how many users you have.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "If setting a price lower than cost is dangerous, what is generally a healthier pricing strategy for a sustainable business?",
    options: [
      {
        id: "opt1",
        text: "Charge whatever you want and ignore the market entirely",
        outcome: "Ignoring the market ensures nobody will buy your product.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Ensure the price covers all costs while providing a sustainable profit margin",
        outcome: "Perfect! A healthy margin allows the business to survive, invest, and grow.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Change the price randomly every day to keep customers guessing",
        outcome: "Inconsistency destroys trust and makes revenue forecasting impossible.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "Reflecting on your journey, will persistently setting a price below cost lead to stable growth or financial ruin long-term?",
    options: [
      {
        id: "opt2",
        text: "Financial ruin, because a business cannot survive without positive cash flow and profit",
        outcome: "Exactly! Profit is the oxygen of any business. Without it, the business dies.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Stable growth, because being cheap is the only way to win in business",
        outcome: "Competing only on price is a race to the bottom where everyone loses.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Neither, because banks will always lend you unlimited money",
        outcome: "Banks and investors only fund businesses that have a clear, realistic path to profitability.",
        isCorrect: false,
      },
    ],
  },
];

const PricingStrategyStory = () => {
  const location = useLocation();
  const gameId = "ehe-adults-45";
  const gameData = getGameDataById(gameId);
  const totalStages = PRICING_STRATEGY_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 10;
  const totalXp = gameData?.xp || location.state?.totalXp || 20;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = PRICING_STRATEGY_STAGES[currentStageIndex];

  const handleChoice = (option) => {
    if (selectedChoice) return;
    setSelectedChoice(option);
    if (option.isCorrect) {
      setScore((s) => s + 1);
      showCorrectAnswerFeedback(1, true);
    }
  };

  const handleNext = () => {
    if (currentStageIndex === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrentStageIndex((i) => i + 1);
    }
    setSelectedChoice(null);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Pricing Strategy Story"
      subtitle={
        showResult
          ? "Well done! You have learned the importance of sustainable pricing."
          : `Question ${currentStageIndex + 1} of ${totalStages}`
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
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 to-indigo-600"></div>

              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8 border-b border-slate-700 pb-4">
                <span>Question {progressLabel}</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Score: {score}/{totalStages}
                </span>
              </div>

              <div className="text-center mb-10">
                <span className="inline-block py-1 px-3 rounded-full bg-violet-900/50 text-violet-300 text-xs font-bold uppercase tracking-wider mb-4 border border-violet-500/30">
                  Business Scenario
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
                                {option.isCorrect ? '✅ Correct' : '❌ Incorrect'}
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

              {selectedChoice && (
                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg shadow-violet-500/25 transition-all duration-300 hover:scale-105 hover:shadow-violet-500/40"
                  >
                    {currentStageIndex === totalStages - 1 ? "See Results" : "Next →"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PricingStrategyStory;
