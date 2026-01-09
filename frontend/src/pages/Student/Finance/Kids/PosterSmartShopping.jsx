import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PosterSmartShopping = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-16";
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
      question: 'Choose the best poster for smart shopping:',
      choices: [
        { text: "Spend All You Want", design: "💸", correct: false },
        { text: "Think Before You Spend", design: "📝", correct: true },
        { text: "Buy Everything Now", design: "🛒", correct: false },
      ],
    },
    {
      question: 'Which poster promotes smart shopping habits?',
      choices: [
        { text: "Make a Shopping List", design: "📋", correct: true },
        { text: "Buy Without Thinking", design: "🎯", correct: false },
        { text: "Spend Immediately", design: "⚡", correct: false },
      ],
    },
    {
      question: 'Select the best shopping poster:',
      choices: [
        { text: "Buy First, Think Later", design: "🛍️", correct: false },
        { text: "Spend Without Plan", design: "💸", correct: false },
        { text: "Compare Prices", design: "🔍", correct: true },
      ],
    },
    {
      question: 'Choose the smart shopping poster:',
      choices: [
        { text: "Buy What's on Sale", design: "🏷️", correct: true },
        { text: "Pay Full Price Always", design: "💵", correct: false },
        { text: "Never Save Money", design: "🎲", correct: false },
      ],
    },
    {
      question: 'Which is the best poster for smart shopping?',
      choices: [
        { text: "Impulse Buy Everything", design: "🎁", correct: false },
        { text: "Spend Without Budget", design: "💳", correct: false },
        { text: "Plan Purchases Ahead", design: "📅", correct: true },
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

  const handleNext = () => {
    navigate("/student/finance/kids/journal-of-smart-buy");
  };

  const finalScore = score;

  return (
    <GameShell
      title="Poster: Smart Shopping"
      subtitle={showResult ? "Activity Complete!" : `Question ${currentStage + 1} of ${stages.length}`}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={finalScore}
      gameId="finance-kids-16"
      nextGamePathProp="/student/finance/kids/journal-of-smart-buy"
      nextGameIdProp="finance-kids-17"
      gameType="finance"
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      currentLevel={6}
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

export default PosterSmartShopping;