import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SleepStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-95";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

 const questions = [
  {
    id: 1,
    text: "A young artist wants steady hands for drawing tomorrow morning. What choice supports that goal?",
    options: [
      {
        id: "a",
        text: "Draw all night",
        emoji: "✏️",
        isCorrect: false
      },
      {
        id: "b",
        text: "Watch random videos",
        emoji: "📱",
        isCorrect: false
      },
      {
        id: "c",
        text: "Pack art tools and rest early",
        emoji: "🎨",
        isCorrect: true
      }
    ]
  },
  {
    id: 2,
    text: "A pilot-in-training has a practice session early. What evening habit fits the role?",
    options: [
      {
        id: "a",
        text: "Drink sugary drinks",
        emoji: "🥤",
        isCorrect: false
      },
      {
        id: "b",
        text: "Check schedule and wind down",
        emoji: "🛫",
        isCorrect: true
      },
      {
        id: "c",
        text: "Play fast-paced games",
        emoji: "🎮",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "A nurse wants to stay calm and focused for the next day. What routine helps most?",
    options: [
      {
        id: "a",
        text: "Quiet time with dim lights",
        emoji: "🌙",
        isCorrect: true
      },
      {
        id: "b",
        text: "Loud music",
        emoji: "🔊",
        isCorrect: false
      },
      {
        id: "c",
        text: "Late-night snacks",
        emoji: "🍕",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "An athlete wants quick reflexes in tomorrow’s match. What evening choice supports that?",
    options: [
      {
        id: "a",
        text: "Practice nonstop",
        emoji: "🏃",
        isCorrect: false
      },
      {
        id: "b",
        text: "Stretch, relax, and rest",
        emoji: "🧘",
        isCorrect: true
      },
      {
        id: "c",
        text: "Scroll on phone",
        emoji: "📲",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "A young inventor wants fresh ideas tomorrow. What night habit helps creativity?",
    options: [
      {
        id: "a",
        text: "Keep thinking without stopping",
        emoji: "💡",
        isCorrect: false
      },
      {
        id: "b",
        text: "Leave the room messy",
        emoji: "🧹",
        isCorrect: false
      },
      {
        id: "c",
        text: "Write ideas, then sleep peacefully",
        emoji: "📓",
        isCorrect: true
      }
    ]
  }
];

  const handleChoice = (optionId) => {
    if (answered) return;
    
    const selectedOption = questions[currentQuestion].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;
    
    setAnswered(true);
    resetFeedback();

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

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
    navigate("/student/health-male/kids/good-habits-poster");
  };

  return (
    <GameShell
      title="Sleep Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 3}
    >
      <div className="space-y-8">
        {!showResult && questions[currentQuestion] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {questions[currentQuestion].text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questions[currentQuestion].options.map((option) => (
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

export default SleepStory;
