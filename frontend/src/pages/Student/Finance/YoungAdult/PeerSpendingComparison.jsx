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
    prompt: "Comparing spending with friends leads to:",
    options: [
      {
        id: "better",
        label: "Better financial decisions",
        reflection: "Social comparison often leads to competitive spending rather than improved financial judgment or personal goal alignment.",
        isCorrect: false,
      },
      {
        id: "pressure",
        label: "Overspending pressure",
        reflection: "Exactly! Comparing spending creates pressure to match others' consumption levels, often beyond personal financial capacity.",
        isCorrect: true,
      },
      {
        id: "motivation",
        label: "Healthy motivation for improvement",
        reflection: "While some motivation can occur, comparison more commonly creates stress and spending pressure rather than constructive inspiration.",
        isCorrect: false,
      },
      {
        id: "insight",
        label: "Valuable spending insights",
        reflection: "Friends' spending rarely provides relevant insights for your personal financial situation and goals.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "How should you handle peer spending differences?",
    options: [
      {
        id: "match",
        label: "Match their spending levels",
        reflection: "Matching others' spending often creates financial stress and debt that can take years to resolve and limit future choices.",
        isCorrect: false,
      },
      
      {
        id: "avoid",
        label: "Avoid friends who spend differently",
        reflection: "Social isolation isn't necessary - healthy relationships respect individual financial boundaries and different priorities.",
        isCorrect: false,
      },
      {
        id: "secret",
        label: "Hide your financial situation",
        reflection: "Secrecy creates stress and prevents authentic relationships - transparency with trusted friends builds stronger connections.",
        isCorrect: false,
      },
      {
        id: "confident",
        label: "Stay confident in your budget",
        reflection: "Perfect! Financial confidence includes making decisions based on personal values and goals rather than social pressure.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "What's the impact of social spending pressure?",
    options: [
      {
        id: "unity",
        label: "Creates group bonding",
        reflection: "While shared activities can bond groups, spending pressure often creates exclusion and financial stress rather than genuine connection.",
        isCorrect: false,
      },
      
      {
        id: "growth",
        label: "Encourages financial growth",
        reflection: "Social pressure typically encourages consumption rather than genuine financial development or wealth-building behaviors.",
        isCorrect: false,
      },
      {
        id: "stress",
        label: "Generates financial anxiety",
        reflection: "Exactly! Social pressure to spend creates ongoing stress about affordability and can lead to debt and relationship tension.",
        isCorrect: true,
      },
      {
        id: "normal",
        label: "Normalizes responsible habits",
        reflection: "Social circles more commonly normalize spending patterns rather than promoting the disciplined financial habits needed for long-term security.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "How can you maintain friendships while spending differently?",
    options: [
      {
        id: "conform",
        label: "Conform to group spending norms",
        reflection: "Conforming creates financial stress and resentment - authentic friendships respect individual financial circumstances and choices.",
        isCorrect: false,
      },
      {
        id: "communicate",
        label: "Communicate your financial boundaries",
        reflection: "Perfect! Clear communication about your financial situation helps friends understand and respect your spending limitations.",
        isCorrect: true,
      },
      {
        id: "separate",
        label: "Spend separately from friends",
        reflection: "Complete separation isn't necessary - finding affordable shared activities maintains connections while respecting financial limits.",
        isCorrect: false,
      },
      {
        id: "justify",
        label: "Justify your spending choices constantly",
        reflection: "Constant justification creates stress - trusted friends accept your financial decisions without requiring detailed explanations.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the relationship between peer comparison and financial success?",
    options: [
      {
        id: "negative",
        label: "Negative impact on financial health",
        reflection: "Exactly! Peer comparison typically undermines financial success by encouraging spending beyond personal means and goals.",
        isCorrect: true,
      },
      {
        id: "positive",
        label: "Positive correlation with success",
        reflection: "Actually, financial success typically requires ignoring social pressure and making independent decisions based on personal goals.",
        isCorrect: false,
      },
      
      {
        id: "neutral",
        label: "No significant relationship",
        reflection: "Peer influence significantly affects spending behavior and financial decision-making, particularly among young adults establishing habits.",
        isCorrect: false,
      },
      {
        id: "motivational",
        label: "Provides motivational benchmark",
        reflection: "While benchmarks can help, peer spending rarely represents appropriate financial goals - individual circumstances vary greatly.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const PeerSpendingComparison = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-38";
  const gameContent = t("financial-literacy.young-adult.peer-spending-comparison", { returnObjects: true });
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
  const subtitle = t("financial-literacy.young-adult.peer-spending-comparison.subtitleProgress", {
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
                    <span>{t("financial-literacy.young-adult.peer-spending-comparison.choiceLabel", { id: String(option.id || "").toUpperCase() })}</span>
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
                      {t("financial-literacy.young-adult.peer-spending-comparison.fullRewardHint", { total: totalStages })}
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
                {t("financial-literacy.young-adult.peer-spending-comparison.fullRewardHint", { total: totalStages })}
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

export default PeerSpendingComparison;