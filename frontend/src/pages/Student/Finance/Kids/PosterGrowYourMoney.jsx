import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Paintbrush } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PosterGrowYourMoney = () => {
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-66";
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
      question: 'Which poster would best encourage kids to save their money?',
      choices: [
        { text: "Spend Now, Regret Later! �", correct: false },
        { text: "Money Grows on Trees! �", correct: false },
        { text: "Small Savings Today, Big Dreams Tomorrow! 🌱", correct: true },
      ],
    },
    {
      question: 'What poster would best explain compound interest to kids?',
      choices: [
        { text: "Let Your Money Work While You Play! ⚙️", correct: true },
        { text: "Spend It All in One Place! 🎯", correct: false },
        { text: "Money Disappears Fast! 💨", correct: false },
      ],
    },
    {
      question: 'Which poster teaches the best money-growing habit?',
      choices: [
        { text: "Buy Now, Think Later! �", correct: false },
        { text: "Save First, Spend Later - Watch Your Money Grow! �", correct: true },
        { text: "Money is Meant to Be Spent! 💸", correct: false },
      ],
    },
    {
      question: 'What poster would best show the power of patience with money?',
      choices: [
        { text: "Great Things Grow With Time - Including Your Money! ⏳", correct: true },
        { text: "Get Rich Quick - Try This Trick! 🎩", correct: false },
        { text: "Spend It Before It's Gone! 🏃", correct: false },
      ],
    },
    {
      question: 'Which poster best explains why we should save money?',
      choices: [
        { text: "Money is for Spending, Not Saving! 🛍️", correct: false },
        { text: "You Can Always Get More Money! 💰", correct: false },
        { text: "A Penny Saved is a Penny That Grows! 🌟", correct: true },
      ],
    },
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
      title="Poster: Grow Your Money"
      subtitle={`Question ${currentStage + 1} of ${stages.length}: Choose posters that promote smart investing!`}
      coins={score}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/finance/kids/journal-of-growth"
      nextGameIdProp="finance-kids-67"
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

export default PosterGrowYourMoney;