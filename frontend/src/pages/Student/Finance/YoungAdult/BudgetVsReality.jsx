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
    prompt: "You exceeded your budget this month. What's best?",
    options: [
      {
        id: "quit",
        label: "Quit budgeting",
        reflection: "Quitting budgeting after one setback means losing the benefits of financial planning altogether. It's better to learn from this experience.",
        isCorrect: false,
      },
      {
        id: "adjust",
        label: "Adjust and try again next month",
        reflection: "Exactly! Budgeting is a skill that improves with practice. Adjusting your budget based on reality and continuing is the best approach.",
        isCorrect: true,
      },
      {
        id: "ignore",
        label: "Ignore the budget and spend freely",
        reflection: "Ignoring your budget after exceeding it defeats the purpose of budgeting and can lead to further financial challenges.",
        isCorrect: false,
      },
      {
        id: "blame",
        label: "Blame external factors and give up",
        reflection: "While external factors can impact budgets, giving up means missing out on financial control and improvement.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What is the most important lesson when budgeting doesn't go as planned?",
    options: [
      {
        id: "practice",
        label: "Budgeting improves with practice",
        reflection: "Perfect! Budgeting is a skill that develops over time. Each month provides insights to refine your budgeting approach.",
        isCorrect: true,
      },
      {
        id: "rigidity",
        label: "Budgets must be rigid and unchangeable",
        reflection: "Rigid budgets often fail because they don't account for real-life variations. Flexibility is key to successful budgeting.",
        isCorrect: false,
      },
      {
        id: "simpler",
        label: "Budgets should be as simple as possible",
        reflection: "While simplicity helps, the key is not making budgets overly simplified to the point of being unrealistic.",
        isCorrect: false,
      },
      {
        id: "quit",
        label: "Stop trying if it doesn't work immediately",
        reflection: "Most skills take time to develop. Quitting budgeting after initial challenges means missing out on its long-term benefits.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "How should you approach budgeting after experiencing overspending?",
    options: [
      
      {
        id: "avoid",
        label: "Avoid budgeting for the problematic category",
        reflection: "Avoiding budgeting for certain categories doesn't solve the underlying issue and may lead to other financial problems.",
        isCorrect: false,
      },
      {
        id: "increase",
        label: "Increase your budget significantly",
        reflection: "Simply increasing the budget without understanding the cause of overspending doesn't address the root problem.",
        isCorrect: false,
      },
      {
        id: "reduce",
        label: "Reduce your budget to compensate",
        reflection: "Reducing the budget without understanding why you overspent doesn't address the underlying issues.",
        isCorrect: false,
      },
      {
        id: "analyze",
        label: "Analyze what caused the overspending",
        reflection: "Exactly! Analyzing overspending helps identify triggers and patterns, leading to better budget planning in the future.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "What role does flexibility play in successful budgeting?",
    options: [
     
      {
        id: "excuse",
        label: "Provides an excuse to spend more",
        reflection: "Flexibility shouldn't be an excuse for overspending, but rather a tool for realistic budgeting.",
        isCorrect: false,
      },
      {
        id: "negotiate",
        label: "Allows negotiating with creditors",
        reflection: "While negotiating with creditors is useful in some situations, flexibility in budgeting refers to adjusting your spending plan.",
        isCorrect: false,
      },
       {
        id: "adaptation",
        label: "Allows adaptation to real-life situations",
        reflection: "Perfect! Flexibility in budgeting allows you to adapt to unexpected expenses and changing circumstances while staying on track.",
        isCorrect: true,
      },
      {
        id: "discretion",
        label: "Gives unlimited spending discretion",
        reflection: "Flexibility doesn't mean unlimited spending, but rather the ability to adjust within reasonable limits.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "Why might someone exceed their budget in the first few months of budgeting?",
    options: [
      
      {
        id: "impossible",
        label: "Budgeting is impossible for most people",
        reflection: "Budgeting is challenging initially but achievable with practice and the right approach.",
        isCorrect: false,
      },
      {
        id: "learning",
        label: "Budgeting is a skill that takes time to master",
        reflection: "Exactly! Like any skill, budgeting requires practice. Early overspending is often part of the learning process as you understand your spending patterns.",
        isCorrect: true,
      },
      {
        id: "unnecessary",
        label: "Budgeting isn't necessary for financial success",
        reflection: "Budgeting is a fundamental financial skill that contributes significantly to financial success.",
        isCorrect: false,
      },
      {
        id: "ineffective",
        label: "Budgeting is ineffective for controlling expenses",
        reflection: "Budgeting is effective when done properly and refined over time based on experience.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const BudgetVsReality = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-25";
  const gameContent = t("financial-literacy.young-adult.budget-vs-reality", { returnObjects: true });
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
  const subtitle = t("financial-literacy.young-adult.budget-vs-reality.subtitleProgress", {
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
                    <span>{t("financial-literacy.young-adult.budget-vs-reality.choiceLabel", { id: String(option.id || "").toUpperCase() })}</span>
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
                      {t("financial-literacy.young-adult.budget-vs-reality.fullRewardHint", { total: totalStages })}
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
                {t("financial-literacy.young-adult.budget-vs-reality.fullRewardHint", { total: totalStages })}
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

export default BudgetVsReality;