import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnDangers = () => {
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
      text: "Smoking can cause?",
      emoji: "🚬",
      options: [
        {
          id: "a",
          text: "Lung damage and cancer",
          emoji: "🫁",
          // description: "Smoking damages lung tissue and increases cancer risk",
          isCorrect: true
        },
        {
          id: "b",
          text: "Healthy teeth and gums",
          emoji: "🦷",
          // description: "Smoking stains teeth and causes gum disease",
          isCorrect: false
        },
        {
          id: "c",
          text: "Improved athletic performance",
          emoji: "🏃",
          // description: "Smoking reduces oxygen and impairs performance",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is a major risk of alcohol use for teens?",
      emoji: "🍺",
      options: [
       
        {
          id: "b",
          text: "Better decision-making skills",
          emoji: "🤔",
          // description: "Alcohol impairs judgment and decision-making",
          isCorrect: false
        },
        {
          id: "c",
          text: "Increased academic performance",
          emoji: "📚",
          // description: "Alcohol negatively affects school performance",
          isCorrect: false
        },
         {
          id: "a",
          text: "Impaired brain development",
          emoji: "🧠",
          // description: "The teen brain is still developing until mid-20s",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "Which organ is most affected by alcohol?",
      emoji: "🍺",
      options: [
        {
          id: "a",
          text: "Liver",
          emoji: "🍺",
          // description: "The liver processes alcohol and can be damaged by it",
          isCorrect: true
        },
        {
          id: "b",
          text: "Heart",
          emoji: "❤️",
          // description: "While affected, the liver bears the main burden",
          isCorrect: false
        },
        {
          id: "c",
          text: "Kidneys",
          emoji: "🫘",
          // description: "These are less directly affected than the liver",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What is a consequence of drug use?",
      emoji: "💊",
      options: [
        
        {
          id: "b",
          text: "Enhanced memory",
          emoji: "🧠",
          // description: "Drugs typically impair memory and cognitive function",
          isCorrect: false
        },
        {
          id: "a",
          text: "Brain chemistry disruption",
          emoji: "😵",
          // description: "Drugs alter neurotransmitters and brain function",
          isCorrect: true
        },
        {
          id: "c",
          text: "Improved mental health",
          emoji: "😊",
          // description: "Drugs often worsen mental health conditions",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why are teens particularly vulnerable to substance use?",
      emoji: "🧠",
      options: [
        
        {
          id: "b",
          text: "Greater self-control than adults",
          emoji: "💪",
          // description: "Teens typically have less self-control than adults",
          isCorrect: false
        },
        {
          id: "a",
          text: "Still-developing brain and risk-taking tendencies",
          emoji: "🧠",
          // description: "The teen brain is more susceptible to addiction",
          isCorrect: true
        },
        {
          id: "c",
          text: "Natural need for risky experiences",
          emoji: "🎢",
          // description: "While risk-taking is normal, it's not a natural need"
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
    navigate("/student/health-female/teens/reflex-teen-choice");
  };

  return (
    <GameShell
      title="Quiz on Dangers"
      subtitle={gameFinished ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-82"
      gameType="health-female"
      totalLevels={10}
      currentLevel={2}
      showConfetti={gameFinished}
      backPath="/games/health-female/teens"
      flashPoints={flashPoints}
    
      nextGamePathProp="/student/health-female/teens/reflex-teen-choice"
      nextGameIdProp="health-female-teen-83">
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

export default QuizOnDangers;