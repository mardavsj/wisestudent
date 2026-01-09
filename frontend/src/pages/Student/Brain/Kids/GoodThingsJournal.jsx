import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { PenSquare } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GoodThingsJournal = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-57");
  const gameId = gameData?.id || "brain-kids-57";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for GoodThingsJournal, using fallback ID");
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
      prompt: "Write: \"One good thing that happened today was ___.\"", 
      minLength: 10,
      guidance: "Think about something positive that happened today."
    },
    { 
      id: 2, 
      prompt: "I'm grateful for ___.", 
      minLength: 10,
      guidance: "What are you thankful for in your life?"
    },
    { 
      id: 3, 
      prompt: "A positive moment was ___.", 
      minLength: 10,
      guidance: "Describe a moment that made you feel good."
    },
    { 
      id: 4, 
      prompt: "Something that made me smile ___.", 
      minLength: 10,
      guidance: "What brought a smile to your face today?"
    },
    { 
      id: 5, 
      prompt: "A kind act I saw or did ___.", 
      minLength: 10,
      guidance: "Think about kindness you experienced or showed."
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
      title="Journal of Good Things"
      subtitle={!showResult ? `Entry ${currentStage + 1} of ${stages.length}` : "Journal Complete!"}
      score={score}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={stages.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/brain/kids/homework-positive-story"
      nextGameIdProp="brain-kids-58"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="brain"
    >
      <div className="space-y-4 sm:space-y-6 md:space-y-8 max-w-4xl mx-auto px-2 sm:px-4 md:px-6">
        {!showResult && stages[currentStage] ? (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
                <span className="text-white/80 text-xs sm:text-sm md:text-base">Entry {currentStage + 1}/{stages.length}</span>
                <span className="text-yellow-400 font-bold text-xs sm:text-sm md:text-base">Score: {score}/{stages.length}</span>
              </div>
              
              <div className="text-center mb-4 sm:mb-5 md:mb-6">
                <PenSquare className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-3 sm:mb-4 text-yellow-400" />
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3">
                  {stages[currentStage].prompt}
                </h3>
                <p className="text-white/70 text-xs sm:text-sm md:text-base px-2">
                  {stages[currentStage].guidance}
                </p>
              </div>
              
              <textarea
                value={entry}
                onChange={handleInputChange}
                placeholder="Write your thoughts here..."
                className="w-full h-32 sm:h-36 md:h-40 p-3 sm:p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm sm:text-base"
                disabled={answered}
              />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mt-4">
                <span className={`text-xs sm:text-sm ${characterCount < minLength ? 'text-red-400' : 'text-green-400'}`}>
                  {characterCount}/{minLength} characters minimum
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={answered || characterCount < minLength}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold transition-all active:scale-95 text-sm sm:text-base w-full sm:w-auto ${
                    !answered && characterCount >= minLength
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                      : "bg-white/20 text-white/50 cursor-not-allowed"
                  }`}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default GoodThingsJournal;

