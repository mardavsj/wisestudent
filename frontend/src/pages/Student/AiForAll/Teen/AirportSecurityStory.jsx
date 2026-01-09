import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getAiTeenGames } from '../../../../pages/Games/GameCategories/AiForAll/teenGamesData';

const AirportSecurityStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-33";
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
          nextGamePath: nextGame ? nextGame.path : "/student/ai-for-all/teen/ai-translator-reflex",
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return { nextGamePath: "/student/ai-for-all/teen/ai-translator-reflex", nextGameId: null };
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
      text: "Bag scanner detects a knife. Who helped find it?",
      emoji: "🔍",
      options: [
        { 
          id: 1, 
          text: "AI Scanner", 
         
          isCorrect: true
        },
        { 
          id: 2, 
          text: "Human Guess", 
         
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Manual Inspection", 
         
          isCorrect: false
        }
      ],
      explanation: "AI-powered X-ray scanners can detect prohibited items like knives by recognizing their shapes and densities in baggage."
    },
    {
      id: 2,
      text: "A traveler's face is matched to their passport. Who does this quickly?",
     
      options: [
        
        { 
          id: 1, 
          text: "Manual Officer Review", 
         
          isCorrect: false
        },
        { 
          id: 2, 
          text: "AI Face Recognition", 
          
          isCorrect: true
        },
        { 
          id: 3, 
          text: "Biometric Expert", 
         
          isCorrect: false
        }
      ],
      explanation: "AI facial recognition systems can match faces to passport photos in milliseconds with high accuracy."
    },
    {
      id: 3,
      text: "A bag exceeds the weight limit. Who alerts the staff?",
    
      options: [
        
        { 
          id: 1, 
          text: "Random Check", 
         
          isCorrect: false
        },
        { 
          id: 2, 
          text: "Passenger Notification", 
      
          isCorrect: false
        },
        { 
          id: 3, 
          text: "AI Weighing System", 
         
          isCorrect: true
        },
      ],
      explanation: "Automated weighing systems integrated with AI can instantly detect overweight baggage and notify staff."
    },
    {
      id: 4,
      text: "An unknown device is spotted in a bag. Who flags it first?",
      emoji: "📱",
      options: [
        { 
          id: 1, 
          text: "AI X-ray Vision", 
          
          isCorrect: true
        },
        { 
          id: 2, 
          text: "Traveler's Friend", 
       
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Security Personnel", 
           
          isCorrect: false
        }
      ],
      explanation: "AI-enhanced X-ray systems can identify suspicious or unknown objects by comparing them to databases of known items."
    },
    {
      id: 5,
      text: "Long line forms at security check. Who optimizes the flow?",
      emoji: "🚶",
      options: [
       
        { 
          id: 1, 
          text: "Random Volunteer", 
          
          isCorrect: false
        },
         { 
          id: 2, 
          text: "AI Queue Manager", 
          
          isCorrect: true
        },
        { 
          id: 3, 
          text: "Manual Staffing", 
        
          isCorrect: false
        }
      ],
      explanation: "AI systems monitor queue lengths and can dynamically open additional lanes or redirect passengers for optimal flow."
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
      title="Airport Security Story"
      subtitle={levelCompleted ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/teen/ai-translator-reflex"
      nextGameIdProp="ai-teen-34"
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

export default AirportSecurityStory;