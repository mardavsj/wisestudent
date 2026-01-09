import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PosterWorkToEarn = () => {
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-76";
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
      question: 'Which poster would best teach kids about earning money?',
      choices: [
        { text: "Effort Today, Rewards Tomorrow! 🌱", correct: true },
        { text: "Money Grows on Trees! �", correct: false },
        { text: "Parents' Wallets = My Money! 👛", correct: false },
      ],
    },
    {
      question: 'What poster would best show the value of hard work?',
      choices: [
        { text: "Work is Boring, Just Play! 🎮", correct: false },
        { text: "Why Work When You Can Get Free Stuff? 🎁", correct: false },
        { text: "Sweat + Time = Success! ⏳", correct: true },
      ],
    },
    {
      question: 'Which poster teaches the best work ethic?',
      choices: [
        { text: "Work is for Grown-ups Only! 👨‍�", correct: false },
        { text: "Small Jobs Lead to Big Dreams! ✨", correct: true },
        { text: "Too Young to Work, Just Ask for Money! �", correct: false },
      ],
    },
    {
      question: 'What poster would best encourage saving earned money?',
      choices: [
        { text: "Work Hard, Save Smart, Dream Big! 🏆", correct: true },
        { text: "Earn It, Burn It, Repeat! 🔥", correct: false },
        { text: "Money is for Spending, Not Saving! 🛒", correct: false },
      ],
    },
    {
      question: 'Which poster best explains why we work?',
      choices: [
        { text: "Work is Just Something Grown-ups Do! 🤷", correct: false },
        { text: "Work = Pride + Money + Future! �", correct: true },
        { text: "Why Work When You Can Win the Lottery? 🎰", correct: false },
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
      title="Poster: Work to Earn"
      subtitle={`Question ${currentStage + 1} of ${stages.length}: Choose posters that promote hard work!`}
      coins={score}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/finance/kids/journal-of-earning"
      nextGameIdProp="finance-kids-77"
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

export default PosterWorkToEarn;