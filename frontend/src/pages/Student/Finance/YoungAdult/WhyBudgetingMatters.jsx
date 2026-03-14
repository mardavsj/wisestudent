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
    prompt: "What does a budget help you do?",
    options: [
      {
        id: "restrict",
        label: "Restrict all spending",
        reflection: "Budgets don't restrict all spending, but rather help you make intentional choices about where your money goes.",
        isCorrect: false,
      },
     
      {
        id: "track",
        label: "Track expenses after spending",
        reflection: "While tracking is part of budgeting, the primary benefit is planning and controlling spending before it happens, not just tracking afterward.",
        isCorrect: false,
      },
      {
        id: "reduce",
        label: "Reduce income to match spending",
        reflection: "Budgets don't reduce income, but rather help you align your spending with your income to achieve financial goals.",
        isCorrect: false,
      },
       {
        id: "control",
        label: "Control money instead of guessing",
        reflection: "Exactly! Budgets help you control your money intentionally rather than guessing where it goes, giving you financial clarity.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "How does budgeting affect financial freedom?",
    options: [
      {
        id: "limits",
        label: "It limits financial freedom",
        reflection: "Actually, budgeting increases financial freedom by helping you make intentional choices about spending, saving, and investing.",
        isCorrect: false,
      },
      
      {
        id: "restricts",
        label: "It restricts all financial choices",
        reflection: "Budgeting doesn't restrict choices but rather helps prioritize them according to your values and goals.",
        isCorrect: false,
      },
      {
        id: "freedom",
        label: "Budgets give freedom with limits",
        reflection: "Perfect! Budgets provide financial freedom by setting intentional limits that allow you to pursue your goals while avoiding financial stress.",
        isCorrect: true,
      },
      {
        id: "controls",
        label: "It controls others' spending",
        reflection: "Budgeting is about managing your own money, not controlling others' spending decisions.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "What happens when you don't budget?",
    options: [
      {
        id: "savings",
        label: "Savings increase automatically",
        reflection: "Without budgeting, it's difficult to consistently save money as there's no plan for allocating funds toward savings goals.",
        isCorrect: false,
      },
      {
        id: "guessing",
        label: "You end up guessing where money goes",
        reflection: "Exactly! Without a budget, you're essentially guessing where your money goes, which often leads to financial surprises and stress.",
        isCorrect: true,
      },
      {
        id: "control",
        label: "You gain more control over spending",
        reflection: "Actually, without a budget you have less control over spending since there's no plan or framework to guide decisions.",
        isCorrect: false,
      },
      {
        id: "planning",
        label: "Automatic financial planning occurs",
        reflection: "Financial planning doesn't occur automatically without budgeting. Intentional planning is required for financial success.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "Why is budgeting important for achieving financial goals?",
    options: [
      {
        id: "prevents",
        label: "It prevents all spending",
        reflection: "Budgeting doesn't prevent all spending, but rather helps align spending with your goals and priorities.",
        isCorrect: false,
      },
      
      {
        id: "increases",
        label: "It increases your income automatically",
        reflection: "Budgeting doesn't increase income directly, but it can help you manage your income more effectively toward goals.",
        isCorrect: false,
      },
      {
        id: "decreases",
        label: "It decreases your expenses significantly",
        reflection: "While budgeting may help reduce unnecessary expenses, its main purpose is to align spending with your priorities and goals.",
        isCorrect: false,
      },
      {
        id: "allocates",
        label: "It allocates money toward specific goals",
        reflection: "Perfect! Budgeting helps allocate money specifically toward your financial goals, making them more achievable.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What's the best approach to budgeting?",
    options: [
        {
        id: "flexible",
        label: "Create a flexible budget that adapts to needs",
        reflection: "Exactly! A flexible budget that adapts to changing needs is more sustainable and effective for long-term financial success.",
        isCorrect: true,
      },
      {
        id: "rigid",
        label: "Create a rigid budget that never changes",
        reflection: "A rigid budget that never changes may not adapt to life changes or unexpected expenses, making it difficult to sustain.",
        isCorrect: false,
      },
      
      {
        id: "monthly",
        label: "Only budget when money runs low",
        reflection: "Budgeting reactively when money runs low doesn't provide the benefits of proactive financial planning.",
        isCorrect: false,
      },
      {
        id: "simple",
        label: "Keep it as simple as possible forever",
        reflection: "While simplicity is good, budgets should evolve as your financial situation and goals become more complex.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const WhyBudgetingMatters = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-21";
  const gameContent = t("financial-literacy.young-adult.why-budgeting-matters", { returnObjects: true });
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
  const subtitle = t("financial-literacy.young-adult.why-budgeting-matters.subtitleProgress", {
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
                    <span>{t("financial-literacy.young-adult.why-budgeting-matters.choiceLabel", { id: String(option.id || "").toUpperCase() })}</span>
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
                      {t("financial-literacy.young-adult.why-budgeting-matters.fullRewardHint", { total: totalStages })}
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
                {t("financial-literacy.young-adult.why-budgeting-matters.fullRewardHint", { total: totalStages })}
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

export default WhyBudgetingMatters;