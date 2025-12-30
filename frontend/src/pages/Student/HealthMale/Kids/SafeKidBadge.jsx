import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SafeKidBadge = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-male-kids-90";

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
  {
    id: 1,
    title: "Clear Boundaries",
    text: "You are playing outside when someone asks you to do something that feels unsafe. What action earns a Safe Kid badge?",
    options: [
      {
        text: "Laugh and change the topic",
        emoji: "😅",
        isCorrect: false
      },
      {
        text: "Stay quiet and hope it stops",
        emoji: "🤐",
        isCorrect: false
      },
      {
        text: "Walk away without saying anything",
        emoji: "🚶",
        isCorrect: false
      },
      {
        text: "Firmly refuse and step back",
        emoji: "✋",
        isCorrect: true
      }
    ],
    feedback: {
      correct: "Yes! Clear actions and words show confidence and safety.",
      wrong: "Staying safe means clearly setting boundaries."
    }
  },
  {
    id: 2,
    title: "Daily Choices",
    text: "Before school, you choose how to start your day. Which choice shows care for your body?",
    options: [
      {
        text: "Eat a healthy meal and drink water",
        emoji: "🍎",
        isCorrect: true
      },
      {
        text: "Skip breakfast completely",
        emoji: "⏩",
        isCorrect: false
      },
      {
        text: "Only eat sweets",
        emoji: "🍬",
        isCorrect: false
      },
      {
        text: "Try something meant for adults",
        emoji: "🚫",
        isCorrect: false
      }
    ],
    feedback: {
      correct: "Correct! Healthy habits help you stay active and focused.",
      wrong: "Your body needs good fuel to stay strong."
    }
  },
  {
    id: 3,
    title: "Peer Pressure Moment",
    text: "At school, friends keep pushing you to join an activity you don’t feel good about. What shows real strength?",
    options: [
      {
        text: "Join so they stop asking",
        emoji: "👥",
        isCorrect: false
      },
      {
        text: "Argue loudly",
        emoji: "🗯️",
        isCorrect: false
      },
      {
        text: "Pretend you didn’t hear them",
        emoji: "🙉",
        isCorrect: false
      },
      {
        text: "Leave the situation and talk to an adult",
        emoji: "🧑‍🏫",
        isCorrect: true
      }
    ],
    feedback: {
      correct: "Exactly! Safe kids know when to step away and ask for help.",
      wrong: "Giving in to pressure is never the safest option."
    }
  },
  {
    id: 4,
    title: "Medicine Awareness",
    text: "You are feeling unwell and find medicine at home. What action shows responsibility?",
    options: [
      {
        text: "Ask a parent or doctor first",
        emoji: "👨‍⚕️",
        isCorrect: true
      },
      {
        text: "Take it because it looks familiar",
        emoji: "💊",
        isCorrect: false
      },
      {
        text: "Ask a friend what to do",
        emoji: "👦",
        isCorrect: false
      },
      {
        text: "Ignore the instructions",
        emoji: "📄",
        isCorrect: false
      }
    ],
    feedback: {
      correct: "Right! Medicine is safe only when given by trusted adults.",
      wrong: "Medicine should never be taken without guidance."
    }
  },
  {
    id: 5,
    title: "Safe Kid Mindset",
    text: "You are given a chance to earn a Safe Kid badge. Which behavior truly shows you deserve it?",
    options: [
      {
        text: "Following whatever others do",
        emoji: "👣",
        isCorrect: false
      },
      {
        text: "Taking risks for fun",
        emoji: "🎢",
        isCorrect: false
      },
      {
        text: "Thinking before you act",
        emoji: "🧠",
        isCorrect: true
      },
      {
        text: "Keeping unsafe secrets",
        emoji: "🤫",
        isCorrect: false
      }
    ],
    feedback: {
      correct: "Perfect! Thinking first is what makes a Safe Kid.",
      wrong: "Safety starts with smart decisions."
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
      title="Safe Kid Badge"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-male"
      totalLevels={5}
      currentLevel={90}
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
                <h3 className="text-3xl font-bold text-white mb-4">Safe Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about staying safe with {score} correct answers out of {questions.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Safe Kid Expert</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Safety Awareness</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to recognize and respond to unsafe situations appropriately.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Decision Making</h4>
                    <p className="text-white/90 text-sm">
                      You know how to make smart choices that protect your health and wellbeing.
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
                  Review safety strategies to strengthen your knowledge and earn your badge.
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

export default SafeKidBadge;
