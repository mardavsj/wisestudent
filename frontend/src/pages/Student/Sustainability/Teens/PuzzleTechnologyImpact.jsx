import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const PuzzleTechnologyImpact = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  const gameId = "sustainability-teens-89";
  const games = getSustainabilityTeenGames({});
  const currentGameIndex = games.findIndex(game => game.id === gameId);
  const nextGame = games[currentGameIndex + 1];
  const nextGamePath = nextGame ? nextGame.path : "/games/sustainability/teens";
  const nextGameId = nextGame ? nextGame.id : null;

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [selectedTech, setSelectedTech] = useState(null);
  const [selectedImpact, setSelectedImpact] = useState(null);
  const [matches, setMatches] = useState([]);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  const technologies = [
    { id: 1, name: "Solar Panels", emoji: "☀️",  },
    { id: 2, name: "Wind Turbines", emoji: "💨",  },
    { id: 3, name: "Electric Vehicles", emoji: "🚗",  },
    { id: 4, name: "Smart Grids", emoji: "⚡",  },
    { id: 5, name: "LED Lighting", emoji: "💡",  }
  ];

  const impacts = [
    { id: 2, name: "Conserves Energy", emoji: "🔋",  },
    { id: 3, name: "Improves Air Quality", emoji: "💨",  },
    { id: 1, name: "Reduces Carbon Emissions", emoji: "🌍",  },
    { id: 5, name: "Promotes Sustainability", emoji: "🌱",  },
    { id: 4, name: "Saves Resources", emoji: "🌿",  },
  ];

  const correctMatches = {
    1: 1, // Solar Panels -> Reduces Carbon Emissions
    2: 2, // Wind Turbines -> Conserves Energy
    3: 3, // Electric Vehicles -> Improves Air Quality
    4: 4, // Smart Grids -> Saves Resources
    5: 5  // LED Lighting -> Promotes Sustainability
  };

  const handleTechSelect = (tech) => {
    if (gameFinished || isTechMatched(tech.id)) return;
    setSelectedTech(tech);
    setSelectedImpact(null);
  };

  const handleImpactSelect = (impact) => {
    if (gameFinished || !selectedTech || isImpactMatched(impact.id)) return;
    
    const newMatch = {
      techId: selectedTech.id,
      impactId: impact.id,
      isCorrect: correctMatches[selectedTech.id] === impact.id
    };

    const newMatches = [...matches, newMatch];
    setMatches(newMatches);

    resetFeedback();

    if (newMatch.isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    // Check if all items are matched
    if (newMatches.length === technologies.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedTech(null);
    setSelectedImpact(null);
  };

  // Check if a technology is already matched
  const isTechMatched = (techId) => {
    return matches.some(match => match.techId === techId);
  };

  // Check if an impact is already matched
  const isImpactMatched = (impactId) => {
    return matches.some(match => match.impactId === impactId);
  };

  // Get match result for a technology
  const getMatchResult = (techId) => {
    const match = matches.find(m => m.techId === techId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Technology Impact"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Technologies with Their Impact (${matches.length}/${technologies.length} matched)`}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={technologies.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === technologies.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/sustainability/teens"
      maxScore={technologies.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    
      nextGamePathProp="/student/sustainability/teens/startup-story"
      nextGameIdProp="sustainability-teens-90">
      <div className="space-y-8 max-w-6xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Technologies */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Green Technologies</h3>
              <div className="space-y-3">
                {technologies.map(tech => (
                  <div
                    key={tech.id}
                    onClick={() => handleTechSelect(tech)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      isTechMatched(tech.id)
                        ? getMatchResult(tech.id)
                          ? 'bg-green-500/30 border-green-400'
                          : 'bg-red-500/30 border-red-400'
                        : selectedTech?.id === tech.id
                        ? 'bg-blue-500/30 border-blue-400 ring-2 ring-blue-300'
                        : 'bg-white/10 border-white/30 hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{tech.emoji}</span>
                      <div>
                        <div className="text-white font-medium">{tech.name}</div>
                        <div className="text-white/70 text-sm">{tech.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Center - Connection Area */}
            <div className="flex items-center justify-center">
              <div className="text-white text-xl font-bold">→</div>
            </div>

            {/* Right column - Impacts */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Environmental Impact</h3>
              <div className="space-y-3">
                {impacts.map(impact => (
                  <div
                    key={impact.id}
                    onClick={() => handleImpactSelect(impact)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      isImpactMatched(impact.id)
                        ? 'bg-purple-500/30 border-purple-400'
                        : selectedImpact?.id === impact.id
                        ? 'bg-blue-500/30 border-blue-400 ring-2 ring-blue-300'
                        : 'bg-white/10 border-white/30 hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{impact.emoji}</span>
                      <div>
                        <div className="text-white font-medium">{impact.name}</div>
                        <div className="text-white/70 text-sm">{impact.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Puzzle Complete!</h2>
              <p className="text-white/90 mb-2">You matched {score}/{technologies.length} correctly</p>
              <p className="text-white/70 mb-6">Great job understanding technology's environmental impact!</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => navigate(nextGamePath)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  Next Challenge
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Matches display */}
        {matches.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-bold text-white mb-4">Your Matches</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matches.map((match, index) => {
                const tech = technologies.find(t => t.id === match.techId);
                const impact = impacts.find(i => i.id === match.impactId);
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 ${
                      match.isCorrect
                        ? 'bg-green-500/20 border-green-400'
                        : 'bg-red-500/20 border-red-400'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{tech?.emoji}</span>
                        <span className="text-white">{tech?.name}</span>
                      </div>
                      <span className="text-white">→</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-white">{impact?.name}</span>
                        <span className="text-xl">{impact?.emoji}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleTechnologyImpact;