import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PosterSaveEnergy = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "sustainability-kids-51";
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
      question: "Which poster best promotes saving energy?",
      posters: [
        {
          id: 1,
          title: "Waste More Energy",
          // description: "A poster encouraging energy waste",
          emoji: "⚡",
          isCorrect: false
        },
        
        {
          id: 3,
          title: "Use More Power",
          // description: "A poster encouraging more energy usage",
          emoji: "🪫",
          isCorrect: false
        },
        {
          id: 2,
          title: "Energy Smart, Earth Smart",
          // description: "A poster showing energy conservation",
          emoji: "🌍",
          isCorrect: true
        },
      ],
      correctFeedback: "Energy Smart, Earth Smart is the best message for energy conservation!",
      explanation: "This poster reminds us to be smart about energy use to protect our planet!"
    },
    {
      question: "Which poster encourages turning off lights?",
      posters: [
        {
          id: 1,
          title: "Keep All Lights On",
          // description: "A poster encouraging leaving lights on",
          emoji: "💡",
          isCorrect: false
        },
        {
          id: 2,
          title: "Turn Off When Not Needed",
          // description: "A poster showing light conservation",
          emoji: "💡",
          isCorrect: true
        },
        {
          id: 3,
          title: "Use More Light",
          // description: "A poster encouraging more lighting",
          emoji: "💡",
          isCorrect: false
        }
      ],
      correctFeedback: "Turn Off When Not Needed promotes energy conservation!",
      explanation: "Turning off lights when not needed saves energy and money!"
    },
    {
      question: "Which poster best shows unplugging devices?",
      posters: [
        {
          id: 2,
          title: "Unplug When Not in Use",
          // description: "A poster showing device conservation",
          emoji: "🔌",
          isCorrect: true
        },
        {
          id: 1,
          title: "Leave Everything Plugged",
          // description: "A poster showing devices staying plugged",
          emoji: "🔌",
          isCorrect: false
        },
        
        {
          id: 3,
          title: "Plug Everything In",
          // description: "A poster encouraging more plugging",
          emoji: "🔌",
          isCorrect: false
        }
      ],
      correctFeedback: "Unplug When Not in Use shows the importance of unplugging!",
      explanation: "Unplugging devices when not in use saves energy and reduces waste!"
    },
    {
      question: "Which poster best promotes energy conservation?",
      posters: [
        {
          id: 1,
          title: "Use More Energy",
          // description: "A poster encouraging energy waste",
          emoji: "⚡",
          isCorrect: false
        },
        {
          id: 2,
          title: "Conserve Energy Daily",
          // description: "A poster showing daily conservation",
          emoji: "💡",
          isCorrect: true
        },
        {
          id: 3,
          title: "Ignore Energy Use",
          // description: "A poster suggesting we don't worry about energy",
          emoji: "🤷",
          isCorrect: false
        }
      ],
      correctFeedback: "Conserve Energy Daily gives helpful guidance!",
      explanation: "Daily energy conservation helps protect our environment and save resources!"
    },
    {
      question: "Which poster best shows protecting our environment?",
      posters: [
        {
          id: 1,
          title: "Pollute More",
          // description: "A poster encouraging environmental damage",
          emoji: "🏭",
          isCorrect: false
        },
        
        {
          id: 3,
          title: "Ignore Environmental Issues",
          // description: "A poster suggesting we don't worry about the environment",
          emoji: "🙈",
          isCorrect: false
        },
        {
          id: 2,
          title: "Energy Wise, Earth Wise",
          // description: "A poster showing energy wisdom for Earth",
          emoji: "🌍",
          isCorrect: true
        },
      ],
      correctFeedback: "Energy Wise, Earth Wise is the right choice for our planet!",
      explanation: "Being wise about energy use helps preserve our beautiful planet for future generations!"
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
      title="Poster: Save Energy"
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
    
      nextGamePathProp="/student/sustainability/kids/journal-of-transport"
      nextGameIdProp="sustainability-kids-52">
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
                <div className="text-5xl mb-4">💡</div>
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
                  {currentStageData?.explanation || "Look for the poster that promotes energy conservation."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterSaveEnergy;