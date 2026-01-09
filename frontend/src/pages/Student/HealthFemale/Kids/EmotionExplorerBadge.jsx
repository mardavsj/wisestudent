import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EmotionExplorerBadge = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-60";

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Feelings Friend",
      text: "To earn the 'Feelings Friend' badge, what should you do?",
      options: [
        {
          text: "Make fun of crying friends",
          emoji: "🤣",
          isCorrect: false
        },
        {
          text: "Help a friend feel better",
          emoji: "🤗",
          isCorrect: true
        },
        {
          text: "Ignore everyone",
          emoji: "🤐",
          isCorrect: false
        },
        {
          text: "Tell secrets about friends",
          emoji: "🤫",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Helping friends feel better shows empathy and kindness!",
        wrong: "Being supportive when friends are upset helps build strong relationships."
      }
    },
    {
      id: 2,
      title: "Calm Master",
      text: "The 'Calm Master' badge is for managing your emotions. How do you stay calm?",
      options: [
        {
          text: "Take deep breaths when angry",
          emoji: "🧘‍♀️",
          isCorrect: true
        },
        {
          text: "Throwing fits",
          emoji: "😡",
          isCorrect: false
        },
        {
          text: "Slapping",
          emoji: "👋",
          isCorrect: false
        },
        {
          text: "Shouting loudly",
          emoji: "📢",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Taking deep breaths helps you stay calm and think clearly!",
        wrong: "Deep breathing activates your body's relaxation response and helps you regain control."
      }
    },
    {
      id: 3,
      title: "Happy Heart",
      text: "How to get the 'Happy Heart' badge?",
      options: [
        {
          text: "Be grumpy all day",
          emoji: "😒",
          isCorrect: false
        },
        {
          text: "Find joy in little things",
          emoji: "🌻",
          isCorrect: true
        },
        {
          text: "Complain",
          emoji: "🗣️",
          isCorrect: false
        },
        {
          text: "Argue with everyone",
          emoji: "😤",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great job! Finding joy in small moments leads to lasting happiness!",
        wrong: "Gratitude and mindfulness help us appreciate positive experiences in our daily lives."
      }
    },
    {
      id: 4,
      title: "Brave Talker",
      text: "The 'Brave Talker' badge is valid if you...",
      options: [
        {
          text: "Share your feelings with parents",
          emoji: "👨‍👩‍👧",
          isCorrect: true
        },
        {
          text: "Never speak",
          emoji: "😶",
          isCorrect: false
        },
        {
          text: "Only whisper to pets",
          emoji: "🐕",
          isCorrect: false
        },
        {
          text: "Talk behind others' backs",
          emoji: "👥",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Absolutely right! Sharing your feelings with trusted adults takes courage!",
        wrong: "Open communication with family members builds trust and helps solve problems together."
      }
    },
    {
      id: 5,
      title: "Emotion Explorer",
      text: "Exploring emotions means...",
      options: [
        {
          text: "Learning about how you feel",
          emoji: "🧠",
          isCorrect: true
        },
        {
          text: "Exploring a cave",
          emoji: "🔦",
          isCorrect: false
        },
        {
          text: "Running fast",
          emoji: "🏃‍♀️",
          isCorrect: false
        },
        {
          text: "Hiding your feelings",
          emoji: "🎭",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Understanding your emotions helps you manage them better!",
        wrong: "Emotional intelligence involves recognizing, understanding, and appropriately expressing your feelings."
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
      title="Badge: Emotion Explorer"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={60}
      showConfetti={gameFinished && score >= 4}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/health-female/kids/friends-dare-story"
      nextGameIdProp="health-female-kids-61">
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
                <h3 className="text-3xl font-bold text-white mb-4">Emotion Explorer Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent emotional intelligence with {score} correct answers out of {questions.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Emotion Explorer</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Emotional Awareness</h4>
                    <p className="text-white/90 text-sm">
                      You understand the importance of recognizing and managing emotions.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Social Skills</h4>
                    <p className="text-white/90 text-sm">
                      You know how to support friends and communicate your feelings.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Emotions!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {questions.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review emotional intelligence concepts to strengthen your knowledge and earn your badge.
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

export default EmotionExplorerBadge;