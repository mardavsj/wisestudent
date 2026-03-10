import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getFinanceKidsGames } from "../../../../pages/Games/GameCategories/Finance/kidGamesData";

const PuzzleOfJobs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  
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

  const gameContent = t("financial-literacy.kids.puzzle-of-jobs", { returnObjects: true });
  const jobs = Array.isArray(gameContent?.jobs) ? gameContent.jobs : [];
  const provided = Array.isArray(gameContent?.provided) ? gameContent.provided : [];
  const correctMatches = Array.isArray(gameContent?.correctMatches) ? gameContent.correctMatches : [];
  
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedProvided, setSelectedProvided] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

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
      title={gameContent?.title || "Puzzle of Jobs"}
      subtitle={gameFinished ? gameContent?.subtitleComplete : t("financial-literacy.kids.puzzle-of-jobs.subtitleProgress", { matched: matches.length, total: jobs.length })}
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
              <h3 className="text-xl font-bold text-white mb-4 text-center">{gameContent?.jobsTitle}</h3>
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
                    ? t("financial-literacy.kids.puzzle-of-jobs.selectedLabel", { name: selectedJob.name })
                    : gameContent?.selectJob}
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
                  {gameContent?.matchButton}
                </button>
                <div className="mt-4 text-white/80">
                  <p>{gameContent?.scoreLabel} {score}/{jobs.length}</p>
                  <p>{gameContent?.matchedLabel} {matches.length}/{jobs.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - What They Provide */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">{gameContent?.providedTitle}</h3>
              <div className="space-y-4">
                {provided.map(providedItem => (
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
                <div className="text-5xl mb-4">{gameContent?.resultGreatEmoji}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{gameContent?.resultGreatTitle}</h3>
                <p className="text-white/90 text-lg mb-4">{t("financial-literacy.kids.puzzle-of-jobs.resultGreatDescription", { score, total: jobs.length })}</p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} {gameContent?.coinsLabel}</span>
                </div>
                <p className="text-white/80">{gameContent?.resultLesson}</p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">{gameContent?.resultKeepEmoji}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{gameContent?.resultKeepTitle}</h3>
                <p className="text-white/90 text-lg mb-4">{t("financial-literacy.kids.puzzle-of-jobs.resultKeepDescription", { score, total: jobs.length })}</p>
                <p className="text-white/80 text-sm">{gameContent?.resultTip}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleOfJobs;