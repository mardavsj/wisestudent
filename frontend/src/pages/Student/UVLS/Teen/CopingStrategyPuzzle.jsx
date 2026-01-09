import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CopingStrategyPuzzle = () => {
  const navigate = useNavigate();

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedStressor, setSelectedStressor] = useState(null);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Stressful situations (left side) - 5 items with hints
  const stressors = [
    { id: 1, name: "Exam Anxiety", emoji: "📝",  },
    { id: 2, name: "Friend Conflict", emoji: "👥",  },
    { id: 3, name: "Schedule Overload", emoji: "📅",  },
    { id: 4, name: "Low Self-Esteem", emoji: "😔",  },
    { id: 5, name: "Building Anger", emoji: "😠",  }
  ];

  // Coping strategies (right side) - 5 items with descriptions
  const strategies = [
    { id: 6, name: "Breathing Exercises", emoji: "💨",  },
    { id: 7, name: "Open Communication", emoji: "💬",  },
    { id: 8, name: "Task Prioritization", emoji: "📋",  },
    { id: 9, name: "Positive Affirmations", emoji: "✨",  },
    { id: 10, name: "Count to Ten", emoji: "🔟",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedStrategies = [
    strategies[2], // Task Prioritization (id: 8)
    strategies[4], // Count to Ten (id: 10)
    strategies[1], // Open Communication (id: 7)
    strategies[0], // Breathing Exercises (id: 6)
    strategies[3]  // Positive Affirmations (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each stressor has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { stressorId: 1, strategyId: 6 }, // Exam Anxiety → Breathing Exercises
    { stressorId: 2, strategyId: 7 }, // Friend Conflict → Open Communication
    { stressorId: 3, strategyId: 8 }, // Schedule Overload → Task Prioritization
    { stressorId: 4, strategyId: 9 }, // Low Self-Esteem → Positive Affirmations
    { stressorId: 5, strategyId: 10 } // Building Anger → Count to Ten
  ];

  const handleStressorSelect = (stressor) => {
    if (gameFinished) return;
    setSelectedStressor(stressor);
  };

  const handleStrategySelect = (strategy) => {
    if (gameFinished) return;
    setSelectedStrategy(strategy);
  };

  const handleMatch = () => {
    if (!selectedStressor || !selectedStrategy || gameFinished) return;

    resetFeedback();

    const newMatch = {
      stressorId: selectedStressor.id,
      strategyId: selectedStrategy.id,
      isCorrect: correctMatches.some(
        match => match.stressorId === selectedStressor.id && match.strategyId === selectedStrategy.id
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
    if (newMatches.length === stressors.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedStressor(null);
    setSelectedStrategy(null);
  };

  // Check if a stressor is already matched
  const isStressorMatched = (stressorId) => {
    return matches.some(match => match.stressorId === stressorId);
  };

  // Check if a strategy is already matched
  const isStrategyMatched = (strategyId) => {
    return matches.some(match => match.strategyId === strategyId);
  };

  // Get match result for a stressor
  const getMatchResult = (stressorId) => {
    const match = matches.find(m => m.stressorId === stressorId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/uvls/teen");
  };

  return (
    <GameShell
      title="Coping Strategy Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Stressors with Strategies (${matches.length}/${stressors.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="uvls-teen-44"
      nextGamePathProp="/student/uvls/teen/de-escalation-roleplay"
      nextGameIdProp="uvls-teen-45"
      gameType="uvls"
      totalLevels={stressors.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === stressors.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teen"
      maxScore={stressors.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Stressful Situations */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Stressful Situations</h3>
              <div className="space-y-4">
                {stressors.map(stressor => (
                  <button
                    key={stressor.id}
                    onClick={() => handleStressorSelect(stressor)}
                    disabled={isStressorMatched(stressor.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isStressorMatched(stressor.id)
                        ? getMatchResult(stressor.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedStressor?.id === stressor.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{stressor.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{stressor.name}</h4>
                        
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
                  {selectedStressor 
                    ? `Selected: ${selectedStressor.name}` 
                    : "Select a Stressful Situation"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedStressor || !selectedStrategy}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedStressor && selectedStrategy
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{stressors.length}</p>
                  <p>Matched: {matches.length}/{stressors.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Coping Strategies */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Coping Strategies</h3>
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
                  You correctly matched {score} out of {stressors.length} stressful situations with appropriate coping strategies!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Developing healthy coping strategies helps you manage stress and emotions effectively!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {stressors.length} stressful situations correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about what healthy strategies would help in different challenging situations!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CopingStrategyPuzzle;