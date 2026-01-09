import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeFutureEntrepreneur = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-teen-20";
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
      title: "Opportunity Recognition",
      question: "What is the most effective approach to identifying business opportunities?",
      options: [
        { 
          text: "Copy existing businesses without any improvements", 
          emoji: "📋", 
          isCorrect: false
        },
        { 
          text: "Focus only on high-tech solutions for all problems", 
          emoji: "💻", 
          isCorrect: false
        },
        { 
          text: "Observe unmet needs and pain points in daily life", 
          emoji: "🔍", 
          isCorrect: true
        },
        { 
          text: "Rely solely on others to suggest business ideas", 
          emoji: "👂", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Effective entrepreneurs observe unmet needs and pain points in daily life to identify opportunities!",
        wrong: "The most effective approach to identifying business opportunities is observing unmet needs and pain points in daily life."
      }
    },
    {
      id: 2,
      title: "Entrepreneurial Traits",
      question: "Which combination of traits is most essential for entrepreneurial success?",
      options: [
        { 
          text: "Perfectionism and risk avoidance", 
          emoji: "🛡️", 
          isCorrect: false
        },
        { 
          text: "Persistence, creativity, and adaptability", 
          emoji: "🌟", 
          isCorrect: true
        },
        { 
          text: "Independence and disregard for feedback", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Aggressiveness and competitiveness only", 
          emoji: "⚔️", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Successful entrepreneurs combine persistence, creativity, and adaptability to navigate challenges!",
        wrong: "The most essential entrepreneurial traits are persistence, creativity, and adaptability."
      }
    },
    {
      id: 3,
      title: "Leadership Behaviors",
      question: "What is the foundation of effective entrepreneurial leadership?",
      options: [
        { 
          text: "Micromanaging every team member's tasks", 
          emoji: "📋", 
          isCorrect: false
        },
        
        { 
          text: "Making all decisions without team input", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Focusing only on personal success metrics", 
          emoji: "🎯", 
          isCorrect: false
        },
        { 
          text: "Inspiring others toward shared vision and goals", 
          emoji: "👑", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Exactly! Effective entrepreneurial leadership inspires others toward shared vision and goals!",
        wrong: "The foundation of effective entrepreneurial leadership is inspiring others toward shared vision and goals."
      }
    },
    {
      id: 4,
      title: "Problem-Solving Techniques",
      question: "What approach leads to the most innovative solutions?",
      options: [
        { 
          text: "Breaking down problems and brainstorming diverse approaches", 
          emoji: "🧩", 
          isCorrect: true
        },
        { 
          text: "Applying the same solution to every problem", 
          emoji: "🔁", 
          isCorrect: false
        },
        
        { 
          text: "Rushing to implement the first idea that comes to mind", 
          emoji: "⚡", 
          isCorrect: false
        },
        
        { 
          text: "Avoiding complex problems entirely", 
          emoji: "🙅‍♂️", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Innovative solutions emerge from breaking down problems and brainstorming diverse approaches!",
        wrong: "The most innovative solutions come from breaking down problems and brainstorming diverse approaches."
      }
    },
    {
      id: 5,
      title: "Strength Assessment",
      question: "Why is self-awareness of strengths important for entrepreneurs?",
      options: [
        { 
          text: "To prove superiority over competitors", 
          emoji: "🏆", 
          isCorrect: false
        },
        { 
          text: "To identify areas for delegation and partnership", 
          emoji: "🤝", 
          isCorrect: true
        },
        { 
          text: "To avoid developing any new skills", 
          emoji: "🔒", 
          isCorrect: false
        },
        { 
          text: "To focus exclusively on weaknesses", 
          emoji: "❌", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Self-awareness helps entrepreneurs identify areas for delegation and partnership!",
        wrong: "Self-awareness of strengths is important for entrepreneurs to identify areas for delegation and partnership."
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
      title="Badge: Future Entrepreneur"
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
    
      nextGamePathProp="/student/ehe/teens/cost-story"
      nextGameIdProp="ehe-teen-21">
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
                <h3 className="text-3xl font-bold text-white mb-4">Future Entrepreneur Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong entrepreneurial knowledge with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Future Entrepreneur</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Entrepreneurial Mindset</h4>
                    <p className="text-white/90 text-sm">
                      You understand key traits like persistence, creativity, and adaptability for success.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Business Skills</h4>
                    <p className="text-white/90 text-sm">
                      You know how to identify opportunities, lead teams, and solve problems innovatively.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Developing Your Entrepreneurial Skills!</h3>
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

export default BadgeFutureEntrepreneur;