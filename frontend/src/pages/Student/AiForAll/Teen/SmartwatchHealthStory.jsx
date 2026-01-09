import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getAiTeenGames } from '../../../../pages/Games/GameCategories/AiForAll/teenGamesData';

const SmartwatchHealthStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-39";
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
          nextGamePath: nextGame ? nextGame.path : "/student/ai-for-all/teen/smart-city-traffic-gamee",
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return { nextGamePath: "/student/ai-for-all/teen/smart-city-traffic-gamee", nextGameId: null };
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
      text: "The watch warns 'Heartbeat too fast.' Who detected it?",
      options: [
        
        { 
          id: "friend", 
          text: "Friend", 
          emoji: "👨‍👩‍👧", 
          // description: "Friends can't continuously monitor vital signs or detect subtle changes in heart rate patterns",
          isCorrect: false
        },
        { 
          id: "ai", 
          text: "AI Health Monitor", 
          emoji: "🤖", 
          // description: "AI algorithms continuously analyze heart rate patterns and can detect abnormalities in real-time",
          isCorrect: true
        },
        { 
          id: "guess", 
          text: "User Guess", 
          emoji: "❓", 
          // description: "Guessing isn't reliable for detecting medical conditions that require precise monitoring",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "The watch notices poor sleep. Who informed the user?",
      options: [
        { 
          id: "analyzer", 
          text: "AI Sleep Analyzer", 
          emoji: "🤖", 
          // description: "AI analyzes sleep patterns, duration, and quality to provide personalized insights",
          isCorrect: true
        },
        { 
          id: "manual", 
          text: "Manual Log", 
          emoji: "📓", 
          // description: "Manual logs depend on user memory and aren't as accurate as continuous AI monitoring",
          isCorrect: false
        },
        { 
          id: "alarm", 
          text: "Alarm Clock", 
          emoji: "⏰", 
          // description: "Alarm clocks only wake you up but don't analyze sleep quality or patterns",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "The watch tracks steps and gives daily targets. Who tracks it?",
      options: [
       
        { 
          id: "user", 
          text: "User Counting", 
          emoji: "🧮", 
          // description: "Manual counting is prone to errors and doesn't provide personalized fitness recommendations",
          isCorrect: false
        },
         { 
          id: "coach", 
          text: "AI Fitness Coach", 
          emoji: "🤖", 
          // description: "AI personalizes fitness goals based on user data and adjusts targets for optimal results",
          isCorrect: true
        },
        { 
          id: "pedometer", 
          text: "Basic Pedometer", 
          emoji: "👟", 
          // description: "Basic pedometers only count steps but don't provide personalized goals or insights",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "The watch calculates calories burned. Who does this?",
      options: [
        
        { 
          id: "scale", 
          text: "Kitchen Scale", 
          emoji: "🥣", 
          // description: "Kitchen scales measure food weight but can't calculate calories burned during activities",
          isCorrect: false
        },
        { 
          id: "app", 
          text: "Generic App", 
          emoji: "📱", 
          // description: "Generic apps often use rough estimates rather than personalized AI calculations",
          isCorrect: false
        },
        { 
          id: "tracker", 
          text: "AI Nutrition Tracker", 
          emoji: "🤖", 
          // description: "AI combines activity data, heart rate, and user profile to accurately estimate calorie expenditure",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "The watch warns of high stress levels. Who noticed this?",
      options: [
        { 
          id: "monitor", 
          text: "AI Wellness Monitor", 
          emoji: "🤖", 
          // description: "AI analyzes heart rate variability, activity patterns, and other biometrics to detect stress",
          isCorrect: true
        },
        { 
          id: "advice", 
          text: "Friend Advice", 
          emoji: "🗣️", 
          // description: "Friends can offer support but can't continuously monitor physiological stress indicators",
          isCorrect: false
        },
        { 
          id: "feeling", 
          text: "User Feeling", 
          emoji: "💭", 
          // description: "Subjective feelings are important but AI can detect stress before users are consciously aware",
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
      console.log(`🎮 Smartwatch Health Story game completed! Score: ${finalScore}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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
      title="Smartwatch Health Story"
      score={coins}
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/ai-for-all/teen/smart-city-traffic-gamee"
      nextGameIdProp="ai-teen-40"
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
                <div className="text-4xl md:text-5xl mb-4">✅</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Health Monitored Successfully!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand how AI helps track vital signs and alerts you to stay safe and healthy!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  AI helps track vital signs and alerts you to stay safe and healthy! 🤖💓
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, AI in smartwatches helps monitor health and gives timely alerts.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to choose the option that shows how AI enhances health monitoring compared to traditional methods.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SmartwatchHealthStory;