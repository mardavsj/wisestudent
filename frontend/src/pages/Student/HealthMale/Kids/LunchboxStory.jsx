import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LunchboxStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-15";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You packed a lunch with a cheese and veggie wrap, an apple, and water. Your friend offers to trade for chips and soda. What do you do?",
      options: [
        {
          id: "b",
          text: "Trade for the chips and soda",
          emoji: "🥤",
          isCorrect: false
        },
        {
          id: "a",
          text: "Keep your healthy lunch",
          emoji: "🥗",
          isCorrect: true
        },
        {
          id: "c",
          text: "Share both lunches",
          emoji: "🤝",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "During recess, you feel thirsty and tired. You have a choice between a sports drink or water with a banana. What do you choose?",
      options: [
        {
          id: "a",
          text: "Water with banana",
          emoji: "🍌",
          isCorrect: true
        },
        {
          id: "b",
          text: "Sports drink",
          emoji: "🥤",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip both",
          emoji: "😴",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You forgot your lunch money but brought a packed lunch. A classmate forgot their lunch and has money for the cafeteria. What is the kind thing to do?",
      options: [
        
        {
          id: "b",
          text: "Trade your lunch for their money",
          emoji: "💰",
          isCorrect: false
        },
        {
          id: "a",
          text: "Eat your lunch alone",
          emoji: "🤫",
          isCorrect: false
        },
        {
          id: "c",
          text: "Share your lunch with your friend",
          emoji: "🤝",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "You packed a warm soup in your thermos, but it's still cold at lunchtime. What should you do?",
      options: [
        {
          id: "b",
          text: "Ask the cafeteria staff to warm it",
          emoji: "🌡️",
          isCorrect: false
        },
        {
          id: "c",
          text: "Eat it cold or wait for it to warm up",
          emoji: "😋",
          isCorrect: true
        },
        {
          id: "a",
          text: "Throw it away and buy lunch",
          emoji: "🗑️",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You notice your friend always brings unhealthy snacks and never eats lunch. How can you help?",
      options: [
        
        {
          id: "a",
          text: "Ignore the problem",
          emoji: "🤷",
          isCorrect: false
        },
        {
          id: "c",
          text: "Complain about it to others",
          emoji: "🤐",
          isCorrect: false
        },
        {
          id: "b",
          text: "Teach your friend about healthy choices",
          emoji: "📚",
          isCorrect: true
        },
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

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Lunchbox Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={score}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="health-male"
      totalLevels={5}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
    >
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

export default LunchboxStory;