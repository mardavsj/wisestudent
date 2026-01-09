import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const MoneyBankStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-1";
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
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You received ₹10 as a gift from your grandmother. What would you like to do?",
      options: [
        { 
          id: "spend", 
          text: "Spend All", 
          emoji: "🛍️", 
          
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Save ₹5", 
          emoji: "💰", 
          
          isCorrect: true
        },
        { 
          id: "save-all", 
          text: "Save All ₹10", 
          emoji: "🏦", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You have ₹20 saved up. Your friend invites you to the movies which costs ₹15. What do you do?",
      options: [
        { 
          id: "save", 
          text: "Save for Later", 
          emoji: "🏦", 
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Go to Movies", 
          emoji: "🎬", 
          isCorrect: false
        },
        { 
          id: "split", 
          text: "Split the Cost", 
          emoji: "🤝", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You found ₹5 on the street. What's the best thing to do with it?",
      options: [
        { 
          id: "spend", 
          text: "Buy Candy", 
          emoji: "🍬", 
          isCorrect: false
        },
        { 
          id: "give", 
          text: "Give to Parents", 
          emoji: "👨‍👩‍👧", 
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Save It", 
          emoji: "🫙", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Your birthday is coming up and you want a new bicycle that costs ₹500. You currently have ₹200. What should you do?",
      options: [
        { 
          id: "save", 
          text: "Save More", 
          emoji: "📈", 
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Buy Now", 
          emoji: "🛒", 
          isCorrect: false
        },
        { 
          id: "borrow", 
          text: "Borrow Money", 
          emoji: "💳", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You have ₹30 saved and see a toy you really want for ₹25. What's the smart choice?",
      options: [
        { 
          id: "spend", 
          text: "Buy the Toy", 
          emoji: "🧸", 
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Save for Bigger", 
          emoji: "🎯", 
          isCorrect: true
        },
        { 
          id: "wait", 
          text: "Wait for Sale", 
          emoji: "⏰", 
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    if (currentQuestion < 0 || currentQuestion >= questions.length) {
      return;
    }

    const currentQ = questions[currentQuestion];
    if (!currentQ || !currentQ.options) {
      return;
    }

    const newChoices = [...choices, { 
      questionId: currentQ.id, 
      choice: selectedChoice,
      isCorrect: currentQ.options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = currentQ.options.find(opt => opt.id === selectedChoice)?.isCorrect;
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

  const handleNext = () => {
    navigate("/games/financial-literacy/kids");
  };

  const getCurrentQuestion = () => {
    if (currentQuestion >= 0 && currentQuestion < questions.length) {
      return questions[currentQuestion];
    }
    return null;
  };

  const currentQuestionData = getCurrentQuestion();

  return (
    <GameShell
      title="Money Bank Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="finance-kids-1"
      nextGamePathProp="/student/finance/kids/quiz-on-saving"
      nextGameIdProp="finance-kids-2"
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options && currentQuestionData.options.map(option => (
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
        ) : null}
      </div>
    </GameShell>
  );
};

export default MoneyBankStory;

