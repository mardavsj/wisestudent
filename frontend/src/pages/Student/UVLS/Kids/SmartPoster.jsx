import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Paintbrush } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SmartPoster = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-96");
  const gameId = gameData?.id || "uvls-kids-96";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SmartPoster, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const stages = [
    {
      question: 'Which poster emphasizes creating well-defined and attainable objectives?',
      choices: [
        { text: "Vague, Unclear, Impossible Goals 🚫", correct: false },
        { text: "Set Specific, Measurable, Doable Goals 🎯", correct: true },
        { text: "No Goals Needed 🚫", correct: false },
      ],
    },
    {
      question: 'Which poster promotes monitoring advancement toward targets?',
      choices: [
        { text: "Clear Goal, Track Progress, Achievable 📈", correct: true },
        { text: "Unclear Goal, No Tracking, Unrealistic 🚫", correct: false },
        { text: "Never Set Goals 🚫", correct: false },
      ],
    },
    {
      question: 'Which poster focuses on defining actionable steps with measurable outcomes?',
      choices: [
        { text: "No Plan, No Amount, No Deadline 🚫", correct: false },
        { text: "What to Do, How Much, When Done ✅", correct: true },
        { text: "Never Plan 🚫", correct: false },
      ],
    },
    {
      question: 'Which poster encourages straightforward and quantifiable ambitions?',
      choices: [
        { text: "Simple Aim, Count It, Possible 📊", correct: true },
        { text: "Complex Aim, Can't Count, Impossible 🚫", correct: false },
        { text: "No Aims Needed 🚫", correct: false },
      ],
    },
    {
      question: 'Why do smart goal posters help kids?',
      choices: [
        { text: "Encourage no planning 😠", correct: false },
        { text: "Make us avoid goals 🙈", correct: false },
        { text: "Teach us to set good goals 📚", correct: true },
      ],
    },
  ];

  const handleSelect = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastQuestion = currentStage === stages.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentStage((prev) => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const finalScore = score;

  return (
    <GameShell
      title="Smart Poster"
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}: Choose posters that promote smart goal setting!` : "Game Complete!"}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/uvls/kids/weekly-plan-journal"
      nextGameIdProp="uvls-kids-97"
      gameType="uvls"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="text-center text-white space-y-8">
        {!showResult && stages[currentStage] && (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <Paintbrush className="mx-auto mb-4 w-8 h-8 text-yellow-400" />
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <p className="text-white/70 mb-4">Score: {score}/{stages.length}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {stages[currentStage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(choice.correct)}
                  className="p-6 rounded-2xl border bg-white/10 border-white/20 hover:bg-green-600 transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={answered}
                >
                  <div className="text-lg font-semibold">{choice.text}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SmartPoster;

