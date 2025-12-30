import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FoodMatchPuzzle = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-14";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedNutrient, setSelectedNutrient] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Foods (left side) - 5 items
  const foods = [
    { id: 1, name: "Milk", emoji: "🥛",  },
    { id: 2, name: "Dal (Lentils)", emoji: "🍛",  },
    { id: 3, name: "Carrot", emoji: "🥕",  },
    { id: 4, name: "Banana", emoji: "🍌",  },
    { id: 5, name: "Egg", emoji: "🥚",  },
  ];

  // Nutrients (right side) - 5 items
  const nutrients = [
    { id: 3, name: "Vitamins", emoji: "🌟",  },
    { id: 5, name: "Protein", emoji: "💪",  },
    { id: 1, name: "Calcium", emoji: "🦴",  },
    { id: 4, name: "Energy", emoji: "⚡",  },
    { id: 2, name: "Fiber", emoji: "🌾",  }
  ];

  // Correct matches
  const correctMatches = [
    { foodId: 1, nutrientId: 1 }, // Milk → Calcium
    { foodId: 2, nutrientId: 2 }, // Dal → Fiber
    { foodId: 3, nutrientId: 3 }, // Carrot → Vitamins
    { foodId: 4, nutrientId: 4 }, // Banana → Energy
    { foodId: 5, nutrientId: 5 }  // Egg → Protein
  ];

  const handleFoodSelect = (food) => {
    if (gameFinished) return;
    setSelectedFood(food);
  };

  const handleNutrientSelect = (nutrient) => {
    if (gameFinished) return;
    setSelectedNutrient(nutrient);
  };

  const handleMatch = () => {
    if (!selectedFood || !selectedNutrient || gameFinished) return;

    resetFeedback();

    const newMatch = {
      foodId: selectedFood.id,
      nutrientId: selectedNutrient.id,
      isCorrect: correctMatches.some(
        match => match.foodId === selectedFood.id && match.nutrientId === selectedNutrient.id
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
    if (newMatches.length === foods.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedFood(null);
    setSelectedNutrient(null);
  };

  // Check if a food is already matched
  const isFoodMatched = (foodId) => {
    return matches.some(match => match.foodId === foodId);
  };

  // Check if a nutrient is already matched
  const isNutrientMatched = (nutrientId) => {
    return matches.some(match => match.nutrientId === nutrientId);
  };

  // Get match result for a food
  const getMatchResult = (foodId) => {
    const match = matches.find(m => m.foodId === foodId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Food Match Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Foods with Nutrients (${matches.length}/${foods.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-male"
      totalLevels={foods.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === foods.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/health-male/kids"
      maxScore={foods.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
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
                  disabled={!selectedFood || !selectedNutrient}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedFood && selectedNutrient
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

            {/* Right column - Nutrients */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Nutrients</h3>
              <div className="space-y-4">
                {nutrients.map(nutrient => (
                  <button
                    key={nutrient.id}
                    onClick={() => handleNutrientSelect(nutrient)}
                    disabled={isNutrientMatched(nutrient.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isNutrientMatched(nutrient.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedNutrient?.id === nutrient.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{nutrient.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{nutrient.name}</h4>
                        <p className="text-white/80 text-sm">{nutrient.description}</p>
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
                  You correctly matched {score} out of {foods.length} foods with their nutrients!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Different foods provide different nutrients that keep your body healthy and strong!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {foods.length} foods correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about what each food is known for providing to your body!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FoodMatchPuzzle;
