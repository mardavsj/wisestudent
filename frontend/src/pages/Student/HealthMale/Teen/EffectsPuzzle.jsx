import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EffectsPuzzle = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedEffect, setSelectedEffect] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  // Activities/Substances (left side) - 5 items
  const activities = [
    { id: 1, name: "Smoking", emoji: "🚬",  },
    { id: 2, name: "Alcohol", emoji: "🍺",  },
    { id: 3, name: "Drugs", emoji: "💊",  },
    { id: 4, name: "Vaping", emoji: "💨",  },
    { id: 5, name: "Exercise", emoji: "🏃",  }
  ];

  // Effects on Body (right side) - 5 items
  const effects = [
    { id: 3, name: "Brain Damage", emoji: "🧠",  },
    { id: 5, name: "Heart Health", emoji: "❤️",  },
    { id: 4, name: "Respiratory Issues", emoji: "😮",  },
    { id: 1, name: "Lung Damage", emoji: "🫁",  },
    { id: 2, name: "Liver Damage", emoji: "🫀",  }
  ];

  // Correct matches
  const correctMatches = [
    { activityId: 1, effectId: 1 }, // Smoking → Lung Damage
    { activityId: 2, effectId: 2 }, // Alcohol → Liver Damage
    { activityId: 3, effectId: 3 }, // Drugs → Brain Damage
    { activityId: 4, effectId: 4 }, // Vaping → Lung Damage
    { activityId: 5, effectId: 5 }  // Exercise → Heart Health
  ];

  const handleActivitySelect = (activity) => {
    if (gameFinished) return;
    setSelectedActivity(activity);
  };

  const handleEffectSelect = (effect) => {
    if (gameFinished) return;
    setSelectedEffect(effect);
  };

  const handleMatch = () => {
    if (!selectedActivity || !selectedEffect || gameFinished) return;

    resetFeedback();

    const newMatch = {
      activityId: selectedActivity.id,
      effectId: selectedEffect.id,
      isCorrect: correctMatches.some(
        match => match.activityId === selectedActivity.id && match.effectId === selectedEffect.id
      )
    };

    const newMatches = [...matches, newMatch];
    setMatches(newMatches);

    // If the match is correct, add score and show flash/confetti
    if (newMatch.isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    // Check if all items are matched
    if (newMatches.length === activities.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedActivity(null);
    setSelectedEffect(null);
  };

  // Check if an activity is already matched
  const isActivityMatched = (activityId) => {
    return matches.some(match => match.activityId === activityId);
  };

  // Check if an effect is already matched
  const isEffectMatched = (effectId) => {
    return matches.some(match => match.effectId === effectId);
  };

  // Get match result for an activity
  const getMatchResult = (activityId) => {
    const match = matches.find(m => m.activityId === activityId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/substance-story");
  };

  return (
    <GameShell
      title="Effects Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Activities with Their Effects (${matches.length}/${activities.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-84"
      gameType="health-male"
      totalLevels={activities.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === activities.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/health-male/teens"
      maxScore={activities.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Activities/Substances */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Activities/Substances</h3>
              <div className="space-y-4">
                {activities.map(activity => (
                  <button
                    key={activity.id}
                    onClick={() => handleActivitySelect(activity)}
                    disabled={isActivityMatched(activity.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isActivityMatched(activity.id)
                        ? getMatchResult(activity.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedActivity?.id === activity.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{activity.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{activity.name}</h4>
                        <p className="text-white/80 text-sm">{activity.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Middle column - Match button */}
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
                <p className="text-white/80 mb-4">
                  {selectedActivity 
                    ? `Selected: ${selectedActivity.name}` 
                    : "Select an Activity"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedActivity || !selectedEffect}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedActivity && selectedEffect
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{activities.length}</p>
                  <p>Matched: {matches.length}/{activities.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Effects on Body */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Effects on Body</h3>
              <div className="space-y-4">
                {effects.map(effect => (
                  <button
                    key={effect.id}
                    onClick={() => handleEffectSelect(effect)}
                    disabled={isEffectMatched(effect.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isEffectMatched(effect.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedEffect?.id === effect.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{effect.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{effect.name}</h4>
                        <p className="text-white/80 text-sm">{effect.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {activities.length} activities with their effects on the body!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Different activities have different effects on our bodies - some helpful, others harmful!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {activities.length} activities correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about how each activity affects your body's organs!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EffectsPuzzle;
