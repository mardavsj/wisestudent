import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { PenSquare } from "lucide-react";
import { getGameDataById } from '../../../../utils/getGameData';

const JournalOfHabits = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "health-female-kids-37";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 1;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [entry, setEntry] = useState("");
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stages = [
    {
      question: 'Write: "One habit I want to improve is ___.',
      minLength: 10,
    },
    {
      question: 'Write: "I can build healthy habits by ___.',
      minLength: 10,
    },
    {
      question: 'Write: "A habit I am proud of is ___.',
      minLength: 10,
    },
    {
      question: 'Write: "My goal for tomorrow is ___.',
      minLength: 10,
    },
    {
      question: 'Write: "I will stick to my routine by ___.',
      minLength: 10,
    },
  ];

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

  // Log when game completes
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Journal of Habits game completed! Score: ${finalScore}/${stages.length}, gameId: ${gameId}`);
    }
  }, [showResult, finalScore, gameId, stages.length]);

  return (
    <GameShell
      title="Journal of Habits"
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}: Reflect on your daily habits!` : "Journal Complete!"}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="health-female"
      maxScore={stages.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === stages.length}
      backPath="/games/health-female/kids">
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center text-center text-white space-y-6 md:space-y-8 max-w-4xl mx-auto px-4 py-4">
        {!showResult && stages[currentStage] && (
          <div className="bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-xl md:rounded-2xl border border-white/20">
            <PenSquare className="mx-auto mb-4 w-8 h-8 md:w-10 md:h-10 text-yellow-300" />
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-white">{stages[currentStage].question}</h3>
            <p className="text-white/70 mb-4 text-sm md:text-base">Score: {score}/{stages.length}</p>
            <p className="text-white/60 text-xs md:text-sm mb-4">
              Write at least {stages[currentStage].minLength} characters
            </p>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Write your journal entry here..."
              className="w-full max-w-xl p-4 rounded-xl text-black text-base md:text-lg bg-white/90 min-h-[120px] md:min-h-[150px]"
              disabled={showResult}
            />
            <div className="mt-2 text-white/50 text-xs md:text-sm">
              {entry.trim().length}/{stages[currentStage].minLength} characters
            </div>
            <button
              onClick={handleSubmit}
              className={`mt-4 px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold transition-transform ${
                entry.trim().length >= stages[currentStage].minLength && !showResult
                  ? 'bg-yellow-500 hover:bg-yellow-600 hover:scale-105 text-white cursor-pointer'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50'
              }`}
              disabled={entry.trim().length < stages[currentStage].minLength || showResult}
            >
              {currentStage === stages.length - 1 ? 'Submit Final Entry' : 'Submit & Continue'}
            </button>
          </div>
        )}
        
        {showResult && (
          <div className="bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-xl md:rounded-2xl border border-white/20 text-center">
            <div className="text-4xl mb-4">📖</div>
            <h2 className="text-2xl font-bold text-white mb-6">Habits Journal Complete!</h2>
            
            <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-xl p-4 border border-yellow-400/30 mb-6">
              <p className="text-yellow-300 font-bold">
                🎉 Great job! You've completed your habits journal!
              </p>
              <p className="text-yellow-300 mt-2">
                Recording your thoughts about habits helps you build better routines!
              </p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6 text-left">
              <h3 className="text-lg font-semibold text-white mb-3">Your Entries:</h3>
              <div className="space-y-3">
                {stages.map((stage, index) => (
                  <div key={index} className="text-white/90 text-sm">
                    <span className="font-medium">Q{index + 1}:</span> {stage.question}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalOfHabits;