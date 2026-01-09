import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { PenSquare } from 'lucide-react';
import { getGameDataById } from '../../../../utils/getGameData';

const JournalOfSpending = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-17";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [entry, setEntry] = useState("");
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: 'Describe a recent purchase you made. What influenced your decision? Was it a need or a want? How did you feel before, during, and after the purchase?',
      minLength: 20,
    },
    {
      question: 'Track your spending for one day. List all purchases, no matter how small. What patterns do you notice? Which expenses surprised you?',
      minLength: 20,
    },
    {
      question: 'Think about a time you spent money impulsively. What were the circumstances? How did you feel afterward? What would you do differently now?',
      minLength: 20,
    },
    {
      question: 'Compare your spending habits with your financial goals. Where are you aligning well? Where might adjustments be needed?',
      minLength: 20,
    },
    {
      question: 'Describe your ideal approach to money management. What habits would support this vision? What steps can you take this week to move toward this ideal?',
      minLength: 20,
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

  return (
    <GameShell
      title="Journal of Spending"
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}: Reflect on your spending habits!` : "Journal Complete!"}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/finance/teen/simulation-shopping-mall"
      nextGameIdProp="finance-teens-18"
      gameType="finance"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="text-center text-white space-y-8">
        {!showResult && stages[currentStage] && (
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 max-w-2xl mx-auto">
            <PenSquare className="mx-auto mb-3 w-8 h-8 text-yellow-300" />
            <h3 className="text-xl font-bold mb-3">{stages[currentStage].question}</h3>
            <p className="text-white/70 mb-3 text-sm">Score: {score}/{stages.length}</p>
            <p className="text-white/60 text-xs mb-3">
              Write at least {stages[currentStage].minLength} characters
            </p>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Write your journal entry here..."
              className="w-full max-w-md mx-auto p-3 rounded-xl text-black text-base bg-white/90"
              disabled={showResult}
            />
            <div className="mt-2 text-white/50 text-xs">
              {entry.trim().length}/{stages[currentStage].minLength} characters
            </div>
            <button
              onClick={handleSubmit}
              className={`mt-3 px-6 py-3 rounded-full text-base font-semibold transition-transform ${
                entry.trim().length >= stages[currentStage].minLength && !showResult
                  ? 'bg-green-500 hover:bg-green-600 hover:scale-105 text-white cursor-pointer'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50'
              }`}
              disabled={entry.trim().length < stages[currentStage].minLength || showResult}
            >
              {currentStage === stages.length - 1 ? 'Submit Final Entry' : 'Submit & Continue'}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalOfSpending;