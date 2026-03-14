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
    prompt: "As income increases, what should change first?",
    options: [
      {
        id: "spending",
        label: "Spending immediately",
        reflection: "Increasing spending immediately with income growth leads to lifestyle inflation, which can trap young earners in a cycle of living paycheck to paycheck.",
        isCorrect: false,
      },
      {
        id: "savings",
        label: "Savings and goals first",
        reflection: "Exactly! Prioritizing savings and goals when income increases helps build wealth and prevents lifestyle inflation from taking hold.",
        isCorrect: true,
      },
      {
        id: "luxury",
        label: "Upgrade to luxury items",
        reflection: "Upgrading to luxury items immediately when income increases is a classic sign of lifestyle inflation, which can lead to financial stress.",
        isCorrect: false,
      },
      {
        id: "status",
        label: "Change status symbols (car, house, etc.)",
        reflection: "Changing status symbols with income increases often leads to higher expenses that can trap you in lifestyle inflation.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What happens when you increase spending as income grows?",
    options: [
      {
        id: "inflation",
        label: "Lifestyle inflation occurs gradually",
        reflection: "Exactly! Lifestyle inflation happens gradually as people adjust their spending to match their income increases, often without realizing it.",
        isCorrect: true,
      },
      {
        id: "security",
        label: "Financial security improves automatically",
        reflection: "Simply increasing spending with income doesn't improve financial security. Without intentional saving, you may end up with the same financial stress.",
        isCorrect: false,
      },
      {
        id: "wealth",
        label: "Wealth builds faster",
        reflection: "Increasing spending with income actually works against wealth building. More money spent means less money saved and invested.",
        isCorrect: false,
      },
      {
        id: "freedom",
        label: "More financial freedom is achieved",
        reflection: "Paradoxically, increasing spending with income often reduces financial freedom by creating higher expenses that require more income to maintain.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "What's the best approach to handle a raise or promotion?",
    options: [
      
      {
        id: "celebrate",
        label: "Celebrate first with a big purchase",
        reflection: "Celebrating with a big purchase immediately after a raise can start the slippery slope of lifestyle inflation.",
        isCorrect: false,
      },
      {
        id: "upgrade",
        label: "Upgrade your lifestyle immediately",
        reflection: "Upgrading your lifestyle immediately after a raise is a classic trigger for lifestyle inflation, which can trap young earners.",
        isCorrect: false,
      },
      {
        id: "compare",
        label: "Match your spending to peers with similar income",
        reflection: "Matching peer spending can lead to unnecessary expenses and accelerate lifestyle inflation rather than building financial security.",
        isCorrect: false,
      },
      {
        id: "automate",
        label: "Automate increased savings before spending",
        reflection: "Perfect! Automating increased savings first ensures that your new income builds wealth rather than funding lifestyle inflation.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "How does lifestyle inflation affect your financial future?",
    options: [
      
      {
        id: "benefits",
        label: "It provides more benefits than drawbacks",
        reflection: "Lifestyle inflation has significant drawbacks, including reduced savings, higher financial stress, and less flexibility in life choices.",
        isCorrect: false,
      },
      {
        id: "wealth",
        label: "It accelerates wealth building",
        reflection: "Lifestyle inflation actually works against wealth building by directing increased income toward consumption rather than investment.",
        isCorrect: false,
      },
      {
        id: "traps",
        label: "Lifestyle inflation traps young earners",
        reflection: "Exactly! Lifestyle inflation creates a cycle where increased income leads to increased spending, trapping earners in a pattern that prevents wealth building.",
        isCorrect: true,
      },
      {
        id: "freedom",
        label: "It increases financial freedom",
        reflection: "Lifestyle inflation typically decreases financial freedom by creating higher expenses that require more income to maintain, reducing flexibility.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What strategy prevents lifestyle inflation?",
    options: [
     
      {
        id: "delay",
        label: "Delay gratification for major purchases",
        reflection: "While delaying gratification helps, the most effective strategy is to automatically direct income increases toward savings.",
        isCorrect: false,
      },
       {
        id: "percent",
        label: "Save a percentage of any income increase",
        reflection: "Perfect! Saving a percentage of any income increase is a proven strategy to prevent lifestyle inflation and build long-term wealth.",
        isCorrect: true,
      },
      {
        id: "compare",
        label: "Compare your lifestyle to others",
        reflection: "Comparing your lifestyle to others often leads to lifestyle inflation as you try to match or exceed others' spending patterns.",
        isCorrect: false,
      },
      {
        id: "spend",
        label: "Spend your income increase on wants",
        reflection: "Spending income increases on wants is the definition of lifestyle inflation, which traps young earners in a cycle of living paycheck to paycheck.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const LifestyleInflation = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-16";
  const gameContent = t("financial-literacy.young-adult.lifestyle-inflation", { returnObjects: true });
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
  const subtitle = t("financial-literacy.young-adult.lifestyle-inflation.subtitleProgress", {
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
                    <span>{t("financial-literacy.young-adult.lifestyle-inflation.choiceLabel", { id: String(option.id || "").toUpperCase() })}</span>
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
                      {t("financial-literacy.young-adult.lifestyle-inflation.fullRewardHint", { total: totalStages })}
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
                {t("financial-literacy.young-adult.lifestyle-inflation.fullRewardHint", { total: totalStages })}
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

export default LifestyleInflation;