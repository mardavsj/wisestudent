import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GrowingUpPoster = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-26";
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
      question: "What happens to your body as you grow up?",
      posters: [
        
        {
          id: 2,
          title: "I stay the same",
          
          emoji: "⏸️",
          isCorrect: false
        },
        {
          id: 3,
          title: "I shrink",
          
          emoji: "📉",
          isCorrect: false
        },
        {
          id: 1,
          title: "My body changes as I grow",
         
          emoji: "👨",
          isCorrect: true
        },
      ],
      correctFeedback: "Great job! Your body changes as you grow up!",
      explanation: "As you grow up, your body changes in many ways. This is normal and healthy!"
    },
    {
      question: "Why might your voice sound different as you grow?",
      posters: [
        {
          id: 1,
          title: "My voice gets deeper",
          emoji: "🗣️",
          isCorrect: true
        },
        {
          id: 2,
          title: "I can't talk anymore",
          emoji: "🤐",
          isCorrect: false
        },
        {
          id: 3,
          title: "My voice sounds scary",
          emoji: "😱",
          isCorrect: false
        }
      ],
      correctFeedback: "Yes! Your voice gets deeper as you grow!",
      explanation: "As boys grow up, their voices get deeper. This is a normal part of growing up!"
    },
    {
      question: "What helps your body grow healthy and strong?",
      posters: [
        
        {
          id: 2,
          title: "Stay up all night",
          emoji: "🌙",
          isCorrect: false
        },
        {
          id: 3,
          title: "Only eat candy",
          emoji: "🍭",
          isCorrect: false
        },
        {
          id: 1,
          title: "Eat healthy foods & sleep well",
          emoji: "🍎",
          isCorrect: true
        },
      ],
      correctFeedback: "Perfect! Healthy food and sleep help you grow!",
      explanation: "Eating good food and getting enough sleep helps your body grow strong and healthy!"
    },
    {
      question: "What happens to your body as you get older?",
      posters: [
        {
          id: 1,
          title: "I might grow body hair",
          emoji: "🧔",
          isCorrect: true
        },
        {
          id: 2,
          title: "I should hide my body",
          emoji: "🙈",
          isCorrect: false
        },
        {
          id: 3,
          title: "I need to remove all hair",
          emoji: "🪒",
          isCorrect: false
        }
      ],
      correctFeedback: "That's right! Body hair is normal!",
      explanation: "As you get older, you might grow hair in new places. This is a normal part of growing up!"
    },
    {
      question: "How should you feel about your body as it changes?",
      posters: [
        
        {
          id: 2,
          title: "I should feel bad",
          emoji: "😔",
          isCorrect: false
        },
        {
          id: 3,
          title: "I should be scared",
          emoji: "😨",
          isCorrect: false
        },
        {
          id: 1,
          title: "I feel good about my body",
          emoji: "😊",
          isCorrect: true
        },
      ],
      correctFeedback: "Wonderful! It's good to feel positive about your body!",
      explanation: "It's important to feel good about your body as it changes. These changes are normal and healthy!"
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
      title="Poster: Growing Up"
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
                  {currentStageData?.explanation || "Look for the poster that promotes healthy growth."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GrowingUpPoster;
