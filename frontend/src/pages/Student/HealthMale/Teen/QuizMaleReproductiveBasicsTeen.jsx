import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizMaleReproductiveBasicsTeen = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which organ produces sperm in males?",
      options: [
        {
          id: "a",
          text: "Testes",
          emoji: "🫐",
          isCorrect: true
        },
        {
          id: "b",
          text: "Lungs",
          emoji: "🫁",
          isCorrect: false
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
      text: "What is the main function of the penis during reproduction?",
      options: [
        {
          id: "a",
          text: "Produce sperm",
          emoji: "🏭",
          isCorrect: false
        },
        {
          id: "b",
          text: "Transfer sperm",
          emoji: "🔄",
          isCorrect: true
        },
        {
          id: "c",
          text: "Store urine",
          emoji: "💧",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What causes puberty changes in teen boys?",
      options: [
        {
          id: "a",
          text: "Exercise",
          emoji: "💪",
          isCorrect: false
        },
        {
          id: "b",
          text: "Diet changes",
          emoji: "🍎",
          isCorrect: false
        },
        {
          id: "c",
          text: "Hormones",
          emoji: "🧬",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Where does sperm production happen?",
      options: [
        {
          id: "a",
          text: "Kidneys",
          emoji: "🫘",
          isCorrect: false
        },
        {
          id: "b",
          text: "Bladder",
          emoji: "🚽",
          isCorrect: false
        },
        {
          id: "c",
          text: "Testes",
          emoji: "🥜",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "What is semen?",
      options: [
        {
          id: "a",
          text: "A type of cell",
          emoji: "🔍",
          isCorrect: false
        },
        {
          id: "b",
          text: "Fluid containing sperm",
          emoji: "💦",
          isCorrect: true
        },
        {
          id: "c",
          text: "Just sperm",
          emoji: "🔬",
          isCorrect: false
        }
      ]
    }
  ];

  const handleAnswer = (optionId) => {
    if (showFeedback) return; // Prevent multiple clicks
    
    const selectedOpt = questions[currentQuestion].options.find(opt => opt.id === optionId);
    setSelectedOption(optionId);
    setShowFeedback(true);
    
    const isCorrect = selectedOpt.isCorrect;
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }
    
    setChoices([...choices, { question: currentQuestion, optionId, isCorrect }]);
    
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOption(null);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/student/health-male/teens/reflex-awareness-teen");
  };

  return (
    <GameShell
      title="Quiz on Male Reproductive Basics"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      nextGamePathProp="/student/health-male/teens/reflex-puberty-health-teen"
      nextGameIdProp="health-male-teen-33"
      score={choices.filter(c => c.isCorrect).length * 3}
      gameId="health-male-teen-32"
      gameType="health-male"
      totalLevels={100}
      currentLevel={32}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 32/100</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length * 3}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                disabled={showFeedback}
                className={`p-4 rounded-2xl text-left transition-all duration-300 ${
                  showFeedback 
                    ? option.isCorrect 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                      : selectedOption === option.id 
                        ? 'bg-gradient-to-r from-red-500 to-rose-600' 
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                } ${showFeedback && option.isCorrect ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default QuizMaleReproductiveBasicsTeen;

