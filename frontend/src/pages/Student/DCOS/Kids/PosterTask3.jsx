import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PosterTask3 = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-kids-86");
  const gameId = gameData?.id || "dcos-kids-86";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for PosterTask3, using fallback ID");
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
    question: 'Which poster would best show "Pause and Ask Before Sharing Photos"?',
    choices: [
      { text: "Poster showing sharing photos without asking", correct: false },
      { text: "Poster showing never using photos online", correct: false },
      { text: "Poster showing asking permission before sharing", correct: true },
    ],
  },
  {
    question: 'Which poster would best show "Not Everything Online Is True"?',
    choices: [
      { text: "Poster showing questioning and checking information", correct: true },
      { text: "Poster showing believing every post", correct: false },
      { text: "Poster showing ignoring all information", correct: false },
    ],
  },
  {
    question: 'Which poster would best show "Screens Need Balance"?',
    choices: [
      { text: "Poster showing screen use all day", correct: false },
      { text: "Poster showing mixing screen time with offline activities", correct: true },
      { text: "Poster showing avoiding screens forever", correct: false },
    ],
  },
  {
    question: 'Which poster would best show "Speak Up Against Online Bullying"?',
    choices: [
      { text: "Poster showing watching bullying silently", correct: false },
      { text: "Poster showing joining the bullying", correct: false },
      { text: "Poster showing reporting or telling a trusted adult", correct: true },
    ],
  },
  {
    question: 'Which poster would best show "Your Digital Footprint Lasts"?',
    choices: [
      { text: "Poster showing thinking long-term before posting", correct: true },
      { text: "Poster showing posts disappearing forever", correct: false },
      { text: "Poster showing posting without care", correct: false },
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
      title="Poster: Respect"
      score={score}
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}` : "Poster Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/dcos/kids/story-of-difference"
      nextGameIdProp="dcos-kids-87"
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

export default PosterTask3;

