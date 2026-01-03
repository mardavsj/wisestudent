import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getFinanceKidsGames } from "../../../../pages/Games/GameCategories/Finance/kidGamesData";

const PuzzleOfJobs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getFinanceKidsGames({});
      const currentGame = games.find(g => g.id === "finance-kids-74");
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
  }, [location.state]);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedProvided, setSelectedProvided] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Jobs (left side) - 5 items
  const jobs = [
    { id: 1, name: "Farmer", emoji: "🌾",  },
    { id: 2, name: "Teacher", emoji: "📚",  },
    { id: 3, name: "Doctor", emoji: "🩺",  },
    { id: 4, name: "Chef", emoji: "👩‍🍳",  },
    { id: 5, name: "Engineer", emoji: "🔧",  }
  ];

  // What they provide (right side) - 5 items
  const provided = [
    { id: 6, name: "Food", emoji: "🍎",  },
    { id: 7, name: "Education", emoji: "📖",  },
    { id: 8, name: "Healthcare", emoji: "💊",  },
    { id: 9, name: "Meals", emoji: "🍽️",  },
    { id: 10, name: "Infrastructure", emoji: "🏗️",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedProvided = [
    provided[2], // Healthcare (id: 8)
    provided[4], // Infrastructure (id: 10)
    provided[1], // Education (id: 7)
    provided[0], // Food (id: 6)
    provided[3]  // Meals (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each job has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { jobId: 1, providedId: 6 }, // Farmer → Food
    { jobId: 2, providedId: 7 }, // Teacher → Education
    { jobId: 3, providedId: 8 }, // Doctor → Healthcare
    { jobId: 4, providedId: 9 }, // Chef → Meals
    { jobId: 5, providedId: 10 } // Engineer → Infrastructure
  ];

  const handleJobSelect = (job) => {
    if (gameFinished) return;
    setSelectedJob(job);
  };

  const handleProvidedSelect = (providedItem) => {
    if (gameFinished) return;
    setSelectedProvided(providedItem);
  };

  const handleMatch = () => {
    if (!selectedJob || !selectedProvided || gameFinished) return;

    resetFeedback();

    const newMatch = {
      jobId: selectedJob.id,
      providedId: selectedProvided.id,
      isCorrect: correctMatches.some(
        match => match.jobId === selectedJob.id && match.providedId === selectedProvided.id
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
    if (newMatches.length === jobs.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedJob(null);
    setSelectedProvided(null);
  };

  // Check if a job is already matched
  const isJobMatched = (jobId) => {
    return matches.some(match => match.jobId === jobId);
  };

  // Check if a provided item is already matched
  const isProvidedMatched = (providedId) => {
    return matches.some(match => match.providedId === providedId);
  };

  // Get match result for a job
  const getMatchResult = (jobId) => {
    const match = matches.find(m => m.jobId === jobId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle of Jobs"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Jobs with What They Provide (${matches.length}/${jobs.length} matched)`}
      showGameOver={gameFinished}
      score={score}
      gameId="finance-kids-74"
      gameType="finance"
      totalLevels={jobs.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === jobs.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/financial-literacy/kids"
      maxScore={jobs.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Jobs */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Jobs</h3>
              <div className="space-y-4">
                {jobs.map(job => (
                  <button
                    key={job.id}
                    onClick={() => handleJobSelect(job)}
                    disabled={isJobMatched(job.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isJobMatched(job.id)
                        ? getMatchResult(job.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedJob?.id === job.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{job.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{job.name}</h4>
                        
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
                  {selectedJob 
                    ? `Selected: ${selectedJob.name}` 
                    : "Select a Job"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedJob || !selectedProvided}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedJob && selectedProvided
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{jobs.length}</p>
                  <p>Matched: {matches.length}/{jobs.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - What They Provide */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">What They Provide</h3>
              <div className="space-y-4">
                {rearrangedProvided.map(providedItem => (
                  <button
                    key={providedItem.id}
                    onClick={() => handleProvidedSelect(providedItem)}
                    disabled={isProvidedMatched(providedItem.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isProvidedMatched(providedItem.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedProvided?.id === providedItem.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{providedItem.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{providedItem.name}</h4>
                        <p className="text-white/80 text-sm">{providedItem.description}</p>
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
                  You correctly matched {score} out of {jobs.length} jobs with what they provide!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Every job provides value by meeting people's needs!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {jobs.length} jobs correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about what each job creates or provides to society!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleOfJobs;