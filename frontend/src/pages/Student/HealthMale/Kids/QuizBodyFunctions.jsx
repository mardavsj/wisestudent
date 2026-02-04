import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const QuizBodyFunctions = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-32";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback, resetFeedback, flashPoints } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which organ helps pump blood?",
      options: [
        {
          id: "a",
          text: "Brain",
          emoji: "🧠",
          isCorrect: false
        },
        {
          id: "b",
          text: "Heart",
          emoji: "❤️",
          isCorrect: true
        },
        {
          id: "c",
          text: "Lungs",
          emoji: "🫁",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What do lungs help us do?",
      options: [
        {
          id: "a",
          text: "Digest food",
          emoji: "🍎",
          isCorrect: false
        },
        {
          id: "b",
          text: "Think thoughts",
          emoji: "💭",
          isCorrect: false
        },
        {
          id: "c",
          text: "Breathe oxygen",
          emoji: "💨",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "Which organ helps us digest food?",
      options: [
        {
          id: "a",
          text: "Heart",
          emoji: "❤️",
          isCorrect: false
        },
        {
          id: "b",
          text: "Stomach",
          emoji: "🫄",
          isCorrect: true
        },
        {
          id: "c",
          text: "Brain",
          emoji: "🧠",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What does the brain help us do?",
      options: [
        {
          id: "a",
          text: "Think and learn",
          emoji: "🎓",
          isCorrect: true
        },
        {
          id: "b",
          text: "Pump blood",
          emoji: "💉",
          isCorrect: false
        },
        {
          id: "c",
          text: "Breathe air",
          emoji: "🌬️",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How do all organs work together?",
      options: [
        {
          id: "a",
          text: "As a team",
          emoji: "🤝",
          isCorrect: true
        },
        {
          id: "b",
          text: "They work separately",
          emoji: "🔄",
          isCorrect: false
        },
        {
          id: "c",
          text: "Against each other",
          emoji: "⚔️",
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
    }, isCorrect ? 3000 : 3000);
  };

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  const currentQuestionData = questions[currentQuestion];
  const finalScore = coins;

  return (
    <GameShell
      title="Quiz on Body Functions"
      subtitle={gameFinished ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/reflex-body-basics"
      nextGameIdProp="health-male-kids-33"
      gameType="health-male"
      totalLevels={5}
      currentLevel={32}
      showConfetti={gameFinished}
      backPath="/games/health-male/kids"
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={flashPoints}>
      <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {!gameFinished && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {finalScore}/{questions.length}</span>
              </div>
              
              <div className="text-6xl mb-4 text-center">🤔</div>
              
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

export default QuizBodyFunctions;

