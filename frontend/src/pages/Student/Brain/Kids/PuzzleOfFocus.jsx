import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { Zap, VolumeX, Brain, Coffee, Ear, Book, Moon } from 'lucide-react';

const PuzzleOfFocus = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-14");
  const gameId = gameData?.id || "brain-kids-14";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for PuzzleOfFocus, using fallback ID");
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

  // Focus concepts (left side)
  const leftItems = [
    { id: 1, name: "Meditation", emoji: "🧘",  },
    { id: 2, name: "Quiet Room", emoji: "🔇",  },
    { id: 3, name: "Listening", emoji: "👂",  },
    { id: 4, name: "Concentration", emoji: "🎯",  },
    { id: 5, name: "Noise", emoji: "🔊",  }
  ];

  // Effects (right side)
  const rightItems = [
    { id: 1, name: "Calm Mind", emoji: "🧠",  },
    { id: 2, name: "Better Focus", emoji: "✨",  },
    { id: 3, name: "Learn Better", emoji: "📚",  },
    { id: 4, name: "Sharp Thinking", emoji: "⚡",  },
    { id: 5, name: "Distraction", emoji: "😵",  }
  ];

  // Correct matches
  const correctMatches = [
    { leftId: 1, rightId: 1 }, // Meditation → Calm Mind
    { leftId: 2, rightId: 2 }, // Quiet Room → Better Focus
    { leftId: 3, rightId: 3 }, // Listening → Learn Better
    { leftId: 4, rightId: 4 }, // Concentration → Sharp Thinking
    { leftId: 5, rightId: 5 }  // Noise → Distraction
  ];

  // Shuffled right items for display (to split matches across positions)
  const shuffledRightItems = [
    rightItems[2], // Learn Better (id: 3) - position 1
    rightItems[4], // Distraction (id: 5) - position 2
    rightItems[0], // Calm Mind (id: 1) - position 3
    rightItems[3], // Sharp Thinking (id: 4) - position 4
    rightItems[1]  // Better Focus (id: 2) - position 5
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
      }, 800);
    }

    // Reset selections
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  // Check if a left item is already matched
  const isLeftItemMatched = (itemId) => {
    return matches.some(match => match.leftId === itemId);
  };

  // Check if a right item is already matched
  const isRightItemMatched = (itemId) => {
    return matches.some(match => match.rightId === itemId);
  };

  // Get match result for a left item
  const getMatchResult = (itemId) => {
    const match = matches.find(m => m.leftId === itemId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle of Focus"
      score={score}
      subtitle={showResult ? "Game Complete!" : `Match focus concepts to their effects (${matches.length}/${leftItems.length} matched)`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/brain/kids/homework-story"
      nextGameIdProp="brain-kids-15"
      gameType="brain"
      totalLevels={leftItems.length}
      currentLevel={matches.length + 1}
      maxScore={leftItems.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Focus Concepts */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Focus Concepts</h3>
              <div className="space-y-4">
                {leftItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleLeftSelect(item)}
                    disabled={isLeftItemMatched(item.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isLeftItemMatched(item.id)
                        ? getMatchResult(item.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedLeft?.id === item.id
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
                  {selectedLeft 
                    ? `Selected: ${selectedLeft.name}` 
                    : "Select a concept"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedLeft || !selectedRight}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedLeft && selectedRight
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match Selected
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{leftItems.length}</p>
                  <p>Matched: {matches.length}/{leftItems.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Effects */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Effects</h3>
              <div className="space-y-4">
                {shuffledRightItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleRightSelect(item)}
                    disabled={isRightItemMatched(item.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isRightItemMatched(item.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedRight?.id === item.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
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
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Matching!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {leftItems.length} focus concepts!
                  You understand how focus works!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  You know that meditation creates calm, quiet rooms help focus, and listening improves learning!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {leftItems.length} focus concepts correctly.
                  Remember, understanding these concepts helps you focus better!
                </p>
                <p className="text-white/80 text-sm">
                  Try to match each focus concept with its appropriate effect. Meditation → Calm Mind, Quiet Room → Better Focus!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleOfFocus;

