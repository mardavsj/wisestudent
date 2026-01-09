import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ShavingStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-45";
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
      text: "You see facial hair growing. Should you learn safe shaving?",
      options: [
        {
          id: "b",
          text: "No, ignore it",
          emoji: "🙈",
          
          isCorrect: false
        },
        {
          id: "a",
          text: "Yes, learn properly",
          emoji: "🛡️",
          
          isCorrect: true
        },
        {
          id: "c",
          text: "Use any sharp object",
          emoji: "🔪",
    
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your dad shows you how to shave. What do you do?",
      options: [
        {
          id: "a",
          text: "Watch and learn carefully",
          emoji: "👀",
          isCorrect: true
        },
        {
          id: "b",
          text: "Try it alone first",
          emoji: "🧑‍🦰",
          isCorrect: false
        },
        {
          id: "c",
          text: "Say you don't need it",
          emoji: "🙅",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You cut yourself while shaving. What's the right response?",
      options: [
        {
          id: "c",
          text: "Keep shaving",
          emoji: "🩸",
          isCorrect: false
        },
        {
          id: "b",
          text: "Hide the cut",
          emoji: "🤐",
          isCorrect: false
        },
        {
          id: "a",
          text: "Clean it and use antiseptic",
          emoji: "🩹",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "How often should you change your razor blade?",
      options: [
        {
          id: "b",
          text: "Never, use forever",
          emoji: "♻️",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only when it breaks",
          emoji: "💔",
          isCorrect: false
        },
        {
          id: "a",
          text: "Every few uses",
          emoji: "🔄",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "You feel embarrassed about facial hair. What helps?",
      options: [
        {
          id: "b",
          text: "Avoid mirrors",
          emoji: "🙈",
          isCorrect: false
        },
        {
          id: "a",
          text: "Learn proper grooming",
          emoji: "💇",
          isCorrect: true
        },
        {
          id: "c",
          text: "Compare with friends",
          emoji: "👥",
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
      title="Shaving Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={score}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/stay-fresh-poster-advanced"
      nextGameIdProp="health-male-kids-46"
      gameType="health-male"
      totalLevels={5}
      currentLevel={45}
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

export default ShavingStory;

