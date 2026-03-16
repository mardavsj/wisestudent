import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PenSquare } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RestJournal = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-67");
  const gameId = gameData?.id || "brain-kids-67";
  
  const gameContent = t("brain-health.kids.rest-journal", { returnObjects: true });
  const stages = Array.isArray(gameContent?.stages) ? gameContent.stages : [];
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for RestJournal, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [entry, setEntry] = useState("");
  const [answered, setAnswered] = useState(false);

  const handleSubmit = () => {
    if (answered) return;
    
    const currentPrompt = stages[currentStage];
    if (entry.trim().length < (currentPrompt?.minLength || 10)) {
      showCorrectAnswerFeedback(0, false);
      return;
    }
    
    setAnswered(true);
    resetFeedback();
    setScore(prev => prev + 1);
    showCorrectAnswerFeedback(1, true);

    const isLastStage = currentStage === stages.length - 1;
    
    setTimeout(() => {
      if (isLastStage) {
        setShowResult(true);
        setScore(stages.length); // Ensure score matches total for GameOverModal
      } else {
        setCurrentStage(prev => prev + 1);
        setEntry("");
        setAnswered(false);
      }
    }, 1500);
  };

  const handleInputChange = (e) => {
    setEntry(e.target.value);
  };

  const characterCount = entry.length;
  const minLength = stages[currentStage]?.minLength || 10;

  return (
    <GameShell
      title={gameContent?.title || "Journal of Rest"}
      subtitle={
        showResult 
          ? gameContent?.subtitleDefault || "Journal Complete!" 
          : t("brain-health.kids.rest-journal.subtitlePlaying", {
              current: currentStage + 1,
              total: stages.length,
              defaultValue: `Entry ${currentStage + 1} of ${stages.length}`
            })
      }
      score={score}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={stages.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGameIdProp="brain-kids-68"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="brain"
      backPath="/games/brain-health/kids"
    >
      <div className="space-y-8">
        {!showResult && stages[currentStage] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">
                  {t("brain-health.kids.rest-journal.entryLabel", {
                    current: currentStage + 1,
                    total: stages.length,
                    defaultValue: `Entry ${currentStage + 1}/${stages.length}`
                  })}
                </span>
                <span className="text-yellow-400 font-bold">
                  {t("brain-health.kids.rest-journal.scoreLabel", {
                    current: score,
                    total: stages.length,
                    defaultValue: `Score: ${score}/${stages.length}`
                  })}
                </span>
              </div>
              
              <div className="text-center mb-6">
                <PenSquare className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {stages[currentStage].prompt}
                </h3>
                <p className="text-white/70 text-sm">
                  {stages[currentStage].guidance}
                </p>
              </div>
              
              <textarea
                value={entry}
                onChange={handleInputChange}
                placeholder={gameContent?.placeholder || "Write your thoughts here..."}
                className="w-full h-40 p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                disabled={answered}
              />
              
              <div className="flex justify-between items-center mt-4">
                <span className={`text-sm ${characterCount < minLength ? 'text-red-400' : 'text-green-400'}`}>
                  {t("brain-health.kids.rest-journal.characterMin", {
                    current: characterCount,
                    min: minLength,
                    defaultValue: `${characterCount}/${minLength} characters minimum`
                  })}
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={answered || characterCount < minLength}
                  className={`px-6 py-2 rounded-full font-bold transition-all ${
                    !answered && characterCount >= minLength
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                      : "bg-white/20 text-white/50 cursor-not-allowed"
                  }`}
                >
                  {gameContent?.submitButton || "Submit"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default RestJournal;

