import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MasculinityMythsPuzzle = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedMyth, setSelectedMyth] = useState(null);
  const [selectedReality, setSelectedReality] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  // Masculinity Myths (left side) - 5 unique items
const myths = [
  { id: 1, name: "Strength Means Silence", emoji: "🗿" },
  { id: 2, name: "Winning Is Everything", emoji: "🏆" },
  { id: 3, name: "Men Must Always Lead", emoji: "🧭" },
  { id: 4, name: "Anger Shows Power", emoji: "🔥" },
  { id: 5, name: "Care Is a Weakness", emoji: "🧊" }
];

// Reality Checks (right side) - 5 meaningful counters
const realities = [
  { id: 2, name: "Growth Matters More Than Victory", emoji: "🌱" },
  { id: 3, name: "Leadership Can Be Shared", emoji: "🤝" },
  { id: 5, name: "Care Creates Connection", emoji: "💞" },
  { id: 1, name: "Speaking Up Builds Strength", emoji: "🎤" },
  { id: 4, name: "Calm Control Is Real Power", emoji: "🧘" },
];

// Correct matches
const correctMatches = [
  { mythId: 1, realityId: 1 }, // Strength Means Silence → Speaking Up Builds Strength
  { mythId: 2, realityId: 2 }, // Winning Is Everything → Growth Matters More Than Victory
  { mythId: 3, realityId: 3 }, // Men Must Always Lead → Leadership Can Be Shared
  { mythId: 4, realityId: 4 }, // Anger Shows Power → Calm Control Is Real Power
  { mythId: 5, realityId: 5 }  // Care Is a Weakness → Care Creates Connection
];


  const handleMythSelect = (myth) => {
    if (gameFinished) return;
    setSelectedMyth(myth);
  };

  const handleRealitySelect = (reality) => {
    if (gameFinished) return;
    setSelectedReality(reality);
  };

  const handleMatch = () => {
    if (!selectedMyth || !selectedReality || gameFinished) return;

    resetFeedback();

    const newMatch = {
      mythId: selectedMyth.id,
      realityId: selectedReality.id,
      isCorrect: correctMatches.some(
        match => match.mythId === selectedMyth.id && match.realityId === selectedReality.id
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
    };

    // Check if all items are matched
    if (newMatches.length === myths.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedMyth(null);
    setSelectedReality(null);
  };

  // Check if a myth is already matched
  const isMythMatched = (mythId) => {
    return matches.some(match => match.mythId === mythId);
  };

  // Check if a reality is already matched
  const isRealityMatched = (realityId) => {
    return matches.some(match => match.realityId === realityId);
  };

  // Get match result for a myth
  const getMatchResult = (mythId) => {
    const match = matches.find(m => m.mythId === mythId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/violence-story");
  };

  return (
    <GameShell
      title="Masculinity Myths Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Myths with Realities (${matches.length}/${myths.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-64"
      gameType="health-male"
      totalLevels={myths.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === myths.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/health-male/teens"
      maxScore={myths.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Masculinity Myths */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Masculinity Myths</h3>
              <div className="space-y-4">
                {myths.map(myth => (
                  <button
                    key={myth.id}
                    onClick={() => handleMythSelect(myth)}
                    disabled={isMythMatched(myth.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isMythMatched(myth.id)
                        ? getMatchResult(myth.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedMyth?.id === myth.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{myth.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{myth.name}</h4>
                        <p className="text-white/80 text-sm">{myth.description}</p>
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
                  {selectedMyth 
                    ? `Selected: ${selectedMyth.name}` 
                    : "Select a Myth"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedMyth || !selectedReality}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedMyth && selectedReality
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{myths.length}</p>
                  <p>Matched: {matches.length}/{myths.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Reality Checks */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Reality Checks</h3>
              <div className="space-y-4">
                {realities.map(reality => (
                  <button
                    key={reality.id}
                    onClick={() => handleRealitySelect(reality)}
                    disabled={isRealityMatched(reality.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isRealityMatched(reality.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedReality?.id === reality.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{reality.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{reality.name}</h4>
                        <p className="text-white/80 text-sm">{reality.description}</p>
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
                  You correctly matched {score} out of {myths.length} masculinity myths with their realities!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Healthy masculinity involves respect, emotional honesty, and peaceful conflict resolution!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {myths.length} myths correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about what healthy behaviors really look like!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default MasculinityMythsPuzzle;
