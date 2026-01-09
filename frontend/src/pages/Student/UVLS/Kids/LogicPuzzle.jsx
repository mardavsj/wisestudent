import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LogicPuzzle = () => {
  const navigate = useNavigate();
  const gameId = "uvls-kids-54";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 5;
  const totalXp = gameData?.xp || 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [selectedRule, setSelectedRule] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Logic patterns (left side) - 5 items with hints
  const patterns = [
    { id: 1, name: "Color Sequence", emoji: "🌈",  },
    { id: 2, name: "Number Order", emoji: "🔢",  },
    { id: 3, name: "Shape Rotation", emoji: "🔺",  },
    { id: 4, name: "Category Chain", emoji: "🍎",  },
    { id: 5, name: "Animal Group", emoji: "🐶",  }
  ];

  // Logic rules (right side) - 5 items with descriptions
  const rules = [
    { id: 6, name: "Rainbow Progression", emoji: "🎨",  },
    { id: 7, name: "Numerical Sequence", emoji: "📈",  },
    { id: 8, name: "Geometric Cycle", emoji: "🔄",  },
    { id: 9, name: "Fruit Family", emoji: "🍒",  },
    { id: 10, name: "Pet Classification", emoji: "🐾",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedRules = [
    rules[2], // Geometric Cycle (id: 8)
    rules[4], // Pet Classification (id: 10)
    rules[1], // Numerical Sequence (id: 7)
    rules[0], // Rainbow Progression (id: 6)
    rules[3]  // Fruit Family (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each pattern has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { patternId: 1, ruleId: 6 }, // Color Sequence → Rainbow Progression
    { patternId: 2, ruleId: 7 }, // Number Order → Numerical Sequence
    { patternId: 3, ruleId: 8 }, // Shape Rotation → Geometric Cycle
    { patternId: 4, ruleId: 9 }, // Category Chain → Fruit Family
    { patternId: 5, ruleId: 10 } // Animal Group → Pet Classification
  ];

  const handlePatternSelect = (pattern) => {
    if (gameFinished) return;
    setSelectedPattern(pattern);
  };

  const handleRuleSelect = (rule) => {
    if (gameFinished) return;
    setSelectedRule(rule);
  };

  const handleMatch = () => {
    if (!selectedPattern || !selectedRule || gameFinished) return;

    resetFeedback();

    const newMatch = {
      patternId: selectedPattern.id,
      ruleId: selectedRule.id,
      isCorrect: correctMatches.some(
        match => match.patternId === selectedPattern.id && match.ruleId === selectedRule.id
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
    if (newMatches.length === patterns.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedPattern(null);
    setSelectedRule(null);
  };

  // Check if a pattern is already matched
  const isPatternMatched = (patternId) => {
    return matches.some(match => match.patternId === patternId);
  };

  // Check if a rule is already matched
  const isRuleMatched = (ruleId) => {
    return matches.some(match => match.ruleId === ruleId);
  };

  // Get match result for a pattern
  const getMatchResult = (patternId) => {
    const match = matches.find(m => m.patternId === patternId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  return (
    <GameShell
      title="Logic Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Patterns with Rules (${matches.length}/${patterns.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="uvls-kids-54"
      nextGamePathProp="/student/uvls/kids/risky-offer"
      nextGameIdProp="uvls-kids-55"
      gameType="uvls"
      totalLevels={patterns.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === patterns.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
      maxScore={patterns.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Logic Patterns */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Logic Patterns</h3>
              <div className="space-y-4">
                {patterns.map(pattern => (
                  <button
                    key={pattern.id}
                    onClick={() => handlePatternSelect(pattern)}
                    disabled={isPatternMatched(pattern.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isPatternMatched(pattern.id)
                        ? getMatchResult(pattern.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedPattern?.id === pattern.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{pattern.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{pattern.name}</h4>
                        
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
                  {selectedPattern 
                    ? `Selected: ${selectedPattern.name}` 
                    : "Select a Logic Pattern"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedPattern || !selectedRule}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedPattern && selectedRule
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{patterns.length}</p>
                  <p>Matched: {matches.length}/{patterns.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Logic Rules */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Logic Rules</h3>
              <div className="space-y-4">
                {rearrangedRules.map(rule => (
                  <button
                    key={rule.id}
                    onClick={() => handleRuleSelect(rule)}
                    disabled={isRuleMatched(rule.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isRuleMatched(rule.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedRule?.id === rule.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{rule.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{rule.name}</h4>
                        <p className="text-white/80 text-sm">{rule.description}</p>
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
                  You correctly matched {score} out of {patterns.length} logic patterns with rules!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding patterns helps you think logically and solve problems!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {patterns.length} logic patterns correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about which rule best explains each pattern!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default LogicPuzzle;