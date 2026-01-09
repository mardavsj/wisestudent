import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PosterChoosePeace = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "moral-kids-86";
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
      question: 'Choose the best poster for peace:',
      choices: [
        { text: "Fight Over Everything", design: "👊", correct: false },
        { text: "Peace is Power", design: "🕊️", correct: true },
        { text: "Argue All Day", design: "😠", correct: false },
      ],
    },
    {
      question: 'Which poster promotes peace?',
      choices: [
        { text: "Spread Love, Not Hate", design: "💖", correct: true },
        { text: "Yell at Others", design: "📢", correct: false },
        { text: "Start Conflicts", design: "💥", correct: false },
      ],
    },
    {
      question: 'Select the best peace poster:',
      choices: [
        { text: "Get Angry Quickly", design: "😡", correct: false },
        { text: "Hold Grudges Forever", design: "😤", correct: false },
        { text: "Calm Mind, Kind Heart", design: "🧘‍♀️", correct: true },
      ],
    },
    {
      question: 'Choose the peace poster:',
      choices: [
        { text: "Harmony Brings Happiness", design: "🌈", correct: true },
        { text: "Disrupt the Peace", design: "🌪️", correct: false },
        { text: "Cause Trouble", design: "😈", correct: false },
      ],
    },
    {
      question: 'Which is the best poster for peace?',
      choices: [
        { text: "Never Forgive", design: "🚫", correct: false },
        { text: "Choose Calm Over Anger", design: "🌿", correct: true },
        { text: "Be Violent", design: "⚔️", correct: false },
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
      title="Poster: Peace"
      subtitle={showResult ? "Activity Complete!" : `Question ${currentStage + 1} of ${stages.length}`}
      onNext={null}
      nextEnabled={false}
      showGameOver={showResult}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/moral-values/kids/journal-peace"
      nextGameIdProp="moral-kids-87"
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

export default PosterChoosePeace;

