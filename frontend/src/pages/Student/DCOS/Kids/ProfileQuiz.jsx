import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ProfileQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-kids-52");
  const gameId = gameData?.id || "dcos-kids-52";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ProfileQuiz, using fallback ID");
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
      text: "Should your social media profile be public or private?",
      options: [
        { 
          id: "a", 
          text: "Public – everyone can see", 
          emoji: "🌐", 
          
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Private – only friends can see", 
          emoji: "🔒", 
          
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Half public, half private", 
          emoji: "⚖️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "If you make your profile public, who can view your photos?",
      options: [
        { 
          id: "a", 
          text: "Only my friends", 
          emoji: "👥", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "No one", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Anyone on the internet", 
          emoji: "🌐", 
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "Should you accept friend requests from people you don't know?",
      options: [
        { 
          id: "a", 
          text: "No, only real friends", 
          emoji: "👥", 
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Yes, more followers!", 
          emoji: "📈", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Maybe if they look nice", 
          emoji: "🤔", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What's the safest way to protect your online profile?",
      options: [
        { 
          id: "a", 
          text: "Share password with a friend", 
          emoji: "🔓", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Ignore settings", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Keep it private and strong password", 
          emoji: "🔒", 
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "If someone asks for your personal info on your profile, what should you do?",
      options: [
        { 
          id: "a", 
          text: "Give it if they seem nice", 
          emoji: "😊", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Ask why they need it", 
          emoji: "🤔", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Report or block them", 
          emoji: "🚨", 
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
      title="Quiz on Profile Safety"
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

export default ProfileQuiz;
