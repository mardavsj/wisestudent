import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HealthyGirlsWinPoster = () => {
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
      question: 'Which poster would best show "Strong, Smart, and Healthy" girls?',
      choices: [
        { text: "Poster showing girls who never exercise 🚫", correct: false },
        { text: "Poster showing girls who eat well and stay active 💪", correct: true },
        { text: "Poster showing girls who skip meals 😔", correct: false },
      ],
    },
    {
      question: 'Which poster would best show a "Winning Routine"?',
      choices: [
        { text: "Poster showing staying up late playing games 🚫", correct: false },
        { text: "Poster showing waking up early and stretching 🧘‍♀️", correct: true },
        { text: "Poster showing skipping breakfast 🚫", correct: false },
      ],
    },
    {
      question: 'Which poster would best show "Heroes Helping Others"?',
      choices: [
        { text: "Poster showing ignoring friends in need 🚫", correct: false },
        { text: "Poster showing being mean to classmates 🚫", correct: false },
        { text: "Poster showing girls helping others stay safe 👯‍♀️", correct: true },
      ],
    },
    {
      question: 'Which poster would best show "Energy and Health Colors"?',
      choices: [
        { text: "Poster using bright green and orange 🟢", correct: true },
        { text: "Poster using dull grey and brown colors 🌫️", correct: false },
        { text: "Poster using invisible colors 👻", correct: false },
      ],
    },
    {
      question: 'Which poster would best show the final message "Healthy Girls Win"?',
      choices: [
        { text: "Poster saying 'I give up' 🏳️", correct: false },
        { text: "Poster saying 'I choose health every day!' 🌟", correct: true },
        { text: "Poster saying 'I am bored' 😑", correct: false },
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
      title="Poster: Healthy Girls Win"
      score={score}
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}` : "Poster Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      onNext={handleNext}
      nextButtonText="Back to Games"
      gameId="health-female-kids-36"
      gameType="health-female"
      totalLevels={stages.length}
      currentLevel={currentStage + 1}
      maxScore={stages.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/health-female/kids"
    >
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

export default HealthyGirlsWinPoster;