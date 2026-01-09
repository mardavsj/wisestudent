import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchInnovators = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedInnovator, setSelectedInnovator] = useState(null);
  const [selectedInvention, setSelectedInvention] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Innovators (left side) - 5 items
  const innovators = [
    { id: 1, name: "Edison", emoji: "💡" },
    { id: 2, name: "Wright Brothers", emoji: "✈️" },
    { id: 3, name: "Jobs", emoji: "📱" },
    { id: 4, name: "Tesla", emoji: "⚡" },
    { id: 5, name: "Curie", emoji: "⚛️" }
  ];

  // Inventions (right side) - 5 items
  const inventions = [
    { id: 5, name: "Radium", emoji: "🔬" },
    { id: 3, name: "iPhone", emoji: "📲" },
    { id: 2, name: "Plane", emoji: "🛩️" },
    { id: 1, name: "Bulb", emoji: "🔦" },
    { id: 4, name: "AC Motor", emoji: "⚙️" },
  ];

  // Correct matches
  const correctMatches = [
    { innovatorId: 1, inventionId: 1 }, // Edison → Bulb
    { innovatorId: 2, inventionId: 2 }, // Wright Brothers → Plane
    { innovatorId: 3, inventionId: 3 }, // Jobs → iPhone
    { innovatorId: 4, inventionId: 4 }, // Tesla → AC Motor
    { innovatorId: 5, inventionId: 5 }  // Curie → Radium
  ];

  const handleInnovatorSelect = (innovator) => {
    if (gameFinished) return;
    setSelectedInnovator(innovator);
  };

  const handleInventionSelect = (invention) => {
    if (gameFinished) return;
    setSelectedInvention(invention);
  };

  const handleMatch = () => {
    if (!selectedInnovator || !selectedInvention || gameFinished) return;

    resetFeedback();

    const newMatch = {
      innovatorId: selectedInnovator.id,
      inventionId: selectedInvention.id,
      isCorrect: correctMatches.some(
        match => match.innovatorId === selectedInnovator.id && match.inventionId === selectedInvention.id
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
    if (newMatches.length === innovators.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedInnovator(null);
    setSelectedInvention(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedInnovator(null);
    setSelectedInvention(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  // Check if an innovator is already matched
  const isInnovatorMatched = (innovatorId) => {
    return matches.some(match => match.innovatorId === innovatorId);
  };

  // Check if an invention is already matched
  const isInventionMatched = (inventionId) => {
    return matches.some(match => match.inventionId === inventionId);
  };

  // Get match result for an innovator
  const getMatchResult = (innovatorId) => {
    const match = matches.find(m => m.innovatorId === innovatorId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Match Innovators"
      subtitle={gameFinished ? "Game Complete!" : `Match Innovators with Inventions (${matches.length}/${innovators.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="ehe-kids-34"
      gameType="ehe"
      totalLevels={innovators.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ehe/kids"
      maxScore={innovators.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/ehe/kids/school-project-story"
      nextGameIdProp="ehe-kids-35">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Innovators */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Innovators</h3>
              <div className="space-y-4">
                {innovators.map(innovator => (
                  <button
                    key={innovator.id}
                    onClick={() => handleInnovatorSelect(innovator)}
                    disabled={isInnovatorMatched(innovator.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isInnovatorMatched(innovator.id)
                        ? getMatchResult(innovator.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedInnovator?.id === innovator.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{innovator.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{innovator.name}</h4>
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
                  {selectedInnovator 
                    ? `Selected: ${selectedInnovator.name}` 
                    : "Select an Innovator"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedInnovator || !selectedInvention}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedInnovator && selectedInvention
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{innovators.length}</p>
                  <p>Matched: {matches.length}/{innovators.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Inventions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Inventions</h3>
              <div className="space-y-4">
                {inventions.map(invention => (
                  <button
                    key={invention.id}
                    onClick={() => handleInventionSelect(invention)}
                    disabled={isInventionMatched(invention.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isInventionMatched(invention.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedInvention?.id === invention.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{invention.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{invention.name}</h4>
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
                  You correctly matched {score} out of {innovators.length} innovators with their inventions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Innovation drives human progress - from light bulbs to smartphones!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {innovators.length} innovators correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about which inventor created which groundbreaking invention!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleMatchInnovators;