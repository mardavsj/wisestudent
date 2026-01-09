import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GratitudePoster = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "moral-kids-16";
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
      question: 'Choose the best poster for gratitude:',
      choices: [
        { text: "Never Say Thank You", design: "😒", correct: false },
        { text: "Always Say Thank You", design: "🙏", correct: true },
        { text: "Ignore Helpers", design: "🙄", correct: false },
      ],
    },
    {
      question: 'Which poster promotes gratitude?',
      choices: [
        { text: "Be Thankful Every Day", design: "🌞", correct: true },
        { text: "Complain About Everything", design: "😤", correct: false },
        { text: "Take Things for Granted", design: "🤷", correct: false },
      ],
    },
    {
      question: 'Select the best gratitude poster:',
      choices: [
        { text: "Demand More Always", design: "👊", correct: false },
        { text: "Expect Without Thanks", design: "😐", correct: false },
        { text: "Kind Words Shine Bright", design: "✨", correct: true },
      ],
    },
    {
      question: 'Choose the gratitude poster:',
      choices: [
        { text: "Thanks Bring Smiles", design: "😊", correct: true },
        { text: "No Need to Appreciate", design: "😑", correct: false },
        { text: "Ignore Small Acts", design: "👀", correct: false },
      ],
    },
    {
      question: 'Which is the best poster for gratitude?',
      choices: [
        { text: "Forget to Be Grateful", design: "🤔", correct: false },
        { text: "Every Thanks Counts", design: "🌟", correct: true },
        { text: "Don't Appreciate Others", design: "😏", correct: false },
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
      title="Poster: Gratitude"
      subtitle={showResult ? "Activity Complete!" : `Question ${currentStage + 1} of ${stages.length}`}
      onNext={null}
      nextEnabled={false}
      showGameOver={showResult}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/moral-values/kids/journal-of-gratitude"
      nextGameIdProp="moral-kids-17"
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

export default GratitudePoster;

