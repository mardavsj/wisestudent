import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FIRST_INCOME_STAGES = [
  {
    id: 1,
    prompt: "You just received your stipend/salary. What does this income represent?",
    options: [
      {
        id: "free",
        label: "Free money to spend however I like",
        description: "The joy of buying anything that catches your eye feels tempting.",
        isCorrect: false,
      },
      {
        id: "responsibility",
        label: "A responsibility to manage wisely",
        description: "This income unlocks freedom only if you plan for needs, savings, and growth.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "Do you treat this income as only for wants or for building a habit?",
    options: [
      {
        id: "wants",
        label: "I earned it—buy whatever I feel like",
        description: "Impulse feels good but can leave you short for tomorrow.",
        isCorrect: false,
      },
      {
        id: "habit",
        label: "Treat it as the first step to a savings habit",
        description: "Split a part for living costs, part for savings, and part for treats.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "Which plan makes the most sense on payday?",
    options: [
      {
        id: "plan",
        label: "Cover needs, automate savings, then allocate fun money",
        description: "Prioritize essentials, then reward yourself with a small treat.",
        isCorrect: true,
      },
      {
        id: "all",
        label: "Spend all to celebrate and worry later",
        description: "Celebration is ok, but burning through a whole stipend risks future stress.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "A family or school deadline coincides with a minor want. What do you choose?",
    options: [
      {
        id: "deadline",
        label: "Handle responsibilities first, postpone the want",
        description: "Delaying small treats keeps you steady for bigger priorities.",
        isCorrect: true,
      },
      {
        id: "want",
        label: "Give in now—stress makes you value the treat",
        description: "Temptation feels relief, but responsibilities remain pending.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "Which reminder keeps this first income meaningful?",
    options: [
      {
        id: "privacy",
        label: "Keep a log of spending and review weekly",
        description: "Tracking builds awareness and reduces surprise expenses.",
        isCorrect: true,
      },
      {
        id: "just",
        label: "Spend without thinking—you deserve it",
        description: "Savoring feels nice but leaves you unprepared for future bills.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = FIRST_INCOME_STAGES.length;
const successThreshold = totalStages;

const FirstIncomeReality = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-1";
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

  const reflectionPrompts = useMemo(
    () => [
      "How can you balance freedom and responsibility when you first earn money?",
      "Which priorities should you protect before spending on wants?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = FIRST_INCOME_STAGES[currentStage];
    const updatedHistory = [
      ...history,
      { stageId: currentStageData.id, isCorrect: option.isCorrect },
    ];
    setHistory(updatedHistory);
    setSelectedOption(option.id);

    if (option.isCorrect) {
      showCorrectAnswerFeedback(currentStageData.reward, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    setTimeout(() => {
      if (currentStage === totalStages - 1) {
        const correctCount = updatedHistory.filter((entry) => entry.isCorrect).length;
        setFinalScore(correctCount);
        const passed = correctCount === totalStages;
        setCoins(passed ? totalCoins : 0);
        setShowResult(true);
      } else {
        setCurrentStage((prev) => prev + 1);
        setSelectedOption(null);
      }
    }, 900);
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

  const subtitle = `Stage ${Math.min(currentStage + 1, totalStages)} of ${totalStages}`;
  const stage = FIRST_INCOME_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="First Income Reality"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={FIRST_INCOME_STAGES.length}
      currentLevel={Math.min(currentStage + 1, FIRST_INCOME_STAGES.length)}
      totalLevels={FIRST_INCOME_STAGES.length}
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
            <span>Scenario</span>
            <span>First Income</span>
          </div>
          <p className="text-lg text-white/90 mb-6">{stage.prompt}</p>
          <div className="grid gap-4">
            {stage.options.map((option) => {
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
                    <span>Choice {option.id.toUpperCase()}</span>
                    <span>
                      {option.isCorrect ? "Responsible" : "Too quick"}
                    </span>
                  </div>
                  <p className="text-white font-semibold">{option.label}</p>
                  <p className="text-white/70 mt-2">{option.description}</p>
                </button>
              );
            })}
          </div>
          <div className="mt-6 text-right text-sm text-white/70">
            Coins collected: <strong>{coins}</strong>
          </div>
        </div>
        {showResult && (
          <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
            <h4 className="text-lg font-semibold text-white">Reflection Prompts</h4>
            <ul className="text-sm list-disc list-inside space-y-1">
              {reflectionPrompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
            <p className="text-sm text-white/70">
              Skill unlocked: <strong>Responsible income mindset</strong>
            </p>
            {!hasPassed && (
              <p className="text-xs text-amber-300">
                Answer all {totalStages} choices correctly to earn the full reward.
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

export default FirstIncomeReality;
