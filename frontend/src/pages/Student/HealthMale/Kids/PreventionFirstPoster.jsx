import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PreventionFirstPoster = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-76";
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
      title: "Hand Washing",
      question: "Which poster shows the best way to stop germs?",
      options: [
        {
          id: "a",
          text: "Wash Hands Often",
          emoji: "🤲",
          
          isCorrect: true
        },
        {
          id: "b",
          text: "Wipe on Pants",
          emoji: "👖",
       
          isCorrect: false
        },
        {
          id: "c",
          text: "Just Use Water",
          emoji: "💧",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Covering Coughs",
      question: "Which poster shows how to cough safely?",
      options: [
        {
          id: "b",
          text: "Cough in Air",
          emoji: "🌬️",
          isCorrect: false
        },
        {
          id: "c",
          text: "Cough in Hands",
          emoji: "🤲",
          isCorrect: false
        },
        {
          id: "a",
          text: "Vampire Cough",
          emoji: "🧛",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      title: "Healthy Eating",
      question: "Which poster shows food that fights sickness?",
      options: [
        {
          id: "b",
          text: "Soda Pop",
          emoji: "🥤",
          isCorrect: false
        },
        {
          id: "a",
          text: "Fruits & Veggies",
          emoji: "🍎",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only Candy",
          emoji: "🍭",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Active Play",
      question: "Which poster shows how to keep your body strong?",
      options: [
        {
          id: "c",
          text: "Sleep All Day",
          emoji: "🛌",
          isCorrect: false
        },
        {
          id: "b",
          text: "Watch TV All Day",
          emoji: "📺",
          isCorrect: false
        },
        {
          id: "a",
          text: "Play Outside",
          emoji: "⚽",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      title: "Sleep Well",
      question: "Which poster shows good sleep habits?",
      options: [
        {
          id: "b",
          text: "Sleep with Lights On",
          emoji: "💡",
          isCorrect: false
        },
        {
          id: "a",
          text: "Early Bedtime",
          emoji: "🌙",
          isCorrect: true
        },
        {
          id: "c",
          text: "Stay Up Late",
          emoji: "🦉",
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
    navigate("/student/health-male/kids/safety-journal");
  };

  const currentS = stages[currentStage];

  return (
    <GameShell
      title="Prevention First Poster"
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

export default PreventionFirstPoster;
