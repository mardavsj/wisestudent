import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Paintbrush } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const MediationPoster = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-76");
  const gameId = gameData?.id || "uvls-kids-76";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for MediationPoster, using fallback ID");
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
      question: 'Which poster emphasizes impartial listening to resolve disputes?',
      choices: [
        { text: "Only Listen to One 👂", correct: false },
        { text: "Listen Both, Find Fair Solution ⚖️", correct: true },
        { text: "Don't Listen to Anyone 🚫", correct: false },
      ],
    },
    {
      question: 'Which poster promotes de-escalation and collaborative problem-solving?',
      choices: [
        { text: "Calm Down, Share Feelings, Solve Together 🤝", correct: true },
        { text: "Stay Angry and Fight 😠", correct: false },
        { text: "Ignore the Problem 🙈", correct: false },
      ],
    },
    {
      question: 'Which poster advocates for mutually beneficial outcomes?',
      choices: [
        { text: "Keep Arguing Forever 🗣️", correct: false },
        { text: "Stop Argue, Think Win-Win 💭", correct: true },
        { text: "Only One Person Wins 🏆", correct: false },
      ],
    },
    {
      question: 'Which poster highlights the importance of balanced negotiation?',
      choices: [
        { text: "Hear Both Sides, Propose Compromise 🤝", correct: true },
        { text: "Only One Side Matters 👆", correct: false },
        { text: "No Compromise Needed 🚫", correct: false },
      ],
    },
    {
      question: 'Why do mediation posters help kids?',
      choices: [
        { text: "Teach us to solve conflicts peacefully 📚", correct: true },
        { text: "Encourage fighting 😠", correct: false },
        { text: "Make us ignore conflicts 🙈", correct: false },
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
      title="Mediation Poster"
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}: Choose posters that promote peaceful solutions!` : "Game Complete!"}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/uvls/kids/resolution-journal"
      nextGameIdProp="uvls-kids-77"
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

export default MediationPoster;

