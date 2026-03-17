import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const MULTIPLE_INCOME_STREAMS_STAGES = [
  {
    id: 1,
    prompt: "Multiple incomes are helpful when:",
    options: [
      {
        id: "a",
        label: "They distract from main career",
        reflection: "Multiple incomes that distract from your main career can actually harm your primary earning potential and long-term growth.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "They require no effort",
        reflection: "Income streams that require no effort are rare and often unsustainable. Legitimate multiple incomes still require work and management.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "They complement main skills",
        reflection: "Exactly! Multiple income streams work best when they complement and enhance your main skills, creating synergies and reducing risk.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "They are completely unrelated",
        reflection: "Completely unrelated income streams can be difficult to manage and may not provide the stability or growth benefits you're seeking.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 2,
    prompt: "When should you consider multiple income streams?",
    options: [
      {
        id: "a",
        label: "Immediately when starting out",
        reflection: "Starting with multiple income streams immediately can spread you too thin and prevent you from developing expertise in your main career.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "After establishing your main career",
        reflection: "Perfect! Establishing your main career first provides a stable foundation and the skills needed to successfully manage additional income streams.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Only when your main job fails",
        reflection: "Waiting until your main job fails puts you in a vulnerable position. Proactive diversification is better than reactive scrambling.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Never, focus only on one income",
        reflection: "While focusing on one income can be wise early on, having multiple complementary streams can provide security and growth opportunities later.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 3,
    prompt: "What's the benefit of related income streams?",
    options: [
      {
        id: "a",
        label: "Shared skills and networks",
        reflection: "Exactly! Related income streams leverage your existing expertise, reducing the learning curve and allowing for better resource utilization.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "More time spent on each",
        reflection: "Related income streams often share skills, networks, and resources, which can actually make them more efficient to manage together.",
        isCorrect: false,
      },
      
      {
        id: "c",
        label: "Less overall income",
        reflection: "Related income streams typically increase total income by leveraging your strengths rather than diluting them across unrelated areas.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "More complexity to manage",
        reflection: "While there is some management complexity, related streams often simplify overall management through shared systems and processes.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 4,
    prompt: "How should you approach income diversification?",
    options: [
      {
        id: "a",
        label: "Jump into many unrelated streams",
        reflection: "Jumping into many unrelated streams can lead to overwhelm, poor performance, and actually reduce your total earning potential.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Quit your main job first",
        reflection: "Quitting your main job before establishing additional streams creates unnecessary financial risk and pressure.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Only pursue high-risk options",
        reflection: "High-risk options alone don't constitute a smart diversification strategy. Balance and gradual growth are more sustainable approaches.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Start with one, add gradually",
        reflection: "Excellent! Starting with one main income and gradually adding complementary streams allows for proper focus and sustainable growth.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
  {
    id: 5,
    prompt: "What's the key to successful multiple incomes?",
    options: [
      {
        id: "a",
        label: "Maximizing the number of streams",
        reflection: "More streams don't automatically mean more success. Quality and compatibility matter more than quantity.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Equal time for each stream",
        reflection: "Equal time allocation isn't always optimal. Some streams may require more attention initially, while others can run more passively over time.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Strategic alignment and balance",
        reflection: "Perfect! Successful multiple income strategies involve strategic alignment with your skills and goals, plus proper balance to avoid burnout.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Quick setup with no planning",
        reflection: "Quick setup without proper planning often leads to failure. Successful multiple income strategies require thoughtful development and management.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
];

const MultipleIncomeStreams = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-79";
  const gameContent = t(
    "financial-literacy.young-adult.multiple-income-streams",
    { returnObjects: true }
  );
  const stages = Array.isArray(gameContent?.stages) ? gameContent.stages : [];
  const totalStages = stages.length;
  const successThreshold = totalStages;
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 20;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 20;
  const totalXp = gameData?.xp || location.state?.totalXp || 40;
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

  const reflectionPrompts = Array.isArray(gameContent?.reflectionPrompts)
    ? gameContent.reflectionPrompts
    : [];

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
    
    // Update coins if the answer is correct
    if (option.isCorrect) {
      setCoins(prevCoins => prevCoins + 1);
    }
    
    // Wait for the reflection period before allowing to proceed
    setTimeout(() => {
      setCanProceed(true);
    }, 1500);
    
    // Handle the final stage separately
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

  const subtitle =
    gameContent?.subtitleProgress
      ?.replace("{{current}}", Math.min(currentStage + 1, totalStages || 1))
      ?.replace("{{total}}", totalStages || 1) ||
    `Stage ${Math.min(currentStage + 1, totalStages || 1)} of ${totalStages || 1}`;
  const stage =
    stages.length > 0
      ? stages[Math.min(currentStage, stages.length - 1)]
      : null;
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title={gameContent?.title || "Multiple Income Streams"}
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={totalStages || 0}
      currentLevel={Math.min(currentStage + 1, totalStages || 1)}
      totalLevels={totalStages || 1}
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
            <span>{gameContent?.scenarioLabel || "Scenario"}</span>
            <span>{gameContent?.scenarioValue || "Multiple Income"}</span>
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
                    <span>
                      {(gameContent?.choiceLabel || "Choice {{id}}").replace(
                        "{{id}}",
                        option.id.toUpperCase()
                      )}
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
                {gameContent?.reflectionTitle || "Reflection"}
              </h4>
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
                      {gameContent?.continueButton || "Continue"}
                    </button>
                  ) : (
                    <div className="py-2 px-6 text-white font-semibold">
                      {gameContent?.readingLabel || "Reading..."}
                    </div>
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
                    {gameContent?.skillUnlockedLabel || "Skill unlocked:"}{" "}
                    <strong>{gameContent?.skillName || "Income stream strategy"}</strong>
                  </p>
                  {!hasPassed && (
                    <p className="text-xs text-amber-300">
                      {gameContent?.fullRewardHint
                        ? gameContent.fullRewardHint.replace(
                            "{{total}}",
                            totalStages
                          )
                        : `Answer all ${totalStages} choices correctly to earn the full reward.`}
                    </p>
                  )}
                  {!hasPassed && (
                    <button
                      onClick={handleRetry}
                      className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 font-semibold shadow-lg hover:opacity-90"
                    >
                      {gameContent?.tryAgainButton || "Try Again"}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
         
        </div>
        {showResult && (
          <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
            <h4 className="text-lg font-semibold text-white">
              {gameContent?.reflectionPromptsTitle || "Reflection Prompts"}
            </h4>
            <ul className="text-sm list-disc list-inside space-y-1">
              {reflectionPrompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
            <p className="text-sm text-white/70">
              {gameContent?.skillUnlockedLabel || "Skill unlocked:"}{" "}
              <strong>{gameContent?.skillName || "Income stream strategy"}</strong>
            </p>
            {!hasPassed && (
              <p className="text-xs text-amber-300">
                {gameContent?.fullRewardHint
                  ? gameContent.fullRewardHint.replace("{{total}}", totalStages)
                  : `Answer all ${totalStages} choices correctly to earn the full reward.`}
              </p>
            )}
            {!hasPassed && (
              <button
                onClick={handleRetry}
                className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 font-semibold shadow-lg hover:opacity-90"
              >
                {gameContent?.tryAgainButton || "Try Again"}
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default MultipleIncomeStreams;