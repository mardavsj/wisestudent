import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeYoungInnovator = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-kids-20";
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
      title: "Creative Thinking",
      question: "Which skill helps you come up with new ideas?",
      options: [
        { 
          text: "Copying others exactly", 
          emoji: "📋", 
          isCorrect: false
        },
        { 
          text: "Creativity", 
          emoji: "💡", 
          isCorrect: true
        },
        { 
          text: "Avoiding challenges", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Following rules blindly", 
          emoji: "🤖", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Correct! Creativity is essential for innovation!",
        wrong: "Creativity is the ability to come up with new and original ideas."
      }
    },
    {
      id: 2,
      title: "Problem Solving",
      question: "What should you do when you face a problem?",
      options: [
        { 
          text: "Blame others for your problems", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Give up immediately", 
          emoji: "🏳️", 
          isCorrect: false
        },
        { 
          text: "Think of different solutions", 
          emoji: "🤔", 
          isCorrect: true
        },
        { 
          text: "Ignore the problem", 
          emoji: "🙈", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Problem-solving is key to innovation!",
        wrong: "Thinking of different solutions helps you overcome challenges creatively."
      }
    },
    {
      id: 3,
      title: "Improvement Skills",
      question: "How can you improve an existing idea?",
      options: [
         { 
          text: "Build upon it with new features", 
          emoji: "🔧", 
          isCorrect: true
        },
        { 
          text: "Destroy the original idea", 
          emoji: "💣", 
          isCorrect: false
        },
        { 
          text: "Never change anything", 
          emoji: "🔒", 
          isCorrect: false
        },
       
        { 
          text: "Forget about it completely", 
          emoji: "🗑️", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Innovation often improves existing ideas!",
        wrong: "Building upon existing ideas with new features is a key innovation strategy."
      }
    },
    {
      id: 4,
      title: "Collaboration",
      question: "Why is teamwork important for innovation?",
      options: [
        { 
          text: "To copy what other teams are doing", 
          emoji: "📸", 
          isCorrect: false
        },
        { 
          text: "To let one person do all the work", 
          emoji: "👤", 
          isCorrect: false
        },
        
        { 
          text: "To compete against each other", 
          emoji: "⚔️", 
          isCorrect: false
        },
        { 
          text: "To combine different skills and perspectives", 
          emoji: "🤝", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Perfect! Diverse perspectives fuel innovation!",
        wrong: "Combining different skills and perspectives leads to more creative solutions."
      }
    },
    {
      id: 5,
      title: "Learning from Failure",
      question: "What's the best way to learn from failure?",
      options: [
        { 
          text: "Never try anything new again", 
          emoji: "🛡️", 
          isCorrect: false
        },
        { 
          text: "Hide your mistakes from everyone", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Analyze what went wrong and improve", 
          emoji: "📈", 
          isCorrect: true
        },
        { 
          text: "Blame others for your mistakes", 
          emoji: "😤", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Learning from failure drives innovation!",
        wrong: "Analyzing failures helps us understand what went wrong and how to improve."
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
      title="Badge: Young Innovator"
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
    
      nextGamePathProp="/student/ehe/kids/lemonade-stand-story"
      nextGameIdProp="ehe-kids-21">
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
                <h3 className="text-3xl font-bold text-white mb-4">Young Innovator Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong innovation skills with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Young Innovator</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Creative Thinking</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to generate new ideas and think outside the box.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Problem Solving</h4>
                    <p className="text-white/90 text-sm">
                      You know how to approach challenges with innovative solutions.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Innovating!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review the innovation concepts to strengthen your knowledge and earn your badge.
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

export default BadgeYoungInnovator;