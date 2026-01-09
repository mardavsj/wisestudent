import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getAiTeenGames } from '../../../../pages/Games/GameCategories/AiForAll/teenGamesData';

const AIInFarmingStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-35";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 1;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    // First, try to get from location.state (passed from GameCategoryPage)
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    // Fallback: find next game from game data
    try {
      const games = getAiTeenGames({});
      const currentGame = games.find(g => g.id === gameId);
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : "/student/ai-for-all/teen/ai-in-banking-quiz",
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return { nextGamePath: "/student/ai-for-all/teen/ai-in-banking-quiz", nextGameId: null };
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
      text: "The farmer wonders when to water the crops. Who gives the best advice?",
      emoji: "💧",
      options: [
       
        { 
          id: 1, 
          text: "Random Guess", 
         
          isCorrect: false
        },
         { 
          id: 2, 
          text: "AI Weather Forecast", 
        
          isCorrect: true
        },
        { 
          id: 3, 
          text: "Traditional Calendar", 
       
          isCorrect: false
        }
      ],
      explanation: "AI analyzes weather patterns, soil moisture, and crop needs to determine optimal watering times."
    },
    {
      id: 2,
      text: "The soil is drying fast. Who detects it and alerts the farmer?",
      emoji: "🌱",
      options: [
        { 
          id: 1, 
          text: "AI Soil Sensor", 
         
          isCorrect: true
        },
        { 
          id: 2, 
          text: "Farmer's Intuition", 
         
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Weekly Manual Check", 
         
          isCorrect: false
        }
      ],
      explanation: "Smart sensors embedded in fields continuously monitor soil moisture and send alerts when levels drop."
    },
    {
      id: 3,
      text: "Insects attack the field. Who spots them early?",
      emoji: "🐛",
      options: [
        
        { 
          id: 1, 
          text: "Scarecrow", 
        
          isCorrect: false
        },
        { 
          id: 2, 
          text: "AI Drone Camera", 
        
          isCorrect: true
        },
        { 
          id: 3, 
          text: "Weekly Pest Report", 
       
          isCorrect: false
        }
      ],
      explanation: "Drones equipped with AI image recognition can spot pest infestations from above before they spread."
    },
    {
      id: 4,
      text: "The crops need nutrients. Who suggests the right fertilizer?",
      emoji: "🧪",
      options: [
        
        { 
          id: 2, 
          text: "Old Farmer Tale", 
         
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Generic Fertilizer Mix", 
        
          isCorrect: false
        },
        { 
          id: 1, 
          text: "AI Crop Advisor", 
      
          isCorrect: true
        },
      ],
      explanation: "AI analyzes soil composition, crop type, and growth stage to recommend precise fertilizer blends."
    },
    {
      id: 5,
      text: "The farmer asks: When is the best time to harvest?",
      emoji: "🚜",
      options: [
        { 
          id: 1, 
          text: "AI Growth Monitor", 
       
          isCorrect: true
        },
        { 
          id: 2, 
          text: "Random Calendar Date", 
         
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Full Moon Schedule", 
     
          isCorrect: false
        }
      ],
      explanation: "AI tracks crop maturity through sensors and imaging to determine the optimal harvest time for maximum yield."
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
      title="AI in Farming Story"
      subtitle={levelCompleted ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/teen/ai-in-banking-quiz"
      nextGameIdProp="ai-teen-36"
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

export default AIInFarmingStory;