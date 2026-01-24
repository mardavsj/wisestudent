import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const choices = [
  {
    id: "a",
    title: "Agree to help everyone despite feeling drained",
    outcome:
      "Stress spikes and energy drops when you keep stretching yourself thin.",
  },
  {
    id: "b",
    title: "Say no politely and explain your limits",
    outcome:
      "Respectful boundaries reduce the load while keeping relationships intact.",
  },
  {
    id: "c",
    title: "Ignore messages to avoid confrontation",
    outcome:
      "Temporary relief gives way to tension later because nothing is resolved.",
  },
];

const SayingYesAgain = () => {
  const location = useLocation();
  const gameId = "brain-young-adult-2";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel =
    gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins =
    gameData?.coins || location.state?.totalCoins || 5;
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
      "Why does saying no feel difficult?",
      "What happens when personal limits are ignored?",
    ],
    []
  );

  useEffect(() => {
    if (levelCompleted) {
      console.log("Completed Saying Yes Again", { score });
    }
  }, [levelCompleted, score]);

  return (
    <GameShell
      title="Saying Yes Again"
      subtitle={
        levelCompleted
          ? "Reflection unlocked"
          : "Decide how to respond to new requests"
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
            A young adult juggling studies and work keeps hearing friends ask
            for favors. Guilt about saying no is building pressure on top of
            the existing exhaustion. Decide how to respond.
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
              Skill unlocked: <strong>Boundary awareness</strong>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SayingYesAgain;
