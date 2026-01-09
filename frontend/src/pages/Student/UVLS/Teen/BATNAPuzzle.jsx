import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BATNAPuzzle = () => {
  const navigate = useNavigate();

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedSituation, setSelectedSituation] = useState(null);
  const [selectedBATNA, setSelectedBATNA] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Negotiation situations (left side) - 5 items with hints
  const situations = [
    { id: 1, name: "Buying a Used Car", emoji: "🚗",  },
    { id: 2, name: "Renting an Apartment", emoji: "🏠",  },
    { id: 3, name: "Job Salary Negotiation", emoji: "💼",  },
    { id: 4, name: "Group Project Deadline", emoji: "📋",  },
    { id: 5, name: "Buying a New Phone", emoji: "📱",  }
  ];

  // BATNA options (right side) - 5 items with descriptions
  const batnas = [
    { id: 6, name: "Another Seller/Walk Away", emoji: "🛒",  },
    { id: 7, name: "Cheaper Place/Family Stay", emoji: "🏡",  },
    { id: 8, name: "Other Job Offers", emoji: "👔",  },
    { id: 9, name: "Independent Work/Extension", emoji: "📅",  },
    { id: 10, name: "Different Model/Sale Wait", emoji: "🕒",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedBATNAs = [
    batnas[2], // Other Job Offers (id: 8)
    batnas[4], // Different Model/Sale Wait (id: 10)
    batnas[1], // Cheaper Place/Family Stay (id: 7)
    batnas[0], // Another Seller/Walk Away (id: 6)
    batnas[3]  // Independent Work/Extension (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each situation has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { situationId: 1, batnaId: 6 }, // Buying a Used Car → Another Seller/Walk Away
    { situationId: 2, batnaId: 7 }, // Renting an Apartment → Cheaper Place/Family Stay
    { situationId: 3, batnaId: 8 }, // Job Salary Negotiation → Other Job Offers
    { situationId: 4, batnaId: 9 }, // Group Project Deadline → Independent Work/Extension
    { situationId: 5, batnaId: 10 } // Buying a New Phone → Different Model/Sale Wait
  ];

  const handleSituationSelect = (situation) => {
    if (gameFinished) return;
    setSelectedSituation(situation);
  };

  const handleBATNASelect = (batna) => {
    if (gameFinished) return;
    setSelectedBATNA(batna);
  };

  const handleMatch = () => {
    if (!selectedSituation || !selectedBATNA || gameFinished) return;

    resetFeedback();

    const newMatch = {
      situationId: selectedSituation.id,
      batnaId: selectedBATNA.id,
      isCorrect: correctMatches.some(
        match => match.situationId === selectedSituation.id && match.batnaId === selectedBATNA.id
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
    setSelectedBATNA(null);
  };

  // Check if a situation is already matched
  const isSituationMatched = (situationId) => {
    return matches.some(match => match.situationId === situationId);
  };

  // Check if a BATNA is already matched
  const isBATNAMatched = (batnaId) => {
    return matches.some(match => match.batnaId === batnaId);
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
      title="BATNA Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Situations with BATNAs (${matches.length}/${situations.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="uvls-teen-74"
      nextGamePathProp="/student/uvls/teen/tough-bargain-roleplay"
      nextGameIdProp="uvls-teen-75"
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
            {/* Left column - Negotiation Situations */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Negotiation Situations</h3>
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
                    : "Select a Negotiation Situation"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedSituation || !selectedBATNA}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedSituation && selectedBATNA
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

            {/* Right column - BATNA Options */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">BATNA Options</h3>
              <div className="space-y-4">
                {rearrangedBATNAs.map(batna => (
                  <button
                    key={batna.id}
                    onClick={() => handleBATNASelect(batna)}
                    disabled={isBATNAMatched(batna.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isBATNAMatched(batna.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedBATNA?.id === batna.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{batna.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{batna.name}</h4>
                        <p className="text-white/80 text-sm">{batna.description}</p>
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
                  You correctly matched {score} out of {situations.length} negotiation situations with their best alternatives!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Having a strong Best Alternative To Negotiated Agreement (BATNA) gives you negotiating power!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {situations.length} negotiation situations correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about what realistic alternatives you'd have in each negotiation scenario!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BATNAPuzzle;