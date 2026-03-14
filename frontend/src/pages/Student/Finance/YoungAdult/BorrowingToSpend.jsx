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
    prompt: "Is borrowing for lifestyle spending safe?",
    options: [
      {
        id: "yes",
        label: "Yes",
        reflection: "Borrowing for lifestyle spending is rarely safe as it creates debt obligations that can lead to long-term financial stress and reduced flexibility.",
        isCorrect: false,
      },
      
      {
        id: "sometimes",
        label: "It depends on the interest rate",
        reflection: "Even with low interest rates, borrowing for lifestyle spending can create unnecessary debt obligations and financial stress.",
        isCorrect: false,
      },
      {
        id: "no",
        label: "No, it creates long-term stress",
        reflection: "Exactly! Borrowing for lifestyle spending creates debt that can lead to long-term financial stress and reduces your financial flexibility.",
        isCorrect: true,
      },
      {
        id: "worth",
        label: "If it's worth the expense",
        reflection: "Lifestyle spending should be funded with income, not debt. Borrowing for lifestyle expenses creates long-term financial obligations.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What happens when you borrow for lifestyle purchases?",
    options: [
      {
        id: "debt",
        label: "Creates a cycle of debt and payment obligations",
        reflection: "Exactly! Borrowing for lifestyle purchases creates ongoing debt obligations that can trap you in a cycle of payments.",
        isCorrect: true,
      },
      {
        id: "freedom",
        label: "Increases financial freedom",
        reflection: "Borrowing for lifestyle purchases actually reduces financial freedom by creating debt obligations that must be paid.",
        isCorrect: false,
      },
      {
        id: "savings",
        label: "Helps build savings faster",
        reflection: "Debt payments reduce the money available for savings, making it harder to build financial security.",
        isCorrect: false,
      },
      {
        id: "growth",
        label: "Accelerates wealth growth",
        reflection: "Borrowing for lifestyle purchases works against wealth growth by creating expenses without generating returns.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "What's the best approach to afford lifestyle improvements?",
    options: [
      
      {
        id: "credit",
        label: "Use credit cards for convenience",
        reflection: "Using credit cards for lifestyle purchases can lead to debt if balances aren't paid off monthly, creating financial stress.",
        isCorrect: false,
      },
      {
        id: "loan",
        label: "Take out personal loans for bigger items",
        reflection: "Taking out loans for lifestyle purchases creates long-term debt obligations that can delay financial independence.",
        isCorrect: false,
      },
      {
        id: "finance",
        label: "Finance purchases with monthly payment plans",
        reflection: "Monthly payment plans for lifestyle purchases create ongoing obligations that can delay financial independence.",
        isCorrect: false,
      },
      {
        id: "save",
        label: "Save up for purchases over time",
        reflection: "Perfect! Saving up for lifestyle improvements ensures you can afford them without creating debt obligations.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "How does borrowing for lifestyle affect your financial independence?",
    options: [
     
      {
        id: "speeds",
        label: "It speeds up financial independence",
        reflection: "Debt obligations slow down the path to financial independence by requiring payments before other financial goals can be pursued.",
        isCorrect: false,
      },
       {
        id: "delays",
        label: "Lifestyle loans delay financial independence",
        reflection: "Exactly! Lifestyle loans create debt obligations that must be paid before achieving true financial independence.",
        isCorrect: true,
      },
      {
        id: "helps",
        label: "It helps by spreading payments over time",
        reflection: "While spreading payments might seem helpful, debt still creates obligations that delay true financial independence.",
        isCorrect: false,
      },
      {
        id: "builds",
        label: "It builds credit and financial capacity",
        reflection: "While credit building has benefits, lifestyle debt still creates obligations that delay financial independence.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What's the wisest approach to lifestyle spending?",
    options: [
      {
        id: "afford",
        label: "Only spend on lifestyle items you can afford",
        reflection: "Perfect! Only spending on lifestyle items you can afford with current income prevents debt and maintains financial independence.",
        isCorrect: true,
      },
      {
        id: "borrow",
        label: "Borrow when you need something special",
        reflection: "Borrowing for special lifestyle purchases still creates debt obligations that can delay financial independence.",
        isCorrect: false,
      },
      {
        id: "credit",
        label: "Use credit freely to enjoy life now",
        reflection: "Using credit freely for lifestyle enjoyment creates debt obligations that reduce financial flexibility and independence.",
        isCorrect: false,
      },
      {
        id: "invest",
        label: "Invest borrowed money for returns",
        reflection: "Borrowing to invest carries significant risk, especially for lifestyle purposes, and can lead to financial stress.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const BorrowingToSpend = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-17";
  const gameContent = t("financial-literacy.young-adult.borrowing-to-spend", { returnObjects: true });
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
  const subtitle = t("financial-literacy.young-adult.borrowing-to-spend.subtitleProgress", {
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
                    <span>{t("financial-literacy.young-adult.borrowing-to-spend.choiceLabel", { id: String(option.id || "").toUpperCase() })}</span>
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
                      {t("financial-literacy.young-adult.borrowing-to-spend.fullRewardHint", { total: totalStages })}
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
                {t("financial-literacy.young-adult.borrowing-to-spend.fullRewardHint", { total: totalStages })}
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

export default BorrowingToSpend;