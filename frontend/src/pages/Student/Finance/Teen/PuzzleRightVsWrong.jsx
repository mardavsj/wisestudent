import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getFinanceTeenGames } from "../../../../pages/Games/GameCategories/Finance/teenGamesData";

const PuzzleRightVsWrong = () => {
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
      const currentGame = games.find(g => g.id === "finance-teens-94");
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
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Financial actions (left side) - 5 items
  const actions = [
    { id: 1, name: "Donating to Charity", emoji: "💝",  },
    { id: 2, name: "Stealing Money", emoji: "😈",  },
    { id: 3, name: "Honest Reporting", emoji: "✅",  },
    { id: 4, name: "Paying Bribes", emoji: "💰",  },
    { id: 5, name: "Fair Deal", emoji: "🤝",  }
  ];

  // Financial outcomes (right side) - 5 items
  const outcomes = [
    { id: 6, name: "Positive Impact", emoji: "🌟",  },
    { id: 7, name: "Legal Consequences", emoji: "⛓️",  },
    { id: 8, name: "Trust Building", emoji: "🤝",  },
    { id: 9, name: "Corruption", emoji: "🐍",  },
    { id: 10, name: "Mutual Benefit", emoji: "🤝",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedOutcomes = [
    outcomes[2], // Trust Building (id: 8)
    outcomes[4], // Mutual Benefit (id: 10)
    outcomes[1], // Legal Consequences (id: 7)
    outcomes[0], // Positive Impact (id: 6)
    outcomes[3]  // Corruption (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each action has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { actionId: 1, outcomeId: 6 }, // Donating to Charity → Positive Impact
    { actionId: 2, outcomeId: 7 }, // Stealing Money → Legal Consequences
    { actionId: 3, outcomeId: 8 }, // Honest Reporting → Trust Building
    { actionId: 4, outcomeId: 9 }, // Paying Bribes → Corruption
    { actionId: 5, outcomeId: 10 } // Fair Deal → Mutual Benefit
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
      title="Puzzle: Right vs Wrong"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Actions with Outcomes (${matches.length}/${actions.length} matched)`}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="finance-teens-94"
      gameType="finance"
      totalLevels={actions.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === actions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/financial-literacy/teens"
      maxScore={actions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Financial Actions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Financial Actions</h3>
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
                    : "Select a Financial Action"}
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

            {/* Right column - Financial Outcomes */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Financial Outcomes</h3>
              <div className="space-y-4">
                {rearrangedOutcomes.map(outcome => (
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
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {actions.length} financial actions with their outcomes!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Ethical financial decisions lead to positive outcomes for everyone!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {actions.length} financial actions correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about the consequences of each financial action!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleRightVsWrong;