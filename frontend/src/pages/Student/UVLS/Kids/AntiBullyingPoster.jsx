import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Paintbrush } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const AntiBullyingPoster = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-36");
  const gameId = gameData?.id || "uvls-kids-36";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for AntiBullyingPoster, using fallback ID");
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
      question: 'Which poster promotes taking action against harassment?',
      choices: [
        { text: "Bullying is OK 😠", correct: false },
        { text: "Tease Others 🎭", correct: false },
        { text: "Stop Bullying 🛑", correct: true },
      ],
    },
    {
      question: 'Which poster encourages positive social relationships?',
      choices: [
        { text: "Be a Friend 🤝", correct: true },
        { text: "Ignore Friends 🙈", correct: false },
        { text: "Be Mean 😤", correct: false },
      ],
    },
    {
      question: 'Which poster creates a secure learning environment?',
      choices: [
        { text: "Unsafe School 🚫", correct: false },
        { text: "Safe School 🏫", correct: true },
        { text: "Fighting Allowed 👊", correct: false },
      ],
    },
    {
      question: 'Which poster addresses respectful digital interactions?',
      choices: [
        { text: "Online Kindness 💻", correct: true },
        { text: "Cyber Bully 📱", correct: false },
        { text: "Mean Messages 😠", correct: false },
      ],
    },
    {
      question: 'Why do anti-bullying posters help kids?',
      choices: [
        { text: "Teach us to stand up against bullying 📚", correct: true },
        { text: "Encourage bullying 😠", correct: false },
        { text: "Make us ignore bullying 🙈", correct: false },
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
      title="Anti-Bullying Poster"
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}: Choose posters that stop bullying!` : "Game Complete!"}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/uvls/kids/witness-journal"
      nextGameIdProp="uvls-kids-37"
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

export default AntiBullyingPoster;

