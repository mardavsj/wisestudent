import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getEheKidsGames } from "../../../../pages/Games/GameCategories/EHE/kidGamesData";

const QuizOnPathways = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-kids-52";
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
      text: "Which is a career path?",
      emoji: "🛤️",
      options: [
        {
          id: "a",
          text: "Vocational training",
          emoji: "🔧",
          isCorrect: false,
          feedback: "Partially correct. Vocational training is indeed a career path, but it's not the only one."
        },
        {
          id: "b",
          text: "Higher education",
          emoji: "🎓",
          isCorrect: false,
          feedback: "Partially correct. Higher education is indeed a career path, but it's not the only one."
        },
        {
          id: "c",
          text: "Both",
          emoji: "🤝",
          isCorrect: true,
          feedback: "Great! Both vocational training and higher education are valid career paths."
        }
      ],
      feedback: {
        correct: "Career paths can take many forms, including vocational training and higher education.",
        incorrect: "There are multiple valid career paths, including both vocational training and higher education."
      }
    },
    {
      id: 2,
      text: "What is vocational training focused on?",
      emoji: "🎯",
      options: [
        {
          id: "b",
          text: "Only theoretical knowledge",
          emoji: "📚",
          isCorrect: false,
          feedback: "Not quite. Vocational training emphasizes hands-on skills rather than just theory."
        },
        {
          id: "c",
          text: "Only playing games",
          emoji: "🎮",
          isCorrect: false,
          feedback: "Not quite. While engaging, vocational training focuses on developing job-specific skills."
        },
        {
          id: "a",
          text: "Practical skills for specific jobs",
          emoji: "🛠️",
          isCorrect: true,
          feedback: "Great! Vocational training prepares individuals with hands-on skills for specific careers."
        }
      ],
      feedback: {
        correct: "Vocational training focuses on practical, job-specific skills that prepare individuals for particular careers.",
        incorrect: "Vocational training emphasizes hands-on learning and practical skills for specific occupations."
      }
    },
    {
      id: 3,
      text: "What's a benefit of higher education?",
      emoji: "🏛️",
      options: [
        {
          id: "a",
          text: "Deeper theoretical knowledge",
          emoji: "🧠",
          isCorrect: true,
          feedback: "Great! Higher education provides in-depth understanding of subjects and critical thinking skills."
        },
        {
          id: "b",
          text: "No need to study hard",
          emoji: "😴",
          isCorrect: false,
          feedback: "Not quite. Higher education typically requires significant effort and dedication."
        },
        {
          id: "c",
          text: "Automatic job guarantee",
          emoji: "💼",
          isCorrect: false,
          feedback: "Not quite. While higher education can improve job prospects, it doesn't guarantee employment."
        },
        
      ],
      feedback: {
        correct: "Higher education develops critical thinking, analytical skills, and deep subject matter expertise.",
        incorrect: "Higher education offers benefits like expanded knowledge, research skills, and career opportunities."
      }
    },
    {
      id: 4,
      text: "Can someone succeed without college?",
      emoji: "🏆",
      options: [
        {
          id: "c",
          text: "No, college is absolutely necessary",
          emoji: "❌",
          isCorrect: false,
          feedback: "Not quite. Success can be achieved through various paths, not just college."
        },
         {
          id: "a",
          text: "Yes, through skills and dedication",
          emoji: "✅",
          isCorrect: true,
          feedback: "Great! Many successful people have built careers through skills, dedication, and alternative education."
        },
        {
          id: "b",
          text: "Only with family wealth",
          emoji: "💰",
          isCorrect: false,
          feedback: "Not quite. While resources can help, success depends more on skills, effort, and opportunity."
        },
              
      ],
      feedback: {
        correct: "Success comes in many forms and can be achieved through various paths including entrepreneurship, trades, and self-education.",
        incorrect: "Multiple pathways can lead to success, including vocational training, apprenticeships, and entrepreneurship."
      }
    },
    {
      id: 5,
      text: "What should you consider when choosing a path?",
      emoji: "🤔",
      options: [
        {
          id: "b",
          text: "Only what friends are doing",
          emoji: "👥",
          isCorrect: false,
          feedback: "Not quite. While friends' choices can be informative, your personal factors matter more."
        },
        {
          id: "c",
          text: "Only the shortest duration",
          emoji: "⏱️",
          isCorrect: false,
          feedback: "Not quite. Quick completion is helpful but shouldn't be the only consideration."
        },
        {
          id: "a",
          text: "Your interests, skills, and goals",
          emoji: "🎯",
          isCorrect: true,
          feedback: "Great! Aligning your path with your interests, skills, and goals increases satisfaction and success."
        }
      ],
      feedback: {
        correct: "Choosing a career path should align with your personal interests, strengths, and long-term objectives.",
        incorrect: "Effective career planning considers multiple factors including personal interests, market demand, and growth potential."
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
      title="Quiz on Pathways"
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
    
      nextGamePathProp="/student/ehe/kids/reflex-path-check"
      nextGameIdProp="ehe-kids-53">
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

export default QuizOnPathways;