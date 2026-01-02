import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleConflictSolutions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Actions (left side) - 5 items
  const actions = [
    { id: 1, name: "Listen", emoji: "👂",  },
    { id: 2, name: "Apologize", emoji: "🫂",  },
    { id: 3, name: "Shout", emoji: "😠",  },
    { id: 4, name: "Compromise", emoji: "🤝",  },
    { id: 5, name: "Empathize", emoji: "❤️",  }
  ];

  // Outcomes (right side) - 5 items
  const outcomes = [
    { id: 2, name: "Heal", emoji: "🩹",  },
    { id: 1, name: "Respect", emoji: "🙏",  },
    { id: 4, name: "Solution", emoji: "✅",  },
    { id: 3, name: "Wrong", emoji: "❌",  },
    { id: 5, name: "Connect", emoji: "🔗",  }
  ];

  // Correct matches
  const correctMatches = [
    { actionId: 1, outcomeId: 1 }, // Listen → Respect
    { actionId: 2, outcomeId: 2 }, // Apologize → Heal
    { actionId: 3, outcomeId: 3 }, // Shout → Wrong
    { actionId: 4, outcomeId: 4 }, // Compromise → Solution
    { actionId: 5, outcomeId: 5 }  // Empathize → Connect
  ];

  const handleActionSelect = (action) => {
    if (gameFinished) return;
    setSelectedAction(action);
  };

  const handleOutcomeSelect = (outcome) => {
    if (gameFinished) return;
    setSelectedOutcome(outcome);
  };

  const handleMatch = () => {
    if (!selectedAction || !selectedOutcome || gameFinished) return;

    resetFeedback();

    const newMatch = {
      actionId: selectedAction.id,
      outcomeId: selectedOutcome.id,
      isCorrect: correctMatches.some(
        match => match.actionId === selectedAction.id && match.outcomeId === selectedOutcome.id
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
    if (newMatches.length === actions.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedAction(null);
    setSelectedOutcome(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedAction(null);
    setSelectedOutcome(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/teens");
  };

  // Check if an action is already matched
  const isActionMatched = (actionId) => {
    return matches.some(match => match.actionId === actionId);
  };

  // Check if an outcome is already matched
  const isOutcomeMatched = (outcomeId) => {
    return matches.some(match => match.outcomeId === outcomeId);
  };

  // Get match result for an action
  const getMatchResult = (actionId) => {
    const match = matches.find(m => m.actionId === actionId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Conflict Solutions"
      subtitle={gameFinished ? "Game Complete!" : `Match Conflict Actions with Outcomes (${matches.length}/${actions.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="civic-responsibility-teens-44"
      gameType="civic-responsibility"
      totalLevels={actions.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/teens"
      maxScore={actions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Actions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Conflict Actions</h3>
              <div className="space-y-4">
                {actions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleActionSelect(action)}
                    disabled={isActionMatched(action.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isActionMatched(action.id)
                        ? getMatchResult(action.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedAction?.id === action.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
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

            {/* Middle column - Match button */}
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
                <p className="text-white/80 mb-4">
                  {selectedAction 
                    ? `Selected: ${selectedAction.name}` 
                    : "Select a Conflict Action"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedAction || !selectedOutcome}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedAction && selectedOutcome
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{actions.length}</p>
                  <p>Matched: {matches.length}/{actions.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Outcomes */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Conflict Outcomes</h3>
              <div className="space-y-4">
                {outcomes.map(outcome => (
                  <button
                    key={outcome.id}
                    onClick={() => handleOutcomeSelect(outcome)}
                    disabled={isOutcomeMatched(outcome.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isOutcomeMatched(outcome.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedOutcome?.id === outcome.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{outcome.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{outcome.name}</h4>
                        <p className="text-white/80 text-sm">{outcome.description}</p>
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
                <div className="text-5xl mb-4">🧩</div>
                <h3 className="text-2xl font-bold text-white mb-4">Excellent Work!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {actions.length} conflict actions with their outcomes!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding conflict resolution strategies helps build healthier relationships and communities!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {actions.length} conflict actions correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about whether each conflict action leads to a positive or negative outcome!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleConflictSolutions;