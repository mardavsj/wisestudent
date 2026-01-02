import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnPreventiveHealth = () => {
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
      text: "Which is an example of preventive health care?",
      emoji: "🏥",
      options: [
        {
          id: "a",
          text: "Vaccines to prevent diseases",
          emoji: "💉",
          // description: "Vaccination prevents infectious diseases",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignoring illness symptoms",
          emoji: "🙈",
          // description: "This delays treatment and worsens conditions",
          isCorrect: false
        },
        {
          id: "c",
          text: "Taking medicine only when sick",
          emoji: "💊",
          // description: "This is treatment, not prevention",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is the main goal of preventive health care?",
      emoji: "🎯",
      options: [
        {
          id: "a",
          text: "To cure existing diseases",
          emoji: "🔧",
          // description: "This is treatment, not prevention",
          isCorrect: false
        },
        {
          id: "b",
          text: "To prevent health problems before they start",
          emoji: "🛡️",
          // description: "Prevention focuses on maintaining health",
          isCorrect: true
        },
        {
          id: "c",
          text: "To save money on medical bills",
          emoji: "💰",
          // description: "While cost-effective, this isn't the primary goal",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which habit supports preventive health?",
      emoji: "💪",
      options: [
       
        {
          id: "b",
          text: "Skipping meals to lose weight",
          emoji: "🍽️",
          // description: "This harms health and metabolism",
          isCorrect: false
        },
        {
          id: "c",
          text: "Staying up late regularly",
          emoji: "🌙",
          // description: "Poor sleep weakens the immune system",
          isCorrect: false
        },
         {
          id: "a",
          text: "Regular exercise and balanced nutrition",
          emoji: "🥗",
          // description: "Healthy lifestyle prevents chronic diseases",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "Why are regular health screenings important?",
      emoji: "📋",
      options: [
       
        {
          id: "b",
          text: "To avoid seeing a doctor",
          emoji: "🏃",
          // description: "Screenings require medical visits",
          isCorrect: false
        },
        {
          id: "c",
          text: "To prove you're healthy to others",
          emoji: "🧐",
          // description: "Screenings are for personal health management",
          isCorrect: false
        },
         {
          id: "a",
          text: "To detect problems early when treatable",
          emoji: "🔍",
          // description: "Early detection improves treatment outcomes",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "What is a key benefit of preventive health care?",
      emoji: "🌟",
      options: [
        {
          id: "a",
          text: "Reduced risk of chronic diseases",
          emoji: "📉",
          // description: "Prevention significantly lowers disease risk",
          isCorrect: false
        },
        {
          id: "b",
          text: "Eliminates all health risks",
          emoji: "✨",
          // description: "Prevention reduces but doesn't eliminate risks",
          isCorrect: true
        },
        {
          id: "c",
          text: "Replaces need for doctors",
          emoji: "🚪",
          // description: "Prevention works alongside medical care",
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
    navigate("/student/health-female/teens/reflex-preventive-care");
  };

  return (
    <GameShell
      title="Quiz on Preventive Health"
      subtitle={gameFinished ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-72"
      gameType="health-female"
      totalLevels={10}
      currentLevel={2}
      showConfetti={gameFinished}
      backPath="/games/health-female/teens"
      flashPoints={flashPoints}
    >
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

export default QuizOnPreventiveHealth;