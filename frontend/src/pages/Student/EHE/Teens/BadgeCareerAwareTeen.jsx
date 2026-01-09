import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeCareerAwareTeen = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-teen-10";
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
      title: "Career Interests",
      question: "What is the most effective way to identify your career interests?",
      options: [
        { 
          text: "Choose a career based solely on salary potential", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          text: "Select the first career option you hear about", 
          emoji: "🎲", 
          isCorrect: false
        },
        { 
          text: "Reflect on activities that energize and engage you", 
          emoji: "🎯", 
          isCorrect: true
        },
        { 
          text: "Copy the career choices of your friends", 
          emoji: "👥", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Your career interests should align with activities that energize and engage you!",
        wrong: "The most effective way to identify career interests is to reflect on activities that energize and engage you."
      }
    },
    {
      id: 2,
      title: "Education Requirements",
      question: "Why is it important to research education requirements for careers?",
      options: [
        { 
          text: "To avoid any form of learning", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "To understand the investment needed for your chosen path", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          text: "To prove others wrong about your choices", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "To find the easiest educational route only", 
          emoji: "📉", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Researching education requirements helps you understand the investment needed for your chosen career path!",
        wrong: "Researching education requirements is important to understand the investment needed for your chosen career path."
      }
    },
    {
      id: 3,
      title: "Job Market Analysis",
      question: "What should you consider when evaluating job market opportunities?",
      options: [
        { 
          text: "Only current job availability without future trends", 
          emoji: "📅", 
          isCorrect: false
        },
        { 
          text: "Growth projections, salary ranges, and geographic distribution", 
          emoji: "📈", 
          isCorrect: true
        },
        { 
          text: "Only the highest paying jobs regardless of fit", 
          emoji: "💎", 
          isCorrect: false
        },
        { 
          text: "Jobs that require no specialized skills", 
          emoji: "🛠️", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Evaluating job market opportunities requires considering growth projections, salary ranges, and geographic distribution!",
        wrong: "When evaluating job market opportunities, consider growth projections, salary ranges, and geographic distribution."
      }
    },
    {
      id: 4,
      title: "Professional Networking",
      question: "How can connecting with career professionals benefit your planning?",
      options: [
        { 
          text: "To get them to find jobs for you directly", 
          emoji: "🏢", 
          isCorrect: false
        },
       
        { 
          text: "To impress them with your existing knowledge", 
          emoji: "📖", 
          isCorrect: false
        },
        { 
          text: "To avoid formal education requirements", 
          emoji: "🎓", 
          isCorrect: false
        },
         { 
          text: "To gain insights and advice about career paths", 
          emoji: "💡", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Perfect! Connecting with career professionals provides valuable insights and advice about career paths!",
        wrong: "Connecting with career professionals benefits your planning by providing insights and advice about career paths."
      }
    },
    {
      id: 5,
      title: "Career Planning",
      question: "What is essential for an effective career exploration plan?",
      options: [
        { 
          text: "Setting rigid goals with no flexibility", 
          emoji: "🔒", 
          isCorrect: false
        },
        
        { 
          text: "Copying someone else's career timeline exactly", 
          emoji: "📋", 
          isCorrect: false
        },
        { 
          text: "Including timelines, resources, and evaluation methods", 
          emoji: "📝", 
          isCorrect: true
        },
        { 
          text: "Focusing on short-term goals only", 
          emoji: "🥅", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! An effective career exploration plan includes timelines, resources, and evaluation methods!",
        wrong: "An effective career exploration plan should include timelines, resources, and evaluation methods."
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
      title="Badge: Career Aware Teen"
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
    
      nextGamePathProp="/student/ehe/teens/opportunity-story"
      nextGameIdProp="ehe-teen-11">
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
                <h3 className="text-3xl font-bold text-white mb-4">Career Aware Teen Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong career awareness with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Career Aware Teen</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Career Planning</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to identify interests, research requirements, and evaluate opportunities.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Professional Development</h4>
                    <p className="text-white/90 text-sm">
                      You know the importance of networking and creating effective exploration plans.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Exploring Careers!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review career awareness concepts to strengthen your knowledge and earn your badge.
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

export default BadgeCareerAwareTeen;