import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PubertySmartTeenBadge = () => {
  const navigate = useNavigate();
  
  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-male-teen-30";

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
  {
    id: 1,
    title: "Brain Development",
    text: "Why do teens sometimes take more risks during puberty?",
    options: [
      {
        text: "Peer pressure only",
        emoji: "👥",
        isCorrect: false
      },
      {
        text: "Brain reward system matures earlier than control system",
        emoji: "🧠",
        isCorrect: true
      },
      {
        text: "They don’t understand danger",
        emoji: "⚠️",
        isCorrect: false
      },
      {
        text: "Too much energy",
        emoji: "⚡",
        isCorrect: false
      }
    ],
    feedback: {
      correct: "Correct! The emotional/reward part develops before decision-making control.",
      wrong: "Risk-taking is linked to brain development timing, not lack of intelligence."
    }
  },
  {
    id: 2,
    title: "Growth Timing",
    text: "Why do teens grow at different speeds during puberty?",
    options: [
      {
        text: "Luck",
        emoji: "🎲",
        isCorrect: false
      },
      
      {
        text: "Exercise only",
        emoji: "🏋️",
        isCorrect: false
      },
      {
        text: "Eating more food",
        emoji: "🍽️",
        isCorrect: false
      },
      {
        text: "Genes and hormone timing",
        emoji: "🧬",
        isCorrect: true
      },
    ],
    feedback: {
      correct: "Exactly! Genetics and hormone release timing control growth patterns.",
      wrong: "Growth speed isn’t something you can fully control."
    }
  },
  {
    id: 3,
    title: "Sleep Science",
    text: "Why do teens feel sleepy later at night?",
    options: [
       {
        text: "Melatonin release shifts later",
        emoji: "🌙",
        isCorrect: true
      },
      {
        text: "Too much phone use",
        emoji: "📱",
        isCorrect: false
      },
     
      {
        text: "They are lazy",
        emoji: "😴",
        isCorrect: false
      },
      {
        text: "School stress",
        emoji: "📚",
        isCorrect: false
      }
    ],
    feedback: {
      correct: "Correct! Puberty shifts the body’s sleep hormone timing.",
      wrong: "This is a biological change, not bad habits alone."
    }
  },
  {
    id: 4,
    title: "Skin Changes",
    text: "Why does skin become oilier during puberty?",
    options: [
      {
        text: "Dirty skin",
        emoji: "🧽",
        isCorrect: false
      },
      
      {
        text: "Sweating more",
        emoji: "💦",
        isCorrect: false
      },
      {
        text: "Oil glands grow under hormone influence",
        emoji: "🧪",
        isCorrect: true
      },
      {
        text: "Using wrong soap",
        emoji: "🧼",
        isCorrect: false
      }
    ],
    feedback: {
      correct: "Right! Hormones activate oil glands beneath the skin.",
      wrong: "Oil production is internal, not just surface hygiene."
    }
  },
  {
    id: 5,
    title: "Emotional Awareness",
    text: "What skill best helps teens handle strong emotions during puberty?",
    options: [
      {
        text: "Ignoring feelings",
        emoji: "🙈",
        isCorrect: false
      },
      {
        text: "Emotional regulation",
        emoji: "🧘",
        isCorrect: true
      },
      {
        text: "Avoiding people",
        emoji: "🚪",
        isCorrect: false
      },
      {
        text: "Keeping everything secret",
        emoji: "🤐",
        isCorrect: false
      }
    ],
    feedback: {
      correct: "Yes! Learning to understand and manage emotions is a key life skill.",
      wrong: "Suppressing emotions can make things harder."
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
    navigate("/student/health-male/teens/puberty-health-story-teen");
  };

  const currentQ = questions[currentQuestion];

  return (
    <GameShell
      title="Puberty Smart Teen Badge"
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
                <div className="text-6xl mb-4">🏅</div>
                <h3 className="text-3xl font-bold text-white mb-4">Puberty Smart Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about puberty with {score} correct answers out of {questions.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Puberty Expert</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Body Changes</h4>
                    <p className="text-white/90 text-sm">
                      You understand the physical changes that occur during puberty and how to manage them.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Emotional Health</h4>
                    <p className="text-white/90 text-sm">
                      You recognize that mood swings are normal and know strategies for emotional well-being.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Puberty!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {questions.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review puberty topics to strengthen your knowledge and earn your badge.
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

export default PubertySmartTeenBadge;
