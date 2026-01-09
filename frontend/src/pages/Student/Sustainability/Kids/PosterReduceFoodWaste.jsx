import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PosterReduceFoodWaste = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "sustainability-kids-41";
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

  const stages = [
    {
      question: "Which poster best promotes reducing food waste?",
      posters: [
        {
          id: 1,
          title: "Waste More Food",
          
          emoji: "🍽️",
          isCorrect: false
        },
        {
          id: 2,
          title: "Eat All You Can Take",
          
          emoji: "🍽️",
          isCorrect: true
        },
        {
          id: 3,
          title: "Buy Extra Food",
        
          emoji: "🛒",
          isCorrect: false
        }
      ],
      correctFeedback: "Eat All You Can Take is the best message for reducing food waste!",
      explanation: "This poster reminds us to take only what we can eat!"
    },
    {
      question: "Which poster encourages meal planning?",
      posters: [
        {
          id: 1,
          title: "Cook Too Much",
          
          emoji: "🍳",
          isCorrect: false
        },
       
        {
          id: 3,
          title: "Buy Randomly",
          
          emoji: "🤷",
          isCorrect: false
        },
         {
          id: 2,
          title: "Plan Before You Shop",
          
          emoji: "📋",
          isCorrect: true
        },
      ],
      correctFeedback: "Plan Before You Shop promotes meal planning!",
      explanation: "Planning meals ahead helps reduce food waste!"
    },
    {
      question: "Which poster best shows proper food storage?",
      posters: [
        {
          id: 1,
          title: "Leave Food Out",
          
          emoji: "🌡️",
          isCorrect: false
        },
        {
          id: 2,
          title: "Store Food Properly",
          emoji: "📦",
          isCorrect: true
        },
        {
          id: 3,
          title: "Waste Food",
          emoji: "🍽️",
          isCorrect: false
        }
      ],
      correctFeedback: "Store Food Properly shows the importance of proper food storage!",
      explanation: "Proper storage helps food last longer and reduces waste!"
    },
    {
      question: "Which poster best promotes composting?",
      posters: [
        {
          id: 2,
          title: "Compost Food Scraps",
          emoji: "🌿",
          isCorrect: true
        },
        {
          id: 1,
          title: "Throw All Away",
          emoji: "🗑️",
          isCorrect: false
        },
        
        {
          id: 3,
          title: "Ignore Composting",
          
          emoji: "🤷",
          isCorrect: false
        }
      ],
      correctFeedback: "Compost Food Scraps promotes composting!",
      explanation: "Composting helps turn food scraps into nutrient-rich soil!"
    },
    {
      question: "Which poster best shows protecting our environment?",
      posters: [
        {
          id: 1,
          title: "Waste Food",
        
          emoji: "🍽️",
          isCorrect: false
        },
        
        {
          id: 3,
          title: "Ignore Waste",
          
          emoji: "🙈",
          isCorrect: false
        },
        {
          id: 2,
          title: "Reduce Food Waste",
          
          emoji: "🌍",
          isCorrect: true
        },
      ],
      correctFeedback: "Reduce Food Waste is the right choice for our planet!",
      explanation: "Reducing food waste helps protect our environment and saves resources!"
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
      title="Poster: Reduce Food Waste"
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
    
      nextGamePathProp="/student/sustainability/kids/journal-of-food-habits"
      nextGameIdProp="sustainability-kids-42">
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
                <div className="text-5xl mb-4">🍽️</div>
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
                  {currentStageData?.explanation || "Look for the poster that promotes food waste reduction."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterReduceFoodWaste;