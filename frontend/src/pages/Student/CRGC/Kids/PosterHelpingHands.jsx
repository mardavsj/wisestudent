import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterHelpingHands = () => {
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
      question: 'Which poster would best show "Helping at Home"?',
      choices: [
        { text: "Poster showing helping with dishes and cleaning 🧽", correct: true },
        { text: "Poster showing ignoring household chores 🚫", correct: false },
        { text: "Poster showing home help isn't important 😔", correct: false },
      ],
    },
    {
      question: 'Which poster would best show "Community Service"?',
      choices: [
        { text: "Poster showing littering in public spaces 🚫", correct: false },
        { text: "Poster showing community service is boring 😔", correct: false },
        { text: "Poster showing volunteering at local events 🤝", correct: true },
      ],
    },
    {
      question: 'Which poster would best show "Helping Friends"?',
      choices: [
        { text: "Poster showing ignoring friends in need 🚫", correct: false },
        { text: "Poster showing supporting friends through challenges 🆘", correct: true },
        { text: "Poster showing friends should handle problems alone 😔", correct: false },
      ],
    },
    {
      question: 'Which poster would best show "Environmental Help"?',
      choices: [
        { text: "Poster showing recycling and saving energy ♻️", correct: true },
        { text: "Poster showing wasting water and electricity 🚫", correct: false },
        { text: "Poster showing environmental help doesn't matter 😔", correct: false },
      ],
    },
    {
      question: 'Which poster would best show "Little Hands Can Help Big"?',
      choices: [
        { text: "Poster showing small acts are meaningless 🚫", correct: false },
        { text: "Poster showing only adults can make a difference 😔", correct: false },
        { text: "Poster showing small kindness creates big changes ✨", correct: true },
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
    navigate("/games/civic-responsibility/kids");
  };

  const currentStageData = stages[currentStage];

  return (
    <GameShell
      title="Poster: Helping Hands"
      score={score}
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}` : "Poster Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      onNext={handleNext}
      nextButtonText="Back to Games"
      gameId="civic-responsibility-kids-56"
      gameType="civic-responsibility"
      totalLevels={stages.length}
      currentLevel={currentStage + 1}
      maxScore={stages.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/kids"
    
      nextGamePathProp="/student/civic-responsibility/kids/journal-of-service"
      nextGameIdProp="civic-responsibility-kids-57">
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
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

export default PosterHelpingHands;