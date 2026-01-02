import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CleanGirlBadge = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-71";

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Lungs Protection",
      text: "To earn the 'Lungs Protector' badge, what should you do?",
      options: [
        {
          text: "Breathe car smoke",
          emoji: "🚗",
          isCorrect: false
        },
        {
          text: "Stay away from cigarette smoke",
          emoji: "🚭",
          isCorrect: true
        },
        {
          text: "Smoke for fun",
          emoji: "🚬",
          isCorrect: false
        },
        {
          text: "Stay indoors always",
          emoji: "🏠",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Staying away from cigarette smoke keeps your lungs healthy!",
        wrong: "Cigarette smoke is harmful to your lungs. Always stay away from it to protect your respiratory health."
      }
    },
    {
      id: 2,
      title: "Healthy Drinks",
      text: "The 'Smart Sipper' badge is for choosing the right drinks. Which is best?",
      options: [
        {
          text: "Drinking only soda",
          emoji: "🥤",
          isCorrect: false
        },
        
        {
          text: "Drinking coffee",
          emoji: "☕",
          isCorrect: false
        },
        {
          text: "Drinking water and milk",
          emoji: "🥛",
          isCorrect: true
        },
        {
          text: "Drinking energy drinks",
          emoji: "⚡",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Water and milk are the healthiest drinks for kids!",
        wrong: "Water and milk provide essential nutrients without excess sugar. They're the best choices for staying hydrated and healthy."
      }
    },
    {
      id: 3,
      title: "Safe Smells",
      text: "How to get the 'Safe Sniffer' badge?",
      options: [
        {
          text: "Smell flowers, stay away from chemicals",
          emoji: "🌸",
          isCorrect: true
        },
        {
          text: "Smell bleach",
          emoji: "👃",
          isCorrect: false
        },
        
        {
          text: "Smell garbage",
          emoji: "🗑️",
          isCorrect: false
        },
        {
          text: "Sniff glue or markers",
          emoji: "🖍️",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great job! Flowers smell wonderful and are safe. Chemicals can be harmful!",
        wrong: "Natural scents like flowers are pleasant and safe. Chemicals and cleaning products can be dangerous if inhaled."
      }
    },
    {
      id: 4,
      title: "Making Safe Choices",
      text: "The 'No Thanks' Hero badge is for saying no to what?",
      options: [
        {
          text: "Taking anything offered",
          emoji: "🎁",
          isCorrect: false
        },
        
        {
          text: "Saying no to vegetables",
          emoji: "🥦",
          isCorrect: false
        },
        {
          text: "Declining help from strangers",
          emoji: "🧍",
          isCorrect: false
        },
        {
          text: "Refusing drugs and alcohol",
          emoji: "✋",
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Absolutely right! Saying no to drugs and alcohol keeps you safe and healthy!",
        wrong: "Drugs and alcohol are harmful, especially for growing bodies. It's brave and smart to say no to these substances."
      }
    },
    {
      id: 5,
      title: "Trusted Support",
      text: "Who helps you stay clean and safe?",
      options: [
        {
          text: "Strangers",
          emoji: "👤",
          isCorrect: false
        },
        {
          text: "Parents and teachers",
          emoji: "🏫",
          isCorrect: true
        },
        {
          text: "Video games",
          emoji: "🎮",
          isCorrect: false
        },
        {
          text: "Older siblings only",
          emoji: "👨‍👩‍👧‍👦",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Parents and teachers care about your safety and can guide you well!",
        wrong: "Trusted adults like parents, teachers, and family members are there to help keep you safe and teach you good habits."
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
      title="Badge: Clean Girl"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={79}
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
                <h3 className="text-3xl font-bold text-white mb-4">Clean Girl Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about staying clean and safe with {score} correct answers out of {questions.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Clean Girl</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Safety Awareness</h4>
                    <p className="text-white/90 text-sm">
                      You know how to protect yourself from harmful substances.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Healthy Habits</h4>
                    <p className="text-white/90 text-sm">
                      You understand the importance of making healthy choices.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Safety!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {questions.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review safety concepts to strengthen your knowledge and earn your badge.
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

export default CleanGirlBadge;