import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Image } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BeCreativePoster = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-86");
  const gameId = gameData?.id || "brain-kids-86";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for BeCreativePoster, using fallback ID");
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
      question: 'Which poster best shows "Think Out of the Box"?',
      choices: [
        { text: "Poster showing creative thinking and new ideas", correct: true, emoji: "💡" },
        { text: "Poster showing only following rules", correct: false, emoji: "📋" },
        { text: "Poster showing copying others", correct: false, emoji: "📋" }
      ]
    },
    {
      question: 'Which poster best shows "Be Creative"?',
      choices: [
        { text: "Poster showing only doing same thing", correct: false, emoji: "🔄" },
        { text: "Poster showing imagination and creativity", correct: true, emoji: "🎨" },
        { text: "Poster showing avoiding new things", correct: false, emoji: "🚫" }
      ]
    },
    {
      question: 'Which poster best shows "Solve Problems Creatively"?',
      choices: [
        { text: "Poster showing finding creative solutions", correct: true, emoji: "💭" },
        { text: "Poster showing giving up easily", correct: false, emoji: "🏳️" },
        { text: "Poster showing only one way to solve", correct: false, emoji: "➡️" }
      ]
    },
    {
      question: 'Which poster best shows "Use Your Imagination"?',
      choices: [
        { text: "Poster showing only copying", correct: false, emoji: "📋" },
        { text: "Poster showing thinking differently", correct: true, emoji: "🧠" },
        { text: "Poster showing avoiding ideas", correct: false, emoji: "🤐" }
      ]
    },
    {
      question: 'Which poster best shows "Create Something New"?',
      choices: [
        { text: "Poster showing making original things", correct: true, emoji: "🆕" },
        { text: "Poster showing only repeating old things", correct: false, emoji: "🔄" },
        { text: "Poster showing never trying new", correct: false, emoji: "🚫" }
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
      title="Poster: Be Creative"
      subtitle={!showResult ? `Stage ${currentStage + 1} of ${stages.length}` : "Poster Complete!"}
      score={score}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={stages.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/brain/kids/journal-ideas"
      nextGameIdProp="brain-kids-87"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="brain"
    >
      <div className="space-y-8">
        {!showResult && stages[currentStage] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Stage {currentStage + 1}/{stages.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{stages.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {stages[currentStage].question}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stages[currentStage].choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(choice.correct)}
                    disabled={answered}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-4xl mb-3">{choice.emoji}</div>
                    <p className="text-white text-sm font-semibold">{choice.text}</p>
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

export default BeCreativePoster;

