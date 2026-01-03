import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';

const PuzzleInnovators = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-84";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    // First, try to get from location.state (passed from GameCategoryPage)
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    // Fallback: find next game from game data
    try {
      const games = getBrainTeenGames({});
      const currentGame = games.find(g => g.id === gameId);
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
  }, [location.state, gameId]);
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [leftSelected, setLeftSelected] = useState(null);
  const [rightSelected, setRightSelected] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Left items (innovators)
  const leftItems = [
    { id: 1, text: "Wright Brothers", emoji: "🙂" },
    { id: 2, text: "Thomas Edison", emoji: "🤔" },
    { id: 3, text: "Marie Curie", emoji: "😄" },
    { id: 4, text: "Steve Jobs", emoji: "☺️" },
    { id: 5, text: "Einstein", emoji: "🤔" }
  ];

  // Right items (innovations) - manually ordered for varied correct positions
  const rightItems = [
    { id: 2, text: "Bulb", emoji: "💡" }, // Matches with "Thomas Edison" (position 1)
    { id: 3, text: "Radium", emoji: "⚛️" }, // Matches with "Marie Curie" (position 2)
    { id: 4, text: "iPhone", emoji: "📱" }, // Matches with "Steve Jobs" (position 3)
    { id: 5, text: "Relativity", emoji: "🌌" }, // Matches with "Einstein" (position 4)
    { id: 1, text: "Plane", emoji: "✈️" } // Matches with "Wright Brothers" (position 5)
  ];

  const correctPairs = {
    1: 1, // Wright Brothers → Plane (now at position 5)
    2: 2, // Thomas Edison → Bulb (now at position 1)
    3: 3, // Marie Curie → Radium (now at position 2)
    4: 4, // Steve Jobs → iPhone (now at position 3)
    5: 5  // Einstein → Relativity (now at position 4)
  };

  const handleLeftClick = (leftId) => {
    if (matchedPairs.includes(leftId) || showResult) return;
    if (leftSelected === leftId) {
      setLeftSelected(null);
    } else {
      setLeftSelected(leftId);
      if (rightSelected) {
        checkMatch(leftId, rightSelected);
      }
    }
  };

  const handleRightClick = (rightId) => {
    if (matchedPairs.includes(correctPairs[rightId]) || showResult) return;
    if (rightSelected === rightId) {
      setRightSelected(null);
    } else {
      setRightSelected(rightId);
      if (leftSelected) {
        checkMatch(leftSelected, rightId);
      }
    }
  };

  const checkMatch = (leftId, rightId) => {
    if (correctPairs[leftId] === rightId) {
      setMatchedPairs(prev => [...prev, leftId]);
      setScore(prev => prev + 1);
      resetFeedback();
      showCorrectAnswerFeedback(1, true);
      
      if (score + 1 === leftItems.length) {
        setTimeout(() => {
          setShowResult(true);
        }, 1000);
      }
    } else {
      resetFeedback();
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      setLeftSelected(null);
      setRightSelected(null);
    }, 500);
  };

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Puzzle: Innovators game completed! Score: ${score}/${leftItems.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId, leftItems.length]);

  return (
    <GameShell
      title="Puzzle: Innovators"
      score={score}
      currentLevel={matchedPairs.length}
      totalLevels={leftItems.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="brain"
      showGameOver={showResult}
      maxScore={leftItems.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
          <p className="text-white text-base md:text-lg mb-6 text-center">
            Match innovators with their innovations!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-center">
            {/* Left Column - Innovators */}
            <div className="space-y-3 md:space-y-4">
              {leftItems.map((item) => {
                const isMatched = matchedPairs.includes(item.id);
                const isSelected = leftSelected === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLeftClick(item.id)}
                    disabled={isMatched || showResult}
                    className={`w-full p-3 md:p-4 rounded-xl transition-all transform ${
                      isMatched
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 border-2 border-green-300 opacity-70"
                        : isSelected
                        ? "bg-gradient-to-r from-blue-600 to-cyan-700 border-2 border-blue-300 scale-105"
                        : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 border-2 border-transparent hover:scale-105"
                    } disabled:cursor-not-allowed disabled:transform-none`}
                  >
                    <div className="text-white font-bold text-sm md:text-base text-center">
                      <span className="text-xl md:text-2xl mr-2">{item.emoji}</span>
                      {item.text}
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Middle - Match Button */}
            <div className="flex justify-center">
              
             
            </div>
            
            {/* Right Column - Innovations */}
            <div className="space-y-3 md:space-y-4">
              {rightItems.map((item) => {
                const matchedLeftId = Object.keys(correctPairs).find(key => correctPairs[key] === item.id);
                const isMatched = matchedLeftId && matchedPairs.includes(Number(matchedLeftId));
                const isSelected = rightSelected === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleRightClick(item.id)}
                    disabled={isMatched || showResult}
                    className={`w-full p-3 md:p-4 rounded-xl transition-all transform ${
                      isMatched
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 border-2 border-green-300 opacity-70"
                        : isSelected
                        ? "bg-gradient-to-r from-blue-600 to-cyan-700 border-2 border-blue-300 scale-105"
                        : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 border-2 border-transparent hover:scale-105"
                    } disabled:cursor-not-allowed disabled:transform-none`}
                  >
                    <div className="text-white font-bold text-sm md:text-base text-center">
                      <span className="text-xl md:text-2xl mr-2">{item.emoji}</span>
                      {item.text}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleInnovators;
