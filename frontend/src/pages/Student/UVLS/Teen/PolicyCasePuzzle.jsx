import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PolicyCasePuzzle = () => {
  const navigate = useNavigate();

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Inclusion challenges (left side) - 5 items with hints
  const challenges = [
    { id: 1, name: "Student Exclusion", emoji: "🚫",  },
    { id: 2, name: "Lack of Representation", emoji: "👥",  },
    { id: 3, name: "Discrimination Cases", emoji: "⚖️",  },
    { id: 4, name: "Accessibility Barriers", emoji: "♿",  },
    { id: 5, name: "Cultural Insensitivity", emoji: "🌍",  }
  ];

  // Policy solutions (right side) - 5 items with descriptions
  const policies = [
    { id: 6, name: "Inclusion Training", emoji: "🎓",  },
    { id: 7, name: "Diverse Committees", emoji: "🏛️",  },
    { id: 8, name: "Anti-Discrimination Rules", emoji: "🛡️",  },
    { id: 9, name: "Accessible Materials", emoji: "📘",  },
    { id: 10, name: "Cultural Events", emoji: "🎊",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedPolicies = [
    policies[2], // Anti-Discrimination Rules (id: 8)
    policies[4], // Cultural Events (id: 10)
    policies[1], // Diverse Committees (id: 7)
    policies[0], // Inclusion Training (id: 6)
    policies[3]  // Accessible Materials (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each challenge has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { challengeId: 1, policyId: 6 }, // Student Exclusion → Inclusion Training
    { challengeId: 2, policyId: 7 }, // Lack of Representation → Diverse Committees
    { challengeId: 3, policyId: 8 }, // Discrimination Cases → Anti-Discrimination Rules
    { challengeId: 4, policyId: 9 }, // Accessibility Barriers → Accessible Materials
    { challengeId: 5, policyId: 10 } // Cultural Insensitivity → Cultural Events
  ];

  const handleChallengeSelect = (challenge) => {
    if (gameFinished) return;
    setSelectedChallenge(challenge);
  };

  const handlePolicySelect = (policy) => {
    if (gameFinished) return;
    setSelectedPolicy(policy);
  };

  const handleMatch = () => {
    if (!selectedChallenge || !selectedPolicy || gameFinished) return;

    resetFeedback();

    const newMatch = {
      challengeId: selectedChallenge.id,
      policyId: selectedPolicy.id,
      isCorrect: correctMatches.some(
        match => match.challengeId === selectedChallenge.id && match.policyId === selectedPolicy.id
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
    if (newMatches.length === challenges.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedChallenge(null);
    setSelectedPolicy(null);
  };

  // Check if a challenge is already matched
  const isChallengeMatched = (challengeId) => {
    return matches.some(match => match.challengeId === challengeId);
  };

  // Check if a policy is already matched
  const isPolicyMatched = (policyId) => {
    return matches.some(match => match.policyId === policyId);
  };

  // Get match result for a challenge
  const getMatchResult = (challengeId) => {
    const match = matches.find(m => m.challengeId === challengeId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/uvls/teen");
  };

  return (
    <GameShell
      title="Policy Case Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Challenges with Policies (${matches.length}/${challenges.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="uvls-teen-19"
      nextGamePathProp="/student/uvls/teen/respect-leader-badge"
      nextGameIdProp="uvls-teen-20"
      gameType="uvls"
      totalLevels={challenges.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === challenges.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teen"
      maxScore={challenges.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* School Inclusion Challenge Introduction */}
        <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl p-6 border-2 border-purple-400/50">
          <h3 className="text-white text-xl font-bold mb-2">School Inclusion Challenge</h3>
          <p className="text-white/90">Several students with diverse needs report feeling excluded from activities. As a student leader, match policy solutions to inclusion challenges.</p>
        </div>
        
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Inclusion Challenges */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Inclusion Challenges</h3>
              <div className="space-y-4">
                {challenges.map(challenge => (
                  <button
                    key={challenge.id}
                    onClick={() => handleChallengeSelect(challenge)}
                    disabled={isChallengeMatched(challenge.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isChallengeMatched(challenge.id)
                        ? getMatchResult(challenge.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedChallenge?.id === challenge.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{challenge.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{challenge.name}</h4>
                        
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
                  {selectedChallenge 
                    ? `Selected: ${selectedChallenge.name}` 
                    : "Select an Inclusion Challenge"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedChallenge || !selectedPolicy}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedChallenge && selectedPolicy
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{challenges.length}</p>
                  <p>Matched: {matches.length}/{challenges.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Policy Solutions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Policy Solutions</h3>
              <div className="space-y-4">
                {rearrangedPolicies.map(policy => (
                  <button
                    key={policy.id}
                    onClick={() => handlePolicySelect(policy)}
                    disabled={isPolicyMatched(policy.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isPolicyMatched(policy.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedPolicy?.id === policy.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{policy.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{policy.name}</h4>
                        <p className="text-white/80 text-sm">{policy.description}</p>
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
                  You correctly matched {score} out of {challenges.length} inclusion challenges with policy solutions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Effective policy solutions address specific challenges with targeted approaches!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {challenges.length} inclusion challenges correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about what specific policy would best address each inclusion challenge!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PolicyCasePuzzle;