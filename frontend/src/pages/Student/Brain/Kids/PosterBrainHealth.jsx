import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Image } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PosterBrainHealth = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-6");
  const gameId = gameData?.id || "brain-kids-6";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for PosterBrainHealth, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const stages = [
    {
      question: 'Which poster best shows "Healthy Brain = Happy You"?',
      choices: [
        { text: "Poster showing brain with happy face and exercise", correct: true, emoji: "🧠" },
        { text: "Poster showing only food items", correct: false, emoji: "🍎" },
        { text: "Poster showing only sleep", correct: false, emoji: "😴" }
      ]
    },
    {
      question: 'Which poster best shows "Feed Your Brain with Healthy Foods"?',
      choices: [
        { text: "Poster showing only junk food", correct: false, emoji: "🍟" },
        { text: "Poster showing fruits, vegetables, and water", correct: true, emoji: "🍎" },
        { text: "Poster showing only drinks", correct: false, emoji: "🥤" }
      ]
    },
    {
      question: 'Which poster best shows "Brain Power Through Exercise"?',
      choices: [
        { text: "Poster showing person exercising and brain", correct: true, emoji: "💪" },
        { text: "Poster showing only sitting", correct: false, emoji: "🪑" },
        { text: "Poster showing only sleeping", correct: false, emoji: "😴" }
      ]
    },
    {
      question: 'Which poster best shows "Stay Hydrated for Brain Health"?',
      choices: [
        
        { text: "Poster showing only soda drinks", correct: false, emoji: "🥤" },
        { text: "Poster showing water and brain connection", correct: true, emoji: "💧" },
        { text: "Poster showing only food", correct: false, emoji: "🍔" }
      ]
    },
    {
      question: 'Which poster best shows "My Brain Health Plan"?',
      choices: [
        
        { text: "Poster showing only one activity", correct: false, emoji: "⚽" },
        { text: "Poster showing only unhealthy habits", correct: false, emoji: "🚫" },
        { text: "Poster showing multiple brain health tips together", correct: true, emoji: "📋" },
      ]
    }
  ];

  const handleSelect = (isCorrect) => {
    if (answered || showResult) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastStage = currentStage === stages.length - 1;
    
    setTimeout(() => {
      if (isLastStage) {
        setShowResult(true);
      } else {
        setCurrentStage(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const finalScore = score;

  return (
    <GameShell
      title="Poster: Brain Health"
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}: Choose the best brain health poster!` : "Poster Complete!"}
      score={finalScore}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      nextGamePathProp="/student/brain/kids/journal-of-habits"
      nextGameIdProp="brain-kids-7"
      gameType="brain"
      maxScore={stages.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === stages.length}
    >
      <div className="space-y-8">
        {!showResult && stages[currentStage] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentStage + 1}/{stages.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{stages.length}</span>
              </div>
              
              <div className="text-center mb-6">
                <Image className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                <h3 className="text-2xl font-bold text-white mb-4">
                  {stages[currentStage].question}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stages[currentStage].choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(choice.correct)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-4xl mb-3">{choice.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{choice.text}</h3>
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

export default PosterBrainHealth;

