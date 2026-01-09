import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getAiTeenGames } from '../../../../pages/Games/GameCategories/AiForAll/teenGamesData';

const AIForGoodStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-89";
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
          nextGamePath: nextGame ? nextGame.path : "/student/ai-for-all/teen/future-of-ai-quiz",
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return { nextGamePath: "/student/ai-for-all/teen/future-of-ai-quiz", nextGameId: null };
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
      text: "AI helps a blind person cross the road safely. What kind of AI is this?",
      options: [
        { 
          id: "good", 
          text: "Good AI", 
          emoji: "💖", 
         
          isCorrect: true
        },
        { 
          id: "bad", 
          text: "Bad AI", 
          emoji: "⚠️", 
          
          isCorrect: false
        },
        { 
          id: "neutral", 
          text: "Neutral AI", 
          emoji: "⚪", 
          
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "AI turns off unused lights to save electricity. Is this a good use of AI?",
      options: [
        
        { 
          id: "no", 
          text: "No, it's wrong", 
          emoji: "👎", 
          
          isCorrect: false
        },
        { 
          id: "maybe", 
          text: "Maybe, depends", 
          emoji: "🤔", 
          isCorrect: false
        },
        { 
          id: "yes", 
          text: "Yes, it's helpful!", 
          emoji: "👍", 
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "AI cameras detect poachers in forests to save wild animals. Is this AI for good?",
      options: [
        
        { 
          id: "no", 
          text: "No, it's unnecessary", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          id: "yes", 
          text: "Yes, saving lives!", 
          emoji: "🫶", 
          isCorrect: true
        },
        { 
          id: "partial", 
          text: "Partially helpful", 
          emoji: "🟡", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "AI helps doctors find early signs of cancer. Is this a positive AI use?",
      options: [
        { 
          id: "yes", 
          text: "Yes, helps patients", 
          emoji: "❤️", 
          isCorrect: true
        },
        { 
          id: "no", 
          text: "No, it replaces doctors", 
          emoji: "🤖", 
          isCorrect: false
        },
        { 
          id: "concern", 
          text: "Raises privacy concerns", 
          emoji: "🔒", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "AI tutors help kids learn better at home. Should we call this 'Good AI'?",
      options: [
        
        { 
          id: "no", 
          text: "No, not useful", 
          emoji: "😐", 
          isCorrect: false
        },
        { 
          id: "mixed", 
          text: "Mixed results", 
          emoji: "📊", 
          isCorrect: false
        },
        { 
          id: "yes", 
          text: "Yes, supports learning!", 
          emoji: "🌟", 
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
      console.log(`🎮 AI for Good Story game completed! Score: ${finalScore}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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
      title="AI for Good Story"
      score={coins}
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/ai-for-all/teen/future-of-ai-quiz"
      nextGameIdProp="ai-teen-90"
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
                <div className="text-4xl md:text-5xl mb-4">🌍</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Great Choice!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  Perfect! This action shows how AI can make life safer, healthier, and more equal for everyone.
                  Using AI for good helps build a better world! 🌈
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  Great work! 🧠 You understand how AI can be used for positive social impact. Good AI makes the world better! 🚀
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  That's not correct! This example shows AI being used for good purposes — helping people, saving energy, or protecting lives.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try again to reinforce your understanding of positive AI applications!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIForGoodStory;