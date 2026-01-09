import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Image } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SleepWellPoster = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-66");
  const gameId = gameData?.id || "brain-kids-66";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SleepWellPoster, using fallback ID");
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
    question: 'Which poster shows how sleep helps your brain stay sharp?',
    choices: [
      { text: "Keep studying all night", correct: false, emoji: "📚" },
      { text: "Recharge your mind while you rest", correct: true, emoji: "🧠" },
      { text: "Stay awake with energy drinks", correct: false, emoji: "⚡" }
    ]
  },
  {
    question: 'Which poster encourages resting to feel energetic?',
    choices: [
      { text: "Take a short break to recharge", correct: true, emoji: "🌙" },
      { text: "Work nonstop without sleeping", correct: false, emoji: "🏃" },
      { text: "Drink coffee instead of sleeping", correct: false, emoji: "☕" }
    ]
  },
  {
    question: 'Which poster reminds you to sleep wisely for better health?',
    choices: [
      { text: "Stay awake and party late", correct: false, emoji: "🎉" },
      { text: "Turn on lights and play games", correct: false, emoji: "💡" },
      { text: "Stick to bedtime and get good rest", correct: true, emoji: "🛏️" },
    ]
  },
  {
    question: 'Which poster shows that resting gives you energy for the day?',
    choices: [
      { text: "Work late and feel tired", correct: false, emoji: "💻" },
      { text: "Sleep well to refill your energy", correct: true, emoji: "🔋" },
      { text: "Ignore rest and push yourself", correct: false, emoji: "😴" }
    ]
  },
  {
    question: 'Which poster shows that good sleep helps you do better in tasks?',
    choices: [
      { text: "Get rest to perform at your best", correct: true, emoji: "🏆" },
      { text: "Skip sleep to study more", correct: false, emoji: "📚" },
      { text: "Play games all night and skip bed", correct: false, emoji: "🎮" }
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

  return (
    <GameShell
      title="Poster: Sleep Well"
      subtitle={!showResult ? `Stage ${currentStage + 1} of ${stages.length}` : "Poster Complete!"}
      score={score}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={stages.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/brain/kids/journal-rest"
      nextGameIdProp="brain-kids-67"
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
              
              <div className="text-center mb-6">
                <Image className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {stages[currentStage].question}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stages[currentStage].choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(choice.correct)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-3xl mb-3">{choice.emoji}</div>
                    <h3 className="font-bold text-lg">{choice.text}</h3>
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

export default SleepWellPoster;

