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
    prompt: "Food delivery every day is:",
    options: [
      {
        id: "convenience",
        label: "A convenience want",
        reflection: "Exactly! Food delivery provides convenience and time-saving benefits, making it a want rather than a need.",
        isCorrect: true,
      },
      {
        id: "need",
        label: "A need for survival",
        reflection: "Daily food delivery is a convenience service, not a survival necessity - basic nutrition can be achieved through cooking.",
        isCorrect: false,
      },
      
      {
        id: "investment",
        label: "An investment in health",
        reflection: "Delivery food is often less healthy than home-cooked meals and represents spending rather than health investment.",
        isCorrect: false,
      },
      {
        id: "luxury",
        label: "A luxury lifestyle choice",
        reflection: "While convenient, daily delivery is more accurately classified as a recurring convenience expense rather than luxury.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "How should you evaluate convenience spending?",
    options: [
      {
        id: "ignore",
        label: "Ignore the costs completely",
        reflection: "Ignoring convenience costs leads to financial surprise and budget overruns that could be prevented.",
        isCorrect: false,
      },
      
      {
        id: "maximize",
        label: "Maximize all convenience services",
        reflection: "Maximum convenience often creates unnecessary expenses without proportional value or life improvement.",
        isCorrect: false,
      },
      {
        id: "eliminate",
        label: "Eliminate all convenience spending",
        reflection: "Complete elimination may sacrifice valuable time savings that could be better invested in income-generating activities.",
        isCorrect: false,
      },
      {
        id: "calculate",
        label: "Calculate time vs money trade-offs",
        reflection: "Perfect! Evaluating whether convenience costs are worth the time saved helps make intentional spending decisions.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "What's the hidden cost of daily conveniences?",
    options: [
      {
        id: "time",
        label: "Time saved is worth any price",
        reflection: "Time has value, but paying excessive amounts for convenience can create financial stress that negates time benefits.",
        isCorrect: false,
      },
      
      {
        id: "freedom",
        label: "They increase financial freedom",
        reflection: "Regular convenience spending typically reduces rather than increases financial flexibility and future choices.",
        isCorrect: false,
      },
      {
        id: "accumulation",
        label: "Small daily costs accumulate significantly",
        reflection: "Exactly! Daily convenience expenses compound over time, creating substantial financial impact that's easy to overlook.",
        isCorrect: true,
      },
      {
        id: "necessity",
        label: "They become financial necessities",
        reflection: "Conveniences rarely become true necessities - they're habitual spending that can usually be reduced or eliminated.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "How can you manage convenience spending wisely?",
    options: [
      {
        id: "unlimited",
        label: "Use convenience services unlimitedly",
        reflection: "Unlimited use creates habitual spending that becomes financially burdensome and difficult to control.",
        isCorrect: false,
      },
      {
        id: "budget",
        label: "Set specific budgets for convenience categories",
        reflection: "Perfect! Budgeting convenience spending maintains awareness while allowing reasonable enjoyment of time-saving services.",
        isCorrect: true,
      },
      {
        id: "occasional",
        label: "Use only during special occasions",
        reflection: "While restrictive, this approach may eliminate beneficial time savings that could enhance productivity in other areas.",
        isCorrect: false,
      },
      {
        id: "substitute",
        label: "Find free convenience alternatives always",
        reflection: "Free alternatives often don't exist or provide inferior quality, potentially wasting more time than they save.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the relationship between convenience and financial health?",
    options: [
       {
        id: "balance",
        label: "Strategic convenience can enhance productivity",
        reflection: "Exactly! Well-chosen convenience services can free time for income-generating activities or skill development.",
        isCorrect: true,
      },
      {
        id: "improves",
        label: "More convenience always improves finances",
        reflection: "Increased convenience typically costs more money, creating financial drag rather than improvement.",
        isCorrect: false,
      },
     
      {
        id: "harmful",
        label: "All convenience spending is financially harmful",
        reflection: "Blanket condemnation ignores that some convenience investments actually improve efficiency and life quality.",
        isCorrect: false,
      },
      {
        id: "neutral",
        label: "Convenience has no financial impact",
        reflection: "Convenience services always involve direct costs and indirect effects on spending habits and financial behavior.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const ConvenienceSpending = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-34";
  const gameContent = t("financial-literacy.young-adult.convenience-spending", { returnObjects: true });
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
  const subtitle = t("financial-literacy.young-adult.convenience-spending.subtitleProgress", {
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
                    <span>{t("financial-literacy.young-adult.convenience-spending.choiceLabel", { id: String(option.id || "").toUpperCase() })}</span>
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
                      {t("financial-literacy.young-adult.convenience-spending.fullRewardHint", { total: totalStages })}
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
                {t("financial-literacy.young-adult.convenience-spending.fullRewardHint", { total: totalStages })}
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

export default ConvenienceSpending;