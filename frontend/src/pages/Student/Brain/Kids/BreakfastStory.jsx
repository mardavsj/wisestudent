import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BreakfastStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-5");
  const gameId = gameData?.id || "brain-kids-5";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for BreakfastStory, using fallback ID");
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
      text: "Kid skips breakfast. Is this good for brain?",
      options: [
        { 
          id: "maybe", 
          text: "Maybe", 
          emoji: "🤔", 
          
          isCorrect: false
        },
        { 
          id: "no", 
          text: "No", 
          emoji: "👎", 
         
          isCorrect: true
        },
        { 
          id: "yes", 
          text: "Yes", 
          emoji: "👍", 
          
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which breakfast is best for your brain?",
      options: [
        { 
          id: "cereal", 
          text: "Whole grain cereal with milk", 
          emoji: "🥣", 
          
          isCorrect: true
        },
        { 
          id: "candy", 
          text: "Candy bar", 
          emoji: "🍫", 
          isCorrect: false
        },
        { 
          id: "nothing", 
          text: "Nothing", 
          emoji: "🚫", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Why is breakfast called the most important meal?",
      options: [
        { 
          id: "expensive", 
          text: "It's the most expensive meal", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          id: "first", 
          text: "It's the first meal after sleeping", 
          emoji: "🌅", 
          isCorrect: true
        },
        { 
          id: "biggest", 
          text: "It's the biggest meal", 
          emoji: "🍽️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How does breakfast help your school performance?",
      options: [
        { 
          id: "focus", 
          text: "Helps you focus and learn better", 
          emoji: "🎯", 
          isCorrect: true
        },
        { 
          id: "sleepy", 
          text: "Makes you sleepy in class", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          id: "nothing", 
          text: "Does nothing", 
          emoji: "🚫", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What should you do if you're running late for school?",
      options: [
        { 
          id: "skip", 
          text: "Skip breakfast completely", 
          emoji: "⏰", 
          
          isCorrect: false
        },
        { 
          id: "wait", 
          text: "Wait and eat later", 
          emoji: "⏳", 
          
          isCorrect: false
        },
        { 
          id: "quick", 
          text: "Grab a quick healthy snack", 
          emoji: "🍎", 
          
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
      title="Breakfast for Brain Power"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/brain/kids/poster-brain-health"
      nextGameIdProp="brain-kids-6"
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

export default BreakfastStory;

