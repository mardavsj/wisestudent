import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const JournalOfSmartBuy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-17";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [entry, setEntry] = useState("");
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stages = [
    {
      question: 'Write: "One smart purchase I made was ___."',
      minLength: 10,
    },
    {
      question: 'Write: "Comparing prices helped me because ___."',
      minLength: 10,
    },
    {
      question: 'Write: "I saved money by ___ and felt ___."',
      minLength: 10,
    },
    {
      question: 'Write: "A smart shopping tip I learned is ___."',
      minLength: 10,
    },
    {
      question: 'Write: "Making smart buying choices makes me feel ___."',
      minLength: 10,
    },
  ];

  const handleSubmit = () => {
    if (entry.trim().length >= stages[currentStage].minLength) {
      const newScore = score + 1;
      setScore(newScore);
      showCorrectAnswerFeedback(1, true);
      if (currentStage < stages.length - 1) {
        setTimeout(() => {
          setEntry("");
          setCurrentStage((prev) => prev + 1);
        }, 800);
      } else {
        setTimeout(() => setShowResult(true), 800);
      }
    }
  };

  const handleNext = () => {
    navigate("/student/finance/kids/candy-offer-story");
  };

  const finalScore = score;

  return (
    <GameShell
      title="Journal of Smart Buy"
      subtitle={showResult ? "Journal Complete!" : `Question ${currentStage + 1} of ${stages.length}`}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={finalScore}
      gameId="finance-kids-17"
      gameType="finance"
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      currentLevel={7}
      maxScore={5}
      showConfetti={showResult && finalScore === 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/kids/candy-offer-story"
      nextGameIdProp="finance-kids-18">
      <div className="space-y-8 max-w-3xl mx-auto">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              {stages[currentStage].question}
            </h3>
            
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Write your journal entry here..."
              className="w-full h-40 p-4 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            
            <div className="mt-4 flex justify-between items-center">
              <span className="text-white/80">
                {entry.length}/{stages[currentStage].minLength} characters
              </span>
              <button
                onClick={handleSubmit}
                disabled={entry.trim().length < stages[currentStage].minLength}
                className={`py-3 px-6 rounded-full font-bold transition-all ${
                  entry.trim().length >= stages[currentStage].minLength
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                    : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                }`}
              >
                Submit Entry
              </button>
            </div>
            
            <div className="mt-6 text-center text-white/80">
              <p>Score: {score}/{stages.length}</p>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default JournalOfSmartBuy;