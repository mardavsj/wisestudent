import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterManyRoadsAhead = () => {
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
      question: 'Which poster would best show "Multiple Paths"?',
      choices: [
        { text: "Poster showing only one path exists 🚫", correct: false },
        { text: "Poster showing After School = Many Choices 🛣️", correct: true },
        { text: "Poster showing choices don't matter 🙈", correct: false },
      ],
    },
    {
      question: 'Which poster would best show "Your Journey"?',
      choices: [
        { text: "Poster showing Find Your Own Way Forward 🧭", correct: true },
        { text: "Poster showing following others is always better 📋", correct: false },
        { text: "Poster showing journeys are all the same 🔄", correct: false },
      ],
    },
    {
      question: 'Which poster would best show "Explore Options"?',
      choices: [
        { text: "Poster showing exploring is dangerous ⚠️", correct: false },
        { text: "Poster showing sticking with first choice is best 🛑", correct: false },
        { text: "Poster showing Discover What Fits You Best 🔍", correct: true },
      ],
    },
    {
      question: 'Which poster would best show "Build Your Future"?',
      choices: [
        { text: "Poster showing futures are predetermined 🔮", correct: false },
        { text: "Poster showing Create the Life You Want 🏗️", correct: true },
        { text: "Poster showing building futures is impossible 🚫", correct: false },
      ],
    },
    {
      question: 'Which poster would best show "My Future Pathways"?',
      choices: [
        { text: "Poster showing pathways are fixed 🛤️", correct: false },
        { text: "Poster showing personal future pathway strategies 🎯", correct: true },
        { text: "Poster showing planning isn't important 🙅", correct: false },
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

  const currentStageData = stages[currentStage];

  return (
    <GameShell
      title="Poster: Many Roads Ahead"
      score={score}
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}` : "Poster Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId="ehe-kids-56"
      gameType="ehe"
      totalLevels={stages.length}
      currentLevel={currentStage + 1}
      maxScore={stages.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ehe/kids"
    
      nextGamePathProp="/student/ehe/kids/journal-of-dreams"
      nextGameIdProp="ehe-kids-57">
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

export default PosterManyRoadsAhead;