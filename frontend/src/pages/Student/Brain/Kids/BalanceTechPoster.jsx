import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Image } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BalanceTechPoster = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-76");
  const gameId = gameData?.id || "brain-kids-76";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for BalanceTechPoster, using fallback ID");
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
      question: 'Which poster best demonstrates healthy screen time habits?',
      choices: [
        { text: "Poster filled exclusively with various electronic devices", correct: false, emoji: "📱" },
        { text: "Poster showing diverse activities with moderate device usage", correct: true, emoji: "🌳" },
        { text: "Poster depicting broken electronics with warning signs", correct: false, emoji: "🚫" }
      ]
    },
    {
      question: 'Which poster illustrates effective daily routine management?',
      choices: [
        { text: "Poster displaying scheduled blocks for different activities", correct: true, emoji: "⚖️" },
        { text: "Poster with overlapping chaotic activity schedules", correct: false, emoji: "🎭" },
        { text: "Poster showing only entertainment-focused activities", correct: false, emoji: "📱" },
      ]
    },
    {
      question: 'Which poster represents responsible technology usage?',
      choices: [
        { text: "Poster promoting continuous consumption of digital media", correct: false, emoji: "📱" },
        { text: "Poster restricting all non-digital recreational options", correct: false, emoji: "📱" },
        { text: "Poster balancing digital engagement with physical activities", correct: true, emoji: "🤸" },
      ]
    },
    {
      question: 'Which poster exemplifies mindful digital consumption?',
      choices: [
        { text: "Poster encouraging unlimited unrestricted access", correct: false, emoji: "📱" },
        { text: "Poster emphasizing quality over quantity in tech use", correct: true, emoji: "🧠" },
        { text: "Poster advocating for constant connectivity", correct: false, emoji: "📱" }
      ]
    },
    {
      question: 'Which poster showcases integrated lifestyle wellness?',
      choices: [
        { text: "Poster harmonizing technological and non-tech elements", correct: true, emoji: "🎵" },
        { text: "Poster focusing solely on digital achievements", correct: false, emoji: "📱" },
        { text: "Poster eliminating all traditional activities", correct: false, emoji: "🪇" }
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
      title="Poster: Balance Tech Challenge"
      subtitle={!showResult ? `Stage ${currentStage + 1} of ${stages.length}` : "Poster Complete!"}
      score={score}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={stages.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/brain/kids/journal-screen-use"
      nextGameIdProp="brain-kids-77"
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

export default BalanceTechPoster;

