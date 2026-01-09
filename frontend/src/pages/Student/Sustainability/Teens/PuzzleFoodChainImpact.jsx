import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const PuzzleFoodChainImpact = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get game data from game category folder (source of truth)
  const gameId = "sustainability-teens-79";
  
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
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedFootprint, setSelectedFootprint] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Foods (left side) - 5 items
  const foods = [
    { id: 1, name: "Organic Vegetables", emoji: "🥬",  },
    { id: 2, name: "Imported Beef", emoji: "🥩",  },
    { id: 3, name: "Processed Snacks", emoji: "🍪",  },
    { id: 4, name: "Seasonal Fruits", emoji: "🍎",  },
    { id: 5, name: "Factory Farmed Fish", emoji: "🐟",  }
  ];

  // Environmental Footprints (right side) - 5 items
  const footprints = [
    { id: 2, name: "High Emissions", emoji: "🏭",  },
    { id: 3, name: "Waste Generation", emoji: "🗑️",  },
    { id: 1, name: "Low Impact", emoji: "🌱",  },
    { id: 5, name: "Resource Intensive", emoji: "💧",  },
    { id: 4, name: "Moderate Impact", emoji: "🌿",  },
  ];

  // Correct matches
  const correctMatches = [
    { foodId: 1, footprintId: 1 }, // Organic Vegetables → Low Impact
    { foodId: 2, footprintId: 2 }, // Imported Beef → High Emissions
    { foodId: 3, footprintId: 3 }, // Processed Snacks → Waste Generation
    { foodId: 4, footprintId: 4 }, // Seasonal Fruits → Moderate Impact
    { foodId: 5, footprintId: 5 }  // Factory Farmed Fish → Resource Intensive
  ];

  const handleFoodSelect = (food) => {
    if (gameFinished) return;
    setSelectedFood(food);
  };

  const handleFootprintSelect = (footprint) => {
    if (gameFinished) return;
    setSelectedFootprint(footprint);
  };

  const handleMatch = () => {
    if (!selectedFood || !selectedFootprint || gameFinished) return;

    resetFeedback();

    const newMatch = {
      foodId: selectedFood.id,
      footprintId: selectedFootprint.id,
      isCorrect: correctMatches.some(
        match => match.foodId === selectedFood.id && match.footprintId === selectedFootprint.id
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
    if (newMatches.length === foods.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedFood(null);
    setSelectedFootprint(null);
  };

  // Check if a food is already matched
  const isFoodMatched = (foodId) => {
    return matches.some(match => match.foodId === foodId);
  };

  // Check if a footprint is already matched
  const isFootprintMatched = (footprintId) => {
    return matches.some(match => match.footprintId === footprintId);
  };

  // Get match result for a food
  const getMatchResult = (foodId) => {
    const match = matches.find(m => m.foodId === foodId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Food Chain Impact"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Foods with Footprints (${matches.length}/${foods.length} matched)`}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={foods.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === foods.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/sustainability/teens"
      maxScore={foods.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    
      nextGamePathProp="/student/sustainability/teens/urban-garden-story"
      nextGameIdProp="sustainability-teens-80">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Foods */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Foods</h3>
              <div className="space-y-4">
                {foods.map(food => (
                  <button
                    key={food.id}
                    onClick={() => handleFoodSelect(food)}
                    disabled={isFoodMatched(food.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isFoodMatched(food.id)
                        ? getMatchResult(food.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedFood?.id === food.id
                          ? "bg-blue-500/50 border-2 border-blue-400"
                          : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{food.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{food.name}</h4>
                        <p className="text-white/80 text-sm">{food.description}</p>
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
                  {selectedFood 
                    ? `Selected: ${selectedFood.name}` 
                    : "Select a Food"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedFood || !selectedFootprint}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedFood && selectedFootprint
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{foods.length}</p>
                  <p>Matched: {matches.length}/{foods.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Environmental Footprints */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Environmental Footprints</h3>
              <div className="space-y-4">
                {footprints.map(footprint => (
                  <button
                    key={footprint.id}
                    onClick={() => handleFootprintSelect(footprint)}
                    disabled={isFootprintMatched(footprint.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isFootprintMatched(footprint.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedFootprint?.id === footprint.id
                          ? "bg-purple-500/50 border-2 border-purple-400"
                          : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{footprint.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{footprint.name}</h4>
                        <p className="text-white/80 text-sm">{footprint.description}</p>
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
                <div className="text-5xl mb-4">🌱</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {foods.length} foods with their environmental footprints!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding food impacts helps make sustainable choices!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {foods.length} foods correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Consider transport, processing, and production methods when choosing food!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleFoodChainImpact;