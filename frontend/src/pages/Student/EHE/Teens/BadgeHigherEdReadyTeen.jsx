import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeHigherEdReadyTeen = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-teen-70";
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
      title: "Higher Education Streams",
      question: "Which higher education stream focuses primarily on theoretical knowledge and research?",
      options: [
        { 
          text: "Vocational Training", 
          emoji: "🔧", 
          isCorrect: false
        },
        { 
          text: "Liberal Arts College", 
          emoji: "🎨", 
          isCorrect: false
        },
        { 
          text: "University Research Program", 
          emoji: "🔬", 
          isCorrect: true
        },
        { 
          text: "Online Certification Course", 
          emoji: "💻", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! University research programs focus primarily on theoretical knowledge and research!",
        wrong: "University research programs focus primarily on theoretical knowledge and research rather than practical skills."
      }
    },
    {
      id: 2,
      title: "Field of Study",
      question: "What is the most important factor when choosing your field of study?",
      options: [
        { 
          text: "Choosing the shortest program available", 
          emoji: "⏱️", 
          isCorrect: false
        },
        { 
          text: "Aligning with your interests and career goals", 
          emoji: "🎯", 
          isCorrect: true
        },
        { 
          text: "Selecting based on peer pressure", 
          emoji: "👥", 
          isCorrect: false
        },
        { 
          text: "Picking randomly without research", 
          emoji: "🎲", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Aligning your field of study with interests and career goals leads to greater satisfaction!",
        wrong: "The most important factor is aligning your field of study with your interests and career goals."
      }
    },
    {
      id: 3,
      title: "Entrance Exams",
      question: "What is the primary purpose of standardized entrance exams?",
      options: [
        { 
          text: "To eliminate all qualified candidates", 
          emoji: "❌", 
          isCorrect: false
        },
        { 
          text: "To assess academic readiness and aptitude", 
          emoji: "📝", 
          isCorrect: true
        },
        { 
          text: "To favor wealthy applicants only", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          text: "To test unrelated life skills", 
          emoji: "🤷‍♂️", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Standardized entrance exams assess academic readiness and aptitude for higher education!",
        wrong: "The primary purpose of entrance exams is to assess academic readiness and aptitude for higher education."
      }
    },
    {
      id: 4,
      title: "Scholarship Opportunities",
      question: "Which approach maximizes your chances of securing scholarships?",
      options: [
        { 
          text: "Applying to only one scholarship opportunity", 
          emoji: "🎓", 
          isCorrect: false
        },
        
        { 
          text: "Waiting until the last minute to apply", 
          emoji: "⏰", 
          isCorrect: false
        },
        { 
          text: "Researching and applying to multiple relevant scholarships", 
          emoji: "🔍", 
          isCorrect: true
        },
        { 
          text: "Submitting incomplete applications", 
          emoji: "📄", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Researching and applying to multiple relevant scholarships maximizes your chances!",
        wrong: "The best approach is researching and applying to multiple relevant scholarships to maximize opportunities."
      }
    },
    {
      id: 5,
      title: "Preparation Planning",
      question: "What is essential for an effective higher education preparation plan?",
      options: [
        { 
          text: "Starting preparations only in the final year", 
          emoji: "📖", 
          isCorrect: false
        },
        
        { 
          text: "Focusing only on one aspect of preparation", 
          emoji: "🎯", 
          isCorrect: false
        },
        { 
          text: "Copying another student's exact plan", 
          emoji: "📋", 
          isCorrect: false
        },
        { 
          text: "Including academic, financial, and career planning", 
          emoji: "📅", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Exactly! Effective preparation includes academic, financial, and career planning components!",
        wrong: "An effective higher education preparation plan should include academic, financial, and career planning."
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
      title="Badge: Higher Ed Ready Teen"
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
    
      nextGamePathProp="/student/ehe/teens/green-energy-story"
      nextGameIdProp="ehe-teen-71">
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
                <h3 className="text-3xl font-bold text-white mb-4">Higher Ed Ready Teen Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong higher education readiness with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Higher Ed Ready Teen</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Academic Preparation</h4>
                    <p className="text-white/90 text-sm">
                      You understand higher education streams, field selection, and entrance exam requirements.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Financial Planning</h4>
                    <p className="text-white/90 text-sm">
                      You know how to research scholarships and create comprehensive preparation plans.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Preparing for Higher Education!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review higher education concepts to strengthen your knowledge and earn your badge.
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

export default BadgeHigherEdReadyTeen;