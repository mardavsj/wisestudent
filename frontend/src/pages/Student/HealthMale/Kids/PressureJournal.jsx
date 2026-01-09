import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { PenSquare } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PressureJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-67";
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
      prompt: "One time I said no to pressure was...", 
      minLength: 10,
      guidance: "Think about a time when you stood up for yourself or made a good choice."
    },
    { 
      prompt: "When friends tried to make me do something wrong, I...", 
      minLength: 10,
      guidance: "Remember how you handled a difficult situation with friends."
    },
    { 
      prompt: "I felt strong when I...", 
      minLength: 10,
      guidance: "Describe a moment when you felt confident and powerful."
    },
    { 
      prompt: "Standing up for myself made me feel...", 
      minLength: 10,
      guidance: "Reflect on how it feels to make your own good choices."
    },
    { 
      prompt: "The best way to say no is...", 
      minLength: 10,
      guidance: "Think about respectful but firm ways to decline things that aren't good for you."
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
    navigate("/student/health-male/kids/gaming-pressure-story");
  };

  const currentPrompt = journalPrompts[currentPromptIndex];
  const characterCount = journalEntry.length;
  const minLength = currentPrompt?.minLength || 10;

  return (
    <GameShell
      title="Journal of Pressure"
      subtitle={!showResult ? `Entry ${currentPromptIndex + 1} of ${journalPrompts.length}` : "Journal Complete!"}
      score={score}
      currentLevel={currentPromptIndex + 1}
      totalLevels={journalPrompts.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={journalPrompts.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/health-male/kids/gaming-pressure-story"
      nextGameIdProp="health-male-kids-68"
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

export default PressureJournal;

