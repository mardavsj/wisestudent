import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { Brain, Zap, Target, Trophy, Star } from 'lucide-react';

const TrainingHeroBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-kids-75";
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
      title: "AI Basics Quiz",
      description: "Show you've completed AI basics!",
      icon: <Brain className="w-8 h-8" />,
      color: "bg-blue-500",
      question: "What should you complete to learn AI basics?",
      options: [
        { 
          text: "AI Basics Quiz and learning games", 
          emoji: "🧠", 
          isCorrect: true
        },
        { 
          text: "Only watching videos", 
          emoji: "📺", 
          isCorrect: false
        },
        { 
          text: "Just reading books", 
          emoji: "📚", 
          isCorrect: false
        },
        { 
          text: "Only playing regular games", 
          emoji: "🎮", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Data Collection",
      description: "Prove you understand data collection!",
      icon: <Zap className="w-8 h-8" />,
      color: "bg-yellow-500",
      question: "How do you learn about data collection?",
      options: [
        { 
          text: "By playing Data Collector Game", 
          emoji: "📊", 
          isCorrect: true
        },
        { 
          text: "By ignoring data", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "By guessing randomly", 
          emoji: "🎲", 
          isCorrect: false
        },
        { 
          text: "By never collecting data", 
          emoji: "🚫", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Feedback Matters",
      description: "Demonstrate your feedback knowledge!",
      icon: <Target className="w-8 h-8" />,
      color: "bg-green-500",
      question: "Why does feedback matter in AI training?",
      options: [
        { 
          text: "Feedback helps AI learn and improve", 
          emoji: "🤖", 
          isCorrect: false
        },
        { 
          text: "Feedback helps AI learn and improve correctly", 
          emoji: "💡", 
          isCorrect: true
        },
        { 
          text: "Feedback doesn't matter", 
          emoji: "❌", 
          isCorrect: false
        },
        { 
          text: "AI never needs feedback", 
          emoji: "🚫", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Training Mastery",
      description: "Master AI training concepts!",
      icon: <Trophy className="w-8 h-8" />,
      color: "bg-purple-500",
      question: "What helps you become a training hero?",
      options: [
        { 
          text: "Only playing easy games", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "Avoiding all challenges", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Never learning new things", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Completing puzzles, quizzes, and training games", 
          emoji: "🎯", 
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      title: "Training Hero",
      description: "Final challenge to earn your badge!",
      icon: <Star className="w-8 h-8" />,
      color: "bg-gradient-to-r from-yellow-400 to-orange-500",
      question: "What makes someone a Training Hero?",
      options: [
        { 
          text: "Never completing any games", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Only playing one game", 
          emoji: "🎮", 
          isCorrect: false
        },
        { 
          text: "Avoiding all training", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Completing all AI training games and challenges", 
          emoji: "🏆", 
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
      console.log(`🎮 Training Hero Badge game completed! Score: ${score}/${challenges.length}, gameId: ${gameId}`);
    }
  }, [showResult, score, gameId, challenges.length]);

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: Training Hero"
      score={coins}
      currentLevel={challenge + 1}
      totalLevels={challenges.length}
      subtitle={showResult ? "Game Complete!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/kids/good-ai-vs-bad-ai-quiz"
      nextGameIdProp="ai-kids-76"
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

export default TrainingHeroBadge;


