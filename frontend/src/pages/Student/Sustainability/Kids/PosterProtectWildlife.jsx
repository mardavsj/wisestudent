import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const PosterProtectWildlife = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "sustainability-kids-61";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentStage, setCurrentStage] = useState(0);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    try {
      const games = getSustainabilityKidsGames({});
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

  const stages = [
    {
      question: "Which poster best promotes protecting wildlife?",
      posters: [
        {
          id: 1,
          title: "Harm Wildlife",
          // description: "A poster showing harming animals",
          emoji: "🏹",
          isCorrect: false
        },
        {
          id: 2,
          title: "Animals Need Our Help",
          // description: "A poster showing care and protection for animals",
          emoji: "🐾",
          isCorrect: true
        },
        {
          id: 3,
          title: "Ignore Wildlife",
          // description: "A poster showing ignoring animals",
          emoji: "😴",
          isCorrect: false
        }
      ],
      correctFeedback: "Animals Need Our Help is the perfect message for wildlife protection!",
      explanation: "This poster reminds us to care for and protect animals in their natural habitats!"
    },
    {
      question: "Which poster encourages respecting animal homes?",
      posters: [
         {
          id: 2,
          title: "Respect Animal Homes",
          // description: "A poster showing protection of animal habitats",
          emoji: "🏠",
          isCorrect: true
        },
        {
          id: 1,
          title: "Destroy Nests",
          // description: "A poster showing destroying animal homes",
          emoji: "💣",
          isCorrect: false
        },
       
        {
          id: 3,
          title: "Ignore Habitats",
          // description: "A poster suggesting to ignore animal homes",
          emoji: "🙈",
          isCorrect: false
        }
      ],
      correctFeedback: "Respect Animal Homes promotes habitat protection!",
      explanation: "Protecting animal homes helps wildlife survive and thrive!"
    },
    {
      question: "Which poster best shows helping injured animals?",
      posters: [
        {
          id: 1,
          title: "Leave Injured Animals",
          // description: "A poster showing abandoning hurt animals",
          emoji: "🚶",
          isCorrect: false
        },
        {
          id: 2,
          title: "Help Injured Wildlife",
          // description: "A poster showing care for hurt animals",
          emoji: "🐾",
          isCorrect: true
        },
        {
          id: 3,
          title: "Avoid Wildlife",
          // description: "A poster showing avoiding all animals",
          emoji: "🚫",
          isCorrect: false
        }
      ],
      correctFeedback: "Help Injured Wildlife shows how to care for animals in need!",
      explanation: "Helping injured animals shows compassion and care for wildlife!"
    },
    {
      question: "Which poster best promotes wildlife conservation?",
      posters: [
        {
          id: 1,
          title: "Hunt Wildlife",
          // description: "A poster showing hunting animals",
          emoji: "🔫",
          isCorrect: false
        },
       
        {
          id: 3,
          title: "Capture Wildlife",
          // description: "A poster showing capturing animals",
          emoji: "📷",
          isCorrect: false
        },
         {
          id: 2,
          title: "Protect Endangered Species",
          // description: "A poster showing conservation efforts",
          emoji: "🌍",
          isCorrect: true
        },
      ],
      correctFeedback: "Protect Endangered Species gives important conservation guidance!",
      explanation: "Conserving wildlife helps preserve biodiversity for future generations!"
    },
    {
      question: "Which poster best shows coexisting with wildlife?",
      posters: [
        {
          id: 2,
          title: "Live in Harmony with Nature",
          // description: "A poster showing peaceful coexistence with animals",
          emoji: "🌿",
          isCorrect: true
        },
        {
          id: 1,
          title: "Compete with Wildlife",
          // description: "A poster showing conflict with animals",
          emoji: "⚔️",
          isCorrect: false
        },
        
        {
          id: 3,
          title: "Dominate Nature",
          // description: "A poster showing human dominance over animals",
          emoji: "👑",
          isCorrect: false
        }
      ],
      correctFeedback: "Live in Harmony with Nature is the right approach for our planet!",
      explanation: "Coexisting with wildlife helps maintain natural ecosystems and biodiversity!"
    }
  ];

  const currentStageData = stages[currentStage];
  const posters = currentStageData?.posters || [];

  const handlePosterSelect = (poster) => {
    setSelectedPoster(poster.id);
    
    if (poster.isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
      
      // Check if this is the last stage
      const isLastStage = currentStage === stages.length - 1;
      
      if (isLastStage) {
        // Last stage - show result and game over modal
        setShowResult(true);
      } else {
        // Automatically move to next question after showing feedback
        setTimeout(() => {
          setCurrentStage(currentStage + 1);
          setSelectedPoster(null);
          setShowResult(false);
          resetFeedback();
        }, 1500);
      }
    } else {
      // For incorrect answer, still show feedback but allow retry
      showCorrectAnswerFeedback(0, false);
      
      // Still move to next question after delay, just like correct answers
      const isLastStage = currentStage === stages.length - 1;
      
      if (isLastStage) {
        setShowResult(true);
      } else {
        setTimeout(() => {
          setCurrentStage(currentStage + 1);
          setSelectedPoster(null);
          setShowResult(false);
          resetFeedback();
        }, 1500);
      }
    }
  };

  const handleTryAgain = () => {
    setSelectedPoster(null);
    setShowResult(false);
    resetFeedback();
  };

  const isLastStage = currentStage === stages.length - 1;
  const selectedPosterData = selectedPoster ? posters.find(p => p.id === selectedPoster) : null;
  const isCorrect = selectedPosterData?.isCorrect || false;

  return (
    <GameShell
      title="Poster: Protect Wildlife"
      subtitle={`Question ${currentStage + 1} of ${stages.length}`}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult && isLastStage && isCorrect}
      score={coins}
      gameId={gameId}
      gameType="sustainability"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={stages.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    
      nextGamePathProp="/student/sustainability/kids/journal-nature-care"
      nextGameIdProp="sustainability-kids-62">
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-xl font-bold mb-6 text-center">
                Question {currentStage + 1}: {currentStageData?.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {posters.map(poster => (
                  <button
                    key={poster.id}
                    onClick={() => handlePosterSelect(poster)}
                    disabled={showResult}
                    className={`p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 ${
                      selectedPoster === poster.id
                        ? "ring-4 ring-yellow-400 bg-gradient-to-r from-blue-500 to-indigo-600"
                        : "bg-gradient-to-r from-green-500 to-emerald-600"
                    } ${showResult ? "opacity-75 cursor-not-allowed" : "hover:scale-105"}`}
                  >
                    <div className="text-4xl mb-4 text-center">{poster.emoji}</div>
                    <h3 className="font-bold text-xl text-white mb-2 text-center">{poster.title}</h3>
                    <p className="text-white/90 text-center">{poster.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {isCorrect ? (
              <div>
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold text-white mb-4">Creative Choice!</h3>
                <p className="text-white/90 text-lg mb-4">
                  {currentStageData?.correctFeedback}
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+1 Coin</span>
                </div>
                <p className="text-white/80 mb-4">
                  {currentStageData?.explanation}
                </p>
                {!isLastStage && (
                  <p className="text-white/70 text-sm mt-4">
                    Question {currentStage + 1} of {stages.length} completed!
                  </p>
                )}
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">🤔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Think About It!</h3>
                <p className="text-white/90 text-lg mb-4">
                  {currentStageData?.correctFeedback || "That's not quite right. Try again!"}
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Continue
                </button>
                <p className="text-white/80 text-sm">
                  {currentStageData?.explanation || "Look for the poster that promotes good wildlife protection habits."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterProtectWildlife;