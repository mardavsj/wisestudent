import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgePathExplorerKid = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-kids-60";
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
      title: "Career Planning",
      question: "What's an important factor when choosing a career path?",
      options: [
        { 
          text: "Only what pays the most money", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          text: "Only what your friends are doing", 
          emoji: "👥", 
          isCorrect: false
        },
        { 
          text: "Your interests, skills, and values", 
          emoji: "🎯", 
          isCorrect: true
        },
        { 
          text: "What sounds easiest", 
          emoji: "😴", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Personal interests, skills, and values are key factors!",
        wrong: "The most important factors when choosing a career are your interests, skills, and values."
      }
    },
    {
      id: 2,
      title: "Path Exploration",
      question: "Why is it important to explore different paths?",
      options: [
        { 
          text: "To copy others exactly", 
          emoji: "📋", 
          isCorrect: false
        },
        { 
          text: "To avoid making decisions", 
          emoji: "🤔", 
          isCorrect: false
        },
        
        { 
          text: "To waste time", 
          emoji: "⏰", 
          isCorrect: false
        },
        { 
          text: "To find what fits you best", 
          emoji: "🔍", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Exactly! Exploration helps you find your best fit!",
        wrong: "Exploring different paths helps you discover what fits you best."
      }
    },
    {
      id: 3,
      title: "Vocational Training",
      question: "What's a benefit of vocational training?",
      options: [
        { 
          text: "No need to work hard", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "Practical skills for specific careers", 
          emoji: "🔧", 
          isCorrect: true
        },
        { 
          text: "Automatic success", 
          emoji: "🚀", 
          isCorrect: false
        },
        
        { 
          text: "Free money without work", 
          emoji: "💸", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Vocational training provides practical, job-specific skills!",
        wrong: "Vocational training offers practical skills that are directly applicable to specific careers."
      }
    },
    {
      id: 4,
      title: "Apprenticeships",
      question: "How can apprenticeships benefit someone?",
      options: [
        { 
          text: "Free money without work", 
          emoji: "💸", 
          isCorrect: false
        },
        { 
          text: "Avoiding all responsibilities", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "Paid learning with mentorship", 
          emoji: "👨‍🏫", 
          isCorrect: true
        },
        { 
          text: "Instant expertise", 
          emoji: "🎓", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Apprenticeships offer paid learning with mentorship!",
        wrong: "Apprenticeships provide paid learning opportunities along with mentorship from experienced professionals."
      }
    },
    {
      id: 5,
      title: "Future Preparation",
      question: "What should you do to prepare for your future path?",
      options: [
        { 
          text: "Explore options and build skills", 
          emoji: "🛠️", 
          isCorrect: true
        },
        { 
          text: "Wait for opportunities to come", 
          emoji: "⏳", 
          isCorrect: false
        },
        { 
          text: "Only focus on one option", 
          emoji: "👁️‍🗨️", 
          isCorrect: false
        },
        
        { 
          text: "Copy what celebrities do", 
          emoji: "🌟", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Exploring options and building skills prepares you well!",
        wrong: "Preparing for your future involves exploring various options and actively building relevant skills."
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
      title="Badge: Path Explorer Kid"
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
    
      nextGamePathProp="/student/ehe/kids/college-story-61"
      nextGameIdProp="ehe-kids-61">
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
                <h3 className="text-3xl font-bold text-white mb-4">Path Explorer Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong career planning knowledge with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Path Explorer Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Career Awareness</h4>
                    <p className="text-white/90 text-sm">
                      You understand important factors in career selection and the value of exploration.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Future Planning</h4>
                    <p className="text-white/90 text-sm">
                      You know how to prepare for your future through skills development and pathway exploration.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Exploring Paths!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review career planning concepts to strengthen your knowledge and earn your badge.
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

export default BadgePathExplorerKid;