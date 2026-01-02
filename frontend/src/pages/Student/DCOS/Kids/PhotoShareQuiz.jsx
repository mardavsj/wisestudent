import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PhotoShareQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-kids-3");
  const gameId = gameData?.id || "dcos-kids-3";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for PhotoShareQuiz, using fallback ID");
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
      text: "Should you post a photo of your home address online?",
      options: [
        { 
          id: "a", 
          text: "No, Never!", 
          emoji: "🚫", 
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Yes, It's Fine", 
          emoji: "👍", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Only to Friends", 
          emoji: "👥", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Is it safe to post your school uniform with school name visible?",
      options: [
        { 
          id: "a", 
          text: "Yes, I'm Proud", 
          emoji: "🏫", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Crop the Name", 
          emoji: "✂️", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "No, Keep Private", 
          emoji: "🔒", 
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "Should you share photos of your birthday party with strangers?",
      options: [
        { 
          id: "a", 
          text: "Keep Private", 
          emoji: "🔐", 
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Show the Fun", 
          emoji: "🎉", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Share Some Photos", 
          emoji: "📸", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Can you post a photo showing your house number?",
      options: [
        { 
          id: "a", 
          text: "Yes", 
          emoji: "✅", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "No, Private Info", 
          emoji: "🔒", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Blur It Slightly", 
          emoji: "🌫️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Is it okay to post vacation photos while you're still on vacation?",
      options: [
        { 
          id: "a", 
          text: "Share My Fun", 
          emoji: "🏖️", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Post Just a Few", 
          emoji: "📷", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Wait Until Home", 
          emoji: "⏰", 
          isCorrect: true
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
      title="Quiz on Photo Sharing"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
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

export default PhotoShareQuiz;
