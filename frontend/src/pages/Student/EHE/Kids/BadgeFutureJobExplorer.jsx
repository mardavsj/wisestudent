import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeFutureJobExplorer = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-kids-80";
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
      title: "AI Engineering",
      question: "What is an AI Engineer?",
      options: [
        { 
          text: "Trains animals", 
          emoji: "🐶", 
          isCorrect: false
        },
        { 
          text: "Sells robots", 
          emoji: "🏪", 
          isCorrect: false
        },
        
        { 
          text: "Repairs computers", 
          emoji: "💻", 
          isCorrect: false
        },
        { 
          text: "Creates artificial intelligence systems", 
          emoji: "🤖", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Perfect! AI Engineers develop intelligent systems!",
        wrong: "AI Engineers specialize in creating artificial intelligence systems and technologies."
      }
    },
    {
      id: 2,
      title: "Green Energy Careers",
      question: "Why are green energy jobs important?",
      options: [
        { 
          text: "They help protect the environment", 
          emoji: "🌱", 
          isCorrect: true
        },
        { 
          text: "They pollute the air", 
          emoji: "💨", 
          isCorrect: false
        },
        { 
          text: "They're easy to get", 
          emoji: "😴", 
          isCorrect: false
        },
        
        { 
          text: "They pay the most money", 
          emoji: "💰", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Green energy jobs contribute to environmental protection!",
        wrong: "Green energy jobs are important because they help protect the environment and combat climate change."
      }
    },
    {
      id: 3,
      title: "Data Science",
      question: "What does a Data Scientist do?",
      options: [
        { 
          text: "Only plays with data", 
          emoji: "🎮", 
          isCorrect: false
        },
        { 
          text: "Cleans offices", 
          emoji: "🧹", 
          isCorrect: false
        },
        { 
          text: "Analyzes complex information", 
          emoji: "📊", 
          isCorrect: true
        },
        { 
          text: "Writes news articles", 
          emoji: "📰", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Data Scientists analyze large amounts of data!",
        wrong: "Data Scientists analyze complex information and data to find patterns and insights."
      }
    },
    {
      id: 4,
      title: "Drone Technology",
      question: "What is a Drone Pilot?",
      options: [
        { 
          text: "Drives cars", 
          emoji: "🚗", 
          isCorrect: false
        },
        { 
          text: "Sails boats", 
          emoji: "⛵", 
          isCorrect: false
        },
        
        { 
          text: "Flies commercial planes", 
          emoji: "✈️", 
          isCorrect: false
        },
        { 
          text: "Operates unmanned aircraft", 
          emoji: "🚁", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Exactly! Drone Pilots control flying robots!",
        wrong: "Drone Pilots operate unmanned aircraft (drones) for various purposes like photography, delivery, and surveillance."
      }
    },
    {
      id: 5,
      title: "Future Career Planning",
      question: "Why is it important to explore future careers?",
      options: [
        { 
          text: "To prepare for changing job markets", 
          emoji: "📈", 
          isCorrect: true
        },
        { 
          text: "To avoid all changes", 
          emoji: "🔒", 
          isCorrect: false
        },
        { 
          text: "To stick to old jobs only", 
          emoji: "🕰️", 
          isCorrect: false
        },
        
        { 
          text: "To copy what others are doing", 
          emoji: "📋", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Exploring helps you adapt to future opportunities!",
        wrong: "Exploring future careers helps you prepare for changing job markets and find opportunities that match your interests."
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
      title="Badge: Future Job Explorer"
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
    
      nextGamePathProp="/student/ehe/kids/food-waste-story"
      nextGameIdProp="ehe-kids-81">
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
                <h3 className="text-3xl font-bold text-white mb-4">Future Job Explorer Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong knowledge of emerging careers with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Future Job Explorer</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Emerging Careers</h4>
                    <p className="text-white/90 text-sm">
                      You understand important future careers like AI Engineering, Data Science, and Drone Piloting.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Future Planning</h4>
                    <p className="text-white/90 text-sm">
                      You know why it's important to explore future careers and prepare for changing job markets.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Exploring Careers!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review emerging career concepts to strengthen your knowledge and earn your badge.
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

export default BadgeFutureJobExplorer;