import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeSocialHelperKid = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-kids-90";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      title: "Social Entrepreneurship",
      question: "What is social entrepreneurship?",
      options: [
        { 
          text: "Only making money", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          text: "Government work", 
          emoji: "🏛️", 
          isCorrect: false
        },
        
        { 
          text: "Working for free", 
          emoji: "🆓", 
          isCorrect: false
        },
        { 
          text: "Business for social good", 
          emoji: "🤝", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Perfect! Using business methods to solve social problems!",
        wrong: "Social entrepreneurship uses business strategies to create positive social impact."
      }
    },
    {
      id: 2,
      title: "Food Waste Reduction",
      question: "Why is reducing food waste important?",
      options: [
        { 
          text: "Helps environment and people", 
          emoji: "🌍", 
          isCorrect: true
        },
        { 
          text: "Only saves money", 
          emoji: "💸", 
          isCorrect: false
        },
        { 
          text: "Makes more garbage", 
          emoji: "🗑️", 
          isCorrect: false
        },
        
        { 
          text: "Creates more work", 
          emoji: "💼", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Reduces environmental impact and helps those in need!",
        wrong: "Reducing food waste helps both the environment and people in need by conserving resources."
      }
    },
    {
      id: 3,
      title: "Eco-Friendly Alternatives",
      question: "What are eco-friendly alternatives to plastic?",
      options: [
        { 
          text: "More plastic bags", 
          emoji: "🛍️", 
          isCorrect: false
        },
        { 
          text: "Throwing them away", 
          emoji: "🗑️", 
          isCorrect: false
        },
        { 
          text: "Cloth, jute, paper bags", 
          emoji: "🌿", 
          isCorrect: true
        },
        { 
          text: "Burning them", 
          emoji: "🔥", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! These materials are biodegradable and reusable!",
        wrong: "Eco-friendly alternatives to plastic include cloth, jute, and paper bags that are biodegradable."
      }
    },
    {
      id: 4,
      title: "Solar Energy Benefits",
      question: "How does solar energy help villages?",
      options: [
        { 
          text: "Only looks nice", 
          emoji: "✨", 
          isCorrect: false
        },
        { 
          text: "Provides clean, renewable power", 
          emoji: "💡", 
          isCorrect: true
        },
        { 
          text: "Makes noise", 
          emoji: "🔊", 
          isCorrect: false
        },
        
        { 
          text: "Uses fossil fuels", 
          emoji: "⛽", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Solar energy enables education and economic activities!",
        wrong: "Solar energy provides clean, renewable power that can transform village communities."
      }
    },
    {
      id: 5,
      title: "Ethical Business Practices",
      question: "What makes a business ethical?",
      options: [
        { 
          text: "Only high profits", 
          emoji: "📈", 
          isCorrect: false
        },
        { 
          text: "Ignoring problems", 
          emoji: "🙈", 
          isCorrect: false
        },
        
        { 
          text: "Secret operations", 
          emoji: "㊙️", 
          isCorrect: false
        },
        { 
          text: "Fair treatment and transparency", 
          emoji: "⚖️", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Perfect! Ethical businesses treat everyone fairly and honestly!",
        wrong: "Ethical businesses practice fair treatment, transparency, and responsible operations."
      }
    }
  ];

  const handleAnswer = (isCorrect, optionIndex) => {
    if (answered) return;
    
    setAnswered(true);
    setSelectedAnswer(optionIndex);
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
    }, 2000);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setChallenge(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    resetFeedback();
  };

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: Social Helper Kid"
      subtitle={showResult ? "Game Complete!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      gameType="ehe"
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ehe/kids"
    
      nextGamePathProp="/student/ehe/kids/book-story"
      nextGameIdProp="ehe-kids-91">
      <div className="space-y-8">
        {!showResult && currentChallenge ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-2">{currentChallenge.title}</h3>
              <p className="text-white text-lg mb-6">
                {currentChallenge.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentChallenge.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option.isCorrect, idx)}
                    disabled={answered}
                    className={`bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3 ${
                      answered && selectedAnswer === idx
                        ? option.isCorrect
                          ? "ring-4 ring-green-400"
                          : "ring-4 ring-red-400"
                        : ""
                    }`}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="font-bold text-lg">{option.text}</span>
                  </button>
                ))}
              </div>
              
              {answered && (
                <div className={`mt-4 p-4 rounded-xl ${
                  currentChallenge.options[selectedAnswer]?.isCorrect
                    ? "bg-green-500/20 border border-green-500/30"
                    : "bg-red-500/20 border border-red-500/30"
                }`}>
                  <p className="text-white font-semibold">
                    {currentChallenge.options[selectedAnswer]?.isCorrect
                      ? currentChallenge.feedback.correct
                      : currentChallenge.feedback.wrong}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 4 ? (
              <div>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-4">Social Helper Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong knowledge of social entrepreneurship with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Social Helper Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Social Impact</h4>
                    <p className="text-white/90 text-sm">
                      You understand how businesses can create positive change in society and the environment.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Ethical Practices</h4>
                    <p className="text-white/90 text-sm">
                      You know the importance of fairness, transparency, and sustainability in business.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    window.location.href = "/games/ehe/kids";
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Helping Society!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review social entrepreneurship concepts to strengthen your knowledge and earn your badge.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeSocialHelperKid;