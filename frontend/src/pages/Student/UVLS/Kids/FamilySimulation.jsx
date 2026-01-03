import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsKidsGames } from '../../../../pages/Games/GameCategories/UVLS/kidGamesData';

const FamilySimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-78");
  const gameId = gameData?.id || "uvls-kids-78";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for FamilySimulation, using fallback ID");
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
      title: "Family Chores",
      question: "Your family needs to assign chores fairly. What's the best approach?",
      options: [
        { 
          text: "Let everyone choose their own chores - Each person picks what they want to do", 
          emoji: "🤔", 
          isCorrect: false
        },
        { 
          text: "Rotate chores weekly - Everyone takes turns with different tasks", 
          emoji: "🔄", 
          isCorrect: true
        },
        { 
          text: "Assign hardest chores to youngest - Children should do most work", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          text: "Only parents do chores - Kids shouldn't have responsibilities", 
          emoji: "👨‍👩‍👧", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Family Meeting",
      question: "Your family has disagreements about weekend plans. How should you handle it?",
      options: [
        { 
          text: "Vote on the plans - Each family member gets a say", 
          emoji: "🗳️", 
          isCorrect: true
        },
        { 
          text: "Let the oldest person decide - Age determines authority", 
          emoji: "👴", 
          isCorrect: false
        },
        
        { 
          text: "Ignore the disagreements - Avoid discussing problems", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Let one person decide for everyone - Dictate the plans", 
          emoji: "😤", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Family Responsibilities",
      question: "How should family responsibilities be shared in your home?",
      options: [
        
        { 
          text: "Parents do everything - Adults should handle all tasks", 
          emoji: "👨‍👩‍👧", 
          isCorrect: false
        },
        { 
          text: "Rotate all tasks monthly - Change responsibilities every month", 
          emoji: "📅", 
          isCorrect: false
        },
        { 
          text: "Let each person skip responsibilities - No one needs to help", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "Each person does what they're best at - Use individual strengths", 
          emoji: "💪", 
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      title: "Family Time",
      question: "How can your family spend quality time together?",
      options: [
        { 
          text: "Each person does their own activity - Everyone does separate things", 
          emoji: "📱", 
          isCorrect: false
        },
        
        { 
          text: "Only spend time when forced - Only be together when necessary", 
          emoji: "😔", 
          isCorrect: false
        },
        { 
          text: "Plan regular family activities - Schedule time together", 
          emoji: "📅", 
          isCorrect: true
        },
        { 
          text: "Let technology connect us - Use screens while together", 
          emoji: "💻", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Family Support",
      question: "How should family members support each other during difficult times?",
      options: [
        { 
          text: "Keep problems to yourself - Don't burden others", 
          emoji: "🤐", 
          isCorrect: false
        },
        { 
          text: "Listen and offer help - Be there for each other", 
          emoji: "💝", 
          isCorrect: true
        },
        { 
          text: "Let others figure it out alone - Everyone handles problems independently", 
          emoji: "🚶", 
          isCorrect: false
        },
        { 
          text: "Avoid discussing problems - Pretend everything is fine", 
          emoji: "🙂", 
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
      title="Family Simulation"
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
                <h3 className="text-2xl font-bold text-white mb-4">Family Simulation Complete!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct!
                  You understand how to handle family situations well!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Good family dynamics involve fair chore sharing, democratic decision-making, shared responsibilities, quality time together, and mutual support during difficult times.
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct.
                  Remember: Good family relationships require effort from everyone!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Consider how each family member can contribute and feel valued!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FamilySimulation;