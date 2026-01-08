import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';

const PuzzleMnemonicMatch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-24";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    // First, try to get from location.state (passed from GameCategoryPage)
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    // Fallback: find next game from game data
    try {
      const games = getBrainTeenGames({});
      const currentGame = games.find(g => g.id === gameId);
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
  }, [location.state, gameId]);
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [matches, setMatches] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // Mnemonics (left side)
  const leftItems = [
    { id: 1, name: 'VIBGYOR', emoji: '🙂',  },
    { id: 2, name: 'BODMAS', emoji: '🧮',  },
    { id: 3, name: 'PEMDAS', emoji: '📐',  },
    { id: 4, name: 'ROYGBIV', emoji: '🤔',  },
    { id: 5, name: 'HOMES', emoji: '🏠',  }
  ];

  // Meanings (right side) - manually arranged to vary correct answer positions
  const rightItems = [
    { id: 2, name: 'Math Order', emoji: '➗',  },
    { id: 3, name: 'Math Operations', emoji: '📊',  },
    { id: 1, name: 'Rainbow Colors', emoji: '🌈',  },
    { id: 5, name: 'Great Lakes', emoji: '🏞️',  },
    { id: 4, name: 'Color Sequence', emoji: '🎨',  }
  ];

  // Correct matches - manually defined to split correct answers across different positions
  const correctMatches = [
    { leftId: 1, rightId: 1 }, // VIBGYOR → Rainbow Colors (left 1st, right 3rd)
    { leftId: 2, rightId: 2 }, // BODMAS → Math Order (left 2nd, right 1st)
    { leftId: 3, rightId: 3 }, // PEMDAS → Math Operations (left 3rd, right 2nd)
    { leftId: 4, rightId: 4 }, // ROYGBIV → Color Sequence (left 4th, right 5th)
    { leftId: 5, rightId: 5 }  // HOMES → Great Lakes (left 5th, right 4th)
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

    // If the match is correct, add score and show feedback
    if (newMatch.isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    // Check if all items are matched
    if (newMatches.length === leftItems.length) {
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

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Puzzle: Mnemonic Match game completed! Score: ${score}/${leftItems.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId, leftItems.length]);

  return (
    <GameShell
      title="Puzzle: Mnemonic Match"
      score={score}
      subtitle={showResult ? "Game Complete!" : `Match mnemonics with their meanings (${matches.length}/${leftItems.length} matched)`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="brain"
      totalLevels={leftItems.length}
      currentLevel={matches.length + 1}
      maxScore={leftItems.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto px-4">
        {!showResult ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Left column - Mnemonics */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 text-center">Mnemonics</h3>
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
                    : "Select a mnemonic"}
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
                  <p>Score: {score}</p>
                  <p>Matched: {matches.length}/{leftItems.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Meanings */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 text-center">Meanings</h3>
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
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-4xl md:text-5xl mb-4">🎉</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Great Matching!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You correctly matched {score} out of {leftItems.length} mnemonics!
                  You understand how memory aids work!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{score} Coins</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You matched {score} out of {leftItems.length} mnemonics correctly.
                  Remember, mnemonics help us remember information through associations!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleMnemonicMatch;
