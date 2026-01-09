import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';

const MissingDataPuzzle = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-kids-63";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [coins, setCoins] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Incomplete sequences (left side)
  const leftItems = [
    { id: 1, name: '🍎, 🍌, ❓',   },
    { id: 2, name: '🐶, 🐱, ❓',   },
    { id: 3, name: '🔺, 🔵, ❓',   },
    { id: 4, name: '🍔, 🍟, ❓',   },
    { id: 5, name: '☀️, 🌧️, ❓',   },
  ];

  // Missing items (right side) - manually arranged to vary correct answer positions
  const rightItems = [
    { id: 2, name: '🐭',   },
    { id: 4, name: '🥤',   },
    { id: 1, name: '🍇',   },
    { id: 5, name: '🌈',   },
    { id: 3, name: '⬛',   },
  ];

  // Correct matches - manually defined to split correct answers across different positions
  const correctMatches = [
    { leftId: 1, rightId: 1 }, // 🍎,🍌,? → 🍇 (left 1st, right 3rd)
    { leftId: 2, rightId: 2 }, // 🐶,🐱,? → 🐭 (left 2nd, right 1st)
    { leftId: 3, rightId: 3 }, // 🔺,🔵,? → ⬛ (left 3rd, right 5th)
    { leftId: 4, rightId: 4 }, // 🍔,🍟,? → 🥤 (left 4th, right 2nd)
    { leftId: 5, rightId: 5 }  // ☀️,🌧️,? → 🌈 (left 5th, right 4th)
  ];

  // Check if a left item is already matched
  const isLeftItemMatched = (itemId) => {
    return matches.some(match => match.leftId === itemId);
  };

  // Check if a right item is already matched
  const isRightItemMatched = (itemId) => {
    return matches.some(match => match.rightId === itemId);
  };

  const handleLeftSelect = (item) => {
    if (showResult) return;
    if (isLeftItemMatched(item.id)) return;
    setSelectedLeft(item);
  };

  const handleRightSelect = (item) => {
    if (showResult) return;
    if (isRightItemMatched(item.id)) return;
    setSelectedRight(item);
  };

  const handleMatch = () => {
    if (!selectedLeft || !selectedRight || showResult) return;

    const newMatch = {
      leftId: selectedLeft.id,
      rightId: selectedRight.id,
      isCorrect: correctMatches.some(
        match => match.leftId === selectedLeft.id && match.rightId === selectedRight.id
      )
    };

    const newMatches = [...matches, newMatch];
    setMatches(newMatches);

    // If the match is correct, add coins and show feedback
    if (newMatch.isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    // Check if all items are matched
    if (newMatches.length === leftItems.length) {
      // Calculate final score
      const correctCount = newMatches.filter(match => match.isCorrect).length;
      setFinalScore(correctCount);
      setShowResult(true);
    }

    // Reset selections
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  // Get match result for a left item
  const getMatchResult = (itemId) => {
    const match = matches.find(m => m.leftId === itemId);
    return match ? match.isCorrect : null;
  };

  // Get match result for a right item
  const getRightMatchResult = (itemId) => {
    const match = matches.find(m => m.rightId === itemId);
    return match ? match.isCorrect : null;
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setMatches([]);
    setSelectedLeft(null);
    setSelectedRight(null);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  // Log when game completes
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Missing Data Puzzle game completed! Score: ${finalScore}/${leftItems.length}, gameId: ${gameId}`);
    }
  }, [showResult, finalScore, gameId, leftItems.length]);

  return (
    <GameShell
      title="Puzzle: Missing Data"
      score={coins}
      subtitle={showResult ? "Game Complete!" : "Match incomplete sequences with missing items"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/ai-for-all/kids/train-ai-with-sounds"
      nextGameIdProp="ai-kids-64"
      showGameOver={showResult && finalScore >= 3}
      gameId={gameId}
      gameType="ai"
      totalLevels={leftItems.length}
      currentLevel={matches.length + 1}
      maxScore={leftItems.length}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-5xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Left column - Incomplete Sequences */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 text-center">Incomplete Sequences</h3>
              <div className="space-y-3 md:space-y-4">
                {leftItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleLeftSelect(item)}
                    disabled={isLeftItemMatched(item.id)}
                    className={`w-full p-3 md:p-4 rounded-lg md:rounded-xl text-left transition-all ${
                      isLeftItemMatched(item.id)
                        ? getMatchResult(item.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedLeft?.id === item.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    } disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center">
                      <div className="text-xl md:text-2xl mr-2 md:mr-3">{item.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white text-sm md:text-base">{item.name}</h4>
                        <p className="text-white/80 text-xs md:text-sm">{item.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Middle column - Match button */}
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 text-center w-full">
                <p className="text-white/80 mb-3 md:mb-4 text-sm md:text-base">
                  {selectedLeft 
                    ? `Selected: ${selectedLeft.name}` 
                    : "Select a sequence"}
                </p>
                {selectedLeft && selectedRight && (
                  <button
                    onClick={handleMatch}
                    className="w-full py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105 text-sm md:text-base"
                  >
                    Match!
                  </button>
                )}
                {(!selectedLeft || !selectedRight) && (
                  <div className="w-full py-2 md:py-3 px-4 md:px-6 rounded-full font-bold bg-gray-500/30 text-gray-400 cursor-not-allowed text-sm md:text-base">
                    Match!
                  </div>
                )}
                <div className="mt-3 md:mt-4 text-white/80 text-xs md:text-sm">
                  <p>Coins: {coins}</p>
                  <p>Matched: {matches.length}/{leftItems.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Missing Items */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 text-center">Missing Items</h3>
              <div className="space-y-3 md:space-y-4">
                {rightItems.map(item => {
                  const isMatched = isRightItemMatched(item.id);
                  const isCorrectMatch = getRightMatchResult(item.id);
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleRightSelect(item)}
                      disabled={isMatched}
                      className={`w-full p-3 md:p-4 rounded-lg md:rounded-xl text-left transition-all ${
                        isMatched
                          ? isCorrectMatch
                            ? "bg-green-500/30 border-2 border-green-500"
                            : "bg-red-500/30 border-2 border-red-500"
                          : selectedRight?.id === item.id
                          ? "bg-purple-500/50 border-2 border-purple-400"
                          : "bg-white/10 hover:bg-white/20 border border-white/20"
                      } disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-center">
                        <div className="text-xl md:text-2xl mr-2 md:mr-3">{item.emoji}</div>
                        <div>
                          <h4 className="font-bold text-white text-sm md:text-base">{item.name}</h4>
                          <p className="text-white/80 text-xs md:text-sm">{item.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20 text-center flex-1 flex flex-col justify-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-4xl md:text-5xl mb-4">🎉</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Great Matching!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You correctly matched {finalScore} out of {leftItems.length} missing items!
                  You understand how to complete incomplete data!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  AI cannot give correct answers without complete data. You helped the robot think better!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You matched {finalScore} out of {leftItems.length} missing items correctly.
                  Remember, complete data helps AI work better!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to match each incomplete sequence with its missing item.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default MissingDataPuzzle;


