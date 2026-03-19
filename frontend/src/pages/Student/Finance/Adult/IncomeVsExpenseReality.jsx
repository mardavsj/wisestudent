import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const IncomeVsExpenseReality = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");

  const gameId = "finance-adults-1";

  // 🔑 Base key
  const baseKey = "financial-literacy.adults.income-vs-expense-reality";

  // 🔑 Full JSON
  const gameContent = t(baseKey, { returnObjects: true });

  const gameData = getGameDataById(gameId);

  const STAGES = Array.isArray(gameContent?.stages) ? gameContent.stages : [];
  const totalStages = STAGES.length;
  const successThreshold = totalStages;

  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;

  const {
    flashPoints,
    showAnswerConfetti,
    showCorrectAnswerFeedback,
    resetFeedback,
  } = useGameFeedback();

  const [stageIndex, setStageIndex] = useState(0);
  const [coins, setCoins] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [history, setHistory] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [canProceed, setCanProceed] = useState(false);

  const reflectionPrompts = useMemo(
    () => gameContent?.reflectionPrompts || [],
    [gameContent]
  );

  const handleSelect = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();

    const updatedHistory = [
      ...history,
      { stageId: STAGES[stageIndex].id, isCorrect: option.isCorrect },
    ];

    setHistory(updatedHistory);
    setSelectedOption(option.id);
    setSelectedReflection(option.reflection);
    setShowFeedback(true);
    setCanProceed(false);

    if (option.isCorrect) {
      setCoins((prev) => prev + 1);
    }

    setTimeout(() => setCanProceed(true), 1500);

    if (stageIndex === totalStages - 1) {
      setTimeout(() => {
        const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
        const passed = correctCount === successThreshold;

        setFinalScore(correctCount);
        setCoins(passed ? totalCoins : 0);
        setShowResult(true);
      }, 3000);
    }

    const points = option.isCorrect ? 1 : 0;
    showCorrectAnswerFeedback(points, option.isCorrect);
  };

  const handleRetry = () => {
    resetFeedback();
    setStageIndex(0);
    setHistory([]);
    setSelectedOption(null);
    setCoins(0);
    setFinalScore(0);
    setShowResult(false);
  };

  const subtitle = showResult
    ? gameContent?.subtitleComplete || "Complete!"
    : t(`${baseKey}.subtitleProgress`, {
      current: Math.min(stageIndex + 1, totalStages),
      total: totalStages,
      defaultValue: "Stage {{current}} of {{total}}",
    });

  const stage = STAGES[Math.min(stageIndex, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title={gameContent?.title || "Income vs Expense Reality"}
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={totalStages}
      currentLevel={Math.min(stageIndex + 1, totalStages)}
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

          {/* Header */}
          <div className="flex text-sm uppercase tracking-[0.3em] text-white/60 justify-between mb-4">
            <span>
              {t(`${baseKey}.scenarioLabel`, { defaultValue: "Scenario" })}
            </span>
            <span>
              {t(`${baseKey}.scenarioValue`, {
                defaultValue: "₹18,000 vs ₹20,000",
              })}
            </span>
          </div>

          {/* Prompt */}
          <p className="text-lg text-white/90 mb-6">{stage?.prompt}</p>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4">
            {stage?.options?.map((option) => {
              const isSelected = selectedOption === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  disabled={!!selectedOption}
                  className={`rounded-2xl border-2 p-5 text-left transition ${isSelected
                      ? option.isCorrect
                        ? "border-green-400 bg-emerald-500/20"
                        : "border-red-400 bg-red-500/10"
                      : "border-white/30 bg-white/5 hover:border-white/60 hover:bg-white/10"
                    }`}
                >
                  <div className="text-sm text-white/70 mb-2">
                    {t(`${baseKey}.choiceLabel`, {
                      id: option.id,
                      defaultValue: "Choice {{id}}",
                    })}
                  </div>

                  <p className="text-white font-semibold">{option.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback / Result */}
        {(showFeedback || showResult) && (
          <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">

            <h4 className="text-lg font-semibold text-white">
              {t(`${baseKey}.reflectionTitle`, { defaultValue: "Reflection" })}
            </h4>

            {selectedReflection && (
              <p className="text-sm text-white/90">{selectedReflection}</p>
            )}

            {/* Continue */}
            {showFeedback && !showResult && (
              <div className="mt-4 flex justify-center">
                {canProceed ? (
                  <button
                    onClick={() => {
                      if (stageIndex < totalStages - 1) {
                        setStageIndex((prev) => prev + 1);
                        setSelectedOption(null);
                        setSelectedReflection(null);
                        setShowFeedback(false);
                        setCanProceed(false);
                      }
                    }}
                    className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-6 font-semibold"
                  >
                    {t(`${baseKey}.continueButton`, { defaultValue: "Continue" })}
                  </button>
                ) : (
                  <div className="py-2 px-6 text-white font-semibold">
                    {t(`${baseKey}.readingLabel`, { defaultValue: "Reading..." })}
                  </div>
                )}
              </div>
            )}

            {/* Final Result */}
            {showResult && (
              <>
                <h5 className="font-semibold">
                  {t(`${baseKey}.reflectionPromptsTitle`, {
                    defaultValue: "Reflection Prompts",
                  })}
                </h5>

                <ul className="text-sm list-disc list-inside space-y-1">
                  {reflectionPrompts.map((prompt) => (
                    <li key={prompt}>{prompt}</li>
                  ))}
                </ul>

                <p className="text-sm text-white/70">
                  {t(`${baseKey}.skillUnlockedLabel`, {
                    defaultValue: "Skill unlocked:",
                  })}{" "}
                  <strong>
                    {t(`${baseKey}.skillName`, {
                      defaultValue: "Understanding income–expense gaps",
                    })}
                  </strong>
                </p>

                {!hasPassed && (
                  <p className="text-xs text-amber-300">
                    {t(`${baseKey}.fullRewardHint`, {
                      total: totalStages,
                      defaultValue:
                        "Answer all {{total}} choices correctly to earn the full reward.",
                    })}
                  </p>
                )}

                {!hasPassed && (
                  <button
                    onClick={handleRetry}
                    className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 font-semibold"
                  >
                    {t(`${baseKey}.tryAgainButton`, {
                      defaultValue: "Try Again",
                    })}
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default IncomeVsExpenseReality;