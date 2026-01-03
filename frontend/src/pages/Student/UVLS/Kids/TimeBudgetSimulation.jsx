import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsKidsGames } from '../../../../pages/Games/GameCategories/UVLS/kidGamesData';

const TimeBudgetSimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-98");
  const gameId = gameData?.id || "uvls-kids-98";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for TimeBudgetSimulation, using fallback ID");
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
      const games = getUvlsKidsGames({});
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
  
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const challenges = [
  {
    id: 1,
    title: "Morning Prep",
    question: "You wake up with 90 minutes before school. How should you spend your time?",
    options: [
      
      { 
        text: "Play video games immediately - Skip morning hygiene", 
        emoji: "🎮", 
        isCorrect: false
      },
      { 
        text: "Sleep more - Ignore school prep", 
        emoji: "😴", 
        isCorrect: false
      },
      { 
        text: "Just pack bag - Skip breakfast and hygiene", 
        emoji: "🎒", 
        isCorrect: false
      },
      { 
        text: "Brush teeth, wash face, eat breakfast, pack bag - Good start for a productive day", 
        emoji: "🧼", 
        isCorrect: true
      },
    ]
  },
  {
    id: 2,
    title: "Homework Planning",
    question: "You have 1.5 hours to do homework. What’s the best plan?",
    options: [
      { 
        text: "Finish hardest subjects first, take short breaks, then do easy subjects - Balanced and focused", 
        emoji: "📚", 
        isCorrect: true
      },
      { 
        text: "Do all subjects at random without breaks - Confusing and tiring", 
        emoji: "🌀", 
        isCorrect: false
      },
      { 
        text: "Play first, then do all homework in last 10 minutes - Stressful and rushed", 
        emoji: "⏳", 
        isCorrect: false
      },
      { 
        text: "Skip homework - Relax instead", 
        emoji: "😎", 
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    title: "After School Snack",
    question: "You have 30 minutes after school. How can you spend it wisely?",
    options: [
      
      { 
        text: "Skip snack and watch TV - Might feel hungry and tired", 
        emoji: "📺", 
        isCorrect: false
      },
      { 
        text: "Play outside without eating - Risk low energy", 
        emoji: "⚽", 
        isCorrect: false
      },
      { 
        text: "Have a healthy snack, wash hands, relax for a few minutes - Good self-care", 
        emoji: "🍎", 
        isCorrect: true
      },
      { 
        text: "Sleep immediately - Miss opportunity to recharge properly", 
        emoji: "😴", 
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    title: "Weekend Chores",
    question: "You have 2 hours to help at home. How can you manage time smartly?",
    options: [
      
      { 
        text: "Play first, then ignore chores - Leaves tasks unfinished", 
        emoji: "🎮", 
        isCorrect: false
      },
      { 
        text: "Do chores first, then play and rest - Complete responsibilities before fun", 
        emoji: "🧹", 
        isCorrect: true
      },
      { 
        text: "Do chores slowly and take long breaks - Not efficient", 
        emoji: "🐢", 
        isCorrect: false
      },
      { 
        text: "Skip chores - Relax all the time", 
        emoji: "🛋️", 
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    title: "Evening Routine",
    question: "You have 1 hour before bedtime. How can you spend your time wisely?",
    options: [
      { 
        text: "Read a book, prepare school bag, wash up - Balanced learning and rest", 
        emoji: "📖", 
        isCorrect: true
      },
      { 
        text: "Watch TV or phone all the time - Skip rest and preparation", 
        emoji: "📱", 
        isCorrect: false
      },
      { 
        text: "Skip washing up and sleep - Poor hygiene", 
        emoji: "🛁", 
        isCorrect: false
      },
      { 
        text: "Play games until bedtime - Disturbs sleep schedule", 
        emoji: "🎮", 
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
    
    const isLastChallenge = challenge === challenges.length - 1;
    
    setTimeout(() => {
      if (isLastChallenge) {
        setShowResult(true);
      } else {
        setChallenge(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setChallenge(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    resetFeedback();
  };

  const handleNext = () => {
    if (nextGamePath) {
      navigate(nextGamePath);
    } else {
      navigate("/games/uvls/kids");
    }
  };

  return (
    <GameShell
      title="Time Budget Simulation"
      score={score}
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Simulation Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="uvls"
      totalLevels={challenges.length}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8">
        {!showResult && challenges[challenge] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Challenge {challenge + 1}/{challenges.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{challenges.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{challenges[challenge].title}</h3>
              <p className="text-white text-lg mb-6">
                {challenges[challenge].question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges[challenge].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedAnswer(index);
                      handleChoice(option.isCorrect);
                    }}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-left transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : selectedAnswer === index
                          ? "bg-red-500/20 border-4 border-red-400 ring-4 ring-red-400"
                          : "bg-white/5 border-2 border-white/20 opacity-50"
                        : "bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="text-white font-semibold">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Time Budget Simulation Complete!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct!
                  You understand how to manage your time well!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Good time management involves balancing study, play, rest, helping at home, and preparing for tomorrow. A well-structured day includes time for all important activities.
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct.
                  Remember: Good time management requires balancing all activities!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Consider how to balance study, play, rest, and responsibilities!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TimeBudgetSimulation;