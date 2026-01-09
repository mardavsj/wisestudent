import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const PuzzleClimatePolicies = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get game data from game category folder (source of truth)
  const gameId = "sustainability-teens-69";
  
  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getSustainabilityTeenGames({});
      const currentGame = games.find(g => g.id === gameId);
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
  }, [location.state, gameId]);
  const gameData = getGameDataById(gameId);
  
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

  // Climate Challenges (left side) - 5 items
  const challenges = [
    { id: 1, name: "Carbon Emissions", emoji: "🌍",  },
    { id: 2, name: "Deforestation", emoji: "🪓",  },
    { id: 3, name: "Ocean Acidification", emoji: "🌊",  },
    { id: 4, name: "Air Pollution", emoji: "💨",  },
    { id: 5, name: "Water Scarcity", emoji: "💧",  }
  ];

  // Climate Policies (right side) - 5 items
  const policies = [
    { id: 4, name: "Clean Air Act", emoji: "💨",  },
    { id: 5, name: "Water Conservation", emoji: "💧",  },
    { id: 1, name: "Carbon Tax", emoji: "💰",  },
    { id: 2, name: "Forest Protection", emoji: "🌲",  },
    { id: 3, name: "Ocean Protection", emoji: "🌊",  }
  ];

  // Correct matches
  const correctMatches = [
    { challengeId: 1, policyId: 1 }, // Carbon Emissions → Carbon Tax
    { challengeId: 2, policyId: 2 }, // Deforestation → Forest Protection
    { challengeId: 3, policyId: 3 }, // Ocean Acidification → Ocean Protection
    { challengeId: 4, policyId: 4 }, // Air Pollution → Clean Air Act
    { challengeId: 5, policyId: 5 }  // Water Scarcity → Water Conservation
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
    };

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

  return (
    <GameShell
      title="Puzzle: Climate Policies"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Challenges with Solutions (${matches.length}/${challenges.length} matched)`}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={challenges.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === challenges.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/sustainability/teens"
      maxScore={challenges.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    
      nextGamePathProp="/student/sustainability/teens/school-policy-story"
      nextGameIdProp="sustainability-teens-70">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Climate Challenges */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Climate Challenges</h3>
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
                        <p className="text-white/80 text-sm">{challenge.description}</p>
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
                    : "Select a Challenge"}
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

            {/* Right column - Climate Policies */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Climate Policies</h3>
              <div className="space-y-4">
                {policies.map(policy => (
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
                <h3 className="text-2xl font-bold text-white mb-4">Climate Policy Master!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {challenges.length} climate challenges with appropriate policies!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Each climate challenge requires specific policy solutions to address it effectively!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {challenges.length} challenges correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about how each policy directly addresses its corresponding challenge!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleClimatePolicies;