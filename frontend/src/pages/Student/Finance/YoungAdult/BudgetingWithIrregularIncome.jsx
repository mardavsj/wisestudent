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
    prompt: "If income is irregular, what helps?",
    options: [
      {
        id: "spend",
        label: "Spend everything when earned",
        reflection: "Spending irregular income immediately creates financial instability and stress during lean periods.",
        isCorrect: false,
      },
      {
        id: "minimum",
        label: "Base budget on minimum expected income",
        reflection: "Exactly! Conservative planning with minimum income expectations provides stability and reduces stress.",
        isCorrect: true,
      },
      {
        id: "average",
        label: "Budget based on average income",
        reflection: "While averages seem logical, they can lead to overspending during low-income months.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore budgeting and wing it",
        reflection: "Without planning, irregular income leads to financial chaos and missed opportunities for saving.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "How should you handle high-income months?",
    options: [
      {
        id: "save",
        label: "Save excess for low-income months",
        reflection: "Perfect! Banking surplus income creates a buffer that smooths out income variations.",
        isCorrect: true,
      },
      {
        id: "luxury",
        label: "Upgrade lifestyle permanently",
        reflection: "Permanent lifestyle upgrades based on occasional high income create unsustainable expectations.",
        isCorrect: false,
      },
      
      {
        id: "invest",
        label: "Invest everything in high-risk opportunities",
        reflection: "High-risk investments with irregular income create dangerous financial volatility.",
        isCorrect: false,
      },
      {
        id: "debt",
        label: "Pay down all debt immediately",
        reflection: "While debt reduction is good, it shouldn't come at the expense of building income smoothing buffers.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "What's the best approach for irregular income tracking?",
    options: [
      {
        id: "separate",
        label: "Keep business and personal finances separate",
        reflection: "Essential! Separation provides clear visibility into true personal cash flow and spending patterns.",
        isCorrect: false,
      },
      
      {
        id: "last",
        label: "Base everything on last month's income",
        reflection: "Last month's income may not represent typical earning patterns and can lead to poor planning.",
        isCorrect: false,
      },
      {
        id: "guess",
        label: "Estimate based on gut feeling",
        reflection: "Intuitive estimates are unreliable and often lead to either overly conservative or risky financial decisions.",
        isCorrect: false,
      },
      {
        id: "rolling",
        label: "Use rolling 3-month average for planning",
        reflection: "Excellent! Rolling averages smooth out fluctuations and provide more realistic planning benchmarks.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "How much should you save from irregular income?",
    options: [
      {
        id: "zero",
        label: "Zero - live paycheck to paycheck",
        reflection: "Living without buffers creates extreme financial stress during income gaps and emergencies.",
        isCorrect: false,
      },
      
      {
        id: "fifty",
        label: "50%+ for maximum security",
        reflection: "While thorough, this aggressive saving rate may be unnecessarily restrictive for most lifestyles.",
        isCorrect: false,
      },
      {
        id: "twenty",
        label: "20-30% for income smoothing",
        reflection: "Ideal range! This creates substantial buffers while still allowing for reasonable current spending.",
        isCorrect: true,
      },
      {
        id: "everything",
        label: "Save everything during high months",
        reflection: "Extreme saving prevents enjoying life and can lead to burnout from overly restrictive financial habits.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the biggest challenge with irregular income?",
    options: [
      {
        id: "spending",
        label: "Difficulty controlling spending",
        reflection: "While spending discipline is important, it's not the primary challenge with irregular income patterns.",
        isCorrect: false,
      },
      {
        id: "predictability",
        label: "Unpredictable cash flow timing",
        reflection: "Exactly! The timing uncertainty makes planning difficult and creates regular financial anxiety.",
        isCorrect: true,
      },
      {
        id: "motivation",
        label: "Staying motivated to work",
        reflection: "Motivation challenges are personal productivity issues, not inherent to irregular income structures.",
        isCorrect: false,
      },
      {
        id: "taxes",
        label: "Complicated tax calculations",
        reflection: "While taxes can be complex, they're manageable with proper accounting and aren't the main irregular income challenge.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const BudgetingWithIrregularIncome = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-29";
  const gameContent = t("financial-literacy.young-adult.budgeting-with-irregular-income", { returnObjects: true });
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
  const subtitle = t("financial-literacy.young-adult.budgeting-with-irregular-income.subtitleProgress", {
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
                    <span>{t("financial-literacy.young-adult.budgeting-with-irregular-income.choiceLabel", { id: String(option.id || "").toUpperCase() })}</span>
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
                      {t("financial-literacy.young-adult.budgeting-with-irregular-income.fullRewardHint", { total: totalStages })}
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
                {t("financial-literacy.young-adult.budgeting-with-irregular-income.fullRewardHint", { total: totalStages })}
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

export default BudgetingWithIrregularIncome;