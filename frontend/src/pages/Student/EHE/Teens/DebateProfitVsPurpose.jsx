import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateProfitVsPurpose = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = 1; // Changed from 5 to 1 for +1 coin per correct answer
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which is more important for a business?",
      options: [
        {
          id: "a",
          text: "Profit only",
          emoji: "💰",
          isCorrect: false
        },
        {
          id: "b",
          text: "Purpose with profit",
          emoji: "🎯",
          isCorrect: true
        },
        {
          id: "c",
          text: "Neither profit nor purpose",
          emoji: "❌",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What happens when businesses focus only on short-term profits?",
      options: [
        {
          id: "a",
          text: "They may harm stakeholders and communities",
          emoji: "💥",
          isCorrect: true
        },
        {
          id: "b",
          text: "They always succeed long-term",
          emoji: "📈",
          isCorrect: false
        },
        {
          id: "c",
          text: "They solve all social problems",
          emoji: "🌍",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How does having a clear purpose benefit a business?",
      options: [
        {
          id: "a",
          text: "Attracts loyal customers and talented employees",
          emoji: "👥",
          isCorrect: true
        },
        {
          id: "b",
          text: "Eliminates all competition",
          emoji: "🏆",
          isCorrect: false
        },
        {
          id: "c",
          text: "Requires no financial planning",
          emoji: "💸",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What's the role of profits in purpose-driven businesses?",
      options: [
        
        {
          id: "b",
          text: "Are irrelevant to the mission",
          emoji: "❓",
          isCorrect: false
        },
        {
          id: "c",
          text: "Should be maximized at all costs",
          emoji: "⬆️",
          isCorrect: false
        },
        {
          id: "a",
          text: "Fund the mission and ensure sustainability",
          emoji: "🔄",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "How can businesses balance profit and purpose effectively?",
      options: [
        {
          id: "a",
          text: "Integrate purpose into core strategy and operations",
          emoji: "⚙️",
          isCorrect: true
        },
        {
          id: "b",
          text: "Focus on purpose only during marketing",
          emoji: "📢",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore financial performance completely",
          emoji: "📉",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true); // Changed from 2 to 1 for +1 coin feedback
    }

    setChoices([...choices, { question: currentQuestion, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const getCurrentQuestion = () => {
    // If game is finished, return the last question
    if (gameFinished && questions.length > 0) {
      return questions[questions.length - 1];
    }
    // If currentQuestion is within bounds, return the current question
    if (currentQuestion >= 0 && currentQuestion < questions.length) {
      return questions[currentQuestion];
    }
    // Fallback: return the first question if somehow currentQuestion is negative
    if (questions.length > 0) {
      return questions[0];
    }
    // If no questions exist, return a default object
    return { text: '', options: [] };
  };

  const handleNext = () => {
    navigate("/student/ehe/teens/journal-of-impact");
  };

  return (
    <GameShell
      title="Debate: Profit vs Purpose"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length} // Changed from * 2 to just the count for +1 scoring
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-86"
      gameType="ehe"
      totalLevels={5}
      currentLevel={currentQuestion + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span> 
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">💰</div> {/* Changed emoji to be more relevant to profit vs purpose theme */}
            <h3 className="text-2xl font-bold text-white mb-2">Profit vs Purpose Debate</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    {/* Removed option.description since it's not defined in the options */}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default DebateProfitVsPurpose;