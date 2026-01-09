import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizTeenEntrepreneurs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get coinsPerLevel, totalCoins, and totalXp from location.state or use defaults
  const coinsPerLevel = location.state?.coinsPerLevel || 5;
  const totalCoins = location.state?.totalCoins || 5;
  const totalXp = location.state?.totalXp || 10;
  
  const { showCorrectAnswerFeedback, resetFeedback, flashPoints } = useGameFeedback();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Which quality do teen entrepreneurs show?",
      emoji: "🚀",
      options: [
        {
          id: "a",
          text: "Risk-taking",
          emoji: "🎢",
          isCorrect: true
        },
        {
          id: "b",
          text: "Doing nothing",
          emoji: "🛋️",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoiding challenges",
          emoji: "🛡️",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What motivates teen entrepreneurs?",
      emoji: "💡",
      options: [
        
        {
          id: "b",
          text: "Avoiding responsibility",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "c",
          text: "Copying others",
          emoji: "📎",
          isCorrect: false
        },
        {
          id: "a",
          text: "Solving problems and creating value",
          emoji: "🔧",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "Why is creativity important for teen entrepreneurs?",
      emoji: "🎨",
      options: [
       
        {
          id: "b",
          text: "To copy existing ideas",
          emoji: "📋",
          isCorrect: false
        },
         {
          id: "a",
          text: "To develop unique solutions",
          emoji: "✨",
          isCorrect: true
        },
        {
          id: "c",
          text: "To avoid innovation",
          emoji: "🚫",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What skill helps teen entrepreneurs succeed?",
      emoji: "🤝",
      options: [
        {
          id: "a",
          text: "Communication and leadership",
          emoji: "🎤",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoiding teamwork",
          emoji: "👤",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignoring feedback",
          emoji: "🙉",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What is a benefit of teen entrepreneurship?",
      emoji: "⭐",
      options: [
       
        {
          id: "b",
          text: "Reduced learning opportunities",
          emoji: "📉",
          isCorrect: false
        },
        {
          id: "c",
          text: "Limited skill development",
          emoji: "🚧",
          isCorrect: false
        },
         {
          id: "a",
          text: "Early financial literacy and experience",
          emoji: "💰",
          isCorrect: true
        },
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
    navigate("/games/ehe/teens");
  };

  const currentQuestionData = questions[currentQuestion];
  const finalScore = coins;

  return (
    <GameShell
      title="Quiz on Teen Entrepreneurs"
      subtitle={gameFinished ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={finalScore}
      gameId="ehe-teen-42"
      gameType="ehe"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={gameFinished}
      backPath="/games/ehe/teens"
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={flashPoints}
    
      nextGamePathProp="/student/ehe/teens/reflex-teen-entrepreneur"
      nextGameIdProp="ehe-teen-43">
      <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {!gameFinished && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {finalScore}/{questions.length}</span>
              </div>
              
              <div className="text-6xl mb-4 text-center">{currentQuestionData.emoji}</div>
              
              <p className="text-white text-lg md:text-xl mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map(option => {
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
                  currentQuestionData.options.find(opt => opt.id === selectedOption)?.isCorrect
                    ? "bg-green-500/20"
                    : "bg-red-500/20"
                }`}>
                  <p className="text-white whitespace-pre-line">
                    {currentQuestionData.options.find(opt => opt.id === selectedOption)?.isCorrect
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

export default QuizTeenEntrepreneurs;