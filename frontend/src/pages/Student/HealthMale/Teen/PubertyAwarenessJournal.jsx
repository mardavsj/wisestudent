import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PenSquare } from 'lucide-react';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PubertyAwarenessJournal = () => {
  const navigate = useNavigate();
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [entries, setEntries] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const prompts = [
    {
      id: 1,
      title: "Reproductive Health Facts",
      prompt: "Write about one fact you learned about reproductive health. How does it help you?",
      placeholder: "Example: I learned that wet dreams are normal during puberty..."
    },
    {
      id: 2,
      title: "Body Changes Understanding",
      prompt: "What reproductive system changes surprised you most? How do you feel about them now?",
      placeholder: "Example: Voice changes were surprising but now I understand they're normal..."
    },
    {
      id: 3,
      title: "Health Care Importance",
      prompt: "Why is it important to learn about reproductive health as a teen? Give an example.",
      placeholder: "Example: Learning about reproductive health helps me make healthy choices..."
    },
    {
      id: 4,
      title: "Talking About Changes",
      prompt: "How comfortable are you talking about reproductive health? What would make it easier?",
      placeholder: "Example: I'm more comfortable now that I know it's normal..."
    },
    {
      id: 5,
      title: "Future Health Goals",
      prompt: "What reproductive health goals do you have for your teen years?",
      placeholder: "Example: I want to learn more about staying healthy during puberty..."
    }
  ];

  const handleSubmitEntry = () => {
    if (gameFinished) return; // Prevent multiple submissions
    
    resetFeedback();
    const entryText = journalEntry.trim();
    
    if (entryText.length >= 10) {
      const newEntry = {
        prompt: currentPrompt,
        content: journalEntry,
        timestamp: new Date().toLocaleString()
      };

      setEntries([...entries, newEntry]);
      showCorrectAnswerFeedback(1, true);
      
      const isLastQuestion = currentPrompt === prompts.length - 1;
      
      setTimeout(() => {
        if (isLastQuestion) {
          setGameFinished(true);
        } else {
          setJournalEntry("");
          setCurrentPrompt(prev => prev + 1);
        }
      }, 1500);
    }
  };

  // Log when game completes
  useEffect(() => {
    if (gameFinished) {
      console.log(`🎮 Puberty Awareness Journal game completed! Score: ${entries.length}/${prompts.length}, gameId: health-male-teen-37`);
    }
  }, [gameFinished, entries.length]);

  const characterCount = journalEntry.trim().length;
  const isLongEnough = characterCount >= 10;

  const getCurrentPrompt = () => prompts[currentPrompt];

  const handleNext = () => {
    navigate("/student/health-male/teens/respect-boundaries-simulation");
  };

  return (
    <GameShell
      title="Journal of Puberty Awareness (Teen)"
      subtitle={!gameFinished ? `Entry ${currentPrompt + 1} of ${prompts.length}` : "Journal Complete!"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={entries.length}
      gameId="health-male-teen-37"
      nextGamePathProp="/student/health-male/teens/teen-shaving-simulation"
      nextGameIdProp="health-male-teen-38"
      gameType="health-male"
      totalLevels={prompts.length}
      currentLevel={currentPrompt + 1}
      maxScore={prompts.length}
      coinsPerLevel={1}
      totalCoins={prompts.length}
      totalXp={prompts.length * 2}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center text-center text-white space-y-6 md:space-y-8 max-w-4xl mx-auto px-4 py-4">
        {!gameFinished && prompts[currentPrompt] && (
          <div className="bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-xl md:rounded-2xl border border-white/20">
            <PenSquare className="mx-auto mb-4 w-8 h-8 md:w-10 md:h-10 text-yellow-300" />
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-white">{getCurrentPrompt().prompt}</h3>
            <p className="text-white/70 mb-4 text-sm md:text-base">Score: {entries.length}/{prompts.length}</p>
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
              onClick={handleSubmitEntry}
              className={`mt-4 px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold transition-transform ${
                isLongEnough && !gameFinished
                  ? 'bg-green-500 hover:bg-green-600 hover:scale-105 text-white cursor-pointer'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50'
              }`}
              disabled={!isLongEnough || gameFinished}
            >
              {currentPrompt === prompts.length - 1 ? 'Submit Final Entry' : 'Submit & Continue'}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PubertyAwarenessJournal;

