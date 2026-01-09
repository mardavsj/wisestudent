import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GrowingStrongBadge = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-30";

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Strong Body",
      text: "How do you earn the 'Strong Body' badge?",
      options: [
        {
          text: "By eating junk food",
          emoji: "🍔",
          isCorrect: false
        },
        {
          text: "By eating nutritious food",
          emoji: "🥗",
          isCorrect: true
        },
        {
          text: "By skipping meals",
          emoji: "🍽️",
          isCorrect: false
        },
        {
          text: "By eating only sweets",
          emoji: "🍰",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Nutritious food provides the vitamins and minerals your body needs to grow strong!",
        wrong: "A balanced diet with fruits, vegetables, proteins, and whole grains gives your body the nutrients it needs to build strong muscles and bones."
      }
    },
    {
      id: 2,
      title: "Resting Pro",
      text: "What gives you the 'Resting Pro' badge?",
      options: [
        {
          text: "Sleeping 8-10 hours",
          emoji: "🛌",
          isCorrect: true
        },
        {
          text: "Playing games all night",
          emoji: "🎮",
          isCorrect: false
        },
        {
          text: "Napping during class",
          emoji: "😴",
          isCorrect: false
        },
        {
          text: "Staying up late scrolling",
          emoji: "📱",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Getting 8-10 hours of sleep helps your body repair and grow while you rest!",
        wrong: "Quality sleep is essential for growth hormone production and brain development in children."
      }
    },
    {
      id: 3,
      title: "Active Mover",
      text: "What earns you the 'Active Mover' badge?",
      options: [
        {
          text: "Watching TV all day",
          emoji: "📺",
          isCorrect: false
        },
        {
          text: "Running and Playing",
          emoji: "🏃‍♀️",
          isCorrect: true
        },
        {
          text: "Sitting for long periods",
          emoji: "🪑",
          isCorrect: false
        },
        {
          text: "Playing video games only",
          emoji: "🕹️",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great job! Physical activity strengthens your muscles, bones, and heart!",
        wrong: "Regular exercise helps improve coordination, builds strong bones and muscles, and boosts your mood."
      }
    },
    {
      id: 4,
      title: "Hydration Hero",
      text: "How do you get the 'Hydration Hero' badge?",
      options: [
        {
          text: "Drinking plenty of water",
          emoji: "💧",
          isCorrect: true
        },
        {
          text: "Drinking only juice",
          emoji: "🧃",
          isCorrect: false
        },
        {
          text: "Drinking soda regularly",
          emoji: "🥤",
          isCorrect: false
        },
        {
          text: "Waiting until you're thirsty",
          emoji: "🥵",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Absolutely right! Water helps transport nutrients, regulate body temperature, and keep your joints lubricated!",
        wrong: "Water is essential for almost every bodily function. It helps maintain energy levels and supports brain function."
      }
    },
    {
      id: 5,
      title: "Growth Champion",
      text: "What is the ultimate 'Growth Champion' secret?",
      options: [
        {
          text: "Loving yourself",
          emoji: "❤️",
          isCorrect: true
        },
        {
          text: "Comparing to others",
          emoji: "📏",
          isCorrect: false
        },
        {
          text: "Worrying about growth",
          emoji: "😰",
          isCorrect: false
        },
        {
          text: "Skipping doctor visits",
          emoji: "🏥",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Self-love and positive thinking contribute to healthy mental and physical development!",
        wrong: "Self-acceptance and a positive mindset support overall well-being and healthy growth patterns."
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
      title="Badge: Growing Strong"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={30}
      showConfetti={gameFinished && score >= 4}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/health-female/kids/morning-routine-story"
      nextGameIdProp="health-female-kids-31">
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
                <h3 className="text-3xl font-bold text-white mb-4">Growing Strong Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about healthy growth habits with {score} correct answers out of {questions.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Growing Strong</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Healthy Habits</h4>
                    <p className="text-white/90 text-sm">
                      You understand the importance of nutrition, sleep, and exercise for growth.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Wellness Mindset</h4>
                    <p className="text-white/90 text-sm">
                      You know that self-love and positive thinking support healthy development.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Healthy Growth!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {questions.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review healthy growth habits to strengthen your knowledge and earn your badge.
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

export default GrowingStrongBadge;