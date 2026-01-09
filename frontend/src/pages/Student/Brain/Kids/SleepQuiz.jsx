import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SleepQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-62");
  const gameId = gameData?.id || "brain-kids-62";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SleepQuiz, using fallback ID");
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
      text: "How many hours should kids sleep? ",
      options: [
        { 
          id: "b", 
          text: " 8–10 hours", 
          emoji: "😴", 
          
          isCorrect: true
        },
        { 
          id: "a", 
          text: " 4 hours", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: " 12+ hours", 
          emoji: "😴", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Best bedtime for kids? ",
      options: [
        { 
          id: "a", 
          text: " Midnight", 
          emoji: "🌙", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: " 9–10 PM", 
          emoji: "🌙", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: " 2 AM", 
          emoji: "🌙", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What helps sleep? ",
      options: [
        { 
          id: "c", 
          text: " Loud music", 
          emoji: "🔊", 
          isCorrect: false
        },
        { 
          id: "a", 
          text: " Screen time", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: " Quiet routine", 
          emoji: "🧘", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Good for sleep? ",
      options: [
        { 
          id: "b", 
          text: " Warm milk", 
          emoji: "🥛", 
          isCorrect: true
        },
        { 
          id: "a", 
          text: " Caffeine", 
          emoji: "☕", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: " Gaming", 
          emoji: "🎮", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Sleep helps? ",
      options: [
        { 
          id: "c", 
          text: " Stress", 
          emoji: "😰", 
          isCorrect: false
        },
        { 
          id: "a", 
          text: " Focus", 
          emoji: "🎯", 
          isCorrect: true
        },
        { 
          id: "b", 
          text: " Tiredness", 
          emoji: "😴", 
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
      title="Quiz on Sleep"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/brain/kids/reflex-sleep-habits"
      nextGameIdProp="brain-kids-63"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="brain"
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

export default SleepQuiz;

