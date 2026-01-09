import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SupportNetworkPuzzle = () => {
  const navigate = useNavigate();

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedSupporter, setSelectedSupporter] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Support network members (left side) - 5 items with hints
  const supporters = [
    { id: 1, name: "Teacher", emoji: "👩‍🏫", },
    { id: 2, name: "Counselor", emoji: "🛋️", },
    { id: 3, name: "Parent", emoji: "👪", },
    { id: 4, name: "Peer", emoji: "👭", },
    { id: 5, name: "Helpline", emoji: "☎️", }
  ];

  // Support roles (right side) - 5 items with descriptions
  const roles = [
    { id: 6, name: "Conflict Mediator", emoji: "🤝", },
    { id: 7, name: "Emotional Guide", emoji: "💬", },
    { id: 8, name: "Advocate Protector", emoji: "🛡️", },
    { id: 9, name: "Ally Defender", emoji: "✊", },
    { id: 10, name: "Anonymous Advisor", emoji: "🕵️", }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedRoles = [
    roles[2], // Advocate Protector (id: 8)
    roles[4], // Anonymous Advisor (id: 10)
    roles[1], // Emotional Guide (id: 7)
    roles[0], // Conflict Mediator (id: 6)
    roles[3]  // Ally Defender (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each supporter has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { supporterId: 1, roleId: 6 }, // Teacher → Conflict Mediator
    { supporterId: 2, roleId: 7 }, // Counselor → Emotional Guide
    { supporterId: 3, roleId: 8 }, // Parent → Advocate Protector
    { supporterId: 4, roleId: 9 }, // Peer → Ally Defender
    { supporterId: 5, roleId: 10 } // Helpline → Anonymous Advisor
  ];

  const handleSupporterSelect = (supporter) => {
    if (gameFinished) return;
    setSelectedSupporter(supporter);
  };

  const handleRoleSelect = (role) => {
    if (gameFinished) return;
    setSelectedRole(role);
  };

  const handleMatch = () => {
    if (!selectedSupporter || !selectedRole || gameFinished) return;

    resetFeedback();

    const newMatch = {
      supporterId: selectedSupporter.id,
      roleId: selectedRole.id,
      isCorrect: correctMatches.some(
        match => match.supporterId === selectedSupporter.id && match.roleId === selectedRole.id
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
    if (newMatches.length === supporters.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedSupporter(null);
    setSelectedRole(null);
  };

  // Check if a supporter is already matched
  const isSupporterMatched = (supporterId) => {
    return matches.some(match => match.supporterId === supporterId);
  };

  // Check if a role is already matched
  const isRoleMatched = (roleId) => {
    return matches.some(match => match.roleId === roleId);
  };

  // Get match result for a supporter
  const getMatchResult = (supporterId) => {
    const match = matches.find(m => m.supporterId === supporterId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/uvls/teen");
  };

  return (
    <GameShell
      title="Support Network Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Supporters with Roles (${matches.length}/${supporters.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="uvls-teen-33"
      nextGamePathProp="/student/uvls/teen/intervention-simulation"
      nextGameIdProp="uvls-teen-34"
      gameType="uvls"
      totalLevels={supporters.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === supporters.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teen"
      maxScore={supporters.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Support Network Members */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Support Network Members</h3>
              <div className="space-y-4">
                {supporters.map(supporter => (
                  <button
                    key={supporter.id}
                    onClick={() => handleSupporterSelect(supporter)}
                    disabled={isSupporterMatched(supporter.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isSupporterMatched(supporter.id)
                        ? getMatchResult(supporter.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedSupporter?.id === supporter.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{supporter.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{supporter.name}</h4>
                        
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
                  {selectedSupporter 
                    ? `Selected: ${selectedSupporter.name}` 
                    : "Select a Support Member"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedSupporter || !selectedRole}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedSupporter && selectedRole
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{supporters.length}</p>
                  <p>Matched: {matches.length}/{supporters.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Support Roles */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Support Roles</h3>
              <div className="space-y-4">
                {rearrangedRoles.map(role => (
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
                  You correctly matched {score} out of {supporters.length} support network members with their roles!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding your support network helps you seek help effectively!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {supporters.length} support network members correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about what kind of support each person in your network can provide!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SupportNetworkPuzzle;