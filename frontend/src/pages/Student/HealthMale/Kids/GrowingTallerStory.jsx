import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GrowingTallerStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-21";
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
      text: "You're growing taller. Which body part grows first during a growth spurt?",
      options: [
       
        {
          id: "b",
          text: "Arms",
          emoji: "💪",
          isCorrect: false
        },
        {
          id: "c",
          text: "Head",
          emoji: "🧠",
          isCorrect: false
        },
         {
          id: "a",
          text: "Legs",
          emoji: "🦵",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "During growth, which vitamin helps your body use calcium from food?",
      options: [
        {
          id: "a",
          text: "Vitamin D",
          emoji: "☀️",
          isCorrect: true
        },
        {
          id: "b",
          text: "Vitamin C",
          emoji: "🍊",
          isCorrect: false
        },
        {
          id: "c",
          text: "Vitamin B12",
          emoji: "💊",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What happens to your skeleton as you grow taller?",
      options: [
       
        {
          id: "b",
          text: "Bones just get longer without changing",
          emoji: "📏",
          isCorrect: false
        },
        {
          id: "c",
          text: "You grow extra bones",
          emoji: "🧩",
          isCorrect: false
        },
         {
          id: "a",
          text: "Old bones break down and new bones form",
          emoji: "🔄",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "Why do you need more energy as you grow taller?",
      options: [
        
        {
          id: "b",
          text: "You get more tired easily",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "a",
          text: "Your body needs energy to build new tissue",
          emoji: "⚡",
          isCorrect: true
        },
        {
          id: "c",
          text: "Food tastes better when growing",
          emoji: "😋",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Which part of your bones helps you grow taller?",
      options: [
        {
          id: "a",
          text: "Growth plates",
          emoji: "📈",
          isCorrect: true
        },
        {
          id: "b",
          text: "Bone marrow",
          emoji: "🦴",
          isCorrect: false
        },
        {
          id: "c",
          text: "Cartilage in joints",
          emoji: "🔗",
          isCorrect: false
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

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Growing Taller Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={score}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/quiz-growth"
      nextGameIdProp="health-male-kids-22"
      gameType="health-male"
      totalLevels={5}
      currentLevel={21}
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

export default GrowingTallerStory;

