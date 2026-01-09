import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeTeenChangemaker = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-teen-90";
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
      question: "What distinguishes social entrepreneurship from traditional business?",
      options: [
        { 
          text: "Focus on profit maximization only", 
          emoji: "💰", 
          isCorrect: false
        },
       
        { 
          text: "Operating without any business model", 
          emoji: "❌", 
          isCorrect: false
        },
        { 
          text: "Avoiding all forms of innovation", 
          emoji: "🚫", 
          isCorrect: false
        },
         { 
          text: "Prioritizing social impact alongside financial sustainability", 
          emoji: "🌍", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Exactly! Social entrepreneurship prioritizes social impact alongside financial sustainability!",
        wrong: "Social entrepreneurship distinguishes itself by prioritizing social impact alongside financial sustainability."
      }
    },
    {
      id: 2,
      title: "Community Problems",
      question: "Which approach is most effective for identifying social problems?",
      options: [
        { 
          text: "Engaging directly with affected communities", 
          emoji: "👥", 
          isCorrect: true
        },
        { 
          text: "Ignoring community feedback completely", 
          emoji: "🔇", 
          isCorrect: false
        },
        
        { 
          text: "Copying solutions from other regions without adaptation", 
          emoji: "📋", 
          isCorrect: false
        },
        { 
          text: "Focusing only on visible urban issues", 
          emoji: "🏙️", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Engaging directly with affected communities is the most effective approach!",
        wrong: "The most effective approach is engaging directly with affected communities to understand their needs."
      }
    },
    {
      id: 3,
      title: "Changemakers",
      question: "What common trait do successful social changemakers share?",
      options: [
        { 
          text: "Working alone without collaboration", 
          emoji: "🤝", 
          isCorrect: false
        },
        
        { 
          text: "Seeking immediate fame and recognition", 
          emoji: "🌟", 
          isCorrect: false
        },
        { 
          text: "Persistent commitment to their cause", 
          emoji: "💪", 
          isCorrect: true
        },
        { 
          text: "Avoiding difficult conversations", 
          emoji: "🫣", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Successful changemakers share persistent commitment to their cause!",
        wrong: "Successful social changemakers commonly share persistent commitment to their cause despite challenges."
      }
    },
    {
      id: 4,
      title: "Responsible Decisions",
      question: "What principle should guide responsible business decisions?",
      options: [
        { 
          text: "Maximizing short-term profits only", 
          emoji: "📈", 
          isCorrect: false
        },
        { 
          text: "Balancing stakeholder interests ethically", 
          emoji: "⚖️", 
          isCorrect: true
        },
        { 
          text: "Ignoring environmental consequences", 
          emoji: "🌍", 
          isCorrect: false
        },
        { 
          text: "Prioritizing speed over quality", 
          emoji: "🚀", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Responsible decisions balance stakeholder interests ethically!",
        wrong: "Responsible business decisions should balance stakeholder interests ethically rather than focusing only on profits."
      }
    },
    {
      id: 5,
      title: "Impact Planning",
      question: "What is essential for measuring social impact effectively?",
      options: [
        { 
          text: "Setting vague goals without metrics", 
          emoji: "🎯", 
          isCorrect: false
        },
        { 
          text: "Establishing clear goals and measurement methods", 
          emoji: "📊", 
          isCorrect: true
        },
        { 
          text: "Focusing only on inputs, not outcomes", 
          emoji: "ℹ️", 
          isCorrect: false
        },
        { 
          text: "Avoiding feedback from beneficiaries", 
          emoji: "💬", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Effective impact measurement requires clear goals and appropriate methods!",
        wrong: "Measuring social impact effectively requires establishing clear goals and appropriate measurement methods."
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
      title="Badge: Teen Changemaker"
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
    
      nextGamePathProp="/student/ehe/teens/skill-upgrade-story"
      nextGameIdProp="ehe-teen-91">
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
                <h3 className="text-3xl font-bold text-white mb-4">Teen Changemaker Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong social entrepreneurship knowledge with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Teen Changemaker</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Social Impact</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to identify community problems and create sustainable solutions.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Responsible Leadership</h4>
                    <p className="text-white/90 text-sm">
                      You know how to make ethical decisions and measure meaningful impact.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Making a Difference!</h3>
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

export default BadgeTeenChangemaker;