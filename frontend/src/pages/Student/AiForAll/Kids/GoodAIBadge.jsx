import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { Brain, Zap, Target, Trophy, Star } from 'lucide-react';

const GoodAIBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-kids-98";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      title: "Safe AI Usage",
      description: "Show you use AI safely!",
      icon: <Brain className="w-8 h-8" />,
      color: "bg-blue-500",
      question: "How should you help someone use AI safely?",
      options: [
        { 
          text: "By teaching safe practices and being helpful", 
          emoji: "🤝", 
          isCorrect: true
        },
        { 
          text: "By ignoring safety rules", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "By sharing private information", 
          emoji: "🔓", 
          isCorrect: false
        },
        { 
          text: "By using AI without thinking", 
          emoji: "😴", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Learning with AI",
      description: "Prove you use AI for learning!",
      icon: <Zap className="w-8 h-8" />,
      color: "bg-yellow-500",
      question: "How do you use AI for learning new skills?",
      options: [
        { 
          text: "By using AI tools to practice and learn", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          text: "By never learning anything", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "By only copying answers", 
          emoji: "📋", 
          isCorrect: false
        },
        { 
          text: "By avoiding all learning", 
          emoji: "🙈", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Privacy Respect",
      description: "Demonstrate your privacy knowledge!",
      icon: <Target className="w-8 h-8" />,
      color: "bg-green-500",
      question: "How do you respect privacy while using AI?",
      options: [
        { 
          text: "By sharing everything publicly", 
          emoji: "📢", 
          isCorrect: false
        },
        { 
          text: "By protecting personal information and being careful", 
          emoji: "🔒", 
          isCorrect: true
        },
        { 
          text: "By ignoring privacy completely", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "By sharing passwords", 
          emoji: "🔓", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Responsible AI",
      description: "Master responsible AI usage!",
      icon: <Trophy className="w-8 h-8" />,
      color: "bg-purple-500",
      question: "How do you use AI responsibly?",
      options: [
        { 
          text: "By trusting everything AI says", 
          emoji: "🤖", 
          isCorrect: false
        },
        { 
          text: "By never checking AI outputs", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "By ignoring all rules", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "By checking outputs, following rules, and promoting fairness", 
          emoji: "⚖️", 
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      title: "Good AI Hero",
      description: "Final challenge to earn your badge!",
      icon: <Star className="w-8 h-8" />,
      color: "bg-gradient-to-r from-yellow-400 to-orange-500",
      question: "What makes someone a Good AI Hero?",
      options: [
        { 
          text: "Never using AI at all", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Using AI unsafely", 
          emoji: "⚠️", 
          isCorrect: false
        },
        { 
          text: "Ignoring all safety rules", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Using AI safely, responsibly, and creatively", 
          emoji: "🎨", 
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
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
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
    }, 1500);
  };

  // Log when game completes
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Good AI Badge game completed! Score: ${score}/${challenges.length}, gameId: ${gameId}`);
    }
  }, [showResult, score, gameId, challenges.length]);

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: Good AI"
      score={coins}
      currentLevel={challenge + 1}
      totalLevels={challenges.length}
      subtitle={showResult ? "Game Complete!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/kids/future-imagination-journal"
      nextGameIdProp="ai-kids-99"
      gameType="ai"
      showGameOver={showResult}
      maxScore={challenges.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult && currentChallenge ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Challenge {challenge + 1}/{challenges.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Score: {score}/{challenges.length}</span>
              </div>
              
              <div className="text-center mb-4 md:mb-6">
                <div className={`inline-block p-3 md:p-4 rounded-full ${currentChallenge.color} mb-3 md:mb-4`}>
                  {currentChallenge.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">{currentChallenge.title}</h3>
                <p className="text-white/80 text-sm md:text-base mb-4">{currentChallenge.description}</p>
              </div>
              
              <p className="text-white text-base md:text-lg lg:text-xl mb-4 md:mb-6 text-center">
                {currentChallenge.question}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {currentChallenge.options.map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const showCorrect = answered && option.isCorrect;
                  const showIncorrect = answered && isSelected && !option.isCorrect;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      disabled={answered}
                      className={`p-4 md:p-6 rounded-xl md:rounded-2xl transition-all transform text-left ${
                        showCorrect
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 border-2 border-green-300 scale-105"
                          : showIncorrect
                          ? "bg-gradient-to-r from-red-500 to-red-600 border-2 border-red-300"
                          : isSelected
                          ? "bg-gradient-to-r from-blue-600 to-cyan-700 border-2 border-blue-300 scale-105"
                          : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 border-2 border-transparent hover:scale-105"
                      } disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl md:text-3xl">{option.emoji}</span>
                        <div className="text-white font-bold text-sm md:text-base">{option.text}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20 text-center flex-1 flex flex-col justify-center">
            <div className="text-4xl md:text-5xl mb-4">🏆</div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Badge Earned!</h3>
            <p className="text-white/90 text-base md:text-lg mb-4">
              You completed {score} out of {challenges.length} challenges!
            </p>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default GoodAIBadge;


