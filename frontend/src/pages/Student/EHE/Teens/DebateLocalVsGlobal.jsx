import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateLocalVsGlobal = () => {
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
      text: "Is studying abroad better than studying locally?",
      options: [
        {
          id: "a",
          text: "Yes, always better",
          emoji: "✅",
          isCorrect: false
        },
        {
          id: "b",
          text: "No, always worse",
          emoji: "❌",
          isCorrect: false
        },
        {
          id: "c",
          text: "Both have value depending on individual goals",
          emoji: "⚖️",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "What's an advantage of studying locally?",
      options: [
        
        {
          id: "b",
          text: "No quality education available",
          emoji: "🚫",
          isCorrect: false
        },
        {
          id: "a",
          text: "Lower cost and family support",
          emoji: "💰",
          isCorrect: true
        },
        {
          id: "c",
          text: "Limited career prospects",
          emoji: "📉",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What's an advantage of studying abroad?",
      options: [
        
        {
          id: "b",
          text: "No language barriers",
          emoji: "🔇",
          isCorrect: false
        },
        {
          id: "c",
          text: "Less challenging",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "a",
          text: "Global perspective and cultural exposure",
          emoji: "🌍",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "What should guide the decision between local and international education?",
      options: [
        {
          id: "a",
          text: "Personal goals, financial situation, and career plans",
          emoji: "🎯",
          isCorrect: true
        },
        {
          id: "b",
          text: "What's trendy among peers",
          emoji: "👥",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only the cost factor",
          emoji: "🏷️",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can students maximize value from either local or international education?",
      options: [
        
        {
          id: "b",
          text: "Avoid all extracurricular activities",
          emoji: "📚",
          isCorrect: false
        },
        {
          id: "c",
          text: "Focus only on grades",
          emoji: "💯",
          isCorrect: false
        },
        {
          id: "a",
          text: "Engage actively, build networks, and pursue opportunities",
          emoji: "🤝",
          isCorrect: true
        },
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
    navigate("/student/ehe/teens/journal-teen-goals");
  };

  return (
    <GameShell
      title="Debate: Local vs Global"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length} // Changed from * 2 to just the count for +1 scoring
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-66"
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
            <div className="text-5xl mb-4">🌍</div> {/* Changed emoji to be more relevant to local vs global theme */}
            <h3 className="text-2xl font-bold text-white mb-2">Local vs Global Education Debate</h3>
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

export default DebateLocalVsGlobal;