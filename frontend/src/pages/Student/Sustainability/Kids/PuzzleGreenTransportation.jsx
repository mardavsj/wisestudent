import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const PuzzleGreenTransportation = () => {
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
      const games = getSustainabilityKidsGames({});
      const currentGame = games.find(g => g.id === "sustainability-kids-24");
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
  
  // Get game data from game category folder (source of truth)
  const gameId = "sustainability-kids-24";
  const gameData = getGameDataById(gameId);
  
  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [selectedImpact, setSelectedImpact] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Transportation Methods (left side) - 5 items
  const transports = [
    { id: 1, name: "Bike", emoji: "🚲",  },
    { id: 2, name: "Car", emoji: "🚗",  },
    { id: 3, name: "Walk", emoji: "🚶",  },
    { id: 4, name: "Bus", emoji: "🚌",  },
    { id: 5, name: "Train", emoji: "🚂",  }
  ];

  // Environmental Impacts (right side) - 5 items
  const impacts = [
    { id: 3, name: "Zero Emissions", emoji: "🍃",  },
    { id: 5, name: "Reduced Carbon", emoji: "🚆",  },
    { id: 1, name: "Low Pollution", emoji: "🚴",  },
    { id: 4, name: "Shared Resources", emoji: "👥",  },
    { id: 2, name: "High Emissions", emoji: "🌫️",  }
  ];

  // Correct matches
  const correctMatches = [
    { transportId: 1, impactId: 1 }, // Bike → Low Pollution
    { transportId: 2, impactId: 2 }, // Car → High Emissions
    { transportId: 3, impactId: 3 }, // Walk → Zero Emissions
    { transportId: 4, impactId: 4 }, // Bus → Shared Resources
    { transportId: 5, impactId: 5 }  // Train → Reduced Carbon
  ];

  const handleTransportSelect = (transport) => {
    if (gameFinished) return;
    setSelectedTransport(transport);
  };

  const handleImpactSelect = (impact) => {
    if (gameFinished) return;
    setSelectedImpact(impact);
  };

  const handleMatch = () => {
    if (!selectedTransport || !selectedImpact || gameFinished) return;

    resetFeedback();

    const newMatch = {
      transportId: selectedTransport.id,
      impactId: selectedImpact.id,
      isCorrect: correctMatches.some(
        match => match.transportId === selectedTransport.id && match.impactId === selectedImpact.id
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
    };

    // Check if all items are matched
    if (newMatches.length === transports.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedTransport(null);
    setSelectedImpact(null);
  };

  // Check if a transport is already matched
  const isTransportMatched = (transportId) => {
    return matches.some(match => match.transportId === transportId);
  };

  // Check if an impact is already matched
  const isImpactMatched = (impactId) => {
    return matches.some(match => match.impactId === impactId);
  };

  // Get match result for a transport
  const getMatchResult = (transportId) => {
    const match = matches.find(m => m.transportId === transportId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Green Transportation Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Transport with Environmental Impact (${matches.length}/${transports.length} matched)`}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={transports.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === transports.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/sustainability/kids"
      maxScore={transports.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    
      nextGamePathProp="/student/sustainability/kids/badge-earth-guardian"
      nextGameIdProp="sustainability-kids-25">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Transportation Methods */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Transportation</h3>
              <div className="space-y-4">
                {transports.map(transport => (
                  <button
                    key={transport.id}
                    onClick={() => handleTransportSelect(transport)}
                    disabled={isTransportMatched(transport.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isTransportMatched(transport.id)
                        ? getMatchResult(transport.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedTransport?.id === transport.id
                          ? "bg-blue-500/50 border-2 border-blue-400"
                          : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{transport.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{transport.name}</h4>
                        <p className="text-white/80 text-sm">{transport.description}</p>
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
                  {selectedTransport 
                    ? `Selected: ${selectedTransport.name}` 
                    : "Select a Transport"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedTransport || !selectedImpact}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedTransport && selectedImpact
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{transports.length}</p>
                  <p>Matched: {matches.length}/{transports.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Environmental Impacts */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Environmental Impact</h3>
              <div className="space-y-4">
                {impacts.map(impact => (
                  <button
                    key={impact.id}
                    onClick={() => handleImpactSelect(impact)}
                    disabled={isImpactMatched(impact.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isImpactMatched(impact.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedImpact?.id === impact.id
                          ? "bg-purple-500/50 border-2 border-purple-400"
                          : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{impact.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{impact.name}</h4>
                        <p className="text-white/80 text-sm">{impact.description}</p>
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
                  You correctly matched {score} out of {transports.length} transportation methods with their environmental impacts!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Choosing greener transportation helps protect our planet!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {transports.length} methods correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about how each transportation method affects the environment!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleGreenTransportation;
