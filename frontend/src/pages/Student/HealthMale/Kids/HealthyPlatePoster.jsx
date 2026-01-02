import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HealthyPlatePoster = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-16";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [currentStage, setCurrentStage] = useState(0);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stages = [
    {
      question: "Which poster shows a balanced healthy plate?",
      posters: [
        {
          id: 1,
          title: "All Pizza Plate",
         
          emoji: "🍕",
          isCorrect: false
        },
        {
          id: 2,
          title: "Half Fruits & Veggies",
          
          emoji: "🍎",
          isCorrect: true
        },
        {
          id: 3,
          title: "Meat Mountain",
          emoji: "🥩",
          isCorrect: false
        }
      ],
      correctFeedback: "Half Fruits & Veggies is the best choice!",
      explanation: "A healthy plate should be half fruits and vegetables for vitamins and fiber!"
    },
    {
      question: "Which poster encourages the best drink choice?",
      posters: [
        {
          id: 1,
          title: "Soda All Day",
          emoji: "🥤",
          isCorrect: false
        },
        {
          id: 3,
          title: "Juice Only",
          emoji: "🧃",
          isCorrect: false
        },
        {
          id: 2,
          title: "Water is Best",
          emoji: "💧",
          isCorrect: true
        }
      ],
      correctFeedback: "Water is Best is the right message!",
      explanation: "Water keeps you hydrated without extra sugar found in soda or juice!"
    },
    {
      question: "Which poster shows healthy snacking habits?",
      posters: [
        {
          id: 2,
          title: "Candy Mountain",
          emoji: "🍭",
          isCorrect: false
        },
        {
          id: 1,
          title: "Smart Snacks",
          emoji: "🥕",
          isCorrect: true
        },
        {
          id: 3,
          title: "Chip Champion",
          emoji: "🍟",
          isCorrect: false
        }
      ],
      correctFeedback: "Smart Snacks is the winner!",
      explanation: "Fruits and vegetables make great snacks that give you energy!"
    },
    {
      question: "Which poster teaches about a good breakfast?",
      posters: [
        {
          id: 2,
          title: "Power Breakfast",
          emoji: "🍳",
          isCorrect: true
        },
        {
          id: 3,
          title: "Donut Delight",
          emoji: "🍩",
          isCorrect: false
        },
        
        {
          id: 1,
          title: "Skip Breakfast",
          emoji: "🚫",
          isCorrect: false
        }
      ],
      correctFeedback: "Power Breakfast starts the day right!",
      explanation: "A nutritious breakfast gives you fuel to learn and play all morning!"
    },
    {
      question: "Which poster promotes trying new foods?",
      posters: [
        
        {
          id: 1,
          title: "Eat Same Food",
          emoji: "🍕",
          isCorrect: false
        },
        {
          id: 3,
          title: "No Green Food",
          emoji: "🚫",
          isCorrect: false
        },
        {
          id: 2,
          title: "Taste a Variety of Foods",
          emoji: "😋",
          isCorrect: true
        },
      ],
      correctFeedback: "Taste a variety of foods is the best advice!",
      explanation: "Eating a variety of colorful foods ensures you get many different vitamins!"
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
      // Show feedback for incorrect answer and move to next question
      showCorrectAnswerFeedback(0, false);
      
      // Check if this is the last stage
      const isLastStage = currentStage === stages.length - 1;
      
      if (isLastStage) {
        // Last stage - show result and game over modal
        setTimeout(() => {
          setShowResult(true);
        }, 1500);
      } else {
        // Move to next question after showing feedback
        setTimeout(() => {
          setCurrentStage(currentStage + 1);
          setSelectedPoster(null);
          setShowResult(false);
          resetFeedback();
        }, 1500);
      }
    }
  };

  const handleNext = () => {
    navigate("/games/health-male/kids");
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
      title="Poster: Healthy Plate"
      subtitle={`Question ${currentStage + 1} of ${stages.length}`}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={showResult && selectedPoster && isCorrect && !isLastStage}
      showGameOver={showResult && isLastStage && isCorrect}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={stages.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
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
                    className={`p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 ${selectedPoster === poster.id
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
                {/* Removed Try Again button to standardize behavior */}
                <p className="text-white/80 text-sm">
                  {currentStageData?.explanation || "Look for the poster that promotes healthy eating habits."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HealthyPlatePoster;
