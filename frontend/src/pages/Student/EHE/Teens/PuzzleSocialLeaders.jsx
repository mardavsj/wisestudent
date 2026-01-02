import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleSocialLeaders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Social Leaders (left side) - 5 items
  const leaders = [
    { id: 1, name: "Muhammad Yunus",   },
    { id: 2, name: "Bunker Roy",   },
    { id: 3, name: "Kiran Mazumdar",   },
    { id: 4, name: "Blake Mycoskie",   },
    { id: 5, name: "William Drayton",   },
  ];

  // Contributions (right side) - 5 items
  const contributions = [
    { id: 5, name: "Ashoka",   },
    { id: 1, name: "Microfinance",   },
    { id: 4, name: "Toms Shoes",   },
    { id: 2, name: "Barefoot College",   },
    { id: 3, name: "Biotech",   },
  ];

  // Correct matches
  const correctMatches = [
    { leaderId: 1, contributionId: 1 }, // Muhammad Yunus → Microfinance
    { leaderId: 2, contributionId: 2 }, // Bunker Roy → Barefoot College
    { leaderId: 3, contributionId: 3 }, // Kiran Mazumdar → Biotech
    { leaderId: 4, contributionId: 4 }, // Blake Mycoskie → Toms Shoes
    { leaderId: 5, contributionId: 5 }  // William Drayton → Ashoka
  ];

  const handleLeaderSelect = (leader) => {
    if (gameFinished) return;
    setSelectedLeader(leader);
  };

  const handleContributionSelect = (contribution) => {
    if (gameFinished) return;
    setSelectedContribution(contribution);
  };

  const handleMatch = () => {
    if (!selectedLeader || !selectedContribution || gameFinished) return;

    resetFeedback();

    const newMatch = {
      leaderId: selectedLeader.id,
      contributionId: selectedContribution.id,
      isCorrect: correctMatches.some(
        match => match.leaderId === selectedLeader.id && match.contributionId === selectedContribution.id
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
    if (newMatches.length === leaders.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedLeader(null);
    setSelectedContribution(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedLeader(null);
    setSelectedContribution(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ehe/teens/clean-water-story");
  };

  // Check if a leader is already matched
  const isLeaderMatched = (leaderId) => {
    return matches.some(match => match.leaderId === leaderId);
  };

  // Check if a contribution is already matched
  const isContributionMatched = (contributionId) => {
    return matches.some(match => match.contributionId === contributionId);
  };

  // Get match result for a leader
  const getMatchResult = (leaderId) => {
    const match = matches.find(m => m.leaderId === leaderId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Social Leaders"
      subtitle={gameFinished ? "Game Complete!" : `Match Leaders with Contributions (${matches.length}/${leaders.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="ehe-teen-84"
      gameType="ehe"
      totalLevels={leaders.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ehe/teens"
      maxScore={leaders.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Leaders */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Social Leaders</h3>
              <div className="space-y-4">
                {leaders.map(leader => (
                  <button
                    key={leader.id}
                    onClick={() => handleLeaderSelect(leader)}
                    disabled={isLeaderMatched(leader.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isLeaderMatched(leader.id)
                        ? getMatchResult(leader.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedLeader?.id === leader.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{leader.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{leader.name}</h4>
                        <p className="text-white/80 text-sm">{leader.description}</p>
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
                  {selectedLeader 
                    ? `Selected: ${selectedLeader.name}` 
                    : "Select a Leader"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedLeader || !selectedContribution}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedLeader && selectedContribution
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{leaders.length}</p>
                  <p>Matched: {matches.length}/{leaders.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Contributions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Contributions</h3>
              <div className="space-y-4">
                {contributions.map(contribution => (
                  <button
                    key={contribution.id}
                    onClick={() => handleContributionSelect(contribution)}
                    disabled={isContributionMatched(contribution.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isContributionMatched(contribution.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedContribution?.id === contribution.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{contribution.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{contribution.name}</h4>
                        <p className="text-white/80 text-sm">{contribution.description}</p>
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
                <h3 className="text-2xl font-bold text-white mb-4">Social Impact Expert!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {leaders.length} social leaders with their contributions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Social leaders create innovative solutions to address societal challenges!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {leaders.length} social leaders correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Learn about how these leaders created positive change in their communities!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleSocialLeaders;