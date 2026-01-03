import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getBrainKidsGames } from "../../../../pages/Games/GameCategories/Brain/kidGamesData";

const SportsStory = () => {
  const location = useLocation();
  
  // Check if this component should render based on gameId from location.state
  // This is needed because there are multiple "Sports Story" games with the same path
  const expectedGameId = "brain-kids-8";
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById(expectedGameId);
  const gameId = gameData?.id || expectedGameId;
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SportsStory, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
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
      const games = getBrainKidsGames({});
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
  
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Kid loses a game and feels angry. Right action?",
      options: [
        { 
          id: "try-again", 
          text: "Try again calmly", 
          emoji: "🧘", 
          
          isCorrect: true
        },
        { 
          id: "yell", 
          text: "Yell and get more angry", 
          emoji: "😡", 
          
          isCorrect: false
        },
        { 
          id: "quit", 
          text: "Quit playing forever", 
          emoji: "🚪", 
          
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "After losing, what helps you improve?",
      options: [
       
        { 
          id: "blame", 
          text: "Blame others", 
          emoji: "👆", 
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Ignore the loss", 
          emoji: "🙈", 
          isCorrect: false
        },
         { 
          id: "practice", 
          text: "Practice and learn from mistakes", 
          emoji: "📚", 
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "When you feel angry after losing, what should you do?",
      options: [
        
        { 
          id: "scream", 
          text: "Scream and throw things", 
          emoji: "😱", 
          isCorrect: false
        },
        { 
          id: "breathe", 
          text: "Take deep breaths and calm down", 
          emoji: "🌬️", 
          isCorrect: true
        },
        { 
          id: "cry", 
          text: "Cry and give up", 
          emoji: "😢", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What's the best way to handle losing?",
      options: [
        
        { 
          id: "forget", 
          text: "Forget about it completely", 
          emoji: "🧠", 
          isCorrect: false
        },
        { 
          id: "complain", 
          text: "Complain to everyone", 
          emoji: "😤", 
          isCorrect: false
        },
        { 
          id: "learn", 
          text: "Learn from it and try again", 
          emoji: "💪", 
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "How can you stay calm when you lose?",
      options: [
        { 
          id: "positive", 
          text: "Think positive and keep trying", 
          emoji: "✨", 
          isCorrect: true
        },
        { 
          id: "negative", 
          text: "Think you'll always lose", 
          emoji: "💔", 
          isCorrect: false
        },
        { 
          id: "avoid", 
          text: "Avoid playing again", 
          emoji: "🏃", 
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    let finalScore = score;
    
    if (isCorrect) {
      setScore(prev => {
        const newScore = prev + 1;
        finalScore = newScore;
        console.log(`✅ Correct answer! Score: ${newScore}/${questions.length}, isLastQuestion: ${isLastQuestion}, gameId: ${gameId}`);
        return newScore;
      });
      showCorrectAnswerFeedback(1, true);
    } else {
      finalScore = score;
      console.log(`❌ Wrong answer. Score: ${score}/${questions.length}, isLastQuestion: ${isLastQuestion}, gameId: ${gameId}`);
    }
    
    setTimeout(() => {
      if (isLastQuestion) {
        console.log(`🎮 Game complete! Final score: ${finalScore}/${questions.length}, gameId: ${gameId}`);
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Sports Story game completed! Score: ${score}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId, questions.length]);

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Sports for Brain Health"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="brain"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/brain-health/kids"
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                    <p className="text-white/90 text-sm">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default SportsStory;
