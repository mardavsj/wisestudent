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
    prompt: "Which choice protects your future?",
    options: [
      {
        id: "happiness",
        label: "Short-term happiness",
        reflection: "While enjoyable temporarily, short-term happiness often creates financial stress that limits future opportunities.",
        isCorrect: false,
      },
      
      {
        id: "both",
        label: "Both equally important",
        reflection: "While both matter, prioritizing stability ensures you can pursue happiness sustainably over the long term.",
        isCorrect: false,
      },
      {
        id: "neither",
        label: "Neither - focus on experiences",
        reflection: "Experiences without financial foundation can create stress that diminishes their enjoyment and long-term value.",
        isCorrect: false,
      },
      {
        id: "stability",
        label: "Financial stability",
        reflection: "Exactly! Stability creates the foundation for sustained happiness and future freedom to make choices.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "How do short-term spending decisions affect long-term goals?",
    options: [
      {
        id: "independent",
        label: "They're completely independent",
        reflection: "Spending choices directly impact your ability to save and invest toward long-term financial objectives.",
        isCorrect: false,
      },
      
      {
        id: "enhance",
        label: "Short-term spending enhances long-term wealth",
        reflection: "Generally, consumption spending reduces rather than increases long-term financial capacity and security.",
        isCorrect: false,
      },
      {
        id: "connected",
        label: "Current spending limits future options",
        reflection: "Perfect! Every dollar spent on immediate gratification is a dollar not available for future security or goals.",
        isCorrect: true,
      },
      {
        id: "unrelated",
        label: "They're unrelated to each other",
        reflection: "Financial decisions create a continuous chain where present choices directly influence future possibilities.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "What's the relationship between stability and freedom?",
    options: [
      {
        id: "restrictive",
        label: "Stability restricts personal freedom",
        reflection: "Actually, financial stability removes constraints and creates more genuine freedom to pursue meaningful choices.",
        isCorrect: false,
      },
      {
        id: "enabling",
        label: "Stability enables greater freedom",
        reflection: "Exactly! Financial security eliminates stress and creates options that allow authentic personal freedom.",
        isCorrect: true,
      },
      {
        id: "opposite",
        label: "They're opposite concepts",
        reflection: "Stability and freedom complement each other - security provides the foundation for meaningful choice and risk-taking.",
        isCorrect: false,
      },
      {
        id: "temporary",
        label: "Freedom is more important short-term",
        reflection: "While appealing, short-term freedom without stability often leads to long-term limitations and reduced choices.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "How should you balance immediate wants with future security?",
    options: [
      {
        id: "balanced",
        label: "Create sustainable balance",
        reflection: "Perfect! Thoughtful balance ensures current enjoyment while building the foundation for future opportunities.",
        isCorrect: true,
      },
      {
        id: "present",
        label: "Prioritize present satisfaction",
        reflection: "Present-only focus often leads to future financial stress and limited ability to pursue meaningful long-term goals.",
        isCorrect: false,
      },
      
      {
        id: "future",
        label: "Sacrifice everything for future",
        reflection: "Complete sacrifice often creates resentment and may prevent building the very stability you're working toward.",
        isCorrect: false,
      },
      {
        id: "extreme",
        label: "Alternate extreme saving and spending",
        reflection: "Extreme approaches create unsustainable patterns that are difficult to maintain and often lead to burnout.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the true cost of prioritizing short-term happiness?",
    options: [
      {
        id: "momentary",
        label: "Just momentary pleasure",
        reflection: "Momentary pleasure often comes with lasting financial consequences that extend far beyond the initial enjoyment.",
        isCorrect: false,
      },
      
      {
        id: "regret",
        label: "Potential future regret",
        reflection: "Regret is a significant factor, but the fundamental cost is the lost opportunity to build lasting financial security.",
        isCorrect: false,
      },
      {
        id: "flexibility",
        label: "Reduced financial flexibility",
        reflection: "Reduced flexibility is a major consequence, but the core issue is the lost opportunity for meaningful security.",
        isCorrect: false,
      },
      {
        id: "opportunity",
        label: "Lost opportunity for security",
        reflection: "Exactly! Short-term choices often mean sacrificing the security and options that enable greater long-term fulfillment.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
];

const ShortTermHappinessVsStability = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-36";
  const gameContent = t("financial-literacy.young-adult.short-term-happiness-vs-stability", { returnObjects: true });
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
  const subtitle = t("financial-literacy.young-adult.short-term-happiness-vs-stability.subtitleProgress", {
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
                    <span>{t("financial-literacy.young-adult.short-term-happiness-vs-stability.choiceLabel", { id: String(option.id || "").toUpperCase() })}</span>
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
                      {t("financial-literacy.young-adult.short-term-happiness-vs-stability.fullRewardHint", { total: totalStages })}
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
                {t("financial-literacy.young-adult.short-term-happiness-vs-stability.fullRewardHint", { total: totalStages })}
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

export default ShortTermHappinessVsStability;