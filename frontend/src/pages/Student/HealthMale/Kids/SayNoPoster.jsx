import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SayNoPoster = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-86";
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
    title: "Clear Message",
    question: "A poster shows a child standing straight with a calm face and raised hand. What message is the poster sending?",
    options: [
      {
        id: "a",
        text: "The child is asking a question",
        emoji: "❓",
        
        isCorrect: false
      },
      {
        id: "b",
        text: "The child wants attention",
        emoji: "👀",
        isCorrect: false
      },
      {
        id: "c",
        text: "The child is clearly setting a boundary",
        emoji: "🫥",
        isCorrect: true
      }
    ]
  },
  {
    id: 2,
    title: "Next Step",
    question: "In a poster, a child is shown turning away after refusing something unsafe. What does this action mean?",
    options: [
      {
        id: "a",
        text: "Leaving to stay safe",
        emoji: "🚶",
        isCorrect: true
      },
      {
        id: "b",
        text: "Ignoring everyone forever",
        emoji: "🙉",
        isCorrect: false
      },
      {
        id: "c",
        text: "Feeling embarrassed",
        emoji: "😳",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    title: "Positive Choice",
    question: "A poster shows kids choosing an activity together after saying no. What idea is being shared?",
    options: [
      {
        id: "a",
        text: "Distractions solve every problem",
        emoji: "🎮",
        isCorrect: false
      },
      {
        id: "b",
        text: "Healthy activities give better options",
        emoji: "🏀",
        isCorrect: true
      },
      {
        id: "c",
        text: "Fun only matters",
        emoji: "🎉",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    title: "True Friendship",
    question: "A poster shows two friends listening calmly when one says no. What value is the poster teaching?",
    options: [
      {
        id: "a",
        text: "Respecting each other’s choices",
        emoji: "🤝",
        isCorrect: true
      },
      {
        id: "b",
        text: "Always agreeing with friends",
        emoji: "👍",
        isCorrect: false
      },
      {
        id: "c",
        text: "Avoiding difficult talks",
        emoji: "😶",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    title: "Inner Strength",
    question: "A poster shows a child choosing a different path while others go another way. What strength is being shown?",
    options: [
      {
        id: "a",
        text: "Wanting to be different",
        emoji: "🎨",
        isCorrect: false
      },
      {
        id: "b",
        text: "Confidence to make safe decisions",
        emoji: "🛡️",
        isCorrect: true
      },
      {
        id: "c",
        text: "Disliking groups",
        emoji: "🚫",
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
    navigate("/student/health-male/kids/refusal-journal");
  };

  const currentS = stages[currentStage];

  return (
    <GameShell
      title="Say No Poster"
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

export default SayNoPoster;
