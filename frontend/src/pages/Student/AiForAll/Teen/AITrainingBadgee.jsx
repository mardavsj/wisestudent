import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const AITrainingBadgee = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-60";
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
      title: "AI Training Fundamentals",
      question: "What is the primary purpose of training an AI model?",
      options: [
        { 
          text: "To teach the model to recognize patterns in data", 
          emoji: "📈", 
          isCorrect: true
        },
        { 
          text: "To make the model as complex as possible", 
          emoji: "🤯", 
          isCorrect: false
        },
        { 
          text: "To reduce the amount of data used", 
          emoji: "📉", 
          isCorrect: false
        },
        { 
          text: "To eliminate all human oversight", 
          emoji: "🤖", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Training helps AI models learn patterns and relationships in data to make accurate predictions!",
        wrong: "The goal of training is to enable pattern recognition, not necessarily to increase complexity or eliminate human involvement."
      }
    },
    {
      id: 2,
      title: "Dataset Quality",
      question: "Why is data quality crucial for AI training?",
      options: [
        
        { 
          text: "More data is always better regardless of quality", 
          emoji: "📦", 
          isCorrect: false
        },
        { 
          text: "Quality only matters for images, not text", 
          emoji: "🖼️", 
          isCorrect: false
        },
        { 
          text: "Data quality affects processing speed only", 
          emoji: "⚡", 
          isCorrect: false
        },
        { 
          text: "Poor quality data leads to unreliable AI performance", 
          emoji: "⚠️", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Correct! The saying 'garbage in, garbage out' applies perfectly to AI - quality data is essential for reliable models!",
        wrong: "High-quality, representative data is far more important than quantity alone for effective AI training."
      }
    },
    {
      id: 3,
      title: "Training Process",
      question: "What does the term 'overfitting' mean in AI training?",
      options: [
        
        { 
          text: "Model trains too slowly", 
          emoji: "⏳", 
          isCorrect: false
        },
        { 
          text: "Model uses too little data", 
          emoji: "📉", 
          isCorrect: false
        },
        { 
          text: "Model memorizes training data but fails on new data", 
          emoji: "🧠", 
          isCorrect: true
        },
        { 
          text: "Model requires too much computing power", 
          emoji: "🔋", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Right! Overfitting occurs when a model learns training data too well, losing ability to generalize!",
        wrong: "Overfitting specifically refers to a model's inability to generalize to new, unseen data despite good performance on training data."
      }
    },
    {
      id: 4,
      title: "Model Evaluation",
      question: "Which metric is commonly used to evaluate classification AI models?",
      options: [
       
        { 
          text: "Color intensity", 
          emoji: "🌈", 
          isCorrect: false
        },
         { 
          text: "Accuracy", 
          emoji: "🎯", 
          isCorrect: true
        },
        { 
          text: "File size", 
          emoji: "💾", 
          isCorrect: false
        },
        { 
          text: "Internet speed", 
          emoji: "🌐", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Accuracy measures the percentage of correct predictions, a fundamental evaluation metric!",
        wrong: "While other metrics exist for specific purposes, accuracy is the most common baseline for classification models."
      }
    },
    {
      id: 5,
      title: "Continuous Learning",
      question: "Why is continuous retraining important for AI models?",
      options: [
       
        { 
          text: "Retraining uses less computational resources", 
          emoji: "🔋", 
          isCorrect: false
        },
        { 
          text: "Old models stop working after a fixed period", 
          emoji: "⏰", 
          isCorrect: false
        },
         { 
          text: "Data patterns and real-world conditions change over time", 
          emoji: "🔄", 
          isCorrect: true
        },
        { 
          text: "Retraining is only needed for marketing purposes", 
          emoji: "📢", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Concept drift means models need ongoing updates to maintain effectiveness in changing environments!",
        wrong: "Continuous retraining addresses the reality that data distributions and real-world conditions evolve over time."
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
      title="Badge: AI Training Expert"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/teen/dataset-builder-simulation"
      nextGameIdProp="ai-teen-61"
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
                <h3 className="text-3xl font-bold text-white mb-4">AI Training Expert Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated expert knowledge of AI training with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: AI Training Expert</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Training Mastery</h4>
                    <p className="text-white/90 text-sm">
                      You understand core concepts including data quality, overfitting, and model evaluation.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Continuous Improvement</h4>
                    <p className="text-white/90 text-sm">
                      You recognize the importance of ongoing model updates and adaptation to changing conditions.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    // Navigate to next game path
                    window.location.href = "/student/ai-for-all/teen/dataset-builder-simulation";
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
                  Review concepts of data quality, overfitting, model evaluation, and continuous learning to strengthen your expertise.
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

export default AITrainingBadgee;