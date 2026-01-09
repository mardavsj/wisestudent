import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';

const FreshAndNeatPoster = () => {
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
      question: 'Which poster would best encourage washing hands?',
      choices: [
        { text: ".poster showing dirty hands are fine 🦠", correct: false },
        { text: "Poster showing only water works 💧", correct: false },
        { text: "Poster showing clean hands save lives 🧼", correct: true },
      ],
    },
    {
      question: 'Which message is best for daily hygiene?',
      choices: [
        { text: "Poster showing bath once a year 📅", correct: false },
        { text: "Poster showing shower power everyday 🚿", correct: true },
        { text: "Poster showing perfume over bath 🌸", correct: false },
      ],
    },
    {
      question: 'Which poster promotes dental health?',
      choices: [
        { text: "Poster showing sugar rush all day 🍭", correct: false },
        { text: "Poster showing brush twice daily 🪥", correct: true },
        { text: "Poster showing no brushing needed 😷", correct: false },
      ],
    },
    {
      question: 'Which poster shows good nail care?',
      choices: [
        { text: "Poster showing bite your nails 😬", correct: false },
        { text: "Poster showing long and dirty nails 🧟‍♀️", correct: false },
        { text: "Poster showing trim and clean regularly ✂️", correct: true },
      ],
    },
    {
      question: 'Which poster is about clean clothes?',
      choices: [
        { text: "Poster showing fresh clothes daily 👕", correct: true },
        { text: "Poster showing wear it twice 👃", correct: false },
        { text: "Poster showing sleep in uniform 💤", correct: false },
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
      title="Fresh & Neat Posters"
      score={score}
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}` : "Poster Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      onNext={handleNext}
      nextButtonText="Back to Games"
      gameId="health-female-kids-6"
      gameType="health-female"
      totalLevels={stages.length}
      currentLevel={currentStage + 1}
      maxScore={stages.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/health-female/kids"
    
      nextGamePathProp="/student/health-female/kids/hygiene-journal"
      nextGameIdProp="health-female-kids-7">
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

export default FreshAndNeatPoster;
