import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const stages = [
  {
    id: 1,
    prompt: "You want to travel but have no savings. What's wiser?",
    options: [
      {
        id: "borrow",
        label: "Borrow to travel",
        reflection: "Borrowing for travel creates debt that diminishes the enjoyment and financial benefits of your experience.",
        isCorrect: false,
      },
      
      {
        id: "credit",
        label: "Use credit cards and pay later",
        reflection: "Credit card debt for travel accumulates interest and can create long-term financial burden.",
        isCorrect: false,
      },
      {
        id: "save",
        label: "Save first, then travel",
        reflection: "Exactly! Saving first ensures you can fully enjoy your travel experience without financial stress afterward.",
        isCorrect: true,
      },
      {
        id: "skip",
        label: "Skip travel entirely",
        reflection: "While financially safe, completely avoiding experiences can limit personal growth and create regret.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "How should you plan for travel expenses?",
    options: [
      {
        id: "estimate",
        label: "Rough estimate based on dreams",
        reflection: "Vague estimates often lead to budget shortfalls and financial stress during your trip.",
        isCorrect: false,
      },
      {
        id: "research",
        label: "Research actual costs and create savings plan",
        reflection: "Perfect! Detailed research and planning ensure realistic expectations and achievable goals.",
        isCorrect: true,
      },
      {
        id: "spontaneous",
        label: "Save whatever is left over each month",
        reflection: "Passive saving without targets often takes too long and may never accumulate enough for your goals.",
        isCorrect: false,
      },
      {
        id: "luxury",
        label: "Plan for the most expensive options available",
        reflection: "Luxury travel goals without corresponding income often lead to disappointment or financial strain.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "What's the benefit of saving before traveling?",
    options: [
      {
        id: "restriction",
        label: "Creates unnecessary financial restrictions",
        reflection: "Actually, saving creates freedom by eliminating debt and allowing full enjoyment of your experience.",
        isCorrect: false,
      },
      
      {
        id: "delay",
        label: "Unnecessarily delays gratification",
        reflection: "Thoughtful timing often enhances appreciation and makes experiences more meaningful.",
        isCorrect: false,
      },
      {
        id: "missed",
        label: "Causes you to miss opportunities",
        reflection: "Well-timed travel experiences are usually more rewarding than rushed or financially stressful trips.",
        isCorrect: false,
      },
      {
        id: "freedom",
        label: "Provides financial freedom during travel",
        reflection: "Exactly! Having saved money eliminates stress and lets you make spontaneous decisions while traveling.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "How can you make travel savings more achievable?",
    options: [
      {
        id: "everything",
        label: "Cut everything from your budget",
        reflection: "Extreme cuts are unsustainable and can lead to burnout before you even begin traveling.",
        isCorrect: false,
      },
      {
        id: "automate",
        label: "Automate small, consistent savings amounts",
        reflection: "Perfect! Small, regular contributions build substantial amounts over time without major lifestyle disruption.",
        isCorrect: true,
      },
      {
        id: "wait",
        label: "Wait for windfalls or lottery wins",
        reflection: "Relying on chance prevents you from taking control of your financial goals and timeline.",
        isCorrect: false,
      },
      {
        id: "borrow",
        label: "Borrow from multiple sources to speed up travel",
        reflection: "Multiple debts create complex financial obligations that can take years to resolve.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the long-term impact of debt-financed travel?",
    options: [
      {
        id: "burden",
        label: "Creates ongoing financial burden",
        reflection: "Exactly! Debt payments reduce future travel possibilities and limit financial flexibility for years.",
        isCorrect: true,
      },
      {
        id: "enhanced",
        label: "Enhances travel experiences significantly",
        reflection: "Debt actually diminishes experiences by creating ongoing financial stress that continues long after the trip.",
        isCorrect: false,
      },
      
      {
        id: "forgettable",
        label: "Makes experiences less memorable",
        reflection: "Financial stress during and after travel often overshadows positive memories of the actual experience.",
        isCorrect: false,
      },
      {
        id: "motivation",
        label: "Provides motivation to earn more money",
        reflection: "While debt might motivate some, it more commonly creates stress that impedes rather than enhances productivity.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const TravelVsSavings = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-32";
  const gameContent = t("financial-literacy.young-adult.travel-vs-savings", { returnObjects: true });
  const stages = Array.isArray(gameContent?.stages) ? gameContent.stages : [];
  const totalStages = stages.length;
  const successThreshold = totalStages;
  const reflectionPrompts = Array.isArray(gameContent?.reflectionPrompts) ? gameContent.reflectionPrompts : [];
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 10;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 10;
  const totalXp = gameData?.xp || location.state?.totalXp || 20;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [history, setHistory] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [canProceed, setCanProceed] = useState(false);
  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = stages[currentStage];
    const updatedHistory = [
      ...history,
      { stageId: currentStageData.id, isCorrect: option.isCorrect },
    ];
    setHistory(updatedHistory);
    setSelectedOption(option.id);
    setSelectedReflection(option.reflection);
    setShowFeedback(true);
    setCanProceed(false);
    
    if (option.isCorrect) {
      setCoins(prevCoins => prevCoins + 1);
    }
    
    setTimeout(() => {
      setCanProceed(true);
    }, 1500);
    
    if (currentStage === totalStages - 1) {
      setTimeout(() => {
        const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
        const passed = correctCount === successThreshold;
        setFinalScore(correctCount);
        setCoins(passed ? totalCoins : 0);
        setShowResult(true);
      }, 5500);
    }
    
    if (option.isCorrect) {
      showCorrectAnswerFeedback(currentStageData.reward, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
  };

  const handleRetry = () => {
    resetFeedback();
    setCurrentStage(0);
    setHistory([]);
    setSelectedOption(null);
    setCoins(0);
    setFinalScore(0);
    setShowResult(false);
  };
  const subtitle = t("financial-literacy.young-adult.travel-vs-savings.subtitleProgress", {
    current: Math.min(currentStage + 1, totalStages),
    total: totalStages,
  });
  const stage = stages[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title={gameContent?.title}
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={totalStages}
      currentLevel={Math.min(currentStage + 1, totalStages)}
      totalLevels={totalStages}
      gameId={gameId}
      gameType="finance"
      showGameOver={showResult}
      showConfetti={showResult && hasPassed}
      shouldSubmitGameCompletion={hasPassed}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-5 text-white">
        <div className="bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4 text-sm uppercase tracking-[0.3em] text-white/60">
            <span>{gameContent?.scenarioLabel}</span>
            <span>{gameContent?.scenarioValue}</span>
          </div>
          <p className="text-lg text-white/90 mb-6">{stage?.prompt}</p>
          <div className="grid grid-cols-2 gap-4">
            {(stage?.options || []).map((option) => {
              const isSelected = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option)}
                  disabled={!!selectedOption}
                  className={`rounded-2xl border-2 p-5 text-left transition ${isSelected
                      ? option.isCorrect
                        ? "border-emerald-400 bg-emerald-500/20"
                        : "border-rose-400 bg-rose-500/10"
                      : "border-white/30 bg-white/5 hover:border-white/60 hover:bg-white/10"
                    }`}
                >
                  <div className="flex justify-between items-center mb-2 text-sm text-white/70">
                    <span>{t("financial-literacy.young-adult.travel-vs-savings.choiceLabel", { id: String(option.id || "").toUpperCase() })}</span>
                  </div>
                  <p className="text-white font-semibold">{option.label}</p>
                </button>
              );
            })}
          </div>
          {(showResult || showFeedback) && (
            <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
              <h4 className="text-lg font-semibold text-white">{gameContent?.reflectionTitle}</h4>
              {selectedReflection && (
                <div className="max-h-24 overflow-y-auto pr-2">
                  <p className="text-sm text-white/90">{selectedReflection}</p>
                </div>
              )}
              {showFeedback && !showResult && (
                <div className="mt-4 flex justify-center">
                  {canProceed ? (
                    <button
                      onClick={() => {
                        if (currentStage < totalStages - 1) {
                          setCurrentStage((prev) => prev + 1);
                          setSelectedOption(null);
                          setSelectedReflection(null);
                          setShowFeedback(false);
                          setCanProceed(false);
                        }
                      }}
                      className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-6 font-semibold shadow-lg hover:opacity-90"
                    >
                      Continue
                    </button>
                  ) : (
                    <div className="py-2 px-6 text-white font-semibold">{gameContent?.readingLabel}</div>
                  )}
                </div>
              )}
              {!showResult && currentStage === totalStages - 1 && canProceed && (
                <div className="mt-4 flex justify-center">
                  
                </div>
              )}
              {showResult && (
                <>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    {reflectionPrompts.map((prompt) => (
                      <li key={prompt}>{prompt}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-white/70">
                    {gameContent?.skillUnlockedLabel} <strong>{gameContent?.skillName}</strong>
                  </p>
                  {!hasPassed && (
                    <p className="text-xs text-amber-300">
                      {t("financial-literacy.young-adult.travel-vs-savings.fullRewardHint", { total: totalStages })}
                    </p>
                  )}
                  {!hasPassed && (
                    <button
                      onClick={handleRetry}
                      className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 font-semibold shadow-lg hover:opacity-90"
                    >
                      Try Again
                    </button>
                  )}
                </>
              )}
            </div>
          )}
          
        </div>
        {showResult && (
          <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
            <h4 className="text-lg font-semibold text-white">{gameContent?.reflectionPromptsTitle}</h4>
            <ul className="text-sm list-disc list-inside space-y-1">
              {reflectionPrompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
            <p className="text-sm text-white/70">
              {gameContent?.skillUnlockedLabel} <strong>{gameContent?.skillName}</strong>
            </p>
            {!hasPassed && (
              <p className="text-xs text-amber-300">
                {t("financial-literacy.young-adult.travel-vs-savings.fullRewardHint", { total: totalStages })}
              </p>
            )}
            {!hasPassed && (
              <button
                onClick={handleRetry}
                className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 font-semibold shadow-lg hover:opacity-90"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TravelVsSavings;