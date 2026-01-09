import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizEmergingCareers = () => {
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
      text: "Which is an emerging field?",
      emoji: "🚀",
      options: [
        
        {
          id: "b",
          text: "Basket Weaving only",
          emoji: "🧺",
          isCorrect: false
        },
        {
          id: "a",
          text: "AI & Data Science",
          emoji: "🤖",
          isCorrect: true
        },
        {
          id: "c",
          text: "Traditional manufacturing only",
          emoji: "🏭",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why are some careers becoming obsolete?",
      emoji: "🔚",
      options: [
        {
          id: "a",
          text: "Technology advancement and changing needs",
          emoji: "💻",
          isCorrect: true
        },
        {
          id: "b",
          text: "Lack of interest",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "c",
          text: "Government policies",
          emoji: "🏛️",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What drives emergence of new careers?",
      emoji: "🌱",
      options: [
        
        {
          id: "b",
          text: "Random chance",
          emoji: "🎲",
          isCorrect: false
        },
        {
          id: "a",
          text: "Technological innovation and societal needs",
          emoji: "🔧",
          isCorrect: true
        },
        {
          id: "c",
          text: "Elimination of all jobs",
          emoji: "💥",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How can teens prepare for future careers?",
      emoji: "📘",
      options: [
        
        {
          id: "b",
          text: "Sticking to old methods",
          emoji: "📎",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoiding technology",
          emoji: "📴",
          isCorrect: false
        },
        {
          id: "a",
          text: "Continuous learning and adaptability",
          emoji: "🔄",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "What is a benefit of exploring emerging fields?",
      emoji: "💎",
      options: [
        {
          id: "a",
          text: "Better job prospects and innovation opportunities",
          emoji: "📈",
          isCorrect: true
        },
        {
          id: "b",
          text: "Less competition",
          emoji: "🕊️",
          isCorrect: false
        },
        {
          id: "c",
          text: "Guaranteed success",
          emoji: "🎯",
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
    navigate("/games/ehe/teens");
  };

  const currentQuestionData = questions[currentQuestion];
  const finalScore = coins;

  return (
    <GameShell
      title="Quiz on Emerging Careers"
      subtitle={gameFinished ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={finalScore}
      gameId="ehe-teen-72"
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
    
      nextGamePathProp="/student/ehe/teens/reflex-teen-future-check"
      nextGameIdProp="ehe-teen-73">
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

export default QuizEmergingCareers;