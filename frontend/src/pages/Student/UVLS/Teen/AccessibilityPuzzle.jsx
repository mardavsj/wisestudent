import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AccessibilityPuzzle = () => {
  const navigate = useNavigate();

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedImpairment, setSelectedImpairment] = useState(null);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Disabilities/Impairments (left side) - 5 items with hints
  const impairments = [
    { id: 1, name: "Visual Impairment", emoji: "👁️",  },
    { id: 2, name: "Hearing Impairment", emoji: "👂",  },
    { id: 3, name: "Mobility Limitation", emoji: "🦽",  },
    { id: 4, name: "ADHD", emoji: "🧠",  },
    { id: 5, name: "Dyslexia", emoji: "🔤",  }
  ];

  // Accommodations (right side) - 5 items with descriptions
  const accommodations = [
    { id: 6, name: "Screen Reader Software", emoji: "🔊",  },
    { id: 7, name: "Sign Language Interpreter", emoji: "🤟",  },
    { id: 8, name: "Ramps and Elevators", emoji: "♿",  },
    { id: 9, name: "Fidget Tools", emoji: "🧘",  },
    { id: 10, name: "Audiobooks", emoji: "🎧",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedAccommodations = [
    accommodations[2], // Ramps and Elevators (id: 8)
    accommodations[4], // Audiobooks (id: 10)
    accommodations[1], // Sign Language Interpreter (id: 7)
    accommodations[0], // Screen Reader Software (id: 6)
    accommodations[3]  // Fidget Tools (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each impairment has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { impairmentId: 1, accommodationId: 6 }, // Visual Impairment → Screen Reader Software
    { impairmentId: 2, accommodationId: 7 }, // Hearing Impairment → Sign Language Interpreter
    { impairmentId: 3, accommodationId: 8 }, // Mobility Limitation → Ramps and Elevators
    { impairmentId: 4, accommodationId: 9 }, // ADHD → Fidget Tools
    { impairmentId: 5, accommodationId: 10 } // Dyslexia → Audiobooks
  ];

  const handleImpairmentSelect = (impairment) => {
    if (gameFinished) return;
    setSelectedImpairment(impairment);
  };

  const handleAccommodationSelect = (accommodation) => {
    if (gameFinished) return;
    setSelectedAccommodation(accommodation);
  };

  const handleMatch = () => {
    if (!selectedImpairment || !selectedAccommodation || gameFinished) return;

    resetFeedback();

    const newMatch = {
      impairmentId: selectedImpairment.id,
      accommodationId: selectedAccommodation.id,
      isCorrect: correctMatches.some(
        match => match.impairmentId === selectedImpairment.id && match.accommodationId === selectedAccommodation.id
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
    if (newMatches.length === impairments.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedImpairment(null);
    setSelectedAccommodation(null);
  };

  // Check if an impairment is already matched
  const isImpairmentMatched = (impairmentId) => {
    return matches.some(match => match.impairmentId === impairmentId);
  };

  // Check if an accommodation is already matched
  const isAccommodationMatched = (accommodationId) => {
    return matches.some(match => match.accommodationId === accommodationId);
  };

  // Get match result for an impairment
  const getMatchResult = (impairmentId) => {
    const match = matches.find(m => m.impairmentId === impairmentId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/uvls/teen");
  };

  return (
    <GameShell
      title="Accessibility Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Impairments with Accommodations (${matches.length}/${impairments.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="uvls-teen-13"
      nextGamePathProp="/student/uvls/teen/inclusive-class-simulation"
      nextGameIdProp="uvls-teen-14"
      gameType="uvls"
      totalLevels={impairments.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === impairments.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teen"
      maxScore={impairments.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Disabilities/Impairments */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Disabilities/Impairments</h3>
              <div className="space-y-4">
                {impairments.map(impairment => (
                  <button
                    key={impairment.id}
                    onClick={() => handleImpairmentSelect(impairment)}
                    disabled={isImpairmentMatched(impairment.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isImpairmentMatched(impairment.id)
                        ? getMatchResult(impairment.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedImpairment?.id === impairment.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{impairment.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{impairment.name}</h4>
                        
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
                  {selectedImpairment 
                    ? `Selected: ${selectedImpairment.name}` 
                    : "Select a Disability/Impairment"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedImpairment || !selectedAccommodation}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedImpairment && selectedAccommodation
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{impairments.length}</p>
                  <p>Matched: {matches.length}/{impairments.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Accommodations */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Accommodations</h3>
              <div className="space-y-4">
                {rearrangedAccommodations.map(accommodation => (
                  <button
                    key={accommodation.id}
                    onClick={() => handleAccommodationSelect(accommodation)}
                    disabled={isAccommodationMatched(accommodation.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isAccommodationMatched(accommodation.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedAccommodation?.id === accommodation.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{accommodation.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{accommodation.name}</h4>
                        <p className="text-white/80 text-sm">{accommodation.description}</p>
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
                  You correctly matched {score} out of {impairments.length} disabilities with appropriate accommodations!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding different disabilities and their accommodations helps create inclusive environments for everyone!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {impairments.length} disabilities correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about what challenges each disability presents and what tools or adjustments could help!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AccessibilityPuzzle;