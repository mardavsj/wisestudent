import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { PenSquare } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const JournalOfFocus = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-17");
  const gameId = gameData?.id || "brain-kids-17";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for JournalOfFocus, using fallback ID");
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

  const journalPrompts = [
    {
      id: 1,
      prompt: "Write: \"One strategy that helps me focus is ___\"",
      guidance: "Think about activities or techniques that help you concentrate better.",
      minLength: 10
    },
    {
      id: 2,
      prompt: "Write: \"When I lose focus, I can ___\"",
      guidance: "Reflect on what you do to regain your concentration.",
      minLength: 10
    },
    {
      id: 3,
      prompt: "Write: \"A quiet place helps me focus because ___\"",
      guidance: "Think about why a peaceful environment is important for concentration.",
      minLength: 10
    },
    {
      id: 4,
      prompt: "Write: \"One distraction I avoid while studying is ___\"",
      guidance: "Consider what things take away your attention when you need to focus.",
      minLength: 10
    },
    {
      id: 5,
      prompt: "Write: \"I improve my focus by ___\"",
      guidance: "Reflect on practices that help you maintain better concentration.",
      minLength: 10
    }
  ];

  const handleInputChange = (e) => {
    if (!answered) {
      setEntry(e.target.value);
    }
  };

  const handleSubmit = () => {
    if (answered || entry.trim().length < journalPrompts[currentStage].minLength) return;
    
    setAnswered(true);
    resetFeedback();
    
    setScore(prev => prev + 1);
    showCorrectAnswerFeedback(1, true);
    
    const isLastStage = currentStage === journalPrompts.length - 1;
    
    setTimeout(() => {
      if (isLastStage) {
        setShowResult(true);
      } else {
        setCurrentStage(prev => prev + 1);
        setEntry("");
        setAnswered(false);
      }
    }, 500);
  };

  const currentPrompt = journalPrompts[currentStage];

  return (
    <GameShell
      title="Journal of Focus"
      score={score}
      subtitle={!showResult ? `Entry ${currentStage + 1} of ${journalPrompts.length}` : "Journal Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/brain/kids/game-story"
      nextGameIdProp="brain-kids-18"
      gameType="brain"
      totalLevels={journalPrompts.length}
      currentLevel={currentStage + 1}
      maxScore={journalPrompts.length}
      showConfetti={showResult && score === journalPrompts.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && currentPrompt ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Entry {currentStage + 1}/{journalPrompts.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{journalPrompts.length}</span>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <PenSquare className="w-8 h-8 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Journal Entry</h3>
              </div>
              
              <p className="text-white text-lg mb-2">
                {currentPrompt.prompt}
              </p>
              <p className="text-white/70 text-sm mb-4">
                {currentPrompt.guidance}
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
                    Minimum {currentPrompt.minLength} characters required
                  </span>
                  <span className={entry.length >= currentPrompt.minLength ? "text-green-400" : "text-red-400"}>
                    {entry.length}/{currentPrompt.minLength}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={entry.trim().length < currentPrompt.minLength || answered}
                className={`w-full max-w-md mx-auto py-3 px-6 rounded-full font-bold transition-all ${
                  entry.trim().length >= currentPrompt.minLength && !answered
                    ? "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white transform hover:scale-105"
                    : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                }`}
              >
                {answered ? "Submitted!" : "Submit Entry"}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default JournalOfFocus;

