import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const PuzzleWaterSources = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "sustainability-kids-29";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 1;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getSustainabilityKidsGames({});
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
  
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Water Sources (left side) - 5 items
  const waterSources = [
    { id: 1, name: "Rain", emoji: "🌧️",  },
    { id: 2, name: "Ocean", emoji: "🌊",  },
    { id: 3, name: "Tap", emoji: "🚰",  },
    { id: 4, name: "River", emoji: "🏞️",  },
    { id: 5, name: "Well", emoji: "🕳️",  }
  ];

  // Water Types (right side) - 5 items
  const waterTypes = [
      { id: 5, name: "Underground", emoji: "🌍",  },
      { id: 3, name: "Drinkable", emoji: "🚰",  },
      { id: 2, name: "Salty", emoji: "🧂",  },
      { id: 1, name: "Water", emoji: "💧",  },
    { id: 4, name: "Fresh", emoji: "🌱",  },
  ];

  // Correct matches
  const correctMatches = [
    { itemId: 1, methodId: 1 }, // Rain → Water
    { itemId: 2, methodId: 2 }, // Ocean → Salty
    { itemId: 3, methodId: 3 }, // Tap → Drinkable
    { itemId: 4, methodId: 4 }, // River → Fresh
    { itemId: 5, methodId: 5 }  // Well → Underground
  ];

  const handleItemSelect = (item) => {
    if (gameFinished) return;
    setSelectedItem(item);
  };

  const handleMethodSelect = (method) => {
    if (gameFinished) return;
    setSelectedMethod(method);
  };

  const handleMatch = () => {
    if (!selectedItem || !selectedMethod || gameFinished) return;

    resetFeedback();

    const newMatch = {
      itemId: selectedItem.id,
      methodId: selectedMethod.id,
      isCorrect: correctMatches.some(
        match => match.itemId === selectedItem.id && match.methodId === selectedMethod.id
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
    if (newMatches.length === waterSources.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedItem(null);
    setSelectedMethod(null);
  };

  // Check if an item is already matched
  const isItemMatched = (itemId) => {
    return matches.some(match => match.itemId === itemId);
  };

  // Check if a method is already matched
  const isMethodMatched = (methodId) => {
    return matches.some(match => match.methodId === methodId);
  };

  // Get match result for an item
  const getMatchResult = (itemId) => {
    const match = matches.find(m => m.itemId === itemId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Water Sources"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Water Sources with Water Types (${matches.length}/${waterSources.length} matched)`}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={waterSources.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === waterSources.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/sustainability/kids"
      maxScore={waterSources.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    
      nextGamePathProp="/student/sustainability/kids/rain-story"
      nextGameIdProp="sustainability-kids-30">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Water Sources */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Water Sources</h3>
              <div className="space-y-4">
                {waterSources.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleItemSelect(item)}
                    disabled={isItemMatched(item.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isItemMatched(item.id)
                        ? getMatchResult(item.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedItem?.id === item.id
                          ? "bg-blue-500/50 border-2 border-blue-400"
                          : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{item.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{item.name}</h4>
                        <p className="text-white/80 text-sm">{item.description}</p>
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
                  {selectedItem 
                    ? `Selected: ${selectedItem.name}` 
                    : "Select a Water Source"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedItem || !selectedMethod}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedItem && selectedMethod
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{waterSources.length}</p>
                  <p>Matched: {matches.length}/{waterSources.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Water Types */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Water Types</h3>
              <div className="space-y-4">
                {waterTypes.map(method => (
                  <button
                    key={method.id}
                    onClick={() => handleMethodSelect(method)}
                    disabled={isMethodMatched(method.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isMethodMatched(method.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedMethod?.id === method.id
                          ? "bg-purple-500/50 border-2 border-purple-400"
                          : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{method.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{method.name}</h4>
                        <p className="text-white/80 text-sm">{method.description}</p>
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
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {waterSources.length} water sources with their types!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding different water sources helps us appreciate this precious resource!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💧</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {waterSources.length} items correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Different water sources provide different types of water for various uses!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleWaterSources;