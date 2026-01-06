import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const MatchFeelingsPuzzle = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-44");
  const gameId = gameData?.id || "brain-kids-44";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for MatchFeelingsPuzzle, using fallback ID");
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

  // Left side – story actions / body clues (not direct)
const leftItems = [
  { id: 1, name: "Quiet grin", emoji: "🌤️" },
  { id: 2, name: "Eyes feel heavy", emoji: "💧" },
  { id: 3, name: "Tight eyebrows", emoji: "🧩" },
  { id: 4, name: "Can’t stay still", emoji: "⚡" },
  { id: 5, name: "Body feels shaky", emoji: "🍃" },
];

 // Right side – inner feelings (concept-based)
const rightItems = [
  { id: 1, name: "Joyful inside", emoji: "🎈" },
  { id: 2, name: "Feeling low", emoji: "🌧️" },
  { id: 3, name: "Upset energy", emoji: "🔥" },
  { id: 4, name: "Burst of excitement", emoji: "🎉" },
  { id: 5, name: "Feeling unsafe", emoji: "🛑" },
];

 // Correct matches (logic-based, not emoji-based)
const correctMatches = [
  { leftId: 1, rightId: 1 }, // Quiet grin → Joyful inside
  { leftId: 2, rightId: 2 }, // Eyes feel heavy → Feeling low
  { leftId: 3, rightId: 3 }, // Tight eyebrows → Upset energy
  { leftId: 4, rightId: 4 }, // Can’t stay still → Burst of excitement
  { leftId: 5, rightId: 5 }, // Body feels shaky → Feeling unsafe
];

 // Shuffled right items for display
const shuffledRightItems = [
  rightItems[3], // Burst of excitement
  rightItems[4], // Feeling low
  rightItems[1], // Feeling unsafe
  rightItems[0], // Joyful inside
  rightItems[2], // Upset energy
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
      }, 1000);
    }

    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const isMatched = (leftId, rightId) => {
    return matches.some(m => m.leftId === leftId && m.rightId === rightId && m.isCorrect);
  };

  const isLeftMatched = (leftId) => {
    return matches.some(m => m.leftId === leftId && m.isCorrect);
  };

  const isRightMatched = (rightId) => {
    return matches.some(m => m.rightId === rightId && m.isCorrect);
  };

  return (
    <GameShell
      title="Puzzle: Match Feelings"
      subtitle={!showResult ? `Match ${matches.length}/${leftItems.length}` : "Puzzle Complete!"}
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
              
              <p className="text-white text-lg mb-6 text-center">
                Match the expressions with the correct feelings!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left side */}
                <div className="space-y-3">
                  <h3 className="text-white font-bold text-center mb-4">Expressions</h3>
                  {leftItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleLeftSelect(item)}
                      disabled={isLeftMatched(item.id)}
                      className={`w-full p-4 rounded-xl transition-all ${
                        selectedLeft?.id === item.id
                          ? "bg-blue-500 border-4 border-blue-300"
                          : isLeftMatched(item.id)
                          ? "bg-green-500/30 border-2 border-green-400 opacity-60"
                          : "bg-white/10 border-2 border-white/20 hover:bg-white/20"
                      } ${isLeftMatched(item.id) ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{item.emoji}</span>
                        <div className="text-left">
                          <div className="text-white font-semibold">{item.name}</div>
                          <div className="text-white/70 text-sm">{item.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Right side */}
                <div className="space-y-3">
                  <h3 className="text-white font-bold text-center mb-4">Feelings</h3>
                  {shuffledRightItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleRightSelect(item)}
                      disabled={isRightMatched(item.id)}
                      className={`w-full p-4 rounded-xl transition-all ${
                        selectedRight?.id === item.id
                          ? "bg-blue-500 border-4 border-blue-300"
                          : isRightMatched(item.id)
                          ? "bg-green-500/30 border-2 border-green-400 opacity-60"
                          : "bg-white/10 border-2 border-white/20 hover:bg-white/20"
                      } ${isRightMatched(item.id) ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{item.emoji}</span>
                        <div className="text-left">
                          <div className="text-white font-semibold">{item.name}</div>
                          <div className="text-white/70 text-sm">{item.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Match button */}
              <div className="mt-6 text-center">
                <button
                  onClick={handleMatch}
                  disabled={!selectedLeft || !selectedRight}
                  className={`px-8 py-3 rounded-full font-bold transition-all ${
                    selectedLeft && selectedRight
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                      : "bg-white/20 text-white/50 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default MatchFeelingsPuzzle;
