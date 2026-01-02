import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchTraits = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedTrait, setSelectedTrait] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Traits (left side) - 5 items
  const traits = [
    { id: 1, name: "Leader", emoji: "👑",  },
    { id: 2, name: "Risk-Taker", emoji: "🎲",  },
    { id: 3, name: "Innovator", emoji: "💡",  },
    { id: 4, name: "Entrepreneur", emoji: "🚀",  },
    { id: 5, name: "Team Player", emoji: "🤝",  }
  ];

  // Actions (right side) - 5 items
  const actions = [
    { id: 5, name: "Collaborate", emoji: "👥",  },
    { id: 4, name: "Solve Problems", emoji: "🧩",  },
    { id: 1, name: "Inspire", emoji: "✨",  },
    { id: 3, name: "Create", emoji: "🛠️",  },
    { id: 2, name: "Try New", emoji: "🆕",  },
  ];

  // Correct matches
  const correctMatches = [
    { traitId: 1, actionId: 1 }, // Leader → Inspire
    { traitId: 2, actionId: 2 }, // Risk-Taker → Try New
    { traitId: 3, actionId: 3 }, // Innovator → Create
    { traitId: 4, actionId: 4 }, // Entrepreneur → Solve Problems
    { traitId: 5, actionId: 5 }  // Team Player → Collaborate
  ];

  const handleTraitSelect = (trait) => {
    if (gameFinished) return;
    setSelectedTrait(trait);
  };

  const handleActionSelect = (action) => {
    if (gameFinished) return;
    setSelectedAction(action);
  };

  const handleMatch = () => {
    if (!selectedTrait || !selectedAction || gameFinished) return;

    resetFeedback();

    const newMatch = {
      traitId: selectedTrait.id,
      actionId: selectedAction.id,
      isCorrect: correctMatches.some(
        match => match.traitId === selectedTrait.id && match.actionId === selectedAction.id
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
    if (newMatches.length === traits.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedTrait(null);
    setSelectedAction(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedTrait(null);
    setSelectedAction(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ehe/teens/failure-story");
  };

  // Check if a trait is already matched
  const isTraitMatched = (traitId) => {
    return matches.some(match => match.traitId === traitId);
  };

  // Check if an action is already matched
  const isActionMatched = (actionId) => {
    return matches.some(match => match.actionId === actionId);
  };

  // Get match result for a trait
  const getMatchResult = (traitId) => {
    const match = matches.find(m => m.traitId === traitId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Match Traits"
      subtitle={gameFinished ? "Game Complete!" : `Match Traits with Actions (${matches.length}/${traits.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="ehe-teen-14"
      gameType="ehe"
      totalLevels={traits.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ehe/teens"
      maxScore={traits.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Traits */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Traits</h3>
              <div className="space-y-4">
                {traits.map(trait => (
                  <button
                    key={trait.id}
                    onClick={() => handleTraitSelect(trait)}
                    disabled={isTraitMatched(trait.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isTraitMatched(trait.id)
                        ? getMatchResult(trait.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedTrait?.id === trait.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{trait.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{trait.name}</h4>
                        <p className="text-white/80 text-sm">{trait.description}</p>
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
                  {selectedTrait 
                    ? `Selected: ${selectedTrait.name}` 
                    : "Select a Trait"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedTrait || !selectedAction}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedTrait && selectedAction
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{traits.length}</p>
                  <p>Matched: {matches.length}/{traits.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Actions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Actions</h3>
              <div className="space-y-4">
                {actions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleActionSelect(action)}
                    disabled={isActionMatched(action.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isActionMatched(action.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedAction?.id === action.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{action.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{action.name}</h4>
                        <p className="text-white/80 text-sm">{action.description}</p>
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
                <h3 className="text-2xl font-bold text-white mb-4">Trait Master!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {traits.length} traits with their actions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding personality traits helps you recognize strengths in yourself and others!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {traits.length} traits correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about what each trait naturally leads people to do!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleMatchTraits;