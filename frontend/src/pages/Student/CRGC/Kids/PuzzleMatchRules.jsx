import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchRules = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Rules (left side) - 5 items
  const rules = [
    { id: 1, name: "Seatbelt", emoji: "🚗",  },
    { id: 2, name: "Helmet", emoji: "🚴",  },
    { id: 3, name: "Signal", emoji: "🚦",  },
    { id: 4, name: "Recycle", emoji: "♻️",  },
    { id: 5, name: "Queue", emoji: "👥",  }
  ];

  // Categories (right side) - 5 items
  const categories = [
    { id: 2, name: "Bike Safety", emoji: "🛴",  },
    { id: 3, name: "Road Safety", emoji: "🛣️",  },
    { id: 1, name: "Car Safety", emoji: "🛡️",  },
    { id: 5, name: "Social Rule", emoji: "🤝",  },
    { id: 4, name: "Environmental Rule", emoji: "🌱",  },
  ];

  // Correct matches
  const correctMatches = [
    { ruleId: 1, categoryId: 1 }, // Seatbelt → Car Safety
    { ruleId: 2, categoryId: 2 }, // Helmet → Bike Safety
    { ruleId: 3, categoryId: 3 }, // Signal → Road Safety
    { ruleId: 4, categoryId: 4 }, // Recycle → Environmental Rule
    { ruleId: 5, categoryId: 5 }  // Queue → Social Rule
  ];

  const handleRuleSelect = (rule) => {
    if (gameFinished) return;
    setSelectedRule(rule);
  };

  const handleCategorySelect = (category) => {
    if (gameFinished) return;
    setSelectedCategory(category);
  };

  const handleMatch = () => {
    if (!selectedRule || !selectedCategory || gameFinished) return;

    resetFeedback();

    const newMatch = {
      ruleId: selectedRule.id,
      categoryId: selectedCategory.id,
      isCorrect: correctMatches.some(
        match => match.ruleId === selectedRule.id && match.categoryId === selectedCategory.id
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
    if (newMatches.length === rules.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedRule(null);
    setSelectedCategory(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedRule(null);
    setSelectedCategory(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/kids");
  };

  // Check if a rule is already matched
  const isRuleMatched = (ruleId) => {
    return matches.some(match => match.ruleId === ruleId);
  };

  // Check if a category is already matched
  const isCategoryMatched = (categoryId) => {
    return matches.some(match => match.categoryId === categoryId);
  };

  // Get match result for a rule
  const getMatchResult = (ruleId) => {
    const match = matches.find(m => m.ruleId === ruleId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Match Rules"
      subtitle={gameFinished ? "Game Complete!" : `Match Rules with Their Categories (${matches.length}/${rules.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="civic-responsibility-kids-74"
      gameType="civic-responsibility"
      totalLevels={rules.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/kids"
      maxScore={rules.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Rules */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Safety Rules</h3>
              <div className="space-y-4">
                {rules.map(rule => (
                  <button
                    key={rule.id}
                    onClick={() => handleRuleSelect(rule)}
                    disabled={isRuleMatched(rule.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isRuleMatched(rule.id)
                        ? getMatchResult(rule.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedRule?.id === rule.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{rule.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{rule.name}</h4>
                        <p className="text-white/80 text-sm">{rule.description}</p>
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
                  {selectedRule 
                    ? `Selected: ${selectedRule.name}` 
                    : "Select a Rule"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedRule || !selectedCategory}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedRule && selectedCategory
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{rules.length}</p>
                  <p>Matched: {matches.length}/{rules.length}</p>
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
                  You correctly matched {score} out of {rules.length} rules with their categories!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Following rules keeps us safe, protects our environment, and helps society function smoothly!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {rules.length} rules correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about what category each safety rule belongs to!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleMatchRules;