import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HabitChainPuzzle = () => {
  const navigate = useNavigate();

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Healthy habits (left side) - 5 items with hints
  const habits = [
    { id: 1, name: "Daily Exercise", emoji: "💪",  },
    { id: 2, name: "Healthy Eating", emoji: "🥗",  },
    { id: 3, name: "Quality Sleep", emoji: "😴",  },
    { id: 4, name: "Mindfulness", emoji: "🧘",  },
    { id: 5, name: "Regular Reading", emoji: "📚",  }
  ];

  // Health benefits (right side) - 5 items with descriptions
  const benefits = [
    { id: 6, name: "Stronger Muscles", emoji: "🦾",  },
    { id: 7, name: "Better Digestion", emoji: "🍽️",  },
    { id: 8, name: "Sharper Focus", emoji: "🎯",  },
    { id: 9, name: "Reduced Stress", emoji: "😌",  },
    { id: 10, name: "Expanded Vocabulary", emoji: "🧠",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedBenefits = [
    benefits[2], // Sharper Focus (id: 8)
    benefits[4], // Expanded Vocabulary (id: 10)
    benefits[1], // Better Digestion (id: 7)
    benefits[0], // Stronger Muscles (id: 6)
    benefits[3]  // Reduced Stress (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each habit has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { habitId: 1, benefitId: 6 }, // Daily Exercise → Stronger Muscles
    { habitId: 2, benefitId: 7 }, // Healthy Eating → Better Digestion
    { habitId: 3, benefitId: 8 }, // Quality Sleep → Sharper Focus
    { habitId: 4, benefitId: 9 }, // Mindfulness → Reduced Stress
    { habitId: 5, benefitId: 10 } // Regular Reading → Expanded Vocabulary
  ];

  const handleHabitSelect = (habit) => {
    if (gameFinished) return;
    setSelectedHabit(habit);
  };

  const handleBenefitSelect = (benefit) => {
    if (gameFinished) return;
    setSelectedBenefit(benefit);
  };

  const handleMatch = () => {
    if (!selectedHabit || !selectedBenefit || gameFinished) return;

    resetFeedback();

    const newMatch = {
      habitId: selectedHabit.id,
      benefitId: selectedBenefit.id,
      isCorrect: correctMatches.some(
        match => match.habitId === selectedHabit.id && match.benefitId === selectedBenefit.id
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
    if (newMatches.length === habits.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedHabit(null);
    setSelectedBenefit(null);
  };

  // Check if a habit is already matched
  const isHabitMatched = (habitId) => {
    return matches.some(match => match.habitId === habitId);
  };

  // Check if a benefit is already matched
  const isBenefitMatched = (benefitId) => {
    return matches.some(match => match.benefitId === benefitId);
  };

  // Get match result for a habit
  const getMatchResult = (habitId) => {
    const match = matches.find(m => m.habitId === habitId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/uvls/teen");
  };

  return (
    <GameShell
      title="Habit Chain Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Habits with Benefits (${matches.length}/${habits.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="uvls-teen-97"
      nextGamePathProp="/student/uvls/teen/habit-change-journal"
      nextGameIdProp="uvls-teen-98"
      gameType="uvls"
      totalLevels={habits.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === habits.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teen"
      maxScore={habits.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Healthy Habits */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Healthy Habits</h3>
              <div className="space-y-4">
                {habits.map(habit => (
                  <button
                    key={habit.id}
                    onClick={() => handleHabitSelect(habit)}
                    disabled={isHabitMatched(habit.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isHabitMatched(habit.id)
                        ? getMatchResult(habit.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedHabit?.id === habit.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{habit.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{habit.name}</h4>
                        
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
                  {selectedHabit 
                    ? `Selected: ${selectedHabit.name}` 
                    : "Select a Healthy Habit"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedHabit || !selectedBenefit}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedHabit && selectedBenefit
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{habits.length}</p>
                  <p>Matched: {matches.length}/{habits.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Health Benefits */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Health Benefits</h3>
              <div className="space-y-4">
                {rearrangedBenefits.map(benefit => (
                  <button
                    key={benefit.id}
                    onClick={() => handleBenefitSelect(benefit)}
                    disabled={isBenefitMatched(benefit.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isBenefitMatched(benefit.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedBenefit?.id === benefit.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{benefit.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{benefit.name}</h4>
                        <p className="text-white/80 text-sm">{benefit.description}</p>
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
                  You correctly matched {score} out of {habits.length} healthy habits with their benefits!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Building healthy habits creates positive chains that lead to lasting wellness benefits!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {habits.length} healthy habits correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about how each healthy habit contributes to your overall well-being!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HabitChainPuzzle;