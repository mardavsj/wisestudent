import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchCountries = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Countries (left side) - 5 items
  const countries = [
    { id: 1, name: "Japan", flag: "🇯🇵",  },
    { id: 2, name: "USA", flag: "🇺🇸",  },
    { id: 3, name: "Italy", flag: "🇮🇹",  },
    { id: 4, name: "Mexico", flag: "🇲🇽",  },
    { id: 5, name: "India", flag: "🇮🇳",  }
  ];

  // Foods (right side) - 5 items
  const foods = [
    { id: 5, name: "Biryani", emoji: "🍛" },
    { id: 3, name: "Pizza", emoji: "🍕" },
    { id: 2, name: "Burger", emoji: "🍔" },
    { id: 1, name: "Sushi", emoji: "🍣" },
    { id: 4, name: "Tacos", emoji: "🌮" },
  ];

  // Correct matches
  const correctMatches = [
    { countryId: 1, foodId: 1 }, // Japan → Sushi
    { countryId: 2, foodId: 2 }, // USA → Burger
    { countryId: 3, foodId: 3 }, // Italy → Pizza
    { countryId: 4, foodId: 4 }, // Mexico → Tacos
    { countryId: 5, foodId: 5 }  // India → Biryani
  ];

  const handleCountrySelect = (country) => {
    if (gameFinished) return;
    setSelectedCountry(country);
  };

  const handleFoodSelect = (food) => {
    if (gameFinished) return;
    setSelectedFood(food);
  };

  const handleMatch = () => {
    if (!selectedCountry || !selectedFood || gameFinished) return;

    resetFeedback();

    const newMatch = {
      countryId: selectedCountry.id,
      foodId: selectedFood.id,
      isCorrect: correctMatches.some(
        match => match.countryId === selectedCountry.id && match.foodId === selectedFood.id
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
    if (newMatches.length === countries.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedCountry(null);
    setSelectedFood(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedCountry(null);
    setSelectedFood(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/kids");
  };

  // Check if a country is already matched
  const isCountryMatched = (countryId) => {
    return matches.some(match => match.countryId === countryId);
  };

  // Check if a food is already matched
  const isFoodMatched = (foodId) => {
    return matches.some(match => match.foodId === foodId);
  };

  // Get match result for a country
  const getMatchResult = (countryId) => {
    const match = matches.find(m => m.countryId === countryId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Match Countries"
      subtitle={gameFinished ? "Game Complete!" : `Match Countries with Their Traditional Foods (${matches.length}/${countries.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="civic-responsibility-kids-84"
      gameType="civic-responsibility"
      totalLevels={countries.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/kids"
      maxScore={countries.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Countries */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Countries</h3>
              <div className="space-y-4">
                {countries.map(country => (
                  <button
                    key={country.id}
                    onClick={() => handleCountrySelect(country)}
                    disabled={isCountryMatched(country.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isCountryMatched(country.id)
                        ? getMatchResult(country.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedCountry?.id === country.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{country.flag}</div>
                      <div>
                        <h4 className="font-bold text-white">{country.name}</h4>
                        <p className="text-white/80 text-sm">{country.description}</p>
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
                  {selectedCountry 
                    ? `Selected: ${selectedCountry.name}` 
                    : "Select a Country"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedCountry || !selectedFood}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedCountry && selectedFood
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{countries.length}</p>
                  <p>Matched: {matches.length}/{countries.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Foods */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Traditional Foods</h3>
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
                  You correctly matched {score} out of {countries.length} countries with their traditional foods!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Every country has its own unique culinary traditions that reflect its culture and history!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {countries.length} countries correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about what traditional foods are associated with each country!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleMatchCountries;