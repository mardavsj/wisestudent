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
    prompt: "You have multiple subscriptions you barely use. What's smarter?",
    options: [
      {
        id: "keep",
        label: "Keep them all just in case",
        reflection: "Keeping unused subscriptions creates ongoing costs that silently drain your money over time without providing value.",
        isCorrect: false,
      },
      {
        id: "cancel",
        label: "Cancel unused ones",
        reflection: "Perfect! Cancelling unused subscriptions frees up money for things you actually value and use regularly.",
        isCorrect: true,
      },
      {
        id: "upgrade",
        label: "Upgrade to premium versions",
        reflection: "Upgrading unused subscriptions compounds the problem by increasing costs for services you weren't even using effectively.",
        isCorrect: false,
      },
      {
        id: "share",
        label: "Share accounts with friends to justify cost",
        reflection: "Sharing accounts might reduce per-person cost, but you're still paying for services you barely use individually.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "Why do subscription costs feel so small individually?",
    options: [
      {
        id: "trick",
        label: "They're designed to seem insignificant",
        reflection: "Exactly! Subscription companies intentionally price services low to make them feel affordable, but they add up significantly over time.",
        isCorrect: true,
      },
      {
        id: "real",
        label: "They actually are insignificant",
        reflection: "While each subscription might seem small, they compound into substantial monthly costs that could be allocated to higher-value expenses.",
        isCorrect: false,
      },
      {
        id: "benefit",
        label: "The benefits always outweigh the cost",
        reflection: "Unused subscriptions provide no benefits while still costing money, making them poor financial choices.",
        isCorrect: false,
      },
      {
        id: "tax",
        label: "They're mostly tax deductions",
        reflection: "Most personal subscriptions don't qualify as tax deductions, so you're paying the full cost without tax benefits.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "What's the best approach to managing subscriptions?",
    options: [
      
      {
        id: "automatic",
        label: "Set up automatic renewals for convenience",
        reflection: "Automatic renewals make it easy to accumulate unused subscriptions that silently drain your finances without review.",
        isCorrect: false,
      },
      {
        id: "annual",
        label: "Pay annually to get discounts",
        reflection: "Annual payments lock you into unused services for a full year, making cancellation psychologically harder even when not using the service.",
        isCorrect: false,
      },
      {
        id: "free",
        label: "Only use free trials indefinitely",
        reflection: "Constantly switching between free trials is impractical and often doesn't provide the same value as committed services.",
        isCorrect: false,
      },
      {
        id: "audit",
        label: "Regularly audit and cancel unused ones",
        reflection: "Perfect! Regular audits ensure you're only paying for services you actually use and derive value from.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "How do unused subscriptions affect your finances?",
    options: [
      
      {
        id: "credit",
        label: "They improve your credit score",
        reflection: "Subscriptions don't directly impact credit scores unless payments are missed, so they don't provide financial benefits beyond the service itself.",
        isCorrect: false,
      },
      {
        id: "investment",
        label: "They're investments in future value",
        reflection: "Unused subscriptions are expenses, not investments, since you're not deriving any value from services you don't use.",
        isCorrect: false,
      },
      {
        id: "drain",
        label: "Small monthly costs silently drain money",
        reflection: "Exactly! Over time, unused subscriptions create a significant financial drain that accumulates without providing commensurate value.",
        isCorrect: true,
      },
      {
        id: "reward",
        label: "They offer cashback rewards",
        reflection: "Most subscriptions don't offer cashback rewards, so unused ones are pure expenses without financial incentives.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What should you do before subscribing to something new?",
    options: [
      
      {
        id: "impulse",
        label: "Subscribe impulsively when interested",
        reflection: "Impulse subscriptions often join the collection of unused services that silently drain your money without providing value.",
        isCorrect: false,
      },
      {
        id: "evaluate",
        label: "Evaluate if you'll actually use it regularly",
        reflection: "Perfect! Assessing actual usage likelihood prevents accumulating more unused subscriptions that drain your finances.",
        isCorrect: true,
      },
      {
        id: "collect",
        label: "Collect as many as possible for options",
        reflection: "Collecting unused subscriptions creates ongoing costs without benefits, making it a poor financial strategy.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore the cost, focus on features",
        reflection: "Ignoring costs while focusing only on features leads to accumulating expensive unused subscriptions that strain your budget.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const SubscriptionTrap = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-12";
  const gameContent = t("financial-literacy.young-adult.subscription-trap", { returnObjects: true });
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
  const subtitle = t("financial-literacy.young-adult.subscription-trap.subtitleProgress", {
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
                    <span>{t("financial-literacy.young-adult.subscription-trap.choiceLabel", { id: String(option.id || "").toUpperCase() })}</span>
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
                      {t("financial-literacy.young-adult.subscription-trap.fullRewardHint", { total: totalStages })}
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
                {t("financial-literacy.young-adult.subscription-trap.fullRewardHint", { total: totalStages })}
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

export default SubscriptionTrap;