import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';

const PrivacyPuzzle = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-kids-78";
  const gameData = getGameDataById(gameId);
  
  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [coins, setCoins] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Actions (left side) - reordered to vary correct answer positions
  const leftItems = [
    { id: 1, name: 'Sharing password', emoji: '🔓',  },
    { id: 2, name: 'Keeping password secret', emoji: '🔒',  },
    { id: 3, name: 'Giving personal info to strangers', emoji: '⚠️',  },
    { id: 4, name: 'Using strong passwords', emoji: '🛡️',  },
    { id: 5, name: 'Sharing location with everyone', emoji: '📍',  }
  ];

  // Safety levels (right side) - shuffled to prevent direct correspondence with left items
  const rightItems = [
    { id: 4, name: 'Protected', emoji: '🛡️',  },
    { id: 1, name: 'Risky', emoji: '⚠️',  },
    { id: 5, name: 'Unsafe', emoji: '❌',  },
    { id: 3, name: 'Dangerous', emoji: '❗',  },
    { id: 2, name: 'Secure', emoji: '🔒',  }
  ];

  // Correct matches - manually defined to split correct answers across different positions
  const correctMatches = [
    { leftId: 1, rightId: 1 }, // Sharing password → Risky
    { leftId: 2, rightId: 2 }, // Keeping password secret → Secure
    { leftId: 3, rightId: 3 }, // Giving personal info → Dangerous
    { leftId: 4, rightId: 4 }, // Using strong passwords → Protected
    { leftId: 5, rightId: 5 }  // Sharing location → Unsafe
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

  return (
    <GameShell
      title="Puzzle: Privacy"
      score={coins}
      subtitle={showResult ? "Game Complete!" : "Match actions with their safety levels"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/ai-for-all/kids/ai-bias-story"
      nextGameIdProp="ai-kids-79"
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
            {/* Left column - Actions */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 text-center">Actions</h3>
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
                    : "Select an action"}
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

            {/* Right column - Safety Levels */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 text-center">Safety Levels</h3>
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
                  You correctly matched {finalScore} out of {leftItems.length} actions!
                  You understand how to protect your privacy online!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  Keeping safe online habits protects your privacy!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You matched {finalScore} out of {leftItems.length} actions correctly.
                  Remember, privacy protection is important!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to match each action with its safety level.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PrivacyPuzzle;


