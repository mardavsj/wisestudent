import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeTeenpreneur = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-teen-50";
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
      title: "Teen Entrepreneurs",
      question: "What common trait do successful teen entrepreneurs share?",
      options: [
        { 
          text: "They wait until adulthood to start businesses", 
          emoji: "⏳", 
          isCorrect: false
        },
        
        { 
          text: "They only focus on making money quickly", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          text: "They avoid taking any risks", 
          emoji: "🛡️", 
          isCorrect: false
        },
        { 
          text: "They identify problems and create solutions", 
          emoji: "🔍", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Exactly! Successful teen entrepreneurs identify problems and create innovative solutions!",
        wrong: "Successful teen entrepreneurs share the trait of identifying problems and creating solutions."
      }
    },
    {
      id: 2,
      title: "Problem Identification",
      question: "Which approach is most effective for finding business opportunities?",
      options: [
        { 
          text: "Observing daily frustrations and inefficiencies", 
          emoji: "👀", 
          isCorrect: true
        },
        { 
          text: "Copying existing businesses exactly", 
          emoji: "📋", 
          isCorrect: false
        },
        
        { 
          text: "Following trending social media topics only", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          text: "Choosing ideas randomly without research", 
          emoji: "🎲", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Observing daily frustrations and inefficiencies leads to genuine business opportunities!",
        wrong: "The most effective approach for finding business opportunities is observing daily frustrations and inefficiencies."
      }
    },
    {
      id: 3,
      title: "Business Ideas",
      question: "What is the most important aspect of a business idea?",
      options: [
        { 
          text: "Having the most advanced technology", 
          emoji: "🤖", 
          isCorrect: false
        },
        { 
          text: "Solving a real problem for customers", 
          emoji: "✅", 
          isCorrect: true
        },
        { 
          text: "Being the cheapest option available", 
          emoji: "🏷️", 
          isCorrect: false
        },
        { 
          text: "Looking impressive in presentations", 
          emoji: "🎭", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! The most important aspect is solving a real problem for customers!",
        wrong: "The most important aspect of a business idea is solving a real problem for customers."
      }
    },
    {
      id: 4,
      title: "Pitching Skills",
      question: "What is the primary goal of an effective business pitch?",
      options: [
        { 
          text: "Using complex vocabulary to impress listeners", 
          emoji: "🗣️", 
          isCorrect: false
        },
        
        { 
          text: "Talking for as long as possible", 
          emoji: "⏰", 
          isCorrect: false
        },
        { 
          text: "Clearly communicating value to potential supporters", 
          emoji: "💬", 
          isCorrect: true
        },
        { 
          text: "Avoiding any questions from the audience", 
          emoji: "🤫", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! The primary goal is clearly communicating value to potential supporters!",
        wrong: "The primary goal of an effective business pitch is clearly communicating value to potential supporters."
      }
    },
    {
      id: 5,
      title: "Entrepreneurial Skills",
      question: "Which skill is most essential for entrepreneurial success?",
      options: [
        { 
          text: "Adaptability to changing circumstances", 
          emoji: "🔄", 
          isCorrect: true
        },
        { 
          text: "Perfectionism in every detail", 
          emoji: "🎯", 
          isCorrect: false
        },
        
        { 
          text: "Working independently without any help", 
          emoji: "👤", 
          isCorrect: false
        },
        { 
          text: "Following established rules without question", 
          emoji: "📜", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Adaptability to changing circumstances is most essential for entrepreneurial success!",
        wrong: "The most essential skill for entrepreneurial success is adaptability to changing circumstances."
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
      title="Badge: Teenpreneur"
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
      backPath="/games/ehe/teens"
    
      nextGamePathProp="/student/ehe/teens/higher-education-story"
      nextGameIdProp="ehe-teen-51">
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
                <h3 className="text-3xl font-bold text-white mb-4">Teenpreneur Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong entrepreneurial knowledge with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Teenpreneur</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Business Fundamentals</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to identify problems, create solutions, and develop business ideas.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Entrepreneurial Skills</h4>
                    <p className="text-white/90 text-sm">
                      You know the importance of adaptability, communication, and customer-focused thinking.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    window.location.href = "/games/ehe/teens";
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Developing Your Entrepreneurial Spirit!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review entrepreneurial concepts to strengthen your knowledge and earn your badge.
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

export default BadgeTeenpreneur;