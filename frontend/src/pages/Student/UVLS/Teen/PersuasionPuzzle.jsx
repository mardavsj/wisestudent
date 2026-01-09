import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PersuasionPuzzle = () => {
  const navigate = useNavigate();

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Persuasion requests (left side) - 5 items with hints
  const requests = [
    { id: 1, name: "Later Curfew", emoji: "⏰",  },
    { id: 2, name: "Assignment Extension", emoji: "📝",  },
    { id: 3, name: "Group Project Idea", emoji: "💡",  },
    { id: 4, name: "School Event", emoji: "🎉",  },
    { id: 5, name: "Chore Reduction", emoji: "🧹",  }
  ];

  // Persuasion techniques (right side) - 5 items with descriptions
  const techniques = [
    { id: 6, name: "Show Responsibility", emoji: "📊",  },
    { id: 7, name: "Explain Schedule", emoji: "📅",  },
    { id: 8, name: "List Benefits", emoji: "✅",  },
    { id: 9, name: "Survey Support", emoji: "📋",  },
    { id: 10, name: "Link to Goals", emoji: "📚",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedTechniques = [
    techniques[2], // List Benefits (id: 8)
    techniques[4], // Link to Goals (id: 10)
    techniques[1], // Explain Schedule (id: 7)
    techniques[0], // Show Responsibility (id: 6)
    techniques[3]  // Survey Support (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each request has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { requestId: 1, techniqueId: 6 }, // Later Curfew → Show Responsibility
    { requestId: 2, techniqueId: 7 }, // Assignment Extension → Explain Schedule
    { requestId: 3, techniqueId: 8 }, // Group Project Idea → List Benefits
    { requestId: 4, techniqueId: 9 }, // School Event → Survey Support
    { requestId: 5, techniqueId: 10 } // Chore Reduction → Link to Goals
  ];

  const handleRequestSelect = (request) => {
    if (gameFinished) return;
    setSelectedRequest(request);
  };

  const handleTechniqueSelect = (technique) => {
    if (gameFinished) return;
    setSelectedTechnique(technique);
  };

  const handleMatch = () => {
    if (!selectedRequest || !selectedTechnique || gameFinished) return;

    resetFeedback();

    const newMatch = {
      requestId: selectedRequest.id,
      techniqueId: selectedTechnique.id,
      isCorrect: correctMatches.some(
        match => match.requestId === selectedRequest.id && match.techniqueId === selectedTechnique.id
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
    if (newMatches.length === requests.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedRequest(null);
    setSelectedTechnique(null);
  };

  // Check if a request is already matched
  const isRequestMatched = (requestId) => {
    return matches.some(match => match.requestId === requestId);
  };

  // Check if a technique is already matched
  const isTechniqueMatched = (techniqueId) => {
    return matches.some(match => match.techniqueId === techniqueId);
  };

  // Get match result for a request
  const getMatchResult = (requestId) => {
    const match = matches.find(m => m.requestId === requestId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/uvls/teen");
  };

  return (
    <GameShell
      title="Persuasion Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Requests with Techniques (${matches.length}/${requests.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="uvls-teen-66"
      nextGamePathProp="/student/uvls/teen/communication-journal"
      nextGameIdProp="uvls-teen-67"
      gameType="uvls"
      totalLevels={requests.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === requests.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teen"
      maxScore={requests.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Persuasion Requests */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Persuasion Requests</h3>
              <div className="space-y-4">
                {requests.map(request => (
                  <button
                    key={request.id}
                    onClick={() => handleRequestSelect(request)}
                    disabled={isRequestMatched(request.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isRequestMatched(request.id)
                        ? getMatchResult(request.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedRequest?.id === request.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{request.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{request.name}</h4>
                        
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
                  {selectedRequest 
                    ? `Selected: ${selectedRequest.name}` 
                    : "Select a Persuasion Request"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedRequest || !selectedTechnique}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedRequest && selectedTechnique
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{requests.length}</p>
                  <p>Matched: {matches.length}/{requests.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Persuasion Techniques */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Persuasion Techniques</h3>
              <div className="space-y-4">
                {rearrangedTechniques.map(technique => (
                  <button
                    key={technique.id}
                    onClick={() => handleTechniqueSelect(technique)}
                    disabled={isTechniqueMatched(technique.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isTechniqueMatched(technique.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedTechnique?.id === technique.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{technique.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{technique.name}</h4>
                        <p className="text-white/80 text-sm">{technique.description}</p>
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
                  You correctly matched {score} out of {requests.length} persuasion requests with effective techniques!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Effective persuasion combines clear requests with supporting evidence and thoughtful techniques!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {requests.length} persuasion requests correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about what evidence or reasoning would make each request more convincing!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PersuasionPuzzle;