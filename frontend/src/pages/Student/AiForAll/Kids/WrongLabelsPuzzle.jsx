import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';

const WrongLabelsPuzzle = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-kids-72";
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

  // Actual items (left side) - what the items really are
  const leftItems = [
    { id: 1, name: ' Red Apple', emoji: '🍎',  },
    { id: 2, name: ' Yellow Banana', emoji: '🍌',  },
    { id: 3, name: ' Red Strawberry', emoji: '🍓',  },
    { id: 4, name: ' Red Cherry', emoji: '🍒',  },
    { id: 5, name: ' Yellow Lemon', emoji: '🍋',  }
  ];

  // Labels (right side) - some correct, some incorrect
  // Manually arranged to vary correct answer positions
  const rightItems = [
    { id: 6, name: 'Citrus Fruit',  },
    { id: 7, name: 'Tropical Berry',  },
    { id: 8, name: 'Tree Apple',  },
    { id: 9, name: 'Stone Fruit',  },
    { id: 10, name: 'Potassium Fruit',  }
  ];

  // Correct matches - each item with its correct label
  const correctMatches = [
    { leftId: 1, rightId: 8 },  // Apple matches with Tree Apple
    { leftId: 2, rightId: 10 }, // Banana matches with Potassium Fruit
    { leftId: 3, rightId: 7 },  // Strawberry matches with Tropical Berry
    { leftId: 4, rightId: 9 },  // Cherry matches with Stone Fruit
    { leftId: 5, rightId: 6 }   // Lemon matches with Citrus Fruit
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
      console.log(`🎮 Wrong Labels Puzzle game completed! Score: ${finalScore}/${leftItems.length}, gameId: ${gameId}`);
    }
  }, [showResult, finalScore, gameId, leftItems.length]);

  return (
    <GameShell
      title="Puzzle: Label Matching"
      score={coins}
      subtitle={showResult ? "Game Complete!" : "Match items with their correct labels"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/ai-for-all/kids/robot-practice-game"
      nextGameIdProp="ai-kids-73"
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
            {/* Left column - Actual Items */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 text-center">Items</h3>
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
                      <div className="text-2xl md:text-3xl mr-3 md:mr-4">{item.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white text-base md:text-lg">{item.name}</h4>
                        <p className="text-white/80 text-xs md:text-sm mt-1">{item.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Middle column - Match button */}
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 text-center w-full">
                <div className="mb-4">
                  <div className="inline-block bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    AI LEARNING GAME
                  </div>
                </div>
                
                <p className="text-white/90 mb-3 md:mb-4 text-base md:text-lg font-medium">
                  {selectedLeft 
                    ? `Selected: ${selectedLeft.name}` 
                    : "Select an item"}
                </p>
                
                <div className="mb-4 p-3 bg-blue-500/20 rounded-lg">
                  <p className="text-white/90 text-xs md:text-sm">
                    Help AI learn by matching items with correct labels!
                  </p>
                </div>
                
                {selectedLeft && selectedRight && (
                  <button
                    onClick={handleMatch}
                    className="w-full py-3 md:py-4 px-4 md:px-6 rounded-full font-bold transition-all bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105 text-base md:text-lg shadow-lg"
                  >
                    Match Labels!
                  </button>
                )}
                {(!selectedLeft || !selectedRight) && (
                  <div className="w-full py-3 md:py-4 px-4 md:px-6 rounded-full font-bold bg-gray-500/30 text-gray-400 text-base md:text-lg">
                    Match Labels!
                  </div>
                )}
                
                <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg">
                  <p className="text-yellow-300 text-sm md:text-base font-bold">Coins: {coins}/{leftItems.length}</p>
                  <p className="text-white/80 text-xs mt-1">Matched: {matches.length}/{leftItems.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Labels */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 text-center">Labels</h3>
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
                        <div className="text-2xl md:text-3xl mr-3 md:mr-4">{item.emoji}</div>
                        <div>
                          <h4 className="font-bold text-white text-base md:text-lg">{item.name}</h4>
                          <p className="text-white/80 text-xs md:text-sm mt-1">{item.description}</p>
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
                <div className="text-5xl md:text-6xl mb-4">🎉</div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Excellent Label Matching!</h3>
                <p className="text-white/90 text-base md:text-lg mb-6">
                  You correctly matched {finalScore} out of {leftItems.length} items with their labels!
                  You're helping AI learn the right way!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 md:py-4 px-6 md:px-8 rounded-full inline-flex items-center gap-3 mb-6 text-lg md:text-xl font-bold shadow-lg">
                  <span>🏆 +{coins} Coins Earned</span>
                </div>
                <div className="bg-blue-500/20 rounded-xl p-5 mb-6">
                  <p className="text-white/90 text-sm md:text-base">
                    💡 In AI training, correct labels are crucial! Your matches help AI understand 
                    what each item truly is. Great job being a data scientist!
                  </p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all text-base md:text-lg shadow-lg"
                >
                  Play Again
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl md:text-6xl mb-4">😔</div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-base md:text-lg mb-6">
                  You matched {finalScore} out of {leftItems.length} items with their labels correctly.
                  Keep practicing to help AI learn better!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-6 text-base md:text-lg shadow-lg"
                >
                  Try Again
                </button>
                <div className="bg-blue-500/20 rounded-xl p-5">
                  <p className="text-white/90 text-sm md:text-base">
                    💡 AI learns from labeled examples. When items are correctly labeled, 
                    AI can better recognize and categorize them in the future!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default WrongLabelsPuzzle;