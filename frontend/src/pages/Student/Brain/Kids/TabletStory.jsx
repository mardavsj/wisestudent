import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TabletStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-71");
  const gameId = gameData?.id || "brain-kids-71";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for TabletStory, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
  {
    id: 1,
    text: "After school, Aarav starts using his tablet and time passes quickly. By evening, his homework is still untouched. What choice helps him manage both play and work?",
    options: [
      
      {
        id: "continue",
        text: "Keep playing and finish homework later",
        emoji: "⏳",
        isCorrect: false
      },
      {
        id: "rush",
        text: "Play freely and rush homework at night",
        emoji: "🌙",
        isCorrect: false
      },
      {
        id: "schedule",
        text: "Set a clear order: work first, then screen time",
        emoji: "🗂️",
        isCorrect: true
      },
    ]
  },
  {
    id: 2,
    text: "During the weekend, Mehul spends most of the day on his tablet indoors. By night, his body feels restless. What supports both fun and movement?",
    options: [
      {
        id: "mix",
        text: "Balance screen time with outdoor activity",
        emoji: "⚽",
        isCorrect: true
      },
      {
        id: "stayinside",
        text: "Continue indoor gaming all day",
        emoji: "🏠",
        isCorrect: false
      },
      {
        id: "ignorebody",
        text: "Ignore the restless feeling",
        emoji: "🫥",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "Nina enjoys watching videos and realizes she hasn’t read anything in days. What helps her brain stay active in different ways?",
    options: [
      
      {
        id: "binge",
        text: "Watch more to finish the series",
        emoji: "📺",
        isCorrect: false
      },
      {
        id: "variety",
        text: "Switch between videos, reading, and creative play",
        emoji: "🎨",
        isCorrect: true
      },
      {
        id: "delay",
        text: "Plan reading for another week",
        emoji: "🗓️",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "While scrolling on a tablet, Karan forgets his daily chores. What strategy helps him stay responsible?",
    options: [
      
      {
        id: "multitask",
        text: "Try to do chores while watching",
        emoji: "🔀",
        isCorrect: false
      },
      {
        id: "skip",
        text: "Skip chores for the day",
        emoji: "🚫",
        isCorrect: false
      },
      {
        id: "reminder",
        text: "Finish chores before starting screen time",
        emoji: "🙂",
        isCorrect: true
      },
    ]
  },
  {
    id: 5,
    text: "Late-night gaming feels exciting, but mornings feel heavy at school. What choice helps keep energy steady?",
    options: [
      {
        id: "cutoff",
        text: "Stop screen use earlier to protect sleep",
        emoji: "🌙",
        isCorrect: true
      },
      {
        id: "continue",
        text: "Play longer and sleep when tired",
        emoji: "🎮",
        isCorrect: false
      },
      {
        id: "catchup",
        text: "Stay up and wake later if possible",
        emoji: "⏰",
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
      title="Tablet Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/brain/kids/quiz-screens"
      nextGameIdProp="brain-kids-72"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="brain"
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

export default TabletStory;

