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
    prompt: "A sale tempts you to buy something unplanned. What should you ask?",
    options: [
      {
        id: "cheap",
        label: "Is it cheap?",
        reflection: "Just because something is cheap doesn't mean it's a good purchase if you don't need it. A discount doesn't justify unnecessary purchases.",
        isCorrect: false,
      },
      
      {
        id: "want",
        label: "Will I regret not buying it?",
        reflection: "This can lead to impulse purchases. It's better to focus on actual needs rather than fear of missing out.",
        isCorrect: false,
      },
      {
        id: "need",
        label: "Do I actually need it?",
        reflection: "Perfect! Asking whether you actually need an item is the most important question before making any purchase, regardless of the discount.",
        isCorrect: true,
      },
      {
        id: "trend",
        label: "Is everyone else buying it?",
        reflection: "Following trends or others' purchasing decisions often leads to unnecessary expenses that don't align with your actual needs.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "Why do sales make us want to buy more?",
    options: [
      
      {
        id: "quality",
        label: "Discounted items are usually higher quality",
        reflection: "The quality of an item isn't necessarily improved by being on sale. The discount doesn't guarantee better value.",
        isCorrect: false,
      },
      {
        id: "rare",
        label: "Sale items are rare and unique",
        reflection: "Sale items are often overstocked or seasonal products, not necessarily rare or unique items. The discount doesn't make them inherently valuable.",
        isCorrect: false,
      },
      {
        id: "value",
        label: "Everything on sale is a great deal",
        reflection: "Not everything on sale offers real value. A discounted item is still unnecessary if you don't need it.",
        isCorrect: false,
      },
      {
        id: "urgency",
        label: "Sales create urgency and fear of missing out",
        reflection: "Exactly! Sales tap into psychological triggers like urgency and scarcity, making us feel like we need to act immediately without proper consideration.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "What's the best strategy when encountering an attractive sale?",
    options: [
      {
        id: "list",
        label: "Stick to your planned shopping list",
        reflection: "Perfect! Sticking to a planned list helps you avoid impulse purchases and ensures you only buy what you actually need.",
        isCorrect: true,
      },
      {
        id: "browse",
        label: "Browse and see what catches your eye",
        reflection: "Browsing without a plan increases the likelihood of impulse purchases that may not align with your actual needs.",
        isCorrect: false,
      },
      {
        id: "discount",
        label: "Buy anything with a high discount percentage",
        reflection: "A high discount percentage doesn't make an unnecessary purchase worthwhile. Focus on need, not just the discount.",
        isCorrect: false,
      },
      {
        id: "compare",
        label: "Compare prices across multiple stores",
        reflection: "While comparing prices is good practice, it doesn't address whether the purchase is necessary in the first place.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "How does the 'sale psychology' affect your finances?",
    options: [
      
      {
        id: "savings",
        label: "Sales always help you save money",
        reflection: "Sales only help save money if you were planning to buy the item anyway. Otherwise, they often lead to unplanned spending.",
        isCorrect: false,
      },
      {
        id: "unnecessary",
        label: "Discounts don't justify unnecessary purchases",
        reflection: "Exactly! Discounts can mask the fact that an item is still unnecessary. The core principle is that a good deal on something you don't need is still a bad purchase.",
        isCorrect: true,
      },
      {
        id: "investment",
        label: "Sale items are always good investments",
        reflection: "Most consumer goods depreciate over time, regardless of discounts. Few items bought on sale maintain or increase their value.",
        isCorrect: false,
      },
      {
        id: "priority",
        label: "Sale items should be top priority",
        reflection: "Just because something is on sale doesn't mean it should take priority over items you actually need. Needs should always come first.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What question should you ask before buying anything on sale?",
    options: [
      
      {
        id: "money",
        label: "Do I have enough money for this?",
        reflection: "While budget is important, having money available doesn't justify an unnecessary purchase. The focus should be on need, not just affordability.",
        isCorrect: false,
      },
      {
        id: "others",
        label: "Would others think this is a good deal?",
        reflection: "Others' opinions shouldn't drive your purchasing decisions. Focus on your actual needs rather than external validation.",
        isCorrect: false,
      },
      {
        id: "need2",
        label: "Would I buy this at full price if I really needed it?",
        reflection: "Perfect! This question helps you evaluate whether the item has real value to you, regardless of the discount. It focuses on actual need rather than the attraction of a deal.",
        isCorrect: true,
      },
      {
        id: "brand",
        label: "Is this a reputable brand?",
        reflection: "Brand reputation doesn't change whether an item is necessary for you. Even reputable brands sell items you may not need.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const SalePsychology = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-15";
  const gameContent = t("financial-literacy.young-adult.sale-psychology", { returnObjects: true });
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
  const subtitle = t("financial-literacy.young-adult.sale-psychology.subtitleProgress", {
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
                    <span>{t("financial-literacy.young-adult.sale-psychology.choiceLabel", { id: String(option.id || "").toUpperCase() })}</span>
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
                      {t("financial-literacy.young-adult.sale-psychology.fullRewardHint", { total: totalStages })}
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
                {t("financial-literacy.young-adult.sale-psychology.fullRewardHint", { total: totalStages })}
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

export default SalePsychology;