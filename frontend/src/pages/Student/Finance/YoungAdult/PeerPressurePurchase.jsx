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
    prompt: "Friends push you to spend beyond comfort. What's best?",
    options: [
      {
        id: "follow",
        label: "Follow them",
        reflection: "Following friends beyond your comfort zone can lead to financial stress and spending that doesn't align with your personal goals.",
        isCorrect: false,
      },
      {
        id: "limits",
        label: "Stick to your limits",
        reflection: "Exactly! Sticking to your financial limits shows financial maturity and helps maintain your financial health regardless of peer pressure.",
        isCorrect: true,
      },
      {
        id: "sometimes",
        label: "Sometimes follow, sometimes say no",
        reflection: "While flexibility has merit, consistently adhering to your financial limits is more important for maintaining financial health.",
        isCorrect: false,
      },
      {
        id: "more",
        label: "Spend even more to show I can afford it",
        reflection: "Trying to outspend friends to prove financial capability often leads to financial strain and unnecessary competition.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "How does peer pressure affect your financial decisions?",
    options: [
      {
        id: "pressure",
        label: "It can push you to make unwise spending choices",
        reflection: "Exactly! Peer pressure can lead to unwise spending choices that don't align with your financial goals or budget.",
        isCorrect: true,
      },
      {
        id: "improves",
        label: "It improves your financial decision-making",
        reflection: "Peer pressure typically doesn't improve financial decision-making as it often encourages spending beyond comfort zones.",
        isCorrect: false,
      },
      {
        id: "motivates",
        label: "It motivates better financial habits",
        reflection: "Peer pressure usually motivates spending to match others rather than developing better financial habits.",
        isCorrect: false,
      },
      {
        id: "inspires",
        label: "It inspires more responsible spending",
        reflection: "Peer pressure usually inspires competitive spending rather than more responsible financial behavior.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "What's the wisest way to handle group spending activities?",
    options: [
      
      {
        id: "match",
        label: "Match what others are spending",
        reflection: "Matching others' spending can lead to financial stress if their budgets are different from yours.",
        isCorrect: false,
      },
      {
        id: "plan",
        label: "Plan ahead and stick to your budget",
        reflection: "Perfect! Planning ahead and sticking to your budget allows you to participate while maintaining financial control.",
        isCorrect: true,
      },
      {
        id: "compete",
        label: "Compete to show financial capability",
        reflection: "Competing financially with others often leads to unnecessary spending and financial stress.",
        isCorrect: false,
      },
      {
        id: "avoid",
        label: "Avoid all group spending activities",
        reflection: "Avoiding all group activities might protect finances but could limit social connections. Planning ahead is a better balance.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "How can you maintain friendships while managing peer pressure?",
    options: [
      
      {
        id: "agree",
        label: "Agree to all spending suggestions to maintain harmony",
        reflection: "Always agreeing to spending suggestions can harm your finances and may not create genuine respect in friendships.",
        isCorrect: false,
      },
      {
        id: "hide",
        label: "Hide your financial limitations from friends",
        reflection: "Hiding financial limitations can lead to situations where you're forced to spend beyond your means.",
        isCorrect: false,
      },
      {
        id: "confidence",
        label: "Financial confidence includes saying no",
        reflection: "Exactly! Having financial confidence to say no when needed helps maintain both your finances and your self-respect in relationships.",
        isCorrect: true,
      },
      {
        id: "judge",
        label: "Judge friends who spend differently than you",
        reflection: "Judging friends' spending habits won't help with peer pressure and may damage relationships.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What strategy helps resist peer pressure to overspend?",
    options: [
     
      {
        id: "blame",
        label: "Blame others for your spending decisions",
        reflection: "Blaming others for your spending decisions removes your personal financial responsibility and doesn't address peer pressure.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore your financial limits temporarily",
        reflection: "Ignoring financial limits, even temporarily, can lead to financial stress and doesn't build lasting financial confidence.",
        isCorrect: false,
      },
      {
        id: "justify",
        label: "Justify overspending as relationship investments",
        reflection: "Consistently justifying overspending as relationship investments can lead to financial stress and unsustainable habits.",
        isCorrect: false,
      },
       {
        id: "prepare",
        label: "Prepare responses for social spending situations",
        reflection: "Perfect! Preparing responses helps you stick to your financial limits while maintaining relationships and confidence.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
];

const PeerPressurePurchase = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-18";
  const gameContent = t("financial-literacy.young-adult.peer-pressure-purchase", { returnObjects: true });
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
  const subtitle = t("financial-literacy.young-adult.peer-pressure-purchase.subtitleProgress", {
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
                    <span>{t("financial-literacy.young-adult.peer-pressure-purchase.choiceLabel", { id: String(option.id || "").toUpperCase() })}</span>
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
                      {t("financial-literacy.young-adult.peer-pressure-purchase.fullRewardHint", { total: totalStages })}
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
                {t("financial-literacy.young-adult.peer-pressure-purchase.fullRewardHint", { total: totalStages })}
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

export default PeerPressurePurchase;