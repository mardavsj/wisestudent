import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnReproductiveBasics = () => {
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
      text: "Which organ in the female body releases eggs?",
      emoji: "🥚",
      options: [
        
        {
          id: "b",
          text: "Stomach",
          emoji: "🍽️",
          isCorrect: false
        },
        {
          id: "a",
          text: "Ovaries",
          emoji: "🧧",
          isCorrect: true
        },
        {
          id: "c",
          text: "Heart",
          emoji: "❤️",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is the name of the monthly process where the uterus sheds its lining?",
      emoji: "🩸",
      options: [
       
        {
          id: "b",
          text: "Digestion",
          emoji: "🍽️",
          isCorrect: false
        },
        {
          id: "c",
          text: "Respiration",
          emoji: "💨",
          isCorrect: false
        },
         {
          id: "a",
          text: "Menstruation",
          emoji: "🔴",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "Which hormone is primarily responsible for female reproductive development?",
      emoji: "♀️",
      options: [
        {
          id: "a",
          text: "Estrogen",
          emoji: "♀️",
          isCorrect: true
        },
        {
          id: "b",
          text: "Testosterone",
          emoji: "♂️",
          isCorrect: false
        },
        {
          id: "c",
          text: "Insulin",
          emoji: "💉",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How often does ovulation typically occur in a regular menstrual cycle?",
      emoji: "📅",
      options: [
        
        {
          id: "b",
          text: "Every week",
          emoji: "🔁",
          isCorrect: false
        },
        {
          id: "a",
          text: "Every month",
          emoji: "🕧",
          isCorrect: true
        },
        {
          id: "c",
          text: "Every day",
          emoji: "☀️",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What is the primary function of the fallopian tubes?",
      emoji: "🧪",
      options: [
        {
          id: "a",
          text: "To transport eggs from ovaries to uterus",
          emoji: "🥚",
          isCorrect: true
        },
        {
          id: "b",
          text: "To produce hormones",
          emoji: "🏭",
          isCorrect: false
        },
        {
          id: "c",
          text: "To store urine",
          emoji: "🚽",
          isCorrect: false
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
    navigate("/student/health-female/teens/reflex-teen-awareness");
  };

  return (
    <GameShell
      title="Quiz on Reproductive Basics"
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-32"
      gameType="health-female"
      totalLevels={40}
      currentLevel={32}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
    
      nextGamePathProp="/student/health-female/teens/reflex-teen-awareness"
      nextGameIdProp="health-female-teen-33">
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

export default QuizOnReproductiveBasics;