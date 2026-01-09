import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const WorkplacePuzzle = () => {
  const navigate = useNavigate();

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Workplace issues (left side) - 5 items with hints
  const issues = [
    { id: 1, name: "Pay Inequality", emoji: "💰",  },
    { id: 2, name: "Harassment", emoji: "🛡️",  },
    { id: 3, name: "Glass Ceiling", emoji: "📈",  },
    { id: 4, name: "Leave Discrimination", emoji: "👶",  },
    { id: 5, name: "Role Stereotyping", emoji: "📋",  }
  ];

  // Workplace solutions (right side) - 5 items with descriptions
  const solutions = [
    { id: 6, name: "Pay Transparency", emoji: "🔍",  },
    { id: 7, name: "Safety Protocols", emoji: "✅",  },
    { id: 8, name: "Career Development", emoji: "🎓",  },
    { id: 9, name: "Inclusive Policies", emoji: "👨‍👩‍👧‍👦",  },
    { id: 10, name: "Bias Elimination", emoji: "🎯",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedSolutions = [
    solutions[2], // Career Development (id: 8)
    solutions[4], // Bias Elimination (id: 10)
    solutions[1], // Safety Protocols (id: 7)
    solutions[0], // Pay Transparency (id: 6)
    solutions[3]  // Inclusive Policies (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each issue has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { issueId: 1, solutionId: 6 }, // Pay Inequality → Pay Transparency
    { issueId: 2, solutionId: 7 }, // Harassment → Safety Protocols
    { issueId: 3, solutionId: 8 }, // Glass Ceiling → Career Development
    { issueId: 4, solutionId: 9 }, // Leave Discrimination → Inclusive Policies
    { issueId: 5, solutionId: 10 } // Role Stereotyping → Bias Elimination
  ];

  const handleIssueSelect = (issue) => {
    if (gameFinished) return;
    setSelectedIssue(issue);
  };

  const handleSolutionSelect = (solution) => {
    if (gameFinished) return;
    setSelectedSolution(solution);
  };

  const handleMatch = () => {
    if (!selectedIssue || !selectedSolution || gameFinished) return;

    resetFeedback();

    const newMatch = {
      issueId: selectedIssue.id,
      solutionId: selectedSolution.id,
      isCorrect: correctMatches.some(
        match => match.issueId === selectedIssue.id && match.solutionId === selectedSolution.id
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
    if (newMatches.length === issues.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedIssue(null);
    setSelectedSolution(null);
  };

  // Check if an issue is already matched
  const isIssueMatched = (issueId) => {
    return matches.some(match => match.issueId === issueId);
  };

  // Check if a solution is already matched
  const isSolutionMatched = (solutionId) => {
    return matches.some(match => match.solutionId === solutionId);
  };

  // Get match result for an issue
  const getMatchResult = (issueId) => {
    const match = matches.find(m => m.issueId === issueId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/uvls/teen");
  };

  return (
    <GameShell
      title="Workplace Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Issues with Solutions (${matches.length}/${issues.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="uvls-teen-24"
      nextGamePathProp="/student/uvls/teen/program-design-simulation"
      nextGameIdProp="uvls-teen-25"
      gameType="uvls"
      totalLevels={issues.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === issues.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teen"
      maxScore={issues.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Workplace Issues */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Workplace Issues</h3>
              <div className="space-y-4">
                {issues.map(issue => (
                  <button
                    key={issue.id}
                    onClick={() => handleIssueSelect(issue)}
                    disabled={isIssueMatched(issue.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isIssueMatched(issue.id)
                        ? getMatchResult(issue.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedIssue?.id === issue.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{issue.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{issue.name}</h4>
                        
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
                  {selectedIssue 
                    ? `Selected: ${selectedIssue.name}` 
                    : "Select a Workplace Issue"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedIssue || !selectedSolution}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedIssue && selectedSolution
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{issues.length}</p>
                  <p>Matched: {matches.length}/{issues.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Workplace Solutions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Workplace Solutions</h3>
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
                  You correctly matched {score} out of {issues.length} workplace issues with solutions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Creating a fair workplace requires matching each issue with the right solution!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {issues.length} workplace issues correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about which solution best addresses each workplace challenge!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default WorkplacePuzzle;