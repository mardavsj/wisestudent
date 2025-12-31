import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const NutritionProBadge = () => {
  const navigate = useNavigate();
  
  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-male-teen-20";

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

 const questions = [
  {
    id: 1,
    title: "Micronutrient Master",
    text: "Which nutrient helps your body convert food into usable energy?",
    options: [
      { text: "Vitamin B-Complex", emoji: "🧬", isCorrect: true },
      { text: "Cholesterol", emoji: "🧈", isCorrect: false },
      { text: "Sodium", emoji: "🧂", isCorrect: false },
      { text: "Protein Powder", emoji: "🏋️", isCorrect: false }
    ],
    feedback: {
      correct: "Correct! B vitamins help release energy from food.",
      wrong: "B-complex vitamins are essential for energy metabolism."
    }
  },
  {
    id: 2,
    title: "Smart Fats",
    text: "Which fat is considered heart-healthy when eaten in balance?",
    options: [
      { text: "Trans Fat", emoji: "🚫", isCorrect: false },
      { text: "Omega-3 Fatty Acids", emoji: "🐟", isCorrect: true },
      { text: "Refined Vegetable Oil", emoji: "🛢️", isCorrect: false },
      { text: "Deep-Fried Fat", emoji: "🍟", isCorrect: false }
    ],
    feedback: {
      correct: "Yes! Omega-3 supports brain and heart health.",
      wrong: "Omega-3 fats are beneficial when consumed properly."
    }
  },
  {
    id: 3,
    title: "Glycemic Control",
    text: "Which food causes the slowest rise in blood sugar?",
    options: [
      { text: "White Bread", emoji: "🍞", isCorrect: false },
      { text: "Sugary Cereal", emoji: "🥣", isCorrect: false },
      { text: "Lentils", emoji: "🌱", isCorrect: true },
      { text: "Fruit Juice", emoji: "🧃", isCorrect: false }
    ],
    feedback: {
      correct: "Correct! Lentils have a low glycemic index.",
      wrong: "Low-GI foods like lentils control blood sugar better."
    }
  },
  {
    id: 4,
    title: "Hidden Sugars",
    text: "Which product often contains hidden added sugars?",
    options: [
      { text: "Flavored Yogurt", emoji: "🍦", isCorrect: true },
      { text: "Plain Oats", emoji: "🌾", isCorrect: false },
      { text: "Boiled Eggs", emoji: "🥚", isCorrect: false },
      { text: "Steamed Vegetables", emoji: "🥕", isCorrect: false }
    ],
    feedback: {
      correct: "Right! Many flavored yogurts contain added sugars.",
      wrong: "Check labels—flavored foods often hide sugar."
    }
  },
  {
    id: 5,
    title: "Performance Nutrition",
    text: "What should you prioritize eating before intense physical activity?",
    options: [
      { text: "Fast Sugar Snacks", emoji: "🍬", isCorrect: false },
      { text: "Heavy Fried Foods", emoji: "🍗", isCorrect: false },
      { text: "Complex Carbs with Some Protein", emoji: "🍚", isCorrect: true },
      { text: "Energy Drinks", emoji: "⚡", isCorrect: false }
    ],
    feedback: {
      correct: "Exactly! This combo fuels muscles efficiently.",
      wrong: "Balanced carbs and protein support sustained performance."
    }
  }
];



  const handleChoice = (optionIndex) => {
    if (answered) return;

    setAnswered(true);
    setSelectedOptionIndex(optionIndex);
    resetFeedback();

    const selectedOption = questions[currentQuestion].options[optionIndex];
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    const isLastQuestion = currentQuestion === questions.length - 1;

    setTimeout(() => {
      if (isLastQuestion) {
        setGameFinished(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
        setSelectedOptionIndex(null);
      }
    }, 2000);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setGameFinished(false);
    setSelectedOptionIndex(null);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/puberty-story-teen");
  };

  const currentQ = questions[currentQuestion];

  return (
    <GameShell
      title="Nutrition Pro Badge"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-male"
      totalLevels={5}
      currentLevel={10}
      showConfetti={gameFinished && score >= 4}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!gameFinished ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{maxScore}</span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2 text-center">
                {currentQ.title}
              </h2>
              
              <p className="text-xl text-white mb-8 text-center">
                {currentQ.text}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOptionIndex === idx;
                  const showFeedback = answered;

                  let buttonClass = "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3";

                  if (showFeedback) {
                    if (isSelected) {
                      buttonClass = option.isCorrect
                        ? "bg-green-500 ring-4 ring-green-300 text-white p-6 rounded-2xl shadow-lg min-h-[60px] flex items-center justify-center gap-3"
                        : "bg-red-500 ring-4 ring-red-300 text-white p-6 rounded-2xl shadow-lg min-h-[60px] flex items-center justify-center gap-3";
                    } else {
                      buttonClass = "bg-white/10 opacity-50 text-white p-6 rounded-2xl shadow-lg min-h-[60px] flex items-center justify-center gap-3";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleChoice(idx)}
                      disabled={showFeedback}
                      className={buttonClass}
                    >
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="font-bold text-lg">{option.text}</span>
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className={`mt-4 p-4 rounded-xl ${
                  currentQ.options[selectedOptionIndex]?.isCorrect
                    ? "bg-green-500/20 border border-green-500/30"
                    : "bg-red-500/20 border border-red-500/30"
                }`}>
                  <p className="text-white font-semibold">
                    {currentQ.options[selectedOptionIndex]?.isCorrect
                      ? currentQ.feedback.correct
                      : currentQ.feedback.wrong}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 4 ? (
              <div>
                <div className="text-6xl mb-4">🥗</div>
                <h3 className="text-3xl font-bold text-white mb-4">Nutrition Pro Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about nutrition with {score} correct answers out of {questions.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Nutrition Expert</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Muscle Building</h4>
                    <p className="text-white/90 text-sm">
                      You understand the importance of protein for muscle growth and repair.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Energy Management</h4>
                    <p className="text-white/90 text-sm">
                      You know how to choose foods that provide sustained energy throughout the day.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Nutrition!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {questions.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review nutritional guidelines to strengthen your knowledge and earn your badge.
                </p>
                <button
                  onClick={handleRetry}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default NutritionProBadge;
