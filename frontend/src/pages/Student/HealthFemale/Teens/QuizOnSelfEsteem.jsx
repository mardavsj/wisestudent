import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnSelfEsteem = () => {
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
      text: "Which approach builds confidence effectively?",
      emoji: "😊",
      options: [
        {
          id: "a",
          text: "Positive self-talk and self-acceptance",
          emoji: "👍",
          isCorrect: true
        },
        {
          id: "b",
          text: "Negative comparisons with others",
          emoji: "😞",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoiding challenges to prevent failure",
          emoji: "🏃",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is the benefit of setting realistic goals?",
      emoji: "🎯",
      options: [
        {
          id: "a",
          text: "They are easier to abandon",
          emoji: "🗑️",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "They prevent any progress",
          emoji: "🛑",
          isCorrect: false
        },
         {
          id: "b",
          text: "Achieving them builds genuine confidence",
          emoji: "🎳",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "How should you handle mistakes?",
      emoji: "📈",
      options: [
        {
          id: "a",
          text: "View them as personal failures",
          emoji: "❌",
          isCorrect: false
        },
        {
          id: "b",
          text: "Learn from them as growth opportunities",
          emoji: "💡",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore them completely",
          emoji: "🙈",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What role do supportive relationships play in self-esteem?",
      emoji: "🤗",
      options: [
        {
          id: "a",
          text: "They create dependency and weakness",
          emoji: "🧍",
          isCorrect: false
        },
        {
          id: "b",
          text: "They provide encouragement and validation",
          emoji: "❤️",
          isCorrect: true
        },
        {
          id: "c",
          text: "They are unnecessary for self-worth",
          emoji: "😔",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why is self-compassion important?",
      emoji: "🧘",
      options: [
        {
          id: "a",
          text: "It makes you complacent and lazy",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "b",
          text: "It prevents you from improving",
          emoji: "📉",
          isCorrect: false
        },
        {
          id: "c",
          text: "It reduces self-criticism and promotes resilience",
          emoji: "🙂‍↕️",
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
    navigate("/student/health-female/teens/reflex-confidence-check");
  };

  return (
    <GameShell
      title="Quiz on Self-Esteem"
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-62"
      gameType="health-female"
      totalLevels={10}
      currentLevel={2}
      showConfetti={gameFinished || showAnswerConfetti}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
    
      nextGamePathProp="/student/health-female/teens/reflex-confidence-check"
      nextGameIdProp="health-female-teen-63">
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

export default QuizOnSelfEsteem;