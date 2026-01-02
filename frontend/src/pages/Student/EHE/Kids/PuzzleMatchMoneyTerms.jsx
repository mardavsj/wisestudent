import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchMoneyTerms = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedDefinition, setSelectedDefinition] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Terms (left side) - 5 items
  const terms = [
    { id: 1, name: "Earning", emoji: "💼",  },
    { id: 2, name: "Spending", emoji: "💸",  },
    { id: 3, name: "Saving", emoji: "💰",  },
    { id: 4, name: "Budget", emoji: "📋",  },
    { id: 5, name: "Interest", emoji: "📈",  }
  ];

  // Definitions (right side) - 5 items
  const definitions = [
    { id: 5, name: "Growth", emoji: "🌱",  },
    { id: 3, name: "Piggy Bank", emoji: "🐖",  },
    { id: 4, name: "Plan", emoji: "📝",  },
    { id: 2, name: "Shop", emoji: "🛒",  },
    { id: 1, name: "Work", emoji: "🔨",  },
  ];

  // Correct matches
  const correctMatches = [
    { termId: 1, definitionId: 1 }, // Earning → Work
    { termId: 2, definitionId: 2 }, // Spending → Shop
    { termId: 3, definitionId: 3 }, // Saving → Piggy Bank
    { termId: 4, definitionId: 4 }, // Budget → Plan
    { termId: 5, definitionId: 5 }  // Interest → Growth
  ];

  const handleTermSelect = (term) => {
    if (gameFinished) return;
    setSelectedTerm(term);
  };

  const handleDefinitionSelect = (definition) => {
    if (gameFinished) return;
    setSelectedDefinition(definition);
  };

  const handleMatch = () => {
    if (!selectedTerm || !selectedDefinition || gameFinished) return;

    resetFeedback();

    const newMatch = {
      termId: selectedTerm.id,
      definitionId: selectedDefinition.id,
      isCorrect: correctMatches.some(
        match => match.termId === selectedTerm.id && match.definitionId === selectedDefinition.id
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
    if (newMatches.length === terms.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedTerm(null);
    setSelectedDefinition(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedTerm(null);
    setSelectedDefinition(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  // Check if a term is already matched
  const isTermMatched = (termId) => {
    return matches.some(match => match.termId === termId);
  };

  // Check if a definition is already matched
  const isDefinitionMatched = (definitionId) => {
    return matches.some(match => match.definitionId === definitionId);
  };

  // Get match result for a term
  const getMatchResult = (termId) => {
    const match = matches.find(m => m.termId === termId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Match Money Terms"
      subtitle={gameFinished ? "Game Complete!" : `Match Terms with Definitions (${matches.length}/${terms.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="ehe-kids-24"
      gameType="ehe"
      totalLevels={terms.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ehe/kids"
      maxScore={terms.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Terms */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Terms</h3>
              <div className="space-y-4">
                {terms.map(term => (
                  <button
                    key={term.id}
                    onClick={() => handleTermSelect(term)}
                    disabled={isTermMatched(term.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isTermMatched(term.id)
                        ? getMatchResult(term.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedTerm?.id === term.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{term.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{term.name}</h4>
                        <p className="text-white/80 text-sm">{term.description}</p>
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
                  {selectedTerm 
                    ? `Selected: ${selectedTerm.name}` 
                    : "Select a Term"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedTerm || !selectedDefinition}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedTerm && selectedDefinition
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{terms.length}</p>
                  <p>Matched: {matches.length}/{terms.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Definitions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Definitions</h3>
              <div className="space-y-4">
                {definitions.map(definition => (
                  <button
                    key={definition.id}
                    onClick={() => handleDefinitionSelect(definition)}
                    disabled={isDefinitionMatched(definition.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isDefinitionMatched(definition.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedDefinition?.id === definition.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{definition.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{definition.name}</h4>
                        <p className="text-white/80 text-sm">{definition.description}</p>
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
                  You correctly matched {score} out of {terms.length} money terms with their definitions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding money terms is essential for financial literacy!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {terms.length} terms correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about what each money term actually means in practice!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleMatchMoneyTerms;