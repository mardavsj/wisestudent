import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeTeenInnovator = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-teen-40";
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
      title: "Empathy in Innovation",
      question: "Why is empathy crucial in the design thinking process?",
      options: [
        { 
          text: "To focus only on technical specifications", 
          emoji: "⚙️", 
          isCorrect: false
        },
        { 
          text: "To understand user needs and pain points deeply", 
          emoji: "❤️", 
          isCorrect: true
        },
        { 
          text: "To copy existing solutions exactly", 
          emoji: "📋", 
          isCorrect: false
        },
        { 
          text: "To reduce the number of team members", 
          emoji: "👥", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Empathy helps innovators deeply understand user needs and pain points!",
        wrong: "Empathy is crucial in design thinking because it helps us deeply understand user needs and pain points."
      }
    },
    {
      id: 2,
      title: "Design Thinking Stages",
      question: "What is the correct order of the design thinking stages?",
      options: [
        { 
          text: "Ideate, Prototype, Test, Empathize, Define", 
          emoji: "🔀", 
          isCorrect: false
        },
        
        { 
          text: "Test, Ideate, Define, Prototype, Empathize", 
          emoji: "🔁", 
          isCorrect: false
        },
        { 
          text: "Define, Ideate, Prototype, Test, Empathize", 
          emoji: "🔄", 
          isCorrect: false
        },
        { 
          text: "Empathize, Define, Ideate, Prototype, Test", 
          emoji: "🔄", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Perfect! The design thinking process follows: Empathize, Define, Ideate, Prototype, Test!",
        wrong: "The correct order of design thinking stages is: Empathize, Define, Ideate, Prototype, Test."
      }
    },
    {
      id: 3,
      title: "Creative Idea Generation",
      question: "Which technique is most effective for generating creative ideas?",
      options: [
        { 
          text: "Focusing on only one obvious solution", 
          emoji: "🔍", 
          isCorrect: false
        },
       
        { 
          text: "Rejecting all unconventional ideas immediately", 
          emoji: "❌", 
          isCorrect: false
        },
         { 
          text: "Brainstorming with quantity over quality initially", 
          emoji: "💡", 
          isCorrect: true
        },
        { 
          text: "Copying successful ideas from competitors only", 
          emoji: "📋", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Brainstorming with emphasis on quantity initially leads to more creative solutions!",
        wrong: "The most effective technique for generating creative ideas is brainstorming with quantity over quality initially."
      }
    },
    {
      id: 4,
      title: "Prototyping Principles",
      question: "What is the primary purpose of creating simple prototypes?",
      options: [
        { 
          text: "To test ideas quickly and inexpensively", 
          emoji: "🛠️", 
          isCorrect: true
        },
        { 
          text: "To create perfect final products immediately", 
          emoji: "🏆", 
          isCorrect: false
        },
        
        { 
          text: "To showcase elaborate designs to investors", 
          emoji: "💼", 
          isCorrect: false
        },
        { 
          text: "To avoid getting feedback from users", 
          emoji: "🤫", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Simple prototypes help test ideas quickly and inexpensively!",
        wrong: "The primary purpose of creating simple prototypes is to test ideas quickly and inexpensively."
      }
    },
    {
      id: 5,
      title: "Iteration Process",
      question: "Why is iteration important in the innovation process?",
      options: [
        { 
          text: "To stick to the original idea regardless of feedback", 
          emoji: "🔒", 
          isCorrect: false
        },
       
        { 
          text: "To complete projects as quickly as possible", 
          emoji: "⏱️", 
          isCorrect: false
        },
        { 
          text: "To avoid collaboration with team members", 
          emoji: "👤", 
          isCorrect: false
        },
         { 
          text: "To refine solutions based on user feedback and testing", 
          emoji: "🔁", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Exactly! Iteration helps refine solutions based on user feedback and testing!",
        wrong: "Iteration is important because it helps refine solutions based on user feedback and testing."
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
      title="Badge: Teen Innovator"
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
    
      nextGamePathProp="/student/ehe/teens/app-builder-story"
      nextGameIdProp="ehe-teen-41">
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
                <h3 className="text-3xl font-bold text-white mb-4">Teen Innovator Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong innovation skills with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Teen Innovator</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Design Thinking</h4>
                    <p className="text-white/90 text-sm">
                      You understand the five stages of design thinking and their importance in innovation.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Creative Problem Solving</h4>
                    <p className="text-white/90 text-sm">
                      You know how to generate ideas, prototype solutions, and iterate based on feedback.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Innovating!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review innovation concepts to strengthen your knowledge and earn your badge.
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

export default BadgeTeenInnovator;