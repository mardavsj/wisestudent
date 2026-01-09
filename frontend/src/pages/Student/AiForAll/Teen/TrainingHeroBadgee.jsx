import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TrainingHeroBadgee = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-75";
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
      title: "AI Training Concepts",
      question: "What is the primary goal when training an AI model?",
      options: [
        
        { 
          text: "To make the model as complex as possible", 
          emoji: "🤯", 
          isCorrect: false
        },
        { 
          text: "To use all available computational resources", 
          emoji: "⚙️", 
          isCorrect: false
        },
        { 
          text: "To enable the model to make accurate predictions on new data", 
          emoji: "🎯", 
          isCorrect: true
        },
        { 
          text: "To eliminate all human oversight", 
          emoji: "🤖", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! The ultimate goal is generalization - making accurate predictions on unseen data!",
        wrong: "While complexity and computational resources are considerations, the primary goal is predictive accuracy on new data."
      }
    },
    {
      id: 2,
      title: "Bias in AI",
      question: "Which approach helps reduce bias in AI training data?",
      options: [
        { 
          text: "Ensuring diverse and representative datasets", 
          emoji: "📊", 
          isCorrect: true
        },
        { 
          text: "Using data from a single source", 
          emoji: "📈", 
          isCorrect: false
        },
        { 
          text: "Increasing dataset size without diversity", 
          emoji: "📈", 
          isCorrect: false
        },
        { 
          text: "Removing all sensitive attributes", 
          emoji: "🙈", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Correct! Diversity and representation in training data are key to reducing algorithmic bias!",
        wrong: "Simply removing sensitive attributes doesn't eliminate bias; diverse, representative data is more effective."
      }
    },
    {
      id: 3,
      title: "Overfitting Prevention",
      question: "Which technique is commonly used to prevent overfitting?",
      options: [
        
        { 
          text: "Increasing model complexity", 
          emoji: "⬆️", 
          isCorrect: false
        },
        { 
          text: "Using all data for training", 
          emoji: "📚", 
          isCorrect: false
        },
        { 
          text: "Cross-validation", 
          emoji: "🔄", 
          isCorrect: true
        },
        { 
          text: "Reducing training iterations", 
          emoji: "⏪", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Right! Cross-validation helps assess model generalization and prevents overfitting!",
        wrong: "Cross-validation evaluates model performance on multiple data subsets to ensure robust generalization."
      }
    },
    {
      id: 4,
      title: "Data Quality",
      question: "Why is data preprocessing important in AI training?",
      options: [
        
        { 
          text: "It makes datasets larger", 
          emoji: "📦", 
          isCorrect: false
        },
        { 
          text: "It speeds up model training", 
          emoji: "⚡", 
          isCorrect: false
        },
        { 
          text: "It eliminates the need for validation", 
          emoji: "❌", 
          isCorrect: false
        },
        { 
          text: "It ensures data consistency and removes noise", 
          emoji: "🧹", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Perfect! Preprocessing cleans data, handles missing values, and ensures consistency for better training!",
        wrong: "Preprocessing focuses on data quality and consistency, which directly impacts model performance."
      }
    },
    {
      id: 5,
      title: "Model Evaluation",
      question: "What does a confusion matrix primarily show?",
      options: [
       
        { 
          text: "Training time for different models", 
          emoji: "⏱️", 
          isCorrect: false
        },
         { 
          text: "Predictions vs actual outcomes for classification", 
          emoji: "📊", 
          isCorrect: true
        },
        { 
          text: "Cost of computational resources", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          text: "Data storage requirements", 
          emoji: "💾", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! A confusion matrix displays prediction accuracy by comparing predicted vs actual classifications!",
        wrong: "A confusion matrix is a table used to evaluate classification model performance by showing prediction results."
      }
    },
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
      title="Badge: Training Hero"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/teen/good-ai-vs-bad-ai-quiz"
      nextGameIdProp="ai-teen-76"
      gameType="ai"
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 8}
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
            {score >= 8 ? (
              <div>
                <div className="text-6xl mb-4">🏅</div>
                <h3 className="text-3xl font-bold text-white mb-4">Training Hero Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  Outstanding! You demonstrated expert knowledge with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Training Hero</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">AI Training Mastery</h4>
                    <p className="text-white/90 text-sm">
                      You understand advanced concepts including bias reduction, overfitting prevention, and continuous learning.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Ethical Development</h4>
                    <p className="text-white/90 text-sm">
                      You recognize the importance of ethical considerations and responsible AI development practices.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    // Navigate to next game path
                    window.location.href = "/student/ai-for-all/teen/good-ai-vs-bad-ai-quiz";
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Training!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review concepts of bias reduction, model evaluation, feature engineering, and ethical AI development.
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

export default TrainingHeroBadgee;