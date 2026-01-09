import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GrowthHelpersPuzzle = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-24";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Growth Helpers (left side) - 5 items
  const helpers = [
    { id: 1, name: "Milk", emoji: "🥛",  },
    { id: 2, name: "Exercise", emoji: "🏃",  },
    { id: 3, name: "Sleep", emoji: "🛌",  },
    { id: 4, name: "Vegetables", emoji: "🥕",  },
    { id: 5, name: "Water", emoji: "💧",  }
  ];

  // Benefits (right side) - 5 items
  const benefits = [
    { id: 3, name: "More Energy", emoji: "⚡",  },
    { id: 5, name: "Hydrated Body", emoji: "😄",  },
    { id: 1, name: "Strong Bones", emoji: "🦴",  },
    { id: 4, name: "Healthy Muscles", emoji: "💪",  },
    { id: 2, name: "Better Mood", emoji: "😊",  }
  ];

  // Correct matches
  const correctMatches = [
    { helperId: 1, benefitId: 1 }, // Milk → Strong Bones
    { helperId: 2, benefitId: 2 }, // Exercise → Better Mood
    { helperId: 3, benefitId: 3 }, // Sleep → More Energy
    { helperId: 4, benefitId: 4 }, // Vegetables → Healthy Muscles
    { helperId: 5, benefitId: 5 }  // Water → Hydrated Body
  ];

  const handleHelperSelect = (helper) => {
    if (gameFinished) return;
    setSelectedHelper(helper);
  };

  const handleBenefitSelect = (benefit) => {
    if (gameFinished) return;
    setSelectedBenefit(benefit);
  };

  const handleMatch = () => {
    if (!selectedHelper || !selectedBenefit || gameFinished) return;

    resetFeedback();

    const newMatch = {
      helperId: selectedHelper.id,
      benefitId: selectedBenefit.id,
      isCorrect: correctMatches.some(
        match => match.helperId === selectedHelper.id && match.benefitId === selectedBenefit.id
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
    if (newMatches.length === helpers.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedHelper(null);
    setSelectedBenefit(null);
  };

  // Check if a helper is already matched
  const isHelperMatched = (helperId) => {
    return matches.some(match => match.helperId === helperId);
  };

  // Check if a benefit is already matched
  const isBenefitMatched = (benefitId) => {
    return matches.some(match => match.benefitId === benefitId);
  };

  // Get match result for a helper
  const getMatchResult = (helperId) => {
    const match = matches.find(m => m.helperId === helperId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Growth Helpers Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Helpers with Benefits (${matches.length}/${helpers.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/voice-change-story"
      nextGameIdProp="health-male-kids-25"
      gameType="health-male"
      totalLevels={helpers.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === helpers.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/health-male/kids"
      maxScore={helpers.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Growth Helpers */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Growth Helpers</h3>
              <div className="space-y-4">
                {helpers.map(helper => (
                  <button
                    key={helper.id}
                    onClick={() => handleHelperSelect(helper)}
                    disabled={isHelperMatched(helper.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isHelperMatched(helper.id)
                        ? getMatchResult(helper.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedHelper?.id === helper.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{helper.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{helper.name}</h4>
                        <p className="text-white/80 text-sm">{helper.description}</p>
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
                  {selectedHelper 
                    ? `Selected: ${selectedHelper.name}` 
                    : "Select a Helper"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedHelper || !selectedBenefit}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedHelper && selectedBenefit
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{helpers.length}</p>
                  <p>Matched: {matches.length}/{helpers.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Benefits */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Benefits</h3>
              <div className="space-y-4">
                {benefits.map(benefit => (
                  <button
                    key={benefit.id}
                    onClick={() => handleBenefitSelect(benefit)}
                    disabled={isBenefitMatched(benefit.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isBenefitMatched(benefit.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedBenefit?.id === benefit.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{benefit.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{benefit.name}</h4>
                        <p className="text-white/80 text-sm">{benefit.description}</p>
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
                  You correctly matched {score} out of {helpers.length} helpers with their benefits!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Different helpers contribute to various aspects of healthy growth!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {helpers.length} helpers correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about what each helper contributes to your body!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GrowthHelpersPuzzle;

