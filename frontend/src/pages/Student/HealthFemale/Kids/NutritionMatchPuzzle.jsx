import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const NutritionMatchPuzzle = () => {
  const navigate = useNavigate();
  
  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-14";
  
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedNutrient, setSelectedNutrient] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  // Nutrients (left side) - 5 items
  const nutrients = [
    { id: 1, name: "Calcium", emoji: "🥛",  },
    { id: 2, name: "Carbohydrates", emoji: "🍚",  },
    { id: 3, name: "Vitamins", emoji: "🍊",  },
    { id: 4, name: "Protein", emoji: "🍗",  },
    { id: 5, name: "Vitamin A", emoji: "🥕",  }
  ];
  
  // Functions (right side) - 5 items (shuffled order)
  const functions = [
    { id: 4, text: "Builds and repairs body tissues",  },
    { id: 1, text: "Strengthens bones and teeth",  },
    { id: 5, text: "Supports healthy vision",  },
    { id: 2, text: "Provides primary energy source",  },
    { id: 3, text: "Boosts immune system function",  }
  ];
  
  // Correct matches
  const correctMatches = [
    { nutrientId: 1, functionId: 1 }, // Calcium → Strengthens bones and teeth
    { nutrientId: 2, functionId: 2 }, // Carbohydrates → Provides primary energy source
    { nutrientId: 3, functionId: 3 }, // Vitamins → Boosts immune system function
    { nutrientId: 4, functionId: 4 }, // Protein → Builds and repairs body tissues
    { nutrientId: 5, functionId: 5 }  // Vitamin A → Supports healthy vision
  ];
  
  const handleNutrientSelect = (nutrient) => {
    if (gameFinished) return;
    setSelectedNutrient(nutrient);
  };
  
  const handleFunctionSelect = (func) => {
    if (gameFinished) return;
    setSelectedFunction(func);
  };
  
  const handleMatch = () => {
    if (!selectedNutrient || !selectedFunction || gameFinished) return;
    
    resetFeedback();
    
    const newMatch = {
      nutrientId: selectedNutrient.id,
      functionId: selectedFunction.id,
      isCorrect: correctMatches.some(
        match => match.nutrientId === selectedNutrient.id && match.functionId === selectedFunction.id
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
    setSelectedFunction(null);
  };
  
  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedNutrient(null);
    setSelectedFunction(null);
    setScore(0);
    resetFeedback();
  };
  
  const handleNext = () => {
    navigate("/games/health-female/kids");
  };
  
  // Check if a nutrient is already matched
  const isNutrientMatched = (nutrientId) => {
    return matches.some(match => match.nutrientId === nutrientId);
  };
  
  // Check if a function is already matched
  const isFunctionMatched = (functionId) => {
    return matches.some(match => match.functionId === functionId);
  };
  
  // Get match result for a nutrient
  const getMatchResult = (nutrientId) => {
    const match = matches.find(m => m.nutrientId === nutrientId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Nutrition Match Puzzle"
      subtitle={gameFinished ? "Game Complete!" : `Match Nutrients with Functions (${matches.length}/${nutrients.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-female"
      totalLevels={nutrients.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/health-female/kids/lunchbox-story"
      nextGameIdProp="health-female-kids-15">
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
                  disabled={!selectedNutrient || !selectedFunction}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedNutrient && selectedFunction
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
            
            {/* Right column - Functions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Functions</h3>
              <div className="space-y-4">
                {functions.map(func => (
                  <button
                    key={func.id}
                    onClick={() => handleFunctionSelect(func)}
                    disabled={isFunctionMatched(func.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isFunctionMatched(func.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedFunction?.id === func.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div>
                        <h4 className="font-bold text-white">{func.text}</h4>
                        <p className="text-white/80 text-sm">{func.hint}</p>
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
                  You correctly matched {score} out of {nutrients.length} nutrients with their functions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding nutrients and their functions helps you make healthier food choices!
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
                  Tip: Think about what each nutrient does for your body when matching it with its function!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default NutritionMatchPuzzle;