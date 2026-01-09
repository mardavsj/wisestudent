import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getEheKidsGames } from "../../../../pages/Games/GameCategories/EHE/kidGamesData";

const QuizOnLifelongLearning = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-kids-92";
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
      text: "Learning stops when?",
      emoji: "⏱️",
      options: [
        {
          id: "a",
          text: "After school",
          emoji: "🏫",
          isCorrect: false,
          feedback: "Not quite. Learning continues throughout life, not just during formal schooling."
        },
        {
          id: "b",
          text: "Never",
          emoji: "♾️",
          isCorrect: true,
          feedback: "Great! Learning is a lifelong process that continues throughout our entire lives."
        },
        {
          id: "c",
          text: "At age 30",
          emoji: "🎂",
          isCorrect: false,
          feedback: "Not quite. People can learn and grow at any age throughout their lives."
        }
      ],
      feedback: {
        correct: "Learning is a lifelong process that continues throughout our entire lives.",
        incorrect: "Learning doesn't stop at any particular point in life - it's a continuous journey."
      }
    },
    {
      id: 2,
      text: "Lifelong learning helps you:",
      emoji: "🎯",
      options: [
        {
          id: "a",
          text: "Adapt to changes in the world",
          emoji: "🔄",
          isCorrect: true,
          feedback: "Great! Lifelong learning helps us adapt to changes in technology, society, and our careers."
        },
        {
          id: "b",
          text: "Stay stuck in old ways",
          emoji: "🛑",
          isCorrect: false,
          feedback: "Not quite. Lifelong learning helps us grow and adapt, not stay stuck."
        },
        {
          id: "c",
          text: "Avoid challenges",
          emoji: "😴",
          isCorrect: false,
          feedback: "Not quite. Lifelong learning actually helps us face challenges better."
        }
      ],
      feedback: {
        correct: "Lifelong learning helps us adapt to changes in technology, society, and our careers.",
        incorrect: "Lifelong learning helps us grow and adapt to an ever-changing world."
      }
    },
    {
      id: 3,
      text: "Which is an example of lifelong learning?",
      emoji: "📚",
      options: [
        {
          id: "a",
          text: "Learning to cook new recipes as an adult",
          emoji: "👨‍🍳",
          isCorrect: true,
          feedback: "Great! Learning new skills like cooking at any age is a perfect example of lifelong learning."
        },
        {
          id: "b",
          text: "Only learning what's taught in school",
          emoji: "📘",
          isCorrect: false,
          feedback: "Not quite. Lifelong learning goes beyond formal schooling to include learning throughout life."
        },
        {
          id: "c",
          text: "Never trying new things",
          emoji: "❌",
          isCorrect: false,
          feedback: "Not quite. Lifelong learning involves actively seeking new knowledge and experiences."
        }
      ],
      feedback: {
        correct: "Learning new skills at any stage of life, like cooking, is an example of lifelong learning.",
        incorrect: "Lifelong learning involves actively seeking new knowledge and experiences throughout life."
      }
    },
    {
      id: 4,
      text: "Why is lifelong learning important for careers?",
      emoji: "💼",
      options: [
        
        {
          id: "b",
          text: "Once you get a job, you don't need to learn more",
          emoji: "🛋️",
          isCorrect: false,
          feedback: "Not quite. Careers require continuous learning as technology and methods evolve."
        },
        {
          id: "c",
          text: "It's not important",
          emoji: "🤔",
          isCorrect: false,
          feedback: "Not quite. Lifelong learning is crucial for career advancement and adaptability."
        },
        {
          id: "a",
          text: "Jobs and skills change over time",
          emoji: "📈",
          isCorrect: true,
          feedback: "Great! Jobs and required skills evolve over time, making continuous learning essential."
        },
      ],
      feedback: {
        correct: "Jobs and required skills constantly evolve, making continuous learning essential for career success.",
        incorrect: "Continuous learning is crucial for career growth and adaptability in a changing job market."
      }
    },
    {
      id: 5,
      text: "How can you practice lifelong learning?",
      emoji: "🌱",
      options: [
        {
          id: "a",
          text: "Read books, take courses, or learn new hobbies",
          emoji: "📖",
          isCorrect: true,
          feedback: "Great! Reading, taking courses, and exploring hobbies are all ways to practice lifelong learning."
        },
        {
          id: "b",
          text: "Avoid new experiences and challenges",
          emoji: "🔒",
          isCorrect: false,
          feedback: "Not quite. Lifelong learning involves embracing new experiences and challenges."
        },
        {
          id: "c",
          text: "Stop learning after graduation",
          emoji: "🏁",
          isCorrect: false,
          feedback: "Not quite. Learning continues throughout life, not just during formal education."
        }
      ],
      feedback: {
        correct: "Reading books, taking courses, and learning new hobbies are all ways to practice lifelong learning.",
        incorrect: "Lifelong learning involves actively seeking new experiences and knowledge throughout life."
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
      title="Quiz on Lifelong Learning"
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
    
      nextGamePathProp="/student/ehe/kids/reflex-learning-basics"
      nextGameIdProp="ehe-kids-93">
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

export default QuizOnLifelongLearning;