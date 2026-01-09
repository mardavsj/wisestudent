import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BreatheWithMe = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-42");
  const gameId = gameData?.id || "uvls-kids-42";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for BreatheWithMe, using fallback ID");
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
    text: "You feel nervous before speaking in class. What breathing helps you feel steady?",
    options: [
      
      {
        id: "b",
        text: "Hold your breath tightly",
        emoji: "😣",
        isCorrect: false
      },
      {
        id: "a",
        text: "Slowly breathe in through your nose and out through your mouth",
        emoji: "🌬️",
        isCorrect: true
      },
      {
        id: "c",
        text: "Breathe very fast",
        emoji: "💨",
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    text: "Your heart beats fast after running. What breathing helps it slow down?",
    options: [
      {
        id: "a",
        text: "Take slow breaths and feel your body relax",
        emoji: "🫶",
        isCorrect: true
      },
      {
        id: "b",
        text: "Sit without breathing",
        emoji: "😵",
        isCorrect: false
      },
      {
        id: "c",
        text: "Talk loudly while breathing",
        emoji: "🗣️",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "You feel angry after a disagreement. What breathing choice helps you calm?",
    options: [
      
      {
        id: "b",
        text: "Clench your fists and stop breathing",
        emoji: "✊",
        isCorrect: false
      },
      {
        id: "c",
        text: "Breathe loudly through your mouth",
        emoji: "😤",
        isCorrect: false
      },
      {
        id: "a",
        text: "Breathe in slowly and release the air gently",
        emoji: "🍃",
        isCorrect: true
      },
    ]
  },
  {
    id: 4,
    text: "You cannot fall asleep easily. What breathing helps your body rest?",
    options: [
      
      {
        id: "b",
        text: "Breathe fast to feel tired",
        emoji: "⚡",
        isCorrect: false
      },
      {
        id: "a",
        text: "Breathe slowly and imagine your body getting heavier",
        emoji: "🌙",
        isCorrect: true
      },
      {
        id: "c",
        text: "Hold your breath under the blanket",
        emoji: "🛌",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "You feel overwhelmed with many thoughts. What breathing helps you focus?",
    options: [
      {
        id: "a",
        text: "Breathe slowly and pay attention to each breath",
        emoji: "🧠",
        isCorrect: true
      },
      {
        id: "b",
        text: "Ignore breathing and think faster",
        emoji: "🔁",
        isCorrect: false
      },
      {
        id: "c",
        text: "Breathe randomly without noticing",
        emoji: "❓",
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



  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Breathe with Me"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/uvls/kids/mood-match"
      nextGameIdProp="uvls-kids-43"
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

export default BreatheWithMe;