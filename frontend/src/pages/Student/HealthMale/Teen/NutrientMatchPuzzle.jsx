import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const NutrientMatchPuzzle = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-14";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedNutrient, setSelectedNutrient] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Nutrients (left side) - 5 items
  const nutrients = [
    { id: 1, name: "Protein", emoji: "💪",  },
    { id: 2, name: "Vitamin C", emoji: "©️" },
    { id: 3, name: "Iron", emoji: "🔗" },
    { id: 4, name: "Calcium", emoji: "🦴" },
    { id: 5, name: "Carbohydrates", emoji: "🌾" }
  ];

  // Foods (right side) - 5 items
  const foods = [
    { id: 3, name: "Spinach", emoji: "🍃" },
    { id: 5, name: "Rice", emoji: "🍚" },
    { id: 1, name: "Eggs", emoji: "🥚" },
    { id: 4, name: "Milk", emoji: "🥛" },
    { id: 2, name: "Orange", emoji: "🍊" }
  ];

  // Correct matches
  const correctMatches = [
    { nutrientId: 1, foodId: 1 }, // Protein → Eggs
    { nutrientId: 2, foodId: 2 }, // Vitamin C → Orange
    { nutrientId: 3, foodId: 3 }, // Iron → Spinach
    { nutrientId: 4, foodId: 4 }, // Calcium → Milk
    { nutrientId: 5, foodId: 5 }  // Carbohydrates → Rice
  ];

  const handleNutrientSelect = (nutrient) => {
    if (gameFinished) return;
    setSelectedNutrient(nutrient);
  };

  const handleFoodSelect = (food) => {
    if (gameFinished) return;
    setSelectedFood(food);
  };

  const handleMatch = () => {
    if (!selectedNutrient || !selectedFood || gameFinished) return;

    resetFeedback();

    const newMatch = {
      nutrientId: selectedNutrient.id,
      foodId: selectedFood.id,
      isCorrect: correctMatches.some(
        match => match.nutrientId === selectedNutrient.id && match.foodId === selectedFood.id
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
    if (newMatches.length === nutrients.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedNutrient(null);
    setSelectedFood(null);
  };

  // Check if a nutrient is already matched
  const isNutrientMatched = (nutrientId) => {
    return matches.some(match => match.nutrientId === nutrientId);
  };

  // Check if a food is already matched
  const isFoodMatched = (foodId) => {
    return matches.some(match => match.foodId === foodId);
  };

  // Get match result for a nutrient
  const getMatchResult = (nutrientId) => {
    const match = matches.find(m => m.nutrientId === nutrientId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/sports-nutrition-story");
  };

  return (
    <GameShell
      title="Nutrient Match Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Nutrients with Foods (${matches.length}/${nutrients.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-male"
      totalLevels={nutrients.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === nutrients.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/health-male/teens"
      maxScore={nutrients.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Nutrients */}
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
                        ? getMatchResult(nutrient.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedNutrient?.id === nutrient.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
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

            {/* Middle column - Match button */}
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
                <p className="text-white/80 mb-4">
                  {selectedNutrient 
                    ? `Selected: ${selectedNutrient.name}` 
                    : "Select a Nutrient"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedNutrient || !selectedFood}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedNutrient && selectedFood
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{nutrients.length}</p>
                  <p>Matched: {matches.length}/{nutrients.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Foods */}
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
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedFood?.id === food.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
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
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {nutrients.length} nutrients with their food sources!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Eating a variety of foods ensures you get all the nutrients your body needs!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {nutrients.length} nutrients correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about which foods are naturally rich in each nutrient!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default NutrientMatchPuzzle;
