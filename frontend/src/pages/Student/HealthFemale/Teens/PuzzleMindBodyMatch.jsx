import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMindBodyMatch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 1; // 1 coin per correct match
  const totalCoins = location.state?.totalCoins || 5; // Total coins for 5 matches
  const totalXp = location.state?.totalXp || 10; // Total XP
  
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedPractice, setSelectedPractice] = useState(null);
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  // Wellness Practices (left side) - 5 items
  const practices = [
    { id: 1, name: "Sleep", emoji: "😴",  },
    { id: 2, name: "Deep Breath", emoji: "💨",  },
    { id: 3, name: "Exercise", emoji: "🏃",  },
    { id: 4, name: "Meditation", emoji: "🧘",  },
    { id: 5, name: "Healthy Diet", emoji: "🥗",  }
  ];
  
  // Benefits (right side) - 5 items (shuffled order)
  const benefits = [
    { id: 3, text: "Boosts energy and mood",  },
    { id: 5, text: "Promotes overall wellbeing",  },
    { id: 1, text: "Restores mental and physical energy",  },
    { id: 4, text: "Improves concentration and clarity",  },
    { id: 2, text: "Reduces stress and tension",  }
  ];
  
  // Correct matches
  const correctMatches = [
    { practiceId: 1, benefitId: 1 }, // Sleep → Restores mental and physical energy
    { practiceId: 2, benefitId: 2 }, // Deep Breath → Reduces stress and tension
    { practiceId: 3, benefitId: 3 }, // Exercise → Boosts energy and mood
    { practiceId: 4, benefitId: 4 }, // Meditation → Improves concentration and clarity
    { practiceId: 5, benefitId: 5 }  // Healthy Diet → Promotes overall wellbeing
  ];
  
  const handlePracticeSelect = (practice) => {
    if (gameFinished) return;
    setSelectedPractice(practice);
  };
  
  const handleBenefitSelect = (benefit) => {
    if (gameFinished) return;
    setSelectedBenefit(benefit);
  };
  
  const handleMatch = () => {
    if (!selectedPractice || !selectedBenefit || gameFinished) return;
    
    resetFeedback();
    
    const newMatch = {
      practiceId: selectedPractice.id,
      benefitId: selectedBenefit.id,
      isCorrect: correctMatches.some(
        match => match.practiceId === selectedPractice.id && match.benefitId === selectedBenefit.id
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
    if (newMatches.length === practices.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }
    
    // Reset selections
    setSelectedPractice(null);
    setSelectedBenefit(null);
  };
  
  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedPractice(null);
    setSelectedBenefit(null);
    setScore(0);
    resetFeedback();
  };
  
  const handleNext = () => {
    navigate("/games/health-female/teens");
  };
  
  // Check if a practice is already matched
  const isPracticeMatched = (practiceId) => {
    return matches.some(match => match.practiceId === practiceId);
  };
  
  // Check if a benefit is already matched
  const isBenefitMatched = (benefitId) => {
    return matches.some(match => match.benefitId === benefitId);
  };
  
  // Get match result for a practice
  const getMatchResult = (practiceId) => {
    const match = matches.find(m => m.practiceId === practiceId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Mind-Body Match"
      subtitle={gameFinished ? "Game Complete!" : `Match Practices with Benefits (${matches.length}/${practices.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-female-teen-54"
      gameType="health-female"
      totalLevels={practices.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={practices.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/health-female/teens/body-image-story"
      nextGameIdProp="health-female-teen-55">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Practices */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Wellness Practices</h3>
              <div className="space-y-4">
                {practices.map(practice => (
                  <button
                    key={practice.id}
                    onClick={() => handlePracticeSelect(practice)}
                    disabled={isPracticeMatched(practice.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isPracticeMatched(practice.id)
                        ? getMatchResult(practice.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedPractice?.id === practice.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{practice.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{practice.name}</h4>
                        <p className="text-white/80 text-sm">{practice.hint}</p>
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
                  {selectedPractice 
                    ? `Selected: ${selectedPractice.name}` 
                    : "Select a Practice"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedPractice || !selectedBenefit}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedPractice && selectedBenefit
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{practices.length}</p>
                  <p>Matched: {matches.length}/{practices.length}</p>
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
                      <div>
                        <h4 className="font-bold text-white">{benefit.text}</h4>
                        <p className="text-white/80 text-sm">{benefit.hint}</p>
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
                  You correctly matched {score} out of {practices.length} wellness practices with their benefits!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding the connection between mind-body practices and their benefits promotes holistic health!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {practices.length} practices correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about the primary outcome of each wellness practice when matching it with its benefit!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleMindBodyMatch;