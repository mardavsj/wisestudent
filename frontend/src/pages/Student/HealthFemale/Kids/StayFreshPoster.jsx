import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const StayFreshPoster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 1; // 1 coin per question
  const totalCoins = location.state?.totalCoins || 5; // Total coins for 5 questions
  const totalXp = location.state?.totalXp || 10; // Total XP
  const [score, setScore] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stages = [
    {
      question: 'Which title would best show "Stay Fresh" on a poster?',
      choices: [
        { text: "Poster showing never wash! 🚫", correct: false },
        { text: "Poster showing messy is best 🗑️", correct: false },
        { text: "Poster showing sparkle & shine: clean is cool ✨", correct: true },
      ],
    },
    {
      question: 'Which picture would best show good dental hygiene?',
      choices: [
        { text: "Poster showing eating sticky candy 🍬", correct: false },
        { text: "Poster showing girl brushing happily 🦷", correct: true },
        { text: "Poster showing sleeping with mouth open 😴", correct: false },
      ],
    },
    {
      question: 'Which item belongs on a "Bath Time" poster?',
      choices: [
        { text: "Poster showing mud pie 🥧", correct: false },
        { text: "Poster showing sandwich 🥪", correct: false },
        { text: "Poster showing rubber duck & soap 🦆", correct: true },
      ],
    },
    {
      question: 'Which slogan is true about cleanliness?',
      choices: [
        { text: "Poster showing smelling bad helps you make friends 🤢", correct: false },
        { text: "Poster showing clean hands, healthy body 👐", correct: true },
        { text: "Poster showing germs are good pets 🦠", correct: false },
      ],
    },
    {
      question: 'What feeling does being clean give you?',
      choices: [
        { text: "Poster showing confidence 😎", correct: true },
        { text: "Poster showing tiredness 😴", correct: false },
        { text: "Poster showing grumpiness 😠", correct: false },
      ],
    },
  ];

  const handleChoice = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastStage = currentStage === stages.length - 1;
    
    setTimeout(() => {
      if (isLastStage) {
        setShowResult(true);
      } else {
        setCurrentStage(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  const currentStageData = stages[currentStage];

  return (
    <GameShell
      title="Poster: Stay Fresh"
      score={score}
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}` : "Poster Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      onNext={handleNext}
      nextButtonText="Back to Games"
      gameId="health-female-kids-46"
      gameType="health-female"
      totalLevels={stages.length}
      currentLevel={currentStage + 1}
      maxScore={stages.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/health-female/kids"
    
      nextGamePathProp="/student/health-female/kids/hygiene-habits-journal"
      nextGameIdProp="health-female-kids-47">
      <div className="space-y-8">
        {!showResult && currentStageData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentStage + 1}/{stages.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{stages.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentStageData.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentStageData.choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChoice(choice.correct)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <p className="font-semibold text-lg">{choice.text}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default StayFreshPoster;