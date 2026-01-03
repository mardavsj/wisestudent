import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getFinanceTeenGames } from "../../../../pages/Games/GameCategories/Finance/teenGamesData";

const PuzzleOfSavingGoals = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getFinanceTeenGames({});
      const currentGame = games.find(g => g.id === "finance-teens-4");
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : null,
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return { nextGamePath: null, nextGameId: null };
  }, [location.state]);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedPurpose, setSelectedPurpose] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Saving goals (left side) - 5 items
  const goals = [
    { id: 1, name: "Education", emoji: "📚",  },
    { id: 2, name: "Emergency Fund", emoji: "🚑",  },
    { id: 3, name: "Car", emoji: "🚗",  },
    { id: 4, name: "House", emoji: "🏠",  },
    { id: 5, name: "Retirement", emoji: "🌅",  }
  ];

  // Saving purposes (right side) - 5 items
  const purposes = [
    { id: 6, name: "Future Growth", emoji: "📈",  },
    { id: 7, name: "Safety Net", emoji: "🛡️",  },
    { id: 8, name: "Mobility", emoji: "🛣️",  },
    { id: 9, name: "Stability", emoji: "🏛️",  },
    { id: 10, name: "Peace of Mind", emoji: "🧘",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedPurposes = [
    purposes[2], // Mobility (id: 8)
    purposes[4], // Peace of Mind (id: 10)
    purposes[1], // Safety Net (id: 7)
    purposes[0], // Future Growth (id: 6)
    purposes[3]  // Stability (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each goal has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { goalId: 1, purposeId: 6 }, // Education → Future Growth
    { goalId: 2, purposeId: 7 }, // Emergency Fund → Safety Net
    { goalId: 3, purposeId: 8 }, // Car → Mobility
    { goalId: 4, purposeId: 9 }, // House → Stability
    { goalId: 5, purposeId: 10 } // Retirement → Peace of Mind
  ];

  const handleGoalSelect = (goal) => {
    if (gameFinished) return;
    setSelectedGoal(goal);
  };

  const handlePurposeSelect = (purpose) => {
    if (gameFinished) return;
    setSelectedPurpose(purpose);
  };

  const handleMatch = () => {
    if (!selectedGoal || !selectedPurpose || gameFinished) return;

    resetFeedback();

    const newMatch = {
      goalId: selectedGoal.id,
      purposeId: selectedPurpose.id,
      isCorrect: correctMatches.some(
        match => match.goalId === selectedGoal.id && match.purposeId === selectedPurpose.id
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
    if (newMatches.length === goals.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedGoal(null);
    setSelectedPurpose(null);
  };

  // Check if a goal is already matched
  const isGoalMatched = (goalId) => {
    return matches.some(match => match.goalId === goalId);
  };

  // Check if a purpose is already matched
  const isPurposeMatched = (purposeId) => {
    return matches.some(match => match.purposeId === purposeId);
  };

  // Get match result for a goal
  const getMatchResult = (goalId) => {
    const match = matches.find(m => m.goalId === goalId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Saving Goals"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Goals with Purposes (${matches.length}/${goals.length} matched)`}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="finance-teens-4"
      gameType="finance"
      totalLevels={goals.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === goals.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/financial-literacy/teens"
      maxScore={goals.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Saving Goals */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Saving Goals</h3>
              <div className="space-y-4">
                {goals.map(goal => (
                  <button
                    key={goal.id}
                    onClick={() => handleGoalSelect(goal)}
                    disabled={isGoalMatched(goal.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isGoalMatched(goal.id)
                        ? getMatchResult(goal.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedGoal?.id === goal.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{goal.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{goal.name}</h4>
                        
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
                  {selectedGoal 
                    ? `Selected: ${selectedGoal.name}` 
                    : "Select a Saving Goal"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedGoal || !selectedPurpose}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedGoal && selectedPurpose
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{goals.length}</p>
                  <p>Matched: {matches.length}/{goals.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Saving Purposes */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Saving Purposes</h3>
              <div className="space-y-4">
                {rearrangedPurposes.map(purpose => (
                  <button
                    key={purpose.id}
                    onClick={() => handlePurposeSelect(purpose)}
                    disabled={isPurposeMatched(purpose.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isPurposeMatched(purpose.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedPurpose?.id === purpose.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{purpose.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{purpose.name}</h4>
                        <p className="text-white/80 text-sm">{purpose.description}</p>
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
                  You correctly matched {score} out of {goals.length} saving goals with their purposes!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Setting clear saving goals helps achieve financial security!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {goals.length} saving goals correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about the primary benefit of each saving goal!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleOfSavingGoals;