import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { PenSquare } from "lucide-react";
import { getGameDataById } from "../../../../utils/getGameData";

const JournalOfSavingGoal = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-7";
  const gameData = getGameDataById(gameId);
  const gameContent = t("financial-literacy.teens.journal-of-saving-goal", { returnObjects: true });
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [entry, setEntry] = useState("");
  const [showResult, setShowResult] = useState(false);

  const stages = Array.isArray(gameContent?.stages) ? gameContent.stages : [];

  const handleSubmit = () => {
    if (showResult) return; // Prevent multiple submissions
    
    resetFeedback();
    const entryText = entry.trim();
    
    if (entryText.length >= stages[currentStage].minLength) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
      
      const isLastQuestion = currentStage === stages.length - 1;
      
      setTimeout(() => {
        if (isLastQuestion) {
          setShowResult(true);
        } else {
          setEntry("");
          setCurrentStage((prev) => prev + 1);
        }
      }, 1500);
    }
  };

  const finalScore = score;

  return (
    <GameShell
      title={gameContent?.title || "Journal of Saving Goal"}
      subtitle={!showResult 
        ? t("financial-literacy.teens.journal-of-saving-goal.subtitleProgress", {
            current: currentStage + 1,
            total: stages.length,
            defaultValue: "Question {{current}} of {{total}}: Reflect on your saving goals!"
          })
        : (gameContent?.subtitleComplete || "Journal Complete!")
      }
      currentLevel={currentStage + 1}
      totalLevels={stages.length || 5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/finance/teen/simulation-monthly-money"
      nextGameIdProp="finance-teens-8"
      gameType="finance"
      maxScore={stages.length || 5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === (stages.length || 5)}>
      <div className="text-center text-white space-y-8">
        {!showResult && stages[currentStage] && (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <PenSquare className="mx-auto mb-4 w-10 h-10 text-yellow-300" />
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].prompt}</h3>
            <p className="text-white/70 mb-4">
              {t("financial-literacy.teens.journal-of-saving-goal.scoreLabel", {
                score,
                total: stages.length,
                defaultValue: "Score: {{score}}/{{total}}"
              })}
            </p>
            <p className="text-white/60 text-sm mb-4">
              {t("financial-literacy.teens.journal-of-saving-goal.minCharsRequired", {
                min: stages[currentStage].minLength,
                defaultValue: "Write at least {{min}} characters"
              })}
            </p>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder={gameContent?.placeholder || "Write your journal entry here..."}
              className="w-full max-w-xl p-4 rounded-xl text-black text-lg bg-white/90"
              disabled={showResult}
            />
            <div className="mt-2 text-white/50 text-sm">
              {t("financial-literacy.teens.journal-of-saving-goal.charsCount", {
                current: entry.trim().length,
                min: stages[currentStage].minLength,
                defaultValue: "{{current}}/{{min}} characters"
              })}
            </div>
            <button
              onClick={handleSubmit}
              className={`mt-4 px-8 py-4 rounded-full text-lg font-semibold transition-transform ${
                entry.trim().length >= stages[currentStage].minLength && !showResult
                  ? 'bg-green-500 hover:bg-green-600 hover:scale-105 text-white cursor-pointer'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50'
              }`}
              disabled={entry.trim().length < stages[currentStage].minLength || showResult}
            >
              {currentStage === stages.length - 1 
                ? (gameContent?.buttonComplete || 'Submit Final Entry')
                : (gameContent?.buttonSubmit || 'Submit & Continue')
              }
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalOfSavingGoal;
