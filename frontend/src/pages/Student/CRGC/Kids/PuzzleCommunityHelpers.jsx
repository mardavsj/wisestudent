import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleCommunityHelpers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Helpers (left side) - 5 items
  const helpers = [
    { id: 1, name: "Doctor", emoji: "👨‍⚕️",  },
    { id: 2, name: "Firefighter", emoji: "👨‍🚒",  },
    { id: 3, name: "Teacher", emoji: "👩‍🏫",  },
    { id: 4, name: "Police Officer", emoji: "👮",  },
    { id: 5, name: "Volunteer", emoji: "👩‍🦳",  }
  ];

  // Roles (right side) - 5 items
  const roles = [
    { id: 2, name: "Safety", emoji: "🚒",  },
    { id: 5, name: "Service", emoji: "❤️",  },
    { id: 1, name: "Health", emoji: "🩺",  },
    { id: 3, name: "Education", emoji: "📚",  },
    { id: 4, name: "Protection", emoji: "🚔",  },
  ];

  // Correct matches
  const correctMatches = [
    { helperId: 1, roleId: 1 }, // Doctor → Health
    { helperId: 2, roleId: 2 }, // Firefighter → Safety
    { helperId: 3, roleId: 3 }, // Teacher → Education
    { helperId: 4, roleId: 4 }, // Police Officer → Protection
    { helperId: 5, roleId: 5 }  // Volunteer → Service
  ];

  const handleHelperSelect = (helper) => {
    if (gameFinished) return;
    setSelectedHelper(helper);
  };

  const handleRoleSelect = (role) => {
    if (gameFinished) return;
    setSelectedRole(role);
  };

  const handleMatch = () => {
    if (!selectedHelper || !selectedRole || gameFinished) return;

    resetFeedback();

    const newMatch = {
      helperId: selectedHelper.id,
      roleId: selectedRole.id,
      isCorrect: correctMatches.some(
        match => match.helperId === selectedHelper.id && match.roleId === selectedRole.id
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
    if (newMatches.length === helpers.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedHelper(null);
    setSelectedRole(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedHelper(null);
    setSelectedRole(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/kids");
  };

  // Check if a helper is already matched
  const isHelperMatched = (helperId) => {
    return matches.some(match => match.helperId === helperId);
  };

  // Check if a role is already matched
  const isRoleMatched = (roleId) => {
    return matches.some(match => match.roleId === roleId);
  };

  // Get match result for a helper
  const getMatchResult = (helperId) => {
    const match = matches.find(m => m.helperId === helperId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Community Helpers"
      subtitle={gameFinished ? "Game Complete!" : `Match Community Helpers with Their Roles (${matches.length}/${helpers.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="civic-responsibility-kids-54"
      gameType="civic-responsibility"
      totalLevels={helpers.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/kids"
      maxScore={helpers.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Helpers */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Community Helpers</h3>
              <div className="space-y-4">
                {helpers.map(helper => (
                  <button
                    key={helper.id}
                    onClick={() => handleHelperSelect(helper)}
                    disabled={isHelperMatched(helper.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isHelperMatched(helper.id)
                        ? getMatchResult(helper.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedHelper?.id === helper.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{helper.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{helper.name}</h4>
                        <p className="text-white/80 text-sm">{helper.description}</p>
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
                  {selectedHelper 
                    ? `Selected: ${selectedHelper.name}` 
                    : "Select a Helper"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedHelper || !selectedRole}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedHelper && selectedRole
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{helpers.length}</p>
                  <p>Matched: {matches.length}/{helpers.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Roles */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Roles</h3>
              <div className="space-y-4">
                {roles.map(role => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role)}
                    disabled={isRoleMatched(role.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isRoleMatched(role.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedRole?.id === role.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{role.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{role.name}</h4>
                        <p className="text-white/80 text-sm">{role.description}</p>
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
                  You correctly matched {score} out of {helpers.length} community helpers with their roles!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Community helpers play important roles in keeping our neighborhoods safe, healthy, and educated!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {helpers.length} helpers correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about what each community helper does to help people in their daily work!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleCommunityHelpers;