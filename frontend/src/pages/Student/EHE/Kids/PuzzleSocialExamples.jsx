import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleSocialExamples = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Solutions (left side) - 5 items
  const solutions = [
    { id: 1, name: "Solar Lamps", emoji: "💡" },
    { id: 2, name: "Clean Water", emoji: "💧" },
    { id: 3, name: "Microloans", emoji: "💰" },
    { id: 4, name: "Recycling Programs", emoji: "♻️" },
    { id: 5, name: "Mobile Health Clinics", emoji: "🚑" }
  ];

  // Areas (right side) - 5 items
  const areas = [
    { id: 2, name: "Rural Areas", emoji: "🌾" },
    { id: 1, name: "Villages", emoji: "🏘️" },
    { id: 5, name: "Remote Regions", emoji: "🗺️" },
    { id: 3, name: "Poor Families", emoji: "👨‍👩‍👧‍👦" },
    { id: 4, name: "Urban Communities", emoji: "🏙️" },
  ];

  // Correct matches
  const correctMatches = [
    { solutionId: 1, areaId: 1 }, // Solar Lamps → Villages
    { solutionId: 2, areaId: 2 }, // Clean Water → Rural Areas
    { solutionId: 3, areaId: 3 }, // Microloans → Poor Families
    { solutionId: 4, areaId: 4 }, // Recycling Programs → Urban Communities
    { solutionId: 5, areaId: 5 }  // Mobile Health Clinics → Remote Regions
  ];

  const handleSolutionSelect = (solution) => {
    if (gameFinished) return;
    setSelectedSolution(solution);
  };

  const handleAreaSelect = (area) => {
    if (gameFinished) return;
    setSelectedArea(area);
  };

  const handleMatch = () => {
    if (!selectedSolution || !selectedArea || gameFinished) return;

    resetFeedback();

    const newMatch = {
      solutionId: selectedSolution.id,
      areaId: selectedArea.id,
      isCorrect: correctMatches.some(
        match => match.solutionId === selectedSolution.id && match.areaId === selectedArea.id
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
    if (newMatches.length === solutions.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedSolution(null);
    setSelectedArea(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedSolution(null);
    setSelectedArea(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  // Check if a solution is already matched
  const isSolutionMatched = (solutionId) => {
    return matches.some(match => match.solutionId === solutionId);
  };

  // Check if an area is already matched
  const isAreaMatched = (areaId) => {
    return matches.some(match => match.areaId === areaId);
  };

  // Get match result for a solution
  const getMatchResult = (solutionId) => {
    const match = matches.find(m => m.solutionId === solutionId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Social Examples"
      subtitle={gameFinished ? "Game Complete!" : `Match Solutions with Areas (${matches.length}/${solutions.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="ehe-kids-84"
      gameType="ehe"
      totalLevels={solutions.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ehe/kids"
      maxScore={solutions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/ehe/kids/eco-bag-story"
      nextGameIdProp="ehe-kids-85">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Solutions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Solutions</h3>
              <div className="space-y-4">
                {solutions.map(solution => (
                  <button
                    key={solution.id}
                    onClick={() => handleSolutionSelect(solution)}
                    disabled={isSolutionMatched(solution.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isSolutionMatched(solution.id)
                        ? getMatchResult(solution.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedSolution?.id === solution.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{solution.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{solution.name}</h4>
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
                  {selectedSolution 
                    ? `Selected: ${selectedSolution.name}` 
                    : "Select a Solution"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedSolution || !selectedArea}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedSolution && selectedArea
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{solutions.length}</p>
                  <p>Matched: {matches.length}/{solutions.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Areas */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Areas</h3>
              <div className="space-y-4">
                {areas.map(area => (
                  <button
                    key={area.id}
                    onClick={() => handleAreaSelect(area)}
                    disabled={isAreaMatched(area.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isAreaMatched(area.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedArea?.id === area.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{area.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{area.name}</h4>
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
                <h3 className="text-2xl font-bold text-white mb-4">Social Impact Champion!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {solutions.length} social solutions with their areas!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Innovative solutions can address social challenges in different communities!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {solutions.length} social solutions correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about what challenges each community faces and how solutions can help!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleSocialExamples;