import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PlanYourDayPuzzle = () => {
  const navigate = useNavigate();

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Daily activities (left side) - 5 items
  const activities = [
    { id: 1, name: "Study", emoji: "📚",  },
    { id: 2, name: "Play", emoji: "🎮",  },
    { id: 3, name: "Eat", emoji: "🍽️",  },
    { id: 4, name: "Exercise", emoji: "🏃",  },
    { id: 5, name: "Sleep", emoji: "😴",  }
  ];

  // Time slots (right side) - 5 items
  const times = [
    { id: 6, name: "Morning Focus", emoji: "🌅",  },
    { id: 7, name: "Leisure Time", emoji: "🎉",  },
    { id: 8, name: "Meal Break", emoji: "🍎",  },
    { id: 9, name: "Energy Boost", emoji: "💪",  },
    { id: 10, name: "Night Rest", emoji: "🌙",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedTimes = [
    times[2], // Meal Break (id: 8)
    times[4], // Night Rest (id: 10)
    times[1], // Leisure Time (id: 7)
    times[0], // Morning Focus (id: 6)
    times[3]  // Energy Boost (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each activity has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { activityId: 1, timeId: 6 }, // Study → Morning Focus
    { activityId: 2, timeId: 7 }, // Play → Leisure Time
    { activityId: 3, timeId: 8 }, // Eat → Meal Break
    { activityId: 4, timeId: 9 }, // Exercise → Energy Boost
    { activityId: 5, timeId: 10 } // Sleep → Night Rest
  ];

  const handleActivitySelect = (activity) => {
    if (gameFinished) return;
    setSelectedActivity(activity);
  };

  const handleTimeSelect = (time) => {
    if (gameFinished) return;
    setSelectedTime(time);
  };

  const handleMatch = () => {
    if (!selectedActivity || !selectedTime || gameFinished) return;

    resetFeedback();

    const newMatch = {
      activityId: selectedActivity.id,
      timeId: selectedTime.id,
      isCorrect: correctMatches.some(
        match => match.activityId === selectedActivity.id && match.timeId === selectedTime.id
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
    if (newMatches.length === activities.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedActivity(null);
    setSelectedTime(null);
  };

  // Check if an activity is already matched
  const isActivityMatched = (activityId) => {
    return matches.some(match => match.activityId === activityId);
  };

  // Check if a time slot is already matched
  const isTimeMatched = (timeId) => {
    return matches.some(match => match.timeId === timeId);
  };

  // Get match result for an activity
  const getMatchResult = (activityId) => {
    const match = matches.find(m => m.activityId === activityId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  return (
    <GameShell
      title="Plan Your Day Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Activities with Times (${matches.length}/${activities.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="uvls-kids-94"
      nextGamePathProp="/student/uvls/kids/goal-steps"
      nextGameIdProp="uvls-kids-95"
      gameType="uvls"
      totalLevels={activities.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === activities.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
      maxScore={activities.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Daily Activities */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Daily Activities</h3>
              <div className="space-y-4">
                {activities.map(activity => (
                  <button
                    key={activity.id}
                    onClick={() => handleActivitySelect(activity)}
                    disabled={isActivityMatched(activity.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isActivityMatched(activity.id)
                        ? getMatchResult(activity.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedActivity?.id === activity.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{activity.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{activity.name}</h4>
                        
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
                  {selectedActivity 
                    ? `Selected: ${selectedActivity.name}` 
                    : "Select an Activity"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedActivity || !selectedTime}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedActivity && selectedTime
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{activities.length}</p>
                  <p>Matched: {matches.length}/{activities.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Time Slots */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Time Slots</h3>
              <div className="space-y-4">
                {rearrangedTimes.map(time => (
                  <button
                    key={time.id}
                    onClick={() => handleTimeSelect(time)}
                    disabled={isTimeMatched(time.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isTimeMatched(time.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedTime?.id === time.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{time.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{time.name}</h4>
                        <p className="text-white/80 text-sm">{time.description}</p>
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
                  You correctly matched {score} out of {activities.length} daily activities with their ideal times!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Planning your day with the right timing makes activities more effective!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {activities.length} daily activities correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about when each activity works best during the day!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PlanYourDayPuzzle;