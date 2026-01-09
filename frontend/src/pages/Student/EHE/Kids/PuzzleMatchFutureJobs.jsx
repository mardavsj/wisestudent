import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchFutureJobs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Jobs (left side) - 5 items
  const jobs = [
    { id: 1, name: "Game Designer", emoji: "🎮" },
    { id: 2, name: "Drone Pilot", emoji: "🚁" },
    { id: 3, name: "Data Scientist", emoji: "📊" },
    { id: 4, name: "AI Engineer", emoji: "🤖" },
    { id: 5, name: "Renewable Energy Technician", emoji: "⚡" }
  ];

  // Fields (right side) - 5 items
  const fields = [
    { id: 4, name: "Artificial Intelligence", emoji: "🧠" },
    { id: 3, name: "Numbers", emoji: "🔢" },
    { id: 2, name: "Flying Robots", emoji: "🤖" },
    { id: 5, name: "Green Energy", emoji: "🌿" },
    { id: 1, name: "Games", emoji: "🕹️" },
  ];

  // Correct matches
  const correctMatches = [
    { jobId: 1, fieldId: 1 }, // Game Designer → Games
    { jobId: 2, fieldId: 2 }, // Drone Pilot → Flying Robots
    { jobId: 3, fieldId: 3 }, // Data Scientist → Numbers
    { jobId: 4, fieldId: 4 }, // AI Engineer → Artificial Intelligence
    { jobId: 5, fieldId: 5 }  // Renewable Energy Technician → Green Energy
  ];

  const handleJobSelect = (job) => {
    if (gameFinished) return;
    setSelectedJob(job);
  };

  const handleFieldSelect = (field) => {
    if (gameFinished) return;
    setSelectedField(field);
  };

  const handleMatch = () => {
    if (!selectedJob || !selectedField || gameFinished) return;

    resetFeedback();

    const newMatch = {
      jobId: selectedJob.id,
      fieldId: selectedField.id,
      isCorrect: correctMatches.some(
        match => match.jobId === selectedJob.id && match.fieldId === selectedField.id
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
    setSelectedField(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedJob(null);
    setSelectedField(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  // Check if a job is already matched
  const isJobMatched = (jobId) => {
    return matches.some(match => match.jobId === jobId);
  };

  // Check if a field is already matched
  const isFieldMatched = (fieldId) => {
    return matches.some(match => match.fieldId === fieldId);
  };

  // Get match result for a job
  const getMatchResult = (jobId) => {
    const match = matches.find(m => m.jobId === jobId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Match Future Jobs"
      subtitle={gameFinished ? "Game Complete!" : `Match Jobs with Fields (${matches.length}/${jobs.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="ehe-kids-74"
      gameType="ehe"
      totalLevels={jobs.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ehe/kids"
      maxScore={jobs.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/ehe/kids/e-sports-story"
      nextGameIdProp="ehe-kids-75">
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
                  disabled={!selectedJob || !selectedField}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedJob && selectedField
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

            {/* Right column - Fields */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Fields</h3>
              <div className="space-y-4">
                {fields.map(field => (
                  <button
                    key={field.id}
                    onClick={() => handleFieldSelect(field)}
                    disabled={isFieldMatched(field.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isFieldMatched(field.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedField?.id === field.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{field.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{field.name}</h4>
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
                <h3 className="text-2xl font-bold text-white mb-4">Future Career Expert!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {jobs.length} future jobs with their fields!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Emerging technologies are creating exciting new career opportunities!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Exploring!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {jobs.length} future jobs correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about what skills and knowledge each job would require!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleMatchFutureJobs;