import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HabitBuilderPuzzle = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
// Habits (left side) - 5 items
const habits = [
  { id: 1, name: "Mindful Meditation", emoji: "🧘",  },
  { id: 2, name: "Strength Training", emoji: "🏋️",  },
  { id: 3, name: "Deep Reading", emoji: "📖",  },
  { id: 4, name: "Early Sleep Routine", emoji: "🌙",  },
  { id: 5, name: "Balanced Breakfast", emoji: "🥗",  }
];

// Benefits (right side) - 5 items
const benefits = [
  { id: 2, name: "Muscle Strength", emoji: "💪",  },
  { id: 1, name: "Stress Reduction", emoji: "�",  },
  { id: 3, name: "Improved Concentration", emoji: "🧠",  },
  { id: 5, name: "Sustained Energy", emoji: "⚡",  },
  { id: 4, name: "Hormonal Balance", emoji: "⚖️",  },
];

// Correct matches
const correctMatches = [
  { habitId: 1, benefitId: 1 }, // Mindful Meditation → Stress Reduction
  { habitId: 2, benefitId: 2 }, // Strength Training → Muscle Strength
  { habitId: 3, benefitId: 3 }, // Deep Reading → Improved Concentration
  { habitId: 4, benefitId: 4 }, // Early Sleep Routine → Hormonal Balance
  { habitId: 5, benefitId: 5 }  // Balanced Breakfast → Sustained Energy
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
    };

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
    navigate("/student/health-male/teens/discipline-story");
  };

  return (
    <GameShell
      title="Habit Builder Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Habits with Their Benefits (${matches.length}/${habits.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-94"
      gameType="health-male"
      totalLevels={habits.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === habits.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/health-male/teens"
      maxScore={habits.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Habits */}
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
                        <p className="text-white/80 text-sm">{habit.description}</p>
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
                    : "Select a Habit"}
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

            {/* Right column - Benefits */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Benefits</h3>
              <div className="space-y-4">
                {benefits.map(benefit => (
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
                  You correctly matched {score} out of {habits.length} habits with their benefits!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Building healthy habits leads to positive benefits for your body and mind!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {habits.length} habits correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about how each habit contributes to your overall well-being!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HabitBuilderPuzzle;
