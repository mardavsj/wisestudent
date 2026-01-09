import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const PuzzleEcosystemBalance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get game data from game category folder (source of truth)
  const gameId = "sustainability-teens-59";
  
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

  // Ecosystem Problems (left side) - 5 items
  const problems = [
    { id: 1, name: "Species Extinction", emoji: "🦕",  },
    { id: 2, name: "Habitat Destruction", emoji: " 💥",  },
    { id: 3, name: "Pollution", emoji: " 🏭",  },
    { id: 4, name: "Climate Change", emoji: "🌡️",  },
    { id: 5, name: "Overfishing", emoji: "🎣",  }
  ];

  // Ecosystem Solutions (right side) - 5 items
  const solutions = [
    { id: 5, name: "Marine Protection", emoji: "🌊",  },
    { id: 1, name: "Species Conservation", emoji: "🦋",  },
    { id: 2, name: "Habitat Restoration", emoji: "🌱",  },
    { id: 3, name: "Pollution Control", emoji: "♻️",  },
    { id: 4, name: "Climate Action", emoji: "🌿",  }
  ];

  // Correct matches
  const correctMatches = [
    { problemId: 1, solutionId: 1 }, // Species Extinction → Species Conservation
    { problemId: 2, solutionId: 2 }, // Habitat Destruction → Habitat Restoration
    { problemId: 3, solutionId: 3 }, // Pollution → Pollution Control
    { problemId: 4, solutionId: 4 }, // Climate Change → Climate Action
    { problemId: 5, solutionId: 5 }  // Overfishing → Marine Protection
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
    if (newMatches.length === problems.length) {
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
      title="Ecosystem Balance Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Problems with Solutions (${matches.length}/${problems.length} matched)`}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={problems.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === problems.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/sustainability/teens"
      maxScore={problems.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    
      nextGamePathProp="/student/sustainability/teens/marine-life-story"
      nextGameIdProp="sustainability-teens-60">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Ecosystem Problems */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Ecosystem Problems</h3>
              <div className="space-y-4">
                {problems.map(problem => (
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
                    : "Select a Problem"}
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
                  <p>Score: {score}/{problems.length}</p>
                  <p>Matched: {matches.length}/{problems.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Ecosystem Solutions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Ecosystem Solutions</h3>
              <div className="space-y-4">
                {solutions.map(solution => (
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
                <div className="text-5xl mb-4">🌿</div>
                <h3 className="text-2xl font-bold text-white mb-4">Ecosystem Balance Master!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {problems.length} ecosystem problems with their solutions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Every ecosystem problem has a solution that helps maintain biodiversity!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {problems.length} problems correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about how each solution directly addresses its corresponding problem!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleEcosystemBalance;