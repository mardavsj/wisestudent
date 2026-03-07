import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PROMPTS = [
  "Scenario: A competitor reduces their price below cost to steal your customers. What is your initial reaction to this challenge?",
  "Instead of panic reacting with loss pricing, I will build a sustainable strategy focusing on ___.",
  "Identify one unique value proposition your business has that the competitor cannot easily copy with just low prices.",
  "How can you communicate this unique value to your loyal customers so they stay despite the competitor's price drop?",
  "Reflect on why engaging in a price war usually damages long-term business health and sustainability.",
];

const MIN_LEN = 10;

const JournalOfSustainableCompetition = () => {
  const location = useLocation();
  const totalStages = PROMPTS.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [entry, setEntry] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();
  
  const gameId = "ehe-young-adult-48";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;

  const handleSubmit = () => {
    if (entry.trim().length < MIN_LEN) return;
    setScore((s) => s + 1);
    showCorrectAnswerFeedback(1, true);
    if (currentStageIndex === totalStages - 1) {
      setTimeout(() => {
        setShowResult(true);
      }, 800);
    } else {
      setTimeout(() => {
        setCurrentStageIndex((i) => i + 1);
        setEntry("");
      }, 800);
    }
  };

  const stage = PROMPTS[currentStageIndex];
  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Journal: Sustainable Competition"
      subtitle={
        showResult
          ? "Journal complete! Avoiding price wars helps ensure long-term business survival."
          : `Stage ${progressLabel}`
      }
      currentLevel={currentStageIndex + 1}
      totalLevels={totalStages}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      score={score}
      showConfetti={showResult && score === totalStages}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="ehe"
      nextGamePath={location.state?.nextGamePath}
      nextGameId={location.state?.nextGameId}
      backPath={location.state?.returnPath}
    >
      {!showResult && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-slate-700 shadow-2xl relative overflow-hidden">
            
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 to-indigo-600"></div>

            <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8 border-b border-slate-700 pb-4">
              <span>Stage {progressLabel}</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Score: {score}/{totalStages}
              </span>
            </div>
            
            <div className="text-center mb-10">
              <span className="inline-block py-1 px-3 rounded-full bg-violet-900/50 text-violet-300 text-xs font-bold uppercase tracking-wider mb-4 border border-violet-500/30">
                Reflection
              </span>
              <p className="text-white text-xl md:text-2xl font-bold leading-relaxed">
                "{stage}"
              </p>
            </div>
            
            <div className="mt-6 relative">
              <textarea
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                className="w-full rounded-2xl bg-black/20 text-white p-4 border border-slate-700 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-medium resize-none shadow-inner"
                placeholder="Write your journal entry here (min 10 characters)..."
                rows={4}
              />
              <div className={`absolute bottom-3 right-3 text-xs font-bold px-2 py-1 rounded-md ${entry.trim().length >= MIN_LEN ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {entry.trim().length} / {MIN_LEN}
              </div>
            </div>
            
            <div className="flex justify-end mt-8">
              <button
                onClick={handleSubmit}
                disabled={entry.trim().length < MIN_LEN}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg shadow-violet-500/25 transition-all duration-300 hover:scale-105 hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                Submit Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </GameShell>
  );
};

export default JournalOfSustainableCompetition;
