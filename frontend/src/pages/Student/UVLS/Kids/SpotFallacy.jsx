import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SpotFallacy = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-59");
  const gameId = gameData?.id || "uvls-kids-59";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SpotFallacy, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
  {
    id: 1,
    text: "Which sentence does not make logical sense?",
    options: [
      
      {
        id: "b",
        text: "Washing hands keeps germs away.",
        emoji: "🧼",
        isCorrect: false
      },
      {
        id: "c",
        text: "Shoes protect feet.",
        emoji: "👟",
        isCorrect: false
      },
      {
        id: "a",
        text: "Fish live in water, so all water animals are fish.",
        emoji: "🐟",
        isCorrect: true
      },
    ]
  },
  {
    id: 2,
    text: "Which idea uses faulty thinking?",
    options: [
     
      {
        id: "b",
        text: "Practicing improves skills.",
        emoji: "🎯",
        isCorrect: false
      },
       {
        id: "a",
        text: "One fast runner wins one race, so they win every race.",
        emoji: "🏃",
        isCorrect: true
      },
      {
        id: "c",
        text: "Food gives energy.",
        emoji: "🍎",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "Which statement shows incorrect reasoning?",
    options: [
      {
        id: "a",
        text: "This pencil works, so every pencil works forever.",
        emoji: "✏️",
        isCorrect: true
      },
      {
        id: "b",
        text: "Plants need sunlight to grow.",
        emoji: "🌱",
        isCorrect: false
      },
      {
        id: "c",
        text: "Rest helps the body recover.",
        emoji: "😴",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "Which thought jumps to the wrong conclusion?",
    options: [
      
      {
        id: "b",
        text: "Rain helps plants grow.",
        emoji: "🌼",
        isCorrect: false
      },
      {
        id: "c",
        text: "Umbrellas keep people dry.",
        emoji: "☂️",
        isCorrect: false
      },
      {
        id: "a",
        text: "One rainy day ruins the whole month.",
        emoji: "🌧️",
        isCorrect: true
      },
    ]
  },
  {
    id: 5,
    text: "Which sentence shows a thinking mistake?",
    options: [
      
      {
        id: "b",
        text: "Honesty builds trust.",
        emoji: "🤝",
        isCorrect: false
      },
      {
        id: "a",
        text: "One friend lies once, so no one can be trusted.",
        emoji: "🤥",
        isCorrect: true
      },
      {
        id: "c",
        text: "Listening helps solve problems.",
        emoji: "👂",
        isCorrect: false
      }
    ]
  }
];


  const handleChoice = (isCorrect) => {
    if (answered) return;
    
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

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Spot Fallacy"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/uvls/kids/critical-thinker-badge"
      nextGameIdProp="uvls-kids-60"
      gameType="uvls"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{option.text}</h3>

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

export default SpotFallacy;