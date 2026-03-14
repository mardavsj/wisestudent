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
    prompt: "Is it okay to borrow for wants?",
    options: [
      {
        id: "yes",
        label: "Yes, borrowing enables lifestyle",
        reflection: "Borrowing for wants creates debt obligations that can limit future financial freedom and opportunities.",
        isCorrect: false,
      },
      {
        id: "no",
        label: "No, it creates unnecessary stress",
        reflection: "Exactly! Wants should be funded by current income rather than creating long-term financial obligations.",
        isCorrect: true,
      },
      {
        id: "sometimes",
        label: "Sometimes when deals are good",
        reflection: "Even attractive deals create debt obligations that compound over time and reduce financial flexibility.",
        isCorrect: false,
      },
      {
        id: "investment",
        label: "Yes, if it's an investment",
        reflection: "True investments increase future earning potential - lifestyle wants typically depreciate rather than appreciate.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What's the real cost of borrowing for wants?",
    options: [
      {
        id: "interest",
        label: "Just the interest charges",
        reflection: "Interest is only part of the cost - borrowing also creates psychological stress and limits future financial choices.",
        isCorrect: false,
      },
     
      {
        id: "flexibility",
        label: "Loss of financial flexibility",
        reflection: "Reduced flexibility is a major consequence, but the opportunity cost of foregone goals is often more significant.",
        isCorrect: false,
      },
      {
        id: "credit",
        label: "Damage to credit score",
        reflection: "While credit impact matters, the fundamental issue is creating obligations for non-essential purchases.",
        isCorrect: false,
      },
       {
        id: "opportunity",
        label: "Opportunity cost of other goals",
        reflection: "Perfect! Money spent on want repayments could fund education, travel, or emergency savings instead.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "How should you handle want cravings with limited money?",
    options: [
      {
        id: "borrow",
        label: "Borrow to satisfy immediately",
        reflection: "Immediate satisfaction through borrowing creates long-term financial burden that outweighs temporary pleasure.",
        isCorrect: false,
      },
     
      {
        id: "ignore",
        label: "Ignore all wants completely",
        reflection: "Complete denial can create resentment and doesn't address the underlying need for reasonable enjoyment.",
        isCorrect: false,
      },
       {
        id: "save",
        label: "Save up and buy when affordable",
        reflection: "Exactly! Saving builds patience and ensures purchases are truly valued rather than impulse-driven.",
        isCorrect: true,
      },
      {
        id: "alternatives",
        label: "Find free or cheaper alternatives",
        reflection: "While resourceful, alternatives may not provide the genuine satisfaction that makes certain wants worthwhile.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What's the psychological impact of want-based debt?",
    options: [
      {
        id: "freedom",
        label: "Increases financial freedom",
        reflection: "Want-based debt actually reduces freedom by creating ongoing obligations and limiting future choices.",
        isCorrect: false,
      },
      {
        id: "stress",
        label: "Creates ongoing mental stress",
        reflection: "Exactly! Debt for non-essentials creates persistent anxiety about repayment and financial security.",
        isCorrect: true,
      },
      {
        id: "motivation",
        label: "Motivates harder work",
        reflection: "While debt might motivate some, it more commonly creates stress that impedes rather than enhances productivity.",
        isCorrect: false,
      },
      {
        id: "normal",
        label: "Becomes normal spending behavior",
        reflection: "Normalization of debt for wants creates unhealthy financial habits that compound over time.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "How can you distinguish needs from wants when borrowing?",
    options: [
      {
        id: "essential",
        label: "Essential survival and obligations only",
        reflection: "Perfect! Needs are objectively necessary for health, shelter, and meeting existing commitments.",
        isCorrect: true,
      },
      {
        id: "urgent",
        label: "Anything that feels urgent",
        reflection: "Urgency often reflects emotion rather than necessity - true needs relate to survival and basic functioning.",
        isCorrect: false,
      },
      
      {
        id: "future",
        label: "Investments in future happiness",
        reflection: "Future happiness investments should increase capability or earning potential rather than just provide temporary pleasure.",
        isCorrect: false,
      },
      {
        id: "social",
        label: "Keeping up with social expectations",
        reflection: "Social expectations often promote spending beyond means and create financial stress rather than genuine fulfillment.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const BorrowingForWants = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-35";
  const gameContent = t("financial-literacy.young-adult.borrowing-for-wants", { returnObjects: true });
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
  const subtitle = t("financial-literacy.young-adult.borrowing-for-wants.subtitleProgress", {
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
                    <span>{t("financial-literacy.young-adult.borrowing-for-wants.choiceLabel", { id: String(option.id || "").toUpperCase() })}</span>
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
                      {t("financial-literacy.young-adult.borrowing-for-wants.fullRewardHint", { total: totalStages })}
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
                {t("financial-literacy.young-adult.borrowing-for-wants.fullRewardHint", { total: totalStages })}
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

export default BorrowingForWants;