import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getFinanceKidsGames } from "../../../../pages/Games/GameCategories/Finance/kidGamesData";

const PuzzleBankUses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getFinanceKidsGames({});
      const currentGame = games.find(g => g.id === "finance-kids-44");
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
  }, [location.state]);

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

  // Banking items (left side) - 5 items
  const items = [
    { id: 1, name: "Savings Account", emoji: "💰",  },
    { id: 2, name: "Loan", emoji: "📝",  },
    { id: 3, name: "ATM", emoji: "🏧",  },
    { id: 4, name: "Interest", emoji: "📈",  },
    { id: 5, name: "Financial Education", emoji: "📚",  }
  ];

  // Banking uses (right side) - 5 items
  const uses = [
    { id: 6, name: "Store Money", emoji: "🔒",  },
    { id: 7, name: "Borrow Funds", emoji: "💸",  },
    { id: 8, name: "Access Cash", emoji: "💵",  },
    { id: 9, name: "Earn Returns", emoji: "🪙",  },
    { id: 10, name: "Build Knowledge", emoji: "🧠",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedUses = [
    uses[2], // Access Cash (id: 8)
    uses[4], // Build Knowledge (id: 10)
    uses[1], // Borrow Funds (id: 7)
    uses[0], // Store Money (id: 6)
    uses[3]  // Earn Returns (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each item has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { itemId: 1, useId: 6 }, // Savings Account → Store Money
    { itemId: 2, useId: 7 }, // Loan → Borrow Funds
    { itemId: 3, useId: 8 }, // ATM → Access Cash
    { itemId: 4, useId: 9 }, // Interest → Earn Returns
    { itemId: 5, useId: 10 } // Financial Education → Build Knowledge
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

  return (
    <GameShell
      title="Puzzle: Bank Uses"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Banking Items with Uses (${matches.length}/${items.length} matched)`}
      showGameOver={gameFinished}
      score={score}
      gameId="finance-kids-44"
      gameType="finance"
      totalLevels={items.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === items.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/financial-literacy/kids"
      maxScore={items.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Banking Items */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Banking Items</h3>
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
                    : "Select a Banking Item"}
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
                {rearrangedUses.map(use => (
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
                  You correctly matched {score} out of {items.length} banking items with their uses!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding banking helps you make smart financial decisions!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {items.length} banking items correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about what each banking item is primarily used for!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleBankUses;