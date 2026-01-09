import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getAiTeenGames } from '../../../../pages/Games/GameCategories/AiForAll/teenGamesData';

const TrainingFeedbackStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-72";
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
          nextGamePath: nextGame ? nextGame.path : "/student/ai-for-all/teen/human-vs-ai-errors-quiz",
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return { nextGamePath: "/student/ai-for-all/teen/human-vs-ai-errors-quiz", nextGameId: null };
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
      text: "The robot made mistakes while stacking blocks. What should the teen do?",
      options: [
       
        { 
          id: "ignore", 
          text: "Ignore Errors", 
          emoji: "🚫", 
          // description: "Ignoring errors prevents AI from learning and correcting its behavior",
          isCorrect: false
        },
         { 
          id: "feedback", 
          text: "Give Feedback", 
          emoji: "📝", 
          // description: "Providing corrective feedback helps AI learn from mistakes and improve performance",
          isCorrect: true
        },
        { 
          id: "restart", 
          text: "Restart Completely", 
          emoji: "🔄", 
          // description: "While sometimes necessary, restarting completely misses the opportunity to teach AI from mistakes",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Even after trying, the robot repeats the same mistakes. Why?",
      options: [
        { 
          id: "correction", 
          text: "Needs Teacher Correction", 
          emoji: "👨‍🏫", 
          // description: "AI needs human guidance and correction to overcome persistent errors",
          isCorrect: true
        },
        { 
          id: "lazy", 
          text: "Robot is Lazy", 
          emoji: "😴", 
          // description: "AI doesn't have feelings like laziness - it needs proper training and feedback",
          isCorrect: false
        },
        { 
          id: "broken", 
          text: "Robot is Broken", 
          emoji: "🔧", 
          // description: "Most AI errors aren't hardware issues but rather training or feedback problems",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Teen gives step-by-step instructions. Outcome?",
      options: [
        { 
          id: "improve", 
          text: "Robot improves faster", 
          emoji: "⚡", 
          // description: "Structured, incremental guidance helps AI learn complex tasks more effectively",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Robot ignores instructions", 
          emoji: "🔇", 
          // description: "Well-formatted instructions are typically followed by properly designed AI systems",
          isCorrect: false
        },
        { 
          id: "confused", 
          text: "Robot gets confused", 
          emoji: "😵", 
          // description: "Clear, step-by-step instructions reduce confusion rather than increase it",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Robot completes task correctly. Teen rewards robot. Lesson?",
      options: [
        
        { 
          id: "nomatter", 
          text: "Rewards don't matter", 
          emoji: "❌", 
          // description: "Reinforcement learning shows that rewards significantly impact AI behavior",
          isCorrect: false
        },
        { 
          id: "negative", 
          text: "Negative feedback works better", 
          emoji: "😞", 
          // description: "Both positive and negative feedback are important, but rewards encourage desired behaviors",
          isCorrect: false
        },
        { 
          id: "reward", 
          text: "Feedback + Reward = Better Learning", 
          emoji: "🏆", 
          // description: "Positive reinforcement combined with feedback accelerates AI learning",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "Teen realizes that feedback helps AI improve. Outcome?",
      options: [
        
        { 
          id: "alone", 
          text: "Let AI learn alone", 
          emoji: "👤", 
          // description: "Unsupervised learning has limitations without human guidance",
          isCorrect: false
        },
        { 
          id: "retrain", 
          text: "Retraining with guidance is key", 
          emoji: "🔁", 
          // description: "Continuous feedback and retraining are essential for AI improvement",
          isCorrect: true
        },
        { 
          id: "replace", 
          text: "Replace the AI", 
          emoji: "🗑️", 
          // description: "Improvement through feedback is more sustainable than constant replacement",
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
      console.log(`🎮 Training Feedback Story game completed! Score: ${finalScore}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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
      title="Training Feedback Story"
      score={coins}
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/ai-for-all/teen/human-vs-ai-errors-quiz"
      nextGameIdProp="ai-teen-73"
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
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Feedback Given!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  Excellent! Feedback helps AI learn and improve quickly. 🌟🤖
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  Great work! 🧠 You understand how human feedback helps AI improve. Your guidance makes robots smarter! 🚀
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  AI cannot improve without feedback. Try again! 📝
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try again to reinforce your understanding of how feedback improves AI performance!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TrainingFeedbackStory;