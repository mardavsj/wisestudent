import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { PenSquare } from "lucide-react";
import { getGameDataById } from "../../../../utils/getGameData";

const JournalOfCooperation = () => {
  const location = useLocation();
  
  const gameId = "moral-teen-67";
  const gameData = getGameDataById(gameId);
  
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
      question: 'Write: "One time my team achieved more than I could alone was when ___."',
      minLength: 10,
    },
    {
      question: 'Write: "What made my team work well together was ___."',
      minLength: 10,
    },
    {
      question: 'Write: "I contributed to my team\'s success by ___."',
      minLength: 10,
    },
    {
      question: 'Write: "My team faced a challenge. We overcame it by ___."',
      minLength: 10,
    },
    {
      question: 'Write: "Teamwork made me feel ___ compared to working alone because ___."',
      minLength: 10,
    },
  ];

  const handleSubmit = () => {
    if (showResult) return;
    
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
      title="Journal of Cooperation"
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}: Reflect on teamwork!` : "Journal Complete!"}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/moral-values/teen/roleplay-good-teammate"
      nextGameIdProp="moral-teen-68"
      gameType="moral"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="text-center text-white space-y-8">
        {!showResult && stages[currentStage] && (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <PenSquare className="mx-auto mb-4 w-10 h-10 text-yellow-300" />
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <p className="text-white/70 mb-4">Score: {score}/{stages.length}</p>
            <p className="text-white/60 text-sm mb-4">
              Write at least {stages[currentStage].minLength} characters
            </p>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Write your journal entry here..."
              className="w-full max-w-xl p-4 rounded-xl text-black text-lg bg-white/90"
              disabled={showResult}
            />
            <div className="mt-2 text-white/50 text-sm">
              {entry.trim().length}/{stages[currentStage].minLength} characters
            </div>
            <button
              onClick={handleSubmit}
              className={`mt-4 px-8 py-4 rounded-full text-lg font-semibold transition-transform ${
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

export default JournalOfCooperation;

