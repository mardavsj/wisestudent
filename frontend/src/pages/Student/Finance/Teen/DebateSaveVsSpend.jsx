import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateSaveVsSpend = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-6";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Is it better to save money or spend all of it?",
      options: [
        { 
          id: "spend", 
          text: "Spend all", 
          emoji: "🛍️", 
          
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Save money", 
          emoji: "💰", 
          
          isCorrect: true
        },
        { 
          id: "waste", 
          text: "Waste it", 
          emoji: "💸", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Should teenagers focus on saving or enjoying their money now?",
      options: [
        { 
          id: "save", 
          text: "Focus on saving", 
          emoji: "🏦", 
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Enjoy now", 
          emoji: "🎉", 
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Don't think about it", 
          emoji: "🙈", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "When you get a bonus or extra money, what should you do?",
      options: [
        { 
          id: "spend", 
          text: "Spend it all", 
          emoji: "💸", 
          isCorrect: false
        },
        { 
          id: "waste", 
          text: "Waste it", 
          emoji: "🗑️", 
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Save most of it", 
          emoji: "📈", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Is it better to buy expensive branded items or affordable quality items?",
      options: [
        { 
          id: "spend", 
          text: "Buy branded items", 
          emoji: "💎", 
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Choose quality over brand", 
          emoji: "🎯", 
          isCorrect: true
        },
        { 
          id: "cheap", 
          text: "Buy cheapest", 
          emoji: "💵", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Should you use credit cards to buy things you can't afford?",
      options: [
        { 
          id: "spend", 
          text: "Yes, use credit", 
          emoji: "💳", 
          isCorrect: false
        },
        { 
          id: "borrow", 
          text: "Borrow money", 
          emoji: "🤲", 
          isCorrect: false
        },
        { 
          id: "save", 
          text: "No, avoid debt", 
          emoji: "🛡️", 
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: selectedChoice,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Debate: Save vs Spend"
      score={coins}
      subtitle={showResult ? "Debate Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/finance/teen/journal-of-saving-goal"
      nextGameIdProp="finance-teens-7"
      gameType="finance"
      totalLevels={5}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore === 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {getCurrentQuestion().text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
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

export default DebateSaveVsSpend;