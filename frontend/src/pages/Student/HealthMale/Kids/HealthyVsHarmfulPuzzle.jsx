import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HealthyVsHarmfulPuzzle = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-84";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedHealthy, setSelectedHealthy] = useState(null);
  const [selectedHarmful, setSelectedHarmful] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Healthy items (left side) - 5 items
  const healthyItems = [
    { id: 1, name: "Fresh Water", emoji: "💧" },
    { id: 2, name: "Fruits", emoji: "🍎" },
    { id: 3, name: "Exercise", emoji: "🏃" },
    { id: 4, name: "Vegetables", emoji: "🥦" },
    { id: 5, name: "Sleep Early", emoji: "😴" }
  ];

  // Harmful items (right side) - 5 items
  const harmfulItems = [
    { id: 5, name: "Staying Up Late", emoji: "🌙" },
    { id: 1, name: "Soda", emoji: "🥤" },
    { id: 2, name: "Junk Food", emoji: "🍔" },
    { id: 3, name: "Sitting All Day", emoji: "🛋️" },
    { id: 4, name: "Skipping Vegetables", emoji: "❌" },
  ];

  // Correct matches - creating logical pairings
  const correctMatches = [
    { healthyId: 1, harmfulId: 1 }, // Fresh Water → Soda (healthy drink vs unhealthy drink)
    { healthyId: 2, harmfulId: 2 }, // Fruits → Junk Food (healthy food vs unhealthy food)
    { healthyId: 3, harmfulId: 3 }, // Exercise → Sitting All Day (active vs inactive)
    { healthyId: 4, harmfulId: 4 }, // Vegetables → Skipping Vegetables (eating vs not eating healthy food)
    { healthyId: 5, harmfulId: 5 }  // Sleep Early → Staying Up Late (healthy vs unhealthy sleep)
  ];

  const handleHealthySelect = (healthy) => {
    if (gameFinished) return;
    setSelectedHealthy(healthy);
  };

  const handleHarmfulSelect = (harmful) => {
    if (gameFinished) return;
    setSelectedHarmful(harmful);
  };

  const handleMatch = () => {
    if (!selectedHealthy || !selectedHarmful || gameFinished) return;

    resetFeedback();

    const newMatch = {
      healthyId: selectedHealthy.id,
      harmfulId: selectedHarmful.id,
      isCorrect: correctMatches.some(
        match => match.healthyId === selectedHealthy.id && match.harmfulId === selectedHarmful.id
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
    if (newMatches.length === healthyItems.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedHealthy(null);
    setSelectedHarmful(null);
  };

  // Check if a healthy item is already matched
  const isHealthyMatched = (healthyId) => {
    return matches.some(match => match.healthyId === healthyId);
  };

  // Check if a harmful item is already matched
  const isHarmfulMatched = (harmfulId) => {
    return matches.some(match => match.harmfulId === harmfulId);
  };

  // Get match result for a healthy item
  const getMatchResult = (healthyId) => {
    const match = matches.find(m => m.healthyId === healthyId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/alcohol-story");
  };

  return (
    <GameShell
      title="Healthy vs Harmful"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Healthy with Harmful (${matches.length}/${healthyItems.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/alcohol-story"
      nextGameIdProp="health-male-kids-85"
      gameType="health-male"
      totalLevels={healthyItems.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === healthyItems.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/health-male/kids"
      maxScore={healthyItems.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Healthy Items */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Healthy Choices</h3>
              <div className="space-y-4">
                {healthyItems.map(healthy => (
                  <button
                    key={healthy.id}
                    onClick={() => handleHealthySelect(healthy)}
                    disabled={isHealthyMatched(healthy.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isHealthyMatched(healthy.id)
                        ? getMatchResult(healthy.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedHealthy?.id === healthy.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{healthy.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{healthy.name}</h4>
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
                  {selectedHealthy 
                    ? `Selected: ${selectedHealthy.name}` 
                    : "Select a Healthy Choice"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedHealthy || !selectedHarmful}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedHealthy && selectedHarmful
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{healthyItems.length}</p>
                  <p>Matched: {matches.length}/{healthyItems.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Harmful Items */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Harmful Choices</h3>
              <div className="space-y-4">
                {harmfulItems.map(harmful => (
                  <button
                    key={harmful.id}
                    onClick={() => handleHarmfulSelect(harmful)}
                    disabled={isHarmfulMatched(harmful.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isHarmfulMatched(harmful.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedHarmful?.id === harmful.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{harmful.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{harmful.name}</h4>
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
                  You correctly matched {score} out of {healthyItems.length} healthy choices with harmful ones!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Making healthy choices and avoiding harmful ones keeps your body and mind strong!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {healthyItems.length} choices correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about what each choice does to your body!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HealthyVsHarmfulPuzzle;

