import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SystemicCasePuzzle = () => {
  const navigate = useNavigate();

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Anti-bullying program components (left side) - 5 items with hints
  const components = [
    { id: 1, name: "Policy Framework", emoji: "📜",  },
    { id: 2, name: "Training Program", emoji: "📢",  },
    { id: 3, name: "Support Systems", emoji: "🛋️",  },
    { id: 4, name: "Evaluation Methods", emoji: "📊",  },
    { id: 5, name: "Sustainability Plan", emoji: "♻️",  }
  ];

  // Implementation strategies (right side) - 5 items with descriptions
  const strategies = [
    { id: 6, name: "Enforcement Guidelines", emoji: "✅",  },
    { id: 7, name: "Interactive Sessions", emoji: "👥",  },
    { id: 8, name: "Multi-channel Support", emoji: "🆘",  },
    { id: 9, name: "Continuous Feedback", emoji: "🔄",  },
    { id: 10, name: "Community Involvement", emoji: "🤝",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedStrategies = [
    strategies[2], // Multi-channel Support (id: 8)
    strategies[4], // Community Involvement (id: 10)
    strategies[1], // Interactive Sessions (id: 7)
    strategies[0], // Enforcement Guidelines (id: 6)
    strategies[3]  // Continuous Feedback (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each component has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { componentId: 1, strategyId: 6 }, // Policy Framework → Enforcement Guidelines
    { componentId: 2, strategyId: 7 }, // Training Program → Interactive Sessions
    { componentId: 3, strategyId: 8 }, // Support Systems → Multi-channel Support
    { componentId: 4, strategyId: 9 }, // Evaluation Methods → Continuous Feedback
    { componentId: 5, strategyId: 10 } // Sustainability Plan → Community Involvement
  ];

  const handleComponentSelect = (component) => {
    if (gameFinished) return;
    setSelectedComponent(component);
  };

  const handleStrategySelect = (strategy) => {
    if (gameFinished) return;
    setSelectedStrategy(strategy);
  };

  const handleMatch = () => {
    if (!selectedComponent || !selectedStrategy || gameFinished) return;

    resetFeedback();

    const newMatch = {
      componentId: selectedComponent.id,
      strategyId: selectedStrategy.id,
      isCorrect: correctMatches.some(
        match => match.componentId === selectedComponent.id && match.strategyId === selectedStrategy.id
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
    if (newMatches.length === components.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedComponent(null);
    setSelectedStrategy(null);
  };

  // Check if a component is already matched
  const isComponentMatched = (componentId) => {
    return matches.some(match => match.componentId === componentId);
  };

  // Check if a strategy is already matched
  const isStrategyMatched = (strategyId) => {
    return matches.some(match => match.strategyId === strategyId);
  };

  // Get match result for a component
  const getMatchResult = (componentId) => {
    const match = matches.find(m => m.componentId === componentId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/uvls/teen");
  };

  return (
    <GameShell
      title="Systemic Case Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Components with Strategies (${matches.length}/${components.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="uvls-teen-39"
      nextGamePathProp="/student/uvls/teen/anti-bullying-champion-badge"
      nextGameIdProp="uvls-teen-40"
      gameType="uvls"
      totalLevels={components.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === components.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teen"
      maxScore={components.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Program Components */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Program Components</h3>
              <div className="space-y-4">
                {components.map(component => (
                  <button
                    key={component.id}
                    onClick={() => handleComponentSelect(component)}
                    disabled={isComponentMatched(component.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isComponentMatched(component.id)
                        ? getMatchResult(component.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedComponent?.id === component.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{component.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{component.name}</h4>
                        
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
                  {selectedComponent 
                    ? `Selected: ${selectedComponent.name}` 
                    : "Select a Program Component"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedComponent || !selectedStrategy}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedComponent && selectedStrategy
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{components.length}</p>
                  <p>Matched: {matches.length}/{components.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Implementation Strategies */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Implementation Strategies</h3>
              <div className="space-y-4">
                {rearrangedStrategies.map(strategy => (
                  <button
                    key={strategy.id}
                    onClick={() => handleStrategySelect(strategy)}
                    disabled={isStrategyMatched(strategy.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isStrategyMatched(strategy.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedStrategy?.id === strategy.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{strategy.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{strategy.name}</h4>
                        <p className="text-white/80 text-sm">{strategy.description}</p>
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
                  You correctly matched {score} out of {components.length} anti-bullying program components with implementation strategies!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Effective systemic change requires matching each program component with the right implementation strategy!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {components.length} program components correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about which strategy best supports each program component!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SystemicCasePuzzle;