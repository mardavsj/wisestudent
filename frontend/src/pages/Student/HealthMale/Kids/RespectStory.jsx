import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RespectStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-35";
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
      text: "How can we show respect to our friends?",
      options: [
       
        {
          id: "b",
          text: "Ignore them",
          emoji: "😒",
          isCorrect: false
        },
        {
          id: "c",
          text: "Make fun of them",
          emoji: "😂",
          isCorrect: false
        },
         {
          id: "a",
          text: "Listen when they talk",
          emoji: "👂",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "What should you do if someone touches you and it makes you feel uncomfortable?",
      options: [
        {
          id: "a",
          text: "Tell a trusted adult",
          emoji: "👩‍💼",
          isCorrect: true
        },
        {
          id: "b",
          text: "Keep it a secret",
          emoji: "🤐",
          isCorrect: false
        },
        {
          id: "c",
          text: "Touch them back",
          emoji: "✋",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How do we show respect for someone's personal space?",
      options: [
        
        {
          id: "b",
          text: "Stand very close without asking",
          emoji: "👂",
          isCorrect: false
        },
        {
          id: "a",
          text: "Ask before giving a hug",
          emoji: "🤗",
          isCorrect: true
        },
        {
          id: "c",
          text: "Touch their things without permission",
          emoji: "🤲",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What is a good way to treat others with respect?",
      options: [
       
        {
          id: "b",
          text: "Call them names",
          emoji: "😤",
          isCorrect: false
        },
        {
          id: "c",
          text: "Exclude them from games",
          emoji: "🙅",
          isCorrect: false
        },
         {
          id: "a",
          text: "Use kind words",
          emoji: "😊",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "Why is it important to respect other people?",
      options: [
       
        {
          id: "b",
          text: "It's only important sometimes",
          emoji: "⏰",
          isCorrect: false
        },
         {
          id: "a",
          text: "It helps everyone feel safe and happy",
          emoji: "😊",
          isCorrect: true
        },
        {
          id: "c",
          text: "It doesn't really matter",
          emoji: "🤷",
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
      title="Respect Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={score}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/my-body-respect-poster"
      nextGameIdProp="health-male-kids-36"
      gameType="health-male"
      totalLevels={5}
      currentLevel={35}
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
                    {/* Removed description for kid-friendly UI */}
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

export default RespectStory;