import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getEheKidsGames } from "../../../../pages/Games/GameCategories/EHE/kidGamesData";

const QuizOnFutureJobs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-kids-72";
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
      text: "Which is a new career?",
      emoji: "🚀",
      options: [
        {
          id: "a",
          text: "AI Engineer",
          emoji: "🤖",
          isCorrect: true,
          feedback: "Great! AI Engineering is a growing field with increasing demand."
        },
        {
          id: "b",
          text: "Dinosaur Hunter",
          emoji: "🦖",
          isCorrect: false,
          feedback: "Not quite. Dinosaurs are extinct, so there are no dinosaur hunters in reality."
        },
        {
          id: "c",
          text: "Telegraph Operator",
          emoji: "📠",
          isCorrect: false,
          feedback: "Not quite. Telegraph operators were common in the past, but this job has become obsolete."
        }
      ],
      feedback: {
        correct: "AI Engineer is an emerging career in artificial intelligence and machine learning.",
        incorrect: "New careers are typically in emerging fields like technology, sustainability, and digital services."
      }
    },
    {
      id: 2,
      text: "What does a Data Scientist do?",
      emoji: "📊",
      options: [
        {
          id: "a",
          text: "Analyze complex data",
          emoji: "📈",
          isCorrect: true,
          feedback: "Great! Data Scientists analyze large datasets to extract meaningful insights."
        },
        {
          id: "b",
          text: "Only play games",
          emoji: "🎮",
          isCorrect: false,
          feedback: "Not quite. Data Scientists work with data analysis, not gaming."
        },
        {
          id: "c",
          text: "Teach dancing",
          emoji: "💃",
          isCorrect: false,
          feedback: "Not quite. That would be a dance instructor, not a Data Scientist."
        }
      ],
      feedback: {
        correct: "Data Scientists analyze complex datasets to find patterns and insights that inform decisions.",
        incorrect: "Data Scientists specialize in extracting insights from large datasets using statistical methods."
      }
    },
    {
      id: 3,
      text: "Which job involves creating digital art?",
      emoji: "🎨",
      options: [
        {
          id: "a",
          text: "Digital Artist",
          emoji: "💻",
          isCorrect: true,
          feedback: "Great! Digital Artists create artwork using digital tools and technology."
        },
        {
          id: "b",
          text: "Traditional Painter",
          emoji: "🖌️",
          isCorrect: false,
          feedback: "Not quite. Traditional painters work with physical materials like canvas and paint."
        },
        {
          id: "c",
          text: "Musician",
          emoji: "🎵",
          isCorrect: false,
          feedback: "Not quite. Musicians create music, not visual art."
        }
      ],
      feedback: {
        correct: "Digital Artists use technology to create visual art, animations, and digital illustrations.",
        incorrect: "Digital art creation requires specialized skills in software and digital tools."
      }
    },
    {
      id: 4,
      text: "What is a Drone Pilot?",
      emoji: "🚁",
      options: [
        
        {
          id: "b",
          text: "Drives buses",
          emoji: "🚌",
          isCorrect: false,
          feedback: "Not quite. Bus drivers operate ground vehicles, not aircraft."
        },
        {
          id: "a",
          text: "Flies unmanned aircraft",
          emoji: "🛩️",
          isCorrect: true,
          feedback: "Great! Drone Pilots operate remote-controlled or autonomous aircraft."
        },
        {
          id: "c",
          text: "Sails boats",
          emoji: "⛵",
          isCorrect: false,
          feedback: "Not quite. Sailors operate water vessels, not aerial vehicles."
        }
      ],
      feedback: {
        correct: "Drone Pilots operate unmanned aerial vehicles for various purposes like photography, delivery, and surveillance.",
        incorrect: "Drone Pilots specialize in operating unmanned aircraft remotely."
      }
    },
    {
      id: 5,
      text: "Which career works with renewable energy?",
      emoji: "⚡",
      options: [
        
        {
          id: "b",
          text: "Coal Miner",
          emoji: "⛏️",
          isCorrect: false,
          feedback: "Not quite. Coal mining is related to fossil fuels, not renewable energy."
        },
        {
          id: "c",
          text: "Oil Driller",
          emoji: "🛢️",
          isCorrect: false,
          feedback: "Not quite. Oil drilling is related to fossil fuels, not renewable energy."
        },
        {
          id: "a",
          text: "Solar Panel Technician",
          emoji: "☀️",
          isCorrect: true,
          feedback: "Great! Solar Panel Technicians install and maintain solar energy systems."
        },
      ],
      feedback: {
        correct: "Solar Panel Technicians work with renewable energy by installing and maintaining solar power systems.",
        incorrect: "Renewable energy careers focus on sustainable energy sources like solar, wind, and hydroelectric power."
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
      title="Quiz on Future Jobs"
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
    
      nextGamePathProp="/student/ehe/kids/reflex-career-basics"
      nextGameIdProp="ehe-kids-73">
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

export default QuizOnFutureJobs;