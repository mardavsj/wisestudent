import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const PuzzleWasteHierarchy = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get game data from game category folder (source of truth)
  const gameId = "sustainability-teens-14";
  
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
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Waste Management Strategies (left side) - 5 items
  const strategies = [
    { id: 2, name: "Reuse", emoji: "♻️",  },
    { id: 4, name: "Recover", emoji: "🔋",  },
    { id: 5, name: "Dispose", emoji: "🗑️",  },
    { id: 3, name: "Recycle", emoji: "🔄",  },
    { id: 1, name: "Reduce", emoji: "📉",  },
  ];

  // Priority Levels (right side) - 5 items
  const levels = [
    { id: 3, name: "Third Priority", emoji: "3️⃣",  },
    { id: 5, name: "Fifth Priority", emoji: "5️⃣",  },
    { id: 1, name: "First Priority", emoji: "1️⃣",  },
    { id: 4, name: "Fourth Priority", emoji: "4️⃣",  },
    { id: 2, name: "Second Priority", emoji: "2️⃣",  }
  ];

  // Correct matches
  const correctMatches = [
    { strategyId: 1, levelId: 1 }, // Reduce → First Priority
    { strategyId: 2, levelId: 2 }, // Reuse → Second Priority
    { strategyId: 3, levelId: 3 }, // Recycle → Third Priority
    { strategyId: 4, levelId: 4 }, // Recover → Fourth Priority
    { strategyId: 5, levelId: 5 }  // Dispose → Fifth Priority
  ];

  const handleStrategySelect = (strategy) => {
    if (gameFinished) return;
    setSelectedStrategy(strategy);
  };

  const handleLevelSelect = (level) => {
    if (gameFinished) return;
    setSelectedLevel(level);
  };

  const handleMatch = () => {
    if (!selectedStrategy || !selectedLevel || gameFinished) return;

    resetFeedback();

    const newMatch = {
      strategyId: selectedStrategy.id,
      levelId: selectedLevel.id,
      isCorrect: correctMatches.some(
        match => match.strategyId === selectedStrategy.id && match.levelId === selectedLevel.id
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
    if (newMatches.length === strategies.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedStrategy(null);
    setSelectedLevel(null);
  };

  // Check if a strategy is already matched
  const isStrategyMatched = (strategyId) => {
    return matches.some(match => match.strategyId === strategyId);
  };

  // Check if a level is already matched
  const isLevelMatched = (levelId) => {
    return matches.some(match => match.levelId === levelId);
  };

  // Get match result for a strategy
  const getMatchResult = (strategyId) => {
    const match = matches.find(m => m.strategyId === strategyId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Waste Hierarchy Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Strategies with Priority Levels (${matches.length}/${strategies.length} matched)`}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={strategies.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === strategies.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/sustainability/teens"
      maxScore={strategies.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    
      nextGamePathProp="/student/sustainability/teens/plastic-pollution-story"
      nextGameIdProp="sustainability-teens-15">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Waste Management Strategies */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Waste Strategies</h3>
              <div className="space-y-4">
                {strategies.map(strategy => (
                  <button
                    key={strategy.id}
                    onClick={() => handleStrategySelect(strategy)}
                    disabled={isStrategyMatched(strategy.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isStrategyMatched(strategy.id)
                        ? getMatchResult(strategy.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedStrategy?.id === strategy.id
                          ? "bg-blue-500/50 border-2 border-blue-400"
                          : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{strategy.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{strategy.name}</h4>
                        <p className="text-white/80 text-sm">{strategy.description}</p>
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
                  {selectedStrategy 
                    ? `Selected: ${selectedStrategy.name}` 
                    : "Select a Strategy"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedStrategy || !selectedLevel}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedStrategy && selectedLevel
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{strategies.length}</p>
                  <p>Matched: {matches.length}/{strategies.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Priority Levels */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Priority Levels</h3>
              <div className="space-y-4">
                {levels.map(level => (
                  <button
                    key={level.id}
                    onClick={() => handleLevelSelect(level)}
                    disabled={isLevelMatched(level.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isLevelMatched(level.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedLevel?.id === level.id
                          ? "bg-purple-500/50 border-2 border-purple-400"
                          : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{level.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{level.name}</h4>
                        <p className="text-white/80 text-sm">{level.description}</p>
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
                  You correctly matched {score} out of {strategies.length} waste strategies with their priority levels!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Reducing waste is most effective, while disposing is the last resort in waste management!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {strategies.length} strategies correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about which waste strategy would be most effective in protecting our environment!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleWasteHierarchy;
