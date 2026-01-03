import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';
import { Heart, Zap, Award, Star, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const BadgeEmotionHero = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-50";
  const gameData = getGameDataById(gameId);
  
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
      const games = getBrainTeenGames({});
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
      title: "Emotional Resilience",
      description: "Handle emotional scenarios positively!",
      icon: <Heart className="w-8 h-8" />,
      color: "bg-pink-500",
      question: "You're being bullied. What's the positive response?",
      options: [
        { 
          text: "Report & stay strong", 
          emoji: "💪", 
          isCorrect: true
        },
        { 
          text: "Retaliate with violence", 
          emoji: "⚔️", 
          isCorrect: false
        },
        { 
          text: "Ignore and suffer silently", 
          emoji: "😔", 
          isCorrect: false
        },
        { 
          text: "Bully others in return", 
          emoji: "😠", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Sportsmanship",
      description: "Show positive emotional control!",
      icon: <Zap className="w-8 h-8" />,
      color: "bg-yellow-500",
      question: "You lost a game. What's the positive action?",
      options: [
        { 
          text: "Complain about unfairness", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Congratulate opponent", 
          emoji: "🏆", 
          isCorrect: true
        },
        { 
          text: "Blame teammates", 
          emoji: "👉", 
          isCorrect: false
        },
        { 
          text: "Quit the team", 
          emoji: "🚪", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Emotional Support",
      description: "Demonstrate empathy and care!",
      icon: <Award className="w-8 h-8" />,
      color: "bg-blue-500",
      question: "You're having a sad day. What's the positive action?",
      options: [
        { 
          text: "Isolate completely", 
          emoji: "🚶‍♂️", 
          isCorrect: false
        },
        { 
          text: "Suppress all feelings", 
          emoji: "😐", 
          isCorrect: false
        },
        { 
          text: "Take it out on others", 
          emoji: "😡", 
          isCorrect: false
        },
        { 
          text: "Talk to a loved one", 
          emoji: "❤️", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      title: "Joy Sharing",
      description: "Spread positive emotions!",
      icon: <Star className="w-8 h-8" />,
      color: "bg-green-500",
      question: "You have exciting news. How should you share it?",
      options: [
        { 
          text: "Keep it to yourself only", 
          emoji: "😊", 
          isCorrect: false
        },
        { 
          text: "Brag excessively", 
          emoji: "😎", 
          isCorrect: false
        },
        { 
          text: "Make others feel bad", 
          emoji: "😏", 
          isCorrect: false
        },
        { 
          text: "Share with others and include them", 
          emoji: "👥", 
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      title: "Conflict Resolution",
      description: "Master emotional intelligence!",
      icon: <Trophy className="w-8 h-8" />,
      color: "bg-purple-500",
      question: "You're in a conflict. What's the positive approach?",
      options: [
        { 
          text: "Win at all costs", 
          emoji: "🏆", 
          isCorrect: false
        },
        { 
          text: "Refuse to talk", 
          emoji: "🤐", 
          isCorrect: false
        },
        { 
          text: "Escalate the conflict", 
          emoji: "🔥", 
          isCorrect: false
        },
        { 
          text: "Listen & compromise", 
          emoji: "👂", 
          isCorrect: true
        }
      ]
    }
  ];

  const handleAnswer = (option) => {
    if (answered) return;
    
    setAnswered(true);
    setSelectedAnswer(option);
    resetFeedback();
    
    if (option.isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (challenge < challenges.length - 1) {
        setChallenge(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Badge: Emotion Hero game completed! Score: ${score}/${challenges.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId, challenges.length]);

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: Emotion Hero"
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Earned!"}
      score={score}
      currentLevel={challenge + 1}
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      maxScore={challenges.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="brain"
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8 max-w-4xl mx-auto px-4">
        {!showResult && currentChallenge ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
              <span className="text-white/80 text-sm md:text-base">Challenge {challenge + 1}/{challenges.length}</span>
              <span className="text-yellow-400 font-bold text-sm md:text-base">Score: {score}/{challenges.length}</span>
            </div>
            
            <div className={`${currentChallenge.color} rounded-xl p-4 md:p-6 mb-6 text-center`}>
              <div className="flex justify-center mb-3">
                {currentChallenge.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{currentChallenge.title}</h3>
              <p className="text-white/90 text-sm md:text-base">{currentChallenge.description}</p>
            </div>
            
            <p className="text-white text-lg md:text-xl mb-6 text-center">
              {currentChallenge.question}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentChallenge.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const showCorrect = answered && option.isCorrect;
                const showIncorrect = answered && isSelected && !option.isCorrect;
                
                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    whileHover={!answered ? { scale: 1.02 } : {}}
                    whileTap={!answered ? { scale: 0.98 } : {}}
                    className={`p-4 md:p-6 rounded-xl transition-all text-left ${
                      showCorrect
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 border-2 border-green-300"
                        : showIncorrect
                        ? "bg-gradient-to-r from-red-500 to-red-600 border-2 border-red-300"
                        : isSelected
                        ? "bg-gradient-to-r from-blue-600 to-cyan-700 border-2 border-blue-300"
                        : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 border-2 border-transparent"
                    } disabled:opacity-70 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl md:text-3xl">{option.emoji}</span>
                      <span className="text-white font-bold text-sm md:text-base">{option.text}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ) : showResult ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20 text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              className="text-6xl md:text-7xl mb-4"
            >
              🏆
            </motion.div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Emotion Hero Badge Earned!</h3>
            <p className="text-white/90 text-base md:text-lg mb-6">
              You've demonstrated excellent emotional intelligence by handling {score} out of {challenges.length} scenarios positively!
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
              {challenges.map((ch, idx) => (
                <div key={idx} className={`${ch.color} rounded-lg p-3 text-center`}>
                  {ch.icon}
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default BadgeEmotionHero;
