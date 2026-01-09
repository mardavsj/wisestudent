import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PeerPressureFighterBadge = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-male-kids-70";

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Homework First",
      text: "Friends want you to skip homework to play. What do you do?",
      options: [
        {
          text: "Skip homework and play",
          emoji: "🎮",
          isCorrect: false
        },
        {
          text: "Lie that you finished it",
          emoji: "🤥",
          isCorrect: false
        },
        {
          text: "Say no and do homework first",
          emoji: "📚",
          isCorrect: true
        },
        {
          text: "Blame someone else",
          emoji: "😤",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great job! School work comes before fun. You made the responsible choice!",
        wrong: "It's important to finish your responsibilities like homework before playing!"
      }
    },
    {
      id: 2,
      title: "Safe Choices",
      text: "Someone dares you to do something dangerous. What's your move?",
      options: [
        {
          text: "Refuse the dangerous dare",
          emoji: "✋",
          isCorrect: true
        },
        {
          text: "Do it to look cool",
          emoji: "😎",
          isCorrect: false
        },
        {
          text: "Ask someone else to do it",
          emoji: "👥",
          isCorrect: false
        },
        
        {
          text: "Record it for social media",
          emoji: "📱",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Excellent! Your safety is much more important than any dare!",
        wrong: "Never accept a dare that could hurt you or get you in trouble!"
      }
    },
    {
      id: 3,
      title: "Stand Up",
      text: "You see someone being bullied. How do you help?",
      options: [
        {
          text: "Join in the bullying",
          emoji: "😈",
          isCorrect: false
        },
        {
          text: "Stand up for them or tell an adult",
          emoji: "🦸",
          isCorrect: true
        },
        {
          text: "Ignore it completely",
          emoji: "🙈",
          isCorrect: false
        },
        
        {
          text: "Laugh at the situation",
          emoji: "😂",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "You're a hero! Standing up to bullying takes real courage!",
        wrong: "Bullying is wrong. Helping the person or telling an adult is the right thing to do."
      }
    },
    {
      id: 4,
      title: "Boundaries",
      text: "A friend keeps asking for your personal secrets. What do you say?",
      options: [
        {
          text: "Tell them everything",
          emoji: "💬",
          isCorrect: false
        },
        {
          text: "Make up a lie",
          emoji: "🤥",
          isCorrect: false
        },
        
        {
          text: "Change the subject",
          emoji: "🔀",
          isCorrect: false
        },
        {
          text: "Say 'Please respect my privacy'",
          emoji: "🔒",
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Perfect! Everyone has the right to privacy and boundaries!",
        wrong: "It's okay to keep personal things private. Good friends respect boundaries!"
      }
    },
    {
      id: 5,
      title: "Be Yourself",
      text: "Everyone is wearing a new style you don't like. Do you wear it too?",
      options: [
        {
          text: "Wear it to fit in",
          emoji: "👥",
          isCorrect: false
        },
        {
          text: "Make fun of their clothes",
          emoji: "😆",
          isCorrect: false
        },
        {
          text: "Wear what makes YOU happy",
          emoji: "😊",
          isCorrect: true
        },
        {
          text: "Stay home from school",
          emoji: "🏠",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Wonderful! Being true to yourself is better than just following the crowd!",
        wrong: "You don't have to copy others to be cool. Be proud of your own style!"
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
      title="Peer Pressure Fighter Badge"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/vaccine-story"
      nextGameIdProp="health-male-kids-71"
      gameType="health-male"
      totalLevels={5}
      currentLevel={70}
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
                <h3 className="text-3xl font-bold text-white mb-4">Peer Pressure Fighter Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about handling peer pressure with {score} correct answers out of {questions.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Peer Pressure Fighter</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Decision Making</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to make responsible choices even when friends pressure you to do otherwise.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Social Courage</h4>
                    <p className="text-white/90 text-sm">
                      You know how to stand up for what's right and protect yourself and others from harm.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Peer Pressure!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {questions.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review strategies for handling peer pressure to strengthen your knowledge and earn your badge.
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

export default PeerPressureFighterBadge;