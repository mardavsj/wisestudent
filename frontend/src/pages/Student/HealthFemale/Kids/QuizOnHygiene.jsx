import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnHygiene = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 1;
  const totalCoins = location.state?.totalCoins || 5;
  const totalXp = location.state?.totalXp || 10;
  const maxScore = 5;
  const gameId = "health-female-kids-42";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [showAnswerConfetti, setShowAnswerConfetti] = useState(false);
  const { showCorrectAnswerFeedback, resetFeedback, flashPoints } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "How often should you take a bath or shower?",
      emoji: "🛁",
      options: [
        {
          id: "a",
          text: "Once a month",
          emoji: "📅",
          // description: "That's not enough to stay clean.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Every day or regularly",
          emoji: "🚿",
          // description: "Yes! Daily washing keeps you fresh.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only when mom says so",
          emoji: "🗣️",
          // description: "It should be your own healthy habit.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What do you need to wash your hands properly?",
      emoji: "🧼",
      options: [
        {
          id: "a",
          text: "Just water",
          emoji: "💧",
          // description: "Water alone doesn't kill germs.",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "A towel only",
          emoji: "🧖‍♀️",
          // description: "A towel dries, but doesn't clean.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Soap and Water",
          emoji: "🧼",
          // description: "Correct! Soap fights the germs.",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "When should you brush your teeth?",
      emoji: "🦷",
      options: [
        {
          id: "b",
          text: "Morning and Night",
          emoji: "🦷",
          // description: "Perfect! Twice a day keeps cavities away.",
          isCorrect: true
        },
        {
          id: "a",
          text: "Before breakfast",
          emoji: "🌅",
          // description: "Good start, but do it twice a day.",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Only if you ate candy",
          emoji: "🍬",
          // description: "You need to brush every day regardless.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why do we wear clean underwear every day?",
      emoji: "🧼",
      options: [
        
        {
          id: "b",
          text: "Because it looks nice",
          emoji: "👀",
          // description: "Hygiene is the main reason.",
          isCorrect: false
        },
        {
          id: "c",
          text: "We don't need to",
          emoji: "🚫",
          // description: "You should change it daily!",
          isCorrect: false
        },
        {
          id: "a",
          text: "To stop germs and odors",
          emoji: "😷",
          // description: "Exactly! It keeps your private parts healthy.",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "What should you do after using the toilet?",
      emoji: "🚽",
      options: [
        {
          id: "a",
          text: "Wash your hands",
          emoji: "👐",
          // description: "Yes! Always wash hands after the toilet.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Run away fast",
          emoji: "🏃‍♀️",
          // description: "Don't forget to wash up!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Touch your face",
          emoji: "🤦‍♀️",
          // description: "Yuck! Wash your hands first.",
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
      setShowAnswerConfetti(true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
        setShowAnswerConfetti(false);
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
      title="Quiz on Hygiene"
      subtitle={gameFinished ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={42}
      showConfetti={gameFinished || showAnswerConfetti}
      backPath="/games/health-female/kids"
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={flashPoints}>
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

export default QuizOnHygiene;