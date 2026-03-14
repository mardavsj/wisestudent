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
    prompt: "Why track digital payments?",
    options: [
      {
        id: "disappear",
        label: "They disappear",
        reflection: "Digital payments don't disappear - they leave electronic trails that can be tracked and analyzed.",
        isCorrect: false,
      },
      
      {
        id: "forget",
        label: "Easy to forget about them",
        reflection: "While it's easy to overlook small digital transactions, they're easier to track than cash spending.",
        isCorrect: false,
      },
      {
        id: "automatic",
        label: "They track themselves automatically",
        reflection: "While digital payments create records, you still need to actively review them for financial awareness.",
        isCorrect: false,
      },
      {
        id: "records",
        label: "They leave records",
        reflection: "Exactly! Digital payments create automatic records that help you monitor spending patterns.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "Which tracking method gives better spending insight?",
    options: [
      {
        id: "cash",
        label: "Cash only - what's left in wallet",
        reflection: "Cash tracking is limited and doesn't provide detailed spending analysis or patterns.",
        isCorrect: false,
      },
      
      {
        id: "memory",
        label: "Just remember major purchases",
        reflection: "Memory-based tracking misses small but significant daily expenses that add up over time.",
        isCorrect: false,
      },
      {
        id: "digital",
        label: "Digital records with categorization",
        reflection: "Perfect! Digital tracking with categories reveals spending patterns and helps identify areas for improvement.",
        isCorrect: true,
      },
      {
        id: "receipts",
        label: "Keep all physical receipts",
        reflection: "Physical receipts are cumbersome to organize and analyze compared to digital records.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "How often should you review digital transaction records?",
    options: [
      {
        id: "never",
        label: "Never - the bank handles it",
        reflection: "Passive banking doesn't provide the financial awareness needed for smart money management.",
        isCorrect: false,
      },
      {
        id: "weekly",
        label: "Weekly check-ins for awareness",
        reflection: "Excellent! Weekly reviews build spending awareness and allow for timely course corrections.",
        isCorrect: true,
      },
      {
        id: "monthly",
        label: "Monthly review of statements",
        reflection: "Good baseline! Monthly reviews help catch irregularities and track progress toward goals.",
        isCorrect: false,
      },
      
      {
        id: "daily",
        label: "Daily micro-management",
        reflection: "While thorough, daily tracking can become obsessive and time-consuming for most people.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What's the biggest advantage of digital payment tracking?",
    options: [
      {
        id: "spending",
        label: "Spending awareness and pattern recognition",
        reflection: "Exactly! Tracking reveals unconscious spending habits and helps optimize your budget.",
        isCorrect: true,
      },
      {
        id: "convenience",
        label: "Convenience of not carrying cash",
        reflection: "While convenient, this isn't the primary benefit of tracking digital payments.",
        isCorrect: false,
      },
      
      {
        id: "security",
        label: "Enhanced security features",
        reflection: "Security is important but not the main advantage of actively tracking your digital payments.",
        isCorrect: false,
      },
      {
        id: "rewards",
        label: "Cashback and reward points",
        reflection: "Rewards are nice but shouldn't be the primary reason for tracking your spending.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "Which tool is most effective for digital payment tracking?",
    options: [
      {
        id: "bank",
        label: "Bank's basic online portal",
        reflection: "Basic portals provide limited categorization and analysis capabilities.",
        isCorrect: false,
      },
      
      {
        id: "spreadsheet",
        label: "Manual spreadsheet tracking",
        reflection: "Manual tracking is time-intensive and prone to human error and inconsistency.",
        isCorrect: false,
      },
      {
        id: "memory",
        label: "Trust your memory to remember spending",
        reflection: "Human memory is unreliable for financial tracking and misses important spending patterns.",
        isCorrect: false,
      },
      {
        id: "dedicated",
        label: "Dedicated budgeting apps with automation",
        reflection: "Perfect! These apps automatically categorize spending and provide detailed insights.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
];

const CashVsDigitalTracking = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-27";
  const gameContent = t("financial-literacy.young-adult.cash-vs-digital-tracking", { returnObjects: true });
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
  const subtitle = t("financial-literacy.young-adult.cash-vs-digital-tracking.subtitleProgress", {
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
                    <span>{t("financial-literacy.young-adult.cash-vs-digital-tracking.choiceLabel", { id: String(option.id || "").toUpperCase() })}</span>
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
                      {t("financial-literacy.young-adult.cash-vs-digital-tracking.fullRewardHint", { total: totalStages })}
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
                {t("financial-literacy.young-adult.cash-vs-digital-tracking.fullRewardHint", { total: totalStages })}
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

export default CashVsDigitalTracking;