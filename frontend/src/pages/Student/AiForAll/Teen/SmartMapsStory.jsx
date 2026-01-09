import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getAiTeenGames } from '../../../../pages/Games/GameCategories/AiForAll/teenGamesData';

const SmartMapsStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-26";
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
          nextGamePath: nextGame ? nextGame.path : "/student/ai-for-all/teen/voice-assistant-reflex",
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return { nextGamePath: "/student/ai-for-all/teen/voice-assistant-reflex", nextGameId: null };
  }, [location.state, gameId]);
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const questions = [
    {
      id: 1,
      text: "You need to reach your friend's house quickly for an important event. What's the best way to find the fastest route?",
      options: [
       
        { 
          id: "ai", 
          text: "Use Google Maps AI", 
          emoji: "🤖", 
          // description: "AI navigation systems like Google Maps analyze real-time traffic, road conditions, accidents, and historical data to calculate the fastest route",
          isCorrect: true
        },
         { 
          id: "guess", 
          text: "Guess the route yourself", 
          emoji: "❓", 
          // description: "Guessing may lead to traffic jams, construction zones, or longer routes that waste valuable time",
          isCorrect: false
        },
        { 
          id: "paper", 
          text: "Use a paper map", 
          emoji: "🗺️", 
          // description: "Paper maps don't provide real-time traffic updates or dynamic route optimization that AI systems offer",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why does Google Maps sometimes suggest a longer-looking route than the direct path?",
      options: [
       
        
        { 
          id: "random", 
          text: "Random route selection", 
          emoji: "🎲", 
          // description: "AI systems use data-driven approaches rather than random selections to optimize routes",
          isCorrect: false
        },
         { 
          id: "mistake", 
          text: "It made a mistake", 
          emoji: "❌", 
          // description: "AI navigation systems are designed to optimize for time, not distance, using sophisticated algorithms",
          isCorrect: false
        },
        { 
          id: "traffic", 
          text: "Avoiding traffic congestion", 
          emoji: "🚦", 
          // description: "AI considers real-time traffic data and predicts delays to save you time even if the route looks longer",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "How does your navigation app know about an accident that happened 10 minutes ago?",
      options: [
        
        
        { 
          id: "magic", 
          text: "Magical prediction", 
          emoji: "🔮", 
          // description: "Navigation systems use real data sources rather than supernatural abilities",
          isCorrect: false
        },
        { 
          id: "data", 
          text: "Real-time data integration", 
          emoji: "📡", 
          // description: "AI navigation systems collect data from traffic cameras, police reports, user reports, and connected vehicles to stay updated",
          isCorrect: true
        },
        { 
          id: "guess", 
          text: "It guessed correctly", 
          emoji: "💭", 
          // description: "Modern navigation systems rely on data aggregation rather than guesswork for accuracy",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why does your navigation app suggest different routes at different times of day to the same destination?",
      options: [
        
        { 
          id: "patterns", 
          text: "Traffic patterns change", 
          emoji: "⏰", 
          // description: "AI systems learn daily traffic patterns and adjust routes based on time-of-day traffic predictions",
          isCorrect: true
        },
        { 
          id: "random", 
          text: "Random route generator", 
          emoji: "🔄", 
          // description: "Route variations are based on predictive analytics, not randomness",
          isCorrect: false
        },
        { 
          id: "broken", 
          text: "The app is broken", 
          emoji: "🔧", 
          // description: "Variations in route suggestions reflect intelligent adaptation rather than malfunction",
          isCorrect: false
        },
      ]
    },
    {
      id: 5,
      text: "What makes modern AI navigation better than traditional GPS systems?",
      options: [
        { 
          id: "hardware", 
          text: "Better satellite hardware", 
          emoji: "🛰️", 
          // description: "Both use similar GPS satellites; the improvement comes from software intelligence",
          isCorrect: false
        },
        { 
          id: "intelligence", 
          text: "Machine learning intelligence", 
          emoji: "🧠", 
          // description: "AI navigation uses machine learning to analyze traffic patterns, user behavior, and real-time data for smarter routing",
          isCorrect: true
        },
        { 
          id: "maps", 
          text: "Prettier map visuals", 
          emoji: "🎨", 
          // description: "Visual improvements are secondary to the core intelligence improvements in routing",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: selectedChoice,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Smart Maps Story game completed! Score: ${finalScore}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, finalScore, gameId, nextGamePath, nextGameId, questions.length]);

  return (
    <GameShell
      title="Smart Maps Story"
      score={coins}
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/ai-for-all/teen/voice-assistant-reflex"
      nextGameIdProp="ai-teen-27"
      showGameOver={showResult && finalScore >= 3}
      gameId={gameId}
      gameType="ai"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
              </div>
              
              <p className="text-white text-base md:text-lg lg:text-xl mb-4 md:mb-6 text-center">
                {getCurrentQuestion().text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl md:text-3xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-base md:text-xl mb-2">{option.text}</h3>
                    <p className="text-white/90 text-xs md:text-sm">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20 text-center flex-1 flex flex-col justify-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-4xl md:text-5xl mb-4">🚗</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">AI Navigation Expert!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand how AI powers modern navigation systems!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  You know that AI navigation systems analyze traffic, road conditions, and historical data to give you the fastest route, saving time and energy!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, AI navigation provides optimized routes using real-time data!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to choose the option that shows how AI navigation uses real-time data and machine learning for route optimization.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SmartMapsStory;