import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PosterReturnBorrow = () => {
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-56";
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
      question: 'Which poster would best remind friends about borrowing responsibility?',
      choices: [
        { text: "Take What You Want, When You Want! 🎯", correct: false },
        { text: "Finders Keepers, Losers Weepers! 🎭", correct: false },
        { text: "Borrow Today, Return Tomorrow - Keep Trust Strong! 🤝", correct: true },
      ],
    },
    {
      question: 'What poster would best encourage on-time returns?',
      choices: [
        { text: "Return When You Feel Like It! �", correct: false },
        { text: "A Promise to Return is a Promise to Keep! ✨", correct: true },
        { text: "Borrowed Items Are Better Than New Ones! 🆕", correct: false },
      ],
    },
    {
      question: 'Which poster teaches the best borrowing habit?',
      choices: [
        { text: "Ask, Use, Return - The Right Way to Borrow! �", correct: true },
        { text: "Borrow Now, Worry Later! 🎢", correct: false },
        { text: "What's Yours is Mine! 🎯", correct: false },
      ],
    },
    {
      question: 'What poster would help maintain trust between friends?',
      choices: [
        { text: "I'll Return It... Eventually! 🐢", correct: false },
        { text: "Your Trust is Priceless - I'll Return It! 💎", correct: true },
        { text: "What Borrowing Policy? �", correct: false },
      ],
    },
    {
      question: 'Which poster best explains why returning matters?',
      choices: [
        { text: "Every Return Builds Trust - Let's Build Together! 🌉", correct: true },
        { text: "Borrowing is Easier Than Buying! 🛍️", correct: false },
        { text: "Why Buy When You Can Borrow Forever? ♾️", correct: false },
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
      title="Poster: Return What You Borrow"
      subtitle={`Question ${currentStage + 1} of ${stages.length}: Choose posters that promote honest borrowing!`}
      coins={score}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/finance/kids/journal-borrowing"
      nextGameIdProp="finance-kids-57"
      gameType="finance"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="text-center text-white space-y-8">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
          <div className="text-4xl mb-4">🤝</div>
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

export default PosterReturnBorrow;