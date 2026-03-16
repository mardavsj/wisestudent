import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PenSquare } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const JournalOfHabits = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-7");
  const gameId = gameData?.id || "brain-kids-7";

  const gameContent = t("brain-health.kids.journal-of-habits", { returnObjects: true });
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for JournalOfHabits, using fallback ID");
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

  const stages = Array.isArray(gameContent?.stages) ? gameContent.stages : [];

  const handleSubmit = () => {
    if (answered) return;
    
    const currentPrompt = stages[currentStage];
    if (entry.trim().length < currentPrompt.minLength) {
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
      title={gameContent?.title || "Journal of Habits"}
      subtitle={
        !showResult
          ? t("brain-health.kids.journal-of-habits.subtitleProgress", {
              current: currentStage + 1,
              total: stages.length,
              defaultValue: `Entry ${currentStage + 1} of ${stages.length}`,
            })
          : gameContent?.subtitleComplete || "Journal Complete!"
      }
      score={score}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={stages.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/brain/kids/sports-story"
      nextGameIdProp="brain-kids-8"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="brain"
    >
      <div className="space-y-8">
        {!showResult && stages[currentStage] ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">
                  {t("brain-health.kids.journal-of-habits.entryLabel", {
                    current: currentStage + 1,
                    total: stages.length,
                    defaultValue: `Entry ${currentStage + 1}/${stages.length}`,
                  })}
                </span>
                <span className="text-yellow-400 font-bold">
                  {t("brain-health.kids.journal-of-habits.scoreLabel", {
                    score,
                    total: stages.length,
                    defaultValue: `Score: ${score}/${stages.length}`,
                  })}
                </span>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <PenSquare className="w-8 h-8 text-blue-400" />
                <h3 className="text-xl font-bold text-white">
                  {gameContent?.journalHeader || "Journal Entry"}
                </h3>
              </div>
              
              <p className="text-white text-lg mb-4">
                {stages[currentStage].prompt}
              </p>
              
              <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 mb-4">
                <p className="text-white/90 text-sm">
                  <span className="font-semibold text-blue-300">
                    💡 {gameContent?.tipLabel || "Tip"}:
                  </span> {stages[currentStage].guidance}
                </p>
              </div>
              
              <textarea
                value={entry}
                onChange={handleInputChange}
                placeholder={gameContent?.placeholder || "Write your journal entry here..."}
                disabled={answered}
                className="w-full h-32 p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              />
              
              <div className="flex justify-between items-center mt-2 mb-4">
                <span className={`text-sm ${characterCount < minLength ? 'text-red-400' : 'text-green-400'}`}>
                  {characterCount < minLength 
                    ? t("brain-health.kids.journal-of-habits.minLengthNeeded", {
                        min: minLength,
                        needed: minLength - characterCount,
                        defaultValue: `Minimum ${minLength} characters (${minLength - characterCount} more needed)`,
                      })
                    : gameContent?.minLengthReached || '✓ Minimum length reached'}
                </span>
                <span className="text-white/60 text-sm">
                  {t("brain-health.kids.journal-of-habits.charCountLabel", {
                    count: characterCount,
                    defaultValue: `${characterCount} characters`,
                  })}
                </span>
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={entry.trim().length < minLength || answered}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  entry.trim().length >= minLength && !answered
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white'
                    : 'bg-gray-500/30 text-gray-400 cursor-not-allowed'
                }`}
              >
                {answered ? gameContent?.submittedBtn || 'Submitted!' : gameContent?.submitBtn || 'Submit Entry'}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default JournalOfHabits;

