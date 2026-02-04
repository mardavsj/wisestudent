import React, { useState, useEffect } from "react";
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

  // Hardcode rewards: 4 coins per question, 20 total coins, 40 total XP
  const coinsPerLevel = 4;
  const totalCoins = 20;
  const totalXp = 40;

  const [coins, setCoins] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0); // Track number of correct answers for score
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
  
  // Set global window variables for useGameFeedback
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__flashTotalCoins = totalCoins;
      window.__flashQuestionCount = stages.length;
      window.__flashPointsMultiplier = coinsPerLevel;
      
      return () => {
        // Clean up on unmount
        window.__flashTotalCoins = null;
        window.__flashQuestionCount = null;
        window.__flashPointsMultiplier = 1;
      };
    }
  }, [totalCoins, coinsPerLevel, stages.length]);

  // Debug logging
  useEffect(() => {
    console.log('🎮 GoodHabitsPoster debug:', {
      correctAnswers,
      coins,
      coinsPerLevel,
      totalCoins,
      stagesLength: stages.length,
      gameFinished
    });
  }, [correctAnswers, coins, coinsPerLevel, totalCoins, gameFinished, stages.length]);

  // Debug: Log GameShell props
  useEffect(() => {
    if (gameFinished) {
      console.log('🎮 GameShell props:', {
        score: correctAnswers,
        maxScore: stages.length,
        coinsPerLevel,
        totalCoins,
        totalXp,
        totalLevels: stages.length
      });
    }
  }, [gameFinished, correctAnswers, coinsPerLevel, totalCoins, totalXp, stages.length]);


  const handleOptionSelect = (option) => {
    if (option.isCorrect) {
      setCoins(prev => prev + 4); // Increment coins when correct (4 coins per question)
      setCorrectAnswers(prev => prev + 1); // Increment correct answers count
      // Show feedback after state updates
      setTimeout(() => {
        showCorrectAnswerFeedback(1, true);
      }, 50);
      
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
      score={correctAnswers}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/habits-journal"
      nextGameIdProp="health-male-kids-97"
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={stages.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      totalLevels={stages.length}
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
      
      {gameFinished && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Poster Analysis Complete!</h3>
          <p className="text-xl text-white/90 mb-6">
            You finished the game with {correctAnswers} out of {stages.length} correct
          </p>
          <p className="text-xl text-white/90 mb-6">
            You earned {coins} coins!
          </p>
          <p className="text-white/80 mb-8">
            Great job learning about good habits and healthy choices!
          </p>
          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all transform hover:scale-105"
          >
            Next Challenge
          </button>
        </div>
      )}
    </GameShell>
  );
};

export default GoodHabitsPoster;

