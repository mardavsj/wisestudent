import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getFinanceTeenGames } from "../../../../pages/Games/GameCategories/Finance/teenGamesData";

const PuzzleOfInvestmentTypes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getFinanceTeenGames({});
      const currentGame = games.find(g => g.id === "finance-teens-64");
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : null,
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return { nextGamePath: null, nextGameId: null };
  }, [location.state]);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [selectedCharacteristic, setSelectedCharacteristic] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Investment types (left side) - 5 items
  const investments = [
    { id: 1, name: "Fixed Deposit", emoji: "🏦",  },
    { id: 2, name: "Stocks", emoji: "📈",  },
    { id: 3, name: "Mutual Fund", emoji: "📊",  },
    { id: 4, name: "Bonds", emoji: "📜",  },
    { id: 5, name: "Real Estate", emoji: "🏠",  }
  ];

  // Investment characteristics (right side) - 5 items
  const characteristics = [
    { id: 6, name: "Safe", emoji: "🛡️",  },
    { id: 7, name: "Risky", emoji: "⚠️",  },
    { id: 8, name: "Diversified", emoji: "🔄",  },
    { id: 9, name: "Stable", emoji: "💰",  },
    { id: 10, name: "Long-term", emoji: "⏳",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedCharacteristics = [
    characteristics[2], // Diversified (id: 8)
    characteristics[4], // Long-term (id: 10)
    characteristics[1], // Risky (id: 7)
    characteristics[0], // Safe (id: 6)
    characteristics[3]  // Stable (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each investment has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { investmentId: 1, characteristicId: 6 }, // Fixed Deposit → Safe
    { investmentId: 2, characteristicId: 7 }, // Stocks → Risky
    { investmentId: 3, characteristicId: 8 }, // Mutual Fund → Diversified
    { investmentId: 4, characteristicId: 9 }, // Bonds → Stable
    { investmentId: 5, characteristicId: 10 } // Real Estate → Long-term
  ];

  const handleInvestmentSelect = (investment) => {
    if (gameFinished) return;
    setSelectedInvestment(investment);
  };

  const handleCharacteristicSelect = (characteristic) => {
    if (gameFinished) return;
    setSelectedCharacteristic(characteristic);
  };

  const handleMatch = () => {
    if (!selectedInvestment || !selectedCharacteristic || gameFinished) return;

    resetFeedback();

    const newMatch = {
      investmentId: selectedInvestment.id,
      characteristicId: selectedCharacteristic.id,
      isCorrect: correctMatches.some(
        match => match.investmentId === selectedInvestment.id && match.characteristicId === selectedCharacteristic.id
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
    if (newMatches.length === investments.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedInvestment(null);
    setSelectedCharacteristic(null);
  };

  // Check if an investment is already matched
  const isInvestmentMatched = (investmentId) => {
    return matches.some(match => match.investmentId === investmentId);
  };

  // Check if a characteristic is already matched
  const isCharacteristicMatched = (characteristicId) => {
    return matches.some(match => match.characteristicId === characteristicId);
  };

  // Get match result for an investment
  const getMatchResult = (investmentId) => {
    const match = matches.find(m => m.investmentId === investmentId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Investment Types"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Investments with Characteristics (${matches.length}/${investments.length} matched)`}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="finance-teens-64"
      gameType="finance"
      totalLevels={investments.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === investments.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/financial-literacy/teens"
      maxScore={investments.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Investment Types */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Investment Types</h3>
              <div className="space-y-4">
                {investments.map(investment => (
                  <button
                    key={investment.id}
                    onClick={() => handleInvestmentSelect(investment)}
                    disabled={isInvestmentMatched(investment.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isInvestmentMatched(investment.id)
                        ? getMatchResult(investment.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedInvestment?.id === investment.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{investment.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{investment.name}</h4>
                        
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
                  {selectedInvestment 
                    ? `Selected: ${selectedInvestment.name}` 
                    : "Select an Investment Type"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedInvestment || !selectedCharacteristic}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedInvestment && selectedCharacteristic
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{investments.length}</p>
                  <p>Matched: {matches.length}/{investments.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Investment Characteristics */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Characteristics</h3>
              <div className="space-y-4">
                {rearrangedCharacteristics.map(characteristic => (
                  <button
                    key={characteristic.id}
                    onClick={() => handleCharacteristicSelect(characteristic)}
                    disabled={isCharacteristicMatched(characteristic.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isCharacteristicMatched(characteristic.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedCharacteristic?.id === characteristic.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{characteristic.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{characteristic.name}</h4>
                        <p className="text-white/80 text-sm">{characteristic.description}</p>
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
                  You correctly matched {score} out of {investments.length} investment types with their characteristics!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding investment characteristics helps make informed financial decisions!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {investments.length} investment types correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about the risk level and nature of each investment type!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleOfInvestmentTypes;