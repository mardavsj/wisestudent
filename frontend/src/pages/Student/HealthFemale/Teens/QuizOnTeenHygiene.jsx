import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnTeenHygiene = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [coins, setCoins] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which helps skin health during puberty?",
      emoji: "🧴",
      options: [
        {
          id: "a",
          text: "Gentle wash with mild soap",
          emoji: "🧴",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignoring pimples completely",
          emoji: "❌",
          isCorrect: false
        },
        {
          id: "c",
          text: "Scrubbing vigorously with harsh soap",
          emoji: "🔥",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How often should you wash your hair during puberty?",
      emoji: "💇",
      options: [
        {
          id: "a",
          text: "Once a week regardless of oiliness",
          emoji: "📅",
          isCorrect: false
        },
        {
          id: "b",
          text: "Twice a day with strong shampoo",
          emoji: "🧼",
          isCorrect: false
        },
        {
          id: "c",
          text: "Every other day or daily if oily",
          emoji: "💇",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "What's the best approach to body odor during puberty?",
      emoji: "🛁",
      options: [
        {
          id: "a",
          text: "Using only perfume to mask smell",
          emoji: "🌸",
          isCorrect: false
        },
        {
          id: "b",
          text: "Regular bathing and clean clothes",
          emoji: "🛁",
          isCorrect: true
        },
        {
          id: "c",
          text: "Bathing only once a week",
          emoji: "🚿",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How should you care for your face during puberty?",
      emoji: "💧",
      options: [
        {
          id: "a",
          text: "Wash only when visibly dirty",
          emoji: "👀",
          isCorrect: false
        },
        {
          id: "b",
          text: "Wash with hot water and harsh soap",
          emoji: "🔥",
          isCorrect: false
        },
        {
          id: "c",
          text: "Wash twice daily with gentle cleanser",
          emoji: "💧",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "What's the best way to handle excessive sweating?",
      emoji: "👕",
      options: [
        {
          id: "a",
          text: "Apply deodorant once a week",
          emoji: "📅",
          isCorrect: false
        },
        {
          id: "b",
          text: "Avoid drinking water to reduce sweating",
          emoji: "❌",
          isCorrect: false
        },
        {
          id: "c",
          text: "Use antiperspirant and wear breathable clothes",
          emoji: "👕",
          isCorrect: true
        }
      ]
    }
  ];

  const handleAnswer = (optionId) => {
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === optionId)?.isCorrect;
    
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    setSelectedOption(optionId);
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        resetFeedback();
        setShowFeedback(false);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/student/health-female/teens/reflex-teen-hygiene");
  };

  return (
    <GameShell
      title="Quiz on Teen Hygiene"
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-42"
      gameType="health-female"
      totalLevels={10}
      currentLevel={2}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
    
      nextGamePathProp="/student/health-female/teens/reflex-teen-hygiene"
      nextGameIdProp="health-female-teen-43">
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
          </div>

          <div className="text-6xl mb-4 text-center">{questions[currentQuestion].emoji}</div>

          <p className="text-white text-lg mb-6 text-center">
            {questions[currentQuestion].text}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {questions[currentQuestion].options.map((option) => {
              let buttonClass = "bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white";
              
              if (showFeedback) {
                if (option.isCorrect) {
                  buttonClass = "bg-gradient-to-br from-green-500 to-emerald-600 text-white ring-4 ring-green-400";
                } else if (option.id === selectedOption) {
                  buttonClass = "bg-gradient-to-br from-red-500 to-rose-600 text-white ring-4 ring-red-400";
                } else {
                  buttonClass = "bg-gray-500/30 text-white";
                }
              } else if (option.id === selectedOption) {
                buttonClass = "bg-gradient-to-br from-blue-500 to-sky-600 text-white ring-4 ring-blue-400";
              }
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  disabled={showFeedback}
                  className={`p-6 rounded-2xl shadow-lg transition-all transform text-center ${buttonClass} ${showFeedback ? "cursor-not-allowed" : "hover:scale-105"}`}
                >
                  <div className="text-2xl mb-2">{option.emoji}</div>
                  <h4 className="font-bold text-base mb-2">{option.text}</h4>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default QuizOnTeenHygiene;