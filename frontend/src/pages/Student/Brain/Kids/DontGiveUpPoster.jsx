import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Image } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DontGiveUpPoster = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-96");
  const gameId = gameData?.id || "brain-kids-96";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for DontGiveUpPoster, using fallback ID");
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
      question: 'Which poster best shows "Failure = Step to Success"?',
      choices: [
        { text: "Poster showing failure leads to learning and success", correct: true, emoji: "📈" },
        { text: "Poster showing failure is the end", correct: false, emoji: "🛑" },
        { text: "Poster showing only success matters", correct: false, emoji: "🏆" }
      ]
    },
    {
      question: 'Which poster best shows "Don\'t Give Up"?',
      choices: [
        { text: "Poster showing quitting easily", correct: false, emoji: "🏳️" },
        { text: "Poster showing persistence and trying again", correct: true, emoji: "🔄" },
        { text: "Poster showing avoiding challenges", correct: false, emoji: "🚶" }
      ]
    },
    {
      question: 'Which poster best shows "Keep Trying"?',
      choices: [
        { text: "Poster showing never giving up and practicing", correct: true, emoji: "🎯" },
        { text: "Poster showing giving up after one try", correct: false, emoji: "😞" },
        { text: "Poster showing only winning matters", correct: false, emoji: "👑" }
      ]
    },
    {
      question: 'Which poster best shows "Learn from Mistakes"?',
      choices: [
        { text: "Poster showing ignoring mistakes", correct: false, emoji: "🙈" },
        { text: "Poster showing using mistakes to improve", correct: true, emoji: "📚" },
        { text: "Poster showing never making mistakes", correct: false, emoji: "✨" }
      ]
    },
    {
      question: 'Which poster best shows "Resilience and Growth"?',
      choices: [
        { text: "Poster showing bouncing back and growing stronger", correct: true, emoji: "🌱" },
        { text: "Poster showing staying down after falling", correct: false, emoji: "⬇️" },
        { text: "Poster showing avoiding all challenges", correct: false, emoji: "🚫" }
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
      title="Poster: Don't Give Up"
      subtitle={!showResult ? `Stage ${currentStage + 1} of ${stages.length}` : "Poster Complete!"}
      score={score}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={stages.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/brain/kids/journal-bounce-back"
      nextGameIdProp="brain-kids-97"
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

export default DontGiveUpPoster;

