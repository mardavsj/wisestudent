import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getAiTeenGames } from "../../../../pages/Games/GameCategories/AiForAll/teenGamesData";

const FutureAIReflection = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-24";
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
      const games = getAiTeenGames({});
      const currentGame = games.find(g => g.id === gameId);
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : null,
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return { nextGamePath: null, nextGameId: null };
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
      text: "By 2050, AI will most likely:",
      emoji: "🔮",
      options: [
        { 
          id: 1, 
          text: "Assist in complex decision-making", 
          emoji: "🧠", 
          isCorrect: true
        },
        { 
          id: 2, 
          text: "Replace all human jobs", 
          emoji: "💔", 
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Become completely independent", 
          emoji: "😔",
          isCorrect: false
        }
      ],
      explanation: "Assist in complex decision-making! By 2050, AI will likely excel at processing vast amounts of data to support human decision-making in fields like healthcare, climate science, and economics. Rather than replacing humans, AI will augment our abilities to tackle complex global challenges."
    },
    {
      id: 2,
      text: "What's a realistic AI advancement by 2050?",
      emoji: "🚀",
      options: [
        
        { 
          id: 1, 
          text: "Teleportation devices", 
          emoji: "🌀", 
          isCorrect: false
        },
        { 
          id: 2, 
          text: "Personalized education tutors", 
          emoji: "🎓", 
          isCorrect: true
        },
        { 
          id: 3, 
          text: "Time travel machines", 
          emoji: "⏰", 
          isCorrect: false
        }
      ],
      explanation: "Personalized education tutors! AI will likely create highly adaptive learning systems that adjust to each student's pace, style, and knowledge gaps. These virtual tutors could provide customized educational experiences, making quality education more accessible worldwide."
    },
    {
      id: 3,
      text: "How might AI impact healthcare by 2050?",
      emoji: "🏥",
      options: [
        { 
          id: 1, 
          text: "Early disease prediction", 
          emoji: "🧬", 
          isCorrect: true
        },
        { 
          id: 2, 
          text: "Eliminate all diseases", 
          emoji: "🦠", 
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Replace all doctors", 
          emoji: "👩‍⚕️",
          isCorrect: false
        }
      ],
      explanation: "Early disease prediction! AI will likely analyze genetic, lifestyle, and environmental data to predict health risks before symptoms appear. This preventive approach could revolutionize medicine by catching diseases like cancer or heart conditions much earlier, vastly improving treatment outcomes."
    },
    {
      id: 4,
      text: "What ethical concern will be important for future AI?",
      emoji: "⚖️",
      options: [
        { 
          id: 1, 
          text: "AI developing emotions", 
          emoji: "❤️", 
          isCorrect: false
        },
        
        { 
          id: 2, 
          text: "AI taking over governments", 
          emoji: "🏰",
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Privacy protection", 
          emoji: "🔒",
          isCorrect: true
        },
      ],
      explanation: "Privacy protection! As AI systems collect and analyze more personal data, protecting individual privacy will become increasingly critical. Balancing the benefits of AI insights with respect for personal autonomy will be a major societal challenge throughout the coming decades."
    },
    {
      id: 5,
      text: "What role will humans play with advanced AI?",
      emoji: "🤝",
      options: [
        
        { 
          id: 1, 
          text: "Become obsolete", 
          emoji: "🔚", 
          isCorrect: false
        },
        { 
          id: 2, 
          text: "Creative and ethical oversight", 
          emoji: "🎭", 
          isCorrect: true
        },
        { 
          id: 3, 
          text: "Only consume AI content", 
          emoji: "📺", 
          isCorrect: false
        }
      ],
      explanation: "Creative and ethical oversight! While AI will handle routine tasks and data processing, humans will focus on creativity, empathy, ethics, and complex problem-solving. These distinctly human qualities will remain essential for guiding AI development and ensuring technology serves humanity's best interests."
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
      title="Future of AI Reflection"
      subtitle={levelCompleted ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/teen/ai-basics-badge"
      nextGameIdProp="ai-teen-25"
      gameType="ai"
      showGameOver={levelCompleted}
      maxScore={questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      showConfetti={levelCompleted && finalScore >= 3}
    >
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
                      <p className="text-white/90 text-sm">{option.description}</p>
                    </button>
                  );
                })}
              </div>
              
              {answered && (
                <div className={`rounded-lg p-4 mt-6 ${
                  currentQuestionData.options.find(opt => opt.id === selectedOption)?.isCorrect
                    ? "bg-green-500/20"
                    : "bg-red-500/20"
                }`}>
                  <p className="text-white text-center">
                    {currentQuestionData.explanation}
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

export default FutureAIReflection;