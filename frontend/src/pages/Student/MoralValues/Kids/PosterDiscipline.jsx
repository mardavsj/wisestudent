import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PosterDiscipline = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "moral-kids-36";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stages = [
    {
      question: 'Choose the best poster for discipline:',
      choices: [
        { text: "Skip Your Tasks", design: "😴", correct: false },
        { text: "Discipline Builds Success", design: "🏗️", correct: true },
        { text: "Do Nothing All Day", design: "🛋️", correct: false },
      ],
    },
    {
      question: 'Which poster promotes discipline?',
      choices: [
        { text: "Stay Focused, Stay Strong", design: "🎯", correct: true },
        { text: "Give Up Easily", design: "😞", correct: false },
        { text: "Never Finish Tasks", design: "🚫", correct: false },
      ],
    },
    {
      question: 'Select the best discipline poster:',
      choices: [
        { text: "Ignore Your Goals", design: "👀", correct: false },
        { text: "Break All Rules", design: "💥", correct: false },
        { text: "Work Hard, Shine Bright", design: "💪", correct: true },
      ],
    },
    {
      question: 'Choose the discipline poster:',
      choices: [
        { text: "Follow Rules with Pride", design: "📘", correct: true },
        { text: "Disobey Everything", design: "😈", correct: false },
        { text: "Never Be Consistent", design: "🔄", correct: false },
      ],
    },
    {
      question: 'Which is the best poster for discipline?',
      choices: [
        { text: "Procrastinate Always", design: "⏰", correct: false },
        { text: "Discipline Defines Character", design: "🛡️", correct: true },
        { text: "Never Control Yourself", design: "🎭", correct: false },
      ],
    },
  ];

  const handleSelect = (isCorrect) => {
    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentStage < stages.length - 1) {
      setTimeout(() => setCurrentStage((prev) => prev + 1), 800);
    } else {
      setTimeout(() => setShowResult(true), 800);
    }
  };

  const finalScore = score;

  return (
    <GameShell
      title="Poster: Discipline"
      subtitle={showResult ? "Activity Complete!" : `Question ${currentStage + 1} of ${stages.length}`}
      onNext={null}
      nextEnabled={false}
      showGameOver={showResult}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/moral-values/kids/journal-duty"
      nextGameIdProp="moral-kids-37"
      gameType="moral"
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      currentLevel={currentStage + 1}
      maxScore={5}
      showConfetti={showResult && finalScore === 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {stages[currentStage].question}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stages[currentStage].choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(choice.correct)}
                    className="p-6 rounded-2xl text-center transition-all transform hover:scale-105 bg-white/10 hover:bg-white/20 border border-white/20"
                  >
                    <div className="text-5xl mb-3">{choice.design}</div>
                    <h4 className="font-bold text-white text-lg">{choice.text}</h4>
                  </button>
                ))}
              </div>
              
              <div className="mt-6 text-center text-white/80">
                <p>Score: {score}/{stages.length}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default PosterDiscipline;

