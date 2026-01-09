import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { PenSquare } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HabitsJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-97";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const journalPrompts = [
    { 
      prompt: "My favorite healthy breakfast is...", 
      minLength: 10,
      guidance: "Think about foods that give you energy and make you feel good."
    },
    { 
      prompt: "I like to exercise by...", 
      minLength: 10,
      guidance: "Consider activities like running, playing sports, or dancing."
    },
    { 
      prompt: "Before bed, I always...", 
      minLength: 10,
      guidance: "Think about routines that help you sleep well."
    },
    { 
      prompt: "I wash my hands when...", 
      minLength: 10,
      guidance: "Remember times when washing hands keeps you healthy."
    },
    { 
      prompt: "Being healthy makes me feel...", 
      minLength: 10,
      guidance: "Describe how taking care of your body makes you feel."
    }
  ];

  const handleJournalSubmit = () => {
    if (answered) return;
    
    const currentPrompt = journalPrompts[currentPromptIndex];
    if (journalEntry.trim().length < currentPrompt.minLength) {
      showCorrectAnswerFeedback(0, false);
      return;
    }
    
    setAnswered(true);
    resetFeedback();
    setScore(prev => prev + 1);
    showCorrectAnswerFeedback(1, true);

    const isLastStage = currentPromptIndex === journalPrompts.length - 1;
    
    setTimeout(() => {
      if (isLastStage) {
        setShowResult(true);
      } else {
        setCurrentPromptIndex(prev => prev + 1);
        setJournalEntry("");
        setAnswered(false);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/reading-story");
  };

  const currentPrompt = journalPrompts[currentPromptIndex];
  const characterCount = journalEntry.length;
  const minLength = currentPrompt?.minLength || 10;

  return (
    <GameShell
      title="Habits Journal"
      subtitle={!showResult ? `Entry ${currentPromptIndex + 1} of ${journalPrompts.length}` : "Journal Complete!"}
      score={score}
      currentLevel={currentPromptIndex + 1}
      totalLevels={journalPrompts.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={journalPrompts.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/health-male/kids/reading-story"
      nextGameIdProp="health-male-kids-98"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="health-male"
      onNext={handleNext}
      nextEnabled={showResult}
    >
      <div className="space-y-8">
        {!showResult && currentPrompt ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Entry {currentPromptIndex + 1}/{journalPrompts.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{journalPrompts.length}</span>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <PenSquare className="w-8 h-8 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Journal Entry</h3>
              </div>
              
              <p className="text-white text-lg mb-4">
                {currentPrompt.prompt}
              </p>
              
              <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 mb-4">
                <p className="text-white/90 text-sm">
                  <span className="font-semibold text-blue-300">💡 Tip:</span> {currentPrompt.guidance}
                </p>
              </div>
              
              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Write your journal entry here..."
                disabled={answered}
                className="w-full h-32 p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              />
              
              <div className="flex justify-between items-center mt-2 mb-4">
                <span className={`text-sm ${characterCount < minLength ? 'text-red-400' : 'text-green-400'}`}>
                  {characterCount < minLength 
                    ? `Minimum ${minLength} characters (${minLength - characterCount} more needed)`
                    : '✓ Minimum length reached'}
                </span>
                <span className="text-white/60 text-sm">{characterCount} characters</span>
              </div>
              
              <button
                onClick={handleJournalSubmit}
                disabled={journalEntry.trim().length < minLength || answered}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  journalEntry.trim().length >= minLength && !answered
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white'
                    : 'bg-gray-500/30 text-gray-400 cursor-not-allowed'
                }`}
              >
                {answered ? 'Submitted!' : 'Submit Entry'}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default HabitsJournal;

