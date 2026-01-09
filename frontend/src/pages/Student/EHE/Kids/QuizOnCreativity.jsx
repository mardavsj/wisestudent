import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getEheKidsGames } from "../../../../pages/Games/GameCategories/EHE/kidGamesData";

const QuizOnCreativity = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-kids-32";
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
      text: "Which is innovation?",
      emoji: "💡",
      options: [
        {
          id: "a",
          text: "Solving problems in new ways",
          emoji: "🛠️",
          isCorrect: true,
          feedback: "Exactly! Innovation involves finding fresh approaches to challenges."
        },
        {
          id: "b",
          text: "Copying others",
          emoji: "📋",
          isCorrect: false,
          feedback: "Not quite. Copying others is imitation, not innovation."
        },
        {
          id: "c",
          text: "Doing nothing",
          emoji: "😴",
          isCorrect: false,
          feedback: "Not quite. Innovation requires active problem-solving, not inaction."
        }
      ],
      feedback: {
        correct: "Innovation means creating new solutions to problems or improving existing ones.",
        incorrect: "Innovation involves original thinking and creative problem-solving."
      }
    },
    {
      id: 2,
      text: "What helps creativity?",
      emoji: "🎨",
      options: [
        {
          id: "c",
          text: "Being afraid to try",
          emoji: "😨",
          isCorrect: false,
          feedback: "Not quite. Fear blocks creativity by preventing experimentation."
        },
        {
          id: "a",
          text: "Asking 'what if?' questions",
          emoji: "❓",
          isCorrect: true,
          feedback: "Great! 'What if?' questions open up new possibilities and pathways."
        },
        {
          id: "b",
          text: "Following the same routine",
          emoji: "🔁",
          isCorrect: false,
          feedback: "Not quite. Rigid routines limit exposure to new ideas and experiences."
        }
      ],
      feedback: {
        correct: "\"What if?\" questions stimulate imagination and lead to creative breakthroughs.",
        incorrect: "Creativity flourishes when we challenge assumptions and explore possibilities."
      }
    },
    {
      id: 3,
      text: "When you make a mistake in a project, what should you do?",
      emoji: "🔧",
      options: [
        {
          id: "b",
          text: "Give up immediately",
          emoji: "🏳️",
          isCorrect: false,
          feedback: "Not quite. Mistakes are learning opportunities, not reasons to quit."
        },
        {
          id: "c",
          text: "Hide it from others",
          emoji: "🙈",
          isCorrect: false,
          feedback: "Not quite. Sharing mistakes can lead to valuable feedback and support."
        },
        {
          id: "a",
          text: "Learn from it and try a different approach",
          emoji: "📚",
          isCorrect: true,
          feedback: "Exactly! Mistakes are stepping stones to improvement and innovation."
        }
      ],
      feedback: {
        correct: "Smart innovators treat mistakes as valuable learning experiences.",
        incorrect: "Successful creators view mistakes as opportunities for growth and refinement."
      }
    },
    {
      id: 4,
      text: "What's the benefit of brainstorming with friends?",
      emoji: "👥",
      options: [
        {
          id: "b",
          text: "To prove you're smarter",
          emoji: "👑",
          isCorrect: false,
          feedback: "Not quite. Collaboration isn't about proving superiority but about collective growth."
        },
        {
          id: "c",
          text: "To copy their ideas",
          emoji: "📸",
          isCorrect: false,
          feedback: "Not quite. Brainstorming is about generating new ideas together, not copying."
        },
        {
          id: "a",
          text: "To combine different perspectives",
          emoji: "🤝",
          isCorrect: true,
          feedback: "Exactly! Different viewpoints spark creative solutions neither person might reach alone."
        }
      ],
      feedback: {
        correct: "Diverse perspectives fuel innovation by challenging assumptions.",
        incorrect: "Effective brainstorming creates synergy from combining unique viewpoints."
      }
    },
    {
      id: 5,
      text: "Why is creativity important in entrepreneurship?",
      emoji: "🚀",
      options: [
        {
          id: "c",
          text: "To avoid all risks",
          emoji: "🛡️",
          isCorrect: false,
          feedback: "Not quite. Entrepreneurship inherently involves risk-taking and creative problem-solving."
        },
        {
          id: "b",
          text: "To do everything alone",
          emoji: "👤",
          isCorrect: false,
          feedback: "Not quite. Successful entrepreneurs often collaborate and delegate."
        },
        {
          id: "a",
          text: "To find unique solutions and opportunities",
          emoji: "🎯",
          isCorrect: true,
          feedback: "Exactly! Creative thinking helps entrepreneurs spot gaps and develop innovative offerings."
        }
      ],
      feedback: {
        correct: "Entrepreneurial creativity drives competitive advantage and market disruption.",
        incorrect: "Entrepreneurs use creativity to solve problems and capitalize on opportunities."
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
      title="Quiz on Creativity"
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
    
      nextGamePathProp="/student/ehe/kids/reflex-innovation-basics"
      nextGameIdProp="ehe-kids-33">
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

export default QuizOnCreativity;