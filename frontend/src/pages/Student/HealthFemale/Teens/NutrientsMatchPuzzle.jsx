import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const NutrientsMatchPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 1; // 1 coin per correct match
  const totalCoins = location.state?.totalCoins || 5; // Total coins for 5 matches
  const totalXp = location.state?.totalXp || 10; // Total XP
  
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedNutrient, setSelectedNutrient] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  // Nutrients (left side) - 5 items
  const nutrients = [
    { id: 1, name: "Iron", emoji: "🩸",  },
    { id: 2, name: "Vitamin C", emoji: "🍊",  },
    { id: 3, name: "Protein", emoji: "🥚",  },
    { id: 4, name: "Calcium", emoji: "🥛",  },
    { id: 5, name: "Fiber", emoji: "🌾",  }
  ];
  
  // Food Sources (right side) - 5 items (shuffled order)
  const sources = [
    { id: 3, text: "Eggs and lean meats",  },
    { id: 5, text: "Whole grains and vegetables",  },
    { id: 1, text: "Spinach and red meat",  },
    { id: 4, text: "Dairy products and leafy greens",  },
    { id: 2, text: "Citrus fruits and berries",  }
  ];
  
  // Correct matches
  const correctMatches = [
    { nutrientId: 1, sourceId: 1 }, // Iron → Spinach and red meat
    { nutrientId: 2, sourceId: 2 }, // Vitamin C → Citrus fruits and berries
    { nutrientId: 3, sourceId: 3 }, // Protein → Eggs and lean meats
    { nutrientId: 4, sourceId: 4 }, // Calcium → Dairy products and leafy greens
    { nutrientId: 5, sourceId: 5 }  // Fiber → Whole grains and vegetables
  ];
  
  const handleNutrientSelect = (nutrient) => {
    if (gameFinished) return;
    setSelectedNutrient(nutrient);
  };
  
  const handleSourceSelect = (source) => {
    if (gameFinished) return;
    setSelectedSource(source);
  };
  
  const handleMatch = () => {
    if (!selectedNutrient || !selectedSource || gameFinished) return;
    
    resetFeedback();
    
    const newMatch = {
      nutrientId: selectedNutrient.id,
      sourceId: selectedSource.id,
      isCorrect: correctMatches.some(
        match => match.nutrientId === selectedNutrient.id && match.sourceId === selectedSource.id
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
    if (newMatches.length === nutrients.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }
    
    // Reset selections
    setSelectedNutrient(null);
    setSelectedSource(null);
  };
  
  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedNutrient(null);
    setSelectedSource(null);
    setScore(0);
    resetFeedback();
  };
  
  const handleNext = () => {
    navigate("/games/health-female/teens");
  };
  
  // Check if a nutrient is already matched
  const isNutrientMatched = (nutrientId) => {
    return matches.some(match => match.nutrientId === nutrientId);
  };
  
  // Check if a source is already matched
  const isSourceMatched = (sourceId) => {
    return matches.some(match => match.sourceId === sourceId);
  };
  
  // Get match result for a nutrient
  const getMatchResult = (nutrientId) => {
    const match = matches.find(m => m.nutrientId === nutrientId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Nutrients Match"
      subtitle={gameFinished ? "Game Complete!" : `Match Nutrients with Food Sources (${matches.length}/${nutrients.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-female-teen-14"
      gameType="health-female"
      totalLevels={nutrients.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={nutrients.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/health-female/teens/sports-energy-story"
      nextGameIdProp="health-female-teen-15">
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
                        <p className="text-white/80 text-sm">{nutrient.hint}</p>
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
                  disabled={!selectedNutrient || !selectedSource}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedNutrient && selectedSource
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
            
            {/* Right column - Food Sources */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Food Sources</h3>
              <div className="space-y-4">
                {sources.map(source => (
                  <button
                    key={source.id}
                    onClick={() => handleSourceSelect(source)}
                    disabled={isSourceMatched(source.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isSourceMatched(source.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedSource?.id === source.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div>
                        <h4 className="font-bold text-white">{source.text}</h4>
                        <p className="text-white/80 text-sm">{source.hint}</p>
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
                  Lesson: Understanding nutrients and their food sources helps you make informed dietary choices for optimal health!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {nutrients.length} nutrients correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about what each nutrient does for your body when matching it with food sources!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default NutrientsMatchPuzzle;