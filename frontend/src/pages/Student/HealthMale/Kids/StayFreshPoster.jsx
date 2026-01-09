import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const StayFreshPoster = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-6";
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
      question: "Which poster shows the best way to stay clean and fresh?",
      posters: [
       
        {
          id: 2,
          title: "Only bath on weekends",
          
          emoji: "😴",
          isCorrect: false
        },
         {
          id: 1,
          title: "Take a bath every day",
          
          emoji: "🛁",
          isCorrect: true
        },
        {
          id: 3,
          title: "Just use cologne",
          emoji: "💨",
          isCorrect: false
        }
      ],
      correctFeedback: "Great choice! Daily baths keep you clean and fresh!",
      explanation: "Taking a bath every day washes away dirt and germs from your body!"
    },
    {
      question: "Which poster shows the best way to dress clean?",
      posters: [
        {
          id: 1,
          title: "Wear yesterday's clothes",
          
          emoji: "👕",
          isCorrect: false
        },
        {
          id: 3,
          title: "Wear wet clothes",
          
          emoji: "🌧️",
          isCorrect: false
        },
        {
          id: 2,
          title: "Wear fresh, clean clothes",
          
          emoji: "👕",
          isCorrect: true
        }
      ],
      correctFeedback: "Perfect! Fresh clothes keep you feeling clean!",
      explanation: "Wearing clean clothes every day helps you stay fresh and healthy!"
    },
    {
      question: "Which poster shows the best way to take care of your teeth?",
      posters: [
         {
          id: 2,
          title: "Brush teeth twice daily",
          
          emoji: "🦷",
          isCorrect: true
        },
        {
          id: 1,
          title: "Eat candy all day",
        
          emoji: "🍭",
          isCorrect: false
        },
       
        {
          id: 3,
          title: "Skip brushing",
       
          emoji: "😬",
          isCorrect: false
        }
      ],
      correctFeedback: "Excellent! Brushing twice daily keeps teeth healthy!",
      explanation: "Brushing your teeth morning and night keeps them strong and white!"
    },
    {
      question: "Which poster shows the best way to keep hands clean?",
      posters: [
        {
          id: 2,
          title: "Lick your fingers",
         
          emoji: "👅",
          isCorrect: false
        },
        {
          id: 3,
          title: "Wash hands with soap",
        
          emoji: "🧼",
          isCorrect: true
        },
        {
          id: 1,
          title: "Wipe on your shirt",
         
          emoji: "👕",
          isCorrect: false
        }
      ],
      correctFeedback: "Right! Washing hands with soap gets rid of germs!",
      explanation: "Soap and water for 20 seconds kills the germs on your hands!"
    },
    {
      question: "Which poster shows the best way to look and feel fresh?",
      posters: [
        {
          id: 2,
          title: "Comb your hair and look neat",
          
          emoji: "💇",
          isCorrect: true
        },
        {
          id: 1,
          title: "Keep messy, uncombed hair",
          
          emoji: "🪮",
          isCorrect: false
        },
        {
          id: 3,
          title: "Wear muddy shoes",
        
          emoji: "🥾",
          isCorrect: false
        }
      ],
      correctFeedback: "Perfect! Looking neat makes you feel fresh and confident!",
      explanation: "Good grooming habits make you feel great and look your best!"
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
      title="Poster: Stay Fresh"
      subtitle={`Question ${currentStage + 1} of ${stages.length}`}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={showResult && selectedPoster && isCorrect && !isLastStage}
      showGameOver={showResult && isLastStage && isCorrect}
      score={coins}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/hygiene-journal"
      nextGameIdProp="health-male-kids-7"
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
                <h3 className="text-2xl font-bold text-white mb-4">Fresh Choice!</h3>
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
                  {currentStageData?.explanation || "Look for the poster that shows good hygiene."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default StayFreshPoster;

