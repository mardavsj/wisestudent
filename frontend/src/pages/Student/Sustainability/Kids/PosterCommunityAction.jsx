import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const PosterCommunityAction = () => {
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
      const currentGame = games.find(g => g.id === "sustainability-kids-91");
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
  const gameId = "sustainability-kids-91";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 1;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const [currentStage, setCurrentStage] = useState(0);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Define stages with their own unique posters for each question
  const stages = [
    {
      question: "Which poster best promotes community action?",
      posters: [
        {
          id: 1,
          title: "Together We Can",
          
          emoji: "🌍",
          isCorrect: true
        },
        {
          id: 2,
          title: "Me First",
          emoji: "👤",
          isCorrect: false
        },
        {
          id: 3,
          title: "Ignore Others",
          emoji: "🚫",
          isCorrect: false
        }
      ],
      correctFeedback: "Together We Can promotes community action!",
      explanation: "Working together makes a big difference in creating positive change!"
    },
    {
      question: "Which poster best represents working together?",
      posters: [
       
        {
          id: 2,
          title: "Go It Alone",
          
          emoji: "🚶",
          isCorrect: false
        },
        {
          id: 3,
          title: "Work Alone",
          
          emoji: "👤",
          isCorrect: false
        },
         {
          id: 1,
          title: "Teamwork Makes the Dream Work",
          
          emoji: "🤝",
          isCorrect: true
        },
      ],
      correctFeedback: "Teamwork Makes the Dream Work shows great collaboration!",
      explanation: "When people work together, they can achieve much more than alone!"
    },
    {
      question: "Which poster shows people helping each other?",
      posters: [
        
        {
          id: 2,
          title: "Self-Reliance Only",
          
          emoji: "💪",
          isCorrect: false
        },
        {
          id: 1,
          title: "Helping Hands",
          
          emoji: "🤝",
          isCorrect: true
        },
        {
          id: 3,
          title: "Refuse Help",
          
          emoji: "❌",
          isCorrect: false
        }
      ],
      correctFeedback: "Helping Hands shows people supporting each other!",
      explanation: "Supporting one another strengthens our communities!"
    },
    {
      question: "Which poster shows community involvement?",
      posters: [
        {
          id: 1,
          title: "Join the Movement",
          // description: "A poster encouraging participation",
          emoji: "🏃",
          isCorrect: true
        },
        {
          id: 2,
          title: "Stay on the Sidelines",
          // description: "A poster showing disengagement",
          emoji: "🚶‍♂️",
          isCorrect: false
        },
        {
          id: 3,
          title: "Stay Disengaged",
          // description: "A poster promoting passive behavior",
          emoji: "😴",
          isCorrect: false
        }
      ],
      correctFeedback: "Join the Movement promotes community involvement!",
      explanation: "Active participation creates stronger, more vibrant communities!"
    },
    {
      question: "Which poster represents community action?",
      posters: [
       
        {
          id: 2,
          title: "Individual Focus",
          // description: "A poster focusing on personal goals",
          emoji: "👤",
          isCorrect: false
        },
        {
          id: 3,
          title: "Work Alone",
          // description: "A poster showing individual effort",
          emoji: "👤",
          isCorrect: false
        },
         {
          id: 1,
          title: "Community Action Matters",
          // description: "A poster highlighting collective effort",
          emoji: "🌍",
          isCorrect: true
        },
      ],
      correctFeedback: "Community Action Matters represents community action!",
      explanation: "Collective efforts can create meaningful change in our communities!"
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
      title="Poster: Community Action"
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}` : "Poster Selection Complete!"}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      score={coins}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      maxScore={stages.length}
      showConfetti={showResult && coins === stages.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    
      nextGamePathProp="/student/sustainability/kids/journal-of-community-help"
      nextGameIdProp="sustainability-kids-92">
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
                  {currentStageData?.explanation || "Look for the poster that promotes good community habits."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterCommunityAction;