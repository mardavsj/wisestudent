import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { PenSquare } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HygieneJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-7";

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [entry, setEntry] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const stages = [
    {
      prompt: 'Write: "One habit that keeps me clean is ___."',
      minLength: 10,
      guidance: "Think about daily routines that help you stay clean and fresh."
    },
    {
      prompt: 'Write: "I wash my hands because ___."',
      minLength: 10,
      guidance: "Consider when and why washing hands is important for health."
    },
    {
      prompt: 'Write: "Brushing my teeth makes me feel ___."',
      minLength: 10,
      guidance: "Describe how good oral hygiene makes you feel."
    },
    {
      prompt: 'Write: "Taking a bath helps me to ___."',
      minLength: 10,
      guidance: "Think about the benefits of keeping your body clean."
    },
    {
      prompt: 'Write: "Good hygiene is important because ___."',
      minLength: 10,
      guidance: "Reflect on why taking care of your body matters."
    },
  ];

  const handleSubmit = () => {
    if (answered) return;

    resetFeedback();
    const entryText = entry.trim();

    if (entryText.length >= stages[currentStage].minLength) {
      setAnswered(true);
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);

      const isLastQuestion = currentStage === stages.length - 1;

      setTimeout(() => {
        if (isLastQuestion) {
          setShowResult(true);
        } else {
          setEntry("");
          setAnswered(false);
          setCurrentStage((prev) => prev + 1);
        }
      }, 1500);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
  };

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  const currentStageData = stages[currentStage];
  const characterCount = entry.length;
  const minLength = currentStageData?.minLength || 10;

  return (
    <GameShell
      title="Journal of Hygiene"
      subtitle={!showResult ? `Entry ${currentStage + 1} of ${stages.length}` : "Journal Complete!"}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={score}
      gameId="health-male-kids-7"
      nextGamePathProp="/student/health-male/kids/dirty-shirt-story"
      nextGameIdProp="health-male-kids-8"
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={stages.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 3}
    >
      <div className="space-y-8">
        {!showResult && currentStageData ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Entry {currentStage + 1}/{stages.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{stages.length}</span>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <PenSquare className="w-8 h-8 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Journal Entry</h3>
              </div>
              
              <p className="text-white text-lg mb-4">
                {currentStageData.prompt}
              </p>
              
              <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 mb-4">
                <p className="text-white/90 text-sm">
                  <span className="font-semibold text-blue-300">💡 Tip:</span> {currentStageData.guidance}
                </p>
              </div>
              
              <textarea
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
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
                disabled={entry.trim().length < minLength || answered}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  entry.trim().length >= minLength && !answered
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

export default HygieneJournal;

