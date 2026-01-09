import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Image } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const StayPositivePoster = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-56");
  const gameId = gameData?.id || "brain-kids-56";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for StayPositivePoster, using fallback ID");
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
    question: 'Which poster inspires someone feeling down to keep going?',
    choices: [
      { text: "Focus on what went wrong", correct: false, emoji: "⚡" },
      { text: "Think everything is hopeless", correct: false, emoji: "🌧️" },
      { text: "Take small steps each day", correct: true, emoji: "🌱" },
    ]
  },
  {
    question: 'Which poster encourages a positive mindset during challenges?',
    choices: [
      { text: "Look for solutions and keep trying", correct: true, emoji: "🔍" },
      { text: "Complain about problems", correct: false, emoji: "😤" },
      { text: "Worry and give up easily", correct: false, emoji: "😰" }
    ]
  },
  {
    question: 'Which poster helps someone focus on happy moments?',
    choices: [
      { text: "Remember only sad events", correct: false, emoji: "😢" },
      { text: "Notice small joys in daily life", correct: true, emoji: "☀️" },
      { text: "Keep thinking about mistakes", correct: false, emoji: "⚡" }
    ]
  },
  {
    question: 'Which poster inspires choosing optimism in tough situations?',
    choices: [
      { text: "Look for the silver lining", correct: true, emoji: "🌈" },
      { text: "Focus on complaints", correct: false, emoji: "😑" },
      { text: "Give up immediately", correct: false, emoji: "🏳️" }
    ]
  },
  {
    question: 'Which poster encourages spreading good energy to friends?',
    choices: [
      { text: "Ignore friends who are sad", correct: false, emoji: "🙈" },
      { text: "Point out everyone’s mistakes", correct: false, emoji: "⚡" },
      { text: "Smile and help others", correct: true, emoji: "💛" },
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
      title="Poster: Stay Positive"
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}: Choose the best positive poster!` : "Poster Complete!"}
      score={finalScore}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      nextGamePathProp="/student/brain/kids/journal-of-good-things"
      nextGameIdProp="brain-kids-57"
      gameType="brain"
      maxScore={stages.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === stages.length}
    >
      <div className="space-y-4 sm:space-y-6 md:space-y-8 max-w-4xl mx-auto px-2 sm:px-4 md:px-6">
        {!showResult && stages[currentStage] ? (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
                <span className="text-white/80 text-xs sm:text-sm md:text-base">Question {currentStage + 1}/{stages.length}</span>
                <span className="text-yellow-400 font-bold text-xs sm:text-sm md:text-base">Score: {score}/{stages.length}</span>
              </div>
              
              <div className="text-center mb-4 sm:mb-5 md:mb-6">
                <Image className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-3 sm:mb-4 text-yellow-400" />
                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4">
                  {stages[currentStage].question}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {stages[currentStage].choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(choice.correct)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 active:scale-95 text-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-full"
                  >
                    <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">{choice.emoji}</div>
                    <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1 sm:mb-2 leading-tight sm:leading-normal">{choice.text}</h3>
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

export default StayPositivePoster;

