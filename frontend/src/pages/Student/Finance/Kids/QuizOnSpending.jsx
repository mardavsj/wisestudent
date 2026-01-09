import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const QuizOnSpending = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-12";
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
      text: "What is the best spending habit?",
      options: [
        { 
          id: "a", 
          text: "Buy without thinking", 
          emoji: "💸", 
          
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Compare and choose", 
          emoji: "🤔", 
          
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Borrow for fun", 
          emoji: "💳", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which is a smart way to spend money?",
      options: [
        {
          id: "a",
          text: "Budget first",
          emoji: "📋",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Spend all at once", 
          emoji: "🛍️", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Buy what's popular", 
          emoji: "🔥", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What should you do before a big purchase?",
      options: [
        { 
          id: "a", 
          text: "Buy on credit", 
          emoji: "💳", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Ask friends", 
          emoji: "👥", 
          isCorrect: false
        },
        {
          id: "c",
          text: "Save up first",
          emoji: "🏦",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "Which spending habit helps you in the future?",
      options: [
        { 
          id: "a", 
          text: "Spend on wants", 
          emoji: "🎯", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Save for needs", 
          emoji: "💰", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Buy expensive items", 
          emoji: "💎", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the smartest approach to shopping?",
      options: [
        {
          id: "a",
          text: "Make a list",
          emoji: "📝",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Impulse buying", 
          emoji: "⚡", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Follow trends", 
          emoji: "📈", 
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
      title="Quiz on Spending"
      subtitle={showResult ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="finance-kids-12"
      nextGamePathProp="/student/finance/kids/reflex-spending"
      nextGameIdProp="finance-kids-13"
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
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-4">{option.emoji}</div>
                      <div>
                        <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                        <p className="text-white/90 text-sm">{option.description}</p>
                      </div>
                    </div>
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

export default QuizOnSpending;

