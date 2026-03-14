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
    prompt: "Why track lifestyle expenses?",
    options: [
      {
        id: "restrict",
        label: "To restrict fun",
        reflection: "Tracking expenses isn't about restricting fun, but rather about understanding where your money goes to make informed decisions.",
        isCorrect: false,
      },
      
      {
        id: "control",
        label: "To maintain complete control over spending",
        reflection: "While tracking does provide more control, the primary benefit is awareness of spending patterns rather than rigid control.",
        isCorrect: false,
      },
      {
        id: "limit",
        label: "To limit all discretionary spending",
        reflection: "Tracking isn't about limiting all discretionary spending, but rather understanding it to make better financial decisions.",
        isCorrect: false,
      },
      {
        id: "overspending",
        label: "To avoid overspending unknowingly",
        reflection: "Exactly! Tracking expenses helps you become aware of your spending patterns and avoid overspending on lifestyle items without realizing it.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What happens when you don't track lifestyle spending?",
    options: [
      
      {
        id: "savings",
        label: "More money gets saved automatically",
        reflection: "Without tracking, spending often increases unknowingly, which typically reduces savings rather than increasing them.",
        isCorrect: false,
      },
      {
        id: "unawareness",
        label: "Overspending occurs without awareness",
        reflection: "Exactly! Without tracking, it's easy to overspend on lifestyle items without realizing how much is actually being spent.",
        isCorrect: true,
      },
      {
        id: "budgeting",
        label: "Better budgeting happens naturally",
        reflection: "Effective budgeting requires awareness of spending patterns, which comes from tracking expenses.",
        isCorrect: false,
      },
      {
        id: "planning",
        label: "Financial planning becomes easier",
        reflection: "Financial planning becomes more difficult without awareness of actual spending patterns.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "How does tracking lifestyle expenses help financially?",
    options: [
      
      {
        id: "restriction",
        label: "Restricts all non-essential purchases",
        reflection: "Tracking doesn't restrict purchases but rather provides insight to make more informed decisions about non-essentials.",
        isCorrect: false,
      },
      {
        id: "automation",
        label: "Automatically reduces expenses",
        reflection: "Tracking itself doesn't reduce expenses, but awareness from tracking can lead to more conscious spending decisions.",
        isCorrect: false,
      },
      {
        id: "awareness",
        label: "Creates awareness of spending patterns",
        reflection: "Perfect! Tracking creates awareness of spending patterns, which is the first step toward making more intentional financial decisions.",
        isCorrect: true,
      },
      {
        id: "elimination",
        label: "Eliminates all lifestyle spending",
        reflection: "Tracking doesn't eliminate lifestyle spending but helps ensure it aligns with your financial goals.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "What's the relationship between tracking and financial regret?",
    options: [
      
      {
        id: "causes",
        label: "Tracking causes more financial regret",
        reflection: "Tracking actually reduces financial regret by helping you understand and control your spending patterns.",
        isCorrect: false,
      },
      {
        id: "increases",
        label: "Tracking increases regret about spending",
        reflection: "Rather than increasing regret, tracking helps prevent regret by providing awareness of spending patterns.",
        isCorrect: false,
      },
      {
        id: "avoids",
        label: "Avoiding tracking prevents regret",
        reflection: "Avoiding tracking often leads to more regret as you may spend more than intended without realizing it.",
        isCorrect: false,
      },
      {
        id: "prevents",
        label: "Awareness prevents regret",
        reflection: "Exactly! Awareness through tracking helps prevent financial regret by enabling you to make conscious decisions about your spending.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What's the best approach to tracking lifestyle expenses?",
    options: [
      {
        id: "consistent",
        label: "Track consistently to maintain awareness",
        reflection: "Perfect! Consistent tracking maintains awareness of spending patterns, helping prevent overspending and financial regret.",
        isCorrect: true,
      },
      {
        id: "occasional",
        label: "Track only when money feels tight",
        reflection: "Waiting until money feels tight means you've likely already overspent. Regular tracking prevents this situation.",
        isCorrect: false,
      },
      {
        id: "random",
        label: "Track expenses randomly throughout the month",
        reflection: "Random tracking doesn't provide a complete picture of spending patterns. Consistency is key for awareness.",
        isCorrect: false,
      },
      {
        id: "after",
        label: "Track only after making purchases",
        reflection: "While post-purchase tracking is better than nothing, real-time tracking provides better awareness and control.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const TrackingLifestyleCosts = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-19";
  const gameContent = t("financial-literacy.young-adult.tracking-lifestyle-costs", { returnObjects: true });
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
  const subtitle = t("financial-literacy.young-adult.tracking-lifestyle-costs.subtitleProgress", {
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
                    <span>{t("financial-literacy.young-adult.tracking-lifestyle-costs.choiceLabel", { id: String(option.id || "").toUpperCase() })}</span>
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
                      {t("financial-literacy.young-adult.tracking-lifestyle-costs.fullRewardHint", { total: totalStages })}
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
                {t("financial-literacy.young-adult.tracking-lifestyle-costs.fullRewardHint", { total: totalStages })}
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

export default TrackingLifestyleCosts;