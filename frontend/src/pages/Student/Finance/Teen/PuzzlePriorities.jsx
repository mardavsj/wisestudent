import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getFinanceTeenGames } from "../../../../pages/Games/GameCategories/Finance/teenGamesData";

const PuzzlePriorities = () => {
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
      const games = getFinanceTeenGames({});
      const currentGame = games.find(g => g.id === "finance-teens-24");
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
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Expenses (left side) - 5 items
  const items = [
    { id: 1, name: "School Fees", emoji: "🎓",  },
    { id: 2, name: "Groceries", emoji: "🛒",  },
    { id: 3, name: "Rent", emoji: "🏠",  },
    { id: 4, name: "Medicine", emoji: "💊",  },
    { id: 5, name: "Electricity", emoji: "💡",  }
  ];

  // Priorities (right side) - 5 items
  const priorities = [
    { id: 6, name: "Need", emoji: "✅",  },
    { id: 7, name: "Want", emoji: "🎁",  },
    { id: 8, name: "Save", emoji: "💰",  },
    { id: 9, name: "Invest", emoji: "📈",  },
    { id: 10, name: "Share", emoji: "🤲",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedPriorities = [
    priorities[2], // Save (id: 8)
    priorities[4], // Share (id: 10)
    priorities[1], // Want (id: 7)
    priorities[0], // Need (id: 6)
    priorities[3]  // Invest (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each item has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { itemId: 1, priorityId: 6 }, // School Fees → Need
    { itemId: 2, priorityId: 7 }, // Groceries → Want
    { itemId: 3, priorityId: 8 }, // Rent → Save
    { itemId: 4, priorityId: 9 }, // Medicine → Invest
    { itemId: 5, priorityId: 10 } // Electricity → Share
  ];  const handleItemSelect = (item) => {
    if (gameFinished) return;
    setSelectedItem(item);
  };

  const handlePrioritySelect = (priority) => {
    if (gameFinished) return;
    setSelectedPriority(priority);
  };

  const handleMatch = () => {
    if (!selectedItem || !selectedPriority || gameFinished) return;

    resetFeedback();

    const newMatch = {
      itemId: selectedItem.id,
      priorityId: selectedPriority.id,
      isCorrect: correctMatches.some(
        match => match.itemId === selectedItem.id && match.priorityId === selectedPriority.id
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
    setSelectedPriority(null);
  };

  // Check if an item is already matched
  const isItemMatched = (itemId) => {
    return matches.some(match => match.itemId === itemId);
  };

  // Check if a priority is already matched
  const isPriorityMatched = (priorityId) => {
    return matches.some(match => match.priorityId === priorityId);
  };

  // Get match result for an item
  const getMatchResult = (itemId) => {
    const match = matches.find(m => m.itemId === itemId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle of Priorities"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Expenses with Priorities (${matches.length}/${items.length} matched)`}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="finance-teens-24"
      gameType="finance"
      totalLevels={items.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === items.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/financial-literacy/teens"
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
            {/* Left column - Expenses */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Expenses</h3>
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
                    : "Select an Expense"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedItem || !selectedPriority}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedItem && selectedPriority
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

            {/* Right column - Priorities */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Priorities</h3>
              <div className="space-y-4">
                {rearrangedPriorities.map(priority => (
                  <button
                    key={priority.id}
                    onClick={() => handlePrioritySelect(priority)}
                    disabled={isPriorityMatched(priority.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isPriorityMatched(priority.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedPriority?.id === priority.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{priority.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{priority.name}</h4>
                        <p className="text-white/80 text-sm">{priority.description}</p>
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
                  You correctly matched {score} out of {items.length} expenses with their priorities!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding expense priorities helps make smart financial decisions!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {items.length} expenses correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about whether each expense is essential or discretionary!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzlePriorities;