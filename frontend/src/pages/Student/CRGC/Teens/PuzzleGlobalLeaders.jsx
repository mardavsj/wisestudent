import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleGlobalLeaders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [selectedFocus, setSelectedFocus] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Global Organizations (left side) - 5 items
  const organizations = [
    { id: 1, name: "UNICEF", emoji: "👧",  },
    { id: 2, name: "WHO", emoji: "🩺",  },
    { id: 3, name: "UNESCO", emoji: "📚",  },
    { id: 4, name: "UNHCR", emoji: "🏡",  },
    { id: 5, name: "FAO", emoji: "🌾",  }
  ];

  // Focus Areas (right side) - 5 items
  const focusAreas = [
    { id: 2, name: "Health", emoji: "💊",  },
    { id: 4, name: "Refugees", emoji: "🏠",  },
    { id: 3, name: "Education", emoji: "🎓",  },
    { id: 5, name: "Food", emoji: "🍎",  },
    { id: 1, name: "Children", emoji: "🧸",  },
  ];

  // Correct matches
  const correctMatches = [
    { orgId: 1, focusId: 1 }, // UNICEF → Children
    { orgId: 2, focusId: 2 }, // WHO → Health
    { orgId: 3, focusId: 3 }, // UNESCO → Education
    { orgId: 4, focusId: 4 }, // UNHCR → Refugees
    { orgId: 5, focusId: 5 }  // FAO → Food
  ];

  const handleOrgSelect = (org) => {
    if (gameFinished) return;
    setSelectedOrg(org);
  };

  const handleFocusSelect = (focus) => {
    if (gameFinished) return;
    setSelectedFocus(focus);
  };

  const handleMatch = () => {
    if (!selectedOrg || !selectedFocus || gameFinished) return;

    resetFeedback();

    const newMatch = {
      orgId: selectedOrg.id,
      focusId: selectedFocus.id,
      isCorrect: correctMatches.some(
        match => match.orgId === selectedOrg.id && match.focusId === selectedFocus.id
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
    if (newMatches.length === organizations.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedOrg(null);
    setSelectedFocus(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedOrg(null);
    setSelectedFocus(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/teens");
  };

  // Check if an organization is already matched
  const isOrgMatched = (orgId) => {
    return matches.some(match => match.orgId === orgId);
  };

  // Check if a focus area is already matched
  const isFocusMatched = (focusId) => {
    return matches.some(match => match.focusId === focusId);
  };

  // Get match result for an organization
  const getMatchResult = (orgId) => {
    const match = matches.find(m => m.orgId === orgId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Global Leaders"
      subtitle={gameFinished ? "Game Complete!" : `Match Global Organizations with Focus Areas (${matches.length}/${organizations.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="civic-responsibility-teens-84"
      gameType="civic-responsibility"
      totalLevels={organizations.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/teens"
      maxScore={organizations.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Global Organizations */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Global Organizations</h3>
              <div className="space-y-4">
                {organizations.map(org => (
                  <button
                    key={org.id}
                    onClick={() => handleOrgSelect(org)}
                    disabled={isOrgMatched(org.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isOrgMatched(org.id)
                        ? getMatchResult(org.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedOrg?.id === org.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{org.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{org.name}</h4>
                        <p className="text-white/80 text-sm">{org.description}</p>
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
                  {selectedOrg 
                    ? `Selected: ${selectedOrg.name}` 
                    : "Select a Global Organization"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedOrg || !selectedFocus}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedOrg && selectedFocus
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{organizations.length}</p>
                  <p>Matched: {matches.length}/{organizations.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Focus Areas */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Focus Areas</h3>
              <div className="space-y-4">
                {focusAreas.map(focus => (
                  <button
                    key={focus.id}
                    onClick={() => handleFocusSelect(focus)}
                    disabled={isFocusMatched(focus.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isFocusMatched(focus.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedFocus?.id === focus.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{focus.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{focus.name}</h4>
                        <p className="text-white/80 text-sm">{focus.description}</p>
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
                <h3 className="text-2xl font-bold text-white mb-4">Outstanding Achievement!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {organizations.length} global organizations with their focus areas!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding global organizations helps you appreciate international cooperation for worldwide challenges!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Exploring!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {organizations.length} global organizations correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about what each global organization is primarily known for and what issues they address!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleGlobalLeaders;