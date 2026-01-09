import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RecommendationSimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  
  const { showCorrectAnswerFeedback, flashPoints, showAnswerConfetti } = useGameFeedback();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const questions = [
    {
      id: 1,
      text: "What is the primary goal of a recommendation system?",
      options: [
        { 
          id: "advertise", 
          text: "Advertise products", 
          emoji: "📢", 
          
          isCorrect: false
        },
        { 
          id: "suggest", 
          text: "Suggest relevant content", 
          emoji: "🎯", 
          
          isCorrect: true
        },
        { 
          id: "collect", 
          text: "Collect user data", 
          emoji: "📊", 
          isCorrect: false
        },
        { 
          id: "entertain", 
          text: "Entertain users", 
          emoji: "🎭", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which approach recommends items based on similar users' preferences?",
      options: [
         { 
          id: "collaborative", 
          text: "Collaborative filtering", 
          emoji: "👥", 
          isCorrect: true
        },
        { 
          id: "content", 
          text: "Content-based filtering", 
          emoji: "📄", 
          isCorrect: false
        },
       
        { 
          id: "hybrid", 
          text: "Hybrid systems", 
          emoji: "🔄", 
          isCorrect: false
        },
        { 
          id: "demographic", 
          text: "Demographic filtering", 
          emoji: "👤", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What is a key advantage of recommendation systems for businesses?",
      options: [
        { 
          id: "cost", 
          text: "Reduced operational costs", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          id: "engagement", 
          text: "Increased user engagement", 
          emoji: "📈", 
          isCorrect: true
        },
        { 
          id: "simplicity", 
          text: "Simplified product design", 
          emoji: "✂️", 
          isCorrect: false
        },
        { 
          id: "storage", 
          text: "Reduced data storage needs", 
          emoji: "💾", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What is a potential drawback of recommendation systems?",
      options: [
        { 
          id: "accuracy", 
          text: "High accuracy in predictions", 
          emoji: "🎯", 
          isCorrect: false
        },
        { 
          id: "speed", 
          text: "Slow processing times", 
          emoji: "🐌", 
          isCorrect: false
        },
        { 
          id: "diversity", 
          text: "Limited exposure to diverse content", 
          emoji: "🌀", 
          isCorrect: true
        },
        
        { 
          id: "interface", 
          text: "Complex user interfaces", 
          emoji: "🧩", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Which technique analyzes item features to make recommendations?",
      options: [
        
        { 
          id: "content", 
          text: "Content-based filtering", 
          emoji: "📄", 
          isCorrect: true
        },
        { 
          id: "matrix", 
          text: "Matrix factorization", 
          emoji: "🔢", 
          isCorrect: false
        },
        { 
          id: "clustering", 
          text: "User clustering", 
          emoji: "⏹️", 
          isCorrect: false
        },
        { 
          id: "collaborative", 
          text: "Collaborative filtering", 
          emoji: "👥", 
          isCorrect: false
        },
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: selectedChoice,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleFinish = () => {
    navigate("/student/ai-for-all/teen/ai-everywhere-quiz");
  };

  return (
    <GameShell
      title="Recommendation Simulation"
      subtitle={showResult ? "Simulation Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleFinish}
      nextEnabled={showResult}
      nextGamePathProp="/student/ai-for-all/teen/ai-everywhere-quiz"
      nextGameIdProp="ai-teen-20"
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="ai-teen-19"
      gameType="ai"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore >= 3}
      backPath="/games/ai-for-all/teens"
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}>
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-4 md:mb-6 text-center">How AI Recommends Content</h3>
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
                <p className="text-base md:text-lg lg:text-xl font-semibold text-white text-center">"{getCurrentQuestion().text}"</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {getCurrentQuestion().options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
                  >
                    <div className="flex items-start">
                      <div className="text-2xl md:text-3xl mr-3">{option.emoji}</div>
                      <div>
                        <h5 className="font-bold text-white text-sm md:text-base mb-1">{option.text}</h5>
                        <p className="text-white/80 text-xs md:text-sm">{option.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20 text-center flex-1 flex flex-col justify-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-4xl md:text-5xl mb-4">🎉</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Excellent!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand how AI recommendation systems work!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  💡 Recommendation systems are everywhere! Netflix, YouTube, Spotify, Amazon - they all use 
                  AI to analyze your preferences and suggest content you'll love. These systems learn from 
                  millions of users to make smart predictions!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Recommendation systems use AI to analyze your preferences and suggest relevant content!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to focus on how recommendation systems analyze user preferences to suggest relevant content.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RecommendationSimulation;