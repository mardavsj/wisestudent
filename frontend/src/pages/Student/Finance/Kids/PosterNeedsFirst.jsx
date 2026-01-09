import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Paintbrush } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PosterNeedsFirst = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-36";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: "Which poster would best teach kids to prioritize needs over wants?",
      choices: [
        { text: "Buy whatever you want first 🛒", correct: false },
        { text: "Focus on needs before wants 📚", correct: true },
        { text: "Spend all your money quickly 🚀", correct: false },
      ],
    },
    {
      question: "What poster would best show the difference between needs and wants?",
      choices: [
        { text: "Needs come before wants for financial health 🏠", correct: true },
        { text: "Wants are more important than needs 💎", correct: false },
        { text: "Ignore your basic needs 🙈", correct: false },
      ],
    },
    {
      question: "Which poster would best explain why needs should be prioritized?",
      choices: [
        { text: "To avoid having fun 🚫", correct: false },
        { text: "To spend more money 💸", correct: false },
        { text: "To ensure basic necessities are covered 🍎", correct: true },
      ],
    },
    {
      question: "What poster would best illustrate a good strategy for handling both needs and wants?",
      choices: [
        { text: "Buy needs first, then save for wants 💡", correct: true },
        { text: "Buy only wants and ignore needs 🛍️", correct: false },
        { text: "Avoid all purchases completely 🙅", correct: false },
      ],
    },
    {
      question: "Which poster would best show the benefit of prioritizing needs over wants?",
      choices: [
        { text: "You can spend more impulsively 🎢", correct: false },
        { text: "You make smarter financial decisions 🤔", correct: true },
        { text: "You feel more restricted 🚫", correct: false },
      ],
    }
  ];

  const handleSelect = (isCorrect) => {
    resetFeedback();
    if (isCorrect) {
      setScore((prev) => prev + 1);
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
      title="Poster: Needs First"
      subtitle={`Question ${currentStage + 1} of ${stages.length}: Choose posters that promote smart financial choices!`}
      coins={score}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/finance/kids/journal-of-needs"
      nextGameIdProp="finance-kids-37"
      gameType="finance"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="text-center text-white space-y-8">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
          <Paintbrush className="mx-auto mb-4 w-8 h-8 text-yellow-400" />
          <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
          <p className="text-white/70 mb-4">Score: {score}/{stages.length}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stages[currentStage].choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(choice.correct)}
                className="p-6 rounded-2xl border bg-white/10 border-white/20 hover:bg-emerald-600 transition-transform hover:scale-105"
                disabled={showResult}
              >
                <div className="text-lg font-semibold">{choice.text}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default PosterNeedsFirst;