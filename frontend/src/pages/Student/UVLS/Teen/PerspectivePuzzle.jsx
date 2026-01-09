import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PerspectivePuzzle = () => {
  const navigate = useNavigate();

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedSituation, setSelectedSituation] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Social situations (left side) - 5 items with hints
  const situations = [
    { id: 1, name: "Struggling Student", emoji: "📚",  },
    { id: 2, name: "Excluded Peer", emoji: "👥",  },
    { id: 3, name: "Upset Friend", emoji: "😔",  },
    { id: 4, name: "Public Mistake", emoji: "😳",  },
    { id: 5, name: "Language Barrier", emoji: "🗣️",  },
  ];

  // Empathetic responses (right side) - 5 items with descriptions
  const responses = [
    { id: 6, name: "Offer Help", emoji: "🤝",  },
    { id: 7, name: "Include Them", emoji: "🤗",  },
    { id: 8, name: "Listen Supportively", emoji: "👂",  },
    { id: 9, name: "Reassure Kindly", emoji: "💪",  },
    { id: 10, name: "Communicate Clearly", emoji: "💬",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedResponses = [
    responses[2], // Listen Supportively (id: 8)
    responses[4], // Communicate Clearly (id: 10)
    responses[1], // Include Them (id: 7)
    responses[0], // Offer Help (id: 6)
    responses[3]  // Reassure Kindly (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each situation has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { situationId: 1, responseId: 6 }, // Struggling Student → Offer Help
    { situationId: 2, responseId: 7 }, // Excluded Peer → Include Them
    { situationId: 3, responseId: 8 }, // Upset Friend → Listen Supportively
    { situationId: 4, responseId: 9 }, // Public Mistake → Reassure Kindly
    { situationId: 5, responseId: 10 } // Language Barrier → Communicate Clearly
  ];

  const handleSituationSelect = (situation) => {
    if (gameFinished) return;
    setSelectedSituation(situation);
  };

  const handleResponseSelect = (response) => {
    if (gameFinished) return;
    setSelectedResponse(response);
  };

  const handleMatch = () => {
    if (!selectedSituation || !selectedResponse || gameFinished) return;

    resetFeedback();

    const newMatch = {
      situationId: selectedSituation.id,
      responseId: selectedResponse.id,
      isCorrect: correctMatches.some(
        match => match.situationId === selectedSituation.id && match.responseId === selectedResponse.id
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
    if (newMatches.length === situations.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedSituation(null);
    setSelectedResponse(null);
  };

  // Check if a situation is already matched
  const isSituationMatched = (situationId) => {
    return matches.some(match => match.situationId === situationId);
  };

  // Check if a response is already matched
  const isResponseMatched = (responseId) => {
    return matches.some(match => match.responseId === responseId);
  };

  // Get match result for a situation
  const getMatchResult = (situationId) => {
    const match = matches.find(m => m.situationId === situationId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/uvls/teen");
  };

  return (
    <GameShell
      title="Perspective Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Situations with Responses (${matches.length}/${situations.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="uvls-teen-3"
      nextGamePathProp="/student/uvls/teen/walk-in-shoes"
      nextGameIdProp="uvls-teen-4"
      gameType="uvls"
      totalLevels={situations.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === situations.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teen"
      maxScore={situations.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Social Situations */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Social Situations</h3>
              <div className="space-y-4">
                {situations.map(situation => (
                  <button
                    key={situation.id}
                    onClick={() => handleSituationSelect(situation)}
                    disabled={isSituationMatched(situation.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isSituationMatched(situation.id)
                        ? getMatchResult(situation.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedSituation?.id === situation.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{situation.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{situation.name}</h4>
                        
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
                  {selectedSituation 
                    ? `Selected: ${selectedSituation.name}` 
                    : "Select a Social Situation"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedSituation || !selectedResponse}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedSituation && selectedResponse
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{situations.length}</p>
                  <p>Matched: {matches.length}/{situations.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Empathetic Responses */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Empathetic Responses</h3>
              <div className="space-y-4">
                {rearrangedResponses.map(response => (
                  <button
                    key={response.id}
                    onClick={() => handleResponseSelect(response)}
                    disabled={isResponseMatched(response.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isResponseMatched(response.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedResponse?.id === response.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{response.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{response.name}</h4>
                        <p className="text-white/80 text-sm">{response.description}</p>
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
                  You correctly matched {score} out of {situations.length} social situations with empathetic responses!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Taking others' perspectives helps us respond with empathy and build stronger relationships!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {situations.length} social situations correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about how you would want to be treated in similar situations!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PerspectivePuzzle;