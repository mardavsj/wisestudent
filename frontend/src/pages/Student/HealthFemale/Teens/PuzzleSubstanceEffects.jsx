import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleSubstanceEffects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 1; // 1 coin per correct match
  const totalCoins = location.state?.totalCoins || 5; // Total coins for 5 matches
  const totalXp = location.state?.totalXp || 10; // Total XP
  
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedSubstance, setSelectedSubstance] = useState(null);
  const [selectedEffect, setSelectedEffect] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  // Substances (left side) - 5 items
  const substances = [
    { id: 1, name: "Smoking", emoji: "💨",  },
    { id: 2, name: "Alcohol", emoji: "🍺",  },
    { id: 3, name: "Drugs", emoji: "💊",  },
    { id: 4, name: "Nicotine", emoji: "🚬",  },
    { id: 5, name: "Marijuana", emoji: "🌿",  }
  ];
  
  // Effects (right side) - 5 items (shuffled order)
  const effects = [
    { id: 3, text: "Impairs cognitive function and judgment",  },
    { id: 5, text: "Interferes with short-term memory formation",  },
    { id: 1, text: "Damages respiratory system tissues",  },
    { id: 4, text: "Creates chemical dependency in brain",  },
    { id: 2, text: "Overworks liver detoxification process",  }
  ];
  
  // Correct matches
  const correctMatches = [
    { substanceId: 1, effectId: 1 }, // Smoking → Damages respiratory system tissues
    { substanceId: 2, effectId: 2 }, // Alcohol → Overworks liver detoxification process
    { substanceId: 3, effectId: 3 }, // Drugs → Impairs cognitive function and judgment
    { substanceId: 4, effectId: 4 }, // Nicotine → Creates chemical dependency in brain
    { substanceId: 5, effectId: 5 }  // Marijuana → Interferes with short-term memory formation
  ];
  
  const handleSubstanceSelect = (substance) => {
    if (gameFinished) return;
    setSelectedSubstance(substance);
  };
  
  const handleEffectSelect = (effect) => {
    if (gameFinished) return;
    setSelectedEffect(effect);
  };
  
  const handleMatch = () => {
    if (!selectedSubstance || !selectedEffect || gameFinished) return;
    
    resetFeedback();
    
    const newMatch = {
      substanceId: selectedSubstance.id,
      effectId: selectedEffect.id,
      isCorrect: correctMatches.some(
        match => match.substanceId === selectedSubstance.id && match.effectId === selectedEffect.id
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
    if (newMatches.length === substances.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }
    
    // Reset selections
    setSelectedSubstance(null);
    setSelectedEffect(null);
  };
  
  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedSubstance(null);
    setSelectedEffect(null);
    setScore(0);
    resetFeedback();
  };
  
  const handleNext = () => {
    navigate("/games/health-female/teens");
  };
  
  // Check if a substance is already matched
  const isSubstanceMatched = (substanceId) => {
    return matches.some(match => match.substanceId === substanceId);
  };
  
  // Check if an effect is already matched
  const isEffectMatched = (effectId) => {
    return matches.some(match => match.effectId === effectId);
  };
  
  // Get match result for a substance
  const getMatchResult = (substanceId) => {
    const match = matches.find(m => m.substanceId === substanceId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Substance Effects"
      subtitle={gameFinished ? "Game Complete!" : `Match Substances with Effects (${matches.length}/${substances.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-female-teen-84"
      gameType="health-female"
      totalLevels={substances.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={substances.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/health-female/teens/party-story"
      nextGameIdProp="health-female-teen-85">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Substances */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Substances</h3>
              <div className="space-y-4">
                {substances.map(substance => (
                  <button
                    key={substance.id}
                    onClick={() => handleSubstanceSelect(substance)}
                    disabled={isSubstanceMatched(substance.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isSubstanceMatched(substance.id)
                        ? getMatchResult(substance.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedSubstance?.id === substance.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{substance.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{substance.name}</h4>
                        <p className="text-white/80 text-sm">{substance.hint}</p>
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
                  {selectedSubstance 
                    ? `Selected: ${selectedSubstance.name}` 
                    : "Select a Substance"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedSubstance || !selectedEffect}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedSubstance && selectedEffect
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{substances.length}</p>
                  <p>Matched: {matches.length}/{substances.length}</p>
                </div>
              </div>
            </div>
            
            {/* Right column - Effects */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Effects</h3>
              <div className="space-y-4">
                {effects.map(effect => (
                  <button
                    key={effect.id}
                    onClick={() => handleEffectSelect(effect)}
                    disabled={isEffectMatched(effect.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isEffectMatched(effect.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedEffect?.id === effect.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div>
                        <h4 className="font-bold text-white">{effect.text}</h4>
                        <p className="text-white/80 text-sm">{effect.hint}</p>
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
                  You correctly matched {score} out of {substances.length} substances with their effects!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding the harmful effects of substances helps make informed decisions about health!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {substances.length} substances correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about how each substance primarily affects the body when matching it with its effect!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleSubstanceEffects;