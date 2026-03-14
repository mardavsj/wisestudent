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
    prompt: "Which is a want, not a need?",
    options: [
      {
        id: "meals",
        label: "Daily meals",
        reflection: "While daily meals are essential for survival, they would be classified as a need rather than a want since they're fundamental for health and wellbeing.",
        isCorrect: false,
      },
      {
        id: "phone",
        label: "Upgrading phone every year",
        reflection: "Perfect! While phones are important, upgrading annually is a want disguised as a need. Basic communication can be achieved with older devices.",
        isCorrect: true,
      },
      {
        id: "transport",
        label: "Daily transportation to work",
        reflection: "Transportation to work is typically considered a need since it enables you to earn income and maintain employment.",
        isCorrect: false,
      },
      {
        id: "shelter",
        label: "Basic shelter",
        reflection: "Shelter is a fundamental human need for safety and protection from the elements, not a want.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What makes a want seem like a need?",
    options: [
      {
        id: "marketing",
        label: "Marketing and social pressure",
        reflection: "Exactly! Advertising and social influences often make us believe we need products or services that are actually wants.",
        isCorrect: true,
      },
      {
        id: "urgency",
        label: "True urgency and necessity",
        reflection: "Real needs don't become wants due to urgency - they remain genuine needs regardless of timing.",
        isCorrect: false,
      },
      {
        id: "price",
        label: "Lower prices make it seem essential",
        reflection: "Price doesn't determine if something is a need versus a want - these are based on actual necessity for survival/function.",
        isCorrect: false,
      },
      {
        id: "quality",
        label: "Higher quality always means necessity",
        reflection: "Quality doesn't transform wants into needs - the distinction is based on whether something is essential for basic functioning.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "Why is it important to distinguish between wants and needs?",
    options: [
     
      {
        id: "status",
        label: "It increases your social status",
        reflection: "While others might notice your financial discipline, the primary benefit is personal financial security, not status.",
        isCorrect: false,
      },
       {
        id: "budget",
        label: "It helps prioritize your budget",
        reflection: "Perfect! Distinguishing between wants and needs ensures you cover essentials first before allocating money to non-essentials.",
        isCorrect: true,
      },
      {
        id: "complexity",
        label: "It makes budgeting more complex",
        reflection: "Actually, distinguishing needs from wants simplifies budgeting by creating clear priorities for spending decisions.",
        isCorrect: false,
      },
      {
        id: "shopping",
        label: "It encourages more shopping",
        reflection: "Recognizing the difference between wants and needs typically leads to more intentional spending, not more shopping.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "How should you handle wants that feel urgent?",
    options: [
      
      {
        id: "immediate",
        label: "Purchase immediately to avoid missing out",
        reflection: "Buying immediately based on urgency often leads to regret and unnecessary purchases that strain your budget.",
        isCorrect: false,
      },
      {
        id: "borrow",
        label: "Borrow money if you can't afford it",
        reflection: "Borrowing for wants can create debt cycles and financial stress that could be avoided by waiting.",
        isCorrect: false,
      },
      {
        id: "wait",
        label: "Wait 24-48 hours before purchasing",
        reflection: "Excellent! Waiting helps separate emotional desire from actual need, reducing impulse purchases.",
        isCorrect: true,
      },
      {
        id: "ignore",
        label: "Ignore the feeling completely",
        reflection: "Completely ignoring wants isn't sustainable - it's better to acknowledge them but delay gratification until you can afford them.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What's the best approach to managing wants?",
    options: [
      
      {
        id: "deny",
        label: "Deny all wants completely",
        reflection: "Completely denying wants is unsustainable and can lead to financial rebellion or stress in the long term.",
        isCorrect: false,
      },
      {
        id: "prioritize",
        label: "Prioritize wants over needs",
        reflection: "Prioritizing wants over needs can lead to financial instability and inability to meet essential obligations.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore the distinction and buy what you want",
        reflection: "Ignoring the distinction between wants and needs often leads to financial stress and inability to cover essential expenses.",
        isCorrect: false,
      },
      {
        id: "balance",
        label: "Balance wants with needs after covering essentials",
        reflection: "Perfect! Once needs are covered, you can thoughtfully allocate money toward reasonable wants without financial stress.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
];

const WantsDisguisedAsNeeds = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-11";
  const gameContent = t("financial-literacy.young-adult.wants-disguised-as-needs", { returnObjects: true });
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
  const subtitle = t("financial-literacy.young-adult.wants-disguised-as-needs.subtitleProgress", {
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
                    <span>{t("financial-literacy.young-adult.wants-disguised-as-needs.choiceLabel", { id: String(option.id || "").toUpperCase() })}</span>
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
                      {t("financial-literacy.young-adult.wants-disguised-as-needs.fullRewardHint", { total: totalStages })}
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
                {t("financial-literacy.young-adult.wants-disguised-as-needs.fullRewardHint", { total: totalStages })}
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

export default WantsDisguisedAsNeeds;