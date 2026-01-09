import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Calculator, PiggyBank, TrendingUp, Target, CheckCircle } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BudgetingQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-22";
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
      text: "What is a budget?",
      icon: Calculator,
      options: [
        
        { 
          id: "list", 
          text: "A shopping list", 
          emoji: "📝", 
          
          isCorrect: false
        },
        { 
          id: "plan", 
          text: "A spending plan", 
          emoji: "📊", 
          isCorrect: true
        },
        { 
          id: "free", 
          text: "Free money", 
          emoji: "💰", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why make a budget?",
      icon: Target,
      options: [
        { 
          id: "track", 
          text: "Track expenses and save", 
          emoji: "💾", 
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Spend all money fast", 
          emoji: "🛍️", 
          isCorrect: false
        },
        { 
          id: "fun", 
          text: "Just for fun", 
          emoji: "🎮", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Earn ₹100, spend ₹120. What happens?",
      icon: TrendingUp,
      options: [
       
        { 
          id: "save", 
          text: "You save ₹20", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          id: "prize", 
          text: "You win a prize", 
          emoji: "🏆", 
          isCorrect: false
        },
         { 
          id: "debt", 
          text: "You go into debt", 
          emoji: "📉", 
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "Which is a good budgeting habit?",
      icon: CheckCircle,
      options: [
        
        { 
          id: "guess", 
          text: "Guess and spend randomly", 
          emoji: "🎲", 
          isCorrect: false
        },
        { 
          id: "plan", 
          text: "List expenses and plan", 
          emoji: "📋", 
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore spending", 
          emoji: "🙈", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "If you follow budget, you can...",
      icon: PiggyBank,
      options: [
        { 
          id: "goals", 
          text: "Achieve goals stress-free", 
          emoji: "🎯", 
          isCorrect: true
        },
        { 
          id: "unnecessary", 
          text: "Buy unnecessary things", 
          emoji: "🛒", 
          isCorrect: false
        },
        { 
          id: "lose", 
          text: "Lose track of money", 
          emoji: "💸", 
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
      }, isCorrect ? 1000 : 800); // Delay if correct to show animation
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
  const Icon = currentQuestionData?.icon || Calculator;

  return (
    <GameShell
      title="Quiz on Budgeting"
      subtitle={showResult ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="finance-kids-22"
      nextGamePathProp="/student/finance/kids/Reflex-Budget"
      nextGameIdProp="finance-kids-23"
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
              
              {/* Icon Display */}
              <div className="flex justify-center mb-4">
                <Icon className="w-16 h-16 text-purple-400 animate-pulse" />
              </div>
              
              <p className="text-white text-lg mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options && currentQuestionData.options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
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

export default BudgetingQuiz;

