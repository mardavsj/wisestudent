import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { PenSquare } from 'lucide-react';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfCare = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-47";

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [coins, setCoins] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const journalPrompts = [
    "I feel cleanest when I...",
    "My favorite hygiene product is...",
    "When I take care of myself, I feel...",
    "I want to improve my routine by...",
    "Being clean helps me because..."
  ];

  const handleJournalSubmit = () => {
    if (gameFinished) return; // Prevent multiple submissions
      
    resetFeedback();
    const entryText = journalEntry.trim();
      
    if (entryText.length >= 10) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
        
      const isLastQuestion = currentPromptIndex === journalPrompts.length - 1;
        
      setTimeout(() => {
        if (isLastQuestion) {
          setGameFinished(true);
        } else {
          setJournalEntry("");
          setCurrentPromptIndex(prev => prev + 1);
        }
      }, 1500);
    }
  };
  
  // Log when game completes
  useEffect(() => {
    if (gameFinished) {
      console.log(`🎮 Journal of Care game completed! Score: ${coins}/${journalPrompts.length}, gameId: ${gameId}`);
    }
  }, [gameFinished, coins, gameId, journalPrompts.length]);
  
  const characterCount = journalEntry.trim().length;
  const isLongEnough = characterCount >= 10;

  const handleNext = () => {
    navigate("/student/health-male/teens/daily-routine-simulation-48");
  };

  const currentPrompt = journalPrompts[currentPromptIndex];

  return (
    <GameShell
      title="Journal of Care"
      subtitle={!gameFinished ? `Entry ${currentPromptIndex + 1} of ${journalPrompts.length}` : "Journal Complete!"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      nextGamePathProp="/student/health-male/teens/daily-routine-simulation-48"
      nextGameIdProp="health-male-teen-48"
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={journalPrompts.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      currentLevel={currentPromptIndex + 1}
      totalLevels={journalPrompts.length}
    >
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center text-center text-white space-y-6 md:space-y-8 max-w-4xl mx-auto px-4 py-4">
        {!gameFinished && journalPrompts[currentPromptIndex] && (
          <div className="bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-xl md:rounded-2xl border border-white/20">
            <PenSquare className="mx-auto mb-4 w-8 h-8 md:w-10 md:h-10 text-yellow-300" />
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-white">{currentPrompt}</h3>
            <p className="text-white/70 mb-4 text-sm md:text-base">Score: {coins}/{journalPrompts.length}</p>
            <p className="text-white/60 text-xs md:text-sm mb-4">
              Write at least 10 characters
            </p>
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write your journal entry here..."
              className="w-full max-w-xl p-4 rounded-xl text-black text-base md:text-lg bg-white/90 min-h-[120px] md:min-h-[150px]"
              disabled={gameFinished}
            />
            <div className="mt-2 text-white/50 text-xs md:text-sm">
              {characterCount}/10 characters
            </div>
            <button
              onClick={handleJournalSubmit}
              className={`mt-4 px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold transition-transform ${
                isLongEnough && !gameFinished
                  ? 'bg-green-500 hover:bg-green-600 hover:scale-105 text-white cursor-pointer'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50'
              }`}
              disabled={!isLongEnough || gameFinished}
            >
              {currentPromptIndex === journalPrompts.length - 1 ? 'Submit Final Entry' : 'Submit & Continue'}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalOfCare;

