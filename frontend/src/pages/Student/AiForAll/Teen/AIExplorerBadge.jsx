import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const AIExplorerBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-50";
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
      title: "AI Applications",
      question: "Which of these is a common real-world application of AI today?",
      options: [
        
        { 
          text: "Manual bookkeeping", 
          emoji: "📚", 
          isCorrect: false
        },
        { 
          text: "Traditional farming", 
          emoji: "🌾", 
          isCorrect: false
        },
        { 
          text: "Handwritten letters", 
          emoji: "✉️", 
          isCorrect: false
        },
        { 
          text: "Medical diagnosis assistance", 
          emoji: "🏥", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Exactly! AI is widely used in healthcare to assist with medical diagnosis and treatment!",
        wrong: "AI excels in pattern recognition and data analysis, making medical diagnosis a perfect application."
      }
    },
    {
      id: 2,
      title: "AI in Daily Life",
      question: "Which everyday technology most likely uses AI algorithms?",
      options: [
        
        { 
          text: "Basic calculator", 
          emoji: "🔢", 
          isCorrect: false
        },
        { 
          text: "Email spam filtering", 
          emoji: "📧", 
          isCorrect: true
        },
        { 
          text: "Manual light switch", 
          emoji: "💡", 
          isCorrect: false
        },
        { 
          text: "Paper newspaper", 
          emoji: "📰", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Correct! Email providers use AI to automatically detect and filter spam messages!",
        wrong: "Spam filtering uses machine learning to identify suspicious patterns in emails automatically."
      }
    },
    {
      id: 3,
      title: "AI Exploration",
      question: "What is a key benefit of exploring AI technologies?",
      options: [
       
        { 
          text: "Eliminating all human jobs", 
          emoji: "👱", 
          isCorrect: false
        },
        { 
          text: "Creating unsolvable puzzles", 
          emoji: "🧩", 
          isCorrect: false
        },
         { 
          text: "Solving complex problems efficiently", 
          emoji: "🧩", 
          isCorrect: true
        },
        { 
          text: "Making technology more confusing", 
          emoji: "😵", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Right! AI helps us tackle complex challenges in healthcare, climate, and research!",
        wrong: "AI's purpose is to augment human capabilities, not eliminate jobs or create confusion."
      }
    },
    {
      id: 4,
      title: "AI Ethics",
      question: "Why is it important to explore AI responsibly?",
      options: [
        { 
          text: "To ensure technology benefits everyone fairly", 
          emoji: "⚖️", 
          isCorrect: true
        },
        { 
          text: "To make technology faster only", 
          emoji: "⚡", 
          isCorrect: false
        },
        { 
          text: "To reduce technology costs", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          text: "To limit who can use technology", 
          emoji: "🚫", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Responsible AI exploration ensures equitable benefits and prevents harm!",
        wrong: "While speed and cost matter, fairness and safety are paramount in AI development."
      }
    },
    {
      id: 5,
      title: "Future of AI",
      question: "What should be a focus when exploring future AI developments?",
      options: [
       
        { 
          text: "Maximum automation", 
          emoji: "🤖", 
          isCorrect: false
        },
        { 
          text: "Complexity for experts only", 
          emoji: "🤯", 
          isCorrect: false
        },
         { 
          text: "Transparency and explainability", 
          emoji: "🔍", 
          isCorrect: true
        },
        { 
          text: "Secrecy in development", 
          emoji: "🤫", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Transparent and explainable AI builds trust and enables responsible use!",
        wrong: "While automation has benefits, transparency and explainability are crucial for trustworthy AI."
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
      title="Badge: AI Explorer"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/teen/data-labeling-gamee"
      nextGameIdProp="ai-teen-51"
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
                <div className="text-6xl mb-4">🏅</div>
                <h3 className="text-3xl font-bold text-white mb-4">AI Explorer Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge of AI exploration with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: AI Explorer</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">AI Applications</h4>
                    <p className="text-white/90 text-sm">
                      You understand how AI is used in healthcare, email filtering, and daily life applications.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Responsible Exploration</h4>
                    <p className="text-white/90 text-sm">
                      You recognize the importance of ethical considerations and transparency in AI development.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    // Navigate to next game path
                    window.location.href = "/student/ai-for-all/teen/data-labeling-gamee";
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Exploring!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Continue learning about AI applications, ethics, and future developments to strengthen your knowledge.
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

export default AIExplorerBadge;