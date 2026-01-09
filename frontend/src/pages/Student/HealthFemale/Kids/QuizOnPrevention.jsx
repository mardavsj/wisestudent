import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnPrevention = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 1;
  const totalCoins = location.state?.totalCoins || 5;
  const totalXp = location.state?.totalXp || 10;
  const maxScore = 5;
  const gameId = "health-female-kids-72";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { showCorrectAnswerFeedback, resetFeedback, flashPoints } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "How do we stop germs from spreading?",
      emoji: "🦠",
      options: [
        {
          id: "a",
          text: "Share drinks",
          emoji: "🥤",
          // description: "Sharing cups spreads germs.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Wash hands often",
          emoji: "🧼",
          // description: "Correct! Clean hands kill germs.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Never bathe",
          emoji: "🛀",
          // description: "Bathing cleans germs away.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "When should you sneeze?",
      emoji: "🤧",
      options: [
        {
          id: "b",
          text: "Into your elbow or tissue",
          emoji: "💪",
          // description: "Yes! Catch the sneeze.",
          isCorrect: true
        },
        {
          id: "a",
          text: "On your friend",
          emoji: "🤧",
          // description: "Yuck! Don't do that.",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Into the air",
          emoji: "💨",
          // description: "That sprays germs everywhere.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What keeps your teeth healthy?",
      emoji: "🦷",
      options: [
        {
          id: "a",
          text: "Eating candy",
          emoji: "🍭",
          // description: "Sugar causes cavities.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Brushing twice a day",
          emoji: "🪥",
          // description: "Exactly! Keep them shiny.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Chewing rocks",
          emoji: "🪨",
          // description: "Rocks break teeth!";,
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why do we sleep?",
      emoji: "😴",
      options: [
        {
          id: "a",
          text: "To be bored",
          emoji: "🥱",
          // description: "Sleep isn't boring.",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "To miss school",
          emoji: "🏫",
          // description: "We sleep at night.",
          isCorrect: false
        },
         {
          id: "b",
          text: "To help our body repair and grow",
          emoji: "🛌",
          // description: "Yes! Sleep powers you up.",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "What protects your head when biking?",
      emoji: "🚴‍♀️",
      options: [
        {
          id: "a",
          text: "A hat",
          emoji: "🧢",
          // description: "A hat is not hard enough.",
          isCorrect: false
        },
        {
          id: "b",
          text: "A helmet",
          emoji: "⛑️",
          // description: "Correct! Helmets save heads.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Your hair",
          emoji: "💇‍♀️",
          // description: "Hair doesn't protect from bumps."
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

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  return (
    <GameShell
      title="Quiz on Prevention"
      subtitle={gameFinished ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={62}
      showConfetti={gameFinished}
      backPath="/games/health-female/kids"
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={flashPoints}
    
      nextGamePathProp="/student/health-female/kids/reflex-safety"
      nextGameIdProp="health-female-kids-73">
      <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {!gameFinished && questions[currentQuestion] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
          </div>

          <div className="text-6xl mb-4 text-center">{questions[currentQuestion].emoji}</div>

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
  
export default QuizOnPrevention;
