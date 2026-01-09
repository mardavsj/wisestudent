import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleFamousTeens = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedEntrepreneur, setSelectedEntrepreneur] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Teen Entrepreneurs (left side) - 5 items
  const entrepreneurs = [
    { id: 1, name: "Moziah Bridges",   },
    { id: 2, name: "Cory Nieves",   },
    { id: 3, name: "Alina Morse",   },
    { id: 4, name: "Kylie Jenner",   },
    { id: 5, name: "Ben Pasternak",   },
  ];

  // Businesses (right side) - 5 items
  const businesses = [
    { id: 5, name: "App Development", emoji: "📱",  },
    { id: 1, name: "Tie Business", emoji: "👔",  },
    { id: 2, name: "Cookies", emoji: "🍪",  },
    { id: 4, name: "Cosmetics Brand", emoji: "💄",  },
    { id: 3, name: "Candy", emoji: "🍬",  },
  ];

  // Correct matches
  const correctMatches = [
    { entrepreneurId: 1, businessId: 1 }, // Moziah Bridges → Tie Business
    { entrepreneurId: 2, businessId: 2 }, // Cory Nieves → Cookies
    { entrepreneurId: 3, businessId: 3 }, // Alina Morse → Candy
    { entrepreneurId: 4, businessId: 4 }, // Kylie Jenner → Cosmetics Brand
    { entrepreneurId: 5, businessId: 5 }  // Ben Pasternak → App Development
  ];

  const handleEntrepreneurSelect = (entrepreneur) => {
    if (gameFinished) return;
    setSelectedEntrepreneur(entrepreneur);
  };

  const handleBusinessSelect = (business) => {
    if (gameFinished) return;
    setSelectedBusiness(business);
  };

  const handleMatch = () => {
    if (!selectedEntrepreneur || !selectedBusiness || gameFinished) return;

    resetFeedback();

    const newMatch = {
      entrepreneurId: selectedEntrepreneur.id,
      businessId: selectedBusiness.id,
      isCorrect: correctMatches.some(
        match => match.entrepreneurId === selectedEntrepreneur.id && match.businessId === selectedBusiness.id
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
    if (newMatches.length === entrepreneurs.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedEntrepreneur(null);
    setSelectedBusiness(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedEntrepreneur(null);
    setSelectedBusiness(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ehe/teens/fashion-story");
  };

  // Check if an entrepreneur is already matched
  const isEntrepreneurMatched = (entrepreneurId) => {
    return matches.some(match => match.entrepreneurId === entrepreneurId);
  };

  // Check if a business is already matched
  const isBusinessMatched = (businessId) => {
    return matches.some(match => match.businessId === businessId);
  };

  // Get match result for an entrepreneur
  const getMatchResult = (entrepreneurId) => {
    const match = matches.find(m => m.entrepreneurId === entrepreneurId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Famous Teens"
      subtitle={gameFinished ? "Game Complete!" : `Match Entrepreneurs with Businesses (${matches.length}/${entrepreneurs.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="ehe-teen-44"
      gameType="ehe"
      totalLevels={entrepreneurs.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ehe/teens"
      maxScore={entrepreneurs.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/ehe/teens/fashion-story"
      nextGameIdProp="ehe-teen-45">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Entrepreneurs */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Entrepreneurs</h3>
              <div className="space-y-4">
                {entrepreneurs.map(entrepreneur => (
                  <button
                    key={entrepreneur.id}
                    onClick={() => handleEntrepreneurSelect(entrepreneur)}
                    disabled={isEntrepreneurMatched(entrepreneur.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isEntrepreneurMatched(entrepreneur.id)
                        ? getMatchResult(entrepreneur.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedEntrepreneur?.id === entrepreneur.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{entrepreneur.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{entrepreneur.name}</h4>
                        <p className="text-white/80 text-sm">{entrepreneur.description}</p>
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
                  {selectedEntrepreneur 
                    ? `Selected: ${selectedEntrepreneur.name}` 
                    : "Select an Entrepreneur"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedEntrepreneur || !selectedBusiness}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedEntrepreneur && selectedBusiness
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{entrepreneurs.length}</p>
                  <p>Matched: {matches.length}/{entrepreneurs.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Businesses */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Businesses</h3>
              <div className="space-y-4">
                {businesses.map(business => (
                  <button
                    key={business.id}
                    onClick={() => handleBusinessSelect(business)}
                    disabled={isBusinessMatched(business.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isBusinessMatched(business.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedBusiness?.id === business.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{business.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{business.name}</h4>
                        <p className="text-white/80 text-sm">{business.description}</p>
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
                <h3 className="text-2xl font-bold text-white mb-4">Young Entrepreneur Expert!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {entrepreneurs.length} teen entrepreneurs with their businesses!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Young entrepreneurs can create successful businesses with creativity and determination!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {entrepreneurs.length} teen entrepreneurs correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Pay attention to the unique characteristics of each entrepreneur's business!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleFamousTeens;