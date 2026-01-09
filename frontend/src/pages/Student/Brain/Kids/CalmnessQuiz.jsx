import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CalmnessQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-32");
  const gameId = gameData?.id || "brain-kids-32";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for CalmnessQuiz, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "What reduces stress?",
      options: [
        { 
          id: "a", 
          text: "Deep breathing", 
          emoji: "🌬️", 
          
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Shouting", 
          emoji: "😡", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Worrying", 
          emoji: "😰", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which activity helps you feel calm?",
      options: [
        { 
          id: "b", 
          text: "Getting very angry", 
          emoji: "😡", 
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Taking slow, deep breaths", 
          emoji: "🧘", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Panicking about everything", 
          emoji: "😰", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What helps when you feel stressed?",
      options: [
        { 
          id: "b", 
          text: "Working non-stop without rest", 
          emoji: "⚡", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Worrying constantly", 
          emoji: "😰", 
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Taking a break and breathing deeply", 
          emoji: "⏸️", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "How can you stay calm during difficult times?",
      options: [
        { 
          id: "a", 
          text: "Practice deep breathing and stay organized", 
          emoji: "🧘", 
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Get very upset and shout", 
          emoji: "😡", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Panic about everything", 
          emoji: "😰", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What is the best way to reduce stress?",
      options: [
        { 
          id: "b", 
          text: "Shouting at everyone", 
          emoji: "😡", 
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Deep breathing exercises and taking breaks", 
          emoji: "🌬️", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Worrying all the time", 
          emoji: "😰", 
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Calmness"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/brain/kids/reflex-calm"
      nextGameIdProp="brain-kids-33"
      gameType="brain"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                    <p className="text-white/90 text-sm">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default CalmnessQuiz;

