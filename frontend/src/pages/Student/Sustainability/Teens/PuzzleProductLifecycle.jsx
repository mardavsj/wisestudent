import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const PuzzleProductLifecycle = () => {
  const location = useLocation();
  
  const gameData = getGameDataById("sustainability-teens-29");
  const gameId = gameData?.id || "sustainability-teens-29";
  
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for PuzzleProductLifecycle, using fallback ID");
  }
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedPairs, setSelectedPairs] = useState([]);
  const [userPairs, setUserPairs] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    try {
      const games = getSustainabilityTeenGames({});
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

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Puzzle: Product Lifecycle game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId]);

  const products = [
    { id: 'a', name: 'Plastic Bottle', emoji: '🥤' },
    { id: 'b', name: 'Old Clothes', emoji: '👕' },
    { id: 'c', name: 'Food Waste', emoji: '🍎' },
    { id: 'd', name: 'Broken Electronics', emoji: '📱' },
    { id: 'e', name: 'Newspaper', emoji: '📰' }
  ];

  const disposalMethods = [
    { id: '2', method: 'Donate', emoji: '🤝' },
    { id: '3', method: 'Compost', emoji: '🌱' },
    { id: '1', method: 'Recycle', emoji: '♻️' },
    { id: '5', method: 'Recycle Paper', emoji: '📄' },
    { id: '4', method: 'E-waste Facility', emoji: '🔋' },
  ];

  const correctPairs = [
    { productId: 'a', disposalId: '1' },
    { productId: 'b', disposalId: '2' },
    { productId: 'c', disposalId: '3' },
    { productId: 'd', disposalId: '4' },
    { productId: 'e', disposalId: '5' }
  ];

  const handleSelect = (type, id) => {
    if (selectedPairs.length === 0) {
      setSelectedPairs([{ type, id }]);
    } else if (selectedPairs.length === 1) {
      const firstSelection = selectedPairs[0];
      if (firstSelection.type !== type) {
        // Create a pair
        const newPair = {
          product: firstSelection.type === 'product' ? firstSelection.id : id,
          disposal: firstSelection.type === 'disposal' ? firstSelection.id : id
        };
        
        // Check if this pair already exists
        const pairExists = userPairs.some(pair => 
          pair.product === newPair.product && pair.disposal === newPair.disposal
        );
        
        if (!pairExists) {
          const updatedPairs = [...userPairs, newPair];
          setUserPairs(updatedPairs);
          
          // Check if it's correct
          const isCorrect = correctPairs.some(correctPair => 
            correctPair.productId === newPair.product && correctPair.disposalId === newPair.disposal
          );
          
          if (isCorrect) {
            showCorrectAnswerFeedback(1, true);
          }
        }
        
        setSelectedPairs([]);
      } else {
        // Same type selected again, replace the selection
        setSelectedPairs([{ type, id }]);
      }
    }
  };

  const isPairSelected = (productId, disposalId) => {
    return userPairs.some(pair => pair.product === productId && pair.disposal === disposalId);
  };

  const isProductSelected = (id) => {
    return selectedPairs.some(pair => pair.type === 'product' && pair.id === id);
  };

  const isDisposalSelected = (id) => {
    return selectedPairs.some(pair => pair.type === 'disposal' && pair.id === id);
  };

  const isCorrectPair = (productId, disposalId) => {
    return correctPairs.some(correctPair => 
      correctPair.productId === productId && correctPair.disposalId === disposalId
    );
  };

  const calculateScore = () => {
    let correctCount = 0;
    userPairs.forEach(pair => {
      if (isCorrectPair(pair.product, pair.disposal)) {
        correctCount++;
      }
    });
    return correctCount;
  };

  useEffect(() => {
    const currentScore = calculateScore();
    setScore(currentScore);
    
    // Check if all correct pairs are made
    if (currentScore === correctPairs.length) {
      setIsComplete(true);
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  }, [userPairs]);

  const resetGame = () => {
    setUserPairs([]);
    setSelectedPairs([]);
    setScore(0);
    setIsComplete(false);
    setShowResult(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="Puzzle: Product Lifecycle"
      score={score}
      subtitle={showResult ? "Puzzle Complete!" : "Match products with their sustainable disposal methods"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={correctPairs.length}
      currentLevel={score}
      maxScore={correctPairs.length}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    
      nextGamePathProp="/student/sustainability/teens/minimalism-story"
      nextGameIdProp="sustainability-teens-30">
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-8 max-w-6xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/80">Match products with disposal methods</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{correctPairs.length}</span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Products Column */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 text-center">Products</h3>
                  <div className="space-y-3">
                    {products.map(product => (
                      <div
                        key={product.id}
                        onClick={() => handleSelect('product', product.id)}
                        className={`p-4 rounded-xl cursor-pointer transition-all transform flex items-center space-x-3 ${
                          isProductSelected(product.id)
                            ? 'bg-blue-600 border-2 border-blue-300 scale-105'
                            : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105'
                        }`}
                      >
                        <span className="text-2xl">{product.emoji}</span>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Disposal Methods Column */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 text-center">Disposal Methods</h3>
                  <div className="space-y-3">
                    {disposalMethods.map(method => (
                      <div
                        key={method.id}
                        onClick={() => handleSelect('disposal', method.id)}
                        className={`p-4 rounded-xl cursor-pointer transition-all transform flex items-center space-x-3 ${
                          isDisposalSelected(method.id)
                            ? 'bg-blue-600 border-2 border-blue-300 scale-105'
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105'
                        }`}
                      >
                        <span className="text-2xl">{method.emoji}</span>
                        <span className="font-medium">{method.method}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Current Pairs */}
              {userPairs.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-white mb-3">Your Matches</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {userPairs.map((pair, index) => {
                      const product = products.find(p => p.id === pair.product);
                      const method = disposalMethods.find(m => m.id === pair.disposal);
                      const isCorrect = isCorrectPair(pair.product, pair.disposal);
                      
                      return (
                        <div
                          key={index}
                          className={`p-3 rounded-lg flex items-center justify-between ${
                            isCorrect 
                              ? 'bg-green-500/30 border border-green-400' 
                              : 'bg-red-500/20 border border-red-400'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span>{product?.emoji}</span>
                            <span className="text-sm">{product?.name}</span>
                          </div>
                          <span className="text-lg">→</span>
                          <div className="flex items-center space-x-2">
                            <span>{method?.emoji}</span>
                            <span className="text-sm">{method?.method}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="mt-6 text-center text-white/80 text-sm">
                Click on a product, then click on the disposal method you think is most sustainable for it.
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">Puzzle Complete!</h2>
            <p className="text-xl text-white">You matched all products with their sustainable disposal methods!</p>
            <p className="text-lg text-white">Final Score: {score} out of {correctPairs.length}</p>
            <div className="space-x-4">
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleProductLifecycle;