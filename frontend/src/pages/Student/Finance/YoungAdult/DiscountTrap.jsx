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
    prompt: "A discount tempts you to buy something unnecessary. What matters?",
    options: [
      {
        id: "discount",
        label: "Discount size and savings",
        reflection: "Discount size is irrelevant if you don't actually need or want the item - you're still spending money unnecessarily.",
        isCorrect: false,
      },
      {
        id: "need",
        label: "Actual need for the item",
        reflection: "Exactly! Real need should drive purchases, not artificial savings from discounts on unwanted items.",
        isCorrect: true,
      },
      {
        id: "trend",
        label: "Current popularity trends",
        reflection: "Trends fade quickly and following them often leads to regrettable purchases that don't serve your actual needs.",
        isCorrect: false,
      },
      {
        id: "collection",
        label: "Completing your collection",
        reflection: "Collection completion often becomes an expensive hobby that creates clutter rather than genuine value or satisfaction.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "How do retailers use discounts to influence behavior?",
    options: [
      {
        id: "psychology",
        label: "Create urgency and emotional triggers",
        reflection: "Perfect! Discounts exploit psychological biases to encourage purchases that might not align with rational financial decisions.",
        isCorrect: true,
      },
      {
        id: "honest",
        label: "They honestly pass savings to customers",
        reflection: "While some savings are real, discount psychology primarily aims to increase overall spending rather than genuine savings.",
        isCorrect: false,
      },
      
      {
        id: "quality",
        label: "Highlight product quality improvements",
        reflection: "Quality improvements are secondary to the primary goal of moving inventory and increasing customer spending through psychological triggers.",
        isCorrect: false,
      },
      {
        id: "competition",
        label: "Match competitor pricing fairly",
        reflection: "Competitive pricing is business strategy, but discount psychology specifically targets emotional rather than rational purchasing decisions.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "What's the real cost of discount-driven purchases?",
    options: [
      {
        id: "savings",
        label: "Just the money saved from discount",
        reflection: "The real cost includes the full purchase price plus opportunity cost of what else that money could accomplish.",
        isCorrect: false,
      },
      
      {
        id: "clutter",
        label: "Storage space and organization",
        reflection: "Physical clutter is a real cost, but the fundamental issue is the opportunity cost of alternative uses for those resources.",
        isCorrect: false,
      },
      {
        id: "regret",
        label: "Potential buyer's remorse",
        reflection: "Regret is common but secondary to the primary cost of lost opportunities for more valuable uses of your money.",
        isCorrect: false,
      },
      {
        id: "opportunity",
        label: "Opportunity cost of better uses",
        reflection: "Exactly! Every unnecessary purchase represents foregone opportunities for savings, investments, or meaningful experiences.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "How should you evaluate discount offers?",
    options: [
      {
        id: "automatic",
        label: "Buy anything with good discounts",
        reflection: "Automatic purchasing creates expensive habits and often leads to accumulating items you don't truly need or want.",
        isCorrect: false,
      },
     
      {
        id: "comparison",
        label: "Compare all available discounts",
        reflection: "Extensive comparison shopping for discounts can consume valuable time without addressing whether purchases align with your needs.",
        isCorrect: false,
      },
       {
        id: "criteria",
        label: "Apply need-based criteria first",
        reflection: "Perfect! Evaluate whether you actually need or want the item before considering any discount - the discount should be irrelevant.",
        isCorrect: true,
      },
      {
        id: "timing",
        label: "Wait for better discount timing",
        reflection: "Waiting for perfect timing often means missing genuine needs or creating artificial urgency around unnecessary purchases.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the relationship between discounts and financial discipline?",
    options: [
      {
        id: "help",
        label: "Discounts help maintain discipline",
        reflection: "Actually, discounts often undermine discipline by creating rationalizations for purchases that don't align with financial goals.",
        isCorrect: false,
      },
      {
        id: "challenge",
        label: "Discounts test self-control",
        reflection: "Exactly! Discount offers present constant temptation that requires strong financial discipline to evaluate rationally rather than emotionally.",
        isCorrect: true,
      },
      {
        id: "irrelevant",
        label: "Discounts are financially irrelevant",
        reflection: "While the items themselves might be irrelevant, the psychological impact of discount marketing significantly affects spending behavior.",
        isCorrect: false,
      },
      {
        id: "opportunity",
        label: "Discounts create saving opportunities",
        reflection: "True saving opportunities exist, but they require distinguishing between genuine needs and manufactured wants enhanced by discounts.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const DiscountTrap = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-37";
  const gameContent = t("financial-literacy.young-adult.discount-trap", { returnObjects: true });
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
  const subtitle = t("financial-literacy.young-adult.discount-trap.subtitleProgress", {
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
                    <span>{t("financial-literacy.young-adult.discount-trap.choiceLabel", { id: String(option.id || "").toUpperCase() })}</span>
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
                      {t("financial-literacy.young-adult.discount-trap.fullRewardHint", { total: totalStages })}
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
                {t("financial-literacy.young-adult.discount-trap.fullRewardHint", { total: totalStages })}
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

export default DiscountTrap;