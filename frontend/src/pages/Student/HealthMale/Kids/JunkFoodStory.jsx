import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const JunkFoodStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-18";
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
      text: "You're at a movie theater with your family. There's a large bucket of buttered popcorn, nachos with cheese, and a big soda. What do you choose to eat?",
      options: [
        {
          id: "b",
          text: "All of the snacks and soda",
          emoji: "🍽️",
          isCorrect: false
        },
        {
          id: "a",
          text: "Just a small portion of popcorn",
          emoji: "🍿",
          isCorrect: true
        },
        {
          id: "c",
          text: "Skip the snacks and drink water",
          emoji: "💧",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your parents allow you to pick one snack for movie night. Which do you choose to make it special but still healthy?",
      options: [
        {
          id: "a",
          text: "Air-popped popcorn with a small amount of seasoning",
          emoji: "🍿",
          isCorrect: true
        },
        {
          id: "b",
          text: "Candy and cookies",
          emoji: "🍭",
          isCorrect: false
        },
        {
          id: "c",
          text: "Nothing at all",
          emoji: "😶",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "At a school carnival, you have 5 tickets for food. The options are: cotton candy, candy apples, or fresh fruit kabobs. What do you pick?",
      options: [
        {
          id: "c",
          text: "Cotton candy with all tickets",
          emoji: "🍭",
          isCorrect: false
        },
       
        {
          id: "a",
          text: "Only fruit kabobs",
          emoji: "🍎",
          isCorrect: false
        },
         {
          id: "b",
          text: "Mix of cotton candy and fruit kabobs",
          emoji: "💭",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "You're at a fast food restaurant with your grandparents. They say you can order one thing. What do you choose?",
      options: [
        {
          id: "b",
          text: "Extra large fries and a milkshake",
          emoji: "🍟",
          isCorrect: false
        },
        {
          id: "c",
          text: "A small burger with a side salad",
          emoji: "🥗",
          isCorrect: true
        },
        {
          id: "a",
          text: "Just a drink",
          emoji: "🥤",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Your mom packed your lunch, but your friends brought store-bought snacks to share. Some kids pressure you to trade. What's the best approach?",
      options: [
        {
          id: "b",
          text: "Trade for the snacks every day",
          emoji: "🍫",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Refuse all snacks from friends",
          emoji: "🙅",
          isCorrect: false
        },
        {
          id: "a",
          text: "Keep your healthy lunch but try a small bite of their snack",
          emoji: "😋",
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
      title="Junk Food Story"
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
      currentLevel={18}
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

export default JunkFoodStory;
