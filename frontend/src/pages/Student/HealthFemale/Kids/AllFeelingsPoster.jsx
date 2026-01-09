import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AllFeelingsPoster = () => {
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
      question: 'Which poster would best show "All Feelings Are Okay"?',
      choices: [
        { text: "Poster with many faces—happy, sad, angry, excited 🌈", correct: true },
        { text: "Poster showing robots have no feelings 🤖", correct: false },
        { text: "Poster showing only smiles allowed 🙂", correct: false },
      ],
    },
    {
      question: 'Which image would best show "sadness" on a feelings poster?',
      choices: [
        { text: "Poster showing a bright sun ☀️", correct: false },
        { text: "Poster showing a blue rain cloud 🌧️", correct: true },
        { text: "Poster showing a pizza 🍕", correct: false },
      ],
    },
    {
      question: 'Which image would best show "anger" on a feelings poster?',
      choices: [
        { text: "Poster showing a sleeping cat 🐱", correct: false },
        { text: "Poster showing a red fire or volcano 🌋", correct: true },
        { text: "Poster showing a flower 🌸", correct: false },
      ],
    },
    {
      question: 'Which message would best show what helps all feelings?',
      choices: [
        { text: "Poster showing talking, hugging, breathing 🤗", correct: true },
        { text: "Poster showing yelling loudly 📢", correct: false },
        { text: "Poster showing ignoring them 🙈", correct: false },
      ],
    },
    {
      question: 'Which message would best show where it\'s safe to have feelings?',
      choices: [
        { text: "Poster showing only in a box 📦", correct: false },
        { text: "Poster showing on the moon 🌑", correct: false },
        { text: "Poster showing anywhere, especially with safe people 🏡", correct: true },
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
      title="Poster: All Feelings"
      score={score}
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}` : "Poster Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      onNext={handleNext}
      nextButtonText="Back to Games"
      gameId="health-female-kids-56"
      gameType="health-female"
      totalLevels={stages.length}
      currentLevel={currentStage + 1}
      maxScore={stages.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/health-female/kids"
    
      nextGamePathProp="/student/health-female/kids/feelings-journal"
      nextGameIdProp="health-female-kids-57">
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

export default AllFeelingsPoster;