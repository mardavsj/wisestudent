import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PosterBeAlert = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");

  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-86";
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
  
  const gameContent = t("financial-literacy.kids.poster-be-alert", { returnObjects: true });
  const stages = Array.isArray(gameContent?.stages) ? gameContent.stages : [];

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
      title={gameContent?.title || "Poster: Be Alert"}
      subtitle={showResult ? gameContent?.subtitleComplete : t("financial-literacy.kids.poster-be-alert.subtitleProgress", { current: currentStage + 1, total: stages.length })}
      coins={score}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/finance/kids/journal-safety"
      nextGameIdProp="finance-kids-87"
      gameType="finance"
      maxScore={stages.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === stages.length}>
      <div className="text-center text-white space-y-8">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
          <Trophy className="mx-auto w-10 h-10 text-yellow-400 mb-4" />
          <h3 className="text-2xl font-bold mb-4">{stages[currentStage]?.question}</h3>
          <p className="text-white/70 mb-4">{t("financial-literacy.kids.poster-be-alert.scoreLabel", { score, total: stages.length })}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stages[currentStage].choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(choice.correct)}
                className="p-6 rounded-2xl border bg-white/10 border-white/20 hover:bg-pink-500 transition-transform hover:scale-105"
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

export default PosterBeAlert;