import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMemo } from "react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const PuzzleMaterialLife = () => {
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
      const games = getSustainabilityKidsGames({});
      const currentGame = games.find(g => g.id === "sustainability-kids-69");
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
  
  // Get game data from game category folder (source of truth)
  const gameId = "sustainability-kids-69";
  const gameData = getGameDataById(gameId);
  
  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Materials (left side) - 5 items
  const materials = [
    { id: 1, name: "Bottle", emoji: "🥤",  },
    { id: 2, name: "Box", emoji: "📦",  },
    { id: 3, name: "Crayon", emoji: "🖍️",  },
    { id: 4, name: "Jar", emoji: "🫙",  },
    { id: 5, name: "T-Shirt", emoji: "👕",  }
  ];

  // Actions (right side) - 5 items
  const actions = [
    { id: 3, name: "Upcycle", emoji: "🔄",  },
    { id: 5, name: "Donate", emoji: "🎁",  },
    { id: 1, name: "Reuse", emoji: "🔄",  },
    { id: 4, name: "Recycle", emoji: "♻️",  },
    { id: 2, name: "Repurpose", emoji: "🔧",  }
  ];

  // Correct matches
  const correctMatches = [
    { itemId: 1, methodId: 1 }, // Bottle → Reuse
    { itemId: 2, methodId: 4 }, // Box → Recycle
    { itemId: 3, methodId: 3 }, // Crayon → Upcycle
    { itemId: 4, methodId: 2 }, // Jar → Repurpose
    { itemId: 5, methodId: 5 }  // T-Shirt → Donate
  ];

  const handleItemSelect = (item) => {
    if (gameFinished) return;
    setSelectedItem(item);
  };

  const handleMethodSelect = (method) => {
    if (gameFinished) return;
    setSelectedMethod(method);
  };

  const handleMatch = () => {
    if (!selectedItem || !selectedMethod || gameFinished) return;

    resetFeedback();

    const newMatch = {
      itemId: selectedItem.id,
      methodId: selectedMethod.id,
      isCorrect: correctMatches.some(
        match => match.itemId === selectedItem.id && match.methodId === selectedMethod.id
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
    if (newMatches.length === materials.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedItem(null);
    setSelectedMethod(null);
  };

  // Check if an item is already matched
  const isItemMatched = (itemId) => {
    return matches.some(match => match.itemId === itemId);
  };

  // Check if a method is already matched
  const isMethodMatched = (methodId) => {
    return matches.some(match => match.methodId === methodId);
  };

  // Get match result for an item
  const getMatchResult = (itemId) => {
    const match = matches.find(m => m.itemId === itemId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Material Life"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Materials with Actions (${matches.length}/${materials.length} matched)`}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={materials.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === materials.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/sustainability/kids"
      maxScore={materials.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    
      nextGamePathProp="/student/sustainability/kids/craft-story"
      nextGameIdProp="sustainability-kids-70">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Materials */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Materials</h3>
              <div className="space-y-4">
                {materials.map(item => (
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
                    : "Select a Material"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedItem || !selectedMethod}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedItem && selectedMethod
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{materials.length}</p>
                  <p>Matched: {matches.length}/{materials.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Actions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Actions</h3>
              <div className="space-y-4">
                {actions.map(method => (
                  <button
                    key={method.id}
                    onClick={() => handleMethodSelect(method)}
                    disabled={isMethodMatched(method.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isMethodMatched(method.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedMethod?.id === method.id
                          ? "bg-purple-500/50 border-2 border-purple-400"
                          : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{method.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{method.name}</h4>
                        <p className="text-white/80 text-sm">{method.description}</p>
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
                <div className="text-5xl mb-4">🔄</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {materials.length} materials with their proper actions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding how to properly handle materials helps reduce waste and protect our environment!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {materials.length} materials correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about the best way to handle each material to minimize waste!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleMaterialLife;