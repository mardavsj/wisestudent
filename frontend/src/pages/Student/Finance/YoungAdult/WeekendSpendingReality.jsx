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
    prompt: "Frequent weekend outings lead to:",
    options: [
      {
        id: "noimpact",
        label: "No impact on finances",
        reflection: "Even small frequent expenses add up significantly over time, creating a substantial impact on your budget.",
        isCorrect: false,
      },
      
      {
        id: "savings",
        label: "Increased savings rate",
        reflection: "Frequent spending typically reduces savings rather than increasing them, as money is directed toward expenses instead of savings.",
        isCorrect: false,
      },
      {
        id: "imbalance",
        label: "Budget imbalance over time",
        reflection: "Perfect! Frequent weekend spending, though small each time, accumulates and creates budget imbalances over time.",
        isCorrect: true,
      },
      {
        id: "wealth",
        label: "Long-term wealth building",
        reflection: "Regular spending without planning tends to hinder wealth building rather than contribute to it.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "Why do weekend outings seem affordable individually?",
    options: [
     
      {
        id: "free",
        label: "They're mostly free activities",
        reflection: "Most weekend outings involve some cost, whether for food, transport, or entertainment, so they're rarely completely free.",
        isCorrect: false,
      },
      {
        id: "rich",
        label: "I'm richer than I think",
        reflection: "The affordability of repeated outings depends on your income and overall budget, not a sudden increase in wealth.",
        isCorrect: false,
      },
      {
        id: "invisible",
        label: "Costs are invisible to me",
        reflection: "Outing costs are usually quite visible at the time of purchase, though their cumulative effect over time might be overlooked.",
        isCorrect: false,
      },
       {
        id: "small",
        label: "Each outing costs little in isolation",
        reflection: "Exactly! Individual outings seem affordable, but when repeated regularly they create a significant financial impact.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "What's the best approach to weekend spending?",
    options: [
      {
        id: "plan",
        label: "Plan and budget for weekend activities",
        reflection: "Perfect! Planning ensures your weekend spending fits within your overall financial goals and budget.",
        isCorrect: true,
      },
      {
        id: "impulse",
        label: "Spend impulsively each weekend",
        reflection: "Impulse weekend spending often leads to budget overruns and financial stress when costs accumulate unexpectedly.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore weekend spending in budget",
        reflection: "Ignoring planned expenses like weekend outings creates an inaccurate budget and likely leads to overspending.",
        isCorrect: false,
      },
      {
        id: "prohibit",
        label: "Prohibit all weekend spending",
        reflection: "Completely prohibiting weekend spending is unsustainable and may lead to financial rebellion later.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "How do frequent small spends affect your finances?",
    options: [
      
      {
        id: "disappear",
        label: "They disappear from your account",
        reflection: "Money spent doesn't disappear - it goes to vendors, and the cumulative amount can be substantial.",
        isCorrect: false,
      },
      {
        id: "accumulate",
        label: "Repeated small spends add up",
        reflection: "Exactly! Small amounts spent frequently accumulate into significant sums over weeks, months, and years.",
        isCorrect: true,
      },
      {
        id: "compound",
        label: "They earn compound interest",
        reflection: "Spent money doesn't earn interest - only saved money earns interest and benefits from compounding.",
        isCorrect: false,
      },
      {
        id: "multiply",
        label: "They multiply magically",
        reflection: "Spending doesn't create more money - it reduces your available funds by the amount spent.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What should you do before planning weekend activities?",
    options: [
     
      {
        id: "ignore",
        label: "Ignore your budget and spend freely",
        reflection: "Ignoring your budget for weekend activities can lead to overspending and financial stress.",
        isCorrect: false,
      },
      {
        id: "guess",
        label: "Guess how much you can afford",
        reflection: "Guessing can lead to inaccurate estimates and potential overspending. Budgeting provides accurate figures.",
        isCorrect: false,
      },
       {
        id: "budget",
        label: "Check your budget for available funds",
        reflection: "Perfect! Checking your budget ensures weekend spending aligns with your financial goals and doesn't cause imbalances.",
        isCorrect: true,
      },
      {
        id: "borrow",
        label: "Plan to borrow money for activities",
        reflection: "Borrowing for weekend activities can lead to debt accumulation and interest charges, making activities more expensive.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const WeekendSpendingReality = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-13";
  const gameContent = t("financial-literacy.young-adult.weekend-spending-reality", { returnObjects: true });
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
  const subtitle = t("financial-literacy.young-adult.weekend-spending-reality.subtitleProgress", {
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
                    <span>{t("financial-literacy.young-adult.weekend-spending-reality.choiceLabel", { id: String(option.id || "").toUpperCase() })}</span>
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
                      {t("financial-literacy.young-adult.weekend-spending-reality.fullRewardHint", { total: totalStages })}
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
                {t("financial-literacy.young-adult.weekend-spending-reality.fullRewardHint", { total: totalStages })}
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

export default WeekendSpendingReality;