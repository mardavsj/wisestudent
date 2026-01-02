import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchRights = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedRight, setSelectedRight] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Rights (left side) - 5 items
  const rights = [
    { id: 1, name: "School", emoji: "📚",  },
    { id: 2, name: "Hospital", emoji: "🏥",  },
    { id: 3, name: "Food", emoji: "🍎",  },
    { id: 4, name: "Home", emoji: "🏠",  },
    { id: 5, name: "Voice", emoji: "📢",  }
  ];

  // Categories (right side) - 5 items
  const categories = [
    { id: 2, name: "Healthcare", emoji: "⚕️",  },
    { id: 3, name: "Basic Needs", emoji: "🍽️",  },
    { id: 1, name: "Education", emoji: "🏫",  },
    { id: 5, name: "Expression", emoji: "💬",  },
    { id: 4, name: "Shelter", emoji: "🛌",  },
  ];

  // Correct matches
  const correctMatches = [
    { rightId: 1, categoryId: 1 }, // School → Education
    { rightId: 2, categoryId: 2 }, // Hospital → Healthcare
    { rightId: 3, categoryId: 3 }, // Food → Basic Needs
    { rightId: 4, categoryId: 4 }, // Home → Shelter
    { rightId: 5, categoryId: 5 }  // Voice → Expression
  ];

  const handleRightSelect = (right) => {
    if (gameFinished) return;
    setSelectedRight(right);
  };

  const handleCategorySelect = (category) => {
    if (gameFinished) return;
    setSelectedCategory(category);
  };

  const handleMatch = () => {
    if (!selectedRight || !selectedCategory || gameFinished) return;

    resetFeedback();

    const newMatch = {
      rightId: selectedRight.id,
      categoryId: selectedCategory.id,
      isCorrect: correctMatches.some(
        match => match.rightId === selectedRight.id && match.categoryId === selectedCategory.id
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
    if (newMatches.length === rights.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedRight(null);
    setSelectedCategory(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedRight(null);
    setSelectedCategory(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/kids");
  };

  // Check if a right is already matched
  const isRightMatched = (rightId) => {
    return matches.some(match => match.rightId === rightId);
  };

  // Check if a category is already matched
  const isCategoryMatched = (categoryId) => {
    return matches.some(match => match.categoryId === categoryId);
  };

  // Get match result for a right
  const getMatchResult = (rightId) => {
    const match = matches.find(m => m.rightId === rightId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Match Rights"
      subtitle={gameFinished ? "Game Complete!" : `Match Rights with Their Categories (${matches.length}/${rights.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="civic-responsibility-kids-64"
      gameType="civic-responsibility"
      totalLevels={rights.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/kids"
      maxScore={rights.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Rights */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Basic Rights</h3>
              <div className="space-y-4">
                {rights.map(right => (
                  <button
                    key={right.id}
                    onClick={() => handleRightSelect(right)}
                    disabled={isRightMatched(right.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isRightMatched(right.id)
                        ? getMatchResult(right.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedRight?.id === right.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{right.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{right.name}</h4>
                        <p className="text-white/80 text-sm">{right.description}</p>
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
                  {selectedRight 
                    ? `Selected: ${selectedRight.name}` 
                    : "Select a Right"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedRight || !selectedCategory}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedRight && selectedCategory
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{rights.length}</p>
                  <p>Matched: {matches.length}/{rights.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Categories */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Categories</h3>
              <div className="space-y-4">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    disabled={isCategoryMatched(category.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isCategoryMatched(category.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedCategory?.id === category.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{category.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{category.name}</h4>
                        <p className="text-white/80 text-sm">{category.description}</p>
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
                  You correctly matched {score} out of {rights.length} rights with their categories!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding our basic rights helps us become responsible citizens who respect others' rights too!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {rights.length} rights correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about what category each basic right belongs to!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleMatchRights;