import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const QuizSafety = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-72";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { showCorrectAnswerFeedback, resetFeedback, flashPoints } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Why is it important to wear a helmet when riding a bike?",
      options: [
        
        {
          id: "b",
          text: "It makes you look cool and stylish",
          emoji: "😎",
          isCorrect: false
        },
        {
          id: "c",
          text: "It helps you ride faster",
          emoji: "💨",
          isCorrect: false
        },
        {
          id: "a",
          text: "It protects your head from serious injuries during falls or crashes",
          emoji: "🤯",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "What is the safest way to cross the street?",
      options: [
        {
          id: "a",
          text: "Use crosswalks and traffic signals, look both ways before crossing",
          emoji: "🚶",
          isCorrect: true
        },
        {
          id: "b",
          text: "Run quickly across without looking",
          emoji: "🏃",
          isCorrect: false
        },
        {
          id: "c",
          text: "Cross anywhere you want without checking",
          emoji: "⚠️",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What should you do if you find matches or lighters?",
      options: [
        
        {
          id: "b",
          text: "Try to light them to see what happens",
          emoji: "🔥",
          isCorrect: false
        },
        {
          id: "a",
          text: "Leave them alone and tell a trusted adult right away",
          emoji: "👨‍👩‍👧",
          isCorrect: true
        },
        {
          id: "c",
          text: "Hide them so adults won't see them",
          emoji: "📦",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What is the safest way to stay safe around strangers?",
      options: [
        
        {
          id: "b",
          text: "Accept gifts or candy from strangers",
          emoji: "🎁",
          isCorrect: false
        },
        {
          id: "c",
          text: "Go with strangers if they seem friendly",
          emoji: "🤝",
          isCorrect: false
        },
        {
          id: "a",
          text: "Stay close to trusted adults and never go anywhere with strangers",
          emoji: "👨‍👩‍👧",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "Why is it important to wear a seatbelt in a car?",
      options: [
        {
          id: "a",
          text: "It keeps you secure and prevents serious injury in a crash",
          emoji: "🚗",
          isCorrect: true
        },
        {
          id: "b",
          text: "It helps you sleep better during car rides",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "c",
          text: "It allows you to move around freely in the car",
          emoji: "🤸",
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
    navigate("/student/health-male/kids/reflex-safety");
  };

  return (
    <GameShell
      title="Safety Quiz"
      subtitle={gameFinished ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/reflex-safety"
      nextGameIdProp="health-male-kids-73"
      gameType="health-male"
      totalLevels={5}
      currentLevel={72}
      showConfetti={gameFinished}
      backPath="/games/health-male/kids"
      maxScore={questions.length}
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
              
              <div className="text-6xl mb-4 text-center">🛡️</div>
              
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
                          : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
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

export default QuizSafety;

