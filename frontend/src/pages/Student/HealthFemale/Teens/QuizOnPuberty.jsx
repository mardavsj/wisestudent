import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnPuberty = () => {
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
  const [showAnswerConfetti, setShowAnswerConfetti] = useState(false);
  const { flashPoints, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
  {
    id: 1,
    text: "Which is a puberty sign in girls?",
    emoji: "👩‍🦱",
    options: [
      
      {
        id: "b",
        text: "Breast development",
        emoji: "🤱",
        isCorrect: false
      },
      {
        id: "a",
        text: "Menstruation",
        emoji: "🩸",
        isCorrect: true
      },
      {
        id: "c",
        text: "Voice deepening",
        emoji: "🎤",
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    text: "At what age does puberty typically begin for girls?",
    emoji: "📅",
    options: [
      {
        id: "c",
        text: "It varies from person to person",
        emoji: "🌈",
        isCorrect: true
      },
      {
        id: "a",
        text: "8–13 years",
        emoji: "📅",
        isCorrect: false
      },
      {
        id: "b",
        text: "14–16 years",
        emoji: "⏰",
        isCorrect: false
      },
      
    ]
  },
  {
    id: 3,
    text: "What hormone triggers puberty in girls?",
    emoji: "💊",
    options: [
      {
        id: "a",
        text: "Testosterone",
        emoji: "🧪",
        isCorrect: false
      },
      {
        id: "b",
        text: "Insulin",
        emoji: "💉",
        isCorrect: false
      },
      {
        id: "c",
        text: "Estrogen",
        emoji: "💊",
        isCorrect: true
      }
    ]
  },
  {
    id: 4,
    text: "Which physical change happens last during female puberty?",
    emoji: "📏",
    options: [
      
      {
        id: "b",
        text: "Menstruation",
        emoji: "🩸",
        isCorrect: false
      },
      {
        id: "a",
        text: "Breast development",
        emoji: "🤱",
        isCorrect: true
      },
      {
        id: "c",
        text: "Height growth spurt",
        emoji: "📏",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "How long does female puberty typically last?",
    emoji: "⏳",
    options: [
      {
        id: "a",
        text: "2–3 years",
        emoji: "⏱️",
        isCorrect: false
      },
      {
        id: "b",
        text: "4–5 years",
        emoji: "📅",
        isCorrect: false
      },
      {
        id: "c",
        text: "It varies from person to person",
        emoji: "🌸",
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
      setShowAnswerConfetti(true);
    }
    
    setSelectedOption(optionId);
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        resetFeedback();
        setShowFeedback(false);
        setShowAnswerConfetti(false);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/student/health-female/teens/reflex-puberty-basics");
  };

  return (
    <GameShell
      title="Quiz on Puberty"
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-22"
      gameType="health-female"
      totalLevels={30}
      currentLevel={22}
      showConfetti={gameFinished || showAnswerConfetti}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
    >
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

export default QuizOnPuberty;