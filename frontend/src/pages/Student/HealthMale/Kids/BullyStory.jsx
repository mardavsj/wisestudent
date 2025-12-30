import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BullyStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "An older kid at school pressures you to steal candy from the store. What do you do?",
      options: [
        {
          id: "b",
          text: "Steal the candy to fit in",
          emoji: "🍬",
          
          isCorrect: false
        },
        {
          id: "a",
          text: "Say no and walk away",
          emoji: "🚶",
          
          isCorrect: true
        },
        {
          id: "c",
          text: "Ask if they have money to buy it",
          emoji: "💰",
          
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Someone threatens to tell your secrets unless you do what they want. What's the right choice?",
      options: [
         {
          id: "a",
          text: "Tell them you won't be bullied",
          emoji: "🛡️",
          isCorrect: true
        },
        {
          id: "c",
          text: "Do what they want to stay safe",
          emoji: "😨",
          isCorrect: false
        },
        {
          id: "b",
          text: "Give them what they want",
          emoji: "😞",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "A bigger kid pushes you and demands your lunch money. What should you do?",
      options: [
        {
          id: "b",
          text: "Fight back physically",
          emoji: "👊",
          isCorrect: false
        },
        {
          id: "a",
          text: "Tell a teacher or parent",
          emoji: "🆘",
          isCorrect: true
        },
        {
          id: "c",
          text: "Give them the money",
          emoji: "💵",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Someone spreads rumors about you to make you look bad. How do you respond?",
      options: [
        {
          id: "c",
          text: "Spread rumors back about them",
          emoji: "👥",
          isCorrect: false
        },
       
        {
          id: "b",
          text: "Get very upset and cry",
          emoji: "😢",
          isCorrect: false
        },
         {
          id: "a",
          text: "Ignore it and stay confident",
          emoji: "💪",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "A group excludes you and says you can't play with them. What's the healthy response?",
      options: [
        {
          id: "b",
          text: "Beg them to let you join",
          emoji: "🙏",
          isCorrect: false
        },
        {
          id: "c",
          text: "Find other friends to play with",
          emoji: "🤝",
          isCorrect: false
        },
        {
          id: "a",
          text: "Remember your worth and find activities you enjoy",
          emoji: "⭐",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (answered) return;
    
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;
    
    setAnswered(true);
    resetFeedback();

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setChoices([...choices, { question: currentQuestion, optionId, isCorrect }]);

    const isLastQuestion = currentQuestion === questions.length - 1;
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/power-of-no-poster");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Bully Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={score}
      gameId="health-male-kids-65"
      gameType="health-male"
      totalLevels={70}
      currentLevel={65}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}

      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult && getCurrentQuestion() ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {getCurrentQuestion().text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getCurrentQuestion().options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{option.text}</h3>
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

export default BullyStory;
