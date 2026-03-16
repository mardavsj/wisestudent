import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const StrongMemoryPoster = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-26");
  const gameId = gameData?.id || "brain-kids-26";
  
  const gameContent = t("brain-health.kids.strong-memory-poster", { returnObjects: true });
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for StrongMemoryPoster, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stages = Array.isArray(gameContent?.questions) ? gameContent.questions : [];

  const handleChoice = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastStage = currentStage === stages.length - 1;
    
    setTimeout(() => {
      if (isLastStage) {
        setShowResult(true);
      } else {
        setCurrentStage(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const currentStageData = stages[currentStage];

  return (
    <GameShell
      title={gameContent?.title || "Poster: Strong Memory"}
      score={score}
      subtitle={
        showResult
          ? gameContent?.subtitleComplete || "Poster Complete!"
          : t("brain-health.kids.strong-memory-poster.subtitleProgress", {
              current: currentStage + 1,
              total: stages.length,
              defaultValue: `Question ${currentStage + 1} of ${stages.length}`,
            })
      }
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/brain/kids/journal-of-recall"
      nextGameIdProp="brain-kids-27"
      gameType="brain"
      totalLevels={stages.length}
      currentLevel={currentStage + 1}
      maxScore={stages.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && currentStageData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">
                  {t("brain-health.kids.strong-memory-poster.subtitleProgress", {
                    current: currentStage + 1,
                    total: stages.length,
                    defaultValue: `Question ${currentStage + 1}/${stages.length}`,
                  })}
                </span>
                <span className="text-yellow-400 font-bold">
                  {t("brain-health.kids.strong-memory-poster.scoreLabel", {
                    score,
                    total: stages.length,
                    defaultValue: `Score: ${score}/${stages.length}`,
                  })}
                </span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentStageData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentStageData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <p className="font-semibold text-lg">{option.text}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default StrongMemoryPoster;

