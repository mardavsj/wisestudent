import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';

const HygieneMatch = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-4";

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedHygieneItem, setSelectedHygieneItem] = useState(null);
  const [selectedPurpose, setSelectedPurpose] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Hygiene Items (left side) - 5 items
  const hygieneItems = [
    { id: 1, name: "Toothbrush", emoji: "🪥",  },
    { id: 2, name: "Soap", emoji: "🧼",  },
    { id: 3, name: "Comb", emoji: "🪖",  },
    { id: 4, name: "Towel", emoji: "🧺",  },
    { id: 5, name: "Nail Clippers", emoji: "✂️",  }
  ];

  // Purposes (right side) - 5 items (shuffled order)
  const purposes = [
    { id: 3, text: "Styling and organizing hair",  },
    { id: 5, text: "Trimming fingernails and toenails",  },
    { id: 1, text: "Cleaning teeth and gums",  },
    { id: 4, text: "Drying body and hands",  },
    { id: 2, text: "Removing dirt and germs from skin",  }
  ];

  // Correct matches
  const correctMatches = [
    { itemId: 1, purposeId: 1 }, // Toothbrush → Cleaning teeth and gums
    { itemId: 2, purposeId: 2 }, // Soap → Removing dirt and germs from skin
    { itemId: 3, purposeId: 3 }, // Comb → Styling and organizing hair
    { itemId: 4, purposeId: 4 }, // Towel → Drying body and hands
    { itemId: 5, purposeId: 5 }  // Nail Clippers → Trimming fingernails and toenails
  ];

  const handleHygieneItemSelect = (item) => {
    if (gameFinished) return;
    setSelectedHygieneItem(item);
  };

  const handlePurposeSelect = (purpose) => {
    if (gameFinished) return;
    setSelectedPurpose(purpose);
  };

  const handleMatch = () => {
    if (!selectedHygieneItem || !selectedPurpose || gameFinished) return;

    resetFeedback();

    const newMatch = {
      itemId: selectedHygieneItem.id,
      purposeId: selectedPurpose.id,
      isCorrect: correctMatches.some(
        match => match.itemId === selectedHygieneItem.id && match.purposeId === selectedPurpose.id
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
    if (newMatches.length === hygieneItems.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedHygieneItem(null);
    setSelectedPurpose(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedHygieneItem(null);
    setSelectedPurpose(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  // Check if a hygiene item is already matched
  const isHygieneItemMatched = (itemId) => {
    return matches.some(match => match.itemId === itemId);
  };

  // Check if a purpose is already matched
  const isPurposeMatched = (purposeId) => {
    return matches.some(match => match.purposeId === purposeId);
  };

  // Get match result for a hygiene item
  const getMatchResult = (itemId) => {
    const match = matches.find(m => m.itemId === itemId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Hygiene Match"
      subtitle={gameFinished ? "Game Complete!" : `Match Items with Purposes (${matches.length}/${hygieneItems.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-female"
      totalLevels={hygieneItems.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished}
      showAnswerConfetti={showAnswerConfetti}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    
      nextGamePathProp="/student/health-female/kids/bath-time-story"
      nextGameIdProp="health-female-kids-5">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Hygiene Items */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Hygiene Items</h3>
              <div className="space-y-4">
                {hygieneItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleHygieneItemSelect(item)}
                    disabled={isHygieneItemMatched(item.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isHygieneItemMatched(item.id)
                        ? getMatchResult(item.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedHygieneItem?.id === item.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{item.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{item.name}</h4>
                        <p className="text-white/80 text-sm">{item.hint}</p>
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
                  {selectedHygieneItem 
                    ? `Selected: ${selectedHygieneItem.name}` 
                    : "Select a Hygiene Item"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedHygieneItem || !selectedPurpose}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedHygieneItem && selectedPurpose
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{hygieneItems.length}</p>
                  <p>Matched: {matches.length}/{hygieneItems.length}</p>
                </div>
              </div>
            </div>
            
            {/* Right column - Purposes */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Purposes</h3>
              <div className="space-y-4">
                {purposes.map(purpose => (
                  <button
                    key={purpose.id}
                    onClick={() => handlePurposeSelect(purpose)}
                    disabled={isPurposeMatched(purpose.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isPurposeMatched(purpose.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedPurpose?.id === purpose.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div>
                        <h4 className="font-bold text-white">{purpose.text}</h4>
                        <p className="text-white/80 text-sm">{purpose.hint}</p>
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
                  You correctly matched {score} out of {hygieneItems.length} hygiene items with their purposes!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding the purpose of each hygiene item helps you maintain good personal cleanliness!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {hygieneItems.length} items correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about what each hygiene item is designed to do for your body!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HygieneMatch;