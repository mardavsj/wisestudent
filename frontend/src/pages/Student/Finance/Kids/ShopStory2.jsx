import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ShopStory2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-15";
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
      text: "You see two pens in the store. One costs ₹50 and the other costs ₹15. Both work the same. Which should you buy?",
      options: [
        { 
          id: "costly", 
          text: "Costly pen", 
          emoji: "🖋️", 
          
          isCorrect: false
        },
        { 
          id: "compare", 
          text: "Check reviews first", 
          emoji: "🔍", 
          
          isCorrect: false
        },
        {
          id: "affordable",
          text: "Affordable pen",
          emoji: "✏️",
          
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "You have ₹100 to spend on clothes. You find a shirt you like for ₹80 and another similar one for ₹30. What's smart?",
      options: [
        { 
          id: "affordable", 
          text: "Buy cheaper shirt", 
          emoji: "👕", 
          isCorrect: true
        },
        { 
          id: "costly", 
          text: "Buy expensive shirt", 
          emoji: "👔", 
          isCorrect: false
        },
        { 
          id: "wait", 
          text: "Wait for sale", 
          emoji: "📅", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You're buying snacks for a party. Brand A costs ₹200 and Brand B costs ₹120. Both have the same taste. Which?",
      options: [
        { 
          id: "costly", 
          text: "Buy Brand A", 
          emoji: "🍫", 
          isCorrect: false
        },
        {
          id: "affordable",
          text: "Buy Brand B",
          emoji: "🍪",
          isCorrect: true
        },
        { 
          id: "mix", 
          text: "Buy some of each", 
          emoji: "✌️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You need a backpack for school. One costs ₹800 and another costs ₹400. Both are good quality. What's wise?",
      options: [
        { 
          id: "affordable", 
          text: "Buy ₹400 backpack", 
          emoji: "🎒", 
          isCorrect: true
        },
        { 
          id: "costly", 
          text: "Buy ₹800 backpack", 
          emoji: "💼", 
          isCorrect: false
        },
        { 
          id: "borrow", 
          text: "Borrow for now", 
          emoji: "🤝", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You're buying groceries. Organic vegetables cost ₹300 and regular ones cost ₹150. Both are nutritious. Which?",
      options: [
        { 
          id: "costly", 
          text: "Buy organic veggies", 
          emoji: "🥦", 
          isCorrect: false
        },
        { 
          id: "selective", 
          text: "Mix both types", 
          emoji: "🥗", 
          isCorrect: false
        },
        {
          id: "affordable",
          text: "Buy regular veggies",
          emoji: "🥕",
          isCorrect: true
        },
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
      title="Shop Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="finance-kids-15"
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/kids/poster-smart-shopping"
      nextGameIdProp="finance-kids-16"
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

export default ShopStory2;