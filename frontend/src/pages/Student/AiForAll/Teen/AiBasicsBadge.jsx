import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const AiBasicsBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-25";
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
      title: "AI Fundamentals",
      question: "What is the primary goal of Artificial Intelligence?",
      options: [
        
        { 
          text: "To replace all human workers", 
          emoji: "👥", 
          isCorrect: false
        },
        { 
          text: "To develop advanced video games", 
          emoji: "🎮", 
          isCorrect: false
        },
        { 
          text: "To control the internet", 
          emoji: "🌐", 
          isCorrect: false
        },
        { 
          text: "To create machines that can perform tasks requiring human intelligence", 
          emoji: "🤖", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Exactly! AI aims to create systems that can perform tasks requiring human-like intelligence!",
        wrong: "AI's goal isn't to replace humans entirely, but to augment and assist human capabilities."
      }
    },
    {
      id: 2,
      title: "Machine Learning",
      question: "Which technique allows AI systems to learn from data without explicit programming?",
      options: [
        { 
          text: "Machine Learning", 
          emoji: "📈", 
          isCorrect: true
        },
        { 
          text: "Manual Coding", 
          emoji: "⌨️", 
          isCorrect: false
        },
        { 
          text: "Rule-based Systems", 
          emoji: "📋", 
          isCorrect: false
        },
        { 
          text: "Random Guessing", 
          emoji: "🎲", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Correct! Machine Learning enables systems to learn patterns from data automatically!",
        wrong: "Machine Learning is the key technique that allows AI to learn from data without being explicitly programmed."
      }
    },
    {
      id: 3,
      title: "Neural Networks",
      question: "What is the primary inspiration behind artificial neural networks?",
      options: [
        
        { 
          text: "Computer Processors", 
          emoji: "💻", 
          isCorrect: false
        },
        { 
          text: "Human Brain Structure", 
          emoji: "🧠", 
          isCorrect: true
        },
        { 
          text: "Telephone Networks", 
          emoji: "📞", 
          isCorrect: false
        },
        { 
          text: "Transportation Systems", 
          emoji: "🚗", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Right! Neural networks are inspired by the structure and function of biological neural networks!",
        wrong: "Artificial neural networks are modeled after the human brain's interconnected neuron structure."
      }
    },
    {
      id: 4,
      title: "AI Applications",
      question: "Which of these is NOT typically considered a core application of AI?",
      options: [
        { 
          text: "Natural Language Processing", 
          emoji: "💬", 
          isCorrect: false
        },
        { 
          text: "Image Recognition", 
          emoji: "👁️", 
          isCorrect: false
        },
        { 
          text: "Manual Data Entry", 
          emoji: "📝", 
          isCorrect: true
        },
        { 
          text: "Predictive Analytics", 
          emoji: "🔮", 
          isCorrect: false
        },
        
      ],
      feedback: {
        correct: "Exactly! Manual data entry is repetitive work, not a core AI application!",
        wrong: "NLP, image recognition, and predictive analytics are all major AI applications. Manual data entry is not."
      }
    },
    {
      id: 5,
      title: "Ethical AI",
      question: "Why is ethical consideration crucial in AI development?",
      options: [
        { 
          text: "To ensure AI benefits society and avoids harm", 
          emoji: "⚖️", 
          isCorrect: true
        },
        { 
          text: "To make AI faster", 
          emoji: "⚡", 
          isCorrect: false
        },
        { 
          text: "To reduce development costs", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          text: "To increase data storage", 
          emoji: "💾", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Ethical AI ensures technology serves humanity positively and responsibly!",
        wrong: "While speed and cost matter, ethics is fundamental to ensure AI benefits society without causing harm."
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
      title="Badge: AI Basics"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/teen/smart-maps-story"
      nextGameIdProp="ai-teen-26"
      gameType="ai"
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
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
                    className={`bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3 ${
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
                <h3 className="text-3xl font-bold text-white mb-4">AI Basics Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong knowledge of AI fundamentals with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: AI Basics Expert</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">AI Knowledge</h4>
                    <p className="text-white/90 text-sm">
                      You understand core AI concepts including machine learning, neural networks, and applications.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Responsible Innovation</h4>
                    <p className="text-white/90 text-sm">
                      You recognize the importance of ethical considerations in AI development and deployment.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    // Navigate to next game path
                    window.location.href = "/student/ai-for-all/teens/smart-maps-story";
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review the concepts of AI fundamentals, machine learning, and ethical considerations to strengthen your knowledge.
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

export default AiBasicsBadge;