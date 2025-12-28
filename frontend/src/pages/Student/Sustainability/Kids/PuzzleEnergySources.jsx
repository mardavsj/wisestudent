import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const PuzzleEnergySources = () => {
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
      const currentGame = games.find(g => g.id === "sustainability-kids-14");
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
  const gameId = "sustainability-kids-14";
  const gameData = getGameDataById(gameId);
  
  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Energy Sources (left side) - 5 items
  const sources = [
    { id: 1, name: "Sun", emoji: "☀️", description: "Solar power" },
    { id: 2, name: "Wind", emoji: "💨", description: "Air movement" },
    { id: 3, name: "Coal", emoji: "🪨", description: "Solid fossil fuel" },
    { id: 4, name: "Water", emoji: "💧", description: "Hydro power" },
    { id: 5, name: "Oil", emoji: "🛢️", description: " liquid energy" }
  ];

  // Energy Types (right side) - 5 items
  const types = [
    { id: 4, name: "Hydroelectric", emoji: "🌊", description: "Water-based energy" },
    { id: 5, name: "Non-Renewable", emoji: "⚠️", description: "Finite resource" },
    { id: 1, name: "Solar Power", emoji: "🔆", description: "Sunlight energy" },
    { id: 3, name: "Polluting Fuel", emoji: "🌫️", description: "Environmental hazard" },
    { id: 2, name: "Wind Energy", emoji: "🌪️", description: "Air-based power" }
  ];

  // Correct matches
  const correctMatches = [
    { sourceId: 1, typeId: 1 }, // Sun → Solar Power
    { sourceId: 2, typeId: 2 }, // Wind → Wind Energy
    { sourceId: 3, typeId: 3 }, // Coal → Polluting Fuel
    { sourceId: 4, typeId: 4 }, // Water → Hydroelectric
    { sourceId: 5, typeId: 5 }  // Oil → Non-Renewable
  ];

  const handleSourceSelect = (source) => {
    if (gameFinished) return;
    setSelectedSource(source);
  };

  const handleTypeSelect = (type) => {
    if (gameFinished) return;
    setSelectedType(type);
  };

  const handleMatch = () => {
    if (!selectedSource || !selectedType || gameFinished) return;

    resetFeedback();

    const newMatch = {
      sourceId: selectedSource.id,
      typeId: selectedType.id,
      isCorrect: correctMatches.some(
        match => match.sourceId === selectedSource.id && match.typeId === selectedType.id
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
    setSelectedType(null);
  };

  // Check if a source is already matched
  const isSourceMatched = (sourceId) => {
    return matches.some(match => match.sourceId === sourceId);
  };

  // Check if a type is already matched
  const isTypeMatched = (typeId) => {
    return matches.some(match => match.typeId === typeId);
  };

  // Get match result for a source
  const getMatchResult = (sourceId) => {
    const match = matches.find(m => m.sourceId === sourceId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Energy Sources Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Sources with Energy Types (${matches.length}/${sources.length} matched)`}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={sources.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === sources.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/sustainability/kids"
      maxScore={sources.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Energy Sources */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Energy Sources</h3>
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
                    : "Select a Source"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedSource || !selectedType}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedSource && selectedType
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

            {/* Right column - Energy Types */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Energy Types</h3>
              <div className="space-y-4">
                {types.map(type => (
                  <button
                    key={type.id}
                    onClick={() => handleTypeSelect(type)}
                    disabled={isTypeMatched(type.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isTypeMatched(type.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedType?.id === type.id
                          ? "bg-purple-500/50 border-2 border-purple-400"
                          : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{type.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{type.name}</h4>
                        <p className="text-white/80 text-sm">{type.description}</p>
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
                  You correctly matched {score} out of {sources.length} energy sources with their types!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Renewable energy sources like sun and wind are cleaner than fossil fuels like coal and oil!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {sources.length} sources correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about whether each energy source is renewable or polluting!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleEnergySources;
