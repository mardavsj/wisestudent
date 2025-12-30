import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SafetySmartKidBadge = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-male-kids-80";

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Fire Safety Expert",
      text: "What is the safest way to escape if there's a fire in your home?",
      options: [
        {
          text: "Take your time to collect your toys",
          emoji: "🧸",
          isCorrect: false
        },
        {
          text: "Crawl low under smoke and feel doors for heat",
          emoji: "💨",
          isCorrect: true
        },
        {
          text: "Hide in a closet until help arrives",
          emoji: "🚪",
          isCorrect: false
        },
        {
          text: "Use the elevator to go downstairs quickly",
          emoji: "⬆️",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Correct! Crawl low under smoke and feel doors with the back of your hand. If hot, find another exit.",
        wrong: "In a fire, never hide or use elevators. Crawl low under smoke and feel doors for heat before opening."
      }
    },
    {
      id: 2,
      title: "Stranger Safety",
      text: "A stranger approaches and says your parents sent them to pick you up. What should you do?",
      options: [
        {
          text: "Go with them immediately",
          emoji: "🚗",
          isCorrect: false
        },
        {
          text: "Ask to see their ID",
          emoji: "🆔",
          isCorrect: false
        },
        {
          text: "Refuse and find a trusted adult",
          emoji: "👤",
          isCorrect: true
        },
        {
          text: "Get in their car to call your parents",
          emoji: "📱",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great job! Never go with strangers, even if they claim your parents sent them. Find a trusted adult.",
        wrong: "Never go anywhere with strangers, even if they say your parents sent them. Always check with a trusted adult first."
      }
    },
    {
      id: 3,
      title: "Water Safety",
      text: "Why is it important to have a buddy when swimming?",
      options: [
        {
          text: "So you can play games together",
          emoji: "🎮",
          isCorrect: false
        },
        {
          text: "To make sure someone can help or get help if needed",
          emoji: "🤝",
          isCorrect: true
        },
        {
          text: "To have someone watch your belongings",
          emoji: "🎒",
          isCorrect: false
        },
        {
          text: "To race each other in the water",
          emoji: "🏁",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Having a buddy means if one person needs help, the other can provide assistance or get an adult.",
        wrong: "The buddy system is important in water because if one person gets into trouble, the other can help or get help."
      }
    },
    {
      id: 4,
      title: "Poison Safety",
      text: "If you accidentally swallow something that might be poisonous, what is the FIRST thing you should do?",
      options: [
        {
          text: "Drink lots of water to dilute it",
          emoji: "🚰",
          isCorrect: false
        },
        {
          text: "Induce vomiting immediately",
          emoji: "🤢",
          isCorrect: false
        },
        
        {
          text: "Wait to see if you feel sick",
          emoji: "😴",
          isCorrect: false
        },
        {
          text: "Tell an adult or call poison control right away",
          emoji: "📞",
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Excellent! Always tell an adult or call poison control immediately. Do not try to treat it yourself.",
        wrong: "If you swallow something poisonous, tell an adult or call poison control immediately. Do not wait or try to treat it yourself."
      }
    },
    {
      id: 5,
      title: "Emergency Preparedness",
      text: "What should be included in a family emergency plan?",
      options: [
        {
          text: "Favorite snacks for the kids",
          emoji: "🍪",
          isCorrect: false
        },
        
        {
          text: "Where to go shopping after",
          emoji: "🛍️",
          isCorrect: false
        },
        {
          text: "Meeting place and emergency contact information",
          emoji: "📍",
          isCorrect: true
        },
        {
          text: "What games to play during the emergency",
          emoji: "🎮",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Right! A family emergency plan should include meeting places and emergency contact information for all family members.",
        wrong: "An emergency plan should include meeting places, emergency contacts, and escape routes - not snacks or games."
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
      title="Safety Smart Kid Badge"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-male"
      totalLevels={5}
      currentLevel={80}
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
                <h3 className="text-3xl font-bold text-white mb-4">Safety Smart Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about staying safe with {score} correct answers out of {questions.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Safety Smart Kid</p>
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

export default SafetySmartKidBadge;
