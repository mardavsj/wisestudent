import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const choices = [
  {
    id: "a",
    title: "Ignore the issue and hope next month improves",
    outcome: "Stress repeats every month as the gap stays unaddressed.",
  },
  {
    id: "b",
    title: "Review expenses and identify leaks",
    outcome: "Clarity improves and control increases.",
  },
  {
    id: "c",
    title: "Use credit to manage the gap",
    outcome: "Temporary relief but future pressure builds.",
  },
];

const MonthEndPressure = () => {
  const location = useLocation();
  const gameId = "brain-adults-1";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;

  const [selected, setSelected] = useState(null);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const {
    flashPoints,
    showAnswerConfetti,
    showCorrectAnswerFeedback,
    resetFeedback,
  } = useGameFeedback();

  const handleChoice = (choice) => {
    if (levelCompleted || selected) return;
    setSelected(choice.id);
    resetFeedback();
    setFeedback({
      text: choice.outcome,
      success: true,
    });
    setScore(1);
    showCorrectAnswerFeedback(1, true);
    setLevelCompleted(true);
  };

  const reflectionPrompts = useMemo(
    () => [
      "Which expenses feel unavoidable?",
      "What patterns repeat every month?",
    ],
    []
  );

  useEffect(() => {
    if (levelCompleted) {
      console.log("Completed Month-End Pressure", { score });
    }
  }, [levelCompleted, score]);

  return (
    <GameShell
      title="Month-End Pressure"
      subtitle={
        levelCompleted
          ? "Reflection unlocked"
          : "Choose how you respond to the monthly squeeze"
      }
      score={score}
      currentLevel={1}
      totalLevels={1}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="brain"
      showGameOver={levelCompleted}
      maxScore={1}
      showConfetti={showAnswerConfetti}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-6 max-w-4xl mx-auto p-4">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Scenario</h3>
          <p className="text-white/90 mb-5">
            An adult professional realises expenses outweigh income near month-end
            as bills, EMIs, and daily needs overlap. Decide how you respond to
            the pressure.
          </p>
          <div className="grid gap-3">
            {choices.map((choice) => {
              const isSelected = selected === choice.id;
              return (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice)}
                  disabled={!!selected}
                  className={`rounded-2xl p-4 text-left border transition-all duration-200 ${
                    isSelected
                      ? "border-green-400 bg-green-500/20"
                      : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                  }`}
                >
                  <div className="text-sm uppercase tracking-wider text-white/60 mb-1">
                    Choice {choice.id.toUpperCase()}
                  </div>
                  <p className="text-white font-semibold">{choice.title}</p>
                </button>
              );
            })}
          </div>
          {feedback && (
            <p
              className={`mt-4 text-white/90 text-sm border-l-4 pl-4 py-2 ${
                feedback.success ? "border-green-400" : "border-red-400"
              }`}
            >
              {feedback.text}
            </p>
          )}
        </div>

        {levelCompleted && (
          <div className="bg-white/5 rounded-3xl border border-white/20 p-6">
            <h4 className="text-lg font-semibold text-white mb-3">
              Reflection Prompts
            </h4>
            <ul className="list-disc list-inside space-y-2 text-white/80 text-sm">
              {reflectionPrompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
            <div className="mt-4 text-sm text-white/70">
              Skill unlocked: <strong>Cash flow awareness</strong>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default MonthEndPressure;
