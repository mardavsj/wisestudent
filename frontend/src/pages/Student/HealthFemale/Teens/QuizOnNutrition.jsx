import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnNutrition = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { showCorrectAnswerFeedback, resetFeedback, flashPoints } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which combination best supports healthy skin and energy?",
      emoji: "🍎",
      options: [
        {
          id: "a",
          text: "Only chips",
          emoji: "🍟",
          // description: "Chips lack nutrients and can cause skin issues",
          isCorrect: false
        },
        {
          id: "b",
          text: "Fruits and water",
          emoji: "🍎",
          // description: "Fruits provide vitamins and water keeps skin hydrated",
          isCorrect: true
        },
        {
          id: "c",
          text: "Soda and candy",
          emoji: "🥤",
          // description: "High sugar content can cause skin breakouts",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which nutrient is most important for building strong bones?",
      emoji: "🥛",
      options: [
        {
          id: "a",
          text: "Calcium",
          emoji: "🥛",
          // description: "Calcium is essential for bone health and strength",
          isCorrect: true
        },
        {
          id: "b",
          text: "Sugar",
          emoji: "🍬",
          // description: "Sugar doesn't contribute to bone strength",
          isCorrect: false
        },
        {
          id: "c",
          text: "Salt",
          emoji: "🧂",
          // description: "Excess salt can actually weaken bones",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What should you eat before sports or exercise?",
      emoji: "🏋️‍♀️",
      options: [
        {
          id: "a",
          text: "Heavy meal with lots of fats",
          emoji: "🍖",
          // description: "Heavy meals slow you down during exercise",
          isCorrect: false
        },
        {
          id: "b",
          text: "Nothing at all",
          emoji: "🚫",
          // description: "No fuel means poor performance and fatigue",
          isCorrect: false
        },
        {
          id: "c",
          text: "Light snack with carbs and protein",
          emoji: "🍌",
          // description: "Provides energy without weighing you down",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Which food group provides the most energy for daily activities?",
      emoji: "🍚",
      options: [
        {
          id: "a",
          text: "Fats",
          emoji: "🧀",
          // description: "Fats are important but not the primary energy source",
          isCorrect: false
        },
        {
          id: "b",
          text: "Carbohydrates",
          emoji: "🍚",
          // description: "Carbs are the body's primary energy source",
          isCorrect: true
        },
        {
          id: "c",
          text: "Vitamins",
          emoji: "💊",
          // description: "Vitamins support functions but don't provide energy",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why are proteins important for teen girls?",
      emoji: "🧬",
      options: [
        {
          id: "a",
          text: "For growth, repair, and hormone production",
          emoji: "🧬",
          // description: "Proteins support growth, tissue repair, and hormones during puberty",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only for building muscles",
          emoji: "💪",
          // description: "Proteins do more than just build muscles",
          isCorrect: false
        },
        {
          id: "c",
          text: "To gain weight quickly",
          emoji: "⚖️",
          // description: "Proteins support healthy growth, not just weight gain",
          isCorrect: false
        }
      ]
    }
  ];

  const handleAnswer = (optionId) => {
    if (showFeedback || gameFinished) return;
    
    setSelectedOption(optionId);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const selectedOptionData = currentQuestionData.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOptionData?.isCorrect || false;
    
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
        resetFeedback();
      } else {
        setGameFinished(true);
      }
    }, isCorrect ? 1000 : 800);
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/student/health-female/teens/reflex-food-check");
  };

  return (
    <GameShell
      title="Quiz on Nutrition"
      subtitle={gameFinished ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-12"
      gameType="health-female"
      totalLevels={20}
      currentLevel={12}
      showConfetti={gameFinished}
      backPath="/games/health-female/teens"
      flashPoints={flashPoints}
    
      nextGamePathProp="/student/health-female/teens/reflex-food-check"
      nextGameIdProp="health-female-teen-13">
      <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {!gameFinished && questions[currentQuestion] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
          </div>

          <div className="text-6xl mb-4 text-center">{getCurrentQuestion().emoji}</div>

          <p className="text-white text-lg md:text-xl mb-6 text-center">
            {questions[currentQuestion].text}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {questions[currentQuestion].options.map(option => {
              const isSelected = selectedOption === option.id;
              const showCorrect = showFeedback && option.isCorrect;
              const showIncorrect = showFeedback && isSelected && !option.isCorrect;
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  disabled={showFeedback}
                  className={`p-6 rounded-2xl shadow-lg transition-all transform text-center ${
                    showCorrect
                      ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                      : showIncorrect
                      ? "bg-red-500/20 border-2 border-red-400 opacity-75"
                      : isSelected
                      ? "bg-blue-600 border-2 border-blue-300 scale-105"
                      : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                  } ${showFeedback ? "cursor-not-allowed" : ""}`}
                >
                  <div className="text-2xl mb-2">{option.emoji}</div>
                  <h4 className="font-bold text-base mb-2">{option.text}</h4>
                </button>
              );
            })}
          </div>
          
          {showFeedback && (
            <div className={`rounded-lg p-5 mt-6 ${
              questions[currentQuestion].options.find(opt => opt.id === selectedOption)?.isCorrect
                ? "bg-green-500/20"
                : "bg-red-500/20"
            }`}>
              <p className="text-white whitespace-pre-line">
                {questions[currentQuestion].options.find(opt => opt.id === selectedOption)?.isCorrect
                  ? "Great job! That's exactly right! 🎉"
                  : "Not quite right. Try again next time!"}
              </p>
            </div>
          )}
        </div>
      </div>
    ) : null}
  </div>
</GameShell>
  );
};

export default QuizOnNutrition;