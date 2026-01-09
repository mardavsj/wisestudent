import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ShopStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-8";
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
      text: "You spot your favorite candy. You have ₹10, but you’ve been saving ₹5 a week for a ₹50 toy and currently have ₹20 saved. What do you do?",
      options: [
        { 
          id: "save", 
          text: "Save for Toy", 
          emoji: "🏦", 
          
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Buy Candy", 
          emoji: "🍬", 
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Ignore Decision", 
          emoji: "😴", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You see a cool sticker book that costs ₹25. You have ₹30 saved for a larger toy. What's the smart choice?",
      options: [
        { 
          id: "spend", 
          text: "Buy sticker book", 
          emoji: "📚", 
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Continue saving", 
          emoji: "🎯", 
          isCorrect: true
        },
        { 
          id: "borrow", 
          text: "Borrow Money", 
          emoji: "🤲", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You see friends buying snacks at the shop. You have ₹15 saved for a science kit. What should you do?",
      options: [
        { 
          id: "spend", 
          text: "Join friends", 
          emoji: "🍟", 
          isCorrect: false
        },
        { 
          id: "give", 
          text: "Give Up Saving", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Stick to your goal", 
          emoji: "🔬", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "You see a 'Sale: 50% Off' sign on toys. You're saving ₹100 for a bicycle. The sale toy costs ₹40. What's wise?",
      options: [
        { 
          id: "save", 
          text: "Focus on bicycle", 
          emoji: "🚲", 
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Buy sale toy", 
          emoji: "🧸", 
          isCorrect: false
        },
        { 
          id: "delay", 
          text: "Delay Decision", 
          emoji: "⏰", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You've saved ₹45 for a ₹50 toy. You see candy that costs ₹5. You're almost at your goal! What do you choose?",
      options: [
        { 
          id: "spend", 
          text: "Buy candy", 
          emoji: "🍬", 
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Complete your goal", 
          emoji: "🎉", 
          isCorrect: true
        },
        { 
          id: "waste", 
          text: "Waste Money", 
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
      currentLevel={currentQuestion + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      score={coins}
      gameId={gameId}
      nextGamePathProp="/student/finance/kids/reflex-money-choice"
      nextGameIdProp="finance-kids-9"
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
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
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

export default ShopStory;

