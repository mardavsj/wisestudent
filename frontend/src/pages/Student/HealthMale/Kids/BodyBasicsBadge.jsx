import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BodyBasicsBadge = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-male-kids-40";

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Organ Teamwork",
      text: "How do body organs work?",
      options: [
        {
          text: "They fight",
          emoji: "🥊",
          isCorrect: false
        },
        {
          text: "They sleep",
          emoji: "😴",
          isCorrect: false
        },
        {
          text: "They work together",
          emoji: "🤝",
          isCorrect: true
        },
        {
          text: "They compete",
          emoji: "🏁",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Correct! All your organs work together like a team!",
        wrong: "Actually, your organs work together to keep you healthy!"
      }
    },
    {
      id: 2,
      title: "Heart Function",
      text: "What does the heart do?",
      options: [
        {
          text: "Digests food",
          emoji: "🍕",
          isCorrect: false
        },
        {
          text: "Pumps blood",
          emoji: "❤️",
          isCorrect: true
        },
        {
          text: "Thinks",
          emoji: "🧠",
          isCorrect: false
        },
        {
          text: "Stores memories",
          emoji: "💾",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "That's right! The heart pumps blood all around your body!",
        wrong: "The heart's main job is to pump blood through your body!"
      }
    },
    {
      id: 3,
      title: "Lung Function",
      text: "What do lungs help us do?",
      options: [
        {
          text: "Eat",
          emoji: "🍽️",
          isCorrect: false
        },
        {
          text: "Walk",
          emoji: "🚶",
          isCorrect: false
        },
        {
          text: "See",
          emoji: "👀",
          isCorrect: false
        },
        {
          text: "Breathe oxygen",
          emoji: "💨",
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Spot on! Lungs help us breathe in fresh oxygen!",
        wrong: "Lungs are the organs that help us breathe oxygen!"
      }
    },
    {
      id: 4,
      title: "Body Respect",
      text: "How should we treat our bodies?",
      options: [
        {
          text: "With respect & privacy",
          emoji: "🛡️",
          isCorrect: true
        },
        {
          text: "Ignore them",
          emoji: "🙈",
          isCorrect: false
        },
        {
          text: "Carelessly",
          emoji: "🗑️",
          isCorrect: false
        },
        {
          text: "Roughly",
          emoji: "⚔️",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great job! Every body deserves respect and privacy!",
        wrong: "It's important to treat our bodies with respect and keep private parts private!"
      }
    },
    {
      id: 5,
      title: "Body Changes",
      text: "Are body changes normal?",
      options: [
        {
          text: "No, they're weird",
          emoji: "👾",
          isCorrect: false
        },
        {
          text: "Only for some",
          emoji: "👥",
          isCorrect: false
        },
        {
          text: "Yes, completely normal",
          emoji: "👍",
          isCorrect: true
        },
        {
          text: "Rarely happen",
          emoji: "❓",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Wonderful! Body changes are a normal part of growing up for everyone!",
        wrong: "Body changes are completely normal and happen to everyone!"
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
      title="Badge: Body Basics"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-male"
      totalLevels={5}
      currentLevel={40}
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
                <h3 className="text-3xl font-bold text-white mb-4">Body Basics Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about body basics with {score} correct answers out of {questions.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Body Basics</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Organ Systems</h4>
                    <p className="text-white/90 text-sm">
                      You understand how different body organs work together to keep you healthy.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Body Awareness</h4>
                    <p className="text-white/90 text-sm">
                      You know how to respect your body and understand that changes are normal.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Your Body!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {questions.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review body basics to strengthen your knowledge and earn your badge.
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

export default BodyBasicsBadge;
