import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SafeFriendQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-kids-59");
  const gameId = gameData?.id || "dcos-kids-59";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SafeFriendQuiz, using fallback ID");
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
      text: "Should you share your homework answers online for others to copy?",
      options: [
        { 
          id: "a", 
          text: "Yes, to help friends", 
          emoji: "👥", 
          
          isCorrect: false
        },
        { 
          id: "b", 
          text: "No, that's cheating", 
          emoji: "🚫", 
          
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Only if they ask nicely", 
          emoji: "🤔", 
          
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's a safe way to help your friend with homework?",
      options: [
        { 
          id: "a", 
          text: "Send your full answers", 
          emoji: "📤", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Ignore their question", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Explain how to solve it", 
          emoji: "💡", 
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "If someone online asks for your project file, what should you do?",
      options: [
        { 
          id: "a", 
          text: "Ask a teacher or parent first", 
          emoji: "👨‍👩‍👧", 
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Share it to be nice", 
          emoji: "😊", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Trust them if they seem friendly", 
          emoji: "🤝", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Is it okay to join a group chat that shares school test answers?",
      options: [
        { 
          id: "a", 
          text: "Yes, it helps me prepare", 
          emoji: "📖", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Sometimes, for learning", 
          emoji: "🤷", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "No, that's dishonest", 
          emoji: "❌", 
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "What's the best way to be a 'Safe Friend' online?",
      options: [
        { 
          id: "a", 
          text: "Share answers secretly", 
          emoji: "🤫", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Don't care what others do", 
          emoji: "😐", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Encourage honesty and learning", 
          emoji: "✨", 
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
      title="Quiz on Safe Friendship"
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

export default SafeFriendQuiz;
