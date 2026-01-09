import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PosterBanksHelp = () => {
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-46";
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
      question: 'Which poster best shows how banks help protect your money?',
      choices: [
        { text: "Spend Now, Worry Later! 🛍️", correct: false },
        { text: "Hide It Under Your Mattress 🛏️", correct: false },
        { text: "Your Money's Best Friend: Safe & Growing 🏦", correct: true },
      ],
    },
    {
      question: 'Which poster would best teach about saving for the future?',
      choices: [
        { text: "Little by Little, Watch It Grow 🌱", correct: true },
        { text: "Spend It All Today! 🎉", correct: false },
        { text: "Money in a Shoebox Under the Bed �", correct: false },
      ],
    },
    {
      question: 'Which poster shows the benefit of a savings account?',
      choices: [
        { text: "Buy Now, Think Later! 🛒", correct: false },
        { text: "Your Money at Work: Earning While You Sleep �", correct: true },
        { text: "Keep It All in Your Piggy Bank 🐷", correct: false },
      ],
    },
    {
      question: 'Which poster would best teach about financial security?',
      choices: [
        { text: "Safe Today, Secure Tomorrow �", correct: true },
        { text: "Spend Fast Before It's Gone! �", correct: false },
        { text: "Money in a Jar Under the Tree �", correct: false },
      ],
    },
    {
      question: 'Which poster would best explain why we use banks?',
      choices: [
        { text: "Spend Now, Save Never! �", correct: false },
        { text: "Banks: Your Money's Safety Net �️", correct: true },
        { text: "Keep It All in Your Pocket 👖", correct: false },
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
      title="Poster: Banks Help"
      subtitle={`Question ${currentStage + 1} of ${stages.length}: Choose posters that promote safe banking!`}
      coins={score}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/finance/kids/journal-first-bank"
      nextGameIdProp="finance-kids-47"
      gameType="finance"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="text-center text-white space-y-8">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
          <Trophy className="mx-auto w-10 h-10 text-yellow-400 mb-4" />
          <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
          <p className="text-white/70 mb-4">Score: {score}/{stages.length}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stages[currentStage].choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(choice.correct)}
                className="p-6 rounded-2xl border bg-white/10 border-white/20 hover:bg-yellow-500 transition-transform hover:scale-105"
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

export default PosterBanksHelp;