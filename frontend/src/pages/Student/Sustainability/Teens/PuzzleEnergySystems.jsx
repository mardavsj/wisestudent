import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const PuzzleEnergySystems = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get game data from game category folder (source of truth)
  const gameId = "sustainability-teens-39";
  
  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getSustainabilityTeenGames({});
      const currentGame = games.find(g => g.id === gameId);
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
  }, [location.state, gameId]);
  const gameData = getGameDataById(gameId);
  
  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Energy Sources (left side) - 5 items
  const energySources = [
    { id: 1, name: "Solar Power", emoji: "☀️",  },
    { id: 2, name: "Wind Power", emoji: "💨",  },
    { id: 3, name: "Coal Power", emoji: "🏭",  },
    { id: 4, name: "Hydro Power", emoji: "💧",  },
    { id: 5, name: "Nuclear Power", emoji: "⚛️",  }
  ];

  // Environmental Impacts (right side) - 5 items
  const environmentalImpacts = [
    { id: 5, name: "Low Emissions", emoji: "🌱",  },
    { id: 1, name: "Clean Energy", emoji: "🌿",  },
    { id: 2, name: "Sustainable", emoji: "♻️",  },
    { id: 3, name: "High Emissions", emoji: "🌫️",  },
    { id: 4, name: "Water Dependent", emoji: "🌊",  }
  ];

  // Correct matches
  const correctMatches = [
    { problemId: 1, solutionId: 1 }, // Solar Power → Clean Energy
    { problemId: 2, solutionId: 2 }, // Wind Power → Sustainable
    { problemId: 3, solutionId: 3 }, // Coal Power → High Emissions
    { problemId: 4, solutionId: 4 }, // Hydro Power → Water Dependent
    { problemId: 5, solutionId: 5 }  // Nuclear Power → Low Emissions
  ];

  const handleProblemSelect = (problem) => {
    if (gameFinished) return;
    setSelectedProblem(problem);
  };

  const handleSolutionSelect = (solution) => {
    if (gameFinished) return;
    setSelectedSolution(solution);
  };

  const handleMatch = () => {
    if (!selectedProblem || !selectedSolution || gameFinished) return;

    resetFeedback();

    const newMatch = {
      problemId: selectedProblem.id,
      solutionId: selectedSolution.id,
      isCorrect: correctMatches.some(
        match => match.problemId === selectedProblem.id && match.solutionId === selectedSolution.id
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
    if (newMatches.length === energySources.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedProblem(null);
    setSelectedSolution(null);
  };

  // Check if a problem is already matched
  const isProblemMatched = (problemId) => {
    return matches.some(match => match.problemId === problemId);
  };

  // Check if a solution is already matched
  const isSolutionMatched = (solutionId) => {
    return matches.some(match => match.solutionId === solutionId);
  };

  // Get match result for a problem
  const getMatchResult = (problemId) => {
    const match = matches.find(m => m.problemId === problemId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Energy Systems"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Energy Sources with Impacts (${matches.length}/${energySources.length} matched)`}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={energySources.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === energySources.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/sustainability/teens"
      maxScore={energySources.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    
      nextGamePathProp="/student/sustainability/teens/wind-farm-story"
      nextGameIdProp="sustainability-teens-40">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Energy Sources */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Energy Sources</h3>
              <div className="space-y-4">
                {energySources.map(problem => (
                  <button
                    key={problem.id}
                    onClick={() => handleProblemSelect(problem)}
                    disabled={isProblemMatched(problem.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isProblemMatched(problem.id)
                        ? getMatchResult(problem.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedProblem?.id === problem.id
                          ? "bg-blue-500/50 border-2 border-blue-400"
                          : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{problem.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{problem.name}</h4>
                        <p className="text-white/80 text-sm">{problem.description}</p>
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
                  {selectedProblem 
                    ? `Selected: ${selectedProblem.name}` 
                    : "Select an Energy Source"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedProblem || !selectedSolution}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedProblem && selectedSolution
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{energySources.length}</p>
                  <p>Matched: {matches.length}/{energySources.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Environmental Impacts */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Environmental Impacts</h3>
              <div className="space-y-4">
                {environmentalImpacts.map(solution => (
                  <button
                    key={solution.id}
                    onClick={() => handleSolutionSelect(solution)}
                    disabled={isSolutionMatched(solution.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isSolutionMatched(solution.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedSolution?.id === solution.id
                          ? "bg-purple-500/50 border-2 border-purple-400"
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
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {energySources.length} energy sources with their environmental impacts!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding energy systems helps us make better environmental choices!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {energySources.length} correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about how each energy source affects the environment!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleEnergySystems;