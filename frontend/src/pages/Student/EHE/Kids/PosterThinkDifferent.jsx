import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterThinkDifferent = () => {
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
      question: 'Which poster would best show "Small Beginnings"?',
      choices: [
        { text: "Poster showing every big change starts with a small idea 🌱", correct: true },
        { text: "Poster showing big changes happen instantly ⚡", correct: false },
        { text: "Poster showing small ideas don't matter 🚫", correct: false },
      ],
    },
    {
      question: 'Which poster would best show "Think Outside"?',
      choices: [
        { text: "Poster showing conventional thinking is always best 📏", correct: false },
        { text: "Poster showing innovation lives beyond conventional thinking 💭", correct: true },
        { text: "Poster showing thinking differently is dangerous ⚠️", correct: false },
      ],
    },
    {
      question: 'Which poster would best show "Question Everything"?',
      choices: [
        { text: "Poster showing never questioning authority 🤫", correct: false },
        { text: "Poster showing challenge assumptions to find better solutions ❓", correct: true },
        { text: "Poster showing questioning is disrespectful 🙅", correct: false },
      ],
    },
    {
      question: 'Which poster would best show "Embrace Failure"?',
      choices: [
        { text: "Poster showing mistakes are stepping stones to success 💥", correct: true },
        { text: "Poster showing failure means you're worthless ❌", correct: false },
        { text: "Poster showing avoiding all risks is better 🛡️", correct: false },
      ],
    },
    {
      question: 'Which poster would best show "My Innovation Mindset"?',
      choices: [
        { text: "Poster showing personal innovative thinking strategies 🎯", correct: true },
        { text: "Poster showing copying others is better 📋", correct: false },
        { text: "Poster showing innovation isn't important 🙈", correct: false },
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
      title="Poster: Think Different"
      score={score}
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}` : "Poster Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId="ehe-kids-36"
      gameType="ehe"
      totalLevels={stages.length}
      currentLevel={currentStage + 1}
      maxScore={stages.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ehe/kids"
    
      nextGamePathProp="/student/ehe/kids/journal-of-ideas"
      nextGameIdProp="ehe-kids-37">
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

export default PosterThinkDifferent;