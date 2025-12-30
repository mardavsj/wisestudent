import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AngerStory = () => {
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
      text: "Your friend breaks your favorite toy by accident. You feel very angry. What should you do?",
      options: [
        {
          id: "b",
          text: "Hit your friend",
          emoji: "👊",
          
          isCorrect: false
        },
        {
          id: "a",
          text: "Take deep breaths and calm down",
          emoji: "🧘",
          
          isCorrect: true
        },
        {
          id: "c",
          text: "Break their toy too",
          emoji: "💥",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your sibling takes your turn on the game without asking. You feel mad! What's the best choice?",
      options: [
        {
          id: "c",
          text: "Yell and call them names",
          emoji: "😡",
          isCorrect: false
        },

        {
          id: "b",
          text: "Push them away from the game",
          emoji: "🤜",
          isCorrect: false
        },
         {
          id: "a",
          text: "Say 'I feel angry when you don't wait your turn'",
          emoji: "💬",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "You lose a game and feel angry at yourself. What should you do?",
      options: [
       {
          id: "a",
          text: "Say 'It's okay, I'll try again next time'",
          emoji: "🔄",
          isCorrect: true
        },
        {
          id: "b",
          text: "Throw the game pieces",
          emoji: "🎲",
          isCorrect: false
        },
        {
          id: "c",
          text: "Give up and never play again",
          emoji: "😞",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Your parents say no to getting a pet. You feel angry! What's healthy?",
      options: [
        {
          id: "c",
          text: "Slam doors and stomp feet",
          emoji: "🚪",
          isCorrect: false
        },
        {
          id: "a",
          text: "Ask why and talk about your feelings",
          emoji: "🗣️",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stay mad and don't talk to them",
          emoji: "😠",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You feel angry because you can't have ice cream before dinner. What helps?",
      options: [
        {
          id: "b",
          text: "Sneak ice cream when no one is looking",
          emoji: "🍨",
          isCorrect: false
        },
        {
          id: "c",
          text: "Cry and say you'll never eat dinner",
          emoji: "😢",
          isCorrect: false
        },
        {
          id: "a",
          text: "Wait for dessert time and enjoy it then",
          emoji: "⏰",
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
    navigate("/student/health-male/kids/reflex-emotion-alert");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Anger Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={score}
      gameId="health-male-kids-58"
      gameType="health-male"
      totalLevels={60}
      currentLevel={58}
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

export default AngerStory;
