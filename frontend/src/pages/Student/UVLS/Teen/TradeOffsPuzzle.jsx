import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TradeOffsPuzzle = () => {
  const navigate = useNavigate();

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedDilemma, setSelectedDilemma] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Life dilemmas (left side) - 5 items with hints
  const dilemmas = [
    { id: 1, name: "Study vs Sleep", emoji: "📚",  },
    { id: 2, name: "Spend vs Save", emoji: "💰",  },
    { id: 3, name: "Help vs Work", emoji: "👥",  },
    { id: 4, name: "Junk vs Healthy", emoji: "🍔",  },
    { id: 5, name: "Social vs Study", emoji: "🎉",  }
  ];

  // Balanced solutions (right side) - 5 items with descriptions
  const solutions = [
    { id: 6, name: "Time Management", emoji: "⏰",  },
    { id: 7, name: "Budget Planning", emoji: "📊",  },
    { id: 8, name: "Task Prioritization", emoji: "📋",  },
    { id: 9, name: "Moderation Approach", emoji: "⚖️",  },
    { id: 10, name: "Balanced Scheduling", emoji: "📅",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedSolutions = [
    solutions[2], // Task Prioritization (id: 8)
    solutions[4], // Balanced Scheduling (id: 10)
    solutions[1], // Budget Planning (id: 7)
    solutions[0], // Time Management (id: 6)
    solutions[3]  // Moderation Approach (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each dilemma has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { dilemmaId: 1, solutionId: 6 }, // Study vs Sleep → Time Management
    { dilemmaId: 2, solutionId: 7 }, // Spend vs Save → Budget Planning
    { dilemmaId: 3, solutionId: 8 }, // Help vs Work → Task Prioritization
    { dilemmaId: 4, solutionId: 9 }, // Junk vs Healthy → Moderation Approach
    { dilemmaId: 5, solutionId: 10 } // Social vs Study → Balanced Scheduling
  ];

  const handleDilemmaSelect = (dilemma) => {
    if (gameFinished) return;
    setSelectedDilemma(dilemma);
  };

  const handleSolutionSelect = (solution) => {
    if (gameFinished) return;
    setSelectedSolution(solution);
  };

  const handleMatch = () => {
    if (!selectedDilemma || !selectedSolution || gameFinished) return;

    resetFeedback();

    const newMatch = {
      dilemmaId: selectedDilemma.id,
      solutionId: selectedSolution.id,
      isCorrect: correctMatches.some(
        match => match.dilemmaId === selectedDilemma.id && match.solutionId === selectedSolution.id
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
    if (newMatches.length === dilemmas.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedDilemma(null);
    setSelectedSolution(null);
  };

  // Check if a dilemma is already matched
  const isDilemmaMatched = (dilemmaId) => {
    return matches.some(match => match.dilemmaId === dilemmaId);
  };

  // Check if a solution is already matched
  const isSolutionMatched = (solutionId) => {
    return matches.some(match => match.solutionId === solutionId);
  };

  // Get match result for a dilemma
  const getMatchResult = (dilemmaId) => {
    const match = matches.find(m => m.dilemmaId === dilemmaId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/uvls/teen");
  };

  return (
    <GameShell
      title="Trade-offs Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Dilemmas with Solutions (${matches.length}/${dilemmas.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="uvls-teen-53"
      nextGamePathProp="/student/uvls/teen/scenario-simulation"
      nextGameIdProp="uvls-teen-54"
      gameType="uvls"
      totalLevels={dilemmas.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === dilemmas.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teen"
      maxScore={dilemmas.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Life Dilemmas */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Life Dilemmas</h3>
              <div className="space-y-4">
                {dilemmas.map(dilemma => (
                  <button
                    key={dilemma.id}
                    onClick={() => handleDilemmaSelect(dilemma)}
                    disabled={isDilemmaMatched(dilemma.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isDilemmaMatched(dilemma.id)
                        ? getMatchResult(dilemma.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedDilemma?.id === dilemma.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{dilemma.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{dilemma.name}</h4>
                       
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
                  {selectedDilemma 
                    ? `Selected: ${selectedDilemma.name}` 
                    : "Select a Life Dilemma"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedDilemma || !selectedSolution}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedDilemma && selectedSolution
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{dilemmas.length}</p>
                  <p>Matched: {matches.length}/{dilemmas.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Balanced Solutions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Balanced Solutions</h3>
              <div className="space-y-4">
                {rearrangedSolutions.map(solution => (
                  <button
                    key={solution.id}
                    onClick={() => handleSolutionSelect(solution)}
                    disabled={isSolutionMatched(solution.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isSolutionMatched(solution.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedSolution?.id === solution.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{solution.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{solution.name}</h4>
                        <p className="text-white/80 text-sm">{solution.description}</p>
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
                  You correctly matched {score} out of {dilemmas.length} life dilemmas with balanced solutions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Life's trade-offs can be managed with thoughtful, balanced approaches!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {dilemmas.length} life dilemmas correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about which solution best resolves each dilemma!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TradeOffsPuzzle;