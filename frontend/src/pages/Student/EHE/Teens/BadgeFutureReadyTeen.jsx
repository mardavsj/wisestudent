import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeFutureReadyTeen = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-teen-80";
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
      title: "Future Career Awareness",
      question: "Which approach best prepares you for emerging career fields?",
      options: [
        { 
          text: "Developing adaptable skills and continuous learning habits", 
          emoji: "🌱", 
          isCorrect: true
        },
        { 
          text: "Focusing only on current popular jobs", 
          emoji: "📈", 
          isCorrect: false
        },
        
        { 
          text: "Avoiding technology and innovation", 
          emoji: "📴", 
          isCorrect: false
        },
        { 
          text: "Sticking to traditional career paths only", 
          emoji: "🏛️", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Developing adaptable skills and continuous learning habits prepares you for emerging fields!",
        wrong: "The best approach is developing adaptable skills and continuous learning habits for future careers."
      }
    },
    {
      id: 2,
      title: "Emerging Fields",
      question: "What characterizes most emerging career fields today?",
      options: [
        { 
          text: "They require no technical skills", 
          emoji: "❌", 
          isCorrect: false
        },
        { 
          text: "They integrate technology with traditional industries", 
          emoji: "🔌", 
          isCorrect: true
        },
        { 
          text: "They eliminate human interaction completely", 
          emoji: "🤖", 
          isCorrect: false
        },
        { 
          text: "They focus only on manual labor", 
          emoji: "🔨", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Emerging fields typically integrate technology with traditional industries!",
        wrong: "Most emerging career fields are characterized by integrating technology with traditional industries."
      }
    },
    {
      id: 3,
      title: "Future Skills",
      question: "Which skill set is most valuable for future career success?",
      options: [
        { 
          text: "Memorizing specific technical procedures", 
          emoji: "📖", 
          isCorrect: false
        },
       
        { 
          text: "Following instructions without question", 
          emoji: "⁉️", 
          isCorrect: false
        },
         { 
          text: "Critical thinking, creativity, and emotional intelligence", 
          emoji: "🧠", 
          isCorrect: true
        },
        { 
          text: "Working in isolation without collaboration", 
          emoji: "🤝", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Critical thinking, creativity, and emotional intelligence are most valuable for future success!",
        wrong: "The most valuable future skills are critical thinking, creativity, and emotional intelligence."
      }
    },
    {
      id: 4,
      title: "Readiness Decisions",
      question: "What is the most effective strategy for future career readiness?",
      options: [
        { 
          text: "Making rigid long-term plans that never change", 
          emoji: "🔒", 
          isCorrect: false
        },
        
        { 
          text: "Avoiding all career planning until graduation", 
          emoji: "⏳", 
          isCorrect: false
        },
        { 
          text: "Copying someone else's exact career path", 
          emoji: "📋", 
          isCorrect: false
        },
        { 
          text: "Building flexible plans with regular reassessment", 
          emoji: "🔄", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Perfect! Building flexible plans with regular reassessment is the most effective strategy!",
        wrong: "The most effective strategy is building flexible plans with regular reassessment for changing conditions."
      }
    },
    {
      id: 5,
      title: "Action Planning",
      question: "What should a comprehensive future career action plan include?",
      options: [
        { 
          text: "Only short-term goals without long-term vision", 
          emoji: "❌", 
          isCorrect: false
        },
        { 
          text: "Skill development, networking, and experiential learning", 
          emoji: "📅", 
          isCorrect: true
        },
        { 
          text: "Focusing on one industry without exploration", 
          emoji: "🔍", 
          isCorrect: false
        },
        { 
          text: "Avoiding mentorship and professional guidance", 
          emoji: "🚫", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! A comprehensive plan includes skill development, networking, and experiential learning!",
        wrong: "A comprehensive future career action plan should include skill development, networking, and experiential learning."
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
      title="Badge: Future Ready Teen"
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
    
      nextGamePathProp="/student/ehe/teens/social-business-story"
      nextGameIdProp="ehe-teen-81">
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
                <h3 className="text-3xl font-bold text-white mb-4">Future Ready Teen Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong future career readiness with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Future Ready Teen</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Career Awareness</h4>
                    <p className="text-white/90 text-sm">
                      You understand emerging fields and the importance of adaptable skills for future success.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Strategic Planning</h4>
                    <p className="text-white/90 text-sm">
                      You know how to create flexible plans and develop essential future-ready skills.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Preparing for the Future!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review future career concepts to strengthen your knowledge and earn your badge.
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

export default BadgeFutureReadyTeen;