import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchCivicRoles = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedResponsibility, setSelectedResponsibility] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Civic Roles (left side) - 5 items
  const roles = [
    { id: 1, name: "Judge", emoji: "⚖️",  },
    { id: 2, name: "Police", emoji: "👮",  },
    { id: 3, name: "Voter", emoji: "🗳️",  },
    { id: 4, name: "Teacher", emoji: "🏫",  },
    { id: 5, name: "Citizen", emoji: "👥",  }
  ];

  // Responsibilities (right side) - 5 items
  const responsibilities = [
    { id: 3, name: "Democracy", emoji: "⚖️",  },
    { id: 2, name: "Safety", emoji: "🛡️",  },
    { id: 4, name: "Education", emoji: "🎓",  },
    { id: 5, name: "Responsibility", emoji: "📋",  },
    { id: 1, name: "Court", emoji: "🏛️",  },
  ];

  // Correct matches
  const correctMatches = [
    { roleId: 1, responsibilityId: 1 }, // Judge → Court
    { roleId: 2, responsibilityId: 2 }, // Police → Safety
    { roleId: 3, responsibilityId: 3 }, // Voter → Democracy
    { roleId: 4, responsibilityId: 4 }, // Teacher → Education
    { roleId: 5, responsibilityId: 5 }  // Citizen → Responsibility
  ];

  const handleRoleSelect = (role) => {
    if (gameFinished) return;
    setSelectedRole(role);
  };

  const handleResponsibilitySelect = (responsibility) => {
    if (gameFinished) return;
    setSelectedResponsibility(responsibility);
  };

  const handleMatch = () => {
    if (!selectedRole || !selectedResponsibility || gameFinished) return;

    resetFeedback();

    const newMatch = {
      roleId: selectedRole.id,
      responsibilityId: selectedResponsibility.id,
      isCorrect: correctMatches.some(
        match => match.roleId === selectedRole.id && match.responsibilityId === selectedResponsibility.id
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
    if (newMatches.length === roles.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedRole(null);
    setSelectedResponsibility(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedRole(null);
    setSelectedResponsibility(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/teens");
  };

  // Check if a role is already matched
  const isRoleMatched = (roleId) => {
    return matches.some(match => match.roleId === roleId);
  };

  // Check if a responsibility is already matched
  const isResponsibilityMatched = (responsibilityId) => {
    return matches.some(match => match.responsibilityId === responsibilityId);
  };

  // Get match result for a role
  const getMatchResult = (roleId) => {
    const match = matches.find(m => m.roleId === roleId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Match Civic Roles"
      subtitle={gameFinished ? "Game Complete!" : `Match Civic Roles with Responsibilities (${matches.length}/${roles.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="civic-responsibility-teens-74"
      gameType="civic-responsibility"
      totalLevels={roles.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/teens"
      maxScore={roles.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Civic Roles */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Civic Roles</h3>
              <div className="space-y-4">
                {roles.map(role => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role)}
                    disabled={isRoleMatched(role.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isRoleMatched(role.id)
                        ? getMatchResult(role.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedRole?.id === role.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
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

            {/* Middle column - Match button */}
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
                <p className="text-white/80 mb-4">
                  {selectedRole 
                    ? `Selected: ${selectedRole.name}` 
                    : "Select a Civic Role"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedRole || !selectedResponsibility}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedRole && selectedResponsibility
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{roles.length}</p>
                  <p>Matched: {matches.length}/{roles.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Responsibilities */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Responsibilities</h3>
              <div className="space-y-4">
                {responsibilities.map(responsibility => (
                  <button
                    key={responsibility.id}
                    onClick={() => handleResponsibilitySelect(responsibility)}
                    disabled={isResponsibilityMatched(responsibility.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isResponsibilityMatched(responsibility.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedResponsibility?.id === responsibility.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{responsibility.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{responsibility.name}</h4>
                        <p className="text-white/80 text-sm">{responsibility.description}</p>
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
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-white mb-4">Excellent Work!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {roles.length} civic roles with their responsibilities!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding civic roles helps you appreciate how society functions and your place in it!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {roles.length} civic roles correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about what each civic role contributes to society and how they fulfill their duties!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleMatchCivicRoles;