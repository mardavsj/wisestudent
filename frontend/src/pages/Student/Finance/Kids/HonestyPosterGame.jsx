import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Paintbrush } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HonestyPosterGame = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-96";
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
      question: "Which poster would best encourage kids to be honest with money?",
      choices: [
        { text: "Hide money from others! 🙈", correct: false },
        { text: "Always tell the truth about money! 💰", correct: true },
        { text: "Spend without telling anyone! 🎉", correct: false },
      ],
    },
    {
      question: "What poster would best show the importance of honesty with money?",
      choices: [
        { text: "Honesty brings trust and respect! ✅", correct: true },
        { text: "Hiding money is smart! 🕳️", correct: false },
        { text: "Trick others with money! 🎭", correct: false },
      ],
    },
    {
      question: "Which poster teaches the best honesty habit with money?",
      choices: [
        { text: "Lie about how much money you have! 🤥", correct: false },
        { text: "Keep money secrets always! 🔐", correct: false },
        { text: "Always share the truth about money! 🤝", correct: true },
      ],
    },
    {
      question: "What poster would best show how money and honesty connect?",
      choices: [
        { text: "Honest money choices build good character! 🌟", correct: true },
        { text: "It's OK to lie about money! 🙊", correct: false },
        { text: "Money tricks are harmless! 🃏", correct: false },
      ],
    },
    {
      question: "Which poster best explains the result of honest money choices?",
      choices: [
        
        { text: "Hiding money makes me safe! 🏠", correct: false },
        { text: "Honest money choices make me trustworthy! 🌟", correct: true },
        { text: "Money secrets make me rich! 💎", correct: false },
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
      title="Poster: Honesty Pays"
      subtitle={`Question ${currentStage + 1} of ${stages.length}: Choose posters that promote honest money choices!`}
      coins={score}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/finance/kids/ethics-journal-game"
      nextGameIdProp="finance-kids-97"
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

export default HonestyPosterGame;

