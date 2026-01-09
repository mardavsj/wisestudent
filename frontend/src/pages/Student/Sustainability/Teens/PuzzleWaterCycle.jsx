import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const PuzzleWaterCycle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get game data from game category folder (source of truth)
  const gameId = "sustainability-teens-49";
  
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
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedPractice, setSelectedPractice] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Water Sources (left side) - 5 items
  const sources = [
    { id: 1, name: "Groundwater", emoji: "💧",  },
    { id: 2, name: "Rainwater", emoji: "🌧️",  },
    { id: 3, name: "Surface Water", emoji: "🌊",  },
    { id: 4, name: "Greywater", emoji: "💧",  },
    { id: 5, name: "Ocean Water", emoji: "🌊",  }
  ];

  // Sustainable Usage Practices (right side) - 5 items
  const practices = [
    { id: 4, name: "Reuse", emoji: "♻️",  },
    { id: 1, name: "Conservation", emoji: "🌱",  },
    { id: 3, name: "Efficient Irrigation", emoji: "💧",  },
    { id: 2, name: "Harvesting", emoji: "🌧️",  },
    { id: 5, name: "Desalination", emoji: "💧",  }
  ];

  // Correct matches
  const correctMatches = [
    { sourceId: 1, practiceId: 1 }, // Groundwater → Conservation
    { sourceId: 2, practiceId: 2 }, // Rainwater → Harvesting
    { sourceId: 3, practiceId: 3 }, // Surface Water → Efficient Irrigation
    { sourceId: 4, practiceId: 4 }, // Greywater → Reuse
    { sourceId: 5, practiceId: 5 }  // Ocean Water → Desalination
  ];

  const handleSourceSelect = (source) => {
    if (gameFinished) return;
    setSelectedSource(source);
  };

  const handlePracticeSelect = (practice) => {
    if (gameFinished) return;
    setSelectedPractice(practice);
  };

  const handleMatch = () => {
    if (!selectedSource || !selectedPractice || gameFinished) return;

    resetFeedback();

    const newMatch = {
      sourceId: selectedSource.id,
      practiceId: selectedPractice.id,
      isCorrect: correctMatches.some(
        match => match.sourceId === selectedSource.id && match.practiceId === selectedPractice.id
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
    if (newMatches.length === sources.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedSource(null);
    setSelectedPractice(null);
  };

  // Check if a source is already matched
  const isSourceMatched = (sourceId) => {
    return matches.some(match => match.sourceId === sourceId);
  };

  // Check if a practice is already matched
  const isPracticeMatched = (practiceId) => {
    return matches.some(match => match.practiceId === practiceId);
  };

  // Get match result for a source
  const getMatchResult = (sourceId) => {
    const match = matches.find(m => m.sourceId === sourceId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Water Cycle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Sources with Practices (${matches.length}/${sources.length} matched)`}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={sources.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === sources.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/sustainability/teens"
      maxScore={sources.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    
      nextGamePathProp="/student/sustainability/teens/rainwater-story"
      nextGameIdProp="sustainability-teens-50">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Water Sources */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Water Sources</h3>
              <div className="space-y-4">
                {sources.map(source => (
                  <button
                    key={source.id}
                    onClick={() => handleSourceSelect(source)}
                    disabled={isSourceMatched(source.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isSourceMatched(source.id)
                        ? getMatchResult(source.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedSource?.id === source.id
                          ? "bg-blue-500/50 border-2 border-blue-400"
                          : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{source.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{source.name}</h4>
                        <p className="text-white/80 text-sm">{source.description}</p>
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
                  {selectedSource 
                    ? `Selected: ${selectedSource.name}` 
                    : "Select a Water Source"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedSource || !selectedPractice}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedSource && selectedPractice
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{sources.length}</p>
                  <p>Matched: {matches.length}/{sources.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Sustainable Practices */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Sustainable Practices</h3>
              <div className="space-y-4">
                {practices.map(practice => (
                  <button
                    key={practice.id}
                    onClick={() => handlePracticeSelect(practice)}
                    disabled={isPracticeMatched(practice.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isPracticeMatched(practice.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedPractice?.id === practice.id
                          ? "bg-purple-500/50 border-2 border-purple-400"
                          : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{practice.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{practice.name}</h4>
                        <p className="text-white/80 text-sm">{practice.description}</p>
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
                <div className="text-5xl mb-4">💧</div>
                <h3 className="text-2xl font-bold text-white mb-4">Water Cycle Master!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {sources.length} water sources with sustainable usage practices!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Every water source has sustainable practices that can help us manage our precious water resources!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💧</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {sources.length} sources correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about how each practice directly addresses its corresponding water source!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleWaterCycle;