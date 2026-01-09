import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HealthyKidBadge = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-male-kids-20";

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Fruit Power",
      text: "Why are fruits better than candy?",
      options: [
        {
          text: "They are wrapped in plastic",
          emoji: "🍊",
          isCorrect: false
        },
        {
          text: "They have natural vitamins",
          emoji: "🍎",
          isCorrect: true
        },
        {
          text: "They have more sugar",
          emoji: "🍬",
          isCorrect: false
        },
        {
          text: "They taste worse",
          emoji: "🤢",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Awesome! Fruits give you natural energy and vitamins!",
        wrong: "Fruits are better because they have natural vitamins that keep you healthy!"
      }
    },
    {
      id: 2,
      title: "Veggie Victory",
      text: "What do vegetables do for your body?",
      options: [
        {
          text: "Make you tired",
          emoji: "😴",
          isCorrect: false
        },
        {
          text: "Nothing at all",
          emoji: "🌱",
          isCorrect: false
        },
        {
          text: "Help you grow strong",
          emoji: "🥕",
          isCorrect: true
        },
        {
          text: "Make you sick",
          emoji: "🤢",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Correct! Vegetables are full of nutrients that help you grow strong!",
        wrong: "Vegetables are superfoods that help your body grow strong and healthy!"
      }
    },
    {
      id: 3,
      title: "Hydration Hero",
      text: "Why is water the best drink?",
      options: [
        {
          text: "It keeps you hydrated",
          emoji: "💧",
          isCorrect: true
        },
        {
          text: "It has lots of sugar",
          emoji: "🥤",
          isCorrect: false
        },
        {
          text: "It makes you sleepy",
          emoji: "😴",
          isCorrect: false
        },
        {
          text: "It's colorful",
          emoji: "🌈",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Spot on! Water keeps your body working perfectly without extra sugar!",
        wrong: "Water is the best because it keeps you hydrated and healthy!"
      }
    },
    {
      id: 4,
      title: "Meal Master",
      text: "What makes a lunch healthy?",
      options: [
        {
          text: "Only eating dessert",
          emoji: "🍰",
          isCorrect: false
        },
        {
          text: "Eating as fast as possible",
          emoji: "⚡",
          isCorrect: false
        },
        {
          text: "A mix of healthy foods",
          emoji: "🍱",
          isCorrect: true
        },
        {
          text: "Skipping meals",
          emoji: "🚫",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great job! A balanced meal with different healthy foods is best!",
        wrong: "A healthy lunch includes a mix of different nutritious foods!"
      }
    },
    {
      id: 5,
      title: "Sharing Star",
      text: "Why share healthy snacks?",
      options: [
        {
          text: "To get rid of them",
          emoji: "🗑️",
          isCorrect: false
        },
        {
          text: "To help friends be healthy",
          emoji: "👥",
          isCorrect: true
        },
        {
          text: "To eat junk food instead",
          emoji: "🍟",
          isCorrect: false
        },
        {
          text: "To show off",
          emoji: "🏆",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Wonderful! Sharing healthy habits helps everyone stay strong!",
        wrong: "Sharing healthy snacks helps your friends make good choices too!"
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
    navigate("/games/health-male/kids");
  };

  const currentQ = questions[currentQuestion];

  return (
    <GameShell
      title="Badge: Healthy Kid"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/growing-taller-story"
      nextGameIdProp="health-male-kids-21"
      gameType="health-male"
      totalLevels={5}
      currentLevel={20}
      showConfetti={gameFinished && score >= 4}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
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
                <h3 className="text-3xl font-bold text-white mb-4">Healthy Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about healthy eating with {score} correct answers out of {questions.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Healthy Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Nutrition Knowledge</h4>
                    <p className="text-white/90 text-sm">
                      You understand the benefits of fruits, vegetables, and proper hydration for staying healthy.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Healthy Habits</h4>
                    <p className="text-white/90 text-sm">
                      You know how to build healthy meals and share good nutrition habits with friends.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Healthy Eating!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {questions.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review healthy eating habits to strengthen your knowledge and earn your badge.
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

export default HealthyKidBadge;

