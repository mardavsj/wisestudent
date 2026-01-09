import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { PenSquare } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LearningBodyJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-37";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [answer, setAnswer] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const prompts = [
    {
      id: 1,
      prompt: "One thing I learned about body systems is that the heart ___.",
      minLength: 10,
      guidance: "Think about what the heart does for your body."
    },
    {
      id: 2,
      prompt: "The lungs help us ___ and that's important because ___.",
      minLength: 10,
      guidance: "Consider how breathing helps your body work."
    },
    {
      id: 3,
      prompt: "I learned that organs work ___ and this helps the body ___.",
      minLength: 10,
      guidance: "Organs work together as a team to keep you healthy."
    },
    {
      id: 4,
      prompt: "Respecting my body means ___ and that's important because ___.",
      minLength: 10,
      guidance: "Think about how you take care of and protect your body."
    },
    {
      id: 5,
      prompt: "One new thing I learned about my body is ___.",
      minLength: 10,
      guidance: "Share something interesting you discovered about how your body works."
    }
  ];

  const handleSubmit = () => {
    if (answered) return;
    
    const currentPromptData = prompts[currentPrompt];
    if (answer.trim().length < currentPromptData.minLength) {
      showCorrectAnswerFeedback(0, false);
      return;
    }
    
    setAnswered(true);
    resetFeedback();
    setScore(prev => prev + 1);
    showCorrectAnswerFeedback(1, true);

    const isLastStage = currentPrompt === prompts.length - 1;
    
    setTimeout(() => {
      if (isLastStage) {
        setShowResult(true);
      } else {
        setCurrentPrompt(prev => prev + 1);
        setAnswer("");
        setAnswered(false);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  const currentPromptData = prompts[currentPrompt];
  const characterCount = answer.length;
  const minLength = currentPromptData?.minLength || 10;

  return (
    <GameShell
      title="Journal: Learning About My Body"
      subtitle={!showResult ? `Entry ${currentPrompt + 1} of ${prompts.length}` : "Journal Complete!"}
      score={score}
      currentLevel={currentPrompt + 1}
      totalLevels={prompts.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={prompts.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/health-male/kids/growth-story"
      nextGameIdProp="health-male-kids-38"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="health-male"
      onNext={handleNext}
      nextEnabled={showResult}
    >
      <div className="space-y-8">
        {!showResult && currentPromptData ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Entry {currentPrompt + 1}/{prompts.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{prompts.length}</span>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <PenSquare className="w-8 h-8 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Journal Entry</h3>
              </div>
              
              <p className="text-white text-lg mb-4">
                {currentPromptData.prompt}
              </p>
              
              <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 mb-4">
                <p className="text-white/90 text-sm">
                  <span className="font-semibold text-blue-300">💡 Tip:</span> {currentPromptData.guidance}
                </p>
              </div>
              
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
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
                onClick={handleSubmit}
                disabled={answer.trim().length < minLength || answered}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  answer.trim().length >= minLength && !answered
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

export default LearningBodyJournal;

