import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateBornOrMade = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Are entrepreneurs born or made?",
      options: [
        
        {
          id: "a",
          text: "Born with innate traits only",
          emoji: "✨",
          isCorrect: false
        },
        {
          id: "b",
          text: "Either way, no effort is needed",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "c",
          text: "Made, with skills developed through learning",
          emoji: "📚",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "Can entrepreneurial skills be taught?",
      options: [
        {
          id: "a",
          text: "Yes, through education and practice",
          emoji: "🎓",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, they're completely innate",
          emoji: "🔒",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only some skills can be taught",
          emoji: "📋",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What role does experience play in entrepreneurship?",
      options: [
       
        {
          id: "a",
          text: "Is irrelevant to success",
          emoji: "❌",
          isCorrect: false
        },
         {
          id: "b",
          text: "Builds knowledge and improves decision-making",
          emoji: "📈",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only matters in large corporations",
          emoji: "🏢",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How important is mentorship in developing entrepreneurs?",
      options: [
       
        {
          id: "a",
          text: "Unnecessary if you're naturally talented",
          emoji: "💪",
          isCorrect: false
        },
         {
          id: "b",
          text: "Very important for guidance and learning",
          emoji: "👨‍🏫",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only helpful for beginners",
          emoji: "👶",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the best approach to developing entrepreneurial skills?",
      options: [
        {
          id: "a",
          text: "Combination of learning, practice, and mentorship",
          emoji: "🤝",
          isCorrect: true
        },
        {
          id: "b",
          text: "Relying solely on natural talent",
          emoji: "🎯",
          isCorrect: false
        },
        {
          id: "c",
          text: "Copying successful entrepreneurs exactly",
          emoji: "📎",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
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
    navigate("/student/ehe/teens/journal-of-strengths");
  };

  return (
    <GameShell
      title="Debate: Born or Made?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-16"
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
            <div className="text-5xl mb-4">🎭</div>
            <h3 className="text-2xl font-bold text-white mb-2">Entrepreneurship Debate</h3>
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

export default DebateBornOrMade;