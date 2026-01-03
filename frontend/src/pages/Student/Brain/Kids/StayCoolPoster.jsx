import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getBrainKidsGames } from "../../../../pages/Games/GameCategories/Brain/kidGamesData";
import { Wind, Music, Flower, Waves } from 'lucide-react';

const StayCoolPoster = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-36");
  const gameId = gameData?.id || "brain-kids-36";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for StayCoolPoster, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Find next game path if not provided in location.state
  const nextGamePath = useMemo(() => {
    // First, try to get from location.state (passed from GameCategoryPage)
    if (location.state?.nextGamePath) {
      return location.state.nextGamePath;
    }
    
    // Fallback: find next game from game data
    try {
      const games = getBrainKidsGames({});
      const currentGame = games.find(g => g.id === gameId);
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return nextGame ? nextGame.path : null;
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return null;
  }, [location.state, gameId]);
  
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
  {
    id: 1,
    text: "Create/select a poster for someone who feels nervous before a performance.",
    options: [
      
      { 
        id: "rush-fast", 
        text: "Rush through quickly", 
        emoji: "🏃‍♂️", 
        icon: <Waves className="w-6 h-6" />,
        isCorrect: false
      },
      { 
        id: "panic-loud", 
        text: "Shout and panic", 
        emoji: "😱", 
        icon: <Music className="w-6 h-6" />,
        isCorrect: false
      },
      { 
        id: "deep-breaths", 
        text: "Take deep breaths", 
        emoji: "💨", 
        icon: <Wind className="w-6 h-6" />,
        isCorrect: true
      },
    ]
  },
  {
    id: 2,
    text: "Choose a poster for staying relaxed during homework stress.",
    options: [
      { 
        id: "tiny-steps", 
        text: "Handle one step at a time", 
        emoji: "📄", 
        icon: <Flower className="w-6 h-6" />,
        isCorrect: true
      },
      { 
        id: "rush-all", 
        text: "Finish everything at once", 
        emoji: "⚡", 
        icon: <Wind className="w-6 h-6" />,
        isCorrect: false
      },
      { 
        id: "ignore-work", 
        text: "Leave homework for later", 
        emoji: "🕐", 
        icon: <Music className="w-6 h-6" />,
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "Pick the poster idea for calming down before a sports match.",
    options: [
      
      { 
        id: "rush-aggressive", 
        text: "Play as fast as possible", 
        emoji: "🏃‍♂️", 
        icon: <Waves className="w-6 h-6" />,
        isCorrect: false
      },
      { 
        id: "complain-loud", 
        text: "Argue with teammates", 
        emoji: "🗣️", 
        icon: <Music className="w-6 h-6" />,
        isCorrect: false
      },
      { 
        id: "visualize-success", 
        text: "Imagine winning calmly", 
        emoji: "🏅", 
        icon: <Wind className="w-6 h-6" />,
        isCorrect: true
      },
    ]
  },
  {
    id: 4,
    text: "Select a poster for staying peaceful during a noisy day at school.",
    options: [
      
      { 
        id: "yell-back", 
        text: "Shout back at everyone", 
        emoji: "😤", 
        icon: <Waves className="w-6 h-6" />,
        isCorrect: false
      },
      { 
        id: "mindful-breaks", 
        text: "Take short mindful breaks", 
        emoji: "🧘", 
        icon: <Flower className="w-6 h-6" />,
        isCorrect: true
      },
      { 
        id: "ignore-friends", 
        text: "Ignore everyone", 
        emoji: "🙈", 
        icon: <Music className="w-6 h-6" />,
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "Pick a poster for staying cool while waiting for a turn in a game.",
    options: [
      { 
        id: "slow-count", 
        text: "Count slowly and breathe", 
        emoji: "🌿", 
        icon: <Flower className="w-6 h-6" />,
        isCorrect: true
      },
      { 
        id: "rush-others", 
        text: "Push to go first", 
        emoji: "🏃‍♂️", 
        icon: <Waves className="w-6 h-6" />,
        isCorrect: false
      },
      { 
        id: "complain-loud", 
        text: "Complain loudly", 
        emoji: "📢", 
        icon: <Music className="w-6 h-6" />,
        isCorrect: false
      }
    ]
  }
];


  const handleChoice = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Poster: Stay Cool"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Poster Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="brain"
      backPath="/games/brain-health/kids"
      nextGamePath={nextGamePath}
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
                    <div className="flex items-center justify-center mb-3">
                      <div className="text-3xl mr-3">{option.emoji}</div>
                      <div className="text-white">{option.icon}</div>
                    </div>
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

export default StayCoolPoster;
