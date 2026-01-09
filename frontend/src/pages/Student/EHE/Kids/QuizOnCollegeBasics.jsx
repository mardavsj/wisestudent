import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getEheKidsGames } from "../../../../pages/Games/GameCategories/EHE/kidGamesData";

const QuizOnCollegeBasics = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-kids-62";
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
      text: "What is a university?",
      emoji: "🏫",
      options: [
        {
          id: "a",
          text: "Place for higher studies",
          emoji: "🎓",
          isCorrect: true,
          feedback: "Great! Universities are institutions for higher education and research."
        },
        {
          id: "b",
          text: "Playground",
          emoji: "🛝",
          isCorrect: false,
          feedback: "Not quite. A playground is for recreation, not for higher education."
        },
        {
          id: "c",
          text: "Shopping mall",
          emoji: "🛍️",
          isCorrect: false,
          feedback: "Not quite. Shopping malls are for retail, not for higher education."
        }
      ],
      feedback: {
        correct: "Universities are institutions that provide higher education and conduct research.",
        incorrect: "Universities are institutions dedicated to higher education and academic research."
      }
    },
    {
      id: 2,
      text: "What do students do in college?",
      emoji: "📚",
      options: [
        
        {
          id: "b",
          text: "Only play games",
          emoji: "🎮",
          isCorrect: false,
          feedback: "Not quite. While recreation is part of college life, studying is the primary focus."
        },
        {
          id: "a",
          text: "Study specialized subjects",
          emoji: "📖",
          isCorrect: true,
          feedback: "Great! College students study specialized subjects in their chosen fields."
        },
        {
          id: "c",
          text: "Sleep all day",
          emoji: "😴",
          isCorrect: false,
          feedback: "Not quite. While rest is important, college involves active learning and study."
        }
      ],
      feedback: {
        correct: "College students focus on studying specialized subjects in their chosen fields of study.",
        incorrect: "College is primarily about academic learning, though it also includes other experiences."
      }
    },
    {
      id: 3,
      text: "Why do people go to college?",
      emoji: "🤔",
      options: [
        
        {
          id: "b",
          text: "To avoid working",
          emoji: "🛌",
          isCorrect: false,
          feedback: "Not quite. College typically prepares people for better career opportunities."
        },
        {
          id: "c",
          text: "Just for parties",
          emoji: "🎉",
          isCorrect: false,
          feedback: "Not quite. While social life is part of college, the main purpose is education."
        },
        {
          id: "a",
          text: "To gain knowledge and skills",
          emoji: "🧠",
          isCorrect: true,
          feedback: "Great! People go to college to gain knowledge, develop skills, and advance their careers."
        },
      ],
      feedback: {
        correct: "People go to college to gain knowledge, develop skills, and improve career prospects.",
        incorrect: "College provides opportunities to gain knowledge, skills, and qualifications for careers."
      }
    },
    {
      id: 4,
      text: "What can you study in college?",
      emoji: "📖",
      options: [
        {
          id: "a",
          text: "Science, Arts, Commerce",
          emoji: "🔬",
          isCorrect: true,
          feedback: "Great! College offers diverse fields of study including Science, Arts, Commerce, and many more."
        },
        {
          id: "b",
          text: "Only sports",
          emoji: "⚽",
          isCorrect: false,
          feedback: "Not quite. While sports programs exist, colleges offer many other academic disciplines too."
        },
        {
          id: "c",
          text: "Nothing useful",
          emoji: "❌",
          isCorrect: false,
          feedback: "Not quite. College offers many valuable and useful fields of study."
        }
      ],
      feedback: {
        correct: "Colleges offer diverse academic programs across science, arts, commerce, and many other fields.",
        incorrect: "College provides numerous academic disciplines and professional programs to choose from."
      }
    },
    {
      id: 5,
      text: "What is the benefit of college education?",
      emoji: "💼",
      options: [
        
        {
          id: "b",
          text: "Free money",
          emoji: "💸",
          isCorrect: false,
          feedback: "Not quite. College requires investment and doesn't guarantee free money."
        },
        {
          id: "a",
          text: "Better career opportunities",
          emoji: "🌟",
          isCorrect: true,
          feedback: "Great! College education often leads to better career prospects and opportunities."
        },
        {
          id: "c",
          text: "No benefits",
          emoji: "🚫",
          isCorrect: false,
          feedback: "Not quite. College education provides many benefits including knowledge and career prospects."
        }
      ],
      feedback: {
        correct: "College education typically leads to better career opportunities and higher earning potential.",
        incorrect: "College education provides valuable knowledge, skills, and often better career prospects."
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
      title="Quiz on College Basics"
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
    
      nextGamePathProp="/student/ehe/kids/reflex-college-awareness"
      nextGameIdProp="ehe-kids-63">
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

export default QuizOnCollegeBasics;