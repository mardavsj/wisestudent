import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getFinanceTeenGames } from "../../../../pages/Games/GameCategories/Finance/teenGamesData";

const PuzzleOfEntrepreneurs = () => {
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
      const currentGame = games.find(g => g.id === "finance-teens-74");
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
  const [selectedField, setSelectedField] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Entrepreneurs (left side) - 5 items
  const items = [
    { id: 1, name: "Ratan Tata", emoji: "👔",  },
    { id: 2, name: "Elon Musk", emoji: "🚀",  },
    { id: 3, name: "Narayana Murthy", emoji: "💻",  },
    { id: 4, name: "Kiran Mazumdar", emoji: "🔬",  },
    { id: 5, name: "Falguni Nayar", emoji: "💄",  }
  ];

  // Fields (right side) - 5 items
  const fields = [
    { id: 6, name: "Industry", emoji: "🏭",  },
    { id: 7, name: "Innovation", emoji: "💡",  },
    { id: 8, name: "IT", emoji: "💻",  },
    { id: 9, name: "Biotech", emoji: "🧬",  },
    { id: 10, name: "E-commerce", emoji: "🛒",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedFields = [
    fields[2], // IT (id: 8)
    fields[4], // E-commerce (id: 10)
    fields[1], // Innovation (id: 7)
    fields[0], // Industry (id: 6)
    fields[3]  // Biotech (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each item has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { itemId: 1, fieldId: 6 }, // Ratan Tata → Industry
    { itemId: 2, fieldId: 7 }, // Elon Musk → Innovation
    { itemId: 3, fieldId: 8 }, // Narayana Murthy → IT
    { itemId: 4, fieldId: 9 }, // Kiran Mazumdar → Biotech
    { itemId: 5, fieldId: 10 }  // Falguni Nayar → E-commerce
  ];

  const handleItemSelect = (item) => {
    if (gameFinished) return;
    setSelectedItem(item);
  };

  const handleFieldSelect = (field) => {
    if (gameFinished) return;
    setSelectedField(field);
  };

  const handleMatch = () => {
    if (!selectedItem || !selectedField || gameFinished) return;

    resetFeedback();

    const newMatch = {
      itemId: selectedItem.id,
      fieldId: selectedField.id,
      isCorrect: correctMatches.some(
        match => match.itemId === selectedItem.id && match.fieldId === selectedField.id
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
    setSelectedField(null);
  };

  // Check if an item is already matched
  const isItemMatched = (itemId) => {
    return matches.some(match => match.itemId === itemId);
  };

  // Check if a field is already matched
  const isFieldMatched = (fieldId) => {
    return matches.some(match => match.fieldId === fieldId);
  };

  // Get match result for an item
  const getMatchResult = (itemId) => {
    const match = matches.find(m => m.itemId === itemId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle of Entrepreneurs"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Entrepreneurs with Fields (${matches.length}/${items.length} matched)`}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="finance-teens-74"
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
            {/* Left column - Entrepreneurs */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Entrepreneurs</h3>
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
                    : "Select an Entrepreneur"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedItem || !selectedField}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedItem && selectedField
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

            {/* Right column - Fields */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Fields</h3>
              <div className="space-y-4">
                {rearrangedFields.map(field => (
                  <button
                    key={field.id}
                    onClick={() => handleFieldSelect(field)}
                    disabled={isFieldMatched(field.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isFieldMatched(field.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedField?.id === field.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{field.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{field.name}</h4>
                        <p className="text-white/80 text-sm">{field.description}</p>
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
                  You correctly matched {score} out of {items.length} entrepreneurs with their fields!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding entrepreneurial fields helps inspire innovation!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {items.length} entrepreneurs correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about which field each entrepreneur is most known for!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleOfEntrepreneurs;