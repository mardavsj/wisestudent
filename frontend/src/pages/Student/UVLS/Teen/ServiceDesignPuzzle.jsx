import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ServiceDesignPuzzle = () => {
  const navigate = useNavigate();

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedFactor, setSelectedFactor] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Service design factors (left side) - 5 items with hints
  const factors = [
    { id: 1, name: "Cost Efficiency", emoji: "💰", },
    { id: 2, name: "User Reach", emoji: "🌍", },
    { id: 3, name: "Resource Effort", emoji: "💪", },
    { id: 4, name: "Social Impact", emoji: "📈", },
    { id: 5, name: "Longevity", emoji: "♻️", }
  ];

  // Sustainable solutions (right side) - 5 items with descriptions
  const solutions = [
    { id: 6, name: "Volunteer Networks", emoji: "🤝",  },
    { id: 7, name: "Scalable Models", emoji: "🏗️",  },
    { id: 8, name: "Streamlined Processes", emoji: "⚙️",  },
    { id: 9, name: "Measurable Outcomes", emoji: "📊",  },
    { id: 10, name: "Partnership Programs", emoji: "🔗",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedSolutions = [
    solutions[2], // Streamlined Processes (id: 8)
    solutions[4], // Measurable Outcomes (id: 10)
    solutions[1], // Scalable Models (id: 7)
    solutions[0], // Volunteer Networks (id: 6)
    solutions[3]  // Partnership Programs (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each factor has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { factorId: 1, solutionId: 6 }, // Cost Efficiency → Volunteer Networks
    { factorId: 2, solutionId: 7 }, // User Reach → Scalable Models
    { factorId: 3, solutionId: 8 }, // Resource Effort → Streamlined Processes
    { factorId: 4, solutionId: 9 }, // Social Impact → Measurable Outcomes
    { factorId: 5, solutionId: 10 } // Longevity → Partnership Programs
  ];

  const handleFactorSelect = (factor) => {
    if (gameFinished) return;
    setSelectedFactor(factor);
  };

  const handleSolutionSelect = (solution) => {
    if (gameFinished) return;
    setSelectedSolution(solution);
  };

  const handleMatch = () => {
    if (!selectedFactor || !selectedSolution || gameFinished) return;

    resetFeedback();

    const newMatch = {
      factorId: selectedFactor.id,
      solutionId: selectedSolution.id,
      isCorrect: correctMatches.some(
        match => match.factorId === selectedFactor.id && match.solutionId === selectedSolution.id
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
    if (newMatches.length === factors.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedFactor(null);
    setSelectedSolution(null);
  };

  // Check if a factor is already matched
  const isFactorMatched = (factorId) => {
    return matches.some(match => match.factorId === factorId);
  };

  // Check if a solution is already matched
  const isSolutionMatched = (solutionId) => {
    return matches.some(match => match.solutionId === solutionId);
  };

  // Get match result for a factor
  const getMatchResult = (factorId) => {
    const match = matches.find(m => m.factorId === factorId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/uvls/teen");
  };

  return (
    <GameShell
      title="Service Design Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Factors with Solutions (${matches.length}/${factors.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="uvls-teen-87"
      nextGamePathProp="/student/uvls/teen/coalition-simulation"
      nextGameIdProp="uvls-teen-88"
      gameType="uvls"
      totalLevels={factors.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === factors.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teen"
      maxScore={factors.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Service Design Factors */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Service Design Factors</h3>
              <div className="space-y-4">
                {factors.map(factor => (
                  <button
                    key={factor.id}
                    onClick={() => handleFactorSelect(factor)}
                    disabled={isFactorMatched(factor.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isFactorMatched(factor.id)
                        ? getMatchResult(factor.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedFactor?.id === factor.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{factor.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{factor.name}</h4>
                        
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
                  {selectedFactor 
                    ? `Selected: ${selectedFactor.name}` 
                    : "Select a Design Factor"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedFactor || !selectedSolution}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedFactor && selectedSolution
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{factors.length}</p>
                  <p>Matched: {matches.length}/{factors.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Sustainable Solutions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Sustainable Solutions</h3>
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
                  You correctly matched {score} out of {factors.length} service design factors with sustainable solutions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Sustainable service design requires balancing multiple factors with thoughtful solutions!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {factors.length} service design factors correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about which solution best addresses each design challenge!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ServiceDesignPuzzle;