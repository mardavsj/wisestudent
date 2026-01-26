import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Financial literacy helps people:",
    options: [
      {
        id: "earn",
        label: "Earn more money only",
        reflection: "Earning money is important, but managing it wisely is the key to financial literacy.",
        isCorrect: false,
      },
      {
        id: "manage",
        label: "Manage earning, spending, saving, and borrowing wisely",
        reflection: "Exactly! Financial literacy is about understanding how all aspects of money work together.",
        isCorrect: true,
      },
      {
        id: "spend",
        label: "Spend without tracking expenses",
        reflection: "Without tracking expenses, you can't understand where your money goes or make informed decisions.",
        isCorrect: false,
      },
      {
        id: "invest",
        label: "Focus only on investments, ignore budgeting",
        reflection: "Investing is important, but without budgeting, you may invest more than you can afford.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What action shows strong financial literacy?",
    options: [
      {
        id: "plan",
        label: "Compare needs and wants before spending",
        reflection: "Great! Planning before spending is a fundamental principle of financial literacy.",
        isCorrect: true,
      },
      {
        id: "spend",
        label: "Spend quickly on anything that feels good",
        reflection: "Impulse spending without planning often leads to financial difficulties.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore bills until they become urgent",
        reflection: "Ignoring bills can lead to late fees, penalties, and credit damage.",
        isCorrect: false,
      },
      {
        id: "borrow",
        label: "Borrow money for all major purchases",
        reflection: "While borrowing can be part of financial planning, it should be done carefully and strategically.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "How does saving fit into literacy?",
    options: [
     
      {
        id: "later",
        label: "Save later if anything is left over",
        reflection: "Saving at the end often means there's nothing left to save.",
        isCorrect: false,
      },
      {
        id: "never",
        label: "Never save, spend everything earned",
        reflection: "Without savings, you're vulnerable to unexpected expenses and emergencies.",
        isCorrect: false,
      },
       {
        id: "save",
        label: "Reserve part of every income before spending",
        reflection: "Yes! Paying yourself first is a cornerstone of financial stability.",
        isCorrect: true,
      },
      {
        id: "random",
        label: "Save randomly when feeling rich",
        reflection: "Random saving is unreliable; consistent saving builds financial security.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "Borrowing smartly means:",
    options: [
      
      {
        id: "want",
        label: "Borrow for every desire",
        reflection: "Borrowing for wants rather than needs can lead to overwhelming debt.",
        isCorrect: false,
      },
      {
        id: "always",
        label: "Always borrow for big purchases",
        reflection: "Sometimes saving for big purchases is more financially prudent than borrowing.",
        isCorrect: false,
      },
      {
        id: "anyway",
        label: "Borrow anyway regardless of ability to repay",
        reflection: "Borrowing without considering repayment ability is financially dangerous.",
        isCorrect: false,
      },
      {
        id: "need",
        label: "Only borrow when it fits your repayment plan",
        reflection: "That's right! Responsible borrowing considers your ability to repay.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "Financial literacy keeps you ready for:",
    options: [
      {
        id: "crisis",
        label: "Unexpected expenses and long-term goals",
        reflection: "Perfect! Financial literacy prepares you for both challenges and opportunities.",
        isCorrect: true,
      },
      {
        id: "luck",
        label: "Only the luckiest months",
        reflection: "Financial planning shouldn't rely on luck; it requires preparation and strategy.",
        isCorrect: false,
      },
      {
        id: "debt",
        label: "Accumulating as much debt as possible",
        reflection: "Accumulating debt without purpose is financially harmful, not literate.",
        isCorrect: false,
      },
      {
        id: "panic",
        label: "Making panicked financial decisions",
        reflection: "Financial literacy promotes thoughtful decision-making, not panic-driven choices.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = STAGES.length;
const successThreshold = totalStages;

const WhatIsFinancialLiteracy = () => {
  const location = useLocation();
  const gameId = "finance-adults-2";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const [stageIndex, setStageIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [coins, setCoins] = useState(0);
  const [history, setHistory] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [canProceed, setCanProceed] = useState(false);

  const reflectionPrompts = useMemo(
    () => [
      "How can saving and borrowing decisions work together for stability?",
      "Which habit will keep your spending aligned with your income?",
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
    }, 1500); // Wait 2.5 seconds before allowing to proceed
    
    // Handle the final stage separately
    if (stageIndex === totalStages - 1) {
      setTimeout(() => {
        const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
        const passed = correctCount === successThreshold;
        setFinalScore(correctCount);
        setCoins(passed ? totalCoins : 0); // Set final coins based on performance
        setShowResult(true);
      }, 2500); // Wait longer before showing final results
    }
    
    const points = option.isCorrect ? 1 : 0;
    showCorrectAnswerFeedback(points, option.isCorrect);
  };

  const handleRetry = () => {
    resetFeedback();
    setStageIndex(0);
    setSelectedOption(null);
    setCoins(0);
    setHistory([]);
    setFinalScore(0);
    setShowResult(false);
  };

  const subtitle = `Stage ${Math.min(stageIndex + 1, totalStages)} of ${totalStages}`;
  const stage = STAGES[Math.min(stageIndex, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="What Is Financial Literacy?"
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
          <div className="flex justify-between items-center mb-4 text-sm uppercase tracking-[0.3em] text-white/60">
            <span>Scenario</span>
            <span>Financial Literacy</span>
          </div>
          <p className="text-lg text-white/90 mb-6">{stage.prompt}</p>
          <div className="grid grid-cols-2 gap-4">
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
                        ? "border-emerald-400 bg-emerald-500/20"
                        : "border-red-400 bg-red-500/10 text-white"
                      : "border-white/30 bg-white/5 hover:border-white/60 hover:bg-white/10"
                  }`}
                >
                  <div className="text-sm text-white/70 mb-2">
                    Choice {option.id.toUpperCase()}
                  </div>
                  <p className="text-white font-semibold">{option.label}</p>
                  
                </button>
              );
            })}
          </div>
          <div className="mt-6 text-right text-sm text-white/70">
            Coins collected: <strong>{coins}</strong>
          </div>
        </div>
        {(showResult || showFeedback) && (
          <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
            <h4 className="text-lg font-semibold text-white">Reflection</h4>
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
                      if (stageIndex < totalStages - 1) {
                        setStageIndex((prev) => prev + 1);
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
                  <div className="py-2 px-6 text-white font-semibold">Reading...</div>
                )}
              </div>
            )}
            {/* Automatically advance if we're in the last stage and the timeout has passed */}
            {!showResult && stageIndex === totalStages - 1 && canProceed && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => {
                    const updatedHistory = [
                      ...history,
                      { stageId: STAGES[stageIndex].id, isCorrect: STAGES[stageIndex].options.find(opt => opt.id === selectedOption)?.isCorrect },
                    ];
                    const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
                    const passed = correctCount === successThreshold;
                    setFinalScore(correctCount);
                    setCoins(passed ? totalCoins : 0);
                    setShowResult(true);
                  }}
                  className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-6 font-semibold shadow-lg hover:opacity-90"
                >
                  Finish
                </button>
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
                  Skill unlocked: <strong>Holistic money awareness</strong>
                </p>
                {!hasPassed && (
                  <p className="text-xs text-amber-300">
                    Answer every stage sharply to earn the full reward.
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
    </GameShell>
  );
};

export default WhatIsFinancialLiteracy;
