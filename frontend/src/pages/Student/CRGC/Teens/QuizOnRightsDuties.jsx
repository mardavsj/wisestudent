import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnRightsDuties = () => {
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
      text: "Which is a civic duty?",
      emoji: "🗳️",
      options: [
        {
          id: "a",
          text: "Pay taxes",
          emoji: "💰",
          isCorrect: true
        },
        {
          id: "b",
          text: "Waste resources",
          emoji: "🗑️",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore laws",
          emoji: "🚫",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which is a fundamental right?",
      emoji: "📜",
      options: [
        
        {
          id: "b",
          text: "Breaking traffic rules",
          emoji: "🚗",
          isCorrect: false
        },
        {
          id: "c",
          text: "Not attending school",
          emoji: "🏫",
          isCorrect: false
        },
        {
          id: "a",
          text: "Freedom of speech",
          emoji: "🎤",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "What is the relationship between rights and duties?",
      emoji: "⚖️",
      options: [
        
        {
          id: "b",
          text: "Duties are more important",
          emoji: "👆",
          isCorrect: false
        },
        {
          id: "a",
          text: "They balance each other",
          emoji: "☯️",
          isCorrect: true
        },
        {
          id: "c",
          text: "Rights are more important",
          emoji: "👇",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Which is an example of exercising a right responsibly?",
      emoji: "✅",
      options: [
        {
          id: "a",
          text: "Voting in elections",
          emoji: "✅",
          isCorrect: true
        },
        {
          id: "b",
          text: "Polluting the environment",
          emoji: "🏭",
          isCorrect: false
        },
        {
          id: "c",
          text: "Disrespecting others",
          emoji: "🤬",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why are civic duties important for society?",
      emoji: "🌐",
      options: [
        
        {
          id: "b",
          text: "They restrict personal freedom",
          emoji: "⛓️",
          isCorrect: false
        },
        {
          id: "c",
          text: "They benefit only the government",
          emoji: "🏢",
          isCorrect: false
        },
        {
          id: "a",
          text: "They help maintain order and collective welfare",
          emoji: "🏛️",
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
    navigate("/games/civic-responsibility/teens");
  };

  const currentQuestionData = questions[currentQuestion];
  const finalScore = coins;

  return (
    <GameShell
      title="Quiz on Rights & Duties"
      subtitle={gameFinished ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={finalScore}
      gameId="civic-responsibility-teens-72"
      gameType="civic-responsibility"
      totalLevels={80}
      currentLevel={72}
      showConfetti={gameFinished}
      backPath="/games/civic-responsibility/teens"
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={flashPoints}
    
      nextGamePathProp="/student/civic-responsibility/teens/reflex-teen-law"
      nextGameIdProp="civic-responsibility-teens-73">
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

export default QuizOnRightsDuties;