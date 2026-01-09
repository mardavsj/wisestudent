import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const PuzzleDailyHabits = () => {
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
      const currentGame = games.find(g => g.id === "sustainability-kids-89");
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
  const gameId = "sustainability-kids-89";
  const gameData = getGameDataById(gameId);
  
  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Daily Habits (left side) - 5 items
  const dailyHabits = [
    { id: 1, name: "Turn Off", emoji: "📴",  },
    { id: 2, name: "Leave On", emoji: "⭕",  },
    { id: 3, name: "Reuse", emoji: "🔄",  },
    { id: 4, name: "Throw Away", emoji: "🗑️",  },
    { id: 5, name: "Save Water", emoji: "💧",  }
  ];

  // Consequences (right side) - 5 items
  const consequences = [
    { id: 2, name: "Waste", emoji: "🗑️",  },
    { id: 1, name: "Save", emoji: "💰",  },
    { id: 3, name: "Smart", emoji: "🧠",  },
    { id: 5, name: "Protect", emoji: "🛡️",  },
    { id: 4, name: "Wasteful", emoji: "❌",  },
  ];

  // Correct matches
  const correctMatches = [
    { leftId: 1, rightId: 1 }, // Turn Off → Save
    { leftId: 2, rightId: 2 }, // Leave On → Waste
    { leftId: 3, rightId: 3 }, // Reuse → Smart
    { leftId: 4, rightId: 4 }, // Throw Away → Wasteful
    { leftId: 5, rightId: 5 }  // Save Water → Protect
  ];

  const handleLeftSelect = (item) => {
    if (gameFinished) return;
    setSelectedLeft(item);
  };

  const handleRightSelect = (item) => {
    if (gameFinished) return;
    setSelectedRight(item);
  };

  const handleMatch = () => {
    if (!selectedLeft || !selectedRight || gameFinished) return;

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
    if (newMatches.length === dailyHabits.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const isMatched = (itemId, itemType) => {
    const match = matches.find(m => 
      (itemType === 'left' ? m.leftId === itemId : m.rightId === itemId)
    );
    return match ? match.isCorrect : null;
  };

  const getMatchResult = (leftId, rightId) => {
    const match = matches.find(m => m.leftId === leftId && m.rightId === rightId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Daily Habits"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Daily Habits with Consequences (${matches.length}/${dailyHabits.length} matched)`}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={dailyHabits.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === dailyHabits.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/sustainability/kids"
      maxScore={dailyHabits.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    
      nextGamePathProp="/student/sustainability/kids/neighbor-story"
      nextGameIdProp="sustainability-kids-90">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Daily Habits */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Daily Habits</h3>
              <div className="space-y-4">
                {dailyHabits.map(item => {
                  const isMatchedResult = isMatched(item.id, 'left');
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleLeftSelect(item)}
                      disabled={isMatchedResult !== null}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        selectedLeft?.id === item.id
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-600 border-2 border-blue-300'
                          : isMatchedResult === true
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-2 border-green-300'
                          : isMatchedResult === false
                          ? 'bg-gradient-to-r from-red-500 to-rose-600 border-2 border-red-300'
                          : 'bg-white/20 border border-white/30 hover:bg-white/30'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{item.emoji}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-white">{item.name}</div>
                          <div className="text-sm text-white/70">{item.description}</div>
                        </div>
                        {isMatchedResult !== null && (
                          <span className="text-xl text-white">{isMatchedResult ? '✓' : '✗'}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Center - Match button */}
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center space-y-4">
                <button
                  onClick={handleMatch}
                  disabled={!selectedLeft || !selectedRight}
                  className={`px-6 py-3 rounded-full font-bold transition-all ${
                    selectedLeft && selectedRight
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white'
                      : 'bg-gray-500/30 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Match
                </button>
                <div className="text-white/70 text-sm text-center">
                  Select one from each side, then click match
                </div>
              </div>
            </div>

            {/* Right column - Consequences */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Consequences</h3>
              <div className="space-y-4">
                {consequences.map(item => {
                  const isMatchedResult = isMatched(item.id, 'right');
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleRightSelect(item)}
                      disabled={isMatchedResult !== null}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        selectedRight?.id === item.id
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-600 border-2 border-blue-300'
                          : isMatchedResult === true
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-2 border-green-300'
                          : isMatchedResult === false
                          ? 'bg-gradient-to-r from-red-500 to-rose-600 border-2 border-red-300'
                          : 'bg-white/20 border border-white/30 hover:bg-white/30'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{item.emoji}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-white">{item.name}</div>
                          <div className="text-sm text-white/70">{item.description}</div>
                        </div>
                        {isMatchedResult !== null && (
                          <span className="text-xl text-white">{isMatchedResult ? '✓' : '✗'}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
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
                  You correctly matched {score} out of {dailyHabits.length} daily habits with their consequences!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding the consequences of our daily habits helps us make better choices for our planet!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {dailyHabits.length} habits correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Small changes in our daily habits can make a big difference for the environment!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleDailyHabits;