import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getAiTeenGames } from '../../../../pages/Games/GameCategories/AiForAll/teenGamesData';

const SmartHomeStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-18";
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
          nextGamePath: nextGame ? nextGame.path : "/student/ai-for-all/teen/recommendation-simulation",
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return { nextGamePath: "/student/ai-for-all/teen/recommendation-simulation", nextGameId: null };
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
      text: "You walk into your room. The lights automatically turn on, adjust brightness based on the time of day, and even change color to match your mood. Who controls this smart system?",
      options: [
        
        { 
          id: "remote", 
          text: "Someone manually controlling it remotely", 
          emoji: "📱", 
          // description: "While remote control is possible, smart homes primarily use automated AI systems that learn and adapt to your habits",
          isCorrect: false
        },
        { 
          id: "iot", 
          text: "IoT AI System", 
          emoji: "🤖", 
          // description: "Smart homes use IoT (Internet of Things) AI systems that learn your preferences, detect your presence, understand context (time, weather), and automate your environment for comfort and efficiency",
          isCorrect: true
        },
        { 
          id: "sensor", 
          text: "Motion sensor only (no AI)", 
          emoji: "📡", 
          // description: "Motion sensors are just one component; modern smart homes use AI to learn preferences and make intelligent decisions beyond simple motion detection",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your smart thermostat learns when you're home and automatically adjusts temperature. How does it know when you're coming?",
      options: [
        
        { 
          id: "manual", 
          text: "You set a fixed schedule", 
          emoji: "🗓️", 
          // description: "While you can set schedules, smart thermostats go beyond fixed schedules by learning and adapting to your actual behavior",
          isCorrect: false
        },
        { 
          id: "guess", 
          text: "Random guessing", 
          emoji: "🎲", 
          // description: "Smart devices use data analysis, not random guessing, to make intelligent decisions",
          isCorrect: false
        },
        { 
          id: "schedule", 
          text: "AI analyzes your daily routine", 
          emoji: "⏰", 
          // description: "Smart thermostats use machine learning to analyze patterns in your behavior and predict when you'll be home to optimize energy usage",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "Your smart speaker plays your favorite music when you say 'Good morning'. How does it know what you like?",
      options: [
        
        { 
          id: "preset", 
          text: "Pre-programmed playlist", 
          emoji: "📋", 
          // description: "While presets exist, smart speakers personalize recommendations based on your unique preferences",
          isCorrect: false
        },
        { 
          id: "learning", 
          text: "AI learned from your past choices", 
          emoji: "🧠", 
          // description: "Voice assistants use AI to analyze your music preferences, listening history, and explicit feedback to make personalized recommendations",
          isCorrect: true
        },
        { 
          id: "random", 
          text: "Plays random songs", 
          emoji: "🔀", 
          // description: "Smart speakers use preference learning algorithms, not randomness, to select music",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Your smart security system sends alerts when it detects unusual activity. What technology enables this?",
      options: [
        { 
          id: "ai", 
          text: "AI pattern recognition", 
          emoji: "👁️", 
          // description: "Smart security systems use AI and computer vision to recognize normal vs. abnormal patterns and detect potential threats",
          isCorrect: true
        },
        { 
          id: "human", 
          text: "24/7 human monitoring", 
          emoji: "👮", 
          // description: "While some services offer human monitoring, the initial detection is typically done by AI systems",
          isCorrect: false
        },
        { 
          id: "alarm", 
          text: "Basic motion sensors only", 
          emoji: "🔔", 
          // description: "Modern smart security goes beyond simple motion detection using AI-powered pattern recognition",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Your smart fridge suggests recipes based on available ingredients. How does it work?",
      options: [
        
        { 
          id: "manual", 
          text: "You manually input recipes", 
          emoji: "📝", 
          // description: "While manual input is possible, smart fridges automatically suggest recipes based on AI analysis",
          isCorrect: false
        },
        { 
          id: "internet", 
          text: "Random internet search", 
          emoji: "🔍", 
          // description: "Recipe suggestions are based on intelligent matching algorithms, not random searches",
          isCorrect: false
        },
        { 
          id: "ai", 
          text: "AI matches ingredients to recipe databases", 
          emoji: "🍳", 
          // description: "Smart appliances use AI to connect available ingredients with recipe databases and suggest meals tailored to what you have",
          isCorrect: true
        },
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
      console.log(`🎮 Smart Home Story game completed! Score: ${finalScore}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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
      title="Smart Home Story"
      score={coins}
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/ai-for-all/teen/recommendation-simulation"
      nextGameIdProp="ai-teen-19"
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
                <div className="text-4xl md:text-5xl mb-4">🏠</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Smart Home Expert!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand how AI powers modern smart homes!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  You know that smart homes use IoT AI systems that learn your preferences, detect your presence, understand context, and automate your environment for comfort and efficiency!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, smart home AI learns your habits and preferences!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to choose the option that shows how AI learns and adapts to create smart home automation.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SmartHomeStory;