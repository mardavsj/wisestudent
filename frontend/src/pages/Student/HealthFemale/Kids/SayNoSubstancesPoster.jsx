import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SayNoSubstancesPoster = () => {
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
      question: 'Which sign means "No Smoking" on a poster?',
      choices: [
        { text: "Poster showing a smiley face 😀", correct: false },
        { text: "Poster showing a cigarette with a red circle and line 🚭", correct: true },
        { text: "Poster showing a thumbs up 👍", correct: false },
      ],
    },
    {
      question: 'Which slogan helps you say no to substances?',
      choices: [
        { text: "Poster showing try everything 🤷", correct: false },
        { text: "Poster showing be cool, be safe, say NO! 😎", correct: true },
        { text: "Poster showing say maybe 🤔", correct: false },
      ],
    },
    {
      question: 'Who can you draw on your poster as a helper?',
      choices: [
        { text: "Poster showing a villain 🦹", correct: false },
        { text: "Poster showing a monster 👹", correct: false },
        { text: "Poster showing a superhero teacher 🦸", correct: true },
      ],
    },
    {
      question: 'Which image shows healthy lungs?',
      choices: [
        { text: "Poster showing black and smoky lungs 🖤", correct: false },
        { text: "Poster showing lungs made of stone 🪨", correct: false },
        { text: "Poster showing pink and happy lungs 🩷", correct: true },
      ],
    },
    {
      question: 'What is the best choice for your poster message?',
      choices: [
        { text: "Poster showing drug free 🌟", correct: true },
        { text: "Poster showing very sleepy 😴", correct: false },
        { text: "Poster showing angry 😠", correct: false },
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
      title="Poster: Say No to Substances"
      score={score}
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}` : "Poster Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      onNext={handleNext}
      nextButtonText="Back to Games"
      gameId="health-female-kids-86"
      gameType="health-female"
      totalLevels={stages.length}
      currentLevel={currentStage + 1}
      maxScore={stages.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/health-female/kids"
    
      nextGamePathProp="/student/health-female/kids/journal-of-refusal"
      nextGameIdProp="health-female-kids-87">
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

export default SayNoSubstancesPoster;