import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SalaryStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-5";
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
      text: "A young worker earns ₹2000 per month. What should they do with their salary?",
      options: [
        { 
          id: "spend", 
          text: "Spend all", 
          emoji: "🛍️", 
          
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Save ₹400 (20%)", 
          emoji: "💰", 
          
          isCorrect: true
        },
        { 
          id: "waste", 
          text: "Waste money", 
          emoji: "💸", 
          
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "The worker gets a ₹500 bonus. How should they handle it?",
      options: [
        { 
          id: "save", 
          text: "Save most of it", 
          emoji: "🏦", 
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Spend all on luxury", 
          emoji: "💎", 
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Ignore bonus", 
          emoji: "🙈", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "The worker's expenses increase to ₹1800 per month. What's the smart approach?",
      options: [
        { 
          id: "spend", 
          text: "Stop saving", 
          emoji: "💸", 
          isCorrect: false
        },
        { 
          id: "waste", 
          text: "Spend more", 
          emoji: "🛒", 
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Maintain savings", 
          emoji: "📈", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "The worker gets a 10% salary raise. What should they do with the extra money?",
      options: [
        { 
          id: "spend", 
          text: "Upgrade lifestyle", 
          emoji: "💎", 
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Increase savings", 
          emoji: "🎯", 
          isCorrect: true
        },
        { 
          id: "waste", 
          text: "Waste it all", 
          emoji: "🗑️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "The worker wants to buy a ₹10,000 gadget. What's the best approach?",
      options: [
        { 
          id: "spend", 
          text: "Buy on EMI", 
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
          text: "Save over time", 
          emoji: "⏳", 
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
      title="Salary Story"
      score={coins}
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/finance/teen/debate-save-vs-spend"
      nextGameIdProp="finance-teens-6"
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

export default SalaryStory;