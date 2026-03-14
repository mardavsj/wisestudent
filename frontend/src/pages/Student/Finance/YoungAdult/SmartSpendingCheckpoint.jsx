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
    prompt: "Before making a purchase, what should you ask yourself first?",
    options: [
      {
        id: "impulse",
        label: "Do I want this right now?",
        reflection: "Asking only if you want something right now can lead to impulse purchases. It's better to consider if you actually need it.",
        isCorrect: false,
      },
      {
        id: "need",
        label: "Do I actually need this?",
        reflection: "Perfect! Asking if you actually need an item helps distinguish between wants and needs, leading to smarter spending decisions.",
        isCorrect: true,
      },
      {
        id: "price",
        label: "Can I afford it?",
        reflection: "While affordability is important, considering whether you need the item is more fundamental to smart spending.",
        isCorrect: false,
      },
      {
        id: "compare",
        label: "Is this cheaper than other options?",
        reflection: "Price comparison is useful, but the more important question is whether you need the item at all.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "How should you approach sales and discounts?",
    options: [
        {
        id: "value",
        label: "Only buy if you were planning to purchase anyway",
        reflection: "Exactly! Taking advantage of sales on items you were already planning to buy is a smart financial strategy.",
        isCorrect: true,
      },
      {
        id: "sale",
        label: "Buy items just because they're on sale",
        reflection: "Buying items just because they're on sale can lead to unnecessary purchases. A good deal on something you don't need is still a bad purchase.",
        isCorrect: false,
      },
      
      {
        id: "urgent",
        label: "Act quickly before the sale ends",
        reflection: "Rushing to buy during sales can lead to poor financial decisions. Take time to consider if you need the item.",
        isCorrect: false,
      },
      {
        id: "more",
        label: "Buy extra items to save more money",
        reflection: "Buying extra items just to save more money can lead to overspending on things you don't need.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "What's the best way to handle peer pressure to spend?",
    options: [
      {
        id: "follow",
        label: "Follow along to fit in with the group",
        reflection: "Following others' spending habits to fit in can lead to financial stress and poor financial decisions.",
        isCorrect: false,
      },
      {
        id: "boundary",
        label: "Set and maintain your spending boundaries",
        reflection: "Perfect! Setting and maintaining spending boundaries helps you make decisions based on your financial goals rather than peer pressure.",
        isCorrect: true,
      },
      {
        id: "compete",
        label: "Spend more to show financial capability",
        reflection: "Competing financially with others often leads to overspending and financial stress.",
        isCorrect: false,
      },
      {
        id: "avoid",
        label: "Avoid all social spending situations",
        reflection: "While setting boundaries is important, avoiding all social spending situations might limit positive experiences.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "How should you handle lifestyle inflation as income increases?",
    options: [
      {
        id: "increase",
        label: "Increase spending proportionally with income",
        reflection: "Increasing spending proportionally with income can lead to lifestyle inflation, where you live paycheck to paycheck despite higher income.",
        isCorrect: false,
      },
      
      {
        id: "upgrade",
        label: "Upgrade lifestyle immediately to enjoy more",
        reflection: "Immediately upgrading your lifestyle when income increases is a classic case of lifestyle inflation, which can trap earners financially.",
        isCorrect: false,
      },
      {
        id: "same",
        label: "Keep spending exactly the same as before",
        reflection: "While controlling spending is good, it's also reasonable to适度ly increase spending on needs while prioritizing savings.",
        isCorrect: false,
      },
      {
        id: "save",
        label: "Increase savings and investments first",
        reflection: "Exactly! Prioritizing savings and investments when income increases helps build wealth and prevents lifestyle inflation.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What should you do when you feel emotional and want to spend?",
    options: [
      {
        id: "retail",
        label: "Go shopping to feel better",
        reflection: "Retail therapy often leads to regrettable purchases and doesn't address the underlying emotions causing the urge to spend.",
        isCorrect: false,
      },
      
      {
        id: "treat",
        label: "Buy something small as a treat for yourself",
        reflection: "Even small emotional purchases can develop into a habit that impacts your finances over time.",
        isCorrect: false,
      },
      {
        id: "wait",
        label: "Wait 24 hours before making any purchase",
        reflection: "Perfect! Waiting 24 hours before making a purchase helps separate emotional reactions from rational financial decisions.",
        isCorrect: true,
      },
      {
        id: "big",
        label: "Plan a big purchase to feel better",
        reflection: "Big purchases driven by emotions often lead to significant financial regret and stress.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const SmartSpendingCheckpoint = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-20";
  const gameContent = t("financial-literacy.young-adult.smart-spending-checkpoint", { returnObjects: true });
  const stages = Array.isArray(gameContent?.stages) ? gameContent.stages : [];
  const totalStages = stages.length;
  const successThreshold = totalStages;
  const reflectionPrompts = Array.isArray(gameContent?.reflectionPrompts) ? gameContent.reflectionPrompts : [];
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
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
    setSelectedReflection(option.reflection); // Set the reflection for the selected option
    setShowFeedback(true); // Show feedback after selection
    setCanProceed(false); // Disable proceeding initially
    
    // Update coins if the answer is correct
    if (option.isCorrect) {
      setCoins(prevCoins => prevCoins + 1);
    }
    
    // Wait for the reflection period before allowing to proceed
    setTimeout(() => {
      setCanProceed(true); // Enable proceeding after showing reflection
    }, 1500); // Wait 1.5 seconds before allowing to proceed
    
    // Handle the final stage separately
    if (currentStage === totalStages - 1) {
      setTimeout(() => {
        const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
        const passed = correctCount === successThreshold;
        setFinalScore(correctCount);
        setCoins(passed ? totalCoins : 0); // Set final coins based on performance
        setShowResult(true);
      }, 5500); // Wait longer before showing final results
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
  const subtitle = t("financial-literacy.young-adult.smart-spending-checkpoint.subtitleProgress", {
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
                    <span>{t("financial-literacy.young-adult.smart-spending-checkpoint.choiceLabel", { id: String(option.id || "").toUpperCase() })}</span>
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
              {/* Automatically advance if we're in the last stage and the timeout has passed */}
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
                  <p className="text-sm text-white/70 mt-2">
                    <strong>Congratulations!</strong> You can now enjoy life without harming your finances.
                  </p>
                  {!hasPassed && (
                    <p className="text-xs text-amber-300">
                      {t("financial-literacy.young-adult.smart-spending-checkpoint.fullRewardHint", { total: totalStages })}
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
            <p className="text-sm text-white/70 mt-2">
              <strong>Congratulations!</strong> You can now enjoy life without harming your finances.
            </p>
            {!hasPassed && (
              <p className="text-xs text-amber-300">
                {t("financial-literacy.young-adult.smart-spending-checkpoint.fullRewardHint", { total: totalStages })}
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

export default SmartSpendingCheckpoint;