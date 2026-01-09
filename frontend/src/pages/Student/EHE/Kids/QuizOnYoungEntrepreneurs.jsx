import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getEheKidsGames } from "../../../../pages/Games/GameCategories/EHE/kidGamesData";

const QuizOnYoungEntrepreneurs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-kids-42";
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
      text: "What do young entrepreneurs show?",
      emoji: "🌟",
      options: [
        {
          id: "a",
          text: "Laziness",
          emoji: "😴",
          isCorrect: false,
          feedback: "Not quite. Young entrepreneurs are known for their hard work and initiative."
        },
        {
          id: "b",
          text: "Creativity and Courage",
          emoji: "💡",
          isCorrect: true,
          feedback: "Great! Young entrepreneurs demonstrate creativity in solving problems and courage to take risks."
        },
        {
          id: "c",
          text: "Fear of trying new things",
          emoji: "😨",
          isCorrect: false,
          feedback: "Not quite. Young entrepreneurs are willing to try new things and take risks."
        }
      ],
      feedback: {
        correct: "Young entrepreneurs show creativity and courage in starting and running their businesses.",
        incorrect: "Young entrepreneurs are characterized by their initiative, creativity, and willingness to take risks."
      }
    },
    {
      id: 2,
      text: "What's an important skill for young entrepreneurs?",
      emoji: "🛠️",
      options: [
        {
          id: "c",
          text: "Avoiding all risks",
          emoji: "🛡️",
          isCorrect: false,
          feedback: "Not quite. Entrepreneurs need to take calculated risks to succeed."
        },
        
        {
          id: "b",
          text: "Waiting for others to solve problems",
          emoji: "⏳",
          isCorrect: false,
          feedback: "Not quite. Entrepreneurs are proactive and take initiative to solve problems."
        },
        {
          id: "a",
          text: "Problem-solving",
          emoji: "🧩",
          isCorrect: true,
          feedback: "Great! Problem-solving is crucial for entrepreneurs to overcome challenges."
        },
      ],
      feedback: {
        correct: "Problem-solving is essential for entrepreneurs to identify opportunities and overcome challenges.",
        incorrect: "Entrepreneurs need to be proactive in identifying and solving problems."
      }
    },
    {
      id: 3,
      text: "Why do young entrepreneurs start businesses?",
      emoji: "💼",
      options: [
        {
          id: "b",
          text: "To avoid learning new skills",
          emoji: "📚",
          isCorrect: false,
          feedback: "Not quite. Entrepreneurs often learn many new skills as they build their businesses."
        },
        {
          id: "c",
          text: "To copy others without thinking",
          emoji: "📋",
          isCorrect: false,
          feedback: "Not quite. Entrepreneurs create original solutions to problems."
        },
        {
          id: "a",
          text: "To create solutions and earn money",
          emoji: "🚀",
          isCorrect: true,
          feedback: "Great! Entrepreneurs identify needs and create solutions while earning money."
        }
      ],
      feedback: {
        correct: "Young entrepreneurs start businesses to create solutions to problems and generate income.",
        incorrect: "Entrepreneurs identify opportunities and create solutions that add value to society."
      }
    },
    {
      id: 4,
      text: "What should young entrepreneurs do when they face challenges?",
      emoji: "🏔️",
      options: [
        {
          id: "a",
          text: "Learn from failures and keep trying",
          emoji: "🔄",
          isCorrect: true,
          feedback: "Great! Resilience and learning from mistakes are key to entrepreneurial success."
        },
        {
          id: "c",
          text: "Give up immediately",
          emoji: "🏳️",
          isCorrect: false,
          feedback: "Not quite. Successful entrepreneurs persist through challenges and learn from setbacks."
        },
        {
          id: "b",
          text: "Blame others for their problems",
          emoji: "😠",
          isCorrect: false,
          feedback: "Not quite. Entrepreneurs take responsibility and focus on solutions."
        },
        
      ],
      feedback: {
        correct: "Successful entrepreneurs learn from failures and persist through challenges.",
        incorrect: "Entrepreneurs need resilience and a growth mindset to overcome challenges."
      }
    },
    {
      id: 5,
      text: "How can young entrepreneurs improve their ideas?",
      emoji: "📈",
      options: [
        {
          id: "b",
          text: "Never listen to feedback",
          emoji: "🙉",
          isCorrect: false,
          feedback: "Not quite. Feedback is essential for improving products and services."
        },
        {
          id: "c",
          text: "Stick to the first version forever",
          emoji: "🔒",
          isCorrect: false,
          feedback: "Not quite. Entrepreneurs continuously improve their ideas based on market needs."
        },
        {
          id: "a",
          text: "Test, get feedback, and iterate",
          emoji: "🧪",
          isCorrect: true,
          feedback: "Great! Testing and iterating based on feedback is key to improving ideas."
        }
      ],
      feedback: {
        correct: "Entrepreneurs improve their ideas by testing them, getting feedback, and iterating.",
        incorrect: "Continuous improvement through testing and feedback is essential for entrepreneurial success."
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
      title="Quiz on Young Entrepreneurs"
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
    
      nextGamePathProp="/student/ehe/kids/reflex-entrepreneur-basics"
      nextGameIdProp="ehe-kids-43">
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

export default QuizOnYoungEntrepreneurs;