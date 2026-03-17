import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { useTranslation } from "react-i18next";
import {
  enFinancialLiteracyYoungAdultGameContent,
  hiFinancialLiteracyYoungAdultGameContent,
} from "../../../../i18n/financial-literacy/young-adult";

const FakeCustomerSupport = () => {
  const { i18n, t } = useTranslation("gamecontent");
  const location = useLocation();
  const gameId = "finance-young-adult-88";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel =
    gameData?.coins || location.state?.coinsPerLevel || 20;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 20;
  const totalXp = gameData?.xp || location.state?.totalXp || 40;
  const {
    flashPoints,
    showAnswerConfetti,
    showCorrectAnswerFeedback,
    resetFeedback,
  } = useGameFeedback();

  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [history, setHistory] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [canProceed, setCanProceed] = useState(false);

  const currentLanguage = i18n.language;
  const isHindi = currentLanguage === "hi";
  const gameContent = isHindi
    ? hiFinancialLiteracyYoungAdultGameContent["fake-customer-support"]
    : enFinancialLiteracyYoungAdultGameContent["fake-customer-support"];

  const stages = Array.isArray(gameContent?.stages) ? gameContent.stages : [];
  const totalStages = stages.length || 0;
  const successThreshold = totalStages || 0;
  const reflectionPrompts = Array.isArray(gameContent?.reflectionPrompts)
    ? gameContent.reflectionPrompts
    : [];

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    if (!stages.length) return;

    resetFeedback();
    const currentStageData = stages[Math.min(currentStage, totalStages - 1)];
    if (!currentStageData) return;

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
      setCoins((prevCoins) => prevCoins + 1);
    }

    setTimeout(() => {
      setCanProceed(true);
    }, 1500);

    if (totalStages > 0 && currentStage === totalStages - 1) {
      setTimeout(() => {
        const correctCount = updatedHistory.filter(
          (item) => item.isCorrect
        ).length;
        const passed = successThreshold > 0 && correctCount === successThreshold;
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
    setShowFeedback(false);
    setSelectedReflection(null);
    setCanProceed(false);
  };

  const subtitle =
    gameContent?.subtitleProgress && totalStages > 0
      ? t(
          "financial-literacy.young-adult.fake-customer-support.subtitleProgress",
          {
            current: Math.min(currentStage + 1, totalStages),
            total: totalStages,
          }
        )
      : `Stage ${Math.min(currentStage + 1, totalStages || 1)} of ${
          totalStages || 1
        }`;

  const stage =
    stages.length > 0
      ? stages[Math.min(currentStage, stages.length - 1)]
      : null;

  const hasPassed =
    successThreshold > 0 && finalScore === successThreshold;

  const maxScore = totalStages || 1;
  const currentLevel =
    totalStages > 0
      ? Math.min(currentStage + 1, totalStages)
      : 1;

  return (
    <GameShell
      title={
        gameContent?.title ||
        t(
          "financial-literacy.young-adult.fake-customer-support.title",
          "Fake Customer Support"
        )
      }
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={maxScore}
      currentLevel={currentLevel}
      totalLevels={maxScore}
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
            <span>
              {gameContent?.scenarioLabel ||
                t(
                  "financial-literacy.young-adult.fake-customer-support.scenarioLabel",
                  "Scenario"
                )}
            </span>
            <span>
              {gameContent?.scenarioValue ||
                t(
                  "financial-literacy.young-adult.fake-customer-support.scenarioValue",
                  "Fake Customer Support"
                )}
            </span>
          </div>
          <p className="text-lg text-white/90 mb-6">
            {stage?.prompt || ""}
          </p>
          <div className="grid grid-cols-2 gap-4">
            {stage?.options?.map((option) => {
              const isSelected = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option)}
                  disabled={!!selectedOption}
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    isSelected
                      ? option.isCorrect
                        ? "border-emerald-400 bg-emerald-500/20"
                        : "border-rose-400 bg-rose-500/10"
                      : "border-white/30 bg-white/5 hover:border-white/60 hover:bg-white/10"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2 text-sm text-white/70">
                    <span>
                      {gameContent?.choiceLabel
                        ? gameContent.choiceLabel.replace(
                            "{{id}}",
                            option.id.toUpperCase()
                          )
                        : `Choice ${option.id.toUpperCase()}`}
                    </span>
                  </div>
                  <p className="text-white font-semibold">{option.label}</p>
                </button>
              );
            })}
          </div>
          {(showResult || showFeedback) && (
            <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
              <h4 className="text-lg font-semibold text-white">
                {gameContent?.reflectionTitle ||
                  t(
                    "financial-literacy.young-adult.fake-customer-support.reflectionTitle",
                    "Reflection"
                  )}
              </h4>
              {selectedReflection && (
                <div className="max-h-24 overflow-y-auto pr-2">
                  <p className="text-sm text-white/90">
                    {selectedReflection}
                  </p>
                </div>
              )}
              {showFeedback && !showResult && (
                <div className="mt-4 flex justify-center">
                  {canProceed ? (
                    <button
                      onClick={() => {
                        if (totalStages > 0 && currentStage < totalStages - 1) {
                          setCurrentStage((prev) => prev + 1);
                          setSelectedOption(null);
                          setSelectedReflection(null);
                          setShowFeedback(false);
                          setCanProceed(false);
                        }
                      }}
                      className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-6 font-semibold shadow-lg hover:opacity-90"
                    >
                      {gameContent?.continueButton ||
                        t(
                          "financial-literacy.young-adult.fake-customer-support.continueButton",
                          "Continue"
                        )}
                    </button>
                  ) : (
                    <div className="py-2 px-6 text-white font-semibold">
                      {gameContent?.readingLabel ||
                        t(
                          "financial-literacy.young-adult.fake-customer-support.readingLabel",
                          "Reading..."
                        )}
                    </div>
                  )}
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
                    {gameContent?.skillUnlockedLabel ||
                      t(
                        "financial-literacy.young-adult.fake-customer-support.skillUnlockedLabel",
                        "Skill unlocked:"
                      )}{" "}
                    <strong>
                      {gameContent?.skillName ||
                        t(
                          "financial-literacy.young-adult.fake-customer-support.skillName",
                          "Support scam detection"
                        )}
                    </strong>
                  </p>
                  {!hasPassed && (
                    <p className="text-xs text-amber-300">
                      {gameContent?.fullRewardHint
                        ? gameContent.fullRewardHint.replace(
                            "{{total}}",
                            totalStages.toString()
                          )
                        : `Answer all ${totalStages} choices correctly to earn the full reward.`}
                    </p>
                  )}
                  {!hasPassed && (
                    <button
                      onClick={handleRetry}
                      className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 font-semibold shadow-lg hover:opacity-90"
                    >
                      {gameContent?.tryAgainButton ||
                        t(
                          "financial-literacy.young-adult.fake-customer-support.tryAgainButton",
                          "Try Again"
                        )}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default FakeCustomerSupport;

