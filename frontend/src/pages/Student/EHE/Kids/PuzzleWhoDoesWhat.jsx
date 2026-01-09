import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleWhoDoesWhat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Workers (left side) - 5 items
  const workers = [
    { id: 1, name: "Farmer", emoji: "👨‍🌾" },
    { id: 2, name: "Pilot", emoji: "👨‍✈️" },
    { id: 3, name: "Chef", emoji: "👨‍🍳" },
    { id: 4, name: "Doctor", emoji: "👨‍⚕️" },
    { id: 5, name: "Teacher", emoji: "👩‍🏫" }
  ];

  // Jobs (right side) - 5 items
  const jobs = [
    { id: 5, name: "Students", emoji: "📚" },
    { id: 3, name: "Food", emoji: "🍲" },
    { id: 2, name: "Plane", emoji: "✈️" },
    { id: 4, name: "Hospital", emoji: "🏥" },
    { id: 1, name: "Crops", emoji: "🌾" },
  ];

  // Correct matches
  const correctMatches = [
    { workerId: 1, jobId: 1 }, // Farmer → Crops
    { workerId: 2, jobId: 2 }, // Pilot → Plane
    { workerId: 3, jobId: 3 }, // Chef → Food
    { workerId: 4, jobId: 4 }, // Doctor → Hospital
    { workerId: 5, jobId: 5 }  // Teacher → Students
  ];

  const handleWorkerSelect = (worker) => {
    if (gameFinished) return;
    setSelectedWorker(worker);
  };

  const handleJobSelect = (job) => {
    if (gameFinished) return;
    setSelectedJob(job);
  };

  const handleMatch = () => {
    if (!selectedWorker || !selectedJob || gameFinished) return;

    resetFeedback();

    const newMatch = {
      workerId: selectedWorker.id,
      jobId: selectedJob.id,
      isCorrect: correctMatches.some(
        match => match.workerId === selectedWorker.id && match.jobId === selectedJob.id
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
    if (newMatches.length === workers.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedWorker(null);
    setSelectedJob(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedWorker(null);
    setSelectedJob(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  // Check if a worker is already matched
  const isWorkerMatched = (workerId) => {
    return matches.some(match => match.workerId === workerId);
  };

  // Check if a job is already matched
  const isJobMatched = (jobId) => {
    return matches.some(match => match.jobId === jobId);
  };

  // Get match result for a worker
  const getMatchResult = (workerId) => {
    const match = matches.find(m => m.workerId === workerId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Who Does What?"
      subtitle={gameFinished ? "Game Complete!" : `Match Workers with Jobs (${matches.length}/${workers.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="ehe-kids-4"
      gameType="ehe"
      totalLevels={workers.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ehe/kids"
      maxScore={workers.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/ehe/kids/dream-job-story"
      nextGameIdProp="ehe-kids-5">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Workers */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Workers</h3>
              <div className="space-y-4">
                {workers.map(worker => (
                  <button
                    key={worker.id}
                    onClick={() => handleWorkerSelect(worker)}
                    disabled={isWorkerMatched(worker.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isWorkerMatched(worker.id)
                        ? getMatchResult(worker.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedWorker?.id === worker.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{worker.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{worker.name}</h4>
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
                  {selectedWorker 
                    ? `Selected: ${selectedWorker.name}` 
                    : "Select a Worker"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedWorker || !selectedJob}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedWorker && selectedJob
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{workers.length}</p>
                  <p>Matched: {matches.length}/{workers.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Jobs */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Jobs/Places</h3>
              <div className="space-y-4">
                {jobs.map(job => (
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
                  You correctly matched {score} out of {workers.length} workers with their jobs!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Different workers have different jobs that contribute to our society!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {workers.length} workers correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about what each worker does in their daily job!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleWhoDoesWhat;