import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DeviceSharingQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-kids-8");
  const gameId = gameData?.id || "dcos-kids-8";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for DeviceSharingQuiz, using fallback ID");
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
      text: "Is it safe to share your phone or tablet with a stranger?",
      options: [
        { 
          id: "a", 
          text: "No, Never Share", 
          emoji: "🛡️", 
          
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Yes, It's Okay", 
          emoji: "👍", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Only If They Ask Nicely", 
          emoji: "😊", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Should you let a classmate use your device without asking?",
      options: [
        { 
          id: "a", 
          text: "Yes, Classmates Are Safe", 
          emoji: "👍", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Ask Parent First", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Only for a Minute", 
          emoji: "⏰", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Can you share your device password with friends?",
      options: [
        { 
          id: "a", 
          text: "No, Passwords Are Private", 
          emoji: "🔒", 
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Yes, Friends Are Safe", 
          emoji: "👍", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Only Best Friends", 
          emoji: "👫", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Should you let someone you just met use your device?",
      options: [
        { 
          id: "a", 
          text: "Yes, If They Seem Nice", 
          emoji: "😊", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "No, Never Share", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Only for Games", 
          emoji: "🎮", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Is it safe to leave your device unlocked around strangers?",
      options: [
        { 
          id: "a", 
          text: "Always Lock Device", 
          emoji: "🔒", 
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
          text: "Only at Home", 
          emoji: "🏠", 
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
      title="Quiz on Device Sharing"
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

export default DeviceSharingQuiz;
