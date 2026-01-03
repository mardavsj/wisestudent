import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getFinanceTeenGames } from "../../../../pages/Games/GameCategories/Finance/teenGamesData";

const PuzzleOfRights = () => {
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
      const currentGame = games.find(g => g.id === "finance-teens-84");
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
  const [selectedRight, setSelectedRight] = useState(null);
  const [selectedMeaning, setSelectedMeaning] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Consumer rights (left side) - 5 items
  const rights = [
    { id: 1, name: "Right to Safety", emoji: "🛡️",  },
    { id: 2, name: "Right to Information", emoji: "📋",  },
    { id: 3, name: "Right to Choose", emoji: "✅",  },
    { id: 4, name: "Right to Redress", emoji: "⚖️",  },
    { id: 5, name: "Right to Consumer Education", emoji: "📚",  }
  ];

  // Meanings (right side) - 5 items
  const meanings = [
    { id: 6, name: "Safe Products", emoji: "🛒",  },
    { id: 7, name: "Truthful Info", emoji: "📝",  },
    { id: 8, name: "Variety of Choices", emoji: "🛒",  },
    { id: 9, name: "Remedy for Issues", emoji: "💰",  },
    { id: 10, name: "Awareness Building", emoji: "🎓",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedMeanings = [
    meanings[2], // Variety of Choices (id: 8)
    meanings[4], // Awareness Building (id: 10)
    meanings[1], // Truthful Info (id: 7)
    meanings[0], // Safe Products (id: 6)
    meanings[3]  // Remedy for Issues (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each right has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { rightId: 1, meaningId: 6 }, // Right to Safety → Safe Products
    { rightId: 2, meaningId: 7 }, // Right to Information → Truthful Info
    { rightId: 3, meaningId: 8 }, // Right to Choose → Variety of Choices
    { rightId: 4, meaningId: 9 }, // Right to Redress → Remedy for Issues
    { rightId: 5, meaningId: 10 } // Right to Consumer Education → Awareness Building
  ];

  const handleRightSelect = (right) => {
    if (gameFinished) return;
    setSelectedRight(right);
  };

  const handleMeaningSelect = (meaning) => {
    if (gameFinished) return;
    setSelectedMeaning(meaning);
  };

  const handleMatch = () => {
    if (!selectedRight || !selectedMeaning || gameFinished) return;

    resetFeedback();

    const newMatch = {
      rightId: selectedRight.id,
      meaningId: selectedMeaning.id,
      isCorrect: correctMatches.some(
        match => match.rightId === selectedRight.id && match.meaningId === selectedMeaning.id
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
    if (newMatches.length === rights.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedRight(null);
    setSelectedMeaning(null);
  };

  // Check if a right is already matched
  const isRightMatched = (rightId) => {
    return matches.some(match => match.rightId === rightId);
  };

  // Check if a meaning is already matched
  const isMeaningMatched = (meaningId) => {
    return matches.some(match => match.meaningId === meaningId);
  };

  // Get match result for a right
  const getMatchResult = (rightId) => {
    const match = matches.find(m => m.rightId === rightId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Consumer Rights"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Rights with Meanings (${matches.length}/${rights.length} matched)`}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="finance-teens-84"
      gameType="finance"
      totalLevels={rights.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === rights.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/financial-literacy/teens"
      maxScore={rights.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Consumer Rights */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Consumer Rights</h3>
              <div className="space-y-4">
                {rights.map(right => (
                  <button
                    key={right.id}
                    onClick={() => handleRightSelect(right)}
                    disabled={isRightMatched(right.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isRightMatched(right.id)
                        ? getMatchResult(right.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedRight?.id === right.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{right.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{right.name}</h4>
                        
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
                  {selectedRight 
                    ? `Selected: ${selectedRight.name}` 
                    : "Select a Consumer Right"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedRight || !selectedMeaning}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedRight && selectedMeaning
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{rights.length}</p>
                  <p>Matched: {matches.length}/{rights.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Meanings */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Meanings</h3>
              <div className="space-y-4">
                {rearrangedMeanings.map(meaning => (
                  <button
                    key={meaning.id}
                    onClick={() => handleMeaningSelect(meaning)}
                    disabled={isMeaningMatched(meaning.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isMeaningMatched(meaning.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedMeaning?.id === meaning.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{meaning.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{meaning.name}</h4>
                        <p className="text-white/80 text-sm">{meaning.description}</p>
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
                  You correctly matched {score} out of {rights.length} consumer rights with their meanings!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding consumer rights protects you from unfair practices!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {rights.length} consumer rights correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about what protection each consumer right provides!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleOfRights;