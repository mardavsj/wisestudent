import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleVolunteerAreas = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Volunteer Areas (left side) - 5 items
  const areas = [
    { id: 1, name: "Hospital", emoji: "🏥",  },
    { id: 2, name: "School", emoji: "📚",  },
    { id: 3, name: "Nature", emoji: "🌳",  },
    { id: 4, name: "Community Center", emoji: "🏘️",  },
    { id: 5, name: "Animal Shelter", emoji: "🐶",  }
  ];

  // Volunteer Activities (right side) - 5 items
  const activities = [
    { id: 1, name: "Support", emoji: "🤝",  },
    { id: 3, name: "Plant Trees", emoji: "🌱",  },
    { id: 2, name: "Tutor", emoji: "📖",  },
    { id: 5, name: "Care for Animals", emoji: "🐾",  },
    { id: 4, name: "Organize Events", emoji: "🎉",  },
  ];

  // Correct matches
  const correctMatches = [
    { areaId: 1, activityId: 1 }, // Hospital → Support
    { areaId: 2, activityId: 2 }, // School → Tutor
    { areaId: 3, activityId: 3 }, // Nature → Plant Trees
    { areaId: 4, activityId: 4 }, // Community Center → Organize Events
    { areaId: 5, activityId: 5 }  // Animal Shelter → Care for Animals
  ];

  const handleAreaSelect = (area) => {
    if (gameFinished) return;
    setSelectedArea(area);
  };

  const handleActivitySelect = (activity) => {
    if (gameFinished) return;
    setSelectedActivity(activity);
  };

  const handleMatch = () => {
    if (!selectedArea || !selectedActivity || gameFinished) return;

    resetFeedback();

    const newMatch = {
      areaId: selectedArea.id,
      activityId: selectedActivity.id,
      isCorrect: correctMatches.some(
        match => match.areaId === selectedArea.id && match.activityId === selectedActivity.id
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
    if (newMatches.length === areas.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedArea(null);
    setSelectedActivity(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedArea(null);
    setSelectedActivity(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/teens");
  };

  // Check if an area is already matched
  const isAreaMatched = (areaId) => {
    return matches.some(match => match.areaId === areaId);
  };

  // Check if an activity is already matched
  const isActivityMatched = (activityId) => {
    return matches.some(match => match.activityId === activityId);
  };

  // Get match result for an area
  const getMatchResult = (areaId) => {
    const match = matches.find(m => m.areaId === areaId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Volunteer Areas"
      subtitle={gameFinished ? "Game Complete!" : `Match Volunteer Areas with Activities (${matches.length}/${areas.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="civic-responsibility-teens-54"
      gameType="civic-responsibility"
      totalLevels={areas.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/teens"
      maxScore={areas.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Volunteer Areas */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Volunteer Areas</h3>
              <div className="space-y-4">
                {areas.map(area => (
                  <button
                    key={area.id}
                    onClick={() => handleAreaSelect(area)}
                    disabled={isAreaMatched(area.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isAreaMatched(area.id)
                        ? getMatchResult(area.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedArea?.id === area.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{area.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{area.name}</h4>
                        <p className="text-white/80 text-sm">{area.description}</p>
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
                  {selectedArea 
                    ? `Selected: ${selectedArea.name}` 
                    : "Select a Volunteer Area"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedArea || !selectedActivity}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedArea && selectedActivity
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{areas.length}</p>
                  <p>Matched: {matches.length}/{areas.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Volunteer Activities */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Volunteer Activities</h3>
              <div className="space-y-4">
                {activities.map(activity => (
                  <button
                    key={activity.id}
                    onClick={() => handleActivitySelect(activity)}
                    disabled={isActivityMatched(activity.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isActivityMatched(activity.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedActivity?.id === activity.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{activity.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{activity.name}</h4>
                        <p className="text-white/80 text-sm">{activity.description}</p>
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
                <div className="text-5xl mb-4">🧩</div>
                <h3 className="text-2xl font-bold text-white mb-4">Excellent Work!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {areas.length} volunteer areas with their activities!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding where volunteers are needed helps you contribute meaningfully to your community!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {areas.length} volunteer areas correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about what kind of volunteer work would be most appropriate for each area!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleVolunteerAreas;