import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SportsEnergyStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 1; // Default 1 coin per question
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const maxScore = 5;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const questions = [
  {
    id: 1,
    text: "After an intense sports session, you feel thirsty and tired. What should you drink?",
    options: [
      {
        id: "a",
        text: "Water with a pinch of salt",
        emoji: "💧",
        isCorrect: true
      },
      {
        id: "b",
        text: "Energy drink",
        emoji: "⚡",
        isCorrect: false
      },
      {
        id: "c",
        text: "Soda",
        emoji: "🥤",
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    text: "You finish playing badminton. What should you eat to recover?",
    options: [
      {
        id: "a",
        text: "Banana and nuts",
        emoji: "🍌",
        isCorrect: false
      },
      {
        id: "b",
        text: "Chips and cola",
        emoji: "🍟",
        isCorrect: false
      },
      {
        id: "c",
        text: "Yogurt with berries",
        emoji: "🫐",
        isCorrect: true
      }
    ]
  },
  {
    id: 3,
    text: "Before morning sports practice, what should you eat?",
    options: [
      {
        id: "a",
        text: "Light snack like idli or banana",
        emoji: "🍌",
        isCorrect: false
      },
      {
        id: "c",
        text: "Oats with milk",
        emoji: "🥣",
        isCorrect: true
      },
      {
        id: "b",
        text: "Heavy meal like dosa with sambar",
        emoji: "🍽️",
        isCorrect: false
      },
      
    ]
  },
  {
    id: 4,
    text: "During a long sports tournament, how often should you drink water?",
    options: [
      {
        id: "b",
        text: "Every 15–20 minutes",
        emoji: "⏰",
        isCorrect: true
      },
      {
        id: "a",
        text: "Only when you feel very thirsty",
        emoji: "🥵",
        isCorrect: false
      },
      
      {
        id: "c",
        text: "Drink a lot only during breaks",
        emoji: "🥤",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "After sports, which nutrient combination helps muscles recover best?",
    options: [
      {
        id: "a",
        text: "Healthy fats and vitamins",
        emoji: "🥑",
        isCorrect: false
      },
      {
        id: "b",
        text: "Only vitamins",
        emoji: "🍊",
        isCorrect: false
      },
      {
        id: "c",
        text: "Carbohydrates and protein",
        emoji: "🥪",
        isCorrect: true
      }
    ]
  }
];


  const handleChoice = (optionId) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: optionId,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === optionId)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === optionId)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/health-female/teens/junk-food-debate");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Sports Energy Story"
      score={coins}
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      showGameOver={showResult}
      gameId="health-female-teen-15"
      gameType="health-female"
      totalLevels={20}
      currentLevel={15}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/health-female/teens"
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
              </div>
              
              <h2 className="text-white text-base md:text-lg lg:text-xl mb-4 md:mb-6 text-center">
                {getCurrentQuestion().text}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl md:text-3xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-base md:text-xl mb-2">{option.text}</h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20 text-center flex-1 flex flex-col justify-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-4xl md:text-5xl mb-4">🏃</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Sports Nutrition Expert!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand the importance of proper sports nutrition!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  Great job! You know that water with salt replenishes electrolytes, yogurt with berries aids recovery, oats with milk fuel performance, regular hydration maintains energy, and carbohydrates with protein optimize muscle repair!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Proper sports nutrition is key to peak performance!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to choose the option that shows the best approach to sports nutrition and recovery.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SportsEnergyStory;