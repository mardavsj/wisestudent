import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const PuzzleEarthSolutions = () => {
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
      const games = getSustainabilityKidsGames({});
      const currentGame = games.find(g => g.id === "sustainability-kids-99");
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
  
  // Get game data from game category folder (source of truth)
  const gameId = "sustainability-kids-99";
  const gameData = getGameDataById(gameId);
  
  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Earth Solutions (left side) - 5 items
  const solutions = [
    { id: 1, name: "Recycle", emoji: "♻️",  },
    { id: 2, name: "Save Energy", emoji: "💡",  },
    { id: 3, name: "Plant Trees", emoji: "🌱",  },
    { id: 4, name: "Reduce Waste", emoji: "🗑️",  },
    { id: 5, name: "Conserve Water", emoji: "💧",  }
  ];

  // Earth Actions (right side) - 5 items
  const actions = [
    { id: 2, name: "Less Pollution", emoji: "🌍",  },
    { id: 3, name: "More Oxygen", emoji: "💨",  },
    { id: 1, name: "Less Waste", emoji: "✅",  },
    { id: 5, name: "Sustainable Life", emoji: "🌿",  },
    { id: 4, name: "Less Trash", emoji: "🌱",  }
  ];

  // Correct matches
  const correctMatches = [
    { solutionId: 1, actionId: 1 }, // Recycle → Less Waste
    { solutionId: 2, actionId: 2 }, // Save Energy → Less Pollution
    { solutionId: 3, actionId: 3 }, // Plant Trees → More Oxygen
    { solutionId: 4, actionId: 4 }, // Reduce Waste → Less Trash
    { solutionId: 5, actionId: 5 }  // Conserve Water → Sustainable Life
  ];

  const handleSolutionSelect = (solution) => {
    if (gameFinished) return;
    setSelectedSolution(solution);
  };

  const handleActionSelect = (action) => {
    if (gameFinished) return;
    setSelectedAction(action);
  };

  const handleMatch = () => {
    if (!selectedSolution || !selectedAction || gameFinished) return;

    resetFeedback();

    const newMatch = {
      solutionId: selectedSolution.id,
      actionId: selectedAction.id,
      isCorrect: correctMatches.some(
        match => match.solutionId === selectedSolution.id && match.actionId === selectedAction.id
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
    if (newMatches.length === solutions.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedSolution(null);
    setSelectedAction(null);
  };

  // Check if a solution is already matched
  const isSolutionMatched = (solutionId) => {
    return matches.some(match => match.solutionId === solutionId);
  };

  // Check if an action is already matched
  const isActionMatched = (actionId) => {
    return matches.some(match => match.actionId === actionId);
  };

  // Get match result for a solution
  const getMatchResult = (solutionId) => {
    const match = matches.find(m => m.solutionId === solutionId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Earth Solutions"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Solutions with Actions (${matches.length}/${solutions.length} matched)`}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={solutions.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === solutions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/sustainability/kids"
      maxScore={solutions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    
      nextGamePathProp="/student/sustainability/kids/badge-master-earth-guardian-kid"
      nextGameIdProp="sustainability-kids-100">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Solutions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Earth Solutions</h3>
              <div className="space-y-4">
                {solutions.map(solution => (
                  <button
                    key={solution.id}
                    onClick={() => handleSolutionSelect(solution)}
                    disabled={isSolutionMatched(solution.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isSolutionMatched(solution.id)
                        ? getMatchResult(solution.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedSolution?.id === solution.id
                          ? "bg-blue-500/50 border-2 border-blue-400"
                          : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{solution.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{solution.name}</h4>
                        <p className="text-white/80 text-sm">{solution.description}</p>
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
                  {selectedSolution 
                    ? `Selected: ${selectedSolution.name}` 
                    : "Select a Solution"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedSolution || !selectedAction}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedSolution && selectedAction
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{solutions.length}</p>
                  <p>Matched: {matches.length}/{solutions.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Actions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Earth Actions</h3>
              <div className="space-y-4">
                {actions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleActionSelect(action)}
                    disabled={isActionMatched(action.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isActionMatched(action.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedAction?.id === action.id
                          ? "bg-purple-500/50 border-2 border-purple-400"
                          : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{action.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{action.name}</h4>
                        <p className="text-white/80 text-sm">{action.description}</p>
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
                <div className="text-5xl mb-4">🌍</div>
                <h3 className="text-2xl font-bold text-white mb-4">Earth Solutions Master!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {solutions.length} earth solutions with their positive outcomes!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Small changes in our daily habits can make a big difference for our planet!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {solutions.length} items correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Remember: Recycling, saving energy, planting trees, reducing waste, and conserving water all help our planet!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleEarthSolutions;