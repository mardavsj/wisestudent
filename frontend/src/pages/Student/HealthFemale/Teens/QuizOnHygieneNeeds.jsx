import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnHygieneNeeds = () => {
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
      text: "What helps prevent body odor during puberty?",
      emoji: "👃",
      options: [
        {
          id: "a",
          text: "Bathing regularly",
          emoji: "🛁",
          // description: "Regular bathing removes sweat and bacteria that cause body odor",
          isCorrect: true
        },
        {
          id: "b",
          text: "Skipping bath completely",
          emoji: "😅",
          // description: "Skipping baths allows bacteria to build up, causing odor",
          isCorrect: false
        },
        {
          id: "c",
          text: "Using only perfume",
          emoji: "🌸",
          // description: "Perfume only masks smell but doesn't solve the root cause",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "During menstruation, how often should you change sanitary pads?",
      emoji: "🩸",
      options: [
        {
          id: "a",
          text: "Only when completely soaked",
          emoji: "🌊",
          // description: "Waiting too long increases infection risk and odor",
          isCorrect: false
        },
        {
          id: "b",
          text: "Every 4-6 hours or when soiled",
          emoji: "⏰",
          // description: "Regular changing prevents bacterial growth and odor",
          isCorrect: true
        },
        {
          id: "c",
          text: "Once a day is enough",
          emoji: "📅",
          // description: "Once daily is not sufficient during menstruation",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What's the best way to care for oily skin during puberty?",
      emoji: "🧴",
      options: [
        {
          id: "a",
          text: "Scrubbing vigorously",
          emoji: "🔥",
          // description: "Harsh scrubbing can irritate skin and increase oil production",
          isCorrect: false
        },
        {
          id: "b",
          text: "Using harsh soaps",
          emoji: "🧼",
          // description: "Harsh soaps can strip natural oils and cause more oil production",
          isCorrect: false
        },
        {
          id: "c",
          text: "Gentle face washing twice daily",
          emoji: "🧴",
          // description: "Gentle cleansing removes excess oil without irritating skin",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Why is it important to wash your hair regularly during puberty?",
      emoji: "💇‍♀️",
      options: [
        {
          id: "b",
          text: "Oil and sweat increase, requiring more frequent washing",
          emoji: "💇",
          // description: "Hormonal changes increase oil production, making hair oilier",
          isCorrect: true
        },
        {
          id: "a",
          text: "Hair grows faster and needs cleaning",
          emoji: "⏱️",
          // description: "Hair growth speed doesn't determine washing frequency",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "It's not necessary to wash hair more often",
          emoji: "❌",
          // description: "Regular washing prevents oil buildup and scalp issues",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the best approach to intimate hygiene during puberty?",
      emoji: "🚺",
      options: [
        {
          id: "a",
          text: "Using harsh soaps and scrubbing",
          emoji: "🧽",
          // description: "Harsh products can disrupt natural pH and cause irritation",
          isCorrect: false
        },
        {
          id: "b",
          text: "Gentle cleaning with mild soap and water",
          emoji: "💧",
          // description: "Gentle cleaning maintains natural pH balance and prevents irritation",
          isCorrect: true
        },
        {
          id: "c",
          text: "Avoiding cleaning altogether",
          emoji: "🚫",
          // description: "Proper hygiene is essential to prevent infections"
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
    navigate("/student/health-female/teens/reflex-hygiene-check");
  };

  return (
    <GameShell
      title="Quiz on Hygiene Needs"
      subtitle={gameFinished ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-2"
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

export default QuizOnHygieneNeeds;
