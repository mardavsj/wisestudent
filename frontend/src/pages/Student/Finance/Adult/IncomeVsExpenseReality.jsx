import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt:
      "You earn ₹18,000 but expenses are ₹20,000. What is the immediate truth?",
    options: [
      {
        id: "saving",
        label: "You are saving money",
        description: "Surplus builds security, deficit hurts it.",
        isCorrect: false,
      },
      {
        id: "overspending",
        label: "You are spending more than you earn",
        description: "Deficits chip away at future stability.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt:
      "How should you respond when take-home < expenses on a month?",
    options: [
      {
        id: "pause",
        label: "Pause discretionary purchases immediately",
        description: "Reducing wants helps balance the ledger.",
        isCorrect: true,
      },
      {
        id: "splurge",
        label: "Enjoy now, handle shortfall later",
        description: "Debt grows when you ignore reality.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "What budgeting step keeps you in control?",
    options: [
      {
        id: "track",
        label: "Track every expense and compare to income",
        description: "Data reveals where cuts reduce the gap.",
        isCorrect: true,
      },
      {
        id: "ignore",
        label: "Ignore statements until payday",
        description: "Untracked spending hides painful surprises.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "If subscriptions eat into your income, you would:",
    options: [
      {
        id: "trim",
        label: "Trim or pause subscriptions that aren’t essential",
        description: "Every paused service frees money for priorities.",
        isCorrect: true,
      },
      {
        id: "keep",
        label: "Keep them because they feel important now",
        description: "Nice perks cost real money when margins are tight.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "When income is less than expense, best next action is:",
    options: [
      {
        id: "rethink",
        label: "Rethink goals and plan a smaller spending target",
        description: "Smart adjustments prevent accumulating debt.",
        isCorrect: true,
      },
      {
        id: "borrow",
        label: "Borrow to cover the exact gap",
        description: "Borrowing without change keeps the gap alive.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = STAGES.length;
const successThreshold = totalStages;

const IncomeVsExpenseReality = () => {
  const location = useLocation();
  const gameId = "finance-adults-1";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const [stageIndex, setStageIndex] = useState(0);
  const [coins, setCoins] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [history, setHistory] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const reflectionPrompts = useMemo(
    () => [
      "Which expense can you postpone while still meeting obligations?",
      "How can you guard next month’s income from a deficit?",
    ],
    []
  );

  const handleSelect = (option) => {
    if (selectedOption || showResult) return;
    resetFeedback();
    const updatedHistory = [
      ...history,
      { stageId: STAGES[stageIndex].id, isCorrect: option.isCorrect },
    ];
    setHistory(updatedHistory);
    setSelectedOption(option.id);
    setTimeout(() => {
      if (stageIndex === totalStages - 1) {
        const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
        const passed = correctCount === successThreshold;
        setFinalScore(correctCount);
        setCoins(passed ? totalCoins : 0);
        setShowResult(true);
      } else {
        setStageIndex((prev) => prev + 1);
        setSelectedOption(null);
      }
    }, 800);
    const points = option.isCorrect ? 1 : 0;
    showCorrectAnswerFeedback(points, option.isCorrect);
  };

  const handleRetry = () => {
    resetFeedback();
    setStageIndex(0);
    setHistory([]);
    setSelectedOption(null);
    setCoins(0);
    setFinalScore(0);
    setShowResult(false);
  };

  const subtitle = `Stage ${Math.min(stageIndex + 1, totalStages)} of ${totalStages}`;
  const stage = STAGES[Math.min(stageIndex, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Income vs Expense Reality"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={totalStages}
      currentLevel={Math.min(stageIndex + 1, totalStages)}
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
          <div className="flex text-sm uppercase tracking-[0.3em] text-white/60 justify-between mb-4">
            <span>Scenario</span>
            <span>Budget Reality</span>
          </div>
          <p className="text-lg text-white/90 mb-6">{stage.prompt}</p>
          <div className="grid gap-4">
            {stage.options.map((option) => {
              const isSelected = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  disabled={!!selectedOption}
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    isSelected
                      ? option.isCorrect
                        ? "border-green-400 bg-emerald-500/20"
                        : "border-red-400 bg-red-500/10 text-white"
                      : "border-white/30 bg-white/5 hover:border-white/60 hover:bg-white/10"
                  }`}
                >
                  <div className="text-sm text-white/70 mb-2">
                    Choice {option.id.toUpperCase()}
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
              Skill unlocked: <strong>Expense awareness</strong>
            </p>
            {!hasPassed && (
              <p className="text-xs text-amber-300">
                Answer every stage smartly to earn the full reward.
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

export default IncomeVsExpenseReality;
