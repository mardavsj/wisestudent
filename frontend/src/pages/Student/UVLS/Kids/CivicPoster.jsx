import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Paintbrush } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CivicPoster = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-86");
  const gameId = gameData?.id || "uvls-kids-86";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for CivicPoster, using fallback ID");
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
      question: 'Which poster promotes environmental stewardship and community cooperation?',
      choices: [
        { text: "Make Mess, Ignore Others, Break Rules 🚫", correct: false },
        { text: "Clean Up, Help Others, Obey Rules 🧹", correct: true },
        { text: "Don't Help Anyone 🚫", correct: false },
      ],
    },
    {
      question: 'Which poster encourages sustainable practices and kindness?',
      choices: [
        { text: "Recycle, Be Kind, Vote Later ♻️", correct: true },
        { text: "Throw Trash, Be Mean 😠", correct: false },
        { text: "Never Recycle 🚫", correct: false },
      ],
    },
    {
      question: 'Which poster emphasizes environmental conservation and mutual respect?',
      choices: [
        { text: "Cut Trees, Keep Everything, Disrespect 🌳", correct: false },
        { text: "Plant Trees, Share, Respect 🌳", correct: true },
        { text: "Never Plant Trees 🚫", correct: false },
      ],
    },
    {
      question: 'Which poster highlights community service and resource conservation?',
      choices: [
        { text: "Never Help, Waste Water, Litter 🚫", correct: false },
        { text: "Ignore Community 🏘️", correct: false },
        { text: "Volunteer, Save Water, No Litter 💧", correct: true },
      ],
    },
    {
      question: 'Why do civic responsibility posters help kids?',
      choices: [
        { text: "Teach us to help our community 📚", correct: true },
        { text: "Encourage being selfish 😠", correct: false },
        { text: "Make us ignore others 🙈", correct: false },
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
      title="Civic Poster"
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}: Choose posters that promote civic responsibility!` : "Game Complete!"}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/uvls/kids/contribution-journal"
      nextGameIdProp="uvls-kids-87"
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

export default CivicPoster;

