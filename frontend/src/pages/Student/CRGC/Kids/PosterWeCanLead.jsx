import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterWeCanLead = () => {
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
      question: 'Which poster would best show "Leading by Example"?',
      choices: [
        { text: "Poster showing demonstrating good behavior 👍", correct: true },
        { text: "Poster showing telling others what to do 🚫", correct: false },
        { text: "Poster showing leaders don't need to act 😔", correct: false },
      ],
    },
    {
      question: 'Which poster would best show "Team Leadership"?',
      choices: [
        { text: "Poster showing bossing teammates around 🚫", correct: false },
        { text: "Poster showing working alone is better 😔", correct: false },
        { text: "Poster showing encouraging team collaboration 🤝", correct: true },
      ],
    },
    {
      question: 'Which poster would best show "Problem Solving"?',
      choices: [
        { text: "Poster showing creative solutions to issues 💡", correct: true },
        { text: "Poster showing ignoring community problems 🚫", correct: false },
        { text: "Poster showing problems can't be solved 😔", correct: false },
      ],
    },
    {
      question: 'Which poster would best show "Speaking Up"?',
      choices: [
        { text: "Poster showing staying silent about injustice 🚫", correct: false },
        { text: "Poster showing voicing concerns respectfully 🗣️", correct: true },
        { text: "Poster showing speaking up causes trouble 😔", correct: false },
      ],
    },
    {
      question: 'Which poster would best show "Even Kids Can Lead Change"?',
      choices: [
        { text: "Poster showing only adults can lead 🚫", correct: false },
        { text: "Poster showing children should wait to lead 😔", correct: false },
        { text: "Poster showing youth can make a difference ✨", correct: true },
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
      title="Poster: We Can Lead"
      score={score}
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}` : "Poster Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      onNext={handleNext}
      nextButtonText="Back to Games"
      gameId="civic-responsibility-kids-96"
      gameType="civic-responsibility"
      totalLevels={stages.length}
      currentLevel={currentStage + 1}
      maxScore={stages.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/kids"
    
      nextGamePathProp="/student/civic-responsibility/kids/journal-of-action"
      nextGameIdProp="civic-responsibility-kids-97">
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
                    className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

export default PosterWeCanLead;