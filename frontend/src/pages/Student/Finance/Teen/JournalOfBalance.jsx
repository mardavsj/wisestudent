import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { PenSquare } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const JournalOfBalance = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-37");
  const gameId = gameData?.id || "finance-teens-37";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for JournalOfBalance, using fallback ID");
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

  const stages = [
    { id: 1, prompt: "One want I sacrificed for a need was ___.", minLength: 10 },
    { id: 2, prompt: "One need I prioritized over a want was ___.", minLength: 10 },
    { id: 3, prompt: "One way I can balance needs and wants is ___.", minLength: 10 },
    { id: 4, prompt: "One benefit of prioritizing needs is ___.", minLength: 10 },
    { id: 5, prompt: "One want I can budget for is ___.", minLength: 10 }
  ];

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

  return (
    <GameShell
      title="Journal of Balance"
      subtitle={!showResult ? `Entry ${currentStage + 1} of ${stages.length}` : "Journal Complete!"}
      score={score}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={stages.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/simulation-monthly-budget"
      nextGameIdProp="finance-teens-38"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="finance"
    >
      <div className="space-y-8">
        {!showResult && stages[currentStage] ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Entry {currentStage + 1}/{stages.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{stages.length}</span>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <PenSquare className="w-8 h-8 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Journal Entry</h3>
              </div>
              
              <p className="text-white text-lg mb-4">
                {stages[currentStage].prompt}
              </p>
              
              <div className="mb-3">
                <textarea
                  className="w-full max-w-md mx-auto border border-white/20 rounded-lg p-3 bg-white/5 text-white placeholder-white/50 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={entry}
                  onChange={handleInputChange}
                  placeholder="Type your response here..."
                  rows={6}
                  disabled={answered}
                />
                <div className="flex justify-between items-center mt-2 text-xs text-white/60">
                  <span>
                    Minimum {stages[currentStage].minLength} characters required
                  </span>
                  <span className={entry.length >= stages[currentStage].minLength ? "text-green-400" : "text-red-400"}>
                    {entry.length}/{stages[currentStage].minLength}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={answered || entry.trim().length < stages[currentStage].minLength}
                className={`w-full max-w-md mx-auto px-6 py-3 rounded-full font-bold text-base transition-all ${
                  answered || entry.trim().length < stages[currentStage].minLength
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                }`}
              >
                {currentStage === stages.length - 1 ? "Complete Journal" : "Submit & Continue"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Journal Complete!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You completed {score} out of {stages.length} entries!
                  Great job reflecting on balancing needs and wants!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Reflecting on your choices helps you balance needs and wants wisely!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You completed {score} out of {stages.length} entries.
                  Remember, balancing needs and wants is key to financial wellness!
                </p>
                <button
                  onClick={() => {
                    setShowResult(false);
                    setCurrentStage(0);
                    setScore(0);
                    setEntry("");
                    setAnswered(false);
                    resetFeedback();
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about times when you chose needs over wants, and how that helped you achieve your goals.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalOfBalance;

