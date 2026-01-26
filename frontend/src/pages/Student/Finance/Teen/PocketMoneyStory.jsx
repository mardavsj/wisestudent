import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PocketMoneyStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-1";
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
      text: "You receive ₹500 as monthly pocket money. What should you do with it?",
      options: [
        { 
          id: "save", 
          text: "Save 20% (₹100)", 
          emoji: "💰", 
          
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Spend all", 
          emoji: "🛍️", 
          
          isCorrect: false
        },
        { 
          id: "save50", 
          text: "Save 50% (₹250)", 
          emoji: "💵", 
          
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You want to buy a ₹2000 gadget but only have ₹500 saved. What's the smart approach?",
      options: [
        { 
          id: "borrow", 
          text: "Borrow from friends", 
          emoji: "🤝", 
          isCorrect: false
        },
        { 
          id: "spend", 
          text: "Buy on credit", 
          emoji: "💳", 
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Save monthly", 
          emoji: "📅", 
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "Your friends spend all their pocket money on expensive items. What should you do?",
      options: [
        { 
          id: "save", 
          text: "Stick to your plan", 
          emoji: "📝", 
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Spend like them", 
          emoji: "👥", 
          isCorrect: false
        },
        { 
          id: "compromise", 
          text: "Spend half to fit in", 
          emoji: "⚖️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You saved ₹1000 but see a limited-time offer for a ₹1500 item. What's wise?",
      options: [
        { 
          id: "spend", 
          text: "Buy with partial payment", 
          emoji: "🛒", 
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Wait and save more", 
          emoji: "⏳", 
          isCorrect: true
        },
        { 
          id: "impulse", 
          text: "Buy something cheaper", 
          emoji: "🛍️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You have ₹800 saved and want to buy a ₹1000 phone. What should you do?",
      options: [
        { 
          id: "spend", 
          text: "Buy now with credit", 
          emoji: "💸", 
          isCorrect: false
        },
        { 
          id: "borrow", 
          text: "Borrow ₹200", 
          emoji: "💳", 
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Save ₹200 more", 
          emoji: "🎯", 
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
      }, isCorrect ? 1000 : 0); // Delay if correct to show animation
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/finance/teen/quiz-on-savings-rate");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Pocket Money Story"
      score={coins}
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/finance/teen/quiz-on-savings-rate"
      nextGameIdProp="finance-teens-2"
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp} // Pass if 3 or more correct
      showGameOver={showResult && finalScore >= 3}
      
      gameId="finance-teens-1"
      gameType="finance"
      totalLevels={5}
      currentLevel={1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Coins: {coins}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {getCurrentQuestion().text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You're learning smart financial decisions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  You understand the importance of saving a portion of your income for future needs!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, saving some money for later is usually a smart choice!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to choose the option that saves money for later in most situations.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PocketMoneyStory;