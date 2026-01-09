import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const WaterStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-1");
  const gameId = gameData?.id || "brain-kids-1";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for WaterStory, using fallback ID");
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
      text: "Teacher says 'Drink water for brain.' Do you follow?",
      options: [
        { 
          id: "yes", 
          text: "Yes", 
          emoji: "💧", 
          
          isCorrect: true
        },
        { 
          id: "maybe", 
          text: "Maybe later", 
          emoji: "🤔", 
          
          isCorrect: false
        },
        { 
          id: "no", 
          text: "No", 
          emoji: "❌", 
          
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You feel thirsty during class. What should you do?",
      options: [
        { 
          id: "wait", 
          text: "Wait until break", 
          emoji: "⏰", 
         
          isCorrect: false
        },
        { 
          id: "drink", 
          text: "Drink water", 
          emoji: "💧", 
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore thirst", 
          emoji: "😴", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your friend says water is boring. What do you say?",
      options: [
        { 
          id: "agree", 
          text: "Agree - soda is better", 
          emoji: "🥤", 
          isCorrect: false
        },
        { 
          id: "say-nothing", 
          text: "Say nothing", 
          emoji: "🤐", 
          isCorrect: false
        },
        { 
          id: "explain", 
          text: "Explain water helps brain", 
          emoji: "🧠", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "How much water should you drink daily?",
      options: [
        { 
          id: "enough", 
          text: "Enough to stay hydrated", 
          emoji: "💧", 
          isCorrect: true
        },
        { 
          id: "little", 
          text: "A little is enough", 
          emoji: "💧", 
          isCorrect: false
        },
        { 
          id: "none", 
          text: "None needed", 
          emoji: "🚫", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "When is the best time to drink water?",
      options: [
        { 
          id: "during", 
          text: "Only during meals", 
          emoji: "🍽️", 
          isCorrect: false
        },
        { 
          id: "throughout", 
          text: "Throughout the day", 
          emoji: "⏰", 
          isCorrect: true
        },
        { 
          id: "evening", 
          text: "Only in evening", 
          emoji: "🌙", 
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

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Water for Brain Health"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/brain/kids/quiz-on-brain-food"
      nextGameIdProp="brain-kids-2"
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

export default WaterStory;

