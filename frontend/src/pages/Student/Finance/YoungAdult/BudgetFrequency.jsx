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
    prompt: "How often should you review your budget?",
    options: [
      {
        id: "yearly",
        label: "Once a year during annual planning",
        reflection: "Annual reviews are too infrequent to catch spending issues and adjust to life changes.",
        isCorrect: false,
      },
     
      {
        id: "never",
        label: "Never - set it and forget it",
        reflection: "Budgets need regular adjustment to remain relevant and effective for your financial goals.",
        isCorrect: false,
      },
      {
        id: "daily",
        label: "Every day for maximum control",
        reflection: "While thorough, daily budget reviews can become overwhelming and time-consuming.",
        isCorrect: false,
      },
       {
        id: "monthly",
        label: "Every month to stay current",
        reflection: "Exactly! Monthly reviews keep your budget aligned with your actual spending and life circumstances.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What's the best time to review your budget?",
    options: [
      {
        id: "end",
        label: "At the end of each month",
        reflection: "Good timing! Reviewing at month-end helps you assess performance and plan for the next month.",
        isCorrect: false,
      },
     
      {
        id: "random",
        label: "Whenever you remember",
        reflection: "Inconsistent timing makes it difficult to build budgeting habits and track progress effectively.",
        isCorrect: false,
      },
       {
        id: "beginning",
        label: "Beginning of each month for planning",
        reflection: "Excellent! Starting each month with a budget review sets clear expectations and goals.",
        isCorrect: true,
      },
      {
        id: "crisis",
        label: "Only when you run out of money",
        reflection: "Crisis-driven reviews are reactive rather than proactive and often too late to be helpful.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "What should you check during budget reviews?",
    options: [
      {
        id: "income",
        label: "Actual income vs projected income",
        reflection: "Important baseline! Verifying income accuracy ensures your entire budget is built on solid foundations.",
        isCorrect: false,
      },
      {
        id: "categories",
        label: "All spending categories for accuracy",
        reflection: "Perfect! Comprehensive category review reveals where money actually goes versus where you planned.",
        isCorrect: true,
      },
      {
        id: "friends",
        label: "What your friends are spending",
        reflection: "Comparing to others' spending can lead to poor financial decisions and unnecessary pressure.",
        isCorrect: false,
      },
      {
        id: "nothing",
        label: "Nothing - trust your initial plan",
        reflection: "Blindly trusting initial plans without review often leads to budget failure and financial stress.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "How should you adjust your budget after review?",
    options: [
      {
        id: "minor",
        label: "Make small, incremental adjustments",
        reflection: "Exactly! Small, thoughtful adjustments maintain budget stability while improving effectiveness.",
        isCorrect: true,
      },
      {
        id: "drastic",
        label: "Make major changes every month",
        reflection: "Frequent drastic changes can create instability and make it hard to establish consistent habits.",
        isCorrect: false,
      },
      
      {
        id: "ignore",
        label: "Ignore discrepancies and hope for the best",
        reflection: "Ignoring budget variances leads to continued overspending and missed financial opportunities.",
        isCorrect: false,
      },
      {
        id: "abandon",
        label: "Abandon the budget entirely",
        reflection: "Giving up after setbacks prevents you from developing essential financial management skills.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the benefit of consistent budget reviews?",
    options: [
      {
        id: "stress",
        label: "Creates more financial stress",
        reflection: "Actually, regular reviews reduce stress by preventing financial surprises and maintaining control.",
        isCorrect: false,
      },
     
      {
        id: "restriction",
        label: "Makes you feel more restricted",
        reflection: "Reviews actually provide freedom by helping you understand your true financial capacity and choices.",
        isCorrect: false,
      },
      {
        id: "boredom",
        label: "Becomes boring routine work",
        reflection: "When done thoughtfully, budget reviews become empowering tools for achieving financial goals.",
        isCorrect: false,
      },
       {
        id: "awareness",
        label: "Builds spending awareness and control",
        reflection: "Perfect! Consistent reviews develop financial literacy and help you make intentional spending choices.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
];

const BudgetFrequency = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-28";
  const gameContent = t("financial-literacy.young-adult.budget-frequency", { returnObjects: true });
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
  const subtitle = t("financial-literacy.young-adult.budget-frequency.subtitleProgress", {
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
                    <span>{t("financial-literacy.young-adult.budget-frequency.choiceLabel", { id: String(option.id || "").toUpperCase() })}</span>
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
                      {t("financial-literacy.young-adult.budget-frequency.fullRewardHint", { total: totalStages })}
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
                {t("financial-literacy.young-adult.budget-frequency.fullRewardHint", { total: totalStages })}
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

export default BudgetFrequency;