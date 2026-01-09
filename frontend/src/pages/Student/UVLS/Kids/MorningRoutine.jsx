import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const MorningRoutine = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-91");
  const gameId = gameData?.id || "uvls-kids-91";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for MorningRoutine, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
  {
    id: 1,
    text: "Which is the best order to start your morning after waking up?",
    options: [
      { id: "b", text: "Eat breakfast, Brush teeth, Wash hands, Drink water", emoji: "🍳", isCorrect: false },
      { id: "a", text: "Wash hands, Drink water, Brush teeth, Eat breakfast", emoji: "💧", isCorrect: true },
      { id: "c", text: "Brush teeth, Eat breakfast, Drink water, Wash hands", emoji: "🦷", isCorrect: false }
    ]
  },
  {
    id: 2,
    text: "What is the correct order for getting ready for school?",
    options: [
      { id: "a", text: "Dress up, Brush hair, Pack school bag, Wear shoes", emoji: "👕", isCorrect: true },
      { id: "b", text: "Wear shoes, Dress up, Pack bag, Brush hair", emoji: "👟", isCorrect: false },
      { id: "c", text: "Pack bag, Brush hair, Dress up, Wear shoes", emoji: "🎒", isCorrect: false }
    ]
  },
  {
    id: 3,
    text: "Which order helps you have a healthy morning?",
    options: [
      { id: "b", text: "Eat breakfast, Stretch, Wash face, Drink water", emoji: "🍽️", isCorrect: false },
      { id: "c", text: "Wash face, Eat breakfast, Drink water, Stretch", emoji: "🧼", isCorrect: false },
      { id: "a", text: "Stretch, Drink water, Eat breakfast, Wash face", emoji: "🤸", isCorrect: true },
    ]
  },
  {
    id: 4,
    text: "What is the best order to finish your morning chores before school?",
    options: [
      { id: "b", text: "Pack bag, Eat breakfast, Make bed, Wash hands", emoji: "🎒", isCorrect: false },
      { id: "a", text: "Make bed, Wash hands, Eat breakfast, Pack bag", emoji: "🛏️", isCorrect: true },
      { id: "c", text: "Eat breakfast, Wash hands, Pack bag, Make bed", emoji: "🍴", isCorrect: false }
    ]
  },
  {
    id: 5,
    text: "Which order keeps your body active and ready for the day?",
    options: [
      { id: "a", text: "Exercise, Shower, Eat breakfast, Drink water", emoji: "🏃", isCorrect: true },
      { id: "b", text: "Eat breakfast, Exercise, Drink water, Shower", emoji: "🍳", isCorrect: false },
      { id: "c", text: "Drink water, Eat breakfast, Shower, Exercise", emoji: "💧", isCorrect: false }
    ]
  }
];


  const handleChoice = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Morning Routine"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/uvls/kids/priority-quiz"
      nextGameIdProp="uvls-kids-92"
      gameType="uvls"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                    <p className="text-white/90 text-sm">{option.description}</p>
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

export default MorningRoutine;