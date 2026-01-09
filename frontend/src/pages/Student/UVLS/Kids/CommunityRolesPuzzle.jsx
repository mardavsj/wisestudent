import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CommunityRolesPuzzle = () => {
  const navigate = useNavigate();

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Community helpers (left side) - 5 items
  const helpers = [
    { id: 1, name: "Doctor", emoji: "👨‍⚕️",  },
    { id: 2, name: "Teacher", emoji: "👩‍🏫",  },
    { id: 3, name: "Firefighter", emoji: "👨‍🚒",  },
    { id: 4, name: "Farmer", emoji: "👨‍🌾",  },
    { id: 5, name: "Librarian", emoji: "👩‍💼",  }
  ];

  // Community jobs (right side) - 5 items
  const jobs = [
    { id: 6, name: "Heal Sick", emoji: "🩺",  },
    { id: 7, name: "Teach Kids", emoji: "📚",  },
    { id: 8, name: "Fight Fires", emoji: "🔥",  },
    { id: 9, name: "Grow Food", emoji: "🌽",  },
    { id: 10, name: "Manage Books", emoji: "📖",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedJobs = [
    jobs[2], // Fight Fires (id: 8)
    jobs[4], // Manage Books (id: 10)
    jobs[1], // Teach Kids (id: 7)
    jobs[0], // Heal Sick (id: 6)
    jobs[3]  // Grow Food (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each helper has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { helperId: 1, jobId: 6 }, // Doctor → Heal Sick
    { helperId: 2, jobId: 7 }, // Teacher → Teach Kids
    { helperId: 3, jobId: 8 }, // Firefighter → Fight Fires
    { helperId: 4, jobId: 9 }, // Farmer → Grow Food
    { helperId: 5, jobId: 10 } // Librarian → Manage Books
  ];

  const handleHelperSelect = (helper) => {
    if (gameFinished) return;
    setSelectedHelper(helper);
  };

  const handleJobSelect = (job) => {
    if (gameFinished) return;
    setSelectedJob(job);
  };

  const handleMatch = () => {
    if (!selectedHelper || !selectedJob || gameFinished) return;

    resetFeedback();

    const newMatch = {
      helperId: selectedHelper.id,
      jobId: selectedJob.id,
      isCorrect: correctMatches.some(
        match => match.helperId === selectedHelper.id && match.jobId === selectedJob.id
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
    setSelectedJob(null);
  };

  // Check if a helper is already matched
  const isHelperMatched = (helperId) => {
    return matches.some(match => match.helperId === helperId);
  };

  // Check if a job is already matched
  const isJobMatched = (jobId) => {
    return matches.some(match => match.jobId === jobId);
  };

  // Get match result for a helper
  const getMatchResult = (helperId) => {
    const match = matches.find(m => m.helperId === helperId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  return (
    <GameShell
      title="Community Roles Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Helpers with Jobs (${matches.length}/${helpers.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="uvls-kids-84"
      nextGamePathProp="/student/uvls/kids/fundraiser-story"
      nextGameIdProp="uvls-kids-85"
      gameType="uvls"
      totalLevels={helpers.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === helpers.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
      maxScore={helpers.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Community Helpers */}
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
                  disabled={!selectedHelper || !selectedJob}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedHelper && selectedJob
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

            {/* Right column - Community Jobs */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Community Jobs</h3>
              <div className="space-y-4">
                {rearrangedJobs.map(job => (
                  <button
                    key={job.id}
                    onClick={() => handleJobSelect(job)}
                    disabled={isJobMatched(job.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isJobMatched(job.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedJob?.id === job.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{job.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{job.name}</h4>
                        <p className="text-white/80 text-sm">{job.description}</p>
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
                  You correctly matched {score} out of {helpers.length} community helpers with their jobs!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding community roles helps us appreciate how everyone contributes!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {helpers.length} community helpers correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about what each community helper actually does!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CommunityRolesPuzzle;