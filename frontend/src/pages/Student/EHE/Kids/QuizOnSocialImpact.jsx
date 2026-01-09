import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getEheKidsGames } from "../../../../pages/Games/GameCategories/EHE/kidGamesData";

const QuizOnSocialImpact = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-kids-82";
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
      text: "Social entrepreneurship means?",
      emoji: "🤝",
      options: [
        {
          id: "a",
          text: "Helping society + business",
          emoji: "🏢",
          isCorrect: true,
          feedback: "Great! Social entrepreneurship combines business practices with social impact."
        },
        {
          id: "b",
          text: "Only money",
          emoji: "💰",
          isCorrect: false,
          feedback: "Not quite. While financial sustainability is important, social impact is the primary goal."
        },
        {
          id: "c",
          text: "Ignoring community needs",
          emoji: "🚫",
          isCorrect: false,
          feedback: "Not quite. Social entrepreneurship specifically focuses on addressing community needs."
        }
      ],
      feedback: {
        correct: "Social entrepreneurship combines business strategies with creating positive social impact.",
        incorrect: "Social entrepreneurship focuses on creating positive change while maintaining business sustainability."
      }
    },
    {
      id: 2,
      text: "What is a social enterprise?",
      emoji: "🌱",
      options: [
       
        {
          id: "b",
          text: "Only charity organization",
          emoji: "💝",
          isCorrect: false,
          feedback: "Not quite. Social enterprises are businesses that aim to solve social problems."
        },
         {
          id: "a",
          text: "Business that solves social problems",
          emoji: "💼",
          isCorrect: true,
          feedback: "Great! Social enterprises are businesses that focus on solving social problems."
        },
        {
          id: "c",
          text: "Government agency",
          emoji: "🏛️",
          isCorrect: false,
          feedback: "Not quite. Social enterprises are typically private organizations, not government entities."
        }
      ],
      feedback: {
        correct: "A social enterprise is a business that aims to solve social problems while being financially sustainable.",
        incorrect: "Social enterprises are businesses with a primary mission of creating social impact."
      }
    },
    {
      id: 3,
      text: "What is social impact?",
      emoji: "🌟",
      options: [
       
        {
          id: "b",
          text: "Only financial profit",
          emoji: "📈",
          isCorrect: false,
          feedback: "Not quite. Financial profit is a business measure, not social impact."
        },
        {
          id: "c",
          text: "Negative consequences",
          emoji: "⚠️",
          isCorrect: false,
          feedback: "Not quite. Social impact refers to positive effects on society, not negative ones."
        },
         {
          id: "a",
          text: "Positive effect on society",
          emoji: "✨",
          isCorrect: true,
          feedback: "Great! Social impact refers to positive effects on society and communities."
        },
      ],
      feedback: {
        correct: "Social impact refers to positive changes that benefit society and communities.",
        incorrect: "Social impact is the positive change created by actions or programs on society."
      }
    },
    {
      id: 4,
      text: "What do social entrepreneurs focus on?",
      emoji: "🎯",
      options: [
        
        {
          id: "b",
          text: "Only personal gain",
          emoji: "👤",
          isCorrect: false,
          feedback: "Not quite. Social entrepreneurs prioritize community benefit over personal gain."
        },
        {
          id: "c",
          text: "Copying others",
          emoji: "📋",
          isCorrect: false,
          feedback: "Not quite. Social entrepreneurs innovate to address social challenges."
        },
        {
          id: "a",
          text: "Solving social problems",
          emoji: "🔧",
          isCorrect: true,
          feedback: "Great! Social entrepreneurs focus on solving social problems through innovative solutions."
        },
      ],
      feedback: {
        correct: "Social entrepreneurs focus on solving social problems and creating positive change.",
        incorrect: "Social entrepreneurs prioritize addressing social challenges over personal gain."
      }
    },
    {
      id: 5,
      text: "Why is social entrepreneurship important?",
      emoji: "♻️",
      options: [
        {
          id: "a",
          text: "Creates sustainable solutions",
          emoji: "🌍",
          isCorrect: true,
          feedback: "Great! Social entrepreneurship creates sustainable solutions to social problems."
        },
        {
          id: "b",
          text: "Only creates jobs",
          emoji: "💼",
          isCorrect: false,
          feedback: "Not quite. While it creates jobs, the primary benefit is solving social problems."
        },
        {
          id: "c",
          text: "Has no benefits",
          emoji: "❌",
          isCorrect: false,
          feedback: "Not quite. Social entrepreneurship creates significant positive benefits for society."
        }
      ],
      feedback: {
        correct: "Social entrepreneurship is important because it creates sustainable solutions to social problems.",
        incorrect: "Social entrepreneurship addresses social challenges through sustainable, business-based approaches."
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
      title="Quiz on Social Impact"
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
    
      nextGamePathProp="/student/ehe/kids/reflex-social-basics"
      nextGameIdProp="ehe-kids-83">
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

export default QuizOnSocialImpact;