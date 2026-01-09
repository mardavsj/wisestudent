import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BalancePosterTask = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-kids-26");
  const gameId = gameData?.id || "dcos-kids-26";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for BalancePosterTask, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stages = [
    {
      question: 'Which poster would best show "Balance Study, Play & Rest"?',
      choices: [
        { text: "Poster showing playing all day without breaks 🎮", correct: false },
        { text: "Poster showing balanced activities: study, play, and rest ⚖️", correct: true },
        { text: "Poster showing only studying, no play or rest 📚", correct: false },
      ],
    },
    {
      question: 'Which poster would best show "Play Outside, Stay Bright"?',
      choices: [
        { text: "Poster showing staying inside all the time 🏠", correct: false },
        { text: "Poster showing never going outside 🚫", correct: false },
        { text: "Poster showing outdoor activities and fresh air 🌳", correct: true },
      ],
    },
    {
      question: 'Which poster would best show "Eat Smart, Feel Strong"?',
      choices: [
        { text: "Poster showing healthy eating and nutrition 🍎", correct: true },
        { text: "Poster showing eating only junk food 🍔", correct: false },
        { text: "Poster showing skipping meals ⏭️", correct: false },
      ],
    },
    {
      question: 'Which poster would best show "Sleep Early, Rise Fresh"?',
      choices: [
        { text: "Poster showing staying up all night 🌙", correct: false },
        { text: "Poster showing good sleep schedule and rest 🛌", correct: true },
        { text: "Poster showing never sleeping 😴", correct: false },
      ],
    },
    {
      question: 'Which poster would best show "Study + Play + Sleep = Success"?',
      choices: [
        { text: "Poster showing only playing games 🎮", correct: false },
        { text: "Poster showing only studying 📖", correct: false },
        { text: "Poster showing balanced lifestyle with study, play, and sleep 🏆", correct: true },
      ],
    },
  ];

  const handleChoice = (isCorrect) => {
    if (answered) return;
    
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

  const currentStageData = stages[currentStage];

  return (
    <GameShell
      title="Poster: Balance"
      score={score}
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}` : "Poster Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/dcos/kids/outdoor-fun-story"
      nextGameIdProp="dcos-kids-27"
      gameType="dcos"
      totalLevels={stages.length}
      currentLevel={currentStage + 1}
      maxScore={stages.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && currentStageData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentStage + 1}/{stages.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{stages.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentStageData.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentStageData.choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChoice(choice.correct)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <p className="font-semibold text-lg">{choice.text}</p>
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

export default BalancePosterTask;

