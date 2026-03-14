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
    prompt: "Why include emergency buffer in your budget?",
    options: [
      {
        id: "fun",
        label: "For fun spending",
        reflection: "Emergency funds are specifically for unexpected expenses, not discretionary spending.",
        isCorrect: false,
      },
      {
        id: "surprises",
        label: "To handle surprises without debt",
        reflection: "Exactly! Emergency buffers prevent you from going into debt when unexpected expenses arise.",
        isCorrect: true,
      },
      {
        id: "investment",
        label: "To invest in high-risk opportunities",
        reflection: "Emergency funds should be kept in safe, liquid accounts for quick access when needed.",
        isCorrect: false,
      },
      {
        id: "vacation",
        label: "To save for vacation money",
        reflection: "Vacations are planned expenses and should be saved for separately from emergency funds.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What percentage of your income should go to emergency fund?",
    options: [
      {
        id: "zero",
        label: "0% - I'll borrow when needed",
        reflection: "Relying on borrowing creates debt and financial stress during emergencies.",
        isCorrect: false,
      },
      {
        id: "three",
        label: "3-5% for basic protection",
        reflection: "Good start! This provides some cushion for small unexpected expenses.",
        isCorrect: false,
      },
      
      {
        id: "twenty",
        label: "20%+ for maximum security",
        reflection: "While thorough, this might be excessive for most people's needs and lifestyle.",
        isCorrect: false,
      },
      {
        id: "ten",
        label: "10-15% for solid emergency fund",
        reflection: "Perfect! This builds a robust emergency fund that can handle most unexpected situations.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "When should you tap into your emergency fund?",
    options: [
      {
        id: "medical",
        label: "Medical emergencies or job loss",
        reflection: "Correct! These are exactly the situations emergency funds are designed to cover.",
        isCorrect: true,
      },
      {
        id: "anytime",
        label: "Anytime I want extra money",
        reflection: "Using emergency funds for non-emergencies defeats their purpose and leaves you vulnerable.",
        isCorrect: false,
      },
      
      {
        id: "upgrade",
        label: "To upgrade my lifestyle items",
        reflection: "Lifestyle upgrades should be planned for separately, not funded by emergency reserves.",
        isCorrect: false,
      },
      {
        id: "invest",
        label: "To take advantage of investment opportunities",
        reflection: "Investment opportunities require planned savings, not emergency fund money.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "How much should your emergency fund cover?",
    options: [
      {
        id: "one",
        label: "One month of expenses",
        reflection: "This provides minimal protection and may not cover larger emergencies adequately.",
        isCorrect: false,
      },
      
      {
        id: "twelve",
        label: "Twelve months of expenses",
        reflection: "While comprehensive, this might be overkill for most people and tie up too much money.",
        isCorrect: false,
      },
      {
        id: "three",
        label: "Three to six months of expenses",
        reflection: "Ideal! This provides substantial protection against job loss or major medical expenses.",
        isCorrect: true,
      },
      {
        id: "lifetime",
        label: "Enough to last my entire lifetime",
        reflection: "This is impractical and would prevent you from investing and growing your wealth.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "Where should you keep your emergency fund?",
    options: [
      {
        id: "stocks",
        label: "In volatile stocks for higher returns",
        reflection: "Stocks are too risky for emergency funds since you need guaranteed access to the money.",
        isCorrect: false,
      },
      {
        id: "savings",
        label: "In high-yield savings account",
        reflection: "Perfect! High-yield savings offer safety, liquidity, and decent interest rates.",
        isCorrect: true,
      },
      {
        id: "cryptocurrency",
        label: "In cryptocurrency for maximum growth",
        reflection: "Cryptocurrency is too volatile and risky for emergency funds that need stability.",
        isCorrect: false,
      },
      {
        id: "real",
        label: "In real estate investments",
        reflection: "Real estate is illiquid and can't be quickly converted to cash during emergencies.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const EmergencyLineInBudget = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-26";
  const gameContent = t("financial-literacy.young-adult.emergency-line-in-budget", { returnObjects: true });
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
  const subtitle = t("financial-literacy.young-adult.emergency-line-in-budget.subtitleProgress", {
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
                    <span>{t("financial-literacy.young-adult.emergency-line-in-budget.choiceLabel", { id: String(option.id || "").toUpperCase() })}</span>
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
                      {t("financial-literacy.young-adult.emergency-line-in-budget.fullRewardHint", { total: totalStages })}
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
                {t("financial-literacy.young-adult.emergency-line-in-budget.fullRewardHint", { total: totalStages })}
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

export default EmergencyLineInBudget;