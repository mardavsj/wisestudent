import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HygieneMatchPuzzle = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-44";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedUse, setSelectedUse] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Hygiene Items (left side) - 5 items
  const items = [
    { id: 1, name: "Soap", emoji: "🧼",  },
    { id: 2, name: "Deodorant", emoji: "🧴",  },
    { id: 3, name: "Face Wash", emoji: "🍶",  },
    { id: 4, name: "Toothbrush", emoji: "🪥",  },
    { id: 5, name: "Shampoo", emoji: "🍶",  },
  ];

  // Uses (right side) - 5 items
  const uses = [
    { id: 3, name: "For Acne", emoji: "🙂",  },
    { id: 5, name: "For Hair", emoji: "💇",  },
    { id: 1, name: "For Bath", emoji: "🛁",  },
    { id: 4, name: "For Teeth", emoji: "🦷",  },
    { id: 2, name: "For Smell", emoji: "🌸",  }
  ];

  // Correct matches
  const correctMatches = [
    { itemId: 1, useId: 1 }, // Soap → For Bath
    { itemId: 2, useId: 2 }, // Deodorant → For Smell
    { itemId: 3, useId: 3 }, // Face Wash → For Acne
    { itemId: 4, useId: 4 }, // Toothbrush → For Teeth
    { itemId: 5, useId: 5 }  // Shampoo → For Hair
  ];

  const handleItemSelect = (item) => {
    if (gameFinished) return;
    setSelectedItem(item);
  };

  const handleUseSelect = (use) => {
    if (gameFinished) return;
    setSelectedUse(use);
  };

  const handleMatch = () => {
    if (!selectedItem || !selectedUse || gameFinished) return;

    resetFeedback();

    const newMatch = {
      itemId: selectedItem.id,
      useId: selectedUse.id,
      isCorrect: correctMatches.some(
        match => match.itemId === selectedItem.id && match.useId === selectedUse.id
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
    if (newMatches.length === items.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedItem(null);
    setSelectedUse(null);
  };

  // Check if an item is already matched
  const isItemMatched = (itemId) => {
    return matches.some(match => match.itemId === itemId);
  };

  // Check if a use is already matched
  const isUseMatched = (useId) => {
    return matches.some(match => match.useId === useId);
  };

  // Get match result for an item
  const getMatchResult = (itemId) => {
    const match = matches.find(m => m.itemId === itemId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Hygiene Match Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Items with Their Uses (${matches.length}/${items.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/shaving-story"
      nextGameIdProp="health-male-kids-45"
      gameType="health-male"
      totalLevels={items.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === items.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/health-male/kids"
      maxScore={items.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Hygiene Items */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Hygiene Items</h3>
              <div className="space-y-4">
                {items.map(item => (
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
                    : "Select an Item"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedItem || !selectedUse}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedItem && selectedUse
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{items.length}</p>
                  <p>Matched: {matches.length}/{items.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Uses */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Uses</h3>
              <div className="space-y-4">
                {uses.map(use => (
                  <button
                    key={use.id}
                    onClick={() => handleUseSelect(use)}
                    disabled={isUseMatched(use.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isUseMatched(use.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedUse?.id === use.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{use.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{use.name}</h4>
                        <p className="text-white/80 text-sm">{use.description}</p>
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
                  You correctly matched {score} out of {items.length} hygiene items with their uses!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Using the right hygiene products keeps your body clean and healthy!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {items.length} items correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about what each product is designed to clean!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HygieneMatchPuzzle;

