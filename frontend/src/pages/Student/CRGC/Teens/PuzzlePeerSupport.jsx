import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzlePeerSupport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Scenarios (left side) - 5 items
  const scenarios = [
    { id: 1, name: "Friend Sad", emoji: "🤗",  },
    { id: 2, name: "Cyberbully", emoji: "📱",  },
    { id: 3, name: "Bully Victim", emoji: "🛡️",  },
    { id: 4, name: "New Student", emoji: "👋",  },
    { id: 5, name: "Someone Excluded", emoji: "😢",  }
  ];

  // Actions (right side) - 5 items
  const actions = [
    { id: 1, name: "Comfort", emoji: "🫂",  },
    { id: 4, name: "Include", emoji: "🎉",  },
    { id: 2, name: "Report", emoji: "📢",  },
    { id: 3, name: "Defend", emoji: "⚔️",  },
    { id: 5, name: "Reach Out", emoji: "💌",  }
  ];

  // Correct matches
  const correctMatches = [
    { scenarioId: 1, actionId: 1 }, // Friend Sad → Comfort
    { scenarioId: 2, actionId: 2 }, // Cyberbully → Report
    { scenarioId: 3, actionId: 3 }, // Bully Victim → Defend
    { scenarioId: 4, actionId: 4 }, // New Student → Include
    { scenarioId: 5, actionId: 5 }  // Someone Excluded → Reach Out
  ];

  const handleScenarioSelect = (scenario) => {
    if (gameFinished) return;
    setSelectedScenario(scenario);
  };

  const handleActionSelect = (action) => {
    if (gameFinished) return;
    setSelectedAction(action);
  };

  const handleMatch = () => {
    if (!selectedScenario || !selectedAction || gameFinished) return;

    resetFeedback();

    const newMatch = {
      scenarioId: selectedScenario.id,
      actionId: selectedAction.id,
      isCorrect: correctMatches.some(
        match => match.scenarioId === selectedScenario.id && match.actionId === selectedAction.id
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
    if (newMatches.length === scenarios.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedScenario(null);
    setSelectedAction(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedScenario(null);
    setSelectedAction(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/teens");
  };

  // Check if a scenario is already matched
  const isScenarioMatched = (scenarioId) => {
    return matches.some(match => match.scenarioId === scenarioId);
  };

  // Check if an action is already matched
  const isActionMatched = (actionId) => {
    return matches.some(match => match.actionId === actionId);
  };

  // Get match result for a scenario
  const getMatchResult = (scenarioId) => {
    const match = matches.find(m => m.scenarioId === scenarioId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Peer Support"
      subtitle={gameFinished ? "Game Complete!" : `Match Peer Support Scenarios with Actions (${matches.length}/${scenarios.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="civic-responsibility-teens-34"
      gameType="civic-responsibility"
      totalLevels={scenarios.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/teens"
      maxScore={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Scenarios */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Peer Scenarios</h3>
              <div className="space-y-4">
                {scenarios.map(scenario => (
                  <button
                    key={scenario.id}
                    onClick={() => handleScenarioSelect(scenario)}
                    disabled={isScenarioMatched(scenario.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isScenarioMatched(scenario.id)
                        ? getMatchResult(scenario.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedScenario?.id === scenario.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{scenario.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{scenario.name}</h4>
                        <p className="text-white/80 text-sm">{scenario.description}</p>
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
                  {selectedScenario 
                    ? `Selected: ${selectedScenario.name}` 
                    : "Select a Peer Scenario"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedScenario || !selectedAction}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedScenario && selectedAction
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{scenarios.length}</p>
                  <p>Matched: {matches.length}/{scenarios.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Actions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Support Actions</h3>
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
                <div className="text-5xl mb-4">🧩</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {scenarios.length} peer support scenarios with appropriate actions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Knowing how to respond appropriately to peer situations helps build stronger, more supportive communities!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {scenarios.length} peer support scenarios correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about what supportive action would be most appropriate for each peer scenario!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzlePeerSupport;