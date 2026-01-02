import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleCareerPaths = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [selectedPathway, setSelectedPathway] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Careers (left side) - 5 items
  const careers = [
    { id: 1, name: "Engineer", emoji: "⚙️",  },
    { id: 2, name: "Lawyer", emoji: "👨‍⚖️",  },
    { id: 3, name: "Artist", emoji: "🎨",  },
    { id: 4, name: "Doctor", emoji: "👨‍⚕️",  },
    { id: 5, name: "Chef", emoji: "👨‍🍳",  }
  ];

  // Educational Pathways (right side) - 5 items
  const pathways = [
    { id: 2, name: "Law College", emoji: "🏛️",  },
    { id: 1, name: "Tech College", emoji: "💻",  },
    { id: 4, name: "Medical College", emoji: "🏥",  },
    { id: 3, name: "Fine Arts College", emoji: "🖌️",  },
    { id: 5, name: "Culinary School", emoji: "🍲",  }
  ];

  // Correct matches
  const correctMatches = [
    { careerId: 1, pathwayId: 1 }, // Engineer → Tech College
    { careerId: 2, pathwayId: 2 }, // Lawyer → Law College
    { careerId: 3, pathwayId: 3 }, // Artist → Fine Arts College
    { careerId: 4, pathwayId: 4 }, // Doctor → Medical College
    { careerId: 5, pathwayId: 5 }  // Chef → Culinary School
  ];

  const handleCareerSelect = (career) => {
    if (gameFinished) return;
    setSelectedCareer(career);
  };

  const handlePathwaySelect = (pathway) => {
    if (gameFinished) return;
    setSelectedPathway(pathway);
  };

  const handleMatch = () => {
    if (!selectedCareer || !selectedPathway || gameFinished) return;

    resetFeedback();

    const newMatch = {
      careerId: selectedCareer.id,
      pathwayId: selectedPathway.id,
      isCorrect: correctMatches.some(
        match => match.careerId === selectedCareer.id && match.pathwayId === selectedPathway.id
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
    if (newMatches.length === careers.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedCareer(null);
    setSelectedPathway(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedCareer(null);
    setSelectedPathway(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ehe/teens/abroad-study-story");
  };

  // Check if a career is already matched
  const isCareerMatched = (careerId) => {
    return matches.some(match => match.careerId === careerId);
  };

  // Check if a pathway is already matched
  const isPathwayMatched = (pathwayId) => {
    return matches.some(match => match.pathwayId === pathwayId);
  };

  // Get match result for a career
  const getMatchResult = (careerId) => {
    const match = matches.find(m => m.careerId === careerId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Career Paths"
      subtitle={gameFinished ? "Game Complete!" : `Match Careers with Pathways (${matches.length}/${careers.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="ehe-teen-64"
      gameType="ehe"
      totalLevels={careers.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ehe/teens"
      maxScore={careers.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Careers */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Careers</h3>
              <div className="space-y-4">
                {careers.map(career => (
                  <button
                    key={career.id}
                    onClick={() => handleCareerSelect(career)}
                    disabled={isCareerMatched(career.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isCareerMatched(career.id)
                        ? getMatchResult(career.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedCareer?.id === career.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{career.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{career.name}</h4>
                        <p className="text-white/80 text-sm">{career.description}</p>
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
                  {selectedCareer 
                    ? `Selected: ${selectedCareer.name}` 
                    : "Select a Career"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedCareer || !selectedPathway}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedCareer && selectedPathway
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{careers.length}</p>
                  <p>Matched: {matches.length}/{careers.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Pathways */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Educational Pathways</h3>
              <div className="space-y-4">
                {pathways.map(pathway => (
                  <button
                    key={pathway.id}
                    onClick={() => handlePathwaySelect(pathway)}
                    disabled={isPathwayMatched(pathway.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isPathwayMatched(pathway.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedPathway?.id === pathway.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{pathway.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{pathway.name}</h4>
                        <p className="text-white/80 text-sm">{pathway.description}</p>
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
                <h3 className="text-2xl font-bold text-white mb-4">Career Path Expert!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {careers.length} careers with their educational pathways!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Choosing the right educational path is essential for career success!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {careers.length} careers correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about the skills each career requires and the education needed to develop them!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleCareerPaths;