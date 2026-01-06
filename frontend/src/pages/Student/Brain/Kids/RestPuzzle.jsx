import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";


const RestPuzzle = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-64");
  const gameId = gameData?.id || "brain-kids-64";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for RestPuzzle, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Left side - rest activities
  const leftItems = [
    { id: 1, name: "Nap", emoji: "🛌",   },
    { id: 2, name: "All-night TV", emoji: "📺",   },
    { id: 3, name: "Early Sleep", emoji: "🌙",   },
    { id: 4, name: "Late Gaming", emoji: "🎮",   },
    { id: 5, name: "Quiet Time", emoji: "🧘",   }
  ];

  // Right side - effects
  const rightItems = [
    { id: 1, name: "Energy", emoji: "🙂",   },
    { id: 2, name: "Tired", emoji: "😢",   },
    { id: 3, name: "Restored", emoji: "😊",   },
    { id: 4, name: "Exhausted", emoji: "😞",   },
    { id: 5, name: "Calm", emoji: "😌",   }
  ];

  // Correct matches
  const correctMatches = [
    { leftId: 1, rightId: 1 }, // Nap → Energy
    { leftId: 2, rightId: 2 }, // All-night TV → Tired
    { leftId: 3, rightId: 3 }, // Early Sleep → Restored
    { leftId: 4, rightId: 4 }, // Late Gaming → Exhausted
    { leftId: 5, rightId: 5 }  // Quiet Time → Calm
  ];

  // Shuffled right items for display (to split matches across positions)
  const shuffledRightItems = [
    rightItems[2], // Restored (id: 3) - position 1
    rightItems[4], // Calm (id: 5) - position 2
    rightItems[0], // Energy (id: 1) - position 3
    rightItems[3], // Exhausted (id: 4) - position 4
    rightItems[1]  // Tired (id: 2) - position 5
  ];

  const handleLeftSelect = (item) => {
    if (showResult) return;
    setSelectedLeft(item);
  };

  const handleRightSelect = (item) => {
    if (showResult) return;
    setSelectedRight(item);
  };

  const handleMatch = () => {
    if (!selectedLeft || !selectedRight || showResult) return;

    resetFeedback();

    const newMatch = {
      leftId: selectedLeft.id,
      rightId: selectedRight.id,
      isCorrect: correctMatches.some(
        match => match.leftId === selectedLeft.id && match.rightId === selectedRight.id
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
    if (newMatches.length === leftItems.length) {
      setTimeout(() => {
        setShowResult(true);
        setScore(leftItems.length); // Ensure score matches total for GameOverModal
      }, 1000);
    }

    // Reset selections
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const isMatched = (leftId, rightId) => {
    return matches.some(m => m.leftId === leftId && m.rightId === rightId && m.isCorrect);
  };

  return (
    <GameShell
      title="Puzzle of Rest"
      subtitle={!showResult ? `Match ${matches.length}/${leftItems.length} pairs` : "Puzzle Complete!"}
      score={score}
      currentLevel={matches.length + 1}
      totalLevels={leftItems.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={leftItems.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="brain"
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Matches: {matches.length}/{leftItems.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{leftItems.length}</span>
              </div>
              
              <p className="text-white text-center mb-6">
                Match rest activities with their effects!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 relative">
                {/* Left side */}
                <div className="space-y-3">
                  <h3 className="text-white font-bold text-center mb-4">Rest Activities</h3>
                  {leftItems.map((item) => {
                    const matched = matches.some(m => m.leftId === item.id && m.isCorrect);
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleLeftSelect(item)}
                        disabled={matched || showResult}
                        className={`w-full p-4 rounded-xl transition-all ${
                          selectedLeft?.id === item.id
                            ? "bg-blue-500 border-2 border-blue-300"
                            : matched
                            ? "bg-green-500/50 border-2 border-green-300"
                            : "bg-white/10 border-2 border-white/20 hover:bg-white/20"
                        } ${matched ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{item.emoji}</div>
                          <div className="text-left flex-1">
                            <div className="text-white font-bold">{item.name}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                {/* Middle - Match Button */}
                <div className="hidden md:flex items-center justify-center">
                  {selectedLeft && selectedRight && (
                    <button
                      onClick={handleMatch}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-6 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg"
                    >
                      Match!
                    </button>
                  )}
                </div>
                
                {/* Right side */}
                <div className="space-y-3">
                  <h3 className="text-white font-bold text-center mb-4">Effects</h3>
                  {shuffledRightItems.map((item) => {
                    const matched = matches.some(m => m.rightId === item.id && m.isCorrect);
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleRightSelect(item)}
                        disabled={matched || showResult}
                        className={`w-full p-4 rounded-xl transition-all ${
                          selectedRight?.id === item.id
                            ? "bg-blue-500 border-2 border-blue-300"
                            : matched
                            ? "bg-green-500/50 border-2 border-green-300"
                            : "bg-white/10 border-2 border-white/20 hover:bg-white/20"
                        } ${matched ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{item.emoji}</div>
                          <div className="text-left flex-1">
                            <div className="text-white font-bold">{item.name}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Match button for mobile - shown at bottom */}
              {selectedLeft && selectedRight && (
                <div className="mt-6 flex md:hidden justify-center items-center">
                  <button
                    onClick={handleMatch}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-8 rounded-full font-bold transition-all"
                  >
                    Match!
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default RestPuzzle;
