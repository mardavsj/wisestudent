import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HealthyRoutineKidBadge = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-40";
  const currentLevel = 40;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Morning Star",
      text: "To earn the 'Morning Star' badge:",
      options: [
        {
          text: "Sleep until noon",
          emoji: "😴",
          isCorrect: false
        },
        {
          text: "Wake up, brush, and eat breakfast",
          emoji: "🌅",
          isCorrect: true
        },
        {
          text: "Watch TV immediately",
          emoji: "📺",
          isCorrect: false
        },
        {
          text: "Skip breakfast and go back to bed",
          emoji: "🛌",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Starting your day with a healthy morning routine sets a positive tone for the entire day!",
        wrong: "A consistent morning routine with brushing teeth and eating breakfast helps you stay energized and focused throughout the day."
      }
    },
    {
      id: 2,
      title: "Water Warrior",
      text: "To earn the 'Water Warrior' badge:",
      options: [
        {
          text: "Drink only soda",
          emoji: "🥤",
          isCorrect: false
        },
        {
          text: "Drink 8 glasses of water a day",
          emoji: "💧",
          isCorrect: true
        },
        {
          text: "Drink mud water",
          emoji: "🚱",
          isCorrect: false
        },
        {
          text: "Drink energy drinks all day",
          emoji: "⚡",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Drinking water helps your body function properly, keeps your skin healthy, and maintains your energy levels!",
        wrong: "Water is essential for almost every bodily function. It helps transport nutrients, regulate body temperature, and flush out toxins."
      }
    },
    {
      id: 3,
      title: "Golden Sleep",
      text: "To earn the 'Golden Sleep' badge:",
      options: [
        {
          text: "Go to bed on time every night",
          emoji: "🛌",
          isCorrect: true
        },
        {
          text: "Sleep with shoes on",
          emoji: "👟",
          isCorrect: false
        },
        {
          text: "Stay up late on phones",
          emoji: "📱",
          isCorrect: false
        },
        {
          text: "Take naps randomly throughout the day",
          emoji: "😴",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great job! Consistent sleep schedules help regulate your body's internal clock and improve sleep quality!",
        wrong: "Going to bed at the same time each night helps establish a healthy sleep pattern, which is crucial for growth and learning."
      }
    },
    {
      id: 4,
      title: "Clean Machine",
      text: "To earn the 'Clean Machine' badge:",
      options: [
        {
          text: "Shower only once a year",
          emoji: "🦨",
          isCorrect: false
        },
        {
          text: "Wear dirty clothes",
          emoji: "👕",
          isCorrect: false
        },
        {
          text: "Bathe regularly and wash hands",
          emoji: "🚿",
          isCorrect: true
        },
        {
          text: "Never brush teeth",
          emoji: "🦷",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Absolutely right! Regular bathing and handwashing help prevent illness and keep you feeling fresh!",
        wrong: "Good hygiene practices like regular bathing, handwashing, and brushing teeth help remove germs and bacteria from your body."
      }
    },
    {
      id: 5,
      title: "Healthy Kid",
      text: "The Ultimate 'Healthy Kid' Badge requires...",
      options: [
        {
          text: "Only one good habit",
          emoji: "☝️",
          isCorrect: false
        },
        {
          text: "Doing healthy things consistently",
          emoji: "🔁",
          isCorrect: true
        },
        {
          text: "Eating candy for dinner",
          emoji: "🍬",
          isCorrect: false
        },
        {
          text: "Never exercising",
          emoji: "🛋️",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Building healthy habits takes practice and consistency over time!",
        wrong: "Developing a healthy lifestyle requires maintaining multiple positive behaviors consistently, such as good nutrition, exercise, and proper sleep."
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
    navigate("/games/health-female/kids");
  };

  const currentQ = questions[currentQuestion];

  return (
    <GameShell
      title="Badge: Healthy Routine Kid"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={currentLevel}
      showConfetti={gameFinished && score >= 4}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
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
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-4">Healthy Routine Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about healthy routines with {score} correct answers out of {questions.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Healthy Routine Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Daily Habits</h4>
                    <p className="text-white/90 text-sm">
                      You understand the importance of consistent morning routines and bedtime schedules.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Wellness Practices</h4>
                    <p className="text-white/90 text-sm">
                      You know that hydration, hygiene, and healthy eating are key to feeling your best.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Healthy Routines!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {questions.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review healthy routine concepts to strengthen your knowledge and earn your badge.
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

export default HealthyRoutineKidBadge;