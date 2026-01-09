import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getAiTeenGames } from "../../../../pages/Games/GameCategories/AiForAll/teenGamesData";

const AIEverywhereQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-20";
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
      text: "Is AI only in robots?",
      emoji: "🌍",
      options: [
        { 
          id: 1, 
          text: "Yes - AI is only in robots", 
          emoji: "🤖", 
          isCorrect: false
        },
        { 
          id: 2, 
          text: "Only in science fiction", 
          emoji: "📚", 
          isCorrect: false
        },
        { 
          id: 3, 
          text: "No - AI is everywhere!", 
          emoji: "🌐", 
          isCorrect: true
        },
        
      ],
      explanation: "Absolutely correct! AI is EVERYWHERE:\n\n📱 Your Phone: Face unlock, voice assistants, predictive text\n🎬 Entertainment: Netflix, YouTube, Spotify recommendations\n🛒 Shopping: Amazon, online stores, personalized ads\n🚗 Transportation: GPS navigation, self-driving cars\n🏥 Healthcare: Disease diagnosis, drug discovery\n🎮 Gaming: Smart NPCs, procedural generation\n🏠 Home: Smart devices, thermostats, security\n💬 Communication: Email filters, translation, chatbots\n📸 Photos: Face recognition, filters, image enhancement\n🔍 Search: Google, Bing use AI to understand your queries\n\nAI is integrated into almost every aspect of modern life!"
    },
    {
      id: 2,
      text: "Is AI only used in big tech companies?",
      emoji: "🏢",
      options: [
        { 
          id: 1, 
          text: "Yes - Only big companies use AI", 
          emoji: "💼",
          isCorrect: false
        },
        { 
          id: 2, 
          text: "No - Many industries use AI", 
          emoji: "🏭",
          isCorrect: true
        },
        { 
          id: 3, 
          text: "Only in research labs", 
          emoji: "🔬",
          isCorrect: false
        }
      ],
      explanation: "AI is used across many industries including healthcare (diagnosis), agriculture (crop monitoring), education (personalized learning), finance (fraud detection), manufacturing (quality control), and more. Small businesses also use AI through cloud services and apps."
    },
    {
      id: 3,
      text: "Is AI only for adults?",
      emoji: "🧑‍🤝‍🧑",
      options: [
       
        { 
          id: 1, 
          text: "No - Kids use AI too", 
          emoji: "🧒", 
          isCorrect: true
        },
         { 
          id: 2, 
          text: "Yes - Only adults use AI", 
          emoji: "👨‍💼", 
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Only for experts", 
          emoji: "🤓",
          isCorrect: false
        }
      ],
      explanation: "Children interact with AI daily through voice assistants (Alexa, Siri), recommendation systems (YouTube, Netflix), educational apps, smart toys, and gaming. AI is designed to be accessible to users of all ages."
    },
    {
      id: 4,
      text: "Is AI only in software?",
      emoji: "💻",
      options: [
        { 
          id: 1, 
          text: "Yes - Only in software", 
          emoji: "🖥️",
          isCorrect: false
        },
        { 
          id: 2, 
          text: "No - Hardware uses AI too", 
          emoji: "🔧",
          isCorrect: true
        },
        { 
          id: 3, 
          text: "Only in the cloud", 
          emoji: "☁️", 
          isCorrect: false
        }
      ],
      explanation: "AI exists in both software and hardware. Specialized AI chips (like Google's TPU, Apple's Neural Engine) are built into phones, cars, and other devices. IoT devices, drones, and robots combine AI software with dedicated hardware for real-time processing."
    },
    {
      id: 5,
      text: "Is AI only for entertainment?",
      emoji: "🎭",
      options: [
        { 
          id: 1, 
          text: "Yes - Just for fun", 
          emoji: "🎮", 
          isCorrect: false
        },
        { 
          id: 2, 
          text: "Only for business", 
          emoji: "💼", 
          isCorrect: false
        },
        { 
          id: 3, 
          text: "No - Serious applications too", 
          emoji: "🏥",
          isCorrect: true
        },
        
      ],
      explanation: "AI tackles serious global challenges: climate modeling, disease diagnosis, disaster prediction, accessibility tools for disabilities, scientific research, space exploration, and more. Entertainment is just one small application among many life-changing uses."
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
      title="AI Everywhere Quiz"
      subtitle={levelCompleted ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/teen/spam-filter-reflex"
      nextGameIdProp="ai-teen-21"
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
                <div className={`rounded-lg p-5 mt-6 ${
                  currentQuestionData.options.find(opt => opt.id === selectedOption)?.isCorrect
                    ? "bg-green-500/20"
                    : "bg-red-500/20"
                }`}>
                  <p className="text-white whitespace-pre-line">
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

export default AIEverywhereQuiz;