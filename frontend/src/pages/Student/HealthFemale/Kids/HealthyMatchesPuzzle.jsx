import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HealthyMatchesPuzzle = () => {
  const navigate = useNavigate();
  
  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-34";
  
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  // Healthy Habits (left side) - 5 items
  const habits = [
    { id: 1, name: "Eat Fruits & Veggies", emoji: "🍎",  },
    { id: 2, name: "Regular Exercise", emoji: "🏃",  },
    { id: 3, name: "Brush Teeth", emoji: "🦷",  },
    { id: 4, name: "Get Enough Sleep", emoji: "😴",  },
    { id: 5, name: "Wash Hands", emoji: "🧼",  }
  ];
  
  // Health Benefits (right side) - 5 items (shuffled order)
  const benefits = [
    { id: 4, text: "More Energy Throughout Day",  },
    { id: 1, text: "Strong, Healthy Body",  },
    { id: 5, text: "Remove Germs Effectively",  },
    { id: 2, text: "Strong Heart and Muscles",  },
    { id: 3, text: "No Cavities and Fresh Breath",  }
  ];
  
  // Correct matches
  const correctMatches = [
    { habitId: 1, benefitId: 1 }, // Eat Fruits & Veggies → Strong, Healthy Body
    { habitId: 2, benefitId: 2 }, // Regular Exercise → Strong Heart and Muscles
    { habitId: 3, benefitId: 3 }, // Brush Teeth → No Cavities and Fresh Breath
    { habitId: 4, benefitId: 4 }, // Get Enough Sleep → More Energy Throughout Day
    { habitId: 5, benefitId: 5 }  // Wash Hands → Remove Germs Effectively
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
  
  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedHabit(null);
    setSelectedBenefit(null);
    setScore(0);
    resetFeedback();
  };
  
  const handleNext = () => {
    navigate("/games/health-female/kids");
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

  return (
    <GameShell
      title="Puzzle: Healthy Matches"
      subtitle={gameFinished ? "Game Complete!" : `Match Habits with Benefits (${matches.length}/${habits.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-female"
      totalLevels={habits.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
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
                        <p className="text-white/80 text-sm">{habit.hint}</p>
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
              <h3 className="text-xl font-bold text-white mb-4 text-center">Health Benefits</h3>
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
                      <div>
                        <h4 className="font-bold text-white">{benefit.text}</h4>
                        <p className="text-white/80 text-sm">{benefit.hint}</p>
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
                  Lesson: Building healthy habits leads to amazing benefits for your body and mind!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {habits.length} habits correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about how each healthy habit contributes to your overall wellbeing!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HealthyMatchesPuzzle;