import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterRightsForAll = () => {
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
      question: 'Which poster would best show "Right to Education"?',
      choices: [
        { text: "Poster showing all children deserve to learn 📚", correct: true },
        { text: "Poster showing some children can't go to school 🚫", correct: false },
        { text: "Poster showing education isn't important 😔", correct: false },
      ],
    },
    {
      question: 'Which poster would best show "Right to Safety"?',
      choices: [
        { text: "Poster showing children in dangerous situations 🚫", correct: false },
        { text: "Poster showing safety doesn't matter 😔", correct: false },
        { text: "Poster showing safe homes and communities 🏠", correct: true },
      ],
    },
    {
      question: 'Which poster would best show "Right to Play"?',
      choices: [
        { text: "Poster showing fun and recreational activities 🎮", correct: true },
        { text: "Poster showing children forced to work 🚫", correct: false },
        { text: "Poster showing playtime is wasteful 😔", correct: false },
      ],
    },
    {
      question: 'Which poster would best show "Right to Healthcare"?',
      choices: [
        { text: "Poster showing sick children untreated 🚫", correct: false },
        { text: "Poster showing healthcare is a privilege 😔", correct: false },
        { text: "Poster showing access to medical care 🏥", correct: true },
      ],
    },
    {
      question: 'Which poster would best show "Every Child Has Rights"?',
      choices: [
        { text: "Poster showing only some children matter 🚫", correct: false },
        { text: "Poster showing equal rights for all children 👧👦", correct: true },
        { text: "Poster showing children have no rights 😔", correct: false },
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
      title="Poster: Rights for All"
      score={score}
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}` : "Poster Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      onNext={handleNext}
      nextButtonText="Back to Games"
      gameId="civic-responsibility-kids-66"
      gameType="civic-responsibility"
      totalLevels={stages.length}
      currentLevel={currentStage + 1}
      maxScore={stages.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/kids"
    
      nextGamePathProp="/student/civic-responsibility/kids/journal-of-fairness"
      nextGameIdProp="civic-responsibility-kids-67">
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
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

export default PosterRightsForAll;