import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GoodHabitsPoster = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-96";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stages = [
  {
    id: 1,
    title: "Ready Explorer",
    question: "Which poster best shows a kid who plans ahead for the day?",
    options: [
      {
        id: "a",
        text: "Running Late",
        emoji: "⏰",
        
        isCorrect: false
      },
      {
        id: "b",
        text: "Waiting for Help",
        emoji: "🙋",
       
        isCorrect: false
      },
      {
        id: "c",
        text: "Prepared the Night Before",
        emoji: "🎒",
        
        isCorrect: true
      }
    ]
  },
  {
    id: 2,
    title: "Mindful Speaker",
    question: "Which poster shows a habit that builds strong friendships?",
    options: [
      {
        id: "a",
        text: "Listening Before Speaking",
        emoji: "👂",
        isCorrect: true
      },
      {
        id: "b",
        text: "Talking Non-Stop",
        emoji: "🗣️",
        isCorrect: false
      },
      {
        id: "c",
        text: "Walking Away Quickly",
        emoji: "🚶",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    title: "Focus Builder",
    question: "Which poster shows a habit that helps learning improve?",
    options: [
      {
        id: "a",
        text: "Multitasking Everywhere",
        emoji: "🔀",
        isCorrect: false
      },
      {
        id: "b",
        text: "Finishing One Task Fully",
        emoji: "📘",
        isCorrect: true
      },
      {
        id: "c",
        text: "Switching Often",
        emoji: "📱",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    title: "Kind Citizen",
    question: "Which poster shows a habit that improves shared spaces?",
    options: [
      {
        id: "a",
        text: "Putting Things Back",
        emoji: "🧹",
        isCorrect: true
      },
      {
        id: "b",
        text: "Using and Leaving",
        emoji: "🚪",
        isCorrect: false
      },
      {
        id: "c",
        text: "Waiting for Cleaners",
        emoji: "🧍",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    title: "Balanced Thinker",
    question: "Which poster shows a habit that supports a calm mind?",
    options: [
      {
        id: "a",
        text: "Always Staying Busy",
        emoji: "⚡",
        isCorrect: false
      },
      {
        id: "b",
        text: "Taking Short Quiet Breaks",
        emoji: "🌿",
        isCorrect: true
      },
      {
        id: "c",
        text: "Avoiding All Work",
        emoji: "🛋️",
        isCorrect: false
      }
    ]
  }
];


  const handleOptionSelect = (option) => {
    if (option.isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);

      setTimeout(() => {
        if (currentStage < stages.length - 1) {
          setCurrentStage(prev => prev + 1);
        } else {
          setGameFinished(true);
        }
      }, 1500);
    } else {
      // Show feedback for incorrect answer and move to next question
      showCorrectAnswerFeedback(0, false);
      
      setTimeout(() => {
        if (currentStage < stages.length - 1) {
          setCurrentStage(prev => prev + 1);
        } else {
          setGameFinished(true);
        }
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/habits-journal");
  };

  const currentS = stages[currentStage];

  return (
    <GameShell
      title="Good Habits Poster"
      subtitle={`Poster ${currentStage + 1} of ${stages.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={stages.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">{currentS.title}</h3>
            <p className="text-white/90 text-lg">{currentS.question}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentS.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option)}
                className="bg-white/10 hover:bg-white/20 p-6 rounded-xl border border-white/20 transition-all transform hover:scale-105 flex flex-col items-center gap-4 group"
                disabled={gameFinished}
              >
                <div className="text-6xl group-hover:scale-110 transition-transform">
                  {option.emoji}
                </div>
                <div className="text-white font-bold text-xl text-center">
                  {option.text}
                </div>
                <p className="text-white/70 text-sm text-center">{option.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default GoodHabitsPoster;
