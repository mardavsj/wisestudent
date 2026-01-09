import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { PenSquare } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const IdeasJournal = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-87");
  const gameId = gameData?.id || "brain-kids-87";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for IdeasJournal, using fallback ID");
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
    { 
      id: 1, 
      prompt: "Write: \"One time I solved a problem was ___.\"", 
      minLength: 10,
      guidance: "Think about a problem you solved creatively."
    },
    { 
      id: 2, 
      prompt: "Describe a time you came up with a creative idea. What was it?", 
      minLength: 10,
      guidance: "Think about something original you thought of."
    },
    { 
      id: 3, 
      prompt: "Write about a time you fixed something in a new way.", 
      minLength: 10,
      guidance: "How did you solve it differently?"
    },
    { 
      id: 4, 
      prompt: "Describe a creative solution you found for a challenge.", 
      minLength: 10,
      guidance: "What creative approach did you use?"
    },
    { 
      id: 5, 
      prompt: "Write about a time you thought outside the box.", 
      minLength: 10,
      guidance: "How did you think differently?"
    }
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
      title="Journal of Ideas"
      subtitle={!showResult ? `Entry ${currentStage + 1} of ${stages.length}` : "Journal Complete!"}
      score={score}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={stages.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/brain/kids/art-story"
      nextGameIdProp="brain-kids-88"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="brain"
    >
      <div className="space-y-8">
        {!showResult && stages[currentStage] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Entry {currentStage + 1}/{stages.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{stages.length}</span>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {stages[currentStage].prompt}
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  {stages[currentStage].guidance}
                </p>
                
                <textarea
                  value={entry}
                  onChange={handleInputChange}
                  placeholder="Write your thoughts here..."
                  className="w-full h-40 p-4 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 resize-none"
                  disabled={answered}
                />
                
                <div className="mt-2 flex justify-between items-center">
                  <span className={`text-sm ${characterCount >= minLength ? 'text-green-400' : 'text-red-400'}`}>
                    {characterCount}/{minLength} characters minimum
                  </span>
                  <span className="text-white/60 text-sm">
                    {characterCount} characters
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={answered || entry.trim().length < minLength}
                className={`w-full py-3 px-6 rounded-xl font-bold transition-all ${
                  entry.trim().length >= minLength && !answered
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                    : "bg-white/20 text-white/50 cursor-not-allowed"
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

export default IdeasJournal;

