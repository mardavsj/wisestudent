import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getEheKidsGames } from "../../../../pages/Games/GameCategories/EHE/kidGamesData";

const QuizOnMoneyUse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-kids-22";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getEheKidsGames({});
      const currentGame = games.find(g => g.id === gameId);
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : "/games/ehe/kids",
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return { nextGamePath: "/games/ehe/kids", nextGameId: null };
  }, [location.state, gameId]);
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "What do we use money for?",
      emoji: "💰",
      options: [
        {
          id: "a",
          text: "Buying needs",
          emoji: "🛒",
          isCorrect: true,
          feedback: "Great job! We use money to buy things we need like food, clothes, and shelter."
        },
        {
          id: "b",
          text: "Playing only",
          emoji: "🎮",
          isCorrect: false,
          feedback: "Not quite. While we can use money for entertainment, it's not the main purpose of money."
        },
        {
          id: "c",
          text: "Collecting rocks",
          emoji: "🪨",
          isCorrect: false,
          feedback: "Not quite. Money isn't used for collecting rocks - we use money to buy goods and services."
        }
      ],
      feedback: {
        correct: "Excellent! Money is used to purchase goods and services that we need and want.",
        incorrect: "Remember, money is primarily used to buy goods and services we need and want."
      }
    },
    {
      id: 2,
      text: "Which of these is a need?",
      emoji: " 😊",
      options: [
        {
          id: "c",
          text: "Designer shoes",
          emoji: "👠",
          isCorrect: false,
          feedback: "Not quite. Designer shoes are a want, not a need - we can live without them."
        },
        {
          id: "a",
          text: "Food",
          emoji: "🍎",
          isCorrect: true,
          feedback: "Great job! Food is a basic need that keeps us alive and healthy."
        },
        {
          id: "b",
          text: "Video games",
          emoji: "🎮",
          isCorrect: false,
          feedback: "Not quite. Video games are fun but they're not essential for survival - they're a want."
        }
      ],
      feedback: {
        correct: "Perfect! Food is one of our basic needs, along with shelter and clothing.",
        incorrect: "Think about what is essential for survival - these are our needs."
      }
    },
    {
      id: 3,
      text: "What should you do with money you don't need right now?",
      emoji: "🏦",
      options: [
        {
          id: "a",
          text: "Save it in a bank",
          emoji: "🏦",
          isCorrect: true,
          feedback: "Great job! Saving money in a bank is a smart financial habit that keeps it safe and can earn interest."
        },
        {
          id: "b",
          text: "Spend it all immediately",
          emoji: "💸",
          isCorrect: false,
          feedback: "Not quite. Spending all money right away doesn't prepare for future needs or emergencies."
        },
        {
          id: "c",
          text: "Hide it under your bed",
          emoji: "🛏️",
          isCorrect: false,
          feedback: "Not quite. Hiding money at home isn't safe and it doesn't earn interest like it would in a bank."
        }
      ],
      feedback: {
        correct: "Wonderful! Saving money for future needs is an important financial habit.",
        incorrect: "Consider the safest and most beneficial way to keep money you're not currently using."
      }
    },
    {
      id: 4,
      text: "Why is it important to earn money?",
      emoji: "💼",
      options: [
        {
          id: "c",
          text: "To avoid doing chores",
          emoji: "🧹",
          isCorrect: false,
          feedback: "Not quite. Earning money isn't about avoiding chores - it's about having resources for needs and wants."
        },
        {
          id: "a",
          text: "To buy things we need and want",
          emoji: "🛍️",
          isCorrect: true,
          feedback: "Great job! We earn money to purchase goods and services that we need and want."
        },
        {
          id: "b",
          text: "To brag to friends",
          emoji: "📣",
          isCorrect: false,
          feedback: "Not quite. The main purpose of earning money is to meet our needs and wants, not to impress others."
        }
      ],
      feedback: {
        correct: "Fantastic! Earning money allows us to purchase the things we need and want in life.",
        incorrect: "Think about the main purpose of money - what do we use it for?"
      }
    },
    {
      id: 5,
      text: "What's the difference between a need and a want?",
      emoji: "🤔",
      options: [
        {
          id: "b",
          text: "Wants are more important than needs",
          emoji: "👑",
          isCorrect: false,
          feedback: "Not quite. Needs are more important than wants because they are essential for survival."
        },
        {
          id: "a",
          text: "Needs are essential for survival, wants make life better",
          emoji: "💡",
          isCorrect: true,
          feedback: "Great job! Needs are essential for survival, while wants are things that make life more enjoyable."
        },
        {
          id: "c",
          text: "Needs are expensive, wants are cheap",
          emoji: "🏷️",
          isCorrect: false,
          feedback: "Not quite. The price doesn't determine if something is a need or want - it's about necessity."
        }
      ],
      feedback: {
        correct: "Perfect! Understanding the difference between needs and wants is crucial for smart financial decisions.",
        incorrect: "Remember, needs are things essential for survival while wants are things that make life more comfortable."
      }
    }
  ];

  const handleAnswer = (optionId) => {
    if (answered || levelCompleted) return;
    
    setAnswered(true);
    setSelectedOption(optionId);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const selectedOptionData = currentQuestionData.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOptionData?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setAnswered(false);
        resetFeedback();
      } else {
        setLevelCompleted(true);
      }
    }, isCorrect ? 1000 : 800);
  };

  const currentQuestionData = questions[currentQuestion];
  const finalScore = score;

  return (
    <GameShell
      title="Quiz on Money Use"
      subtitle={levelCompleted ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="ehe"
      showGameOver={levelCompleted}
      maxScore={questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      showConfetti={levelCompleted && finalScore >= 3}
    
      nextGamePathProp="/student/ehe/kids/reflex-money-basics"
      nextGameIdProp="ehe-kids-23">
      <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {!levelCompleted && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {finalScore}/{questions.length}</span>
              </div>
              
              <div className="text-6xl mb-4 text-center">{currentQuestionData.emoji}</div>
              
              <p className="text-white text-lg md:text-xl mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map(option => {
                  const isSelected = selectedOption === option.id;
                  const showCorrect = answered && option.isCorrect;
                  const showIncorrect = answered && isSelected && !option.isCorrect;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      disabled={answered}
                      className={`p-6 rounded-2xl shadow-lg transition-all transform text-center ${
                        showCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : showIncorrect
                          ? "bg-red-500/20 border-2 border-red-400 opacity-75"
                          : isSelected
                          ? "bg-blue-600 border-2 border-blue-300 scale-105"
                          : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                      } ${answered ? "cursor-not-allowed" : ""}`}
                    >
                      <div className="text-2xl mb-2">{option.emoji}</div>
                      <h4 className="font-bold text-base mb-2">{option.text}</h4>
                    </button>
                  );
                })}
              </div>
              
              {answered && (
                <div className={`rounded-lg p-5 mt-6 ${
                  currentQuestionData.options.find(opt => opt.id === selectedOption)?.isCorrect
                    ? "bg-green-500/20 border border-green-500"
                    : "bg-red-500/20 border border-red-500"
                }`}>
                  <p className="text-lg font-semibold text-center">
                    {currentQuestionData.options.find(opt => opt.id === selectedOption)?.isCorrect
                      ? "✅ Correct! "
                      : "❌ Not quite! "}
                  </p>
                  <p className="text-center mt-2">
                    {(() => {
                      const selectedOptionData = currentQuestionData.options.find(opt => opt.id === selectedOption);
                      if (selectedOptionData?.feedback) {
                        return selectedOptionData.feedback;
                      }
                      return selectedOptionData?.isCorrect 
                        ? currentQuestionData.feedback?.correct 
                        : currentQuestionData.feedback?.incorrect;
                    })()}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default QuizOnMoneyUse;