import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CleanKidBadge = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-male-kids-10";

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Hand Washing",
      text: "You just came back from playing outside. What should you do before eating your snack?",
      options: [
       
        {
          text: "Just wipe hands on pants",
          emoji: "👖",
          isCorrect: false
        },
        {
          text: "Use hand sanitizer only",
          emoji: "🧴",
          isCorrect: false
        },
        {
          text: "Nothing, hands are clean enough",
          emoji: "✋",
          isCorrect: false
        },
         {
          text: "Wash hands with soap for 20 seconds",
          emoji: "🧼",
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Excellent! Washing hands with soap for 20 seconds removes germs and keeps you healthy!",
        wrong: "You need to properly wash your hands with soap for 20 seconds to remove germs and dirt!"
      }
    },
    {
      id: 2,
      title: "Tooth Care",
      text: "Tommy has white spots on his teeth and his breath smells bad. What habit should he start?",
      options: [
        {
          text: "Brush teeth twice daily and floss",
          emoji: "🦷",
          isCorrect: true
        },
        {
          text: "Only brush teeth when they hurt",
          emoji: "😖",
          isCorrect: false
        },
        {
          text: "Eat more candy to cover bad breath",
          emoji: "🍬",
          isCorrect: false
        },
        {
          text: "Rinse mouth with water only",
          emoji: "💧",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Brushing teeth twice daily and flossing prevents tooth decay and bad breath!",
        wrong: "Regular brushing and flossing are needed to keep teeth healthy and breath fresh!"
      }
    },
    {
      id: 3,
      title: "Hair Care",
      text: "Why should you wash your hair regularly?",
      options: [
        
        {
          text: "To make hair grow faster",
          emoji: "💇",
          isCorrect: false
        },
        {
          text: "To change hair color",
          emoji: "🌈",
          isCorrect: false
        },
        {
          text: "To remove oil, dirt and keep scalp healthy",
          emoji: "🧴",
          isCorrect: true
        },
        {
          text: "To make hair softer only",
          emoji: "💇",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Amazing! Washing hair removes oil and dirt, keeping your scalp healthy!",
        wrong: "Hair washing primarily removes oil, dirt, and dead skin cells to keep your scalp healthy!"
      }
    },
    {
      id: 4,
      title: "Nail Hygiene",
      text: "Sarah has long, dirty fingernails. What should she do to stay healthy?",
      options: [
        {
          text: "Keep nails short and clean",
          emoji: "✂️",
          isCorrect: true
        },
        {
          text: "Paint nails to hide the dirt",
          emoji: "💅",
          isCorrect: false
        },
        {
          text: "Leave them long for style",
          emoji: "✋",
          isCorrect: false
        },
        {
          text: "Bite the nails to clean them",
          emoji: "🦷",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great! Keeping nails short and clean prevents germs and bacteria from hiding under them!",
        wrong: "Nails should be kept short and clean to prevent germs and bacteria from hiding underneath!"
      }
    },
    {
      id: 5,
      title: "Deodorant Use",
      text: "After playing sports, you feel sweaty and smell bad. What should you do?",
      options: [
       
        {
          text: "Just change shirt and use perfume",
          emoji: "👕",
          isCorrect: false
        },
         {
          text: "Take a shower and use deodorant if needed",
          emoji: "🚿",
          isCorrect: true
        },
        {
          text: "Nothing, sweating is normal",
          emoji: "😅",
          isCorrect: false
        },
        {
          text: "Wipe with a towel only",
          emoji: "🧽",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Wonderful! Showering after sweating removes bacteria and using deodorant keeps you fresh!",
        wrong: "After sweating, you should shower to remove bacteria and possibly use deodorant to stay fresh!"
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
      title="Badge: Clean Kid"
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
                <h3 className="text-3xl font-bold text-white mb-4">Clean Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about personal hygiene with {score} correct answers out of {questions.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Clean Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Hygiene Habits</h4>
                    <p className="text-white/90 text-sm">
                      You understand the importance of hand washing, bathing, and dental care for staying healthy.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Confidence Boost</h4>
                    <p className="text-white/90 text-sm">
                      You know that good hygiene makes you feel fresh, happy, and confident.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Personal Hygiene!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {questions.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review personal hygiene practices to strengthen your knowledge and earn your badge.
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

export default CleanKidBadge;
