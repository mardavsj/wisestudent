import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PolicyPuzzle = () => {
  const navigate = useNavigate();

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [selectedImprovement, setSelectedImprovement] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // School policies (left side) - 5 items with hints
  const policies = [
    { id: 1, name: "No Phones Allowed", emoji: "📱",  },
    { id: 2, name: "Mandatory Uniforms", emoji: "👕",  },
    { id: 3, name: "Daily Homework", emoji: "📚",  },
    { id: 4, name: "Recess Removal", emoji: "🏃",  },
    { id: 5, name: "Grading on Curve", emoji: "📊",  }
  ];

  // Policy improvements (right side) - 5 items with descriptions
  const improvements = [
    { id: 6, name: "Designated Usage", emoji: "⏰",  },
    { id: 7, name: "Flexible Options", emoji: "🎨",  },
    { id: 8, name: "Project-Based Tasks", emoji: "🎓",  },
    { id: 9, name: "Constructive Alternatives", emoji: "🔨",  },
    { id: 10, name: "Balanced Assessment", emoji: "⚖️",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedImprovements = [
    improvements[2], // Project-Based Tasks (id: 8)
    improvements[4], // Balanced Assessment (id: 10)
    improvements[1], // Flexible Options (id: 7)
    improvements[0], // Designated Usage (id: 6)
    improvements[3]  // Constructive Alternatives (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each policy has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { policyId: 1, improvementId: 6 }, // No Phones Allowed → Designated Usage
    { policyId: 2, improvementId: 7 }, // Mandatory Uniforms → Flexible Options
    { policyId: 3, improvementId: 8 }, // Daily Homework → Project-Based Tasks
    { policyId: 4, improvementId: 9 }, // Recess Removal → Constructive Alternatives
    { policyId: 5, improvementId: 10 } // Grading on Curve → Balanced Assessment
  ];

  const handlePolicySelect = (policy) => {
    if (gameFinished) return;
    setSelectedPolicy(policy);
  };

  const handleImprovementSelect = (improvement) => {
    if (gameFinished) return;
    setSelectedImprovement(improvement);
  };

  const handleMatch = () => {
    if (!selectedPolicy || !selectedImprovement || gameFinished) return;

    resetFeedback();

    const newMatch = {
      policyId: selectedPolicy.id,
      improvementId: selectedImprovement.id,
      isCorrect: correctMatches.some(
        match => match.policyId === selectedPolicy.id && match.improvementId === selectedImprovement.id
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
    if (newMatches.length === policies.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedPolicy(null);
    setSelectedImprovement(null);
  };

  // Check if a policy is already matched
  const isPolicyMatched = (policyId) => {
    return matches.some(match => match.policyId === policyId);
  };

  // Check if an improvement is already matched
  const isImprovementMatched = (improvementId) => {
    return matches.some(match => match.improvementId === improvementId);
  };

  // Get match result for a policy
  const getMatchResult = (policyId) => {
    const match = matches.find(m => m.policyId === policyId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/uvls/teen");
  };

  return (
    <GameShell
      title="Policy Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Policies with Improvements (${matches.length}/${policies.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="uvls-teen-59"
      nextGamePathProp="/student/uvls/teen/decision-master-badge"
      nextGameIdProp="uvls-teen-60"
      gameType="uvls"
      totalLevels={policies.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === policies.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teen"
      maxScore={policies.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - School Policies */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">School Policies</h3>
              <div className="space-y-4">
                {policies.map(policy => (
                  <button
                    key={policy.id}
                    onClick={() => handlePolicySelect(policy)}
                    disabled={isPolicyMatched(policy.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isPolicyMatched(policy.id)
                        ? getMatchResult(policy.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedPolicy?.id === policy.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{policy.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{policy.name}</h4>
                        
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
                  {selectedPolicy 
                    ? `Selected: ${selectedPolicy.name}` 
                    : "Select a School Policy"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedPolicy || !selectedImprovement}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedPolicy && selectedImprovement
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{policies.length}</p>
                  <p>Matched: {matches.length}/{policies.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Policy Improvements */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Policy Improvements</h3>
              <div className="space-y-4">
                {rearrangedImprovements.map(improvement => (
                  <button
                    key={improvement.id}
                    onClick={() => handleImprovementSelect(improvement)}
                    disabled={isImprovementMatched(improvement.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isImprovementMatched(improvement.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedImprovement?.id === improvement.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{improvement.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{improvement.name}</h4>
                        <p className="text-white/80 text-sm">{improvement.description}</p>
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
                  You correctly matched {score} out of {policies.length} school policies with practical improvements!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Thoughtful policy improvements balance structure with flexibility for better outcomes!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {policies.length} school policies correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about how each policy could be adjusted to be more effective and fair!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PolicyPuzzle;