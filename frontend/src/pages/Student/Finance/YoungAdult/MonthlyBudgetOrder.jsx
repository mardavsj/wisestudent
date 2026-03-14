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
    prompt: "What should be planned first in a budget?",
    options: [
      {
        id: "entertainment",
        label: "Entertainment",
        reflection: "Entertainment should not be the first priority in a budget. Essential needs and savings should come first.",
        isCorrect: false,
      },
      {
        id: "essentials",
        label: "Essentials and savings",
        reflection: "Exactly! Essentials (like rent, food, utilities) and savings should be planned first in any budget to ensure financial stability.",
        isCorrect: true,
      },
      {
        id: "wants",
        label: "Wants and desires",
        reflection: "Wants and desires should be planned for after essential needs and savings have been secured in your budget.",
        isCorrect: false,
      },
      {
        id: "luxury",
        label: "Luxury items",
        reflection: "Luxury items are not essential and should only be budgeted for after all essential needs and savings have been planned.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "Why is it important to prioritize essentials in a budget?",
    options: [
     
      {
        id: "flexibility",
        label: "It provides more spending flexibility",
        reflection: "Prioritizing essentials actually reduces flexibility in the short term but provides long-term financial security.",
        isCorrect: false,
      },
      {
        id: "savings",
        label: "It eliminates the need for savings",
        reflection: "Prioritizing essentials doesn't eliminate the need for savings - savings should be planned alongside essentials.",
        isCorrect: false,
      },
      {
        id: "debt",
        label: "It leads to more debt",
        reflection: "Prioritizing essentials actually helps avoid debt by ensuring you cover your necessary expenses first.",
        isCorrect: false,
      },
       {
        id: "stability",
        label: "Priorities protect stability",
        reflection: "Perfect! Prioritizing essentials protects your financial stability by ensuring your basic needs are always covered.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "What happens if you budget for wants before essentials?",
    options: [
      
      {
        id: "savings",
        label: "Savings will increase automatically",
        reflection: "Budgeting for wants first often leaves less money available for essentials and savings, not more.",
        isCorrect: false,
      },
      {
        id: "stability",
        label: "Financial stability improves",
        reflection: "Budgeting for wants before essentials actually reduces financial stability by risking that basic needs won't be met.",
        isCorrect: false,
      },
      {
        id: "shortage",
        label: "Essential needs might not be covered",
        reflection: "Exactly! Budgeting for wants before essentials can lead to shortages in covering your basic needs and financial instability.",
        isCorrect: true,
      },
      {
        id: "debt",
        label: "It prevents all debt",
        reflection: "Budgeting for wants first can actually lead to debt if you don't have enough left for essentials.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "How should savings be positioned in a monthly budget?",
    options: [
      
      {
        id: "leftover",
        label: "With whatever money is left over",
        reflection: "Saving with leftover money often means little or nothing gets saved. Savings should be planned first.",
        isCorrect: false,
      },
      {
        id: "payment",
        label: "As a non-negotiable payment to yourself",
        reflection: "Perfect! Treating savings as a non-negotiable payment to yourself ensures it's prioritized alongside other essentials.",
        isCorrect: true,
      },
      {
        id: "optional",
        label: "As an optional expense",
        reflection: "Savings should not be optional in a budget. It's a critical component for financial security.",
        isCorrect: false,
      },
      {
        id: "last",
        label: "Planned last in the budget",
        reflection: "Savings should be planned first, not last, to ensure it actually happens consistently.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What is the recommended order for budget allocation?",
    options: [
      {
        id: "correct",
        label: "Essentials, savings, then wants",
        reflection: "Exactly! The recommended order is to budget for essentials first, then savings, and finally wants with any remaining money.",
        isCorrect: true,
      },
      {
        id: "wrong1",
        label: "Wants, essentials, then savings",
        reflection: "This order puts wants first, which can lead to insufficient funds for essentials and savings.",
        isCorrect: false,
      },
      {
        id: "wrong2",
        label: "Savings, wants, then essentials",
        reflection: "While savings are important, essentials must come first as they are immediate needs that must be met.",
        isCorrect: false,
      },
      {
        id: "wrong3",
        label: "Equal amounts to each category",
        reflection: "Budgeting equal amounts to each category doesn't account for the varying importance of different expenses.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const MonthlyBudgetOrder = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-23";
  const gameContent = t("financial-literacy.young-adult.monthly-budget-order", { returnObjects: true });
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
  const subtitle = t("financial-literacy.young-adult.monthly-budget-order.subtitleProgress", {
    current: Math.min(currentStage + 1, totalStages),
    total: totalStages,
  });
  const stage = stages[Math.min(currentStage, Math.max(totalStages - 1, 0))];
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
                    <span>{t("financial-literacy.young-adult.monthly-budget-order.choiceLabel", { id: String(option.id || "").toUpperCase() })}</span>
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
                  {!hasPassed && (
                    <p className="text-xs text-amber-300">
                      {t("financial-literacy.young-adult.monthly-budget-order.fullRewardHint", { total: totalStages })}
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
                {t("financial-literacy.young-adult.monthly-budget-order.fullRewardHint", { total: totalStages })}
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

export default MonthlyBudgetOrder;